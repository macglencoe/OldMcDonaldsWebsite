"use client";
import Layout from "@/components/layout";
import priceData from "@/public/data/pricing.json"
import { useState } from "react";
import CommitPanel from "@/components/commitPanel";


export default function Prices() {
    const [priceState, setPriceState] = useState(priceData);

    return (
        <Layout>
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
            <CommitPanel content={priceState} filePath="public/data/pricing.json" title="Update pricing" />
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
