import WebSocket from 'ws';
import config from 'config';

const PORT = process.env.PORT || config.get('server.portWs');
const webSocketServer = new WebSocket.Server({ port: PORT });

if (!webSocketServer.sendJson) {
    webSocketServer.sendJson = (client, data) => {
        const dataJson = JSON.stringify(data);
        client.send(dataJson);
    }
}

if (!webSocketServer.broadcastJson) {
    webSocketServer.broadcastJson = (data) => {
        webSocketServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                webSocketServer.sendJson(client, data);
            }
        });
    };
}

export const wss = webSocketServer;

export const onConnect = (cb) => {
    webSocketServer.on('connection', (client) => {
        cb(client);
    });
};

export const listenClient = (client, cbMessage, cbClose, cbMessageError) => {
    client.on('message', (msgJson) => {
        try {
            const messageObj = JSON.parse(msgJson);
            cbMessage(messageObj);
        } catch (er) {
            cbMessageError(er);
        }
    });
    client.on('close', () => {
        cbClose();
    });
};
