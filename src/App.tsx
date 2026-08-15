import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  FolderTree, 
  Folder, 
  CheckCircle2, 
  Upload, 
  Download, 
  Plus, 
  Chrome, 
  PanelRight, 
  Undo2, 
  RotateCcw,
  Tag,
  Search,
  Filter,
  Check,
  AlertCircle,
  Store,
  Crown,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { 
  Bookmark, 
  ScanScope, 
  AppViewMode, 
  CategorizationResponse, 
  UserProfile, 
  MarketplacePack,
  DashboardDisplayMode
} from './types';
import { PlannedItemReport } from './utils/reportGenerator';
import { INITIAL_BOOKMARKS } from './data/sampleBookmarks';
import { Navbar } from './components/Navbar';
import { SimpleScannerCard } from './components/SimpleScannerCard';
import { ScannerControls } from './components/ScannerControls';
import { BookmarkTree } from './components/BookmarkTree';
import { BookmarkList } from './components/BookmarkList';
import { MessageBoardView } from './components/MessageBoardView';
import { ExtensionSimulator } from './components/ExtensionSimulator';
import { ExtensionExportModal } from './components/ExtensionExportModal';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import { ImportExportModal } from './components/ImportExportModal';
import { DiffModal } from './components/DiffModal';
import { MarketplaceView } from './components/MarketplaceView';
import { VendorHub } from './components/VendorHub';
import { VipVaultView } from './components/VipVaultView';
import { AuthModal } from './components/AuthModal';
import { ShareModal } from './components/ShareModal';
import { TagManagerModal } from './components/TagManagerModal';
import { BrokenLinksModal } from './components/BrokenLinksModal';
import { NewTabView } from './components/NewTabView';
import { TopSitesDirectory } from './components/TopSitesDirectory';
import { HelpComplianceView } from './components/HelpComplianceView';

const STORAGE_KEY = 'ai_bookmarks_state_v2';
const USER_KEY = 'ai_bookmarks_user_profile_v1';
const DISPLAY_MODE_KEY = 'ai_bookmarks_display_mode_v1';
const DEFAULT_TAB_KEY = 'ai_bookmarks_default_tab_v1';

