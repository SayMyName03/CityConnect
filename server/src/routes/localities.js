import express from 'express';
import Locality from '../models/Locality.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const items = await Locality.find().sort({ name: 1 }).lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch localities' });
  }
});

router.post('/', async (req, res) => {
  try {
    const created = await Locality.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
