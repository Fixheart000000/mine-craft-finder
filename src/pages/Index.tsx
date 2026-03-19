import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResourceCard from "@/components/ResourceCard";
import FilterPanel from "@/components/FilterPanel";
import { BreadcrumbNavigation } from "@/components/BreadcrumbDropdown";
import ModIcon from "@/components/icons/ModIcon";
import ResourcePackIcon from "@/components/icons/ResourcePackIcon";
import ShaderIcon from "@/components/icons/ShaderIcon";
import DataPackIcon from "@/components/icons/DataPackIcon";
import ModpackIcon from "@/components/icons/ModpackIcon";
import MapIcon from "@/components/icons/MapIcon";
import ProjectIcon from "@/components/icons/ProjectIcon";
import UserIcon from "@/components/icons/UserIcon";
import ServerIcon from "@/components/icons/ServerIcon";
import ToolIcon from "@/components/icons/ToolIcon";
import BuildingIcon from "@/components/icons/BuildingIcon";
import AudioIcon from "@/components/icons/AudioIcon";
import DocIcon from "@/components/icons/DocIcon";
import { QrCode, Languages, BookOpen, ShoppingBag, ChevronDown } from "lucide-react";
import {
  gameContentCategories,
  auxiliaryCategories,
  toolCategories,
  docCategories,
  communityCategories,
} from "@/data/categories";
import {
  StoreCategory,
  storeCategories,
  storeCategoryDetails,
} from "@/data/storeCategories";
import { BreadcrumbDropdown } from "@/components/BreadcrumbDropdown";

type ContentCategory = keyof typeof gameContentCategories;
type AuxiliaryCategory = keyof typeof auxiliaryCategories;

// 创作生态: tool + doc + community
type EcoSection = "tool" | "doc" | "community";
type ToolCategory = keyof typeof toolCategories;
type DocCategory = keyof typeof docCategories;
type CommunityCategory = keyof typeof communityCategories;

const contentCategoryList: { id: string; label: string }[] = [
  { id: "mod", label: "模组" },
  { id: "map", label: "地图" },
  { id: "datapack", label: "数据包" },
  { id: "modpack", label: "整合包" },
];

const auxiliaryCategoryList: { id: string; label: string }[] = [
  { id: "resourcepack", label: "材质" },
  { id: "shader", label: "光影" },
  { id: "building", label: "建筑" },
  { id: "audio", label: "音频" },
];

const ecoSections: { id: EcoSection; label: string }[] = [
  { id: "tool", label: "生态工具" },
  { id: "doc", label: "知识文档" },
  { id: "community", label: "社交社区" },
];

const toolCategoryList: { id: string; label: string }[] = [
  { id: "moddev", label: "模组开发" },
  { id: "mapmaking", label: "地形制作" },
  { id: "buildtool", label: "建筑创作" },
  { id: "resourcetool", label: "资源创作" },
  { id: "servertool", label: "服务器工具/插件" },
  { id: "general", label: "通用工具" },
];

const docCategoryList: { id: string; label: string }[] = [
  { id: "tutorial", label: "教程文档" },
  { id: "technical", label: "技术文档" },
  { id: "solution", label: "技术方案" },
  { id: "practice", label: "最佳实践" },
  { id: "reference", label: "参考资料" },
];

const communityCategoryList: { id: string; label: string }[] = [
  { id: "project", label: "项目" },
  { id: "user", label: "用户" },
  { id: "server", label: "服务器" },
];

