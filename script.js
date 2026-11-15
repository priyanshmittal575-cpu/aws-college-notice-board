const defaultNotices = [
  {
    id: 1,
    title: "End-Semester Theory Exam Date Sheet (Dec 2026)",
    category: "Examinations",
    date: "15 Nov 2026",
    urgent: true,
    desc: "All B.Tech 1st-year students must verify their subject codes on the university portal before Nov 22."
  },
  {
    id: 2,
    title: "UP Post-Matric Scholarship Biometric Verification",
    category: "Scholarship",
    date: "13 Nov 2026",
    urgent: true,
    desc: "Submit hard copies of income and caste certificates at the Registrar Office Counter 3."
  },
  {
    id: 3,
    title: "Workshop on GitHub Student Developer Pack",
    category: "Events",
    date: "10 Nov 2026",
    urgent: false,
    desc: "Bring your college ID card and laptop to Seminar Hall 2 at 3:00 PM."
  },
  {
    id: 4,
    title: "Assignment-2 Submission for Engineering Physics",
    category: "Academics",
    date: "08 Nov 2026",
    urgent: false,
    desc: "Handwritten numerical solutions for Unit 3 & 4 due in Monday's tutorial class."
  }
];

let notices = JSON.parse(localStorage.getItem("campus_notices")) || defaultNotices;
let activeCat = "All";

const boardGrid = document.getElementById("boardGrid");
const searchNotice = document.getElementById("searchNotice");
const noticeForm = document.getElementById("noticeForm");

function renderBoard() {
  const q = searchNotice.value.toLowerCase().trim();
  const filtered = notices
    .filter((n) => (activeCat === "All" || n.category === activeCat) &&
      (n.title.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q)))
    .sort((a, b) => Number(b.urgent) - Number(a.urgent));

  boardGrid.innerHTML = "";
  filtered.forEach((n) => {
    const card = document.createElement("article");
    card.className = `notice-card ${n.urgent ? "urgent" : ""}`;
    card.innerHTML = `
      <div>
        <div class="card-meta">
          <span>${n.urgent ? '<span class="urgent-badge">URGENT</span> ' : ""}${n.category}</span>
          <span>${n.date}</span>
        </div>
        <h3>${n.title}</h3>
        <p>${n.desc}</p>
      </div>
      <a href="#circular-${n.id}" class="doc-link" onclick="alert('Circular Ref #${n.id}: ${n.title}')">View Circular Details →</a>
    `;
    boardGrid.appendChild(card);
  });
}

document.getElementById("toggleFormBtn").addEventListener("click", () => {
  noticeForm.classList.toggle("hidden");
});

noticeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newNotice = {
    id: Date.now(),
    title: document.getElementById("nTitle").value.trim(),
    category: document.getElementById("nCat").value,
    urgent: document.getElementById("nImportant").checked,
    desc: document.getElementById("nDesc").value.trim(),
    date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  };
  notices.unshift(newNotice);
  localStorage.setItem("campus_notices", JSON.stringify(notices));
  noticeForm.reset();
  noticeForm.classList.add("hidden");
  renderBoard();
});

document.getElementById("catButtons").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  document.querySelectorAll("#catButtons button").forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");
  activeCat = e.target.dataset.cat;
  renderBoard();
});

searchNotice.addEventListener("input", renderBoard);
renderBoard();