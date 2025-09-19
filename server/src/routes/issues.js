import express from 'express';
import Issue from '../models/Issue.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find()
      .sort({ createdAt: -1 })
      .populate('issueType', 'key label')
      .populate('locality', 'name city state')
      .populate('reportedBy', 'name email')
      .lean();
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, category, issueType, description, location, locality, reportedBy, photoUrl } = req.body;
    console.log('Create issue payload:', { title, category, issueType, description, location, locality, reportedBy, photoUrl });
    const payload = {
      title,
      description,
      location: location || 'Auto-detected location',
      photoUrl,
    };
    if (issueType) payload.issueType = issueType;
    if (category) payload.category = category; // fallback for old clients
    if (locality) payload.locality = locality;
    if (reportedBy) payload.reportedBy = reportedBy;
    const issue = await Issue.create(payload);
    res.status(201).json(issue);
  } catch (err) {
    console.error('Error creating issue:', err);
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:id/upvote', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
