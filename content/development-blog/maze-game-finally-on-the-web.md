# Maze Game - Finally on the Web


![flowchart](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v2byko32ge59klb0uua7.png)

## Developer Summary

The Maze Game is a client-side experience driven by QR code scanning, `localStorage`, and conditional UI flows. Here's a breakdown of its key components and logic:

### 1. **QR Code Entry (`/maze-game/[code]`)**

* Users scan a QR code that opens a route with a unique `code` param.
* On page load:

  * The `[code]` is added to `localStorage.foundCodes` if it’s not already present.
  * Displays a confirmation (e.g., name and image).
  * After a short delay, user is redirected to `/maze-game`.

### 2. **Game Dashboard (`/maze-game`)**

* On load:

  * Retrieves `foundCodes` and `submissions` from `localStorage`.
  * Fetches the current season’s valid codes from the server.
* Compares:

  * Filters local codes to include only those valid for the current season.
  * If all season codes are found:

    * Checks if the current year is in `localStorage.submissions`.
    * If not, displays the submission form.

### 3. **Submission Flow**

* On form submission:

  * Sends user details via an email API.
  * Records the current year in `localStorage.submissions` to prevent repeat entries.

### 4. **Storage Format**

```js
// localStorage.foundCodes = ["alpha", "bravo", "charlie"]
// localStorage.submissions = ["2024"]
```

### 5. **Persistence Notes**

* `localStorage` is used for persistence across page reloads and sessions.
* There is no backend account system; uniqueness is enforced by year-based checks.
