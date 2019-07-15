import { SpinalForgeViewer } from "./SpinalForgeViewer"


// @ts-ignore
if (typeof window.spinal === "undefined")
  {
    // @ts-ignore
    window.spinal = {};
  }

// @ts-ignore
if (typeof window.spinal.SpinalForgeViewer === "undefined"){
  // @ts-ignore
  window.spinal.SpinalForgeViewer = new SpinalForgeViewer();
  // @ts-ignore
  window.spinal.BimObjectService = window.spinal.SpinalForgeViewer.bimObjectService;
}



export {SpinalForgeViewer};
