import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import "../../../../css/HomePage.css";
import { useTheme } from "../../../../ThemeContext";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../../firebase";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export default function EventData({ vividUrl }) {
  const [open, setOpen] = useState(false);
  const [vividTabledata, setVividTableData] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [selectedSections, setSelectedSections] = useState(new Set());
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const { darkMode } = useTheme();

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false);
    setVividTableData(null);
    setSelectedSections(new Set());
  };

  const handleSectionClick = (sectionId) => {
    if (!sectionId) return;
    setSelectedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleMouseDown = (event, sectionId) => {
    if (!sectionId) return;
    if (event.shiftKey) {
      setIsMouseDown(true);
    }
    handleSectionClick(sectionId);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseEnter = (event, sectionId) => {
    if (!sectionId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const dialogContent = event.currentTarget.closest(".MuiDialogContent-root");
    const dialogRect = dialogContent.getBoundingClientRect();
    const x = rect.left - dialogRect.left + rect.width / 2;
    const y = rect.top - dialogRect.top;
    setHoverPosition({ x, y });
    setHoveredSection(sectionId);

    if (isMouseDown && event.shiftKey) {
      handleSectionClick(sectionId);
    }
  };

  const handleGroupClick = (groupId) => {
    const sections = vividTabledata.sections.filter(
      (section) => section.g === groupId
    );

    setSelectedSections((prev) => {
      const newSet = new Set(prev);

      const allSelected = sections.every((section) => prev.has(section.i));

      if (allSelected) {
        sections.forEach((section) => newSet.delete(section.i));
      } else {
        sections.forEach((section) => newSet.add(section.i));
      }

      return newSet;
    });
  };

  useEffect(() => {
    if (open === false) return;

    const fetchDataFromAPI = async () => {
      const eventId = vividUrl.split("/").pop();

      const response = await fetch(
        "https://mg.phantomcheckerapi.com/api/vivid/details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
          },
          body: JSON.stringify({ eventId: eventId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
    };

    if (!vividUrl) return;

    const eventId = vividUrl.split("/").pop();

    const q = query(
      collection(db, "vividEventData"),
      where("eventId", "==", eventId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    fetchDataFromAPI();

    const unsub = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;

      snapshot.forEach((doc) => {
        setVividTableData(doc.data().data);
      });
    });

    return () => unsub();
  }, [vividUrl, open]);

  const HoverCard = ({ section, position }) => {
    if (!section) return null;

    const sectionData = vividTabledata.sections.find(
      (item) => item.i === section
    );

    if (!sectionData) return null;

    return (
      <div
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y - 200}px`,
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        <div
          className={`rounded-lg shadow-lg w-64 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div className="p-4">
            <p className="font-bold text-lg mb-3">Section {section}</p>
            <div className="grid grid-cols-2 gap-y-2 text-s">
              <div>
                <p className="text-gray-500">Min Price</p>
                <p className="font-semibold">${sectionData.l}</p>
              </div>
              <div>
                <p className="text-gray-500">Max Price</p>
                <p className="font-semibold">${sectionData.h}</p>
              </div>
              <div>
                <p className="text-gray-500">Avg Price</p>
                <p className="font-semibold">${sectionData.l}</p>
              </div>
              <div>
                <p className="text-gray-500">Quantity</p>
                <p className="font-semibold">{sectionData.q}</p>
              </div>
            </div>
          </div>
          <div
            className={`absolute left-1/2 -bottom-2 w-4 h-4 transform -translate-x-1/2 rotate-45 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            style={{
              boxShadow: "2px 2px 2px rgba(0,0,0,0.1)",
              zIndex: -1,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {vividUrl && (
        <button
          onClick={handleOpenModal}
          style={{
            backgroundColor: "#670004",
            borderRadius: "16px",
            fontFamily: "'Inter', sans-serif",
            color: "white",
            height: "30px",
            width: "180px",
            whiteSpace: "nowrap",
          }}
          type="button"
        >
          Phantom Data (BETA)
        </button>
      )}

      {vividTabledata && (
        <Dialog
          id="templateManagerDialog"
          open={open}
          onClose={handleCloseModal}
          fullWidth={true}
          maxWidth="xl"
        >
          <div
            className={`p-6 bg-[#DBDBDB] dark:bg-[#222222] border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2
                    className={`text-3xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <a
                      href={vividUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                      }}
                    >
                      {vividTabledata.global[0].productionName}
                    </a>
                  </h2>
                </div>
                <div
                  className={`flex items-center gap-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="text-lg">
                      {vividTabledata.global[0].mapTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span className="text-lg">
                      {vividTabledata.global[0].EventDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-[#DBDBDB] dark:bg-[#222222]">
            <div className="flex-1 bg-[#DBDBDB] dark:bg-[#222222] text-white rounded-xl pb-1">
              <div className="flex flex-row gap-2">
                {vividTabledata?.groups?.map((group) => {
                  if (group.n === "" || !group.n) return null;

                  return (
                    <button
                      onClick={() => handleGroupClick(group.i)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg
            ${
              darkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }
            transition-colors duration-200`}
                    >
                      <span className="font-medium">{group.n}</span>
                    </button>
                  );
                })}
              </div>
              <DialogContent>
                <div className="relative h-[calc(100vh-180px)]">
                  {vividTabledata.vividMap &&
                    vividTabledata.vividMap.elements && (
                      <>
                        {hoveredSection && (
                          <foreignObject
                            width="100%"
                            height="100%"
                            style={{
                              position: "absolute",
                              overflow: "visible",
                              pointerEvents: "none",
                            }}
                          >
                            <HoverCard
                              section={hoveredSection}
                              position={hoverPosition}
                            />
                          </foreignObject>
                        )}
                        <TransformWrapper
                          initialScale={1}
                          initialPositionX={0}
                          initialPositionY={0}
                          disabled={isMouseDown}
                        >
                          <TransformComponent>
                            <svg
                              viewBox={`0 0 ${vividTabledata.vividMap.width} ${vividTabledata.vividMap.height}`}
                              version="1.1"
                              style={{
                                width: "100%",
                                height: "100%",
                                userSelect: "none",
                                touchAction: "none",
                                transformOrigin: "50% 50%",
                                transition: "none",
                                transform: "scale(1) translate(0px, 0px)",
                              }}
                              onMouseUp={handleMouseUp}
                              onMouseLeave={() => {
                                handleMouseUp();
                                setHoveredSection(null);
                              }}
                            >
                              {vividTabledata.vividMap.elements.map(
                                (item, index) => {
                                  if (item.type !== "path") return null;

                                  const transform = item.transform.replace(
                                    "m",
                                    ""
                                  );
                                  let fill2 = item.fill;
                                  if (item.color !== "") {
                                    fill2 = item.color.replace("0x", "#");
                                  }

                                  const isSelected = selectedSections.has(
                                    item.id
                                  );
                                  //

                                  return (
                                    <path
                                      key={index}
                                      d={item.path}
                                      stroke="#000000"
                                      fillOpacity={item["fill-opacity"]}
                                      style={{
                                        cursor: item.id ? "pointer" : "default",
                                        transform: `matrix(${transform})`,
                                        pointerEvents: item.id ? "all" : "none",
                                        fill: isSelected ? "red" : fill2,
                                        transition: "fill 0.2s ease",
                                      }}
                                      onMouseEnter={(e) =>
                                        item.id && handleMouseEnter(e, item.id)
                                      }
                                      onMouseLeave={() =>
                                        item.id && setHoveredSection(null)
                                      }
                                      onMouseDown={(e) =>
                                        item.id && handleMouseDown(e, item.id)
                                      }
                                    />
                                  );
                                }
                              )}

                              {vividTabledata.vividMap.elements.map(
                                (item, index) => {
                                  if (item.type !== "text") return null;
                                  const transform = item.transform.replace(
                                    "m",
                                    ""
                                  );
                                  return (
                                    <text
                                      key={index}
                                      transform={`matrix(${transform})`}
                                      fontSize={item["font-size"]}
                                      fontFamily="Arial-BoldMT"
                                      textAnchor={item["text-anchor"]}
                                      x={item.x || "0"}
                                      y={item.y || "0"}
                                      style={{
                                        cursor: item.id ? "pointer" : "default",
                                        fill: item.fill || "#000000",
                                        pointerEvents: "none",
                                      }}
                                    >
                                      {item.text}
                                    </text>
                                  );
                                }
                              )}
                            </svg>
                          </TransformComponent>
                        </TransformWrapper>
                      </>
                    )}
                </div>
              </DialogContent>
            </div>
            <div className="flex-1 bg-[#DBDBDB] dark:bg-[#222222] text-white rounded-xl pb-1">
              <DialogContent>
                {vividTabledata?.sections && (
                  <div
                    style={{
                      position: "relative",
                      height: "calc(100vh - 180px)",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        marginTop: 0,
                      }}
                      className={
                        darkMode ? "url-list dark-mode" : "url-list light-mode"
                      }
                    >
                      <thead
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              width: "15%",
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                              borderTopLeftRadius: "16px",
                            }}
                          >
                            Section
                          </th>
                          <th
                            style={{
                              width: "15%",
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Min Price
                          </th>
                          <th
                            style={{
                              width: "15%",
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Average Price
                          </th>
                          <th
                            style={{
                              width: "15%",
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Highest Price
                          </th>
                          <th
                            style={{
                              width: "10%",
                              padding: "8px",
                              borderBottom: "1px solid #ddd",
                              borderTopRightRadius: "16px",
                            }}
                          >
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {vividTabledata?.sections
                          .filter((event) =>
                            // Show all sections if none are selected, otherwise show only selected ones
                            selectedSections.size === 0
                              ? true
                              : selectedSections.has(event.i)
                          )
                          .filter((event) => event.a !== "0")
                          .map((event, index, filteredArray) => {
                            const lastIndexNumber =
                              index === filteredArray.length - 1;

                            return (
                              <tr key={index}>
                                <td
                                  style={{
                                    width: "13%",
                                    padding: "8px",
                                    borderBottom: lastIndexNumber
                                      ? "1px solid black"
                                      : "none",
                                    borderRight: "1px solid black",
                                    borderLeft: "1px solid black",
                                    borderBottomLeftRadius: lastIndexNumber
                                      ? "16px"
                                      : null,
                                    textAlign: "center",
                                    color: darkMode ? "#fff" : "#000",
                                    fontSize: "16px",
                                  }}
                                >
                                  {event.n}
                                </td>
                                <td
                                  style={{
                                    width: "16%",
                                    padding: "8px",
                                    borderBottom: lastIndexNumber
                                      ? "1px solid black"
                                      : "none",
                                    borderRight: "1px solid black",
                                    textAlign: "center",
                                    color: darkMode ? "#fff" : "#000",
                                    fontSize: "16px",
                                  }}
                                >
                                  ${event.l}
                                </td>
                                <td
                                  style={{
                                    width: "10%",
                                    padding: "8px",
                                    borderBottom: lastIndexNumber
                                      ? "1px solid black"
                                      : "none",
                                    borderRight: "1px solid black",
                                    textAlign: "center",
                                    color: darkMode ? "#fff" : "#000",
                                    fontSize: "16px",
                                  }}
                                >
                                  ${event.l}
                                </td>
                                <td
                                  style={{
                                    width: "15%",
                                    padding: "8px",
                                    borderBottom: lastIndexNumber
                                      ? "1px solid black"
                                      : "none",
                                    borderRight: "1px solid black",
                                    textAlign: "center",
                                    color: darkMode ? "#fff" : "#000",
                                    fontSize: "16px",
                                  }}
                                >
                                  ${event.h}
                                </td>
                                <td
                                  style={{
                                    width: "15%",
                                    padding: "8px",
                                    borderBottom: lastIndexNumber
                                      ? "1px solid black"
                                      : "none",
                                    borderBottomRightRadius: lastIndexNumber
                                      ? "16px"
                                      : null,
                                    borderRight: "1px solid black",
                                    textAlign: "center",
                                    color: darkMode ? "#fff" : "#000",
                                    fontSize: "16px",
                                  }}
                                >
                                  {event.q}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </DialogContent>
            </div>
          </div>
          <div className="absolute bottom-4 left-4">
            <button
              onClick={handleCloseModal}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg
          ${
            darkMode
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }
          transition-colors duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
