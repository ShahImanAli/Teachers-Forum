import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search as SearchIcon, Users, ShieldCheck, LogIn, Check } from "lucide-react";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

function Search() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joiningId, setJoiningId] = useState(null); 
  const [code, setCode] = useState("");
  const { auth } = useAuth();
  
  const location = useLocation();
  
  const query = new URLSearchParams(location.search).get("q");

  const fetchResults = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/classrooms/search?query=${query}`, {
        withCredentials: true,
      });
      setResults(response.data.data);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query]);

  const handleJoin = async (classroomId) => {
    if (!code) {
      toast.error("Please enter the join code");
      return;
    }
    try {
      const response = await axios.post(
        "/api/v1/classrooms/join",
        { code },
        { withCredentials: true }
      );
      toast.success("Joined classroom successfully!");
      
      const joinedClassroom = response.data.data;
      setResults(results.map(cls => 
        cls._id === joinedClassroom._id ? joinedClassroom : cls
      ));
      
      setCode("");
      setJoiningId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid join code");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <SearchIcon className="text-white" />
          Results for "{query}"
        </h1>

        {results.length === 0 ? (
          <div className="bg-neutral-900/50 border-2 border-dashed border-neutral-800 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold mb-2">No classrooms found</h3>
            <p className="text-neutral-500 max-w-sm">
              We couldn't find any classrooms matching your search. Try a different term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((classroom) => (
              <div 
                key={classroom._id} 
                className="group relative bg-neutral-900 border border-neutral-800 rounded-3xl p-1 overflow-hidden transition-all hover:bg-neutral-800/50"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                      {classroom.name[0]}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{classroom.name}</h3>
                  <p className="text-neutral-400 text-sm mb-6 line-clamp-2">{classroom.description}</p>

                  <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
                    <div className="flex items-center gap-2">
                       <p className="text-xs font-semibold text-neutral-300">By {classroom.owner?.fullName}</p>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Users size={16} />
                      <span className="text-sm font-medium">{classroom.students?.length || 0}</span>
                    </div>
                  </div>

                  {joiningId === classroom._id ? (
                    <div className="mt-6 space-y-3">
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={18} />
                        <input 
                          type="text"
                          placeholder="Enter 6-digit Code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-neutral-500"
                        />
                      </div>
                      <button 
                        onClick={() => handleJoin(classroom._id)}
                        className="w-full py-3 bg-white text-black font-bold rounded-xl active:scale-95 transition-all"
                      >
                        Verify & Join
                      </button>
                      <button 
                        onClick={() => { setJoiningId(null); setCode(""); }}
                        className="w-full py-2 text-neutral-500 text-sm hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        if (classroom.students?.includes(auth.user._id)) {
                           toast.info("You are already a member");
                        } else if (auth.user?.role === "teacher") {
                           toast.error("Teachers cannot join classrooms as students");
                        } else {
                           setJoiningId(classroom._id);
                        }
                      }}
                      disabled={classroom.students?.includes(auth.user._id)}
                      className="w-full mt-6 py-3 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg disabled:bg-neutral-900 disabled:text-neutral-600"
                    >


                      {classroom.students?.includes(auth.user._id) ? (
                        <>Joined <Check size={18} /></>
                      ) : (
                        <>Join with Code <LogIn size={18} /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
