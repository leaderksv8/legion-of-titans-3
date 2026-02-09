export type Status = "PENDING" | "APPROVED" | "REJECTED" | "DELETED";
export type Type = "thanks";

export type TeamItem = {
  id: number;
  name: string;
  role: string;
  photo: string;
  bio: string;
};

export type NewsGoItem = {
  id: number;
  title: string;
  summary: string;
  source: string;
  time: string;
  url: string;
};

export type EventItem = {
  id: number;
  title: string;
  date: string;
  folder: string;
  cover: string;
  photos: number;
  description: string;
  details: string;
};

export type EventsPayload = {
  uk: { title: string; subtitle: string; note: string; items: EventItem[] };
  en?: { title: string; subtitle: string; note: string; items: EventItem[] };
};

export type Item = {
  id: number;
  type: Type;
  name: string | null;
  email: string | null;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  published_at: string | null;
  deleted_at?: string | null;
};

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
