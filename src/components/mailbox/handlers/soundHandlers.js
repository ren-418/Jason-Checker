import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../firebase";

const DEFAULT_SOUNDS = [
  "Default.mp3",
  "metro_msm.mp3",
  "short_bongo.mp3",
  "airplane_chime.mp3",
  "tick.mp3",
  "chime.mp3",
  "boop.mp3",
  "Boat_Horn.mp4",
  "arpeggio.mp3",
  "sweet_text.mp3",
  "argon.mp3",
];

export async function playNotificationSound(
  quantity,
  eventId,
  eventsInfo,
  user,
  eventUrl,
  soundUrls,
  soundSettings
) {
  const { soundUrl, volume, desktopNotifications } =
    await fetchUserSoundPreference(
      eventId,
      user,
      eventUrl,
      soundUrls,
      soundSettings
    );

  const audio = new Audio(soundUrl);
  audio.volume = volume;
  // audio.play();

  const { name, date, venue } = eventsInfo[eventId];

  let city = "Unknown";
  if (venue) {
    const venueSplit = venue.split(",");
    if (venueSplit.length > 1) {
      city = venueSplit[1].trim();
    }
  }

  const Title = `${name} - ${city} - ${date} (${quantity} tickets found)`;
  const isSpecialUserAgent = () => {
    return navigator.userAgent.includes("Phantom");
  };

  if (isSpecialUserAgent()) {
    if (desktopNotifications && Notification.permission === "granted") {
      new Notification(Title, {
        icon: "logo2.png",
      });
      return;
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted" && desktopNotifications) {
          new Notification(Title, {
            icon: "logo2.png",
          });
        }
        audio.play();
      });

      return;
    }
  } else {
    audio.play();
  }
}

export const fetchUserSoundPreference = async (
  eventId,
  user,
  eventUrl,
  soundUrls,
  soundSettings
) => {
  if (user) {
    let soundData;
    if (eventId && soundSettings.current[eventId]) {
      soundData = soundSettings.current[eventId];
    } else {
      soundData = soundSettings.current;
    }

    const selectedSound = soundData.selectedSound || "Default.mp3";
    let volume =
      soundData.volume !== undefined &&
      soundData.volume !== null &&
      soundData.volume !== ""
        ? soundData.volume
        : 0.5;
    const desktopNotifications = soundData.desktopNotifications || false;

    let soundUrl;
    if (DEFAULT_SOUNDS.includes(selectedSound)) {
      if (eventUrl && eventUrl.includes("axs.com")) {
        soundUrl = soundUrls.current["tick.mp3"];
        volume = 0.5;
      } else {
        soundUrl = soundUrls.current[selectedSound];
      }
    } else {
      const soundRef = ref(storage, `audios2/${user.email}/${selectedSound}`);
      soundUrl = await getDownloadURL(soundRef);
    }

    return { soundUrl, volume, desktopNotifications };
  }
};
