// 游戏内容分类及子分类
export const gameContentCategories = {
  mod: {
    id: "mod",
    label: "模组",
    subCategories: [
      { id: "functional", label: "功能性模组" },
      { id: "adventure", label: "冒险模组" },
      { id: "tech", label: "科技模组" },
      { id: "magic", label: "魔法模组" },
      { id: "decoration", label: "装饰模组" },
      { id: "biome", label: "生物群系模组" },
    ],
  },
  resourcepack: {
    id: "resourcepack",
    label: "材质包",
    subCategories: [
      { id: "realistic", label: "写实风格" },
      { id: "cartoon", label: "卡通风格" },
      { id: "pixel", label: "像素风格" },
      { id: "minimal", label: "简约风格" },
      { id: "themed", label: "主题材质包" },
    ],
  },
  shader: {
    id: "shader",
    label: "光影",
    subCategories: [
      { id: "realistic", label: "真实系光影" },
      { id: "cartoon", label: "卡通系光影" },
      { id: "performance", label: "性能优化光影" },
      { id: "cinematic", label: "电影级光影" },
      { id: "retro", label: "复古光影" },
    ],
  },
  map: {
    id: "map",
    label: "地图",
    subCategories: [
      { id: "terrain", label: "地形作品" },
      { id: "landscape", label: "景观作品" },
      { id: "recreation", label: "复刻作品" },
      { id: "parkour", label: "跑酷地图" },
      { id: "puzzle", label: "解密地图" },
      { id: "adventure", label: "冒险地图" },
      { id: "survival", label: "生存地图" },
      { id: "pvp", label: "PVP地图" },
      { id: "minigame", label: "小游戏地图" },
    ],
  },
  building: {
    id: "building",
    label: "建筑",
    subCategories: [
      { id: "single", label: "单体建筑" },
      { id: "complex", label: "建筑群" },
      { id: "city", label: "城市作品" },
      { id: "themed", label: "主题建筑" },
      { id: "assets", label: "建筑素材" },
    ],
  },
  skin: {
    id: "skin",
    label: "形象",
    subCategories: [
      { id: "skin", label: "皮肤" },
      { id: "cape", label: "披风" },
      { id: "halo", label: "光环" },
      { id: "themed", label: "主题形象" },
      { id: "original", label: "原创形象" },
    ],
  },
  datapack: {
    id: "datapack",
    label: "数据包",
    subCategories: [
      { id: "functional", label: "功能数据包" },
      { id: "challenge", label: "挑战数据包" },
      { id: "optimization", label: "优化数据包" },
      { id: "custom", label: "自定义数据包" },
    ],
  },
  modpack: {
    id: "modpack",
    label: "整合包",
    subCategories: [
      { id: "tech", label: "科技整合包" },
      { id: "magic", label: "魔法整合包" },
      { id: "adventure", label: "冒险整合包" },
      { id: "survival", label: "生存整合包" },
      { id: "light", label: "轻量整合包" },
      { id: "heavy", label: "重型整合包" },
      { id: "themed", label: "主题整合包" },
    ],
  },
  audio: {
    id: "audio",
    label: "音频",
    subCategories: [
      { id: "ambient", label: "环境音效" },
      { id: "item", label: "物品音效" },
      { id: "mob", label: "生物音效" },
      { id: "ui", label: "UI音效" },
      { id: "weapon", label: "武器音效" },
      { id: "bgm", label: "背景音乐" },
      { id: "battle", label: "战斗音乐" },
      { id: "atmosphere", label: "氛围音乐" },
    ],
  },
};

