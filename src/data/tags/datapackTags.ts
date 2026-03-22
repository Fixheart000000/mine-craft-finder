import { ResourceTagSystem } from "./types";

export const datapackTags: ResourceTagSystem = {
  resourceId: "datapack",
  resourceLabel: "数据包",
  mainTags: [
    {
      id: "direction",
      label: "内容方向",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "enhancement", label: "功能增强", description: "新物品、新合成表、新游戏机制等" },
        { id: "ruleChange", label: "规则修改", description: "难度调整、掉落率修改、生物AI等" },
        { id: "performance", label: "性能优化", description: "刷怪逻辑优化、区块加载策略等" },
        { id: "customization", label: "个性化设置", description: "昼夜周期、天气频率、生物生成等" },
        { id: "audio", label: "音效修改", description: "工具音效、生物叫声、环境音等" },
        { id: "model", label: "模型修改", description: "实体模型、物品3D模型、方块形状等" },
        { id: "function", label: "函数系统", description: "复杂逻辑运算、事件监听等" },
        { id: "tag", label: "标签系统", description: "生物分组、方块分类、物品用途等" },
        { id: "loot", label: "Loot表系统", description: "宝箱掉落规则、权重概率等" },
        { id: "advancement", label: "进度系统", description: "成就解锁条件、进度追踪等" },
        { id: "recipe", label: "配方系统", description: "工作台合成配方、材料消耗等" },
      ],
    },
    {
      id: "contentStyle",
      label: "内容风格",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "none", label: "不涉及" },
        { id: "realistic", label: "写实风" },
        { id: "cartoon", label: "卡通风" },
        { id: "fantasy", label: "奇幻风" },
        { id: "scifi", label: "科幻风" },
        { id: "medieval", label: "中世纪" },
        { id: "modern", label: "现代风" },
      ],
    },
    {
      id: "narrative",
      label: "是否有叙事",
      type: "flat",
      multiSelect: false,
      options: [
        { id: "no", label: "无叙事", description: "仅修改游戏机制或数据" },
        { id: "yes", label: "有叙事", description: "通过进度系统、文本等引导剧情体验" },
      ],
    },
  ],
};
