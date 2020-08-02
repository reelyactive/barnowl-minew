/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


const EventEmitter = require('events').EventEmitter;
const MinewDecoder = require('./minewdecoder.js');
const HttpListener = require('./httplistener.js');
const TestListener = require('./testlistener.js');


/**
 * BarnowlMinew Class
 * Converts Minew gateway radio decodings into standard raddec events.
 * @param {Object} options The options as a JSON object.
 */
class BarnowlMinew extends EventEmitter {

  /**
   * BarnowlMinew constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    super();
    options = options || {};
    options.barnowl = this;

    this.listeners = [];
    this.minewDecoder = new MinewDecoder({ barnowl: this });
  }

  /**
   * Add a listener to the given hardware interface.
   * @param {Class} ListenerClass The (uninstantiated) listener class.
   * @param {Object} options The options as a JSON object.
   */
  addListener(ListenerClass, options) {
    options = options || {};
    options.decoder = this.minewDecoder;

    let listener = new ListenerClass(options);
    this.listeners.push(listener);
  }

  /**
   * Handle and emit the given raddec.
   * @param {Raddec} raddec The given Raddec instance.
   */
  handleRaddec(raddec) {
    // TODO: observe options to normalise raddec
    this.emit("raddec", raddec);
  }

  /**
   * Handle and emit the given infrastructure message.
   * @param {Object} message The given infrastructure message.
   */
  handleInfrastructureMessage(message) {
    this.emit("infrastructureMessage", message);
  }
}


module.exports = BarnowlMinew;
module.exports.HttpListener = HttpListener;
module.exports.TestListener = TestListener;
