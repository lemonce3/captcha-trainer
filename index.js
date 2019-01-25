const Koa = require('koa');
const bodyParser = require('koa-bodyparser'); 
const rootRouter = require('./src/router');
const serve = require('koa-static');
const path = require('path');
const config = require('./config.json');

new Koa().use(bodyParser()).use(rootRouter.routes())
.use(serve(path.resolve(__dirname, config.staticPath))).listen(3000);
