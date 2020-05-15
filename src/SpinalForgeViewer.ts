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

import { SpinalGraphService, SpinalNodePointer } from "spinal-env-viewer-graph-service";
import { BimObjectService } from "./BimObjectService";
import { SCENE_TYPE } from "./Constants";
import { loadModelPtr } from "./utils";
import { SceneHelper } from "./SceneHelper";
import Model = Autodesk.Viewing.Model;
import {
  BimFileNodeRef,
  SceneNodeRef,
  SceneOptions,
  SceneOptionsGet,
  BimObjectRef,
} from './interfaces'

export class SpinalForgeViewer {

  public currentSceneId: string;
  public initialized: Promise<boolean>;
  public scenes: { sceneId: string, modelIds: number[] }[];
  public bimObjectService: BimObjectService = new BimObjectService();
  public viewerManager: any;
  private overlayName = "spinal-material-overlay"
  private option: SceneOptionsGet = null;

  initialize(viewerManager): Promise<boolean> {
    if (typeof this.initialized === "undefined")
      this.initialized = new Promise(resolve => {
        this.viewerManager = viewerManager;
        this.viewerManager.viewer.addEventListener(
          Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
          (event) => {
            if (typeof event.selections !== "undefined" && event.selections.length > 0) {
              this.viewerManager.setCurrentModel(event.selections[0].model);
              this.bimObjectService.setCurrentModel(event.selections[0].model);
            }
          });
        resolve(true);
      });

    return this.initialized;
  }

  isInitialize(): boolean {
    return typeof this.initialized !== "undefined";
  }

