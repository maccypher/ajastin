const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

var menubar = require("menubar");

var mb = menubar({ width: 212, height: 271, preloadWindow: true });

mb.on("ready", function ready() {
  // mb.window.openDevTools();
});
