import React from "react";

const Error = () => {
  return (
    <div>
      <div style={{ width: "100vw", height: "100vh" }}>
        <img src="error.webp" width="100%" height="100%" alt="access denied" />
        <div
          style={{
            position: "absolute",
            bottom: 10,
            textAlign: "center",
            width: "100%",
          }}
        >
          <h5>
            If you think this is an error, check if you have an ethereum wallet
            installed in your browser.
          </h5>
          <h6>
            We recommend{" "}
            <a href="https://metamask.io/download.html">MetaMask</a> in Chrome.
          </h6>
        </div>
      </div>
    </div>
  );
};
export default Error;
