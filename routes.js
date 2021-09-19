// you need extra set of () ....it returns a function
const routes = require('next-routes')();

// .add defines a new map routing
//* 1st arg = if the user goes to this url
//* 2nd arg = display this page/component
routes
.add('/campaigns/new', '/campaigns/new')
.add('/campaigns/:address', '/campaigns/details')  // :address is the variable we've created to use for addresses
.add('/campaigns/:address/requests', '/campaigns/requests/index')
.add('/campaigns/:address/requests/new', '/campaigns/requests/new');



module.exports = routes;