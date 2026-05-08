"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // State baru untuk mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  const contents = [
    { title: "Kata Nama", page: 1 },
    { title: "Kata Nama Am", page: 2 },
    { title: "Kata Nama Khas", page: 4 },
    { title: "Kata Ganti Nama", page: 5 },
    { title: "Kata Kerja", page: 7 },
    { title: "Kata Adjektif", page: 11 },
    { title: "Kata Tugas", page: 22 },
    { title: "Kata Ganda", page: 39 },
    { title: "Kata Berimbuhan", page: 44 },
    { title: "Pembentukan Ayat", page: 50 },
    { title: "Peribahasa", page: 64 },
    { title: "Penjodoh Bilangan", page: 89 },
    { title: "Polisemi", page: 95 },
    { title: "Sinonim", page: 100 },
    { title: "Antonim", page: 104 },
  ];

  const handleSearch = async () => {
    if (!search) return;

    setAiResult("Sedang berfikir...");
    setIsSearching(true);

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "Anda ialah guru Bahasa Melayu profesional. Jawab dalam Bahasa Melayu mudah faham.",
            },
            {
              role: "user",
              content: search,
            },
          ],
        }),
      });

      const data = await response.json();
      setAiResult(data.choices[0].message.content);
    } catch (error) {
      setAiResult("Ralat AI Search. Sila cuba lagi.");
    } finally {
      setIsSearching(false);
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen bg-[#f5f7fb] flex items-center justify-center p-4 md:p-6 ${poppins.className}`}>
        <div className="w-full max-w-6xl overflow-hidden rounded-[30px] md:rounded-[40px] bg-white shadow-2xl grid lg:grid-cols-2 border border-zinc-100">
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-12 lg:p-16 text-white relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm backdrop-blur-md border border-white/10">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Portal Pembelajaran Interaktif
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                SISTEM
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  BAHASA
                </span>
              </h1>
              <p className="mt-6 max-w-md text-base lg:text-lg leading-relaxed text-slate-300">
                Platform rujukan Bahasa Melayu moden untuk murid dan guru. Dikuasakan oleh AI.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:gap-6 relative z-10">
              <div className="rounded-3xl bg-white/10 p-5 lg:p-7 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition duration-300">
                <h3 className="text-3xl lg:text-4xl font-black text-blue-300">104</h3>
                <p className="mt-2 text-xs lg:text-sm font-medium text-slate-300">Muka surat nota</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 lg:p-7 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition duration-300">
                <h3 className="text-3xl lg:text-4xl font-black text-cyan-300">AI</h3>
                <p className="mt-2 text-xs lg:text-sm font-medium text-slate-300">Carian Pintar</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 lg:p-20 bg-white">
            <div className="w-full max-w-md">
              <div className="mb-10 lg:mb-12 text-center lg:text-left">
                <div className="lg:hidden mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-black text-white shadow-lg mb-6">
                  SB
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-zinc-900 tracking-tight">
                  Selamat Datang
                </h2>
                <p className="mt-3 lg:mt-4 text-zinc-500 leading-relaxed text-base lg:text-lg">
                  Log masuk menggunakan akaun Google untuk mengakses sistem pembelajaran premium.
                </p>
              </div>

              <button
                onClick={signInWithGoogle}
                className="group flex w-full items-center justify-center gap-4 rounded-2xl bg-zinc-900 px-6 py-4 text-base lg:text-lg font-bold text-white hover:bg-blue-600 transition-all duration-300 shadow-lg"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="h-6 w-6 lg:h-7 lg:w-7 bg-white rounded-full p-1"
                  alt="Google Logo"
                />
                Log Masuk Google
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f8fafc] text-zinc-800 ${poppins.className} flex flex-col`}>
      {/* NAVBAR */}
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4 px-4 md:px-6 py-3 md:py-4">
          
          <div className="flex items-center justify-between w-full md:w-auto md:min-w-[260px]">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Butang Menu Mobile */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-base md:text-lg font-black text-white shadow-md">
                SB
              </div>
              <div className="hidden sm:block md:block">
                <h1 className="text-lg md:text-xl font-black tracking-tight text-zinc-900 leading-none">
                  Sistem Bahasa
                </h1>
                <p className="text-xs text-zinc-500 mt-1 font-medium hidden md:block">
                  Hi, {user.displayName?.split(" ")[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <img src={user.photoURL || "/avatar.png"} className="h-8 w-8 rounded-full border border-zinc-200" alt="User" />
            </div>
          </div>

          {/* Search Bar - Full width on mobile */}
          <div className="flex flex-1 items-center justify-center w-full">
            <div className="flex w-full max-w-2xl overflow-hidden rounded-full border border-zinc-200 bg-zinc-50/50 shadow-inner focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tanya AI tatabahasa..."
                className="w-full bg-transparent px-4 md:px-6 py-2.5 md:py-3 text-sm outline-none placeholder:text-zinc-400"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-zinc-900 px-5 md:px-8 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-70"
              >
                {isSearching ? "Cari..." : "Cari"}
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://drive.google.com/file/d/1D0j15JZJv3JhN81HkutXiSEnMMU9zz6w/view"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-5 py-2.5 text-sm font-bold transition-colors duration-300 border border-blue-100"
            >
              PDF Penuh
            </a>
            <img src={user.photoURL || "/avatar.png"} className="h-10 w-10 rounded-full border-2 border-zinc-200" alt="User Avatar" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Overlay Background (Hanya untuk Mobile bila sidebar buka) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <div className={`absolute md:relative z-50 h-full w-[280px] md:w-[300px] border-r border-zinc-200 bg-white flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <div className="flex items-center justify-between p-6 border-b border-zinc-100 md:border-none">
            <h2 className="text-xl font-black text-zinc-900">Isi Kandungan</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-zinc-400 hover:text-zinc-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto px-4 pb-4">
            {contents.map((item, index) => {
              const isActive = pageNumber === item.page;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setPageNumber(item.page);
                    setIsSidebarOpen(false); // Tutup sidebar di mobile selepas pilih
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-transparent text-zinc-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <span className={`text-sm ${isActive ? "font-bold" : "font-semibold"}`}>
                    {item.title}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-colors ${isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"}`}>
                    ms {item.page}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-zinc-100 bg-white">
             {/* Pautan PDF untuk mobile */}
             <a
              href="https://drive.google.com/file/d/1D0j15JZJv3JhN81HkutXiSEnMMU9zz6w/view"
              target="_blank"
              rel="noreferrer"
              className="md:hidden flex w-full justify-center mb-3 rounded-xl bg-blue-50 text-blue-600 px-4 py-3 text-sm font-bold border border-blue-100"
            >
              Buka PDF Penuh
            </a>
            <button
              onClick={() => signOut(auth)}
              className="w-full rounded-xl border border-red-200 bg-red-50/50 py-3 text-sm font-bold text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Log Keluar
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-50/50 w-full">
          {aiResult && (
            <div className="mb-6 rounded-2xl border border-blue-200 bg-white shadow-lg shadow-blue-900/5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 md:px-6 py-3">
                <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Jawapan AI
                </h2>
              </div>
              <div className="p-4 md:p-6">
                <p className="leading-relaxed whitespace-pre-line text-zinc-700 text-sm md:text-base">
                  {aiResult}
                </p>
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 md:p-5 shadow-sm gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900">
                Nota Grafik
              </h2>
              <p className="mt-0.5 text-xs md:text-sm font-medium text-zinc-500">
                Muka surat {pageNumber} daripada 104
              </p>
            </div>

            <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1 w-full sm:w-auto justify-center">
              <button onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))} className="flex-1 sm:flex-none rounded-lg px-3 py-2 text-sm font-bold text-zinc-600 hover:bg-white hover:shadow-sm">
                -
              </button>
              <button onClick={() => setZoom(1)} className="flex-1 sm:flex-none rounded-lg px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-white hover:shadow-sm border-x border-zinc-200/50">
                100%
              </button>
              <button onClick={() => setZoom((prev) => prev + 0.1)} className="flex-1 sm:flex-none rounded-lg px-3 py-2 text-sm font-bold text-zinc-600 hover:bg-white hover:shadow-sm">
                +
              </button>
            </div>
          </div>

          {/* Image Container with Scroll for Zooming */}
          <div className="flex justify-center pb-10">
            <div className="w-full overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-xl custom-scrollbar flex justify-center">
              <img
                src={`/pages/SISTEM BAHASA-${pageNumber}.webp`}
                alt={`Muka Surat ${pageNumber}`}
                style={{
                  width: `${100 * zoom}%`,
                  minWidth: `${300 * zoom}px`, // Minimum width supaya tak terlalu kecil
                  maxWidth: `${850 * zoom}px`, // Maximum ikut resolusi asal
                  transition: "width 0.3s ease-out",
                }}
                className="h-auto block origin-top"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}