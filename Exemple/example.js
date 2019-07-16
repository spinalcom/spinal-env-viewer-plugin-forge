
//get the bimobject for the dbid 4084 of the last selected model
const bimobject = window.spinal.BimObjectService.getBIMObject(4084);

const model = window.spinal.BimObjectService.getModel(bimobject.dbId, bimobject.bimFileId);

//color the dbid in gray
window.spinal.ForgeViewer.viewerManager.setThemingColor(4084, new THREE.Vector4(42,42,42, 1), model, false);
