const{ipcMain} = require('electron');
const{app, BrowserWindow} = require('electron');
const path=require('path');
const { contextIsolated } = require('process');

function createWindow(){
    const win= new BrowserWindow({
        width: 430,
        height: 600,
        webPreferences:{
            preload: path.join(__dirname,"preload.cjs"),
            contextIsolation:true,
            nodeIntegration:false,
        }
        
    });
    win.loadURL('http://localhost:5173');  //vite dev server
    }
app.whenReady().then(createWindow);
ipcMain.handle("ping",()=>{
    return "pong";
});