import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryTab from "@/components/CategoryTab";
import ResourceCard from "@/components/ResourceCard";
import SubCategoryDropdown from "@/components/SubCategoryDropdown";
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
import SkinIcon from "@/components/icons/SkinIcon";
import BuildingIcon from "@/components/icons/BuildingIcon";
import AudioIcon from "@/components/icons/AudioIcon";
import DocIcon from "@/components/icons/DocIcon";
import { QrCode, Languages, Box, Wrench, BookOpen } from "lucide-react";
import {
  MainCategory,
  mainCategories,
  gameContentCategories,
  toolCategories,
  docCategories,
  communityCategories,
} from "@/data/categories";

type ContentCategory = keyof typeof gameContentCategories | keyof typeof communityCategories;
type ToolCategory = keyof typeof toolCategories;
type DocCategory = keyof typeof docCategories;

const contentCategoryList: { id: ContentCategory; label: string; icon: React.ReactNode }[] = [
  { id: "mod", label: "模组", icon: <ModIcon className="w-4 h-4" /> },
  { id: "resourcepack", label: "材质包", icon: <ResourcePackIcon className="w-4 h-4" /> },
  { id: "shader", label: "光影", icon: <ShaderIcon className="w-4 h-4" /> },
  { id: "map", label: "地图", icon: <MapIcon className="w-4 h-4" /> },
  { id: "building", label: "建筑", icon: <BuildingIcon className="w-4 h-4" /> },
  { id: "skin", label: "形象", icon: <SkinIcon className="w-4 h-4" /> },
  { id: "datapack", label: "数据包", icon: <DataPackIcon className="w-4 h-4" /> },
  { id: "modpack", label: "整合包", icon: <ModpackIcon className="w-4 h-4" /> },
  { id: "audio", label: "音频", icon: <AudioIcon className="w-4 h-4" /> },
  { id: "project", label: "项目", icon: <ProjectIcon className="w-4 h-4" /> },
  { id: "user", label: "用户", icon: <UserIcon className="w-4 h-4" /> },
  { id: "server", label: "服务器", icon: <ServerIcon className="w-4 h-4" /> },
];

const toolCategoryList: { id: ToolCategory; label: string; icon: React.ReactNode }[] = [
  { id: "moddev", label: "模组开发", icon: <ModIcon className="w-4 h-4" /> },
  { id: "mapmaking", label: "地图制作", icon: <MapIcon className="w-4 h-4" /> },
  { id: "buildtool", label: "建筑创作", icon: <BuildingIcon className="w-4 h-4" /> },
  { id: "resourcetool", label: "资源创作", icon: <ResourcePackIcon className="w-4 h-4" /> },
  { id: "general", label: "通用工具", icon: <ToolIcon className="w-4 h-4" /> },
];

const docCategoryList: { id: DocCategory; label: string; icon: React.ReactNode }[] = [
  { id: "tutorial", label: "教程文档", icon: <BookOpen className="w-4 h-4" /> },
  { id: "technical", label: "技术文档", icon: <DocIcon className="w-4 h-4" /> },
  { id: "solution", label: "技术方案", icon: <DocIcon className="w-4 h-4" /> },
  { id: "practice", label: "最佳实践", icon: <DocIcon className="w-4 h-4" /> },
  { id: "reference", label: "参考资料", icon: <DocIcon className="w-4 h-4" /> },
];

