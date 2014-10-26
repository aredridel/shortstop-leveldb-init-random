"use strict";

var crypto = require('crypto');

module.exports = function dbForInitRandom(db) {
    return function leveldbInitRandom(input, cb) {
        db.get(input, errorsTo(cb, function (value) {
            if (value) {
                return cb(null, value);
            } else {
                crypto.randomBytes(16, errorsTo(cb, function (value) {
                    db.put(input, value, errorsTo(cb, function () {
                        cb(null, value);
                    }));
                }));
            }
        }));

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
