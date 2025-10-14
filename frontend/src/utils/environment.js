export const server =
    window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://samvabackend.onrender.com";
