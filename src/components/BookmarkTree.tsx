import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  Layers, 
  AlertCircle,
  CopyCheck,
  FolderPlus,
  FolderTree as FolderTreeIcon
} from 'lucide-react';
import { Bookmark, FolderNode } from '../types';

interface BookmarkTreeProps {
  bookmarks: Bookmark[];
  selectedFolder: string | null;
  onSelectFolder: (folder: string | null) => void;
  onCreateFolder: (parentFolder: string, newFolderName: string) => void;
  onDeleteFolder: (folderPath: string) => void;
  onRenameFolder: (oldPath: string, newPath: string) => void;
  onDropBookmarkToFolder?: (bookmarkId: string, targetFolder: string) => void;
}

export const BookmarkTree: React.FC<BookmarkTreeProps> = ({
  bookmarks,
  selectedFolder,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onDropBookmarkToFolder
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'Bookmarks': true,
    'Bookmarks Bar': true,
    'Development': true,
    'Design': true,
    'Personal': true,
  });
  const [newFolderParent, setNewFolderParent] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  // Build folder hierarchy tree from bookmark paths
  const buildTree = (): FolderNode[] => {
    const rootMap: Record<string, any> = {};

    bookmarks.forEach(bm => {
      const folderPath = bm.folder || 'Unsorted Bookmarks';
      const parts = folderPath.split('/').filter(Boolean);

      let currentMap = rootMap;
      let currentPath = '';

      parts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        if (!currentMap[part]) {
          currentMap[part] = {
            _name: part,
            _path: currentPath,
            _count: 0,
            _children: {}
          };
        }
        if (index === parts.length - 1) {
          currentMap[part]._count += 1;
        }
        currentMap = currentMap[part]._children;
      });
    });

    const mapToNodes = (obj: Record<string, any>): FolderNode[] => {
      return Object.keys(obj).map(key => {
        const item = obj[key];
        const children = mapToNodes(item._children);
        const totalCount = item._count + children.reduce((acc, c) => acc + c.bookmarkCount, 0);
        return {
          name: item._name,
          fullPath: item._path,
          bookmarkCount: totalCount,
          children: children,
          isExpanded: !!expandedFolders[item._path]
        };
      });
    };

    return mapToNodes(rootMap);
  };

  const treeNodes = buildTree();

  const toggleExpand = (folderPath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim() && newFolderParent !== null) {
      onCreateFolder(newFolderParent, newFolderName.trim());
      setNewFolderParent(null);
      setNewFolderName('');
    }
  };

  const handleRenameSubmit = (oldPath: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editFolderName.trim()) {
      const parts = oldPath.split('/');
      parts[parts.length - 1] = editFolderName.trim();
      const newPath = parts.join('/');
      onRenameFolder(oldPath, newPath);
      setEditingFolder(null);
      setEditFolderName('');
    }
  };

  const handleDragOver = (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    setDragOverFolder(folderPath);
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleDrop = (e: React.DragEvent, folderPath: string) => {
    e.preventDefault();
    setDragOverFolder(null);
    const bookmarkId = e.dataTransfer.getData('text/plain');
    if (bookmarkId && onDropBookmarkToFolder) {
      onDropBookmarkToFolder(bookmarkId, folderPath);
    }
  };

  const renderNode = (node: FolderNode, depth = 0) => {
    const isSelected = selectedFolder === node.fullPath;
    const isExpanded = !!expandedFolders[node.fullPath];
    const isDragOver = dragOverFolder === node.fullPath;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.fullPath} className="flex flex-col">
        <div
          onClick={() => onSelectFolder(node.fullPath)}
          onDragOver={(e) => handleDragOver(e, node.fullPath)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, node.fullPath)}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`group flex items-center justify-between py-1.5 pr-2 rounded-lg text-xs cursor-pointer transition-all ${
            isSelected
              ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
              : isDragOver
              ? 'bg-indigo-500/30 border border-indigo-400 text-white'
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.fullPath, e)}
                className="p-0.5 hover:bg-slate-700/50 rounded text-slate-400"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5" />
            )}

            {isExpanded ? (
              <FolderOpen className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-amber-400'}`} />
            ) : (
              <Folder className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-amber-400'}`} />
            )}

            {editingFolder === node.fullPath ? (
              <form onSubmit={(e) => handleRenameSubmit(node.fullPath, e)} className="flex-1 mr-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  autoFocus
                  value={editFolderName}
                  onChange={(e) => setEditFolderName(e.target.value)}
                  onBlur={() => setEditingFolder(null)}
                  className="w-full bg-slate-950 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white outline-none"
                />
              </form>
            ) : (
              <span className="truncate flex-1 font-medium">{node.name}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 group-hover:text-slate-300">
              {node.bookmarkCount}
            </span>

            <div className="hidden group-hover:flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                title="Add subfolder"
                onClick={() => {
                  setNewFolderParent(node.fullPath);
                  setNewFolderName('');
                  setExpandedFolders(p => ({ ...p, [node.fullPath]: true }));
                }}
                className="p-1 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                type="button"
                title="Rename folder"
                onClick={() => {
                  setEditingFolder(node.fullPath);
                  setEditFolderName(node.name);
                }}
                className="p-1 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                type="button"
                title="Delete folder"
                onClick={() => onDeleteFolder(node.fullPath)}
                className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Child Folders */}
        {isExpanded && node.children.map(child => renderNode(child, depth + 1))}

        {/* Inline Create Subfolder Input */}
        {newFolderParent === node.fullPath && (
          <form
            onSubmit={handleCreateSubmit}
            style={{ paddingLeft: `${(depth + 1) * 14 + 16}px` }}
            className="flex items-center gap-1.5 py-1 pr-2"
          >
            <FolderPlus className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => setNewFolderParent(null)}
              className="flex-1 bg-slate-950 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white outline-none"
            />
          </form>
        )}
      </div>
    );
  };

  const unsortedCount = bookmarks.filter(b => 
    b.folder.toLowerCase().includes('unsorted') || 
    b.folder === 'Bookmarks Bar' || 
    b.folder.toLowerCase().includes('other')
  ).length;

  const duplicateCount = bookmarks.filter(b => b.isDuplicate).length;

  return (
    <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.6)] animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">FOLDER TAXONOMY</h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setNewFolderParent('');
            setNewFolderName('');
          }}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-xl transition"
        >
          <Plus className="w-3.5 h-3.5" /> <span>New Root</span>
        </button>
      </div>

      {/* Root quick filter items */}
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => onSelectFolder(null)}
          className={`flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs transition-all ${
            selectedFolder === null
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
              : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-indigo-300" />
            <span className="font-semibold">All Bookmarks</span>
          </div>
          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg ${
            selectedFolder === null ? 'bg-indigo-800 text-white' : 'bg-black/40 text-slate-400 border border-white/10'
          }`}>
            {bookmarks.length}
          </span>
        </button>

        {unsortedCount > 0 && (
          <button
            onClick={() => onSelectFolder('Unsorted Bookmarks')}
            className={`flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs transition-all ${
              selectedFolder === 'Unsorted Bookmarks'
                ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-500/40 shadow-sm'
                : 'text-amber-400/90 hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Unsorted / Loose</span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {unsortedCount}
            </span>
          </button>
        )}

        {duplicateCount > 0 && (
          <button
            onClick={() => onSelectFolder('__duplicates__')}
            className={`flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs transition-all ${
              selectedFolder === '__duplicates__'
                ? 'bg-rose-500/20 text-rose-200 font-bold border border-rose-500/40 shadow-sm'
                : 'text-rose-400/90 hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CopyCheck className="w-4 h-4 text-rose-400" />
              <span>Duplicates Detected</span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
              {duplicateCount}
            </span>
          </button>
        )}
      </div>

      <div className="border-t border-white/10 my-0.5" />

      {/* Dynamic Folder Tree */}
      <div className="flex flex-col gap-1 max-h-[460px] overflow-y-auto pr-1">
        {treeNodes.map(node => renderNode(node, 0))}

        {newFolderParent === '' && (
          <form
            onSubmit={handleCreateSubmit}
            className="flex items-center gap-2 py-2 px-3 bg-white/5 rounded-2xl border border-indigo-500/50"
          >
            <FolderPlus className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="New root folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => setNewFolderParent(null)}
              className="flex-1 bg-transparent text-xs text-white outline-none"
            />
          </form>
        )}
      </div>
    </div>
  );
};
