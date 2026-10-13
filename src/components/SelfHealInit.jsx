'use client';

import { useEffect } from 'react';
import { initSelfHealing } from '@/lib/selfHeal';

export default function SelfHealInit() {
  useEffect(() => {
    initSelfHealing();
  }, []);

  return null;
}
