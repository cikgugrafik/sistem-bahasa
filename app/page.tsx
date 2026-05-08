"use client";

import { useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const [pageNumber, setPageNumber] = useState(1);

  const [zoom, setZoom] = useState(1);

  const [search, setSearch] = useState("");

  const [aiResult, setAiResult] = useState("");

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

    setAiResult("Sedang mencari...");

    try {
      const response = await fetch(
        "https://api.deepseek.com/chat/completions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              "Bearer sk-aeab062d29744d0588ba1dcb7d0f2aea"
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
        }
      );

      const data = await response.json();

      setAiResult(data.choices[0].message.content);
    } catch (error) {
      setAiResult("Ralat AI Search.");
    }
  };
    if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-6">

        <div className="w-full max-w-6xl overflow-hidden rounded-[40px] bg-white shadow-2xl grid lg:grid-cols-2 border border-zinc-200">

          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] p-14 text-white">

            <div>
              <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-400" />

                Portal Pembelajaran Interaktif
              </div>

              <h1 className="text-7xl font-black leading-none">
                SISTEM
                <br />
                BAHASA
              </h1>

              <p className="mt-8 max-w-md text-lg leading-8 text-zinc-300">
                Platform rujukan Bahasa Melayu moden untuk murid dan guru.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-3xl bg-white/10 p-6">
                <h3 className="text-4xl font-black">
                  104
                </h3>

                <p className="mt-2 text-sm text-zinc-300">
                  Muka surat nota grafik
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-6">
                <h3 className="text-4xl font-black">
                  AI
                </h3>

                <p className="mt-2 text-sm text-zinc-300">
                  Smart Search Bahasa Melayu
                </p>
              </div>

            </div>
          </div>

          <div className="flex items-center justify-center p-10 lg:p-16 bg-white">

            <div className="w-full max-w-md">

              <div className="mb-10">

                <h2 className="text-5xl font-black text-zinc-900">
                  Selamat Datang
                </h2>

                <p className="mt-4 text-zinc-500 leading-8 text-lg">
                  Login menggunakan akaun Google untuk mengakses sistem pembelajaran premium.
                </p>

              </div>

              <button
                onClick={signInWithGoogle}
                className="flex w-full items-center justify-center gap-4 rounded-3xl bg-zinc-900 px-6 py-5 text-lg font-bold text-white hover:bg-black"
              >

                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="h-7 w-7"
                />

                Login Dengan Google

              </button>

              <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">

                <h3 className="text-lg font-bold text-zinc-800">
                  Premium Access
                </h3>

                <p className="mt-2 text-sm leading-7 text-zinc-500">
                  Nota grafik interaktif, zoom PDF, AI Search dan navigasi kandungan lengkap.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
    return (
    <div className="min-h-screen bg-[#f6f8fc] text-zinc-800">

      <div className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-6 px-8 py-4">

          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xl font-black text-white shadow-lg">
              SB
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900">
                Sistem Bahasa
              </h1>

              <p className="text-sm text-zinc-500">
                {user.displayName}
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="flex w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari tatabahasa..."
                className="w-full bg-transparent px-6 py-4 text-[15px] outline-none"
              />

              <button
                onClick={handleSearch}
                className="bg-zinc-900 px-8 text-sm font-semibold text-white"
              >
                Search
              </button>

            </div>
          </div>

          <div className="flex items-center gap-4">

            <a
              href="https://drive.google.com/file/d/1D0j15JZJv3JhN81HkutXiSEnMMU9zz6w/view"
              target="_blank"
              className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white"
            >
              Full PDF
            </a>

            <img
              src={user.photoURL || "/avatar.png"}
              className="h-14 w-14 rounded-2xl"
            />

          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-90px)] overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-[320px] border-r border-zinc-200 bg-white p-6 overflow-y-auto">

          <div className="mb-8">
            <h2 className="text-3xl font-black text-zinc-900">
              Isi Kandungan
            </h2>
          </div>

          <div className="space-y-3">

            {contents.map((item, index) => (
              <button
                key={index}
                onClick={() => setPageNumber(item.page)}
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-left hover:bg-blue-50"
              >
                <span className="text-[15px] font-semibold text-zinc-800">
                  {item.title}
                </span>

                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-500">
                  {item.page}
                </span>
              </button>
            ))}

          </div>

          <button
            onClick={() => signOut(auth)}
            className="mt-10 w-full rounded-2xl border border-red-200 bg-red-50 py-4 text-sm font-bold text-red-600"
          >
            Logout
          </button>

        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">

          {aiResult && (
            <div className="mb-6 rounded-3xl border border-blue-100 bg-blue-50 p-6">

              <h2 className="mb-3 text-2xl font-bold text-blue-900">
                AI Search Result
              </h2>

              <p className="leading-8 whitespace-pre-line text-blue-950">
                {aiResult}
              </p>

            </div>
          )}

          <div className="mb-6 flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6">

            <div>
              <h2 className="text-4xl font-black tracking-tight text-zinc-900">
                Nota Lengkap Bahasa Melayu
              </h2>

              <p className="mt-2 text-zinc-500">
                Page {pageNumber} daripada 104
              </p>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  setZoom((prev) => Math.max(prev - 0.1, 0.5))
                }
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold"
              >
                Zoom -
              </button>

              <button
                onClick={() => setZoom(1)}
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold"
              >
                Fit
              </button>

              <button
                onClick={() => setZoom((prev) => prev + 0.1)}
                className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold"
              >
                Zoom +
              </button>

            </div>

          </div>

          <div className="flex justify-center">

            <div className="overflow-hidden rounded-[30px] border border-zinc-200 bg-white shadow-2xl">

              <img
                src={`/pages/SISTEM BAHASA-${pageNumber}.webp`}
                alt={`Page ${pageNumber}`}
                style={{
                  width: `${850 * zoom}px`,
                  transition: "0.2s ease",
                }}
                className="h-auto"
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}