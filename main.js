const { app, BrowserWindow } = require('electron');
const path = require('path');

// Auto start on boot
app.setLoginItemSettings({
  openAtLogin: true,
  path: app.getPath('exe'),
  args: [app.getAppPath()]
});

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 420,
    height: 650,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    skipTaskbar: true, // hides from the taskbar to feel like a widget
  });

  mainWindow.loadFile('index.html');
  
  // Set window to be always on bottom (acts like wallpaper)
  // Or just leave it floating. If we want it truly on the desktop, always on bottom might help on Windows.
  // mainWindow.setAlwaysOnTop(false);
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
