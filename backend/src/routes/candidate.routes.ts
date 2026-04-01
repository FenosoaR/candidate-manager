import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createCandidateSchema, updateCandidateSchema } from '../validators/candidate.validator';
import {
  createCandidate, getCandidate, updateCandidate,
  deleteCandidate, validateCandidate, listCandidates,
} from '../controllers/candidate.controller';
import { authMiddleware } from '../middleware/auth.middeware';
import { Candidate } from '../models/Candidate';
import { generateCandidatePDF } from '../services/pdf.service';

const router = Router();

router.use(authMiddleware);

router.get('/',          listCandidates);
router.post('/',         validate(createCandidateSchema), createCandidate);
router.get('/:id',       getCandidate);
router.put('/:id',       validate(updateCandidateSchema), updateCandidate);
router.delete('/:id',    deleteCandidate);
router.post('/:id/validate', validateCandidate);



router.get('/:id/document', async (req, res) => {
  const candidate = await Candidate.findById(req.params.id)
  if (!candidate) { res.status(404).json({ error: 'Candidat non trouvé' }); return }
  const pdf = await generateCandidatePDF(candidate)
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=candidat-${candidate._id}.pdf`)
  res.send(pdf)
})

export default router;