import WebSocket from 'ws';
import config from 'config';

const portWs = config.get('server.portWs');
const webSocketServer = new WebSocket.Server({ port: portWs });

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

export default (cdConnect, cbMessage, cbError, cbClose) => {
    webSocketServer.on('connection', (client) => {
        cdConnect(client);
        client.on('message', (msgJson) => {
            try {
                const messageObj = JSON.parse(msgJson);
                cbMessage(client, messageObj);
            } catch (err) {
                cbError(client, err);
            }
        });
        client.on('close', () => {
            cbClose(client);
        });
    });

    return webSocketServer;
};