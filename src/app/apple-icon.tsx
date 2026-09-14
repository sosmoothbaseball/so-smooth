import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a2a1c",
          color: "#f5f7f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: -2,
          position: "relative",
        }}
      >
        SS
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 22,
            background: "#f4c430",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
