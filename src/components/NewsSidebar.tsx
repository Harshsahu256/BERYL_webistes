import React, { useState, useEffect } from 'react';
import { Newspaper, BellRing, CheckCircle2, RefreshCw } from 'lucide-react';
import { CorporateNewsItem } from '../types';
import { INITIAL_NEWS_ITEMS } from '../data/companyData';

export const NewsSidebar: React.FC = () => {
  const [newsList, setNewsList] = useState<CorporateNewsItem[]>(INITIAL_NEWS_ITEMS);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        if (data.news && Array.isArray(data.news)) {
          setNewsList(data.news);
        }
      }
    } catch (err) {
      console.warn('Backend news API unavailable, using cached company bulletins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* News Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5 font-extrabold text-base tracking-tight">
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
            <Newspaper className="w-4 h-4" />
          </div>
          <span>Corporate Bulletins</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchNews}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh Bulletins"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping mr-0.5" />
            Live News
          </span>
        </div>
      </div>

      {/* News Content Box */}
      <div className="p-4 bg-slate-50/50 space-y-3">
        {newsList.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 bg-white rounded-xl border shadow-xs space-y-2 hover:border-blue-300 transition-colors ${
              item.isImportant ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center space-x-1.5 text-blue-900 font-bold text-xs uppercase tracking-wider">
              <BellRing className={`w-3.5 h-3.5 text-blue-600 ${item.isImportant ? 'animate-bounce' : ''}`} />
              <span>{item.title}</span>
            </div>
            <p className="text-slate-800 font-medium text-xs leading-relaxed">
              {item.content}
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {item.tag}
              </span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
