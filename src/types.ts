export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  date: string; // Creation date
  dueDate: string | null; // New: Due date for the task (e.g., "YYYY-MM-DDTHH:MM")
  timerStartedAt: number | null; // New: Timestamp when timer started (ms)
  pausedAt: number | null; // New: Timestamp when timer was paused (ms)
  elapsedTime: number; // New: Total elapsed time in ms
  alerted?: boolean; // Temporary flag to prevent repeated alerts for due dates
}
