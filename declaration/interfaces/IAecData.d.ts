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
export {};