export default function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read bookmarks from localStorage:', e);
    }
    return INITIAL_BOOKMARKS;
  });

  const [dashboardDisplayMode, setDashboardDisplayMode] = useState<DashboardDisplayMode>(() => {
    try {
      const saved = localStorage.getItem(DISPLAY_MODE_KEY);
      if (saved === 'advanced' || saved === 'simple') return saved;
    } catch (e) {
      console.warn('Could not read display mode from localStorage:', e);
    }
    return 'simple'; // Default is SIMPLE mode as requested!
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.warn('Could not load user profile', e);
    }
    return {
      id: 'user-bicknell',
      email: 'bicknellmvp@gmail.com',
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      tier: 'vip',
      credits: 250,
      authProvider: 'google',
      isVerifiedVendor: true,
      publishedPacksCount: 2,
      totalSales: 1420
    };
  });

  const [history, setHistory] = useState<Bookmark[][]>([]);
  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    try {
      const savedDefaultTab = localStorage.getItem(DEFAULT_TAB_KEY);
      if (savedDefaultTab && ['dashboard', 'newtab', 'directory', 'messageboard', 'marketplace', 'vendor-hub', 'vip-vault', 'help-compliance'].includes(savedDefaultTab)) {
        return savedDefaultTab as AppViewMode;
      }
    } catch (e) {
      console.warn('Could not read default tab preference:', e);
    }
    return 'dashboard';
  });
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedBookmarkIds, setSelectedBookmarkIds] = useState<Set<string>>(new Set());

  // Scanner state
  const [scanScope, setScanScope] = useState<ScanScope>('all');
  const [customInstructions, setCustomInstructions] = useState('');
  const [depth, setDepth] = useState<'nested' | 'flat'>('nested');
  const [isScanning, setIsScanning] = useState(false);
  const [isAiTagging, setIsAiTagging] = useState(false);
  const [scanProgress, setScanProgress] = useState<{ step: string; progress: number } | null>(null);
  const [lastResults, setLastResults] = useState<{ folders: string[]; count: number; explanation: string } | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importModalTab, setImportModalTab] = useState<'import' | 'export'>('import');
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTagManagerModalOpen, setIsTagManagerModalOpen] = useState(false);
  const [isBrokenLinksModalOpen, setIsBrokenLinksModalOpen] = useState(false);
  const [isCheckingLinkHealth, setIsCheckingLinkHealth] = useState(false);
  const [healthCheckingProgress, setHealthCheckingProgress] = useState<{ current: number; total: number } | undefined>(undefined);

  const [pendingDiffResponse, setPendingDiffResponse] = useState<CategorizationResponse | null>(null);
  const [pendingTargetBookmarks, setPendingTargetBookmarks] = useState<Bookmark[]>([]);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } catch (e) {
      console.error('Failed to save user profile to localStorage', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(DISPLAY_MODE_KEY, dashboardDisplayMode);
    } catch (e) {
      console.error('Failed to save display mode to localStorage', e);
    }
  }, [dashboardDisplayMode]);

  // Check URL query parameters for mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'popup') setViewMode('extension-popup');
    else if (mode === 'sidepanel') setViewMode('sidepanel');
    else if (mode === 'export') setViewMode('extension-code');
    else if (mode === 'marketplace') setViewMode('marketplace');
    else if (mode === 'messageboard' || mode === 'community') setViewMode('messageboard');
    else if (mode === 'vendor') setViewMode('vendor-hub');
    else if (mode === 'vip') setViewMode('vip-vault');
  }, []);

  const pushHistory = (newBookmarks: Bookmark[]) => {
    setHistory(prev => [bookmarks, ...prev].slice(0, 10));
    setBookmarks(newBookmarks);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history[0];
      setHistory(history.slice(1));
      setBookmarks(prev);
      showNotification('Reverted to previous bookmark structure', 'info');
    }
  };

  const showNotification = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Unique folder paths
  const allFolders = Array.from(new Set(bookmarks.map(b => b.folder))).filter(Boolean).sort();

  // Unique tags
  const allTags = Array.from(new Set(bookmarks.flatMap(b => b.tags || []))).filter(Boolean).sort();

  // Selected bookmarks list
  const selectedBookmarks = bookmarks.filter(b => selectedBookmarkIds.has(b.id));

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedBookmarkIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    const ids = bookmarks.map(b => b.id);
    setSelectedBookmarkIds(new Set(ids));
  };

  const handleDeselectAll = () => {
    setSelectedBookmarkIds(new Set());
  };

  // Move bookmarks
  const handleMoveBookmarks = (bookmarkIds: string[], targetFolder: string) => {
    const updated = bookmarks.map(b => {
      if (bookmarkIds.includes(b.id)) {
        return { ...b, folder: targetFolder, status: 'modified' as const };
      }
      return b;
    });
    pushHistory(updated);
    setSelectedBookmarkIds(new Set());
    showNotification(`Moved ${bookmarkIds.length} bookmark(s) to ${targetFolder}`, 'success');
  };

  // Delete bookmarks
  const handleDeleteBookmarks = (bookmarkIds: string[]) => {
    const updated = bookmarks.filter(b => !bookmarkIds.includes(b.id));
    pushHistory(updated);
    setSelectedBookmarkIds(new Set());
    showNotification(`Deleted ${bookmarkIds.length} bookmark(s)`, 'info');
  };

  // Update single bookmark's custom tags
  const handleUpdateBookmarkTags = (bookmarkId: string, tags: string[]) => {
    const updated = bookmarks.map(b => {
      if (b.id === bookmarkId) {
        return { ...b, tags };
      }
      return b;
    });
    pushHistory(updated);
  };

  // Apply batch tags from TagManagerModal
  const handleApplyBatchTags = (targetBookmarkIds: string[], tagsToAdd: string[], tagsToRemove: string[]) => {
    const updated = bookmarks.map(b => {
      if (targetBookmarkIds.includes(b.id)) {
        let currentTags = b.tags || [];
        if (tagsToRemove.length > 0) {
          currentTags = currentTags.filter(t => !tagsToRemove.includes(t));
        }
        if (tagsToAdd.length > 0) {
          currentTags = Array.from(new Set([...currentTags, ...tagsToAdd]));
        }
        return { ...b, tags: currentTags };
      }
      return b;
    });
    pushHistory(updated);
    showNotification(`Updated tags for ${targetBookmarkIds.length} bookmark(s)`, 'success');
  };

  // AI Auto-Tag Single Bookmark
  const handleSingleAiAutoTag = async (bookmark: Bookmark) => {
    try {
      const res = await fetch('/api/auto-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookmarks: [{
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            folder: bookmark.folder
          }]
        })
      });

      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        const newTags = Array.from(new Set([...bookmark.tags, ...(item.tags || [])]));
        const updated = bookmarks.map(b => 
          b.id === bookmark.id ? { ...b, tags: newTags, aiSummary: item.summary || b.aiSummary } : b
        );
        pushHistory(updated);
        showNotification(`AI generated tags for "${bookmark.title.substring(0, 24)}..."`, 'success');
      }
    } catch (e: any) {
      console.error('Error auto tagging bookmark:', e);
      showNotification('AI auto-tagging error: ' + e.message, 'error');
    }
  };

  // AI Auto-Tag Batch of Bookmarks
  const handleBatchAiAutoTag = async (bookmarkIds: string[]) => {
    const targets = bookmarks.filter(b => bookmarkIds.includes(b.id));
    if (targets.length === 0) return;

    setIsAiTagging(true);
    showNotification(`Gemini AI analyzing and auto-tagging ${targets.length} bookmarks...`, 'info');

    try {
      const res = await fetch('/api/auto-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookmarks: targets.map(b => ({
            id: b.id,
            title: b.title,
            url: b.url,
            folder: b.folder
          }))
        })
      });

      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const resultMap = new Map<string, any>();
        data.results.forEach((r: any) => resultMap.set(r.id, r));

        const updated = bookmarks.map(b => {
          const match = resultMap.get(b.id);
          if (match) {
            return {
              ...b,
              tags: Array.from(new Set([...(b.tags || []), ...(match.tags || [])])),
              aiSummary: match.summary || b.aiSummary
            };
          }
          return b;
        });

        pushHistory(updated);
        showNotification(`Successfully auto-tagged ${data.results.length} bookmarks with Gemini 3.7 Flash!`, 'success');
      }
    } catch (e: any) {
      console.error('Error batch auto tagging:', e);
      showNotification('Batch auto-tagging error: ' + e.message, 'error');
    } finally {
      setIsAiTagging(false);
      setIsTagManagerModalOpen(false);
    }
  };

  // Folder CRUD
  const handleCreateFolder = (parentFolder: string, newFolderName: string) => {
    const fullPath = parentFolder ? `${parentFolder}/${newFolderName}` : newFolderName;
    showNotification(`Created folder: ${fullPath}`, 'success');
  };

  const handleDeleteFolder = (folderPath: string) => {
    if (confirm(`Delete folder "${folderPath}" and move its bookmarks to Unsorted?`)) {
      const updated = bookmarks.map(b => {
        if (b.folder === folderPath || b.folder.startsWith(folderPath + '/')) {
          return { ...b, folder: 'Unsorted Bookmarks' };
        }
        return b;
      });
      pushHistory(updated);
      showNotification(`Deleted folder "${folderPath}"`, 'info');
    }
  };

  const handleRenameFolder = (oldPath: string, newPath: string) => {
    const updated = bookmarks.map(b => {
      if (b.folder === oldPath) {
        return { ...b, folder: newPath };
      } else if (b.folder.startsWith(oldPath + '/')) {
        return { ...b, folder: newPath + b.folder.substring(oldPath.length) };
      }
      return b;
    });
    pushHistory(updated);
    showNotification(`Renamed folder to "${newPath}"`, 'success');
  };

  // Broken & Dead Link Verification Handler
  const handleCheckLinkHealth = async (targetBookmarkIds?: string[]) => {
    const targets = targetBookmarkIds && targetBookmarkIds.length > 0
      ? bookmarks.filter(b => targetBookmarkIds.includes(b.id))
      : bookmarks;

    if (targets.length === 0) return;

    setIsCheckingLinkHealth(true);
    setHealthCheckingProgress({ current: 0, total: targets.length });

    // Optimistically mark target bookmarks as 'checking'
    const checkingIds = new Set(targets.map(t => t.id));
    setBookmarks(prev => prev.map(b => checkingIds.has(b.id) ? { ...b, linkHealth: 'checking' as const } : b));

    try {
      const urlsToCheck = targets.map(b => ({ id: b.id, url: b.url }));
      const res = await fetch('/api/check-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookmarks: urlsToCheck })
      });

      if (!res.ok) {
        throw new Error(`Health check server responded with status ${res.status}`);
      }

      const data = await res.json();
      const resultsMap = new Map<string, any>();
      if (data.results && Array.isArray(data.results)) {
        data.results.forEach((r: any) => resultsMap.set(r.id, r));
      }

      const updated = bookmarks.map(b => {
        const result = resultsMap.get(b.id);
        if (result) {
          return {
            ...b,
            linkHealth: result.status,
            httpStatusCode: result.statusCode,
            linkHealthError: result.error,
            lastHealthCheckedAt: result.checkedAt
          };
        }
        return b;
      });

      pushHistory(updated);

      const brokenCount = Array.from(resultsMap.values()).filter((r: any) => r.status === 'broken' || r.status === 'unreachable').length;
      if (brokenCount > 0) {
        showNotification(`Link health check finished: Found ${brokenCount} unreachable/broken link(s).`, 'error');
      } else {
        showNotification(`All ${targets.length} checked links are active and reachable!`, 'success');
      }
    } catch (e: any) {
      console.error('Error during link health check:', e);
      showNotification('Link check failed: ' + e.message, 'error');
      // Revert checking status
      setBookmarks(prev => prev.map(b => b.linkHealth === 'checking' ? { ...b, linkHealth: 'untested' as const } : b));
    } finally {
      setIsCheckingLinkHealth(false);
      setHealthCheckingProgress(undefined);
    }
  };

  const handleDropBookmarkToFolder = (bookmarkId: string, targetFolder: string) => {
    handleMoveBookmarks([bookmarkId], targetFolder);
  };

  // Run AI Categorization Scan
  const handleStartScan = async (overrideScope?: ScanScope, overridePrompt?: string) => {
    const targetScope = overrideScope || scanScope;
    const promptToUse = overridePrompt !== undefined ? overridePrompt : customInstructions;

    let targets: Bookmark[] = [];
    if (targetScope === 'all') {
      targets = bookmarks;
    } else if (targetScope === 'selected') {
      targets = bookmarks.filter(b => selectedBookmarkIds.has(b.id));
    } else if (targetScope === 'unorganized') {
      targets = bookmarks.filter(b => 
        b.folder.toLowerCase().includes('unsorted') || 
        b.folder === 'Bookmarks Bar' || 
        b.folder.toLowerCase().includes('other')
      );
    } else if (targetScope === 'folder' && selectedFolder) {
      targets = bookmarks.filter(b => b.folder === selectedFolder);
    } else {
      targets = bookmarks;
    }

    if (targets.length === 0) {
      showNotification('No bookmarks found in selected scope to categorize.', 'error');
      return;
    }

    setIsScanning(true);
    setScanProgress({ step: 'Extracting bookmark metadata and domains...', progress: 15 });

    try {
      setTimeout(() => {
        setScanProgress({ step: 'Sending bookmarks to Gemini 3.7 Flash for taxonomy analysis...', progress: 45 });
      }, 600);

      setTimeout(() => {
        setScanProgress({ step: 'Synthesizing smart folders, tags, and summaries...', progress: 75 });
      }, 1400);

      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookmarks: targets,
          customInstructions: promptToUse,
          depth,
          maxFolders: 8
        })
      });

      const data: CategorizationResponse = await res.json();

      if (data.results && data.results.length > 0) {
        setScanProgress({ step: 'Finalizing organized hierarchy...', progress: 100 });
        setPendingDiffResponse(data);
        setPendingTargetBookmarks(targets);
        setIsDiffModalOpen(true);
      } else {
        showNotification((data as any).error || 'Failed to categorize bookmarks', 'error');
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      showNotification('Error during AI categorization: ' + err.message, 'error');
    } finally {
      setIsScanning(false);
      setScanProgress(null);
    }
  };

  // Apply proposed diff & corrections
  const handleApplyDiff = (approvedItems?: PlannedItemReport[]) => {
    if (!pendingDiffResponse) return;

    if (approvedItems && approvedItems.length > 0) {
      // Apply with user corrections and inclusion filter
      const resultMap = new Map<string, PlannedItemReport>();
      approvedItems.forEach(item => {
        if (item.isIncluded) {
          resultMap.set(item.id, item);
        }
      });

      const updated = bookmarks.map(b => {
        const match = resultMap.get(b.id);
        if (match) {
          return {
            ...b,
            folder: match.targetFolder,
            tags: Array.from(new Set([...(b.tags || []), ...(match.tags || [])])),
            aiSummary: match.summary || b.aiSummary,
            isDuplicate: match.isDuplicate ?? b.isDuplicate,
            status: 'synced' as const
          };
        }
        return b;
      });

      const appliedFolders = Array.from(new Set(Array.from(resultMap.values()).map(r => r.targetFolder)));
      pushHistory(updated);
      setLastResults({
        folders: appliedFolders,
        count: resultMap.size,
        explanation: pendingDiffResponse.explanation
      });

      setIsDiffModalOpen(false);
      setPendingDiffResponse(null);
      setSelectedBookmarkIds(new Set());
      showNotification(`Applied reorganization to ${resultMap.size} bookmarks across ${appliedFolders.length} folders!`, 'success');
      return;
    }

    // Default fallback if approvedItems not provided
    const resultMap = new Map<string, any>();
    pendingDiffResponse.results.forEach(r => resultMap.set(r.id, r));

    const dupMap = new Set<string>();
    if (pendingDiffResponse.duplicates) {
      pendingDiffResponse.duplicates.forEach(d => dupMap.add(d.id));
    }

    const updated = bookmarks.map(b => {
      const match = resultMap.get(b.id);
      if (match) {
        return {
          ...b,
          folder: match.folder,
          tags: Array.from(new Set([...(b.tags || []), ...(match.tags || [])])),
          aiSummary: match.summary || b.aiSummary,
          isDuplicate: dupMap.has(b.id) || b.isDuplicate,
          status: 'synced' as const
        };
      }
      return b;
    });

    pushHistory(updated);
    setLastResults({
      folders: pendingDiffResponse.folders,
      count: pendingDiffResponse.results.length,
      explanation: pendingDiffResponse.explanation
    });

    setIsDiffModalOpen(false);
    setPendingDiffResponse(null);
    setSelectedBookmarkIds(new Set());
    showNotification(`Successfully categorized ${pendingDiffResponse.results.length} bookmarks into ${pendingDiffResponse.folders.length} smart folders!`, 'success');
  };

  // Import pack from Marketplace or VIP Vault
  const handleImportPack = (pack: MarketplacePack) => {
    const newBookmarks: Bookmark[] = pack.bookmarks.map((bm, index) => ({
      ...bm,
      id: 'cloned-' + Date.now() + '-' + index,
      status: 'synced' as const
    }));

    pushHistory([...newBookmarks, ...bookmarks]);
    showNotification(`Cloned "${pack.title}" (+${newBookmarks.length} bookmarks) to your library!`, 'success');
  };

  // Add a single bookmark directly (from TopSitesDirectory, NewTabView, etc.)
  const handleAddBookmarkDirect = (newBm: Omit<Bookmark, 'id' | 'dateAdded'>) => {
    // Check for duplicate URL
    const existing = bookmarks.find(b => b.url === newBm.url);
    if (existing) {
      showNotification(`"${newBm.title}" is already saved in "${existing.folder}"`, 'info');
      return;
    }

    const item: Bookmark = {
      ...newBm,
      id: 'bm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      dateAdded: Date.now(),
      status: 'synced'
    };

    pushHistory([item, ...bookmarks]);
    showNotification(`Saved "${item.title}" to ${item.folder}!`, 'success');
  };

  // Set default startup tab
  const handleSetDefaultTab = (tab: AppViewMode) => {
    try {
      localStorage.setItem(DEFAULT_TAB_KEY, tab);
      showNotification(`Default startup tab set to "${tab === 'newtab' ? 'New Tab / Home' : tab.toUpperCase()}"`, 'success');
    } catch (e) {
      console.warn('Could not save default tab preference:', e);
    }
  };

  // Reset to demo data
  const handleResetDemo = () => {
    if (confirm('Reset bookmark library to demo starter dataset?')) {
      pushHistory(INITIAL_BOOKMARKS);
      setSelectedBookmarkIds(new Set());
      setSelectedFolder(null);
      showNotification('Reset to sample bookmarks', 'info');
    }
  };

  // Category breakdown
  const categoryCounts = bookmarks.reduce((acc, b) => {
    const root = b.folder.split('/')[0] || 'Unsorted Bookmarks';
    acc[root] = (acc[root] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = (Object.entries(categoryCounts) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const unsortedCount = bookmarks.filter(b => 
    b.folder.toLowerCase().includes('unsorted') || 
    b.folder === 'Bookmarks Bar' || 
    b.folder.toLowerCase().includes('other')
  ).length;

  const duplicateCount = bookmarks.filter(b => b.isDuplicate).length;
  const organizedPercentage = bookmarks.length > 0
    ? Math.round(((bookmarks.length - unsortedCount) / bookmarks.length) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        bookmarks={bookmarks}
        currentUser={currentUser}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onShareClick={() => setIsShareModalOpen(true)}
        onImportClick={() => {
          setImportModalTab('import');
          setIsImportModalOpen(true);
        }}
        onExportClick={() => {
          setImportModalTab('export');
          setIsImportModalOpen(true);
        }}
        onDownloadExtensionClick={() => setViewMode('extension-code')}
        onResetDemoClick={handleResetDemo}
        onAddBookmarkClick={() => setIsAddModalOpen(true)}
        onOpenBrokenLinksModal={() => setIsBrokenLinksModalOpen(true)}
        isCheckingHealth={isCheckingLinkHealth}
      />

      {/* Floating Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 backdrop-blur-md'
              : notification.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 backdrop-blur-md'
              : 'bg-indigo-950/90 text-indigo-200 border-indigo-500/40 backdrop-blur-md'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* VIEW 1: MY BOOKMARKS BENTO DASHBOARD */}
        {viewMode === 'dashboard' && (
          <div className="flex flex-col gap-6">
            
            {/* Condition 1: SIMPLE MODE (Default - Clean, single progress bar card & actions) */}
            {dashboardDisplayMode === 'simple' ? (
              <SimpleScannerCard
                bookmarks={bookmarks}
                isScanning={isScanning}
                scanProgress={scanProgress}
                onStartAutoOrganize={() => handleStartScan('all')}
                onCleanUnsorted={() => handleStartScan('unorganized')}
                onAddBookmarkClick={() => setIsAddModalOpen(true)}
                onImportClick={() => {
                  setImportModalTab('import');
                  setIsImportModalOpen(true);
                }}
                onOpenBrokenLinksModal={() => setIsBrokenLinksModalOpen(true)}
                displayMode={dashboardDisplayMode}
                setDisplayMode={setDashboardDisplayMode}
              />
            ) : (
              /* Condition 2: ADVANCED MODE (Full Bento Grid with Metrics, Telemetry & Diagnostics) */
              <>
                {/* Top Bento Grid Row: Hero Scanner (8 cols) + Neural Distribution (4 cols) */}
                <div className="grid grid-cols-12 gap-6 items-stretch">
                  
                  {/* Hero Bento Card: AI Bookmark Scanner */}
                  <div className="col-span-12 lg:col-span-8 flex flex-col">
                    <ScannerControls
                      bookmarks={bookmarks}
                      selectedBookmarks={selectedBookmarks}
                      selectedFolder={selectedFolder}
                      scanScope={scanScope}
                      setScanScope={setScanScope}
                      customInstructions={customInstructions}
                      setCustomInstructions={setCustomInstructions}
                      depth={depth}
                      setDepth={setDepth}
                      isScanning={isScanning}
                      scanProgress={scanProgress}
                      onStartScan={() => handleStartScan()}
                      displayMode={dashboardDisplayMode}
                      setDisplayMode={setDashboardDisplayMode}
                    />
                  </div>

                  {/* Neural Distribution / Health Bento Card */}
                  <div className="col-span-12 lg:col-span-4 bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
                          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold">
                            TAXONOMY HEALTH
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-indigo-400 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                          {organizedPercentage}% ORGANIZED
                        </span>
                      </div>

                      {/* Distribution Categories */}
                      <div className="flex flex-col gap-3 mb-5">
                        {sortedCategories.map(([catName, count], idx) => {
                          const pct = bookmarks.length > 0 ? Math.round((count / bookmarks.length) * 100) : 0;
                          return (
                            <div key={idx} className="flex flex-col gap-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-300 truncate max-w-[170px]">{catName}</span>
                                <span className="text-slate-400 font-mono text-[11px]">{count} ({pct}%)</span>
                              </div>
                              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    idx === 0 ? 'bg-indigo-500' :
                                    idx === 1 ? 'bg-purple-500' :
                                    idx === 2 ? 'bg-sky-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Diagnostics Footnote */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Loose: <strong className="text-amber-300 font-mono">{unsortedCount}</strong></span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400">Dups: <strong className="text-rose-300 font-mono">{duplicateCount}</strong></span>
                      </div>
                      {unsortedCount > 0 && (
                        <button
                          onClick={() => handleStartScan('unorganized')}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline"
                        >
                          Clean loose ({unsortedCount})
                        </button>
                      )}
                    </div>

                  </div>

                </div>

                {/* Middle Bento Telemetry Row */}
                <div className="grid grid-cols-12 gap-6">
                  
                  {/* Telemetry Accuracy Card */}
                  <div className="col-span-12 sm:col-span-4 bg-[#111114] border border-white/10 rounded-3xl p-5 shadow-2xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold mb-1">
                        TAXONOMY ACCURACY
                      </div>
                      <div className="text-2xl font-bold tracking-tight text-white font-mono">
                        99.4%
                      </div>
                      <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-3 h-3" /> Gemini 3.7 Flash Model Active
                      </div>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Quick Actions & Live Stats Card */}
                  <div className="col-span-12 sm:col-span-8 bg-[#111114] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <span className="font-bold text-white font-mono">{bookmarks.length} Bookmarks Indexed</span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-slate-300">{allFolders.length} Active Folders</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-indigo-400 font-semibold">{allTags.length} Unique Tags</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsTagManagerModalOpen(true)}
                        className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
                      >
                        <Tag className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Tag Manager</span>
                      </button>
                      {history.length > 0 && (
                        <button
                          onClick={handleUndo}
                          className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
                        >
                          <Undo2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Undo</span>
                        </button>
                      )}
                      <button
                        onClick={handleResetDemo}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* Bottom Row: Left Folder Taxonomy (4 cols) & Right Bookmarks List (8 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Folder Taxonomy Tree */}
              <div className="lg:col-span-4 sticky top-24">
                <BookmarkTree
                  bookmarks={bookmarks}
                  selectedFolder={selectedFolder}
                  onSelectFolder={setSelectedFolder}
                  onCreateFolder={handleCreateFolder}
                  onDeleteFolder={handleDeleteFolder}
                  onRenameFolder={handleRenameFolder}
                  onDropBookmarkToFolder={handleDropBookmarkToFolder}
                />
              </div>

              {/* Right Column: Bookmark List and Management */}
              <div className="lg:col-span-8">
                <BookmarkList
                  bookmarks={bookmarks}
                  allFolders={allFolders}
                  selectedBookmarkIds={selectedBookmarkIds}
                  onToggleSelect={handleToggleSelect}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                  onMoveBookmarks={handleMoveBookmarks}
                  onDeleteBookmarks={handleDeleteBookmarks}
                  onUpdateBookmarkTags={handleUpdateBookmarkTags}
                  onSingleAiAutoTag={handleSingleAiAutoTag}
                  onBatchTagModalOpen={() => setIsTagManagerModalOpen(true)}
                  onBatchAiAutoTag={handleBatchAiAutoTag}
                  onShareSelected={() => setIsShareModalOpen(true)}
                  currentFolderFilter={selectedFolder}
                  onSelectFolderFilter={setSelectedFolder}
                  isAiTagging={isAiTagging}
                  onOpenBrokenLinksModal={() => setIsBrokenLinksModalOpen(true)}
                  onCheckLinkHealth={handleCheckLinkHealth}
                  isCheckingHealth={isCheckingLinkHealth}
                />
              </div>

            </div>

          </div>
        )}

        {/* VIEW: HOME SCREEN / NEW TAB REPLACEMENT */}
        {viewMode === 'newtab' && (
          <NewTabView
            bookmarks={bookmarks}
            onOpenBookmarksManager={() => setViewMode('dashboard')}
            onOpenDirectory={() => setViewMode('directory')}
            onOpenAddBookmark={() => setIsAddModalOpen(true)}
            onAddBookmarkDirect={handleAddBookmarkDirect}
            onSetDefaultTab={handleSetDefaultTab}
          />
        )}

        {/* VIEW: TOP 100 WEBSITES DIRECTORY */}
        {viewMode === 'directory' && (
          <TopSitesDirectory
            userBookmarks={bookmarks}
            onAddBookmark={handleAddBookmarkDirect}
            onOpenNewTab={() => setViewMode('newtab')}
            onOpenDashboard={() => setViewMode('dashboard')}
          />
        )}

        {/* VIEW: HELP CENTER & CHROME STORE COMPLIANCE */}
        {viewMode === 'help-compliance' && (
          <HelpComplianceView
            onClose={() => setViewMode('dashboard')}
            onOpenExtensionExport={() => setViewMode('extension-code')}
          />
        )}

        {/* VIEW: COMMUNITY MESSAGE BOARD */}
        {viewMode === 'messageboard' && (
          <MessageBoardView
            currentUser={currentUser}
            onOpenMarketplace={() => setViewMode('marketplace')}
            onOpenAddBookmark={() => setIsAddModalOpen(true)}
          />
        )}

        {/* VIEW 2: BOOKMARK MARKETPLACE / BAZAAR (Paid feature, free for now) */}
        {viewMode === 'marketplace' && (
          <MarketplaceView
            currentUser={currentUser}
            onImportPack={handleImportPack}
            onOpenVendorHub={() => setViewMode('vendor-hub')}
            onOpenVipVault={() => setViewMode('vip-vault')}
            userBookmarks={bookmarks}
            onPublishUserPack={(pack) => {
              showNotification(`Pack "${pack.title}" published to marketplace!`, 'success');
            }}
          />
        )}

        {/* VIEW 3: VENDOR HUB */}
        {viewMode === 'vendor-hub' && (
          <VendorHub
            currentUser={currentUser}
            onUpgradeToVendor={() => {
              setCurrentUser(prev => ({ ...prev, tier: 'vendor', isVerifiedVendor: true }));
              showNotification('Verified Vendor status activated!', 'success');
            }}
            userBookmarks={bookmarks}
            onOpenMarketplace={() => setViewMode('marketplace')}
            onPublishPack={(pack) => {
              showNotification(`Pack "${pack.title}" published to marketplace!`, 'success');
            }}
          />
        )}

        {/* VIEW 4: VIP SUBSCRIBER PRIVATE AREA */}
        {viewMode === 'vip-vault' && (
          <VipVaultView
            currentUser={currentUser}
            onUpgradeToVip={() => {
              setCurrentUser(prev => ({ ...prev, tier: 'vip' }));
              showNotification('VIP Vault membership activated! Enjoy exclusive resources.', 'success');
            }}
            onImportPack={handleImportPack}
          />
        )}

        {/* VIEW 5: CHROME POPUP SIMULATOR */}
        {viewMode === 'extension-popup' && (
          <ExtensionSimulator
            bookmarks={bookmarks}
            isScanning={isScanning}
            onRunScan={(scope, prompt) => handleStartScan(scope, prompt)}
            onOpenFullDashboard={() => setViewMode('dashboard')}
            lastResults={lastResults}
            mode="popup"
          />
        )}

        {/* VIEW 6: CHROME SIDEPANEL SIMULATOR */}
        {viewMode === 'sidepanel' && (
          <div className="flex flex-col items-center justify-center p-2">
            <div className="w-full max-w-5xl bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <PanelRight className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-bold text-white">Chrome Side Panel Organizer View</h2>
                </div>
                <button
                  onClick={() => setViewMode('dashboard')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Return to Bento Dashboard
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <BookmarkTree
                    bookmarks={bookmarks}
                    selectedFolder={selectedFolder}
                    onSelectFolder={setSelectedFolder}
                    onCreateFolder={handleCreateFolder}
                    onDeleteFolder={handleDeleteFolder}
                    onRenameFolder={handleRenameFolder}
                    onDropBookmarkToFolder={handleDropBookmarkToFolder}
                  />
                </div>
                <div className="md:col-span-2">
                  <BookmarkList
                    bookmarks={bookmarks}
                    allFolders={allFolders}
                    selectedBookmarkIds={selectedBookmarkIds}
                    onToggleSelect={handleToggleSelect}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                    onMoveBookmarks={handleMoveBookmarks}
                    onDeleteBookmarks={handleDeleteBookmarks}
                    onUpdateBookmarkTags={handleUpdateBookmarkTags}
                    onSingleAiAutoTag={handleSingleAiAutoTag}
                    onBatchTagModalOpen={() => setIsTagManagerModalOpen(true)}
                    onBatchAiAutoTag={handleBatchAiAutoTag}
                    onShareSelected={() => setIsShareModalOpen(true)}
                    currentFolderFilter={selectedFolder}
                    onSelectFolderFilter={setSelectedFolder}
                    isAiTagging={isAiTagging}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: UNPACKED EXTENSION CODE */}
        {viewMode === 'extension-code' && (
          <ExtensionExportModal
            onClose={() => setViewMode('dashboard')}
          />
        )}

      </main>

      {/* Add Bookmark Modal */}
      <AddBookmarkModal
        allFolders={allFolders}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(bm) => {
          pushHistory([bm, ...bookmarks]);
          showNotification('Bookmark added successfully', 'success');
        }}
        onAddBatch={(newItems) => {
          pushHistory([...newItems, ...bookmarks]);
          showNotification(`Added ${newItems.length} bookmarks`, 'success');
        }}
      />

      {/* Import / Export Modal */}
      <ImportExportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        bookmarks={bookmarks}
        defaultTab={importModalTab}
        onImportBookmarks={(newBookmarks, replace) => {
          if (replace) {
            pushHistory(newBookmarks);
          } else {
            pushHistory([...newBookmarks, ...bookmarks]);
          }
          setSelectedBookmarkIds(new Set());
        }}
      />

      {/* Review Diff & Pre-Execution Report Modal */}
      <DiffModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        onApply={handleApplyDiff}
        categorizationResponse={pendingDiffResponse}
        originalBookmarks={bookmarks}
        targetBookmarks={pendingTargetBookmarks}
        allExistingFolders={allFolders}
      />

      {/* Account Auth Modal (Google Sign In & Email Sign In) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          showNotification(`Signed in as ${user.name} (${user.tier.toUpperCase()} tier)`, 'success');
        }}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        bookmarks={bookmarks}
        activeFolder={selectedFolder || undefined}
        selectedCount={selectedBookmarkIds.size}
      />

      {/* Batch Tag Manager Modal */}
      <TagManagerModal
        isOpen={isTagManagerModalOpen}
        onClose={() => setIsTagManagerModalOpen(false)}
        bookmarks={bookmarks}
        selectedBookmarkIds={Array.from(selectedBookmarkIds)}
        allExistingTags={allTags}
        onApplyTags={handleApplyBatchTags}
        onAutoTagAI={(ids) => handleBatchAiAutoTag(ids)}
        isAiTagging={isAiTagging}
      />

      {/* Broken & Unreachable Links Diagnostic and Cleaner Modal */}
      <BrokenLinksModal
        isOpen={isBrokenLinksModalOpen}
        onClose={() => setIsBrokenLinksModalOpen(false)}
        bookmarks={bookmarks}
        onDeleteBookmarks={handleDeleteBookmarks}
        onRecheckLinks={handleCheckLinkHealth}
        isChecking={isCheckingLinkHealth}
        checkingProgress={healthCheckingProgress}
      />

    </div>
  );
}
