import React, { useMemo, useEffect, useRef, useState } from "react";

const AxsMapDisplay = ({
  axsMapInfo,
  selectedSections,
  setSelectedSections,
}) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [defaultViewBox, setDefaultViewBox] = useState("0, 0, 1000, 1000");
  const [isShiftSelecting, setIsShiftSelecting] = useState(false);
  const [lastSelectedSection, setLastSelectedSection] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);

  const handleMouseDown = (event) => {
    if (event.shiftKey) {
      setIsShiftSelecting(true);
      handleSelection(event);
    }
  };

  const aspectRatio = useMemo(() => {
    const [, , width, height] = defaultViewBox.split(",").map(Number);
    return 1 - (height / width) * 100;
  }, [defaultViewBox]);

  const handleMouseUp = () => {
    setIsShiftSelecting(false);
    setLastSelectedSection(null);
  };

  const handleMouseMove = (event) => {
    if (isShiftSelecting) {
      handleSelection(event);
    }
  };

  const handleSelection = (event) => {
    const target = event.target.closest("[data-fl]");
    if (target) {
      const sectionName = target.getAttribute("data-fl");

      if (sectionName !== lastSelectedSection) {
        if (selectedSections.includes(sectionName)) {
          setSelectedSections(
            selectedSections.filter((name) => name !== sectionName)
          );
        } else {
          setSelectedSections([...selectedSections, sectionName]);
        }
        setLastSelectedSection(sectionName);
      }
    }
  };

  const handleClick = (event) => {
    console.log('handleClick event', event);
    if (!event.shiftKey) {
      const target = event.target.closest("[data-fl]");
      if (target) {
        const sectionName = target.getAttribute("data-fl");
        setSelectedSections(
          selectedSections.includes(sectionName)
            ? selectedSections.filter((name) => name !== sectionName)
            : [...selectedSections, sectionName]
        );
      }
    }
  };

  const getFontSize = (item) => {
    return item.fs || 5;
  };

  const isBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const svgContent = useMemo(() => {
    const { svgItems, baseImage, viewBox, unique_sections } = axsMapInfo;

    let svgElement;
    const isAkamaiTickets = baseImage && baseImage.includes('akamai-tickets.akamaized.net');

    if (isAkamaiTickets) {
      const fetchSvgContent = async () => {
        try {
          const response = await fetch(baseImage);
          const svgText = await response.text();
          
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
          svgElement = svgDoc.documentElement;

          svgElement.setAttribute("viewBox", svgDoc.documentElement.getAttribute("viewBox") || defaultViewBox);
          svgElement.setAttribute("width", "100%");
          svgElement.setAttribute("height", "100%");
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

          return svgElement.outerHTML;
        } catch (error) {
          console.error('Error fetching SVG:', error);
          return null;
        }
      };

      fetchSvgContent().then(content => {
        if (content && svgRef.current) {
          svgRef.current.innerHTML = content;
          
          const polygons = svgRef.current.querySelectorAll('.pvshape-useable');
          polygons.forEach(polygon => {
            polygon.style.cursor = 'pointer';
            
            const sectionClass = Array.from(polygon.classList)
              .find(className => className.startsWith('s-'));
            
            if (sectionClass) {
              const sectionId = sectionClass.replace('s-', '');
              
              const sectionInfo = unique_sections?.find(section => section.id === sectionId);
              const sectionName = sectionInfo?.sectionName;

              if (sectionName && selectedSections.includes(sectionName)) {
                polygon.style.fill = 'rgba(2, 108, 223, 0.7)';
              }

              polygon.addEventListener('click', (event) => {
                event.stopPropagation();
                
                if (sectionName) {
                  const isSelected = selectedSections.includes(sectionName);
                  if (isSelected) {
                    polygon.style.fill = '';
                    setSelectedSections(selectedSections.filter(name => name !== sectionName));
                  } else {
                    polygon.style.fill = 'rgba(2, 108, 223, 0.7)';
                    setSelectedSections([...selectedSections, sectionName]);
                  }
                }
              });

              polygon.addEventListener('mouseenter', () => {
                if (sectionName && !selectedSections.includes(sectionName)) {
                  polygon.style.fill = 'rgba(2, 108, 223, 0.5)';
                }
              });

              polygon.addEventListener('mouseleave', () => {
                if (sectionName && !selectedSections.includes(sectionName)) {
                  polygon.style.fill = '';
                }
              });
            }
          });
        }
      });

      return '<svg viewBox="0 0 1000 1000"></svg>';
    }

    if ((typeof baseImage === "string" && baseImage.startsWith("http")) || baseImage === "") {
      svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      if (viewBox) {
        setDefaultViewBox(viewBox);
      }

      const [x, y, ,] = defaultViewBox.split(",");

      svgElement.setAttribute("viewBox", defaultViewBox);
      svgElement.setAttribute("x", x);
      svgElement.setAttribute("y", y);

      const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
      image.setAttribute("href", baseImage);
      image.setAttribute("width", "100%");
      image.setAttribute("height", "100%");
      image.setAttribute("x", x);
      image.setAttribute("y", y);
      image.setAttribute("preserveAspectRatio", "xMidYMid meet");

      svgElement.appendChild(image);
    } else if (isBase64(baseImage)) {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(atob(baseImage), "image/svg+xml");
      svgElement = svgDoc.documentElement;

      const svgViewBox = svgElement.getAttribute("viewBox");
      if (svgViewBox) {
        setDefaultViewBox(svgViewBox);
      } else {
        svgElement.setAttribute("viewBox", defaultViewBox);
      }

      svgElement.setAttribute("width", "100%");
      svgElement.setAttribute("height", "100%");
      svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    } else {
      console.error("Unsupported baseImage format");
      return null;
    }

    if (!isAkamaiTickets && svgItems && svgItems.length > 0) {
      const interactiveGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      interactiveGroup.setAttribute("id", "interactive-elements");

      svgItems.forEach((item) => {
        const groupElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );
        const pathElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        const sectionName =
          item.fl || (item.id && item.id.replace("S_", "")) || "";
        const isSelected =
          selectedSections && selectedSections.includes(sectionName);

        let x, y, ax, ay;

        if (item.c) {
          [x, y] = item.c;
        } else {
          x = 0;
          y = 0;
        }

        if (item.a) {
          [ax, ay] = item.a;
        } else {
          ax = 0;
          ay = 0;
        }

        pathElement.setAttribute("d", item.pt);
        pathElement.setAttribute("transform", `translate(${x}, ${y})`);
        pathElement.setAttribute(
          "fill",
          isSelected ? "rgba(2, 108, 223, 0.7)" : "rgba(2, 108, 223, 0.3)"
        );
        pathElement.setAttribute("stroke", isSelected ? "#b81ee3" : "#026cdf");
        pathElement.setAttribute("stroke-width", "2");
        pathElement.setAttribute("id", item.id);
        pathElement.setAttribute("data-fl", sectionName);
        pathElement.style.cursor = "pointer";

        groupElement.appendChild(pathElement);

        // if (item.hs && item.hs.length === 2) {
        //   const [width, height] = item.hs;
        //   const scaleX = width / 100;
        //   const scaleY = height / 100;
        //   const scaleTransform = `scale(${scaleX}, ${scaleY})`;

        //   const existingTransform = groupElement.getAttribute("transform") || "";
        //   groupElement.setAttribute("transform", `${existingTransform} ${scaleTransform}`.trim());
        // }

        if (sectionName && item.a) {
          const textElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          textElement.setAttribute(
            "transform",
            `rotate(${item.fr}, ${ax}, ${ay})`
          );
          textElement.setAttribute("x", item.a[0]);
          textElement.setAttribute("y", item.a[1]);
          textElement.setAttribute("fill", "black");
          textElement.setAttribute("font-size", getFontSize(item));
          textElement.setAttribute("text-anchor", "middle");
          textElement.setAttribute("dominant-baseline", "middle");

          textElement.setAttribute("pointer-events", "none");
          textElement.setAttribute("user-select", "none");
          textElement.setAttribute(
            "style",
            "-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
          );
          textElement.setAttribute("font-weight", "600");
          textElement.textContent = sectionName;

          groupElement.appendChild(textElement);
        }

        groupElement.setAttribute("data-fl", sectionName);
        interactiveGroup.appendChild(groupElement);
      });

      svgElement.appendChild(interactiveGroup);
    }

    return svgElement.outerHTML;
  }, [axsMapInfo, selectedSections, defaultViewBox]);

  useEffect(() => {
    if (containerRef.current && svgRef.current) {
      const resizeObserver = new ResizeObserver(() => {
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [svgContent]);

  useEffect(() => {
    if (svgRef.current && svgContent) {
      const isAkamaiTickets = axsMapInfo.baseImage?.includes('akamai-tickets.akamaized.net');
      
      if (!isAkamaiTickets) {
        svgRef.current.innerHTML = svgContent;
        // setIsLoading(false);
        
        const pathElements = svgRef.current.querySelectorAll('path[data-fl]');
        const polygonElements = svgRef.current.querySelectorAll('.pvshape-useable');
        
        const setupElement = (element) => {
          const getSectionName = (el) => {
            if (el.hasAttribute('data-fl')) {
              const dataFl = el.getAttribute('data-fl');
              return dataFl;
            }
            
            const sectionClass = Array.from(el.classList)
              .find(className => className.startsWith('s-'));
            // console.log('Found section class:', sectionClass);
            return sectionClass;
          };

          const sectionName = getSectionName(element);
          // console.log('Processing element with section name:', sectionName);
          if (!sectionName) return;

          const newElement = element.cloneNode(true);
          element.parentNode.replaceChild(newElement, element);

          newElement.addEventListener('click', (event) => {
            // console.log('Click event triggered on section:', sectionName);
            if (sectionName) {
              if (selectedSections.includes(sectionName)) {
                // console.log('Deselecting section:', sectionName);
                newElement.style.fill = '';
                newElement.style.stroke = '#026cdf';
                setSelectedSections(selectedSections.filter(name => name !== sectionName));
              } else {
                // console.log('Selecting section:', sectionName);
                newElement.style.fill = 'rgba(2, 108, 223, 0.7)';
                newElement.style.stroke = '#b81ee3';
                setSelectedSections([...selectedSections, sectionName]);
              }
            }
          });


          newElement.addEventListener('mouseenter', () => {
            // console.log('Mouse enter on section:', sectionName);
            if (!selectedSections.includes(sectionName)) {
              newElement.style.fill = 'rgba(2, 108, 223, 0.5)';
            }
          });

          newElement.addEventListener('mouseleave', () => {
            if (!selectedSections.includes(sectionName)) {
              newElement.style.fill = newElement.tagName.toLowerCase() === 'polygon' ? '' : 'rgba(2, 108, 223, 0.3)';
            }
          });

          newElement.addEventListener('mousedown', (event) => {
            if (event.shiftKey) {
              setIsShiftSelecting(true);
              if (sectionName && !selectedSections.includes(sectionName)) {
                newElement.style.fill = 'rgba(2, 108, 223, 0.7)';
                newElement.style.stroke = '#b81ee3';
                setSelectedSections([...selectedSections, sectionName]);
              }
            }
          });
          newElement.addEventListener('mouseenter', (event) => {
            if (isShiftSelecting) {
              if (sectionName && !selectedSections.includes(sectionName)) {
                newElement.style.fill = 'rgba(2, 108, 223, 0.7)';
                newElement.style.stroke = '#b81ee3';
                setSelectedSections([...selectedSections, sectionName]);
              }
            }
          });
        };

        pathElements.forEach(setupElement);
        polygonElements.forEach(setupElement);
      }
    }
  }, [svgContent, selectedSections, isShiftSelecting]);

  return (
    <div
      ref={containerRef}
      style={{
        paddingTop: `${aspectRatio}%`,
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <svg
        ref={svgRef}
        viewBox={defaultViewBox}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "100%",
          width: "100%",
          maxHeight: "100%",
          backgroundColor: "white",
        }}
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={(e) => {
          console.log('SVG mouseDown event');
          handleMouseDown(e);
        }}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClick={(e) => {
          console.log('SVG click event');
          handleClick(e);
        }}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default AxsMapDisplay;
