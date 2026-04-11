import React, { useState } from "react";
import { X, Plus, BookOpen, FileText, Copy, Check, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function CreateClassroomModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdClass, setCreatedClass] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/v1/classrooms/create",
        { name, description },
        { withCredentials: true }
      );
      toast.success("Classroom created successfully!");
      setCreatedClass(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create classroom");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
    toast.info("Copied to clipboard!");
  };

  const handleDone = () => {
    onSuccess(createdClass);
    onClose();
    setName("");
    setDescription("");
    setCreatedClass(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Success View */}
        {createdClass ? (
          <div className="p-8 text-center space-y-6">
            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check size={40} className="text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Classroom Ready!</h2>
              <p className="text-neutral-400">Share these details with your students</p>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 text-left relative overflow-hidden group">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Join Code (OTP)</p>
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={24} className="text-white" />
                    <span className="text-3xl font-black tracking-[0.2em] text-white selection:bg-neutral-700">{createdClass.joinCode}</span>
                  </div>
                  <button onClick={() => copyToClipboard(createdClass.joinCode, 'code')} className="p-3 bg-neutral-700/50 hover:bg-neutral-700 rounded-xl transition-all text-neutral-400 hover:text-white group-hover:scale-110 active:scale-95 shadow-lg">
                    {copiedCode ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                </div>
                <div className="absolute top-0 right-0 h-full w-24 bg-linear-to-l from-white/5 to-transparent pointer-events-none"></div>
              </div>
              <p className="text-sm text-neutral-500 italic">Students only need this code to join your classroom.</p>
            </div>

            <button
              onClick={handleDone}
              className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-4 rounded-xl transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        ) : (
          /* Create Form View */
          <>
            <div className="px-6 py-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-800 border border-neutral-700 rounded-xl">
                  <Plus size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create Classroom</h2>
                  <p className="text-neutral-400 text-sm">Start a new learning journey</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1 flex items-center gap-2">
                  <BookOpen size={16} className="text-neutral-400" />
                  Classroom Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Advanced Physics 101"
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1 flex items-center gap-2">
                  <FileText size={16} className="text-neutral-400" />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this classroom is about..."
                  rows="4"
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-700 disabled:text-neutral-500 font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Classroom
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateClassroomModal;
