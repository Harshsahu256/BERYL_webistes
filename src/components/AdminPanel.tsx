// import React, { useState, useEffect } from 'react';
// import { Category, Subcategory, PdfDocument } from '../types';
// import {
//   LayoutDashboard,
//   FolderTree,
//   LogOut,
//   Plus,
//   Edit2,
//   Trash2,
//   Eye,
//   Download,
//   Search,
//   CheckCircle2,
//   AlertCircle,
//   FileText,
//   Layers,
//   X,
//   Building2,
//   ArrowLeft,
//   RefreshCw,
//   Upload,
//   AlertTriangle,
// } from 'lucide-react';
// import { generateAndDownloadPdf } from '../utils/pdfGenerator';

// interface AdminPanelProps {
//   categories: Category[];
//   onDataChange: () => void;
//   onViewPdf: (doc: PdfDocument) => void;
//   onBackToWebsite: () => void;
// }

// type AdminModule = 'DASHBOARD' | 'CATEGORIES' | 'SUBCATEGORIES' | 'DOCUMENTS';

// export const AdminPanel: React.FC<AdminPanelProps> = ({
//   categories,
//   onDataChange,
//   onViewPdf,
//   onBackToWebsite,
// }) => {
//   const [token, setToken] = useState<string | null>(() => {
//     return localStorage.getItem('beryl_admin_token');
//   });

//   // Active module in sidebar
//   const [activeModule, setActiveModule] = useState<AdminModule>('DASHBOARD');

//   // Admin login form state
//   const [username, setUsername] = useState('admin');
//   const [password, setPassword] = useState('adminpassword123');
//   const [loginError, setLoginError] = useState<string | null>(null);
//   const [isLoggingIn, setIsLoggingIn] = useState(false);

//   // Supplementary data fetched from MongoDB backend
//   const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
//   const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Toast / Flash Notification
//   const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

//   // Modal Delete Confirmation State
//   const [deleteDialog, setDeleteDialog] = useState<{
//     isOpen: boolean;
//     type: 'CATEGORY' | 'SUBCATEGORY' | 'PDF';
//     id: string;
//     name: string;
//     warningMsg: string;
//   } | null>(null);

//   // ----------------------------------------------------
//   // Category Form State
//   // ----------------------------------------------------
//   const [categoryName, setCategoryName] = useState('');
//   const [categoryDesc, setCategoryDesc] = useState('');
//   const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
//   const [savingCategory, setSavingCategory] = useState(false);

//   // ----------------------------------------------------
//   // Subcategory Form State (Flow 2)
//   // ----------------------------------------------------
//   const [subParentCategoryId, setSubParentCategoryId] = useState('');
//   const [subcategoryName, setSubcategoryName] = useState('');
//   const [subcategoryDesc, setSubcategoryDesc] = useState('');
//   const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
//   const [savingSubcategory, setSavingSubcategory] = useState(false);

//   // ----------------------------------------------------
//   // PDF Upload & Edit Form State
//   // ----------------------------------------------------
//   const [pdfParentCategoryId, setPdfParentCategoryId] = useState('');
//   const [pdfSubcategoryId, setPdfSubcategoryId] = useState('');
//   const [pdfTitle, setPdfTitle] = useState('');
//   const [pdfYear, setPdfYear] = useState('2023-2024');
//   const [pdfFile, setPdfFile] = useState<File | null>(null);
//   const [editingPdfId, setEditingPdfId] = useState<string | null>(null);
//   const [savingPdf, setSavingPdf] = useState(false);

//   // Document List Search & Category Filter
//   const [docSearchQuery, setDocSearchQuery] = useState('');
//   const [docCategoryFilter, setDocCategoryFilter] = useState('ALL');

//   const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
//     setNotification({ text, type });
//     setTimeout(() => setNotification(null), 3800);
//   };

//   // Fetch live collections from local MongoDB API
//   const fetchAdminData = async () => {
//     try {
//       setLoading(true);
//       const [subRes, pdfRes] = await Promise.all([
//         fetch('/api/subcategories'),
//         fetch('/api/pdfs'),
//       ]);

//       if (subRes.ok) {
//         const subData = await subRes.json();
//         if (subData.success && Array.isArray(subData.subcategories)) {
//           setSubcategories(subData.subcategories);
//         }
//       }

//       if (pdfRes.ok) {
//         const pdfData = await pdfRes.json();
//         if (pdfData.success && Array.isArray(pdfData.pdfs)) {
//           setPdfs(pdfData.pdfs);
//         }
//       }
//     } catch (err) {
//       console.warn('Backend sync note:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchAdminData();
//     }
//   }, [token]);

//   // Set selected parent category in dropdowns
//   useEffect(() => {
//     if (categories.length > 0) {
//       if (!subParentCategoryId) setSubParentCategoryId(categories[0].id);
//       if (!pdfParentCategoryId) setPdfParentCategoryId(categories[0].id);
//     }
//   }, [categories, subParentCategoryId, pdfParentCategoryId]);
//   // ----------------------------------------------------
//   // Admin Authentication
//   // ----------------------------------------------------
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoggingIn(true);
//     setLoginError(null);

//     try {
//       const res = await fetch('/api/admin/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();
//       if (res.ok && data.success && data.token) {
//         setToken(data.token);
//         localStorage.setItem('beryl_admin_token', data.token);
//         showNotification('Login successful. Connected to Database.');
//         fetchAdminData();
//       } else {
//         setLoginError(data.error || 'Invalid credentials. Please try again.');
//       }
//     } catch (err) {
//       setLoginError('Could not connect to server.');
//     } finally {
//       setIsLoggingIn(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       if (token) {
//         await fetch('/api/admin/logout', {
//           method: 'POST',
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }
//     } catch (err) {
//       // Ignore
//     } finally {
//       setToken(null);
//       localStorage.removeItem('beryl_admin_token');
//     }
//   };

//   // ----------------------------------------------------
//   // Category Actions (CRUD)
//   // ----------------------------------------------------
//   const handleSaveCategory = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!categoryName.trim()) {
//       showNotification('Category name is required.', 'error');
//       return;
//     }

//     setSavingCategory(true);
//     try {
//       const isEdit = !!editingCategoryId;
//       const url = isEdit ? `/api/categories/${editingCategoryId}` : '/api/categories';
//       const method = isEdit ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: categoryName.trim(),
//           description: categoryDesc.trim(),
//         }),
//       });

//       const data = await res.json();
//       if (res.ok && data.success) {
//         setCategoryName('');
//         setCategoryDesc('');
//         setEditingCategoryId(null);
//         showNotification(isEdit ? 'Category updated in database.' : 'New category created successfully.');
//         onDataChange();
//         fetchAdminData();
//       } else {
//         showNotification(data.error || 'Failed to save category.', 'error');
//       }
//     } catch (err) {
//       showNotification('Error saving category.', 'error');
//     } finally {
//       setSavingCategory(false);
//     }
//   };

//   const confirmDeleteCategory = (id: string, name: string) => {
//     const subCount = subcategories.filter((s) => s.categoryId === id).length;
//     const pdfCount = pdfs.filter((p) => p.categoryId === id).length;
//     let msg = `Are you sure you want to delete category "${name}"?`;
//     if (subCount > 0 || pdfCount > 0) {
//       msg = `Category "${name}" contains ${subCount} subcategories and ${pdfCount} PDFs. Deleting it will permanently remove all associated records from MongoDB.`;
//     }
//     setDeleteDialog({
//       isOpen: true,
//       type: 'CATEGORY',
//       id,
//       name,
//       warningMsg: msg,
//     });
//   };

//   const executeDeleteCategory = async (id: string, name: string) => {
//     try {
//       const res = await fetch(`/api/categories/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok && data.success) {
//         showNotification(`Category "${name}" deleted from database.`);
//         onDataChange();
//         fetchAdminData();
//       } else {
//         showNotification(data.error || 'Failed to delete category.', 'error');
//       }
//     } catch (err) {
//       showNotification('Failed to delete category.', 'error');
//     }
//   };

//   // ----------------------------------------------------
//   // Subcategory Actions (Flow 2 CRUD)
//   // ----------------------------------------------------
//   const handleSaveSubcategory = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!subParentCategoryId || !subcategoryName.trim()) {
//       showNotification('Parent category and subcategory name are required.', 'error');
//       return;
//     }

//     setSavingSubcategory(true);
//     try {
//       const isEdit = !!editingSubcategoryId;
//       const url = isEdit ? `/api/subcategories/${editingSubcategoryId}` : '/api/subcategories';
//       const method = isEdit ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           categoryId: subParentCategoryId,
//           name: subcategoryName.trim(),
//           description: subcategoryDesc.trim(),
//         }),
//       });

//       const data = await res.json();
//       if (res.ok && data.success) {
//         setSubcategoryName('');
//         setSubcategoryDesc('');
//         setEditingSubcategoryId(null);
//         showNotification(isEdit ? 'Subcategory updated in database.' : 'Subcategory created successfully.');
//         onDataChange();
//         fetchAdminData();
//       } else {
//         showNotification(data.error || 'Failed to save subcategory.', 'error');
//       }
//     } catch (err) {
//       showNotification('Error saving subcategory.', 'error');
//     } finally {
//       setSavingSubcategory(false);
//     }
//   };

