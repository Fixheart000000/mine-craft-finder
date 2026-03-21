import { MainTag } from "./types";

// 游戏版本（所有资源通用，置顶）
export const gameVersionTag: MainTag = {
  id: "gameVersion",
  label: "游戏版本",
  type: "grouped",
  multiSelect: true,
  groups: [
    {
      id: "latest",
      label: "最新版本",
      options: [
        { id: "26.1", label: "26.1" },
      ],
    },
    {
      id: "modern",
      label: "现代版本 (1.17–1.21)",
      options: [
        { id: "1.21", label: "1.21.x" },
        { id: "1.20", label: "1.20.x" },
        { id: "1.19", label: "1.19.x" },
        { id: "1.18", label: "1.18.x" },
        { id: "1.17", label: "1.17.x" },
      ],
    },
    {
      id: "transition",
      label: "过渡版本 (1.13–1.16)",
      options: [
        { id: "1.16", label: "1.16.x" },
        { id: "1.15", label: "1.15.x" },
        { id: "1.14", label: "1.14.x" },
        { id: "1.13", label: "1.13.x" },
      ],
    },
    {
      id: "classic",
      label: "经典版本 (1.7–1.12)",
      options: [
        { id: "1.12", label: "1.12.x" },
        { id: "1.11", label: "1.11.x" },
        { id: "1.10", label: "1.10.x" },
        { id: "1.9", label: "1.9.x" },
        { id: "1.8", label: "1.8.x" },
        { id: "1.7", label: "1.7.x" },
      ],
    },
    {
      id: "legacy",
      label: "远古版本 (1.6及更早)",
      options: [
        { id: "1.6", label: "1.6.x" },
        { id: "1.5", label: "1.5.x" },
        { id: "1.4", label: "1.4.x" },
        { id: "1.3", label: "1.3.x" },
        { id: "1.2", label: "1.2.x" },
        { id: "1.1", label: "1.1" },
        { id: "1.0", label: "1.0" },
      ],
    },
  ],
};

// 产出方式（所有资源通用）
export const originTag: MainTag = {
  id: "origin",
  label: "产出方式",
  type: "flat",
  multiSelect: false,
  options: [
    { id: "original", label: "原创" },
    { id: "repost", label: "搬运" },
  ],
};

// 运行环境（所有资源通用）
export const runtimeEnvTag: MainTag = {
  id: "runtimeEnv",
  label: "运行环境",
  type: "flat",
  multiSelect: false,
  options: [
    { id: "none", label: "不涉及" },
    { id: "clientRequired", label: "客户端需装" },
    { id: "serverRequired", label: "服务端需装" },
    { id: "clientOptional", label: "客户端可选" },
    { id: "serverOptional", label: "服务端可选" },
  ],
};

// 许可证类型（所有资源通用）
export const licenseTag: MainTag = {
  id: "license",
  label: "许可证类型",
  type: "flat",
  multiSelect: false,
  options: [
    { id: "closedSource", label: "闭源", description: "如有体验之外的其它需求需自行联系创作人进行沟通以求获得相应授权" },
    { id: "openSource", label: "开源", description: "如有体验之外的其它需求需自行联系创作人进行沟通以求获得相应授权" },
  ],
};

