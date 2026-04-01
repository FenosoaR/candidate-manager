import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCandidate } from '../hooks/useCandidate';

const schema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName:  z.string().min(2, 'Nom requis'),
  email:     z.string().email('Email invalide'),
  phone:     z.string().optional(),
  position:  z.string().min(2, 'Poste requis'),
});
type FormData = z.infer<typeof schema>;

export const CandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const { createCandidate, loading, error } = useCandidate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await createCandidate(data);
    navigate('/candidates');
  };

  return (
    <main>
      <h1>Nouveau Candidat</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formulaire candidat">
        {(['firstName', 'lastName', 'email', 'phone', 'position'] as const).map(field => (
          <div key={field}>
            <label htmlFor={field}>{field}</label>
            <input id={field} {...register(field)} aria-describedby={errors[field] ? `${field}-err` : undefined} />
            {errors[field] && <span id={`${field}-err`} role="alert">{errors[field]?.message}</span>}
          </div>
        ))}
        <button type="submit" disabled={loading}>{loading ? 'Création…' : 'Créer'}</button>
      </form>
    </main>
  );
};