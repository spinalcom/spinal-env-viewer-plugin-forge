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

import {
  SpinalContext,
  SpinalGraphService,
  SpinalNode,
  SpinalNodeRef
} from "spinal-env-viewer-graph-service";
import {
  PART_RELATION_NAME, PART_RELATION_TYPE,
  SCENE_RELATION_NAME,
  SCENE_RELATION_TYPE, SCENE_TYPE
} from "./Constants";
import { SceneNodeRef } from "./interfaces/interfaces";

export interface Scene {
  id?: string;
  name: string;
  description?: string;
  autoLoad: boolean;
  type: string;
  [key: string]: any;
}

export class SceneHelper {
  private static initialized: Promise<boolean>;
  private static context: SpinalContext<any>;
  private static contextName: string = "Scenes";
  private static type: string = "SpinalService";
  private static contextId: string;

  private static initialize(): Promise<boolean> {
    if (typeof SceneHelper.initialized !== "undefined" && SceneHelper.initialized !== null) {
      return SceneHelper.initialized;
    }

    SceneHelper.initialized = new Promise<boolean>((resolve, reject) => {
      SceneHelper.context = SpinalGraphService.getContext(SceneHelper.contextName);

      if (typeof SceneHelper.context === "undefined") {
        return SpinalGraphService.addContext(SceneHelper.contextName, SceneHelper.type)
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

  public static createScene(name: string, description: string, autoLoad: true): Promise<SpinalNode<any>> {
    return SceneHelper.initialize().then(() => {
      const sceneId: string = SpinalGraphService.createNode({
        name,
        description,
        autoLoad,
        type: SCENE_TYPE
      }, undefined);
      return SpinalGraphService.addChildInContext(SceneHelper.contextId, sceneId, SceneHelper.contextId, SCENE_RELATION_NAME, SCENE_RELATION_TYPE);
    });
  }

  public static addModelToScene(sceneId: string, bimFileId: string): Promise<SpinalNode<any>> {
    return SceneHelper.initialize().then(() => {
      return SpinalGraphService.addChildInContext(sceneId, bimFileId, SceneHelper.contextId, PART_RELATION_NAME, PART_RELATION_TYPE);
    })
  }

  public static getBimFilesFromScene(sceneId: string): Promise<SceneNodeRef[]> {
    return SceneHelper.initialize().then(() => {
      return <Promise<SceneNodeRef[]>>SpinalGraphService.getChildren(sceneId, [PART_RELATION_NAME]);
    })
  }

  public static async getSceneFromNode(nodeId: string): Promise<SceneNodeRef[]> {
    await SceneHelper.initialize();
    return <Promise<SceneNodeRef[]>>SpinalGraphService.getChildren(nodeId, [SCENE_RELATION_NAME])
  }

  public static addSceneToNode(nodeId: string, sceneId: string): Promise<SpinalNode<any>> {
    return SceneHelper.initialize().then(() => {
      return SpinalGraphService.addChildInContext(nodeId, sceneId, SceneHelper.contextId, SCENE_RELATION_NAME, SCENE_RELATION_TYPE);
    })
  }
}

