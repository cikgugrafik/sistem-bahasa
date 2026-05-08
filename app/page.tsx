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

// Komponen Logo Tersuai (Buku Terbuka Moden)
const ModernLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md shadow-blue-500/30 ${className}`}>
    <svg 
      className="w-[55%] h-[55%] text-white" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2.5" 
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
      />
    </svg>
  </div>
);

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const TOTAL_PAGES = 104;

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
    {
      title: "1. Kata Nama", page: 1,
      subTopics: [
        { title: "Kata Nama Am", page: 2 },
        { title: "Kata Nama Khas", page: 4 },
        { title: "Kata Ganti Nama Diri", page: 5 },
        { title: "Kata Ganti Nama Diri Tunjuk", page: 6 },
      ],
    },
    {
      title: "2. Kata Kerja", page: 7,
      subTopics: [
        { title: "Kata Kerja Transitif", page: 8 },
        { title: "Kata Kerja Tak Transitif", page: 10 },
      ],
    },
    {
      title: "3. Kata Adjektif", page: 11,
      subTopics: [
        { title: "Kata Adjektif Sifat", page: 13 },
        { title: "Kata Adjektif Perasaan", page: 14 },
        { title: "Kata Adjektif Ukuran", page: 15 },
        { title: "Kata Adjektif Warna", page: 16 },
        { title: "Kata Adjektif Jarak", page: 17 },
        { title: "Kata Adjektif Cara", page: 18 },
        { title: "Kata Adjektif Waktu", page: 19 },
        { title: "Kata Adjektif Bentuk", page: 20 },
        { title: "Kata Adjektif Pancaindera", page: 21 },
      ],
    },
    {
      title: "4. Kata Tugas", page: 22,
      subTopics: [
        { title: "Kata Hubung", page: 23 },
        { title: "Kata Pembenar", page: 26 },
        { title: "Kata Nafi", page: 27 },
        { title: "Kata Seru", page: 28 },
        { title: "Kata Perintah", page: 29 },
        { title: "Kata Bantu", page: 30 },
        { title: "Kata Bilangan", page: 31 },
        { title: "Kata Arah", page: 32 },
        { title: "Kata Sendi Nama", page: 33 },
        { title: "Kata Pemeri", page: 34 },
        { title: "Kata Penguat", page: 35 },
        { title: "Kata Adverba", page: 36 },
        { title: "Kata Penegas", page: 37 },
        { title: "Kata Pangkal Ayat", page: 38 },
      ],
    },
    {
      title: "5. Kata Ganda", page: 39,
      subTopics: [
        { title: "Kata Ganda Penuh", page: 41 },
        { title: "Kata Ganda Separa", page: 42 },
        { title: "Kata Ganda Berentak / Berirama", page: 43 },
      ],
    },
    {
      title: "6. Kata Berimbuhan", page: 44,
      subTopics: [
        { title: "Imbuhan Awalan", page: 46 },
        { title: "Imbuhan Akhiran", page: 47 },
        { title: "Imbuhan Apitan", page: 48 },
        { title: "Imbuhan Sisipan", page: 49 },
      ],
    },
    {
      title: "7. Pembentukan Ayat", page: 50,
      subTopics: [
        { title: "Jenis Ayat", page: 52 },
        { title: "Ragam Ayat (Aktif & Pasif)", page: 57 },
        { title: "Susunan Ayat (Biasa & Songsang)", page: 60 },
        { title: "Ayat Majmuk", page: 61 },
        { title: "Cakap Ajuk dan Cakap Pindah", page: 62 },
        { title: "Penanda Wacana", page: 63 },
      ],
    },
    {
      title: "8. Peribahasa", page: 64,
      subTopics: [
        { title: "Simpulan Bahasa", page: 66 },
        { title: "Perumpamaan", page: 70 },
        { title: "Pepatah", page: 77 },
        { title: "Bidalan", page: 80 },
        { title: "Kiasan / Bandingan Semacam", page: 85 },
        { title: "Kata-kata Hikmat", page: 88 },
      ],
    },
    { title: "9. Penjodoh Bilangan", page: 89, subTopics: [] },
    { title: "10. Polisemi", page: 95, subTopics: [] },
    { title: "11. Sinonim", page: 100, subTopics: [] },
    { title: "12. Antonim", page: 104, subTopics: [] },
  ];

  const handleSearch = async () => {
    if (!search) return;

    setAiResult("Mencari muka surat...");
    setIsSearching(true);

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer sk-aeab062d29744d0588ba1dcb7d0f2aea`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `Anda ialah Pembantu Carian Indeks untuk buku "Sistem Bahasa". 
              Tugas anda HANYA memberitahu pengguna muka surat (ms) berdasarkan apa yang mereka cari. 
              JANGAN terangkan maksud tatabahasa. JANGAN beri contoh ayat.
              Jika pengguna salah eja (typo), teka tajuk yang paling hampir.
              Jawab dengan ringkas dan mesra. Contoh jawapan: "Tajuk Kata Ganda terdapat di muka surat 39." atau "Mungkin maksud anda Kata Hubung? Ia berada di muka surat 23."
              
              Berikut adalah Indeks Buku:
              - Kata Nama (ms 1), Kata Nama Am (ms 2), Kata Nama Khas (ms 4), Kata Ganti Nama Diri (ms 5), Kata Ganti Nama Diri Tunjuk (ms 6)
              - Kata Kerja (ms 7), Kata Kerja Transitif (ms 8), Kata Kerja Tak Transitif (ms 10)
              - Kata Adjektif (ms 11), Sifat (ms 13), Perasaan (ms 14), Ukuran (ms 15), Warna (ms 16), Jarak (ms 17), Cara (ms 18), Waktu (ms 19), Bentuk (ms 20), Pancaindera (ms 21)
              - Kata Tugas (ms 22), Hubung (ms 23), Pembenar (ms 26), Nafi (ms 27), Seru (ms 28), Perintah (ms 29), Bantu (ms 30), Bilangan (ms 31), Arah (ms 32), Sendi Nama (ms 33), Pemeri (ms 34), Penguat (ms 35), Adverba (ms 36), Penegas (ms 37), Pangkal Ayat (ms 38)
              - Kata Ganda (ms 39), Penuh (ms 41), Separa (ms 42), Berentak/Berirama (ms 43)
              - Kata Berimbuhan (ms 44), Awalan (ms 46), Akhiran (ms 47), Apitan (ms 48), Sisipan (ms 49)
              - Pembentukan Ayat (ms 50), Jenis Ayat (ms 52), Ragam Ayat Aktif/Pasif (ms 57), Susunan Ayat Biasa/Songsang (ms 60), Ayat Majmuk (ms 61), Cakap Ajuk/Pindah (ms 62), Penanda Wacana (ms 63)
              - Peribahasa (ms 64), Simpulan Bahasa (ms 66), Perumpamaan (ms 70), Pepatah (ms 77), Bidalan (ms 80), Kiasan/Bandingan Semacam (ms 85), Kata Hikmat (ms 88)
              - Penjodoh Bilangan (ms 89)
              - Polisemi (ms 95)
              - Sinonim (ms 100)
              - Antonim (ms 104)
              
              Jawab terus berdasarkan senarai di atas.`
            },
            {
              role: "user",
              content: search,
            },
          ],
        }),
      });

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        setAiResult(data.choices[0].message.content);
      } else {
        setAiResult("Maaf, AI tidak dapat mencari tajuk tersebut pada masa ini.");
      }
    } catch (error) {
      setAiResult("Ralat carian AI. Sila semak sambungan internet.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleNextPage = () => {
    setPageNumber((prev) => (prev < TOTAL_PAGES ? prev + 1 : prev));
  };

  const handlePrevPage = () => {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  };

  if (!user) {
    return (
      <div className={`min-h-screen bg-[#f5f7fb] flex items-center justify-center p-4 md:p-6 ${poppins.className}`}>
        <div className="w-full max-w-6xl overflow-hidden rounded-[30px] md:rounded-[40px] bg-white shadow-2xl grid lg:grid-cols-2 border border-zinc-100">
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-12 lg:p-16 text-white relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm backdrop-blur-md border border-white/10 font-medium tracking-wide">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
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
                <h3 className="text-3xl lg:text-4xl font-black text-blue-300">{TOTAL_PAGES}</h3>
                <p className="mt-2 text-xs lg:text-sm font-medium text-slate-300">Muka surat nota</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 lg:p-7 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition duration-300">
                <h3 className="text-3xl lg:text-4xl font-black text-cyan-300">AI</h3>
                <p className="mt-2 text-xs lg:text-sm font-medium text-slate-300">Carian Pintar</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 lg:p-20 bg-white">
            <div className="w-full max-w-md text-center lg:text-left flex flex-col items-center lg:items-start">
              
              <div className="mb-10 lg:mb-12 w-full">
                <div className="lg:hidden mx-auto mb-6 flex justify-center">
                  <ModernLogo className="h-16 w-16" />
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-zinc-900 tracking-tight text-center lg:text-left">
                  Selamat Datang
                </h2>
                <p className="mt-3 lg:mt-4 text-zinc-500 leading-relaxed text-base lg:text-lg text-center lg:text-left">
                  Log masuk menggunakan akaun Google untuk mengakses sistem pembelajaran premium.
                </p>
              </div>

              <button
                onClick={signInWithGoogle}
                className="group flex w-full items-center justify-center gap-4 rounded-2xl bg-zinc-900 px-6 py-4 text-base lg:text-lg font-bold text-white hover:bg-blue-600 transition-all duration-300 shadow-lg"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="h-6 w-6 lg:h-7 lg:w-7 bg-white rounded-full p-1 group-hover:scale-110 transition-transform"
                  alt="Google Logo"
                />
                Log Masuk Google
              </button>
              
              <div className="mt-12 text-center text-sm font-medium text-zinc-400 w-full">
                page by <span className="text-zinc-700 font-bold">cikgugrafik</span> <span className="text-blue-500 font-black">{'</>'}</span>
              </div>
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
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              
              <ModernLogo className="h-10 w-10 md:h-12 md:w-12" />
              
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
              <img src={user.photoURL || "/avatar.png"} className="h-8 w-8 rounded-full border border-zinc-200 shadow-sm" alt="User" />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center w-full">
            <div className="flex w-full max-w-2xl overflow-hidden rounded-full border border-zinc-200 bg-zinc-50/50 shadow-inner focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Cari tajuk... (cth: kata ganda)"
                className="w-full bg-transparent px-4 md:px-6 py-2.5 md:py-3 text-sm outline-none placeholder:text-zinc-400 font-medium"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-zinc-900 px-5 md:px-8 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-70 transition-colors"
              >
                {isSearching ? "Mencari..." : "Cari"}
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
            <img src={user.photoURL || "/avatar.png"} className="h-10 w-10 rounded-full border-2 border-zinc-200 shadow-sm" alt="User Avatar" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR DENGAN HIERARKI KANDUNGAN */}
        <div className={`absolute md:relative z-50 h-full w-[280px] md:w-[320px] border-r border-zinc-200 bg-white flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 shadow-2xl md:shadow-none"}`}>
          <div className="flex items-center justify-between p-6 border-b border-zinc-100">
            <h2 className="text-lg font-black text-zinc-900 uppercase tracking-wide">Isi Kandungan</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-zinc-400 hover:text-zinc-700 bg-zinc-50 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
            {contents.map((item, index) => {
              const isMainActive = pageNumber === item.page;
              return (
                <div key={index} className="mb-2">
                  <button
                    onClick={() => {
                      setPageNumber(item.page);
                      setIsSidebarOpen(false);
                    }}
                    className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                      isMainActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-transparent text-zinc-800 hover:bg-zinc-100"
                    }`}
                  >
                    <span className={`text-[14px] ${isMainActive ? "font-bold" : "font-semibold"}`}>
                      {item.title}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${isMainActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"}`}>
                      ms {item.page}
                    </span>
                  </button>

                  {item.subTopics && item.subTopics.length > 0 && (
                    <div className="mt-1 ml-6 pl-4 border-l-2 border-zinc-100 space-y-1">
                      {item.subTopics.map((sub, subIndex) => {
                        const isSubActive = pageNumber === sub.page;
                        return (
                          <button
                            key={subIndex}
                            onClick={() => {
                              setPageNumber(sub.page);
                              setIsSidebarOpen(false);
                            }}
                            className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all duration-200 ${
                              isSubActive
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                            }`}
                          >
                            <span className="text-[13px] relative">
                              {isSubActive && <span className="absolute -left-4 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 shadow-sm"></span>}
                              {sub.title}
                            </span>
                            <span className={`text-[10px] font-semibold ${isSubActive ? "text-blue-500" : "opacity-60"}`}>ms {sub.page}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
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
              className="w-full rounded-xl border border-red-200 bg-white py-3 text-sm font-bold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-sm"
            >
              Log Keluar
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f5f7fb] w-full flex flex-col relative">
          
          {aiResult && (
            <div className="mb-6 rounded-2xl border border-blue-200 bg-white shadow-lg shadow-blue-900/5 overflow-hidden flex-shrink-0 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 md:px-6 py-3">
                <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  Keputusan Carian AI
                </h2>
              </div>
              <div className="p-5 md:p-6 bg-blue-50/30">
                <p className="leading-relaxed whitespace-pre-line text-zinc-800 text-sm md:text-base font-medium">
                  {aiResult}
                </p>
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 md:p-5 shadow-sm gap-4 flex-shrink-0">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900">
                Nota Interaktif
              </h2>
              <p className="mt-0.5 text-xs md:text-sm font-medium text-zinc-500">
                Menyemak Muka surat {pageNumber}
              </p>
            </div>

            <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1 w-full sm:w-auto justify-center">
              <button onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))} className="flex-1 sm:flex-none rounded-lg px-3 py-2 text-sm font-bold text-zinc-600 hover:bg-white hover:shadow-sm transition-all">
                -
              </button>
              <button onClick={() => setZoom(1)} className="flex-1 sm:flex-none rounded-lg px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-white hover:shadow-sm border-x border-zinc-200/50 transition-all">
                100%
              </button>
              <button onClick={() => setZoom((prev) => prev + 0.1)} className="flex-1 sm:flex-none rounded-lg px-3 py-2 text-sm font-bold text-zinc-600 hover:bg-white hover:shadow-sm transition-all">
                +
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center pb-8 min-h-min">
            <div className="w-full overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-xl custom-scrollbar flex justify-center mb-8 relative group">
              <img
                src={`/pages/SISTEM BAHASA-${pageNumber}.webp`}
                alt={`Muka Surat ${pageNumber}`}
                style={{
                  width: `${100 * zoom}%`,
                  minWidth: `${300 * zoom}px`,
                  maxWidth: `${850 * zoom}px`,
                  transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="h-auto block origin-top"
              />
            </div>

            <div className="w-full max-w-3xl bg-white rounded-2xl p-3 md:p-4 border border-zinc-200 shadow-sm flex items-center justify-between mt-auto">
              <button 
                onClick={handlePrevPage}
                disabled={pageNumber === 1}
                className="flex items-center gap-1 md:gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-zinc-50 text-zinc-700 font-bold text-xs md:text-sm hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-zinc-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                Sebelumnya
              </button>
              
              <div className="text-xs md:text-sm font-semibold text-zinc-500">
                Halaman <span className="text-zinc-900 bg-zinc-100 px-2 py-1 rounded-md ml-1">{pageNumber}</span> / {TOTAL_PAGES}
              </div>

              <button 
                onClick={handleNextPage}
                disabled={pageNumber === TOTAL_PAGES}
                className="flex items-center gap-1 md:gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-blue-600 text-white font-bold text-xs md:text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                Seterusnya
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            
            <div className="mt-10 text-center text-sm font-medium text-zinc-400">
              page by <span className="text-zinc-700 font-bold">cikgugrafik</span> <span className="text-blue-500 font-black">{'</>'}</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}