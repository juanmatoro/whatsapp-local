const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:3002/status");
}

app.whenReady().then(() => {
  // Inicia el microservicio como un proceso hijo
  spawn("node", ["src/server.js"], {
    cwd: __dirname,
    shell: true,
    detached: true,
    stdio: "ignore",
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
