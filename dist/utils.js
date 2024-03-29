"use strict";
exports.__esModule = true;
exports.loadModelPtr = void 0;
var spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
var mapModelDictionary = new Map();
function loadModelPtr(model) {
    if (model instanceof spinal_core_connectorjs_type_1.File) {
        return loadModelPtr(model._ptr);
    }
    if (!(model instanceof spinal_core_connectorjs_type_1.Ptr)) {
        throw new Error('loadModelPtr must take Ptr as parameter');
    }
    if (!model.data.value && model.data.model) {
        return Promise.resolve(model.data.model);
    }
    else if (!model.data.value) {
        throw new Error('Trying to load a Ptr to 0');
    }
    if (mapModelDictionary.has(model.data.value)) {
        return mapModelDictionary.get(model.data.value);
    }
    if (typeof spinal_core_connectorjs_type_1.FileSystem._objects[model.data.value] !== 'undefined') {
        var promise_1 = Promise.resolve(spinal_core_connectorjs_type_1.FileSystem._objects[model.data.value]);
        mapModelDictionary.set(model.data.value, promise_1);
        return promise_1;
    }
    var promise = new Promise(function (resolve, reject) {
        model.load(function (m) {
            if (!m) {
                mapModelDictionary["delete"](model.data.value);
                reject(new Error('Error in load Ptr'));
            }
            else {
                resolve(m);
            }
        });
    });
    mapModelDictionary.set(model.data.value, promise);
    return promise;
}
exports.loadModelPtr = loadModelPtr;
