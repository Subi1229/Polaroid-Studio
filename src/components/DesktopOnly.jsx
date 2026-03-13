import { useEffect, useState } from "react";

function DesktopOnly({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkScreen() {
      setIsMobile(window.innerWidth < 900);
    }

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (isMobile) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#F5F0EB",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "Inter",
        padding: "40px"
      }}>
        <div>
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
            📸 Desktop Experience Only
          </h2>

          <p style={{ fontSize: "16px", maxWidth: "420px", lineHeight: "1.6" }}>
            Polaroid Studio is designed for desktop screens to give you the
            full experience.
            <br /><br />
            Please open this website on a laptop or computer.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default DesktopOnly;