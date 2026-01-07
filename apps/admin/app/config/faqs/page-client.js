"use client";
import ConfigActionsBar from "@/components/config/actionsBar";
import FAQEditor from "@/components/config/faqEditor";
import ConfigSplitListEditor from "@/components/config/splitListEditor";
import { useMemo, useRef, useState } from "react";

function cloneItems(items) {
    return JSON.parse(JSON.stringify(items ?? []));
}

export default function FAQsPageClient({ faqs }) {
    const originalItemsRef = useRef(cloneItems(faqs));
    const [items, setItems] = useState(() => cloneItems(faqs));
    const [selectedIndex, setSelectedIndex] = useState(() => (faqs?.length ? 0 : null));
    const [saveState, setSaveState] = useState({ status: "idle", message: "" });

    const hasChanges = useMemo(() => {
        return JSON.stringify(items) !== JSON.stringify(originalItemsRef.current)
    }, [items])

    const validationErrors = useMemo(() => {
        const errors = [];
        const questionSet = new Set();
        items.forEach((item, index) => {
            if (!item.question || item.question.trim() === "") {
                errors.push(`FAQ ${index + 1} is missing a question.`);
            }
            if (!item.answer || item.answer.trim() === "") {
                errors.push(`FAQ ${index + 1} is missing an answer.`);
            }
            if (item.question) {
                if (questionSet.has(item.question)) {
                    errors.push(`Duplicate question: "${item.question}".`);
                }
                questionSet.add(item.question);
            }
        })
        return errors;
    }, [items]);

    const handleFAQChange = (index, nextFAQ) => {
        setItems((current) => current.map((item, i) => i === index ? nextFAQ : item))
    }

    const handleFAQDelete = (index) => {
        setItems((current) => {
            const next = current.filter((_, i) => i !== index);
            setSelectedIndex((prev) => {
                if (next.length === 0) return null;
                if (prev === null) return 0;
                if (prev === index) return Math.min(index, next.length - 1)
                if (prev > index) return prev - 1
                return prev;
            })
            return next;
        })
    }

    const handleResetAll = () => {
        setItems(cloneItems(originalItemsRef.current));
        setSelectedIndex(originalItemsRef.current.length ? 0 : null);
    }

    const handleMove = (index, delta) => {
        const target = index + delta
        if (target < 0 || target >= items.length) return
        const nextSelected = selectedIndex === index
            ? target
            : selectedIndex === target
                ? index
                : selectedIndex
        setItems((current) => {
            const next = [...current]
            const temp = next[target]
            next[target] = next[index]
            next[index] = temp
            return next
        })
        setSelectedIndex(nextSelected)
    }

    const handleAddFAQ = () => {
        setItems((current) => {
            const next = [
                ...current,
                {
                    question: "",
                    answer: ""
                }
            ]
            setSelectedIndex(next.length - 1);
            return next;
        })
    }

    const handleSave = async () => {
        setSaveState({ status: "saving", message: "" });
        try {
            const response = await fetch("/api/config?key=faq", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questions: items }),
            })
            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(data.error || `Save failed with status  ${response.status}`)
            }
            const data = await response.json();
            originalItemsRef.current = cloneItems(data.value?.questions);
            setItems(cloneItems(data.value?.questions ?? items));
            setSaveState({ status: "success", message: "Saved" });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to save";
            setSaveState({ status: "error", message });
        } finally {
            setTimeout(() => setSaveState({ status: "idle", message: "" }), 2000);
        }
    }



    return (
        <div className="space-y-5 p-3">
            <ConfigActionsBar
                title="FAQs"
                description="Manage frequently asked questions displayed to users."
                buttons={[
                    {
                        label: saveState.status === "saving" ? "Saving..." : "Save Changes",
                        onClick: handleSave,
                        disabled: validationErrors.length > 0 || !hasChanges || saveState.status === "saving"
                    },
                    {
                        label: "Add FAQ",
                        onClick: handleAddFAQ
                    },
                    {
                        label: "Revert to original",
                        onClick: handleResetAll,
                        disabled: !hasChanges
                    }
                ]}
            />

            {(saveState.status === "error" || validationErrors.length > 0 || saveState.status === "success") && (
                <div className="text-xs">
                    {validationErrors.length > 0 && (
                        <p className="text-red-600">Fix before saving: {validationErrors[0]}</p>
                    )}
                    {saveState.status === "error" && (
                        <p className="text-red-600">Save failed: {saveState.message}</p>
                    )}
                    {saveState.status === "success" && (
                        <p className="text-green-600">Saved</p>
                    )}
                </div>
            )}

            <ConfigSplitListEditor
                title="FAQs"
                items={items}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                getKey={(_, idx) => idx}
                renderEmpty={<p className="px-4 py-6 text-center text-sm text-gray-500">No FAQs found.</p>}
                renderRow={({ item, index, selected, onSelect }) => (
                    <div
                        className={`flex items-center gap-3 px-3 py-3 ${selected ? "bg-accent/10" : "hover:bg-gray-50"
                            }`}
                    >
                        <button type="button" onClick={onSelect} className="flex-1 text-left overflow-hidden">
                            <div className="space-y-1 overflow-hidden">
                                <p className="text-sm font-semibold text-gray-900">
                                    {item.question || <span className="italic text-gray-400">No question</span>}
                                </p>
                                <p className="text-xs truncate">
                                    {item.answer || <span className="italic text-gray-400">No answer</span>}
                                </p>
                            </div>
                        </button>
                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => handleMove(index, -1)}
                                disabled={index === 0}
                                className="rounded border border-gray-200 px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Move FAQ up"
                            >
                                ↑
                            </button>
                            <button
                                type="button"
                                onClick={() => handleMove(index, 1)}
                                disabled={index === items.length - 1}
                                className="rounded border border-gray-200 px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Move FAQ down"
                            >
                                ↓
                            </button>
                        </div>
                    </div>
                )}
                rightContent={
                    selectedIndex === null ? (
                        <p className="text-sm text-gray-500">Select an FAQ to edit.</p>
                    ) : (
                        <FAQEditor
                            faq={items[selectedIndex]}
                            onChange={(updated) => handleFAQChange(selectedIndex, updated)}
                            onDelete={() => handleFAQDelete(selectedIndex)}
                        />
                    )
                }
            />
        </div>
    )
}