// Mock data for resources
const mockResources = {
  mod: [
    {
      icon: <ModIcon className="w-10 h-10" />,
      title: "Jade 洞察 (Jade Insight)",
      author: "茜特菈莉",
      description: "为 Jade 设计的扩展插件(Addon), 旨在填补原版信息框与新手之间的\"知识鸿沟\"。",
      downloads: 1234,
      likes: 89,
    },
    {
      icon: <ModIcon className="w-10 h-10" />,
      title: "工业时代3",
      author: "IC2Team",
      description: "经典科技模组，添加电力系统、机器和工业化生产线。",
      downloads: 50000,
      likes: 2100,
    },
  ],
  building: [
    {
      icon: <BuildingIcon className="w-10 h-10" />,
      title: "中世纪城堡",
      author: "ArchitectPro",
      description: "一座宏伟的中世纪风格城堡，包含完整的内部装饰和防御设施。",
      downloads: 3200,
      likes: 456,
    },
  ],
  audio: [
    {
      icon: <AudioIcon className="w-10 h-10" />,
      title: "自然环境音效包",
      author: "SoundScape",
      description: "替换游戏内的环境音效，包含更真实的风声、雨声和动物叫声。",
      downloads: 890,
      likes: 234,
    },
  ],
  skin: [
    {
      icon: <SkinIcon className="w-10 h-10" />,
      title: "星辰骑士皮肤包",
      author: "SkinMaster",
      description: "精心设计的星辰主题皮肤系列，包含多款独特的骑士造型。",
      downloads: 512,
      likes: 234,
    },
  ],
  moddev: [
    {
      icon: <ToolIcon className="w-10 h-10" />,
      title: "Fabric Loom",
      author: "FabricMC",
      description: "Fabric模组开发的Gradle插件，简化开发环境搭建和构建流程。",
      downloads: 15000,
      likes: 890,
    },
  ],
  tutorial: [
    {
      icon: <DocIcon className="w-10 h-10" />,
      title: "Forge模组开发入门",
      author: "ModDevCN",
      description: "从零开始学习Forge模组开发，涵盖基础概念、物品、方块和实体创建。",
      downloads: 8900,
      likes: 1200,
    },
  ],
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mainCategory, setMainCategory] = useState<MainCategory>("content");
  const [contentCategory, setContentCategory] = useState<ContentCategory>("mod");
  const [toolCategory, setToolCategory] = useState<ToolCategory>("moddev");
  const [docCategory, setDocCategory] = useState<DocCategory>("tutorial");
  const [subCategory, setSubCategory] = useState("");

  const getActiveCategory = () => {
    switch (mainCategory) {
      case "content":
        return contentCategory;
      case "tool":
        return toolCategory;
      case "doc":
        return docCategory;
    }
  };

  const getCategoryList = () => {
    switch (mainCategory) {
      case "content":
        return contentCategoryList;
      case "tool":
        return toolCategoryList;
      case "doc":
        return docCategoryList;
    }
  };

  const getSubCategories = () => {
    const active = getActiveCategory();
    switch (mainCategory) {
      case "content":
        const contentCat = gameContentCategories[active as keyof typeof gameContentCategories];
        return contentCat?.subCategories || [];
      case "tool":
        const toolCat = toolCategories[active as keyof typeof toolCategories];
        return toolCat?.subCategories || [];
      case "doc":
        const docCat = docCategories[active as keyof typeof docCategories];
        return docCat?.subCategories || [];
      default:
        return [];
    }
  };

  const handleCategoryClick = (id: string) => {
    setSubCategory("");
    switch (mainCategory) {
      case "content":
        setContentCategory(id as ContentCategory);
        break;
      case "tool":
        setToolCategory(id as ToolCategory);
        break;
      case "doc":
        setDocCategory(id as DocCategory);
        break;
    }
  };

  const handleMainCategoryChange = (id: MainCategory) => {
    setMainCategory(id);
    setSubCategory("");
  };

  const getCurrentResources = () => {
    const active = getActiveCategory();
    return mockResources[active as keyof typeof mockResources] || mockResources.mod;
  };

  const getMainCategoryIcon = (id: MainCategory) => {
    switch (id) {
      case "content":
        return <Box className="w-4 h-4" />;
      case "tool":
        return <Wrench className="w-4 h-4" />;
      case "doc":
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const subCategories = getSubCategories();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content area */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Current filter info */}
          {subCategory && (
            <div className="mb-4 text-sm text-muted-foreground">
              当前筛选: {subCategories.find((c) => c.id === subCategory)?.label}
            </div>
          )}

          {/* Resource cards grid */}
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
          {/* Main categories row */}
          <div className="flex items-center gap-4 mb-3">
            <div className="w-48">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="搜索..."
              />
            </div>
            <div className="flex items-center gap-1 border-l border-border pl-4">
              {mainCategories.map((cat) => (
                <CategoryTab
                  key={cat.id}
                  icon={getMainCategoryIcon(cat.id)}
                  label={cat.label}
                  active={mainCategory === cat.id}
                  onClick={() => handleMainCategoryChange(cat.id)}
                />
              ))}
            </div>
          </div>

          {/* Sub categories row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 overflow-x-auto">
              <div className="flex items-center gap-1">
                {getCategoryList().map((category) => (
                  <CategoryTab
                    key={category.id}
                    icon={category.icon}
                    label={category.label}
                    active={getActiveCategory() === category.id}
                    onClick={() => handleCategoryClick(category.id)}
                  />
                ))}
              </div>
            </div>

            {/* Sub-category dropdown */}
            {subCategories.length > 0 && (
              <div className="flex-shrink-0 border-l border-border pl-2">
                <SubCategoryDropdown
                  categories={subCategories}
                  value={subCategory}
                  onChange={setSubCategory}
                  placeholder="全部子分类"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
