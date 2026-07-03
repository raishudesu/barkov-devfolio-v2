export interface Profile {
  id: 1;
  name: string;
  position: string;
  about_paragraphs: string[];
  email: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface TechStackItem {
  id: number;
  category: "frontend" | "backend" | "developer_tools";
  name: string;
  sort_order: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  tech_stack: string[];
  image_url: string | null;
  sort_order: number;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  is_current: boolean;
  date_start: string;
  date_end: string | null;
  sort_order: number;
}

export interface Social {
  id: number;
  name: string;
  url: string;
  icon_name: string;
  sort_order: number;
}
