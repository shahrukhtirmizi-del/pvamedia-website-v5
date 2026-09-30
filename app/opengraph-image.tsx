import { ImageResponse } from "next/og";
import { SITE } from "./lib/site";

/**
 * The social preview, drawn in code: black on white, one oversized line of
 * type, the proposition underneath and the guarantee in a solid ink bar.
 * Static, so it is generated once at build time like the rest of the site.
 */
export const dynamic = "force-static";
export const alt = "PVA Media: marketing for trades and home service companies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The display face, fetched once at build time as TTF (the OG renderer can't
 * read woff2). If the fetch fails the card still renders in the default face.
 */
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800",
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\((.+?)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const display = await loadDisplayFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFFFFF",
          color: "#0A0A0A",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(10,10,10,0.55)",
          }}
        >
          <span style={{ color: "#0A0A0A", fontWeight: 700, letterSpacing: 1 }}>{SITE.name}</span>
          <span>pvamedia.co.uk</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: display ? "Bricolage Grotesque" : undefined,
              fontSize: 132,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: -6,
            }}
          >
            Found. Called. Booked.
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 32,
              lineHeight: 1.3,
              color: "rgba(10,10,10,0.7)",
              maxWidth: 900,
            }}
          >
            Marketing, AI automation and websites for trades and home service companies.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "#0A0A0A",
            color: "#FFFFFF",
            fontSize: 26,
            padding: "16px 28px",
            borderRadius: 999,
          }}
        >
          60% more enquiries in 90 days, or you don{"’"}t pay
        </div>
      </div>
    ),
    {
      ...size,
      fonts: display
        ? [{ name: "Bricolage Grotesque", data: display, weight: 800, style: "normal" }]
        : undefined,
    },
  );
}