  waitForInitialization() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (typeof this.initialized !== "undefined") {
          clearInterval(interval);
          this.initialized.then(() => resolve(true))
        }
      }, 200)
    })
  }

  getScene(modelId: number): { sceneId: string; modelIds: number[]; }[] {
    return this.scenes.filter((scene) => {
      return scene.modelIds.indexOf(modelId) !== -1
    })
  };

  async getSVFListFromBimFile(bimFileId: string): Promise<{ path: string, name: string, thumbnail: string }[]> {
    const bimFileRNode = SpinalGraphService.getRealNode(bimFileId);
    const elem1 = await loadModelPtr(bimFileRNode.element.ptr)
    const elem = await loadModelPtr(elem1.currentVersion)
    const res = []
    if (elem.hasOwnProperty('items')) {
      for (let i = 0; i < elem.items.length; i++) {
        if (elem.items[i].path.get().indexOf('svf') !== -1) {
          const thumbnail = elem.items[i].thumbnail ? elem.items[i].thumbnail.get() : elem.items[i].path.get() + '.png'
          res.push({
            path: elem.items[i].path.get(),
            name: elem.items[i].name.get(),
            thumbnail
          });
        }
      }
    }
    return res
  }
  getBimFileDefautPath(bimFileId: string) {
    const bimFileRNode = SpinalGraphService.getRealNode(bimFileId);
    if (bimFileRNode && bimFileRNode.info.defaultItem) {
      return bimFileRNode.info.defaultItem.get()
    }
  }
  setBimFileDefautPath(bimFileId: string, path) {
    const bimFileRNode = SpinalGraphService.getRealNode(bimFileId);
    if (bimFileRNode) {
      if (bimFileRNode.info.defaultItem) {
        return bimFileRNode.info.defaultItem.set(path)
      } else {
        return bimFileRNode.info.add_attr("defaultItem", path)
      }
    }
  }


  async getSVF(element: SpinalNodePointer<any>, nodeId: string, name: string): Promise<{
    version: any; path: string; id: string; name: string; thumbnail: any;
  }> {
    const elem1 = await loadModelPtr(element.ptr)
    const elem = await loadModelPtr(elem1.currentVersion)
    if (elem.hasOwnProperty('items')) {
      // 1ere passe pour default path
      const bimFileRNode = SpinalGraphService.getRealNode(nodeId);
      if (bimFileRNode && bimFileRNode.info.defaultItem) {
        const defaultPath = bimFileRNode.info.defaultItem.get()
        for (let i = 0; i < elem.items.length; i++) {
          if (elem.items[i].path.get().indexOf('svf') !== -1 && defaultPath === elem.items[i].path.get()) {
            const thumbnail = elem.items[i].thumbnail ? elem.items[i].thumbnail.get() :
              elem.items[i].path.get() + '.png'
            return {
              version: elem.versionId,
              path: elem.items[i].path.get(),
              id: nodeId,
              name,
              thumbnail
            };
          }
        }
      }

      for (let i = 0; i < elem.items.length; i++) {
        if (elem.items[i].path.get().indexOf('svf') !== -1) {
          const thumbnail = elem.items[i].thumbnail ? elem.items[i].thumbnail.get() :
            elem.items[i].path.get() + '.png'
          return {
            version: elem.versionId,
            path: elem.items[i].path.get(),
            id: nodeId,
            name,
            thumbnail
          };
        }
      }
    }
    return undefined;
  }

  async loadBimFile(bimFile: BimFileNodeRef, scene: SceneNodeRef, options: SceneOptions[] = []): Promise<{
    bimFileId: string; model: Model;
  }> {
    // let option: SceneOptionsGet;
    const svfVersionFile = await this.getSVF(bimFile.element, bimFile.id.get(), bimFile.name.get())
    if (!this.option)
      for (let i = 0; i < options.length; i++) {
        if (options[i].urn.get().includes(svfVersionFile.path)) {
          this.option = options[i].get();
          break;
        }
      }
    if (this.option === null)
      this.option = {};
    else if (this.option.hasOwnProperty('dbIds') && this.option.dbIds.length > 0)
      this.option = { ids: this.option.dbIds };
    const path = this.getNormalisePath(svfVersionFile.path)
    if (this.option.hasOwnProperty('loadOption') &&
      this.option.loadOption.hasOwnProperty('globalOffset')) {
      this.option['globalOffset'] = this.option.loadOption.globalOffset
    }
    const model: Model = await this.viewerManager.loadModel(path, this.option)
    this.bimObjectService.addModel(bimFile.id.get(), model, svfVersionFile.version,
      scene, bimFile.name.get());
    return { bimFileId: bimFile.id.get(), model }
  }

  async loadModelFromNode(nodeId: string): Promise<{
    bimFileId: string; model: Model;
  }[]> {
    try {
      const node = await SpinalGraphService.getNodeAsync(nodeId);
      if (node.type.get() === SCENE_TYPE) {
        const scene = <SceneNodeRef>node;
        const children = await SceneHelper.getBimFilesFromScene(nodeId)
        const option = typeof node.options !== "undefined" ? node.options : [];
        const promises = children.map(child => this.loadBimFile(child, scene, option))
        return Promise.all(promises);
      }
      const scenes: SceneNodeRef[] = await SceneHelper.getSceneFromNode(nodeId)
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
    if (!/https?:\/\//.test(path))
      res = window.location.origin + path;
    return res;
  }

  /**
   * return the model associated to the bimfile
   * @param bimFileId
   * @param dbId
   */
  getModel(bimObject: BimObjectRef): Model {
    return this.bimObjectService.getModel(bimObject.dbid.get(), bimObject.bimFileId.get());
  }

  async loadModelFromBimFile(bimFile: BimFileNodeRef): Promise<{ model: Model }> {
    const svfVersionFile = await this.getSVF(bimFile.element, bimFile.id.get(), bimFile.name.get())
    const path = this.getNormalisePath(svfVersionFile.path)
    const model = await this.viewerManager.loadModel(path, {})
    await this.bimObjectService._addModel(bimFile.id.get(), model)
    return ({ model })
  }

  private addMaterial(color: THREE.Color) {
    // @ts-ignore
    const material = new THREE.MeshPhongMaterial({
      color: color
    });

    this.viewerManager.viewer.impl.createOverlayScene(this.overlayName, material, material);
    return material;
  }

  setModelColorMaterial(model: Model, color: THREE.Color, ids: number[]): void {
    var material = this.addMaterial(color);
    for (var i = 0; i < ids.length; i++) {
      var dbid = ids[i];
      //from dbid to node, to fragid
      var it = model.getData().instanceTree;
      it.enumNodeFragments(dbid, (function (fragId) {
        var renderProxy = this.viewerManager.viewer.impl.getRenderProxy(model, fragId);
        // @ts-ignore
        renderProxy.meshProxy = new THREE.Mesh(renderProxy.geometry, material);
        renderProxy.meshProxy.matrix.copy(renderProxy.matrixWorld);
        renderProxy.meshProxy.matrixWorldNeedsUpdate = true;
        renderProxy.meshProxy.matrixAutoUpdate = false;
        renderProxy.meshProxy.frustumCulled = false;
        this.viewerManager.viewer.impl.addOverlay(this.overlayName, renderProxy.meshProxy);
        this.viewerManager.viewer.impl.invalidate(true);
      }).bind(this), false);
    }
  }

  setColorMaterial(aggregateSelection: { model: Model, selection: number[] }[], color: THREE.Color): void {
    for (let i = 0; i < aggregateSelection.length; i++) {
      const model = aggregateSelection[i].model;
      const ids = aggregateSelection[i].selection;
      this.setModelColorMaterial(model, color, ids)
    }
  }

  restoreColorMaterial(aggregateSelection: { model: Model, selection: number[] }[]): void {
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

      it.enumNodeFragments(dbid, function (fragId) {
        var renderProxy = this.viewerManager.viewer.impl.getRenderProxy(model, fragId);
        if (renderProxy.meshProxy) {
          //remove all overlays with same name
          this.viewerManager.viewer.impl.clearOverlay(this.overlayName);
          //viewer.impl.removeOverlay(overlayName, renderProxy.meshProxy);
          delete renderProxy.meshProxy;
          //refresh the scene
          this.viewerManager.viewer.impl.invalidate(true);
        }
      }, true);
    }
  }
}
