'use strict';

var _ = require('lodash');
var $ = require('preconditions').singleton();
var log = require('npmlog');
log.debug = log.verbose;

var Insight = require('./blockchainexplorers/insight');
var V8 = require('./blockchainexplorers/v8');
var Common = require('./common');
var Constants = Common.Constants,
  Defaults = Common.Defaults,
  Utils = Common.Utils;

var PROVIDERS = {
  'insight': {
    'btc': {
      'livenet': 'https://insight.bitpay.com:443',
      'testnet': 'https://test-insight.bitpay.com:443',
    },
    'bch': {
      'livenet': 'https://bch-insight.bitpay.com:443',
      'testnet': 'https://test-bch-insight.bitpay.com:443',
    },
    'xsg': {
      'livenet': 'https://explorer.snowgem.org/',
      'testnet': 'https://explorer.snowgem.org/',
    },
    'zec': {
      'livenet': 'https://zcash.blockexplorer.com/',
      'testnet': 'https://zcash.blockexplorer.com/',
    },
    'dash': {
      'livenet': 'https://dashblockexplorer.com/',
      'testnet': 'https://dashblockexplorer.com/',
    },
    'ltc': {
      'livenet': 'https://insight.litecore.io/',
      'testnet': 'https://insight.litecore.io/',
    },
    'zen': {
      'livenet': 'https://explorer.zensystem.io/',
      'testnet': 'https://explorer.zensystem.io/',
    },
    'kmd': {
      'livenet': 'https://kmdexplorer.io/',
      'testnet': 'https://kmdexplorer.io/',
    },
  },

  'v8': {
    'btc': {
      'livenet': 'https://api.bitcore.io',
      'testnet': 'https://api.bitcore.io',
    },
    'bch': {
      'livenet': 'https://api.bitcore.io',
      'testnet': 'https://api.bitcore.io',
    },
 
  },
};

function BlockChainExplorer(opts) {
  $.checkArgument(opts);

  var provider = opts.provider || 'insight';
  var coin = opts.coin || Defaults.COIN;
  var network = opts.network || 'livenet';

  $.checkState(PROVIDERS[provider], 'Provider ' + provider + ' not supported');
  $.checkState(_.includes(_.keys(PROVIDERS[provider]), coin), 'Coin ' + coin + ' not supported by this provider');

  $.checkState(_.includes(_.keys(PROVIDERS[provider][coin]), network), 'Network ' + network + ' not supported by this provider for coin ' + coin);

  var url = opts.url || PROVIDERS[provider][coin][network];


  if (coin != 'bch' && opts.addressFormat)
    throw new Error('addressFormat only supported for bch');

  if (coin == 'bch' && !opts.addressFormat)
    opts.addressFormat = 'cashaddr';
  

  switch (provider) {
    case 'insight':
      return new Insight({
        coin: coin,
        network: network,
        url: url,
        apiPrefix: opts.apiPrefix,
        userAgent: opts.userAgent,
        addressFormat: opts.addressFormat,
      });
    case 'v8':
      return new V8({
        coin: coin,
        network: network,
        url: url,
        apiPrefix: opts.apiPrefix,
        userAgent: opts.userAgent,
        addressFormat: opts.addressFormat,
      });
 
    default:
      throw new Error('Provider ' + provider + ' not supported.');
  };
};

module.exports = BlockChainExplorer;
