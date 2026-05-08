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

// UPDATE: Semua muka surat telah ditambah 4 (+4 Offset) supaya selari dengan PDF sebenar
const allPagesIndex = [
  { title: "Cover Depan", page: 1, type: "Pengenalan" },
  { title: "Nota Hak Cipta", page: 2, type: "Pengenalan" },
  { title: "Isi Kandungan (Bahagian 1)", page: 3, type: "Pengenalan" },
  { title: "Isi Kandungan (Bahagian 2)", page: 4, type: "Pengenalan" },
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
  const [user, setUser] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // UPDATE: Total Page dilaraskan menjadi 108 (+4 offset)
  const TOTAL_PAGES = 108;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof allPagesIndex>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Hai! Beritahu saya apa yang anda sedang cari. Contoh: 'ayat pasif'." }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
              // UPDATE: Otak AI dikemaskini dengan muka surat yang tepat (+4 Offset)
              role: "system",
              content: `Anda ialah Pembantu Carian Indeks untuk aplikasi web "Sistem Bahasa".
              Tugas anda HANYA memberitahu pengguna di mana muka surat (ms) topik yang mereka cari.
              Jawab seringkas mungkin. Jika ejaan salah, teka topik yang paling hampir.
              
              Indeks Utama (Muka surat ini adalah tepat):
              - Pengenalan: Cover ms 1, Hak Cipta ms 2, Isi Kandungan ms 3 & 4
              - Kata Nama ms 5, Am ms 6, Khas ms 8, Ganti Nama ms 9
              - Kata Kerja ms 11, Transitif ms 12, Tak Transitif ms 14
              - Kata Adjektif ms 15 (Sifat 17, Perasaan 18, Ukuran 19, Warna 20, Jarak 21, Cara 22, Waktu 23, Bentuk 24, Pancaindera 25)
              - Kata Tugas ms 26 (Hubung 27, Pembenar 30, Nafi 31, Seru 32, Perintah 33, Bantu 34, Bilangan 35, Arah 36, Sendi 37, Pemeri 38, Penguat 39, Adverba 40, Penegas 41, Pangkal 42)
              - Kata Ganda ms 43 (Penuh 45, Separa 46, Berentak 47)
              - Imbuhan ms 48 (Awalan 50, Akhiran 51, Apitan 52, Sisipan 53)
              - Bina Ayat ms 54 (Jenis 56, Aktif/Pasif 61, Songsang 64, Majmuk 65, Cakap Ajuk 66, Penanda Wacana 67)
              - Peribahasa ms 68 (Simpulan Bahasa 70, Perumpamaan 74, Pepatah 81, Bidalan 84, Kiasan 89, Hikmat 92)
              - Penjodoh Bilangan ms 93
              - Polisemi ms 99, Sinonim ms 104, Antonim ms 108
              
              Contoh jawapan: "Topik Kata Ganda ada di muka surat 43."`
            },
            {
              role: "user",
              content: userQuery,
            },
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
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
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
                SISTEM<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">BAHASA</span>
              </h1>
              <p className="mt-6 max-w-md text-base lg:text-lg leading-relaxed text-slate-300">
                Platform rujukan Bahasa Melayu moden untuk murid dan guru. Dikuasakan oleh AI.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:gap-6 relative z-10">
              <div className="rounded-3xl bg-white/10 p-5 lg:p-7 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition duration-300">
                <h3 className="text-3xl lg:text-4xl font-black text-blue-300">{TOTAL_PAGES}</h3>
                <p className="mt-2 text-xs lg:text-sm font-medium text-slate-300">Jumlah Halaman</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 lg:p-7 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition duration-300">
                <h3 className="text-3xl lg:text-4xl font-black text-cyan-300">Pantas</h3>
                <p className="mt-2 text-xs lg:text-sm font-medium text-slate-300">Carian Interaktif</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 lg:p-20 bg-white">
            <div className="w-full max-w-md text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="mb-10 lg:mb-12 w-full">
                <div className="lg:hidden mx-auto mb-6 flex justify-center">
                  <ModernLogo className="h-16 w-16" />
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-zinc-900 tracking-tight text-center lg:text-left">Selamat Datang</h2>
                <p className="mt-3 lg:mt-4 text-zinc-500 leading-relaxed text-base lg:text-lg text-center lg:text-left">
                  Log masuk menggunakan akaun Google untuk mengakses sistem pembelajaran premium.
                </p>
              </div>
              <button onClick={signInWithGoogle} className="group flex w-full items-center justify-center gap-4 rounded-2xl bg-zinc-900 px-6 py-4 text-base lg:text-lg font-bold text-white hover:bg-blue-600 transition-all duration-300 shadow-lg">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-6 w-6 lg:h-7 lg:w-7 bg-white rounded-full p-1 group-hover:scale-110 transition-transform" alt="Google Logo" />
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

  // UPDATE: Sidebar +4 Offset (Muka Surat Tepat) & Ditambah Cover/Isi Kandungan
  const sidebarContents = [
    { title: "Mukadimah", page: 1, subTopics: [{ title: "Cover Depan", page: 1 }, { title: "Nota Hak Cipta", page: 2 }, { title: "Isi Kandungan", page: 3 }] },
    { title: "1. Kata Nama", page: 5, subTopics: [{ title: "Kata Nama Am", page: 6 }, { title: "Kata Nama Khas", page: 8 }, { title: "Kata Ganti Nama Diri", page: 9 }, { title: "Kata Ganti Nama Diri Tunjuk", page: 10 }] },
    { title: "2. Kata Kerja", page: 11, subTopics: [{ title: "Kata Kerja Transitif", page: 12 }, { title: "Kata Kerja Tak Transitif", page: 14 }] },
    { title: "3. Kata Adjektif", page: 15, subTopics: [{ title: "Kata Adjektif Sifat", page: 17 }, { title: "Kata Adjektif Perasaan", page: 18 }, { title: "Kata Adjektif Ukuran", page: 19 }, { title: "Kata Adjektif Warna", page: 20 }, { title: "Kata Adjektif Jarak", page: 21 }, { title: "Kata Adjektif Cara", page: 22 }, { title: "Kata Adjektif Waktu", page: 23 }, { title: "Kata Adjektif Bentuk", page: 24 }, { title: "Kata Adjektif Pancaindera", page: 25 }] },
    { title: "4. Kata Tugas", page: 26, subTopics: [{ title: "Kata Hubung", page: 27 }, { title: "Kata Pembenar", page: 30 }, { title: "Kata Nafi", page: 31 }, { title: "Kata Seru", page: 32 }, { title: "Kata Perintah", page: 33 }, { title: "Kata Bantu", page: 34 }, { title: "Kata Bilangan", page: 35 }, { title: "Kata Arah", page: 36 }, { title: "Kata Sendi Nama", page: 37 }, { title: "Kata Pemeri", page: 38 }, { title: "Kata Penguat", page: 39 }, { title: "Kata Adverba", page: 40 }, { title: "Kata Penegas", page: 41 }, { title: "Kata Pangkal Ayat", page: 42 }] },
    { title: "5. Kata Ganda", page: 43, subTopics: [{ title: "Kata Ganda Penuh", page: 45 }, { title: "Kata Ganda Separa", page: 46 }, { title: "Kata Ganda Berentak / Berirama", page: 47 }] },
    { title: "6. Kata Berimbuhan", page: 48, subTopics: [{ title: "Imbuhan Awalan", page: 50 }, { title: "Imbuhan Akhiran", page: 51 }, { title: "Imbuhan Apitan", page: 52 }, { title: "Imbuhan Sisipan", page: 53 }] },
    { title: "7. Pembentukan Ayat", page: 54, subTopics: [{ title: "Jenis Ayat", page: 56 }, { title: "Ragam Ayat (Aktif & Pasif)", page: 61 }, { title: "Susunan Ayat (Biasa & Songsang)", page: 64 }, { title: "Ayat Majmuk", page: 65 }, { title: "Cakap Ajuk dan Cakap Pindah", page: 66 }, { title: "Penanda Wacana", page: 67 }] },
    { title: "8. Peribahasa", page: 68, subTopics: [{ title: "Simpulan Bahasa", page: 70 }, { title: "Perumpamaan", page: 74 }, { title: "Pepatah", page: 81 }, { title: "Bidalan", page: 84 }, { title: "Kiasan / Bandingan Semacam", page: 89 }, { title: "Kata-kata Hikmat", page: 92 }] },
    { title: "9. Penjodoh Bilangan", page: 93, subTopics: [] },
    { title: "10. Polisemi", page: 99, subTopics: [] },
    { title: "11. Sinonim", page: 104, subTopics: [] },
    { title: "12. Antonim", page: 108, subTopics: [] },
  ];

  return (
    <div className={`min-h-screen bg-[#f8fafc] text-zinc-800 ${poppins.className} flex flex-col relative`}>
      {/* NAVBAR */}
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between w-full md:w-auto md:min-w-[260px]">
            <div className="flex items-center gap-3 md:gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <ModernLogo className="h-10 w-10 md:h-12 md:w-12" />
              <div className="hidden sm:block md:block">
                <h1 className="text-lg md:text-xl font-black tracking-tight text-zinc-900 leading-none">Sistem Bahasa</h1>
                <p className="text-xs text-zinc-500 mt-1 font-medium hidden md:block">Hi, {user.displayName?.split(" ")[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:hidden">
              <img src={user.photoURL || "/avatar.png"} className="h-8 w-8 rounded-full border border-zinc-200 shadow-sm" alt="User" />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center w-full relative">
            <div className="relative w-full max-w-2xl">
              <div className="flex w-full overflow-hidden rounded-full border border-zinc-200 bg-zinc-50/50 shadow-inner focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
                <div className="pl-5 flex items-center justify-center text-zinc-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  placeholder="Cari tajuk di sini secara terus..."
                  className="w-full bg-transparent px-4 py-2.5 md:py-3 text-sm outline-none placeholder:text-zinc-400 font-medium"
                />
              </div>

              {showDropdown && searchQuery.trim() !== "" && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-zinc-100 max-h-[300px] overflow-y-auto custom-scrollbar z-50 py-2">
                  {searchResults.length > 0 ? (
                    searchResults.map((item, index) => (
                      <button key={index} onClick={() => handleSelectSearchResult(item.page)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-blue-50 transition-colors text-left border-b border-zinc-50 last:border-0">
                        <div>
                          <p className="text-[14px] font-bold text-zinc-800">{item.title}</p>
                          <p className="text-[11px] font-medium text-zinc-400 mt-0.5">{item.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md text-[11px] font-bold">ms {item.page}</span>
                          <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-4 text-sm text-zinc-500 text-center font-medium">
                      Tiada tajuk ditemui.
                      <p className="text-xs text-zinc-400 mt-1">Sila gunakan Butang Bantuan AI di bawah.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="https://drive.google.com/file/d/1D0j15JZJv3JhN81HkutXiSEnMMU9zz6w/view" target="_blank" rel="noreferrer" className="rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-5 py-2.5 text-sm font-bold transition-colors duration-300 border border-blue-100">PDF Penuh</a>
            <img src={user.photoURL || "/avatar.png"} className="h-10 w-10 rounded-full border-2 border-zinc-200 shadow-sm" alt="User Avatar" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* SIDEBAR */}
        <div className={`absolute md:relative z-40 h-full w-[280px] md:w-[320px] border-r border-zinc-200 bg-white flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 shadow-2xl md:shadow-none"}`}>
           <div className="flex items-center justify-between p-6 border-b border-zinc-100">
            <h2 className="text-lg font-black text-zinc-900 uppercase tracking-wide">Isi Kandungan</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-zinc-400 hover:text-zinc-700 bg-zinc-50 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
            {sidebarContents.map((item, index) => {
              const isMainActive = pageNumber === item.page;
              return (
                <div key={index} className="mb-2">
                  <button onClick={() => { setPageNumber(item.page); setIsSidebarOpen(false); }} className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200 ${isMainActive ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-transparent text-zinc-800 hover:bg-zinc-100"}`}>
                    <span className={`text-[14px] ${isMainActive ? "font-bold" : "font-semibold"}`}>{item.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${isMainActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"}`}>ms {item.page}</span>
                  </button>

                  {item.subTopics && item.subTopics.length > 0 && (
                    <div className="mt-1 ml-6 pl-4 border-l-2 border-zinc-100 space-y-1">
                      {item.subTopics.map((sub, subIndex) => {
                        const isSubActive = pageNumber === sub.page;
                        return (
                          <button key={subIndex} onClick={() => { setPageNumber(sub.page); setIsSidebarOpen(false); }} className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all duration-200 ${isSubActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"}`}>
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
            <button onClick={() => signOut(auth)} className="w-full rounded-xl border border-red-200 bg-white py-3 text-sm font-bold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-sm">Log Keluar</button>
          </div>
        </div>

        {/* CONTENT AREA */}
        {/* UPDATE: padding-bottom dikurangkan supaya kawalan pagination rapat ke imej */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f5f7fb] w-full flex flex-col relative">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 md:p-5 shadow-sm gap-4 flex-shrink-0">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900">Nota Interaktif</h2>
              <p className="mt-0.5 text-xs md:text-sm font-medium text-zinc-500">Muka surat {pageNumber} daripada {TOTAL_PAGES}</p>
            </div>
            <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-1 w-full sm:w-auto justify-center">
              <button onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))} className="flex-1 sm:flex-none rounded-lg px-3 py-2 text-sm font-bold text-zinc-600 hover:bg-white hover:shadow-sm transition-all">-</button>
              <button onClick={() => setZoom(1)} className="flex-1 sm:flex-none rounded-lg px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-white hover:shadow-sm border-x border-zinc-200/50 transition-all">100%</button>
              <button onClick={() => setZoom((prev) => prev + 0.1)} className="flex-1 sm:flex-none rounded-lg px-3 py-2 text-sm font-bold text-zinc-600 hover:bg-white hover:shadow-sm transition-all">+</button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center pb-12">
            <div className="w-full overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-xl custom-scrollbar flex justify-center mb-6 relative group">
              <img
                src={`/pages/SISTEM BAHASA-${pageNumber}.webp`}
                alt={`Muka Surat ${pageNumber}`}
                style={{ width: `${100 * zoom}%`, minWidth: `${300 * zoom}px`, maxWidth: `${850 * zoom}px`, transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
                className="h-auto block origin-top"
              />
            </div>

            {/* UPDATE: mt-auto dibuang supaya kotak ini melekat rapat dengan gambar di atas */}
            <div className="w-full max-w-3xl bg-white rounded-2xl p-3 md:p-4 border border-zinc-200 shadow-sm flex items-center justify-between">
              <button onClick={() => setPageNumber(p => p > 1 ? p - 1 : p)} disabled={pageNumber === 1} className="flex items-center gap-1 md:gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-zinc-50 text-zinc-700 font-bold text-xs md:text-sm hover:bg-zinc-100 disabled:opacity-50 transition-colors border border-zinc-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg> Sebelumnya
              </button>
              <div className="text-xs md:text-sm font-semibold text-zinc-500">
                Halaman <span className="text-zinc-900 bg-zinc-100 px-2 py-1 rounded-md ml-1">{pageNumber}</span> / {TOTAL_PAGES}
              </div>
              <button onClick={() => setPageNumber(p => p < TOTAL_PAGES ? p + 1 : p)} disabled={pageNumber === TOTAL_PAGES} className="flex items-center gap-1 md:gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-blue-600 text-white font-bold text-xs md:text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20">
                Seterusnya <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            
            <div className="mt-8 text-center text-sm font-medium text-zinc-400">
              page by <span className="text-zinc-700 font-bold">cikgugrafik</span> <span className="text-blue-500 font-black">{'</>'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TETINGKAP CHAT AI */}
      {isAiChatOpen && (
        <div className="fixed bottom-24 right-4 md:right-8 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
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
          
          <div className="flex-1 p-4 h-64 overflow-y-auto bg-slate-50 space-y-4 text-sm custom-scrollbar">
            {aiChatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm shadow-sm"}`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isAiLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-zinc-100">
            <div className="flex items-center bg-zinc-100 rounded-full overflow-hidden pr-1 focus-within:ring-2 focus-within:ring-blue-500/20">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                placeholder="Tanya sini..."
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none font-medium text-zinc-700"
              />
              <button onClick={handleAiSearch} disabled={isAiLoading || !aiInput.trim()} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors m-1">
                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUTANG FLOATING (BUBBLE) AI */}
      <button
        onClick={() => setIsAiChatOpen(!isAiChatOpen)}
        className="fixed bottom-6 right-4 md:right-8 z-40 bg-zinc-900 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-600 hover:scale-105 transition-all duration-300 ring-4 ring-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
        </span>
      </button>

    </div>
  );
}