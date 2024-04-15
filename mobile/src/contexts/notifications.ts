import notifee, { AndroidImportance } from "@notifee/react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import dayjs from "dayjs";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { useEffect } from "react";

import { mmkvStorage } from "@/lib/mmkvStorage";

const BACKGROUND_FETCH_TASK = "habits-tracker-background-notification";

async function checkGranted() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus !== "granted") {
    return false;
  } else {
    return true;
  }
}

export async function askNotificationPermission() {
  const existingStatus = await checkGranted();
  if (!existingStatus) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

export async function scheduleNotification() {
  const isEnable = mmkvStorage.getBoolean("notifications") ?? false; // Check if notifications are enabled
  if (!isEnable) return;
  const isAllowed = await checkGranted(); // Verify if the user has granted permission to send notifications
  if (!isAllowed) return;

  const channelId = await notifee.createChannel({
    id: "habits-tracker",
    name: "Habits Tracker 2",
    vibration: false,
    importance: AndroidImportance.DEFAULT,
  });

  notifee.displayNotification({
    id: `${mmkvStorage.getString("user.id")}-reminder`,
    title: `Olá, <strong>${mmkvStorage.getString("user.name")}</strong>`,
    subtitle: "Lembrete diário!",
    body: `Não se esqueça de marcar seus hábitos hoje!`,
    data: {
      date: dayjs().toISOString(),
    },
    android: {
      channelId,
      smallIcon: "ic_launcher_round",
      pressAction: {
        id: "open_day",
      },
    },
  });
}

export function EnableNotifications() {
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    await scheduleNotification();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    registerBackgroundFetchTask();
  }, []);

  async function registerBackgroundFetchTask() {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 12 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (error) {
      console.error("Failed to register background fetch task:", error);
      crashlytics().recordError(
        new Error("Failed to register background fetch task", error!),
      );
    }
  }
}
