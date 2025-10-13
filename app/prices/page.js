"use client";
import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import CommitPanel from "@/components/commitPanel";

const PRICING_PATH = "public/data/pricing.json";

function encodePath(path) {
    return path
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
}


export default function Prices() {
    const [priceState, setPriceState] = useState(null);
    const [loadingRemote, setLoadingRemote] = useState(false);
    const [remoteError, setRemoteError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchRemotePricing() {
            setLoadingRemote(true);
            setRemoteError(null);
            try {
                const res = await fetch(`/api/blob/${encodePath(PRICING_PATH)}`);
                if (res.status === 404) {
                    throw new Error("Pricing blob does not exist.");
                }
                if (!res.ok) throw new Error(`Failed to fetch pricing (${res.status})`);
                const payload = await res.json();
                let remote = null;
                if (payload?.content && typeof payload.content === "object") {
                    remote = payload.content;
                } else if (typeof payload?.content === "string") {
                    try {
                        remote = JSON.parse(payload.content);
                    } catch (error) {
                        console.warn("Remote pricing payload is not valid JSON", error);
                    }
                }
                if (!cancelled && remote) {
                    setPriceState(remote);
                }
            } catch (error) {
                console.error("Failed to load pricing from blob", error);
                if (!cancelled) setRemoteError(error.message || "Failed to load pricing");
            } finally {
                if (!cancelled) setLoadingRemote(false);
            }
        }
        fetchRemotePricing();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <Layout>
            {loadingRemote && (
                <p className="px-4 text-sm text-foreground/60">Loading latest pricing…</p>
            )}
            {remoteError && (
                <p className="px-4 text-sm text-red-600">{remoteError}</p>
            )}
            {!priceState && !loadingRemote && !remoteError && (
                <p className="px-4 text-sm text-foreground/60">No pricing data available.</p>
            )}
            {priceState && (
                <>
                    <div className="k-grid">
                        {Object.keys(priceState).map((key) => (
                            <PriceInput
                                key={key}
                                title={key}
                                amountValue={priceState[key].amount}
                                perValue={priceState[key].per}
                                onChange={(e) => {
                                    const newPrices = { ...priceState };
                                    newPrices[key][e.target.name] = e.target.value;
                                    setPriceState(newPrices);
                                }}
                            />
                        ))}
                    </div>
                    <CommitPanel content={priceState} filePath={PRICING_PATH} title="Update pricing" />
                </>
            )}
        </Layout>
    )
}

function PriceAmountInput( { value, onChange }) {
    return (
        <div className="field">
            <label className="label">Amount</label>
            <input className="input" value={value} name="amount" type="number" step="0.01" min="0" onChange={onChange}/>
        </div>
    )
}


function PriceInput( { title, amountValue, perValue, onChange}) {
    return (
        <div className="card">
            <div className="card-header capitalize">{title.replaceAll('-', ' ')}</div>
            <div className="card-body stack">
                <PriceAmountInput value={amountValue} onChange={onChange}/>
                <div className="field">
                    <label className="label">Per</label>
                    <input className="input" value={perValue} name="per" type="text" onChange={onChange}/>
                </div>
            </div>
        </div>
    )
}
