/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


const http = require('http');


const DEFAULT_ROUTE = '/minew';
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

    if(options.app && options.express) {
      createRouteHandler(this, options.app, options.express, options.route,
                         options.isPreOctetStream);
    }
    else {
      createHttpServer(this, options.port);
    }
  }

}


/**
 * Create the HTTP server and handle events.
 * @param {HttpListener} instance The HttpListener instance.
 * @param {Express} app The express app instance.
 * @param {String} route The route on which to accept POST requests.
 * @param {Boolean} isPreOctetStream Flag for pre-v4 firmware bug.
 */
function createRouteHandler(instance, app, express, route, isPreOctetStream) {
  route = route || DEFAULT_ROUTE;

  // This is a peculiarity of the Minew packet before firmware v4 which
  // incorrectly used application/json for binary data rather than
  // application/octet-stream, which is the correct & expected implementation.
  if(isPreOctetStream && (isPreOctetStream === true)) {
    app.use(route, express.raw({ type: "application/json" }));
  }
  else {
    app.use(route, express.raw({ type: "application/octet-stream" }));
  }

  app.post(route, function(req, res) {
    let time = new Date().getTime();

    if(Buffer.isBuffer(req.body)) {
      instance.decoder.handleData(req.body, 'HTTP', time,
                                  instance.decodingOptions);
    }

    res.status(200).end();
  });
}


/**
 * Create the HTTP server and handle events.
 * @param {HttpListener} instance The HttpListener instance.
 * @param {Number} port The port on which to listen.
 */
function createHttpServer(instance, port) {
  port = port || DEFAULT_PORT;

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

  server.listen(port);
}


module.exports = HttpListener;
