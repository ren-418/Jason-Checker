import { useState, useEffect } from "react";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  arrayUnion,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import XIcon from "../icons/XIcon";
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  Input,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  ListItemButton,
} from "@mui/material";

export default function TemplateManager({
  filter,
  email,
  eventId,
  venueId,
  setTableState,
  tableState,
  handleSubmit,
}) {
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (!venueId || !email) return;

    const fixedVenueId = venueId.toString().replace(/\//g, "-");
    const docRef = doc(db, "Template", `${email}-${fixedVenueId}`);

    const unsub = onSnapshot(
      docRef,
      (docSnapshot) => {
        setTemplates(
          docSnapshot.exists() ? docSnapshot.data().templates ?? [] : []
        );
      },
      (error) => {
        console.error("Error fetching templates:", error);
        setTemplates([]);
      }
    );

    return () => unsub();
  }, [venueId, email]);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false);
    setTemplateName("");
    setSelectedTemplate(null);
  };

  const handleCreateTemplate = async () => {
    if (!templateName.trim()) return;

    const fixedVenueId = venueId.toString().replace(/\//g, "-");
    const query = doc(db, "Template", `${email}-${fixedVenueId}`);

    const template = {
      templateName: templateName.trim(),
      filter: filter,
      eventId: eventId,
    };

    await setDoc(
      query,
      {
        templates: arrayUnion(template),
        venueId: venueId,
        email: email,
      },
      { merge: true }
    );

    setTemplateName("");
  };

  const handleDeleteTemplate = async (templateToDelete) => {
    const fixedVenueId = venueId.toString().replace(/\//g, "-");
    const docRef = doc(db, "Template", `${email}-${fixedVenueId}`);

    await updateDoc(docRef, {
      templates: arrayRemove(templateToDelete),
    });

    if (
      selectedTemplate &&
      selectedTemplate.templateName === templateToDelete.templateName
    ) {
      setSelectedTemplate(null);
    }
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;

    const filters = selectedTemplate.filter;
    const filterKeys = Object.keys(filters);
    let newFilters = [];
    for (let i = 0; i < filterKeys.length; i++) {
      newFilters.push(filters[filterKeys[i]]);
    }

    let selectedPaths = filters[0]?.sections;
    if (selectedPaths === undefined) {
      selectedPaths = [];
    }

    const templateState = {
      data: newFilters,
      selectedRow: 0,
      selectedPaths: selectedPaths,
      sections: tableState.sections,
    };

    setTableState(templateState);
    handleCloseModal();
    handleSubmit(templateState);
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="bg-[#670004] rounded-[9px] cursor-pointer py-1 px-5 !text-white text-sm uppercase w-36"
      >
        Templates
      </button>

      <Dialog
        id="templateManagerDialog"
        open={open}
        onClose={handleCloseModal}
        fullWidth={true}
        maxWidth="sm"
      >
        <div className="bg-[#DBDBDB] dark:bg-[#222222] text-white rounded-xl pb-1">
          <div className="flex items-center justify-between !bg-[#C5C5C5] dark:!bg-[#2c2c2c] rounded-t-xl py-2 px-3">
            <div className="flex flex-grow text-center">
              <p className="text-[#3C3C3C] dark:text-white m-0 flex-1 text-[14px] font-bold">
                Template Manager
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
            <div className="w-full flex flex-col items-center">
              <FormControl
                size="small"
                disabled={selectedTemplate !== null}
                style={{
                  border:
                    selectedTemplate !== null
                      ? "2px solid #6C757D"
                      : "2px solid rgb(103,0,4)",
                }}
                className="w-3/4 text-ellipsis bg-[#6C757D] dark:bg-[rgb(21,21,21)] rounded-[16px]"
              >
                {templateName.length === 0 && (
                  <InputLabel shrink={false}>
                    <span className="text-white">Template Name</span>
                  </InputLabel>
                )}
                <Input
                  id="name"
                  classes={{
                    input:
                      "!text-white !p-2 disabled:!bg-[#C5C5C5] dark:disabled:!bg-[#2c2c2c] rounded-[16px] disabled:cursor-not-allowed",
                  }}
                  disableUnderline={true}
                  value={templateName}
                  autoFocus={true}
                  disabled={selectedTemplate !== null}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </FormControl>
              <button
                type="button"
                onClick={handleCreateTemplate}
                disabled={!templateName.trim() || selectedTemplate !== null}
                style={{
                  background:
                    !templateName.trim() && selectedTemplate == null
                      ? "rgb(103,0,4)"
                      : "",
                }}
                className="w-fit rounded-2xl bg-[rgb(103,0,4)] disabled:bg-[#C5C5C5] dark:disabled:bg-[#2c2c2c] disabled:cursor-not-allowed text-md px-5 py-1 mt-5 cursor-pointer"
              >
                Save Template
              </button>
            </div>

            {templates.length > 0 && (
              <>
                <hr className="my-4 border border-[#C5C5C5] dark:border-[#2c2c2c] rounded-xl" />
                <div className="w-full flex flex-col">
                  <h6 className="text-center text-[#3C3C3C] dark:text-white mb-3">
                    Existing Templates
                  </h6>
                  <List
                    className="space-y-1"
                    style={{
                      cursor:
                        templateName.length > 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    {templates.map((template) => (
                      <ListItemButton
                        key={template.templateName}
                        disabled={templateName.length > 0}
                        selected={
                          selectedTemplate?.templateName ===
                          template.templateName
                        }
                        onClick={() =>
                          setSelectedTemplate(
                            selectedTemplate?.templateName !==
                              template.templateName
                              ? template
                              : null
                          )
                        }
                        className="w-full !pl-2 !rounded-lg"
                      >
                        <ListItemText
                          primary={template.templateName}
                          className="text-[#3C3C3C] dark:text-white"
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteTemplate(template)}
                          >
                            <DeleteIcon className="text-[#3C3C3C] dark:text-white" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItemButton>
                    ))}
                  </List>
                </div>
              </>
            )}
          </DialogContent>
          <DialogActions>
            {templates.length > 0 && (
              <button
                onClick={handleApplyTemplate}
                disabled={!selectedTemplate || templateName.length > 0}
                style={{
                  background:
                    !selectedTemplate && templateName.length === 0
                      ? "rgb(103,0,4)"
                      : "",
                }}
                className="bg-[#670004] disabled:bg-[#C5C5C5] dark:disabled:bg-[#2c2c2c] disabled:cursor-not-allowed rounded-full cursor-pointer py-1 px-5 !text-white text-sm uppercase"
              >
                Apply and Save Selected Template
              </button>
            )}
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
