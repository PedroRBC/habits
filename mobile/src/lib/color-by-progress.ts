import { cn } from "./utils";

export function colorByProgress(progress: number) {
  return cn(
    progress === 0 && "bg-zinc-700 border-border",
    progress > 0 && progress < 20 && "bg-violet-500 border-violet-400",
    progress >= 20 && progress < 40 && "bg-violet-600 border-violet-500",
    progress >= 40 && progress < 60 && "bg-violet-700 border-violet-500",
    progress >= 60 && progress < 80 && "bg-violet-800 border-violet-600",
    progress >= 80 && "bg-violet-900 border-violet-700",
  );
}
