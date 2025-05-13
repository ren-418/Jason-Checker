import { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import FilterListIcon from "@material-ui/icons/FilterList";
import BlockIcon from "@material-ui/icons/Block";
import XIcon from "../icons/XIcon";
import { db } from "../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  getDataAccountId,
  getLinkId,
  getSiteId,
  getTicketCode,
} from "../../../HomePage/handlers/urlManipulation";

export default function EventLogs({ url, mainUser }) {
  const [open, setOpen] = useState(false);
  const [urlLogs, setUrlLogs] = useState({});

  const getEventStyle = (eventType) => {
    switch (eventType) {
      case "URL Removal":
        return "bg-[#f44336] hover:bg-[#d32f2f] text-white rounded-[15px]";
      case "URL Addition":
        return "bg-[#4caf50] hover:bg-[#388e3c] text-white rounded-[15px]";
      case "Early Monitor Toggle":
        return "bg-[#ff9800] hover:bg-[#f57c00] text-white rounded-[15px]";
      case "URL Filtered":
        return "bg-[#2196f3] hover:bg-[#1976d2] text-white rounded-[15px]";
      case "URL Disable":
        return "bg-[#9e9e9e] hover:bg-[#616161] text-white rounded-[15px]";
      default:
        return "";
    }
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case "URL Removal":
        return <DeleteIcon className="mr-2" />;
      case "URL Addition":
        return <AddIcon className="mr-2" />;
      case "Early Monitor Toggle":
        return <ToggleOnIcon className="mr-2" />;
      case "URL Filtered":
        return <FilterListIcon className="mr-2" />;
      case "URL Disable":
        return <BlockIcon className="mr-2" />;
      default:
        return null;
    }
  };

  const fetchUrlLogs = async () => {
    const url2 = new URL(url);
    let event_id = url2.pathname.split("/").pop();
    if (url.includes("axs.com")) {
      const match = url.match(/e=(\d+)/);
      if (match) {
        event_id = match[1];
      }
    }

    if (url.includes("mlb.tickets.com") || url.includes("mpv.tickets.com")) {
      let urlObj = new URL(url);
      let searchParams = new URLSearchParams(urlObj.search);
      // eventId = searchParams.get("pid");

      let pId = searchParams.get("pid");

      let event_id2 = searchParams.get("eventId");

      if (pId) {
        event_id = pId;
      } else if (event_id2) {
        event_id = event_id2;
      }
    }

    if (url.includes("evenue.net") && url.includes("SEGetEventInfo")) {
      const siteId = getSiteId(url);
      const dataAccId = getDataAccountId(url);
      const linkId = getLinkId(url);
      const ticketCode = getTicketCode(url);

      event_id = `${siteId}-${linkId}-${ticketCode}-${dataAccId}`;
    } else if (url.includes("evenue.net") && url.includes("/event/")) {
      let urlObj = new URL(url);

      event_id = urlObj.pathname.split("/").slice(-2).join("-");
    }

    const docId = `${mainUser}-${event_id.toString()}`;
    try {
      const logDoc = doc(db, "UrlLogs", docId);
      const logSnap = await getDoc(logDoc);
      if (logSnap.exists()) {
        const data = logSnap.data();

        setUrlLogs({
          urlRemoveLogs: data.urlRemovals || {},
          urlAddLogs: data.urlAdditions || {},
          earlyMonitorToggles: data.earlyMonitorToggles || {},
          urlFilters: data.urlFilters || {},
          urlDisableLogs: data.urlDisables || {},
        });
      } else {
      }
    } catch (error) {
      console.error("Error fetching URL logs:", error);
    }
  };

  const handleOpen = async () => {
    setOpen(true);
    await fetchUrlLogs();
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="bg-[#670004] rounded-[9px] cursor-pointer py-1 px-5 !text-white text-sm uppercase w-36"
      >
        Event Logs
      </button>

      <Dialog
        id="eventLogDialog"
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="url-analytics-dialog-title"
        fullWidth={true}
        maxWidth="md"
      >
        <div className="bg-[#DBDBDB] dark:bg-[#222222] text-white rounded-xl">
          <div className="flex items-center justify-between !bg-[#C5C5C5] dark:!bg-[#2c2c2c] rounded-t-xl py-2 px-3">
            <div className="flex flex-grow text-center">
              <p className="text-[#3C3C3C] dark:text-white m-0 flex-1 text-[14px] font-bold">
                Event Logs
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="bg-black/30 dark:bg-[#595959] rounded-full p-1"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
          <DialogContent>
            <Table className="min-w-[500px] text-white bg-[#CACACA] dark:bg-[#454545] rounded-xl my-10">
              <TableHead>
                <TableRow className="!h-3">
                  <TableCell className="!text-[#3C3C3C] dark:!text-white !font-bold rounded-tl-md !bg-[#BDBDBD] dark:!bg-[#2d2d2d] !text-center !border !border-[#DBDBDB] dark:!border-[#222222]">
                    Timestamp
                  </TableCell>
                  <TableCell className="!text-[#3C3C3C] dark:!text-white !font-bold !bg-[#BDBDBD] dark:!bg-[#2d2d2d] !text-center !border !border-[#DBDBDB] dark:!border-[#222222]">
                    Event
                  </TableCell>
                  <TableCell className="!text-[#3C3C3C] dark:!text-white !font-bold rounded-tr-md !bg-[#BDBDBD] dark:!bg-[#2d2d2d] !text-center !border !border-[#DBDBDB] dark:!border-[#222222]">
                    User
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ...Object.entries(urlLogs.urlRemoveLogs ?? {}),
                  ...Object.entries(urlLogs.urlAddLogs ?? {}),
                  ...Object.entries(urlLogs.earlyMonitorToggles ?? {}),
                  ...Object.entries(urlLogs.urlFilters ?? {}),
                  ...Object.entries(urlLogs.urlDisableLogs ?? {}),
                ]
                  .sort(
                    ([timestampA], [timestampB]) =>
                      new Date(timestampB) - new Date(timestampA)
                  )
                  .map(([timestamp, data]) => {
                    let eventType = "";
                    let eventMatch = false;
                    let eventDetails = "";

                    let event_id2 = data?.event_id;

                    if (url.includes("evenue.net")) {
                      event_id2 = event_id2?.split("-")[0];
                    }

                    if (urlLogs.urlRemoveLogs[timestamp]) {
                      eventType = "URL Removal";
                      eventMatch = data.e === url;
                    } else if (urlLogs.urlAddLogs[timestamp]) {
                      eventType = "URL Addition";
                      eventMatch =
                        Array.isArray(data.e) && data.e.includes(url);
                    } else if (urlLogs.earlyMonitorToggles[timestamp]) {
                      eventType = "Early Monitor Toggle";
                      eventMatch = data.e === url;
                      eventDetails = data.c ? "Enabled" : "Disabled";
                    } else if (urlLogs.urlFilters[timestamp]) {
                      eventType = "URL Filtered";
                      eventMatch = data.e && url.includes(data.e);
                    } else if (urlLogs.urlDisableLogs[timestamp]) {
                      eventType = "URL Disable";
                      eventMatch = data.event_id && url.includes(event_id2);
                    }

                    if (eventMatch) {
                      return (
                        <TableRow key={timestamp}>
                          <TableCell className="!align-middle !text-[#3C3C3C] dark:!text-white !text-lg !text-center !border !border-[#DBDBDB] dark:!border-[#222222] !p-4">
                            {new Date(timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="!align-middle !text-[#3C3C3C] dark:!text-white !text-lg !text-center !border !border-[#DBDBDB] dark:!border-[#222222] !p-4">
                            <div
                              className={`flex items-center ${getEventStyle(
                                eventType
                              )}`}
                            >
                              {getEventIcon(eventType)}
                              <span>{eventType}</span>
                              {eventDetails && (
                                <span className="ml-2">({eventDetails})</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="!align-middle !text-[#3C3C3C] dark:!text-white !text-center !text-lg !border !border-[#DBDBDB] dark:!border-[#222222] !p-4">
                            {data.u}
                          </TableCell>
                        </TableRow>
                      );
                    } else {
                      return null;
                    }
                  })}
              </TableBody>
            </Table>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}
