import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createCandidateSchema, updateCandidateSchema } from '../validators/candidate.validator';
import {
  createCandidate, getCandidate, updateCandidate,
  deleteCandidate, validateCandidate, listCandidates,
} from '../controllers/candidate.controller';
import { authMiddleware } from '../middleware/auth.middeware';

const router = Router();

router.use(authMiddleware);

router.get('/',          listCandidates);
router.post('/',         validate(createCandidateSchema), createCandidate);
router.get('/:id',       getCandidate);
router.put('/:id',       validate(updateCandidateSchema), updateCandidate);
router.delete('/:id',    deleteCandidate);
router.post('/:id/validate', validateCandidate);

export default router;