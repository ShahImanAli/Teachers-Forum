import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users, Plus, MessageSquare, Clock, ArrowLeft, Send,
  Paperclip, FileText, Image as ImageIcon, ExternalLink, X, Download, Trash2, CheckCircle2
} from "lucide-react";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

function Classroom() {
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Post state
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [isAssignment, setIsAssignment] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [isAddingPost, setIsAddingPost] = useState(false);

  // Submission state
  const [submittingPost, setSubmittingPost] = useState(null); // ID of post being submitted
  const [submissionDescription, setSubmissionDescription] = useState("");

  // Comment state
  const [commentText, setCommentText] = useState({});

  // Shared upload/file state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchClassroomDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/classrooms/${id}`, {
        withCredentials: true,
      });
      setClassroom(response.data.data);
    } catch (error) {
      console.error("Error fetching classroom details:", error);
      toast.error(error.response?.data?.message || "Failed to load classroom");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroomDetails();
  }, [id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      toast.error("You can only upload up to 5 files");
      return;
    }
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!postTitle || !postDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("description", postDescription);
    formData.append("classId", id);
    formData.append("isAssignment", isAssignment);
    if (isAssignment && deadline) {
      formData.append("deadline", deadline);
    }
    selectedFiles.forEach(file => formData.append("attachments", file));

    try {
      await axios.post("/api/v1/classrooms/add-post", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success(isAssignment ? "Assignment assigned!" : "Post added!");
      setPostTitle("");
      setPostDescription("");
      setIsAssignment(false);
      setDeadline("");
      setSelectedFiles([]);
      setIsAddingPost(false);
      fetchClassroomDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add post");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await axios.delete(`/api/v1/classrooms/delete-post/${postId}`, { withCredentials: true });
      toast.success("Post deleted successfully");
      fetchClassroomDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;
    try {
      await axios.post("/api/v1/comments/add", { content: text, postId }, { withCredentials: true });
      setCommentText({ ...commentText, [postId]: "" });
      fetchClassroomDetails();
      toast.success("Comment added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error("Please attach at least one file");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("postId", submittingPost);
    formData.append("description", submissionDescription);
    selectedFiles.forEach(file => formData.append("attachments", file));

    try {
      await axios.post("/api/v1/assignments/submit", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Task uploaded successfully!");
      setSubmissionDescription("");
      setSelectedFiles([]);
      setSubmittingPost(null);
      fetchClassroomDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload task");
    } finally {
      setUploading(false);
    }
  };

  const handleLeaveClassroom = async () => {
    if (!window.confirm("Are you sure you want to leave this classroom?")) return;
    try {
      await axios.post(`/api/v1/classrooms/leave-classroom/${id}`, {}, { withCredentials: true });
      toast.success("Left classroom successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave classroom");
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes("image")) return <ImageIcon size={18} className="text-orange-500" />;
    return <FileText size={18} className="text-blue-500" />;
  };

  if (loading) return <Loader />;
  if (!classroom) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 md:mb-8 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-5 md:p-8 mb-8 md:mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-neutral-800 border border-neutral-700 rounded-2xl md:rounded-3xl flex items-center justify-center text-white font-bold text-2xl md:text-3xl shrink-0">
                  {classroom.name[0]}
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{classroom.name}</h1>
                  <p className="text-neutral-400 text-sm md:text-lg">{classroom.description}</p>
                </div>
              </div>
              <div className="flex w-full sm:w-auto gap-3 md:gap-4">
                <div className="flex-1 sm:flex-none bg-neutral-800 border border-neutral-700 rounded-xl md:rounded-2xl p-3 md:p-4 text-center min-w-20 md:min-w-25">
                  <p className="text-neutral-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Students</p>
                  <div className="flex items-center justify-center gap-1.5 md:gap-2 text-lg md:text-xl font-bold">
                    <Users size={16} className="text-neutral-400" /> {classroom.students?.length || 0}
                  </div>
                </div>
                <div className="flex-1 sm:flex-none bg-neutral-800 border border-neutral-700 rounded-xl md:rounded-2xl p-3 md:p-4 text-center min-w-20 md:min-w-25">
                  <p className="text-neutral-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Posts</p>
                  <div className="flex items-center justify-center gap-1.5 md:gap-2 text-lg md:text-xl font-bold">
                    <MessageSquare size={16} className="text-neutral-400" /> {classroom.posts?.length || 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-800 pt-5 md:pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 font-bold shrink-0">
                  {classroom.owner?.fullName?.[0]}
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Teacher</p>
                  <p className="text-sm font-semibold text-neutral-300">{classroom.owner?.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {auth.user?.role === "teacher" && (
                  <div className="w-full sm:w-auto bg-neutral-800/50 px-4 py-2 rounded-xl border border-neutral-700 text-center">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Join Code</p>
                    <p className="text-base md:text-lg font-mono font-bold text-white tracking-widest">{classroom.joinCode}</p>
                  </div>
                )}
                {auth.user?.role === "student" && (
                  <button onClick={handleLeaveClassroom} className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl border border-red-500/20 transition-all font-bold text-sm">
                    Leave Classroom
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3">
              <MessageSquare className="text-white" size={24} />
              Classroom Feed
            </h2>
            {auth.user?.role === "teacher" && (
              <button onClick={() => setIsAddingPost(!isAddingPost)} className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${isAddingPost ? 'bg-neutral-800 text-white border border-neutral-700' : 'bg-white text-black'}`}>
                {isAddingPost ? "Cancel" : "Add Post"} {!isAddingPost && <Plus size={20} />}
              </button>
            )}

          </div>

          {isAddingPost && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 animate-in fade-in slide-in-from-top-4">

              <form onSubmit={handleAddPost} className="space-y-4">
                <input type="text" placeholder="Post Title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors" />
                <textarea placeholder="Write an announcement or assignment instructions..." value={postDescription} onChange={(e) => setPostDescription(e.target.value)} rows="4" className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors resize-none" />

                <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`h-5 w-5 rounded border ${isAssignment ? 'bg-white border-white text-black' : 'border-neutral-600'} flex items-center justify-center transition-all`}>
                      {isAssignment && <CheckCircle2 size={14} />}
                    </div>
                    <input type="checkbox" className="hidden" checked={isAssignment} onChange={() => setIsAssignment(!isAssignment)} />
                    <span className={`text-sm font-bold ${isAssignment ? 'text-white' : 'text-neutral-500'} transition-colors`}>Assign as Task?</span>
                  </label>


                  {isAssignment && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                      <Clock size={16} className="text-neutral-500" />
                      <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-neutral-800 border border-neutral-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-neutral-500" />
                    </div>
                  )}

                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700 text-xs">
                        {getFileIcon(f.type)} {f.name} <button type="button" onClick={() => removeFile(i)} className="text-neutral-500 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white cursor-pointer w-fit"><Paperclip size={18} /><span>Attach Files</span><input type="file" multiple onChange={handleFileChange} className="hidden" /></label>
                </div>
                <button type="submit" disabled={uploading} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-all active:scale-95 shadow-lg disabled:opacity-50">
                  {uploading ? (isAssignment ? "Assigning..." : "Posting...") : (isAssignment ? "Assign Task" : "Post Announcement")}
                </button>

              </form>
            </div>
          )}

          {classroom.posts?.length === 0 ? (
            <div className="bg-neutral-900/50 border-2 border-dashed border-neutral-800 rounded-3xl p-16 flex flex-col items-center justify-center text-neutral-500">No activity yet.</div>
          ) : (
            <div className="space-y-8">
              {classroom.posts.map((post) => (
                <div key={post._id} className={`bg-neutral-900 border ${post.isAssignment ? 'border-neutral-800 bg-orange-500/2' : 'border-neutral-800'} rounded-3xl p-8 relative overflow-hidden group`}>

                  {post.isAssignment && (
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-orange-500 text-black text-[10px] font-extrabold uppercase tracking-widest rounded-bl-2xl">
                      Task
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${post.isAssignment ? 'bg-orange-500/10 text-orange-500' : 'bg-neutral-800 text-white'}`}>
                        {post.isAssignment ? <CheckCircle2 size={24} /> : <MessageSquare size={24} />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{post.title}</h3>
                        <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          {post.isAssignment && post.deadline && (
                            <span className="flex items-center gap-1 text-orange-500">
                              <Clock size={12} /> Due: {new Date(post.deadline).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {auth.user?.role === "teacher" && (
                      <button onClick={() => handleDeletePost(post._id)} className="p-2 text-neutral-600 hover:text-red-500 bg-neutral-800 rounded-xl transition-all"><Trash2 size={16} /></button>
                    )}
                  </div>

                  <p className="text-neutral-300 whitespace-pre-wrap mb-8 leading-relaxed">{post.description}</p>

                  {post.attachments?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {post.attachments.map((file, idx) => (
                        <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-xl border border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600 transition-all group/file">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-neutral-900 rounded-lg">{getFileIcon(file.fileType)}</div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium truncate max-w-37.5">{file.name || "Attachment"}</p>
                              <p className="text-[10px] text-neutral-500 uppercase">{file.fileType}</p>
                            </div>
                          </div>
                          <Download size={16} className="text-neutral-600 group-hover/file:text-white" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Submission Section for Students */}
                  {post.isAssignment && (
                    <div className="mb-8 pt-8 border-t border-neutral-800/50">
                      {auth.user?.role === "teacher" ? (
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">Submissions ({post.submissions?.length || 0})</h4>
                          <div className="space-y-3 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                            {post.submissions?.map((submission) => (
                              <div key={submission._id} className="bg-neutral-800/20 border border-neutral-800/50 p-4 rounded-2xl">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-neutral-700 text-[10px] font-bold">{submission.studentId?.fullName?.[0]}</div>
                                    <div>
                                      <p className="text-xs font-bold">{submission.studentId?.fullName}</p>
                                      <p className="text-[10px] text-neutral-600">{new Date(submission.createdAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                                {submission.description && <p className="text-xs text-neutral-400 mb-4">{submission.description}</p>}
                                <div className="flex flex-wrap gap-2">
                                  {submission.attachments?.map((file, idx) => (
                                    <a key={idx} href={file.url} target="_blank" className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-lg text-[10px] hover:bg-neutral-800 border border-neutral-800 transition-colors">
                                      {getFileIcon(file.fileType)} {file.name}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {post.submissions?.length === 0 && <p className="text-xs text-neutral-600 italic">No submissions yet.</p>}
                          </div>
                        </div>
                      ) : (
                        <div className="p-1">
                          {post.submissions?.some(s => (s.studentId?._id || s.studentId) === auth.user?._id) ? (
                            <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                                  <CheckCircle2 size={24} />
                                </div>
                                <div>
                                  <p className="text-orange-500 font-extrabold">Task Uploaded</p>
                                  <p className="text-xs text-neutral-500">Success! Your submission is pending review.</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              {submittingPost === post._id ? (
                                <div className="bg-neutral-800/30 border border-neutral-700/50 p-6 rounded-3xl animate-in zoom-in-95 duration-200">
                                  <h5 className="font-bold mb-6 flex items-center gap-2 text-orange-500"><Plus size={18} /> Upload Your Task</h5>
                                  <form onSubmit={handleSubmitTask} className="space-y-5">
                                    <textarea placeholder="Notes for teacher (optional)..." value={submissionDescription} onChange={(e) => setSubmissionDescription(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 text-sm p-4 rounded-2xl h-24 resize-none focus:outline-none focus:border-neutral-600" />
                                    <div className="space-y-4">
                                      <div className="flex flex-wrap gap-2">
                                        {selectedFiles.map((f, i) => (
                                          <div key={i} className="flex items-center gap-2 bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-800 text-[10px]">
                                            {getFileIcon(f.type)} {f.name}
                                            <button type="button" onClick={() => removeFile(i)} className="text-neutral-500 hover:text-red-500 transition-colors"><X size={14} /></button>
                                          </div>
                                        ))}
                                      </div>
                                      <label className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-orange-500 cursor-pointer transition-colors w-fit border border-neutral-800 px-4 py-2 rounded-xl bg-neutral-900/50">
                                        <Paperclip size={16} />
                                        <span>Attach Task Files</span>
                                        <input type="file" multiple onChange={handleFileChange} className="hidden" />
                                      </label>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                      <button type="submit" disabled={uploading} className="flex-1 bg-white text-black font-extrabold py-3 rounded-2xl hover:bg-neutral-200 transition-all shadow-lg active:scale-95 disabled:bg-neutral-800 disabled:text-neutral-500">
                                        {uploading ? "Uploading..." : "Submit Task"}
                                      </button>

                                      <button type="button" onClick={() => { setSubmittingPost(null); setSelectedFiles([]); }} className="px-8 py-3 bg-neutral-800 text-white font-extrabold rounded-2xl hover:bg-neutral-700 transition-all border border-neutral-700">Cancel</button>
                                    </div>
                                  </form>
                                </div>
                              ) : (
                                <button onClick={() => setSubmittingPost(post._id)} className="w-full bg-white text-black font-extrabold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
                                  <Plus size={20} /> Upload Task
                                </button>
                              )}

                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comments Section */}
                  <div className="mt-8 pt-8 border-t border-neutral-800/50 space-y-6">
                    <h4 className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={14} /> Comments ({post.comments?.length || 0})
                    </h4>
                    <div className="space-y-5">
                      {post.comments?.map((comment) => (
                        <div key={comment._id} className="flex gap-4 group/comment">
                          <div className="h-9 w-9 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700 text-xs font-bold text-neutral-400 group-hover/comment:border-neutral-500 transition-colors">
                            {comment.createdBy?.fullName?.[0]}
                          </div>
                          <div className="flex-1 bg-neutral-800/30 p-4 rounded-2xl border border-transparent hover:border-neutral-800 transition-all">
                            <div className="flex items-center gap-3 mb-1.5">
                              <span className="text-xs font-bold text-white">{comment.createdBy?.fullName}</span>
                              <span className="text-[9px] text-neutral-600 font-mono italic">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-neutral-400 leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6 bg-neutral-900 border border-neutral-800 p-2 rounded-2xl focus-within:border-neutral-600 transition-all">
                      <input
                        type="text"
                        placeholder="Share your thoughts..."
                        value={commentText[post._id] || ""}
                        onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(post._id)}
                        className="flex-1 bg-transparent text-sm rounded-xl px-4 py-2 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        disabled={!commentText[post._id]?.trim()}
                        className="bg-white text-black p-2.5 rounded-xl transition-all active:scale-90 disabled:opacity-20 shadow-md"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Classroom;
