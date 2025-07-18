import featureFlags from '@/public/flags/featureFlags.json'

/**
 * Evaluates a single condition based on provided context.
 * @param {Object} condition - The condition object from the flag.
 * @param {Object} context - Runtime context (e.g., { env, user, now }).
 * @returns {boolean}
 */
function evaluateCondition(condition, context) {
  const now = context.now || new Date();

  switch (condition.criteria) {
    case 'time': {
      const target = new Date(condition.value);
      console.log(`
        operator: ${condition.operator}
        now: ${now}
        target: ${target}
        `)
      if (condition.operator === 'before') return now < target;
      if (condition.operator === 'after') return now > target;
      break;
    }

    case 'env': {
      if (condition.operator === 'equals') return context.env === condition.value;
      if (condition.operator === 'in') return Array.isArray(condition.value) && condition.value.includes(context.env);
      break;
    }

    // Add more criteria types here (e.g., userID, region, path, etc.)

    default:
      console.warn(`Unknown criteria: ${condition.criteria}`);
      return false;
  }

  return false;
}

/**
 * Evaluates whether a feature flag is enabled given the current context.
 * @param {string} key - The flag key to evaluate.
 * @param {Object} context - Optional context: { env, now, user, etc. }.
 * @returns {boolean}
 */
export function isFeatureEnabled(key, context = {}) {
  const flag = featureFlags[key];
  if (!flag) {
    console.warn(`Feature flag not found: ${key}`);
    return false;
  }

  const { default: defaultValue = false, operator = 'AND', conditions = [] } = flag;

  if (!conditions.length || conditions.length === 0) return defaultValue;

  const results = conditions.map((condition) => evaluateCondition(condition, context));

  console.log(results);

  if (operator === 'AND') return results.every(Boolean);
  if (operator === 'OR') return results.some(Boolean);

  console.warn(`Unknown operator: ${operator}`);
  return defaultValue;
}
