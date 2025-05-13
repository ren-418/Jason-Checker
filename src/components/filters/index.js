import { useTableEffects } from "./_hooks/useTableEffects";
import { useTableState } from "./_hooks/useTableState";
import { useKeyDown } from "./_hooks/useKeyDown";
import { useEventContext } from "../HomePage/UserDataContext";
import { handleAddRow, handleSubmit } from "./_utils/events";
import { TransformWrapper } from "react-zoom-pan-pinch";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import CloseIcon from "@material-ui/icons/Close";
import NotificationDialog from "../NotifcationManager/Overlay";
import EventLogs from "./_components/blocks/EventLogs";
import Dialog from "./_components/Dialog";
import EventInfo from "./_components/blocks/EventInfo";
import FilterTable from "./_components/blocks/FilterTable";
import NotesSection from "./_components/blocks/NotesSection";
import ExtraFilterOptions from "./_components/blocks/ExtraFilterOptions";
import MapSection from "./_components/blocks/MapSection";
import TemplateManager from "./_components/blocks/TemplateManager";
import {
  PriceUpdateModal,
  PriceUpdateBanner,
} from "./_components/blocks/PriceUpdateBanner";
import "../../css/mapTotal.css";
import EventData from "./_components/blocks/EventData";
import { useRef, useState, useEffect } from "react";

