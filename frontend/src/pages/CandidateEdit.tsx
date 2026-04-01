import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { Candidate } from '../types/candidate'

const schema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName:  z.string().min(2, 'Nom requis'),
  email:     z.string().email('Email invalide'),
  phone:     z.string().optional(),
  position:  z.string().min(2, 'Poste requis'),
})
type FormData = z.infer<typeof schema>

export const CandidateEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    api.get<Candidate>(`/api/candidates/${id}`).then(r => {
      reset({
        firstName: r.data.firstName,
        lastName: r.data.lastName,
        email: r.data.email,
        phone: r.data.phone,
        position: r.data.position,
      })
    })
  }, [id, reset])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await api.put(`/api/candidates/${id}`, data)
      navigate(`/candidates/${id}`)
    } catch {
      setError('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Modifier le candidat</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formulaire modification candidat">
        {(['firstName', 'lastName', 'email', 'phone', 'position'] as const).map(field => (
          <div key={field}>
            <label htmlFor={field}>{field}</label>
            <input id={field} {...register(field)} />
            {errors[field] && <span role="alert">{errors[field]?.message}</span>}
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Mise à jour...' : 'Enregistrer'}
        </button>
        <button type="button" onClick={() => navigate(`/candidates/${id}`)}>
          Annuler
        </button>
      </form>
    </main>
  )
}