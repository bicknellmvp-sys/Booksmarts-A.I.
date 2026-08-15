import { Bookmark } from '../types';

/**
 * Parses Chrome Bookmark HTML export (Netscape Bookmark format) into Bookmark objects
 */
export function parseNetscapeBookmarks(htmlContent: string): Bookmark[] {
  const bookmarks: Bookmark[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Traverse DOM keeping track of current folder path
  function traverse(element: Element, currentPath: string[] = ['Bookmarks Bar']) {
    const children = Array.from(element.children);
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const tagName = child.tagName.toUpperCase();

      if (tagName === 'DT') {
        // A DT can contain an <H3> (folder) followed by <DL> (folder contents), or an <A> (bookmark)
        const h3 = child.querySelector(':scope > H3');
        const dl = child.querySelector(':scope > DL') || child.nextElementSibling?.tagName === 'DL' ? child.nextElementSibling : null;
        const a = child.querySelector(':scope > A');

        if (h3 && dl) {
          const folderName = h3.textContent?.trim() || 'Untitled Folder';
          const newPath = [...currentPath, folderName];
          traverse(dl as Element, newPath);
        } else if (a) {
          const url = a.getAttribute('HREF') || a.getAttribute('href') || '';
          const title = a.textContent?.trim() || url;
          const addDateStr = a.getAttribute('ADD_DATE') || a.getAttribute('add_date');
          const addDate = addDateStr ? parseInt(addDateStr, 10) * 1000 : Date.now();
          const icon = a.getAttribute('ICON') || a.getAttribute('icon');

          if (url && url.startsWith('http')) {
            bookmarks.push({
              id: 'bm-' + Math.random().toString(36).substring(2, 9),
              title,
              url,
              folder: currentPath.join('/'),
              tags: [],
              dateAdded: addDate,
              favicon: icon || getFaviconUrl(url),
              status: 'synced',
            });
          }
        }
      } else if (tagName === 'DL' || tagName === 'P') {
        traverse(child, currentPath);
      }
    }
  }

  const rootDl = doc.querySelector('dl') || doc.body;
  if (rootDl) {
    traverse(rootDl, ['Bookmarks']);
  }

  // Fallback: if no DL structure detected, search for all <a> tags
  if (bookmarks.length === 0) {
    const allLinks = doc.querySelectorAll('a[href]');
    allLinks.forEach((a) => {
      const url = a.getAttribute('href') || '';
      if (url.startsWith('http')) {
        bookmarks.push({
          id: 'bm-' + Math.random().toString(36).substring(2, 9),
          title: a.textContent?.trim() || url,
          url,
          folder: 'Unsorted Bookmarks',
          tags: [],
          dateAdded: Date.now(),
          favicon: getFaviconUrl(url),
        });
      }
    });
  }

  return bookmarks;
}

/**
 * Generates standard Netscape Bookmark HTML file that Google Chrome can import
 */
export function exportToNetscapeHtml(bookmarks: Bookmark[]): string {
  const timestamp = Math.floor(Date.now() / 1000);

  // Group bookmarks by folder path
  const folderTree: Record<string, Bookmark[]> = {};

  bookmarks.forEach((bm) => {
    const folder = bm.folder || 'Other Bookmarks';
    if (!folderTree[folder]) {
      folderTree[folder] = [];
    }
    folderTree[folder].push(bm);
  });

  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;

  // Sort folders
  const folders = Object.keys(folderTree).sort();

  folders.forEach((folderPath) => {
    const pathParts = folderPath.split('/').filter(Boolean);
    const folderName = pathParts[pathParts.length - 1] || 'Bookmarks';
    const folderBookmarks = folderTree[folderPath];

    html += `    <DT><H3 ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}">${escapeHtml(folderName)}</H3>\n`;
    html += `    <DL><p>\n`;

    folderBookmarks.forEach((bm) => {
      const bmTimestamp = bm.dateAdded ? Math.floor(bm.dateAdded / 1000) : timestamp;
      const tagsAttr = bm.tags.length > 0 ? ` TAGS="${escapeHtml(bm.tags.join(','))}"` : '';
      html += `        <DT><A HREF="${escapeHtml(bm.url)}" ADD_DATE="${bmTimestamp}"${tagsAttr}>${escapeHtml(bm.title)}</A>\n`;
    });

    html += `    </DL><p>\n`;
  });

  html += `</DL><p>\n`;
  return html;
}

export function exportToJson(bookmarks: Bookmark[]): string {
  return JSON.stringify(bookmarks, null, 2);
}

export function exportToMarkdown(bookmarks: Bookmark[]): string {
  const folderTree: Record<string, Bookmark[]> = {};
  bookmarks.forEach((bm) => {
    const folder = bm.folder || 'Uncategorized';
    if (!folderTree[folder]) folderTree[folder] = [];
    folderTree[folder].push(bm);
  });

  let md = `# My AI-Organized Bookmarks\n\n`;
  Object.keys(folderTree).sort().forEach((folder) => {
    md += `## ${folder}\n\n`;
    folderTree[folder].forEach((bm) => {
      const tagsStr = bm.tags.length > 0 ? ` *(${bm.tags.join(', ')})*` : '';
      const summaryStr = bm.aiSummary ? `\n  > ${bm.aiSummary}` : '';
      md += `- [${bm.title}](${bm.url})${tagsStr}${summaryStr}\n`;
    });
    md += `\n`;
  });

  return md;
}

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return 'https://www.google.com/s2/favicons?domain=google.com&sz=64';
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
