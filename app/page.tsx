"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type DailyQuestion = { optionA: string; optionB: string };

function ymdTokyo(d = new Date()) {
    const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    return jst.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function Home() {
    const [uid, setUid] = useState("");
    const [q, setQ] = useState<DailyQuestion | null>(null);
    const [status, setStatus] = useState<string>("");

    const today = useMemo(() => ymdTokyo(), []);

    // 匿名ログイン
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                const cred = await signInAnonymously(auth);
                setUid(cred.user.uid);
            } else {
                setUid(user.uid);
            }
        });
        return () => unsub();
    }, []);

    // 今日の問題を読む
    useEffect(() => {
        (async () => {
            const snap = await getDoc(doc(db, "daily_questions", today));
            if (!snap.exists()) {
                setStatus(`今日(${today})の問題がまだ登録されてない`);
                setQ(null);
                return;
            }
            setQ(snap.data() as DailyQuestion);
            setStatus("");
        })();
    }, [today]);

    // 投票
    const vote = async (choice: "A" | "B") => {
        if (!uid) return;

        const voteId = `${today}__${uid}`;
        const ref = doc(db, "votes", voteId);

        const already = await getDoc(ref);
        if (already.exists()) {
            setStatus("今日はもう投票済み");
            return;
        }

        await setDoc(ref, {
            date: today,
            uid,
            choice,
            createdAt: serverTimestamp(),
        });

        setStatus("投票しました（今日は変更できません）");
    };

    return (
        <main style={{ padding: 24, maxWidth: 520 }}>
            <h1>究極の選択</h1>
            <p style={{ opacity: 0.7 }}>today: {today}</p>
            <p style={{ opacity: 0.7 }}>uid: {uid || "ログイン中..."}</p>

            {status && <p>{status}</p>}

            {q && (
                <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                    <button style={{ padding: 12 }} onClick={() => vote("A")}>
                        A：{q.optionA}
                    </button>
                    <button style={{ padding: 12 }} onClick={() => vote("B")}>
                        B：{q.optionB}
                    </button>
                </div>
            )}
        </main>
    );
}
