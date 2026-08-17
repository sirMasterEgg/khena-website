export type JobStatus = "open" | "closed";

export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string; // mis. "Full-time", "Contract"
  description: string;
  status: JobStatus;
};

export function isJobOpen(j: Job) {
  return j.status === "open";
}
