import React from 'react';
import Link from 'next/link';

export default function CodaV3() {
  return (
    <section className="v3-coda" aria-labelledby="coda-title">
      <span className="v3-coda-stars" aria-hidden="true" />
      <div className="v3-shell">
        <div className="v3-coda-inner">
          <span className="v3-coda-seal" aria-hidden="true">
            <svg viewBox="0 0 100 100" focusable="false">
              <circle cx="50" cy="50" r="46" />
              <circle cx="50" cy="50" r="39" opacity="0.45" />
              <path
                className="v3-seal-draw"
                d="M14 50c14-22 24 22 36 0s22 22 36 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="v3-coda-monogram">SI</span>
          </span>

          <h2 className="v3-coda-line" id="coda-title">
            The thread ends here.
          </h2>

          <Link href="/contact" className="v3-coda-close">
            <span>Start a conversation</span>
            <span aria-hidden="true">→</span>
          </Link>

          <p className="v3-coda-note">Let&rsquo;s build something reliable.</p>
        </div>
      </div>
    </section>
  );
}
