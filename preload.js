const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  switchModel: (modelName) => ipcRenderer.send("switch-model", modelName),

  onActiveModelChanged: (callback) => {
    ipcRenderer.on("active-model-changed", (_event, modelName) => {
      callback(modelName);
    });
  }
});