//   const confirmDeleteSubcategory = (id: string, name: string) => {
//     const pdfCount = pdfs.filter((p) => p.subcategoryId === id).length;
//     let msg = `Are you sure you want to delete subcategory "${name}"?`;
//     if (pdfCount > 0) {
//       msg = `Subcategory "${name}" contains ${pdfCount} PDFs. Deleting it will remove the subcategory and its documents.`;
//     }
//     setDeleteDialog({
//       isOpen: true,
//       type: 'SUBCATEGORY',
//       id,
//       name,
//       warningMsg: msg,
//     });
//   };

//   const executeDeleteSubcategory = async (id: string, name: string) => {
//     try {
//       const res = await fetch(`/api/subcategories/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok && data.success) {
//         showNotification(`Subcategory "${name}" deleted.`);
//         onDataChange();
//         fetchAdminData();
//       } else {
//         showNotification(data.error || 'Failed to delete subcategory.', 'error');
//       }
//     } catch (err) {
//       showNotification('Failed to delete subcategory.', 'error');
//     }
//   };

//   // ----------------------------------------------------
//   // PDF Document Actions (Upload ONLY PDF, Edit, Delete)
//   // ----------------------------------------------------
//   const handleSavePdf = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!pdfParentCategoryId || !pdfTitle.trim()) {
//       showNotification('Please select a Category and provide a PDF title.', 'error');
//       return;
//     }

//     setSavingPdf(true);

//     let base64Data: string | undefined = undefined;
//     let computedSize = '420 KB';

//     if (pdfFile) {
//       computedSize = `${(pdfFile.size / 1024).toFixed(0)} KB`;
//       try {
//         base64Data = await new Promise<string>((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result as string);
//           reader.onerror = reject;
//           reader.readAsDataURL(pdfFile);
//         });
//       } catch (e) {
//         console.warn('Could not read PDF file:', e);
//       }
//     }

//     try {
//       const isEdit = !!editingPdfId;
//       const url = isEdit ? `/api/pdfs/${editingPdfId}` : '/api/pdfs';
//       const method = isEdit ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           categoryId: pdfParentCategoryId,
//           subcategoryId: pdfSubcategoryId || undefined,
//           title: pdfTitle.trim(),
//           year: pdfYear.trim() || '2023-2024',
//           fileSize: computedSize,
//           fileData: base64Data,
//         }),
//       });

//       let data: any = {};
//       try {
//         data = await res.json();
//       } catch (jsonErr) {
//         data = { error: 'Server returned non-JSON response.' };
//       }

//       if (res.ok && data.success) {
//         setPdfTitle('');
//         setPdfFile(null);
//         setEditingPdfId(null);
//         showNotification(isEdit ? 'PDF document updated in database.' : 'PDF document uploaded and saved to MongoDB.');
//         onDataChange();
//         fetchAdminData();
//       } else if (res.status === 401 || res.status === 403) {
//         showNotification('Admin session expired. Please sign in again.', 'error');
//         handleLogout();
//       } else {
//         showNotification(data.error || 'Failed to save PDF.', 'error');
//       }
//     } catch (err: any) {
//       console.error('PDF save error:', err);
//       showNotification(`Upload error: ${err?.message || 'Could not connect to server'}`, 'error');
//     } finally {
//       setSavingPdf(false);
//     }
//   };

//   const confirmDeletePdf = (id: string, title: string) => {
//     setDeleteDialog({
//       isOpen: true,
//       type: 'PDF',
//       id,
//       name: title,
//       warningMsg: `Are you sure you want to permanently delete PDF "${title}" from the database?`,
//     });
//   };

//   const executeDeletePdf = async (id: string) => {
//     try {
//       const res = await fetch(`/api/pdfs/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok && data.success) {
//         showNotification('PDF document deleted from database.');
//         onDataChange();
//         fetchAdminData();
//       } else {
//         showNotification(data.error || 'Failed to delete PDF.', 'error');
//       }
//     } catch (err) {
//       showNotification('Failed to delete PDF.', 'error');
//     }
//   };

//   const handleConfirmDelete = () => {
//     if (!deleteDialog) return;
//     const { type, id, name } = deleteDialog;
//     setDeleteDialog(null);
//     if (type === 'CATEGORY') {
//       executeDeleteCategory(id, name);
//     } else if (type === 'SUBCATEGORY') {
//       executeDeleteSubcategory(id, name);
//     } else if (type === 'PDF') {
//       executeDeletePdf(id);
//     }
//   };

//   // Subcategories available for chosen parent category in PDF form
//   const availableSubsForPdf = subcategories.filter((s) => s.categoryId === pdfParentCategoryId);

//   // Filtered PDFs list
//   const filteredPdfs = pdfs.filter((doc) => {
//     const matchesCat = docCategoryFilter === 'ALL' || doc.categoryId === docCategoryFilter;
//     const matchesSearch =
//       doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
//       (doc.categoryName && doc.categoryName.toLowerCase().includes(docSearchQuery.toLowerCase())) ||
//       (doc.subcategoryName && doc.subcategoryName.toLowerCase().includes(docSearchQuery.toLowerCase()));
//     return matchesCat && matchesSearch;
//   });

//   // ----------------------------------------------------
//   // 1. SIMPLE LOGIN PAGE (IF NOT LOGGED IN)
//   // ----------------------------------------------------
//   if (!token) {
//     return (
//       <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
//         <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-6">
//           <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold">
//             <Building2 className="w-5 h-5" />
//           </div>
//           <div>
//             <h2 className="text-lg font-bold text-slate-900">Beryl Drugs Admin</h2>
//             <p className="text-xs text-slate-500">Sign in to manage categories & PDFs</p>
//           </div>
//         </div>

//         {loginError && (
//           <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg mb-4 flex items-center space-x-2">
//             <AlertCircle className="w-4 h-4 shrink-0" />
//             <span>{loginError}</span>
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-4 text-xs">
//           <div>
//             <label className="block font-semibold text-slate-700 mb-1.5">Username</label>
//             <input
//               type="text"
//               required
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
//               placeholder="admin"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold text-slate-700 mb-1.5">Password</label>
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
//               placeholder="••••••••••••"
//             />
//           </div>

//           <div className="bg-slate-50 border border-slate-200 text-slate-600 p-2.5 rounded-lg text-[11px] flex items-center justify-between">
//             <span><strong>Default User:</strong> admin</span>
//             <span><strong>Pass:</strong> adminpassword123</span>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoggingIn}
//             className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-colors cursor-pointer"
//           >
//             {isLoggingIn ? 'Signing In...' : 'Login to Admin Panel'}
//           </button>
//         </form>
//       </div>
//     );
//   }

//   // ----------------------------------------------------
//   // 2. NORMAL PROFESSIONAL ADMIN PANEL WITH SIDEBAR
//   // ----------------------------------------------------
//   return (
//     <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden my-3 min-h-[620px] flex flex-col md:flex-row">
//       {/* LEFT SIDEBAR */}
//       <aside className="w-full md:w-60 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0">
//         <div>
//           {/* Brand Header */}
//           <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
//             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
//               <Building2 className="w-4 h-4" />
//             </div>
//             <div>
//               <div className="font-bold text-sm text-white tracking-wide">BERYL DRUGS</div>
//               <div className="text-[10px] text-blue-400 font-semibold uppercase">Admin Panel</div>
//             </div>
//           </div>

//           {/* Navigation Links */}
//           <nav className="p-3 space-y-1 text-xs font-medium">
//             {/* 1. Dashboard */}
//             <button
//               onClick={() => setActiveModule('DASHBOARD')}
//               className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
//                 activeModule === 'DASHBOARD'
//                   ? 'bg-blue-600 text-white font-semibold'
//                   : 'hover:bg-slate-800 hover:text-white text-slate-400'
//               }`}
//             >
//               <LayoutDashboard className="w-4 h-4" />
//               <span>Dashboard</span>
//             </button>

//             {/* 2. Categories */}
//             <button
//               onClick={() => setActiveModule('CATEGORIES')}
//               className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
//                 activeModule === 'CATEGORIES'
//                   ? 'bg-blue-600 text-white font-semibold'
//                   : 'hover:bg-slate-800 hover:text-white text-slate-400'
//               }`}
//             >
//               <div className="flex items-center space-x-3">
//                 <Layers className="w-4 h-4" />
//                 <span>Categories</span>
//               </div>
//               <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
//                 {categories.length}
//               </span>
//             </button>

//             {/* 3. Subcategories */}
//             <button
//               onClick={() => setActiveModule('SUBCATEGORIES')}
//               className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
//                 activeModule === 'SUBCATEGORIES'
//                   ? 'bg-blue-600 text-white font-semibold'
//                   : 'hover:bg-slate-800 hover:text-white text-slate-400'
//               }`}
//             >
//               <div className="flex items-center space-x-3">
//                 <FolderTree className="w-4 h-4" />
//                 <span>Subcategories</span>
//               </div>
//               <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
//                 {subcategories.length}
//               </span>
//             </button>

