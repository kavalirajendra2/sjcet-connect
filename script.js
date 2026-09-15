const defaultEvents = [
  { title: "Freshers' Night 2026", host: "Student Council", date: "2026-09-18", time: "19:00", venue: "Main Auditorium", category: "Cultural", description: "" },
  { title: "Build for Tomorrow", host: "Code Collective", date: "2026-09-20", time: "10:00", venue: "Innovation Lab", category: "Academic", description: "" },
  { title: "Inter-College Football", host: "Sports Committee", date: "2026-09-22", time: "16:30", venue: "College Ground", category: "Sports", description: "" },
  { title: "Open Mic: Unfiltered", host: "Literature Society", date: "2026-09-24", time: "17:30", venue: "Amphitheatre", category: "Cultural", description: "" },
  { title: "Photography Walk", host: "Shutter Club", date: "2026-09-26", time: "07:00", venue: "North Gate", category: "Club", description: "" },
  { title: "Design Thinking 101", host: "Entrepreneurship Cell", date: "2026-09-28", time: "14:00", venue: "Seminar Hall B", category: "Academic", description: "" }
];
let events = JSON.parse(localStorage.getItem("campus-events") || "null") || defaultEvents;
let currentFilter = "All";
const grid = document.querySelector("#event-grid"), search = document.querySelector("#search"), count = document.querySelector("#event-count");
const formatDate = d => new Date(`${d}T12:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const formatTime = t => new Date(`2000-01-01T${t}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
function render() {
  const term = search.value.toLowerCase();
  const shown = events.filter(e => (currentFilter === "All" || e.category === currentFilter) && `${e.title} ${e.host} ${e.venue}`.toLowerCase().includes(term)).sort((a,b) => a.date.localeCompare(b.date));
  count.textContent = `${shown.length} event${shown.length !== 1 ? "s" : ""} to discover`;
  grid.innerHTML = shown.map(e => { const [month, day] = formatDate(e.date).split(" "); return `<article class="event-card"><div class="card-top"><div class="date-badge">${month.toUpperCase()}<strong>${day}</strong></div><span class="category">${e.category.toUpperCase()}</span></div><h3>${escapeHTML(e.title)}</h3><p class="host">by ${escapeHTML(e.host)}</p>${e.description ? `<p class="host">${escapeHTML(e.description)}</p>` : ""}<div class="details"><span>◷ ${formatTime(e.time)}</span><span>⌖ ${escapeHTML(e.venue)}</span></div></article>`; }).join("");
  document.querySelector("#empty-state").hidden = shown.length > 0;
}
function escapeHTML(value) { const d = document.createElement("div"); d.textContent = value; return d.innerHTML; }
search.addEventListener("input", render);
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => { document.querySelector(".filter.active").classList.remove("active"); button.classList.add("active"); currentFilter = button.dataset.filter; render(); }));
const dialog = document.querySelector("#event-dialog"), accessDialog = document.querySelector("#access-dialog"), form = document.querySelector("#event-form"), accessForm = document.querySelector("#access-form"), toast = document.querySelector("#toast");
function beginPosting() { const email = localStorage.getItem("campus-organizer"); if (email) { document.querySelector("#organizer-email").textContent = email; dialog.showModal(); } else accessDialog.showModal(); }
document.querySelectorAll(".post-button").forEach(button => button.addEventListener("click", beginPosting));
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => document.querySelector(`#${button.dataset.close}`).close()));
accessForm.addEventListener("submit", e => { e.preventDefault(); const { email, passcode } = Object.fromEntries(new FormData(accessForm)); const valid = email.trim().toLowerCase().endsWith("@campus.edu") && passcode === "POST2026"; document.querySelector("#access-error").hidden = valid; if (!valid) return; localStorage.setItem("campus-organizer", email.trim().toLowerCase()); accessForm.reset(); accessDialog.close(); beginPosting(); });
form.addEventListener("submit", e => { e.preventDefault(); const data = Object.fromEntries(new FormData(form)); events.push(data); localStorage.setItem("campus-events", JSON.stringify(events)); form.reset(); dialog.close(); render(); toast.textContent = "Your event is live on the notice board!"; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 3500); document.querySelector("#events").scrollIntoView({ behavior: "smooth" }); });
const menu = document.querySelector(".menu-button"), nav = document.querySelector(".navigation");
menu.addEventListener("click", () => { const open = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", open); });
render();
