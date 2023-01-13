/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const Raddec = require('raddec');


const MINIMUM_ARRAY_LENGTH = 2;


/**
 * Determine if the given data is valid JSON Long.
 * @param {Array} data The array of packets.
 */
function isValidJsonLong(data) {
  if(!Array.isArray(data) || (data.length < 1) ||
     !data[0].hasOwnProperty('mac') || (data[0].type !== 'Gateway')) {
    return false;
  }

  return true;
}


/**
 * Decode the given device data as a raddec.
 * @param {Object} data The device decoding.
 * @param {String} receiverId The identifier of the receiver.
 * @param {Number} receiverIdType The receiver id type.
 */
function decodeDevice(data, receiverId, receiverIdType) {
  if(!data || !data.hasOwnProperty('mac') || !data.hasOwnProperty('rawData') ||
     !data.hasOwnProperty('rssi') || !data.hasOwnProperty('timestamp')) {
    return null;
  }

  let transmitterId = data.mac.toLowerCase();
  let transmitterIdLE = transmitterId.match(/.{2}/g).reverse().join('');
  let timestamp = new Date(data.timestamp).getTime();

  let raddec = new Raddec({
      transmitterId: transmitterId,
      transmitterIdType: Raddec.identifiers.TYPE_UNKNOWN,
      timestamp: timestamp
  });
  let packet = ((data.rawData.length / 2) + 6).toString(16).padStart(4, '0') +
               transmitterIdLE + data.rawData.toLowerCase();

  raddec.addDecoding({ receiverId: receiverId,
                       receiverIdType: receiverIdType,
                       rssi: data.rssi });
  raddec.addPacket(packet);

  return raddec;
}


/**
 * Decode all the packets from the array.
 * @param {Array} data The array of packets.
 * @param {String} origin Origin of the data stream.
 * @param {Number} time The time of the data capture.
 * @param {Object} options The packet decoding options.
 */
function decode(data, origin, time, options) {
  let raddecs = [];
  let isTooShort = (data.length < MINIMUM_ARRAY_LENGTH);

  if(isTooShort || !isValidJsonLong(data)) {
    return raddecs;
  }

  let receiverId = data[0].mac;
  let receiverIdType = Raddec.identifiers.TYPE_EUI48;

  for(let cIndex = 1; cIndex < data.length; cIndex++) {
    let raddec = decodeDevice(data[cIndex], receiverId, receiverIdType);

    if(raddec) {
      raddecs.push(raddec);
    }
  }

  return raddecs;
}


module.exports.decode = decode;
