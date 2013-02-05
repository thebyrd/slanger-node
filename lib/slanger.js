module.exports = (function() {
  var crypto = require('crypto');
  var request = require('request');

  var Slanger = function (options) {
    this.options = options;
    this.options.domain = this.options.domain || 'localhost';
    this.options.domain = this.options.domain || 4567;
    this.options.scheme = this.options.scheme || 'http';

    return this;
  };

  Slanger.prototype.trigger = function (channel, event, message, callback) {

    Slanger.modules = {
      request: request,
      crypto: crypto
    };

    var eventData = {
      "data": ( typeof message === 'object' ? JSON.stringify( message ) : message )
    };

    var timestamp = parseInt(new Date().getTime() / 1000, 10);
    var requestBody = JSON.stringify( eventData );
    var hash = Slanger.modules.crypto.createHash('md5').update(new Buffer(requestBody).toString('binary')).digest('hex');

    var params = [
      'auth_key=', this.options.key,
      '&auth_timestamp=', timestamp,
      '&auth_version=', '1.0',
      '&body_md5=', hash,
      '&name=', event
    ];

    var queryString = params.join('');

    var path = '/apps/' + this.options.appId + '/channels/' + channel + '/events';

    var signData = ['POST', path, queryString].join('\n');
    var signature = Slanger.modules.crypto.createHmac('sha256', this.options.secret).update(signData).digest('hex');
    path = path + '?' + queryString + '&auth_signature=' + signature;
    var url = this.options.scheme + '://' + this.options.domain + ( this.options.port === 80? '' : ':' + this.options.port ) + path;

    Slanger.modules.request.post({
      url: url,
      headers: {
        'content-type': 'application/json'
      },
      body: requestBody
    }, function( err, res, body ) {
      // although using request module the callback signature
      // needs to be maintained
      if( typeof callback === 'function' ) {
        callback( err, this.req, res );
      }
    });

    return this;
  };

  return Slanger;
})();