import notifee, { AndroidImportance } from "@notifee/react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import dayjs from "dayjs";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { Bell } from "lucide-react-native";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

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

export async function askNotificationPermissionNotify() {
  const existingStatus = await checkGranted();
  if (!existingStatus) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      Toast.show({
        type: "success",
        text1: "Notificações.",
        text2:
          "As notificações estão ativadas, você receberá lembretes diários!",
        props: { icon: Bell },
      });
      return true;
    } else {
      Toast.show({
        type: "error",
        text1: "Notificações.",
        text2:
          "As notificações estão desativadas, ative-as nas configurações do app para receber lembretes!",
        props: { icon: Bell },
      });
      return false;
    }
  } else {
    Toast.show({
      type: "success",
      text1: "Notificações.",
      text2: "As notificações estão ativadas, você receberá lembretes diários!",
      props: { icon: Bell },
    });
    return true;
  }
}

export async function scheduleNotification() {
  const isEnable = mmkvStorage.getBoolean("notifications") ?? false; // Check if notifications are enabled
  if (!isEnable) return;
  const isAllowed = await checkGranted(); // Verify if the user has granted permission to send notifications
  if (!isAllowed) return;

  const channelId = await notifee.createChannel({
    id: "habits-reminder",
    name: "Reminder Notification",
    vibration: false,
    importance: AndroidImportance.DEFAULT,
  });

  notifee.displayNotification({
    id: "habits-reminder",
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
