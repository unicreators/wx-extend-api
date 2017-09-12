const port = 3000, app = new (require('koa'))();
app.use(async function (ctx) {
    ctx.body = { time: Date.now(), query: ctx.request.query };
});
app.listen(port);

module.exports = app;
module.exports.server_url = `http://localhost:${port}`;
