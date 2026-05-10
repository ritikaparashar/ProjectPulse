# ProjectPulse

ProjectPulse is a dependency-free JavaScript project tracker that runs in the browser. It demonstrates practical front-end fundamentals with a polished UI, persistent state, filtering, derived metrics, and a canvas-based status chart.

## Features

- Add work items with owner, status, and priority.
- Move items between planned, active, blocked, and done states.
- Search by title or owner.
- Filter the board by status.
- Track total items, completion rate, blocked work, and high-priority work.
- Persist board state with `localStorage`.
- Visualize status distribution with the Canvas API.
- Reset the board or reload sample data.

## Project Structure

```text
js-web/
  index.html
  scripts/
    app.js
  styles/
    main.css
  basics/
    test.js
  README.md
```

## File Types

- `.html` - page structure and accessible UI markup.
- `.css` - responsive layout, visual styling, and component states.
- `.js` - app state, rendering, events, storage, filtering, and chart logic.
- `.md` - project documentation.

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

- DOM selection and event delegation
- Form handling with `FormData`
- Array methods: `map`, `filter`, and derived counts
- Browser persistence with `localStorage`
- Safe HTML rendering helpers
- Canvas drawing
- Responsive UI updates from a single state object

## Run the Basics Script

```sh
node basics/test.js
```

## Next Ideas

- Add drag-and-drop between columns.
- Add due dates and sorting.
- Add CSV import/export.
- Add tests for state helper functions.
