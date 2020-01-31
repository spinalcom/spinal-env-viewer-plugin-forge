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
  options: SceneOptions[];
}
export interface SceneOptions extends spinal.Model {
  urn: spinal.Str;
  loadOption: LoadOptions;
  dbIds: spinal.Val[];
}
export interface LoadOptions extends spinal.Model {
  "globalOffset": GolbalOffset
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
  bimFileId: spinal.Str,
  version: spinal.Str,
  externalId: spinal.Str,
  dbid: spinal.Val,
  id: spinal.Str;
  name: spinal.Str;
}
export interface SceneOptionsGet {
  urn?: string;
  loadOption?: ILoadOption;
  dbIds?: number[];
  ids?: number[];
}
interface ILoadOption {
  globalOffset: IGlobalOffset;
}
interface IGlobalOffset {
  x: number;
  y: number;
  z: number;
}
