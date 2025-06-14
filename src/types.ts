export type User = {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
};

export enum TaskCategory {
  Work = "Work",
  Personal = "Personal",
  Shopping = "Shopping",
  Health = "Health",
  Other = "Other",
  Finance = "Finance",
  Learning = "Learning",
}

export enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export type Task = {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  category?: TaskCategory;
  dueDate?: Date;
  priority?: TaskPriority;
};
