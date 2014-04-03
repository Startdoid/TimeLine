var connect = require('connect');
var http = require('http');

var app = connect()
  .use(connect.static('app'))
  .use('/js/lib/', connect.static('node_modules/requirejs/'))
  .use('/node_modules', connect.static('node_modules'));
  //.use('/test', connect.static('test/'))
  //.use('/test', connect.static('app'));

http.createServer(app).listen(process.env.PORT, function() {
  console.log('Running on '+process.env.IP);
});
