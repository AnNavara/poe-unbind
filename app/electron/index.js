const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { resolve, join } = require('path');
const fs = require('fs');
const storage = require('electron-json-storage');
const readLastLines = require('read-last-lines');

const { broadcast, getStatus, getAddress } = require('../server/index');

const isDev = !app.isPackaged;

let logPath = null;
let logs = [];
let win;

const main = () => {
    win = new BrowserWindow({
        width: 500,
        height: 600,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: resolve(__dirname, './preload.js'),
        },
    });

    win.loadFile(resolve(__dirname, '../app.html'));
    win.on('ready-to-show', win.show);

    storage.get('logPath', (error, data) => {
        if (error) throw new error();
        if (!data) return;
        logPath = data['logPath'];
        win.once('ready-to-show', () => {
            win.webContents.send('logPath', logPath);
            win.webContents.send('status', getStatus());
            win.webContents.send('address', getAddress());
        });
    });

    if (isDev) win.webContents.openDevTools();
};
app.whenReady().then(main);

const saveSettings = (key, data) => {
    storage.set(key, data, (error) => {
        if (error) throw new error();
    });
};

ipcMain.handle('setPoePath', async () => {
    const setLogPath = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    const path = join(setLogPath.filePaths[0], '/logs/Client.txt');

    if (!path) return null;

    return fs.promises
        .access(path, fs.constants.F_OK)
        .then(() => {
            logPath = path;
            saveSettings('logPath', { logPath });
            return path;
        })
        .catch(() => null);
});

const lineFilter = (line) => {
    let res = null;
    [
        '@',
        // , '%', '&'
    ].some((val) => {
        line.includes(val) && !line.includes('To')
            ? (res = line.split(val)[1])
            : '';
        return line.includes(val);
    });
    return res;
};

const logHandler = (lines) => {
    lines.split('\n').forEach((line) => {
        const filtered = lineFilter(line);
        if (filtered && filtered.length && !logs.includes(line)) {
            try {
                logs.push(line);
                win.webContents.send('message', filtered);
                broadcast(filtered);
            } catch (error) {
                console.log(error);
            }
        }
    });
    if (logs.length > 30) logs = [...logs.slice(logs.length - 30, logs.length)];
};

const setupFileWatch = () => {
    win.webContents.send('onWatch', 'Watcher active');

    fs.watchFile(logPath, { interval: 200 }, () => {
        readLastLines.read(logPath, 2).then((logs) => {
            logHandler(logs);
        });
    });
};

ipcMain.handle('startWatch', () => {
    setupFileWatch();
});

ipcMain.handle('stopWatch', () => {
    fs.unwatchFile(logPath);
    win.webContents.send('offWatch', 'Watcher deactivated');
});
