import React, { useState, useEffect, useRef } from "react";

function SvgPaths({ onPathClick, clickedPaths, data }) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const svgRef = useRef(null);

  const handleMouseDown = (event, path) => {
    if (event.shiftKey) {
      setIsMouseDown(true);
    }
    handlePathClick(path);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handlePathClick = (path) => {
    onPathClick(path);
  };

  const handleMouseEnter = (event, path) => {
    if (isMouseDown && event.shiftKey) {
      handlePathClick(path);
    }
  };

  useEffect(() => {
    if (svgRef.current) {
      const polygons = svgRef.current.querySelectorAll('.pvshape-useable');
      
      polygons.forEach(polygon => {
        const newPolygon = polygon.cloneNode(true);
        polygon.parentNode.replaceChild(newPolygon, polygon);
        
        newPolygon.addEventListener('click', (event) => {
          const sectionClass = Array.from(newPolygon.classList)
            .find(className => className.startsWith('s-'));
          
          if (sectionClass) {
            const pathObj = {
              name: sectionClass,
              id: sectionClass
            };
            
            if (clickedPaths.includes(sectionClass)) {
              newPolygon.style.fill = '';
            } else {
              newPolygon.style.fill = 'rgba(2, 108, 223, 0.7)';
            }
            
            handlePathClick(pathObj);
          }
        });

        newPolygon.addEventListener('mousedown', (event) => {
          if (event.shiftKey) {
            setIsMouseDown(true);
            const sectionClass = Array.from(newPolygon.classList)
              .find(className => className.startsWith('s-'));
            
            if (sectionClass) {
              handlePathClick({
                name: sectionClass,
                id: sectionClass
              });
            }
          }
        });

        newPolygon.addEventListener('mouseenter', (event) => {
          if (isMouseDown && event.shiftKey) {
            const sectionClass = Array.from(newPolygon.classList)
              .find(className => className.startsWith('s-'));
            
            if (sectionClass) {
              handlePathClick({
                name: sectionClass,
                id: sectionClass
              });
            }
          }
        });
      });
    }
  }, [clickedPaths, isMouseDown]);

  return (
    <svg
      ref={svgRef}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <g>
        {data.map((path, index) => (
          <React.Fragment key={index}>
            <path
              data-component="svg__section"
              data-section-id={path.id}
              data-section-name={path.name}
              className={`clickable-path block is-available is-filtered ${
                clickedPaths.includes(path.name) ? "maximum" : "minimum"
              }`}
              onMouseDown={(event) => handleMouseDown(event, path)}
              onMouseEnter={(event) => handleMouseEnter(event, path)}
              d={path.shapes}
            ></path>
            <text
              style={{
                transform: `translate(${path.tx ? path.tx : 0}px, ${
                  path.ty ? path.ty : 0
                }px)`,
                fill: "black",
                fontWeight: "600",
                fontSize: "60px",
                textAnchor: "middle",
              }}
            >
              {path.name}
            </text>
          </React.Fragment>
        ))}
      </g>
    </svg>
  );
}

export default SvgPaths;
