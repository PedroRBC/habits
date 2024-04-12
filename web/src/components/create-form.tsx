"use client";

import { useApi } from "@/lib/axios";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  weekDays: z.array(z.number().min(0).max(6)).nonempty(),
});

const avaiableWeekDays = [
  "Domingo",
  "Segunda-feria",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function NewHabitForm({ closeDialog }: { closeDialog: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      weekDays: [],
    },
  });
  const api = useApi();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await api.post("habits", {
      title: values.title,
      weekDays: values.weekDays,
    });
    closeDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                Qual seu comprometimento
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="ex.: Ler, Estudar, Dormir bem, etc... "
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weekDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Qual a recorrência?</FormLabel>
              {avaiableWeekDays.map((weekDay, i) => (
                <FormField
                  key={i}
                  control={form.control}
                  name={"weekDays"}
                  render={({ field }) => (
                    <FormItem
                      key={i}
                      className="flex flex-row items-start space-x-3 space-y-1"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(i)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, i])
                              : field.onChange(
                                  field.value?.filter((day) => day !== i),
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel>{weekDay}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button type="submit">Criar Hábito</Button>
        </div>
      </form>
    </Form>
  );
}