// 内容资源通用元数据（模组、地图、数据包、整合包、服务器）
export const contentCommonMeta: MainTag[] = [
  gameVersionTag,
  originTag,
  runtimeEnvTag,
  licenseTag,
  {
    id: "perfLoad",
    label: "性能负载",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "low", label: "低负载" },
      { id: "mid", label: "中负载" },
      { id: "high", label: "高负载" },
    ],
  },
  {
    id: "contentScale",
    label: "内容规模",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "none", label: "不涉及" },
      { id: "light", label: "轻体量" },
      { id: "normal", label: "普通" },
      { id: "heavy", label: "大体量" },
    ],
  },
  {
    id: "playTime",
    label: "体验体量",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "none", label: "不涉及" },
      { id: "instant", label: "即时 1-60分钟" },
      { id: "basic", label: "基础 60-300分钟" },
      { id: "large", label: "大型 300分钟+" },
    ],
  },
  {
    id: "difficulty",
    label: "难易度",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "none", label: "不涉及" },
      { id: "casual", label: "休闲/简单" },
      { id: "standard", label: "标准" },
      { id: "hard", label: "困难/挑战" },
      { id: "extreme", label: "硬核/极限" },
    ],
  },
  {
    id: "emotion",
    label: "情感导向",
    type: "flat",
    multiSelect: true,
    options: [
      { id: "none", label: "不涉及" },
      { id: "creative", label: "快乐/创造" },
      { id: "combat", label: "刺激/战斗" },
      { id: "horror", label: "恐怖/惊悚" },
      { id: "education", label: "教育/学习" },
      { id: "relax", label: "放松/治愈" },
      { id: "nostalgia", label: "怀旧/回忆" },
      { id: "achievement", label: "成就/满足" },
      { id: "curiosity", label: "好奇/探索" },
      { id: "sadness", label: "悲伤/感动" },
      { id: "tension", label: "紧张/压迫" },
      { id: "mystery", label: "神秘/悬疑" },
      { id: "empathy", label: "共情/代入" },
      { id: "humor", label: "幽默/搞怪" },
      { id: "awe", label: "震撼/敬畏" },
      { id: "loneliness", label: "孤独/沉思" },
    ],
  },
  {
    id: "warning",
    label: "内容警示",
    type: "flat",
    multiSelect: true,
    options: [
      { id: "none", label: "不涉及" },
      { id: "horror", label: "恐怖警告" },
      { id: "flash", label: "闪光警告" },
      { id: "gore", label: "血腥暴力" },
      { id: "psycho", label: "心理压力" },
      { id: "jumpScare", label: "突发惊吓" },
      { id: "darkTheme", label: "黑暗主题" },
      { id: "dizziness", label: "眩晕警告" },
      { id: "loudNoise", label: "高分贝噪音" },
      { id: "sensitiveContent", label: "敏感内容" },
    ],
  },
  {
    id: "balance",
    label: "数值平衡",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "none", label: "不涉及" },
      { id: "gentle", label: "温和数值" },
      { id: "vanilla", label: "原版平衡" },
      { id: "enhanced", label: "强化数值" },
      { id: "inflated", label: "膨胀数值" },
    ],
  },
];

// 辅助资源通用元数据（材质、光影、建筑、音频）
export const auxiliaryCommonMeta: MainTag[] = [
  gameVersionTag,
  originTag,
  runtimeEnvTag,
  licenseTag,
  {
    id: "perfLoad",
    label: "性能负载",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "low", label: "低负载" },
      { id: "mid", label: "中负载" },
      { id: "high", label: "高负载" },
    ],
  },
  {
    id: "contentScale",
    label: "内容规模",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "none", label: "不涉及" },
      { id: "light", label: "轻体量" },
      { id: "normal", label: "普通" },
      { id: "heavy", label: "大体量" },
    ],
  },
  {
    id: "playTime",
    label: "体验体量",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "none", label: "不涉及" },
      { id: "instant", label: "即时 1-60分钟" },
      { id: "basic", label: "基础 60-300分钟" },
      { id: "large", label: "大型 300分钟+" },
    ],
  },
  {
    id: "emotion",
    label: "情感导向",
    type: "flat",
    multiSelect: true,
    options: [
      { id: "none", label: "不涉及" },
      { id: "creative", label: "快乐/创造" },
      { id: "combat", label: "刺激/战斗" },
      { id: "horror", label: "恐怖/惊悚" },
      { id: "education", label: "教育/学习" },
      { id: "relax", label: "放松/治愈" },
      { id: "nostalgia", label: "怀旧/回忆" },
      { id: "achievement", label: "成就/满足" },
      { id: "curiosity", label: "好奇/探索" },
      { id: "sadness", label: "悲伤/感动" },
      { id: "tension", label: "紧张/压迫" },
      { id: "mystery", label: "神秘/悬疑" },
      { id: "empathy", label: "共情/代入" },
      { id: "humor", label: "幽默/搞怪" },
      { id: "awe", label: "震撼/敬畏" },
      { id: "loneliness", label: "孤独/沉思" },
    ],
  },
  {
    id: "warning",
    label: "内容警示",
    type: "flat",
    multiSelect: true,
    options: [
      { id: "none", label: "不涉及" },
      { id: "horror", label: "恐怖警告" },
      { id: "flash", label: "闪光警告" },
      { id: "gore", label: "血腥暴力" },
      { id: "psycho", label: "心理压力" },
      { id: "jumpScare", label: "突发惊吓" },
      { id: "darkTheme", label: "黑暗主题" },
      { id: "dizziness", label: "眩晕警告" },
      { id: "loudNoise", label: "高分贝噪音" },
      { id: "sensitiveContent", label: "敏感内容" },
    ],
  },
];
