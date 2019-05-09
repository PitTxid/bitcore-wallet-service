var Bitcore_ = {
  btc: require('bitcore-lib'),
  bch: require('bitcore-lib-cash'),
  xsg: require('bitcore-lib-snowgem'),
  zec: require('bitcore-lib-zcash'),
  dash: require("@dashevo/dashcore-lib"),
  ltc: require('bitcore-lib-litecoin'),
  zen: require('bitcore-lib-zen'),
  kmd: require('bitcore-lib-komodo'),
};

var _ = require('lodash');

function BCHAddressTranslator() {
};


BCHAddressTranslator.getAddressCoin = function(address, coin) {
  if(coin.toLowerCase() != 'bch') {
    try {
      new Bitcore_[coin].Address(address);
      return 'legacy';
    } catch (e) {
      return;
    }
  }
  else {
    try {
      var a= new Bitcore_['bch'].Address(address);
      if (a.toLegacyAddress() == address) return 'copay';
      return 'cashaddr';
    } catch (e) {
      return;
    }
  }
};


// Supports 3 formats:  legacy (1xxx, mxxxx); Copay: (Cxxx, Hxxx), Cashaddr(qxxx);
BCHAddressTranslator.translate = function(addresses, to, from, coin) {
  var wasArray = true;
  if (!_.isArray(addresses)) {
    wasArray = false;
    addresses = [addresses];
  }
  from = from || BCHAddressTranslator.getAddressCoin(addresses[0], coin);

  var ret;
  if (from == to) {
    ret = addresses;
  } else {
    ret =  _.map(addresses, function(x) {
      var bitcore = Bitcore_[coin];
      var orig = new bitcore.Address(x).toObject();

      if (to == 'cashaddr') {
        return Bitcore_['bch'].Address.fromObject(orig).toCashAddress(true);
      } else if (to == 'copay') {
        return Bitcore_['bch'].Address.fromObject(orig).toLegacyAddress();
      } else if (coin != 'bch') {
        return Bitcore_[coin].Address.fromObject(orig).toString();
      }
    });
  }
  if (wasArray) 
    return ret;
  else 
    return ret[0];

};


module.exports = BCHAddressTranslator;
