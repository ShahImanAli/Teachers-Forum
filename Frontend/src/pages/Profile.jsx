import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, Calendar, MapPin, Briefcase, Camera, Loader2, X, Check } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const { auth, updateUser } = useAuth();
  const user = auth.user;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  if (!user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.patch("/api/v1/users/update-account", formData, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        updateUser(response.data.data);
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="relative mb-8">
          <div className="h-48 w-full bg-neutral-800/10 rounded-3xl blur-2xl absolute -top-4 inset-x-0"></div>
          <div className="relative bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10">
              <div className="relative group">
                <div className="h-32 w-32 rounded-2xl bg-neutral-800 flex items-center justify-center text-4xl font-bold border-4 border-black shadow-2xl relative overflow-hidden">
                  {user.fullName?.[0] || user.username?.[0]}
                </div>

              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold tracking-tight mb-1">{user.fullName}</h1>
                <p className="text-neutral-400">@{user.username}</p>
              </div>

              <div className="flex gap-3">
                {!isEditing ? (
                  <button 
                    onClick={() => {
                      setFormData({
                        fullName: user.fullName,
                        email: user.email,
                      });
                      setIsEditing(true);
                    }}
                    className="px-6 py-2 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all active:scale-95"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="p-2 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-6">
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User size={20} className="text-white" />
              Personal Information
            </h2>
            
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-neutral-500 text-sm uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-neutral-500/50 transition-all font-medium"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-neutral-500 text-sm uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-neutral-500/50 transition-all font-medium"
                        placeholder="Email Address"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-neutral-500 text-sm mb-1 uppercase tracking-wider">Email Address</p>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-neutral-400" />
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm mb-1 uppercase tracking-wider">Username</p>
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-neutral-400" />
                    <p className="font-medium">@{user.username}</p>
                  </div>
                </div>
                <div>
                  <p className="text-neutral-500 text-sm mb-1 uppercase tracking-wider">Member Since</p>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-neutral-400" />
                    <p className="font-medium">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
