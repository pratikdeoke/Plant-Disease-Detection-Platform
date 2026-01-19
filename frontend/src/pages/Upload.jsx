import React, { useState } from "react";
import API from "../api/api";
import { Upload as UploadIcon, FileImage, ShieldCheck, Loader2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await API.post("/predictions", formData);
      setResult(res.data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('https://wallpapers.com/images/high/dark-green-aesthetic-pictures-uou9ngc9wgk36u5s.webp')" }}>
      <div className="min-h-screen bg-black/40 backdrop-brightness-75 pt-16 px-6 pb-24">
        <main className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
                  <span className="text-emerald-500 underline decoration-emerald-500/30">Plant Diagnostics</span>
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                  Identify crop diseases instantly using our advanced computer vision model. 
                  Keep your plants healthy with precision data.
                </p>
              </div>

              <Card className="bg-black/40 border-white/10 backdrop-blur-xl text-white overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-white/5 bg-white/5">
                  <CardTitle className="text-sm font-semibold uppercase tracking-widest text-emerald-500">Diagnostic Engine</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={`relative group border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center min-h-[300px] ${
                        preview ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/20 hover:border-emerald-500/40 hover:bg-white/5'
                      }`}>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileChange} accept="image/*" />
                      {preview ? (
                        <img src={preview} alt="Leaf Preview" className="w-full h-64 object-contain rounded-lg" />
                      ) : (
                        <div className="text-center">
                          <UploadIcon className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                          <p className="text-lg font-medium">Click to browse leaf image</p>
                        </div>
                      )}
                    </div>
                    <Button type="submit" disabled={!file || loading} className="w-full bg-emerald-600 hover:bg-emerald-500 h-14 text-lg">
                      {loading ? <Loader2 className="animate-spin" /> : "Run Diagnosis"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-5 pt-4">
              {result && (
                <Card className="bg-emerald-950/20 border-emerald-500/30 backdrop-blur-2xl text-white shadow-2xl animate-in fade-in zoom-in-95">
                  <CardHeader>
                    <Badge className="w-fit bg-emerald-500 mb-4 px-3 py-1 text-xs">DIAGNOSIS COMPLETE</Badge>
                    <CardTitle className="text-4xl font-bold tracking-tight">{result.disease}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-medium tracking-widest uppercase">Confidence Score</span>
                        <span className="text-emerald-400 font-mono text-lg">{result.confidence}%</span>
                      </div>
                      <Progress value={parseFloat(result.confidence)} className="h-2 bg-white/10" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}