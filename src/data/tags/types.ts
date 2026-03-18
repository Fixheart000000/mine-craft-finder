// 标签系统类型定义

export interface TagOption {
  id: string;
  label: string;
  description?: string;
}

export interface TagGroup {
  id: string;
  label: string;
  options: TagOption[];
}

// 主标签：可以是平铺选项或分组选项
export interface MainTag {
  id: string;
  label: string;
  multiSelect?: boolean; // 是否支持多选，默认 true
  type: "flat" | "grouped";
  options?: TagOption[];
  groups?: TagGroup[];
  // 条件显示：仅当父标签选中特定值时才出现
  conditionalOn?: {
    tagId: string;
    optionId: string;
  };
}

export interface ResourceTagSystem {
  resourceId: string;
  resourceLabel: string;
  mainTags: MainTag[];
}
