export type NavTab =
  | 'HOME'
  | 'ABOUT US'
  | 'PRODUCT'
  | 'QUALITY SYSTEM'
  | 'INFRASTRUCTURE'
  | 'FEEDBACK'
  | 'CONTACT US';

export interface Subcategory {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  pdfs?: PdfDocument[];
}

export interface PdfDocument {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  category?: string;
  subcategory?: string;
  year?: string;
  fileSize?: string;
  fileData?: string; // base64 data URI if uploaded
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  createdAt?: string;
  subcategories?: Subcategory[];
  pdfs?: PdfDocument[];
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
}

export interface CorporateNewsItem {
  id: string;
  title: string;
  content: string;
  tag: string;
  date: string;
  isImportant?: boolean;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}
