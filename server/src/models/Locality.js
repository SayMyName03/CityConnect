import mongoose from 'mongoose';

const LocalitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Locality', LocalitySchema);
