"use strict";

var test = require('tape');

var db = {
    storage: {},
    get: function (k, fn) {
        fn(null, this.storage[k]);
    },
    put: function (k, v, fn) {
        this.storage[k] = v;
        fn();
    }
};

var handler = require('../')(db);

test('does it work', function (t) {
    t.ok(!db.storage.test);
    handler('test', function (err, data) {
        console.log(arguments);
        t.ok(db.storage.test);
        t.equal(db.storage.test, data);
        handler('test', function (err, data2) {
            t.equal(data, data2);
            t.end();
        });
    });
});
