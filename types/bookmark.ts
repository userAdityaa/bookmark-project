import { ListItem } from "./listItem";
import { User } from "./user";

export interface Bookmark {
    id: number;
    name: string;
    icon: string;
    listItems: ListItem[];
    createdAt: Date;
    userId: number;
    user: User;
  }
  