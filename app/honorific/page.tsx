"use client";

import { useState } from "react";

type HonorificType = "teineigo" | "sonkeigo" | "kenjoogo" | "bikago";

const HONORIFIC_OPTIONS: { value: HonorificType; label: string; description: string }[] = [
  { value: "teineigo", label: "丁寧語", description: "です・ます調の丁寧な表現" },
  { value: "sonkeigo", label: "尊敬語", description: "相手の動作を高める表現" },
  { value: "kenjoogo", label: "謙譲語", description: "自分の動作を謙遜する表現" },
  { value: "bikago", label: "美化語", description: "上品・丁寧にする表現" },
];

const EXAMPLE_TEXTS: Record<HonorificType, string> = {
  teineigo: "明日、会議に行く。田中さんも来る予定だ。資料を持ってきてくれ。",
  sonkeigo: "社長は今日、東京に行く。部長は何を食べたか。課長はどこにいるか。",
  kenjoogo: "私は明日、お客様のところへ行く。資料を持っていく。後で電話する。",
  bikago: "酒を飲みながら飯を食べた。金が必要だ。部屋に花を飾った。",
};

export default function HonorificPage() {
  const [inputText, setInputText] = useState("");
  const [honorificType, setHonorificType] = useState<HonorificType>("teineigo");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!inputText.trim()) {
      setError("テキストを入力してください。");
      return;
    }

    setIsLoading(true);
    setError("");
    setOutputText("");

    try {
      const response = await fetch("/api/convert-honorific", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, honorificType }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "エラーが発生しました。");
        return;
      }

      setOutputText(data.result);
    } catch {
      setError("通信エラーが発生しました。ネットワーク接続を確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExample = () => {
    setInputText(EXAMPLE_TEXTS[honorificType]);
    setOutputText("");
    setError("");
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
  };

  const selectedOption = HONORIFIC_OPTIONS.find((o) => o.value === honorificType)!;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            日本語敬語変換
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            AIが日本語を適切な敬語に変換します
          </p>
        </div>

        {/* Honorific Type Selector */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-5">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
            敬語の種類
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {HONORIFIC_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setHonorificType(option.value);
                  setOutputText("");
                  setError("");
                }}
                className={`rounded-xl p-3 text-center transition-all ${
                  honorificType === option.value
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <div className="font-semibold text-sm">{option.label}</div>
                <div
                  className={`text-xs mt-1 ${
                    honorificType === option.value
                      ? "text-blue-100"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              変換前のテキスト
            </h2>
            <button
              onClick={handleExample}
              className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 underline"
            >
              サンプルを挿入
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="ここに変換したいテキストを入力してください…"
            rows={6}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-400">{inputText.length} 文字</span>
            <button
              onClick={handleConvert}
              disabled={isLoading || !inputText.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  変換中…
                </>
              ) : (
                <>
                  <span>→</span>
                  {selectedOption.label}に変換
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl p-4 mb-5 text-sm">
            {error}
          </div>
        )}

        {/* Output */}
        {outputText && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-blue-200 dark:border-blue-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                変換後（{selectedOption.label}）
              </h2>
              <button
                onClick={handleCopy}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                コピー
              </button>
            </div>
            <p className="text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap text-sm">
              {outputText}
            </p>
          </div>
        )}

        {/* Guide */}
        <div className="mt-8 bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-5 text-xs text-slate-500 dark:text-slate-400">
          <p className="font-semibold mb-2 text-slate-600 dark:text-slate-300">敬語の種類について</p>
          <ul className="space-y-1">
            <li><span className="font-medium text-slate-700 dark:text-slate-200">丁寧語</span>：「です」「ます」を使い、聞き手に丁寧な印象を与える</li>
            <li><span className="font-medium text-slate-700 dark:text-slate-200">尊敬語</span>：相手や話題の人物の行動・状態を高め、敬意を示す</li>
            <li><span className="font-medium text-slate-700 dark:text-slate-200">謙譲語</span>：自分や身内の行動をへりくだって表現し、間接的に相手を高める</li>
            <li><span className="font-medium text-slate-700 dark:text-slate-200">美化語</span>：「お」「ご」などを付けて表現を上品にする</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