//             {/* 4. Documents / PDFs */}
//             <button
//               onClick={() => setActiveModule('DOCUMENTS')}
//               className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
//                 activeModule === 'DOCUMENTS'
//                   ? 'bg-blue-600 text-white font-semibold'
//                   : 'hover:bg-slate-800 hover:text-white text-slate-400'
//               }`}
//             >
//               <div className="flex items-center space-x-3">
//                 <FileText className="w-4 h-4" />
//                 <span>Documents / PDFs</span>
//               </div>
//               <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
//                 {pdfs.length}
//               </span>
//             </button>
//           </nav>
//         </div>

//         {/* Bottom Actions & Logout */}
//         <div className="p-3 border-t border-slate-800 space-y-2">
//           <button
//             onClick={onBackToWebsite}
//             className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
//           >
//             <ArrowLeft className="w-3.5 h-3.5" />
//             <span>Back to Public Site</span>
//           </button>

//           <div className="text-[11px] text-slate-400 px-3 py-1 flex items-center justify-between border-t border-slate-800/60 pt-2">
//             <span className="flex items-center space-x-1.5">
//               <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
//               <span>MongoDB Live</span>
//             </span>
//             <button
//               onClick={() => {
//                 fetchAdminData();
//                 onDataChange();
//                 showNotification('Synced with database.', 'info');
//               }}
//               title="Refresh Data"
//               className="text-slate-400 hover:text-white cursor-pointer"
//             >
//               <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
//             </button>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors cursor-pointer"
//           >
//             <LogOut className="w-3.5 h-3.5" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* RIGHT MAIN CONTENT AREA */}
//       <main className="flex-1 bg-slate-50 flex flex-col justify-between overflow-y-auto">
//         <div>
//           {/* Top Header */}
//           <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <h2 className="font-bold text-slate-800 text-sm">
//                 {activeModule === 'DASHBOARD' && 'Dashboard Overview'}
//                 {activeModule === 'CATEGORIES' && 'Categories Management (CRUD)'}
//                 {activeModule === 'SUBCATEGORIES' && 'Subcategories Management (Flow 2 CRUD)'}
//                 {activeModule === 'DOCUMENTS' && 'PDF Documents Management (Add, Upload & Edit)'}
//               </h2>
//               {loading && (
//                 <span className="text-[11px] text-blue-600 flex items-center space-x-1 font-medium">
//                   <RefreshCw className="w-3 h-3 animate-spin" />
//                   <span>Syncing...</span>
//                 </span>
//               )}
//             </div>

//             <div className="flex items-center space-x-3 text-xs text-slate-500">
//               <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
//                 Admin: <strong className="text-slate-900">admin</strong>
//               </span>
//             </div>
//           </div>

//           {/* Flash Notification Toast */}
//           {notification && (
//             <div
//               className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between border-b ${
//                 notification.type === 'success'
//                   ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
//                   : notification.type === 'error'
//                   ? 'bg-red-50 text-red-900 border-red-200'
//                   : 'bg-blue-50 text-blue-900 border-blue-200'
//               }`}
//             >
//               <div className="flex items-center space-x-2">
//                 {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
//                 {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
//                 {notification.type === 'info' && <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />}
//                 <span>{notification.text}</span>
//               </div>
//               <button
//                 onClick={() => setNotification(null)}
//                 className="text-slate-400 hover:text-slate-600 cursor-pointer"
//               >
//                 <X className="w-3.5 h-3.5" />
//               </button>
//             </div>
//           )}

//           {/* Module Content Wrapper */}
//           <div className="p-6">
//             {/* ============================================= */}
//             {/* 1. DASHBOARD MODULE */}
//             {/* ============================================= */}
//             {activeModule === 'DASHBOARD' && (
//               <div className="space-y-6">
//                 {/* 3 Main Stat Cards */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <div
//                     onClick={() => setActiveModule('CATEGORIES')}
//                     className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</span>
//                       <Layers className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div className="text-2xl font-bold text-slate-900 mt-2">{categories.length}</div>
//                     <p className="text-[11px] text-slate-500 mt-1">Flow 1 & Flow 2 parent categories</p>
//                   </div>

//                   <div
//                     onClick={() => setActiveModule('SUBCATEGORIES')}
//                     className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subcategories</span>
//                       <FolderTree className="w-5 h-5 text-emerald-600" />
//                     </div>
//                     <div className="text-2xl font-bold text-slate-900 mt-2">{subcategories.length}</div>
//                     <p className="text-[11px] text-slate-500 mt-1">Flow 2 nested subcategories</p>
//                   </div>

//                   <div
//                     onClick={() => setActiveModule('DOCUMENTS')}
//                     className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-indigo-400 cursor-pointer transition-all"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total PDFs</span>
//                       <FileText className="w-5 h-5 text-indigo-600" />
//                     </div>
//                     <div className="text-2xl font-bold text-slate-900 mt-2">{pdfs.length}</div>
//                     <p className="text-[11px] text-slate-500 mt-1">Uploaded statutory documents</p>
//                   </div>
//                 </div>

//                 {/* Structure Breakdown Table */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
//                   <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//                     <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
//                       Categories & Documents Overview
//                     </h3>
//                     <span className="text-[11px] text-slate-500">Live MongoDB Data</span>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full text-xs text-left">
//                       <thead className="bg-slate-100/75 font-semibold border-b border-slate-200 text-slate-700">
//                         <tr>
//                           <th className="p-3">Category Name</th>
//                           <th className="p-3 text-center">Subcategories</th>
//                           <th className="p-3 text-center">PDF Documents</th>
//                           <th className="p-3 text-center">Quick Action</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-100">
//                         {categories.map((c) => {
//                           const subs = subcategories.filter((s) => s.categoryId === c.id);
//                           const catPdfs = pdfs.filter((p) => p.categoryId === c.id);
//                           return (
//                             <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
//                               <td className="p-3 font-semibold text-slate-800">{c.name}</td>
//                               <td className="p-3 text-center font-medium text-slate-600">{subs.length}</td>
//                               <td className="p-3 text-center font-bold text-blue-600">{catPdfs.length}</td>
//                               <td className="p-3 text-center">
//                                 <button
//                                   onClick={() => {
//                                     if (subs.length > 0) {
//                                       setActiveModule('SUBCATEGORIES');
//                                       setSubParentCategoryId(c.id);
//                                     } else {
//                                       setActiveModule('DOCUMENTS');
//                                       setDocCategoryFilter(c.id);
//                                     }
//                                   }}
//                                   className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
//                                 >
//                                   Manage Records →
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ============================================= */}
//             {/* 2. CATEGORIES MODULE (CRUD) */}
//             {/* ============================================= */}
//             {activeModule === 'CATEGORIES' && (
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Add / Edit Form */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
//                   <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//                     <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
//                       {editingCategoryId ? 'Edit Category' : 'Add New Category'}
//                     </h3>
//                     {editingCategoryId && (
//                       <button
//                         onClick={() => {
//                           setEditingCategoryId(null);
//                           setCategoryName('');
//                           setCategoryDesc('');
//                         }}
//                         className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
//                     <div>
//                       <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
//                       <input
//                         type="text"
//                         required
//                         value={categoryName}
//                         onChange={(e) => setCategoryName(e.target.value)}
//                         placeholder="e.g., Investor Presentations"
//                         className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
//                       />
//                     </div>

//                     <div>
//                       <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
//                       <textarea
//                         rows={3}
//                         value={categoryDesc}
//                         onChange={(e) => setCategoryDesc(e.target.value)}
//                         placeholder="Brief summary of category archives..."
//                         className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
//                       />
//                     </div>

//                     <button
//                       type="submit"
//                       disabled={savingCategory}
//                       className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
//                     >
//                       <Plus className="w-3.5 h-3.5" />
//                       <span>{savingCategory ? 'Saving to Database...' : editingCategoryId ? 'Update Category' : 'Create Category'}</span>
//                     </button>
//                   </form>
//                 </div>

//                 {/* Categories Table */}
//                 <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
//                   <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//                     <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
//                       Existing Categories ({categories.length})
//                     </h3>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full text-xs text-left">
//                       <thead className="bg-slate-100/75 font-semibold border-b border-slate-200 text-slate-700">
//                         <tr>
//                           <th className="p-3">Category Name</th>
//                           <th className="p-3 text-center">Subcategories</th>
//                           <th className="p-3 text-center">PDFs</th>
//                           <th className="p-3 text-center">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-100">
//                         {categories.map((cat) => {
//                           const catSubs = subcategories.filter((s) => s.categoryId === cat.id);
//                           const catPdfs = pdfs.filter((p) => p.categoryId === cat.id);
//                           const isBeingEdited = editingCategoryId === cat.id;

