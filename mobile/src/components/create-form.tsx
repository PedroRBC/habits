import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useStore } from "@/contexts/store";

const avaiableWeekDays = [
  "Domingo",
  "Segunda-feria",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "O hábito deve ter no mínimo 2 caracteres",
    })
    .max(50, {
      message: "O hábito deve ter no máximo 50 caracteres",
    }),
  weekDays: z
    .array(
      z
        .number()
        .min(0, {
          message: "Deve escolher pelo menos um dia da semana",
        })
        .max(6),
    )
    .nonempty({
      message: "Deve escolher pelo menos um dia da semana",
    }),
});

export function CreateForm() {
  const { api } = useStore();
  const { goBack } = useNavigation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      weekDays: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await api.post("/habits", values);
      form.reset();
      goBack();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <View className="flex-1 px-4 py-4 justify-around gap-6">
        <View className="gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormInput
                label="Qual seu comprometimento?"
                placeholder="ex.: Ler, Estudar, Dormir bem, etc..."
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="weekDays"
            render={({ field }) => (
              <FormItem className="gap-3">
                <FormLabel nativeID={field.name}>Qual a recorrência?</FormLabel>
                {avaiableWeekDays.map((weekDay, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name="weekDays"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-3 ">
                        <Checkbox
                          aria-labelledby={field.name}
                          checked={field.value?.includes(index)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, index])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== index,
                                  ),
                                );
                          }}
                        />
                        <Label
                          className="py-2 px-px"
                          nativeID={`weekDays.${index}`}
                        >
                          {weekDay}
                        </Label>
                      </FormItem>
                    )}
                  />
                ))}

                <FormMessage />
              </FormItem>
            )}
          />
        </View>
        <Button className="rounded-lg" onPress={form.handleSubmit(onSubmit)}>
          <Text className="text-foreground">Criar</Text>
        </Button>
      </View>
    </Form>
  );
}
