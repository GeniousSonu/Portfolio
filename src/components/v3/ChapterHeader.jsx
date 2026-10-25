import React from 'react';
import Emoji3D from './Emoji3D';

export default function ChapterHeader({
  number,
  chapter,
  title,
  subtitle,
  emoji,
  emojiAlt = '',
  id,
  align = 'start',
  aside = null,
}) {
  return (
    <header className={`v3-chapter-head v3-chapter-head--${align}`} data-reveal>
      <div className="v3-chapter-marker">
        <span className="v3-chapter-number">{number}</span>
        <span className="v3-chapter-name">
          <span className="v3-chapter-rule" aria-hidden="true" />
          {chapter}
        </span>
        {emoji ? (
          <span className="v3-chapter-emoji">
            <Emoji3D name={emoji} size={52} alt={emojiAlt} />
          </span>
        ) : null}
      </div>
      <div className="v3-chapter-heading-row">
        <h2 className="v3-chapter-title" id={id}>
          {title}
        </h2>
        {aside ? <div className="v3-chapter-aside">{aside}</div> : null}
      </div>
      {subtitle ? <p className="v3-chapter-lede">{subtitle}</p> : null}
    </header>
  );
}
