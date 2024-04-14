import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Loading } from "@/components/loading";
import { Return } from "@/components/return";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/contexts/store";
import { generateProgress } from "@/lib/generate-progress";
import { AppStackParamList } from "@/router/app.routes";

const WeekDays = [
  "Domingo",
  "Segunda-feria",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

interface DayInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
    avaliableDays: number[];
  }[];
  completedHabits: string[];
}

export function Day() {
  const { top: topInset } = useSafeAreaInsets();
  const { api } = useStore();

  const route = useRoute();
  const { date, dayIs } = route.params as AppStackParamList["Day"];

  const [loading, setLoading] = useState(false);
  const [dayInfo, setDayInfo] = useState<DayInfo>();

  const parsedDate = dayjs(date);
  const dayOfWeek = WeekDays[parsedDate.day()];
  const dayAndMonth = parsedDate.format("DD/MM");

  const DayProgress = dayInfo?.completedHabits.length
    ? generateProgress(
        dayInfo.possibleHabits.length,
        dayInfo.completedHabits.length,
      )
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);
      const { data } = await api.get("habits/day", {
        params: {
          date: parsedDate.format("YYYY-MM-DD"),
        },
      });
      setDayInfo(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleHabit(habitId: string, checked: boolean) {
    try {
      await api.patch(`habits/${habitId}/toggle`);
      setDayInfo((prev) => {
        if (checked) {
          return {
            ...prev!,
            completedHabits: [...prev!.completedHabits, habitId],
          };
        } else {
          return {
            ...prev!,
            completedHabits: prev!.completedHabits.filter(
              (id) => id !== habitId,
            ),
          };
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <View
      className="flex-1 bg-background text-foreground"
      style={{
        paddingTop: topInset,
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <Return />
        <Text className="text-2xl text-primary-foreground font-heading">
          {dayAndMonth}
        </Text>
        <View className="w-8" />
      </View>
      {loading ? (
        <Loading />
      ) : (
        <View className="flex-1 justify-between">
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchHabits} />
            }
            className="flex-1 px-4"
          >
            <Text className="p-4 pt-6 text-foreground text-3xl font-heading">
              {dayOfWeek}
            </Text>

            <Progress value={DayProgress} />

            <View className="pt-6">
              {dayInfo?.possibleHabits
                ? dayInfo.possibleHabits.map((habit) => (
                    <View
                      key={habit.id}
                      className="flex flex-row items-center gap-4 p-4"
                    >
                      <Checkbox
                        checked={dayInfo.completedHabits.includes(habit.id)}
                        disabled={dayIs !== "today"}
                        className="w-9 h-9"
                        onCheckedChange={(checked) =>
                          toggleHabit(habit.id, checked)
                        }
                      />
                      <Text className="text-foreground text-xl">
                        {habit.title}
                      </Text>
                    </View>
                  ))
                : null}
            </View>
          </ScrollView>
          {dayIs !== "today" && (
            <View className="flex-1 justify-center py-10">
              <Text className="text-foreground text-2xl text-center font-body">
                So é possivel marcar habitos como completos no seu dia.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
