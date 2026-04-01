import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useCandidate } from '../hooks/useCandidate';
import { Candidate } from '../types/candidate';

export const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const { validateCandidate, loading, error } = useCandidate();

  const navigate =  useNavigate();

  useEffect(() => {
    api.get<Candidate>(`/api/candidates/${id}`).then(r => setCandidate(r.data));
  }, [id]);

  const handleValidate = async () => {
    if (!id) return;
    const updated = await validateCandidate(id);
    setCandidate(updated);
  };

  if (!candidate) return <p role="status">Chargement…</p>;

  return (
    <main>
      <h1>{candidate.firstName} {candidate.lastName}</h1>
      <p>Email : {candidate.email}</p>
      <p>Poste : {candidate.position}</p>
      <p>Statut : <strong>{candidate.status}</strong></p>
      {error && <p role="alert">{error}</p>}
      <button onClick={handleValidate} disabled={loading || candidate.status === 'validated'} aria-busy={loading}>
        {loading ? 'Validation en cours…' : 'Valider le candidat'}
      </button>

  <button onClick={() => navigate(`/candidates/${id}/edit`)}>
  Modifier
</button>

<a 
  href={`/api/candidates/${id}/document`} 
  target="_blank"
  rel="noreferrer"
>
  <button>Télécharger PDF</button>
</a>
    </main>
  );
};