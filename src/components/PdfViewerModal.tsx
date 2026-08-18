import React, { useState, useEffect, useRef } from 'react';
import { PdfDocument } from '../types';
import { 
  X, Printer, ShieldCheck, FileCheck, Building2, CheckCircle2, 
  ArrowDownToLine, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, 
  ExternalLink, Loader2, AlertCircle 
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up pdf.js worker using unpkg / cdnjs worker compatible with modern browsers
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PdfViewerModalProps {
  document: PdfDocument | null;
  onClose: () => void;
  onDownload: (doc: PdfDocument) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  document,
  onClose,
  onDownload,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<any>(null);

  const hasUploadedPdf = Boolean(document?.fileData && document.fileData.startsWith('data:application/pdf'));

  // Load PDF Document when modal opens with uploaded fileData
  useEffect(() => {
    if (!document || !hasUploadedPdf || !document.fileData) {
      setNumPages(0);
      setPageNumber(1);
      pdfDocRef.current = null;
      return;
    }

    let isMounted = true;
    setLoading(true);
    setRenderError(null);
    setPageNumber(1);

    async function loadPdf() {
      try {
        // Convert base64 to typed array
        const base64String = document!.fileData!.split(',')[1];
        const binaryString = window.atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        const pdf = await loadingTask.promise;
        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err: any) {
        console.error('PDF.js loading error:', err);
        if (isMounted) {
          setRenderError(err?.message || 'Could not load PDF document preview');
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [document?.id, document?.fileData, hasUploadedPdf]);

  // Render current page to Canvas
  useEffect(() => {
    if (!pdfDocRef.current || !canvasRef.current || pageNumber < 1) return;

    let renderTask: any = null;

    async function renderPage() {
      try {
        const page = await pdfDocRef.current.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('Page rendering error:', err);
        }
      }
    }

    renderPage();

    return () => {
      if (renderTask && renderTask.cancel) {
        renderTask.cancel();
      }
    };
  }, [pageNumber, scale, numPages]);

  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleOpenInNewTab = () => {
    if (document.fileData) {
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${document.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[94vh] flex flex-col border border-slate-800 overflow-hidden">
        {/* Modal Toolbar Header */}
        <div className="bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0 gap-3">
          <div className="flex items-center space-x-3 truncate max-w-lg">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="font-bold text-sm sm:text-base text-white truncate leading-tight">
                {document.title}
              </h3>
              <p className="text-[10px] text-slate-400 truncate">
                Category: {document.categoryName || document.category} {document.year ? `• FY ${document.year}` : ''}
              </p>
            </div>
          </div>

          {/* Interactive Navigation Controls (For Native PDF Canvas Viewer) */}
          {hasUploadedPdf && numPages > 0 && (
            <div className="hidden sm:flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-2 py-1 space-x-2 text-xs">
              <button
                onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                disabled={pageNumber <= 1}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-300 font-semibold px-1">
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
                disabled={pageNumber >= numPages}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))}
                className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-slate-400">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale((s) => Math.min(s + 0.2, 2.5))}
                className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            {hasUploadedPdf && (
              <button
                onClick={handleOpenInNewTab}
                className="hidden md:flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-700 cursor-pointer"
                title="Open in new window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Full Tab</span>
              </button>
            )}

            <button
              onClick={() => onDownload(document)}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold p-2 rounded-xl border border-slate-700 cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Area */}
        <div className="flex-1 overflow-auto p-3 sm:p-6 bg-slate-950/80 flex items-center justify-center">
          {hasUploadedPdf ? (
            /* NATIVE CANVAS PDF RENDERING (ZERO CHROME BLOCKING) */
            <div className="flex flex-col items-center justify-center min-h-full py-4">
              {loading && (
                <div className="flex flex-col items-center justify-center p-12 text-slate-300">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
                  <p className="text-sm font-semibold">Loading original PDF pages...</p>
                </div>
              )}

              {renderError && (
                <div className="bg-red-950/50 border border-red-500/30 rounded-2xl p-6 text-center max-w-md text-slate-200">
                  <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                  <h4 className="font-bold text-red-300 mb-1">Preview Loading Notice</h4>
                  <p className="text-xs text-slate-400 mb-4">{renderError}</p>
                  <button
                    onClick={() => onDownload(document)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Download Direct PDF File
                  </button>
                </div>
              )}

              <div
                className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all ${
                  loading ? 'hidden' : 'block'
                }`}
              >
                <canvas ref={canvasRef} className="max-w-full h-auto shadow-inner" />
              </div>

              {/* Mobile pagination controls */}
              {numPages > 1 && (
                <div className="flex sm:hidden items-center justify-center gap-3 mt-4 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="p-1 text-slate-300 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-300">
                    {pageNumber} / {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
                    disabled={pageNumber >= numPages}
                    className="p-1 text-slate-300 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* GENERATED OFFICIAL CORPORATE LETTERHEAD PREVIEW (FOR SYSTEM SEED RECORDS) */
            <div className="bg-white text-slate-900 w-full max-w-3xl min-h-[720px] shadow-2xl p-6 sm:p-10 border border-slate-200 rounded-2xl flex flex-col justify-between font-sans relative my-auto">
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <Building2 className="w-96 h-96 text-blue-900" />
              </div>

              <div>
                {/* Official Header */}
                <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                      BERYL DRUGS LIMITED
                    </h1>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      CIN: L02423MP1993PLC007840 | ISO 9001:2015 & WHO-GMP CERTIFIED
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Regd. Office: 29, Neer Nagar, Mayank Water Park Road, Bicholi, Indore-452016 (M.P.)
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <p className="font-bold text-blue-600">BSE LISTED ENTITY</p>
                    <p>Scrip Code: 524680</p>
                    <p>ISIN: INE415D01017</p>
                  </div>
                </div>

                {/* Title Card */}
                <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-4 mb-6 text-center shadow-xs">
                  <span className="text-[10px] font-extrabold text-blue-700 tracking-widest uppercase block mb-1">
                    OFFICIAL STATUTORY DISCLOSURE & REGULATORY FILING
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase leading-snug">
                    {document.title}
                  </h2>
                </div>

                {/* Compliance Details Grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
                  <div>
                    <span className="text-slate-500 block">Category:</span>
                    <span className="font-bold text-slate-800">{document.categoryName || document.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Subcategory / Section:</span>
                    <span className="font-bold text-slate-800">{document.subcategoryName || document.subcategory || 'General Filing'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Financial Period:</span>
                    <span className="font-bold text-slate-800">{document.year || '2023-2024'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Filing Status:</span>
                    <span className="inline-flex items-center text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified & Archived
                    </span>
                  </div>
                </div>

                {/* Text Body */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  <p>
                    This is to inform that the Board of Directors of Beryl Drugs Limited at its official meeting reviewed and took on record the document titled <strong className="text-slate-900 font-bold">"{document.title}"</strong> in accordance with SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015.
                  </p>
                  <p>
                    The detailed schedules, accounting disclosures, and statutory annexures pertaining to this filing have been verified by the Compliance Officer and uploaded to the Stock Exchange (BSE Ltd.) portal for public record.
                  </p>
                  <p>
                    Any shareholder or investor requiring additional clarification regarding these disclosures may communicate directly with the corporate investor relations desk at info@beryldrugs.com.
                  </p>
                </div>
              </div>

              {/* Signature & Seal Footer Block */}
              <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <div className="flex items-center space-x-1.5 text-slate-900 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Beryl Drugs Digital Archive</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    This statutory filing is certified for public investor dissemination.
                  </p>
                </div>

                <div className="text-right border border-dashed border-blue-400 p-3.5 rounded-xl bg-blue-50/50">
                  <p className="font-bold text-slate-900">FOR BERYL DRUGS LIMITED</p>
                  <p className="text-blue-600 font-serif italic my-1 font-bold">
                    [ Digitally Signed ]
                  </p>
                  <p className="text-[10px] text-slate-600">Company Secretary & Compliance Officer</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-950 text-slate-400 px-5 py-2.5 text-xs flex justify-between items-center border-t border-slate-800">
          <span>Document ID: {document.id}</span>
          <button
            onClick={() => onDownload(document)}
            className="text-blue-400 hover:text-blue-300 font-bold underline transition-colors cursor-pointer"
          >
            Click here to save PDF file
          </button>
        </div>
      </div>
    </div>
  );
};
