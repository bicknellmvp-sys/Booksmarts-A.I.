import { MarketplacePack } from '../types';

export const INITIAL_MARKETPLACE_PACKS: MarketplacePack[] = [
  {
    id: 'pack-ai-agents',
    title: 'Top 50 AI Agents & Model Repos 2026',
    description: 'Curated by AI research engineers. Comprehensive directory of open-source agent frameworks, eval benchmarks, model routers, and prompt libraries.',
    category: 'Artificial Intelligence',
    price: 0, // Free for now / preview
    currency: 'USD',
    author: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    authorTier: 'vendor',
    rating: 4.9,
    reviewsCount: 142,
    clonesCount: 3820,
    bookmarksCount: 6,
    tags: ['ai', 'agents', 'gemini', 'llm', 'research'],
    featured: true,
    verified: true,
    createdAt: '2026-06-12',
    bookmarks: [
      {
        id: 'ai-1',
        title: 'Google AI Studio & Gemini API Docs',
        url: 'https://ai.google.dev',
        folder: 'Marketplace/AI & Agents/Foundations',
        tags: ['ai', 'gemini', 'docs', 'api'],
        aiSummary: 'Official portal and developer docs for Gemini 3.7 Flash and Multimodal Live APIs.',
        dateAdded: Date.now() - 86400000 * 12
      },
      {
        id: 'ai-2',
        title: 'Hugging Face Hub & Open Models',
        url: 'https://huggingface.co/models',
        folder: 'Marketplace/AI & Agents/Models',
        tags: ['models', 'open-source', 'ml', 'weights'],
        aiSummary: 'Leading repository for machine learning weights, datasets, and community spaces.',
        dateAdded: Date.now() - 86400000 * 10
      },
      {
        id: 'ai-3',
        title: 'LangChain & LangGraph Framework',
        url: 'https://www.langchain.com',
        folder: 'Marketplace/AI & Agents/Frameworks',
        tags: ['langchain', 'agents', 'python', 'orchestration'],
        aiSummary: 'Framework for building context-aware reasoning applications and multi-agent loops.',
        dateAdded: Date.now() - 86400000 * 8
      },
      {
        id: 'ai-4',
        title: 'LlamaIndex Data Framework for LLMs',
        url: 'https://www.llamaindex.ai',
        folder: 'Marketplace/AI & Agents/RAG',
        tags: ['rag', 'embeddings', 'vector-db', 'search'],
        aiSummary: 'Enterprise data orchestration framework connecting custom data sources to LLMs.',
        dateAdded: Date.now() - 86400000 * 6
      },
      {
        id: 'ai-5',
        title: 'Weights & Biases ML Experiment Tracking',
        url: 'https://wandb.ai',
        folder: 'Marketplace/AI & Agents/MLOps',
        tags: ['mlops', 'evals', 'benchmarks', 'tuning'],
        aiSummary: 'Developer platform to track, compare, and optimize machine learning models.',
        dateAdded: Date.now() - 86400000 * 4
      },
      {
        id: 'ai-6',
        title: 'arXiv Computer Science - AI Section',
        url: 'https://arxiv.org/list/cs.AI/recent',
        folder: 'Marketplace/AI & Agents/Research',
        tags: ['arxiv', 'papers', 'research', 'deep-learning'],
        aiSummary: 'Pre-print research repository for latest breakthrough academic AI papers.',
        dateAdded: Date.now() - 86400000 * 2
      }
    ]
  },
  {
    id: 'pack-dev-fullstack',
    title: 'Full-Stack Modern Dev Stack 2026',
    description: 'The definitive development pack: React 19, Tailwind v4, Vite, Cloud Run, serverless databases, edge runtimes, and TypeScript tools.',
    category: 'Development',
    price: 4.99,
    currency: 'USD',
    author: 'Alex Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    authorTier: 'vendor',
    rating: 4.8,
    reviewsCount: 98,
    clonesCount: 2450,
    bookmarksCount: 5,
    tags: ['react', 'typescript', 'vite', 'fullstack', 'tailwind'],
    featured: true,
    verified: true,
    createdAt: '2026-05-20',
    bookmarks: [
      {
        id: 'dev-1',
        title: 'React 19 Documentation & Server Components',
        url: 'https://react.dev',
        folder: 'Marketplace/Full-Stack/Frontend',
        tags: ['react', 'frontend', 'javascript', 'ui'],
        aiSummary: 'Core guide and interactive tutorial for React 19 hooks and compiler.',
        dateAdded: Date.now() - 86400000 * 15
      },
      {
        id: 'dev-2',
        title: 'Tailwind CSS v4 Modern Utilities',
        url: 'https://tailwindcss.com',
        folder: 'Marketplace/Full-Stack/Styling',
        tags: ['css', 'tailwind', 'styling', 'design-tokens'],
        aiSummary: 'Fast, utility-first CSS framework for modern, responsive component design.',
        dateAdded: Date.now() - 86400000 * 14
      },
      {
        id: 'dev-3',
        title: 'TypeScript Official Handbook & Compiler',
        url: 'https://www.typescriptlang.org',
        folder: 'Marketplace/Full-Stack/Language',
        tags: ['typescript', 'types', 'safety', 'node'],
        aiSummary: 'Typed JavaScript at any scale with strict static type verification.',
        dateAdded: Date.now() - 86400000 * 11
      },
      {
        id: 'dev-4',
        title: 'Vite Next Generation Frontend Tooling',
        url: 'https://vite.dev',
        folder: 'Marketplace/Full-Stack/Bundler',
        tags: ['vite', 'esm', 'bundler', 'dx'],
        aiSummary: 'Lightning fast development server and roll-up production bundler.',
        dateAdded: Date.now() - 86400000 * 9
      },
      {
        id: 'dev-5',
        title: 'Express Node.js Fast Web Framework',
        url: 'https://expressjs.com',
        folder: 'Marketplace/Full-Stack/Backend',
        tags: ['express', 'node', 'api', 'server'],
        aiSummary: 'Minimalist web and API server framework for Node.js environments.',
        dateAdded: Date.now() - 86400000 * 7
      }
    ]
  },
  {
    id: 'pack-startup-growth',
    title: 'YC Founder & Startup Playbook Hub',
    description: 'Hand-picked links for early-stage tech founders: pitch deck teardowns, cap table templates, legal standard docs, and customer discovery kits.',
    category: 'Startup & VC',
    price: 9.99,
    currency: 'USD',
    author: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    authorTier: 'vendor',
    rating: 5.0,
    reviewsCount: 76,
    clonesCount: 1890,
    bookmarksCount: 4,
    tags: ['startup', 'yc', 'fundraising', 'vc', 'pitch-deck'],
    featured: false,
    verified: true,
    createdAt: '2026-07-01',
    bookmarks: [
      {
        id: 'st-1',
        title: 'Y Combinator Startup Library & Esssays',
        url: 'https://www.ycombinator.com/library',
        folder: 'Marketplace/Startup/Guides',
        tags: ['yc', 'advice', 'founders', 'fundraising'],
        aiSummary: 'Comprehensive archive of essays and tactical advice from top startup partners.',
        dateAdded: Date.now() - 86400000 * 20
      },
      {
        id: 'st-2',
        title: 'SAFE Financing Documents - YC Standard',
        url: 'https://www.ycombinator.com/documents',
        folder: 'Marketplace/Startup/Legal',
        tags: ['safe', 'legal', 'contracts', 'investing'],
        aiSummary: 'Industry-standard Simple Agreement for Future Equity legal templates.',
        dateAdded: Date.now() - 86400000 * 18
      },
      {
        id: 'st-3',
        title: 'First Round Review Entrepreneurship Case Studies',
        url: 'https://review.firstround.com',
        folder: 'Marketplace/Startup/Tactics',
        tags: ['hiring', 'product-market-fit', 'management', 'scaling'],
        aiSummary: 'In-depth, actionable playbooks from operators building iconic companies.',
        dateAdded: Date.now() - 86400000 * 16
      },
      {
        id: 'st-4',
        title: 'OpenVC Global Venture Capital Directory',
        url: 'https://www.openvc.app',
        folder: 'Marketplace/Startup/Investors',
        tags: ['investors', 'vc', 'pitching', 'angels'],
        aiSummary: 'Open database of 5,000+ active venture capitalists with direct pitch channels.',
        dateAdded: Date.now() - 86400000 * 13
      }
    ]
  },
  {
    id: 'pack-design-bento',
    title: 'Bento UI & Premium Design Systems Hub',
    description: 'Typography scales, micro-interactions, dark aesthetic references, CSS glow effects, and accessibility palettes for luxury product builders.',
    category: 'Design & UI',
    price: 0,
    currency: 'USD',
    author: 'Kaelen Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    authorTier: 'free',
    rating: 4.9,
    reviewsCount: 64,
    clonesCount: 3100,
    bookmarksCount: 4,
    tags: ['bento', 'design', 'ui', 'typography', 'inspiration'],
    featured: true,
    verified: false,
    createdAt: '2026-06-25',
    bookmarks: [
      {
        id: 'ds-1',
        title: 'Bento Grids UI Design Inspiration',
        url: 'https://bentogrids.com',
        folder: 'Marketplace/Design/Bento',
        tags: ['bento', 'layout', 'inspiration', 'dark-mode'],
        aiSummary: 'Gallery of high-end bento grid UI card compositions and landing pages.',
        dateAdded: Date.now() - 86400000 * 8
      },
      {
        id: 'ds-2',
        title: 'Lucide Clean Vector Icons Library',
        url: 'https://lucide.dev',
        folder: 'Marketplace/Design/Icons',
        tags: ['icons', 'svg', 'lucide', 'react'],
        aiSummary: 'Beautiful, customizable open-source icon suite with React support.',
        dateAdded: Date.now() - 86400000 * 6
      },
      {
        id: 'ds-3',
        title: 'Typescale Visual Modular Font Calculator',
        url: 'https://typescale.com',
        folder: 'Marketplace/Design/Typography',
        tags: ['typography', 'scale', 'fonts', 'ratio'],
        aiSummary: 'Visual typographic scale generator with mathematical progression previews.',
        dateAdded: Date.now() - 86400000 * 5
      },
      {
        id: 'ds-4',
        title: 'Mobbin Mobile & Web UI Flow Archive',
        url: 'https://mobbin.com',
        folder: 'Marketplace/Design/UX-Flows',
        tags: ['mobbin', 'ux', 'flows', 'screenshots'],
        aiSummary: 'World largest real-world app design patterns and user onboarding screens.',
        dateAdded: Date.now() - 86400000 * 3
      }
    ]
  },
  {
    id: 'pack-security-osint',
    title: 'Cybersecurity, Pentesting & Threat Intel',
    description: 'Critical resources for security analysts, penetration testers, and OSINT researchers. Vulnerability databases, CVE feeds, and hardening checklists.',
    category: 'Security',
    price: 14.99,
    currency: 'USD',
    author: 'Marcus "Cipher" Ward',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    authorTier: 'vendor',
    rating: 5.0,
    reviewsCount: 112,
    clonesCount: 1420,
    bookmarksCount: 4,
    tags: ['security', 'infosec', 'osint', 'cve', 'pentest'],
    featured: false,
    verified: true,
    createdAt: '2026-04-18',
    bookmarks: [
      {
        id: 'sec-1',
        title: 'MITRE ATT&CK Enterprise Matrix',
        url: 'https://attack.mitre.org',
        folder: 'Marketplace/Security/Threat-Intel',
        tags: ['mitre', 'tactics', 'threat-intel', 'defense'],
        aiSummary: 'Globally accessible knowledge base of adversary tactics and techniques.',
        dateAdded: Date.now() - 86400000 * 30
      },
      {
        id: 'sec-2',
        title: 'National Vulnerability Database (NVD NIST)',
        url: 'https://nvd.nist.gov',
        folder: 'Marketplace/Security/CVE',
        tags: ['cve', 'vulnerability', 'nist', 'cvss'],
        aiSummary: 'US government repository of standards-based vulnerability management data.',
        dateAdded: Date.now() - 86400000 * 25
      },
      {
        id: 'sec-3',
        title: 'OWASP Top 10 Web Application Security',
        url: 'https://owasp.org/www-project-top-ten',
        folder: 'Marketplace/Security/AppSec',
        tags: ['owasp', 'appsec', 'web', 'vulnerabilities'],
        aiSummary: 'Standard awareness document for developers and web application security.',
        dateAdded: Date.now() - 86400000 * 20
      },
      {
        id: 'sec-4',
        title: 'OSINT Framework Directory',
        url: 'https://osintframework.com',
        folder: 'Marketplace/Security/OSINT',
        tags: ['osint', 'recon', 'investigation', 'tools'],
        aiSummary: 'Structured mind map of free open-source intelligence gathering utilities.',
        dateAdded: Date.now() - 86400000 * 15
      }
    ]
  }
];

