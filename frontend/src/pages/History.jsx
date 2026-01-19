import { useEffect, useState } from "react";
import API from "../api/api";
import { 
  History as HistoryIcon, 
  Calendar, 
  Search, 
  FileSpreadsheet, 
  ArrowUpRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    API.get("/predictions/my")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Error fetching history:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredHistory = history.filter((item) =>
    item.disease.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConfidenceColor = (conf) => {
    const val = parseFloat(conf);
    if (val >= 90) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (val >= 70) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  return (
    <div className="w-full pt-12 px-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <HistoryIcon className="text-emerald-500 w-8 h-8" />
              Diagnosis <span className="text-emerald-500 italic">History</span>
            </h1>
            <p className="text-gray-400 mt-2">Track and review all your previous plant health scans.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search diseases..." 
              className="pl-10 bg-black/40 border-white/10 text-white focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl text-white overflow-hidden shadow-2xl">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Recent Scans</CardTitle>
                <CardDescription className="text-gray-500 text-xs uppercase tracking-widest mt-1">
                  Total Records: {filteredHistory.length}
                </CardDescription>
              </div>
              <FileSpreadsheet className="text-emerald-500/50 w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-gray-500 text-sm animate-pulse">Retrieving your archives...</p>
              </div>
            ) : filteredHistory.length > 0 ? (
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Date</TableHead>
                    <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Identified Disease</TableHead>
                    <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Confidence</TableHead>
                    <TableHead className="text-right text-gray-400 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item, index) => (
                    <TableRow 
                      key={item.id || index} 
                      className="border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <TableCell className="font-medium text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500/60" />
                          {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-semibold capitalize tracking-tight">
                        {item.disease}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getConfidenceColor(item.confidence)} font-mono`}>
                          {item.confidence}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <button className="text-emerald-500 hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-emerald-500/10">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-white/5 p-4 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-white font-medium">No records found</h3>
                <p className="text-gray-500 text-sm mt-1">Start by uploading your first leaf image for analysis.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Tip */}
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <div className="bg-emerald-500/20 p-2 rounded-lg">
             <AlertCircle className="text-emerald-500 w-5 h-5" />
           </div>
           <div>
             <h4 className="text-emerald-400 font-bold text-sm">Pro Tip</h4>
             <p className="text-gray-400 text-sm leading-relaxed mt-1">
               Compare periodic scans of the same plant to track how disease treatment is progressing over time. 
               Early detection is the key to crop safety.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}