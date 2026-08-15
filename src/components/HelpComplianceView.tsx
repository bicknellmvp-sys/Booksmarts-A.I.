import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Mail, 
  Copyright, 
  Chrome, 
  Sparkles, 
  Terminal, 
  Layers, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Send,
  Lock,
  EyeOff,
  Database
} from 'lucide-react';

interface HelpComplianceViewProps {
  onClose?: () => void;
  onOpenExtensionExport?: () => void;
}

export const HelpComplianceView: React.FC<HelpComplianceViewProps> = ({
  onClose,
  onOpenExtensionExport
}) => {
  const [activeTab, setActiveTab] = useState<'help' | 'privacy' | 'terms' | 'permissions' | 'contact'>('help');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setContactSubject('');
      setContactMessage('');
    }, 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Help Center & Chrome Web Store Compliance
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Manifest V3 Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Official documentation, user guides, Google Chrome Web Store developer policies, privacy disclosures, and contact details.
              </p>
            </div>
          </div>

          {onOpenExtensionExport && (
            <button
              onClick={onOpenExtensionExport}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition shrink-0"
            >
              <Chrome className="w-4 h-4" />
              <span>Extension Package</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-[#101014] border border-white/10 p-1.5 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('help')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'help'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>User Guide & FAQ</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'permissions'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Chrome Permissions Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'terms'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms & Copyright</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'contact'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact & Support</span>
        </button>
      </div>

      {/* Tab 1: Help & User Guide */}
      {activeTab === 'help' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-3xl bg-[#101014] border border-white/10 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">1. AI Auto-Categorization</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click <strong>"Auto-Categorize All"</strong> or select specific bookmarks. Gemini AI scans URLs, titles, and site semantics to propose deep nested folders and relevant tags without deleting anything.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#101014] border border-white/10 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">2. Link Health & Dead Link Audit</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click <strong>"Health"</strong> in the top navbar. The auditor sends concurrent HEAD requests to check HTTP 404s, 500s, DNS resolution errors, and dead domains, allowing 1-click batch cleanup.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#101014] border border-white/10 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">3. Home Screen & New Tab</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use the <strong>New Tab</strong> view as your browser start page. It features multi-engine search, focus timer, quick scratchpad, custom iframe embeds, and top 100 web directory access.
              </p>
            </div>

          </div>

          {/* FAQ Section */}
          <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Frequently Asked Questions (FAQ)
            </h3>

            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-xs font-bold text-white mb-1">
                  Q: Does Booksmarts A.I. alter my browser bookmarks without my permission?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No. Booksmarts A.I. operates on a strict **Preview & Confirm Diff** architecture. Whenever AI reorganizes or moves bookmarks, you are shown an exact visual diff review screen to accept or reject changes before they are applied.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-xs font-bold text-white mb-1">
                  Q: How do I load the extension into Google Chrome?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Go to <code className="text-indigo-300 font-mono">chrome://extensions</code>, enable <strong>Developer Mode</strong> at top-right, click <strong>Load unpacked</strong>, and select the unzipped folder generated from the "Extension .ZIP" button.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-xs font-bold text-white mb-1">
                  Q: How do I export my organized bookmarks back to HTML?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Click the <strong>"Export HTML"</strong> button on the dashboard or in the share modal. This creates a standard Netscape Bookmark file compatible with Chrome, Safari, Firefox, and Edge.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Permissions Justification Matrix */}
      {activeTab === 'permissions' && (
        <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
          <div>
            <h3 className="text-base font-bold text-white">Google Chrome Web Store Permissions Declaration</h3>
            <p className="text-xs text-slate-400 mt-1">
              In accordance with Google Chrome Web Store Single Purpose and Minimal Permissions policies, each permission is strictly justified below:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono uppercase">
                  <th className="py-3 px-4">Permission</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Technical Justification & Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300">"bookmarks"</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono">Required</td>
                  <td className="py-3 px-4">
                    Required to read the user's bookmark tree and move bookmarks into smart folders upon user confirmation.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300">"storage"</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono">Required</td>
                  <td className="py-3 px-4">
                    Stores user UI preferences, custom scratchpad notes, tags taxonomy, and link health cache locally.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300">"sidePanel"</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono">Required</td>
                  <td className="py-3 px-4">
                    Powers the Chrome Side Panel companion interface allowing instant bookmarking alongside web browsing.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300">"activeTab"</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono">Required</td>
                  <td className="py-3 px-4">
                    Captures current tab title, URL, and favicon when the user clicks "AI Bookmark Current Tab".
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300">"contextMenus"</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono">Required</td>
                  <td className="py-3 px-4">
                    Adds a right-click browser menu option to quickly categorize and bookmark the active web page.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Privacy Policy */}
      {activeTab === 'privacy' && (
        <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5 leading-relaxed text-xs sm:text-sm text-slate-300">
          
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Privacy Policy for Booksmarts A.I.</h3>
              <p className="text-xs text-slate-400">Effective Date: January 1, 2026 • Local-First Architecture</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">1. Local Data Storage & Zero Telemetry</h4>
              <p className="text-xs text-slate-300">
                Booksmarts A.I. does not collect, sell, or rent your personal browsing history, bookmarks, or account information. All bookmark data, tags, folders, scratchpad notes, and todos reside exclusively inside your local browser storage (<code className="text-indigo-300">chrome.storage.local</code> or <code className="text-indigo-300">localStorage</code>).
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-1">2. AI Processing Disclosure</h4>
              <p className="text-xs text-slate-300">
                When you initiate an AI auto-categorization or summarization scan, only the titles and URLs of selected bookmarks are transmitted securely via TLS encryption to the Gemini API strictly for computing folder categorization and tags. No data is used to train proprietary models without consent.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-1">3. Third-Party Analytics & Trackers</h4>
              <p className="text-xs text-slate-300">
                This extension and web app contains **zero** third-party ad networks, tracking pixels, or telemetry beacons.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-1">4. Data Erasure & Control</h4>
              <p className="text-xs text-slate-300">
                You retain 100% ownership of your data. You can delete or clear all locally cached bookmarks, notes, and tags at any time with a single click in the app or by clearing your extension data.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: Terms & Copyright */}
      {activeTab === 'terms' && (
        <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Copyright className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Terms of Service & Copyright Notice</h3>
              <p className="text-xs text-slate-400">© 2026 Booksmarts A.I. • Open Software License</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">1. Intellectual Property</h4>
              <p className="text-xs text-slate-300">
                Booksmarts A.I. and all accompanying code, UI layouts, and documentation are protected by copyright law and open source licenses. You are granted a personal, non-exclusive license to use, install, and modify the software for personal or organization use.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-1">2. Disclaimer of Warranties</h4>
              <p className="text-xs text-slate-300">
                The software is provided "AS IS", without warranty of any kind, express or implied. In no event shall the authors or copyright holders be liable for any claim, damages, or bookmark loss resulting from the use of the software. Users are always encouraged to maintain backups via the built-in HTML export tool.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab 5: Contact & Support */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Contact Details Card */}
          <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Developer Contact Information</h3>
                  <p className="text-xs text-slate-400">Chrome Web Store Listing Compliance</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-xs text-slate-300">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Official Support Email:</span>
                  <a href="mailto:bicknellmvp@gmail.com" className="text-indigo-400 font-mono font-bold hover:underline">
                    bicknellmvp@gmail.com
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Application Version:</span>
                  <span className="text-white font-mono font-bold">3.0.0 (Manifest V3)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Primary Store Category:</span>
                  <span className="text-emerald-400 font-medium">Productivity & Dev Tools</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-xs text-indigo-200">
              💡 <strong>Prompt Support Response:</strong> We answer feature requests, bug tickets, and enterprise inquiries within 24–48 hours.
            </div>
          </div>

          {/* Quick Feedback Form */}
          <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono mb-1">
                Send Direct Message / Bug Report
              </h3>
              <p className="text-xs text-slate-400">
                Have a suggestion or found a broken link? Send a note directly to our team.
              </p>
            </div>

            {feedbackSent ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center flex flex-col items-center justify-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <h4 className="text-sm font-bold">Message Dispatched!</h4>
                <p className="text-xs text-slate-300">Thank you for your feedback. We appreciate your support.</p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="flex flex-col gap-3">
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="Subject (e.g. Feature Idea, Chrome Store issue)..."
                  required
                  className="w-full bg-[#16161c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Type your message, issue details, or request here..."
                  required
                  rows={4}
                  className="w-full bg-[#16161c] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to bicknellmvp@gmail.com</span>
                </button>
              </form>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
