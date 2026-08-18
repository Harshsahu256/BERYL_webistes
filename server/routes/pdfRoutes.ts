import { Router, Request, Response } from 'express';
import { CategoriesCollection, SubcategoriesCollection, PdfsCollection } from '../db/store';
import { requireAdminAuth } from '../middleware/auth';
import { PdfDocument } from '../../src/types';

const router = Router();

// GET /api/pdfs - Get all PDF documents
router.get('/', async (req: Request, res: Response) => {
  try {
    const pdfs = await PdfsCollection.find();
    res.json({ success: true, pdfs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve PDFs.' });
  }
});

// GET /api/pdfs/:id/file - Stream raw PDF buffer with inline headers
router.get('/:id/file', async (req: Request, res: Response) => {
  try {
    const pdfId = req.params.id;
    const pdf = await PdfsCollection.findOne({ id: pdfId });
    if (!pdf || !pdf.fileData) {
      return res.status(404).send('PDF file not found');
    }

    const matches = pdf.fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).send('Invalid PDF format');
    }

    const buffer = Buffer.from(matches[2], 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(pdf.title)}.pdf"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (err) {
    res.status(500).send('Error streaming PDF');
  }
});

// POST /api/pdfs - Upload / Add PDF in Category (with optional Subcategory) (Admin Only)
router.post('/', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { categoryId, subcategoryId, title, year, fileSize, fileData } = req.body;

    if (!categoryId) {
      return res.status(400).json({ success: false, error: 'Category is required.' });
    }

    // Try finding parent category by ID or by Name
    let parentCategory = await CategoriesCollection.findOne({ id: categoryId });
    if (!parentCategory) {
      parentCategory = await CategoriesCollection.findOne({ name: categoryId });
    }
    if (!parentCategory) {
      const allCats = await CategoriesCollection.find();
      if (allCats.length > 0) {
        parentCategory = allCats[0];
      }
    }

    if (!parentCategory) {
      return res.status(404).json({ success: false, error: 'Category not found.' });
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, error: 'PDF title is required.' });
    }

    let subcategoryName: string | undefined = undefined;
    if (subcategoryId) {
      let sub = await SubcategoriesCollection.findOne({ id: subcategoryId });
      if (!sub) {
        sub = await SubcategoriesCollection.findOne({ name: subcategoryId });
      }
      if (sub) {
        subcategoryName = sub.name;
      }
    }

    const newPdf: PdfDocument = {
      id: `pdf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      categoryId: parentCategory.id,
      categoryName: parentCategory.name,
      subcategoryId: subcategoryId || undefined,
      subcategoryName,
      category: parentCategory.name,
      subcategory: subcategoryName || 'Statutory Disclosure',
      year: year ? String(year).trim() : '2023-2024',
      fileSize: fileSize ? String(fileSize).trim() : '480 KB',
      fileData: fileData || undefined,
      createdAt: new Date().toISOString(),
    };

    await PdfsCollection.insertOne(newPdf);

    res.status(201).json({
      success: true,
      message: 'PDF document added successfully.',
      pdf: newPdf,
    });
  } catch (err: any) {
    console.error('Error inserting PDF document:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to create PDF document.' });
  }
});

// PUT /api/pdfs/:id - Update/Edit PDF Document (Admin Only)
router.put('/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const pdfId = req.params.id;
    const { title, year, categoryId, subcategoryId, fileData, fileSize } = req.body;

    const existing = await PdfsCollection.findOne({ id: pdfId });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'PDF not found.' });
    }

    let categoryName = existing.categoryName;
    if (categoryId && categoryId !== existing.categoryId) {
      const cat = await CategoriesCollection.findOne({ id: categoryId });
      if (cat) categoryName = cat.name;
    }

    let subcategoryName = existing.subcategoryName;
    if (subcategoryId !== undefined) {
      if (subcategoryId) {
        const sub = await SubcategoriesCollection.findOne({ id: subcategoryId });
        subcategoryName = sub ? sub.name : undefined;
      } else {
        subcategoryName = undefined;
      }
    }

    const updated = await PdfsCollection.updateOne(pdfId, {
      title: title ? title.trim() : existing.title,
      year: year ? String(year).trim() : existing.year,
      categoryId: categoryId || existing.categoryId,
      categoryName,
      subcategoryId: subcategoryId !== undefined ? (subcategoryId || undefined) : existing.subcategoryId,
      subcategoryName,
      category: categoryName,
      subcategory: subcategoryName || 'Statutory Disclosure',
      fileData: fileData !== undefined ? fileData : existing.fileData,
      fileSize: fileSize || existing.fileSize,
    });

    res.json({
      success: true,
      message: 'PDF document updated successfully.',
      pdf: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to update PDF.' });
  }
});

// DELETE /api/pdfs/:id - Delete PDF Document (Admin Only)
router.delete('/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const pdfId = req.params.id;
    const pdf = await PdfsCollection.findOne({ id: pdfId });

    if (!pdf) {
      return res.status(404).json({ success: false, error: 'PDF document not found.' });
    }

    await PdfsCollection.deleteOne(pdfId);

    res.json({
      success: true,
      message: `PDF "${pdf.title}" deleted successfully.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to delete PDF document.' });
  }
});

export default router;