export const VIP_EXCLUSIVE_VAULTS: MarketplacePack[] = [
  {
    id: 'vip-dealflow',
    title: 'Confidential VC Term Sheets & Pitch Decks',
    description: 'Private repository of anonymized Series A/B term sheets, cap table models, and winning $10M+ pitch decks across AI, SaaS, and Biotech.',
    category: 'VIP Exclusive',
    price: 0, // Included in VIP subscription
    currency: 'USD',
    author: 'Venture Insider Collective',
    authorTier: 'vip',
    rating: 5.0,
    reviewsCount: 310,
    clonesCount: 5400,
    bookmarksCount: 5,
    tags: ['vip', 'dealflow', 'term-sheets', 'vc', 'pitch-decks'],
    isVipOnly: true,
    featured: true,
    verified: true,
    createdAt: '2026-08-01',
    bookmarks: [
      {
        id: 'vip-1',
        title: 'PitchBook Private Market Analysis',
        url: 'https://pitchbook.com',
        folder: 'VIP Vault/Venture/Market Data',
        tags: ['pitchbook', 'dealflow', 'valuation', 'data'],
        aiSummary: 'Institutional intelligence on venture capital, private equity, and M&A deals.',
        dateAdded: Date.now() - 86400000 * 5
      },
      {
        id: 'vip-2',
        title: 'CB Insights Technology Trends & Unicorn Tracker',
        url: 'https://www.cbinsights.com',
        folder: 'VIP Vault/Venture/Unicorns',
        tags: ['cbinsights', 'unicorn', 'trends', 'emerging-tech'],
        aiSummary: 'Predictive intelligence platform for tech markets and future unicorn valuations.',
        dateAdded: Date.now() - 86400000 * 4
      },
      {
        id: 'vip-3',
        title: 'SEC EDGAR Full-Text Filings & S-1 Prospectuses',
        url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
        folder: 'VIP Vault/Venture/IPO Filings',
        tags: ['sec', 'edgar', 's1', 'financials'],
        aiSummary: 'Official public company filings, 10-K reports, and IPO prospectus documents.',
        dateAdded: Date.now() - 86400000 * 3
      },
      {
        id: 'vip-4',
        title: 'Mattermark Startup Traction Benchmarks',
        url: 'https://mattermark.com',
        folder: 'VIP Vault/Venture/Benchmarks',
        tags: ['growth', 'metrics', 'benchmarks', 'saas'],
        aiSummary: 'Growth and momentum scoring for high-velocity venture-backed companies.',
        dateAdded: Date.now() - 86400000 * 2
      },
      {
        id: 'vip-5',
        title: 'Carta Startup Cap Table & 409A Valuations',
        url: 'https://carta.com',
        folder: 'VIP Vault/Venture/Equity',
        tags: ['equity', 'cap-table', '409a', 'options'],
        aiSummary: 'Equity management infrastructure, secondary liquidity, and valuation workflows.',
        dateAdded: Date.now() - 86400000 * 1
      }
    ]
  },
  {
    id: 'vip-ai-enterprise',
    title: 'Enterprise AI Architecture & Private Prompts',
    description: 'Battle-tested production system prompts, latency-optimized token routing architectures, and fine-tuning datasets from Fortune 500 AI deployments.',
    category: 'VIP Exclusive',
    price: 0,
    currency: 'USD',
    author: 'Principal AI Architects Guild',
    authorTier: 'vip',
    rating: 5.0,
    reviewsCount: 240,
    clonesCount: 4200,
    bookmarksCount: 4,
    tags: ['vip', 'architecture', 'enterprise-ai', 'prompts', 'evals'],
    isVipOnly: true,
    featured: true,
    verified: true,
    createdAt: '2026-07-28',
    bookmarks: [
      {
        id: 'vip-ai-1',
        title: 'Anyscale Ray Distributed Computing Framework',
        url: 'https://www.anyscale.com/ray-open-source',
        folder: 'VIP Vault/Enterprise AI/Distributed',
        tags: ['ray', 'distributed', 'scaling', 'gpu'],
        aiSummary: 'Unified framework for scaling AI and Python applications effortlessly across clusters.',
        dateAdded: Date.now() - 86400000 * 6
      },
      {
        id: 'vip-ai-2',
        title: 'vLLM High-Throughput LLM Serving Engine',
        url: 'https://github.com/vllm-project/vllm',
        folder: 'VIP Vault/Enterprise AI/Inference',
        tags: ['vllm', 'paged-attention', 'inference', 'latency'],
        aiSummary: 'Easy, fast, and cheap LLM serving engine with state-of-the-art PagedAttention.',
        dateAdded: Date.now() - 86400000 * 5
      },
      {
        id: 'vip-ai-3',
        title: 'Arize Phoenix AI Observability & Tracing',
        url: 'https://phoenix.arize.com',
        folder: 'VIP Vault/Enterprise AI/Observability',
        tags: ['observability', 'tracing', 'evals', 'guardrails'],
        aiSummary: 'AI observability platform for tracing LLM applications and detecting hallucination drift.',
        dateAdded: Date.now() - 86400000 * 4
      },
      {
        id: 'vip-ai-4',
        title: 'NVIDIA NeMo Guardrails & Safety Architecture',
        url: 'https://github.com/NVIDIA/NeMo-Guardrails',
        folder: 'VIP Vault/Enterprise AI/Safety',
        tags: ['safety', 'guardrails', 'nvidia', 'compliance'],
        aiSummary: 'Open-source toolkit for adding programmable safety guardrails to LLM-based apps.',
        dateAdded: Date.now() - 86400000 * 2
      }
    ]
  }
];
