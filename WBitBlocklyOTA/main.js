const appInfo = require('./package.json');
const WebSocketServer = require('websocket').server;
const http = require('http');
let portId = null;
let wsConnection = null;
const APPNAME = appInfo.description;
const VERSION = appInfo.version;
const DEFAULT_URL = 'https://www.hinet.net';
let titleMsg = '';
let mainwin = null;

function updateTitle(msg) {
    if (msg) {
        titleMsg = `${APPNAME} V${VERSION} - ${msg}`;
    }
    if (mainwin) {
        mainwin.eval(null,
            `document.getElementsByTagName("title")[0].innerText = "${titleMsg}";`
        );
    }
}
// Launch Bit Blockly
nw.Window.open(DEFAULT_URL, {
    // icon: 'icon.png',
    min_width: 800,
    min_height: 600,
    // fullscreen: true
}, function (win) {
    mainwin = win;
    win.maximize();
/*
    {   // setup shortcut key
        nw.App.registerGlobalHotKey(new nw.Shortcut({
            key : "Ctrl+Shift+R",
            active : function() {
                win.eval(null,
                    `
                    (function(){
                        Code.lastRun = Date.now();
                        Code.toggleRunning();
                        Code.reloadSandbox();
                        })();
                    `
                    ); 
            },
            failed : function(msg) {
                console.log(msg);
            }
        }));
        nw.App.registerGlobalHotKey(new nw.Shortcut({
            key : "Ctrl+Shift+O",
            active : function() {
                var clipboard = nw.Clipboard.get();
                var text = clipboard.get('text');
                console.log(text);
                win.open(nw.Clipboard.get().get('text'));
            },
            failed : function(msg) {
                console.log(msg);
            }
        }));
        nw.App.registerGlobalHotKey(new nw.Shortcut({
            key : "Ctrl+Shift+D",
            active : function() {
                // win.showDevTools();
                nw.Shell.openExternal('https://github.com/nwjs/nw.js');
            },
            failed : function(msg) {
                console.log(msg);
            }
        }));
    }

    {   // setup main menu
        let mainmenu = new nw.Menu({ type: 'menubar' });
        // 檔案
        let filemenu = new nw.Menu();
        let filemenu_load = new nw.MenuItem({ label: '開啟檔案' });
        filemenu_load.click = function() {
            win.eval(null,
                `
                document.getElementById('chooseFile').click();
                `
            );
        };
        filemenu.append(filemenu_load);
        let filemenu_save = new nw.MenuItem({ label: '儲存檔案' });
        filemenu_save.click = function() {
            win.eval(null,
                `
                document.getElementById('btn-export-blocks').click();
                `
            );
        };
        filemenu.append(filemenu_save);
        let filemenu_browser = new nw.MenuItem({ label: '開啟瀏覽器' });
        filemenu_browser.click = function() {
            nw.Shell.openExternal(DEFAULT_URL);
        };
        filemenu.append(filemenu_browser);
        let filemenu_exit = new nw.MenuItem({ label: '結束' });
        filemenu_exit.click = function() {
            process.exit();
        };
        filemenu.append(filemenu_exit);
        mainmenu.append(new nw.MenuItem({
            label: '檔案',
            submenu: filemenu
        }));
        // 版本
        let versionmenu = new nw.Menu();
        let versionmenu_version = new nw.MenuItem({ label: VERSION });
        versionmenu.append(versionmenu_version);
        mainmenu.append(new nw.MenuItem({
            label: '版本',
            submenu: versionmenu
        }));
        win.menu = mainmenu;    
    }
*/
    win.on('loaded', () => {
        updateTitle();
    });
});

function convertArrayToArrayBuffer(arr) {
    let bufView = new Uint8Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        bufView[i] = arr[i];
    }
    return bufView.buffer;
}

function convertArrayBufferToArray(buf) {
    let arr = [];
    let bufView = new Uint8Array(buf);
    for (let i = 0; i < bufView.length; i++) {
        arr.push(bufView[i]);
    }
    return arr;
};

