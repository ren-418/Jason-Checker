import { handleSvgPathClick } from "../../map/mapUtilities";
import { twMerge } from "tailwind-merge";
import { useControls } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut } from "@material-ui/icons";
import SvgLabelList from "../../map/SvgList";
import SvgPaths from "../../map/SvgPath";
import MapDisplay from "../../map";
import { getCurrentUserEmail } from "../../../../firebase";

export default function MapSection({
  className,
  tableState,
  setTableState,
  stubhubId,
  vividUrl,
  darkMode,
  isAxs,
  isMlb,
  isSeatGeek,
  eventLink,
}) {
  const { zoomIn, zoomOut } = useControls();

  const isPaths =
    tableState.paths.length > 0 &&
    tableState.info.length > 0 &&
    tableState.mapid;
  const isAXS = tableState.axsMapInfo;

  return (
    <div
      className={twMerge("flex flex-col w-full h-auto xl:w-full", className)}
    >
      <div
        className={`flex items-center ${
          !isPaths && !isAXS ? "justify-end" : "justify-between"
        } w-full mb-3 -mt-[48px]`}
      >
        <div className={`flex space-x-2 ${!isPaths && !isAXS ? "hidden" : ""}`}>
          <div
            onClick={() => zoomIn()}
            className="cursor-pointer p-1.5 rounded-full bg-[#4054AF]"
          >
            <ZoomIn fontSize="medium" className="w-7 h-7" />
          </div>
          <div
            onClick={() => zoomOut()}
            className="cursor-pointer p-1.5 rounded-full bg-[#4054AF]"
          >
            <ZoomOut fontSize="medium" className="w-7 h-7" />
          </div>
        </div>
        <div className="flex space-x-2">
          {stubhubId && (
            <a
              href={`https://www.stubhub.com/event/${stubhubId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#3F1D74] rounded-[100px] flex justify-center items-center w-[68px] h-[35px] ml-[10px]"
            >
              <img
                src="/stubhubsmall.svg"
                alt="stubhub-seats-logo"
                width="20px"
                height="19px"
              />
            </a>
          )}
          {vividUrl && (
            <a
              href={vividUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black rounded-[100px] flex justify-center items-center w-[68px] h-[35px] ml-[10px]"
            >
              <img
                src="/vividsmall.svg"
                alt="vivid-seats-logo"
                width="20px"
                height="17px"
              />
            </a>
          )}
        </div>
      </div>

      <div className="w-full h-auto overflow-hidden">
        <MapDisplay
          tableState={tableState}
          paths={tableState.paths}
          info={tableState.info}
          mapid={tableState.mapid}
          darkMode={darkMode}
          handleSvgPathClick={(path) =>
            handleSvgPathClick(path, tableState, setTableState)
          }
          selectedPaths={tableState.selectedPaths}
          SvgPaths={SvgPaths}
          SvgLabelList={SvgLabelList}
          axs={isAxs}
          axsMapInfo={tableState.axsMapInfo}
          setSelectedSections={(selectedPaths) =>
            tableState.data.length > 0 && setTableState({ selectedPaths })
          }
          isFilterAvailable={tableState.data.length > 0}
          isMlb={isMlb}
          isSeatGeek={isSeatGeek}
          userEmail={getCurrentUserEmail()}
          eventLink={eventLink}
        />
      </div>
    </div>
  );
}
