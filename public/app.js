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

let mediaRecorder;
let chunks = [];

function setStatus(t) {
  statusEl.textContent = t;
}

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
