import React from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  content: string | null;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, loading, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 text-blue-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-gray-900">AI Insights (বাংলা)</h3>
            </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 min-h-[200px] flex flex-col">
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-blue-600 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-sm font-medium text-gray-500">Analyzing your portfolio...</p>
                </div>
            ) : (
                <div className="prose prose-sm prose-blue max-w-none">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {content}
                    </div>
                </div>
            )}
        </div>

        {!loading && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Close
                </button>
            </div>
        )}
      </div>
    </div>
  );
};