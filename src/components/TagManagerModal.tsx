import React, { useState } from 'react';
import { 
  X, 
  Tag as TagIcon, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { Bookmark } from '../types';

interface TagManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  selectedBookmarkIds: string[];
  allExistingTags: string[];
  onApplyTags: (targetBookmarkIds: string[], tagsToAdd: string[], tagsToRemove: string[]) => void;
  onAutoTagAI: (targetBookmarkIds: string[]) => void;
  isAiTagging: boolean;
}

export const TagManagerModal: React.FC<TagManagerModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  selectedBookmarkIds,
  allExistingTags,
  onApplyTags,
  onAutoTagAI,
  isAiTagging
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [tagsToAdd, setTagsToAdd] = useState<string[]>([]);
  const [tagsToRemove, setTagsToRemove] = useState<string[]>([]);

  if (!isOpen) return null;

  const targetBookmarks = selectedBookmarkIds.length > 0
    ? bookmarks.filter(b => selectedBookmarkIds.includes(b.id))
    : bookmarks;

  const handleAddTag = () => {
    const clean = newTagInput.trim().toLowerCase().replace(/^#/, '');
    if (clean && !tagsToAdd.includes(clean)) {
      setTagsToAdd([...tagsToAdd, clean]);
      setTagsToRemove(tagsToRemove.filter(t => t !== clean));
      setNewTagInput('');
    }
  };

  const handleQuickAddExisting = (tag: string) => {
    if (!tagsToAdd.includes(tag)) {
      setTagsToAdd([...tagsToAdd, tag]);
      setTagsToRemove(tagsToRemove.filter(t => t !== tag));
    }
  };

  const handleRemoveExistingTag = (tag: string) => {
    if (!tagsToRemove.includes(tag)) {
      setTagsToRemove([...tagsToRemove, tag]);
      setTagsToAdd(tagsToAdd.filter(t => t !== tag));
    }
  };

  const handleSave = () => {
    const ids = targetBookmarks.map(b => b.id);
    onApplyTags(ids, tagsToAdd, tagsToRemove);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111114] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#111114]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <TagIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Manage & Batch Edit Tags</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                TARGETING {targetBookmarks.length} BOOKMARK{targetBookmarks.length !== 1 ? 'S' : ''}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-2 rounded-2xl bg-white/5 border border-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 text-xs">
          
          {/* AI Auto-Tag Banner */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Let Gemini AI Tag Automatically
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Analyzes domain, page title, and content to attach 3-5 smart semantic tags.
              </p>
            </div>
            <button
              onClick={() => onAutoTagAI(targetBookmarks.map(b => b.id))}
              disabled={isAiTagging}
              className="px-4 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition shrink-0 flex items-center gap-1.5 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiTagging ? 'Tagging...' : 'AI Auto-Tag'}</span>
            </button>
          </div>

          {/* Add custom tag input */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5">ADD TAGS TO SELECTED</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="e.g. react, docs, machine-learning"
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* Tags staged to add */}
            {tagsToAdd.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-emerald-400 font-mono">WILL ADD:</span>
                {tagsToAdd.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px]"
                  >
                    #{tag}
                    <button
                      onClick={() => setTagsToAdd(tagsToAdd.filter(t => t !== tag))}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick select from existing library tags */}
          {allExistingTags.length > 0 && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1.5">QUICK-PICK FROM EXISTING TAGS</label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-black/30 rounded-2xl border border-white/5">
                {allExistingTags.map(tag => {
                  const isStagedAdd = tagsToAdd.includes(tag);
                  const isStagedRemove = tagsToRemove.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => isStagedAdd ? setTagsToAdd(tagsToAdd.filter(t => t !== tag)) : handleQuickAddExisting(tag)}
                      className={`px-2.5 py-1 rounded-xl font-mono text-[10px] transition border ${
                        isStagedAdd
                          ? 'bg-emerald-500/30 text-emerald-200 border-emerald-500/50'
                          : isStagedRemove
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 line-through'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#111114] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
          >
            <Check className="w-4 h-4" />
            <span>Apply Tags ({tagsToAdd.length + tagsToRemove.length} Changes)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
