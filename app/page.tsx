"use client";

import { useEffect, useState, useRef } from "react";
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

const ModernLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md shadow-blue-500/30 ${className}`}>
    <svg className="w-[55%] h-[55%] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  </div>
);

const allPagesIndex = [
  { title: "Cover Depan", page: 1, type: "Pengenalan" },
  { title: "Nota Hak Cipta", page: 2, type: "Pengenalan" },
  { title: "Isi Kandungan", page: 3, type: "Pengenalan" },
  { title: "Kata Nama", page: 5, type: "Tajuk Utama" },
  { title: "Kata Nama Am", page: 6, type: "Sub-tajuk" },
  { title: "Kata Nama Khas", page: 8, type: "Sub-tajuk" },
  { title: "Kata Ganti Nama Diri", page: 9, type: "Sub-tajuk" },
  { title: "Kata Ganti Nama Diri Tunjuk", page: 10, type: "Sub-tajuk" },
  { title: "Kata Kerja", page: 11, type: "Tajuk Utama" },
  { title: "Kata Kerja Transitif", page: 12, type: "Sub-tajuk" },
  { title: "Kata Kerja Tak Transitif", page: 14, type: "Sub-tajuk" },
  { title: "Kata Adjektif", page: 15, type: "Tajuk Utama" },
  { title: "Kata Adjektif Sifat", page: 17, type: "Sub-tajuk" },
  { title: "Kata Adjektif Perasaan", page: 18, type: "Sub-tajuk" },
  { title: "Kata Adjektif Ukuran", page: 19, type: "Sub-tajuk" },
  { title: "Kata Adjektif Warna", page: 20, type: "Sub-tajuk" },
  { title: "Kata Adjektif Jarak", page: 21, type: "Sub-tajuk" },
  { title: "Kata Adjektif Cara", page: 22, type: "Sub-tajuk" },
  { title: "Kata Adjektif Waktu", page: 23, type: "Sub-tajuk" },
  { title: "Kata Adjektif Bentuk", page: 24, type: "Sub-tajuk" },
  { title: "Kata Adjektif Pancaindera", page: 25, type: "Sub-tajuk" },
  { title: "Kata Tugas", page: 26, type: "Tajuk Utama" },
  { title: "Kata Hubung", page: 27, type: "Sub-tajuk" },
  { title: "Kata Pembenar", page: 30, type: "Sub-tajuk" },
  { title: "Kata Nafi", page: 31, type: "Sub-tajuk" },
  { title: "Kata Seru", page: 32, type: "Sub-tajuk" },
  { title: "Kata Perintah", page: 33, type: "Sub-tajuk" },
  { title: "Kata Bantu", page: 34, type: "Sub-tajuk" },
  { title: "Kata Bilangan", page: 35, type: "Sub-tajuk" },
  { title: "Kata Arah", page: 36, type: "Sub-tajuk" },
  { title: "Kata Sendi Nama", page: 37, type: "Sub-tajuk" },
  { title: "Kata Pemeri", page: 38, type: "Sub-tajuk" },
  { title: "Kata Penguat", page: 39, type: "Sub-tajuk" },
  { title: "Kata Adverba", page: 40, type: "Sub-tajuk" },
  { title: "Kata Penegas", page: 41, type: "Sub-tajuk" },
  { title: "Kata Pangkal Ayat", page: 42, type: "Sub-tajuk" },
  { title: "Kata Ganda", page: 43, type: "Tajuk Utama" },
  { title: "Kata Ganda Penuh", page: 45, type: "Sub-tajuk" },
  { title: "Kata Ganda Separa", page: 46, type: "Sub-tajuk" },
  { title: "Kata Ganda Berentak / Berirama", page: 47, type: "Sub-tajuk" },
  { title: "Kata Berimbuhan", page: 48, type: "Tajuk Utama" },
  { title: "Imbuhan Awalan", page: 50, type: "Sub-tajuk" },
  { title: "Imbuhan Akhiran", page: 51, type: "Sub-tajuk" },
  { title: "Imbuhan Apitan", page: 52, type: "Sub-tajuk" },
  { title: "Imbuhan Sisipan", page: 53, type: "Sub-tajuk" },
  { title: "Pembentukan Ayat", page: 54, type: "Tajuk Utama" },
  { title: "Jenis Ayat", page: 56, type: "Sub-tajuk" },
  { title: "Ragam Ayat (Aktif & Pasif)", page: 61, type: "Sub-tajuk" },
  { title: "Susunan Ayat (Biasa & Songsang)", page: 64, type: "Sub-tajuk" },
  { title: "Ayat Majmuk", page: 65, type: "Sub-tajuk" },
  { title: "Cakap Ajuk dan Cakap Pindah", page: 66, type: "Sub-tajuk" },
  { title: "Penanda Wacana", page: 67, type: "Sub-tajuk" },
  { title: "Peribahasa", page: 68, type: "Tajuk Utama" },
  { title: "Simpulan Bahasa", page: 70, type: "Sub-tajuk" },
  { title: "Perumpamaan", page: 74, type: "Sub-tajuk" },
  { title: "Pepatah", page: 81, type: "Sub-tajuk" },
  { title: "Bidalan", page: 84, type: "Sub-tajuk" },
  { title: "Kiasan / Bandingan Semacam", page: 89, type: "Sub-tajuk" },
  { title: "Kata-kata Hikmat", page: 92, type: "Sub-tajuk" },
  { title: "Penjodoh Bilangan", page: 93, type: "Tajuk Utama" },
  { title: "Polisemi", page: 99, type: "Tajuk Utama" },
  { title: "Sinonim", page: 104, type: "Tajuk Utama" },
  { title: "Antonim", page: 108, type: "Tajuk Utama" },
];

export default function Home() {
  // State Utama
  const [user, setUser] = useState<any>(null);
  const [authError, setAuthError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const TOTAL_PAGES = 108;

  // Carian
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof allPagesIndex>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Bookmark & Sejarah
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [lastRead, setLastRead] = useState<number | null>(null);
  const [pageStats, setPageStats] = useState<Record<number, number>>({});

  // AI Chat
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Hai! Beritahu saya apa yang anda sedang cari. Contoh: 'ayat pasif'." }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Admin
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [deletedPages, setDeletedPages] = useState<number[]>([]);
  const [adminTab, setAdminTab] = useState<"urus" | "analitik">("urus");

  // Inisialisasi Auth & LocalStorage
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsCheckingAuth(true);
        setAuthError("");
        
        try {
          // ⚠️ PENTING: GANTIKAN URL INI DENGAN URL APPS SCRIPT CIKGU
          const SCRIPT_URL = "TUKAR_URL_APPS_SCRIPT_DI_SINI"; 
          
          let allowedEmails: string[] = [];

          // Panggil Google Sheets untuk dapatkan senarai e-mel
          // Jika SCRIPT_URL belum ditukar, kita guna fallback
          if(SCRIPT_URL !== "TUKAR_URL_APPS_SCRIPT_DI_SINI") {
             const response = await fetch(SCRIPT_URL);
             const data = await response.json();
             allowedEmails = data.emails || [];
          }
          
          // E-mel cikgu/admin wajib dimasukkan manual di sini sebagai backup
          allowedEmails.push("cikgugrafik@gmail.com", "admin@paan");

          const userEmail = currentUser.email?.toLowerCase();

          // Semak jika e-mel pembeli tersenarai (atau jika URL belum diisi utk test)
          if (allowedEmails.includes(userEmail) || SCRIPT_URL === "https://script.google.com/macros/s/AKfycbwSCOZJ-AjJVCBqEmfUPA1LDygqbg7Dg0ylfJMJs7l8qetL6JeRI1NTA8bRl1QOMiDl/exec"
            setUser(currentUser);
          } else {
            signOut(auth);
            setUser(null);
            setAuthError("Akses Ditolak: E-mel ini tiada dalam rekod pembelian. Sila log masuk guna e-mel yang didaftarkan di OnPay.");
          }
        } catch (error) {
          console.error("Ralat semakan e-mel:", error);
          signOut(auth);
          setUser(null);
          setAuthError("Ralat pelayan. Gagal menyemak rekod pangkalan data. Sila cuba lagi.");
        } finally {
          setIsCheckingAuth(false);
        }
      } else {
        setUser(null);
      }
    });
    
    if (localStorage.getItem("isAdminAuth") === "true") setIsAdminAuth(true);
    const savedBookmarks = localStorage.getItem("sb_bookmarks");
    if(savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    const savedLastRead = localStorage.getItem("sb_lastRead");
    if(savedLastRead) setLastRead(parseInt(savedLastRead));
    const savedStats = localStorage.getItem("sb_pageStats");
    if(savedStats) setPageStats(JSON.parse(savedStats));

    return () => unsubscribe();
  }, []);

  // Simpan Stats & Terakhir Dibaca
  useEffect(() => {
    if(!user) return;
    localStorage.setItem("sb_lastRead", pageNumber.toString());
    setLastRead(pageNumber);

    setPageStats(prev => {
      const newStats = { ...prev, [pageNumber]: (prev[pageNumber] || 0) + 1 };
      localStorage.setItem("sb_pageStats", JSON.stringify(newStats));
      return newStats;
    });
  }, [pageNumber, user]);

  const toggleBookmark = () => {
    setBookmarks(prev => {
      const isBookmarked = prev.includes(pageNumber);
      const newBookmarks = isBookmarked ? prev.filter(p => p !== pageNumber) : [...prev, pageNumber].sort((a,b) => a-b);
      localStorage.setItem("sb_bookmarks", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filtered = allPagesIndex.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  const handleSelectSearchResult = (page: number) => {
    setPageNumber(page);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleAdminLogin = () => {
    if (adminPass === "admin@paan") {
      setIsAdminAuth(true);
      localStorage.setItem("isAdminAuth", "true");
    } else {
      alert("Kata laluan tidak sah!");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    setAdminPass("");
    localStorage.removeItem("isAdminAuth");
  };

  const handleDeletePage = (p: number) => {
    if(confirm(`Anda pasti mahu memadam muka surat ${p}?`)) {
      setDeletedPages(prev => [...prev, p]);
    }
  };

  const handleAiSearch = async () => {
    if (!aiInput.trim()) return;
    const userQuery = aiInput;
    setAiInput("");
    setAiChatHistory((prev) => [...prev, { role: "user", text: userQuery }]);
    setIsAiLoading(true);

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
              content: `Anda ialah Pembantu Carian untuk aplikasi "Sistem Bahasa". Tugas anda HANYA memberikan muka surat (ms) yang tepat. Jangan ajar maksud tatabahasa.
              Jika ejaan salah, perbetulkan dan beritahu muka suratnya.
              Rujuk senarai indeks KETAT ini:
              Cover (ms 1), Hak Cipta (ms 2), Isi Kandungan (ms 3, 4)
              Kata Nama (ms 5), Am (ms 6), Khas (ms 8), Ganti Nama Diri (ms 9), Ganti Nama Tunjuk (ms 10)
              Kata Kerja (ms 11), Transitif (ms 12), Tak Transitif (ms 14)
              Kata Adjektif (ms 15), Sifat (ms 17), Perasaan (ms 18), Ukuran (ms 19), Warna (ms 20), Jarak (ms 21), Cara (ms 22), Waktu (ms 23), Bentuk (ms 24), Pancaindera (ms 25)
              Kata Tugas (ms 26), Hubung (ms 27), Pembenar (ms 30), Nafi (ms 31), Seru (ms 32), Perintah (ms 33), Bantu (ms 34), Bilangan (ms 35), Arah (ms 36), Sendi (ms 37), Pemeri (ms 38), Penguat (ms 39), Adverba (ms 40), Penegas (ms 41), Pangkal (ms 42)
              Kata Ganda (ms 43), Penuh (ms 45), Separa (ms 46), Berentak (ms 47)
              Kata Berimbuhan (ms 48), Awalan (ms 50), Akhiran (ms 51), Apitan (ms 52), Sisipan (ms 53)
              Bina Ayat (ms 54), Jenis (ms 56), Aktif/Pasif (ms 61), Songsang (ms 64), Majmuk (ms 65), Cakap Ajuk/Pindah (ms 66), Penanda Wacana (ms 67)
              Peribahasa (ms 68), Simpulan Bahasa (ms 70), Perumpamaan (ms 74), Pepatah (ms 81), Bidalan (ms 84), Kiasan (ms 89), Hikmat (ms 92)
              Penjodoh Bilangan (ms 93)
              Polisemi (ms 99), Sinonim (ms 104), Antonim (ms 108)

              Contoh jawapan: "Tajuk Kata Ganda Berentak terdapat di muka surat 47."`
            },
            { role: "user", content: userQuery },
          ],
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setAiChatHistory((prev) => [...prev, { role: "ai", text: data.choices[0].message.content }]);
      }
    } catch (error) {
      setAiChatHistory((prev) => [...prev, { role: "ai", text: "Maaf, ralat sistem AI." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChatHistory]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); } 
    catch (error) { console.log(error); }
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-zinc-950 text-white" : "bg-[#f5f7fb] text-zinc-800"} flex items-center justify-center p-4 md:p-6 ${poppins.className}`}>
        <div className={`w-full max-w-6xl overflow-hidden rounded-[30px] md:rounded-[40px] ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100"} shadow-2xl grid lg:grid-cols-2 border`}>
           <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-12 lg:p-16 text-white relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm backdrop-blur-md border border-white/10 font-medium tracking-wide">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Portal Pembelajaran Interaktif
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">SISTEM<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">BAHASA</span></h1>
              <p className="mt-6 max-w-md text-base lg:text-lg leading-relaxed text-slate-300">Platform rujukan Bahasa Melayu moden untuk murid dan guru. Dikuasakan oleh AI.</p>
            </div>
          </div>
          <div className="flex items-center justify-center p-8 lg:p-20">
            <div className="w-full max-w-md text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="mb-10 lg:mb-12 w-full">
                <div className="lg:hidden mx-auto mb-6 flex justify-center"><ModernLogo className="h-16 w-16" /></div>
                <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-center lg:text-left">Selamat Datang</h2>
                <p className={`mt-3 lg:mt-4 leading-relaxed text-base lg:text-lg text-center lg:text-left ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Log masuk menggunakan akaun Google untuk mengakses sistem pembelajaran premium.</p>
              </div>

              {/* PAPARAN RALAT E-MEL */}
              {authError && (
                <div className="mb-6 w-full p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <p className="text-sm font-semibold text-red-700 leading-relaxed">{authError}</p>
                </div>
              )}

              {/* BUTANG LOGIN */}
              <button 
                onClick={signInWithGoogle} 
                disabled={isCheckingAuth}
                className="group flex w-full items-center justify-center gap-4 rounded-2xl bg-blue-600 px-6 py-4 text-base lg:text-lg font-bold text-white hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-300 shadow-lg"
              >
                {isCheckingAuth ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyemak rekod...
                  </>
                ) : (
                  <>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-6 w-6 lg:h-7 lg:w-7 bg-white rounded-full p-1 group-hover:scale-110 transition-transform" alt="Google Logo" />
                    Log Masuk Google
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sidebarContents = [
    { title: "Mukadimah", pages: [1], subTopics: [{ title: "Cover Depan", pages: [1] }, { title: "Nota Hak Cipta", pages: [2] }, { title: "Isi Kandungan", pages: [3, 4] }] },
    { title: "1. Kata Nama", pages: [5], subTopics: [{ title: "Kata Nama Am", pages: [6, 7] }, { title: "Kata Nama Khas", pages: [8] }, { title: "Kata Ganti Nama Diri", pages: [9] }, { title: "Kata Ganti Nama Diri Tunjuk", pages: [10] }] },
    { title: "2. Kata Kerja", pages: [11], subTopics: [{ title: "Kata Kerja Transitif", pages: [12, 13] }, { title: "Kata Kerja Tak Transitif", pages: [14] }] },
    { title: "3. Kata Adjektif", pages: [15, 16], subTopics: [{ title: "Kata Adjektif Sifat", pages: [17] }, { title: "Kata Adjektif Perasaan", pages: [18] }, { title: "Kata Adjektif Ukuran", pages: [19] }, { title: "Kata Adjektif Warna", pages: [20] }, { title: "Kata Adjektif Jarak", pages: [21] }, { title: "Kata Adjektif Cara", pages: [22] }, { title: "Kata Adjektif Waktu", pages: [23] }, { title: "Kata Adjektif Bentuk", pages: [24] }, { title: "Kata Adjektif Pancaindera", pages: [25] }] },
    { title: "4. Kata Tugas", pages: [26], subTopics: [{ title: "Kata Hubung", pages: [27, 28, 29] }, { title: "Kata Pembenar", pages: [30] }, { title: "Kata Nafi", pages: [31] }, { title: "Kata Seru", pages: [32] }, { title: "Kata Perintah", pages: [33] }, { title: "Kata Bantu", pages: [34] }, { title: "Kata Bilangan", pages: [35] }, { title: "Kata Arah", pages: [36] }, { title: "Kata Sendi Nama", pages: [37] }, { title: "Kata Pemeri", pages: [38] }, { title: "Kata Penguat", pages: [39] }, { title: "Kata Adverba", pages: [40] }, { title: "Kata Penegas", pages: [41] }, { title: "Kata Pangkal Ayat", pages: [42] }] },
    { title: "5. Kata Ganda", pages: [43, 44], subTopics: [{ title: "Kata Ganda Penuh", pages: [45] }, { title: "Kata Ganda Separa", pages: [46] }, { title: "Kata Ganda Berentak", pages: [47] }] },
    { title: "6. Kata Berimbuhan", pages: [48, 49], subTopics: [{ title: "Imbuhan Awalan", pages: [50] }, { title: "Imbuhan Akhiran", pages: [51] }, { title: "Imbuhan Apitan", pages: [52] }, { title: "Imbuhan Sisipan", pages: [53] }] },
    { title: "7. Pembentukan Ayat", pages: [54, 55], subTopics: [{ title: "Jenis Ayat", pages: [56, 57, 58, 59, 60] }, { title: "Ragam Ayat", pages: [61, 62, 63] }, { title: "Susunan Ayat", pages: [64] }, { title: "Ayat Majmuk", pages: [65] }, { title: "Cakap Ajuk/Pindah", pages: [66] }, { title: "Penanda Wacana", pages: [67] }] },
    { title: "8. Peribahasa", pages: [68, 69], subTopics: [{ title: "Simpulan Bahasa", pages: [70, 71, 72, 73] }, { title: "Perumpamaan", pages: [74, 75, 76, 77, 78, 79, 80] }, { title: "Pepatah", pages: [81, 82, 83] }, { title: "Bidalan", pages: [84, 85, 86, 87, 88] }, { title: "Kiasan", pages: [89, 90, 91] }, { title: "Kata Hikmat", pages: [92] }] },
    { title: "9. Penjodoh Bilangan", pages: [93, 94, 95, 96, 97, 98], subTopics: [] },
    { title: "10. Polisemi", pages: [99, 100, 101, 102, 103], subTopics: [] },
    { title: "11. Sinonim", pages: [104, 105, 106, 107], subTopics: [] },
    { title: "12. Antonim", pages: [108], subTopics: [] },
  ];

  const getTopPages = () => {
    return Object.entries(pageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([page, count]) => ({
        page: parseInt(page),
        count,
        title: allPagesIndex.find(p => p.page === parseInt(page))?.title || `M/S ${page}`
      }));
  };

  return (
    <div className={`h-[100dvh] overflow-hidden ${isDarkMode ? "bg-zinc-950 text-white dark" : "bg-[#f8fafc] text-zinc-800"} ${poppins.className} flex flex-col relative transition-colors duration-300`}>
      
      {/* NAVBAR */}
      <div className={`z-40 border-b flex-shrink-0 backdrop-blur-xl shadow-sm ${isDarkMode ? "bg-zinc-900/90 border-zinc-800" : "bg-white/90 border-zinc-200"}`}>
        <div className="flex flex-col md:flex-row items-center gap-4 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between w-full md:w-auto md:min-w-[260px]">
            <div className="flex items-center gap-3 md:gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`md:hidden p-2 -ml-2 rounded-lg transition-colors ${isDarkMode ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100"}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <ModernLogo className="h-10 w-10 md:h-12 md:w-12" />
              <div>
                <h1 className={`text-lg md:text-xl font-black tracking-tight leading-none ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Sistem Bahasa</h1>
                <p className={`text-[10px] md:text-xs mt-1 font-medium ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Hi, {user.displayName?.split(" ")[0]}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 md:hidden">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full ${isDarkMode ? "bg-zinc-800 text-yellow-400" : "bg-zinc-100 text-zinc-600"}`}>
                {isDarkMode ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg> : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>}
              </button>
              <img src={user.photoURL || "/avatar.png"} className="h-8 w-8 rounded-full border border-zinc-200 shadow-sm" alt="User" />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center w-full relative">
            <div className="relative w-full max-w-2xl flex gap-2">
              <div className={`flex flex-1 overflow-hidden rounded-full border shadow-inner focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300 ${isDarkMode ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-50/50 border-zinc-200"}`}>
                <div className={`pl-5 flex items-center justify-center ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  placeholder="Cari tajuk di sini secara terus..."
                  className={`w-full bg-transparent px-4 py-2.5 md:py-3 text-sm outline-none font-medium ${isDarkMode ? "placeholder:text-zinc-500 text-white" : "placeholder:text-zinc-400 text-zinc-900"}`}
                />
              </div>
              
              {lastRead !== null && lastRead !== pageNumber && (
                <button onClick={() => setPageNumber(lastRead)} className={`hidden md:flex items-center gap-2 px-4 rounded-full font-bold text-sm border shadow-sm transition-all whitespace-nowrap ${isDarkMode ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-blue-400" : "bg-white border-zinc-200 hover:bg-zinc-50 text-blue-600"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  Sambung M/S {lastRead}
                </button>
              )}

              {showDropdown && searchQuery.trim() !== "" && (
                <div className={`absolute top-full left-0 w-full md:w-[calc(100%-140px)] mt-2 rounded-2xl shadow-xl border max-h-[300px] overflow-y-auto custom-scrollbar z-50 py-2 ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-100"}`}>
                  {searchResults.length > 0 ? (
                    searchResults.map((item, index) => (
                      <button key={index} onClick={() => handleSelectSearchResult(item.page)} className={`w-full flex items-center justify-between px-5 py-3 transition-colors text-left border-b last:border-0 ${isDarkMode ? "hover:bg-zinc-700 border-zinc-700/50" : "hover:bg-blue-50 border-zinc-50"}`}>
                        <div>
                          <p className={`text-[14px] font-bold ${isDarkMode ? "text-zinc-100" : "text-zinc-800"}`}>{item.title}</p>
                          <p className={`text-[11px] font-medium mt-0.5 ${isDarkMode ? "text-zinc-400" : "text-zinc-400"}`}>{item.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${isDarkMode ? "bg-zinc-900 text-zinc-300" : "bg-zinc-100 text-zinc-600"}`}>ms {item.page}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className={`px-5 py-4 text-sm text-center font-medium ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Tiada tajuk ditemui.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? "bg-zinc-800 text-yellow-400 hover:bg-zinc-700" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>
              {isDarkMode ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg> : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>}
            </button>
            <button onClick={() => setIsAdminModalOpen(true)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
            <img src={user.photoURL || "/avatar.png"} className={`h-10 w-10 rounded-full border-2 shadow-sm ${isDarkMode ? "border-zinc-700" : "border-zinc-200"}`} alt="User Avatar" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />}

        {/* SIDEBAR SCROLL BEBAS */}
        <div className={`absolute md:relative z-40 h-full w-[280px] md:w-[320px] border-r flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 shadow-2xl md:shadow-none"} ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <div className={`flex items-center justify-between p-5 border-b ${isDarkMode ? "border-zinc-800" : "border-zinc-100"}`}>
            <h2 className={`text-lg font-black uppercase tracking-wide ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Kandungan</h2>
            <div className="flex items-center gap-2">
               <button onClick={() => setIsAdminModalOpen(true)} className={`md:hidden p-1.5 rounded-lg ${isDarkMode ? "text-zinc-400 bg-zinc-800" : "text-zinc-500 bg-zinc-100"}`}>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
               </button>
               <button onClick={() => setIsSidebarOpen(false)} className={`md:hidden p-1.5 rounded-full ${isDarkMode ? "bg-zinc-800 text-zinc-400" : "bg-zinc-50 text-zinc-400"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
            
            {bookmarks.length > 0 && (
              <div className={`mb-6 p-4 rounded-2xl border ${isDarkMode ? "bg-yellow-900/10 border-yellow-900/50" : "bg-yellow-50 border-yellow-100"}`}>
                <h3 className={`text-sm font-bold flex items-center gap-2 mb-3 ${isDarkMode ? "text-yellow-500" : "text-yellow-600"}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  Penanda Buku
                </h3>
                <div className="flex flex-wrap gap-2">
                  {bookmarks.map(b => (
                    <button key={b} onClick={() => { setPageNumber(b); setIsSidebarOpen(false); }} className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${pageNumber === b ? "bg-yellow-400 text-yellow-900" : isDarkMode ? "bg-zinc-800 text-yellow-500 hover:bg-zinc-700" : "bg-white text-yellow-600 hover:bg-yellow-100"}`}>
                      M/S {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className={`text-[11px] p-3 rounded-xl border ${isDarkMode ? "bg-blue-900/20 border-blue-800/50 text-blue-300" : "bg-blue-50 border-blue-100 text-blue-600 font-medium"}`}>Nota: Klik pada butang nombor page untuk akses pantas.</p>
            </div>

            {sidebarContents.map((item, index) => {
              const isMainActive = item.pages.includes(pageNumber);
              return (
                <div key={index} className="mb-2">
                  <div className={`group flex flex-col w-full rounded-xl px-4 py-3 text-left transition-all duration-200 ${isMainActive ? "bg-blue-600 shadow-md shadow-blue-500/20" : isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className={`text-[14px] mt-1 ${isMainActive ? "font-bold text-white" : isDarkMode ? "font-semibold text-zinc-200" : "font-semibold text-zinc-800"}`}>{item.title}</span>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {item.pages.filter(p => !deletedPages.includes(p)).map(p => (
                          <button key={p} onClick={() => { setPageNumber(p); setIsSidebarOpen(false); }} className={`min-w-[36px] py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-colors ${pageNumber === p ? (isMainActive ? "bg-white text-blue-600" : "bg-blue-500 text-white") : (isMainActive ? "bg-blue-500 text-blue-100 hover:bg-blue-400" : isDarkMode ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700" : "bg-zinc-200 text-zinc-500 hover:bg-zinc-300")}`}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {item.subTopics && item.subTopics.length > 0 && (
                    <div className={`mt-1 ml-6 pl-3 border-l-2 space-y-1 ${isDarkMode ? "border-zinc-800" : "border-zinc-100"}`}>
                      {item.subTopics.map((sub, subIndex) => {
                        const isSubActive = sub.pages.includes(pageNumber);
                        return (
                          <div key={subIndex} className={`group flex flex-col w-full rounded-lg px-3 py-2.5 text-left transition-all duration-200 ${isSubActive ? (isDarkMode ? "bg-blue-900/30" : "bg-blue-50") : (isDarkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-50")}`}>
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-[13px] relative mt-1 ${isSubActive ? (isDarkMode ? "text-blue-400 font-semibold" : "text-blue-700 font-semibold") : (isDarkMode ? "text-zinc-400" : "text-zinc-500")}`}>
                                {isSubActive && <span className="absolute -left-4 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shadow-sm"></span>}
                                {sub.title}
                              </span>
                              <div className="flex flex-wrap gap-1.5 justify-end">
                                {sub.pages.filter(p => !deletedPages.includes(p)).map(p => (
                                  <button key={p} onClick={() => { setPageNumber(p); setIsSidebarOpen(false); }} className={`min-w-[36px] py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-colors ${pageNumber === p ? "bg-blue-500 text-white shadow-sm" : isDarkMode ? "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300" : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700"}`}>
                                    {p}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className={`p-4 border-t flex-shrink-0 ${isDarkMode ? "border-zinc-800 bg-zinc-900" : "border-zinc-100 bg-zinc-50/50"}`}>
            <button onClick={() => signOut(auth)} className={`w-full rounded-xl border py-3 text-sm font-bold transition-all duration-300 shadow-sm ${isDarkMode ? "bg-zinc-800 border-red-900/50 text-red-400 hover:bg-zinc-700" : "bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"}`}>Log Keluar</button>
          </div>
        </div>

        {/* KAWASAN KANDUNGAN NOTA */}
        <div className={`flex-1 overflow-y-auto w-full flex flex-col relative custom-scrollbar p-4 md:p-8 ${isDarkMode ? "bg-zinc-950" : "bg-[#f5f7fb]"}`}>
          
          {lastRead !== null && lastRead !== pageNumber && (
            <button onClick={() => setPageNumber(lastRead)} className={`md:hidden mb-4 flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm border shadow-sm transition-all ${isDarkMode ? "bg-zinc-800 border-zinc-700 text-blue-400" : "bg-white border-blue-100 text-blue-600"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Sambung Membaca M/S {lastRead}
            </button>
          )}

          {deletedPages.includes(pageNumber) ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center">
                <svg className={`w-20 h-20 mb-4 ${isDarkMode ? "text-zinc-800" : "text-zinc-200"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <h3 className={`text-2xl font-black ${isDarkMode ? "text-zinc-600" : "text-zinc-400"}`}>Muka Surat Dipadam</h3>
                <p className={`mt-2 ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>Muka surat {pageNumber} tidak lagi tersedia dalam sistem.</p>
                <button onClick={() => setPageNumber(p => p < TOTAL_PAGES ? p + 1 : p)} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Pergi Muka Surat Seterusnya</button>
             </div>
          ) : (
            <>
              <div className={`mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border p-4 md:p-5 shadow-sm gap-4 flex-shrink-0 ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Nota Interaktif</h2>
                    <p className={`mt-0.5 text-xs md:text-sm font-medium ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>Muka surat {pageNumber} daripada {TOTAL_PAGES}</p>
                  </div>
                  <button onClick={toggleBookmark} className={`p-2 rounded-full transition-all ${bookmarks.includes(pageNumber) ? "bg-yellow-100 text-yellow-500 hover:bg-yellow-200" : isDarkMode ? "bg-zinc-800 text-zinc-500 hover:text-yellow-500" : "bg-zinc-50 text-zinc-300 hover:text-yellow-500"}`}>
                    <svg className="w-7 h-7" fill={bookmarks.includes(pageNumber) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </button>
                </div>

                <div className={`inline-flex items-center rounded-xl border p-1 w-full sm:w-auto justify-center ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"}`}>
                  <button onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))} className={`flex-1 sm:flex-none rounded-lg px-3 py-2 text-sm font-bold transition-all ${isDarkMode ? "text-zinc-300 hover:bg-zinc-700" : "text-zinc-600 hover:bg-white hover:shadow-sm"}`}>-</button>
                  <button onClick={() => setZoom(1)} className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-sm font-bold border-x transition-all ${isDarkMode ? "text-zinc-300 border-zinc-700 hover:bg-zinc-700" : "text-zinc-600 border-zinc-200/50 hover:bg-white hover:shadow-sm"}`}>100%</button>
                  <button onClick={() => setZoom((prev) => prev + 0.1)} className={`flex-1 sm:flex-none rounded-lg px-3 py-2 text-sm font-bold transition-all ${isDarkMode ? "text-zinc-300 hover:bg-zinc-700" : "text-zinc-600 hover:bg-white hover:shadow-sm"}`}>+</button>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center pb-12">
                <div className={`w-full overflow-x-auto rounded-2xl border shadow-xl custom-scrollbar flex justify-center mb-6 relative group ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                  <img
                    src={`/pages/SISTEM BAHASA-${pageNumber}.webp`}
                    alt={`Muka Surat ${pageNumber}`}
                    style={{ width: `${100 * zoom}%`, minWidth: `${300 * zoom}px`, maxWidth: `${850 * zoom}px`, transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)", filter: isDarkMode ? "brightness(0.9) contrast(1.1)" : "none" }}
                    className="h-auto block origin-top"
                  />
                </div>

                <div className={`w-full max-w-3xl rounded-2xl p-3 md:p-4 border shadow-sm flex items-center justify-between ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                  <button onClick={() => setPageNumber(p => p > 1 ? p - 1 : p)} disabled={pageNumber === 1} className={`flex items-center gap-1 md:gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm disabled:opacity-50 transition-colors border ${isDarkMode ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700" : "bg-zinc-50 text-zinc-700 border-zinc-100 hover:bg-zinc-100"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg> Sebelumnya
                  </button>
                  <div className={`text-xs md:text-sm font-semibold ${isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                    Halaman <span className={`px-2 py-1 rounded-md ml-1 ${isDarkMode ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-900"}`}>{pageNumber}</span> / {TOTAL_PAGES}
                  </div>
                  <button onClick={() => setPageNumber(p => p < TOTAL_PAGES ? p + 1 : p)} disabled={pageNumber === TOTAL_PAGES} className="flex items-center gap-1 md:gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-blue-600 text-white font-bold text-xs md:text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20">
                    Seterusnya <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                
                <div className={`mt-8 text-center text-sm font-medium ${isDarkMode ? "text-zinc-600" : "text-zinc-400"}`}>
                  page by <span className={`font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-700"}`}>cikgugrafik</span> <span className="text-blue-500 font-black">{'</>'}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* TETINGKAP CHAT AI */}
      {isAiChatOpen && (
        <div className={`fixed bottom-24 right-4 md:right-8 w-80 md:w-96 rounded-3xl shadow-2xl border flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-8 fade-in duration-300 ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-xs shadow-inner">AI</div>
              <div>
                <h3 className="text-white font-bold text-sm">Bantuan AI</h3>
                <p className="text-blue-200 text-[10px] font-medium">Tanya jika anda tidak jumpa topik.</p>
              </div>
            </div>
            <button onClick={() => setIsAiChatOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className={`flex-1 p-4 h-64 overflow-y-auto space-y-4 text-sm custom-scrollbar ${isDarkMode ? "bg-zinc-950" : "bg-slate-50"}`}>
            {aiChatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : isDarkMode ? "bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-tl-sm shadow-sm" : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm shadow-sm"}`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isAiLoading && (
              <div className="flex justify-start">
                <div className={`border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1 ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"}`}>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className={`p-3 border-t ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100"}`}>
            <div className={`flex items-center rounded-full overflow-hidden pr-1 focus-within:ring-2 focus-within:ring-blue-500/20 ${isDarkMode ? "bg-zinc-800" : "bg-zinc-100"}`}>
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                placeholder="Tanya sini..."
                className={`flex-1 bg-transparent px-4 py-2 text-sm outline-none font-medium ${isDarkMode ? "text-zinc-200 placeholder:text-zinc-500" : "text-zinc-700 placeholder:text-zinc-400"}`}
              />
              <button onClick={handleAiSearch} disabled={isAiLoading || !aiInput.trim()} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors m-1">
                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUTANG FLOATING AI */}
      <button
        onClick={() => setIsAiChatOpen(!isAiChatOpen)}
        className={`fixed bottom-6 right-4 md:right-8 z-40 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-600 hover:scale-105 transition-all duration-300 ring-4 ${isDarkMode ? "bg-zinc-800 ring-zinc-900" : "bg-zinc-900 ring-white"}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className={`relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 ${isDarkMode ? "border-zinc-900" : "border-white"}`}></span>
        </span>
      </button>

      {/* ADMIN MODAL OVERLAY */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
           <div className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-white"}`}>
              <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div>
                  <h2 className="text-xl font-black">Papan Pemuka Admin</h2>
                  <p className="text-xs text-slate-400 mt-1">Pengurusan Sistem & Analitik</p>
                </div>
                <button onClick={() => setIsAdminModalOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {!isAdminAuth ? (
                <div className={`p-8 ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Akses Keselamatan</h3>
                    <p className={`text-sm mt-2 ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Sila masukkan kata laluan untuk log masuk.</p>
                  </div>
                  
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className={`flex items-center rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 overflow-hidden ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"}`}>
                      <input 
                        type={showAdminPass ? "text" : "password"} 
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                        placeholder="Kata laluan..." 
                        className={`w-full px-5 py-3.5 bg-transparent outline-none text-sm font-medium ${isDarkMode ? "text-white placeholder:text-zinc-500" : "text-zinc-800 placeholder:text-zinc-400"}`}
                      />
                      <button onClick={() => setShowAdminPass(!showAdminPass)} className={`px-4 text-sm font-bold ${isDarkMode ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-400 hover:text-zinc-700"}`}>
                        {showAdminPass ? "Hide" : "Show"}
                      </button>
                    </div>
                    <button onClick={handleAdminLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/30">
                      Log Masuk
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`flex-1 flex flex-col overflow-hidden ${isDarkMode ? "bg-zinc-900" : "bg-slate-50"}`}>
                   <div className={`flex border-b px-6 pt-4 gap-6 ${isDarkMode ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white"}`}>
                     <button onClick={() => setAdminTab("urus")} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${adminTab === "urus" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}>Pengurusan M/S</button>
                     <button onClick={() => setAdminTab("analitik")} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${adminTab === "analitik" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-500 hover:text-zinc-700"}`}>Analitik Penggunaan</button>
                   </div>

                   <div className="flex-1 overflow-y-auto p-6">
                      {adminTab === "urus" && (
                        <div className="space-y-6">
                          <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"}`}>
                            <h4 className={`font-bold mb-1 ${isDarkMode ? "text-white" : "text-zinc-800"}`}>Muat Naik Muka Surat Baru</h4>
                            <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition mt-4 ${isDarkMode ? "border-zinc-600 hover:bg-zinc-700/50" : "border-blue-200 bg-blue-50/50 hover:bg-blue-50"}`}>
                               <input type="file" className="hidden" id="upload-page" onChange={() => alert('Berjaya dimuat naik! (Simulasi Client-Side)')} />
                               <label htmlFor="upload-page" className="cursor-pointer">
                                  <svg className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? "text-zinc-400" : "text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                  <span className={`text-sm font-bold ${isDarkMode ? "text-zinc-300" : "text-blue-700"}`}>Klik untuk pilih fail</span>
                               </label>
                            </div>
                          </div>

                          <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"}`}>
                            <h4 className={`font-bold mb-1 ${isDarkMode ? "text-white" : "text-zinc-800"}`}>Padam Muka Surat Semasa (M/S {pageNumber})</h4>
                            <div className="flex gap-3 mt-4">
                              <button onClick={() => handleDeletePage(pageNumber)} className={`flex-1 py-3 rounded-xl border text-sm font-bold flex justify-center items-center gap-2 transition ${isDarkMode ? "bg-red-900/20 border-red-800/50 text-red-400 hover:bg-red-900/40" : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100"}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Padam M/S {pageNumber}
                              </button>
                            </div>
                          </div>

                          {deletedPages.length > 0 && (
                            <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-yellow-900/20 border-yellow-800/50" : "bg-yellow-50 border-yellow-200"}`}>
                              <h4 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? "text-yellow-500" : "text-yellow-700"}`}>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                Muka Surat Dipadam:
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {deletedPages.map(p => (
                                  <span key={p} className={`px-2 py-1 rounded text-xs font-bold ${isDarkMode ? "bg-yellow-900/50 text-yellow-200" : "bg-yellow-200 text-yellow-800"}`}>M/S {p}</span>
                                ))}
                              </div>
                              <button onClick={() => setDeletedPages([])} className={`mt-3 text-xs font-bold underline ${isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}>Restore Semua</button>
                            </div>
                          )}
                        </div>
                      )}

                      {adminTab === "analitik" && (
                        <div className="space-y-6">
                           <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"}`}>
                              <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </div>
                                <div>
                                  <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>Top 5 Muka Surat</h3>
                                  <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Halaman paling kerap dibuka oleh anda.</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                {Object.keys(pageStats).length === 0 ? (
                                  <p className="text-sm text-zinc-500 italic">Tiada data analitik lagi. Sila buka nota untuk menjana data.</p>
                                ) : (
                                  getTopPages().map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? "bg-yellow-400 text-yellow-900" : isDarkMode ? "bg-zinc-700 text-zinc-300" : "bg-zinc-100 text-zinc-600"}`}>
                                          {idx + 1}
                                        </div>
                                        <div>
                                          <p className={`text-sm font-bold ${isDarkMode ? "text-zinc-200" : "text-zinc-800"}`}>{stat.title}</p>
                                          <p className={`text-[10px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>M/S {stat.page}</p>
                                        </div>
                                      </div>
                                      <div className={`text-sm font-bold px-3 py-1 rounded-full ${isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                                        {stat.count} views
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                           </div>
                        </div>
                      )}
                   </div>

                   <div className={`p-4 border-t flex justify-end ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"}`}>
                     <button onClick={handleAdminLogout} className={`px-5 py-2.5 rounded-xl text-sm font-bold ${isDarkMode ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"}`}>
                       Log Keluar Admin
                     </button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}