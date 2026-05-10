const STORAGE_KEY = "project-pulse.items";

const statusConfig = [
  { key: "planned", label: "Planned", color: "#2f6f9f" },
  { key: "active", label: "Active", color: "#147d64" },
  { key: "blocked", label: "Blocked", color: "#b64934" },
  { key: "done", label: "Done", color: "#c98724" }
];

const sampleItems = [
  {
    id: crypto.randomUUID(),
    title: "Build responsive navigation",
    owner: "Ritika",
    status: "done",
    priority: "high",
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Add form validation states",
    owner: "Ritika",
    status: "active",
    priority: "high",
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Create empty state illustrations",
    owner: "Design",
    status: "planned",
    priority: "medium",
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Fix blocked API response mapping",
    owner: "Frontend",
    status: "blocked",
    priority: "medium",
    createdAt: new Date().toISOString()
  }
];

const state = {
  items: loadItems(),
  filter: "all",
  search: ""
};

const form = document.querySelector("#item-form");
const searchInput = document.querySelector("#search-input");
const filterButtons = document.querySelectorAll(".filter-button");
const seedButton = document.querySelector("#seed-button");
const clearButton = document.querySelector("#clear-button");
const chart = document.querySelector("#status-chart");
const context = chart.getContext("2d");

const metricNodes = {
  total: document.querySelector("#total-count"),
  completion: document.querySelector("#completion-rate"),
  blocked: document.querySelector("#blocked-count"),
  highPriority: document.querySelector("#priority-count")
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const title = data.get("title").trim();
  const owner = data.get("owner").trim();

  if (!title || !owner) {
    return;
  }

  state.items.unshift({
    id: crypto.randomUUID(),
    title,
    owner,
    status: data.get("status"),
    priority: data.get("priority"),
    createdAt: new Date().toISOString()
  });

  form.reset();
  document.querySelector("#item-priority").value = "medium";
  saveItems();
  render();
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value.trim().toLowerCase();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    render();
  });
});

document.addEventListener("change", (event) => {
  if (!event.target.matches("[data-status-select]")) {
    return;
  }

  const itemId = event.target.closest("[data-item-id]").dataset.itemId;
  updateStatus(itemId, event.target.value);
});

document.addEventListener("click", (event) => {
  if (!event.target.matches("[data-delete-item]")) {
    return;
  }

  const itemId = event.target.closest("[data-item-id]").dataset.itemId;
  deleteItem(itemId);
});

seedButton.addEventListener("click", () => {
  state.items = [...sampleItems];
  saveItems();
  render();
});

clearButton.addEventListener("click", () => {
  state.items = [];
  saveItems();
  render();
});

function loadItems() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return sampleItems;
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : sampleItems;
  } catch {
    return sampleItems;
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function updateStatus(itemId, status) {
  state.items = state.items.map((item) => {
    if (item.id !== itemId) {
      return item;
    }

    return { ...item, status };
  });

  saveItems();
  render();
}

function deleteItem(itemId) {
  state.items = state.items.filter((item) => item.id !== itemId);
  saveItems();
  render();
}

function getVisibleItems() {
  return state.items.filter((item) => {
    const matchesFilter = state.filter === "all" || item.status === state.filter;
    const searchableText = `${item.title} ${item.owner}`.toLowerCase();
    const matchesSearch = !state.search || searchableText.includes(state.search);

    return matchesFilter && matchesSearch;
  });
}

function render() {
  const visibleItems = getVisibleItems();

  statusConfig.forEach(({ key, label }) => {
    const list = document.querySelector(`#${key}-list`);
    const items = visibleItems.filter((item) => item.status === key);

    list.innerHTML = items.length
      ? items.map(renderItem).join("")
      : `<li class="empty-state">No ${label.toLowerCase()} items</li>`;
  });

  renderFilters();
  renderMetrics();
  renderChart();
}

function renderFilters() {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.filter);
  });
}

function renderMetrics() {
  const total = state.items.length;
  const done = countByStatus("done");
  const completion = total ? Math.round((done / total) * 100) : 0;

  metricNodes.total.textContent = total;
  metricNodes.completion.textContent = `${completion}%`;
  metricNodes.blocked.textContent = countByStatus("blocked");
  metricNodes.highPriority.textContent = state.items.filter((item) => item.priority === "high").length;
}

function renderItem(item) {
  const createdDate = new Date(item.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });

  return `
    <li class="work-item" data-item-id="${item.id}">
      <header>
        <p class="work-title">${escapeHtml(item.title)}</p>
        <span class="tag ${item.priority}">${escapeHtml(item.priority)}</span>
      </header>
      <div class="item-meta">
        <span>${escapeHtml(item.owner)}</span>
        <span>${createdDate}</span>
      </div>
      <div class="item-actions">
        <select data-status-select aria-label="Change status for ${escapeHtml(item.title)}">
          ${statusConfig.map((status) => `
            <option value="${status.key}" ${status.key === item.status ? "selected" : ""}>
              ${status.label}
            </option>
          `).join("")}
        </select>
        <button class="delete-item" type="button" data-delete-item>Delete</button>
      </div>
    </li>
  `;
}

function renderChart() {
  const width = chart.width;
  const height = chart.height;
  const padding = 28;
  const chartHeight = height - padding * 2;
  const barWidth = 44;
  const gap = 28;
  const maxCount = Math.max(...statusConfig.map((status) => countByStatus(status.key)), 1);

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fffdf8";
  context.fillRect(0, 0, width, height);

  statusConfig.forEach((status, index) => {
    const count = countByStatus(status.key);
    const barHeight = Math.round((count / maxCount) * chartHeight);
    const x = padding + index * (barWidth + gap);
    const y = height - padding - barHeight;

    context.fillStyle = status.color;
    context.fillRect(x, y, barWidth, barHeight || 3);

    context.fillStyle = "#1e2328";
    context.font = "700 13px system-ui";
    context.textAlign = "center";
    context.fillText(count, x + barWidth / 2, y - 8);

    context.fillStyle = "#6d747c";
    context.font = "700 11px system-ui";
    context.fillText(status.label, x + barWidth / 2, height - 8);
  });
}

function countByStatus(status) {
  return state.items.filter((item) => item.status === status).length;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

render();
