import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { NextRequest, NextResponse } from "next/server";

const ai = genkit({
  plugins: [googleAI()],
});

const HONORIFIC_LABELS: Record<string, string> = {
  teineigo: "丁寧語（です・ます調）",
  sonkeigo: "尊敬語",
  kenjoogo: "謙譲語",
  bikago: "美化語",
};

export async function POST(req: NextRequest) {
  try {
    const { text, honorificType } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "テキストを入力してください" }, { status: 400 });
    }

    if (!honorificType || !HONORIFIC_LABELS[honorificType]) {
      return NextResponse.json({ error: "敬語タイプを選択してください" }, { status: 400 });
    }

    const targetLabel = HONORIFIC_LABELS[honorificType];

    const prompt = `あなたは日本語の敬語変換の専門家です。
以下のルールに従って、入力テキストを${targetLabel}に変換してください。

【変換ルール】
- ${honorificType === "teineigo" ? "「です」「ます」を使った丁寧な表現に変換する。文末を「です」「ます」「ました」「ません」などに変換する。" : ""}
- ${honorificType === "sonkeigo" ? "相手の動作を高める表現に変換する。「行く→いらっしゃる」「言う→おっしゃる」「食べる→召し上がる」「いる→いらっしゃる」「する→なさる」「もらう→お受け取りになる」などを適用する。" : ""}
- ${honorificType === "kenjoogo" ? "自分の動作を謙遜する表現に変換する。「行く→参る・伺う」「言う→申す・申し上げる」「食べる→いただく」「いる→おる」「する→いたす」「もらう→いただく」「見る→拝見する」などを適用する。" : ""}
- ${honorificType === "bikago" ? "名詞や表現を上品・丁寧にする美化語に変換する。「食べ物→お食事」「酒→お酒」「金→お金」「飯→ご飯」など接頭辞「お」や「ご」を適切に付ける。" : ""}
- 変換できない部分はそのままにする。
- 原文の意味・内容は変えない。
- 変換後のテキストのみを返す。説明は不要。

【入力テキスト】
${text}

【変換後テキスト（${targetLabel}）】`;

    const response = await ai.generate({
      model: googleAI.model("gemini-2.0-flash"),
      prompt,
      config: {
        temperature: 0.3,
      },
    });

    return NextResponse.json({ result: response.text.trim() });
  } catch (error) {
    console.error("Honorific conversion error:", error);
    return NextResponse.json(
      { error: "変換中にエラーが発生しました。しばらくしてから再試行してください。" },
      { status: 500 }
    );
  }
}
