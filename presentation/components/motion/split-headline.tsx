export type SplitHeadlineProps = {
  text: string;
  delayMs?: number;
  className?: string;
};

/**
 * Headline dipecah per huruf, muncul satu per satu — bagian 1.6 issue.md.
 * Huruf individual `aria-hidden`, teks utuh disediakan lewat `sr-only` untuk
 * screen reader.
 */
export function SplitHeadline({text, delayMs = 0, className}: SplitHeadlineProps) {
  const letters = Array.from(text);

  return (
    <span className={className}>
      <span aria-hidden="true">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block animate-reveal-up"
            style={{animationDelay: `${delayMs + index * 30}ms`}}
          >
            {letter === " " ? " " : letter}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
