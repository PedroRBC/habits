export function generateProgress(total: number = 0, completed: number = 0) {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}
