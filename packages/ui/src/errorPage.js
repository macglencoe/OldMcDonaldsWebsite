"use client";

import React from "react";

function ErrorPage({ error, reset, message }) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="p-4">
      <div
        className="w-full h-[90vh] relative p-4 overflow-hidden"
        style={{
          backgroundImage: "url('/willow.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="p-5 h-full w-fit flex flex-col items-center justify-center gap-5 bg-foreground/50 relative shadow-2xl rounded-lg text-center">
          <h1 className="text-7xl font-bold text-white">500</h1>
          {message && <h1 className="text-3xl font-bold text-white">{message}</h1>}
          <p className="text-background"></p>
          {isDev && (
            <div className="bg-foreground rounded p-3 w-full text-background text-left">
              <p>
                <strong>{error?.name || "Unknown error"}</strong>
              </p>
              <p>
                <strong>Message:</strong> {error?.message || "Unknown error"}
              </p>
              {error?.stack && (
                <details>
                  <summary>Stack trace</summary>
                  <pre className="whitespace-pre-wrap text-xs">{error.stack}</pre>
                </details>
              )}
            </div>
          )}
          <p>
            <a href="/" className="text-background bg-accent/50 px-5 py-2 rounded-full hover:bg-accent">
              Go Home
            </a>
          </p>
          <p>
            <a
              href="/contact#dev"
              className="text-background bg-foreground/50 px-5 py-2 rounded-full hover:bg-foreground"
            >
              Contact Dev
            </a>
          </p>
          <p>
            <button
              className="text-background bg-foreground/50 px-5 py-2 rounded-full hover:bg-foreground cursor-pointer"
              onClick={() => reset?.()}
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export { ErrorPage };
export default ErrorPage;
