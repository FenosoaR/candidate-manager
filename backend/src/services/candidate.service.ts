import { Candidate, ICandidate } from '../models/Candidate';
import { CreateCandidateDto, UpdateCandidateDto } from '../validators/candidate.validator';

export class CandidateService {
  async create(data: CreateCandidateDto): Promise<ICandidate> {
    const existing = await Candidate.findOne({ email: data.email });
    if (existing) throw new Error('EMAIL_EXISTS');
    return Candidate.create(data);
  }

  async findById(id: string): Promise<ICandidate | null> {
    return Candidate.findById(id);
  }

  async update(id: string, data: UpdateCandidateDto): Promise<ICandidate | null> {
    return Candidate.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async softDelete(id: string): Promise<ICandidate | null> {
    return Candidate.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  }

  async validate(id: string): Promise<ICandidate | null> {
   
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Candidate.findByIdAndUpdate(
      id,
      { status: 'validated', validatedAt: new Date() },
      { new: true }
    );
  }

  async findAll(page = 1, limit = 10, search = ''): Promise<{ data: ICandidate[]; total: number }> {
    const filter = search
      ? { $or: [{ firstName: new RegExp(search, 'i') }, { lastName: new RegExp(search, 'i') }, { position: new RegExp(search, 'i') }] }
      : {};
    const [data, total] = await Promise.all([
      Candidate.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
      Candidate.countDocuments(filter),
    ]);
    return { data, total };
  }
}

export const candidateService = new CandidateService();