import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import { ArrowLeft, MessageSquare, Send, User, Calendar, Loader2, LogIn, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import formatRelativeTime from "@/components/DateTime";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPostData = async () => {
    try {
      const res = await API.get(`/discussions/posts/${id}`);
      console.log("SINGLE POST DATA:", res.data.post);
      setPost(res.data.post);
      setComments(res.data.comments);
      setTotalComments(Number(res.data.total_comments));
    } catch (err) {
      console.error("Error fetching post:", err);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [id]);

  const handleToggleLike = async () => {
    const isCurrentlyLiked = post.is_liked;
    
    setPost({
      ...post,
      is_liked: !isCurrentlyLiked,
      total_likes: isCurrentlyLiked ? Number(post.total_likes) - 1 : Number(post.total_likes) + 1
    });

    try {
      await API.post(`/discussions/posts/${id}/like`);
    } catch (err) {
      fetchPostData(); // rollback
    }
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await API.post(`/discussions/posts/${id}/comments`, { content: comment });
      setComment("");
      fetchPostData();
    } catch (err) {
      alert("Error adding comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full pt-12 px-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link to="/community">
          <Button variant="ghost" className="text-gray-400 hover:text-white gap-2 pl-0">
            <ArrowLeft className="w-4 h-4" /> Back to Community
          </Button>
        </Link>

        {/* Post Content */}
        <article className="space-y-6">
          <div className="space-y-4">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              DISCUSSION
            </Badge>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <User className="w-4 h-4 text-emerald-500" /> {post.name || "Community Member"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> 
                  {post.created_at ? formatRelativeTime(post.created_at) : "Loading..."}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied!");
                  }}
                  className="border-white/10 text-gray-400 hover:text-white bg-white/5"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>

                <button 
                  onClick={handleToggleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 border ${
                    post.is_liked 
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                      : "bg-white/5 text-gray-400 border-white/5 hover:border-rose-500/30 hover:text-rose-400"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.is_liked ? "fill-current" : ""}`} />
                  <span className="font-bold text-sm">{Number(post.total_likes) || 0}</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </article>

        {/* Comments Section */}
        <div className="pt-12 space-y-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-white font-bold text-xl italic">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            Comments ({totalComments})
          </div>

          {localStorage.getItem("token") ? (
            <div className="space-y-4">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your thoughts..."
                className="bg-white/5 border-white/10 text-white focus:border-emerald-500 min-h-[120px] resize-none"
              />
              <div className="flex justify-end">
                <Button
                  onClick={addComment}
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-500 gap-2 px-8"
                >
                  {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                  Post Comment
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-4">You must be logged in to participate.</p>
              <Link to="/login">
                <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 gap-2">
                  <LogIn className="w-4 h-4" /> Login to Comment
                </Button>
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {comments.map(c => (
              <div key={c.id} className="flex gap-4 group">
                <Avatar className="h-9 w-9 border border-white/10">
                  <AvatarFallback className="bg-white/5 text-gray-400 uppercase text-xs">
                    {c.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-emerald-500/20 transition-colors">
                  <div className="text-xs font-bold text-emerald-500 mb-1 uppercase tracking-wider">
                    {c.name || "Gardener"}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}