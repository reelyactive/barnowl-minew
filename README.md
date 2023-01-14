barnowl-minew
=============

__barnowl-minew__ converts the decodings of any ambient Bluetooth Low Energy devices by [Minew](https://www.minew.com/) G1, G2, MG3 and MG4 gateways into standard developer-friendly JSON that is vendor/technology/application-agnostic.

![Overview of barnowl-minew](https://reelyactive.github.io/barnowl-minew/images/overview.png)

__barnowl-minew__ is a lightweight [Node.js package](https://www.npmjs.com/package/barnowl-minew) that can run on resource-constrained edge devices as well as on powerful cloud servers and anything in between.  It is included in reelyActive's [Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere/) open source middleware suite, and can just as easily be run standalone behind a [barnowl](https://github.com/reelyactive/barnowl) instance, as detailed in the code examples below.


Getting Started
---------------

Follow our step-by-step tutorials to get started with __barnowl-minew__ or __Pareto Anywhere__ using a _specific_ Minew gateway:
- [Configure a Minew G1 Gateway](https://reelyactive.github.io/diy/minew-g1-config/)

Learn "owl" about the __raddec__ JSON data output:
-  [reelyActive Developer's Cheatsheet](https://reelyactive.github.io/diy/cheatsheet/)


Quick Start
-----------

Clone this repository, install package dependencies with `npm install`, and then from the root folder run at any time:

    npm start

__barnowl-minew__ will indiscriminately accept HTTP POSTs on localhost:3001/minew and output (flattened) __raddec__ JSON to the console.  The following Minew data formats are currently supported:
- BINARY-LONG (recommmended)
- MINEW-CONNECT
- JSON-LONG
- JSON-RAW


Hello barnowl-minew!
--------------------

Developing an application directly from __barnowl-minew__?  Start by pasting the code below into a file called server.js:

```javascript
const Barnowl = require('barnowl');
const BarnowlMinew = require('barnowl-minew');

let barnowl = new Barnowl({ enableMixing: true });

barnowl.addListener(BarnowlMinew, {}, BarnowlMinew.TestListener, {});

barnowl.on('raddec', (raddec) => {
  console.log(raddec);
  // Trigger your application logic here
});
```

From the same folder as the server.js file, install package dependencies with the commands `npm install barnowl-minew` and `npm install barnowl`.  Then run the code with the command `node server.js` and observe the _simulated_ data stream of radio decodings (raddec objects) output to the console:

```javascript
{
  transmitterId: "fee150bada55",
  transmitterIdType: 2,
  rssiSignature: [
    {
      receiverId: "ac233fffffff",
      receiverIdType: 2,
      rssi: -77,
      numberOfDecodings: 1
    }
  ],
  packets: [ '001a55daba50e1fe0201060303e1ff1216e1ffa1034affe7004500fa55daba50e1fe' ],
  timestamp: 1645568542222
}
```

See the [Supported Listener Interfaces](#supported-listener-interfaces) below to adapt the code to listen for your gateway(s).


Is that owl you can do?
-----------------------

While __barnowl-minew__ may suffice standalone for simple real-time applications, its functionality can be greatly extended with the following software packages:
- [advlib](https://github.com/reelyactive/advlib) to decode the individual packets from hexadecimal strings into JSON
- [barnowl](https://github.com/reelyactive/barnowl) to combine parallel streams of RF decoding data in a technology-and-vendor-agnostic way

These packages and more are bundled together as the [Pareto Anywhere](https://www.reelyactive.com/pareto/anywhere) open source middleware suite, which includes a variety of __barnowl-x__ listeners, APIs and interactive web apps.


Supported Listener Interfaces
-----------------------------

The following listener interfaces are supported by __barnowl-minew__.  Extend the [Hello barnowl-minew!](#hello-barnowl-minew) example above by pasting in any of the code snippets below.

### HTTP

The _recommended_ implementation is using [express](https://expressjs.com/) as follows:

```javascript
const express = require('express');
const http = require('http');

let app = express();
let server = http.createServer(app);
server.listen(3001, function() { console.log('Listening on port 3001'); });

let options = { app: app, express: express, route: "/minew",
                isPreOctetStream: false }; // Set true for G1 firmware v2/3
barnowl.addListener(BarnowlMinew, {}, BarnowlMinew.HttpListener, options);
```

Nonetheless, for testing purposes, __barnowl-minew__ can also create a minimal HTTP server as an alternative to express, and attempt to handle any POST it receives:

```javascript
barnowl.addListener(BarnowlMinew, {}, BarnowlMinew.HttpListener, { port: 3001 });
```

### Test

Provides a steady stream of simulated Minew packets for testing purposes.

```javascript
barnowl.addListener(BarnowlMinew, {}, BarnowlMinew.TestListener, {});
```


Minew G1 Service Parameters
---------------------------

Use the following service parameters for the Minew G1 gateway:

| Property            | Value                             | 
|:--------------------|:----------------------------------|
| Service Access      | HTTP                              |
| Upload Interval     | 1 second (RECOMMENDED)            |
| Url                 | http://xxx.xxx.xxx.xxx:3001/minew |
| Authentication Type | none                              |
| BLE Data Format     | Binary / Long                     |

For the Url parameter, substitute xxx.xxx.xxx.xxx for the IP address of the server running __barnowl-minew__.

__barnowl-minew__ expects firmware __v4.x.x__ or later on the Minew G1 gateway to correctly process binary data as _application/octet-stream_.  For firmware __v2.x.x__ and __v3.x.x__, set the isPreOctetStream option to `true` as in the HTTP example above, in order to accept binary data as _application/json_, as it is (incorrectly) sent by the gateway.

__barnowl-minew__ requires firmware __v3.1.3__ or later on the Minew G1 gateway to correctly interpret the transmitterIdType.


Minew G2 Service Parameters
---------------------------

Use the following service parameters for the Minew G2 gateway:

| Property            | Value                             | 
|:--------------------|:----------------------------------|
| Service Access      | HTTP                              |
| Upload Interval     | 100 milliseconds (RECOMMENDED)    |
| Url                 | http://xxx.xxx.xxx.xxx:3001/minew |
| Authentication Type | none                              |
| BLE Data Format     | MINEW-CONNECT or JSON-RAW         |

For the Url parameter, substitute xxx.xxx.xxx.xxx for the IP address of the server running __barnowl-minew__.


Minew MG3 & MG4 Service Parameters
----------------------------------

Use the following service parameters for the Minew MG3 & MG4 gateways:

| Property            | Value                             | 
|:--------------------|:----------------------------------|
| Service Access      | HTTP                              |
| Upload Interval     | 1 second (RECOMMENDED)            |
| Url                 | http://xxx.xxx.xxx.xxx:3001/minew |
| Authentication Type | none                              |
| BLE Data Format     | (JSON-LONG)                       |

For the Url parameter, substitute xxx.xxx.xxx.xxx for the IP address of the server running __barnowl-minew__.

The JSON-LONG data format (which is the default and only option) does not specify the transmitterIdType (public or random address) and therefore the raddec output will always have a transmitterIdType of 0, which represents "unknown".


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.

[![Known Vulnerabilities](https://snyk.io/test/github/reelyactive/barnowl-minew/badge.svg)](https://snyk.io/test/github/reelyactive/barnowl-minew)


License
-------

MIT License

Copyright (c) 2020-2023 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.

