import React from "react";

const Notes = ({ stubhubData, note, darkMode }) => {
  const convertToClickableLink = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #007BFF; text-decoration: underline;">${url}</a>`
    );
  };

  if (!stubhubData) {
    return (
      <div
        style={{
          position: "relative",
          textAlign: "center",
          background: darkMode ? "#2D2D2D" : "#C7C7C7",
          marginTop: "30px",
          borderRadius: "20.19px",
          boxShadow: "0px 5.38px 5.38px 0px #0000000D",
          fontFamily: "'Lora', serif",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            background: darkMode ? "#393939" : "#B9B9B9",
            borderRadius: "20.19px",
            height: "32px",
            width: "100%",
          }}
        >
          <strong
            style={{
              fontSize: "20px",
              display: "block",
              color: darkMode ? "#E7E7E7" : "#3C3C3C",
              userSelect: "none",
              fontFamily: "Inter",
            }}
          >
            Notes
          </strong>
        </div>
        <span
          dangerouslySetInnerHTML={{
            __html: convertToClickableLink(note),
          }}
          style={{
            paddingTop: "10px",
            fontSize: "16px",
            lineHeight: "1.5",
            color: darkMode ? "white" : "black",
            display: "inline-block",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "0",
            width: "90%",
            height: "20px",
            borderRadius: "0 0 20.19px 20.19px",
            marginLeft: "20px",
            borderTop: darkMode
              ? "2.69px solid #B2B2B2"
              : "2.69px solid #888888",
          }}
        ></div>
      </div>
    );
  }

  return null;
};

export default Notes;
