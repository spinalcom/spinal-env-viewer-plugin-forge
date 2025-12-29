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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneHelper = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const Constants_1 = require("./Constants");
class SceneHelper {
    static initialize() {
        if (typeof SceneHelper.initialized !== "undefined" && SceneHelper.initialized !== null) {
            return SceneHelper.initialized;
        }
        SceneHelper.initialized = new Promise((resolve, reject) => {
            SceneHelper.context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(SceneHelper.contextName);
            if (typeof SceneHelper.context === "undefined") {
                return spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(SceneHelper.contextName, SceneHelper.type)
                    .then(context => {
                    SceneHelper.context = context;
                    SceneHelper.contextId = context.getId().get();
                    resolve(true);
                }).catch(reject);
            }
            resolve(true);
        });
        return SceneHelper.initialized;
    }
    static createScene(name, description, autoLoad) {
        return SceneHelper.initialize().then(() => {
            const sceneId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                name,
                description,
                autoLoad,
                type: Constants_1.SCENE_TYPE
            }, undefined);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(SceneHelper.contextId, sceneId, SceneHelper.contextId, Constants_1.SCENE_RELATION_NAME, Constants_1.SCENE_RELATION_TYPE);
        });
    }
    static addModelToScene(sceneId, bimFileId) {
        return SceneHelper.initialize().then(() => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(sceneId, bimFileId, SceneHelper.contextId, Constants_1.PART_RELATION_NAME, Constants_1.PART_RELATION_TYPE);
        });
    }
    static getBimFilesFromScene(sceneId) {
        return SceneHelper.initialize().then(() => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(sceneId, [Constants_1.PART_RELATION_NAME]);
        });
    }
    static async getSceneFromNode(nodeId) {
        await SceneHelper.initialize();
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(nodeId, [Constants_1.SCENE_RELATION_NAME]);
    }
    static addSceneToNode(nodeId, sceneId) {
        return SceneHelper.initialize().then(() => {
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(nodeId, sceneId, SceneHelper.contextId, Constants_1.SCENE_RELATION_NAME, Constants_1.SCENE_RELATION_TYPE);
        });
    }
}
exports.SceneHelper = SceneHelper;
SceneHelper.contextName = "Scenes";
SceneHelper.type = "SpinalService";
