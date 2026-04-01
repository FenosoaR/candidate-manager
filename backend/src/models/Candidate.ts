import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  status: 'pending' | 'validated' | 'rejected';
  isDeleted: boolean;
  deletedAt?: Date;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    phone:     { type: String },
    position:  { type: String, required: true },
    status:    { type: String, enum: ['pending', 'validated', 'rejected'], default: 'pending' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    validatedAt:{ type: Date },
  },
  { timestamps: true }
);

// Exclude soft-deleted by default
CandidateSchema.pre(/^find/, function (this: mongoose.Query<unknown, unknown>, next) {
  this.where({ isDeleted: false });
  next();
});

export const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);