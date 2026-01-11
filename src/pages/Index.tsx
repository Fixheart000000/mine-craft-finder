import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryTab from "@/components/CategoryTab";
import ResourceCard from "@/components/ResourceCard";
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
import { QrCode, Languages } from "lucide-react";

type Category = 
  | "mod" 
  | "resourcepack" 
  | "shader" 
  | "datapack" 
  | "modpack" 
  | "map" 
  | "project" 
  | "user" 
  | "server"
  | "tool"
  | "skin";

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "mod", label: "模组", icon: <ModIcon className="w-4 h-4" /> },
  { id: "resourcepack", label: "资源包", icon: <ResourcePackIcon className="w-4 h-4" /> },
  { id: "shader", label: "光影", icon: <ShaderIcon className="w-4 h-4" /> },
  { id: "datapack", label: "数据包", icon: <DataPackIcon className="w-4 h-4" /> },
  { id: "modpack", label: "整合包", icon: <ModpackIcon className="w-4 h-4" /> },
  { id: "map", label: "地图", icon: <MapIcon className="w-4 h-4" /> },
  { id: "tool", label: "工具", icon: <ToolIcon className="w-4 h-4" /> },
  { id: "skin", label: "形象", icon: <SkinIcon className="w-4 h-4" /> },
  { id: "project", label: "项目", icon: <ProjectIcon className="w-4 h-4" /> },
  { id: "user", label: "用户", icon: <UserIcon className="w-4 h-4" /> },
  { id: "server", label: "服务器", icon: <ServerIcon className="w-4 h-4" /> },
];

// Mock data for resources
const mockResources = {
  mod: [
    {
      icon: <ModIcon className="w-10 h-10" />,
      title: "Jade 洞察 (Jade Insight)",
      author: "茜特菈莉",
      description: "为 Jade 设计的扩展插件(Addon), 旨在填补原版信息框与新手之间的\"知识鸿沟\"。它不仅...",
      downloads: 1,
      likes: 1,
    },
  ],
  tool: [
    {
      icon: <ToolIcon className="w-10 h-10" />,
      title: "MC 皮肤编辑器",
      author: "PixelCraft",
      description: "功能强大的在线皮肤编辑工具，支持3D预览和多图层编辑，让皮肤创作更简单。",
      downloads: 256,
      likes: 89,
    },
    {
      icon: <ToolIcon className="w-10 h-10" />,
      title: "地图生成器",
      author: "WorldBuilder",
      description: "自动生成各种风格的地图，支持自定义地形、建筑和生态群系。",
      downloads: 128,
      likes: 45,
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
    {
      icon: <SkinIcon className="w-10 h-10" />,
      title: "赛博朋克形象",
      author: "NeonArtist",
      description: "霓虹灯风格的赛博朋克主题皮肤，带有发光效果的科幻造型。",
      downloads: 384,
      likes: 167,
    },
  ],
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("mod");

  const getCurrentResources = () => {
    return mockResources[activeCategory as keyof typeof mockResources] || mockResources.mod;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content area */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
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

      {/* Bottom search bar and categories */}
      <div className="sticky bottom-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Search input */}
            <div className="w-48">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="搜索..."
              />
            </div>

            {/* Category tabs */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex items-center gap-1">
                {categories.map((category) => (
                  <CategoryTab
                    key={category.id}
                    icon={category.icon}
                    label={category.label}
                    active={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
