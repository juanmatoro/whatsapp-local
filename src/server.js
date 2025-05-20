const express = require("express");
const venom = require("venom-bot");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3002;

let clientInstance = null;

venom
  .create({
    session: "session-local",
    multidevice: true,
    headless: true,
    useChrome: true,
    disableWelcome: true,
    updatesLog: false,
    puppeteerOptions: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  })
  .then((client) => {
    console.log("✅ WhatsApp conectado");
    clientInstance = client;

    app.get("/send", async (req, res) => {
      let to = (req.query.to || "").trim();
      const message = req.query.message;

      if (!to || !message) {
        return res
          .status(400)
          .json({ error: "Faltan parámetros to y message" });
      }

      // Formatear número si no incluye @c.us
      if (!to.includes("@")) {
        to = to + "@c.us";
      }

      try {
        await client.sendText(to, message);
        res.json({ success: true, to, message });
      } catch (error) {
        console.error("❌ Error al enviar mensaje:", error);
        res.status(500).json({ error: "No se pudo enviar el mensaje" });
      }
    });

    app.get("/status", async (req, res) => {
      try {
        const isConnected = await client.isConnected();
        res.json({ status: isConnected ? "connected" : "disconnected" });
      } catch (error) {
        res.status(500).json({ error: "Error consultando estado" });
      }
    });
  })
  .catch((error) => {
    console.error("❌ Error iniciando Venom:", error);
  });

app.listen(PORT, () => {
  console.log(`🚀 Microservicio WhatsApp activo en http://localhost:${PORT}`);
});
