import type {Category} from "@/domain/entities/category";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-sofa",
    slug: "sofa",
    name: "Sofa",
    room: "living-room",
    blurb: "Deep-seated sofas built for slow afternoons.",
    status: "published",
  },
  {
    id: "cat-lounge-chair",
    slug: "lounge-chair",
    name: "Lounge Chair",
    room: "living-room",
    blurb: "A single seat, endlessly inviting.",
    status: "published",
  },
  {
    id: "cat-coffee-table",
    slug: "coffee-table",
    name: "Coffee Table",
    room: "living-room",
    blurb: "The quiet centerpiece of every living room.",
    status: "published",
  },
  {
    id: "cat-dining-table",
    slug: "dining-table",
    name: "Dining Table",
    room: "dining-room",
    blurb: "Gather around solid timber, built to last generations.",
    status: "published",
  },
  {
    id: "cat-dining-chair",
    slug: "dining-chair",
    name: "Dining Chair",
    room: "dining-room",
    blurb: "Considered comfort for long dinners.",
    status: "published",
  },
  {
    id: "cat-bed-frame",
    slug: "bed-frame",
    name: "Bed Frame",
    room: "bed-room",
    blurb: "A calm foundation for rest.",
    status: "published",
  },
];
