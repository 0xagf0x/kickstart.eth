//! this file boots up next to the app, tells it to use routes.js
const { createServer } = require('http');
const next = require('next');

const routes = require('./routes');

//* creates new app instance
// this checks if we're running in dev or prod

const app = next({
    dev: process.env.NODE_ENV !== 'production'
});
const handler = routes.getRequestHandler(app);



app.prepare().then(() =>  {
    // serve it up on localhost:3000
    createServer(handler).listen(3000, (err) => {
        if (err) throw err;
        console.log('Ready on localhost 3000')
    })
})