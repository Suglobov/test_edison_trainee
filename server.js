const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const config = require('config');

const app = express();

const port = config.get('server.port');
const portWs = config.get('server.portWs');

// openning a websocket server
const wss = new WebSocket.Server({ port: portWs });
wss.on('connection', (ws) => {
    ws.on('message', function sendToAllClients(message) {
        wss.clients.forEach((client) => {
            client.send(message);
        })
    })
});

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static(path.resolve(__dirname, 'assets')));

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(port, function () {
    console.log(`Server was started on '${port}'`);
});
// const config = require('config');
// const express = require('express');
// let app = express();
// let expressWs = require('express-ws')(app);
//
// app.set('view engine', 'pug');
//
// app.ws('/', (ws, req, next) => {
//     ws.on('message', function (msg) {
//         console.log('msg:', msg)
//     })
// });
// const port = config.get('port');
// app.listen(port, () => {
//     console.log(`Server was started on '${port}'`);
// });
// const Express = require('express');
// const expressWs = require('express-ws');
//
// const app = new Express();
// expressWs(app);
// app.set('view engine', 'pug');
//
// // app.get('/', function (req, res) {
// //     res.render('index', {})
// // });
//
// app.ws('/', function(ws, req, next) {
//     ws.on('message', function(msg) {
//         console.log('msg:', msg)
//     })
// });
//
// app().listen(config.get('port'), () => {
//     // eslint-disable-next-line
//     console.log(`Server was started on '${port}'`);
// });
//
// // export default app;