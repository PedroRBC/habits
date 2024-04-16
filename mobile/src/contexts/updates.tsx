import notifee, {
  AndroidColor,
  AndroidImportance,
  type Event,
  EventType,
} from "@notifee/react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import axios from "axios";
import { nativeApplicationVersion } from "expo-application";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import ReactNativeBlobUtil from "react-native-blob-util";

import { askNotificationPermission } from "./notifications";
import { useStore } from "./store";

import { mmkvStorage } from "@/lib/mmkvStorage";

const defaultContext = {
  verifyUpdate: () => {},
};

type Content = typeof defaultContext;

const UpdatesContext = createContext<Content>(defaultContext);

export const UpdatesProvider = ({ children }: PropsWithChildren) => {
  const { status } = useStore();

  async function verifyUpdate() {
    try {
      const releases = await axios.get(
        "https://api.github.com/repos/pedrorbc/habits/releases",
      );
      const latestRelease: string = releases.data[0].tag_name.replace("v", "");
      if (latestRelease !== nativeApplicationVersion) {
        const release = {
          name: releases.data[0].assets[0].name,
          downloadUrl: releases.data[0].assets[0].browser_download_url,
          version: latestRelease,
        };
        mmkvStorage.set("release.version", release.version);
        mmkvStorage.set("release.name", release.name);
        mmkvStorage.set("release.downloadUrl", release.downloadUrl);
        mmkvStorage.set("isUpdated", false);
        notifyUpdate();
      }
    } catch (error) {
      console.error(error);
      crashlytics().recordError(new Error("Failed to verify app update"));
    }
  }

  async function notifyUpdate() {
    const notificationPermission = await askNotificationPermission();
    if (notificationPermission) {
      notifee.displayNotification({
        id: "habits-update",
        title: "Atualize o Habits Tracker!",
        body: "Uma nova versão do Habits Tracker está disponível.",
        android: {
          channelId: "habits-update",
          timestamp: Date.now(),
          showTimestamp: true,
          autoCancel: false,
          smallIcon: "ic_launcher_round",
          pressAction: {
            id: "open_update",
          },
          actions: [
            {
              title: "Atualizar",
              pressAction: {
                id: "update",
              },
            },
            {
              title: "Agora não",
              pressAction: {
                id: "dismiss",
              },
            },
          ],
        },
      });
    }
  }

  function createDownload() {
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: "apk",
    })
      .fetch("GET", mmkvStorage.getString("release.downloadUrl")!)
      .progress((received, total) => {
        notifee.displayNotification({
          id: "habits-update",
          title: "Baixando a atualização...",
          android: {
            channelId: "habits-update",
            timestamp: Date.now(),
            showTimestamp: false,
            autoCancel: false,
            smallIcon: "ic_launcher_round",
            progress: {
              current: Number(received),
              max: Number(total),
            },
          },
        });
      })
      .then((res) => {
        notifee.displayNotification({
          id: "habits-update",
          title: "Atualização baixada!",
          data: {
            path: res.path(),
          },
          android: {
            channelId: "habits-update",
            timestamp: Date.now(),
            showTimestamp: false,
            autoCancel: false,
            smallIcon: "ic_launcher_round",
            progress: undefined,
            actions: [
              {
                title: "Instalar",
                pressAction: {
                  id: "install",
                },
              },
            ],
          },
        });
      });
  }

  async function startUpdate() {
    try {
      createDownload();
    } catch (error) {
      console.error(error);
      crashlytics().recordError(new Error("Failed to download update"));
    }
  }

  function handleNotification({ type, detail }: Event) {
    if (type === EventType.ACTION_PRESS && detail.pressAction?.id) {
      if (
        detail.pressAction.id === "update" &&
        !mmkvStorage.getBoolean("isUpdated")
      ) {
        startUpdate();
      } else if (detail.pressAction.id === "dismiss") {
        notifee.cancelNotification(detail.notification!.id!);
      } else if (detail.pressAction.id === "install") {
        const data: any = detail.notification!.data;
        ReactNativeBlobUtil.android.actionViewIntent(
          data.path,
          "application/vnd.android.package-archive",
        );
      }
    }
  }

  useEffect(() => {
    return notifee.onForegroundEvent((event) => {
      handleNotification(event);
    });
  }, []);
  useEffect(() => {
    return notifee.onBackgroundEvent(async (event) => {
      handleNotification(event);
    });
  }, []);

  // Verify if the app is updated
  useEffect(() => {
    if (status === "authenticated") {
      verifyUpdate();
    }
  }, [status]);

  // Create a channel for update notifications
  useEffect(() => {
    notifee.createChannel({
      id: "habits-update",
      name: "Habits Tracker Update Notification",
      lights: true,
      vibration: false,
      importance: AndroidImportance.HIGH,
      badge: false,
      lightColor: AndroidColor.PURPLE,
    });
  }, []);

  return (
    <UpdatesContext.Provider
      value={{
        verifyUpdate,
      }}
    >
      {children}
    </UpdatesContext.Provider>
  );
};

export function useUpdates() {
  return useContext(UpdatesContext);
}
