'use strict'

const ranking = require('./lib/ranking');
const client = ranking.setup();

let params = { key: 1, score: 2, value: 3 };
ranking.set(params, client, (err, result) => {
    console.log(err);
    console.log(result);
});

ranking.getCount(params, client, (err, result) => {
    console.log(err);
    console.log(result);
});
