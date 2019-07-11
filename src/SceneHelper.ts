import {
  SpinalContext,
  SpinalGraphService,
  SpinalNode
} from "spinal-env-viewer-graph-service";
import {
  PART_RELATION_NAME, PART_RELATION_TYPE,
  SCENE_RELATION_NAME,
  SCENE_RELATION_TYPE, SCENE_TYPE
} from "./Constants";

export interface Scene {
  id? : string;
  name : string;
  description? : string;
  autoLoad : boolean;
  type: string;
  [key: string] : any;
}

export class SceneHelper {
  private static initialized: Promise<boolean>;
  private static context: SpinalContext;
  private static contextName: string = "Scenes";
  private static type: string = "SpinalService";
  private static contextId: string;

  private static initialize() {
    if (typeof SceneHelper.initialized !== "undefined" && SceneHelper.initialized !== null) {
      return SceneHelper.initialized;
    }

    SceneHelper.initialized = new Promise<boolean>((resolve, reject) => {

      SceneHelper.context = SpinalGraphService.getContext(SceneHelper.contextName);
      if (typeof SceneHelper.context === "undefined") {
        SpinalGraphService.addContext(SceneHelper.contextName, SceneHelper.type)
          .then(context => {
            SceneHelper.context = context;
            SceneHelper.contextId = context.getId();
            resolve(true);
          }).catch(reject);
      }

      resolve(true);
    });
    return SceneHelper.initialized;
  }

  public static createScene(name: string, description: string, autoLoad: true): Promise<SpinalNode> {
    return SceneHelper.initialize().then(() => {
      const sceneId: SpinalNode = SpinalGraphService.createNode({
        name,
        description,
        autoLoad,
        type: SCENE_TYPE
      }, undefined);
      return SpinalGraphService.addChildInContext(SceneHelper.contextId, sceneId, SceneHelper.contextId, SCENE_RELATION_NAME, SCENE_RELATION_TYPE);
    });

  }

  public static addModelToScene(sceneId: string, bimFileId: string): Promise<SpinalNode> {
    return SceneHelper.initialize().then(() => {

      return SpinalGraphService.addChildInContext(sceneId, bimFileId, SceneHelper.contextId, PART_RELATION_NAME, PART_RELATION_TYPE);
    })
  }

  public static getBimFilesFromScene(sceneId: string) : any{
    return SceneHelper.initialize().then(() => {
      return SpinalGraphService.getChildren(sceneId, [PART_RELATION_NAME]);

    })
  }

  public static getSceneFromNode(nodeId: string) : Promise<any>{
    return SceneHelper.initialize().then(() => {
      return SpinalGraphService.getChildren(nodeId, [SCENE_RELATION_NAME])

    })
  }

  public static addSceneToNode(nodeId: string, sceneId: string) {
    return SceneHelper.initialize().then(() => {
      return SpinalGraphService.addChildInContext(nodeId, sceneId, SceneHelper.contextId, SCENE_RELATION_NAME, SCENE_RELATION_TYPE);
    })
  }

}

