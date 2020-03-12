"use strict";
/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
var Constants_1 = require("./Constants");
var SceneHelper = /** @class */ (function () {
    function SceneHelper() {
    }
    SceneHelper.initialize = function () {
        if (typeof SceneHelper.initialized !== "undefined" && SceneHelper.initialized !== null) {
            return SceneHelper.initialized;
        }
        SceneHelper.initialized = new Promise(function (resolve, reject) {
            SceneHelper.context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(SceneHelper.contextName);
            if (typeof SceneHelper.context === "undefined") {
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(SceneHelper.contextName, SceneHelper.type)
                    .then(function (context) {
                    SceneHelper.context = context;
                    SceneHelper.contextId = context.getId().get();
                    resolve(true);
                })["catch"](reject);
            }
            resolve(true);
        });
        return SceneHelper.initialized;
    };
    SceneHelper.createScene = function (name, description, autoLoad) {
        return SceneHelper.initialize().then(function () {
            var sceneId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                name: name,
                description: description,
                autoLoad: autoLoad,
                type: Constants_1.SCENE_TYPE
            }, undefined);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(SceneHelper.contextId, sceneId, SceneHelper.contextId, Constants_1.SCENE_RELATION_NAME, Constants_1.SCENE_RELATION_TYPE);
        });
    };
    SceneHelper.addModelToScene = function (sceneId, bimFileId) {
        return SceneHelper.initialize().then(function () {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(sceneId, bimFileId, SceneHelper.contextId, Constants_1.PART_RELATION_NAME, Constants_1.PART_RELATION_TYPE);
        });
    };
    SceneHelper.getBimFilesFromScene = function (sceneId) {
        return SceneHelper.initialize().then(function () {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(sceneId, [Constants_1.PART_RELATION_NAME]);
        });
    };
    SceneHelper.getSceneFromNode = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SceneHelper.initialize()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [Constants_1.SCENE_RELATION_NAME])];
                }
            });
        });
    };
    SceneHelper.addSceneToNode = function (nodeId, sceneId) {
        return SceneHelper.initialize().then(function () {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(nodeId, sceneId, SceneHelper.contextId, Constants_1.SCENE_RELATION_NAME, Constants_1.SCENE_RELATION_TYPE);
        });
    };
    SceneHelper.contextName = "Scenes";
    SceneHelper.type = "SpinalService";
    return SceneHelper;
}());
exports.SceneHelper = SceneHelper;
