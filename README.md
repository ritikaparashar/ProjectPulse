# ProjectPulse

ProjectPulse is a dependency-free JavaScript project tracker that runs directly in the browser. It provides a polished project board with persistent state, status filtering, searchable work items, live summary metrics, and a Canvas-based workload chart.

**Live Demo:** [ritikaparashar.github.io/ProjectPulse](https://ritikaparashar.github.io/ProjectPulse/)

## Overview

ProjectPulse is built with plain HTML, CSS, and JavaScript to demonstrate strong front-end fundamentals without relying on a framework or build tool. The app focuses on practical product behavior: adding work items, moving them across workflow stages, filtering the board, tracking completion, and preserving data locally between sessions.

## Features

- Add project work items with title, owner, status, and priority.
- Move items across `Planned`, `Active`, `Blocked`, and `Done` states.
- Search work items by title or owner.
- Filter the board by status.
- View live metrics for total items, completion rate, blocked work, and high-priority tasks.
- Persist board state using `localStorage`.
- Visualize status distribution with the Canvas API.
- Load sample data or clear the board from the UI.
- Use the app directly in the browser with no installation or build step.

## Tech Stack

| Area | Technology |
| --- | --- |
| Structure | HTML5 |
| Styling | CSS3, responsive layout |
| Logic | Vanilla JavaScript |
| Storage | Browser `localStorage` |
| Visualization | Canvas API |
| Runtime | Browser, no build tools |

## Project Structure

```text
ProjectPulse/
├── index.html
├── scripts/
│   └── app.js
├── styles/
│   └── main.css
├── basics/
│   └── test.js
└── README.md
```

## Implementation Highlights

- Single state object drives board rendering, metrics, filters, and chart updates.
- Event delegation handles status changes and item deletion efficiently.
- `FormData` is used for clean form submission handling.
- `localStorage` keeps user-created project items available after refresh.
- Safe HTML escaping is used before rendering dynamic item content.
- Canvas rendering updates the status chart whenever board data changes.
- Responsive CSS keeps the dashboard usable across desktop and smaller screens.

## Run Locally

Open `index.html` directly in a browser, or serve the folder locally:

```sh
python3 -m http.server 5173
```

Then visit:

```text
http://localhost:5173
```

## JavaScript Concepts Used

- DOM selection and updates
- Event listeners and event delegation
- Form handling with `FormData`
- Array methods such as `map`, `filter`, and derived counts
- Browser persistence with `localStorage`
- Safe HTML rendering helpers
- Canvas drawing
- State-driven UI rendering

## File Types

- `.html` - page structure and accessible UI markup
- `.css` - responsive layout, visual styling, and component states
- `.js` - app state, rendering, events, storage, filtering, and chart logic
- `.md` - project documentation

## Run the Basics Script

```sh
node basics/test.js
```

## Possible Extensions

- Add drag-and-drop movement between workflow columns.
- Add due dates, sorting, and priority grouping.
- Add CSV import and export for project data.
- Add tests for state helper functions and rendering behavior.
