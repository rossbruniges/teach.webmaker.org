var http = require('http');
var path = require('path');
var chalk = require('chalk');
var express = require('express');

var ROOT_DIR = path.normalize(path.join(__dirname, '..', '..'));

var app = express();

var server = http.createServer(app);

app.use(express.static(path.join(ROOT_DIR, 'dist')));

server.listen(0, function() {
  var baseURL = 'http://localhost:' + server.address().port;

  var mochaPhantomPath = path.join(
    ROOT_DIR, 'node_modules', 'mocha-phantomjs', 'bin',
    'mocha-phantomjs'
  );

  var mochaPhantom = require('child_process').spawn(process.execPath, [
    mochaPhantomPath,
    baseURL + '/test/'
  ], {
    stdio: [0, 1, 2]
  });

  mochaPhantom.on('close', function(code) {
    server.close();
    if (code) {
      console.log(chalk.red.bold([
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
        "!! DO NOT DEBUG BROKEN BROWSER TESTS IN THE CONSOLE    !!",
        "!!                                                     !!",
        "!! This will lead to much pain and misery.             !!",
        "!! Instead, visit the tests in your browser at " +
          chalk.green.bold("/test/") + ". !!",
        "!! See README.md for more information.                 !!",
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      ].join('\n')));
    }
    process.exit(code);
  });
});
