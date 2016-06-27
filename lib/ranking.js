'use strict';

const _ = require('lodash');

const Redis = require('ioredis');

function defaultRetryDelay(times) {
  return Math.min(times * 2, 2000);
}

exports.deleteAll = (params, ranking, callback) => {
  const key = params.key;
  ranking.zremrangebyrank(key, 0, -1, callback);
};

exports.set = (params, ranking, callback) => {
  const key = params.key;
  const score = params.score;
  const value = params.value;
  ranking.zadd(key, score, value, callback);
};

exports.getRank = (params, ranking, callback) => {
  const key = params.key;
  const value = params.value;
  ranking.zrevrank(key, value, (err, result) => {
    if (err)
      return callback(err);

    result = _.isNumber(result) ? result + 1 : null;
    callback(null, result);
  });
};

exports.getScore = (params, ranking, callback) => {
  const key = params.key;
  const value = params.value;
  ranking.zscore(key, value, (err, result) => {
    if (err)
      return callback(err);
    callback(null, result | 0);
  });
};

exports.getCount = (params, ranking, callback) => {
  const key = params.key;
  ranking.zcard(key, (err, result) => {
    if (err)
      return callback(err);
    callback(null, result | 0);
  });
};

exports.setup = () => {
  let retryDelay = defaultRetryDelay;
  let retryStrategy = defaultRetryDelay;

  let client = new Redis.Cluster(
      {
          cluster: [{
              host: 'load-redis-0.c.melo-dev.internal',
              port: 6379,
          }, {
              host: 'load-redis-1.c.melo-dev.internal',
              port: 6379,
          }, {
              host: 'load-redis-2.c.melo-dev.internal',
              port: 6379,
          }, {
              host: 'load-redis-3.c.melo-dev.internal',
              port: 6379,
          }, {
              host: 'load-redis-4.c.melo-dev.internal',
              port: 6379,
          }, {
              host: 'load-redis-5.c.melo-dev.internal',
              port: 6379,
          }]
      },
      {
          clusterRetryStrategy: retryStrategy
      }
  );

  return client;
};
