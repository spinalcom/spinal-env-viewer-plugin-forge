"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpinalForgeViewer_1 = require("./SpinalForgeViewer");
exports.SpinalForgeViewer = SpinalForgeViewer_1.SpinalForgeViewer;
// @ts-ignore
if (typeof window.spinal === "undefined") {
    // @ts-ignore
    window.spinal = {};
}
// @ts-ignore
if (typeof window.spinal.SpinalForgeViewer === "undefined") {
    // @ts-ignore
    window.spinal.SpinalForgeViewer = new SpinalForgeViewer_1.SpinalForgeViewer();
    // @ts-ignore
    window.spinal.BimObjectService = window.spinal.SpinalForgeViewer.bimObjectService;
}
