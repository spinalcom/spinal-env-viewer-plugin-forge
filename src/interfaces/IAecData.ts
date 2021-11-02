/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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

export interface IAecData {
  version: string;
  documentId: string;
  phases: IPhasesItem[];
  levels: ILevelsItem[];
  scopeBoxes: IScopeBoxesItem[];
  refPointTransformation: number[];
  levelOccluderIds: number[];
  viewports: IViewportsItem[];
  grids: IGridsItem[];
  linkedDocuments: any[];
  locationParameters: ILocationParameters;
}
interface IPhasesItem {
  name: string;
}
interface ILevelsItem {
  guid: string;
  name: string;
  elevation: number;
  height: number;
  extension: IExtension;
}
interface IExtension {
  buildingStory: boolean;
  structure: boolean;
  computationHeight: number;
  groundPlane: boolean;
  hasAssociatedViewPlans: boolean;
}
interface IScopeBoxesItem {
  guid: string;
  name: string;
  max: IMax;
  min: IMin;
}
interface IMax {
  x: number;
  y: number;
  z: number;
}
interface IMin {
  x: number;
  y: number;
  z: number;
}
interface IViewportsItem {
  isCropBoxActive: boolean;
  hasBreaks: boolean;
  sheetGuid: string;
  viewportGuid: string;
  viewGuid: string;
  viewType: string;
  viewportRotation: number;
  scale: number;
  sectionBox: ISectionBox;
  cameraOrientation: number[];
  viewportPosition: number[];
  geometryViewportRegion: number[];
  modelToSheetTransform: number[];
  extensions: IExtensions;
}
interface ISectionBox {
  min: IMin;
  max: IMax;
  transform: number[];
}
interface IExtensions {
  viewRange: IViewRange;
  hasRegions: boolean;
  farClipOffsetActive: boolean;
  farClipOffset: number;
}
interface IViewRange {
  cutPlane: ICutPlane;
  topClipPlane?: ITopClipPlane;
  bottomClipPlane: IBottomClipPlane;
  viewDepthPlane: IViewDepthPlane;
}
interface ICutPlane {
  levelGuid: string;
  offset: number;
}
interface ITopClipPlane {
  levelGuid: string;
  offset: number;
}
interface IBottomClipPlane {
  levelGuid: string;
  offset: number;
}
interface IViewDepthPlane {
  levelGuid: string;
  offset: number;
}
interface IGridsItem {
  id: string;
  label: string;
  document: string;
  boundingBox: number[];
  segments: ISegmentsItem[];
}
interface ISegmentsItem {
  type: number;
  guid: string;
  points: IPoints;
}
interface IPoints {
  start: number[];
  end: number[];
}
interface ILocationParameters {
  placeName: string;
}
