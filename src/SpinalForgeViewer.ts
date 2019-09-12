import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { BimObjectService } from "./BimObjectService";
import { SCENE_TYPE } from "./Constants";

import { loadModelPtr } from "./utils";
import { SceneHelper } from "./SceneHelper";
import { type } from "os";

export class SpinalForgeViewer {

  public currentSceneId: string;
  public initialized: Promise<boolean>;
  public scenes: { sceneId: string, modelIds: number[] }[];
  public bimObjectService: BimObjectService = new BimObjectService();
  public viewerManager: any;

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
        console.log(node);
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
    return this.bimObjectService.getModel(bimObject.dbId, bimObject.bimFileId);
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
}