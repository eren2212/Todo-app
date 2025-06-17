export type User = {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
};

export enum TaskCategory {
  Work = "İş",
  Personal = "Kişisel",
  Shopping = "Alışveriş",
  Health = "Sağlık",
  Other = "Diğer",
  Finance = "Finans",
  Learning = "Öğrenme",
}

export enum TaskPriority {
  Low = "Düşük",
  Medium = "Orta",
  High = "Yüksek",
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
