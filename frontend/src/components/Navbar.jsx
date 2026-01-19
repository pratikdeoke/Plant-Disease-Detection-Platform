import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sprout, History, Users, LogIn, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload(); 
  };

  const navLinks = [
    { name: "Predict", path: "/", icon: Sprout },
    { name: "History", path: "/history", icon: History },
    { name: "Community", path: "/community", icon: Users },
  ];

  return (
    <nav className="w-full border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Sprout className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-white tracking-tighter text-xl uppercase italic">
              Plant<span className="text-emerald-500"> Disease</span>
            </span>
            <span className="font-bold text-white tracking-tighter text-xl uppercase italic">
              Detection<span className="text-emerald-500"> System</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive(link.path) 
                    ? "text-emerald-400 bg-emerald-500/10" 
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            
            <div className="ml-4 pl-4 border-l border-white/10">
              {token ? (
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#05110d] border-white/10 text-white">
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.path} to={link.path} className="flex items-center gap-3 text-lg">
                      <link.icon className="w-5 h-5 text-emerald-500" />
                      {link.name}
                    </Link>
                  ))}
                  <hr className="border-white/10" />
                  {token ? (
                    <button onClick={handleLogout} className="flex items-center gap-3 text-lg text-red-400">
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  ) : (
                    <Link to="/login" className="flex items-center gap-3 text-lg text-emerald-400">
                      <LogIn className="w-5 h-5" /> Login
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}