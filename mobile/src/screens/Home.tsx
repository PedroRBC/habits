import { useFocusEffect, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useCallback, useContext, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "@/components/header";
import { Loading } from "@/components/loading";
import { StoreContext } from "@/contexts/store";
import { colorByProgress } from "@/lib/color-by-progress";
import { generateRangeDatesFromYearStart } from "@/lib/generate-dates";
import { generateProgress } from "@/lib/generate-progress";
import { cn } from "@/lib/utils";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const DAY_SIZE = Dimensions.get("screen").width / 7 - ((24 * 2) / 5 + 5);

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
};

export function Home() {
  const { top: topInset } = useSafeAreaInsets();
  const { api } = useContext(StoreContext);
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    summary: Date[];
    marked: Summary[];
  }>({ summary: [], marked: [] });

  async function fetchData() {
    try {
      loading === false && setLoading(true);
      const res = await api.get("habits/summary");
      const summary = await generateRangeDatesFromYearStart();
      setSummary({ summary, marked: res.data });
    } catch (err) {
      Alert.alert("Ops", "Não foi possível carregar o sumário de hábitos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: topInset,
      }}
    >
      <Header />
      <View className="flex-1 px-6">
        <View className="flex-row mt-6 mb-2 ">
          {weekDays.map((weekDay, i) => (
            <Text
              key={`${weekDay}-${i}`}
              className="text-foreground text-xl font-bold text-center mx-1"
              style={{ width: DAY_SIZE }}
            >
              {weekDay}
            </Text>
          ))}
        </View>
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={summary.summary}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchData} />
            }
            keyExtractor={(date: Date) => date.toISOString()}
            contentContainerClassName="flex-1 flex-row  flex-wrap justify-center"
            renderItem={({ item: date }) => {
              const dayInSummary = summary.marked.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });

              const habitsProgress = generateProgress(
                dayInSummary?.amount,
                dayInSummary?.completed,
              );

              const dayIs = dayjs(date).isSame(dayjs(), "day")
                ? "today"
                : dayjs(date).isBefore(dayjs())
                  ? "before"
                  : "after";
              return (
                <TouchableOpacity
                  className={cn(
                    "rounded-lg border-2 m-1",
                    colorByProgress(habitsProgress),
                    dayIs === "today" && " border-foreground bg-zinc-500",
                    dayIs === "after" && "bg-zinc-600/40 border-border",
                  )}
                  onPress={() =>
                    navigate("Day", { date: date.toISOString(), dayIs })
                  }
                  activeOpacity={0.7}
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              );
            }}
          />
        )}
      </View>
    </View>
  );
}
