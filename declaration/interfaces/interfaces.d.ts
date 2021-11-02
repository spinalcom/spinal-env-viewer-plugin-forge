import { SpinalNodeRef } from "spinal-env-viewer-graph-service";
export interface BimFileNodeRef extends SpinalNodeRef {
    type: spinal.Str;
    name: spinal.Str;
    id: spinal.Str;
}
export interface SceneNodeRef extends SpinalNodeRef {
    type: spinal.Str;
    name: spinal.Str;
    id: spinal.Str;
    description: spinal.Str;
    autoLoad: spinal.Str;
    useAllDT: spinal.Str;
    sceneAlignMethod?: spinal.Val;
    options: SceneOptions[];
}
export interface SceneOptions extends spinal.Model {
    urn: spinal.Str;
    loadOption: LoadOptions;
    dbIds: spinal.Val[];
}
export interface LoadOptions extends spinal.Model {
    "globalOffset": GolbalOffset;
}
export interface GolbalOffset extends spinal.Model {
    x: spinal.Val;
    y: spinal.Val;
    z: spinal.Val;
}
/**
 * @export
 * @interface BimObjectRef
 * @extends {SpinalNodeRef}
 */
export interface BimObjectRef extends SpinalNodeRef {
    bimFileId: spinal.Str;
    version: spinal.Str;
    externalId: spinal.Str;
    dbid: spinal.Val;
    id: spinal.Str;
    name: spinal.Str;
}
export interface SceneOptionsGet {
    urn?: string;
    loadOption?: ILoadOption;
    dbIds?: number[];
    ids?: number[];
    modelNameOverride?: string;
    applyRefPoint?: any;
    globalOffset?: IGlobalOffset | THREE.Vector3;
}
interface ILoadOption {
    globalOffset: IGlobalOffset;
}
interface IGlobalOffset {
    x: number;
    y: number;
    z: number;
}
export interface ILoadTask {
    child: SceneNodeRef;
    scene: SceneNodeRef;
    option: any;
}
export {};
