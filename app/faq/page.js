"use client";
import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import faqData from "@/public/data/faq.json";
import CommitPanel from "@/components/commitPanel";

function saveToLocalStorage(faq) {
    localStorage.setItem('faq', JSON.stringify(faq));
}

const FAQ_PATH = "public/data/faq.json";

function encodePath(path) {
    return path
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
}


export default function FAQEditor() {
    const [faqState, setFaqState] = useState(faqData);
    const [loadingRemote, setLoadingRemote] = useState(false);
    const [remoteError, setRemoteError] = useState(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('faq');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setFaqState(parsed);
                }
            }
        } catch (error) {
            console.warn("Failed to read FAQ from localStorage", error);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function fetchRemoteFaq() {
            setLoadingRemote(true);
            setRemoteError(null);
            try {
                const res = await fetch(`/api/blob/${encodePath(FAQ_PATH)}`);
                if (res.status === 404) {
                    return;
                }
                if (!res.ok) throw new Error(`Failed to fetch FAQ (${res.status})`);
                const payload = await res.json();
                let remote = null;
                if (Array.isArray(payload?.content)) {
                    remote = payload.content;
                } else if (typeof payload?.content === "string") {
                    try {
                        remote = JSON.parse(payload.content);
                    } catch (error) {
                        console.warn("Remote FAQ payload is not valid JSON", error);
                    }
                }
                if (!cancelled && Array.isArray(remote)) {
                    setFaqState(remote);
                }
            } catch (error) {
                console.error("Failed to load FAQ from blob", error);
                if (!cancelled) setRemoteError(error.message || "Failed to load FAQ");
            } finally {
                if (!cancelled) setLoadingRemote(false);
            }
        }
        fetchRemoteFaq();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        try {
            saveToLocalStorage(faqState);
        } catch (error) {
            console.warn("Failed to persist FAQ to localStorage", error);
        }
    }, [faqState]);

    return (
        <Layout>
            {loadingRemote && (
                <p className="px-4 text-sm text-foreground/60">Loading latest FAQ…</p>
            )}
            {remoteError && (
                <p className="px-4 text-sm text-red-600">{remoteError}</p>
            )}
            <div className="stack">
                {
                    faqState.map((item, index) => {
                        return (
                            <FAQInput key={index} questionValue={item.question} answerValue={item.answer} onChange={(e) => {
                                const newFaq = [...faqState];
                                newFaq[index][e.target.name] = e.target.value;
                                setFaqState(newFaq);
                                saveToLocalStorage(newFaq);
                            }}
                                onDelete={() => {
                                    const newFaq = [...faqState];
                                    newFaq.splice(index, 1);
                                    setFaqState(newFaq);
                                    saveToLocalStorage(newFaq);
                                }}
                                onAddBelow={() => {
                                    const newFaq = [...faqState];
                                    newFaq.splice(index + 1, 0, { question: "", answer: "" });
                                    setFaqState(newFaq);
                                    saveToLocalStorage(newFaq);
                                }}
                            />
                        )
                    })
                }
                <CommitPanel content={faqState} filePath={FAQ_PATH} title="Update FAQ" />
            </div>
        </Layout>
    )
}

function FAQInput({ questionValue, answerValue, onChange, onDelete, onAddBelow }) {
    return (
        <div className="card">
            <div className="card-body stack">
                <div className="field">
                    <label className="label">Question</label>
                    <input className="input" name="question" type="text" value={questionValue} onChange={onChange} />
                </div>
                <div className="field">
                    <label className="label">Answer</label>
                    <textarea className="textarea" name="answer" value={answerValue} onChange={onChange} />
                </div>
                <div className="flex flex-row justify-between">
                    <button className="btn btn-danger" onClick={onDelete}>Delete</button>
                    <button className="btn" onClick={onAddBelow}>Add Question Below</button>
                </div>
            </div>
        </div>
    );
}
