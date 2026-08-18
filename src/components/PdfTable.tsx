import React, { useState, useMemo } from 'react';
import { PdfDocument } from '../types';
import { FileText, Eye, Search, RefreshCw, FileCheck, ArrowDownToLine } from 'lucide-react';

interface PdfTableProps {
  title: string;
  bannerImage?: string;
  documents: PdfDocument[];
  onViewPdf: (doc: PdfDocument) => void;
  onDownloadPdf: (doc: PdfDocument) => void;
}

export const PdfTable: React.FC<PdfTableProps> = ({
  title,
  bannerImage,
  documents,
  onViewPdf,
  onDownloadPdf,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');

  // Extract unique financial years for filter
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    documents.forEach((doc) => {
      if (doc.year) years.add(doc.year);
    });
    return Array.from(years).sort().reverse();
  }, [documents]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === 'ALL' || doc.year === selectedYear;
      return matchesSearch && matchesYear;
    });
  }, [documents, searchTerm, selectedYear]);

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Header Bar */}
      <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">{title}</h2>
            <p className="text-xs text-slate-400 font-medium">
              Official SEBI Disclosures & Verified BSE Archive
            </p>
          </div>
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm ml-2">
            {filteredDocs.length} PDFs
          </span>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-44 sm:w-60 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Year Filter */}
          {availableYears.length > 0 && (
            <div className="flex items-center space-x-1">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Financial Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    FY {yr}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(searchTerm || selectedYear !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedYear('ALL');
              }}
              className="p-1.5 text-xs text-slate-300 hover:text-white border border-slate-700 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Banner Graphic Image Card */}
      {bannerImage && (
        <div className="w-full h-36 sm:h-44 overflow-hidden bg-slate-900 relative">
          <img
            src={bannerImage}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.8]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-5 text-white">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-800/50 backdrop-blur-md">
              Beryl Statutory Compliance Vault
            </span>
          </div>
        </div>
      )}

      {/* Modern PDF Documents Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-5 border-r border-slate-200/80 w-8/12">
                Document Description & Compliance Details
              </th>
              <th className="py-3.5 px-5 text-center w-4/12">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc, idx) => (
                <tr
                  key={doc.id}
                  className={`group hover:bg-blue-50/60 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  {/* Document Title & Badge */}
                  <td className="py-3.5 px-5 border-r border-slate-200/60 font-semibold text-slate-800">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0 border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight text-xs sm:text-sm font-bold">
                          {doc.title}
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                            {doc.category} {doc.year ? `(${doc.year})` : ''}
                          </span>
                          <span className="text-emerald-700 font-semibold flex items-center">
                            <FileCheck className="w-3 h-3 mr-0.5" /> Verified Filing
                          </span>
                          {doc.fileSize && (
                            <span className="text-slate-400 font-normal">
                              • {doc.fileSize}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* PDF Preview & Download Actions */}
                  <td className="py-3.5 px-5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onViewPdf(doc)}
                        className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View PDF file</span>
                      </button>

                      <button
                        onClick={() => onDownloadPdf(doc)}
                        className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 transition-all hover:scale-105 active:scale-95"
                        title="Download PDF Document"
                      >
                        <ArrowDownToLine className="w-3.5 h-3.5 text-slate-700" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-12 text-center text-slate-500 italic space-y-2">
                  <p className="text-sm font-medium">No matching PDF documents found for your search/filter criteria.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedYear('ALL');
                    }}
                    className="text-xs text-blue-600 font-bold underline"
                  >
                    Clear Search Filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
