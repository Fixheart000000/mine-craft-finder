import { useState } from "react";
import { MainTag } from "@/data/tags/types";
import { tagSystemMap, contentCommonMeta, auxiliaryCommonMeta } from "@/data/tags";
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ModIcon from "@/components/icons/ModIcon";
import MapIcon from "@/components/icons/MapIcon";
import DataPackIcon from "@/components/icons/DataPackIcon";
import ModpackIcon from "@/components/icons/ModpackIcon";
import ResourcePackIcon from "@/components/icons/ResourcePackIcon";
import ShaderIcon from "@/components/icons/ShaderIcon";
import BuildingIcon from "@/components/icons/BuildingIcon";
import AudioIcon from "@/components/icons/AudioIcon";
import ServerIcon from "@/components/icons/ServerIcon";
import { cn } from "@/lib/utils";

const allResourceTypes: { id: string; label: string; icon: React.ReactNode; group: "content" | "auxiliary" }[] = [
  { id: "mod", label: "模组", icon: <ModIcon className="w-4 h-4" />, group: "content" },
  { id: "map", label: "地图", icon: <MapIcon className="w-4 h-4" />, group: "content" },
  { id: "datapack", label: "数据包", icon: <DataPackIcon className="w-4 h-4" />, group: "content" },
  { id: "modpack", label: "整合包", icon: <ModpackIcon className="w-4 h-4" />, group: "content" },
  { id: "server", label: "服务器", icon: <ServerIcon className="w-4 h-4" />, group: "content" },
  { id: "resourcepack", label: "材质", icon: <ResourcePackIcon className="w-4 h-4" />, group: "auxiliary" },
  { id: "shader", label: "光影", icon: <ShaderIcon className="w-4 h-4" />, group: "auxiliary" },
  { id: "building", label: "建筑", icon: <BuildingIcon className="w-4 h-4" />, group: "auxiliary" },
  { id: "audio", label: "音频", icon: <AudioIcon className="w-4 h-4" />, group: "auxiliary" },
];

interface FilterPanelProps {
  resourceId: string;
  selectedTags: Record<string, string[]>;
  onTagsChange: (tags: Record<string, string[]>) => void;
  onResourceChange: (id: string) => void;
}

const FilterPanel = ({
  resourceId,
  selectedTags,
  onTagsChange,
  onResourceChange,
}: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const tagSystem = tagSystemMap[resourceId];
  const currentType = allResourceTypes.find((t) => t.id === resourceId);
  const isContentResource = currentType?.group === "content";
  const isAuxiliaryResource = currentType?.group === "auxiliary";

  const allTags: MainTag[] = tagSystem
    ? [
        ...tagSystem.mainTags,
        ...(isContentResource ? contentCommonMeta : []),
        ...(isAuxiliaryResource ? auxiliaryCommonMeta : []),
      ]
    : [];

  const visibleTags = allTags.filter((tag) => {
    if (!tag.conditionalOn) return true;
    const parentSelected = selectedTags[tag.conditionalOn.tagId] || [];
    return parentSelected.includes(tag.conditionalOn.optionId);
  });

  const totalSelected = Object.values(selectedTags).reduce((sum, arr) => sum + arr.length, 0);

  const toggleTag = (tagId: string, optionId: string, multiSelect: boolean) => {
    const current = selectedTags[tagId] || [];
    let updated: string[];
    if (multiSelect) {
      updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
    } else {
      updated = current.includes(optionId) ? [] : [optionId];
    }
    const newTags = { ...selectedTags, [tagId]: updated };
    if (updated.length === 0) delete newTags[tagId];
    onTagsChange(newTags);
  };

  const clearAll = () => onTagsChange({});

  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const handleResourceSwitch = (id: string) => {
    onResourceChange(id);
    onTagsChange({});
  };

  const renderFlatOptions = (tag: MainTag) => (
    <div className="flex flex-wrap gap-1.5">
      {tag.options?.map((opt) => {
        const isSelected = (selectedTags[tag.id] || []).includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => toggleTag(tag.id, opt.id, tag.multiSelect !== false)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md border transition-all",
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            )}
            title={opt.description}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );

  const renderGroupedOptions = (tag: MainTag) => (
    <div className="space-y-2">
      {tag.groups?.map((group) => {
        const isGroupExpanded = expandedGroups.has(`${tag.id}-${group.id}`);
        const groupSelectedCount = group.options.filter((opt) =>
          (selectedTags[tag.id] || []).includes(opt.id)
        ).length;

        return (
          <div key={group.id} className="border border-border rounded-md overflow-hidden">
            <button
              onClick={() => toggleGroupExpand(`${tag.id}-${group.id}`)}
              className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
            >
              <span>
                {group.label}
                {groupSelectedCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px]">
                    {groupSelectedCount}
                  </span>
                )}
              </span>
              {isGroupExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {isGroupExpanded && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {group.options.map((opt) => {
                  const isSelected = (selectedTags[tag.id] || []).includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleTag(tag.id, opt.id, tag.multiSelect !== false)}
                      className={cn(
                        "px-2.5 py-1 text-xs rounded-md border transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                      )}
                      title={opt.description}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-md transition-colors"
      >
        <Filter className="w-3.5 h-3.5" />
        <span>筛选</span>
        {totalSelected > 0 && (
          <span className="px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full text-[10px] font-medium">
            {totalSelected}
          </span>
        )}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>筛选条件</span>
              {totalSelected > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors font-normal"
                >
                  <X className="w-3 h-3" />
                  清除全部 ({totalSelected})
                </button>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Resource type switcher */}
          <div className="border-b border-border pb-3 mb-3">
            <div className="text-xs text-muted-foreground mb-2">资源类型</div>
            <div className="flex flex-wrap gap-1.5">
              {allResourceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleResourceSwitch(type.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border transition-all",
                    resourceId === type.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag filters */}
          {tagSystem ? (
            <div className="space-y-4">
              {visibleTags.map((tag) => (
                <div key={tag.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-foreground">{tag.label}</span>
                    {tag.multiSelect !== false && (
                      <span className="text-[10px] text-muted-foreground">(可多选)</span>
                    )}
                  </div>
                  {tag.type === "flat" ? renderFlatOptions(tag) : renderGroupedOptions(tag)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-8">
              该资源类型暂无筛选条件
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilterPanel;
