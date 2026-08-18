import { Router, Request, Response } from 'express';
import { CategoriesCollection, SubcategoriesCollection, PdfsCollection } from '../db/store';
import { requireAdminAuth } from '../middleware/auth';
import { Subcategory } from '../../src/types';

const router = Router();

// GET /api/subcategories - Get all Subcategories with their PDFs
router.get('/', async (req: Request, res: Response) => {
  try {
    const subcategories = await SubcategoriesCollection.find();
    const allPdfs = await PdfsCollection.find();

    const populatedSubcategories = subcategories.map((sub) => ({
      ...sub,
      pdfs: allPdfs.filter((pdf) => pdf.subcategoryId === sub.id),
    }));

    res.json({
      success: true,
      subcategories: populatedSubcategories,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve subcategories.' });
  }
});

// POST /api/subcategories - Create new Subcategory (Admin Only)
router.post('/', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { categoryId, name, description, imageUrl } = req.body;

    if (!categoryId) {
      return res.status(400).json({ success: false, error: 'Parent category is required.' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Subcategory name is required.' });
    }

    const parentCategory = await CategoriesCollection.findOne({ id: categoryId });
    if (!parentCategory) {
      return res.status(404).json({ success: false, error: 'Parent category not found.' });
    }

    const newSubcategory: Subcategory = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      categoryId: parentCategory.id,
      categoryName: parentCategory.name,
      name: name.trim(),
      description: description ? description.trim() : '',
      imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : parentCategory.imageUrl,
      createdAt: new Date().toISOString(),
      pdfs: [],
    };

    await SubcategoriesCollection.insertOne(newSubcategory);

    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully.',
      subcategory: newSubcategory,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create subcategory.' });
  }
});

// PUT /api/subcategories/:id - Update Subcategory (Admin Only)
router.put('/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const subcategoryId = req.params.id;
    const { name, description, categoryId, imageUrl } = req.body;

    const existing = await SubcategoriesCollection.findOne({ id: subcategoryId });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Subcategory not found.' });
    }

    let categoryName = existing.categoryName;
    if (categoryId && categoryId !== existing.categoryId) {
      const parentCategory = await CategoriesCollection.findOne({ id: categoryId });
      if (parentCategory) {
        categoryName = parentCategory.name;
      }
    }

    const updated = await SubcategoriesCollection.updateOne(subcategoryId, {
      name: name ? name.trim() : existing.name,
      description: description !== undefined ? description.trim() : existing.description,
      categoryId: categoryId || existing.categoryId,
      categoryName,
      imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
    });

    res.json({
      success: true,
      message: 'Subcategory updated successfully.',
      subcategory: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update subcategory.' });
  }
});

// DELETE /api/subcategories/:id - Delete Subcategory and its PDFs (Admin Only)
router.delete('/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const subcategoryId = req.params.id;
    const subcategory = await SubcategoriesCollection.findOne({ id: subcategoryId });

    if (!subcategory) {
      return res.status(404).json({ success: false, error: 'Subcategory not found.' });
    }

    await SubcategoriesCollection.deleteOne(subcategoryId);
    await PdfsCollection.deleteMany({ subcategoryId });

    res.json({
      success: true,
      message: `Subcategory "${subcategory.name}" and its PDFs were deleted.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete subcategory.' });
  }
});

export default router;
