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
  SpinalGraphService,
  SpinalNodePointer,
} from 'spinal-env-viewer-graph-service';
import { BimObjectService } from './BimObjectService';
import { SCENE_TYPE } from './Constants';
import { loadModelPtr } from './utils';
import { SceneHelper } from './SceneHelper';
import Model = Autodesk.Viewing.Model;
import {
  BimFileNodeRef,
  SceneNodeRef,
  SceneOptions,
  SceneOptionsGet,
  BimObjectRef,
} from './interfaces/interfaces';
import Axios from 'axios';
import { IAecData } from './interfaces/IAecData';
import { ISVFFile } from './interfaces/ISVFFile';
import { SceneAlignMethod } from './interfaces/SceneAlignMethod';
import { ILoadTask } from './interfaces/interfaces';
var THREE = require('three');

export class SpinalForgeViewer {
  public currentSceneId: string;
  public initialized: Promise<boolean>;
  public scenes: { sceneId: string; modelIds: number[] }[];
  public bimObjectService: BimObjectService = new BimObjectService();
  public viewerManager: any;
  private overlayName = 'spinal-material-overlay';
  // private option: SceneOptionsGet = null;
  private globalOffset: THREE.Vector3;

  initialize(viewerManager): Promise<boolean> {
    if (typeof this.initialized === 'undefined')
      this.initialized = new Promise((resolve) => {
        this.viewerManager = viewerManager;
        const addEventListen = () => {
          this.viewerManager.viewer.addEventListener(
            Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
            (event) => {
              if (
                typeof event.selections !== 'undefined' &&
                event.selections.length > 0
              ) {
                this.viewerManager.setCurrentModel(event.selections[0].model);
                this.bimObjectService.setCurrentModel(
                  event.selections[0].model
                );
              }
            }
          );
          clearInterval(inter);
          resolve(true);
        };
        const inter = setInterval(addEventListen, 200);
      });

    return this.initialized;
  }

  isInitialize(): boolean {
    return typeof this.initialized !== 'undefined';
  }

