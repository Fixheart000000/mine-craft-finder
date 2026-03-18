// 游戏内容分类（内容资源）
export const gameContentCategories = {
  mod: { id: "mod", label: "模组" },
  map: { id: "map", label: "地图" },
  datapack: { id: "datapack", label: "数据包" },
  modpack: { id: "modpack", label: "整合包" },
};

// 辅助资源分类
export const auxiliaryCategories = {
  resourcepack: { id: "resourcepack", label: "材质" },
  shader: { id: "shader", label: "光影" },
  building: { id: "building", label: "建筑" },
  audio: { id: "audio", label: "音频" },
};

// 生态工具分类
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
    label: "地形制作",
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
  servertool: {
    id: "servertool",
    label: "服务器工具/插件",
    subCategories: [
      { id: "core", label: "服务器核心/管理工具" },
      { id: "config", label: "服务器配置工具" },
      { id: "plugin", label: "插件管理工具" },
      { id: "monitor", label: "服务器监控工具" },
      { id: "security", label: "服务器安全工具" },
      { id: "backup", label: "服务器备份工具" },
      { id: "optimize", label: "服务器优化工具" },
      { id: "panel", label: "服务器面板工具" },
      { id: "network", label: "服务器网络工具" },
      { id: "log", label: "服务器日志工具" },
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
      { id: "launcher", label: "启动/联机工具" },
    ],
  },
};

// 知识文档分类
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

// 社交社区分类
export const communityCategories = {
  project: { id: "project", label: "项目", subCategories: [] as { id: string; label: string }[] },
  user: { id: "user", label: "用户", subCategories: [] as { id: string; label: string }[] },
  server: { id: "server", label: "服务器", subCategories: [] as { id: string; label: string }[] },
};

// 主分类
export type MainCategory = "content" | "auxiliary" | "tool" | "doc" | "community";

export const mainCategories: { id: MainCategory; label: string }[] = [
  { id: "content", label: "游戏内容" },
  { id: "auxiliary", label: "辅助资源" },
  { id: "tool", label: "生态工具" },
  { id: "doc", label: "知识文档" },
  { id: "community", label: "社交社区" },
];

// 获取主分类下的所有子分类
export const getCategoriesByMain = (main: MainCategory) => {
  switch (main) {
    case "content":
      return gameContentCategories;
    case "auxiliary":
      return auxiliaryCategories;
    case "tool":
      return toolCategories;
    case "doc":
      return docCategories;
    case "community":
      return communityCategories;
    default:
      return gameContentCategories;
  }
};
