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
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="default">Create Habit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Criar Hábito </DialogTitle>
        </DialogHeader>
        <NewHabitForm />
      </DialogContent>
    </Dialog>
  );
}
