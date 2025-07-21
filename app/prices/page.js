"use client";
import Layout from "@/components/layout";
import priceData from "@/public/data/pricing.json"
import { useState } from "react";


export default function Prices() {
    const [priceState, setPriceState] = useState(priceData);

    return (
        <Layout>
            {
                Object.keys(priceState).map((key) => {
                    return (
                        <div key={key} className="p-4 flex flex-col gap-2">
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
                        </div>
                    )
                })
            }
        </Layout>
    )
}

function PriceAmountInput( { value, onChange }) {
    return (
        <div>
            <label>Amount:</label>
            <input value={value} name="amount" type="number" onChange={onChange}/>
        </div>
    )
}


function PriceInput( { title, amountValue, perValue, onChange}) {
    return (
        <div className="p-3 border border-foreground/20 rounded-2xl">
            <label>{title}</label>
            <PriceAmountInput value={amountValue} onChange={onChange}/>
            <label>Per:</label>
            <input value={perValue} name="per" type="text" onChange={onChange}/>
        </div>
    )
}