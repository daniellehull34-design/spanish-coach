// ================== COURSE DATA ==================

const COURSE = {
  beginners: {
    title: "Beginners Spanish",
    units: [
      {
        id: "u1",
        title: "Unit 1 — Numbers 0–20",
        activities: [
          {
            title: "Activity 1 – Phone number",
            prompt:
              "Unit 1 · Activity 1 — Phone number\n\n" +
              "Question: ¿Cuál es tu número de teléfono?\n" +
              "English: What's your phone number?\n\n" +
              "IMPORTANT: Answer in Spanish."
          },
          {
            title: "Activity 2 – Count backwards",
            prompt:
              "Unit 1 · Activity 2 — Count backwards\n\n" +
              "Task: Count backwards from 10.\n\n" +
              "IMPORTANT: Say the numbers in Spanish."
          },
          {
            title: "Activity 3 – Remember 11–15",
            prompt:
              "Unit 1 · Activity 3 — Remember 11–15\n\n" +
              "Do you remember these numbers?\n" +
              "11, 12, 13, 14, 15\n\n" +
              "IMPORTANT: Say them in Spanish."
          },
          {
            title: "Activity 4 – Prices (euros)",
            prompt:
              "Unit 1 · Activity 4 — Prices (euros)\n\n" +
              "Say these prices in Spanish:\n" +
              "5€, 10€, 7€, 9€, 2€, 8€, 3€, 6€\n\n" +
              "IMPORTANT: Say each price in Spanish."
          },
          {
            title: "Activity 5 – Prices (11–15€)",
            prompt:
              "Unit 1 · Activity 5 — Prices (11–15€)\n\n" +
              "Now try with euros:\n" +
              "11€, 12€, 13€, 14€, 15€\n\n" +
              "IMPORTANT: Say each price in Spanish."
          },
          {
            title: "Activity 6 – Remember 16–20",
            prompt:
              "Unit 1 · Activity 6 — Remember 16–20\n\n" +
              "Do you remember these numbers?\n" +
              "16, 17, 18, 19, 20\n\n" +
              "IMPORTANT: Say them in Spanish."
          },
          {
            title: "Activity 7 – Prices (16–20€)",
            prompt:
              "Unit 1 · Activity 7 — Prices (16–20€)\n\n" +
              "Now try with euros:\n" +
              "16€, 17€, 18€, 19€, 20€\n\n" +
              "IMPORTANT: Say each price in Spanish."
          },
          {
            title: "Activity 8 – Dictation",
            prompt:
              "Unit 1 · Activity 8 — Dictation\n\n" +
              "Press record and repeat the numbers you hear (0–20).\n\n" +
              "IMPORTANT: Repeat in Spanish."
          },
          {
            title: "Activity 9 – ¿Cuánto es?",
            prompt:
              "Unit 1 · Activity 9 — ¿Cuánto es?\n\n" +
              "Answer the question: ¿Cuánto es?\n" +
              "Use: 'X euros' or 'X euros y Y céntimos'.\n\n" +
              "Examples to practise:\n" +
              "12,50€ / 3,20€ / 7€ / 0,80€\n\n" +
              "IMPORTANT: Answer in Spanish."
          }
        ]
      },

      { id: "u2", title: "Unit 2 — Colours", activities: [] },
      { id: "u3", title: "Unit 3 — Greetings", activities: [] },
      { id: "u4", title: "Unit 4 — At the bar", activities: [] },
      { id: "u5", title: "Unit 5 — Getting to know you", activities: [] },
      { id: "u6", title: "Unit 6 — Numbers up to 100", activities: [] },
      { id: "u7", title: "Unit 7 — Age", activities: [] },
      { id: "u8", title: "Unit 8 — Family", activities: [] },
      { id: "u9", title: "Unit 9 — At the market", activities: [] },
      { id: "u10", title: "Unit 10 — Restaurant", activities: [] },
      { id: "u11", title: "Unit 11 — The time", activities: [] },
      { id: "u12", title: "Unit 12 — Days and dates", activities: [] }
    ]
  }
};

// ================== SCREENS ==================

const screenHome = document.getElementById("screenHome");
const screenCulture = document.getElementById("screenCulture");
const screenBeginners = document.getElementById("screenBeginners");
const screenUnit = document.getElementById("screenUnit");

function showOnly(screen) {
  [screenHome, screenCulture, screenBeginners, screenUnit].forEach(s => s.hidden = true);
  screen.hidden = false;
}

// ================== NAVIGATION ==================

