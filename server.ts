import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Main Bookmark Categorization Endpoint
  app.post('/api/categorize', async (req, res) => {
    try {
      const { bookmarks, customInstructions, depth = 'nested', maxFolders = 8 } = req.body;

      if (!bookmarks || !Array.isArray(bookmarks) || bookmarks.length === 0) {
        return res.status(400).json({ error: 'No bookmarks provided for categorization.' });
      }

      const ai = getGeminiClient();

      // Format bookmarks for prompt to keep tokens efficient
      const formattedBookmarks = bookmarks.map((b: any, idx: number) => ({
        id: b.id || `bm-${idx}`,
        title: b.title || b.url,
        url: b.url,
        currentFolder: b.folder || 'Unsorted'
      }));

      const systemPrompt = `You are an expert AI browser bookmark organizer and taxonomist.
Your job is to analyze a list of web bookmarks (titles, URLs, and current folders) and categorize them into a clean, logical, human-friendly folder taxonomy.

Guidelines:
1. Category/Folder Naming:
   - If depth is 'nested', use hierarchical paths separated by forward slashes like: "Development/Frontend", "Development/AI & ML", "Design/Inspiration", "Life/Recipes & Cooking", "Finance/Investing", "Reading/Essays", "Travel/Trips".
   - If depth is 'flat', use single-level categories like "Development", "Design", "Recipes", "Finance", "AI Tools", "Reading".
   - Keep folder names clean, professional, concise, and intuitive.
   - Do NOT create single-item trivial folders unless logically distinct; group related links together.
2. Custom Instructions:
   - If the user provides specific instructions (e.g. "Separate work and personal", "Group by programming language", "Keep only 5 folders"), prioritize them strictly.
3. For each bookmark:
   - Assign the best target folder path.
   - Extract 2-4 clean, lowercase tags (e.g. ["css", "frontend", "docs"]).
   - Provide a 1-sentence helpful summary of what this website or resource is.
   - Provide confidence score (0-100).
4. Identify duplicate or near-duplicate bookmarks (e.g. same URL with different tracking query params).`;

      const userPrompt = `Here are the ${formattedBookmarks.length} bookmarks to categorize:
${JSON.stringify(formattedBookmarks, null, 2)}

Parameters:
- Depth style: ${depth}
- Target max top-level folders: ~${maxFolders}
- User Custom Instructions: ${customInstructions ? `"${customInstructions}"` : 'Organize logically by domain/topic/purpose.'}

Please return the structured categorization JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              folders: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of all created folder paths'
              },
              explanation: {
                type: Type.STRING,
                description: 'Brief 1-2 sentence overview of how the bookmarks were categorized'
              },
              results: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    folder: { type: Type.STRING, description: 'Target folder path, e.g. Development/Frontend' },
                    tags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Relevant tags'
                    },
                    summary: { type: Type.STRING, description: 'One sentence description of the site' },
                    confidence: { type: Type.NUMBER, description: 'Confidence 0-100' }
                  },
                  required: ['id', 'folder', 'tags', 'summary', 'confidence']
                }
              },
              duplicates: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    duplicateWithId: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['id', 'duplicateWithId', 'reason']
                },
                description: 'Any identified duplicate or redundant links'
              }
            },
            required: ['folders', 'explanation', 'results']
          }
        }
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json(parsedData);
    } catch (error: any) {
      console.error('Gemini categorization error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to categorize bookmarks with Gemini AI.'
      });
    }
  });

  // Suggest Prompt/Folder Taxonomies
  app.post('/api/suggest-taxonomies', async (req, res) => {
    try {
      const { bookmarks } = req.body;
      const ai = getGeminiClient();

      const sampleUrls = (bookmarks || []).slice(0, 20).map((b: any) => b.title + ' (' + b.url + ')');

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Analyze these sample bookmarks:
${sampleUrls.join('\n')}

Suggest 4 smart, creative instruction presets the user might want to click to organize their bookmarks (e.g. "Organize by Engineering vs Design vs Reading", "Create a Clean 5-Folder Minimalist Structure", etc.).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                    icon: { type: Type.STRING }
                  },
                  required: ['label', 'prompt']
                }
              }
            },
            required: ['suggestions']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (e: any) {
      console.error('Suggest error:', e);
      return res.json({
        suggestions: [
          { label: 'Work vs Personal', prompt: 'Separate tech development and work projects from recipes, travel, and personal hobbies' },
          { label: 'Deep Tech Hierarchy', prompt: 'Create nested folders by tech stack: Frontend, AI/ML, DevOps, and Backend' },
          { label: 'Minimalist 5-Folder', prompt: 'Group all bookmarks into exactly 5 broad, tidy categories with smart tags' },
          { label: 'Action-Oriented', prompt: 'Organize into To Read, Daily Tools, Reference & Docs, and Inspiration' }
        ]
      });
    }
  });

  // Dedicated AI Auto-Tagging Endpoint for single or batch bookmarks
  app.post('/api/auto-tag', async (req, res) => {
    try {
      const { bookmarks } = req.body;
      if (!bookmarks || !Array.isArray(bookmarks) || bookmarks.length === 0) {
        return res.status(400).json({ error: 'No bookmarks provided for auto-tagging.' });
      }

      const ai = getGeminiClient();
      const inputItems = bookmarks.map((b: any, idx: number) => ({
        id: b.id || `bm-${idx}`,
        title: b.title || b.url,
        url: b.url,
        folder: b.folder || 'Unsorted'
      }));

      const prompt = `You are a high-precision browser bookmark metadata tagger.
Analyze the following bookmark(s) and generate 3 to 6 high-value, lowercase, concise semantic tags for each (e.g. "react", "typescript", "ui-design", "investing", "recipes", "ai-agents", "docs").
Also generate a crisp 1-sentence description summary for each website.

Bookmarks:
${JSON.stringify(inputItems, null, 2)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              taggedBookmarks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    tags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: '3-6 lowercase tags'
                    },
                    summary: { type: Type.STRING, description: '1-sentence site description' },
                    suggestedFolder: { type: Type.STRING, description: 'Optional suggested folder path' }
                  },
                  required: ['id', 'tags', 'summary']
                }
              }
            },
            required: ['taggedBookmarks']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{"taggedBookmarks":[]}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Auto-tag error:', error);
      // Fallback rule-based tagging if Gemini is offline
      const fallback = (req.body.bookmarks || []).map((b: any) => {
        const u = (b.url || '').toLowerCase();
        const t = (b.title || '').toLowerCase();
        const tags: string[] = [];
        if (u.includes('github') || t.includes('repo')) tags.push('code', 'open-source');
        if (u.includes('react') || t.includes('react')) tags.push('react', 'frontend');
        if (u.includes('tailwind') || t.includes('css')) tags.push('css', 'design');
        if (u.includes('ai') || u.includes('openai') || t.includes('ai')) tags.push('ai', 'tools');
        if (u.includes('google') || u.includes('docs')) tags.push('reference', 'docs');
        if (tags.length === 0) tags.push('resource', 'web');
        return {
          id: b.id,
          tags: Array.from(new Set(tags)),
          summary: `Resource for ${b.title || b.url}`
        };
      });
      return res.json({ taggedBookmarks: fallback });
    }
  });

  // URL Link Health Checker Endpoint
  app.post('/api/check-links', async (req, res) => {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'No items provided to check.' });
      }

      // Check each URL with HEAD/GET and a 6-second timeout
      const checkSingleUrl = async (item: { id: string; url: string }) => {
        const { id, url } = item;

        // Basic URL validation
        if (!url || typeof url !== 'string') {
          return {
            id,
            url,
            status: 'broken' as const,
            statusCode: 0,
            error: 'Invalid or missing URL format',
            checkedAt: Date.now()
          };
        }

        // Handle internal / mock URLs (e.g. localhost or custom scheme)
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return {
            id,
            url,
            status: 'broken' as const,
            statusCode: 0,
            error: 'Unsupported protocol (only http/https supported)',
            checkedAt: Date.now()
          };
        }

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          let response: Response;
          try {
            // Try HEAD request first for fast header check
            response = await fetch(url, {
              method: 'HEAD',
              signal: controller.signal,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 AI-Bookmark-Checker/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
              },
              redirect: 'follow'
            });
          } catch (headErr) {
            // Some servers reject HEAD requests (405 or connection reset). Fallback to GET with small byte range
            const getController = new AbortController();
            const getTimeout = setTimeout(() => getController.abort(), 6000);
            try {
              response = await fetch(url, {
                method: 'GET',
                signal: getController.signal,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 AI-Bookmark-Checker/1.0',
                  'Range': 'bytes=0-1024'
                },
                redirect: 'follow'
              });
            } finally {
              clearTimeout(getTimeout);
            }
          } finally {
            clearTimeout(timeoutId);
          }

          const statusCode = response.status;

          // 200-399 or 403/401 (server exists and responded, often bot blocked by Cloudflare/WAF)
          if (statusCode >= 200 && statusCode < 400) {
            return {
              id,
              url,
              status: 'healthy' as const,
              statusCode,
              checkedAt: Date.now()
            };
          } else if (statusCode === 401 || statusCode === 403) {
            // Auth required or bot protection (e.g. Cloudflare / Medium) -> site is online and active!
            return {
              id,
              url,
              status: 'healthy' as const,
              statusCode,
              error: `Protected (${statusCode}) - Domain reachable`,
              checkedAt: Date.now()
            };
          } else if (statusCode === 404 || statusCode === 410) {
            return {
              id,
              url,
              status: 'broken' as const,
              statusCode,
              error: statusCode === 404 ? 'Page Not Found (404)' : 'Gone / Removed (410)',
              checkedAt: Date.now()
            };
          } else if (statusCode >= 500) {
            return {
              id,
              url,
              status: 'unreachable' as const,
              statusCode,
              error: `Server Error (${statusCode})`,
              checkedAt: Date.now()
            };
          } else {
            return {
              id,
              url,
              status: 'broken' as const,
              statusCode,
              error: `HTTP Error ${statusCode}`,
              checkedAt: Date.now()
            };
          }
        } catch (fetchError: any) {
          const errMsg = fetchError?.name === 'AbortError' 
            ? 'Connection timed out (Host unreachable)' 
            : (fetchError?.message || 'Host connection failed / DNS unresolved');

          return {
            id,
            url,
            status: 'unreachable' as const,
            statusCode: 0,
            error: errMsg,
            checkedAt: Date.now()
          };
        }
      };

      // Process in chunks of 8 to avoid overwhelming the server network
      const results: any[] = [];
      const chunkSize = 8;
      for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const chunkResults = await Promise.all(chunk.map(checkSingleUrl));
        results.push(...chunkResults);
      }

      return res.json({
        checkedCount: results.length,
        results
      });
    } catch (err: any) {
      console.error('Check links error:', err);
      return res.status(500).json({ error: err.message || 'Internal link check error' });
    }
  });

  // Vite development middleware vs Static Production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Bookmark Organizer server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
