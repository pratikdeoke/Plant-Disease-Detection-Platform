import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import { Users, Plus, MessageSquare, ArrowUpRight, Loader2, Heart, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import formatRelativeTime from "@/components/DateTime";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/discussions/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleToggleLike = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to like posts");

    setPosts((currentPosts) =>
      currentPosts.map((p) => {
        if (p.id === postId) {
          const isCurrentlyLiked = p.is_liked;
          return {
            ...p,
            is_liked: !isCurrentlyLiked,
            total_likes: isCurrentlyLiked 
              ? Math.max(0, Number(p.total_likes) - 1) 
              : Number(p.total_likes) + 1,
          };
        }
        return p;
      })
    );

    try {
      await API.post(`/discussions/posts/${postId}/like`);
    } catch (err) {
      console.error("Like failed, rolling back...", err);
      fetchPosts();
      alert("Something went wrong. Please try again.");
    }
  };

  const handleShare = (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="w-full pt-12 px-6 pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
              <Users className="text-emerald-500 w-8 h-8" />
              PlantCare <span className="text-emerald-500 italic">Community</span>
            </h1>
            <p className="text-gray-400 mt-2">Share knowledge with people.</p>
          </div>

          {localStorage.getItem("token") && (
            <Link to="/create-post">
              <Button className="bg-emerald-600 hover:bg-emerald-500 gap-2">
                <Plus className="w-4 h-4" /> Create Post
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map(post => (
              <Card key={post.id} className="bg-white/5 border-white/10 text-white hover:border-emerald-500/30 transition shadow-xl overflow-hidden">
                <CardHeader className="flex flex-row gap-4">
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarFallback className="bg-emerald-500/10 text-emerald-500 uppercase">
                      {post.name?.[0] || post.title?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Link to={`/post/${post.id}`}>
                      <CardTitle className="text-xl hover:text-emerald-400 transition cursor-pointer line-clamp-1">
                        {post.title}
                      </CardTitle>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium flex items-center gap-2">
                      <span>Posted by <span className="text-emerald-500">{post.name || "Member"}</span></span>
                      <span className="text-gray-600">•</span>
                      <span className="normal-case">{formatRelativeTime(post.created_at)}</span>
                    </p>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-300 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                </CardContent>

                <CardFooter className="border-t border-white/5 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    {/* LIKE BUTTON */}
                    <button 
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-all active:scale-125 ${
                        post.is_liked ? "text-rose-500" : "text-gray-400 hover:text-rose-400"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.is_liked ? "fill-current" : ""}`} />
                      <span className="text-sm font-bold">{Number(post.total_likes) || 0}</span>
                    </button>

                    {/* COMMENT COUNT */}
                    <Link to={`/post/${post.id}`} className="flex items-center gap-1.5 text-gray-400 hover:text-emerald-400 transition-colors group">
                      <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold">{post.total_comments || 0}</span>
                    </Link>

                    {/* SHARE */}
                    <button onClick={() => handleShare(post.id)} className="text-gray-400 hover:text-blue-400 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link to={`/post/${post.id}`}>
                    <Button variant="ghost" className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 text-xs uppercase tracking-widest font-bold">
                      View Discussion <ArrowUpRight className="ml-1 w-3 h-3" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}