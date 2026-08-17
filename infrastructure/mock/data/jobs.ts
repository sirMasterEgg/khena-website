import type {Job} from "@/domain/entities/job";

export const MOCK_JOBS: Job[] = [
  {
    id: "job-showroom-host",
    slug: "showroom-host",
    title: "Showroom Host",
    department: "Retail",
    location: "Jakarta Selatan",
    type: "Full-time",
    description:
      "Welcome visitors to our Jakarta showroom and guide them through the Khena collection.",
    status: "open",
  },
  {
    id: "job-furniture-craftsman",
    slug: "furniture-craftsman",
    title: "Furniture Craftsman",
    department: "Workshop",
    location: "Jepara",
    type: "Full-time",
    description: "Hand-finish solid timber pieces to Khena's quality standard.",
    status: "open",
  },
  {
    id: "job-interior-consultant",
    slug: "interior-consultant",
    title: "Interior Design Consultant",
    department: "Design",
    location: "Jakarta Selatan",
    type: "Contract",
    description: "Support private and contract clients through material and layout consultations.",
    status: "closed",
  },
];