//                           return (
//                             <tr key={cat.id} className={`hover:bg-slate-50/80 transition-colors ${isBeingEdited ? 'bg-blue-50/40' : ''}`}>
//                               <td className="p-3 font-semibold text-slate-800">
//                                 <div>{cat.name}</div>
//                                 {cat.description && (
//                                   <div className="text-[11px] text-slate-400 font-normal line-clamp-1">
//                                     {cat.description}
//                                   </div>
//                                 )}
//                               </td>
//                               <td className="p-3 text-center font-medium text-slate-600">{catSubs.length}</td>
//                               <td className="p-3 text-center font-bold text-blue-600">{catPdfs.length}</td>
//                               <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
//                                 <button
//                                   onClick={() => {
//                                     setEditingCategoryId(cat.id);
//                                     setCategoryName(cat.name);
//                                     setCategoryDesc(cat.description || '');
//                                   }}
//                                   className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md border border-slate-300 transition-colors cursor-pointer text-[11px]"
//                                 >
//                                   <Edit2 className="w-3 h-3" />
//                                   <span>Edit</span>
//                                 </button>
//                                 <button
//                                   onClick={() => confirmDeleteCategory(cat.id, cat.name)}
//                                   className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-medium rounded-md border border-red-200 transition-colors cursor-pointer text-[11px]"
//                                 >
//                                   <Trash2 className="w-3 h-3" />
//                                   <span>Delete</span>
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ============================================= */}
//             {/* 3. SUBCATEGORIES MODULE (FLOW 2 CRUD) */}
//             {/* ============================================= */}
//             {activeModule === 'SUBCATEGORIES' && (
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Form */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
//                   <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//                     <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
//                       {editingSubcategoryId ? 'Edit Subcategory' : 'Add New Subcategory'}
//                     </h3>
//                     {editingSubcategoryId && (
//                       <button
//                         onClick={() => {
//                           setEditingSubcategoryId(null);
//                           setSubcategoryName('');
//                           setSubcategoryDesc('');
//                         }}
//                         className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   <form onSubmit={handleSaveSubcategory} className="space-y-3.5 text-xs">
//                     <div>
//                       <label className="block font-semibold text-slate-700 mb-1">Parent Category *</label>
//                       <select
//                         required
//                         value={subParentCategoryId}
//                         onChange={(e) => setSubParentCategoryId(e.target.value)}
//                         className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-xs"
//                       >
//                         {categories.map((c) => (
//                           <option key={c.id} value={c.id}>
//                             {c.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block font-semibold text-slate-700 mb-1">Subcategory Name *</label>
//                       <input
//                         type="text"
//                         required
//                         value={subcategoryName}
//                         onChange={(e) => setSubcategoryName(e.target.value)}
//                         placeholder="e.g. Quarterly Governance Reports"
//                         className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
//                       />
//                     </div>

//                     <div>
//                       <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
//                       <textarea
//                         rows={3}
//                         value={subcategoryDesc}
//                         onChange={(e) => setSubcategoryDesc(e.target.value)}
//                         placeholder="Description of documents in this subfolder..."
//                         className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
//                       />
//                     </div>

//                     <button
//                       type="submit"
//                       disabled={savingSubcategory}
//                       className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
//                     >
//                       <Plus className="w-3.5 h-3.5" />
//                       <span>{savingSubcategory ? 'Saving...' : editingSubcategoryId ? 'Update Subcategory' : 'Save Subcategory'}</span>
//                     </button>
//                   </form>
//                 </div>

//                 {/* Subcategories Table */}
//                 <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
//                   <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//                     <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
//                       Existing Subcategories ({subcategories.length})
//                     </h3>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full text-xs text-left">
//                       <thead className="bg-slate-100/75 font-semibold border-b border-slate-200 text-slate-700">
//                         <tr>
//                           <th className="p-3">Parent Category</th>
//                           <th className="p-3">Subcategory Name</th>
//                           <th className="p-3 text-center">PDFs</th>
//                           <th className="p-3 text-center">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-100">
//                         {subcategories.map((sub) => {
//                           const subPdfs = pdfs.filter((p) => p.subcategoryId === sub.id);
//                           const isBeingEdited = editingSubcategoryId === sub.id;

//                           return (
//                             <tr key={sub.id} className={`hover:bg-slate-50/80 transition-colors ${isBeingEdited ? 'bg-blue-50/40' : ''}`}>
//                               <td className="p-3 text-slate-600 font-medium">{sub.categoryName}</td>
//                               <td className="p-3 font-semibold text-slate-800">
//                                 <div>{sub.name}</div>
//                                 {sub.description && (
//                                   <div className="text-[11px] text-slate-400 font-normal line-clamp-1">
//                                     {sub.description}
//                                   </div>
//                                 )}
//                               </td>
//                               <td className="p-3 text-center font-bold text-emerald-600">{subPdfs.length}</td>
//                               <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
//                                 <button
//                                   onClick={() => {
//                                     setEditingSubcategoryId(sub.id);
//                                     setSubParentCategoryId(sub.categoryId);
//                                     setSubcategoryName(sub.name);
//                                     setSubcategoryDesc(sub.description || '');
//                                   }}
//                                   className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md border border-slate-300 transition-colors cursor-pointer text-[11px]"
//                                 >
//                                   <Edit2 className="w-3 h-3" />
//                                   <span>Edit</span>
//                                 </button>
//                                 <button
//                                   onClick={() => confirmDeleteSubcategory(sub.id, sub.name)}
//                                   className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-medium rounded-md border border-red-200 transition-colors cursor-pointer text-[11px]"
//                                 >
//                                   <Trash2 className="w-3 h-3" />
//                                   <span>Delete</span>
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ============================================= */}
//             {/* 4. DOCUMENTS / PDFS MODULE (CRUD) */}
//             {/* ============================================= */}
//             {activeModule === 'DOCUMENTS' && (
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Upload & Add Form */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
//                   <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//                     <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
//                       {editingPdfId ? 'Edit Document Info' : 'Upload / Add PDF Document'}
//                     </h3>
//                     {editingPdfId && (
//                       <button
//                         onClick={() => {
//                           setEditingPdfId(null);
//                           setPdfTitle('');
//                           setPdfFile(null);
//                         }}
//                         className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>

//                   <form onSubmit={handleSavePdf} className="space-y-3.5 text-xs">
//                     {/* Target Category */}
//                     <div>
//                       <label className="block font-semibold text-slate-700 mb-1">Target Category *</label>
//                       <select
//                         required
//                         value={pdfParentCategoryId}
//                         onChange={(e) => {
//                           setPdfParentCategoryId(e.target.value);
//                           setPdfSubcategoryId('');
//                         }}
//                         className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-xs"
//                       >
//                         {categories.map((c) => (
//                           <option key={c.id} value={c.id}>
//                             {c.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Target Subcategory (Optional - Flow 2) */}
//                     <div>
//                       <label className="block font-semibold text-slate-700 mb-1">
//                         Subcategory <span className="text-slate-400 font-normal">(Flow 2 only)</span>
//                       </label>
//                       <select
//                         value={pdfSubcategoryId}
//                         onChange={(e) => setPdfSubcategoryId(e.target.value)}
//                         className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-xs"
//                       >
//                         <option value="">-- None (Direct Category PDF - Flow 1) --</option>
//                         {availableSubsForPdf.map((s) => (
//                           <option key={s.id} value={s.id}>
//                             {s.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* PDF Title */}
//                     <div>
//                       <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
//                       <input
//                         type="text"
//                         required
//                         value={pdfTitle}
//                         onChange={(e) => setPdfTitle(e.target.value)}
//                         placeholder="e.g., Audited Balance Sheet 2023-24"
//                         className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-xs"
//                       />
//                     </div>

//                     {/* Financial Year */}
//                     <div>
//                       <label className="block font-semibold text-slate-700 mb-1">Financial Year</label>
//                       <input
//                         type="text"
//                         value={pdfYear}
//                         onChange={(e) => setPdfYear(e.target.value)}
//                         placeholder="2023-2024"
//                         className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-xs"
//                       />
//                     </div>

//                     {/* File Picker (.pdf only) */}
//                     <div>
//                       <label className="block font-semibold text-slate-700 mb-1">
//                         Select PDF File <span className="text-blue-600 font-normal">(.pdf only)</span>
//                       </label>
//                       <input
//                         type="file"
//                         accept=".pdf,application/pdf"
//                         onChange={(e) => {
//                           if (e.target.files && e.target.files[0]) {
//                             const file = e.target.files[0];
//                             if (!file.name.toLowerCase().endsWith('.pdf')) {
//                               showNotification('Please select a valid .pdf file.', 'error');
//                               return;
//                             }
//                             setPdfFile(file);
//                             if (!pdfTitle) {
//                               setPdfTitle(file.name.replace(/\.[^/.]+$/, ''));
//                             }
//                           }
//                         }}
//                         className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 text-xs file:mr-2.5 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
//                       />
//                       {pdfFile && (
//                         <div className="mt-1 text-[11px] text-emerald-700 font-medium flex items-center space-x-1">
//                           <CheckCircle2 className="w-3 h-3" />
//                           <span>Selected: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(0)} KB)</span>
//                         </div>
//                       )}
//                     </div>

//                     <button
//                       type="submit"
//                       disabled={savingPdf}
//                       className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
//                     >
//                       <Upload className="w-3.5 h-3.5" />
//                       <span>{savingPdf ? 'Saving to Database...' : editingPdfId ? 'Update PDF Record' : 'Upload & Save PDF'}</span>
//                     </button>
//                   </form>
//                 </div>

