import { Bookmark, CategorizedBookmarkResult } from '../types';

export interface PlannedItemReport {
  id: string;
  title: string;
  url: string;
  originalFolder: string;
  targetFolder: string;
  tags: string[];
  summary: string;
  confidence: number;
  isIncluded: boolean;
  isModifiedByUser?: boolean;
  isDuplicate?: boolean;
  duplicateReason?: string;
}

export interface ReorganizationReportData {
  timestamp: string;
  totalAnalyzed: number;
  totalIncluded: number;
  totalExcluded: number;
  totalModified: number;
  totalDuplicates: number;
  explanation: string;
  targetFolders: string[];
  items: PlannedItemReport[];
}

/**
 * Generates a clean, formatted plain text (.txt) report.
 */
export function generateTextReport(data: ReorganizationReportData): string {
  const divider = '='.repeat(80);
  const subDivider = '-'.repeat(80);

  const lines: string[] = [
    divider,
    '           AI BOOKMARK REORGANIZATION PLAN & AUDIT REPORT',
    divider,
    `Date & Time Generated: ${data.timestamp}`,
    `Total Bookmarks Analyzed: ${data.totalAnalyzed}`,
    `Changes Approved / Included: ${data.totalIncluded}`,
    `Changes Excluded / Skipped:  ${data.totalExcluded}`,
    `User-Corrected Items:        ${data.totalModified}`,
    `Identified Duplicates:       ${data.totalDuplicates}`,
    `Target Folders Defined:      ${data.targetFolders.length}`,
    '',
    subDivider,
    '1. EXECUTIVE SUMMARY & AI TAXONOMY STRATEGY',
    subDivider,
    data.explanation || 'Automated smart folder classification and taxonomy optimization.',
    '',
    subDivider,
    '2. TARGET FOLDER STRUCTURE',
    subDivider,
  ];

  data.targetFolders.forEach((folder, idx) => {
    const folderItems = data.items.filter(i => i.isIncluded && i.targetFolder === folder);
    lines.push(` [${idx + 1}] ${folder} (${folderItems.length} bookmark${folderItems.length !== 1 ? 's' : ''})`);
  });

  lines.push('');
  lines.push(subDivider);
  lines.push('3. ITEMIZED CHANGE MANIFEST & AUDIT LOG');
  lines.push(subDivider);

  data.items.forEach((item, index) => {
    const statusText = !item.isIncluded 
      ? '[EXCLUDED BY USER - NO CHANGES WILL BE MADE]' 
      : item.isModifiedByUser 
        ? '[USER MODIFIED & APPROVED]' 
        : item.originalFolder !== item.targetFolder 
          ? '[PLANNED MOVE & REORGANIZE]' 
          : '[KEEP IN CURRENT FOLDER]';

    lines.push(`ITEM #${index + 1}: ${item.title}`);
    lines.push(`  • URL:             ${item.url}`);
    lines.push(`  • Action Status:   ${statusText}`);
    lines.push(`  • Original Folder: ${item.originalFolder}`);
    lines.push(`  • Target Folder:   ${item.targetFolder}`);
    lines.push(`  • AI Confidence:   ${item.confidence}%`);
    if (item.tags.length > 0) {
      lines.push(`  • Tags:            ${item.tags.map(t => '#' + t).join(', ')}`);
    }
    if (item.summary) {
      lines.push(`  • AI Summary:      ${item.summary}`);
    }
    if (item.isDuplicate) {
      lines.push(`  • DUPLICATE NOTE:  Flagged as duplicate link (${item.duplicateReason || 'Repeated URL/Domain'})`);
    }
    lines.push('');
  });

  lines.push(divider);
  lines.push('End of Reorganization Report. Changes will only be executed upon user confirmation.');
  lines.push(divider);

  return lines.join('\n');
}

/**
 * Generates an MS Word compatible HTML document (.doc).
 */
