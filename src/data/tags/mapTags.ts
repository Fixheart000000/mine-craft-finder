import { ResourceTagSystem } from "./types";

export const mapTags: ResourceTagSystem = {
  resourceId: "map",
  resourceLabel: "地图",
  mainTags: [
    {
      id: "direction",
      label: "内容方向",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "parkour", label: "跑酷挑战", description: "跳跃精度、攀爬技巧、计时竞速等" },
        { id: "puzzle", label: "解密探索", description: "逻辑谜题、机关触发、密码破译等" },
        { id: "adventure", label: "冒险剧情", description: "主线剧情、支线任务、Boss对战等" },
        { id: "survival", label: "生存挑战", description: "特殊生存规则、资源限制、恶劣环境等" },
        { id: "pvp", label: "PVP竞技", description: "玩家对战、团队竞技、计分规则等" },
        { id: "minigame", label: "小游戏", description: "迷你游戏集合、休闲娱乐、趣味挑战等" },
        { id: "showcase", label: "景观赏析", description: "以视觉展示为主，强调建筑美学与光影效果" },
      ],
    },
    {
      id: "scene",
      label: "内容场景",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "terrain", label: "地形场景", description: "山脉、峡谷、岛屿、洞穴等自然地貌" },
        { id: "landscape", label: "景观场景", description: "花园、公园、广场、艺术装置等" },
        { id: "recreation", label: "复刻场景", description: "还原现实世界或影视作品中的知名地点" },
        { id: "singleBuilding", label: "独立建筑场景", description: "城堡、摩天大楼、飞船等" },
        { id: "buildingCluster", label: "建筑群场景", description: "村庄、社区、基地群等" },
        { id: "city", label: "城市场景", description: "完整城市生态系统" },
      ],
    },
    {
      id: "style",
      label: "场景风格",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "realistic", label: "写实风" },
        { id: "cartoon", label: "卡通风" },
        { id: "fantasy", label: "奇幻风" },
        { id: "medieval", label: "中世纪" },
        { id: "modern", label: "现代" },
        { id: "scifi", label: "科幻" },
      ],
    },
    {
      id: "narrative",
      label: "是否有叙事",
      type: "flat",
      multiSelect: false,
      options: [
        { id: "no", label: "无叙事" },
        { id: "yes", label: "有叙事" },
      ],
    },
    {
      id: "rules",
      label: "内容规则",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "mechanism", label: "机关谜题", description: "按钮、压力板、红石电路等" },
        { id: "parkour", label: "跑酷机制", description: "跳跃平台、障碍判定等" },
        { id: "pvp", label: "PVP机制", description: "重生点、计分板、队伍规则等" },
        { id: "survival", label: "生存机制", description: "资源刷新率、天气循环等" },
        { id: "showcase", label: "展示赏析", description: "静态展示为主" },
      ],
    },
  ],
};
