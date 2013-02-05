# A Node Client for Slanger
## Installation
```bash
$ npm install slanger
```
## How to use
```javascript

var Slanger = require('slanger');

var slanger = new Slanger({
  appId: 'YOUR-PUSHER-APP-ID',
  key: 'YOUR-PUSHER-APP-ID',
  secret: 'YOUR-PUSHER-SECRET-KEY',
  domain: 'slanger.example.com', //defaults to localhost
  port: 4567 // defaults to 4567
});

var channel = 'lobby',
    event = 'message',
    data = {
      from: 'David',
      content: 'Hello World'
    };

slanger.trigger(channel, event, data, function (err, req, res) {
  //do something (callback is optional)
});

```
## Credits
This library borrows heavily from [node-pusher](https://github.com/crossbreeze/node-pusher), which is not compatible with slanger.


## License
This code is free to user under the terms of the MIT license.