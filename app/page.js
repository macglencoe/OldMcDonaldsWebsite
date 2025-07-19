"use client";

import Layout from "@/components/layout";

import featureFlags from "@/public/flags/featureFlags.json"
import { useEffect, useState } from "react";

function saveFlagsToLocalStorage(flags) {
  localStorage.setItem('featureFlags', JSON.stringify(flags));
}

function loadFlagsFromLocalStorage() {
  const savedFlags = localStorage.getItem('featureFlags');
  if (savedFlags) {
    setFeatureFlagsState(JSON.parse(savedFlags));
  }
}


export default function Home() {
  const [featureFlagsState, setFeatureFlagsState] = useState(featureFlags);

  useEffect(() => {
    saveFlagsToLocalStorage(featureFlagsState);
  }, [featureFlagsState]);

  return (
    <Layout>
      {
        Object.keys(featureFlags).map((key) => {
          return (
            <div key={key} className="p-4 flex flex-col gap-2">
              <h2>{key}</h2>
              <TrueFalseSelector
                label="Default"
                value={featureFlagsState[key].default}
                onChange={(e) => {
                  const newFlags = { ...featureFlagsState };
                  newFlags[key].default = e.target.value === "true";
                  setFeatureFlagsState(newFlags);
                }}
              />
              <div className="rounded-lg border-[1px] border-foreground/20 py-2 px-4">
                <h3 className="mb-2 font-bold">Conditions</h3>
                <div className="flex flex-row">
                  <label className="mr-2">Operator:</label>
                  <ConditionOperatorSelector
                    value={featureFlagsState[key].operator}
                    onChange={(e) => {
                      const newFlags = { ...featureFlagsState };
                      newFlags[key].operator = e.target.value;
                      setFeatureFlagsState(newFlags);
                    }}
                  />
                </div>
                <div>
                  {featureFlagsState[key].conditions.map((condition, index) => {
                    return (
                      <div key={index} className="flex flex-col gap-1 items-start mb-2 border-l-[2px] border-foreground/20 pl-2">
                        <ConditionCriteriaSelector
                          value={condition.criteria}
                          onChange={(e) => {
                            const newFlags = { ...featureFlagsState };
                            newFlags[key].conditions[index].criteria = e.target.value;
                            setFeatureFlagsState(newFlags);
                          }}
                        />

                        {condition.criteria === "time" && (
                          <>
                            <TimeOperatorSelector
                              value={condition.operator}
                              onChange={(e) => {
                                const newFlags = { ...featureFlagsState };
                                newFlags[key].conditions[index].operator = e.target.value;
                                setFeatureFlagsState(newFlags);
                              }}
                            />
                            <TimeSelector
                              value={condition.value}
                              onChange={(e) => {
                                const newFlags = { ...featureFlagsState };
                                newFlags[key].conditions[index].value = e.target.value;
                                setFeatureFlagsState(newFlags);
                              }}
                            />
                          </>
                        )
                        }


                        <button
                          onClick={() => {
                            const newFlags = { ...featureFlagsState };
                            newFlags[key].conditions.splice(index, 1);
                            setFeatureFlagsState(newFlags);
                          }}
                          className="text-sm text-foreground font-bold tracking-wider uppercase my-2 py-1 px-2 w-fit border-[1px] border-foreground/20 rounded-lg cursor-pointer"
                        >
                          Remove Condition
                        </button>

                      </div>
                    )
                  })

                  }
                  <button
                    onClick={() => {
                      const newFlags = { ...featureFlagsState };
                      newFlags[key].conditions.push({ criteria: "time", operator: "after", value: new Date().toISOString() });
                      setFeatureFlagsState(newFlags);
                    }}
                    className="text-sm text-foreground font-bold tracking-wider uppercase my-2 py-1 px-2 w-fit border-[1px] border-foreground/20 rounded-lg cursor-pointer"
                  >
                    Add Condition
                  </button>
                </div>
              </div>
              <div className="rounded-lg border-[1px] border-foreground/20 py-2 px-4 flex flex-col gap-2">
                <h3 className="mb-2 font-bold">Arguments</h3>
                {featureFlagsState[key].args && featureFlagsState[key].args.map((arg, index) => {
                  return (
                    <div key={index} className="flex flex-col border-l-[2px] border-foreground/20 pl-2">
                      <BasicTextInput
                        value={arg.key}
                        onChange={(e) => {
                          const newFlags = { ...featureFlagsState };
                          newFlags[key].args[index].key = e.target.value;
                          setFeatureFlagsState(newFlags);
                        }}
                      />
                      <ParamTypeSelector
                        value={featureFlagsState[key].args[index].type}
                        onChange={(e) => {
                          const newFlags = { ...featureFlagsState };
                          newFlags[key].args[index].type = e.target.value;
                          setFeatureFlagsState(newFlags);
                        }}
                      />

                      {featureFlagsState[key].args[index].type === "dates" && (
                        <TimeArray
                          values={featureFlagsState[key].args[index].values}
                          onChange={(e) => {
                            const newFlags = { ...featureFlagsState };
                            newFlags[key].args[index].values = e;
                            setFeatureFlagsState(newFlags);
                          }}
                        />
                      )
                      }

                      {featureFlagsState[key].args[index].type === "string" || featureFlagsState[key].args[index].type === "number" || featureFlagsState[key].args[index].type === "boolean" && (
                        <p>not implemented</p>
                      )
                      }

                      <button onClick={() => {
                        const newFlags = { ...featureFlagsState };
                        newFlags[key].args.splice(index, 1);
                        setFeatureFlagsState(newFlags);
                      }
                      }
                        className="text-sm text-foreground font-bold tracking-wider uppercase my-2 py-1 px-2 w-fit border-[1px] border-foreground/20 rounded-lg cursor-pointer"
                      >
                        Remove Argument
                      </button>

                    </div>
                  )
                })
                }
                <button className="text-sm text-foreground font-bold tracking-wider uppercase my-2 py-1 px-2 w-fit border-[1px] border-foreground/20 rounded-lg cursor-pointer"
                  onClick={() => {
                    const newFlags = { ...featureFlagsState };
                    newFlags[key].args.push({ key: "" });
                    setFeatureFlagsState(newFlags);
                  }}

                >Add Argument</button>
              </div>
            </div>
          )
        })
      }
    </Layout>
  )
}

