import JSZip from 'jszip';

export interface ExtensionFile {
  name: string;
  path: string;
  content: string;
  description: string;
}

export function getExtensionFiles(apiBaseUrl: string = ''): ExtensionFile[] {
  const backendUrl = apiBaseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

  const manifestJson = JSON.stringify(
    {
      manifest_version: 3,
      name: "AI Bookmark Organizer",
      version: "1.0.0",
      description: "Automatically scan and organize browser bookmarks into smart folders using Gemini AI.",
      permissions: [
        "bookmarks",
        "storage",
        "sidePanel",
        "activeTab",
        "contextMenus"
      ],
      host_permissions: [
        "*://*/*"
      ],
      action: {
        default_popup: "popup.html",
        default_title: "AI Bookmark Organizer"
      },
      side_panel: {
        default_path: "sidepanel.html"
      },
      background: {
        service_worker: "background.js"
      },
      icons: {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      }
    },
    null,
    2
  );

  const backgroundJs = `// AI Bookmark Organizer - Background Service Worker (Manifest V3)
chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Bookmark Organizer Extension Installed");

  // Create context menu for quick-adding current page or folder
  chrome.contextMenus.create({
    id: "ai-organize-tab",
    title: "AI Categorize & Bookmark Current Tab",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "open-side-panel",
    title: "Open AI Bookmark Organizer Panel",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "open-side-panel" && tab?.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  } else if (info.menuItemId === "ai-organize-tab" && tab) {
    chrome.tabs.sendMessage(tab.id, { action: "quick-bookmark" });
  }
});
`;

  const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Bookmark Organizer</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      width: 380px;
      min-height: 520px;
      background: #0f172a;
      color: #f8fafc;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
      padding-bottom: 12px;
    }
    .logo-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
    }
    .title {
      font-size: 15px;
      font-weight: 700;
      color: #f8fafc;
    }
    .subtitle {
      font-size: 11px;
      color: #94a3b8;
    }
    .stats-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 12px 14px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .stat-box {
      display: flex;
      flex-direction: column;
    }
    .stat-num {
      font-size: 20px;
      font-weight: 700;
      color: #38bdf8;
    }
    .stat-lbl {
      font-size: 11px;
      color: #94a3b8;
    }
    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: #cbd5e1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .scope-select {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .scope-btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 8px 10px;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }
    .scope-btn.active {
      background: rgba(99, 102, 241, 0.2);
      border-color: #6366f1;
      color: #818cf8;
      font-weight: 600;
    }
    .prompt-box {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 10px;
      color: #f8fafc;
      font-size: 12px;
      width: 100%;
      resize: vertical;
      min-height: 56px;
      outline: none;
    }
    .prompt-box:focus {
      border-color: #6366f1;
    }
    .action-btn {
      background: linear-gradient(135deg, #4f46e5, #9333ea);
      border: none;
      color: white;
      padding: 12px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
      transition: all 0.2s;
    }
    .action-btn:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }
    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .status-area {
      background: #1e293b;
      border-radius: 8px;
      padding: 10px;
      font-size: 12px;
      color: #94a3b8;
      min-height: 60px;
      border: 1px solid #334155;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      background: #334155;
      color: #38bdf8;
    }
    .footer {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid #334155;
      padding-top: 10px;
    }
    .footer a {
      color: #818cf8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-group">
      <div class="logo-icon">★</div>
      <div>
        <div class="title">AI Bookmark Organizer</div>
        <div class="subtitle">Powered by Gemini AI</div>
      </div>
    </div>
    <span class="badge" id="ext-status">Ready</span>
  </div>

  <div class="stats-card">
    <div class="stat-box">
      <span class="stat-num" id="total-bookmarks">0</span>
      <span class="stat-lbl">Total Bookmarks</span>
    </div>
    <div class="stat-box">
      <span class="stat-num" id="unsorted-bookmarks">0</span>
      <span class="stat-lbl">Unsorted / Messy</span>
    </div>
  </div>

  <div>
    <div class="section-title">Scan Scope</div>
    <div class="scope-select">
      <button class="scope-btn active" id="scope-all">Scan All Bookmarks</button>
      <button class="scope-btn" id="scope-unsorted">Scan Unsorted Only</button>
    </div>
  </div>

  <div>
    <div class="section-title">Custom Instructions (Optional)</div>
    <textarea class="prompt-box" id="instructions" placeholder="e.g. Group by tech stacks, separate work and cooking recipes, max 6 folders..."></textarea>
  </div>

  <button class="action-btn" id="btn-organize">
    <span>✨ Scan & Reorganize with AI</span>
  </button>

  <div class="status-area" id="status-box">
    <div>Ready to analyze bookmarks and create smart folders.</div>
  </div>

  <div class="footer">
    <a href="#" id="open-full-dashboard">Open Full Dashboard</a>
    <span>v1.0.0</span>
  </div>

  <script src="popup.js"></script>
</body>
</html>`;

  const popupJs = `// AI Bookmark Organizer - Popup Script
const API_URL = "${backendUrl}/api/categorize";

let bookmarksList = [];
let selectedScope = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  await loadBookmarks();
  setupEventListeners();
});

