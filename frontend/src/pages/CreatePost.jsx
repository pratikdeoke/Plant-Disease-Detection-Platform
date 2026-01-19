import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { PenLine, Send, X, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/discussions/posts", form);
      navigate("/community");
    } catch (err) {
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-2xl bg-black/40 border-white/10 backdrop-blur-xl text-white shadow-2xl">
        <CardHeader className="border-b border-white/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <PenLine className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Create Discussion</CardTitle>
                <CardDescription className="text-gray-400">Ask a question or share a tip</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/community")} className="text-gray-400">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-emerald-500 uppercase text-[10px] tracking-widest font-bold">Title</Label>
              <Input 
                placeholder="e.g., Why are my Monstera leaves turning yellow?" 
                className="bg-white/5 border-white/10 text-white focus:border-emerald-500 h-12 text-lg"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-emerald-500 uppercase text-[10px] tracking-widest font-bold">Content</Label>
              <Textarea 
                placeholder="Describe your issue or share your story..." 
                className="bg-white/5 border-white/10 text-white focus:border-emerald-500 min-h-[200px] resize-none"
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-12 text-lg font-bold gap-2" disabled={loading}>
              <Send className="w-4 h-4" /> {loading ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}