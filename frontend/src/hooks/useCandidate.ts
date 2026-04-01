import { useState } from 'react';
import api from '../services/api';
import { Candidate } from '../types/candidate';

export const useCandidate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const createCandidate = async (data: Omit<Candidate, '_id' | 'status' | 'createdAt'>) => {
    setLoading(true); setError(null);
    try {
      const res = await api.post<Candidate>('/api/candidates', data);
      return res.data;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Erreur création';
      setError(msg); throw err;
    } finally { setLoading(false); }
  };

  const validateCandidate = async (id: string) => {
    setLoading(true); setError(null);
    try {
      const res = await api.post<Candidate>(`/api/candidates/${id}/validate`);
      return res.data;
    } catch {
      setError('Erreur validation'); throw new Error('Erreur validation');
    } finally { setLoading(false); }
  };

  const deleteCandidate = async (id: string) => {
    setLoading(true);
    try { await api.delete(`/api/candidates/${id}`); }
    catch { setError('Erreur suppression'); throw new Error('Erreur suppression'); }
    finally { setLoading(false); }
  };

  return { loading, error, createCandidate, validateCandidate, deleteCandidate };
};



// import { useState } from 'react';
// import api from '../services/api';
// import { Candidate } from '../types/candidate';

// export const useCandidate = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const createCandidate = async (
//     data: Omit<Candidate, '_id' | 'status' | 'createdAt'>
//   ) => {
//     setLoading(true); setError(null);
//     try {
//       const res = await api.post<Candidate>('/api/candidates', data);
//       return res.data;
//     } catch (err: any) {
//       const msg = err?.response?.data?.error || 'Erreur création';
//       setError(msg);
//       throw err; // ✅ throw utilisé
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateCandidate = async (id: string) => {
//     setLoading(true); setError(null);
//     try {
//       const res = await api.post<Candidate>(`/api/candidates/${id}/validate`);
//       return res.data;
//     } catch {
//       setError('Erreur validation');
//       throw new Error('Erreur validation'); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCandidate = async (id: string) => {
//     setLoading(true);
//     try {
//       await api.delete(`/api/candidates/${id}`);
//     } catch {
//       setError('Erreur suppression');
//       throw new Error('Erreur suppression'); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, error, createCandidate, validateCandidate, deleteCandidate };
// };