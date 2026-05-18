import { z } from "zod";

export const exampleFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Format email tidak valid"),
});

export type ExampleFormValues = z.infer<typeof exampleFormSchema>;

export const exampleUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type ExampleUser = z.infer<typeof exampleUserSchema>;
