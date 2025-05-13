import React, { useState, useEffect } from "react";
import {
  Dialog,
  IconButton,
  Slider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  PlayCircleFilled as PlayIcon,
} from "@material-ui/icons";
import { auth, storage } from "../../firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

import close from "../../assets/close.png";
import warning from "../../assets/Group 1.png";

const DEFAULT_SOUNDS = [
  "Default.mp3",
  "metro_msm.mp3",
  "Boat_Horn.mp4",
  "short_bongo.mp3",
  "airplane_chime.mp3",
  "tick.mp3",
  "chime.mp3",
  "boop.mp3",
  "arpeggio.mp3",
  "sweet_text.mp3",
  "argon.mp3",
];

const NotificationDialog = ({ open, onClose, eventId }) => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [selectedSound, setSelectedSound] = useState("Default.mp3");
  const [anchorEl, setAnchorEl] = useState(null);
  const [desktopNotifications, setDesktopNotifications] = useState(false);
  const firestore = getFirestore();

  useEffect(() => {
    let unsubscribeFromAuth = null;
    let unsubscribeFromFirestore = null;

    unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.email);

        const userDocRef = doc(firestore, "userSounds2", user.email);

        // Using onSnapshot for real-time updates
        unsubscribeFromFirestore = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (eventId && data[eventId]) {
              setSelectedSound(data[eventId].selectedSound);
              setVolume(data[eventId].volume);
              setDesktopNotifications(data.desktopNotifications || false);
            } else if (!eventId) {
              setSelectedSound(data.selectedSound || DEFAULT_SOUNDS[0]);
              if (data.volume !== undefined) {
                setVolume(data.volume);
              } else {
                setVolume(0.5);
              }
              setDesktopNotifications(data.desktopNotifications || false);
            } else {
              setSelectedSound(DEFAULT_SOUNDS[0]);
              setVolume(0.5);
              setDesktopNotifications(data.desktopNotifications || false);
            }
          }
        });
      } else {
        setUserId(null);
      }
    });

    return () => {
      if (unsubscribeFromAuth) unsubscribeFromAuth();
      if (unsubscribeFromFirestore) unsubscribeFromFirestore();
    };
  }, []);

  const fetchAudioFiles = async () => {
    const userFilesRef = ref(storage, `audios2/${userId}`);
    const defaultSoundsRefs = DEFAULT_SOUNDS.map((sound) =>
      ref(storage, `default_sounds/${sound}`)
    );

    let defaultSoundData = await Promise.all(
      defaultSoundsRefs.map(async (soundRef) => {
        return {
          url: await getDownloadURL(soundRef),
          name: soundRef.name,
        };
      })
    );

    listAll(userFilesRef).then((res) => {
      setAudioFiles([...defaultSoundData, ...res.items]);
    });
  };

  const saveDataToFirestore = async (uid, sound, vol, desktopNotif) => {
    const userDocRef = doc(firestore, "userSounds2", uid);
    let payload;
    try {
      if (eventId) {
        payload = {
          selectedSound: sound,
          volume: vol,
        };
        await setDoc(
          userDocRef,
          {
            [eventId]: payload,
            desktopNotifications: desktopNotif,
          },
          { merge: true }
        );
      } else {
        payload = {
          selectedSound: sound,
          volume: vol,
          desktopNotifications: desktopNotif,
        };
        await setDoc(userDocRef, payload, { merge: true });
      }
    } catch (e) {}
  };

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    const fileRef = ref(storage, `audios2/${userId}/${file.name}`);
    await uploadBytes(fileRef, file);
    fetchAudioFiles();
  };

  const handleDelete = async (fileName) => {
    const fileRef = ref(storage, `audios2/${userId}/${fileName}`);
    await deleteObject(fileRef);
    fetchAudioFiles();

    if (selectedSound === fileName) {
      setSelectedSound(DEFAULT_SOUNDS[0]);
      saveDataToFirestore(userId, DEFAULT_SOUNDS[0], volume);
    }
  };

  const handlePlay = async (file) => {
    let url;
    if (typeof file === "object") {
      url = file.url;
    } else {
      const fileRef = ref(storage, `audios2/${userId}/${file}`);
      url = await getDownloadURL(fileRef);
    }
    const audio = new Audio(url);
    audio.volume = Math.min(Math.max(volume, 0), 1);
    audio.play();
  };

  useEffect(() => {
    if (!open) return;
    if (userId) fetchAudioFiles();
  }, [userId, open]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (fileName) => {
    setSelectedSound(fileName);
    handleClose();

    if (userId) {
      saveDataToFirestore(userId, fileName, volume, desktopNotifications);
    }
  };

  const isSpecialUserAgent = () => {
    return navigator.userAgent.includes("Phantom");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      // size
      PaperProps={{
        style: {
          backgroundColor: "#222222",
          borderRadius: "15px",
        },
      }}
    >
      <div
        style={{
          backgroundColor: "#222222",
          padding: "0px",
        }}
        id="audioFiles"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#2d2d2d",
            borderRadius: "40px",
            padding: "5px 10px",
            position: "relative",
          }}
        >
          <p
            style={{
              color: "#e7e7e7",
              fontWeight: "bold",
              margin: 0,
              marginLeft: "5px",
              flex: 1,
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Manage Audio Files
          </p>
          <button
            style={{
              backgroundColor: "#515151",
              border: "none",
              cursor: "pointer",
              position: "absolute",
              right: "5px",
              top: "50%",
              borderRadius: "50%",
              transform: "translateY(-50%)",
              height: "22px",
              width: "22px",
              marginRight: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={onClose}
          >
            <img src={close} alt="close" />
          </button>
        </div>

        <p
          style={{
            color: "#e7e7e7",
            margin: "10px",
            marginLeft: "15px",
            fontSize: "14px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Choose your audio from the drop list below:
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "10px",
            backgroundColor: "#222222",
          }}
        >
          <button
            style={{
              margin: "5px",
              backgroundColor: "#4054AF",
              fontSize: "14px",
              borderRadius: "10px",
              width: "150px",
              color: "#e7e7e7",
              fontFamily: "'Inter', sans-serif",
            }}
            onClick={handleClick}
          >
            {selectedSound || "Default.mp3"}
          </button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              style: {
                backgroundColor: "#222222",
              },
            }}
          >
            {audioFiles.map((file) => {
              const fileName = typeof file === "object" ? file.name : file;
              return [
                <MenuItem
                  key={fileName}
                  onClick={() => handleMenuItemClick(fileName)}
                  style={{ backgroundColor: "#222222" }}
                >
                  <ListItemText
                    style={{ color: "#e7e7e7" }}
                    primary={fileName}
                  />
                  <ListItemIcon>
                    <IconButton onClick={() => handlePlay(file)}>
                      <PlayIcon style={{ color: "#e7e7e7" }} />
                    </IconButton>
                    {!DEFAULT_SOUNDS.includes(fileName) && (
                      <IconButton onClick={() => handleDelete(fileName)}>
                        <DeleteIcon style={{ color: "#e7e7e7" }} />
                      </IconButton>
                    )}
                  </ListItemIcon>
                </MenuItem>,
              ];
            })}
          </Menu>
          <div style={{ margin: "5px", backgroundColor: "#222222" }}>
            <input
              type="file"
              accept="audio/*"
              style={{ display: "none" }}
              id="fileUploader"
              onChange={handleAudioUpload}
            />
            <label htmlFor="fileUploader">
              <button
                style={{
                  margin: "5px",
                  backgroundColor: "#4054AF",
                  fontSize: "14px",
                  borderRadius: "10px",
                  width: "120px",
                  color: "#e7e7e7",
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer", // Ensure the cursor indicates it's clickable
                }}
                onClick={() => document.getElementById("fileUploader").click()} // Trigger file input click on button click
              >
                Upload Audio
              </button>
            </label>
          </div>
        </div>

        <Slider
          value={volume}
          onChange={(e, newValue) => {
            setVolume(newValue);
          }}
          onChangeCommitted={(e, newValue) => {
            if (userId && selectedSound) {
              saveDataToFirestore(
                userId,
                selectedSound,
                newValue,
                desktopNotifications
              );
            }
          }}
          aria-labelledby="volume-slider"
          min={0}
          max={1}
          step={0.01}
          style={{
            width: "92%",
            marginLeft: "10px",
          }}
        />

        <div
          style={{
            border: "1px solid #7a7a7a",
            borderRadius: "10px",
            margin: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px",
              marginBottom: "0px",
            }}
          >
            <Switch
              checked={desktopNotifications}
              onChange={() => {
                if (isSpecialUserAgent()) {
                  const newSetting = !desktopNotifications;
                  setDesktopNotifications(newSetting);
                  if (userId) {
                    saveDataToFirestore(
                      userId,
                      selectedSound,
                      volume,
                      newSetting
                    );
                  }
                }
              }}
              disabled={!isSpecialUserAgent()}
              color="primary" // Adjust the color if needed
              inputProps={{ "aria-label": "controlled" }}
            />
            <span
              style={{
                color: "#e7e7e7",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Desktop Notification
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "20px",
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <img src={warning} alt="warning" />
            <span
              style={{
                color: "#e7e7e7",
                fontSize: "14px",
                marginLeft: "13px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              This featues only works on the Phantom Application.
            </span>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default NotificationDialog;
