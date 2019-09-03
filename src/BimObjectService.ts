import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import Model = Autodesk.Viewing.Model;
import {
  BIM_CONTEXT_RELATION_NAME,
  BIM_CONTEXT_RELATION_TYPE,
  BIM_NODE_RELATION_NAME,
  BIM_NODE_RELATION_TYPE,
  BIM_OBJECT_TYPE,
  BIM_OBJECT_RELATION_NAME,
  BIM_OBJECT_RELATION_TYPE,
  REFERENCE_OBJECT_RELATION_TYPE,
  REFERENCE_OBJECT_RELATION_NAME,
} from "./Constants";


interface modelScene {
  model: Model,
  scene: any
}

export class BimObjectService {

  public mappingModelIdBimFileId: { [modelId: number]: { bimFileId: string, version: number, scene: any } } = {};
  public mappingBimFileIdModelId: { [bimFileId: string]: { modelId: number, version: number, modelScene: { model: Model, scene: any }[] } } = {};
  public mappingNameByModel: { [name: string]: Model } = {};
  public static num: number = 0;
  private currentModel: Model;

  setCurrentModel(model: Model) {
    this.currentModel = model;
  }

  /**
   * Return the node where to attach BIMObject
   * @param bimFileId {String} id of the BIMFile
   */
  getBimFileContext(bimFileId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      SpinalGraphService
        .getChildren(bimFileId, [BIM_CONTEXT_RELATION_NAME])
        .then(children => {
          if (children.length > 0)
            resolve(children[0]);
          else
            resolve(undefined);
        })
        .catch(reject);
    })
  }

  createBIMFileContext(bimFileId: string) {
    return new Promise(resolve => {
      const contextId = SpinalGraphService.createNode({name: "BIMContext"}, undefined);
      SpinalGraphService
        .addChild(bimFileId, contextId, BIM_CONTEXT_RELATION_NAME, BIM_CONTEXT_RELATION_TYPE)
        .then(resolve)
    })
  }


  /**
   * create a BIMObject for the corresponding dbid and model
   * @param dbid {number}
   * @param model {Model}
   * @param name {string} name of the bimObject
   * @returns {boolean} true if the BIMObject has been created false otherwise
   */
  createBIMObject(dbid: number, name: string, model: Model = this.currentModel): any {
    return new Promise(async (resolve, reject) => {
      try {
        const bimObject = await this.getBIMObject(dbid, model);
        //BIMObject already exist
        if (typeof bimObject !== "undefined")
          return resolve(bimObject);


        const externalId = await BimObjectService.getExternalId(dbid, model);
        // @ts-ignore
        const modelMeta = this.mappingModelIdBimFileId[model.id];
        const bimId = SpinalGraphService.createNode({
          type: BIM_OBJECT_TYPE,
          bimFileId: modelMeta.bimFileId,
          version: modelMeta.version,
          externalId,
          dbid,
          name,

        }, undefined);

        // @ts-ignore
        this.getBimFileContext(modelMeta.bimFileId)
          .then(node => {
            if (typeof node !== "undefined") {
              SpinalGraphService
                .addChild(node.id, bimId, BIM_OBJECT_RELATION_NAME, BIM_OBJECT_RELATION_TYPE)
                .then(res => {
                  resolve(SpinalGraphService.getNode(bimId));
                })
            } else {
              this.createBIMFileContext(modelMeta.bimFileId)
                .then(() => {
                  this.getBimFileContext(modelMeta.bimFileId)
                    .then(node => {
                      if (typeof node !== "undefined") {
                        SpinalGraphService
                          .addChild(node.id, bimId, BIM_OBJECT_RELATION_NAME, BIM_OBJECT_RELATION_TYPE)
                          .then(() => {
                            resolve(SpinalGraphService.getNode(bimId));
                          }).catch(console.error)
                      }
                    });
                })
            }
          })
        /*     this.getBIMObjectVersion(modelMeta.bimFileId, modelMeta.version)
              .then(node => {
                SpinalGraphService
                // @ts-ignore
                  .addChild(node.id, nodeId, BIM_OBJECT_RELATION_NAME, BIM_OBJECT_RELATION_TYPE)
                  .then(() => {
                    resolve(true);
                  })
              })
              */
      } catch (e) {
        reject(e);
      }
    })
  }


  /**
   * Return the BIMObject corresponding dbid and the model
   * @param dbId {number}
   * @param model {Model}
   */
  getBIMObject(dbId: number, model: Model = this.currentModel) {
    return new Promise(async (resolve, reject) => {
      try {
        const externalId = await BimObjectService.getExternalId(dbId, model);
        // @ts-ignore
        const modelMeta = this.mappingModelIdBimFileId[model.id];
        this.getBimFileContext(modelMeta.bimFileId)
          .then(node => {
            if (typeof node !== "undefined") {
              node = SpinalGraphService.getRealNode(node.id.get());
              node.getChildren(node.id, [BIM_OBJECT_RELATION_NAME])
                .then(children => {
                  const child = children.find((node) => {
                    return node.info.externalId.get() === externalId
                  });
                  resolve(child);
                }).catch(console.error);
            } else
              resolve(undefined);
          }).catch(console.error)
        /*  this.getBIMObjectVersion(modelMeta.bimFileId, modelMeta.version)
          .then(node => {
            // @ts-ignore
            SpinalGraphService.getChildren(node.id, [BIM_OBJECT_RELATION_NAME])
              .then(children => {
                const child = children.find((node) => {
                  return node.externalId === externalId
                });

                resolve(child);
              })
          })
          .catch((e) => {
            reject(e)
          })*/

      } catch (e) {
        console.error(e);
        reject(e);
      }
    })
  }


  /**
   * Return the external id for the given dbid
   * @param dbId {number}
   * @param model {Model}
   * @returns {string} external id for the given dbid
   */
  static getExternalId(dbId: number, model: Model) {
    return new Promise((resolve, reject) => {
      model.getProperties(dbId, (props) => {
        resolve(props.externalId);
      }, reject);
    })
  }

  /**
   * Return the dbid corresponding to the external id
   * @param externalId
   * @param bimFileId {String} id of the BIMFile
   * @returns {number} dbid of the given external id
   */
  getDbIdFromExternalId(externalId: string, bimFileId: string) {
    return new Promise((resolve, reject) => {
      const modelMeta = this.mappingBimFileIdModelId[bimFileId];
      const model = modelMeta.modelScene[0].model;
      model.getExternalIdMapping(res => {
        resolve(res[externalId]);
      }, reject);
    })
  }

  getDdIdFromExternalIdFromModel(externalId: string, model: Model) {
    return new Promise((resolve, reject) => {
      model.getExternalIdMapping(res => {
        resolve(res[externalId]);
      }, reject);
    })
  }

  getDdIdsFromExternalIds(externalIds: string[], model: Model) {
    return new Promise((resolve, reject) => {
      model.getExternalIdMapping(mapping => {
        const res = [];
        for (let i = 0; i < externalIds.length; i++) {
          res.push(mapping[externalIds[i]])
        }
        resolve(res);
      }, reject);
    })
  }

  /**
   * Add a BIMObject to a node
   * @param contextId  {string} context id where the BIMObject supposed to be
   * @param parentId {string} id of the node where the BIMObject will be add
   * @param dbId {number}
   * @param model {Model}
   * @param name {string}
   */
  addBIMObject(contextId: string, parentId: string, dbId: number, name: string, model: Model = this.currentModel) {
    return this.getBIMObject(dbId, model)
      .then(bimObject => {
        if (typeof bimObject !== "undefined") {
          const parent = SpinalGraphService.getRealNode(parentId);
          const context = SpinalGraphService.getRealNode(contextId);
          return parent.addChildInContext(bimObject, BIM_OBJECT_RELATION_NAME, BIM_NODE_RELATION_TYPE, context)
            .then(() => {
              return bimObject
            })
        }

        return this.createBIMObject(dbId, name, model)
          .then(child => {
            child = SpinalGraphService.getRealNode(child.id.get());
            const parent = SpinalGraphService.getRealNode(parentId);
            const context = SpinalGraphService.getRealNode(contextId);
            return parent.addChildInContext(child, BIM_OBJECT_RELATION_NAME, BIM_NODE_RELATION_TYPE, context)
              .then(() => {
                return child
              })
          })
      })
      .catch(console.error)
  }

  /**
   * Remove a BIMObject from a parent
   * @param parentId
   * @param bimObjectId
   */
  removeBIMObject(parentId: string, bimObjectId: string) {
    // @ts-ignore
    return SpinalGraphService.removeChild(parentId, bimObjectId, BIM_NODE_RELATION_NAME, BIM_NODE_RELATION_TYPE);
  }

  /**
   * Delete a BIMObject from graph
   * @param dbId {number}
   * @param model {Model}
   */
  deleteBImObject(dbId: number, model: Model = this.currentModel) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const modelMetaData = this.mappingModelIdBimFileId[model.id];

      this.getBIMObject(dbId, model)
        .then(bimObject => {
          // @ts-ignore
          delete this.mappingModelIdBimFileId[model.id];
          delete this.mappingBimFileIdModelId[modelMetaData.bimFileId];
          // @ts-ignore
          resolve(SpinalGraphService.removeFromGraph(bimObject.id));

        }).catch(reject)
    })
  }

  /**
   * Add a reference object to a node
   *
   * @param parentId {string}
   * @param dbId {Number}
   * @param model {Model}
   * @param name {string}
   */
  addReferenceObject(parentId: string, dbId: number, name: string, model: Model = this.currentModel) {
    return new Promise(resolve => {
      this.getBIMObject(dbId, model)
        .then(child => {
          if (typeof child === "undefined")
            return this.createBIMObject(dbId, name, model)
              .then(BIMObj => {
                SpinalGraphService.addChild(parentId, BIMObj.id.get(), REFERENCE_OBJECT_RELATION_NAME, REFERENCE_OBJECT_RELATION_TYPE)
                  .then(() => {
                    resolve(child)
                  })
              });
          else {
            // @ts-ignore
            SpinalGraphService.addChild(parentId, child.info.id.get(), REFERENCE_OBJECT_RELATION_NAME, REFERENCE_OBJECT_RELATION_TYPE)
              .then(() => {
                resolve(child)
              })
          }
        });
    });
  }

  /**
   *
   * @param parentId
   * @param dbid
   * @param model
   */
  removeReferenceObject(parentId: string, dbid: number, model: Model = this.currentModel) {
    this.getBIMObject(dbid, model)
      .then((child) => {
        // @ts-ignore
        SpinalGraphService.removeChild(parentId, child.id, REFERENCE_OBJECT_RELATION_NAME, REFERENCE_OBJECT_RELATION_TYPE);
      })

  }


  /*
  /!**
   * @param bimFileId
   * @return {Boolean} true if the version has been created false otherwise
   *!/
  createBIMObjectVersionContext(bimFileId: string) {
    return new Promise((resolve) => {
      this.getBimFileContext(bimFileId)
        .then(children => {
          if (typeof children === "undefined")
            resolve(false);

          const nodeId = SpinalGraphService.createNode({
            name: "BIMObjectContext",
            currentVersion: 0
          }, undefined);

          return SpinalGraphService
            .addChild(bimFileId, nodeId, BIM_NODE_RELATION_NAME, BIM_NODE_RELATION_TYPE)
            .then(() => {
              resolve(true);
            })
        })
    })
  }
  /!**
   * Add a version to the context
   * @param bimFileId {String} id of the BIMFile
   * @param version {number} version of the bimFile
   *!/
  createBIMObjectVersion(bimFileId: string, version: number): any {
    return new Promise((resolve, reject) => {
      this.getBimFileContext(bimFileId)
        .then(context => {
          const nodeId = SpinalGraphService.createNode({version}, undefined);
          SpinalGraphService
            .addChild(context.id, nodeId, BIM_OBJECT_VERSION_RELATION_NAME, BIM_OBJECT_VERSION_RELATION_TYPE)
            .then(res => {
              SpinalGraphService.getNodeAsync(nodeId).then(resolve);

            })
            .catch(reject);
        })
        .catch(reject);
    })

  }

  /!**
   * Return the node where is attach every node from version
   * @param bimFileId {String} id of the BIMFile
   * @param version {number} version of the bimFile
   *!/
  getBIMObjectVersion(bimFileId: string, version: number) {
    return new Promise((resolve, reject) => {
      this.getBimFileContext(bimFileId)
        .then(context => {
          console.log("10", context);
          SpinalGraphService
            .getChildren(context.id, [BIM_OBJECT_VERSION_RELATION_NAME])
            .then(children => {
              const child = children.find((node) => {
                return node.version === version
              });
              if (typeof child === "undefined")
                resolve(this.createBIMObjectVersion(bimFileId, version));
              else
                resolve(child);
            })
            .catch((e) => {
              reject(e);
            })
        })
        .catch(reject)
    });
  }
*/

  /*

    /!**
     *
     * @param bimFileId
     * @param version
     *!/
    getAllExternalIdForVersion(bimFileId: string, version: number) {
      return new Promise(resolve => {

        this.getBIMObjectVersion(bimFileId, version)
          .then(child => {
            // @ts-ignore
            SpinalGraphService
            // @ts-ignore
              .getChildren(child.id, [BIM_OBJECT_RELATION_NAME])
              .then(children => {
                resolve(children.map(children => {
                  return children.externalId
                }));
              })
          })
      })
    }

    /!**
     * @param version1
     * @param version2
     * @param bimFileId
     *!/
    getDifferenceExternalIdForVersion(version1: number, version2: number, bimFileId: string) {
      const promise = [];
      promise.push(this.getAllExternalIdForVersion(bimFileId, version1));
      promise.push(this.getAllExternalIdForVersion(bimFileId, version2));

      return Promise.all(promise).then((result: Array<Array<string>>) => {
        const union = result[0].filter((node) => {
          return typeof result[1].find(n => {
            // @ts-ignore
            return n.externalId === node.externalId
          }) !== "undefined";
        });
        const newBIMObj = result[0].filter((node) => {
          return typeof result[1].find(n => {
            // @ts-ignore
            return n.externalId === node.externalId
          }) === "undefined";
        });
        const oldBIMObj = result[1].filter((node) => {
          return typeof result[0].find(n => {
            // @ts-ignore
            return n.externalId === node.externalId
          }) !== "undefined";
        });

        return {union, newBIMObj, oldBIMObj};

      })
    }
  */


  /**
   * notify the service that a new model has been load into the viewer
   * @param bimFileId {String} id of the BIMFile
   * @param version {number} version of the bimFile
   * @param model {Model} model loaded into the viewer
   * @param scene {any} scene loaded
   */
  addModel(bimFileId: string, model: Model, version: number, scene: any, name: string) {
    // @ts-ignore
    this.mappingModelIdBimFileId[model.id] = {bimFileId, version, scene};
    this.mappingNameByModel[name] = model;
    let mapping = this.mappingBimFileIdModelId[bimFileId];
    if (typeof mapping === "undefined") {
      mapping = {
        // @ts-ignore
        modelId: model.id,
        version: version,
        modelScene: [{model, scene}]
      };
    } else
      mapping.modelScene.push({model, scene});

    this.mappingBimFileIdModelId[bimFileId] = mapping;
  }


  /**
   * Get the model corresponding to the dbid and the bimfile
   * @param dbId {number} dbId of the BIMObject
   * @param bimFileId {string} id of the BIMfile
   */
  getModel(dbId: number, bimFileId: string) {
    const mapping = this.mappingBimFileIdModelId[bimFileId];
    if (typeof mapping !== "undefined")
      for (let i = 0; i < mapping.modelScene.length; i++) {
        if (mapping.modelScene[i].scene.hasOwnProperty('options') && mapping.modelScene[i].scene['options'].dbIds.contains(dbId))
          return mapping.modelScene[i].model;
      }
    return undefined;
  }
  
  getModelByBimfile( bimFileId: string){
    const mapping = this.mappingBimFileIdModelId[bimFileId];
    //one bimFile is note supposed to be load multipe time
    if (typeof mapping !== "undefined")
     return mapping.modelScene[0].model;
    return undefined;
  }

  /**
   * Get a model corresponding to the name use with caution
   * @param name
   */
  getModelByName(name): Model {
    return this.mappingNameByModel[name];
  }

}
