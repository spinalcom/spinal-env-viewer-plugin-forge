"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
                spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(SceneHelper.contextName, SceneHelper.type)
                    .then(function (context) {
                    SceneHelper.context = context;
                    SceneHelper.contextId = context.getId();
                    resolve(true);
                }).catch(reject);
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
        return SceneHelper.initialize().then(function () {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [Constants_1.SCENE_RELATION_NAME]);
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
