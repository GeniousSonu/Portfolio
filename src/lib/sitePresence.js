import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getOrCreateVisitorId } from '@/lib/visitorId';

/**
 * Sitewide Realtime Presence Manager
 * 
 * - Skips automated/headless browsers (navigator.webdriver check)
 * - Keys presence on persistent visitor_id so multi-tab viewing counts as 1 unique live visitor
 * - Manages clean untracking on pagehide/beforeunload for prompt mobile decrement
 */

let activeChannel = null;
let subscriberCount = 0;
let currentLiveCount = 1;
const listeners = new Set();

function notifyListeners(count) {
  currentLiveCount = count;
  for (const listener of listeners) {
    try {
      listener(count);
    } catch (e) {}
  }
}

function computeUniqueLiveCount(channel) {
  if (!channel) return 1;
  const state = channel.presenceState();
  // State keys are keyed by visitor_id, so Object.keys(state).length gives unique visitors
  const uniqueKeys = Object.keys(state);
  return Math.max(1, uniqueKeys.length);
}

function startPresence() {
  if (typeof window === 'undefined') return;

  // Bot & Headless Browser Mitigation
  if (typeof navigator !== 'undefined' && navigator.webdriver === true) {
    return;
  }

  const visitorId = getOrCreateVisitorId() || 'anon_' + Math.random().toString(36).slice(2, 10);

  if (activeChannel) return;

  try {
    const channel = supabase.channel('site-presence', {
      config: {
        presence: { key: visitorId },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const count = computeUniqueLiveCount(channel);
      notifyListeners(count);
    });

    channel.on('presence', { event: 'join' }, () => {
      const count = computeUniqueLiveCount(channel);
      notifyListeners(count);
    });

    channel.on('presence', { event: 'leave' }, () => {
      const count = computeUniqueLiveCount(channel);
      notifyListeners(count);
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          await channel.track({
            online_at: new Date().toISOString(),
          });
        } catch (e) {}
      }
    });

    // Mobile backgrounding and tab close handlers
    const handleLeave = () => {
      try {
        if (channel) {
          channel.untrack();
        }
      } catch (e) {}
    };

    window.addEventListener('pagehide', handleLeave);
    window.addEventListener('beforeunload', handleLeave);

    activeChannel = channel;
  } catch (err) {
    console.warn('[SitePresence] Realtime initialization bypassed:', err.message);
  }
}

function stopPresence() {
  if (subscriberCount <= 0 && activeChannel) {
    try {
      activeChannel.untrack();
      supabase.removeChannel(activeChannel);
    } catch (e) {}
    activeChannel = null;
  }
}

export function useSitePresence() {
  const [liveCount, setLiveCount] = useState(currentLiveCount);

  useEffect(() => {
    subscriberCount++;
    if (subscriberCount === 1) {
      startPresence();
    }

    const listener = (count) => {
      setLiveCount(count);
    };

    listeners.add(listener);
    setLiveCount(currentLiveCount);

    return () => {
      listeners.delete(listener);
      subscriberCount--;
      if (subscriberCount <= 0) {
        // Debounce channel teardown to avoid thrashing during Next.js page transitions
        setTimeout(() => {
          if (subscriberCount <= 0) {
            stopPresence();
          }
        }, 1500);
      }
    };
  }, []);

  return liveCount;
}
