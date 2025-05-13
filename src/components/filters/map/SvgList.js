import React from "react";

const SvgLabelList = ({ jsonData }) => {
  return (
    <>
      {jsonData.map((label, index) => {
        if (!label.text) return null;
        const lines = label.text.split("\r");

        return (
          <text
            key={index}
            data-component="svg__label"
            data-label-id={label.labelId}
            className="label"
            transform={label.transform}
            fontSize={label.fontSize === 0 ? 200 : label.fontSize}
            style={{
              pointerEvents: "none", // Prevents the text from interfering with clicks
              userSelect: "none", // Prevents the text from being highlighted
            }}
          >
            {lines.map((line, lineIndex) => (
              <tspan
                key={lineIndex}
                x={label.x}
                y={label.y}
                dy={`${(lineIndex + 1) * 1}em`}
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </>
  );
};

export default SvgLabelList;
