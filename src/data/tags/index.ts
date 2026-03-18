export * from "./types";
export { modTags } from "./modTags";
export { mapTags } from "./mapTags";
export { datapackTags } from "./datapackTags";
export { modpackTags } from "./modpackTags";
export { textureTags, shaderTags, buildingTags, audioTags } from "./auxiliaryTags";
export { contentCommonMeta, auxiliaryCommonMeta } from "./commonMeta";

import { modTags } from "./modTags";
import { mapTags } from "./mapTags";
import { datapackTags } from "./datapackTags";
import { modpackTags } from "./modpackTags";
import { textureTags, shaderTags, buildingTags, audioTags } from "./auxiliaryTags";
import { ResourceTagSystem } from "./types";

// 按资源ID查找标签系统
export const tagSystemMap: Record<string, ResourceTagSystem> = {
  mod: modTags,
  map: mapTags,
  datapack: datapackTags,
  modpack: modpackTags,
  resourcepack: textureTags,
  shader: shaderTags,
  building: buildingTags,
  audio: audioTags,
};
