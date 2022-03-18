/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const binaryPacketDecoder = require('../../lib/binarypacketdecoder.js');
const assert = require ('assert');


// Input data for the scenario
const INPUT_DATA_BINARY_LONG_SAMPLE = Buffer.from(
  'BB0100000371AC233FC02F87000C032E4A1AA95A00011F1EFF060001' +
  '09200235EEAEEBD2CFD9330452E2AC9FE743D46EFC3EACBEAE2A06CF' +
  '068B332CECE200021F1EFF06000109200253439AFB696A05586197E9' +
  'F66EE6CB86DBBA155695877C06D21F1EFF06000109200253439AFB69' +
  '6A05586197E9F66EE6CB86DBBA155695877C06D12018111677120002' +
  '1E0201061AFF4C0002154C2B0000000100010001012B010002C90001' +
  '0001C500D91B020A000303F1FF0E16F1FF6400010001201811167712' +
  '04094C2B4201D920200529091300011D0201060303AAFE1516AAFE00' +
  'E80011223344556677889900000000000000CF2FCDA8E1A7A600031F' +
  '1EFF0600010920020BBCB084E1CE7776FADBE60253E3E9657D33DC5A' +
  '05C62506D21F1EFF0600010920020BBCB084E1CE7776FADBE60253E3' +
  'E9657D33DC5A05C62506D01F1EFF0600010920020BBCB084E1CE7776' +
  'FADBE60253E3E9657D33DC5A05C62506D2393F7BA3A03600031F1EFF' +
  '06000109200200F8DA4B31DDF0B8959217A0E4459D2C9773F26E6199' +
  '9006D31F1EFF06000109200200F8DA4B31DDF0B8959217A0E4459D2C' +
  '9773F26E61999006D41F1EFF06000109200200F8DA4B31DDF0B89592' +
  '17A0E4459D2C9773F26E61999006D250ECECE1AEF000020005CF1102' +
  '011A020A0C0AFF4C001005031CF7B75E04CF67C7750A58FC00041202' +
  '011A020A080BFF4C001006311A4851464904D00005D51202011A020A' +
  '080BFF4C001006311A4851464904D20005D06D24188177A400021102' +
  '011A020A0C0AFF4C0010054B1CDB112704D11102011A020A0C0AFF4C' +
  '0010054B1CDB112704CFACAC2233000400021F0201061BFF3906CA00' +
  '04003322ACAC5F6000000000000001000000CBC6B86600CF1D020106' +
  '19FF3906CA011700000000B4B63000C500000000000130632BC000CF' +
  'C2005900038E00011E0201061AFF4C000215FDA50693A4E24FB1AFCF' +
  'C6EB0764782527114CB9C502D4DC234D08C8EA00051C020106030201' +
  'A20C1601A200616D6673716F7873000000000000000000CF1E030954' +
  '5919FFD007000300000100A06C720DA47914B1A9D5900447373C5501' +
  'CF1C020106030201A20C1601A200616D6673716F7873000000000000' +
  '000000CF1E0309545919FFD007000300000100A06C720DA47914B1A9' +
  'D5900447373C5501CF1C020106030201A20C1601A200616D6673716F' +
  '7873000000000000000000CFDD', 'hex');


// Expected outputs for the scenario
const EXPECTED_DATA_BINARY_LONG_SAMPLE = [
  {
    transmitterId: "032e4a1aa95a",
    transmitterIdType: 3,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -49,
      numberOfDecodings: 1
    }],
    packets: [
      "001f5aa91a4a2e031eff06000109200235eeaeebd2cfd9330452e2ac9fe743d46efc3eacbeae2a"
   ]
  },
  {
    transmitterId: "068b332cece2",
    transmitterIdType: 3,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -46,
      numberOfDecodings: 2
    }],
    packets: [
      "001fe2ec2c338b061eff06000109200253439afb696a05586197e9f66ee6cb86dbba155695877c"
    ]
  },
  {
    transmitterId: "201811167712",
    transmitterIdType: 2,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -39,
      numberOfDecodings: 2
    }],
    packets: [
      "001e1277161118200201061aff4c0002154c2b0000000100010001012b010002c900010001c5",
      "001b127716111820020a000303f1ff0e16f1ff640001000120181116771204094c2b42"
    ]
  },
  {
    transmitterId: "202005290913",
    transmitterIdType: 2,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -49,
      numberOfDecodings: 1
    }],
    packets: [
      "001d1309290520200201060303aafe1516aafe00e800112233445566778899000000000000"
    ]
  },
  {
    transmitterId: "2fcda8e1a7a6",
    transmitterIdType: 3,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -47,
      numberOfDecodings: 3
    }],
    packets: [
      "001fa6a7e1a8cd2f1eff0600010920020bbcb084e1ce7776fadbe60253e3e9657d33dc5a05c625"
    ]
  },
  {
    transmitterId: "393f7ba3a036",
    transmitterIdType: 3,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -45,
      numberOfDecodings: 3
    }],
    packets: [
      "001f36a0a37b3f391eff06000109200200f8da4b31ddf0b8959217a0e4459d2c9773f26e619990"
    ]
  },
  {
    transmitterId: "50ecece1aef0",
    transmitterIdType: 3,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -49,
      numberOfDecodings: 2
    }],
    packets: [
      "0011f0aee1ecec5002011a020a0c0aff4c001005031cf7b75e",
      ""
    ]
  },
  {
    transmitterId: "67c7750a58fc",
    transmitterIdType: 3,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -46,
      numberOfDecodings: 4
    }],
    packets: [
      "0012fc580a75c76702011a020a080bff4c001006311a48514649",
      ""
    ]
  },
  {
    transmitterId: "6d24188177a4",
    transmitterIdType: 3,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -48,
      numberOfDecodings: 2
    }],
    packets: [
      "0011a4778118246d02011a020a0c0aff4c0010054b1cdb1127"
    ]
  },
  {
    transmitterId: "acac22330004",
    transmitterIdType: 2,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -49,
      numberOfDecodings: 2
    }],
    packets: [
      "001f4003322acac0201061bff3906ca0004003322acac5f6000000000000001000000cbc6b866",
      "001d4003322acac02010619ff3906ca011700000000b4b63000c500000000000130632bc0"
    ]
  },
  {
    transmitterId: "c2005900038e",
    transmitterIdType: 3,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -44,
      numberOfDecodings: 1
    }],
    packets: [
      "001e8e03005900c20201061aff4c000215fda50693a4e24fb1afcfc6eb0764782527114cb9c5"
    ]
  },
  {
    transmitterId: "dc234d08c8ea",
    transmitterIdType: 2,
    rssiSignature: [{
      receiverId: "ac233fc02f87",
      receiverIdType: 2,
      rssi: -49,
      numberOfDecodings: 5
    }],
    packets: [
      "001ceac8084d23dc020106030201a20c1601a200616d6673716f78730000000000000000",
      "001eeac8084d23dc0309545919ffd007000300000100a06c720da47914b1a9d5900447373c55"
    ]
  }
];     



// Describe the scenario
describe('binarypacketdecoder', function() {

  // Test the decode function with sample data
  it('should handle sample data', function() {
    assert.deepEqual(binaryPacketDecoder.decode(INPUT_DATA_BINARY_LONG_SAMPLE,
                                                null, null, null),
                     EXPECTED_DATA_BINARY_LONG_SAMPLE);
  });

});
