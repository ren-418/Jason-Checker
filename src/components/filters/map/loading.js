import React from "react";

function Loading({ isLoading, axs, isMlb, isSeatGeek }) {
  return (
    isLoading && (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={
            isMlb
              ? "/mlb.png"
              : isSeatGeek
              ? "/seatgeek.svg"
              : axs
              ? "https://upload.wikimedia.org/wikipedia/commons/a/a7/Axs_logo.svg"
              : "https://thehcpac.org/wp-content/uploads/2016/11/redticket.png"
          }
          alt="map_image"
          style={{
            width: "390px",
            height: "290px",
          }}
        />
      </div>
    )
  );
}

export default Loading;
