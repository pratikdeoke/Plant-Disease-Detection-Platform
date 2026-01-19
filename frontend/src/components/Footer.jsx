import { Sprout, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Sprout className="text-emerald-500 w-5 h-5 flex-shrink-0" />
            <span className="text-white font-semibold tracking-tight uppercase text-[10px] sm:text-xs italic leading-tight">
              Plant Disease <br className="xs:hidden md:block lg:hidden" /> Detection System
            </span>
          </div>
          
          <p className="text-gray-500 text-[10px] sm:text-xs text-center order-last md:order-none">
            © {new Date().getFullYear()} PlantCare. All rights reserved.
          </p>

          <div className="flex items-center gap-6 justify-center md:justify-end">
            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}