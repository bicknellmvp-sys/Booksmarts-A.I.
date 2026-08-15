import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Folder, 
  Tag, 
  RotateCcw,
  AlertTriangle,
  FileText,
  FileCode,
  Download,
  Copy,
  Printer,
  Edit3,
  Search,
  Check,
  Plus,
  Trash2,
  SlidersHorizontal,
  ExternalLink,
  Eye,
  CheckSquare,
  Square,
  RefreshCw,
  FolderPlus
} from 'lucide-react';
import { Bookmark, CategorizationResponse } from '../types';
import { 
  PlannedItemReport, 
  ReorganizationReportData, 
  generateTextReport, 
  generateDocReport, 
  generateMarkdownReport, 
  downloadReportFile 
} from '../utils/reportGenerator';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (approvedItems?: PlannedItemReport[]) => void;
  categorizationResponse: CategorizationResponse | null;
  originalBookmarks: Bookmark[];
  targetBookmarks: Bookmark[];
  allExistingFolders?: string[];
}

type ModalViewTab = 'corrections' | 'report' | 'raw-text';
type FilterFilter = 'all' | 'moved' | 'modified' | 'excluded' | 'duplicates';

export const DiffModal: React.FC<DiffModalProps> = ({
  isOpen,
  onClose,
  onApply,
  categorizationResponse,
  originalBookmarks,
  targetBookmarks,
  allExistingFolders = []
}) => {
  const [activeTab, setActiveTab] = useState<ModalViewTab>('corrections');
  const [items, setItems] = useState<PlannedItemReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterFilter>('all');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [customFolderInputs, setCustomFolderInputs] = useState<Record<string, string>>({});
  const [showCustomFolderBox, setShowCustomFolderBox] = useState<Record<string, boolean>>({});
  const [newTagInput, setNewTagInput] = useState<Record<string, string>>({});
  const [bulkFolderInput, setBulkFolderInput] = useState('');
  const [showBulkFolderModal, setShowBulkFolderModal] = useState(false);

  // Initialize planned items when categorizationResponse changes
  useEffect(() => {
    if (!categorizationResponse) {
      setItems([]);
      return;
    }

    const dupMap = new Map<string, string>();
    if (categorizationResponse.duplicates) {
      categorizationResponse.duplicates.forEach(d => dupMap.set(d.id, d.reason));
    }

    const initialItems: PlannedItemReport[] = categorizationResponse.results.map(res => {
      const original = targetBookmarks.find(b => b.id === res.id);
      const isDup = dupMap.has(res.id);
      return {
        id: res.id,
        title: original?.title || res.id,
        url: original?.url || '',
        originalFolder: original?.folder || 'Unsorted',
        targetFolder: res.folder,
        tags: [...res.tags],
        summary: res.summary || '',
        confidence: res.confidence || 95,
        isIncluded: true,
        isModifiedByUser: false,
        isDuplicate: isDup,
        duplicateReason: dupMap.get(res.id)
      };
    });

    setItems(initialItems);
    setSearchQuery('');
    setFilterType('all');
  }, [categorizationResponse, targetBookmarks]);

  // Derived unique folder list for dropdowns (AI proposed folders + existing folders)
  const availableFolderOptions = useMemo(() => {
    const set = new Set<string>();
    if (categorizationResponse?.folders) {
      categorizationResponse.folders.forEach(f => set.add(f));
    }
    items.forEach(i => set.add(i.targetFolder));
    allExistingFolders.forEach(f => set.add(f));
    return Array.from(set).sort();
  }, [categorizationResponse, items, allExistingFolders]);

  // Statistics
  const totalAnalyzed = items.length;
  const totalIncluded = items.filter(i => i.isIncluded).length;
  const totalExcluded = items.filter(i => !i.isIncluded).length;
  const totalModified = items.filter(i => i.isModifiedByUser).length;
  const totalDuplicates = items.filter(i => i.isDuplicate).length;
  const totalMoved = items.filter(i => i.isIncluded && i.originalFolder !== i.targetFolder).length;

  const targetFoldersList = useMemo(() => {
    const set = new Set<string>();
    items.filter(i => i.isIncluded).forEach(i => set.add(i.targetFolder));
    return Array.from(set);
  }, [items]);

  const reportData: ReorganizationReportData = useMemo(() => {
    return {
      timestamp: new Date().toLocaleString(),
      totalAnalyzed,
      totalIncluded,
      totalExcluded,
      totalModified,
      totalDuplicates,
      explanation: categorizationResponse?.explanation || '',
      targetFolders: targetFoldersList,
      items
    };
  }, [totalAnalyzed, totalIncluded, totalExcluded, totalModified, totalDuplicates, categorizationResponse, targetFoldersList, items]);

  if (!isOpen || !categorizationResponse) return null;

  // Handler: Toggle single item inclusion
  const handleToggleInclude = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isIncluded: !item.isIncluded };
      }
      return item;
    }));
  };

  // Handler: Bulk include / exclude
  const handleSetAllInclusion = (included: boolean) => {
    setItems(prev => prev.map(item => ({ ...item, isIncluded: included })));
  };

  // Handler: Change target folder for an item
  const handleChangeTargetFolder = (id: string, newFolder: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          targetFolder: newFolder.trim(),
          isModifiedByUser: true
        };
      }
      return item;
    }));
  };

  // Handler: Remove a tag from an item
  const handleRemoveTag = (id: string, tagToRemove: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          tags: item.tags.filter(t => t !== tagToRemove),
          isModifiedByUser: true
        };
      }
      return item;
    }));
  };

  // Handler: Add a tag to an item
  const handleAddTag = (id: string) => {
    const rawTag = (newTagInput[id] || '').trim().replace(/^#/, '');
    if (!rawTag) return;

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        if (item.tags.includes(rawTag)) return item;
        return {
          ...item,
          tags: [...item.tags, rawTag],
          isModifiedByUser: true
        };
      }
      return item;
    }));

    setNewTagInput(prev => ({ ...prev, [id]: '' }));
  };

  // Handler: Reset item to original AI suggestion
  const handleResetItem = (id: string) => {
    const orig = categorizationResponse.results.find(r => r.id === id);
    if (!orig) return;
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          targetFolder: orig.folder,
          tags: [...orig.tags],
          summary: orig.summary,
          isIncluded: true,
          isModifiedByUser: false
        };
      }
      return item;
    }));
  };

  // Handler: Reset all items
  const handleResetAllToAI = () => {
    const dupMap = new Map<string, string>();
    if (categorizationResponse.duplicates) {
      categorizationResponse.duplicates.forEach(d => dupMap.set(d.id, d.reason));
    }

    setItems(categorizationResponse.results.map(res => {
      const original = targetBookmarks.find(b => b.id === res.id);
      return {
        id: res.id,
        title: original?.title || res.id,
        url: original?.url || '',
        originalFolder: original?.folder || 'Unsorted',
        targetFolder: res.folder,
        tags: [...res.tags],
        summary: res.summary || '',
        confidence: res.confidence || 95,
        isIncluded: true,
        isModifiedByUser: false,
        isDuplicate: dupMap.has(res.id),
        duplicateReason: dupMap.get(res.id)
      };
    }));
  };

  // Export handlers
  const handleDownloadTxt = () => {
    const text = generateTextReport(reportData);
    downloadReportFile(text, `bookmark-reorganization-report-${Date.now()}.txt`, 'text/plain;charset=utf-8');
  };

  const handleDownloadDoc = () => {
    const docHtml = generateDocReport(reportData);
    downloadReportFile(docHtml, `bookmark-reorganization-report-${Date.now()}.doc`, 'application/msword;charset=utf-8');
  };

  const handleDownloadMd = () => {
    const md = generateMarkdownReport(reportData);
    downloadReportFile(md, `bookmark-reorganization-report-${Date.now()}.md`, 'text/markdown;charset=utf-8');
  };

  const handleCopyReport = () => {
    const text = generateTextReport(reportData);
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const docHtml = generateDocReport(reportData);
    printWindow.document.write(docHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  // Filtered items list
  const filteredItems = items.filter(item => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = 
        item.title.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.originalFolder.toLowerCase().includes(q) ||
        item.targetFolder.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Filter type
    if (filterType === 'moved') return item.originalFolder !== item.targetFolder && item.isIncluded;
    if (filterType === 'modified') return item.isModifiedByUser;
    if (filterType === 'excluded') return !item.isIncluded;
    if (filterType === 'duplicates') return item.isDuplicate;

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#0f0f13] border border-white/10 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#111116]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Reorganization Plan & Pre-Execution Report
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Pending Approval
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Review all proposed folder moves, download audit report, and make any corrections before applying.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
              title="Close without applying changes"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action & Export Toolbar */}
        <div className="px-5 sm:px-7 py-3 bg-white/[0.03] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('corrections')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'corrections'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Correction Studio</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
                {totalIncluded}/{totalAnalyzed}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'report'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>On-Screen Report</span>
            </button>

            <button
              onClick={() => setActiveTab('raw-text')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'raw-text'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Text File View</span>
            </button>
          </div>

          {/* Export & Download Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="btn-download-txt"
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition"
              title="Download clean plain text .txt report"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download .TXT</span>
            </button>

            <button
              id="btn-download-doc"
              onClick={handleDownloadDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-200 border border-indigo-500/30 transition"
              title="Download Microsoft Word / Google Docs compatible .doc file"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download .DOC</span>
            </button>

            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition"
              title="Copy formatted text report to clipboard"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
              title="Print report or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>

        {/* Executive Summary Bar */}
        <div className="px-5 sm:px-7 py-3 bg-indigo-950/20 border-b border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex-1">
            <span className="text-slate-400 font-medium">AI Strategy: </span>
            <span className="text-indigo-200 italic font-medium leading-relaxed">
              "{categorizationResponse.explanation}"
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
            <span className="text-emerald-400 font-bold">{totalMoved} moves planned</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">{targetFoldersList.length} target folders</span>
            {totalModified > 0 && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-amber-300 font-bold">{totalModified} user-modified</span>
              </>
            )}
            {totalExcluded > 0 && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-rose-400 font-bold">{totalExcluded} excluded</span>
              </>
            )}
          </div>
        </div>

        {/* ================= TAB 1: CORRECTION STUDIO ================= */}
        {activeTab === 'corrections' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            
            {/* Filter and search bar */}
            <div className="px-5 sm:px-7 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#111116]/50">
              
              {/* Filter pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-xl font-medium transition ${
                    filterType === 'all' 
                      ? 'bg-white/15 text-white font-bold' 
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  All ({items.length})
                </button>
                <button
                  onClick={() => setFilterType('moved')}
                  className={`px-3 py-1 rounded-xl font-medium transition ${
                    filterType === 'moved' 
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                      : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  Moves ({items.filter(i => i.originalFolder !== i.targetFolder && i.isIncluded).length})
                </button>
                {totalModified > 0 && (
                  <button
                    onClick={() => setFilterType('modified')}
                    className={`px-3 py-1 rounded-xl font-medium transition ${
                      filterType === 'modified' 
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' 
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    User Corrected ({totalModified})
                  </button>
                )}
                {totalExcluded > 0 && (
                  <button
                    onClick={() => setFilterType('excluded')}
                    className={`px-3 py-1 rounded-xl font-medium transition ${
                      filterType === 'excluded' 
                        ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' 
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Excluded ({totalExcluded})
                  </button>
                )}
                {totalDuplicates > 0 && (
                  <button
                    onClick={() => setFilterType('duplicates')}
                    className={`px-3 py-1 rounded-xl font-medium transition ${
                      filterType === 'duplicates' 
                        ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' 
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    Duplicates ({totalDuplicates})
                  </button>
                )}
              </div>

              {/* Search & Bulk tools */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bookmarks..."
                    className="pl-8 pr-3 py-1 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44 sm:w-56"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                  <button
                    onClick={() => handleSetAllInclusion(true)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium"
                    title="Include all items"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => handleSetAllInclusion(false)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium"
                    title="Exclude all items"
                  >
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button
                    onClick={handleResetAllToAI}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium"
                    title="Reset all to original AI suggestions"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                </div>
              </div>

            </div>

            {/* Bookmarks Correction List */}
            <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-3.5 flex-1">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Search className="w-6 h-6 text-slate-500" />
                  <span>No bookmarks match your search / filter criteria.</span>
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isMoved = item.originalFolder !== item.targetFolder;
                  const isCustomFolder = showCustomFolderBox[item.id];

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                        !item.isIncluded
                          ? 'bg-black/40 border-white/5 opacity-60'
                          : item.isModifiedByUser
                            ? 'bg-amber-950/10 border-amber-500/40 shadow-sm'
                            : isMoved
                              ? 'bg-white/[0.04] border-indigo-500/40 shadow-sm'
                              : 'bg-white/[0.02] border-white/10'
                      }`}
                    >
                      {/* Top row: Checkbox, Title, URL, Confidence, Status badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          
                          {/* Include/Exclude Toggle */}
                          <button
                            onClick={() => handleToggleInclude(item.id)}
                            className="mt-0.5 text-slate-400 hover:text-white transition shrink-0"
                            title={item.isIncluded ? 'Click to exclude this bookmark from changes' : 'Click to include this bookmark'}
                          >
                            {item.isIncluded ? (
                              <div className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-lg border border-slate-600 bg-black/40 hover:border-slate-400" />
                            )}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`text-sm font-bold truncate ${item.isIncluded ? 'text-white' : 'text-slate-400 line-through'}`}>
                                {item.title}
                              </h4>
                              
                              {item.isModifiedByUser && item.isIncluded && (
                                <span className="px-2 py-0.2 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  User Corrected
                                </span>
                              )}

                              {!item.isIncluded && (
                                <span className="px-2 py-0.2 rounded-md text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  Excluded
                                </span>
                              )}

                              {item.isDuplicate && (
                                <span className="px-2 py-0.2 rounded-md text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> Duplicate Link
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-0.5">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-slate-400 font-mono hover:text-indigo-400 truncate flex items-center gap-1 max-w-md"
                              >
                                <span>{item.url}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                              </a>
                            </div>
                          </div>

                        </div>

                        {/* Right: Confidence Match & Reset button */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {item.confidence}% Match
                          </span>
                          {item.isModifiedByUser && (
                            <button
                              onClick={() => handleResetItem(item.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 text-[10px] font-semibold flex items-center gap-1"
                              title="Reset to AI suggestion"
                            >
                              <RotateCcw className="w-3 h-3 text-indigo-400" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Middle row: Interactive Destination Folder Changer */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 text-xs">
                        
                        {/* Original Folder */}
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="text-[10px] uppercase font-mono text-slate-500">From:</span>
                          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 ${isMoved && item.isIncluded ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                            <Folder className="w-3 h-3 text-slate-500" />
                            <span>{item.originalFolder}</span>
                          </div>
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />

                        {/* Target Folder Selector & Custom Input */}
                        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                          <span className="text-[10px] uppercase font-mono text-indigo-400 font-bold">To:</span>
                          
                          {!isCustomFolder ? (
                            <div className="flex items-center gap-1.5 flex-1">
                              <select
                                value={item.targetFolder}
                                onChange={(e) => {
                                  if (e.target.value === '__custom__') {
                                    setShowCustomFolderBox(prev => ({ ...prev, [item.id]: true }));
                                    setCustomFolderInputs(prev => ({ ...prev, [item.id]: item.targetFolder }));
                                  } else {
                                    handleChangeTargetFolder(item.id, e.target.value);
                                  }
                                }}
                                disabled={!item.isIncluded}
                                className="flex-1 bg-[#1a1a24] text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-indigo-500/40 focus:outline-none focus:border-indigo-400 disabled:opacity-50"
                              >
                                <optgroup label="AI Recommended & Target Folders">
                                  {availableFolderOptions.map((f, i) => (
                                    <option key={i} value={f}>{f}</option>
                                  ))}
                                </optgroup>
                                <optgroup label="Custom Options">
                                  <option value="__custom__">+ Type Custom Folder Path...</option>
                                </optgroup>
                              </select>

                              <button
                                onClick={() => {
                                  setShowCustomFolderBox(prev => ({ ...prev, [item.id]: true }));
                                  setCustomFolderInputs(prev => ({ ...prev, [item.id]: item.targetFolder }));
                                }}
                                disabled={!item.isIncluded}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 shrink-0"
                                title="Type custom folder path"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 flex-1 animate-in fade-in duration-150">
                              <input
                                type="text"
                                value={customFolderInputs[item.id] !== undefined ? customFolderInputs[item.id] : item.targetFolder}
                                onChange={(e) => setCustomFolderInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                                placeholder="e.g. Work/AI/Research"
                                className="flex-1 bg-[#1a1a24] text-white text-xs px-3 py-1.5 rounded-xl border border-indigo-400 focus:outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleChangeTargetFolder(item.id, customFolderInputs[item.id] || item.targetFolder);
                                    setShowCustomFolderBox(prev => ({ ...prev, [item.id]: false }));
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  handleChangeTargetFolder(item.id, customFolderInputs[item.id] || item.targetFolder);
                                  setShowCustomFolderBox(prev => ({ ...prev, [item.id]: false }));
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0"
                              >
                                Set
                              </button>
                              <button
                                onClick={() => setShowCustomFolderBox(prev => ({ ...prev, [item.id]: false }))}
                                className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* Bottom Row: Tags & AI Summary Note */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-white/5">
                        
                        {/* Summary */}
                        <div className="text-[11px] text-slate-300 italic truncate max-w-md">
                          {item.summary ? `"${item.summary}"` : 'Categorized by ML taxonomy engine.'}
                        </div>

                        {/* Tag Pills Editor */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.tags.map((t, idx) => (
                            <span 
                              key={idx} 
                              className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 font-mono text-[10px]"
                            >
                              <span>#{t}</span>
                              {item.isIncluded && (
                                <button
                                  onClick={() => handleRemoveTag(item.id, t)}
                                  className="text-indigo-400 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition"
                                  title="Remove tag"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))}

                          {/* Quick Tag Adder */}
                          {item.isIncluded && (
                            <div className="inline-flex items-center gap-1">
                              <input
                                type="text"
                                value={newTagInput[item.id] || ''}
                                onChange={(e) => setNewTagInput(prev => ({ ...prev, [item.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddTag(item.id);
                                }}
                                placeholder="+tag"
                                className="w-16 bg-black/40 text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10 focus:outline-none focus:w-24 transition-all"
                              />
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* ================= TAB 2: ON-SCREEN REPORT VIEW ================= */}
        {activeTab === 'report' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#0c0c10] text-slate-200">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
              
              {/* Report Header Card */}
              <div className="bg-[#14141b] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-white">AI Bookmark Reorganization Plan & Audit Report</h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Pre-Execution Manifest • {reportData.timestamp}</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                    APPROVED AUDIT TRAIL
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Bookmarks Analyzed</span>
                    <strong className="text-lg font-bold text-white font-mono">{totalAnalyzed}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 uppercase font-mono block">Approved Changes</span>
                    <strong className="text-lg font-bold text-emerald-300 font-mono">{totalIncluded}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20">
                    <span className="text-[10px] text-amber-400 uppercase font-mono block">User Corrected</span>
                    <strong className="text-lg font-bold text-amber-300 font-mono">{totalModified}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20">
                    <span className="text-[10px] text-rose-400 uppercase font-mono block">Excluded Items</span>
                    <strong className="text-lg font-bold text-rose-300 font-mono">{totalExcluded}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                  <strong className="text-indigo-300 block mb-1">Taxonomy Architecture Rationale:</strong>
                  <p className="italic leading-relaxed">{reportData.explanation}</p>
                </div>
              </div>

              {/* Target Folder Breakdown */}
              <div className="bg-[#14141b] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                  Target Folder Structure ({targetFoldersList.length} Folders)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {targetFoldersList.map((folder, idx) => {
                    const count = items.filter(i => i.isIncluded && i.targetFolder === folder).length;
                    return (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 truncate">
                          <Folder className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="font-semibold text-slate-200 truncate">{folder}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">{count} item{count !== 1 ? 's' : ''}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Formatted Table Manifest */}
              <div className="bg-[#14141b] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-3 overflow-x-auto">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                  Itemized Changes Manifest
                </h3>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] text-slate-400 font-mono">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Bookmark</th>
                      <th className="py-2.5 px-3">Original Folder</th>
                      <th className="py-2.5 px-3">Target Folder</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3">Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white truncate max-w-xs">{item.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{item.url}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          <span className={item.originalFolder !== item.targetFolder && item.isIncluded ? 'line-through' : ''}>
                            {item.originalFolder}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-300">
                          {item.isIncluded ? item.targetFolder : <span className="text-slate-500 font-normal">N/A (Excluded)</span>}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            !item.isIncluded 
                              ? 'bg-rose-500/20 text-rose-300' 
                              : item.isModifiedByUser 
                                ? 'bg-amber-500/20 text-amber-300' 
                                : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {!item.isIncluded ? 'Excluded' : item.isModifiedByUser ? 'Corrected' : 'Planned'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[11px] text-indigo-300">
                          {item.tags.map(t => '#' + t).join(' ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 3: RAW TEXT VIEW ================= */}
        {activeTab === 'raw-text' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#0a0a0e] font-mono text-xs text-slate-300">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Raw Plain Text (.TXT) Report Preview
                </span>
                <button
                  onClick={handleCopyReport}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-sans font-semibold transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full Text</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300 selection:bg-indigo-600 selection:text-white">
                {generateTextReport(reportData)}
              </pre>
            </div>
          </div>
        )}

        {/* Bottom Footer Actions */}
        <div className="px-5 sm:px-7 py-4 border-t border-white/10 bg-[#111116] flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>
              Ready to apply <strong className="text-white font-bold">{totalIncluded}</strong> changes 
              {totalExcluded > 0 && <span> (<strong className="text-rose-300 font-bold">{totalExcluded}</strong> excluded)</span>}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition text-xs font-semibold"
            >
              Cancel (Make No Changes)
            </button>
            
            <button
              id="btn-apply-confirmed-changes"
              onClick={() => onApply(items)}
              disabled={totalIncluded === 0}
              className="px-6 py-2.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center gap-2 transition hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply {totalIncluded} Approved & Corrected Changes</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