async function loadBookmarks() {
  if (typeof chrome !== 'undefined' && chrome.bookmarks) {
    try {
      const tree = await chrome.bookmarks.getTree();
      bookmarksList = flattenBookmarkTree(tree);
      updateStats();
    } catch (e) {
      console.warn("Could not read chrome bookmarks directly, in web mode:", e);
    }
  } else {
    document.getElementById('total-bookmarks').textContent = "35";
    document.getElementById('unsorted-bookmarks').textContent = "18";
  }
}

function flattenBookmarkTree(nodes, currentFolder = 'Bookmarks Bar') {
  let list = [];
  for (const node of nodes) {
    if (node.url) {
      list.push({
        id: node.id,
        title: node.title || node.url,
        url: node.url,
        folder: currentFolder,
        dateAdded: node.dateAdded
      });
    }
    if (node.children) {
      const nextFolder = node.title ? currentFolder + '/' + node.title : currentFolder;
      list = list.concat(flattenBookmarkTree(node.children, nextFolder));
    }
  }
  return list;
}

function updateStats() {
  document.getElementById('total-bookmarks').textContent = bookmarksList.length;
  const unsorted = bookmarksList.filter(b => b.folder.includes('Unsorted') || b.folder === 'Bookmarks Bar' || b.folder.includes('Other'));
  document.getElementById('unsorted-bookmarks').textContent = unsorted.length;
}