document.getElementById("btnCulture").onclick = () => showOnly(screenCulture);

document.getElementById("btnBeginners").onclick = () => {
  renderUnits();
  showOnly(screenBeginners);
};

document.getElementById("btnBackFromCulture").onclick = () => showOnly(screenHome);
document.getElementById("btnBackFromBeginners").onclick = () => showOnly(screenHome);

document.getElementById("btnBackToUnits").onclick = () => {
  renderUnits();
  showOnly(screenBeginners);
};

// ================== UNIT LIST ==================

const unitListEl = document.getElementById("unitList");
const unitTitleEl = document.getElementById("unitTitle");
const activityListEl = document.getElementById("activityList");
const activityPromptEl = document.getElementById("activityPrompt");

const transcriptEl = document.getElementById("transcript");
const feedbackEl = document.getElementById("feedback");
const statusEl = document.getElementById("status");
const player = document.getElementById("player");
const promptEl = document.getElementById("prompt");

let currentUnit = null;
let currentActivity = null;

function renderUnits() {
  unitListEl.innerHTML = "";
  COURSE.beginners.units.forEach((u, idx) => {
    const b = document.createElement("button");
    b.textContent = `Unit ${idx + 1}`;
    b.onclick = () => openUnit(u);
    unitListEl.appendChild(b);
  });
}

function openUnit(unit) {
  currentUnit = unit;
  currentActivity = null;

  unitTitleEl.textContent = unit.title;
  activityPromptEl.textContent = "(select an activity)";
  transcriptEl.textContent = "(text will appear here)";
  feedbackEl.textContent = "(feedback will appear here)";
  statusEl.textContent = "Ready.";
  player.hidden = true;

  renderActivities(unit);
  showOnly(screenUnit);
}

function renderActivities(unit) {
  activityListEl.innerHTML = "";

  if (!unit.activities.length) {
    const p = document.createElement("p");
    p.style.opacity = "0.7";
    p.textContent = "Activities coming soon.";
    activityListEl.appendChild(p);
    return;
  }

  unit.activities.forEach((a) => {
    const b = document.createElement("button");
    b.textContent = a.title;
    b.onclick = () => {
      currentActivity = a;
      activityPromptEl.textContent = a.prompt;
      promptEl.value = a.prompt;
    };
    activityListEl.appendChild(b);
  });
}

// ================== RECORDING ==================

const btnRecord = document.getElementById("btnRecord");
const btnStop = document.getElementById("btnStop");

let mediaRecorder = null;
let chunks = [];
let stream = null;

function setStatus(t) {
  statusEl.textContent = t;
}

function pickMimeType() {
  const types = [
    "audio/mp4",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg"
  ];
  for (const t of types) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

function extFromMime(mime) {
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

btnRecord.onclick = async () => {
  if (!currentActivity) {
    setStatus("Select an activity first.");
    return;
  }

  transcriptEl.textContent = "(recording...)";
  feedbackEl.textContent = "(waiting...)";
  chunks = [];

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mime = pickMimeType();
    mediaRecorder = mime
      ? new MediaRecorder(stream, { mimeType: mime })
      : new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());

      const blob = new Blob(chunks, { type: mediaRecorder.mimeType });

      if (blob.size < 1000) {
        setStatus("No audio captured.");
        return;
      }

      await handleAudio(blob, mediaRecorder.mimeType);
    };

    mediaRecorder.start();
    btnRecord.disabled = true;
    btnStop.disabled = false;
    setStatus("Recording…");

  } catch {
    setStatus("Microphone permission denied.");
  }
};

btnStop.onclick = () => {
  btnStop.disabled = true;
  btnRecord.disabled = false;
  setStatus("Processing…");
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
};

// ================== AI CALLS ==================

async function handleAudio(blob, mime) {
  player.src = URL.createObjectURL(blob);
  player.hidden = false;

  setStatus("Transcribing…");

  const fd = new FormData();
  fd.append("audio", blob, `audio.${extFromMime(mime)}`);

  const trRes = await fetch("/api/transcribe", { method: "POST", body: fd });
  const trData = await trRes.json();

  if (!trRes.ok) {
    transcriptEl.textContent = trData.error || "Transcription error.";
    setStatus("Error.");
    return;
  }

  transcriptEl.textContent = trData.transcript || "(empty)";

  setStatus("Generating feedback…");

  const fbRes = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: promptEl.value,
      transcript: trData.transcript
    })
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

// ================== START ==================

showOnly(screenHome);
