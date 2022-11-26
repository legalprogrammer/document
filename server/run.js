var express = require('express');
var app = express();

const pathfinder = require('./server.js');
app.use('/', pathfinder);

// Set port as either specified by command line or 9000
app.set('port', (process.argv[2] || 9000));
// Start server

app.listen(app.get('port'), () => {
    console.log(`Server started: http://localhost:${app.get('port')}/`);
});
