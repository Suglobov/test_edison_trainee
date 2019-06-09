import express from 'express';
import path from 'path';
import config from 'config';

const rootPath = process.cwd();
const port = config.get('server.port');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.resolve(rootPath, './views'));
app.use(express.static(path.resolve(rootPath, './assets')));

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(port, function () {
    console.log(`Server was started on port '${port}'`);
});