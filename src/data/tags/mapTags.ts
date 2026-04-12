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
        { id: "pvp", label: "PVP竞技", description: "玩家对战、团队竞技、计分规则等" },
        { id: "puzzle", label: "解密探索", description: "逻辑谜题、机关触发、密码破译等" },
        { id: "parkour", label: "跑酷挑战", description: "跳跃精度、攀爬技巧、计时竞速等" },
        { id: "survival", label: "生存挑战", description: "特殊生存规则、资源限制、恶劣环境等" },
        { id: "minigame", label: "小游戏", description: "迷你游戏集合、休闲娱乐、趣味挑战等" },
        { id: "adventure", label: "冒险剧情", description: "主线剧情、支线任务、Boss对战" },
        { id: "showcase", label: "景观赏析", description: "以视觉展示为主，强调建筑美学与光影效果" },
      ],
    },
    {
      id: "contentStyle",
      label: "视觉基调",
      type: "flat",
      multiSelect: true,
      options: [
        { id: "古风", label: "古风" },
        { id: "日式", label: "日式" },
        { id: "卡通", label: "卡通" },
        { id: "写实", label: "写实" },
        { id: "像素", label: "像素" },
        { id: "极简", label: "极简" },
        { id: "奇幻", label: "奇幻" },
        { id: "暗黑", label: "暗黑" },
        { id: "科幻", label: "科幻" },
        { id: "中世纪风", label: "中世纪风" },
        { id: "赛博朋克", label: "赛博朋克" },
        { id: "蒸汽朋克", label: "蒸汽朋克" },
      ],
    },
  ],
};
