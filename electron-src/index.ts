// Native
import { join } from "path";
import { format } from "url";

// Packages
import {
  BrowserWindow,
  app,
  ipcMain,
  IpcMainEvent,
  Menu,
  desktopCapturer,
} from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer", 3000);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:3000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});

// display a menu for the user to select videoconf screen share sources
ipcMain.on("show-screen-share-selector", async (event: IpcMainEvent) => {
  const inputSources = await desktopCapturer.getSources({
    types: ["window", "screen"],
  });

  try {
    const selectedSourceId = await new Promise<string>((resolve, reject) => {
      const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map((source) => ({
          label: source.name,
          click: () => resolve(source.id),
        })),
      );

      // callback gets called after menu closes and is only fast enough if no selection was made
      videoOptionsMenu.popup({ callback: reject });
    });
    event.reply("show-screen-share-selector", true, selectedSourceId);
  } catch (e) {
    event.reply("show-screen-share-selector", false);
  }
});
