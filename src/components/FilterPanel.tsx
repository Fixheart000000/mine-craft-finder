import { useState } from "react";
import { MainTag, TagGroup, TagOption } from "@/data/tags/types";
import { tagSystemMap, contentCommonMeta, auxiliaryCommonMeta } from "@/data/tags";
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react";

interface FilterPanelProps {
  resourceId: string;
  isContentResource?: boolean; // mod/map/datapack/modpack
  isAuxiliaryResource?: boolean; // texture/shader/building/audio
  selectedTags: Record<string, string[]>;
  onTagsChange: (tags: Record<string, string[]>) => void;
}

const FilterPanel = ({
  resourceId,
  isContentResource = false,
  isAuxiliaryResource = false,
  selectedTags,
  onTagsChange,
}: FilterPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const tagSystem = tagSystemMap[resourceId];
  if (!tagSystem) return null;

  // Combine resource-specific tags with common metadata
  const allTags: MainTag[] = [
    ...tagSystem.mainTags,
    ...(isContentResource ? contentCommonMeta : []),
    ...(isAuxiliaryResource ? auxiliaryCommonMeta : []),
  ];

  // Filter out conditional tags whose condition is not met
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
    // Clean up empty arrays
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

  const renderFlatOptions = (tag: MainTag) => (
    <div className="flex flex-wrap gap-1.5">
      {tag.options?.map((opt) => {
        const isSelected = (selectedTags[tag.id] || []).includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => toggleTag(tag.id, opt.id, tag.multiSelect !== false)}
            className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
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
              {isGroupExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            {isGroupExpanded && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {group.options.map((opt) => {
                  const isSelected = (selectedTags[tag.id] || []).includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleTag(tag.id, opt.id, tag.multiSelect !== false)}
                      className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                      }`}
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
    <div className="w-full">
      {/* Toggle bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Filter className="w-3.5 h-3.5" />
        <span>筛选</span>
        {totalSelected > 0 && (
          <span className="px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full text-[10px] font-medium">
            {totalSelected}
          </span>
        )}
        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="mt-2 p-4 bg-card border border-border rounded-lg shadow-sm max-h-[60vh] overflow-y-auto">
          {/* Header with clear button */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">
              {tagSystem.resourceLabel}筛选条件
            </h3>
            {totalSelected > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
                清除全部 ({totalSelected})
              </button>
            )}
          </div>

          {/* Tag sections */}
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
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
