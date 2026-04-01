import { z } from 'zod';

export const createCandidateSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName:  z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email:     z.string().email('Email invalide'),
  phone:     z.string().regex(/^\+?[0-9\s\-]{7,15}$/, 'Numéro de téléphone invalide').optional(),
  position:  z.string().min(2, 'Le poste doit contenir au moins 2 caractères'),
});

export const updateCandidateSchema = createCandidateSchema.partial();

export type CreateCandidateDto = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateDto = z.infer<typeof updateCandidateSchema>;