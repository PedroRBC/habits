"use client";

import { useApi } from "@/lib/axios";
import { FormEvent, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { DialogFooter } from "./ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

const avaiableWeekDays = [
  "Domingo",
  "Segunda-feria",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function NewHabitForm() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const api = useApi();

  async function createNewHabit(event: FormEvent) {
    event.preventDefault();

    if (!title || weekDays.length === 0) return;

    await api.post("habits", {
      title,
      weekDays,
    });
    setTitle("");
    setWeekDays([]);
  }

  function handelToggleWeekDay(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      const newWeekDays = weekDays.filter((day) => day !== weekDay);
      setWeekDays(newWeekDays);
    } else {
      const newWeekDays = [...weekDays, weekDay];

      setWeekDays(newWeekDays);
    }
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu comprometimento
      </label>

      <input
        type="text"
        id="title"
        placeholder="ex.: Ler, Estudar, Dormir bem, etc... "
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-800 focus:ring-offset-2 focus:ring-offset-zinc-900"
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="mt-3 flex flex-col gap-2">
        {avaiableWeekDays.map((weekDay, i) => {
          return (
            <div key={weekDay} className="flex items-center gap-3">
              <Checkbox
                checked={weekDays.includes(i)}
                onCheckedChange={() => handelToggleWeekDay(i)}
              />
              <span className="text-white leading-tight">{weekDay}</span>
            </div>
          );
        })}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Criar Hábito</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
