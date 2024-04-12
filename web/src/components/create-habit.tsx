"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { NewHabitForm } from "./create-form";

export function CreateHabit() {
  const [open, setOpen] = useState(false);

  const closeDialog = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="default">Create Habit</Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl w-full">
        <DialogHeader>
          <DialogTitle> Criar Hábito </DialogTitle>
        </DialogHeader>
        <NewHabitForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
