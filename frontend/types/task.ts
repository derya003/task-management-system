export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface TaskUser {
  id: number;
  email: string;
}
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  category?: string;
  dueDate?: string;
  dueTime?: string;
  user?: {
    id: number;
    email?: string;
    name?: string;
  };
}
