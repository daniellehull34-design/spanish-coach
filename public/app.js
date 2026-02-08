// ================== COURSE DATA ==================

const SECTION_DATA = [
  {
    id: "espana",
    title: "Una Vuelta por España",
    subtitle: "A2-B1 · Culture and slang",
    description: "Explore Spanish culture, regional slang, and real-life stories.",
    units: []
  },
  {
    id: "beginners",
    title: "Beginners Spanish",
    subtitle: "A1 · Core foundations",
    description: "Build your basics with short guided speaking activities.",
    units: [
      {
        title: "Unit 1",
        topic: "Numbers 0-20",
        activities: [
          {
            title: "Activity 1",
            prompt: "¿Cuál es tu número de teléfono? What's your phone number?"
          },
          {
            title: "Activity 2",
            prompt:
              "Count backwards from 10. What is 11, 12, 13, 14 and 15 in Spanish?"
          },
          {
            title: "Activity 3",
            prompt: "Activity 3 coming soon."
          }
        ]
      },
      {
        title: "Unit 2",
        topic: "Colours",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      },
      {
        title: "Unit 3",
        topic: "Greetings",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      },
      {
        title: "Unit 4",
        topic: "At the bar",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      },
      {
        title: "Unit 5",
        topic: "Getting to know you",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      },
      {
        title: "Unit 6",
        topic: "Numbers up to 100",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      },
      {
        title: "Unit 7",
        topic: "Age",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      },
      {
        title: "Unit 8",
        topic: "Family",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      },
      {
        title: "Unit 9",
        topic: "At the market",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      },
      {
        title: "Unit 10",
        topic: "Restaurant",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      },
      {
        title: "Unit 11",
        topic: "The time",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      },
      {
        title: "Unit 12",
        topic: "Days and dates",
        activities: [
          { title: "Activity 1", prompt: "Activity 1 coming soon." },
          { title: "Activity 2", prompt: "Activity 2 coming soon." },
          { title: "Activity 3", prompt: "Activity 3 coming soon." }
        ]
      }
    ]
  }
];

// ================== ELEMENTS ==================

const btnRecord = document.getElementById("btnRecord");
const btnStop = document.getElementById("btnStop");
const statusEl = document.getElementById("status");
const player = document.getElementById("player");
const transcriptEl = document.getElementById("transcript");
const feedbackEl = document.getElementById("feedback");
const promptEl = document.getElementById("prompt");
const sectionsEl = document.getElementById("sections");
const unitsSectionEl = document.getElementById("unitsSection");
const unitsTitleEl = document.getElementById("unitsTitle");
const unitsSubtitleEl = document.getElementById("unitsSubtitle");
const unitsEl = document.getElementById("units");
const activitiesSectionEl = document.getElementById("activitiesSection");
const activitiesTitleEl = document.getElementById("activitiesTitle");
const activitiesSubtitleEl = document.getElementById("activitiesSubtitle");
const activitiesEl = document.getElementById("activities");
const activitySectionEl = document.getElementById("activitySection");
const activityTitleEl = document.getElementById("activityTitle");
const activityPromptEl = document.getElementById("activityPrompt");
const recordRowEl = document.getElementById("recordRow");

let currentSection = null;
let currentUnit = null;
let currentActivity = null;

// ================== BUILD SECTION / UNIT / ACTIVITY ==================

function setStatus(t) {
  statusEl.textContent = t;
}

function resetFeedback() {
  transcriptEl.textContent = "(your transcript will appear here)";
  feedbackEl.textContent = "(your feedback will appear here)";
  player.hidden = true;
}