// 创作工具分类及子分类
export const toolCategories = {
  moddev: {
    id: "moddev",
    label: "模组开发",
    subCategories: [
      { id: "framework", label: "开发框架" },
      { id: "editor", label: "代码编辑工具" },
      { id: "debug", label: "调试工具" },
      { id: "resource", label: "资源管理工具" },
    ],
  },
  mapmaking: {
    id: "mapmaking",
    label: "地图制作",
    subCategories: [
      { id: "editor", label: "地图编辑器" },
      { id: "command", label: "命令生成器" },
      { id: "nbt", label: "NBT编辑器" },
      { id: "testing", label: "地图测试工具" },
    ],
  },
  buildtool: {
    id: "buildtool",
    label: "建筑创作",
    subCategories: [
      { id: "assist", label: "建筑辅助模组" },
      { id: "terrain", label: "地形生成工具" },
      { id: "structure", label: "结构管理工具" },
      { id: "planning", label: "建筑规划工具" },
    ],
  },
  resourcetool: {
    id: "resourcetool",
    label: "资源创作",
    subCategories: [
      { id: "texture", label: "材质制作工具" },
      { id: "model", label: "模型制作工具" },
      { id: "animation", label: "动画制作工具" },
      { id: "audio", label: "音频处理工具" },
    ],
  },
  general: {
    id: "general",
    label: "通用工具",
    subCategories: [
      { id: "version", label: "版本管理工具" },
      { id: "download", label: "资源下载工具" },
      { id: "backup", label: "备份恢复工具" },
      { id: "performance", label: "性能优化工具" },
    ],
  },
};

// 知识文档分类及子分类
export const docCategories = {
  tutorial: {
    id: "tutorial",
    label: "教程文档",
    subCategories: [
      { id: "moddev", label: "模组开发教程" },
      { id: "datapack", label: "数据包教程" },
      { id: "plugin", label: "插件开发教程" },
      { id: "building", label: "建筑教程" },
      { id: "mapmaking", label: "地图制作教程" },
      { id: "texture", label: "材质制作教程" },
      { id: "shader", label: "光影制作教程" },
      { id: "tool", label: "工具使用教程" },
      { id: "server", label: "服务器搭建教程" },
    ],
  },
  technical: {
    id: "technical",
    label: "技术文档",
    subCategories: [
      { id: "api", label: "API文档" },
      { id: "standard", label: "开发规范" },
      { id: "example", label: "代码示例" },
      { id: "architecture", label: "架构设计" },
    ],
  },
  solution: {
    id: "solution",
    label: "技术方案",
    subCategories: [
      { id: "optimization", label: "优化方案" },
      { id: "problem", label: "解决方案" },
      { id: "integration", label: "集成方案" },
      { id: "migration", label: "迁移方案" },
    ],
  },
  practice: {
    id: "practice",
    label: "最佳实践",
    subCategories: [
      { id: "dev", label: "开发最佳实践" },
      { id: "creation", label: "创作技巧" },
      { id: "performance", label: "性能优化指南" },
      { id: "security", label: "安全指南" },
    ],
  },
  reference: {
    id: "reference",
    label: "参考资料",
    subCategories: [
      { id: "resource", label: "资源库" },
      { id: "code", label: "代码库" },
      { id: "template", label: "模板库" },
      { id: "knowledge", label: "知识库" },
    ],
  },
};

// 社区相关分类
export const communityCategories = {
  project: {
    id: "project",
    label: "项目",
    subCategories: [],
  },
  user: {
    id: "user",
    label: "用户",
    subCategories: [],
  },
  server: {
    id: "server",
    label: "服务器",
    subCategories: [],
  },
};

// 主分类
export type MainCategory = "content" | "tool" | "doc";

export const mainCategories: { id: MainCategory; label: string }[] = [
  { id: "content", label: "游戏内容" },
  { id: "tool", label: "创作工具" },
  { id: "doc", label: "知识文档" },
];

// 获取主分类下的所有子分类
export const getCategoriesByMain = (main: MainCategory) => {
  switch (main) {
    case "content":
      return gameContentCategories;
    case "tool":
      return toolCategories;
    case "doc":
      return docCategories;
    default:
      return gameContentCategories;
  }
};
