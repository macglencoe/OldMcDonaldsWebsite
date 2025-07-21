# Feature Flags

When Pumpkin Season is in full swing, we need a way to update the website on the fly without having the dev boot up VS Code on a laptop.

The reasons we might need to update the website are many: a feature could be broken, we might want to notify users of something, or we might want to wait for a certain time to roll out a certain feature.

Being able to switch certain features on and off, manually or conditionally, is something that many business websites have need of. The solution for this is **Feature Flags**

## What are Feature Flags?
Also known as a _feature toggle_ or _feature switch_, Feature Flags are a technique used by web or application developers that allows developers to **enable or disable certain features without manually altering the code**.

They are implemented by embedding conditional logic into the code. Before a certain feature would be used, the code asks the flag manager "Is this feature enabled right now?" before it runs the code for that feature.

## What use do we have for Feature Flags?

| Use Case | Reason |
|---|---|
| [Seasonal Hero Sections](https://dev.to/macglencoe/new-heroes-253o) | Since there are different Hero sections for different seasons, Feature Flags can enable the website to automatically switch them out based on **time conditions**. | 
| Vendors & Vendor Promotions | The vendor menus won't be ready until close to the season start. We can work on developing them, and even deploy them, but they can be hidden to the user until we manually switch on this feature flag. |
| Night Maze Advertisement | When it gets close to night maze season, we can have a banner appear at the top of the home page that links to `/activities/night-maze`, making it the most optimally visible event. This is sure to increase visitors for the Night Maze |
| Opening Weekend Countdown | We can show a countdown to the opening day on the home page, but once it's done, it should be hidden. Obviously on opening day we won't have time to deploy a removal. Feature flags can do this automatically |
| Weather Advisory | In the case that there is rain or flooding and we have to close, we can enable a Weather Advisory banner on the home page, which shows the weather forecast for specified dates |
| [Maze Game](https://dev.to/macglencoe/maze-game-finally-on-the-web-1gdj) | Even though the Maze Game is unlikely to break, it's still a higher-risk feature than most on the website. In the case that there are issues with it, we can quickly shut it off with feature flags until we have time to fix it. |
| Contact Form | Just like the Maze Game, if there are issues with the Contact Form, we need to make sure people aren't still using it while we work on a fix. This enables us to hide it on the fly. |
| Facebook Feed | If the Facebook Feed `iframe` stops working, we can hide it with feature flags and only have a link to our Facebook page |

## Implementing Feature Flags

At first, I wanted to use [Statsig](https://www.statsig.com)'s feature flags, since they can be directly integrated with Vercel. However, their Free plan only allows **10k events** per month. This won't stand against the influx of visitors in September, and we won't have time to fix it by then.  The paid plan includes **5M events** per month, however it is extremely pricy at **$120/mo**. 

So, my solution is to make our own robust feature flags system inside the website.

This solution involves **defining** flags in a flexible format, and **evaluating** them when they are called upon.

### Definition
Our feature flags will be stored in JSON format in `/public/flags/featureFlags.json`.

**Each flag will include:**
- **A default value**: this is the **Boolean** value which will be passed if the conditions are not evaluated as True. If there are no conditions, the flag will simply be evaluated as the default.
- **An operator**: usually `AND` or `OR`, this tells the evaluator how to evaluate multiple conditions. `AND` requires all conditions to be true, and `OR` requires only one condition to be true.
- **An array of conditions**: Each condition is an object which contains a `criteria` like `time`, and a `value`. Depending on the `criteria`, other attributes may be required.

**Some flags may include:**
- **An array of arguments**: Although kind of hacky, this is a content-management feature within the feature flags system. If certain features require additional static information, they can be included here.
  Each argument will have a `key`, a `type`, and a `value`.

**Based on these requirements, here's what our JSON format will look like:**
```json
{
  "use_fall_hero": {
    "default": false,
    "operator": "AND",
    "conditions": [
      {
        "criteria": "time",
        "operator": "after",
        "value": "2025-09-22T13:49:00-05:00"
      },
      {
        "criteria": "time",
        "operator": "before",
        "value": "2025-11-02T18:00:00-05:00"
      }
    ]
  },
  "show_vendors": {
    "default": false,
    "conditions": []
  },
  "show_flood_banner": {
    "default": false,
    "conditions": [],
    "args": [
      {
        "key": "dates",
        "type": "dates",
        "values": [
          "2025-07-18",
          "2025-07-19",
          "2025-07-20"
        ]
      }
    ]
  }
}
```

### Evaluation

In order to evaluate whether a certain feature flag is enabled, we will create a public function that checks each condition based on provided context.

#### `isFeatureEnabled`

We'll start off defining `isFeatureEnabled` with `key` and `context` parameters. `key` is the name of the flag in the JSON file (like `show_vendors`) and `context` is an object containing information that will be needed to evaluate the conditions (like the current time)

Then the function will use that `key` to obtain the feature flag from `featureFlags.json`

```js
// /public/lib/featureEvaluator

export function isFeatureEnabled(key, context = {}) {
    const flag = featureFlags[key] // <- imported from featureFlags.json
    if (!flag) {
        console.warn(`Feature flag not found: ${key}`);
        return false;
    }
    // ... //
}

```

Then, we'll extract our `defaultValue`, `operator`, and `conditions` with fallback defaults:

```js
const { default: defaultValue = false, operator = 'AND', conditions = [] } = flag;
```

If there are no conditions, we can skip evaluation logic and return the default value:

```js
if (!conditions.length || conditions.length === 0) return defaultValue;
```

After that, we'll use `map` to go through each condition and evaluate it with `evaluateCondition`, which will be defined in the next section. For now, this function takes a `condition` object and a `context` object, and either returns `true` or `false`.

The `map` function creates an array of Boolean values as our results.

```js
const results = conditions.map((condition) => evaluateCondition(condition, context));
```

After they have all been evaluated, we will check which `operator` this flag uses, and return a Boolean value according to the correct operation:

```js
if (operator === 'AND') return results.every(Boolean);
if (operator === 'OR') return results.some(Boolean);
```

#### `evaluateCondition`

This function evaluates a single condition based on provided context:

```js
function evaluateCondition(condition, context) {
  // ... //
}
```

Within `evaluateCondition`, a switch-case block is used to separate the logic for different criteria:

```js
switch(condition.criteria) {
    case 'time': {
      const target = new Date(condition.value);
      if (condition.operator === 'before') return now < target;
      if (condition.operator === 'after') return now > target;
      break;
    }

    case 'env': {
      if (condition.operator === 'equals') return context.env === condition.value;
      if (condition.operator === 'in') return Array.isArray(condition.value) && condition.value.includes(context.env);
      break;
    }
    // ... //
}
```

Finally, if the criteria doesn't match any cases, `false` is returned. Additionally, the `break` statements in the previous snippet cause the program to exit the `switch` block and return false:

```js
switch (condition.criteria) {
    // ... //

    default:
        console.warn(`Unknown criteria: ${condition.criteria}`);
        return false;
}

return false;
```



