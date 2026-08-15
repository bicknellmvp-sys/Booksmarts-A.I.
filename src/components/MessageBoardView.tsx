import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Pin, 
  Send, 
  Search, 
  Plus, 
  Tag, 
  Sparkles, 
  Filter, 
  Share2, 
  Store, 
  Crown, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  CornerDownRight, 
  ArrowUpRight, 
  Flame, 
  Clock, 
  MessageCircle, 
  X,
  HelpCircle
} from 'lucide-react';
import { MessageBoardPost, PostComment, UserProfile, UserTier } from '../types';
import { INITIAL_MESSAGE_BOARD_POSTS } from '../data/sampleMessageBoard';

interface MessageBoardViewProps {
  currentUser: UserProfile;
  onOpenMarketplace?: () => void;
  onOpenAddBookmark?: () => void;
}

const CATEGORIES = [
  'All',
  'General',
  'Packs & Vaults',
  'Tips & Tricks',
  'AI Tools',
  'Help & Q&A',
  'Showcase'
] as const;

export const MessageBoardView: React.FC<MessageBoardViewProps> = ({
  currentUser,
  onOpenMarketplace,
  onOpenAddBookmark
}) => {
  const [posts, setPosts] = useState<MessageBoardPost[]>(() => {
    try {
      const saved = localStorage.getItem('ai_bookmarks_messageboard_posts_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load messageboard posts from local storage', e);
    }
    return INITIAL_MESSAGE_BOARD_POSTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'discussed'>('popular');
  const [expandedPostIds, setExpandedPostIds] = useState<Set<string>>(new Set(['post-pinned-1', 'post-2']));
  
  // New Post modal state
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MessageBoardPost['category']>('General');
  const [newContent, setNewContent] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newAttachmentType, setNewAttachmentType] = useState<'none' | 'pack'>('none');
  const [newAttachmentTitle, setNewAttachmentTitle] = useState('');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const savePosts = (updatedPosts: MessageBoardPost[]) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem('ai_bookmarks_messageboard_posts_v1', JSON.stringify(updatedPosts));
    } catch (e) {
      console.error('Failed to save messageboard posts', e);
    }
  };

  const handleToggleUpvote = (postId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const hasUpvoted = !post.hasUpvoted;
        const upvotes = hasUpvoted ? post.upvotes + 1 : Math.max(0, post.upvotes - 1);
        return { ...post, hasUpvoted, upvotes };
      }
      return post;
    });
    savePosts(updated);
  };

  const handleToggleCommentUpvote = (postId: string, commentId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(c => {
          if (c.id === commentId) {
            const hasUpvoted = !c.hasUpvoted;
            const upvotes = hasUpvoted ? c.upvotes + 1 : Math.max(0, c.upvotes - 1);
            return { ...c, hasUpvoted, upvotes };
          }
          return c;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    savePosts(updated);
  };

  const handleToggleExpandComments = (postId: string) => {
    setExpandedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const newComment: PostComment = {
      id: 'comment-' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorTier: currentUser.tier,
      content: text,
      createdAt: 'Just now',
      upvotes: 1,
      hasUpvoted: true
    };

    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });

    savePosts(updated);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    
    // Ensure comments section is opened
    setExpandedPostIds(prev => new Set([...prev, postId]));
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, '');
    if (trimmed && !newTags.includes(trimmed)) {
      setNewTags([...newTags, trimmed]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTags(newTags.filter(t => t !== tagToRemove));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: MessageBoardPost = {
      id: 'post-' + Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      tags: newTags.length > 0 ? newTags : ['General'],
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorTier: currentUser.tier,
      authorBadge: currentUser.tier === 'vip' ? 'VIP' : currentUser.tier === 'vendor' ? 'CURATOR' : undefined,
      upvotes: 1,
      hasUpvoted: true,
      commentsCount: 0,
      comments: [],
      createdAt: 'Just now',
      attachedPackTitle: newAttachmentType === 'pack' && newAttachmentTitle ? newAttachmentTitle : undefined,
      attachedLinksCount: newAttachmentType === 'pack' ? 12 : undefined
    };

    savePosts([newPost, ...posts]);
    setIsNewPostModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTags([]);
    setNewAttachmentTitle('');
    setNewAttachmentType('none');
  };

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  }).sort((a, b) => {
    // Pinned posts always stay on top
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    if (sortBy === 'popular') return b.upvotes - a.upvotes;
    if (sortBy === 'discussed') return b.commentsCount - a.commentsCount;
    return b.id.localeCompare(a.id); // newest by ID timestamp
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl w-full mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/10">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                COMMUNITY HUB
              </span>
              <span className="text-xs text-slate-400">• Active Curators & Discussions</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Community Message Board
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Discuss bookmark collections, request custom vaults from verified curators, share browser tips, and trade tool stacks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="btn-create-post"
            onClick={() => setIsNewPostModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Discussion</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111114] border border-white/10 rounded-2xl p-3 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Categories Tab Pill */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search topics, tags, authors..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="popular">🔥 Most Popular</option>
            <option value="newest">🕒 Newest</option>
            <option value="discussed">💬 Most Discussed</option>
          </select>
        </div>

      </div>

      {/* Posts List */}
      <div className="flex flex-col gap-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-[#111114] border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <MessageSquare className="w-10 h-10 text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-white">No discussions found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              No posts matched your current category or search keyword. Start the conversation yourself!
            </p>
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
            >
              Post First Topic
            </button>
          </div>
        ) : (
          filteredPosts.map(post => {
            const isExpanded = expandedPostIds.has(post.id);

            return (
              <div 
                key={post.id}
                className={`bg-[#111114] border rounded-3xl p-5 sm:p-6 transition-all ${
                  post.pinned 
                    ? 'border-indigo-500/40 bg-gradient-to-r from-indigo-950/20 via-[#111114] to-[#111114]' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Post Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {post.authorAvatar ? (
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold">
                        <User className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{post.authorName}</span>
                        {post.authorBadge && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {post.authorBadge}
                          </span>
                        )}
                        {post.authorTier === 'vip' && !post.authorBadge && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Crown className="w-2.5 h-2.5" /> VIP
                          </span>
                        )}
                        {post.authorTier === 'vendor' && !post.authorBadge && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" /> CURATOR
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">• {post.createdAt}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                          {post.category}
                        </span>
                        {post.pinned && (
                          <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 flex items-center gap-1">
                            <Pin className="w-2.5 h-2.5" /> PINNED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={() => handleToggleUpvote(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      post.hasUpvoted
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.upvotes}</span>
                  </button>
                </div>

                {/* Post Title */}
                <h3 className="text-base font-bold text-white tracking-tight mb-2">
                  {post.title}
                </h3>

                {/* Post Content */}
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                  {post.content}
                </div>

                {/* Attached Vault or Pack banner if available */}
                {post.attachedPackTitle && (
                  <div className="mb-3 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0">
                        <Store className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-indigo-300 uppercase">Attached Bookmark Vault</div>
                        <div className="text-xs font-bold text-white">{post.attachedPackTitle}</div>
                      </div>
                    </div>

                    {onOpenMarketplace && (
                      <button
                        onClick={onOpenMarketplace}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-1"
                      >
                        <span>Preview Pack</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Post Tags & Comment Counter */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {post.tags.map(tag => (
                      <span 
                        key={tag}
                        className="text-[11px] font-medium text-slate-400 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg border border-white/5 transition cursor-pointer"
                        onClick={() => setSearchQuery(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleToggleExpandComments(post.id)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.commentsCount} Comments</span>
                  </button>
                </div>

                {/* Comments Section (Collapsible) */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                    
                    {/* Existing Comments */}
                    {post.comments.length > 0 && (
                      <div className="flex flex-col gap-2.5">
                        {post.comments.map(c => (
                          <div 
                            key={c.id}
                            className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="flex items-start gap-2.5">
                              <CornerDownRight className="w-3.5 h-3.5 text-slate-500 mt-1 shrink-0" />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-white">{c.authorName}</span>
                                  {c.authorTier === 'vip' && (
                                    <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded">
                                      VIP
                                    </span>
                                  )}
                                  {c.authorTier === 'vendor' && (
                                    <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded">
                                      CURATOR
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-500">• {c.createdAt}</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed">{c.content}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleCommentUpvote(post.id, c.id)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium shrink-0 transition ${
                                c.hasUpvoted ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-white/5'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{c.upvotes}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder="Write a reply or helpful insight..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!(commentInputs[post.id] || '').trim()}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Send className="w-3 h-3" />
                        <span className="hidden sm:inline">Reply</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* New Discussion Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-white/10 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Create New Discussion Topic</h3>
              </div>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="flex flex-col gap-3.5 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Best bookmark stack for AI researchers and prompt engineers"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="General">General</option>
                    <option value="Packs & Vaults">Packs & Vaults</option>
                    <option value="Tips & Tricks">Tips & Tricks</option>
                    <option value="AI Tools">AI Tools</option>
                    <option value="Help & Q&A">Help & Q&A</option>
                    <option value="Showcase">Showcase</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Attach Vault</label>
                  <select
                    value={newAttachmentType}
                    onChange={e => setNewAttachmentType(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="none">No attached pack</option>
                    <option value="pack">Attach Curated Vault</option>
                  </select>
                </div>
              </div>

              {newAttachmentType === 'pack' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pack Title / Reference</label>
                  <input
                    type="text"
                    value={newAttachmentTitle}
                    onChange={e => setNewAttachmentTitle(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Engineering Arsenal"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Content & Details</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Share your thoughts, ask your question, or list your favorite bookmarks..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type tag and press Add (e.g. DevTools, LLMs)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium"
                  >
                    Add Tag
                  </button>
                </div>

                {newTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {newTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-lg text-[11px]"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 mt-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Publish Discussion
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
