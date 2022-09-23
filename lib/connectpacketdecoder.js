/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const advlib = require('advlib-identifier');
const Raddec = require('raddec');


const MINIMUM_FRAME_LENGTH = 20;
const MINEW_CONNECT_HEADER = 0xbb02;
const MINEW_CONNECT_BODY_PREFIX = 0x843e;


/**
 * Determine if the given data is a valid Minew-Connect packet.
 * @param {Buffer} data The binary packet as a buffer.
 */
function isValidConnect(data) {
  let isConnectHeader = (data.readUInt16BE(0) === MINEW_CONNECT_HEADER);
  let isValidDataLength = (data.readUInt32LE(6) === data.length);
  let isValidFrameBodyLength = (data.readUInt32LE(10) === (data.length - 14));
  let isValidBodyPrefix = (data.readUInt16BE(14) === MINEW_CONNECT_BODY_PREFIX);
  let isValidBodyContentLength = (data.readUInt32LE(16) === (data.length - 20));

  return isConnectHeader && isValidDataLength && isValidFrameBodyLength &&
         isValidBodyPrefix && isValidBodyContentLength;
}


/**
 * Decode an advContent frame from the given data, starting at the given index.
 * @param {Buffer} data The binary packet as a buffer.
 * @param {Number} index The byte index of the start of the advContent frame.
 * @param {Array} raddecs The array of raddecs.
 * @returns {Number} The index following the current advContent frame.
 */
function decodeAdvContent(data, index, raddecs) {
  let length = data.readUInt16LE(index);
  let receiverId = data.readUInt8(index + 2).toString(16);
  let flags = data.readUInt8(index + 3);
  let transmitterId = data.readUIntBE(index + 4, 6).toString(16)
                                                   .padStart(12, '0');
  let transmitterIdLE = data.readUIntLE(index + 4, 6).toString(16)
                                                     .padStart(12, '0');
  let rssi = data.readInt8(index + 10);
  let payloadLength = data.readUInt8(index + 11);
  let aoaIndex = index + 12 + payloadLength;
  let payload = data.subarray(index + 12, aoaIndex).toString('hex');
  let isAoAIncluded = (aoaIndex < (index + length));

  if(isAoAIncluded) {
    let aoaLength = data.readUInt16LE(aoaIndex);
    // TODO: process AoA from aoaIndex to aoaIndex + aoaLength
  }

  let raddec = new Raddec({
      transmitterId: transmitterId,
      transmitterIdType: Raddec.identifiers.TYPE_EUI48
  });
  raddec.addDecoding({ receiverId: receiverId,
                       receiverIdType: Raddec.identifiers.TYPE_UNKNOWN,
                       rssi: rssi });
  let packetLength = payloadLength + 6;   // TODO: confirm!
  let packet = (packetLength.toString(16)).padStart(4, '0') +
               transmitterIdLE + payload; // TODO: handle flags!
  raddec.addPacket(packet);

  raddecs.push(raddec);

  return index + length + 2;
}


/**
 * Decode all the connect packets from the given data.
 * @param {Buffer} data The binary packet as a buffer.
 * @param {String} origin Origin of the data stream.
 * @param {Number} time The time of the data capture.
 * @param {Object} options The packet decoding options.
 */
function decode(data, origin, time, options) {
  let raddecs = [];
  let isTooShort = (data.length < MINIMUM_FRAME_LENGTH);

  if(isTooShort || !isValidConnect(data)) {
    return raddecs;
  }

  let advContentIndex = 20;

  while(advContentIndex < data.length) {
    advContentIndex = decodeAdvContent(data, advContentIndex, raddecs);
  }

  return raddecs;
}


module.exports.decode = decode;
