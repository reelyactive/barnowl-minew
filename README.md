barnowl-minew
=============

Interface [Minew gateways](https://www.minew.com/ble-wifi-gateway) with [barnowl](https://github.com/reelyactive/barnowl) open source software.  We believe in an open Internet of Things.


Installation
------------

    npm install barnowl-minew


Quick Start
-----------

Clone this repository, install package dependencies with `npm install`, and then from the root folder run at any time:

    npm start

See our tutorial [Configure a Minew G1 Gateway](https://reelyactive.github.io/diy/minew-g1-config/).  __barnowl-minew__ will indiscriminately accept HTTP POSTs on localhost:3001 and print any processed [raddec](https://github.com/reelyactive/raddec) data to the console.


Hello barnowl-minew!
--------------------

The following code will listen to _simulated_ hardware and output packets to the console:

```javascript
const BarnowlMinew = require('barnowl-minew');

let barnowl = new BarnowlMinew();

barnowl.addListener(BarnowlMinew.TestListener, {});

barnowl.on('raddec', function(raddec) {
  console.log(raddec);
});
```


Supported Listener Interfaces
-----------------------------

The following listener interfaces are supported.

### HTTP

The _recommended_ implementation is using [express](https://expressjs.com/) as follows:

```javascript
const express = require('express');
const http = require('http');

let app = express();
let server = http.createServer(app);
server.listen(3001, function() { console.log('Listening on port 3001'); });

let options = { app: app, express: express, route: "/minew" };
barnowl.addListener(BarnowlMinew.HttpListener, options);
```

Nonetheless, for testing purposes, __barnowl-minew__ can also create a minimal HTTP server as an alternative to express, and attempt to handle any POST it receives:

```javascript
barnowl.addListener(BarnowlMinew.HttpListener, { port: 3001 });
```

### Test

Provides a steady stream of simulated Minew packets for testing purposes.

```javascript
barnowl.addListener(BarnowlMinew.TestListener, {});
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


License
-------

MIT License

Copyright (c) 2020 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.

