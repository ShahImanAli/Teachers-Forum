import React, { useState } from "react";
import { X, Search, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function JoinClassroomModal({ isOpen, onClose, onSuccess }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code) {
      toast.error("Please enter the Join Code");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/v1/classrooms/join",
        { code },
        { withCredentials: true }
      );
      toast.success("Joined classroom successfully!");
      onSuccess();
      onClose();
      setCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Join Code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 py-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-800 border border-neutral-700 rounded-xl">
              <Search size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Join Classroom</h2>
              <p className="text-neutral-400 text-sm">Enter the code shared by your teacher</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Join Code (OTP)</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={18} />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Join Classroom"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinClassroomModal;
