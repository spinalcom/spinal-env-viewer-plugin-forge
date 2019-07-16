> **[spinal-env-viewer-plugin-forge](README.md)**

[Globals](README.md) /

### Index

#### External modules

* ["BimObjectService"]()
* ["Constants"]()
* ["SceneHelper"]()
* ["SpinalForgeViewer"]()
* ["index"]()
* ["utils"]()

## External modules

###  "BimObjectService"

• **"BimObjectService"**:

*Defined in [BimObjectService.ts:1](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L1)*

###  BimObjectService

• **BimObjectService**:

*Defined in [BimObjectService.ts:22](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L22)*

### `Private` currentModel

• **currentModel**: *`Model`*

*Defined in [BimObjectService.ts:26](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L26)*

###  mappingBimFileIdModelId

• **mappingBimFileIdModelId**: *`object`*

*Defined in [BimObjectService.ts:25](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L25)*

#### Type declaration:

● \[▪ **bimFileId**: *&#x60;string&#x60;*\]: `object`

* **modelId**: *`number`*

* **modelScene**: *`object[]`*

* **version**: *`number`*

###  mappingModelIdBimFileId

• **mappingModelIdBimFileId**: *`object`*

*Defined in [BimObjectService.ts:24](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L24)*

#### Type declaration:

● \[▪ **modelId**: *&#x60;number&#x60;*\]: `object`

* **bimFileId**: *`string`*

* **scene**: *`any`*

* **version**: *`number`*

###  addBIMObject

▸ **addBIMObject**(`contextId`: `string`, `parentId`: `string`, `dbId`: `number`, `model`: `Model`, `name`: `string`): *`Promise<any>`*

*Defined in [BimObjectService.ts:202](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L202)*

Add a BIMObject to a node

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`contextId` | `string` | - | context id where the BIMObject supposed to be |
`parentId` | `string` | - | id of the node where the BIMObject will be add |
`dbId` | `number` | - | - |
`model` | `Model` |  this.currentModel | - |
`name` | `string` | - |   |

**Returns:** *`Promise<any>`*

###  addModel

▸ **addModel**(`bimFileId`: `string`, `model`: `Model`, `version`: `number`, `scene`: `any`): *`void`*

*Defined in [BimObjectService.ts:436](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L436)*

notify the service that a new model has been load into the viewer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bimFileId` | `string` | id of the BIMFile |
`model` | `Model` | model loaded into the viewer |
`version` | `number` | version of the bimFile |
`scene` | `any` | scene loaded  |

**Returns:** *`void`*

###  addReferenceObject

▸ **addReferenceObject**(`parentId`: `string`, `dbId`: `number`, `model`: `Model`, `name`: `string`): *`void`*

*Defined in [BimObjectService.ts:265](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L265)*

Add a reference object to a node

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`parentId` | `string` | - | - |
`dbId` | `number` | - | - |
`model` | `Model` |  this.currentModel | - |
`name` | `string` | - |   |

**Returns:** *`void`*

###  createBIMFileContext

▸ **createBIMFileContext**(`bimFileId`: `string`): *`Promise<Object>`*

*Defined in [BimObjectService.ts:51](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`bimFileId` | `string` |

**Returns:** *`Promise<Object>`*

###  createBIMObject

▸ **createBIMObject**(`dbid`: `number`, `name`: `string`, `model`: `Model`): *`Promise<Object>`*

*Defined in [BimObjectService.ts:114](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L114)*

create a BIMObject for the corresponding dbid and model

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`dbid` | `number` | - | - |
`name` | `string` | - | name of the bimObject |
`model` | `Model` |  this.currentModel | - |

**Returns:** *`Promise<Object>`*

true if the BIMObject has been created false otherwise

###  deleteBImObject

▸ **deleteBImObject**(`dbId`: `number`, `model`: `Model`): *`Promise<Object>`*

*Defined in [BimObjectService.ts:240](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L240)*

Delete a BIMObject from graph

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`dbId` | `number` | - | - |
`model` | `Model` |  this.currentModel |   |

**Returns:** *`Promise<Object>`*

###  getBIMObject

▸ **getBIMObject**(`dbId`: `number`, `model`: `Model`): *`Promise<Object>`*

*Defined in [BimObjectService.ts:66](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L66)*

Return the BIMObject corresponding dbid and the model

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`dbId` | `number` | - | - |
`model` | `Model` |  this.currentModel |   |

**Returns:** *`Promise<Object>`*

###  getBimFileContext

▸ **getBimFileContext**(`bimFileId`: `string`): *`Promise<any>`*

*Defined in [BimObjectService.ts:37](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L37)*

Return the node where to attach BIMObject

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bimFileId` | `string` | id of the BIMFile  |

**Returns:** *`Promise<any>`*

###  getDbIdFromExternalId

▸ **getDbIdFromExternalId**(`externalId`: `string`, `bimFileId`: `string`): *`Promise<Object>`*

*Defined in [BimObjectService.ts:184](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L184)*

Return the dbid corresponding to the external id

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`externalId` | `string` | - |
`bimFileId` | `string` | id of the BIMFile |

**Returns:** *`Promise<Object>`*

dbid of the given external id

###  getModel

▸ **getModel**(`dbId`: `number`, `bimFileId`: `string`): *`Model`*

*Defined in [BimObjectService.ts:462](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L462)*

Get the model corresponding to the dbid and the bimfile

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbId` | `number` | dbId of the BIMObject |
`bimFileId` | `string` | id of the BIMfile  |

**Returns:** *`Model`*

###  removeBIMObject

▸ **removeBIMObject**(`parentId`: `string`, `bimObjectId`: `string`): *`Promise<boolean>`*

*Defined in [BimObjectService.ts:230](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L230)*

Remove a BIMObject from a parent

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parentId` | `string` | - |
`bimObjectId` | `string` |   |

**Returns:** *`Promise<boolean>`*

###  removeReferenceObject

▸ **removeReferenceObject**(`parentId`: `string`, `dbid`: `number`, `model`: `Model`): *`void`*

*Defined in [BimObjectService.ts:279](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L279)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`parentId` | `string` | - | - |
`dbid` | `number` | - | - |
`model` | `Model` |  this.currentModel |   |

**Returns:** *`void`*

###  setCurrentModel

▸ **setCurrentModel**(`model`: `Model`): *`void`*

*Defined in [BimObjectService.ts:28](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`model` | `Model` |

**Returns:** *`void`*

### `Static` getExternalId

▸ **getExternalId**(`dbId`: `number`, `model`: `Model`): *`Promise<Object>`*

*Defined in [BimObjectService.ts:170](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L170)*

Return the external id for the given dbid

**Parameters:**

Name | Type |
------ | ------ |
`dbId` | `number` |
`model` | `Model` |

**Returns:** *`Promise<Object>`*

external id for the given dbid

###  modelScene

• **modelScene**:

*Defined in [BimObjectService.ts:17](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L17)*

###  model

• **model**: *`Model`*

*Defined in [BimObjectService.ts:18](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L18)*

###  scene

• **scene**: *`any`*

*Defined in [BimObjectService.ts:19](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/BimObjectService.ts#L19)*

___

###  "Constants"

• **"Constants"**:

*Defined in [Constants.ts:1](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L1)*

### `Const` BIM_CONTEXT_RELATION_NAME

• **BIM_CONTEXT_RELATION_NAME**: *`string`* = "hasBimContext"

*Defined in [Constants.ts:11](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L11)*

### `Const` BIM_CONTEXT_RELATION_TYPE

• **BIM_CONTEXT_RELATION_TYPE**: *`string`* =  SPINAL_RELATION_LST_PTR_TYPE

*Defined in [Constants.ts:12](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L12)*

### `Const` BIM_NODE_RELATION_NAME

• **BIM_NODE_RELATION_NAME**: *`string`* = "hasBimNode"

*Defined in [Constants.ts:13](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L13)*

### `Const` BIM_NODE_RELATION_TYPE

• **BIM_NODE_RELATION_TYPE**: *`string`* =  SPINAL_RELATION_LST_PTR_TYPE

*Defined in [Constants.ts:19](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L19)*

### `Const` BIM_OBJECT_RELATION_NAME

• **BIM_OBJECT_RELATION_NAME**: *`string`* = "hasBimObject"

*Defined in [Constants.ts:14](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L14)*

### `Const` BIM_OBJECT_RELATION_TYPE

• **BIM_OBJECT_RELATION_TYPE**: *`string`* =  SPINAL_RELATION_LST_PTR_TYPE

*Defined in [Constants.ts:20](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L20)*

### `Const` BIM_OBJECT_TYPE

• **BIM_OBJECT_TYPE**: *`string`* = "BIMObject"

*Defined in [Constants.ts:10](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L10)*

### `Const` BIM_OBJECT_VERSION_RELATION_NAME

• **BIM_OBJECT_VERSION_RELATION_NAME**: *`string`* = "hasBimVersion"

*Defined in [Constants.ts:15](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L15)*

### `Const` BIM_OBJECT_VERSION_RELATION_TYPE

• **BIM_OBJECT_VERSION_RELATION_TYPE**: *`string`* =  SPINAL_RELATION_LST_PTR_TYPE

*Defined in [Constants.ts:18](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L18)*

### `Const` PART_RELATION_NAME

• **PART_RELATION_NAME**: *`string`* = "hasParts"

*Defined in [Constants.ts:5](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L5)*

### `Const` PART_RELATION_TYPE

• **PART_RELATION_TYPE**: *`string`* =  SPINAL_RELATION_LST_PTR_TYPE

*Defined in [Constants.ts:8](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L8)*

### `Const` REFERENCE_OBJECT_RELATION_NAME

• **REFERENCE_OBJECT_RELATION_NAME**: *`string`* = "hasReferenceObject"

*Defined in [Constants.ts:16](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L16)*

### `Const` REFERENCE_OBJECT_RELATION_TYPE

• **REFERENCE_OBJECT_RELATION_TYPE**: *`string`* =  SPINAL_RELATION_LST_PTR_TYPE

*Defined in [Constants.ts:21](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L21)*

### `Const` SCENE_RELATION_NAME

• **SCENE_RELATION_NAME**: *`string`* = "hasScene"

*Defined in [Constants.ts:3](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L3)*

### `Const` SCENE_RELATION_TYPE

• **SCENE_RELATION_TYPE**: *`string`* =  SPINAL_RELATION_LST_PTR_TYPE

*Defined in [Constants.ts:7](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L7)*

### `Const` SCENE_TYPE

• **SCENE_TYPE**: *`string`* = "scene"

*Defined in [Constants.ts:4](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/Constants.ts#L4)*

___

###  "SceneHelper"

• **"SceneHelper"**:

*Defined in [SceneHelper.ts:1](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L1)*

###  SceneHelper

• **SceneHelper**:

*Defined in [SceneHelper.ts:21](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L21)*

### `Static` `Private` context

▪ **context**: *`SpinalContext`*

*Defined in [SceneHelper.ts:23](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L23)*

### `Static` `Private` contextId

▪ **contextId**: *`string`*

*Defined in [SceneHelper.ts:26](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L26)*

### `Static` `Private` contextName

▪ **contextName**: *`string`* = "Scenes"

*Defined in [SceneHelper.ts:24](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L24)*

### `Static` `Private` initialized

▪ **initialized**: *`Promise<boolean>`*

*Defined in [SceneHelper.ts:22](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L22)*

### `Static` `Private` type

▪ **type**: *`string`* = "SpinalService"

*Defined in [SceneHelper.ts:25](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L25)*

### `Static` addModelToScene

▸ **addModelToScene**(`sceneId`: `string`, `bimFileId`: `string`): *`Promise<SpinalNode>`*

*Defined in [SceneHelper.ts:63](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`sceneId` | `string` |
`bimFileId` | `string` |

**Returns:** *`Promise<SpinalNode>`*

### `Static` addSceneToNode

▸ **addSceneToNode**(`nodeId`: `string`, `sceneId`: `string`): *`Promise<any>`*

*Defined in [SceneHelper.ts:84](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | `string` |
`sceneId` | `string` |

**Returns:** *`Promise<any>`*

### `Static` createScene

▸ **createScene**(`name`: `string`, `description`: `string`, `autoLoad`: `true`): *`Promise<SpinalNode>`*

*Defined in [SceneHelper.ts:50](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | `string` |
`description` | `string` |
`autoLoad` | `true` |

**Returns:** *`Promise<SpinalNode>`*

### `Static` getBimFilesFromScene

▸ **getBimFilesFromScene**(`sceneId`: `string`): *`any`*

*Defined in [SceneHelper.ts:70](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`sceneId` | `string` |

**Returns:** *`any`*

### `Static` getSceneFromNode

▸ **getSceneFromNode**(`nodeId`: `string`): *`Promise<any>`*

*Defined in [SceneHelper.ts:77](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | `string` |

**Returns:** *`Promise<any>`*

### `Static` `Private` initialize

▸ **initialize**(): *`Promise<boolean>`*

*Defined in [SceneHelper.ts:28](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L28)*

**Returns:** *`Promise<boolean>`*

###  Scene

• **Scene**:

*Defined in [SceneHelper.ts:12](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L12)*

###  autoLoad

• **autoLoad**: *`boolean`*

*Defined in [SceneHelper.ts:16](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L16)*

### `Optional` description

• **description**? : *`string`*

*Defined in [SceneHelper.ts:15](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L15)*

### `Optional` id

• **id**? : *`string`*

*Defined in [SceneHelper.ts:13](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L13)*

###  name

• **name**: *`string`*

*Defined in [SceneHelper.ts:14](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L14)*

###  type

• **type**: *`string`*

*Defined in [SceneHelper.ts:17](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SceneHelper.ts#L17)*

___

###  "SpinalForgeViewer"

• **"SpinalForgeViewer"**:

*Defined in [SpinalForgeViewer.ts:1](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L1)*

###  SpinalForgeViewer

• **SpinalForgeViewer**:

*Defined in [SpinalForgeViewer.ts:9](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L9)*

###  bimObjectService

• **bimObjectService**: *`BimObjectService`* =  new BimObjectService()

*Defined in [SpinalForgeViewer.ts:14](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L14)*

###  currentSceneId

• **currentSceneId**: *`string`*

*Defined in [SpinalForgeViewer.ts:11](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L11)*

###  initialized

• **initialized**: *`Promise<boolean>`*

*Defined in [SpinalForgeViewer.ts:12](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L12)*

###  scenes

• **scenes**: *`object[]`*

*Defined in [SpinalForgeViewer.ts:13](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L13)*

###  viewerManager

• **viewerManager**: *`any`*

*Defined in [SpinalForgeViewer.ts:15](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L15)*

###  getModel

▸ **getModel**(`bimObject`: `any`): *`Model`*

*Defined in [SpinalForgeViewer.ts:144](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L144)*

return the model associated to the bimfile

**Parameters:**

Name | Type |
------ | ------ |
`bimObject` | `any` |

**Returns:** *`Model`*

###  getSVF

▸ **getSVF**(`element`: `any`, `nodeId`: `string`, `name`: `string`): *`Promise<object>`*

*Defined in [SpinalForgeViewer.ts:59](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`element` | `any` |
`nodeId` | `string` |
`name` | `string` |

**Returns:** *`Promise<object>`*

###  getScene

▸ **getScene**(`modelId`: `number`): *`object[]`*

*Defined in [SpinalForgeViewer.ts:53](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`modelId` | `number` |

**Returns:** *`object[]`*

###  initialize

▸ **initialize**(`viewerManager`: `any`): *`Promise<boolean>`*

*Defined in [SpinalForgeViewer.ts:17](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`viewerManager` | `any` |

**Returns:** *`Promise<boolean>`*

###  isInitialize

▸ **isInitialize**(): *`boolean`*

*Defined in [SpinalForgeViewer.ts:38](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L38)*

**Returns:** *`boolean`*

###  loadBimFile

▸ **loadBimFile**(`bimfIle`: `any`, `scene`: `any`, `options`: `any`): *`Promise<Object>`*

*Defined in [SpinalForgeViewer.ts:82](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L82)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`bimfIle` | `any` | - |
`scene` | `any` | - |
`options` | `any` |  [] |

**Returns:** *`Promise<Object>`*

###  loadModelFromNode

▸ **loadModelFromNode**(`nodeId`: `string`): *`Promise<any[]>`*

*Defined in [SpinalForgeViewer.ts:111](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L111)*

**Parameters:**

Name | Type |
------ | ------ |
`nodeId` | `string` |

**Returns:** *`Promise<any[]>`*

###  waitForInitialization

▸ **waitForInitialization**(): *`Promise<Object>`*

*Defined in [SpinalForgeViewer.ts:42](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/SpinalForgeViewer.ts#L42)*

**Returns:** *`Promise<Object>`*

___

###  "index"

• **"index"**:

*Defined in [index.ts:1](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/index.ts#L1)*

___

###  "utils"

• **"utils"**:

*Defined in [utils.ts:1](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/utils.ts#L1)*

### `Const` mapModelDictionary

• **mapModelDictionary**: *`Map<any, any>`* =  new Map()

*Defined in [utils.ts:7](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/utils.ts#L7)*

###  loadModelPtr

▸ **loadModelPtr**(`model`: `Model`): *`Promise<any>`*

*Defined in [utils.ts:9](https://github.com/spinalcom/spinal-env-viewer-plugin-forge/blob/5ba5b2f/src/utils.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`model` | `Model` |

**Returns:** *`Promise<any>`*