import React from "react";

const Welcome = () => {
  return (
    <div
      style={{
        backgroundColor: "#000000",
        display: "flex",
        height: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src="welcome.gif" alt="loading..." />
    </div>
  );
};
export default Welcome;
