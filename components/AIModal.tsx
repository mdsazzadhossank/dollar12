import React from 'react';
import { X, Sparkles, Bot } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  content: string | null;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, loading, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 border border-white/20">
        {/* Header */}
        <div className="relative p-6 border-b border-slate-100 bg-white">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Portfolio Analysis</h3>
                        <p className="text-xs text-slate-500">AI-powered insights (Bangla)</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
        
        {/* Content */}
        <div className="p-8 min-h-[300px] bg-slate-50/50 flex flex-col">
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                        <Bot className="w-12 h-12 text-indigo-600 relative z-10 animate-bounce" />
                    </div>
                    <div className="text-center">
                        <h4 className="text-slate-900 font-medium mb-1">Analyzing Data</h4>
                        <p className="text-sm text-slate-500">Generating insights via Gemini...</p>
                    </div>
                </div>
            ) : (
                <div className="prose prose-slate prose-headings:font-bold prose-p:text-slate-600 prose-li:text-slate-600 max-w-none">
                    <div className="whitespace-pre-line leading-relaxed text-slate-700 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        {content}
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        {!loading && (
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                <button 
                    onClick={onClose}
                    className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                >
                    Close Analysis
                </button>
            </div>
        )}
      </div>
    </div>
  );
};