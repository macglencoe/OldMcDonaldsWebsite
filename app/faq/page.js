"use client";
import Layout from "@/components/layout"
import { useState } from "react";
import faqData from "@/public/data/faq.json"

function saveToLocalStorage(faq) {
    localStorage.setItem('faq', JSON.stringify(faq));
}



export default function FAQEditor() {
    const [faqState, setFaqState] = useState(faqData);
    return (
        <Layout>
            <div className="flex flex-col gap-5">
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
            </div>
        </Layout>
    )
}

function FAQInput({ questionValue, answerValue, onChange, onDelete, onAddBelow }) {
    return (
        <div className="flex flex-col gap-2 border border-foreground/20 m-3 p-3 rounded-2xl">
            <div>
                <label className="mr-2">Question:</label>
                <input className="w-full" name="question" type="text" value={questionValue} onChange={onChange} />
            </div>
           
            <div className="justify-stretch">
                <label className="mr-2">Answer:</label>
                <input className="w-full" name="answer" type="text" value={answerValue} onChange={onChange} />
            </div>
            <div className="flex flex-row justify-between">
                <button className="px-2 py-1 bg-foreground text-background w-fit cursor-pointer" onClick={onDelete}>Delete</button>
                <button className="px-2 py-1 bg-foreground text-background w-fit cursor-pointer" onClick={onAddBelow}>Add Question Below</button>
            </div>
        </div>
    );
}