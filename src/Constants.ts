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


import {
  SPINAL_RELATION_PTR_LST_TYPE
} from "spinal-env-viewer-graph-service";

import {
  EQUIPMENT_TYPE,
  EQUIPMENT_RELATION,
  REFERENCE_RELATION
} from 'spinal-env-viewer-context-geographic-service/build/constants.js'

export const SCENE_RELATION_NAME: string = 'hasScene';
export const SCENE_TYPE: string = "scene";
export const PART_RELATION_NAME: string = 'hasParts';

export const SCENE_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const PART_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;

export const BIM_OBJECT_TYPE: string = EQUIPMENT_TYPE;
export const BIM_CONTEXT_RELATION_NAME: string = "hasBimContext";
export const BIM_CONTEXT_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const BIM_NODE_RELATION_NAME: string = "hasBimNode";
export const BIM_OBJECT_RELATION_NAME: string = EQUIPMENT_RELATION;
export const BIM_OBJECT_VERSION_RELATION_NAME: string = "hasBimVersion";
export const REFERENCE_OBJECT_RELATION_NAME: string = REFERENCE_RELATION;

export const BIM_OBJECT_VERSION_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const BIM_NODE_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const BIM_OBJECT_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const REFERENCE_OBJECT_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;


