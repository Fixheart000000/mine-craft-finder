export * from "./types";
export { modTags } from "./modTags";
export { mapTags } from "./mapTags";
export { datapackTags } from "./datapackTags";
export { modpackTags } from "./modpackTags";
export { serverTags } from "./serverTags";
export { textureTags, shaderTags, buildingTags, audioTags } from "./auxiliaryTags";
export { contentCommonMeta, auxiliaryCommonMeta, modpackServerCommonMeta, ecoDocCommonMeta, imageCommonMeta, mapCommonMeta } from "./commonMeta";
export { toolResourceTags, docResourceTags, communityResourceTags, imageTags } from "./ecoTags";

import { modTags } from "./modTags";
import { mapTags } from "./mapTags";
import { datapackTags } from "./datapackTags";
import { modpackTags } from "./modpackTags";
import { serverTags } from "./serverTags";
import { textureTags, shaderTags, buildingTags, audioTags } from "./auxiliaryTags";
import { toolResourceTags, docResourceTags, communityResourceTags, imageTags } from "./ecoTags";
import { ResourceTagSystem } from "./types";

// 按资源ID查找标签系统
export const tagSystemMap: Record<string, ResourceTagSystem> = {
  mod: modTags,
  map: mapTags,
  datapack: datapackTags,
  modpack: modpackTags,
  server: serverTags,
  resourcepack: textureTags,
  shader: shaderTags,
  building: buildingTags,
  audio: audioTags,
  ecoTool: toolResourceTags,
  doc: docResourceTags,
  community: communityResourceTags,
  image: imageTags,
};
