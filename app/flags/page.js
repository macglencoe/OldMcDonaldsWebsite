"use client";

import CommitPanel from "@/components/commitPanel";
import Layout from "@/components/layout";

import featureFlags from "@/public/flags/featureFlags.json"
import { useEffect, useState } from "react";

function saveFlagsToLocalStorage(flags) {
  try {
    localStorage.setItem('featureFlags', JSON.stringify(flags));
  } catch {}
}

function mergeFlags(base, saved) {
  const result = {};
  const keys = new Set([
    ...Object.keys(base || {}),
    ...Object.keys(saved || {}),
  ]);
  keys.forEach((k) => {
    const b = (base && base[k]) || {};
    const s = (saved && saved[k]) || {};
    const merged = { ...b, ...s };
    if (!Array.isArray(merged.conditions)) merged.conditions = b.conditions ?? [];
    // Only carry args if they exist in either base or saved
    if (!Array.isArray(merged.args)) {
      if (Array.isArray(s.args)) merged.args = s.args;
      else if (Array.isArray(b.args)) merged.args = b.args;
    }
    result[k] = merged;
  });
  return result;
}


export default function Home() {
  const [featureFlagsState, setFeatureFlagsState] = useState(featureFlags);

  useEffect(() => {
    // Load from localStorage on first mount
    try {
      const savedFlags = localStorage.getItem('featureFlags');
      if (savedFlags) {
        const parsed = JSON.parse(savedFlags);
        const merged = mergeFlags(featureFlags, parsed);
        setFeatureFlagsState(merged);
      }
    } catch {}
  }, []);

  useEffect(() => {
    saveFlagsToLocalStorage(featureFlagsState);
  }, [featureFlagsState]);

  const resetLocalFlags = () => {
    try {
      localStorage.removeItem('featureFlags');
    } catch {}
    // Reset state back to bundled defaults (deep clone to avoid refs)
    const fresh = JSON.parse(JSON.stringify(featureFlags));
    setFeatureFlagsState(fresh);
  };

  const clearAllLocalStorage = () => {
    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <Layout>
      <div className="flex flex-row gap-2 px-4 pt-4">
        <button
          onClick={resetLocalFlags}
          className="text-sm text-foreground font-bold tracking-wider uppercase py-1 px-2 w-fit border-[1px] border-foreground/20 rounded-lg cursor-pointer"
        >
          Reset Local Flags
        </button>
        <button
          onClick={clearAllLocalStorage}
          className="text-sm text-foreground font-bold tracking-wider uppercase py-1 px-2 w-fit border-[1px] border-foreground/20 rounded-lg cursor-pointer"
        >
          Clear All LocalStorage
        </button>
      </div>
      {
        Object.keys(featureFlagsState).map((key) => {
          return (
            <div key={key} className="p-4 flex flex-col gap-2">
              <h2>{key}</h2>
              <TrueFalseSelector
                label="Default"
                value={String(featureFlagsState[key].default)}
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
                            const next = e.target.value;
                            newFlags[key].conditions[index].criteria = next;
                            if (next === 'time') {
                              newFlags[key].conditions[index].operator = 'after';
                              newFlags[key].conditions[index].value = new Date().toISOString();
                            } else if (next === 'env') {
                              newFlags[key].conditions[index].operator = 'equals';
                              newFlags[key].conditions[index].value = '';
                            }
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

                        {condition.criteria === "env" && (
                          <>
                            <EnvOperatorSelector
                              value={condition.operator}
                              onChange={(e) => {
                                const newFlags = { ...featureFlagsState };
                                newFlags[key].conditions[index].operator = e.target.value;
                                // Reset value when switching operator
                                newFlags[key].conditions[index].value = e.target.value === 'in' ? [] : '';
                                setFeatureFlagsState(newFlags);
                              }}
                            />
                            {condition.operator === 'in' ? (
                              <CsvArrayInput
                                label="Environments (comma-separated)"
                                values={Array.isArray(condition.value) ? condition.value : []}
                                onChange={(arr) => {
                                  const newFlags = { ...featureFlagsState };
                                  newFlags[key].conditions[index].value = arr;
                                  setFeatureFlagsState(newFlags);
                                }}
                              />
                            ) : (
                              <BasicTextInput
                                value={typeof condition.value === 'string' ? condition.value : ''}
                                onChange={(e) => {
                                  const newFlags = { ...featureFlagsState };
                                  newFlags[key].conditions[index].value = e.target.value;
                                  setFeatureFlagsState(newFlags);
                                }}
                              />
                            )}
                          </>
                        )}


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
                          // Reset value(s) based on type
                          if (e.target.value === 'dates') {
                            newFlags[key].args[index].values = [];
                            delete newFlags[key].args[index].value;
                          } else {
                            newFlags[key].args[index].value = '';
                            delete newFlags[key].args[index].values;
                          }
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

                      {featureFlagsState[key].args[index].type === "string" && (
                        <BasicTextInput
                          value={featureFlagsState[key].args[index].value ?? ''}
                          onChange={(e) => {
                            const newFlags = { ...featureFlagsState };
                            newFlags[key].args[index].value = e.target.value;
                            setFeatureFlagsState(newFlags);
                          }}
                        />
                      )}

                      {featureFlagsState[key].args[index].type === "number" && (
                        <div>
                          <input
                            type="number"
                            value={featureFlagsState[key].args[index].value ?? ''}
                            onChange={(e) => {
                              const newFlags = { ...featureFlagsState };
                              const v = e.target.value;
                              newFlags[key].args[index].value = v === '' ? '' : Number(v);
                              setFeatureFlagsState(newFlags);
                            }}
                          />
                        </div>
                      )}

                      {featureFlagsState[key].args[index].type === "boolean" && (
                        <TrueFalseSelector
                          label="Value"
                          value={String(featureFlagsState[key].args[index].value ?? false)}
                          onChange={(e) => {
                            const newFlags = { ...featureFlagsState };
                            newFlags[key].args[index].value = e.target.value === 'true';
                            setFeatureFlagsState(newFlags);
                          }}
                        />
                      )}

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
                    if (!Array.isArray(newFlags[key].args)) newFlags[key].args = [];
                    newFlags[key].args.push({ key: "", type: "string", value: "" });
                    setFeatureFlagsState(newFlags);
                  }}

                >Add Argument</button>
              </div>
            </div>
          )
        })
      }
      <CommitPanel content={featureFlagsState} filePath="public/flags/featureFlags.json" title="Update feature flags" />
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
  let date = new Date(value);
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    date = new Date();
  }
  // Convert to local datetime-local format (YYYY-MM-DDTHH:MM)
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const MM = pad(date.getMinutes());
  const localValue = `${yyyy}-${mm}-${dd}T${HH}:${MM}`;
  return (
    <div>
      <input type="datetime-local" value={localValue} onChange={onChange} />
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


function EnvOperatorSelector({ value, onChange }) {
  return (
    <div>
      <label className="mr-2">Env operator:</label>
      <select value={value} onChange={onChange}>
        <option value="equals">Equals</option>
        <option value="in">In List</option>
      </select>
    </div>
  );
}

function CsvArrayInput({ label, values = [], onChange }) {
  const csv = Array.isArray(values) ? values.join(",") : "";
  return (
    <div>
      {label && <label className="mr-2">{label}:</label>}
      <input
        type="text"
        value={csv}
        onChange={(e) => {
          const arr = e.target.value
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
          onChange(arr);
        }}
      />
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
