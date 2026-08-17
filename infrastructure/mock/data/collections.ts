import type {Collection} from "@/domain/entities/collection";

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "col-solana",
    slug: "solana",
    name: "Solana",
    description: "Warm timber and hand-loomed textile, made for sunlit rooms.",
    status: "active",
    visibility: "visible",
  },
  {
    id: "col-meridian",
    slug: "meridian",
    name: "Meridian",
    description: "Clean lines and quiet confidence for considered spaces.",
    status: "active",
    visibility: "visible",
  },
  {
    id: "col-terra",
    slug: "terra",
    name: "Terra",
    description: "Natural stone accents grounded in solid oak.",
    status: "active",
    visibility: "visible",
  },
  {
    id: "col-aria",
    slug: "aria",
    name: "Aria",
    description: "Sculptural silhouettes, currently being restocked.",
    status: "outofstock",
    visibility: "visible",
  },
];
