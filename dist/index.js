"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpinalForgeViewer_1 = require("./SpinalForgeViewer");
exports.SpinalForgeViewer = SpinalForgeViewer_1.SpinalForgeViewer;
if (typeof window.spinal === "undefined")
    window.spinal = {};
if (typeof window.spinal.SpinalForgeViewer === "undefined") {
    window.spinal.SpinalForgeViewer = new SpinalForgeViewer_1.SpinalForgeViewer();
    window.spinal.BimObjectService = window.spinal.SpinalForgeViewer.bimObjectService;
}
