import { MainTag } from "./types";

// 内容资源通用元数据（模组、地图、数据包、整合包）
export const contentCommonMeta: MainTag[] = [
  {
    id: "contentScale",
    label: "内容规模",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "none", label: "无" },
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
      { id: "none", label: "无" },
      { id: "instant", label: "即时 1-60分钟" },
      { id: "basic", label: "基础 60-300分钟" },
      { id: "large", label: "大型 300分钟+" },
    ],
  },
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
    id: "difficulty",
    label: "难易度",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "none", label: "无" },
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
      { id: "none", label: "无" },
      { id: "creative", label: "快乐/创造" },
      { id: "combat", label: "刺激/战斗" },
      { id: "horror", label: "恐怖/惊悚" },
      { id: "education", label: "教育/学习" },
      { id: "relax", label: "放松/治愈" },
    ],
  },
  {
    id: "warning",
    label: "内容警示",
    type: "flat",
    multiSelect: true,
    options: [
      { id: "none", label: "无" },
      { id: "horror", label: "恐怖警告" },
      { id: "flash", label: "闪光警告" },
    ],
  },
  {
    id: "balance",
    label: "数值平衡",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "none", label: "无" },
      { id: "gentle", label: "温和数值" },
      { id: "vanilla", label: "原版平衡" },
      { id: "enhanced", label: "强化数值" },
      { id: "inflated", label: "膨胀数值" },
    ],
  },
];

// 辅助资源通用元数据（材质、光影、建筑、音频）
export const auxiliaryCommonMeta: MainTag[] = [
  {
    id: "contentScale",
    label: "内容规模",
    type: "flat",
    multiSelect: false,
    options: [
      { id: "none", label: "无" },
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
      { id: "none", label: "无" },
      { id: "instant", label: "即时 1-60分钟" },
      { id: "basic", label: "基础 60-300分钟" },
      { id: "large", label: "大型 300分钟+" },
    ],
  },
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
    id: "emotion",
    label: "情感导向",
    type: "flat",
    multiSelect: true,
    options: [
      { id: "none", label: "无" },
      { id: "creative", label: "快乐/创造" },
      { id: "combat", label: "刺激/战斗" },
      { id: "horror", label: "恐怖/惊悚" },
      { id: "education", label: "教育/学习" },
      { id: "relax", label: "放松/治愈" },
    ],
  },
  {
    id: "warning",
    label: "内容警示",
    type: "flat",
    multiSelect: true,
    options: [
      { id: "none", label: "无" },
      { id: "horror", label: "恐怖警告" },
      { id: "flash", label: "闪光警告" },
    ],
  },
];
