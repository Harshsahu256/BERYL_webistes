import { Router, Request, Response } from 'express';
import { CategoriesCollection, SubcategoriesCollection, PdfsCollection } from '../db/store';
import { requireAdminAuth } from '../middleware/auth';
import { Category } from '../../src/types';

const router = Router();

// GET /api/categories - Get all categories populated with subcategories and direct PDFs
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await CategoriesCollection.find();
    const allSubcategories = await SubcategoriesCollection.find();
    const allPdfs = await PdfsCollection.find();

    const populatedCategories = categories.map((cat) => {
      const catSubcategories = allSubcategories
        .filter((sub) => sub.categoryId === cat.id)
        .map((sub) => ({
          ...sub,
          pdfs: allPdfs.filter((pdf) => pdf.subcategoryId === sub.id),
        }));

      const directPdfs = allPdfs.filter((pdf) => pdf.categoryId === cat.id);

      return {
        ...cat,
        subcategories: catSubcategories,
        pdfs: directPdfs,
      };
    });

    res.json({
      success: true,
      categories: populatedCategories,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve categories.' });
  }
});

// POST /api/categories - Create new Category (Admin Only)
router.post('/', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Category name is required.' });
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      description: description ? description.trim() : '',
      imageUrl:
        imageUrl && imageUrl.trim()
          ? imageUrl.trim()
          : 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString(),
      subcategories: [],
      pdfs: [],
    };

    await CategoriesCollection.insertOne(newCategory);

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category: newCategory,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create category.' });
  }
});

// PUT /api/categories/:id - Update/Edit Category (Admin Only)
router.put('/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const { name, description, imageUrl } = req.body;

    const existing = await CategoriesCollection.findOne({ id: categoryId });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Category not found.' });
    }

    const updated = await CategoriesCollection.updateOne(categoryId, {
      name: name ? name.trim() : existing.name,
      description: description !== undefined ? description.trim() : existing.description,
      imageUrl: imageUrl ? imageUrl.trim() : existing.imageUrl,
    });

    res.json({
      success: true,
      message: 'Category updated successfully.',
      category: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update category.' });
  }
});

// DELETE /api/categories/:id - Delete Category (and cascade subcategories and PDFs)
router.delete('/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await CategoriesCollection.findOne({ id: categoryId });

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found.' });
    }

    await CategoriesCollection.deleteOne(categoryId);
    await SubcategoriesCollection.deleteMany({ categoryId });
    await PdfsCollection.deleteMany({ categoryId });

    res.json({
      success: true,
      message: `Category "${category.name}" and all its subcategories and PDFs were deleted.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete category.' });
  }
});

export default router;
