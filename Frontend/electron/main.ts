import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let newWindow: BrowserWindow | null;

//main window
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    title: "AI Surveillance System",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMinimumSize(850, 620);

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  win.on("minimize", () => {
    if (newWindow) {
      newWindow.minimize();
    }
  });

  win.on("restore", () => {
    if (newWindow) {
      newWindow.restore();
    }
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

// Open modal window
function openModalWindow(data: any, title: string) {
  if (win === null) {
    console.error("Main window is not available");
    return;
  }

  newWindow = new BrowserWindow({
    width: 700,
    height: 500,
    parent: win,
    modal: true,
    minimizable: false,
    title: title ? title : "Modal window",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  newWindow.on("minimize", (event: any) => {
    event.preventDefault();
  });

  if (VITE_DEV_SERVER_URL) {
    newWindow.loadURL(`${VITE_DEV_SERVER_URL}model`);
  } else {
    newWindow.loadFile(path.join(RENDERER_DIST, "index.html"), {
      hash: "model",
    });
  }

  newWindow.webContents.on("did-finish-load", () => {
    newWindow?.webContents.send("new-window-data", data);
  });

  newWindow.once("closed", () => {
    newWindow = null;
  });
}

ipcMain.on("open-modal-window", (event, data, title) => {
  openModalWindow(data, title);
});
