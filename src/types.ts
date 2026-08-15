export type LinkHealthStatus = 'checking' | 'healthy' | 'broken' | 'unreachable' | 'redirect' | 'untested';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  folder: string; // e.g. "Bookmarks Bar/Development/React" or "Unsorted"
  tags: string[];
  aiSummary?: string;
  dateAdded?: number;
  favicon?: string;
  selected?: boolean;
  isDuplicate?: boolean;
  duplicateOf?: string;
  suggestedFolder?: string;
  suggestedTags?: string[];
  status?: 'synced' | 'pending' | 'modified';
  linkHealth?: LinkHealthStatus;
  httpStatusCode?: number;
  linkHealthError?: string;
  lastHealthCheckedAt?: number;
}

export interface FolderNode {
  name: string;
  fullPath: string;
  children: FolderNode[];
  bookmarkCount: number;
  isExpanded?: boolean;
}

export interface CategorizationRequest {
  bookmarks: Array<{
    id: string;
    title: string;
    url: string;
    folder?: string;
  }>;
  customInstructions?: string;
  preferredFolders?: string[];
  depth?: 'flat' | 'nested'; // 1-level or multi-level
  maxFolders?: number;
}

export interface CategorizedBookmarkResult {
  id: string;
  folder: string;
  tags: string[];
  summary: string;
  confidence: number;
}

export interface CategorizationResponse {
  folders: string[];
  results: CategorizedBookmarkResult[];
  explanation: string;
  duplicates?: Array<{ id: string; duplicateWithId: string; reason: string }>;
}

export type ScanScope = 'all' | 'selected' | 'unorganized' | 'folder';

export type AppViewMode = 
  | 'dashboard' 
  | 'newtab'
  | 'directory'
  | 'help-compliance'
  | 'messageboard' 
  | 'marketplace' 
  | 'vendor-hub' 
  | 'vip-vault' 
  | 'extension-popup' 
  | 'sidepanel' 
  | 'extension-code';

export type DashboardDisplayMode = 'simple' | 'advanced';

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorTier: UserTier;
  content: string;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

export interface MessageBoardPost {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Packs & Vaults' | 'Tips & Tricks' | 'AI Tools' | 'Help & Q&A' | 'Showcase';
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorTier: UserTier;
  authorBadge?: string;
  upvotes: number;
  hasUpvoted?: boolean;
  commentsCount: number;
  comments: PostComment[];
  createdAt: string;
  pinned?: boolean;
  attachedPackId?: string;
  attachedPackTitle?: string;
  attachedLinksCount?: number;
}

export type UserTier = 'free' | 'vip' | 'vendor';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  tier: UserTier;
  credits: number;
  authProvider: 'google' | 'email' | 'guest';
  isVerifiedVendor?: boolean;
  publishedPacksCount?: number;
  totalSales?: number;
}

export interface MarketplacePack {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number; // 0 for free
  currency: string;
  author: string;
  authorAvatar?: string;
  authorTier: UserTier;
  rating: number;
  reviewsCount: number;
  clonesCount: number;
  bookmarksCount: number;
  bookmarks: Bookmark[];
  tags: string[];
  isVipOnly?: boolean;
  featured?: boolean;
  createdAt: string;
  verified?: boolean;
}

export interface SearchFilterState {
  query: string;
  titleKeyword: string;
  urlKeyword: string;
  folders: string[];
  tags: string[];
  matchMode: 'all' | 'any'; // for multiple tags
  onlyDuplicates?: boolean;
  onlyUnsorted?: boolean;
  onlyAiSummarized?: boolean;
  onlyBrokenLinks?: boolean;
  sortBy: 'date' | 'title' | 'folder' | 'tags-count' | 'health';
}

export interface LinkHealthCheckResult {
  id: string;
  url: string;
  status: LinkHealthStatus;
  statusCode?: number;
  error?: string;
  checkedAt: number;
}

export interface ShareBundle {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  bookmarks: Bookmark[];
  shareCode: string;
}

export interface QuickTodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface CustomEmbedItem {
  id: string;
  title: string;
  url: string;
  height?: number; // e.g. 240, 360, 450
  category?: string;
  isCustom?: boolean;
}

export interface NewTabSettings {
  defaultSearchEngine: 'google' | 'duckduckgo' | 'github' | 'perplexity' | 'kagi' | 'wikipedia' | 'youtube' | 'reddit' | 'hackernews' | 'huggingface';
  clockFormat24: boolean;
  showSeconds: boolean;
  showGreeting: boolean;
  showTechQuote: boolean;
  showWidgets: boolean;
  showEmbeds: boolean;
  showDirectoryPreview: boolean;
  activeWidgetIds: string[];
}

