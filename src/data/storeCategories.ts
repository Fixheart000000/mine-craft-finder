// 平台商城分类
export type StoreCategory = "gameSkin" | "communitySkin";

export const storeCategories: { id: StoreCategory; label: string }[] = [
  { id: "gameSkin", label: "游戏形象" },
  { id: "communitySkin", label: "社区形象" },
];

export const storeCategoryDetails = {
  gameSkin: {
    id: "gameSkin",
    label: "游戏形象",
    subCategories: [
      { id: "skin", label: "皮肤" },
      { id: "cape", label: "披风" },
      { id: "halo", label: "光环" },
      { id: "themed", label: "主题形象" },
      { id: "original", label: "原创形象" },
    ],
  },
  communitySkin: {
    id: "communitySkin",
    label: "社区形象",
    subCategories: [
      { id: "avatar", label: "动态头像" },
      { id: "badge", label: "徽章" },
      { id: "frame", label: "头像框" },
      { id: "banner", label: "个人横幅" },
      { id: "themed", label: "主题形象" },
    ],
  },
};
