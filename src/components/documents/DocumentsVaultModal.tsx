import React, { useState } from 'react';
import { X, FileText, Plus, ShieldCheck, AlertTriangle, Trash2, Eye } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';

interface DocumentsVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentsVaultModal: React.FC<DocumentsVaultModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { documents, addDocument, deleteDocument, vehicles, activeVehicle } = useGarage();

  const [isAdding, setIsAdding] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    activeVehicle?.id || vehicles[0]?.id || ''
  );
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<any>('RC');
  const [fileNumber, setFileNumber] = useState('');
  const [issueDate, setIssueDate] = useState('2024-02-15');
  const [expiryDate, setExpiryDate] = useState('2026-10-26');
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      vehicleId: selectedVehicleId,
      title: title || `${docType} Document`,
      docType,
      fileNumber: fileNumber || `DOC-${Date.now().toString().slice(-6)}`,
      issueDate,
      expiryDate,
      verified: true,
      previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    });
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 text-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Digital Documents Vault</h3>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'View Vault' : 'Upload Doc'}</span>
          </button>
        </div>

        {/* Warning Banners from Prompt */}
        <div className="space-y-2 mb-4">
          <div className="p-2.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-2 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>⚠️ Insurance expires in 18 days (26 Oct 2026).</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-2 text-xs text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>⚠️ PUC expires in 9 days (17 Oct 2026). Renew at any nearby fuel station.</span>
          </div>
        </div>

        {isAdding ? (
          <form onSubmit={handleAdd} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 mb-1 block">Vehicle</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.registrationNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 mb-1 block">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="RC">RC (Smart Card)</option>
                  <option value="Insurance">Insurance Policy</option>
                  <option value="PUC">PUC Certificate</option>
                  <option value="Driving Licence">Driving Licence</option>
                  <option value="Service Record">Service Invoice</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Document Number</label>
                <input
                  type="text"
                  required
                  value={fileNumber}
                  onChange={(e) => setFileNumber(e.target.value)}
                  placeholder="e.g. KA01202400981"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 mb-1 block">Document Title / Provider</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ICICI Lombard Comprehensive Policy"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 mb-1 block">Issue Date</label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-2xl text-xs transition"
            >
              Upload & Secure in Vault
            </button>
          </form>
        ) : (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Active Documents ({documents.length})
            </h4>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">{doc.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">No: {doc.fileNumber}</span>
                    {doc.expiryDate && (
                      <span className="text-[10px] text-amber-400 block">Expires: {doc.expiryDate}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900"
                    title="View Document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg bg-slate-900"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Document Preview Modal */}
        {previewDoc && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">{previewDoc.title}</span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white text-[11px]"
              >
                Close Preview
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800 h-40">
              <img
                src={previewDoc.previewUrl}
                alt="Document Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Verified Certificate</span>
              <span className="text-emerald-400 font-semibold">Active & Valid</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