function setupEventListeners() {
  const scopeAllBtn = document.getElementById('scope-all');
  const scopeUnsortedBtn = document.getElementById('scope-unsorted');
  const organizeBtn = document.getElementById('btn-organize');
  const statusBox = document.getElementById('status-box');
  const fullDashLink = document.getElementById('open-full-dashboard');

  scopeAllBtn.addEventListener('click', () => {
    selectedScope = 'all';
    scopeAllBtn.classList.add('active');
    scopeUnsortedBtn.classList.remove('active');
  });

  scopeUnsortedBtn.addEventListener('click', () => {
    selectedScope = 'unsorted';
    scopeUnsortedBtn.classList.add('active');
    scopeAllBtn.classList.remove('active');
  });

  fullDashLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: "${backendUrl}" });
    } else {
      window.open("${backendUrl}", "_blank");
    }
  });

  organizeBtn.addEventListener('click', async () => {
    organizeBtn.disabled = true;
    statusBox.innerHTML = '<div style="color: #38bdf8;">⏳ Scanning bookmarks & querying Gemini AI...</div>';

    try {
      const targetBookmarks = selectedScope === 'all' 
        ? bookmarksList 
        : bookmarksList.filter(b => b.folder.includes('Unsorted') || b.folder === 'Bookmarks Bar' || b.folder.includes('Other'));

      const customInstructions = document.getElementById('instructions').value;

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookmarks: targetBookmarks,
          customInstructions: customInstructions
        })
      });

      const data = await res.json();

      if (data.results) {
        statusBox.innerHTML = \`
          <div style="color: #4ade80; font-weight: 600;">✓ Successfully organized \${data.results.length} bookmarks!</div>
          <div style="color: #94a3b8; font-size: 11px; margin-top: 4px;">Created \${data.folders.length} smart folders.</div>
        \`;

        // If in real chrome extension environment, move the bookmarks
        if (typeof chrome !== 'undefined' && chrome.bookmarks) {
          await applyCategorizationToChrome(data.results);
        }
      } else {
        statusBox.innerHTML = '<div style="color: #f87171;">⚠️ ' + (data.error || 'Failed to categorize') + '</div>';
      }
    } catch (err) {
      statusBox.innerHTML = '<div style="color: #f87171;">⚠️ Error: ' + err.message + '</div>';
    } finally {
      organizeBtn.disabled = false;
    }
  });
}

async function applyCategorizationToChrome(results) {
  // Finds or creates folders in chrome.bookmarks and moves items
  for (const item of results) {
    try {
      // Find or create folder
      const folderId = await ensureChromeFolder(item.folder);
      await chrome.bookmarks.move(item.id, { parentId: folderId });
    } catch (e) {
      console.warn("Could not move bookmark", item.id, e);
    }
  }
}

async function ensureChromeFolder(folderPath) {
  const parts = folderPath.split('/').filter(Boolean);
  let parentId = '1'; // Bookmarks Bar
  for (const part of parts) {
    const existing = await chrome.bookmarks.getChildren(parentId);
    const found = existing.find(c => !c.url && c.title.toLowerCase() === part.toLowerCase());
    if (found) {
      parentId = found.id;
    } else {
      const created = await chrome.bookmarks.create({ parentId, title: part });
      parentId = created.id;
    }
  }
  return parentId;
}
`;

  const sidepanelHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Bookmark Organizer - Sidepanel</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: #0f172a;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>
</head>
<body>
  <iframe src="${backendUrl}?mode=sidepanel"></iframe>
</body>
</html>`;

  const readmeMd = `# AI Bookmark Organizer - Chrome Extension

This Chrome Extension scans your bookmarks (either all or specific folders/selected links) and uses Google Gemini AI to categorize them into clean, structured folders with tags and site summaries.

## How to Install in Google Chrome:

1. Download and extract this zip file to a folder on your computer.
2. Open Google Chrome and go to: \`chrome://extensions/\`
3. Toggle ON **"Developer mode"** in the top right corner.
4. Click the **"Load unpacked"** button in the top left corner.
5. Select the extracted folder containing \`manifest.json\`.
6. Click the Extension icon in Chrome's toolbar to scan and organize your bookmarks!

## Features:
- **Scan All or Instructed Bookmarks**: Choose full reorganization or target messy folders.
- **Custom Prompts & Rules**: Instruct AI how you want folders organized (e.g., "Sort by work projects vs personal recipes").
- **Automatic Smart Folders & Tags**: Generates clean taxonomies with relevant tags.
- **Duplicate & Dead Link Identification**: Finds duplicate URLs and tracking link clutter.
- **Export to Netscape HTML**: Compatible with Chrome, Edge, Safari, and Firefox.
`;

  return [
    { name: "manifest.json", path: "manifest.json", content: manifestJson, description: "Manifest V3 configuration" },
    { name: "background.js", path: "background.js", content: backgroundJs, description: "Background service worker & context menu handler" },
    { name: "popup.html", path: "popup.html", content: popupHtml, description: "Extension popup user interface" },
    { name: "popup.js", path: "popup.js", content: popupJs, description: "Extension popup logic & Chrome bookmarks API caller" },
    { name: "sidepanel.html", path: "sidepanel.html", content: sidepanelHtml, description: "Chrome Sidepanel view" },
    { name: "README.md", path: "README.md", content: readmeMd, description: "Installation instructions for Chrome" }
  ];
}

export async function generateExtensionZip(apiBaseUrl: string = ''): Promise<Blob> {
  const zip = new JSZip();
  const files = getExtensionFiles(apiBaseUrl);

  files.forEach((f) => {
    zip.file(f.path, f.content);
  });

  // Add dummy placeholder icons in icons/ folder
  // 1x1 base64 transparent PNG
  const dummyIcon = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const iconsFolder = zip.folder("icons");
  if (iconsFolder) {
    iconsFolder.file("icon16.png", dummyIcon, { base64: true });
    iconsFolder.file("icon48.png", dummyIcon, { base64: true });
    iconsFolder.file("icon128.png", dummyIcon, { base64: true });
  }

  return await zip.generateAsync({ type: "blob" });
}
