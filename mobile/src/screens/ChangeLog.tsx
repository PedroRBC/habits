import axios from "axios";
import dayjs from "dayjs";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { Return } from "@/components/return";

type log = {
  id: string;
  url: string;
  version: string;
  published_at: string;
  body: string;
};

export function ChangeLog() {
  const { top: topInset } = useSafeAreaInsets();
  const [logs, setLogs] = useState<log[]>([]);

  async function fetchLogs() {
    try {
      const res = await axios.get(
        "https://api.github.com/repos/pedrorbc/habits/releases",
      );
      const logs = res.data.map((log: any) => ({
        id: log.id,
        url: log.html_url,
        version: log.tag_name,
        published_at: log.published_at,
        body: log.body.split("\r\n\r\n**Full Changelog**")[0],
      }));
      setLogs(logs);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Ops",
        text2: "Não foi possível carregar o registro de alterações.",
      });
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <View className="flex-1 bg-background text-foreground">
      <View
        className="flex-row items-center justify-between bg-secondary rounded-b-[32px] px-6 mb-10"
        style={{
          paddingTop: topInset + 16,
          paddingBottom: 16,
        }}
      >
        <Return />
        <Text className="text-2xl text-foreground font-heading">
          Change Log
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 gap-8">
        {logs.map((log) => (
          <TouchableOpacity
            key={log.id}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(log.url)}
          >
            <View className="gap-4">
              <Text className="text-foreground text-2xl font-heading">
                {log.version} - {dayjs(log.published_at).format("DD/MM/YYYY")}
              </Text>
              <View className="p-2 gap-[6px]">
                <Text className="text-foreground font-body text-lg">
                  {log.body}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
