import { SpinalForgeViewer } from "./SpinalForgeViewer"


if (typeof window.spinal === "undefined")
  window.spinal = {};

if (typeof window.spinal.SpinalForgeViewer === "undefined"){
  window.spinal.SpinalForgeViewer = new SpinalForgeViewer();
  window.spinal.BimObjectService = window.spinal.SpinalForgeViewer.bimObjectService;
}



export {SpinalForgeViewer};
