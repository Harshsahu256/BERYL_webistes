import React, { useState, useEffect, useCallback } from 'react';
import { NavTab, Category, PdfDocument } from './types';
import { generateAndDownloadPdf } from './utils/pdfGenerator';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { AboutUsView } from './components/AboutUsView';
import { ProductView } from './components/ProductView';
import { QualitySystemView } from './components/QualitySystemView';
import { InfrastructureView } from './components/InfrastructureView';
import { FeedbackView } from './components/FeedbackView';
import { ContactUsView } from './components/ContactUsView';
import { PdfViewerModal } from './components/PdfViewerModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Path detection for /admin route
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#/admin'
      ? '/admin'
      : '/';
  });

  const [activeNavTab, setActiveNavTab] = useState<NavTab>('HOME');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [activePdfDoc, setActivePdfDoc] = useState<PdfDocument | null>(null);

  // Fetch Categories from Backend REST API
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.warn('Backend categories API note:', err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    const handlePopState = () => {
      const path = window.location.pathname === '/admin' || window.location.hash === '#/admin'
        ? '/admin'
        : '/';
      setCurrentPath(path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [fetchCategories]);

  const navigateToHome = () => {
    setCurrentPath('/');
    setActiveNavTab('HOME');
    setSelectedCategoryId(null);
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Category selection from Home Cards
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // PDF View & Download handlers
  const handleViewPdf = (doc: PdfDocument) => {
    setActivePdfDoc(doc);
  };

  const handleDownloadPdf = (doc: PdfDocument) => {
    generateAndDownloadPdf(doc);
  };

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);

  // Get Custom Slider Title based on active page
  const getSliderTitle = () => {
    if (selectedCategoryObj) {
      return selectedCategoryObj.name;
    }
    if (activeNavTab !== 'HOME') {
      return activeNavTab;
    }
    return undefined;
  };

  const isAdminRoute = currentPath === '/admin';

  return (
    <div className="min-h-screen bg-[#e8eef5] text-slate-900 font-sans flex flex-col justify-between">
      <div>
        {/* Top Header Navigation (Completely clean, no admin buttons) */}
        <Header
          activeTab={activeNavTab}
          onTabChange={(tab) => {
            setCurrentPath('/');
            setActiveNavTab(tab);
            setSelectedCategoryId(null);
          }}
          onNavigateHome={navigateToHome}
        />

        {/* Hero Slider Banner (Only on public website) */}
        {!isAdminRoute && <HeroSlider customTitle={getSliderTitle()} />}

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full">
          {/* 1. SEPARATE /admin ROUTE */}
          {isAdminRoute && (
            <AdminPanel
              categories={categories}
              onDataChange={fetchCategories}
              onViewPdf={handleViewPdf}
              onBackToWebsite={navigateToHome}
            />
          )}

          {/* 2. PUBLIC WEBSITE (NO LOGIN/ADMIN CONTROLS) */}
          {!isAdminRoute && (
            <>
              {activeNavTab === 'HOME' && !selectedCategoryId && (
                <HomeView
                  categories={categories}
                  onSelectCategory={handleSelectCategory}
                />
              )}

              {selectedCategoryObj && (
                <CategoryView
                  category={selectedCategoryObj}
                  onViewPdf={handleViewPdf}
                  onDownloadPdf={handleDownloadPdf}
                  onBackToHome={navigateToHome}
                />
              )}

              {activeNavTab === 'ABOUT US' && !selectedCategoryId && <AboutUsView />}
              {activeNavTab === 'PRODUCT' && !selectedCategoryId && <ProductView />}
              {activeNavTab === 'QUALITY SYSTEM' && !selectedCategoryId && <QualitySystemView />}
              {activeNavTab === 'INFRASTRUCTURE' && !selectedCategoryId && <InfrastructureView />}
              {activeNavTab === 'FEEDBACK' && !selectedCategoryId && <FeedbackView />}
              {activeNavTab === 'CONTACT US' && !selectedCategoryId && <ContactUsView />}
            </>
          )}
        </main>
      </div>

      {/* PDF Document Viewer Modal */}
      <PdfViewerModal
        document={activePdfDoc}
        onClose={() => setActivePdfDoc(null)}
        onDownload={handleDownloadPdf}
      />

      {/* Footer Bar */}
      <Footer />
    </div>
  );
}