export default function FilterForm({
  eventId,
  handleClose,
  email,
  fullURL,
  eventInfo,
  stubhubId,
  mailBox,
}) {
  const { tableState, setTableState, darkMode, defaultData } = useTableState();
  const { twentyFiveDay, notesDocument, vividIds, mainUser } =
    useEventContext();
  const isShiftDown = useKeyDown("Shift");
  const priceUpdated = useRef(false);
  const [showPriceUpdateModal, setShowPriceUpdateModal] = useState(false);
  const [showPriceUpdateBanner, setShowPriceUpdateBanner] = useState(false);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  const { name, date, venue, eventType } = eventInfo;

  const isTM =
    fullURL.includes("ticketmaster") || fullURL.includes("livenation");

  useTableEffects(
    tableState,
    setTableState,
    defaultData,
    fullURL,
    eventId,
    twentyFiveDay,
    eventType,
    mainUser,
    isTM
  );

  useEffect(() => {
    if (!filtersLoaded || !isTM || priceUpdated.current) return;

    if (tableState.data && !tableState.filterTotalPrice) {
      priceUpdated.current = true;
      setShowPriceUpdateModal(true);
      setShowPriceUpdateBanner(true);
    }
  }, [filtersLoaded, tableState.data, isTM]);

  useEffect(() => {
    if (tableState.data && tableState.data.length > 0) {
      setFiltersLoaded(true);
    }
  }, [tableState.data]);

  const isAxs = fullURL.includes("axs");
  const isMlb =
    fullURL.includes("mlb.tickets.com") || fullURL.includes("mpv.tickets.com");
  const isSeatGeek = fullURL.includes("seatgeek.com");

  const vividUrl = vividIds[eventId] ?? "";

  const closeDialog = (e) => {
    if (e) {
      e.stopPropagation();
    }

    if (!mailBox) {
      if (window.tidioChatApi) window.tidioChatApi.display(true);
    }
    handleClose();
  };

  const handleClosePriceUpdateModal = () => {
    setShowPriceUpdateModal(false);
  };

  return (
    <Dialog
      open={true}
      onClose={closeDialog}
      disableEscapeKeyDown
      disableBackdropClick
    >
      <NotificationDialog
        open={tableState.isNotificationDialogOpen}
        onClose={() => setTableState({ isNotificationDialogOpen: false })}
        eventId={eventId}
      />
      <PriceUpdateModal
        open={showPriceUpdateModal}
        onClose={handleClosePriceUpdateModal}
      />
      <Dialog.Header>
        <div className="flex items-center space-x-3 w-52">
          <div className="flex flex-col items-center space-y-3 w-full">
            <EventLogs url={fullURL} mainUser={email} />
            {isTM && (
              <>
                <TemplateManager
                  filter={tableState.data}
                  email={email}
                  eventId={eventId}
                  venueId={tableState.mapid}
                  setTableState={setTableState}
                  tableState={tableState}
                  handleSubmit={(state) => {
                    handleSubmit(
                      undefined,
                      state,
                      email,
                      eventId,
                      handleClose,
                      fullURL,
                      isTM
                    );
                  }}
                />
              </>
            )}
          </div>
          <VolumeUpIcon
            fontSize="large"
            className="bg-black/30 dark:bg-white/20 p-1.5 rounded-full border hover:bg-black/25 dark:hover:bg-transparent transition-all duration-300 ease-in-out cursor-pointer border-white/20"
            onClick={() => setTableState({ isNotificationDialogOpen: true })}
          />
        </div>
        <EventInfo
          name={name}
          date={date}
          venue={venue}
          fullURL={fullURL}
          price={eventInfo.priceRange}
        />
        <div className="flex items-center justify-end">
          <CloseIcon
            fontSize="large"
            className="bg-black/30 dark:bg-white/20 p-1.5 rounded-full border hover:bg-black/25 dark:hover:bg-transparent transition-all duration-300 ease-in-out cursor-pointer border-white/20"
            onClick={closeDialog}
          />
        </div>
      </Dialog.Header>
      <Dialog.Body
        onSubmit={(e) =>
          handleSubmit(
            e,
            tableState,
            email,
            eventId,
            handleClose,
            fullURL,
            isTM
          )
        }
      >
        <div className="flex flex-col min-h-full">
          {showPriceUpdateBanner && <PriceUpdateBanner />}
          <FilterTable
            tableState={tableState}
            setTableState={setTableState}
            twentyFiveDay={twentyFiveDay}
            isTM={isTM}
            onAddFilter={() =>
              handleAddRow(
                defaultData,
                tableState,
                setTableState,
                twentyFiveDay,
                false,
                false,
                eventType,
                fullURL,
                isTM
              )
            }
            priceUpdated={priceUpdated}
            changeVF={eventInfo.faceValueExchange || false}
          />
          <TransformWrapper
            initialScale={1}
            initialPositionX={0}
            initialPositionY={0}
            disabled={isShiftDown}
          >
            <MapSection
              className="flex xl:hidden mt-24"
              tableState={tableState}
              setTableState={setTableState}
              stubhubId={stubhubId}
              vividUrl={vividUrl}
              darkMode={darkMode}
              isAxs={isAxs}
              isMlb={isMlb}
              isSeatGeek={isSeatGeek}
              eventLink={fullURL}
            />
          </TransformWrapper>

          <div className="mt-4 xl:mt-20">
            <div className="flex flex-col items-center xl:flex-row xl:items-start w-full justify-center xl:justify-between space-y-10 xl:space-y-0 xl:space-x-10">
              <div className="w-full max-w-[500px] xl:w-1/2">
                <NotesSection
                  notesDocument={notesDocument}
                  userEmail={email}
                  eventId={eventId}
                />
              </div>
              <ExtraFilterOptions
                tableState={tableState}
                setTableState={setTableState}
                defaultData={defaultData}
                twentyFiveDay={twentyFiveDay}
                fullURL={fullURL}
                changeVF={eventInfo.faceValueExchange || false}
              />
            </div>
          </div>
          <EventData vividUrl={vividUrl} />
        </div>

        <div className="w-full flex flex-col justify-between space-y-5">
          <TransformWrapper
            initialScale={1}
            initialPositionX={0}
            initialPositionY={0}
            disabled={isShiftDown}
          >
            <MapSection
              className="hidden xl:flex"
              tableState={tableState}
              setTableState={setTableState}
              stubhubId={stubhubId}
              vividUrl={vividUrl}
              darkMode={darkMode}
              isAxs={isAxs}
              isMlb={isMlb}
              isSeatGeek={isSeatGeek}
              eventLink={fullURL}
            />
          </TransformWrapper>

          <button
            type="submit"
            className="w-fit rounded-2xl bg-[rgb(103,0,4)] text-md px-5 py-1 self-end hidden xl:block"
          >
            Submit
          </button>
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
