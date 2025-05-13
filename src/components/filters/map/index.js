import React, { useEffect, useRef, useState } from "react";
import Loading from "./loading";
import { organizeSections } from "./mapUtilities";
import AxsMapDisplay from "./axsMap";
import { TransformComponent } from "react-zoom-pan-pinch";
import { auth } from "../../../firebase";

const MapDisplay = ({
  paths,
  info,
  mapid,
  handleSvgPathClick,
  selectedPaths,
  SvgPaths,
  SvgLabelList,
  axs,
  axsMapInfo,
  setSelectedSections,
  isFilterAvailable,
  isMlb,
  isSeatGeek,
  userEmail,
  eventLink,
  tableState,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [organized, setOrganized] = useState({});
  const [mapImage, setMapImage] = useState(null);
  // const [svgContent, setSvgContent] = useState(null);
  const isFetchingRef = useRef(false);
  const svgRef = useRef(null);

  const [baseSvg, setBaseSvg] = useState(null);

  const isEvenue = eventLink.includes("evenue.net");

  useEffect(() => {
    async function fetchMapImage() {
      if (isEvenue) {
        return;
      }
      try {
        const map_url = `https://mapsapi.tmol.io/maps/geometry/image/${mapid}?removeFilters=ISM_Shadow&amp;avertaFonts=true&amp;app=PRD2663_EDP_NA`;
        if (isFetchingRef.current || mapImage || !mapid) return;
        if (
          !map_url ||
          (!eventLink.includes("ticketmaster") &&
            !eventLink.includes("livenation")) ||
          !map_url.includes("mapsapi.tmol.io") ||
          !userEmail
        ) {
          setMapImage(false);
          return;
        }
        isFetchingRef.current = true;

        const response = await fetch(
          "https://mg.phantomcheckerapi.com/api/ticketmaster/map-image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
            },
            body: JSON.stringify({
              url: map_url,
              email: userEmail,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const imageResponse = await response.text();

        if (imageResponse === null || imageResponse === "null") {
          throw new Error("response null");
        }

        if (imageResponse.includes("error")) {
          throw new Error("error");
        }

        setMapImage(imageResponse.replace(/"/g, ""));
      } catch (error) {
        setMapImage(false);
        console.log(error);
      }
    }

    fetchMapImage();

    return () => {
      if (mapImage) {
        URL.revokeObjectURL(mapImage);
      }
    };
  }, [eventLink, userEmail, mapImage, mapid, isEvenue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 500);

    let organized = organizeSections(paths);
    if (axsMapInfo) {
      const { svgItems } = axsMapInfo;

      let sections = [];

      for (let i = 0; i < svgItems.length; i++) {
        const section = svgItems[i];
        const sectionName = section.fl;

        if (sectionName) {
          sections.push({
            name: sectionName,
            id: section.id,
          });
        }
      }

      organized = organizeSections(sections);
    }
    setOrganized(organized);

    return () => clearTimeout(timer);
  }, [paths, axsMapInfo]);

  const handleGroupClick = (group) => {
    const sectionIds = organized[group].map((sec) => ({
      name: sec.name,
      id: sec.id,
    }));
    handleSvgPathClick(sectionIds);
  };

  const MapStyle = {
    backgroundImage: mapImage
      ? `url('data:image/svg+xml;base64,${mapImage}')`
      : `url('https://mapsapi.tmol.io/maps/geometry/image/${mapid}?removeFilters=ISM_Shadow&amp;avertaFonts=true&amp;app=PRD2663_EDP_NA')`,
    transform: "rotate(0deg)",
  };

  const isPaths = paths.length > 0 && info.length > 0 && mapid && !isEvenue;
  const isAXS = axsMapInfo;

  useEffect(() => {
    if (tableState && tableState.baseImage) {
      try {
        const isBase64 = (str) => {
          try {
            return btoa(atob(str)) === str;
          } catch (err) {
            return false;
          }
        };

        if (isBase64(tableState.baseImage)) {
          const decodedSvg = atob(tableState.baseImage);
          setBaseSvg(decodedSvg);

          if (svgRef.current) {
            svgRef.current.innerHTML = decodedSvg;

            const polygons = svgRef.current.querySelectorAll('.pvshape-useable');
            polygons.forEach(polygon => {
              polygon.addEventListener('click', (event) => {
                const sectionClass = Array.from(polygon.classList)
                  .find(className => className.startsWith('s-'));
                
                if (sectionClass) {
                  const pathObj = {
                    name: sectionClass,
                    id: sectionClass
                  };
                  
                  if (selectedPaths.includes(sectionClass)) {
                    polygon.style.fill = '';
                  } else {
                    polygon.style.fill = 'rgba(2, 108, 223, 0.7)';
                  }
                  
                  handleSvgPathClick(pathObj);
                }
              });
            });
          }
        }
      } catch (error) {
        console.error('Error processing base SVG:', error);
      }
    }
  }, [tableState, selectedPaths, handleSvgPathClick]);

  return (
    <div className="w-full">
      {(!paths || paths.length === 0) &&
        (!info || info.length === 0 || Object.keys(info).length === 0) &&
        !axsMapInfo &&
        !baseSvg && (
          <Loading
            isLoading={isLoading}
            axs={axs}
            isMlb={isMlb}
            isSeatGeek={isSeatGeek}
          />
        )}
      <div
        className={`page__wrapper bg-[#CACACA] dark:bg-[rgb(57,57,57)] ${
          (!paths || paths.length === 0) &&
          (!info || info.length === 0 || Object.keys(info).length === 0) &&
          !isAXS &&
          !baseSvg
            ? "hidden"
            : ""
        }`}
      >
        <TransformComponent>
          {(isPaths || baseSvg) && (
            <div className="seatmap-container seatmap-container--sim">
              <div className="map__wrapper">
                <div className="map rounded-xl">
                  <svg
                    ref={svgRef}
                    data-component="svg"
                    className="map__svg"
                    viewBox={tableState.viewBox || "0 0 10240 7680"}
                    style={MapStyle}
                  >
                    {!baseSvg && (
                      <>
                        <g>
                          <SvgPaths
                            onPathClick={handleSvgPathClick}
                            clickedPaths={selectedPaths}
                            data={paths}
                          />
                        </g>
                        <g>
                          <SvgLabelList jsonData={info} />
                        </g>
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>
          )}
          {isAXS && (
            <AxsMapDisplay
              axsMapInfo={axsMapInfo}
              selectedSections={selectedPaths}
              setSelectedSections={setSelectedSections}
            />
          )}
          {isEvenue && (
            <div className="seatmap-container seatmap-container--sim">
              <div className="map__wrapper">
                <div className="map rounded-xl">
                  <svg
                    data-component="svg"
                    className="map__svg"
                    viewBox={`0 0 ${tableState.width} ${tableState.height}`}
                  >
                    <g>
                      <SvgPaths
                        onPathClick={handleSvgPathClick}
                        clickedPaths={selectedPaths}
                        data={paths}
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </TransformComponent>
      </div>
      {organized && Object.keys(organized).length > 0 && (
        <div className="flex flex-col items-center xl:items-start mt-6">
          <h6 className="mb-2 text-lg font-semibold text-[#3C3C3C] dark:text-white">
            Section Types
          </h6>
          <div className="flex flex-wrap">
            {Object.keys(organized).map((group) => (
              <button
                type="button"
                key={group}
                disabled={!isFilterAvailable}
                className="w-full px-3 py-1.5 mr-3 mb-3 max-w-max rounded-full bg-[rgba(64,84,175)]"
                variant="contained"
                onClick={() => handleGroupClick(group)}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
