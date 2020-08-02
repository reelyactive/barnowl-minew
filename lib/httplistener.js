/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


const http = require('http');


const DEFAULT_PORT = 3001;


/**
 * HttpListener Class
 * Listens for Minew data from HTTP POST.
 */
class HttpListener {

  /**
   * HttpListener constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.decoder = options.decoder;

    createHttpServer(this); // TODO: support external express server
  }

}


/**
 * Create the HTTP server and handle events.
 * @param {HttpListener} instance The HttpListener instance.
 */
function createHttpServer(instance) {
  let server = http.createServer(function(req, res) {
    if(req.method === 'POST') {
      let body = Buffer.alloc(0);
      let time = new Date().getTime();

      req.on('data', function(chunk) {
        body = Buffer.concat([ body, chunk ]);
      });
      req.on('end', function() {
        instance.decoder.handleData(body, 'HTTP', time,
                                    instance.decodingOptions);
        res.end();
      });
    }
  });

  server.listen(DEFAULT_PORT);
}


module.exports = HttpListener;
