// ================== WORKBOOK ACTIVITIES ==================

const ACTIVIDADES = [
  {
    titulo: "Unit 1 · Activity 1",
    prompt:
      "Activity 1 — NOW YOU.\n" +
      "Tell me a bit about yourself.\n" +
      "Say: your name, your age, where you live, where you’re from, what you speak, and your pets (if you have any).\n\n" +
      "IMPORTANT: Answer in Spanish."
  },
  {
    titulo: "Unit 1 · Activity 2",
    prompt:
      "Activity 2 — MY FAMILY.\n" +
      "Tell me about at least 3 family members.\n" +
      "Say who they are (mother/father/brother etc.) and their age if you can.\n\n" +
      "IMPORTANT: Answer in Spanish."
  },
  {
    titulo: "Unit 1 · Activity 3",
    prompt:
      "Activity 3 — NUMBERS (short answers, not full sentences).\n" +
      "1) Say your age (just the number is fine).\n" +
      "2) Say your house number (you can say individual digits for now!).\n" +
      "3) Say the day your birthday falls on (just the number).\n\n" +
      "IMPORTANT: Answer in Spanish."
  },
  {
    titulo: "Unit 1 · Activity 4",
    prompt:
      "Activity 4 — GENERAL QUESTIONS.\n" +
      "Answer these questions (in Spanish):\n" +
      "1) What’s your name?\n" +
      "2) How old are you?\n" +
      "3) Where do you live?\n" +
      "4) Do you speak Spanish?\n\n" +
      "IMPORTANT: Answer in Spanish."
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
const workbookEl = document.getElementById("workbook");

// ================== BUILD WORKBOOK BUTTONS ==================

workbookEl.innerHTML = "";
ACTIVIDADES.forEach((a) => {
  const b = document.createElement("button");
  b.textContent = a.titulo;
  b.onclick = () => {
    promptEl.value = a.prompt;
    promptEl.focus();
  };
  workbookEl.appendChild(b);
});

// ================== AUDIO RECORDING ==================

let mediaRecorder = null;
let chunks = [];
let currentStream = null;

function setStatus(t) {
  statusEl.textContent = t;
}

function pickMimeType() {
  // Try best-to-worst. Some phones (iOS Safari) support very limited types.
  const candidates = [
    "audio/mp4",
    "audio/aac",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg"
  ];

  if (!window.MediaRecorder) return null;

  for (const c of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(c)) return c;
    } catch {}
  }
  // If none supported, allow browser default by returning empty string
  return "";
}

function extFromMime(mime) {
  const m = (mime || "").toLowerCase();
  if (m.includes("mp4")) return "mp4";
  if (m.includes("aac")) return "aac";
  if (m.includes("mpeg")) return "mp3";
  if (m.includes("wav")) return "wav";
  if (m.includes("ogg")) return "ogg";
  return "webm";
}

btnRecord.addEventListener("click", async () => {
  transcriptEl.textContent = "(recording...)";
  feedbackEl.textContent = "(waiting...)";
  player.hidden = true;
  chunks = [];

  if (!navigator.mediaDevices?.getUserMedia) {
    setStatus("This browser cannot access the microphone.");
    return;
  }
  if (!window.MediaRecorder) {
    setStatus("This browser does not support recording (MediaRecorder). Try Chrome on Android or update iOS/Safari.");
    return;
  }

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const chosenMime = pickMimeType();
    if (chosenMime === null) {
      setStatus("Recording not supported on this browser.");
      return;
    }

    // If chosenMime is "", we let the browser choose defaults.
    mediaRecorder = chosenMime
      ? new MediaRecorder(currentStream, { mimeType: chosenMime })
      : new MediaRecorder(currentStream);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onerror = (e) => {
      console.error("MediaRecorder error:", e);
      setStatus("Recording error. Check mic permissions.");
    };

    mediaRecorder.onstop = async () => {
      try {
        currentStream?.getTracks()?.forEach((t) => t.stop());
      } catch {}

      const mime = mediaRecorder?.mimeType || "audio/webm";
      const blob = new Blob(chunks, { type: mime });

      // If blob is empty, nothing was recorded.
      if (!blob || blob.size < 1000) {
        transcriptEl.textContent = "(no audio captured)";
        feedbackEl.textContent = "(no feedback)";
        setStatus("No audio captured. Try again. If you're on iPhone, try a different browser/device.");
        return;
      }

      await handleAudio(blob, mime);
    };

    mediaRecorder.start(); // start recording
    btnRecord.disabled = true;
    btnStop.disabled = false;
    setStatus("Recording…");
  } catch (e) {
    console.error(e);
    setStatus("Microphone access denied. Enable mic permission for this site.");
  }
});

btnStop.addEventListener("click", () => {
  try {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  } catch (e) {
    console.error(e);
  }

  btnRecord.disabled = false;
  btnStop.disabled = true;
  setStatus("Processing…");
});

async function handleAudio(blob, mimeType) {
  const url = URL.createObjectURL(blob);
  player.src = url;
  player.hidden = false;

  setStatus("Transcribing…");

  const fd = new FormData();
  const ext = extFromMime(mimeType);
  fd.append("audio", blob, `audio.${ext}`);

  let trRes, trData;
  try {
    trRes = await fetch("/api/transcribe", { method: "POST", body: fd });
    trData = await trRes.json();
  } catch (e) {
    console.error(e);
    transcriptEl.textContent = "Network error calling /api/transcribe";
    setStatus("Error.");
    return;
  }

  if (!trRes.ok) {
    transcriptEl.textContent = (trData?.error || "Transcription error.") + (trData?.details ? `\n${trData.details}` : "");
    setStatus("Error.");
    return;
  }

  const transcript = (trData.transcript || "").trim();
  transcriptEl.textContent = transcript || "(empty)";

  setStatus("Generating feedback…");

  let fbRes, fbData;
  try {
    fbRes = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: (promptEl.value || "").trim() || null, transcript })
    });
    fbData = await fbRes.json();
  } catch (e) {
    console.error(e);
    feedbackEl.textContent = "Network error calling /api/feedback";
    setStatus("Error.");
    return;
  }

  if (!fbRes.ok) {
    feedbackEl.textContent = (fbData?.error || "Feedback error.") + (fbData?.details ? `\n${fbData.details}` : "");
    setStatus("Error.");
    return;
  }

  feedbackEl.textContent = JSON.stringify(fbData, null, 2);
  setStatus("Done.");
}
