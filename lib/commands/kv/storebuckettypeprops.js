/*
 * Copyright 2015 Basho Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var rpb = require('../../protobuf/riakprotobuf');
var inherits = require('util').inherits;
var Joi = require('joi');

var StorePropsBase = require('./storepropsbase');

/**
 * Provides the StoreBucketTypeProps class, its builder, and its response.
 * @module KV
 */

/**
 * Command used to set the properties on a bucket type in Riak.
 *
 * As a convenience, a builder class is provided:
 *
 *     var storeProps = new StoreBucketTypeProps.Builder()
 *                  .withBucketType('my-type')
 *                  .withAllowMult(true)
 *                  .build();
 *
 * See {{#crossLink "StoreBucketTypeProps.Builder"}}StoreBucketTypeProps.Builder{{/crossLink}}
 *
 * @class StoreBucketTypeProps
 * @constructor
 * @param {Object} options The properties to store
 * @param {String} [options.bucketType] The bucket type in riak. If not supplied 'default is used'
 * @extends StorePropsBase
 */
function StoreBucketTypeProps(options, callback) {
    StorePropsBase.call(this, options, 'RpbSetBucketTypeReq', 'RpbSetBucketResp', callback);
    var self = this;
    Joi.validate(options, schema, { allowUnknown: true }, function(err, options) {
        if (err) {
            throw err;
        }
        self.options = options;
    });
}

inherits(StoreBucketTypeProps, StorePropsBase);

StoreBucketTypeProps.prototype.constructPbRequest = function() {
    var protobuf = StoreBucketTypeProps.super_.prototype.constructPbRequest.call(this); 
    protobuf.setType(new Buffer(this.options.bucketType));
    return protobuf;
};

/**
 * A builder for constructing StoreBucketTypeProps instances
 *
 * Rather than having to manually construct the __options__ and instantiating
 * a StoreBucketTypeProps directly, this builder may be used.
 *
 *     var storeProps = new StoreBucketTypeProps.Builder()
 *                  .withAllowMult(true)
 *                  .build();
 *
 * @class StoreBucketTypeProps.Builder
 * @constructor
 */
function Builder() {
    StorePropsBase.Builder.call(this);
    this.precommit = [];
    this.postcommit = [];
}

inherits(Builder, StorePropsBase.Builder);

var schema = Joi.object().keys({
    bucketType: Joi.string().default('default')
});

/**
 * Construct a StoreBucketTypeProps instance.
 * @method build
 * @return {StoreBucketTypeProps}
 */
Builder.prototype.build = function() {
    var cb = this.callback;
    delete this.callback;
    return new StoreBucketTypeProps(this, cb);
};

module.exports = StoreBucketTypeProps;
module.exports.Builder = Builder;