function renderSections() {
  sectionsEl.innerHTML = "";
  SECTION_DATA.forEach((section) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="meta">${section.subtitle}</span>
      <h3>${section.title}</h3>
      <p>${section.description}</p>
    `;
    const button = document.createElement("button");
    button.textContent = section.units.length ? "View units" : "Coming soon";
    button.disabled = section.units.length === 0;
    button.addEventListener("click", () => {
      currentSection = section;
      currentUnit = null;
      currentActivity = null;
      renderUnits();
    });
    card.appendChild(button);
    sectionsEl.appendChild(card);
  });
}

function renderUnits() {
  if (!currentSection) return;
  unitsSectionEl.hidden = false;
  activitiesSectionEl.hidden = true;
  activitySectionEl.hidden = true;
  unitsTitleEl.textContent = `${currentSection.title} · Units`;
  unitsSubtitleEl.textContent = currentSection.subtitle;
  unitsEl.innerHTML = "";

  currentSection.units.forEach((unit, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="meta">Unit ${index + 1}</span>
      <h3>${unit.title}</h3>
      <p>${unit.topic}</p>
    `;
    const button = document.createElement("button");
    button.className = "secondary";
    button.textContent = "Open unit";
    button.addEventListener("click", () => {
      currentUnit = unit;
      currentActivity = null;
      renderActivities();
    });
    card.appendChild(button);
    unitsEl.appendChild(card);
  });
}

function renderActivities() {
  if (!currentUnit) return;
  activitiesSectionEl.hidden = false;
  activitySectionEl.hidden = true;
  activitiesTitleEl.textContent = `${currentUnit.title} activities`;
  activitiesSubtitleEl.textContent = currentUnit.topic;
  activitiesEl.innerHTML = "";

  currentUnit.activities.forEach((activity) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="meta">${currentUnit.title}</span>
      <h3>${activity.title}</h3>
      <p>${activity.prompt}</p>
    `;
    const button = document.createElement("button");
    button.textContent = "Start activity";
    button.addEventListener("click", () => {
      currentActivity = activity;
      showActivity();
    });
    card.appendChild(button);
    activitiesEl.appendChild(card);
  });
}

function showActivity() {
  if (!currentActivity) return;
  activitySectionEl.hidden = false;
  activityTitleEl.textContent = `${currentUnit.title} · ${currentActivity.title}`;
  activityPromptEl.textContent = currentActivity.prompt;
  promptEl.value = currentActivity.prompt;
  recordRowEl.hidden = false;
  setStatus("Ready.");
  resetFeedback();
}

// ================== AUDIO RECORDING ==================

let mediaRecorder;
let chunks = [];

renderSections();

btnRecord.addEventListener("click", async () => {
  chunks = [];
  transcriptEl.textContent = "(recording...)";
  feedbackEl.textContent = "(waiting...)";
  player.hidden = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: "audio/webm" });
      await handleAudio(blob);
    };

    mediaRecorder.start();
    btnRecord.disabled = true;
    btnStop.disabled = false;
    setStatus("Recording…");
  } catch (e) {
    console.error(e);
    setStatus("Microphone access denied.");
  }
});

btnStop.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  btnRecord.disabled = false;
  btnStop.disabled = true;
  setStatus("Processing…");
});

async function handleAudio(blob) {
  const url = URL.createObjectURL(blob);
  player.src = url;
  player.hidden = false;

  setStatus("Transcribing…");
  const fd = new FormData();
  fd.append("audio", blob, "audio.webm");

  const trRes = await fetch("/api/transcribe", { method: "POST", body: fd });
  const trData = await trRes.json();

  if (!trRes.ok) {
    transcriptEl.textContent = trData.error || "Transcription error.";
    setStatus("Error.");
    return;
  }

  const transcript = (trData.transcript || "").trim();
  transcriptEl.textContent = transcript || "(empty)";

  setStatus("Generating feedback…");

  const fbRes = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: promptEl.value || null, transcript })
  });

  const fbData = await fbRes.json();

  if (!fbRes.ok) {
    feedbackEl.textContent = fbData.error || "Feedback error.";
    setStatus("Error.");
    return;
  }

  feedbackEl.textContent = JSON.stringify(fbData, null, 2);
  setStatus("Done.");
}
