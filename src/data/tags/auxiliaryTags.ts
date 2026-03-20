import { ResourceTagSystem } from "./types";

export const textureTags: ResourceTagSystem = {
  resourceId: "resourcepack",
  resourceLabel: "材质",
  mainTags: [
    {
      id: "resolution",
      label: "精度规格",
      type: "flat",
      multiSelect: false,
      options: [
        { id: "16x", label: "16x（原版）" },
        { id: "32x", label: "32x" },
        { id: "64x", label: "64x" },
        { id: "128x", label: "128x" },
        { id: "256x", label: "256x+" },
      ],
    },
    {
      id: "artStyle",
      label: "艺术风格",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "realistic", label: "写实风" },
        { id: "cartoon", label: "卡通风" },
        { id: "pixel", label: "像素风" },
        { id: "fantasy", label: "奇幻风" },
        { id: "ancient", label: "古风" },
        { id: "modern", label: "现代风" },
      ],
    },
    {
      id: "scope",
      label: "适用范围",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "block", label: "方块" },
        { id: "mob", label: "生物" },
        { id: "item", label: "物品" },
        { id: "gui", label: "界面 (GUI)" },
        { id: "particle", label: "粒子效果" },
      ],
    },
    {
      id: "effect",
      label: "特殊效果",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "transparent", label: "透明材质" },
        { id: "animated", label: "动画材质" },
        { id: "emissive", label: "发光材质" },
        { id: "ctm", label: "连接纹理 (CTM)" },
      ],
    },
    {
      id: "colorStyle",
      label: "色彩风格",
      type: "flat",
      multiSelect: false,
      options: [
        { id: "highSat", label: "高饱和" },
        { id: "lowSat", label: "低饱和" },
        { id: "retro", label: "复古色调" },
        { id: "soft", label: "柔和色调" },
      ],
    },
    {
      id: "config",
      label: "配置系统",
      type: "flat",
      multiSelect: false,
      options: [
        { id: "no", label: "无（固定样式）" },
        { id: "yes", label: "有（支持配置切换）" },
      ],
    },
  ],
};

export const shaderTags: ResourceTagSystem = {
  resourceId: "shader",
  resourceLabel: "光影",
  mainTags: [
    {
      id: "shaderLoader",
      label: "着色器",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "optifine", label: "Optifine" },
        { id: "iris", label: "Iris Shaders" },
        { id: "vanillaShader", label: "Vanilla Shader" },
        { id: "forgeShaders", label: "Forge Shaders Mod" },
        { id: "canvas", label: "Canvas" },
        { id: "nativeShader", label: "原生着色器" },
      ],
    },
    {
      id: "styleType",
      label: "风格类型",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "realistic", label: "写实" },
        { id: "cartoon", label: "卡通" },
        { id: "fantasy", label: "魔幻奇幻" },
        { id: "minimal", label: "简约" },
        { id: "retro", label: "复古怀旧" },
        { id: "scifi", label: "科幻" },
      ],
    },
    {
      id: "renderTech",
      label: "渲染技术",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "rtx", label: "RTX光线追踪" },
        { id: "ssrtgi", label: "SSRTGI" },
        { id: "ssao", label: "SSAO" },
        { id: "bloom", label: "Bloom泛光" },
        { id: "volumetric", label: "体积云/雾" },
      ],
    },
  ],
};

export const buildingTags: ResourceTagSystem = {
  resourceId: "building",
  resourceLabel: "建筑",
  mainTags: [
    {
      id: "buildType",
      label: "类型",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "single", label: "独立建筑" },
        { id: "complex", label: "建筑群" },
        { id: "city", label: "城市作品" },
        { id: "themed", label: "主题建筑" },
        { id: "assets", label: "建筑素材" },
      ],
    },
    {
      id: "buildStyle",
      label: "风格",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "medieval", label: "中世纪" },
        { id: "modern", label: "现代" },
        { id: "scifi", label: "科幻" },
        { id: "fantasy", label: "奇幻" },
        { id: "ancient", label: "古风" },
        { id: "japanese", label: "日式" },
        { id: "european", label: "欧式" },
        { id: "industrial", label: "工业风" },
      ],
    },
  ],
};

export const audioTags: ResourceTagSystem = {
  resourceId: "audio",
  resourceLabel: "音频",
  mainTags: [
    {
      id: "audioType",
      label: "音频类型",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "ambient", label: "环境音效" },
        { id: "item", label: "物品音效" },
        { id: "mob", label: "生物音效" },
        { id: "ui", label: "UI音效" },
        { id: "weapon", label: "武器音效" },
        { id: "bgm", label: "背景音乐" },
        { id: "battle", label: "战斗音乐" },
        { id: "atmosphere", label: "氛围音乐" },
        { id: "theme", label: "主题曲" },
        { id: "casual", label: "休闲音乐" },
      ],
    },
  ],
};
