import { MessageBoardPost } from '../types';

export const INITIAL_MESSAGE_BOARD_POSTS: MessageBoardPost[] = [
  {
    id: 'post-pinned-1',
    title: '📢 Welcome to the NeuralMark Community Board & Pack Exchange!',
    content: 'Welcome to our bookmark curation and knowledge exchange hub! Here you can:\n\n• **Share & Discover**: Recommend your favorite tool stacks, research vaults, and reading lists.\n• **Request Packs**: Ask verified curators to assemble custom bookmark bundles on any niche topic.\n• **Discuss Workflows**: Share browser extension setups, hotkeys, and taxonomy organization strategies.\n• **Get Help**: Ask questions about organizing bookmarks or using AI auto-tagging.\n\nKeep discussions friendly and helpful. Happy organizing!',
    category: 'General',
    tags: ['Announcement', 'Community', 'Rules'],
    authorId: 'user-admin',
    authorName: 'NeuralMark Team',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    authorTier: 'vip',
    authorBadge: 'FOUNDER',
    upvotes: 84,
    hasUpvoted: false,
    commentsCount: 3,
    pinned: true,
    createdAt: '2 days ago',
    comments: [
      {
        id: 'c-1',
        authorId: 'user-dev-dan',
        authorName: 'Dan Abramovitch',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        authorTier: 'vendor',
        content: 'Super excited for the new Simple mode as well! The progress bar makes organizing 500+ messy bookmarks so much easier.',
        createdAt: '1 day ago',
        upvotes: 19
      },
      {
        id: 'c-2',
        authorId: 'user-elena',
        authorName: 'Elena Rostova',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        authorTier: 'vip',
        content: 'Love that we can preview and share curated packs directly to our personal dashboard. Great addition!',
        createdAt: '18 hours ago',
        upvotes: 12
      },
      {
        id: 'c-3',
        authorId: 'user-marcus',
        authorName: 'Marcus Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        authorTier: 'free',
        content: 'Will there be an automatic duplicate finder for imported HTML bookmarks? (Found it under the advanced filters, works like magic!)',
        createdAt: '5 hours ago',
        upvotes: 8
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Top 15 Dev Tools & AI Assistant bookmarks I use daily as a Senior Fullstack Engineer',
    content: 'After 8 years in tech and hoarding over 4,000 links, I narrowed down my essential stack to 15 bookmarks that save me at least 5 hours every week:\n\n1. **TypeScript AST Viewer** - for inspecting compile trees.\n2. **Bundlephobia** - checking cost of npm packages before installing.\n3. **QuickType.io** - instant JSON to TypeScript schema generation.\n4. **CSS Grid Generator & Neumorphism toolkits**\n5. **Vite & Tailwind official search engines**\n\nI published the full bundle to the Marketplace as a free download, check it out or let me know what tools you consider indispensable!',
    category: 'Showcase',
    tags: ['DevTools', 'TypeScript', 'Productivity', 'WebDev'],
    authorId: 'user-sophia',
    authorName: 'Sophia Lee',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    authorTier: 'vendor',
    authorBadge: 'STAFF ENG',
    upvotes: 62,
    hasUpvoted: true,
    commentsCount: 4,
    attachedPackId: 'pack-fullstack-dev-2026',
    attachedPackTitle: 'Senior Full-Stack & DevOps Engineering Arsenal',
    attachedLinksCount: 15,
    createdAt: '1 day ago',
    comments: [
      {
        id: 'c-201',
        authorId: 'user-lucas',
        authorName: 'Lucas Scott',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        authorTier: 'free',
        content: 'QuickType is an absolute lifesaver when integrating new third-party APIs. Added to my favorites!',
        createdAt: '16 hours ago',
        upvotes: 7
      },
      {
        id: 'c-202',
        authorId: 'user-bicknell',
        authorName: 'Alex Vance',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        authorTier: 'vip',
        content: 'I cloned your pack into my Development folder, thanks for putting this together!',
        createdAt: '10 hours ago',
        upvotes: 11
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Pack Request: Curated bookmarks for LLM fine-tuning & local model deployment (Ollama, vLLM)',
    content: 'Hey everyone! Is anyone curating a pack with the best resources, quantization guides, evaluation benchmarks, and hardware setups for running local LLMs? Looking for trusted articles rather than generic medium posts.',
    category: 'Packs & Vaults',
    tags: ['AI', 'LLM', 'LocalAI', 'Request'],
    authorId: 'user-aravind',
    authorName: 'Aravind Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    authorTier: 'free',
    upvotes: 41,
    hasUpvoted: false,
    commentsCount: 2,
    createdAt: '2 days ago',
    comments: [
      {
        id: 'c-301',
        authorId: 'user-marcus',
        authorName: 'Marcus Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        authorTier: 'free',
        content: 'Check out the "GenAI & Prompt Engineering Vault" in the Marketplace! It has 24 links dedicated to quantized models and prompt caching.',
        createdAt: '1 day ago',
        upvotes: 9
      }
    ]
  },
  {
    id: 'post-4',
    title: '💡 Tip: Using Simple Mode vs Advanced Mode for quick weekly bookmark cleanup',
    content: 'If your bookmarks get messy throughout the week from random browsing on your phone or laptop:\n\n1. Keep **Simple Mode** as your default.\n2. When you see the progress bar drop below 90%, just hit **"Clean Unsorted Bookmarks"**.\n3. In 2 seconds, Gemini groups everything into clean folders.\n4. Switch to **Advanced Mode** only when you want to create custom prompt taxonomies or inspect duplicate URLs!\n\nKeeps cognitive load at zero.',
    category: 'Tips & Tricks',
    tags: ['Workflow', 'SimpleMode', 'Guide'],
    authorId: 'user-elena',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    authorTier: 'vip',
    authorBadge: 'PRO USER',
    upvotes: 79,
    hasUpvoted: true,
    commentsCount: 3,
    createdAt: '3 days ago',
    comments: [
      {
        id: 'c-401',
        authorId: 'user-sophia',
        authorName: 'Sophia Lee',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        authorTier: 'vendor',
        content: 'Exactly how I use it too. The single-click progress bar action is so refreshing.',
        createdAt: '2 days ago',
        upvotes: 14
      }
    ]
  },
  {
    id: 'post-5',
    title: 'How do you structure your research and reading bookmarks?',
    content: 'Do you prefer topic-based folders (e.g. `Research/Quantum`, `Research/Economics`) or status-based folders (e.g. `To Read`, `Reading`, `Archived`)? I find that AI auto-tagging makes topic-based folders much easier because I can tag `#read-later` across any category.',
    category: 'Help & Q&A',
    tags: ['Discussion', 'Organization', 'Methodology'],
    authorId: 'user-david',
    authorName: 'David K.',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    authorTier: 'free',
    upvotes: 27,
    hasUpvoted: false,
    commentsCount: 2,
    createdAt: '4 days ago',
    comments: [
      {
        id: 'c-501',
        authorId: 'user-bicknell',
        authorName: 'Alex Vance',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        authorTier: 'vip',
        content: 'Topic folders + status tags is the golden combination! Tags give flexibility without cluttering folder trees.',
        createdAt: '3 days ago',
        upvotes: 16
      }
    ]
  }
];
