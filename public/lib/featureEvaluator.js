let featureFlags = {};

/**
 * Replace the in-memory feature flag cache.
 * @param {Record<string, any>} flags
 */
export function setFeatureFlags(flags) {
  if (flags && typeof flags === "object") {
    featureFlags = flags;
  } else {
    featureFlags = {};
  }
}

/**
 * Evaluates a single condition based on provided context.
 * @param {Object} condition - The condition object from the flag.
 * @param {Object} context - Runtime context (e.g., { env, user, now }).
 * @returns {boolean}
 */
function evaluateCondition(condition, context) {
  const now = context.now || new Date();

  switch (condition.criteria) {
    case "time": {
      const target = new Date(condition.value);
      if (condition.operator === "before") return now < target;
      if (condition.operator === "after") return now > target;
      break;
    }

    case "env": {
      if (condition.operator === "equals") return context.env === condition.value;
      if (condition.operator === "in") return Array.isArray(condition.value) && condition.value.includes(context.env);
      break;
    }

    default:
      console.warn(`Unknown criteria: ${condition.criteria}`);
      return false;
  }

  return false;
}

function evaluateFlag(key, context, flags) {
  const source = flags && typeof flags === "object" ? flags : featureFlags;
  const flag = source?.[key];
  if (!flag) {
    console.warn(`Feature flag not found: ${key}`);
    return false;
  }

  const { default: defaultValue = false, operator = "AND", conditions = [] } = flag;

  if (!conditions?.length) return defaultValue;

  const results = conditions.map((condition) => evaluateCondition(condition, context));

  if (operator === "AND") return results.every(Boolean);
  if (operator === "OR") return results.some(Boolean);

  console.warn(`Unknown operator: ${operator}`);
  return defaultValue;
}

/**
 * Evaluates whether a feature flag is enabled given the current context.
 * @param {string} key - The flag key to evaluate.
 * @param {Object} context - Optional context: { env, now, user, etc. }.
 * @returns {boolean}
 */
export function isFeatureEnabled(key, context = {}) {
  return evaluateFlag(key, context, featureFlags);
}

/**
 * Creates a scoped feature evaluator bound to the provided flag set.
 * @param {Record<string, any>} flags
 * @returns {(key: string, context?: Object) => boolean}
 */
export function createFeatureEvaluator(flags) {
  return (key, context = {}) => evaluateFlag(key, context, flags);
}
