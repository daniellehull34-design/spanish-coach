import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "2mb" }));

// Sirve la web desde /public
app.use(express.static(path.join(process.cwd(), "public")));

// Subidas temporales de audio
const upload = multer({ dest: path.join(process.cwd(), "uploads") });

// Clave (en local viene del .env; en Render viene de Environment Variables)
const apiKey = (process.env.OPENAI_API_KEY || "").trim();

// DEBUG: no muestra la clave, solo si existe
console.log("DEBUG: OPENAI_API_KEY present?", !!apiKey);

// Si no hay clave, NO se cae el servidor (así Render detecta el puerto y carga la web)
const openai = apiKey ? new OpenAI({ apiKey }) : null;

function safeUnlink(p) {
  try { fs.unlinkSync(p); } catch {}
}

// Health check sencillo (útil para ver si está vivo)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, hasOpenAIKey: !!apiKey });
});

// 1) Transcripción
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  if (!openai) {
    return res.status(500).json({
      error: "Servidor sin OPENAI_API_KEY configurada en Render. Añádela en Render → Environment."
    });
  }

  const filePath = req.file?.path;
  if (!filePath) return res.status(400).json({ error: "No se recibió audio." });

  try {
    const result = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-mini-transcribe"
    });

    res.json({ transcript: (result.text ?? "").trim() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error transcribiendo el audio." });
  } finally {
    safeUnlink(filePath);
  }
});

// 2) Feedback
app.post("/api/feedback", async (req, res) => {
  if (!openai) {
    return res.status(500).json({
      error: "Servidor sin OPENAI_API_KEY configurada en Render. Añádela en Render → Environment."
    });
  }

  const { prompt, transcript } = req.body || {};
  if (!transcript || typeof transcript !== "string") {
    return res.status(400).json({ error: "Falta transcript." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Eres un profesor de español (España). Corrige gramática, vocabulario y naturalidad. Devuelve SOLO JSON válido."
        },
        {
          role: "user",
          content:
            `Actividad/pregunta (si existe): ${prompt ?? "(no especificado)"}\n\n` +
            `Transcripción del alumno:\n${transcript}\n\n` +
            `Devuelve SOLO JSON con:\n` +
            `{"nivel":"A1|A2|B1|B2|C1|C2|Mixto","resumen":"2-4 frases","correcciones":[{"original":"...","corregido":"...","explicacion":"..."}],"version_natural":"...","puntos_a_mejorar":["..."],"siguientes_ejercicios":[{"tipo":"repeticion|transformacion|pregunta","enunciado":"..."}]}`
        }
      ]
    });

    const content = completion.choices?.[0]?.message?.content || "{}";
    let json;
    try {
      json = JSON.parse(content);
    } catch {
      json = {
        nivel: "Mixto",
        resumen: "No he podido generar el feedback. Prueba otra vez.",
        correcciones: [],
        version_natural: "",
        puntos_a_mejorar: [],
        siguientes_ejercicios: []
      };
    }

    res.json(json);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error generando feedback." });
  }
});

// IMPORTANTE: Render exige usar process.env.PORT
const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`Servidor listo. Escuchando en puerto ${PORT}`);
});
