const { ipcRenderer, contextBridge } = require('electron');

const WINDOW_API = {
    setPoePath: () => ipcRenderer.invoke('setPoePath'),
    startWatcher: () => ipcRenderer.invoke('startWatch'),
    stopWatcher: () => ipcRenderer.invoke('stopWatch'),
    startServer: () => ipcRenderer.invoke('startServer'),
    stopServer: () => ipcRenderer.invoke('stopServer'),
};

ipcRenderer.on('logPath', (event, message) => {
    window.postMessage({ type: 'logPath', message });
});

ipcRenderer.on('address', (event, message) => {
    window.postMessage({ type: 'address', message });
});

ipcRenderer.on('onWatch', (event, message) => {
    window.postMessage({ type: 'onWatch', message });
});

ipcRenderer.on('offWatch', (event, message) => {
    window.postMessage({ type: 'offWatch', message });
});

ipcRenderer.on('message', (event, message) => {
    window.postMessage({ type: 'message', message });
});

ipcRenderer.on('onServer', (event, message) => {
    window.postMessage({ type: 'onServer', message });
});

ipcRenderer.on('offServer', (event, message) => {
    window.postMessage({ type: 'offServer', message });
});

ipcRenderer.on('status', (event, message) => {
    window.postMessage({ type: 'status', message });
});

contextBridge.exposeInMainWorld('api', WINDOW_API);
