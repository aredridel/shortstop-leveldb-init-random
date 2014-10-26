"use strict";

var crypto = require('crypto');

module.exports = function dbForInitRandom(db) {
    return function leveldbInitRandom(input, cb) {
        db.get(input, function (err, value) {
            console.log(err && err.code);
            if (value || err && err.type !== 'NotFoundError') {
                return cb(err, value);
            } else {
                crypto.randomBytes(16, errorsTo(cb, function (value) {
                    db.put(input, value, errorsTo(cb, function () {
                        cb(null, value);
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
