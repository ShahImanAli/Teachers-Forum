import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Users, ArrowRight, Book, Clock, Trash2, LogOut } from "lucide-react";

import Loader from "@/components/Loader";
import { toast } from "react-toastify";

function Home() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get("/api/v1/classrooms/listclassrooms", {
        withCredentials: true,
      });
      setClassrooms(response.data.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleDeleteClassroom = async (e, classroomId) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this classroom? All posts and files will be permanently removed.")) {
      return;
    }

    try {
      await axios.delete(`/api/v1/classrooms/delete-classroom/${classroomId}`, {
        withCredentials: true
      });
      toast.success("Classroom deleted successfully");
      fetchClassrooms(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete classroom");
    }
  };

  const handleLeaveClassroom = async (e, classroomId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to leave this classroom?")) {
      return;
    }

    try {
      await axios.post(`/api/v1/classrooms/leave-classroom/${classroomId}`, {}, {
        withCredentials: true
      });
      toast.success("Left classroom successfully");
      fetchClassrooms();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave classroom");
    }
  };


  if (loading) return <Loader />;


  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Welcome back, <span className="text-white">{auth.user?.fullName?.split(' ')[0]}!</span>
            </h1>
            <p className="text-neutral-400 text-lg">
              {auth.user?.role === "teacher" 
                ? "Manage your classes and inspire your students." 
                : "Continue your learning journey."}
            </p>
          </div>
        </div>

        {/* Classrooms Grid */}
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="p-2 bg-neutral-800 rounded-lg">
            <BookOpen className="text-white" size={20} />
          </span>
          {auth.user?.role === "teacher" ? "Your Classrooms" : "My Joined Classrooms"}
        </h2>

        {classrooms.length === 0 ? (
          <div className="bg-neutral-900/50 border-2 border-dashed border-neutral-800 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6">
               <Book size={40} className="text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No classrooms found</h3>
            <p className="text-neutral-500 max-w-sm">
              {auth.user?.role === "teacher" 
                ? "You haven't created any classrooms yet. Click the + button in the header to get started!" 
                : "You haven't joined any classrooms yet. Use the search bar to find one!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((classroom) => (
              <div 
                key={classroom._id} 
                className="group relative bg-neutral-900 border border-neutral-800 rounded-3xl p-1 overflow-hidden transition-all hover:bg-neutral-800/50"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                      {classroom.name[0]}
                    </div>
                    <div className="flex items-center gap-3">

                       {auth.user?.role === "teacher" && (
                         <button 
                           onClick={(e) => handleDeleteClassroom(e, classroom._id)}
                           className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                           title="Delete Classroom"
                         >
                           <Trash2 size={18} />
                         </button>
                       )}
                       {auth.user?.role === "student" && (
                         <button 
                           onClick={(e) => handleLeaveClassroom(e, classroom._id)}
                           className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                           title="Leave Classroom"
                         >
                           <LogOut size={18} />
                         </button>
                       )}
                    </div>

                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 transition-colors">
                    {classroom.name}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-6 line-clamp-2">
                    {classroom.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
                    <div className="flex items-center gap-2">
                       <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 overflow-hidden">
                          <span className="text-xs font-bold">{classroom.owner?.fullName?.[0] || 'T'}</span>
                       </div>
                       <div>
                          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Teacher</p>
                          <p className="text-xs font-semibold text-neutral-300">{classroom.owner?.fullName || "Teacher"}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Users size={16} />
                      <span className="text-sm font-medium">{classroom.students?.length || 0}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/classroom/${classroom._id}`)}
                    className="w-full mt-6 py-3 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg group-hover:bg-neutral-200"
                  >
                    {auth.user?.role === "teacher" 
                      ? "Manage Class" 
                      : "Enter Class"}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
