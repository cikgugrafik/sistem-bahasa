import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "Anda ialah AI Sistem Bahasa Melayu. Jawab ringkas dan bantu cari topik Bahasa Melayu berdasarkan kandungan sistem.",
            },
            {
              role: "user",
              content: body.query,
            },
          ],
          temperature: 0.3,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Search gagal" },
      { status: 500 }
    );
  }
}