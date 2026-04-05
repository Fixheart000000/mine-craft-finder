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
        { id: "audio", label: "音效修改", description: "工具音效、生物叫声、环境音等" },
        { id: "model", label: "模型修改", description: "实体模型、物品3D模型、方块形状等" },
        { id: "tag", label: "标签系统", description: "生物分组、方块分类、物品用途等" },
        { id: "loot", label: "Loot表系统", description: "宝箱掉落规则、权重概率等" },
        { id: "function", label: "函数系统", description: "复杂逻辑运算、事件监听等" },
        { id: "recipe", label: "配方系统", description: "工作台合成配方、材料消耗等" },
        { id: "performance", label: "性能优化", description: "刷怪逻辑优化、区块加载策略等" },
        { id: "ruleChange", label: "规则修改", description: "难度调整、掉落率修改、生物AI等" },
        { id: "enhancement", label: "功能增强", description: "新物品、新合成表、新游戏机制等" },
        { id: "customization", label: "个性化设置", description: "昼夜周期、天气频率、生物生成等" },
        { id: "advancement", label: "进度系统", description: "成就解锁条件、进度追踪等" },
      ],
    },
    {
      id: "contentStyle",
      label: "视觉基调",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "古风", label: "古风" },
        { id: "日式风", label: "日式风" },
        { id: "卡通风", label: "卡通风" },
        { id: "写实风", label: "写实风" },
        { id: "像素风", label: "像素风" },
        { id: "极简风", label: "极简风" },
        { id: "奇幻风", label: "奇幻风" },
        { id: "暗黑风", label: "暗黑风" },
        { id: "科幻风", label: "科幻风" },
        { id: "中世纪风", label: "中世纪风" },
        { id: "赛博朋克", label: "赛博朋克" },
        { id: "蒸汽朋克", label: "蒸汽朋克" },
      ],
    },
  ],
};
