export type Tag = "work" | "living" | "personal";

export const TAGS: Tag[] = ["work", "living", "personal"];

export const META = {
  name: "Partin Thoughts",
  author: "Ethan Partin",
  bio: "Personal essays, borrowed wisdom, and observations from the ordinary.",
  since: "April 2026",
  birthDate: new Date(1998, 8, 3),
} as const;
