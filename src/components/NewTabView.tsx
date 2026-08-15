import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  Clock, 
  CheckSquare, 
  Square, 
  FileText, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Settings2, 
  Compass, 
  Zap, 
  Code, 
  Layers, 
  Volume2, 
  VolumeX, 
  X,
  Edit2,
  Tv,
  Music,
  LayoutGrid,
  TrendingUp,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Bookmark, QuickTodoItem, CustomEmbedItem, NewTabSettings } from '../types';
import { TOP_SITES_DIRECTORY } from '../data/topSitesData';

interface NewTabViewProps {
  bookmarks: Bookmark[];
  onOpenDashboard: () => void;
  onOpenDirectory: () => void;
  onAddBookmark: (bookmark: Omit<Bookmark, 'id' | 'dateAdded'>) => void;
  isDefaultStartTab: boolean;
  onToggleDefaultStartTab: (enabled: boolean) => void;
}

const SEARCH_ENGINES = [
  { id: 'google', name: 'Google', icon: '🔍', url: 'https://www.google.com/search?q=' },
  { id: 'perplexity', name: 'Perplexity', icon: '🤖', url: 'https://www.perplexity.ai/search?q=' },
  { id: 'github', name: 'GitHub', icon: '🐙', url: 'https://github.com/search?q=' },
  { id: 'duckduckgo', name: 'DuckDuckGo', icon: '🦆', url: 'https://duckduckgo.com/?q=' },
  { id: 'hackernews', name: 'HackerNews', icon: '🔶', url: 'https://hn.algolia.com/?q=' },
  { id: 'huggingface', name: 'HuggingFace', icon: '🤗', url: 'https://huggingface.co/models?search=' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', url: 'https://www.youtube.com/results?search_query=' },
  { id: 'reddit', name: 'Reddit', icon: '👽', url: 'https://www.reddit.com/search/?q=' },
  { id: 'wikipedia', name: 'Wikipedia', icon: '📚', url: 'https://en.wikipedia.org/wiki/Special:Search?search=' }
] as const;

const TECH_QUOTES = [
  { quote: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Knowledge is power. Organization is mastery.", author: "NeuralMark AI" },
  { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" }
];

export const NewTabView: React.FC<NewTabViewProps> = ({
  bookmarks,
  onOpenDashboard,
  onOpenDirectory,
  onAddBookmark,
  isDefaultStartTab,
  onToggleDefaultStartTab
}) => {
  // Clock state
  const [time, setTime] = useState<Date>(new Date());
  
  // Search query & engine
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<string>('google');

  // Quick Notes state
  const [quickNote, setQuickNote] = useState<string>(() => {
    return localStorage.getItem('neuralmark_newtab_note') || '# Quick Scratchpad\n- Press / to search anywhere\n- Bookmark health is synced\n- Fast capture ideas here...';
  });

  // Quick Todos
  const [todos, setTodos] = useState<QuickTodoItem[]>(() => {
    const saved = localStorage.getItem('neuralmark_newtab_todos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'td-1', text: 'Clean duplicate bookmarks', completed: false, priority: 'high', createdAt: Date.now() },
      { id: 'td-2', text: 'Review top 100 AI tools', completed: true, priority: 'medium', createdAt: Date.now() },
      { id: 'td-3', text: 'Run link health scan', completed: false, priority: 'low', createdAt: Date.now() }
    ];
  });
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Pomodoro Focus Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [pomodoroSessions, setPomodoroSessions] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Custom & Built-in Embeds
  const [embeds, setEmbeds] = useState<CustomEmbedItem[]>(() => {
    const saved = localStorage.getItem('neuralmark_newtab_embeds');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'emb-lofi',
        title: 'Lofi Girl Live Beats',
        url: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=0',
        height: 220,
        category: 'Media'
      }
    ];
  });

  // Modal for adding custom embed
  const [isAddEmbedOpen, setIsAddEmbedOpen] = useState(false);
  const [embedTitleInput, setEmbedTitleInput] = useState('');
  const [embedUrlInput, setEmbedUrlInput] = useState('');
  const [embedHeightInput, setEmbedHeightInput] = useState('280');

  // Modal for adding quick bookmark tile
  const [isAddTileOpen, setIsAddTileOpen] = useState(false);
  const [tileTitle, setTileTitle] = useState('');
  const [tileUrl, setTileUrl] = useState('');

  // Daily Quote index
  const quote = TECH_QUOTES[time.getDate() % TECH_QUOTES.length];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save quick notes
  useEffect(() => {
    localStorage.setItem('neuralmark_newtab_note', quickNote);
  }, [quickNote]);

  // Save todos
  useEffect(() => {
    localStorage.setItem('neuralmark_newtab_todos', JSON.stringify(todos));
  }, [todos]);

  // Save embeds
  useEffect(() => {
    localStorage.setItem('neuralmark_newtab_embeds', JSON.stringify(embeds));
  }, [embeds]);

  // Pomodoro countdown effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            if (timerMode === 'focus') {
              setPomodoroSessions(s => s + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timerMode]);

  // Timer controls
  const setMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    if (mode === 'focus') setTimerSeconds(25 * 60);
    if (mode === 'shortBreak') setTimerSeconds(5 * 60);
    if (mode === 'longBreak') setTimerSeconds(15 * 60);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setMode(timerMode);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Search handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const engine = SEARCH_ENGINES.find(eng => eng.id === selectedEngine) || SEARCH_ENGINES[0];
    const targetUrl = `${engine.url}${encodeURIComponent(searchQuery.trim())}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Todo handlers
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newItem: QuickTodoItem = {
      id: `td-${Date.now()}`,
      text: newTodoText.trim(),
      completed: false,
      priority: newTodoPriority,
      createdAt: Date.now()
    };
    setTodos([newItem, ...todos]);
    setNewTodoText('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  // Embed handlers
  const handleAddCustomEmbed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!embedUrlInput.trim() || !embedTitleInput.trim()) return;

    let cleanUrl = embedUrlInput.trim();
    // Convert regular YouTube watch links to embed links if necessary
    if (cleanUrl.includes('youtube.com/watch?v=')) {
      const videoId = cleanUrl.split('watch?v=')[1]?.split('&')[0];
      if (videoId) cleanUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    }

    const newEmbed: CustomEmbedItem = {
      id: `emb-${Date.now()}`,
      title: embedTitleInput.trim(),
      url: cleanUrl,
      height: parseInt(embedHeightInput, 10) || 280,
      isCustom: true
    };
    setEmbeds([...embeds, newEmbed]);
    setEmbedTitleInput('');
    setEmbedUrlInput('');
    setIsAddEmbedOpen(false);
  };

  const handleDeleteEmbed = (id: string) => {
    setEmbeds(embeds.filter(e => e.id !== id));
  };

  // Add custom tile handler
  const handleAddCustomTile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tileUrl.trim() || !tileTitle.trim()) return;
    let url = tileUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    onAddBookmark({
      title: tileTitle.trim(),
      url,
      folder: 'Bookmarks Bar/Quick Launch',
      tags: ['quick-launch', 'home'],
      status: 'synced',
      linkHealth: 'healthy'
    });
    setTileTitle('');
    setTileUrl('');
    setIsAddTileOpen(false);
  };

  // Greeting based on hour
  const hours = time.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';

  // Format date
  const dateFormatted = time.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  // Pinned favorites: top 8 bookmarks or quick ones
  const pinnedBookmarks = bookmarks.slice(0, 8);
  const brokenCount = bookmarks.filter(b => b.linkHealth === 'broken' || b.linkHealth === 'unreachable').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Top Header: Greeting, Clock, Default Start Switch */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
              {dateFormatted}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-400 font-medium">NEURAL HUB READY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            {greeting}, <span className="text-indigo-400">Commander</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl italic">
            "{quote.quote}" — <span className="text-slate-300 not-italic">{quote.author}</span>
          </p>
        </div>

        {/* Digital Clock & Start Tab Preference */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex flex-col items-end">
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <button
              onClick={() => onToggleDefaultStartTab(!isDefaultStartTab)}
              className={`flex items-center gap-2 mt-1 px-3 py-1 rounded-xl text-[11px] font-mono transition border ${
                isDefaultStartTab
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
              }`}
              title="Set this minimal dashboard as your default startup / home screen tab"
            >
              <Zap className={`w-3 h-3 ${isDefaultStartTab ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
              <span>{isDefaultStartTab ? 'Default New Tab: ON' : 'Make Default New Tab'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Engine Instant Search Bar */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-3">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <span className="text-base">{SEARCH_ENGINES.find(e => e.id === selectedEngine)?.icon || '🔍'}</span>
          </div>
          <input
            id="newtab-main-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search with ${SEARCH_ENGINES.find(e => e.id === selectedEngine)?.name}... (Press Enter)`}
            className="w-full bg-[#121216] border border-white/15 focus:border-indigo-500 rounded-3xl pl-12 pr-28 py-4 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-2xl transition"
            autoFocus
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <button
              type="submit"
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>

        {/* Engine switcher pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {SEARCH_ENGINES.map(engine => (
            <button
              key={engine.id}
              onClick={() => setSelectedEngine(engine.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedEngine === engine.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <span>{engine.icon}</span>
              <span>{engine.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Bookmarks Quick Launch Bar */}
      <div className="bg-[#101014] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">
              QUICK LAUNCH & FAVORITES
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddTileOpen(true)}
              className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add Tile</span>
            </button>
            <button
              onClick={onOpenDashboard}
              className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>All Bookmarks ({bookmarks.length})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {pinnedBookmarks.map(bm => (
            <a
              key={bm.id}
              href={bm.url}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/40 flex flex-col items-center justify-center gap-2 text-center transition group relative overflow-hidden"
              title={`${bm.title}\n${bm.url}`}
            >
              <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 p-1.5 flex items-center justify-center group-hover:scale-110 transition">
                <img
                  src={bm.favicon || `https://www.google.com/s2/favicons?domain=${new URL(bm.url).hostname}&sz=64`}
                  alt={bm.title}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-white truncate w-full">
                {bm.title}
              </span>
            </a>
          ))}

          {/* Quick Top 100 Directory Tile */}
          <button
            onClick={onOpenDirectory}
            className="p-3 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 flex flex-col items-center justify-center gap-2 text-center transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition shadow-md shadow-indigo-600/30">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-300 group-hover:text-white truncate w-full">
              Top 100 Web
            </span>
          </button>
        </div>
      </div>

      {/* Bento Grid: 3 Productivity Applets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Applet 1: Instant Scratchpad & Notes */}
        <div className="bg-[#101014] border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                QUICK SCRATCHPAD
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {quickNote.length} chars • Autosaved
            </span>
          </div>

          <textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Type quick thoughts, code snippets, or draft notes here..."
            className="w-full h-44 bg-[#141418] border border-white/5 rounded-2xl p-3.5 text-xs text-slate-200 font-mono resize-none focus:outline-none focus:border-emerald-500/50 transition leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                navigator.clipboard.writeText(quickNote);
              }}
              className="text-[11px] text-slate-400 hover:text-emerald-300 transition"
            >
              📋 Copy to Clipboard
            </button>
            <button
              onClick={() => setQuickNote('')}
              className="text-[11px] text-slate-400 hover:text-rose-300 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Applet 2: Pomodoro Focus Timer */}
        <div className="bg-[#101014] border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                FOCUS TIMER
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {pomodoroSessions} Completed
            </span>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-xl text-center">
            <button
              onClick={() => setMode('focus')}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                timerMode === 'focus' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Focus 25m
            </button>
            <button
              onClick={() => setMode('shortBreak')}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                timerMode === 'shortBreak' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Short 5m
            </button>
            <button
              onClick={() => setMode('longBreak')}
              className={`py-1.5 rounded-lg text-xs font-bold transition ${
                timerMode === 'longBreak' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Long 15m
            </button>
          </div>

          {/* Large Countdown Display */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {formatTimer(timerSeconds)}
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase mt-1">
              {isTimerRunning ? '🔥 Session in Progress' : '⏸️ Paused'}
            </span>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`flex-1 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                isTimerRunning
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTimerRunning ? 'Pause Session' : 'Start Focus'}</span>
            </button>
            <button
              onClick={resetTimer}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Applet 3: Quick Priorities & Todos */}
        <div className="bg-[#101014] border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                PRIORITY TASKS
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {todos.filter(t => !t.completed).length} Pending
            </span>
          </div>

          {/* Add Todo Input */}
          <form onSubmit={handleAddTodo} className="flex items-center gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add priority task..."
              className="flex-1 bg-[#141418] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <select
              value={newTodoPriority}
              onChange={(e) => setNewTodoPriority(e.target.value as any)}
              className="bg-[#141418] border border-white/10 rounded-xl px-2 py-2 text-[11px] text-slate-300 focus:outline-none"
            >
              <option value="high">High</option>
              <option value="medium">Med</option>
              <option value="low">Low</option>
            </select>
            <button
              type="submit"
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Todo List */}
          <div className="flex flex-col gap-1.5 h-36 overflow-y-auto pr-1">
            {todos.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-xs group"
              >
                <button
                  onClick={() => handleToggleTodo(item.id)}
                  className="flex items-center gap-2 text-left min-w-0 flex-1"
                >
                  {item.completed ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className={`truncate text-xs ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {item.text}
                  </span>
                </button>
                
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                    item.priority === 'high' 
                      ? 'bg-rose-500/20 text-rose-300' 
                      : item.priority === 'medium'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {item.priority}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(item.id)}
                    className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] font-mono text-slate-500 text-right pt-1">
            {todos.filter(t => t.completed).length}/{todos.length} Done
          </div>
        </div>

      </div>

      {/* Embeds & Media Widgets Section */}
      <div className="bg-[#101014] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">
              ACTIVE EMBEDS & LIVE APPLET WINDOWS
            </h3>
          </div>
          <button
            onClick={() => setIsAddEmbedOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Embed / Iframe</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {embeds.map(embed => (
            <div
              key={embed.id}
              className="bg-[#141418] border border-white/10 rounded-2xl p-3 flex flex-col gap-2 relative group overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Music className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="text-xs font-bold text-white truncate">{embed.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={embed.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDeleteEmbed(embed.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400"
                    title="Remove Embed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden bg-black/60 border border-white/5">
                <iframe
                  src={embed.url}
                  title={embed.title}
                  height={embed.height || 220}
                  className="w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Embed Modal */}
      {isAddEmbedOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tv className="w-4 h-4 text-purple-400" />
                Add Custom Embed (Iframe)
              </h3>
              <button
                onClick={() => setIsAddEmbedOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomEmbed} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Embed Title</label>
                <input
                  type="text"
                  value={embedTitleInput}
                  onChange={(e) => setEmbedTitleInput(e.target.value)}
                  placeholder="e.g. Spotify Synthwave, Notion Page, Live Crypto..."
                  required
                  className="w-full bg-[#18181e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">HTTPS Embed URL</label>
                <input
                  type="url"
                  value={embedUrlInput}
                  onChange={(e) => setEmbedUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/embed/... or any embeddable URL"
                  required
                  className="w-full bg-[#18181e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Height (px)</label>
                <input
                  type="number"
                  value={embedHeightInput}
                  onChange={(e) => setEmbedHeightInput(e.target.value)}
                  className="w-full bg-[#18181e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddEmbedOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Add Embed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Quick Tile Modal */}
      {isAddTileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add Quick Launch Tile
              </h3>
              <button
                onClick={() => setIsAddTileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomTile} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Website Name</label>
                <input
                  type="text"
                  value={tileTitle}
                  onChange={(e) => setTileTitle(e.target.value)}
                  placeholder="e.g. GitHub, Perplexity, Reddit..."
                  required
                  className="w-full bg-[#18181e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">URL</label>
                <input
                  type="text"
                  value={tileUrl}
                  onChange={(e) => setTileUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  className="w-full bg-[#18181e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddTileOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Add Tile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
