import { Response } from 'express';
import { candidateService } from '../services/candidate.service';
import { AuthRequest } from '../middleware/auth.middeware';
import { logger } from '../config/logger';

export const createCandidate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const candidate = await candidateService.create(req.body);
    res.status(201).json(candidate);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
      res.status(409).json({ error: 'Cet email est déjà utilisé' });
      return;
    }
    logger.error('createCandidate error', { err });
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getCandidate = async (req: AuthRequest, res: Response): Promise<void> => {
  const candidate = await candidateService.findById(req.params.id);
  if (!candidate) { res.status(404).json({ error: 'Candidat non trouvé' }); return; }
  res.json(candidate);
};

export const updateCandidate = async (req: AuthRequest, res: Response): Promise<void> => {
  const candidate = await candidateService.update(req.params.id, req.body);
  if (!candidate) { res.status(404).json({ error: 'Candidat non trouvé' }); return; }
  res.json(candidate);
};

export const deleteCandidate = async (req: AuthRequest, res: Response): Promise<void> => {
  const candidate = await candidateService.softDelete(req.params.id);
  if (!candidate) { res.status(404).json({ error: 'Candidat non trouvé' }); return; }
  res.json({ message: 'Candidat supprimé', id: req.params.id });
};

export const validateCandidate = async (req: AuthRequest, res: Response): Promise<void> => {
  const candidate = await candidateService.validate(req.params.id);
  if (!candidate) { res.status(404).json({ error: 'Candidat non trouvé' }); return; }
  res.json(candidate);
};

export const listCandidates = async (req: AuthRequest, res: Response): Promise<void> => {
  const page  = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || '';
  const result = await candidateService.findAll(page, limit, search);
  res.json({ ...result, page, limit });
};