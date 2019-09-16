import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { BimObjectService } from "./BimObjectService";
import { SCENE_TYPE } from "./Constants";

import { loadModelPtr } from "./utils";
import { SceneHelper } from "./SceneHelper";

export class SpinalForgeViewer {

  public currentSceneId: string;
  public initialized: Promise<boolean>;
  public scenes: { sceneId: string, modelIds: number[] }[];
  public bimObjectService: BimObjectService = new BimObjectService();
  public viewerManager: any;
  private overlayName = "spinal-material-overlay"

  initialize(viewerManager) {
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

  isInitialize() {
    return typeof this.initialized !== "undefined";
  }

  waitForInitialization() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (typeof this.initialized !== "undefined") {
          clearInterval(interval);
          resolve(true);
        }
      }, 200)
    })
  }

  getScene(modelId: number) {
    return this.scenes.filter((scene) => {
      return scene.modelIds.indexOf(modelId) !== -1
    })
  };

  getSVF(element: any, nodeId: string, name: string) {
    return loadModelPtr(element.ptr)
      .then(elem => {
          return loadModelPtr(elem.currentVersion)
        }
      )
      .then(elem => {
          if (elem.hasOwnProperty('items'))
            for (let i = 0; i < elem.items.length; i++)
              if (elem.items[i].path.get().indexOf('svf') !== -1) {
                return {
                  version: elem.versionId,
                  path: elem.items[i].path.get(),
                  id: nodeId,
                  name,
                  thumbnail: elem.items[i].thumbnail ? elem.items[i].thumbnail.get() : elem.items[i].path.get() + '.png'
                };
              }
          return undefined;
        }
      );
  }

  loadBimFile(bimfIle: any, scene: any, options: any = []) {
    return new Promise(resolve => {
      this.getSVF(bimfIle.element, bimfIle.id, bimfIle.name)
        .then((svfVersionFile) => {
          let option;
          for (let i = 0; i < options.length; i++) {
            if (options[i].urn.get().includes(svfVersionFile.path) !== -1) {
              option = options[i].get();
              break;
            }
          }

          if (typeof option === "undefined")
            option = {};
          else if ( option.hasOwnProperty('dbIds') && option.dbIds.get().length > 0)
            option = {ids: option.dbIds.get()};

          const path = window.location.origin + svfVersionFile.path;

          if (option.hasOwnProperty('loadOption') && option.loadOption.hasOwnProperty('globalOffset')) {
            option['globalOffset'] = option.loadOption.globalOffset
          }

          this.viewerManager.loadModel(path, option)
            .then(model => {
              this.bimObjectService
                .addModel(bimfIle.id, model, svfVersionFile.version, scene, bimfIle.name);
              resolve({bimFileId: bimfIle.id, model})
            })
        })
    })
  }

  async loadModelFromNode(nodeId: string): Promise<any[]> {

    try {
      const node = await SpinalGraphService.getNodeAsync(nodeId);

      if (node.type.get() === SCENE_TYPE) {
        return SceneHelper.getBimFilesFromScene(nodeId)
          .then((children: any) => {
            const promises = [];
            const option = typeof node.options !== "undefined" ? node.options : [];
            for (let i = 0; i < children.length; i++) {
              promises.push(this.loadBimFile(children[i], node, option));
            }
            return Promise.all(promises);

          });
      } else
        return SceneHelper.getSceneFromNode(nodeId)
          .then((scene: { id: string }) => {
            if (typeof scene !== "undefined")
              return this.loadModelFromNode(scene.id)
          })
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * return the model associated to the bimfile
   * @param bimFileId
   * @param dbId
   */
  getModel(bimObject: any ) {
    return this.bimObjectService.getModel(bimObject.dbid.get(), bimObject.bimFileId.get());
  }

  loadModelFromBimFile(bimFile: any){
    return new Promise(resolve => {
      this.getSVF(bimFile.element, bimFile.id, bimFile.name)
        .then((svfVersionFile) => {
          const path = window.location.origin + svfVersionFile.path;
          this.viewerManager.loadModel(path, {})
            .then(model => {
              this.bimObjectService._addModel(bimFile.id.get(), model)
              resolve({model})
            })
        })
    })
  }

  private addMaterial(color) {
    // @ts-ignore
    const material = new THREE.MeshPhongMaterial({
      color: color
    });

    this.viewerManager.viewer.impl.createOverlayScene(this.overlayName, material, material);
    return material;
  }

  // @ts-ignore
  setModelColorMaterial(model: any, color: THREE.Color, ids: number[]){
    var material = this.addMaterial(color);

    for (var i=0; i<ids.length; i++) {

      var dbid = ids[i];

      //from dbid to node, to fragid
      var it = this.viewerManager.viewer.model.getData().instanceTree;

      it.enumNodeFragments(dbid,  (function(fragId){


        var renderProxy = this.viewerManager.viewer.impl.getRenderProxy(model, fragId);
        // @ts-ignore
        renderProxy.meshProxy = new THREE.Mesh(renderProxy.geometry, renderProxy.material);

        renderProxy.meshProxy.matrix.copy(renderProxy.matrixWorld);
        renderProxy.meshProxy.matrixWorldNeedsUpdate = true;
        renderProxy.meshProxy.matrixAutoUpdate = false;
        renderProxy.meshProxy.frustumCulled = false;

        this.viewerManager.viewer.impl.addOverlay(this.overlayName, renderProxy.meshProxy);
        this.viewerManager.viewer.impl.invalidate(true);

      }).bind(this), false);
    }

  }

  setColorMaterial(aggregateSelection: {model: any, selection: number[]}[], color: any) {
    for (let i = 0; i < aggregateSelection.length; i++) {
      const model = aggregateSelection[i].model;
      const ids = aggregateSelection[i].selection;
      this.setModelColorMaterial(model , color, ids)
    }
  }

  restoreColorMaterial(aggregateSelection: {model: any, selection: number[]}[]){
    for (let i = 0; i < aggregateSelection.length; i++) {
      const model = aggregateSelection[1].model;
      const ids = aggregateSelection[1].selection;
      this.restoreModelColorMaterial(model, ids);
    }
  }

  restoreModelColorMaterial(model, ids){
    for (var i=0; i< ids.length; i++) {

      var dbid = ids[i];


      //from dbid to node, to fragid
      var it = model.getData().instanceTree;

      it.enumNodeFragments(dbid, function (fragId) {


        var renderProxy = this.viewerManager.viewer.impl.getRenderProxy(model, fragId);

        if(renderProxy.meshProxy){

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