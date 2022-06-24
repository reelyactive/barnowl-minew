/**
 * Copyright reelyActive 2020-2022
 * We believe in an open Internet of Things
 */


const binaryPacketDecoder = require('./binarypacketdecoder');
const jsonRawPacketDecoder = require('./jsonrawpacketdecoder');


/**
 * MinewDecoder Class
 * Decodes data streams from one or more Minew gateways and forwards the
 * packets to the given BarnowlMinew instance.
 */
class MinewDecoder {

  /**
   * MinewDecoder constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.barnowl = options.barnowl;
  }

  /**
   * Handle data from a given device, specified by the origin
   * @param {Buffer} data The data as a buffer or a JSON object.
   * @param {String} origin The unique origin identifier of the device.
   * @param {Number} time The time of the data capture.
   * @param {Object} decodingOptions The packet decoding options.
   */
  handleData(data, origin, time, decodingOptions) {
    let self = this;
    let raddecs = [];

    // Assume Minew JSON-RAW format
    if(Array.isArray(data)) {
      raddecs = jsonRawPacketDecoder.decode(data, origin, time,
                                            decodingOptions);
    }

    // Assume Minew Binary-Long format
    else if(Buffer.isBuffer(data)) {
      raddecs = binaryPacketDecoder.decode(data, origin, time, decodingOptions);
    }

    raddecs.forEach(function(raddec) {
      self.barnowl.handleRaddec(raddec);
    });
  }
}


module.exports = MinewDecoder;
