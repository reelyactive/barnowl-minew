/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


const advlib = require('advlib-identifier');
const Raddec = require('raddec');


const MINIMUM_FRAME_LENGTH = 15;
const LONG_BINARY_HEADER = 0xbb01;
const SHORT_BINARY_HEADER = 0xbb00;
const FRAME_TAIL = 0xdd;
const RSSI_DBM_OFFSET = -275; // TODO: confirm exact value with Minew


/**
 * Determine if the given data is a valid long binary packet.
 * @param {Buffer} data The binary packet as a buffer.
 */
function isValidLongBinary(data) {
  let isLongBinaryHeader = (data.readUInt16BE(0) === LONG_BINARY_HEADER);
  let isValidDataLength = (data.readUInt32BE(2) === data.length);
  let isValidFrameTail = (data.readUInt8(data.length - 1) === FRAME_TAIL);

  return isLongBinaryHeader && isValidDataLength && isValidFrameTail;
}


/**
 * Decode a serial packet from the given ASCII string.
 * @param {Buffer} data The binary packet as a buffer.
 * @param {Number} index The byte index of the start of the transmitter frame.
 * @param {Array} raddecs The array of raddecs.
 * @param {String} receiverId The identifier of the receiver.
 */
function decodeTransmitterFrame(data, index, raddecs, receiverId) {
  let transmitterId = data.readUIntBE(index, 6).toString(16);
  let transmitterIdLittleEndian = data.readUIntLE(index, 6).toString(16);
  let numberOfDistinctPackets = data.readUInt16BE(index + 6);
  let packetFrameIndex = index + 8;
  let raddec = new Raddec({
      transmitterId: transmitterId,
      transmitterIdType: Raddec.identifiers.TYPE_UNKNOWN
  });

  for(let cPacket = 0; cPacket < numberOfDistinctPackets; cPacket++) {
    let packetLength = data.readUInt8(packetFrameIndex);
    let rssi = data.readUInt8(packetFrameIndex + packetLength + 2) +
               RSSI_DBM_OFFSET;

    if(packetLength > 0) {
      let packet = ('000' + packetLength.toString(16)).substr(-4);
      packet += transmitterIdLittleEndian;
      packet += data.toString('hex', packetFrameIndex + 1,
                              packetFrameIndex + 1 + packetLength);
      raddec.addPacket(packet);
    }

    raddec.addDecoding({ receiverId: receiverId,
                         receiverIdType: Raddec.identifiers.TYPE_EUI48,
                         rssi: rssi });
    packetFrameIndex = packetFrameIndex + packetLength + 3;
  }

  raddecs.push(raddec);

  return packetFrameIndex;
}


/**
 * Decode all the serial packets from the hex string.
 * @param {Buffer} data The binary packet as a buffer.
 * @param {String} origin Origin of the data stream.
 * @param {Number} time The time of the data capture.
 * @param {Object} options The packet decoding options.
 */
function decode(data, origin, time, options) {
  let raddecs = [];
  let isTooShort = (data.length < MINIMUM_FRAME_LENGTH);

  if(isTooShort || !isValidLongBinary(data)) {
    return raddecs;
  }

  let receiverId = data.readUIntBE(6,6).toString(16);
  let numberOfTransmitters = data.readUInt16BE(12);
  let transmitterFrameIndex = 14;

  for(let cTransmitter = 0; cTransmitter < numberOfTransmitters;
      cTransmitter++) {
    transmitterFrameIndex = decodeTransmitterFrame(data, transmitterFrameIndex,
                                                   raddecs, receiverId);
  }

  return raddecs;
}


module.exports.decode = decode;
