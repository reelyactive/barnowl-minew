/**
 * Copyright reelyActive 2020-2022
 * We believe in an open Internet of Things
 */


const binaryPacketDecoder = require('./binarypacketdecoder');
const connectPacketDecoder = require('./connectpacketdecoder');
const jsonRawPacketDecoder = require('./jsonrawpacketdecoder');


const BINARY_SHORT = 0xbb00;
const BINARY_LONG = 0xbb01;
const MINEW_CONNECT = 0xbb02;
const MIN_BINARY_PACKET_LENGTH = 19;


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

    // Assume Minew Binary/Connect protocol
    else if(Buffer.isBuffer(data) && (data.length > MIN_BINARY_PACKET_LENGTH)) {
      let protocolHeader = data.readUInt16BE();

      switch(protocolHeader) {
        case BINARY_SHORT:
        case BINARY_LONG:
          raddecs = binaryPacketDecoder.decode(data, origin, time,
                                               decodingOptions);
          break;
        case MINEW_CONNECT:
          raddecs = connectPacketDecoder.decode(data, origin, time,
                                                decodingOptions);
          break;
      }
    }

    raddecs.forEach(function(raddec) {
      self.barnowl.handleRaddec(raddec);
    });
  }
}


module.exports = MinewDecoder;
