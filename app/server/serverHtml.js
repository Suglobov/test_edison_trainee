import express from 'express';
import path from 'path';
import config from 'config';

const rootPath = process.cwd();
const PORT = process.env.PORT || config.get('server.port');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.resolve(rootPath, './views'));
app.use(express.static(path.resolve(rootPath, './assets')));

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(PORT, function () {
    console.log(`Server was started on port '${PORT}'`);
});