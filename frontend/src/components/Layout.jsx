import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#05110d]">
      <Navbar />
      
      <main 
        className="flex-grow w-full bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://wallpapers.com/images/high/dark-green-aesthetic-pictures-uou9ngc9wgk36u5s.webp')" }}
      >
        <div className="w-full h-full bg-black/50 backdrop-blur-[1px] flex flex-col">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}