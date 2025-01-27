require("dotenv").config(); // Load environment variables

const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API Key dari .env
});

// Route untuk menyajikan halaman Pantai
app.get("/chat-pantai", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat-pantai.html"));
});

// Route untuk menyajikan halaman Coban
app.get("/chat-coban", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat-coban.html"));
});

// Route untuk menyajikan halaman Museum
app.get("/chat-museum", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat-museum.html"));
});

// Endpoint untuk menghasilkan pertanyaan otomatis
app.post("/generate-questions", async (req, res) => {
  const { context } = req.body; // Terima konteks seperti "pantai", "coban", atau "museum"

  // Prompt ke ChatGPT untuk menghasilkan pertanyaan
  const messages = [
    { role: "system", content: "Anda adalah asisten yang membantu membuat pertanyaan." },
    {
      role: "user",
      content: `Buat 3 pertanyaan pendek (maksimal 6 kata per pertanyaan) terkait ${context} di Malang Raya. Jangan tambahkan penomoran atau tanda baca di depan pertanyaan.`,
    },
  ];

  try {
    // OpenAI API request
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    // Split jawaban menjadi array pertanyaan
    const questions = completion.choices[0].message.content
      .trim()
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q);

    res.json({ questions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Gagal menghasilkan pertanyaan" });
  }
});

// Chatbot untuk Pantai Malang Raya
app.post("/chat-pantai", async (req, res) => {
  const userPrompt = req.body.prompt;
  const defaultPrompt = `Pada wisata Pantai yang ada di Malang, ${userPrompt}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: defaultPrompt }],
      max_tokens: 200,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat memproses permintaan.");
  }
});

// Chatbot untuk Coban Malang Raya
app.post("/chat-coban", async (req, res) => {
  const userPrompt = req.body.prompt;
  const defaultPrompt = `Pada wisata Coban yang ada di Malang, ${userPrompt}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: defaultPrompt }],
      max_tokens: 200,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat memproses permintaan.");
  }
});

// Chatbot untuk Museum Malang Raya
app.post("/chat-museum", async (req, res) => {
  const userPrompt = req.body.prompt;
  const defaultPrompt = `Pada wisata Museum yang ada di Malang, ${userPrompt}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: defaultPrompt }],
      max_tokens: 200,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat memproses permintaan.");
  }
});

// Port server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
