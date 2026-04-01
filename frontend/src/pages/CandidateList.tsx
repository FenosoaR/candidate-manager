import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCandidates } from '../hooks/useCandidates';
import { useCandidate } from '../hooks/useCandidate';

export const CandidateList: React.FC = () => {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const { data, total, loading, error, refetch } = useCandidates(page, search);
  const { deleteCandidate } = useCandidate();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    await deleteCandidate(id);
    refetch();
  };

  return (
    <main>
      <h1>Candidats</h1>
      <input
        aria-label="Rechercher un candidat"
        placeholder="Recherche…"
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />
      <Link to="/candidates/new"><button>+ Nouveau candidat</button></Link>
      {loading && <p role="status">Chargement…</p>}
      {error   && <p role="alert">{error}</p>}
      <table aria-label="Liste des candidats">
        <thead><tr><th>Nom</th><th>Poste</th><th>Email</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          {data.map(c => (
            <tr key={c._id}>
              <td>{c.firstName} {c.lastName}</td>
              <td>{c.position}</td>
              <td>{c.email}</td>
              <td>{c.status}</td>
              <td>
                <Link to={`/candidates/${c._id}`}><button aria-label={`Voir ${c.firstName}`}>Voir</button></Link>
                <button aria-label={`Supprimer ${c.firstName}`} onClick={() => handleDelete(c._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div role="navigation" aria-label="Pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Précédent</button>
        <span>Page {page} / {Math.ceil(total / 10) || 1}</span>
        <button disabled={page >= Math.ceil(total / 10)} onClick={() => setPage(p => p + 1)}>Suivant</button>
      </div>
    </main>
  );
};