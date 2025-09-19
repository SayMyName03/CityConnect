import mongoose from 'mongoose';

const IssueTypeSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('IssueType', IssueTypeSchema);
