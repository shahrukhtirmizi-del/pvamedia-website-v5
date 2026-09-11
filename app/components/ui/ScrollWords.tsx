import type { CSSProperties, ElementType } from "react";
import { Fragment } from "react";

/**
 * Text whose words brighten as they scroll into the middle of the viewport
 * and dim again as they leave it. The motion is a CSS scroll-driven
 * animation (see .sw in globals.css), so it costs nothing per frame and
 * degrades to plain text where unsupported.
 */
export default function ScrollWords({
  text,
  as: Tag = "p",
  className = "",
  style,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const words = text.split(" ");
  return (
    <Tag className={`sw ${className}`} style={style}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {/* the space stays outside the inline-block span or it collapses */}
          <span style={{ "--i": i } as CSSProperties}>{word}</span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