function TimeArray({ values, onChange }) {
  return (
    <div>
      {values && values.map((time, index) => {
        return (
          <div key={index}>
            <TimeSelector
              value={time}
              onChange={(e) => {
                const tempValue = [...values];
                tempValue[index] = e.target.value;
                onChange(tempValue);
              }}

            />
            <button onClick={() => onChange(values.filter((_, i) => i !== index))}>Remove</button>
          </div>
        );
      })}
      <button onClick={() => onChange([...values, new Date().toISOString()])}>Add Time</button>
    </div>
  );
}

function ParamTypeSelector({ value, onChange }) {
  return (
    <div>
      <label className="mr-2">Type:</label>
      <select value={value} onChange={onChange}>
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
        <option value="dates">Dates</option>
      </select>
    </div>
  );
}

function BasicTextInput({ value, onChange }) {
  return (
    <div>
      <input type="text" value={value} onChange={onChange} />
    </div>
  );
}

function ConditionOperatorSelector({ value, onChange }) {
  return (
    <div>
      <select value={value} onChange={onChange}>
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </select>
    </div>
  );
}

function TimeOperatorSelector({ value, onChange }) {
  return (
    <div>
      <select value={value} onChange={onChange}>
        <option value="after">After</option>
        <option value="before">Before</option>
      </select>
    </div>
  );
}

function TimeSelector({ value, onChange }) {

  console.log(value)
  const date = new Date(value);
  const isoString = date.toISOString().split("Z")[0];
  return (
    <div>
      <input type="datetime-local" value={isoString} onChange={onChange} />
    </div>
  );
}


function ConditionCriteriaSelector({ value, onChange }) {
  const options = [
    "time",
    "env",
    // Add more criteria types here (e.g., userID, region, path, etc.):
  ]

  return (
    <div className="flex flex-row">
      <label>Criteria type:</label>
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}


function TrueFalseSelector({ label, value, onChange }) {
  return (
    <div>
      <label>{label}:</label>
      <select value={value} onChange={onChange}>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
  );
}