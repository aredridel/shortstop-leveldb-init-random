"use strict";

var crypto = require('crypto');

module.exports = function dbForInitRandom(db) {
    return function leveldbInitRandom(input, cb) {
        db.get(input, function (err, value) {
            if (value && value.length) {
                return cb(null, value.toString('hex'));
            } else if (err && err.type !== 'NotFoundError') {
                return cb(err);
            } else {
                crypto.randomBytes(16, errorsTo(cb, function (value) {
                    db.put(input, value, errorsTo(cb, function () {
                        cb(null, value.toString('hex'));
                    }));
                }));
            }
        });

        function errorsTo(errh, succh) {
            return function (err, data) {
                if (err) {
                    errh(err);
                } else {
                    succh(data);
                }
            };
        }
    };
};
