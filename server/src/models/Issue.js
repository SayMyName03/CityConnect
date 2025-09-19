import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
  // Keep category for backward compat with current UI; map to issueType when available
  category: { type: String },
    issueType: { type: mongoose.Schema.Types.ObjectId, ref: 'IssueType' },
    description: { type: String, required: true },
    location: { type: String, required: true },
    locality: { type: mongoose.Schema.Types.ObjectId, ref: 'Locality' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Reported', 'In Progress', 'Resolved'], default: 'Reported' },
    upvotes: { type: Number, default: 0 },
    reportedAt: { type: Date, default: Date.now },
    photoUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Issue', IssueSchema);
