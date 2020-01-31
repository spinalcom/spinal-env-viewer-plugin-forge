import { SpinalNode } from "spinal-env-viewer-graph-service";
import { SceneNodeRef } from "./interfaces";
export interface Scene {
    id?: string;
    name: string;
    description?: string;
    autoLoad: boolean;
    type: string;
    [key: string]: any;
}
export declare class SceneHelper {
    private static initialized;
    private static context;
    private static contextName;
    private static type;
    private static contextId;
    private static initialize;
    static createScene(name: string, description: string, autoLoad: true): Promise<SpinalNode<any>>;
    static addModelToScene(sceneId: string, bimFileId: string): Promise<SpinalNode<any>>;
    static getBimFilesFromScene(sceneId: string): Promise<SceneNodeRef[]>;
    static getSceneFromNode(nodeId: string): Promise<SceneNodeRef[]>;
    static addSceneToNode(nodeId: string, sceneId: string): Promise<SpinalNode<any>>;
}
