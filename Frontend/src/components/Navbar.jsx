import { useState } from "react";
import { Menu, X, User, LogOut, Search, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import CreateClassroomModal from "./CreateClassroomModal";
import JoinClassroomModal from "./JoinClassroomModal";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className=" bg-black border-b border-neutral-800">
      <div className="w-full px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/">
              <img
                src={logo}
                alt="Teacher Forum Logo"
                className="h-50 w-20 object-contain"
              />
            </Link>

            {/* <Link to="/" className="text-white font-bold text-lg md:text-xl tracking-wide transition-colors">
              TEACHER-FORUM
            </Link> */}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search classrooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-neutral-900 text-white pl-10 pr-4 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {auth.user ? (
                <>
                  <div className="flex items-center space-x-6">
                    {auth.user.role === "teacher" ? (
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 bg-white text-black rounded-xl transition-all hover:scale-110 active:scale-95 shadow-md"
                        title="Create Classroom"
                      >
                        <Plus size={20} />
                      </button>

                    ) : (
                      <button
                        onClick={() => setIsJoinModalOpen(true)}
                        className="p-2 bg-white text-black rounded-xl transition-all hover:scale-110 active:scale-95 shadow-md"
                        title="Join Classroom"
                      >
                        <Plus size={20} />
                      </button>

                    )}
                    <div className="flex items-center space-x-2 text-white cursor-pointer hover:text-neutral-400 transition-colors" onClick={() => navigate("/profile")}>
                      <div className="h-8 w-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-neutral-700">
                        <User size={18} />
                      </div>
                      <span className="font-medium">Profile</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-white hover:text-red-400 px-4 py-2 rounded-lg font-medium cursor-pointer"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="text-white hover:text-neutral-300 px-4 py-2 rounded-lg font-medium">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="bg-white text-black hover:bg-neutral-200 px-6 py-2 rounded-lg font-medium">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile actions & menu button */}
          <div className="flex items-center gap-3 md:hidden">
            {auth.user && (
              auth.user.role === "teacher" ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 bg-white text-black rounded-xl transition-all hover:scale-110 active:scale-95 shadow-md"
                  title="Create Classroom"
                >
                  <Plus size={20} />
                </button>
              ) : (
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="p-2 bg-white text-black rounded-xl transition-all hover:scale-110 active:scale-95 shadow-md"
                  title="Join Classroom"
                >
                  <Plus size={20} />
                </button>
              )
            )}
            <button onClick={toggleMenu} className="text-white p-2 rounded-lg">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-y-0 right-0 z-50 w-70 bg-black border-l border-neutral-800 transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-neutral-800">
            <span className="text-white font-bold text-lg">Menu</span>
            <button onClick={toggleMenu} className="text-neutral-400 p-2 rounded-xl hover:bg-neutral-800 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto w-full p-6 space-y-6">

            {/* Search Bar - Mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search classrooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-neutral-900 text-white pl-10 pr-4 py-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-neutral-500 transition-all text-sm"
              />
            </div>

            {auth.user ? (
              <div className="space-y-4">
                <div
                  className="flex items-center space-x-3 text-white p-3 rounded-xl hover:bg-neutral-800 cursor-pointer transition-colors"
                  onClick={() => { navigate("/profile"); setIsMenuOpen(false); }}
                >
                  <div className="h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700 shrink-0">
                    <User size={20} className="text-neutral-300" />
                  </div>
                  <span className="font-bold text-base">Profile</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block">
                  <button className="w-full text-left text-white bg-neutral-800 hover:bg-neutral-700 px-4 py-3 rounded-xl font-medium transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block">
                  <button className="w-full text-left bg-white text-black hover:bg-neutral-200 px-4 py-3 rounded-xl font-medium transition-colors">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Menu Footer / Bottom Section */}
          {auth.user && (
            <div className="p-6 border-t border-neutral-800 mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full text-left text-white hover:bg-neutral-800 p-3 rounded-xl hover:text-red-400 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Overlay for mobile menu */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Modals */}
        <CreateClassroomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => window.location.reload()}
        />
        <JoinClassroomModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      </div>
    </nav>
  );
}

export default Navbar;
