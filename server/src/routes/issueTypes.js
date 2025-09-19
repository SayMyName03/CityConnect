import express from 'express';
import IssueType from '../models/IssueType.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const items = await IssueType.find().sort({ label: 1 }).lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch issue types' });
  }
});

router.post('/', async (req, res) => {
  try {
    const created = await IssueType.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
