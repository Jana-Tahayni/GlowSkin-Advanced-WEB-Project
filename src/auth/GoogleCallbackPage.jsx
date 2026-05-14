import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    const error  = params.get("error");
    const email  = params.get("email");

    console.log("Google callback params:", { token, error, email }); // debug

    if (token) {
      localStorage.setItem("token", token);
      navigate("/analyzer", { replace: true });
      return;
    }

    if (error === "pending_verification") {
      navigate(`/auth?error=pending&email=${email}`, { replace: true });
      return;
    }

    navigate("/auth?error=google_failed", { replace: true });
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(160deg,#FAF0EB 0%,#F2E4DA 50%,#EDD8CE 100%)",
      gap: "1rem",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "linear-gradient(135deg,#E8B4A8,#C8896E)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24,
      }}>
        ✨
      </div>
      <p style={{ fontFamily: "Jost, sans-serif", color: "#8B4D3A", fontSize: 16, margin: 0 }}>
        Signing you in with Google…
      </p>
    </div>
  );
}