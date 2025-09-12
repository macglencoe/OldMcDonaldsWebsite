"use client";
import Layout from "@/components/layout"
import { useState } from "react";
import faqData from "@/public/data/faq.json"
import CommitPanel from "@/components/commitPanel";

function saveToLocalStorage(faq) {
    localStorage.setItem('faq', JSON.stringify(faq));
}



export default function FAQEditor() {
    const [faqState, setFaqState] = useState(faqData);
    return (
        <Layout>
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
                <CommitPanel content={faqState} filePath="public/data/faq.json" title="Update FAQ" />
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