// Mock data for resources
const mockResources: Record<string, Array<{ icon: React.ReactNode; title: string; author: string; description: string; downloads: number; likes: number }>> = {
  mod: [
    { icon: <ModIcon className="w-10 h-10" />, title: "Jade 洞察 (Jade Insight)", author: "茜特菈莉", description: "为 Jade 设计的扩展插件(Addon), 旨在填补原版信息框与新手之间的\"知识鸿沟\"。", downloads: 1234, likes: 89 },
    { icon: <ModIcon className="w-10 h-10" />, title: "工业时代3", author: "IC2Team", description: "经典科技模组，添加电力系统、机器和工业化生产线。", downloads: 50000, likes: 2100 },
  ],
  building: [
    { icon: <BuildingIcon className="w-10 h-10" />, title: "中世纪城堡", author: "ArchitectPro", description: "一座宏伟的中世纪风格城堡，包含完整的内部装饰和防御设施。", downloads: 3200, likes: 456 },
  ],
  audio: [
    { icon: <AudioIcon className="w-10 h-10" />, title: "自然环境音效包", author: "SoundScape", description: "替换游戏内的环境音效，包含更真实的风声、雨声和动物叫声。", downloads: 890, likes: 234 },
  ],
  gameSkin: [
    { icon: <ModIcon className="w-10 h-10" />, title: "星辰骑士皮肤包", author: "SkinMaster", description: "精心设计的星辰主题皮肤系列，包含多款独特的骑士造型。", downloads: 512, likes: 234 },
  ],
  communitySkin: [
    { icon: <ModIcon className="w-10 h-10" />, title: "炫彩动态头像框", author: "DesignPro", description: "多款精美动态头像框，让你的社区形象更加出众。", downloads: 320, likes: 156 },
  ],
  moddev: [
    { icon: <ToolIcon className="w-10 h-10" />, title: "Fabric Loom", author: "FabricMC", description: "Fabric模组开发的Gradle插件，简化开发环境搭建和构建流程。", downloads: 15000, likes: 890 },
  ],
  tutorial: [
    { icon: <DocIcon className="w-10 h-10" />, title: "Forge模组开发入门", author: "ModDevCN", description: "从零开始学习Forge模组开发，涵盖基础概念、物品、方块和实体创建。", downloads: 8900, likes: 1200 },
  ],
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Content & Auxiliary direct navigation
  const [contentCategory, setContentCategory] = useState<ContentCategory>("mod");
  const [auxiliaryCategory, setAuxiliaryCategory] = useState<AuxiliaryCategory>("resourcepack");

  // Which nav section is active: "content" | "auxiliary" | "eco"
  const [activeNav, setActiveNav] = useState<"content" | "auxiliary" | "eco">("content");

  // Filter tags
  const [filterTags, setFilterTags] = useState<Record<string, string[]>>({});

  // 创作生态 state
  const [ecoSection, setEcoSection] = useState<EcoSection>("tool");
  const [toolCategory, setToolCategory] = useState<ToolCategory>("moddev");
  const [docCategory, setDocCategory] = useState<DocCategory>("tutorial");
  const [communityCategory, setCommunityCategory] = useState<CommunityCategory>("project");
  const [ecoSubCategory, setEcoSubCategory] = useState("");

  // Store state
  const [storeCategory, setStoreCategory] = useState<StoreCategory>("gameSkin");
  const [storeSubCategory, setStoreSubCategory] = useState("");
  const [showStore, setShowStore] = useState(false);

  // Get the current active resource ID for filtering
  const getFilterResourceId = () => {
    if (activeNav === "content") return contentCategory;
    if (activeNav === "auxiliary") return auxiliaryCategory;
    return "";
  };

  // Get current resources for display
  const getCurrentResources = () => {
    if (showStore) {
      return mockResources[storeCategory] || [];
    }
    if (activeNav === "content") return mockResources[contentCategory] || mockResources.mod;
    if (activeNav === "auxiliary") return mockResources[auxiliaryCategory] || [];
    // eco
    if (ecoSection === "tool") return mockResources[toolCategory] || mockResources.moddev;
    if (ecoSection === "doc") return mockResources[docCategory] || mockResources.tutorial;
    return [];
  };

  const getEcoCategoryList = () => {
    switch (ecoSection) {
      case "tool": return toolCategoryList;
      case "doc": return docCategoryList;
      case "community": return communityCategoryList;
    }
  };

  const getEcoActiveCategory = () => {
    switch (ecoSection) {
      case "tool": return toolCategory;
      case "doc": return docCategory;
      case "community": return communityCategory;
    }
  };

  const handleEcoCategoryChange = (id: string) => {
    setEcoSubCategory("");
    switch (ecoSection) {
      case "tool": setToolCategory(id as ToolCategory); break;
      case "doc": setDocCategory(id as DocCategory); break;
      case "community": setCommunityCategory(id as CommunityCategory); break;
    }
  };

  const getEcoSubCategories = () => {
    if (ecoSection === "tool") {
      return toolCategories[toolCategory]?.subCategories || [];
    }
    if (ecoSection === "doc") {
      return docCategories[docCategory]?.subCategories || [];
    }
    if (ecoSection === "community") {
      return communityCategories[communityCategory]?.subCategories || [];
    }
    return [];
  };

  const handleFilterResourceChange = (id: string) => {
    // Determine if content or auxiliary
    if (contentCategoryList.some((c) => c.id === id)) {
      setActiveNav("content");
      setContentCategory(id as ContentCategory);
    } else {
      setActiveNav("auxiliary");
      setAuxiliaryCategory(id as AuxiliaryCategory);
    }
  };

  const storeSubCategories = storeCategoryDetails[storeCategory]?.subCategories || [];
  const ecoSubCategories = getEcoSubCategories();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content area */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {getCurrentResources().map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating action buttons */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <button className="p-2 bg-card rounded-lg shadow-card border border-border hover:shadow-card-hover transition-shadow">
          <QrCode className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 bg-card rounded-lg shadow-card border border-border hover:shadow-card-hover transition-shadow">
          <Languages className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="w-40 flex-shrink-0">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜索..." />
            </div>

            {/* 游戏内容 */}
            <BreadcrumbDropdown
              items={contentCategoryList}
              value={activeNav === "content" ? contentCategory : ""}
              onChange={(val) => {
                setActiveNav("content");
                setContentCategory(val as ContentCategory);
                setFilterTags({});
                setShowStore(false);
              }}
              placeholder="游戏内容"
            />

            {/* 辅助内容 */}
            <BreadcrumbDropdown
              items={auxiliaryCategoryList}
              value={activeNav === "auxiliary" ? auxiliaryCategory : ""}
              onChange={(val) => {
                setActiveNav("auxiliary");
                setAuxiliaryCategory(val as AuxiliaryCategory);
                setFilterTags({});
                setShowStore(false);
              }}
              placeholder="辅助内容"
            />

            {/* 筛选 */}
            {(activeNav === "content" || activeNav === "auxiliary") && !showStore && (
              <FilterPanel
                resourceId={getFilterResourceId()}
                selectedTags={filterTags}
                onTagsChange={setFilterTags}
                onResourceChange={handleFilterResourceChange}
              />
            )}

            {/* Divider */}
            <div className="w-px h-8 bg-border flex-shrink-0" />

            {/* 创作生态 */}
            <div className="flex items-center gap-1">
              <BreadcrumbNavigation
                levels={[
                  {
                    items: ecoSections,
                    value: activeNav === "eco" ? ecoSection : "",
                    onChange: (val) => {
                      setActiveNav("eco");
                      setEcoSection(val as EcoSection);
                      setEcoSubCategory("");
                      setFilterTags({});
                      setShowStore(false);
                    },
                    placeholder: "创作生态",
                  },
                  ...(activeNav === "eco"
                    ? [
                        {
                          items: getEcoCategoryList(),
                          value: getEcoActiveCategory(),
                          onChange: handleEcoCategoryChange,
                          placeholder: "类型",
                        },
                        ...(ecoSubCategories.length > 0
                          ? [{
                              items: [{ id: "", label: "全部" }, ...ecoSubCategories],
                              value: ecoSubCategory,
                              onChange: setEcoSubCategory,
                              placeholder: "全部",
                            }]
                          : []),
                      ]
                    : []),
                ]}
              />
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-border flex-shrink-0" />

            {/* Platform Store */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setShowStore(!showStore);
                  if (!showStore) setStoreSubCategory("");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  showStore
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>平台商城</span>
              </button>

              {showStore && (
                <div className="flex items-center border-l border-border pl-2">
                  <BreadcrumbNavigation
                    levels={[
                      {
                        items: storeCategories.map((cat) => ({ id: cat.id, label: cat.label })),
                        value: storeCategory,
                        onChange: (val) => {
                          setStoreCategory(val as StoreCategory);
                          setStoreSubCategory("");
                        },
                        placeholder: "形象类型",
                      },
                      ...(storeSubCategories.length > 0
                        ? [{
                            items: [{ id: "", label: "全部" }, ...storeSubCategories],
                            value: storeSubCategory,
                            onChange: setStoreSubCategory,
                            placeholder: "全部",
                          }]
                        : []),
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
