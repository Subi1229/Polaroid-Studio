import heartSolid from "../assets/heart-solid.png";
import heartOutline from "../assets/heart-outline.png";

export default function FilmFrame({film,images = [],variant = "full"
}) {
  if (!film) return null;

  const isSingle = film.type === "single";
  const hasText = film.textLayout !== null && film.textLayout !== undefined;
  const isBlack = film.theme === "black";

  // 🔹 Scale control
  
  // 🔹 Dimensions
  const baseWidth = isSingle ? 322 : 282;
  const baseHeight = isSingle ? 426 : hasText ? 702 : 668;
  
  // Thumbnail scale for selection screen
  const scale = variant === "thumbnail" ? 0.5 : 1;
  
  const width = baseWidth * scale;
  const height = baseHeight * scale;

  const paddingBottom =
    (isSingle ? 46 : hasText ? 46 : 58) * scale;

  const photoWidth = (isSingle ? 290 : 250) * scale;
  const photoHeight = (isSingle ? 320 : 190) * scale;

  const bgColor = isBlack ? "#000000" : "#ffffff";
  const textColor = isBlack ? "#ffffff" : "#000000";

  return (
    <div
      style={{
        width,
        height,
        paddingTop: 16 * scale,
        paddingLeft: 16 * scale,
        paddingRight: 16 * scale,
        paddingBottom,
        boxSizing: "border-box",
        background: bgColor,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* HEARTS */}
      {film.hasHearts && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 170 * scale,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {/* Bottom Row */}
          {[
            { left: -25, size: 60, rotate: -16, flip: false, img: heartSolid },
            { left: 40, size: 65, rotate: 10, flip: true, img: heartOutline },
            { left: 115, size: 75, rotate: -6, flip: false, img: heartSolid },
            { left: 190, size: 60, rotate: 12, flip: false, img: heartOutline },
            { left: 250, size: 55, rotate: -10, flip: true, img: heartSolid },
          ].map((heart, i) => (
            <div
              key={`bottom-${i}`}
              style={{
                position: "absolute",
                bottom: 0,
                left: heart.left * scale,
              }}
            >
              <img
                src={heart.img}
                alt=""
                style={{
                  width: heart.size * scale,
                  transform: `
                    ${heart.flip ? "scaleX(-1)" : ""}
                    rotate(${heart.rotate}deg)
                  `,
                  display: "block",
                }}
              />
            </div>
          ))}

          {/* Top Row */}
          {[
            { left: 30, size: 50, rotate: 14, flip: true, img: heartOutline },
            { left: 150, size: 55, rotate: -10, flip: false, img: heartSolid },
            { left: 230, size: 48, rotate: 18, flip: true, img: heartOutline },
          ].map((heart, i) => (
            <div
              key={`top-${i}`}
              style={{
                position: "absolute",
                bottom: 30 * scale,
                left: heart.left * scale,
              }}
            >
              <img
                src={heart.img}
                alt=""
                style={{
                  width: heart.size * scale,
                  transform: `
                    ${heart.flip ? "scaleX(-1)" : ""}
                    rotate(${heart.rotate}deg)
                  `,
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: isSingle ? 0 : 12 * scale,
        }}
      >
        {/* PHOTO SLOTS */}
        {isSingle ? (
          <div
            style={{
              width: photoWidth,
              height: photoHeight,
              overflow: "hidden",
              border:
                images[0] === undefined
                  ? "1px solid #CECECE"
                  : "none",
            }}
          >
            {images[0] && (
              <img
                src={images[0]}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              style={{
                width: photoWidth,
                height: photoHeight,
                overflow: "hidden",
                border:
                  images[index] === undefined
                    ? "1px solid #CECECE"
                    : "none",
              }}
            >
              {images[index] && (
                <img
                  src={images[index]}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          ))
        )}

        {/* TEXT */}
        {film.textLayout === "potra" && (
          <div
            style={{
              marginTop: 12 * scale,
              color: textColor,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div style={{ fontSize: 16 * scale }}>
              POTRA 400
            </div>
            <div style={{ fontSize: 12 * scale }}>
              90 F11.0 &nbsp;&nbsp; X &nbsp;&nbsp; P80/20 120
            </div>
          </div>
        )}

        {film.textLayout === "ko" && (
          <div
            style={{
              marginTop: 12 * scale,
              color: textColor,
              fontFamily: "Inter, sans-serif",
              textAlign: "right",
            }}
          >
            <div style={{ fontSize: 16 * scale }}>KO</div>
            <div style={{ fontSize: 12 * scale }}>
              X &nbsp;&nbsp; P80/20 120
            </div>
          </div>
        )}
      </div>
    </div>
  );
}