  waitForInitialization() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (typeof this.initialized !== 'undefined') {
          clearInterval(interval);
          this.initialized.then(() => resolve(true));
        }
      }, 200);
    });
  }

  getScene(modelId: number): { sceneId: string; modelIds: number[] }[] {
    return this.scenes.filter((scene) => {
      return scene.modelIds.indexOf(modelId) !== -1;
    });
  }

  async getSVFListFromBimFile(
    bimFileId: string
  ): Promise<{ path: string; name: string; thumbnail: string }[]> {
    const bimFileRNode = SpinalGraphService.getRealNode(bimFileId);
    const elem1 = await loadModelPtr(bimFileRNode.element.ptr);
    const elem = await loadModelPtr(elem1.currentVersion);
    const res = [];
    if (elem.hasOwnProperty('items')) {
      for (let i = 0; i < elem.items.length; i++) {
        if (elem.items[i].path.get().indexOf('svf') !== -1) {
          const thumbnail = elem.items[i].thumbnail
            ? elem.items[i].thumbnail.get()
            : elem.items[i].path.get() + '.png';
          res.push({
            path: elem.items[i].path.get(),
            name: elem.items[i].name.get(),
            thumbnail,
          });
        }
      }
    }
    return res;
  }
  getBimFileDefautPath(bimFileId: string): any {
    const bimFileRNode = SpinalGraphService.getRealNode(bimFileId);
    if (bimFileRNode && bimFileRNode.info.defaultItem) {
      return bimFileRNode.info.defaultItem.get();
    }
  }
  setBimFileDefautPath(bimFileId: string, path) {
    const bimFileRNode = SpinalGraphService.getRealNode(bimFileId);
    if (bimFileRNode) {
      if (bimFileRNode.info.defaultItem) {
        return bimFileRNode.info.defaultItem.set(path);
      } else {
        return bimFileRNode.info.add_attr('defaultItem', path);
      }
    }
  }

  async getSVF(
    element: SpinalNodePointer<any>,
    nodeId: string,
    name: string
  ): Promise<ISVFFile> {
    const elem1 = await loadModelPtr(element.ptr);
    const elem = await loadModelPtr(elem1.currentVersion);
    if (elem.hasOwnProperty('items')) {
      // 1ere passe pour default path
      const bimFileRNode = SpinalGraphService.getRealNode(nodeId);
      if (bimFileRNode && bimFileRNode.info.defaultItem) {
        const defaultPath = bimFileRNode.info.defaultItem.get();
        for (let i = 0; i < elem.items.length; i++) {
          if (
            elem.items[i].path.get().indexOf('svf') !== -1 &&
            defaultPath === elem.items[i].path.get()
          ) {
            const thumbnail = elem.items[i].thumbnail
              ? elem.items[i].thumbnail.get()
              : elem.items[i].path.get() + '.png';
            return {
              version: elem.versionId,
              path: elem.items[i].path.get(),
              id: nodeId,
              name,
              thumbnail,
              aecPath: elem.aecPath?.get(),
            };
          }
        }
      }

      for (let i = 0; i < elem.items.length; i++) {
        if (elem.items[i].path.get().indexOf('svf') !== -1) {
          const thumbnail = elem.items[i].thumbnail
            ? elem.items[i].thumbnail.get()
            : elem.items[i].path.get() + '.png';
          return {
            version: elem.versionId,
            path: elem.items[i].path.get(),
            id: nodeId,
            name,
            thumbnail,
            aecPath: elem.aecPath?.get(),
          };
        }
      }
    }
    return undefined;
  }
  getAecModelData(aecPath: string): Promise<IAecData> {
    return Axios.get(aecPath).then(function (a) {
      return a.data;
    });
  }
  get1stGlobalOffset(): THREE.Vector3 {
    if (!this.globalOffset) {
      this.globalOffset =
        this.viewerManager.viewer.model?.getData().globalOffset;
    }
    return this.globalOffset;
  }
  async addOffsetFromAEC(aecPath: string): Promise<THREE.Vector3> {
    const globalOffset = this.get1stGlobalOffset();
    const aecModelData = await this.getAecModelData(aecPath);
    if (aecModelData) {
      const tf = aecModelData && aecModelData.refPointTransformation;
      const refPoint = tf
        ? { x: tf[9], y: tf[10], z: 0 }
        : { x: 0, y: 0, z: 0 };
      const MaxDistSqr = 4.0e6;
      const distSqr =
        globalOffset &&
        THREE.Vector3.prototype.distanceToSquared.call(refPoint, globalOffset);
      if (!globalOffset || distSqr > MaxDistSqr) {
        // @ts-ignore
        return new THREE.Vector3().copy(refPoint);
      }
    }
    return globalOffset;
  }
  getOption(
    options: SceneOptions[],
    svfVersionFile: ISVFFile
  ): SceneOptionsGet {
    for (var i = 0; i < options.length; i++) {
      if (options[i].urn.get().includes(svfVersionFile.path)) {
        var opt: SceneOptionsGet = options[i].get();
        opt.modelNameOverride = svfVersionFile.name;
        return opt;
      }
    }
    return {
      modelNameOverride: svfVersionFile.name,
    };
  }
  addDbIdToOption(option: SceneOptionsGet): void {
    if (option.hasOwnProperty('dbIds') && option.dbIds.length > 0) {
      option.ids = option.dbIds;
    }
  }

  async loadBimFile(
    bimFile: BimFileNodeRef,
    scene: SceneNodeRef,
    options: SceneOptions[] = []
  ): Promise<{
    bimFileId: string;
    model: Model;
  }> {
    const is1stModel = !this.viewerManager.viewer.model;
    const svfVersionFile = await this.getSVF(
      bimFile.element,
      bimFile.id.get(),
      bimFile.name.get()
    );
    let option = null;
    if (typeof scene.sceneAlignMethod === 'undefined') {
      // old scene handle
      option = this.getOption(options, svfVersionFile);
      if (
        option.loadOption &&
        option.loadOption.hasOwnProperty('globalOffset')
      ) {
        if (!this.globalOffset)
          this.globalOffset = option.loadOption.globalOffset;
        option.globalOffset = this.globalOffset;
      }
    } else {
      option = this.getOption(options, svfVersionFile);
      if (scene.sceneAlignMethod.get() === SceneAlignMethod.OriginToOrigin) {
        option.globalOffset = this.get1stGlobalOffset();
      } else if (
        scene.sceneAlignMethod.get() === SceneAlignMethod.ShareCoordinates &&
        svfVersionFile.aecPath
      ) {
        option.applyRefPoint = true;
        option.globalOffset = await this.addOffsetFromAEC(
          svfVersionFile.aecPath
        );
      }
    }
    this.addDbIdToOption(option);
    const path = this.getNormalisePath(svfVersionFile.path);
    const model = await this.viewerManager.loadModel(path, option, is1stModel);
    this.bimObjectService.addModel(
      bimFile.id.get(),
      model,
      svfVersionFile.version,
      scene,
      bimFile.name.get()
    );
    return { bimFileId: bimFile.id.get(), model: model };
  }

  async load1stThenAll<T, K>(
    tasks: T[],
    callback: (itm: T) => Promise<K>
  ): Promise<K[]> {
    const results: K[] = [];
    let idx = 0;
    if (tasks.length > 0 && !this.viewerManager.viewer.model) {
      idx = 1;
      await callback(tasks[0]).then((res: K): void => {
        results.push(res);
      });
    }
    const proms = [];
    for (; idx < tasks.length; idx++) {
      proms.push(
        callback(tasks[idx]).then(function (res: K): void {
          results.push(res);
        })
      );
    }
    return Promise.all(proms).then(() => results);
  }

  async loadModelFromNode(nodeId: string): Promise<
    {
      bimFileId: string;
      model: Model;
    }[]
  > {
    try {
      const node = await SpinalGraphService.getNodeAsync(nodeId);
      if (node.type.get() === SCENE_TYPE) {
        const scene = <SceneNodeRef>node;
        const children = await SceneHelper.getBimFilesFromScene(nodeId);
        const option = typeof node.options !== 'undefined' ? node.options : [];
        const data = children.map((child: SceneNodeRef): ILoadTask => {
          return { child, scene, option };
        });
        return this.load1stThenAll(
          data,
          ({
            child,
            scene,
            option,
          }: ILoadTask): Promise<{ bimFileId: string; model: Model }> => {
            return this.loadBimFile(child, scene, option);
          }
        );
      }
      const scenes: SceneNodeRef[] = await SceneHelper.getSceneFromNode(nodeId);
      const res = [];
      for (const scene of scenes) {
        const r = await this.loadModelFromNode(scene.id.get());
        res.push.apply(res, r);
      }
      return res;
    } catch (e) {
      console.error(e);
    }
  }

  getNormalisePath(path: string) {
    let res = path;
    if (!/https?:\/\//.test(path)) res = window.location.origin + path;
    return res;
  }

  /**
   * return the model associated to the bimfile
   * @param bimFileId
   * @param dbId
   */
  getModel(bimObject: BimObjectRef): Model {
    return this.bimObjectService.getModel(
      bimObject.dbid.get(),
      bimObject.bimFileId.get()
    );
  }

  async loadModelFromBimFile(
    bimFile: BimFileNodeRef
  ): Promise<{ model: Model }> {
    const svfVersionFile = await this.getSVF(
      bimFile.element,
      bimFile.id.get(),
      bimFile.name.get()
    );
    const path = this.getNormalisePath(svfVersionFile.path);
    const is1stModelLoaded = !spinal.SpinalForgeViewer.viewerManager.viewer.model
    const model = await this.viewerManager.loadModel(path, {}, is1stModelLoaded);
    await this.bimObjectService._addModel(
      bimFile.id.get(),
      model,
      svfVersionFile.name
    );
    return { model };
  }

  private addMaterial(color: THREE.Color) {
    // @ts-ignore
    const material = new THREE.MeshPhongMaterial({
      color: color,
    });

    this.viewerManager.viewer.impl.createOverlayScene(
      this.overlayName,
      material,
      material
    );
    return material;
  }

  setModelColorMaterial(model: Model, color: THREE.Color, ids: number[]): void {
    var material = this.addMaterial(color);
    for (var i = 0; i < ids.length; i++) {
      var dbid = ids[i];
      //from dbid to node, to fragid
      var it = model.getData().instanceTree;
      it.enumNodeFragments(
        dbid,
        function (fragId) {
          var renderProxy = this.viewerManager.viewer.impl.getRenderProxy(
            model,
            fragId
          );
          // @ts-ignore
          renderProxy.meshProxy = new THREE.Mesh(
            renderProxy.geometry,
            material
          );
          renderProxy.meshProxy.matrix.copy(renderProxy.matrixWorld);
          renderProxy.meshProxy.matrixWorldNeedsUpdate = true;
          renderProxy.meshProxy.matrixAutoUpdate = false;
          renderProxy.meshProxy.frustumCulled = false;
          this.viewerManager.viewer.impl.addOverlay(
            this.overlayName,
            renderProxy.meshProxy
          );
          this.viewerManager.viewer.impl.invalidate(true);
        }.bind(this),
        false
      );
    }
  }

  setColorMaterial(
    aggregateSelection: { model: Model; selection: number[] }[],
    color: THREE.Color
  ): void {
    for (let i = 0; i < aggregateSelection.length; i++) {
      const model = aggregateSelection[i].model;
      const ids = aggregateSelection[i].selection;
      this.setModelColorMaterial(model, color, ids);
    }
  }

  restoreColorMaterial(
    aggregateSelection: { model: Model; selection: number[] }[]
  ): void {
    for (let i = 0; i < aggregateSelection.length; i++) {
      const model = aggregateSelection[1].model;
      const ids = aggregateSelection[1].selection;
      this.restoreModelColorMaterial(model, ids);
    }
  }

  restoreModelColorMaterial(model: Model, ids: number[]) {
    for (var i = 0; i < ids.length; i++) {
      var dbid = ids[i];
      //from dbid to node, to fragid
      var it = model.getData().instanceTree;

      it.enumNodeFragments(
        dbid,
        function (fragId) {
          var renderProxy = this.viewerManager.viewer.impl.getRenderProxy(
            model,
            fragId
          );
          if (renderProxy.meshProxy) {
            //remove all overlays with same name
            this.viewerManager.viewer.impl.clearOverlay(this.overlayName);
            //viewer.impl.removeOverlay(overlayName, renderProxy.meshProxy);
            delete renderProxy.meshProxy;
            //refresh the scene
            this.viewerManager.viewer.impl.invalidate(true);
          }
        },
        true
      );
    }
  }
}