//                 {/* Documents Table with Live Search & Filter */}
//                 <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
//                   {/* Search & Filter Header */}
//                   <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-xs font-semibold text-slate-700">Category Filter:</span>
//                       <select
//                         value={docCategoryFilter}
//                         onChange={(e) => setDocCategoryFilter(e.target.value)}
//                         className="text-xs border border-slate-300 rounded-lg p-1.5 bg-slate-50 font-medium"
//                       >
//                         <option value="ALL">All Categories ({pdfs.length})</option>
//                         {categories.map((c) => (
//                           <option key={c.id} value={c.id}>
//                             {c.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="relative">
//                       <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
//                       <input
//                         type="text"
//                         value={docSearchQuery}
//                         onChange={(e) => setDocSearchQuery(e.target.value)}
//                         placeholder="Search document title..."
//                         className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 w-52 focus:bg-white focus:outline-none"
//                       />
//                     </div>
//                   </div>

//                   {/* PDFs Table */}
//                   <div className="overflow-x-auto max-h-[500px]">
//                     <table className="w-full text-xs text-left">
//                       <thead className="bg-slate-100/75 font-semibold border-b border-slate-200 text-slate-700 sticky top-0">
//                         <tr>
//                           <th className="p-3">PDF Document Title</th>
//                           <th className="p-3">Category & Subcategory</th>
//                           <th className="p-3 text-center">FY</th>
//                           <th className="p-3 text-center">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-100">
//                         {filteredPdfs.length === 0 ? (
//                           <tr>
//                             <td colSpan={4} className="p-8 text-center text-slate-400 italic">
//                               No PDF documents match your search filter.
//                             </td>
//                           </tr>
//                         ) : (
//                           filteredPdfs.map((doc) => {
//                             const isBeingEdited = editingPdfId === doc.id;

//                             return (
//                               <tr key={doc.id} className={`hover:bg-slate-50/80 transition-colors ${isBeingEdited ? 'bg-blue-50/40' : ''}`}>
//                                 <td className="p-3 font-semibold text-slate-900 max-w-xs">
//                                   <div className="truncate font-medium">{doc.title}</div>
//                                   <div className="text-[10px] text-slate-400 font-normal">
//                                     {doc.fileSize || '420 KB'} • Verified Archive
//                                   </div>
//                                 </td>
//                                 <td className="p-3 text-slate-600">
//                                   <div className="font-semibold text-slate-800">{doc.categoryName}</div>
//                                   {doc.subcategoryName && (
//                                     <div className="text-[11px] text-emerald-700 font-medium">
//                                       ↳ {doc.subcategoryName}
//                                     </div>
//                                   )}
//                                 </td>
//                                 <td className="p-3 text-center font-medium text-slate-600 whitespace-nowrap">
//                                   {doc.year || '2023-24'}
//                                 </td>
//                                 <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
//                                   {/* View Button */}
//                                   <button
//                                     onClick={() => onViewPdf(doc)}
//                                     title="View PDF"
//                                     className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-medium rounded-md border border-blue-200 transition-colors cursor-pointer text-[11px]"
//                                   >
//                                     <Eye className="w-3 h-3" />
//                                     <span>View</span>
//                                   </button>

//                                   {/* Download Button */}
//                                   <button
//                                     onClick={() => generateAndDownloadPdf(doc)}
//                                     title="Download PDF"
//                                     className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-700 font-medium rounded-md border border-slate-300 transition-colors cursor-pointer text-[11px]"
//                                   >
//                                     <Download className="w-3 h-3" />
//                                     <span>Download</span>
//                                   </button>

//                                   {/* Edit Button */}
//                                   <button
//                                     onClick={() => {
//                                       setEditingPdfId(doc.id);
//                                       setPdfParentCategoryId(doc.categoryId);
//                                       setPdfSubcategoryId(doc.subcategoryId || '');
//                                       setPdfTitle(doc.title);
//                                       setPdfYear(doc.year || '2023-2024');
//                                     }}
//                                     title="Edit Document"
//                                     className="inline-flex items-center space-x-1 px-2 py-1 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 font-medium rounded-md border border-amber-200 transition-colors cursor-pointer text-[11px]"
//                                   >
//                                     <Edit2 className="w-3 h-3" />
//                                     <span>Edit</span>
//                                   </button>

//                                   {/* Delete Button */}
//                                   <button
//                                     onClick={() => confirmDeletePdf(doc.id, doc.title)}
//                                     title="Delete Document"
//                                     className="inline-flex items-center space-x-1 px-2 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-medium rounded-md border border-red-200 transition-colors cursor-pointer text-[11px]"
//                                   >
//                                     <Trash2 className="w-3 h-3" />
//                                     <span>Delete</span>
//                                   </button>
//                                 </td>
//                               </tr>
//                             );
//                           })
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* MODAL DIALOG FOR DELETE CONFIRMATION */}
//       {deleteDialog && deleteDialog.isOpen && (
//         <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
//                 <AlertTriangle className="w-5 h-5" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-slate-900 text-sm">Confirm Permanent Deletion</h3>
//                 <p className="text-xs text-slate-500">This action will modify the database records.</p>
//               </div>
//             </div>

//             <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
//               {deleteDialog.warningMsg}
//             </p>

