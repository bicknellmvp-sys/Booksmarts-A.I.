export interface TopSite {
  id: string;
  name: string;
  url: string;
  category: 
    | 'A.I. & LLMs' 
    | 'Hacking & Security' 
    | 'OSINT & Intelligence' 
    | 'GitHub Top Repos' 
    | 'Message Boards' 
    | 'Q&A & Knowledge' 
    | 'Downloads & FOSS' 
    | 'Productivity' 
    | 'Design & UX' 
    | 'Crypto & Finance' 
    | 'Media & Audio';
  description: string;
  tags: string[];
  suggestedFolder: string;
  similarSites: string[];
  favicon?: string;
  badge?: string;
  isPopular?: boolean;
}

export const TOP_SITES_CATEGORIES = [
  'All Categories',
  'A.I. & LLMs',
  'Hacking & Security',
  'OSINT & Intelligence',
  'GitHub Top Repos',
  'Message Boards',
  'Q&A & Knowledge',
  'Downloads & FOSS',
  'Productivity',
  'Design & UX',
  'Crypto & Finance',
  'Media & Audio'
] as const;

export const TOP_SITES_DIRECTORY: TopSite[] = [
  // ==================== A.I. & LLMs ====================
  {
    id: 'ts-ai-1',
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    category: 'A.I. & LLMs',
    description: 'OpenAI conversational generative AI and reasoning model workspace.',
    tags: ['ai', 'llm', 'chatbot', 'openai'],
    suggestedFolder: 'AI & Machine Learning',
    similarSites: ['Claude', 'Gemini', 'Perplexity'],
    badge: 'TOP 1',
    isPopular: true
  },
  {
    id: 'ts-ai-2',
    name: 'Claude AI',
    url: 'https://claude.ai',
    category: 'A.I. & LLMs',
    description: 'Anthropic next-generation AI assistant with superior reasoning and long-context analysis.',
    tags: ['ai', 'anthropic', 'coding', 'reasoning'],
    suggestedFolder: 'AI & Machine Learning',
    similarSites: ['ChatGPT', 'Gemini', 'Cursor'],
    badge: 'ESSENTIAL',
    isPopular: true
  },
  {
    id: 'ts-ai-3',
    name: 'Google Gemini',
    url: 'https://gemini.google.com',
    category: 'A.I. & LLMs',
    description: 'Multimodal AI assistant built by Google DeepMind with real-time web integration.',
    tags: ['ai', 'google', 'multimodal', 'gemini'],
    suggestedFolder: 'AI & Machine Learning',
    similarSites: ['ChatGPT', 'Claude', 'Perplexity'],
    isPopular: true
  },
  {
    id: 'ts-ai-4',
    name: 'Perplexity AI',
    url: 'https://www.perplexity.ai',
    category: 'A.I. & LLMs',
    description: 'Conversational AI search engine providing real-time sourced citations and deep research.',
    tags: ['ai', 'search', 'research', 'citations'],
    suggestedFolder: 'AI & Machine Learning',
    similarSites: ['Google Search', 'Kagi', 'ChatGPT'],
    badge: 'SEARCH',
    isPopular: true
  },
  {
    id: 'ts-ai-5',
    name: 'Hugging Face',
    url: 'https://huggingface.co',
    category: 'A.I. & LLMs',
    description: 'The premier open-source AI community hub for models, datasets, and ML spaces.',
    tags: ['ai', 'opensource', 'models', 'machine-learning'],
    suggestedFolder: 'AI & Machine Learning/Open Source',
    similarSites: ['Civitai', 'Replicate', 'Ollama'],
    badge: 'HUB',
    isPopular: true
  },
  {
    id: 'ts-ai-6',
    name: 'Cursor AI IDE',
    url: 'https://www.cursor.com',
    category: 'A.I. & LLMs',
    description: 'AI-first code editor designed for pair-programming and full codebase indexing.',
    tags: ['ai', 'editor', 'code', 'developer'],
    suggestedFolder: 'Development/AI Tools',
    similarSites: ['VS Code', 'GitHub Copilot', 'Windsurf'],
    isPopular: true
  },
  {
    id: 'ts-ai-7',
    name: 'Ollama',
    url: 'https://ollama.com',
    category: 'A.I. & LLMs',
    description: 'Run powerful open-source LLMs (Llama 3, DeepSeek, Mistral) locally on your machine.',
    tags: ['ai', 'local-llm', 'terminal', 'offline'],
    suggestedFolder: 'AI & Machine Learning/Local',
    similarSites: ['vLLM', 'LM Studio', 'Hugging Face'],
    badge: 'LOCAL',
    isPopular: true
  },
  {
    id: 'ts-ai-8',
    name: 'Civitai',
    url: 'https://civitai.com',
    category: 'A.I. & LLMs',
    description: 'Open platform for Stable Diffusion and FLUX AI image generation models and LoRAs.',
    tags: ['ai', 'image-gen', 'stable-diffusion', 'art'],
    suggestedFolder: 'AI & Machine Learning/Generative Art',
    similarSites: ['Midjourney', 'Hugging Face'],
    isPopular: true
  },
  {
    id: 'ts-ai-9',
    name: 'Replicate',
    url: 'https://replicate.com',
    category: 'A.I. & LLMs',
    description: 'Run open-source machine learning models via one-line API endpoints in cloud containers.',
    tags: ['ai', 'api', 'cloud', 'hosting'],
    suggestedFolder: 'AI & Machine Learning/Cloud',
    similarSites: ['Together AI', 'Groq'],
    isPopular: false
  },
  {
    id: 'ts-ai-10',
    name: 'Groq Cloud',
    url: 'https://groq.com',
    category: 'A.I. & LLMs',
    description: 'Ultra-fast LPU inference engine running open models at 500+ tokens per second.',
    tags: ['ai', 'speed', 'inference', 'hardware'],
    suggestedFolder: 'AI & Machine Learning/Inference',
    similarSites: ['Ollama', 'Replicate'],
    badge: 'SPEED',
    isPopular: true
  },

  // ==================== Hacking & Cyber Security ====================
  {
    id: 'ts-hack-1',
    name: 'Hack The Box',
    url: 'https://www.hackthebox.com',
    category: 'Hacking & Security',
    description: 'Gamified cybersecurity training platform with real-world vulnerable machines and labs.',
    tags: ['security', 'pentesting', 'ctf', 'learning'],
    suggestedFolder: 'Cybersecurity/Labs',
    similarSites: ['TryHackMe', 'OverTheWire', 'VulnHub'],
    badge: 'TOP LAB',
    isPopular: true
  },
  {
    id: 'ts-hack-2',
    name: 'TryHackMe',
    url: 'https://tryhackme.com',
    category: 'Hacking & Security',
    description: 'Hands-on beginner-to-advanced cybersecurity training through browser-based virtual rooms.',
    tags: ['security', 'education', 'infosec', 'beginner'],
    suggestedFolder: 'Cybersecurity/Training',
    similarSites: ['Hack The Box', 'PortSwigger Academy'],
    isPopular: true
  },
  {
    id: 'ts-hack-3',
    name: 'Exploit Database',
    url: 'https://www.exploit-db.com',
    category: 'Hacking & Security',
    description: 'Official CVE compliant exploit repository and vulnerable software archive by OffSec.',
    tags: ['security', 'exploits', 'cve', 'offsec'],
    suggestedFolder: 'Cybersecurity/Exploits',
    similarSites: ['Shodan', 'Packet Storm', 'OWASP'],
    badge: 'CVE',
    isPopular: true
  },
  {
    id: 'ts-hack-4',
    name: 'PortSwigger Web Security Academy',
    url: 'https://portswigger.net/web-security',
    category: 'Hacking & Security',
    description: 'Free interactive web application security training from the creators of Burp Suite.',
    tags: ['web-security', 'burpsuite', 'owasp', 'appsec'],
    suggestedFolder: 'Cybersecurity/Web Security',
    similarSites: ['OWASP', 'HackerOne', 'Hack The Box'],
    badge: 'FREE ACADEMY',
    isPopular: true
  },
  {
    id: 'ts-hack-5',
    name: 'Shodan',
    url: 'https://www.shodan.io',
    category: 'Hacking & Security',
    description: 'Search engine for Internet-connected devices, servers, routers, and open ports.',
    tags: ['security', 'recon', 'iot', 'scanner'],
    suggestedFolder: 'Cybersecurity/Recon',
    similarSites: ['Censys', 'ZoomEye', 'VirusTotal'],
    badge: 'RECON',
    isPopular: true
  },
  {
    id: 'ts-hack-6',
    name: 'OWASP Foundation',
    url: 'https://owasp.org',
    category: 'Hacking & Security',
    description: 'Open source web application security community, Top 10 vulnerabilities, and cheat sheets.',
    tags: ['security', 'standards', 'owasp-top-10', 'appsec'],
    suggestedFolder: 'Cybersecurity/Standards',
    similarSites: ['PortSwigger Academy', 'NIST'],
    isPopular: true
  },
  {
    id: 'ts-hack-7',
    name: 'HackerOne',
    url: 'https://www.hackerone.com',
    category: 'Hacking & Security',
    description: 'World leading bug bounty platform connecting ethical hackers with global enterprises.',
    tags: ['bug-bounty', 'rewards', 'ethical-hacking'],
    suggestedFolder: 'Cybersecurity/Bug Bounty',
    similarSites: ['Bugcrowd', 'Intigriti'],
    isPopular: true
  },
  {
    id: 'ts-hack-8',
    name: 'OverTheWire Wargames',
    url: 'https://overthewire.org',
    category: 'Hacking & Security',
    description: 'Learn security concepts and Linux command line through progressive gamified wargames.',
    tags: ['linux', 'ssh', 'wargames', 'bash'],
    suggestedFolder: 'Cybersecurity/Practice',
    similarSites: ['UnderTheWire', 'Hack The Box'],
    isPopular: false
  },
  {
    id: 'ts-hack-9',
    name: 'VulnHub',
    url: 'https://www.vulnhub.com',
    category: 'Hacking & Security',
    description: 'Downloadable virtual machine images with intentional vulnerabilities for offline pentesting.',
    tags: ['vms', 'pentest', 'offline-labs'],
    suggestedFolder: 'Cybersecurity/VMs',
    similarSites: ['Hack The Box', 'TryHackMe'],
    isPopular: false
  },
  {
    id: 'ts-hack-10',
    name: 'CyberChef',
    url: 'https://gchq.github.io/CyberChef',
    category: 'Hacking & Security',
    description: 'The Cyber Swiss Army Knife for encoding, decoding, encryption, parsing, and data analysis.',
    tags: ['tool', 'crypto', 'decoder', 'hex', 'gchq'],
    suggestedFolder: 'Cybersecurity/Tools',
    similarSites: ['dcode.fr', 'OSINT Framework'],
    badge: 'SWISS ARMY',
    isPopular: true
  },

  // ==================== OSINT & Intelligence ====================
  {
    id: 'ts-osint-1',
    name: 'OSINT Framework',
    url: 'https://osintframework.com',
    category: 'OSINT & Intelligence',
    description: 'Visual directory tree of hundreds of free OSINT tools, search engines, and intelligence feeds.',
    tags: ['osint', 'directory', 'recon', 'investigation'],
    suggestedFolder: 'OSINT/Frameworks',
    similarSites: ['IntelTechniques', 'Bellingcat'],
    badge: 'ESSENTIAL',
    isPopular: true
  },
  {
    id: 'ts-osint-2',
    name: 'Bellingcat Online Investigation Toolkit',
    url: 'https://www.bellingcat.com/resources',
    category: 'OSINT & Intelligence',
    description: 'Investigation guides, satellite verification tools, and open-source intelligence methods.',
    tags: ['osint', 'journalism', 'satellite', 'verification'],
    suggestedFolder: 'OSINT/Research',
    similarSites: ['IntelTechniques', 'OSINT Framework'],
    isPopular: true
  },
  {
    id: 'ts-osint-3',
    name: 'Wayback Machine (Archive.org)',
    url: 'https://archive.org/web',
    category: 'OSINT & Intelligence',
    description: 'Explore billions of saved historical snapshots of web pages across the last 25+ years.',
    tags: ['osint', 'history', 'archive', 'cache'],
    suggestedFolder: 'OSINT/Archives',
    similarSites: ['Archive.today', 'Google Cache'],
    badge: 'ARCHIVE',
    isPopular: true
  },
  {
    id: 'ts-osint-4',
    name: 'Have I Been Pwned',
    url: 'https://haveibeenpwned.com',
    category: 'OSINT & Intelligence',
    description: 'Check if your email or phone number has been compromised in any public data breach.',
    tags: ['osint', 'breach', 'privacy', 'email'],
    suggestedFolder: 'OSINT/Breach Check',
    similarSites: ['DeHashed', 'Intelligence X'],
    isPopular: true
  },
  {
    id: 'ts-osint-5',
    name: 'Epieos',
    url: 'https://epieos.com',
    category: 'OSINT & Intelligence',
    description: 'Search any email or phone number to discover linked Google accounts, photos, and reviews.',
    tags: ['osint', 'email-recon', 'google-id', 'lookup'],
    suggestedFolder: 'OSINT/Entity Search',
    similarSites: ['Hunter.io', 'OSINT Framework'],
    badge: 'RECON',
    isPopular: true
  },
  {
    id: 'ts-osint-6',
    name: 'Hunter.io',
    url: 'https://hunter.io',
    category: 'OSINT & Intelligence',
    description: 'Find professional email addresses and corporate contact patterns for any domain.',
    tags: ['osint', 'email-finder', 'domains', 'outreach'],
    suggestedFolder: 'OSINT/Email Search',
    similarSites: ['Epieos', 'Anymail finder'],
    isPopular: true
  },
  {
    id: 'ts-osint-7',
    name: 'VirusTotal',
    url: 'https://www.virustotal.com',
    category: 'OSINT & Intelligence',
    description: 'Analyze suspicious files, domains, IPs and URLs to detect malware and security threats.',
    tags: ['security', 'malware', 'scanner', 'ip-lookup'],
    suggestedFolder: 'OSINT/Threat Intelligence',
    similarSites: ['URLScan.io', 'Shodan'],
    badge: 'SCANNER',
    isPopular: true
  },
  {
    id: 'ts-osint-8',
    name: 'URLScan.io',
    url: 'https://urlscan.io',
    category: 'OSINT & Intelligence',
    description: 'Free website scanner that captures DOM snapshots, HTTP transactions, and network graphs.',
    tags: ['osint', 'url-scanner', 'screenshot', 'network'],
    suggestedFolder: 'OSINT/Web Scanners',
    similarSites: ['VirusTotal', 'Shodan'],
    isPopular: false
  },
  {
    id: 'ts-osint-9',
    name: 'Censys Search',
    url: 'https://search.censys.io',
    category: 'OSINT & Intelligence',
    description: 'Attack surface management and certificate inspection for all IPv4 hosts and certificates.',
    tags: ['osint', 'certificates', 'hosts', 'infra'],
    suggestedFolder: 'OSINT/Infrastructure',
    similarSites: ['Shodan', 'crt.sh'],
    isPopular: false
  },
  {
    id: 'ts-osint-10',
    name: 'IntelTechniques',
    url: 'https://inteltechniques.com',
    category: 'OSINT & Intelligence',
    description: 'Michael Bazzell premier OSINT research tools, podcast, and digital privacy guides.',
    tags: ['osint', 'privacy', 'investigation', 'guides'],
    suggestedFolder: 'OSINT/Guides',
    similarSites: ['OSINT Framework', 'Bellingcat'],
    isPopular: false
  },

  // ==================== GitHub Top Repos & Dev Tools ====================
  {
    id: 'ts-dev-1',
    name: 'GitHub Trending Repositories',
    url: 'https://github.com/trending',
    category: 'GitHub Top Repos',
    description: 'See what the open-source community is building today across all programming languages.',
    tags: ['github', 'trending', 'opensource', 'code'],
    suggestedFolder: 'Development/GitHub',
    similarSites: ['Hacker News', 'Product Hunt'],
    badge: 'TRENDING',
    isPopular: true
  },
  {
    id: 'ts-dev-2',
    name: 'Awesome Lists Collection',
    url: 'https://github.com/sindresorhus/awesome',
    category: 'GitHub Top Repos',
    description: 'Curated lists of awesome software, libraries, frameworks, tools, and learning materials.',
    tags: ['github', 'awesome', 'curated', 'resources'],
    suggestedFolder: 'Development/Curated Lists',
    similarSites: ['GitHub Trending', 'DevHints'],
    badge: 'CURATED',
    isPopular: true
  },
  {
    id: 'ts-dev-3',
    name: 'Next.js Framework',
    url: 'https://nextjs.org',
    category: 'GitHub Top Repos',
    description: 'The React framework for the web enabling full-stack fast server-rendered web applications.',
    tags: ['react', 'nextjs', 'typescript', 'frontend'],
    suggestedFolder: 'Development/React',
    similarSites: ['Vite', 'Remix', 'Astro'],
    isPopular: true
  },
  {
    id: 'ts-dev-4',
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    category: 'GitHub Top Repos',
    description: 'A utility-first CSS framework for rapid modern UI development without leaving your HTML.',
    tags: ['css', 'tailwind', 'styling', 'ui'],
    suggestedFolder: 'Development/Design',
    similarSites: ['Shadcn UI', 'Bootstrap'],
    isPopular: true
  },
  {
    id: 'ts-dev-5',
    name: 'Shadcn UI',
    url: 'https://ui.shadcn.com',
    category: 'GitHub Top Repos',
    description: 'Beautifully designed components that you can copy and paste directly into your apps.',
    tags: ['ui', 'react', 'tailwind', 'radix'],
    suggestedFolder: 'Development/UI Libraries',
    similarSites: ['Tailwind CSS', 'MUI', 'Chakra UI'],
    badge: 'HOT',
    isPopular: true
  },
  {
    id: 'ts-dev-6',
    name: 'Supabase',
    url: 'https://supabase.com',
    category: 'GitHub Top Repos',
    description: 'The open-source Firebase alternative with Postgres database, Auth, and Edge Functions.',
    tags: ['backend', 'postgres', 'database', 'auth'],
    suggestedFolder: 'Development/Backend',
    similarSites: ['Firebase', 'PocketBase', 'Appwrite'],
    isPopular: true
  },
  {
    id: 'ts-dev-7',
    name: 'Bun.sh JavaScript Runtime',
    url: 'https://bun.sh',
    category: 'GitHub Top Repos',
    description: 'Incredibly fast all-in-one JavaScript runtime, bundler, test runner, and package manager.',
    tags: ['javascript', 'typescript', 'runtime', 'speed'],
    suggestedFolder: 'Development/Runtimes',
    similarSites: ['Node.js', 'Deno'],
    badge: 'FAST',
    isPopular: true
  },
  {
    id: 'ts-dev-8',
    name: 'Excalidraw',
    url: 'https://excalidraw.com',
    category: 'GitHub Top Repos',
    description: 'Virtual collaborative hand-drawn whiteboard for diagramming architecture and wireframes.',
    tags: ['whiteboard', 'diagrams', 'draw', 'collaboration'],
    suggestedFolder: 'Productivity/Design',
    similarSites: ['Miro', 'Figma', 'tldraw'],
    badge: 'CANVAS',
    isPopular: true
  },
  {
    id: 'ts-dev-9',
    name: 'LangChain',
    url: 'https://www.langchain.com',
    category: 'GitHub Top Repos',
    description: 'Framework for developing context-aware applications powered by LLMs and multi-agents.',
    tags: ['ai', 'llm-framework', 'agents', 'python'],
    suggestedFolder: 'AI & Machine Learning/Frameworks',
    similarSites: ['LlamaIndex', 'AutoGPT'],
    isPopular: true
  },
  {
    id: 'ts-dev-10',
    name: 'Raycast Store & Extensions',
    url: 'https://www.raycast.com',
    category: 'GitHub Top Repos',
    description: 'Blazingly fast, extendable launcher that lets you control your tools in a few keystrokes.',
    tags: ['launcher', 'productivity', 'mac', 'extensions'],
    suggestedFolder: 'Productivity/Launchers',
    similarSites: ['Alfred', 'CommandBar'],
    isPopular: true
  },

  // ==================== Message Boards & Forums ====================
  {
    id: 'ts-forum-1',
    name: 'Hacker News (Y Combinator)',
    url: 'https://news.ycombinator.com',
    category: 'Message Boards',
    description: 'Minimalist tech, startup, and engineering discussion board curated by the Silicon Valley community.',
    tags: ['tech', 'startups', 'programming', 'news'],
    suggestedFolder: 'Forums & News/Tech',
    similarSites: ['Lobste.rs', 'Reddit /r/programming', 'Dev.to'],
    badge: 'DAILY MUST',
    isPopular: true
  },
  {
    id: 'ts-forum-2',
    name: 'Reddit',
    url: 'https://www.reddit.com',
    category: 'Message Boards',
    description: 'The front page of the internet with millions of niche communities and interest subreddits.',
    tags: ['community', 'discussion', 'subreddits', 'news'],
    suggestedFolder: 'Forums & News/General',
    similarSites: ['Hacker News', 'Lemmy', 'Discord'],
    isPopular: true
  },
  {
    id: 'ts-forum-3',
    name: 'Lobste.rs',
    url: 'https://lobste.rs',
    category: 'Message Boards',
    description: 'High signal-to-noise computing and software engineering discussion community.',
    tags: ['programming', 'computing', 'systems', 'cs'],
    suggestedFolder: 'Forums & News/Tech',
    similarSites: ['Hacker News', 'Reddit'],
    badge: 'SIGNAL',
    isPopular: true
  },
  {
    id: 'ts-forum-4',
    name: 'Dev.to Community',
    url: 'https://dev.to',
    category: 'Message Boards',
    description: 'Constructive and inclusive social network for software developers to share articles and tips.',
    tags: ['blogging', 'tutorials', 'developers', 'community'],
    suggestedFolder: 'Forums & News/Dev',
    similarSites: ['Hashnode', 'Medium'],
    isPopular: true
  },
  {
    id: 'ts-forum-5',
    name: 'Lemmy Federation',
    url: 'https://join-lemmy.org',
    category: 'Message Boards',
    description: 'Federated, open-source alternative to Reddit powered by ActivityPub protocol.',
    tags: ['fediverse', 'opensource', 'reddit-alt', 'privacy'],
    suggestedFolder: 'Forums & News/Fediverse',
    similarSites: ['Reddit', 'Mastodon'],
    isPopular: false
  },
  {
    id: 'ts-forum-6',
    name: 'XDA Developers Forum',
    url: 'https://xdaforums.com',
    category: 'Message Boards',
    description: 'The famous mobile developers and Android modding, ROMs, and hardware tweaking forum.',
    tags: ['android', 'hardware', 'mods', 'roms'],
    suggestedFolder: 'Forums & News/Hardware',
    similarSites: ['Reddit /r/android', 'GitHub'],
    isPopular: true
  },
  {
    id: 'ts-forum-7',
    name: 'Product Hunt',
    url: 'https://www.producthunt.com',
    category: 'Message Boards',
    description: 'The place to discover the best new products in tech, software, and AI launched every day.',
    tags: ['startups', 'launches', 'products', 'reviews'],
    suggestedFolder: 'Forums & News/Launches',
    similarSites: ['Hacker News', 'Indie Hackers'],
    isPopular: true
  },
  {
    id: 'ts-forum-8',
    name: 'Indie Hackers',
    url: 'https://www.indiehackers.com',
    category: 'Message Boards',
    description: 'Community of bootstrapped founders sharing revenue numbers, strategies, and growth.',
    tags: ['saas', 'bootstrap', 'business', 'startups'],
    suggestedFolder: 'Forums & News/Business',
    similarSites: ['Product Hunt', 'Hacker News'],
    isPopular: true
  },

  // ==================== Q&A & Knowledge ====================
  {
    id: 'ts-qa-1',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    category: 'Q&A & Knowledge',
    description: 'The world largest knowledge base and Q&A platform for professional and enthusiast programmers.',
    tags: ['coding', 'qa', 'debugging', 'solutions'],
    suggestedFolder: 'Reference/Programming',
    similarSites: ['Super User', 'GitHub Discussions'],
    badge: 'ORIGINAL',
    isPopular: true
  },
  {
    id: 'ts-qa-2',
    name: 'Super User',
    url: 'https://superuser.com',
    category: 'Q&A & Knowledge',
    description: 'Q&A for computer enthusiasts and power users (OS configuration, command line, hardware).',
    tags: ['sysadmin', 'hardware', 'windows', 'macos', 'linux'],
    suggestedFolder: 'Reference/SysAdmin',
    similarSites: ['Server Fault', 'Stack Overflow'],
    isPopular: true
  },
  {
    id: 'ts-qa-3',
    name: 'Wolfram Alpha',
    url: 'https://www.wolframalpha.com',
    category: 'Q&A & Knowledge',
    description: 'Computational intelligence engine calculating answers for mathematics, physics, and science.',
    tags: ['math', 'science', 'computation', 'data'],
    suggestedFolder: 'Reference/Science',
    similarSites: ['Wikipedia', 'arXiv'],
    badge: 'MATH',
    isPopular: true
  },
  {
    id: 'ts-qa-4',
    name: 'Wikipedia',
    url: 'https://www.wikipedia.org',
    category: 'Q&A & Knowledge',
    description: 'The free encyclopedia with tens of millions of collaboratively edited articles in 300+ languages.',
    tags: ['encyclopedia', 'knowledge', 'history', 'science'],
    suggestedFolder: 'Reference/General',
    similarSites: ['Wolfram Alpha', 'Britannica'],
    isPopular: true
  },
  {
    id: 'ts-qa-5',
    name: 'arXiv Research Repository',
    url: 'https://arxiv.org',
    category: 'Q&A & Knowledge',
    description: 'Open-access archive for 2+ million scholarly preprints in Physics, Mathematics, CS, and AI.',
    tags: ['papers', 'academic', 'research', 'cs-ai'],
    suggestedFolder: 'Reference/Research Papers',
    similarSites: ['Papers With Code', 'Semantic Scholar'],
    badge: 'ACADEMIC',
    isPopular: true
  },
  {
    id: 'ts-qa-6',
    name: 'Papers With Code',
    url: 'https://paperswithcode.com',
    category: 'Q&A & Knowledge',
    description: 'Browse state-of-the-art machine learning research papers linked directly to open GitHub code.',
    tags: ['machine-learning', 'benchmarks', 'code', 'sota'],
    suggestedFolder: 'Reference/ML Research',
    similarSites: ['arXiv', 'Hugging Face'],
    isPopular: true
  },
  {
    id: 'ts-qa-7',
    name: 'Kaggle',
    url: 'https://www.kaggle.com',
    category: 'Q&A & Knowledge',
    description: 'Data science competition platform with thousands of public datasets and Jupyter notebook code.',
    tags: ['data-science', 'datasets', 'python', 'competitions'],
    suggestedFolder: 'Reference/Data Science',
    similarSites: ['Hugging Face', 'Google Colab'],
    isPopular: true
  },

  // ==================== Downloads & FOSS ====================
  {
    id: 'ts-down-1',
    name: 'AlternativeTo',
    url: 'https://alternativeto.net',
    category: 'Downloads & FOSS',
    description: 'Crowdsourced recommendations for software alternatives, open-source substitutes, and apps.',
    tags: ['software', 'alternatives', 'foss', 'apps'],
    suggestedFolder: 'Software & Tools/Recommendations',
    similarSites: ['SourceForge', 'GitHub'],
    badge: 'MUST HAVE',
    isPopular: true
  },
  {
    id: 'ts-down-2',
    name: 'F-Droid Free App Store',
    url: 'https://f-droid.org',
    category: 'Downloads & FOSS',
    description: 'Installable catalogue of FOSS (Free and Open Source Software) applications for Android.',
    tags: ['android', 'foss', 'privacy', 'open-source'],
    suggestedFolder: 'Software & Tools/Mobile FOSS',
    similarSites: ['AlternativeTo', 'Flathub'],
    isPopular: true
  },
  {
    id: 'ts-down-3',
    name: 'Flathub Linux Store',
    url: 'https://flathub.org',
    category: 'Downloads & FOSS',
    description: 'The app store and build service for Linux applications packaged via Flatpak sandbox.',
    tags: ['linux', 'flatpak', 'apps', 'desktop'],
    suggestedFolder: 'Software & Tools/Linux Apps',
    similarSites: ['Snapcraft', 'AppImageHub'],
    isPopular: true
  },
  {
    id: 'ts-down-4',
    name: 'Ninite Multi-Installer',
    url: 'https://ninite.com',
    category: 'Downloads & FOSS',
    description: 'Install and update multiple Windows applications at once without toolbars or junkware.',
    tags: ['windows', 'installer', 'automation', 'utilities'],
    suggestedFolder: 'Software & Tools/Windows',
    similarSites: ['Winget', 'Chocolatey'],
    badge: 'CLEAN',
    isPopular: true
  },
  {
    id: 'ts-down-5',
    name: 'SourceForge',
    url: 'https://sourceforge.net',
    category: 'Downloads & FOSS',
    description: 'Open source software hub hosting tens of thousands of free developer tools and projects.',
    tags: ['foss', 'downloads', 'mirrors', 'repos'],
    suggestedFolder: 'Software & Tools/Repositories',
    similarSites: ['GitHub', 'F-Droid'],
    isPopular: false
  },
  {
    id: 'ts-down-6',
    name: 'PortableApps',
    url: 'https://portableapps.com',
    category: 'Downloads & FOSS',
    description: 'Carry your favorite software on a USB flash drive without local installation requirements.',
    tags: ['portable', 'usb', 'utilities', 'windows'],
    suggestedFolder: 'Software & Tools/Portable',
    similarSites: ['Ninite', 'AlternativeTo'],
    isPopular: false
  },

  // ==================== Productivity ====================
  {
    id: 'ts-prod-1',
    name: 'Notion',
    url: 'https://www.notion.so',
    category: 'Productivity',
    description: 'All-in-one connected workspace for wikis, docs, project management, and AI notes.',
    tags: ['notes', 'wiki', 'projects', 'docs'],
    suggestedFolder: 'Productivity/Workspaces',
    similarSites: ['Obsidian', 'Linear', 'Craft'],
    badge: 'POPULAR',
    isPopular: true
  },
  {
    id: 'ts-prod-2',
    name: 'Linear',
    url: 'https://linear.app',
    category: 'Productivity',
    description: 'The purposeful issue tracking tool designed for high-performance software engineering teams.',
    tags: ['project-management', 'issues', 'scrum', 'speed'],
    suggestedFolder: 'Productivity/Issue Trackers',
    similarSites: ['Jira', 'GitHub Projects'],
    badge: 'FAST',
    isPopular: true
  },
  {
    id: 'ts-prod-3',
    name: 'Obsidian Note-Taking',
    url: 'https://obsidian.md',
    category: 'Productivity',
    description: 'Sharpen your thinking with local-first Markdown files connected in a visual knowledge graph.',
    tags: ['markdown', 'local-first', 'pkm', 'second-brain'],
    suggestedFolder: 'Productivity/Notes',
    similarSites: ['Notion', 'Logseq', 'Bear'],
    badge: 'LOCAL',
    isPopular: true
  },
  {
    id: 'ts-prod-4',
    name: 'Figma',
    url: 'https://www.figma.com',
    category: 'Productivity',
    description: 'The collaborative interface design and prototyping tool for modern product teams.',
    tags: ['design', 'ui', 'prototyping', 'collaboration'],
    suggestedFolder: 'Productivity/Design Tools',
    similarSites: ['Miro', 'Sketch'],
    isPopular: true
  },
  {
    id: 'ts-prod-5',
    name: 'Miro Visual Workspace',
    url: 'https://miro.com',
    category: 'Productivity',
    description: 'Infinite visual canvas for brainstorming, sprint planning, and team retrospectives.',
    tags: ['whiteboard', 'brainstorm', 'diagrams'],
    suggestedFolder: 'Productivity/Whiteboards',
    similarSites: ['Excalidraw', 'Figma Jam'],
    isPopular: true
  },

  // ==================== Design & UX ====================
  {
    id: 'ts-des-1',
    name: 'Dribbble',
    url: 'https://dribbble.com',
    category: 'Design & UX',
    description: 'Discover the world top designers and creative design portfolios for web, mobile, and illustration.',
    tags: ['design', 'portfolio', 'ui-ux', 'inspiration'],
    suggestedFolder: 'Design/Inspiration',
    similarSites: ['Behance', 'Mobbin', 'Awwwards'],
    isPopular: true
  },
  {
    id: 'ts-des-2',
    name: 'Mobbin',
    url: 'https://mobbin.com',
    category: 'Design & UX',
    description: 'The world largest real-world mobile and web UI & UX patterns design archive.',
    tags: ['ui-patterns', 'mobile-ui', 'screenshots', 'flows'],
    suggestedFolder: 'Design/UI Patterns',
    similarSites: ['Dribbble', 'Page Flows'],
    badge: 'PATTERNS',
    isPopular: true
  },
  {
    id: 'ts-des-3',
    name: 'Awwwards',
    url: 'https://www.awwwards.com',
    category: 'Design & UX',
    description: 'Website awards recognizing the talent and effort of the world best web designers and developers.',
    tags: ['web-design', 'awards', 'creativity', 'showcase'],
    suggestedFolder: 'Design/Web Awards',
    similarSites: ['Siteinspire', 'FWA'],
    isPopular: true
  },
  {
    id: 'ts-des-4',
    name: 'Iconify',
    url: 'https://iconify.design',
    category: 'Design & UX',
    description: 'Unified open source icon framework with 200,000+ vector SVG icons ready to copy.',
    tags: ['icons', 'svg', 'vectors', 'ui-assets'],
    suggestedFolder: 'Design/Icons',
    similarSites: ['Lucide Icons', 'FontAwesome'],
    isPopular: true
  },
  {
    id: 'ts-des-5',
    name: 'Unsplash',
    url: 'https://unsplash.com',
    category: 'Design & UX',
    description: 'High quality royalty-free photography and imagery contributed by a global community.',
    tags: ['photos', 'stock', 'free-images', 'wallpapers'],
    suggestedFolder: 'Design/Photography',
    similarSites: ['Pexels', 'Pixabay'],
    isPopular: true
  },

  // ==================== Crypto & Finance ====================
  {
    id: 'ts-cryp-1',
    name: 'TradingView',
    url: 'https://www.tradingview.com',
    category: 'Crypto & Finance',
    description: 'Advanced financial charting platform and social network for traders and market analysts.',
    tags: ['charts', 'stocks', 'crypto', 'forex', 'indicators'],
    suggestedFolder: 'Finance & Markets/Charts',
    similarSites: ['Finviz', 'Yahoo Finance'],
    badge: 'CHARTS',
    isPopular: true
  },
  {
    id: 'ts-cryp-2',
    name: 'CoinGecko',
    url: 'https://www.coingecko.com',
    category: 'Crypto & Finance',
    description: 'Independent digital currency data provider tracking prices, volumes, and market cap.',
    tags: ['crypto', 'market-cap', 'tokens', 'defi'],
    suggestedFolder: 'Finance & Markets/Crypto',
    similarSites: ['CoinMarketCap', 'DexScreener'],
    isPopular: true
  },
  {
    id: 'ts-cryp-3',
    name: 'DexScreener',
    url: 'https://dexscreener.com',
    category: 'Crypto & Finance',
    description: 'Real-time DEX analytics, candlestick charts, and liquidity tracking across 80+ blockchains.',
    tags: ['dex', 'tokens', 'liquidity', 'realtime'],
    suggestedFolder: 'Finance & Markets/DEX',
    similarSites: ['DEXTools', 'DefiLlama'],
    badge: 'LIVE DEX',
    isPopular: true
  },
  {
    id: 'ts-cryp-4',
    name: 'DefiLlama',
    url: 'https://defillama.com',
    category: 'Crypto & Finance',
    description: 'Open and transparent DeFi analytics tracking total value locked (TVL), fees, and yields.',
    tags: ['defi', 'tvl', 'yields', 'blockchain'],
    suggestedFolder: 'Finance & Markets/DeFi Analytics',
    similarSites: ['Dune Analytics', 'Etherscan'],
    badge: 'TVL',
    isPopular: true
  },
  {
    id: 'ts-cryp-5',
    name: 'Finviz Stock Screener',
    url: 'https://finviz.com',
    category: 'Crypto & Finance',
    description: 'Visual stock market screener with interactive heatmaps, insider trading, and fundamental filters.',
    tags: ['stocks', 'screener', 'heatmap', 'investing'],
    suggestedFolder: 'Finance & Markets/Stocks',
    similarSites: ['TradingView', 'Yahoo Finance'],
    isPopular: true
  },

  // ==================== Media & Audio ====================
  {
    id: 'ts-med-1',
    name: 'Radio Garden',
    url: 'https://radio.garden',
    category: 'Media & Audio',
    description: 'Explore live radio stations around the globe by spinning an interactive 3D globe.',
    tags: ['radio', 'world', 'globe', 'ambient', 'music'],
    suggestedFolder: 'Entertainment/Music & Audio',
    similarSites: ['SomaFM', 'Spotify'],
    badge: '3D GLOBE',
    isPopular: true
  },
  {
    id: 'ts-med-2',
    name: 'SomaFM Ambient Radio',
    url: 'https://somafm.com',
    category: 'Media & Audio',
    description: 'Listener-supported, commercial-free underground internet radio streaming ambient, groove, and chill.',
    tags: ['ambient', 'chillout', 'lofi', 'focus'],
    suggestedFolder: 'Entertainment/Ambient',
    similarSites: ['Radio Garden', 'SoundCloud'],
    isPopular: true
  },
  {
    id: 'ts-med-3',
    name: 'Bandcamp',
    url: 'https://bandcamp.com',
    category: 'Media & Audio',
    description: 'Discover extraordinary music and directly support independent artists across all genres.',
    tags: ['indie-music', 'vinyl', 'artists', 'audio'],
    suggestedFolder: 'Entertainment/Indie',
    similarSites: ['SoundCloud', 'Spotify'],
    isPopular: true
  }
];
