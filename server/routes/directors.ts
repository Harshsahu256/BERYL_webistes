import { Router, Request, Response } from 'express';
import { DirectorsCollection, INITIAL_DIRECTORS } from '../db/store';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// GET /api/directors - Get all directors
router.get('/', async (req: Request, res: Response) => {
  try {
    let directors = await DirectorsCollection.find();
    // अगर डेटाबेस खाली हो तो डिफ़ॉल्ट डायरेक्टर्स लोड करें
    if (!directors || directors.length === 0) {
      for (const dir of INITIAL_DIRECTORS) {
        await DirectorsCollection.insertOne(dir);
      }
      directors = await DirectorsCollection.find();
    }
    res.json({ success: true, directors });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve directors.' });
  }
});

// POST /api/directors - Add new director (Admin Only)
router.post('/', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { name, designation } = req.body;

    if (!name || !name.trim() || !designation || !designation.trim()) {
      return res.status(400).json({ success: false, error: 'Name and designation are required.' });
    }

    const newDirector = {
      id: `dir-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      designation: designation.trim(),
    };

    await DirectorsCollection.insertOne(newDirector);

    res.status(201).json({
      success: true,
      message: 'Director added successfully.',
      director: newDirector,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to add director.' });
  }
});

// PUT /api/directors/:id - Update director (Admin Only)
router.put('/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const directorId = req.params.id;
    const { name, designation } = req.body;

    let existing = await DirectorsCollection.findOne({ id: directorId });

    // अगर local_db.json में यह ID मौजूद नहीं है, तो 404 देने के बजाय इसे खुद Insert कर ले
    if (!existing) {
      const newDirector = {
        id: directorId,
        name: name ? name.trim() : '',
        designation: designation ? designation.trim() : '',
      };
      await DirectorsCollection.insertOne(newDirector);
      return res.json({
        success: true,
        message: 'Director updated successfully.',
        director: newDirector,
      });
    }

    const updated = await DirectorsCollection.updateOne(directorId, {
      name: name ? name.trim() : existing.name,
      designation: designation ? designation.trim() : existing.designation,
    });

    res.json({
      success: true,
      message: 'Director updated successfully.',
      director: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update director.' });
  }
});

// DELETE /api/directors/:id - Remove director (Admin Only)
router.delete('/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const directorId = req.params.id;
    const existing = await DirectorsCollection.findOne({ id: directorId });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Director not found.' });
    }

    await DirectorsCollection.deleteOne(directorId);

    res.json({
      success: true,
      message: `Director "${existing.name}" removed successfully.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete director.' });
  }
});

export default router;