//             <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
//               <button
//                 onClick={() => setDeleteDialog(null)}
//                 className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
//               >
//                 <Trash2 className="w-3.5 h-3.5" />
//                 <span>Confirm Delete</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { Category, Subcategory, PdfDocument } from '../types';
import {
  LayoutDashboard,
  FolderTree,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  X,
  Building2,
  ArrowLeft,
  RefreshCw,
  Upload,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { generateAndDownloadPdf } from '../utils/pdfGenerator';

interface Director {
  id: string;
  name: string;
  designation: string;
}

const DEFAULT_DIRECTORS: Director[] = [
  { id: 'dir-1', name: 'Mr. Sudhir Sethi', designation: 'Chairman & Director' },
  { id: 'dir-2', name: 'Mr. Sanjay Sethi', designation: 'Managing Director' },
  { id: 'dir-3', name: 'Mr. Abhinav Naik', designation: 'Independent Director' },
  { id: 'dir-4', name: 'Ms. Shreya Saraf', designation: 'Independent Director' },
];

interface AdminPanelProps {
  categories: Category[];
  onDataChange: () => void;
  onViewPdf: (doc: PdfDocument) => void;
  onBackToWebsite: () => void;
}

type AdminModule = 'DASHBOARD' | 'CATEGORIES' | 'SUBCATEGORIES' | 'DOCUMENTS' | 'DIRECTORS';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  categories,
  onDataChange,
  onViewPdf,
  onBackToWebsite,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('beryl_admin_token');
  });

  // Active module in sidebar
  const [activeModule, setActiveModule] = useState<AdminModule>('DASHBOARD');

  // Admin login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminpassword123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Supplementary data fetched from Backend
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [directors, setDirectors] = useState<Director[]>(DEFAULT_DIRECTORS);
  const [loading, setLoading] = useState(false);

  // Toast / Flash Notification
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modal Delete Confirmation State
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'CATEGORY' | 'SUBCATEGORY' | 'PDF' | 'DIRECTOR';
    id: string;
    name: string;
    warningMsg: string;
  } | null>(null);

  // ----------------------------------------------------
  // Category Form State
  // ----------------------------------------------------
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);

  // ----------------------------------------------------
  // Subcategory Form State (Flow 2)
  // ----------------------------------------------------
  const [subParentCategoryId, setSubParentCategoryId] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategoryDesc, setSubcategoryDesc] = useState('');
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [savingSubcategory, setSavingSubcategory] = useState(false);

  // ----------------------------------------------------
  // PDF Upload & Edit Form State
  // ----------------------------------------------------
  const [pdfParentCategoryId, setPdfParentCategoryId] = useState('');
  const [pdfSubcategoryId, setPdfSubcategoryId] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfYear, setPdfYear] = useState('2023-2024');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [editingPdfId, setEditingPdfId] = useState<string | null>(null);
  const [savingPdf, setSavingPdf] = useState(false);

  // ----------------------------------------------------
  // Board of Directors Form State
  // ----------------------------------------------------
  const [directorName, setDirectorName] = useState('');
  const [directorDesignation, setDirectorDesignation] = useState('');
  const [editingDirectorId, setEditingDirectorId] = useState<string | null>(null);
  const [savingDirector, setSavingDirector] = useState(false);

  // Document List Search & Category Filter
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [docCategoryFilter, setDocCategoryFilter] = useState('ALL');

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3800);
  };

  // Fetch live collections directly from Backend Database
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [subRes, pdfRes, dirRes] = await Promise.all([
        fetch('/api/subcategories'),
        fetch('/api/pdfs'),
        fetch('/api/directors'),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        if (subData.success && Array.isArray(subData.subcategories)) {
          setSubcategories(subData.subcategories);
        }
      }

      if (pdfRes.ok) {
        const pdfData = await pdfRes.json();
        if (pdfData.success && Array.isArray(pdfData.pdfs)) {
          setPdfs(pdfData.pdfs);
        }
      }

      if (dirRes.ok) {
        const dirData = await dirRes.json();
        if (dirData.success && Array.isArray(dirData.directors)) {
          setDirectors(dirData.directors);
        }
      }
    } catch (err) {
      console.warn('Backend sync note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Set selected parent category in dropdowns
  useEffect(() => {
    if (categories.length > 0) {
      if (!subParentCategoryId) setSubParentCategoryId(categories[0].id);
      if (!pdfParentCategoryId) setPdfParentCategoryId(categories[0].id);
    }
  }, [categories, subParentCategoryId, pdfParentCategoryId]);

  // ----------------------------------------------------
  // Admin Authentication
  // ----------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('beryl_admin_token', data.token);
        showNotification('Login successful. Connected to Database.');
        fetchAdminData();
      } else {
        setLoginError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setLoginError('Could not connect to server.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      // Ignore
    } finally {
      setToken(null);
      localStorage.removeItem('beryl_admin_token');
    }
  };

  // ----------------------------------------------------
  // Category Actions (CRUD)
  // ----------------------------------------------------
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      showNotification('Category name is required.', 'error');
      return;
    }

    setSavingCategory(true);
    try {
      const isEdit = !!editingCategoryId;
      const url = isEdit ? `/api/categories/${editingCategoryId}` : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: categoryName.trim(),
          description: categoryDesc.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCategoryName('');
        setCategoryDesc('');
        setEditingCategoryId(null);
        showNotification(isEdit ? 'Category updated in database.' : 'New category created successfully.');
        onDataChange();
        fetchAdminData();
      } else {
        showNotification(data.error || 'Failed to save category.', 'error');
      }
    } catch (err) {
      showNotification('Error saving category.', 'error');
    } finally {
      setSavingCategory(false);
    }
  };

  const confirmDeleteCategory = (id: string, name: string) => {
    const subCount = subcategories.filter((s) => s.categoryId === id).length;
    const pdfCount = pdfs.filter((p) => p.categoryId === id).length;
    let msg = `Are you sure you want to delete category "${name}"?`;
    if (subCount > 0 || pdfCount > 0) {
      msg = `Category "${name}" contains ${subCount} subcategories and ${pdfCount} PDFs. Deleting it will permanently remove all associated records from MongoDB.`;
    }
    setDeleteDialog({
      isOpen: true,
      type: 'CATEGORY',
      id,
      name,
      warningMsg: msg,
    });
  };

  const executeDeleteCategory = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Category "${name}" deleted from database.`);
        onDataChange();
        fetchAdminData();
      } else {
        showNotification(data.error || 'Failed to delete category.', 'error');
      }
    } catch (err) {
      showNotification('Failed to delete category.', 'error');
    }
  };

  // ----------------------------------------------------
  // Subcategory Actions (Flow 2 CRUD)
  // ----------------------------------------------------
  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subParentCategoryId || !subcategoryName.trim()) {
      showNotification('Parent category and subcategory name are required.', 'error');
      return;
    }

    setSavingSubcategory(true);
    try {
      const isEdit = !!editingSubcategoryId;
      const url = isEdit ? `/api/subcategories/${editingSubcategoryId}` : '/api/subcategories';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId: subParentCategoryId,
          name: subcategoryName.trim(),
          description: subcategoryDesc.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubcategoryName('');
        setSubcategoryDesc('');
        setEditingSubcategoryId(null);
        showNotification(isEdit ? 'Subcategory updated in database.' : 'Subcategory created successfully.');
        onDataChange();
        fetchAdminData();
      } else {
        showNotification(data.error || 'Failed to save subcategory.', 'error');
      }
    } catch (err) {
      showNotification('Error saving subcategory.', 'error');
    } finally {
      setSavingSubcategory(false);
    }
  };

  const confirmDeleteSubcategory = (id: string, name: string) => {
    const pdfCount = pdfs.filter((p) => p.subcategoryId === id).length;
    let msg = `Are you sure you want to delete subcategory "${name}"?`;
    if (pdfCount > 0) {
      msg = `Subcategory "${name}" contains ${pdfCount} PDFs. Deleting it will remove the subcategory and its documents.`;
    }
    setDeleteDialog({
      isOpen: true,
      type: 'SUBCATEGORY',
      id,
      name,
      warningMsg: msg,
    });
  };

  const executeDeleteSubcategory = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/subcategories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Subcategory "${name}" deleted.`);
        onDataChange();
        fetchAdminData();
      } else {
        showNotification(data.error || 'Failed to delete subcategory.', 'error');
      }
    } catch (err) {
      showNotification('Failed to delete subcategory.', 'error');
    }
  };

  // ----------------------------------------------------
  // PDF Document Actions (CRUD)
  // ----------------------------------------------------
  const handleSavePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfParentCategoryId || !pdfTitle.trim()) {
      showNotification('Please select a Category and provide a PDF title.', 'error');
      return;
    }

    setSavingPdf(true);

    let base64Data: string | undefined = undefined;
    let computedSize = '420 KB';

    if (pdfFile) {
      computedSize = `${(pdfFile.size / 1024).toFixed(0)} KB`;
      try {
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(pdfFile);
        });
      } catch (e) {
        console.warn('Could not read PDF file:', e);
      }
    }

    try {
      const isEdit = !!editingPdfId;
      const url = isEdit ? `/api/pdfs/${editingPdfId}` : '/api/pdfs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId: pdfParentCategoryId,
          subcategoryId: pdfSubcategoryId || undefined,
          title: pdfTitle.trim(),
          year: pdfYear.trim() || '2023-2024',
          fileSize: computedSize,
          fileData: base64Data,
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: 'Server returned non-JSON response.' };
      }

      if (res.ok && data.success) {
        setPdfTitle('');
        setPdfFile(null);
        setEditingPdfId(null);
        showNotification(isEdit ? 'PDF document updated in database.' : 'PDF document uploaded and saved to MongoDB.');
        onDataChange();
        fetchAdminData();
      } else if (res.status === 401 || res.status === 403) {
        showNotification('Admin session expired. Please sign in again.', 'error');
        handleLogout();
      } else {
        showNotification(data.error || 'Failed to save PDF.', 'error');
      }
    } catch (err: any) {
      console.error('PDF save error:', err);
      showNotification(`Upload error: ${err?.message || 'Could not connect to server'}`, 'error');
    } finally {
      setSavingPdf(false);
    }
  };

  const confirmDeletePdf = (id: string, title: string) => {
    setDeleteDialog({
      isOpen: true,
      type: 'PDF',
      id,
      name: title,
      warningMsg: `Are you sure you want to permanently delete PDF "${title}" from the database?`,
    });
  };

  const executeDeletePdf = async (id: string) => {
    try {
      const res = await fetch(`/api/pdfs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('PDF document deleted from database.');
        onDataChange();
        fetchAdminData();
      } else {
        showNotification(data.error || 'Failed to delete PDF.', 'error');
      }
    } catch (err) {
      showNotification('Failed to delete PDF.', 'error');
    }
  };

  // ----------------------------------------------------
  // Board of Directors Actions (100% Live Backend Database)
  // ----------------------------------------------------
  const handleSaveDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directorName.trim() || !directorDesignation.trim()) {
      showNotification('Name and Designation are required.', 'error');
      return;
    }

    setSavingDirector(true);
    try {
      const isEdit = !!editingDirectorId;
      const url = isEdit ? `/api/directors/${editingDirectorId}` : '/api/directors';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: directorName.trim(),
          designation: directorDesignation.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDirectorName('');
        setDirectorDesignation('');
        setEditingDirectorId(null);
        showNotification(isEdit ? 'Director details updated in server database.' : 'New Director added to server database.');
        fetchAdminData();
      } else {
        showNotification(data.error || 'Failed to save director.', 'error');
      }
    } catch (err) {
      showNotification('Could not connect to server database.', 'error');
    } finally {
      setSavingDirector(false);
    }
  };

  const confirmDeleteDirector = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      type: 'DIRECTOR',
      id,
      name,
      warningMsg: `Are you sure you want to remove "${name}" from Board of Directors? This will update across all browsers.`,
    });
  };

  const executeDeleteDirector = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/directors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`"${name}" removed from Board of Directors.`);
        fetchAdminData();
      } else {
        showNotification(data.error || 'Failed to delete director.', 'error');
      }
    } catch (err) {
      showNotification('Failed to delete director from server.', 'error');
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteDialog) return;
    const { type, id, name } = deleteDialog;
    setDeleteDialog(null);
    if (type === 'CATEGORY') {
      executeDeleteCategory(id, name);
    } else if (type === 'SUBCATEGORY') {
      executeDeleteSubcategory(id, name);
    } else if (type === 'PDF') {
      executeDeletePdf(id);
    } else if (type === 'DIRECTOR') {
      executeDeleteDirector(id, name);
    }
  };

  // Subcategories available for chosen parent category in PDF form
  const availableSubsForPdf = subcategories.filter((s) => s.categoryId === pdfParentCategoryId);

  // Filtered PDFs list
  const filteredPdfs = pdfs.filter((doc) => {
    const matchesCat = docCategoryFilter === 'ALL' || doc.categoryId === docCategoryFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      (doc.categoryName && doc.categoryName.toLowerCase().includes(docSearchQuery.toLowerCase())) ||
      (doc.subcategoryName && doc.subcategoryName.toLowerCase().includes(docSearchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // ----------------------------------------------------
  // 1. SIMPLE LOGIN PAGE (IF NOT LOGGED IN)
  // ----------------------------------------------------
  if (!token) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-6">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Beryl Drugs Admin</h2>
            <p className="text-xs text-slate-500">Sign in to manage categories & PDFs</p>
          </div>
        </div>

        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg mb-4 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
              placeholder="••••••••••••"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 text-slate-600 p-2.5 rounded-lg text-[11px] flex items-center justify-between">
            <span><strong>Default User:</strong> admin</span>
            <span><strong>Pass:</strong> adminpassword123</span>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-colors cursor-pointer"
          >
            {isLoggingIn ? 'Signing In...' : 'Login to Admin Panel'}
          </button>
        </form>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. NORMAL PROFESSIONAL ADMIN PANEL WITH SIDEBAR
  // ----------------------------------------------------
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden my-3 min-h-[620px] flex flex-col md:flex-row">
      {/* LEFT SIDEBAR */}
      <aside className="w-full md:w-60 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-wide">BERYL DRUGS</div>
              <div className="text-[10px] text-blue-400 font-semibold uppercase">Admin Panel</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-medium">
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveModule('DASHBOARD')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeModule === 'DASHBOARD'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* 2. Categories */}
            <button
              onClick={() => setActiveModule('CATEGORIES')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeModule === 'CATEGORIES'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Layers className="w-4 h-4" />
                <span>Categories</span>
              </div>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {categories.length}
              </span>
            </button>

            {/* 3. Subcategories */}
            <button
              onClick={() => setActiveModule('SUBCATEGORIES')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeModule === 'SUBCATEGORIES'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FolderTree className="w-4 h-4" />
                <span>Subcategories</span>
              </div>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {subcategories.length}
              </span>
            </button>

            {/* 4. Documents / PDFs */}
            <button
              onClick={() => setActiveModule('DOCUMENTS')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeModule === 'DOCUMENTS'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4" />
                <span>Documents / PDFs</span>
              </div>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {pdfs.length}
              </span>
            </button>

            {/* 5. Board of Directors */}
            <button
              onClick={() => setActiveModule('DIRECTORS')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeModule === 'DIRECTORS'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4" />
                <span>Board of Directors</span>
              </div>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {directors.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={onBackToWebsite}
            className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Site</span>
          </button>

          <div className="text-[11px] text-slate-400 px-3 py-1 flex items-center justify-between border-t border-slate-800/60 pt-2">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>MongoDB Live</span>
            </span>
            <button
              onClick={() => {
                fetchAdminData();
                onDataChange();
                showNotification('Synced with database.', 'info');
              }}
              title="Refresh Data"
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 bg-slate-50 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Top Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="font-bold text-slate-800 text-sm">
                {activeModule === 'DASHBOARD' && 'Dashboard Overview'}
                {activeModule === 'CATEGORIES' && 'Categories Management (CRUD)'}
                {activeModule === 'SUBCATEGORIES' && 'Subcategories Management (Flow 2 CRUD)'}
                {activeModule === 'DOCUMENTS' && 'PDF Documents Management (Add, Upload & Edit)'}
                {activeModule === 'DIRECTORS' && 'Board of Directors Management (Add, Edit & Delete)'}
              </h2>
              {loading && (
                <span className="text-[11px] text-blue-600 flex items-center space-x-1 font-medium">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Syncing...</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                Admin: <strong className="text-slate-900">admin</strong>
              </span>
            </div>
          </div>

          {/* Flash Notification Toast */}
          {notification && (
            <div
              className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between border-b ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : notification.type === 'error'
                  ? 'bg-red-50 text-red-900 border-red-200'
                  : 'bg-blue-50 text-blue-900 border-blue-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                {notification.type === 'info' && <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />}
                <span>{notification.text}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Module Content Wrapper */}
          <div className="p-6">
            {/* ============================================= */}
            {/* 1. DASHBOARD MODULE */}
            {/* ============================================= */}
            {activeModule === 'DASHBOARD' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div
                    onClick={() => setActiveModule('CATEGORIES')}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</span>
                      <Layers className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">{categories.length}</div>
                    <p className="text-[11px] text-slate-500 mt-1">Flow 1 & Flow 2 categories</p>
                  </div>

                  <div
                    onClick={() => setActiveModule('SUBCATEGORIES')}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subcategories</span>
                      <FolderTree className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">{subcategories.length}</div>
                    <p className="text-[11px] text-slate-500 mt-1">Flow 2 subfolders</p>
                  </div>

                  <div
                    onClick={() => setActiveModule('DOCUMENTS')}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-indigo-400 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total PDFs</span>
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">{pdfs.length}</div>
                    <p className="text-[11px] text-slate-500 mt-1">Uploaded statutory documents</p>
                  </div>

                  <div
                    onClick={() => setActiveModule('DIRECTORS')}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-purple-400 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Directors</span>
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">{directors.length}</div>
                    <p className="text-[11px] text-slate-500 mt-1">Board of Directors</p>
                  </div>
                </div>

                {/* Structure Breakdown Table */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Categories & Documents Overview
                    </h3>
                    <span className="text-[11px] text-slate-500">Live MongoDB Data</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100/75 font-semibold border-b border-slate-200 text-slate-700">
                        <tr>
                          <th className="p-3">Category Name</th>
                          <th className="p-3 text-center">Subcategories</th>
                          <th className="p-3 text-center">PDF Documents</th>
                          <th className="p-3 text-center">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {categories.map((c) => {
                          const subs = subcategories.filter((s) => s.categoryId === c.id);
                          const catPdfs = pdfs.filter((p) => p.categoryId === c.id);
                          return (
                            <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 font-semibold text-slate-800">{c.name}</td>
                              <td className="p-3 text-center font-medium text-slate-600">{subs.length}</td>
                              <td className="p-3 text-center font-bold text-blue-600">{catPdfs.length}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => {
                                    if (subs.length > 0) {
                                      setActiveModule('SUBCATEGORIES');
                                      setSubParentCategoryId(c.id);
                                    } else {
                                      setActiveModule('DOCUMENTS');
                                      setDocCategoryFilter(c.id);
                                    }
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                                >
                                  Manage Records →
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================= */}
            {/* 2. CATEGORIES MODULE (CRUD) */}
            {/* ============================================= */}
            {activeModule === 'CATEGORIES' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    {editingCategoryId && (
                      <button
                        onClick={() => {
                          setEditingCategoryId(null);
                          setCategoryName('');
                          setCategoryDesc('');
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                      <input
                        type="text"
                        required
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="e.g., Investor Presentations"
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                      <textarea
                        rows={3}
                        value={categoryDesc}
                        onChange={(e) => setCategoryDesc(e.target.value)}
                        placeholder="Brief summary of category archives..."
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingCategory}
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{savingCategory ? 'Saving to Database...' : editingCategoryId ? 'Update Category' : 'Create Category'}</span>
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Existing Categories ({categories.length})
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100/75 font-semibold border-b border-slate-200 text-slate-700">
                        <tr>
                          <th className="p-3">Category Name</th>
                          <th className="p-3 text-center">Subcategories</th>
                          <th className="p-3 text-center">PDFs</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {categories.map((cat) => {
                          const catSubs = subcategories.filter((s) => s.categoryId === cat.id);
                          const catPdfs = pdfs.filter((p) => p.categoryId === cat.id);
                          const isBeingEdited = editingCategoryId === cat.id;

                          return (
                            <tr key={cat.id} className={`hover:bg-slate-50/80 transition-colors ${isBeingEdited ? 'bg-blue-50/40' : ''}`}>
                              <td className="p-3 font-semibold text-slate-800">
                                <div>{cat.name}</div>
                                {cat.description && (
                                  <div className="text-[11px] text-slate-400 font-normal line-clamp-1">
                                    {cat.description}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-center font-medium text-slate-600">{catSubs.length}</td>
                              <td className="p-3 text-center font-bold text-blue-600">{catPdfs.length}</td>
                              <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    setEditingCategoryId(cat.id);
                                    setCategoryName(cat.name);
                                    setCategoryDesc(cat.description || '');
                                  }}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md border border-slate-300 transition-colors cursor-pointer text-[11px]"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => confirmDeleteCategory(cat.id, cat.name)}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-medium rounded-md border border-red-200 transition-colors cursor-pointer text-[11px]"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================= */}
            {/* 3. SUBCATEGORIES MODULE (FLOW 2 CRUD) */}
            {/* ============================================= */}
            {activeModule === 'SUBCATEGORIES' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      {editingSubcategoryId ? 'Edit Subcategory' : 'Add New Subcategory'}
                    </h3>
                    {editingSubcategoryId && (
                      <button
                        onClick={() => {
                          setEditingSubcategoryId(null);
                          setSubcategoryName('');
                          setSubcategoryDesc('');
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveSubcategory} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Parent Category *</label>
                      <select
                        required
                        value={subParentCategoryId}
                        onChange={(e) => setSubParentCategoryId(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-xs"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Subcategory Name *</label>
                      <input
                        type="text"
                        required
                        value={subcategoryName}
                        onChange={(e) => setSubcategoryName(e.target.value)}
                        placeholder="e.g. Quarterly Governance Reports"
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                      <textarea
                        rows={3}
                        value={subcategoryDesc}
                        onChange={(e) => setSubcategoryDesc(e.target.value)}
                        placeholder="Description of documents in this subfolder..."
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingSubcategory}
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{savingSubcategory ? 'Saving...' : editingSubcategoryId ? 'Update Subcategory' : 'Save Subcategory'}</span>
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Existing Subcategories ({subcategories.length})
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100/75 font-semibold border-b border-slate-200 text-slate-700">
                        <tr>
                          <th className="p-3">Parent Category</th>
                          <th className="p-3">Subcategory Name</th>
                          <th className="p-3 text-center">PDFs</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {subcategories.map((sub) => {
                          const subPdfs = pdfs.filter((p) => p.subcategoryId === sub.id);
                          const isBeingEdited = editingSubcategoryId === sub.id;

                          return (
                            <tr key={sub.id} className={`hover:bg-slate-50/80 transition-colors ${isBeingEdited ? 'bg-blue-50/40' : ''}`}>
                              <td className="p-3 text-slate-600 font-medium">{sub.categoryName}</td>
                              <td className="p-3 font-semibold text-slate-800">
                                <div>{sub.name}</div>
                                {sub.description && (
                                  <div className="text-[11px] text-slate-400 font-normal line-clamp-1">
                                    {sub.description}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-center font-bold text-emerald-600">{subPdfs.length}</td>
                              <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    setEditingSubcategoryId(sub.id);
                                    setSubParentCategoryId(sub.categoryId);
                                    setSubcategoryName(sub.name);
                                    setSubcategoryDesc(sub.description || '');
                                  }}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md border border-slate-300 transition-colors cursor-pointer text-[11px]"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => confirmDeleteSubcategory(sub.id, sub.name)}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-medium rounded-md border border-red-200 transition-colors cursor-pointer text-[11px]"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================= */}
            {/* 4. DOCUMENTS / PDFS MODULE (CRUD) */}
            {/* ============================================= */}
            {activeModule === 'DOCUMENTS' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      {editingPdfId ? 'Edit Document Info' : 'Upload / Add PDF Document'}
                    </h3>
                    {editingPdfId && (
                      <button
                        onClick={() => {
                          setEditingPdfId(null);
                          setPdfTitle('');
                          setPdfFile(null);
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSavePdf} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Target Category *</label>
                      <select
                        required
                        value={pdfParentCategoryId}
                        onChange={(e) => {
                          setPdfParentCategoryId(e.target.value);
                          setPdfSubcategoryId('');
                        }}
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-xs"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Subcategory <span className="text-slate-400 font-normal">(Flow 2 only)</span>
                      </label>
                      <select
                        value={pdfSubcategoryId}
                        onChange={(e) => setPdfSubcategoryId(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-xs"
                      >
                        <option value="">-- None (Direct Category PDF - Flow 1) --</option>
                        {availableSubsForPdf.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                      <input
                        type="text"
                        required
                        value={pdfTitle}
                        onChange={(e) => setPdfTitle(e.target.value)}
                        placeholder="e.g., Audited Balance Sheet 2023-24"
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Financial Year</label>
                      <input
                        type="text"
                        value={pdfYear}
                        onChange={(e) => setPdfYear(e.target.value)}
                        placeholder="2023-2024"
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Select PDF File <span className="text-blue-600 font-normal">(.pdf only)</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            if (!file.name.toLowerCase().endsWith('.pdf')) {
                              showNotification('Please select a valid .pdf file.', 'error');
                              return;
                            }
                            setPdfFile(file);
                            if (!pdfTitle) {
                              setPdfTitle(file.name.replace(/\.[^/.]+$/, ''));
                            }
                          }
                        }}
                        className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 text-xs file:mr-2.5 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
                      />
                      {pdfFile && (
                        <div className="mt-1 text-[11px] text-emerald-700 font-medium flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Selected: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(0)} KB)</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={savingPdf}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{savingPdf ? 'Saving to Database...' : editingPdfId ? 'Update PDF Record' : 'Upload & Save PDF'}</span>
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-700">Category Filter:</span>
                      <select
                        value={docCategoryFilter}
                        onChange={(e) => setDocCategoryFilter(e.target.value)}
                        className="text-xs border border-slate-300 rounded-lg p-1.5 bg-slate-50 font-medium"
                      >
                        <option value="ALL">All Categories ({pdfs.length})</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={docSearchQuery}
                        onChange={(e) => setDocSearchQuery(e.target.value)}
                        placeholder="Search document title..."
                        className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg bg-slate-50 w-52 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100/75 font-semibold border-b border-slate-200 text-slate-700 sticky top-0">
                        <tr>
                          <th className="p-3">PDF Document Title</th>
                          <th className="p-3">Category & Subcategory</th>
                          <th className="p-3 text-center">FY</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPdfs.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                              No PDF documents match your search filter.
                            </td>
                          </tr>
                        ) : (
                          filteredPdfs.map((doc) => {
                            const isBeingEdited = editingPdfId === doc.id;

                            return (
                              <tr key={doc.id} className={`hover:bg-slate-50/80 transition-colors ${isBeingEdited ? 'bg-blue-50/40' : ''}`}>
                                <td className="p-3 font-semibold text-slate-900 max-w-xs">
                                  <div className="truncate font-medium">{doc.title}</div>
                                  <div className="text-[10px] text-slate-400 font-normal">
                                    {doc.fileSize || '420 KB'} • Verified Archive
                                  </div>
                                </td>
                                <td className="p-3 text-slate-600">
                                  <div className="font-semibold text-slate-800">{doc.categoryName}</div>
                                  {doc.subcategoryName && (
                                    <div className="text-[11px] text-emerald-700 font-medium">
                                      ↳ {doc.subcategoryName}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3 text-center font-medium text-slate-600 whitespace-nowrap">
                                  {doc.year || '2023-24'}
                                </td>
                                <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => onViewPdf(doc)}
                                    title="View PDF"
                                    className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-medium rounded-md border border-blue-200 transition-colors cursor-pointer text-[11px]"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View</span>
                                  </button>

                                  <button
                                    onClick={() => generateAndDownloadPdf(doc)}
                                    title="Download PDF"
                                    className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-700 font-medium rounded-md border border-slate-300 transition-colors cursor-pointer text-[11px]"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Download</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setEditingPdfId(doc.id);
                                      setPdfParentCategoryId(doc.categoryId);
                                      setPdfSubcategoryId(doc.subcategoryId || '');
                                      setPdfTitle(doc.title);
                                      setPdfYear(doc.year || '2023-2024');
                                    }}
                                    title="Edit Document"
                                    className="inline-flex items-center space-x-1 px-2 py-1 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 font-medium rounded-md border border-amber-200 transition-colors cursor-pointer text-[11px]"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    onClick={() => confirmDeletePdf(doc.id, doc.title)}
                                    title="Delete Document"
                                    className="inline-flex items-center space-x-1 px-2 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-medium rounded-md border border-red-200 transition-colors cursor-pointer text-[11px]"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================= */}
            {/* 5. BOARD OF DIRECTORS MODULE (NEW CRUD) */}
            {/* ============================================= */}
            {activeModule === 'DIRECTORS' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to Add / Edit Director */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      {editingDirectorId ? 'Edit Director Info' : 'Add New Director'}
                    </h3>
                    {editingDirectorId && (
                      <button
                        onClick={() => {
                          setEditingDirectorId(null);
                          setDirectorName('');
                          setDirectorDesignation('');
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveDirector} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Director Name *</label>
                      <input
                        type="text"
                        required
                        value={directorName}
                        onChange={(e) => setDirectorName(e.target.value)}
                        placeholder="e.g., Mr. Sudhir Sethi"
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Designation *</label>
                      <input
                        type="text"
                        required
                        value={directorDesignation}
                        onChange={(e) => setDirectorDesignation(e.target.value)}
                        placeholder="e.g., Chairman & Director"
                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingDirector}
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{savingDirector ? 'Saving...' : editingDirectorId ? 'Update Director' : 'Add Director'}</span>
                    </button>
                  </form>
                </div>

                {/* Directors Table List */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Board of Directors List ({directors.length})
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100/75 font-semibold border-b border-slate-200 text-slate-700">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">Director Name</th>
                          <th className="p-3">Designation</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {directors.map((dir, idx) => {
                          const isBeingEdited = editingDirectorId === dir.id;

                          return (
                            <tr key={dir.id} className={`hover:bg-slate-50/80 transition-colors ${isBeingEdited ? 'bg-blue-50/40' : ''}`}>
                              <td className="p-3 text-slate-400 font-medium">{idx + 1}</td>
                              <td className="p-3 font-semibold text-slate-900">{dir.name}</td>
                              <td className="p-3 text-slate-600 font-medium">{dir.designation}</td>
                              <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    setEditingDirectorId(dir.id);
                                    setDirectorName(dir.name);
                                    setDirectorDesignation(dir.designation);
                                  }}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md border border-slate-300 transition-colors cursor-pointer text-[11px]"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => confirmDeleteDirector(dir.id, dir.name)}
                                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-medium rounded-md border border-red-200 transition-colors cursor-pointer text-[11px]"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL DIALOG FOR DELETE CONFIRMATION */}
      {deleteDialog && deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Confirm Permanent Deletion</h3>
                <p className="text-xs text-slate-500">This action will modify the database records.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
              {deleteDialog.warningMsg}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteDialog(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};