const START_SYSEX = 0xF0;
const END_SYSEX = 0xF7;
const REPORT_FIRMWARE = 0x79;
const CAPABILITY_QUERY = 0x6B;
const ANALOG_MAPPING_QUERY = 0x69;
const SYSEX_RESET = 0xFF;
const msgQueryDeviceId = convertArrayToArrayBuffer([0xf0, 0x0e, 0x0c, 0xf7]);
const msgReportFirmware = Buffer.from([
    0xf0, 0x79, 0x02, 0x05, 0x45, 0x00, 0x53, 0x00, 0x50, 0x00, 0x33, 0x00,
    0x32, 0x00, 0x46, 0x00, 0x69, 0x00, 0x72, 0x00, 0x6d, 0x00, 0x61, 0x00,
    0x74, 0x00, 0x61, 0x00, 0x49, 0x00, 0x6d, 0x00, 0x70, 0x00, 0x6c, 0x00,
    0xf7
]);
const msgQueryCapabilities = Buffer.from([
    0xf0, 0x6c, 0x00, 0x01, 0x01, 0x01, 0x02, 0x0c, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01,
    0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x02, 0x0c, 0x03, 0x0c, 0x04, 0x0e,
    0x7f, 0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x02, 0x0c,
    0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x03, 0x0c,
    0x7f, 0x03, 0x0c, 0x7f, 0x03, 0x0c, 0x7f, 0x03, 0x0c, 0x7f, 0x03, 0x0c, 0x7f, 0x03, 0x0c, 0x7f,
    0x00, 0x01, 0x01, 0x01, 0x02, 0x0c, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x02,
    0x0c, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x02, 0x0c, 0x03, 0x0c, 0x04, 0x0e,
    0x7f, 0x00, 0x01, 0x01, 0x01, 0x02, 0x0c, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01,
    0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01,
    0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f,
    0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04,
    0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x03,
    0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01,
    0x01, 0x02, 0x0c, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x02, 0x0c, 0x03, 0x0c,
    0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x02, 0x0c, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01,
    0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f,
    0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x03, 0x0c, 0x04,
    0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x02, 0x0c, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01,
    0x01, 0x02, 0x0c, 0x03, 0x0c, 0x04, 0x0e, 0x7f, 0x00, 0x01, 0x01, 0x01, 0x02, 0x0c, 0x04, 0x0e,
    0x7f, 0x00, 0x01, 0x01, 0x01, 0x02, 0x0c, 0x04, 0x0e, 0x7f, 0x02, 0x0c, 0x7f, 0x7f, 0x7f, 0x02,
    0x0c, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x7f, 0x7f, 0xf7
]);
const msgQueryAnalogMapping = Buffer.from([
    0xf0, 0x6a, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x7f, 0x7f, 0x04, 0x05, 0x06, 0x07, 0x00, 0x7f, 0x7f, 0x03, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
    0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0xf7
]);

const server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, 'localhost', function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}
wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    if (portId === null) {
        console.log('Board not found!');
        return;
    }

    wsConnection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');

    wsConnection.on('message', function (message) {
        let buf = message.binaryData;
        // console.log('Received Binary Message of ' + buf.length + ' bytes');
        // console.log(buf);

        if (buf.length === 3 && buf[0] === START_SYSEX && buf[2] === END_SYSEX) {
            switch (buf[1]) {
                case REPORT_FIRMWARE:
                    wsConnection.sendBytes(msgReportFirmware);
                    break;
                case CAPABILITY_QUERY:
                    wsConnection.sendBytes(msgQueryCapabilities);
                    break;
                case ANALOG_MAPPING_QUERY:
                    wsConnection.sendBytes(msgQueryAnalogMapping);
                    break;
            }
        } else if (buf[0] === SYSEX_RESET && (buf[1] & 0xF0) === 0xD0) {
            for (let i = 1; i < buf.length; i += 2) {
                setTimeout(() => {
                    wsConnection.sendBytes(Buffer.from([buf[1] & 0x90, 0, 0]));
                }, 100);
            }
        }
        try {
            chrome.serial.send(portId, convertArrayToArrayBuffer(buf), sendInfo => {});
            chrome.serial.flush(portId, result => {});
        } catch (error) {}
    });
    wsConnection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + wsConnection.remoteAddress + ' disconnected.');
        // port.close();
    });
});

chrome.serial.onReceive.addListener(info => {
    let arrData = convertArrayBufferToArray(info.data);
    console.log('Received data from ' + info.connectionId + ': ' + JSON.stringify(arrData));
    if (portId === null && arrData[0] === 0xf0 && arrData[arrData.length - 1] === 0xf7) {
        portId = info.connectionId;
        updateTitle('裝置已連線');
    } else if (wsConnection !== null) {
        // send to blockly
        wsConnection.sendBytes(Buffer.from(arrData));
    }
});

function scanBoard() {
    if (portId) return;
    console.log('Scan board...');
    updateTitle('掃描裝置...');
    chrome.serial.getDevices(ports => {
        ports.forEach(port => {
            console.log('Detected serial port: ' + JSON.stringify(port));
            try {
                chrome.serial.connect(port.path, {
                    bitrate: 115200
                }, connectionInfo => {
                    if (connectionInfo) {
                        setTimeout(() => {
                            console.log('Sent: ' + connectionInfo.connectionId + JSON.stringify(msgQueryDeviceId));
                            chrome.serial.send(connectionInfo.connectionId, msgQueryDeviceId, sendInfo => {});
                            chrome.serial.flush(connectionInfo.connectionId, result => {});
                        }, 500);
                    }
                });
            } catch (error) {}
        });
    });
    setTimeout(scanBoard, 3000);
}
scanBoard();

chrome.serial.onReceiveError.addListener(info => {
    console.log('ReceiveError from ' + info.connectionId);
    if (portId === info.connectionId) {
        console.log('Reset serial connection ' + portId);
        portId = null;
        scanBoard();
    }
});

