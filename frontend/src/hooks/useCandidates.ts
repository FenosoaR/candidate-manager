import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Candidate, PaginatedResponse } from '../types/candidate';

export const useCandidates = (page = 1, search = '') => {
  const [data, setData]       = useState<Candidate[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<PaginatedResponse>('/api/candidates', { params: { page, limit: 10, search } });
      setData(res.data.data);
      setTotal(res.data.total);
    } catch {
      setError('Erreur lors du chargement des candidats');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);
  return { data, total, loading, error, refetch: fetchCandidates };
};