export function generateDocReport(data: ReorganizationReportData): string {
  const rows = data.items.map((item, index) => {
    const statusBg = !item.isIncluded 
      ? '#fee2e2; color: #991b1b;' 
      : item.isModifiedByUser 
        ? '#fef3c7; color: #92400e;' 
        : item.originalFolder !== item.targetFolder 
          ? '#dcfce7; color: #166534;' 
          : '#f1f5f9; color: #475569;';

    const statusLabel = !item.isIncluded 
      ? 'Excluded' 
      : item.isModifiedByUser 
        ? 'User Corrected' 
        : item.originalFolder !== item.targetFolder 
          ? 'Planned Move' 
          : 'Retained';

    return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-family: monospace; font-size: 11px; text-align: center; color: #64748b;">${index + 1}</td>
        <td style="padding: 10px;">
          <strong style="color: #0f172a; font-size: 13px;">${escapeHtml(item.title)}</strong><br/>
          <a href="${escapeHtml(item.url)}" style="color: #4f46e5; font-size: 11px; text-decoration: underline; word-break: break-all;">${escapeHtml(item.url)}</a>
          ${item.summary ? `<div style="font-size: 11px; color: #64748b; margin-top: 4px; font-style: italic;">${escapeHtml(item.summary)}</div>` : ''}
        </td>
        <td style="padding: 10px; font-size: 12px; color: #64748b; text-decoration: ${item.originalFolder !== item.targetFolder && item.isIncluded ? 'line-through' : 'none'};">
          ${escapeHtml(item.originalFolder)}
        </td>
        <td style="padding: 10px; font-size: 12px; font-weight: bold; color: ${item.isIncluded ? '#059669' : '#94a3b8'};">
          ${escapeHtml(item.targetFolder)}
        </td>
        <td style="padding: 10px; text-align: center;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; background: ${statusBg}">
            ${statusLabel}
          </span>
          <div style="font-size: 10px; color: #64748b; margin-top: 3px;">${item.confidence}% Match</div>
        </td>
        <td style="padding: 10px; font-size: 11px; color: #4f46e5;">
          ${item.tags.map(t => `<span style="display: inline-block; background: #eef2ff; color: #4338ca; padding: 2px 6px; border-radius: 6px; margin: 2px;">#${escapeHtml(t)}</span>`).join(' ')}
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>AI Bookmark Reorganization Plan & Audit Report</title>
  <style>
    body {
      font-family: Calibri, Arial, Helvetica, sans-serif;
      margin: 30px;
      color: #1e293b;
      line-height: 1.5;
    }
    h1 {
      color: #312e81;
      font-size: 22pt;
      margin-bottom: 4px;
    }
    h2 {
      color: #4338ca;
      font-size: 14pt;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 24px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background-color: #4f46e5;
      color: #ffffff;
      border-radius: 4px;
      font-size: 10pt;
      font-weight: bold;
    }
    .summary-card {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
    }
    .metric-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    .metric-table td {
      padding: 8px;
      border: 1px solid #e2e8f0;
      font-size: 11pt;
    }
    .metric-value {
      font-weight: bold;
      color: #312e81;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    table.data-table th {
      background-color: #312e81;
      color: #ffffff;
      padding: 10px;
      font-size: 11pt;
      text-align: left;
    }
    .footer {
      margin-top: 40px;
      font-size: 9pt;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <h1>AI Bookmark Reorganization Plan & Audit Report</h1>
  <p style="color: #64748b; font-size: 11pt; margin-top: 0;">
    Pre-Execution Audit Manifest • Generated on <strong>${data.timestamp}</strong>
  </p>

  <div class="summary-card">
    <strong style="color: #1e1b4b; font-size: 12pt;">AI Taxonomy Strategy:</strong>
    <p style="font-style: italic; color: #334155; margin-top: 6px;">
      "${escapeHtml(data.explanation)}"
    </p>

    <table class="metric-table">
      <tr>
        <td>Total Bookmarks Analyzed: <span class="metric-value">${data.totalAnalyzed}</span></td>
        <td>Target Folders Defined: <span class="metric-value">${data.targetFolders.length}</span></td>
      </tr>
      <tr>
        <td>Approved Moves / Changes: <span class="metric-value" style="color: #059669;">${data.totalIncluded}</span></td>
        <td>Excluded by User: <span class="metric-value" style="color: #dc2626;">${data.totalExcluded}</span></td>
      </tr>
      <tr>
        <td>User Corrected Items: <span class="metric-value" style="color: #d97706;">${data.totalModified}</span></td>
        <td>Identified Duplicates: <span class="metric-value" style="color: #e11d48;">${data.totalDuplicates}</span></td>
      </tr>
    </table>
  </div>

  <h2>Target Folder Distribution</h2>
  <ul style="color: #334155; font-size: 11pt;">
    ${data.targetFolders.map(folder => {
      const count = data.items.filter(i => i.isIncluded && i.targetFolder === folder).length;
      return `<li><strong>${escapeHtml(folder)}</strong> — ${count} bookmark${count !== 1 ? 's' : ''}</li>`;
    }).join('')}
  </ul>

  <h2>Itemized Reorganization Manifest</h2>
  <p style="font-size: 10pt; color: #64748b;">
    Review the full list of proposed and approved folder relocations, tag assignments, and summaries below:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 30px; text-align: center;">#</th>
        <th>Bookmark Title & URL</th>
        <th>Original Folder</th>
        <th>Target Folder</th>
        <th style="width: 110px; text-align: center;">Status</th>
        <th>Assigned Tags</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="footer">
    Report generated by Intelligent ML Bookmark Organizer • Pre-Approval Audit Trail
  </div>
</body>
</html>
  `;
}

/**
 * Generates a Markdown document (.md).
 */
export function generateMarkdownReport(data: ReorganizationReportData): string {
  const lines: string[] = [
    `# AI Bookmark Reorganization Plan & Audit Report`,
    `**Generated:** ${data.timestamp}  `,
    `**Total Analyzed:** ${data.totalAnalyzed} | **Approved:** ${data.totalIncluded} | **Excluded:** ${data.totalExcluded} | **Corrected:** ${data.totalModified}`,
    '',
    `## Executive Strategy & AI Rationale`,
    `> ${data.explanation}`,
    '',
    `## Target Folders`,
  ];

  data.targetFolders.forEach(folder => {
    const count = data.items.filter(i => i.isIncluded && i.targetFolder === folder).length;
    lines.push(`- **${folder}** (${count} bookmarks)`);
  });

  lines.push('');
  lines.push('## Itemized Change Manifest');
  lines.push('| # | Title | URL | Original Folder | Target Folder | Status | Tags |');
  lines.push('|---|-------|-----|-----------------|---------------|--------|------|');

  data.items.forEach((item, idx) => {
    const status = !item.isIncluded ? '⛔ Excluded' : item.isModifiedByUser ? '✏️ User Corrected' : '✅ Planned Move';
    const tags = item.tags.map(t => '`#' + t + '`').join(' ');
    lines.push(`| ${idx + 1} | ${item.title.replace(/\|/g, '-')} | [Link](${item.url}) | ${item.originalFolder} | **${item.targetFolder}** | ${status} | ${tags} |`);
  });

  return lines.join('\n');
}

/**
 * Utility to trigger client-side download of a file.
 */
export function downloadReportFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
