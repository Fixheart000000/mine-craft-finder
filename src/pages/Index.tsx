import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import SearchBar from "@/components/SearchBar";
import ResourceCard from "@/components/ResourceCard";
import SocialSearchResult from "@/components/SocialSearchResult";
import FilterPanel, { ResourceTypeId } from "@/components/FilterPanel";
import ModIcon from "@/components/icons/ModIcon";
import BuildingIcon from "@/components/icons/BuildingIcon";
import AudioIcon from "@/components/icons/AudioIcon";
import ToolIcon from "@/components/icons/ToolIcon";
import DocIcon from "@/components/icons/DocIcon";
import SkinIcon from "@/components/icons/SkinIcon";
import MapIcon from "@/components/icons/MapIcon";
import DataPackIcon from "@/components/icons/DataPackIcon";
import ModpackIcon from "@/components/icons/ModpackIcon";
import ServerIcon from "@/components/icons/ServerIcon";
import ResourcePackIcon from "@/components/icons/ResourcePackIcon";
import ShaderIcon from "@/components/icons/ShaderIcon";
import { QrCode, Languages, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Mock data for resources
const mockResources: Record<string, Array<{ icon: React.ReactNode; title: string; author: string; description: string; downloads: number; likes: number; resourceType: string; resourceId: string }>> = {
  mod: [
    { icon: <ModIcon className="w-10 h-10" />, title: "机械动力：工业革命", author: "创世工匠", description: "一款专注于机械自动化与工业生产的科技模组。引入全新的动能传输系统、多种类型的机器设备，以及复杂的自动化生产线。", downloads: 125000, likes: 8900, resourceType: "mod", resourceId: "1" },
    { icon: <ModIcon className="w-10 h-10" />, title: "暮色森林（搬运）", author: "Benimatic（原作者）", description: "探索神秘的暮色森林维度，挑战强大的Boss，发现隐藏的宝藏和古老的遗迹。已获得原作者授权。", downloads: 200000, likes: 15000, resourceType: "mod", resourceId: "2" },
  ],
  map: [
    { icon: <MapIcon className="w-10 h-10" />, title: "失落王国：暗影诅咒", author: "暗影建筑师", description: "一款沉浸式冒险地图，讲述一个被诅咒笼罩的古老王国的故事。包含完整的剧情线、自定义音效和精心设计的机关陷阱。", downloads: 45000, likes: 3200, resourceType: "map", resourceId: "1" },
    { icon: <MapIcon className="w-10 h-10" />, title: "天空岛屿生存", author: "SkyBuilder", description: "在悬浮于虚空之上的岛屿群中生存，有限的资源，无限的挑战。", downloads: 32000, likes: 2100, resourceType: "map", resourceId: "2" },
  ],
  datapack: [
    { icon: <DataPackIcon className="w-10 h-10" />, title: "原版增强：生存进化", author: "数据大师", description: "一个轻量级但功能丰富的数据包，在不改变原版风格的前提下增强生存体验。新增多种合成配方、改进的刷怪机制。", downloads: 89000, likes: 5600, resourceType: "datapack", resourceId: "1" },
    { icon: <DataPackIcon className="w-10 h-10" />, title: "更多附魔", author: "EnchantMaster", description: "添加30+种新附魔，让装备和工具有更多可能性。", downloads: 56000, likes: 3400, resourceType: "datapack", resourceId: "2" },
  ],
  modpack: [
    { icon: <ModpackIcon className="w-10 h-10" />, title: "科技纪元：太空探索", author: "整合包工作室", description: "一款以太空探索为主题的科技向整合包。从地球起步，建立工业基础，发展航天技术，最终征服星辰大海。", downloads: 230000, likes: 15600, resourceType: "modpack", resourceId: "1" },
    { icon: <ModpackIcon className="w-10 h-10" />, title: "魔法世界", author: "MagicTeam", description: "沉浸式魔法体验整合包，包含多个主流魔法模组，完整的任务线引导。", downloads: 180000, likes: 12000, resourceType: "modpack", resourceId: "2" },
  ],
  server: [
    { icon: <ServerIcon className="w-10 h-10" />, title: "纯净生存服", author: "纯净团队", description: "原版纯净生存体验，无模组修改，仅基础服务端插件。提供原版生存、原版极限、原版创造三种游戏模式。", downloads: 0, likes: 8900, resourceType: "server", resourceId: "1" },
    { icon: <ServerIcon className="w-10 h-10" />, title: "方块王国 RPG", author: "王国运营组", description: "一个专注于RPG体验的整合服。拥有独特的职业系统、经济系统、公会战和丰富的副本内容，包含科技、魔法、冒险等多种模组。", downloads: 0, likes: 15600, resourceType: "server", resourceId: "2" },
  ],
  resourcepack: [
    { icon: <ResourcePackIcon className="w-10 h-10" />, title: "像素幻想 32x", author: "像素艺术家", description: "一款融合像素艺术与奇幻风格的材质包。在保持原版像素感的同时，为每个方块和物品注入更多细节和色彩。", downloads: 34000, likes: 2100, resourceType: "resourcepack", resourceId: "1" },
    { icon: <ResourcePackIcon className="w-10 h-10" />, title: "真实高清 256x", author: "RealisticTeam", description: "超高清写实材质包，让Minecraft焕然一新。", downloads: 89000, likes: 6700, resourceType: "resourcepack", resourceId: "2" },
  ],
  shader: [
    { icon: <ShaderIcon className="w-10 h-10" />, title: "柔和光影 Pro", author: "光影工作室", description: "一款追求真实感与性能平衡的光影包。采用优化的光照算法，实现柔和的阴影、逼真的水面反射和动态云彩。", downloads: 560000, likes: 32000, resourceType: "shader", resourceId: "1" },
    { icon: <ShaderIcon className="w-10 h-10" />, title: "电影级光影", author: "CinemaShaders", description: "专业级光影效果，适合截图和视频制作。", downloads: 120000, likes: 8900, resourceType: "shader", resourceId: "2" },
  ],
  building: [
    { icon: <BuildingIcon className="w-10 h-10" />, title: "中世纪城镇建筑包", author: "建筑大师", description: "一套完整的中世纪风格建筑 schematic 文件包。包含房屋、教堂、城堡、市场等20余种建筑。", downloads: 78000, likes: 4500, resourceType: "building", resourceId: "1" },
    { icon: <BuildingIcon className="w-10 h-10" />, title: "现代都市建筑集", author: "ModernBuilder", description: "现代风格建筑合集，包含摩天大楼、商场、住宅等。", downloads: 45000, likes: 3200, resourceType: "building", resourceId: "2" },
  ],
  audio: [
    { icon: <AudioIcon className="w-10 h-10" />, title: "沉浸式环境音效包", author: "音效设计师", description: "一套高质量的环境音效资源包。替换和新增了游戏中的环境音效，包括风声、雨声、鸟鸣、洞穴回声等。", downloads: 23000, likes: 1800, resourceType: "audio", resourceId: "1" },
    { icon: <AudioIcon className="w-10 h-10" />, title: "史诗音乐包", author: "MusicMaster", description: "替换游戏背景音乐为史诗级管弦乐，提升游戏氛围。", downloads: 34000, likes: 2800, resourceType: "audio", resourceId: "2" },
  ],
  ecoTool: [
    { icon: <ToolIcon className="w-10 h-10" />, title: "MCreator", author: "Pylo", description: "可视化模组制作工具，无需编程基础即可创建自定义模组。支持物品、方块、生物等多种内容类型。", downloads: 500000, likes: 25000, resourceType: "ecoTool", resourceId: "1" },
    { icon: <ToolIcon className="w-10 h-10" />, title: "Blockbench", author: "JannisX11", description: "专业的3D建模工具，用于创建Minecraft模型和材质。", downloads: 800000, likes: 45000, resourceType: "ecoTool", resourceId: "2" },
  ],
  doc: [
    { icon: <DocIcon className="w-10 h-10" />, title: "Forge模组开发完全指南", author: "ModDevCN", description: "从零开始学习Forge模组开发，涵盖基础概念、物品、方块、实体、网络通信等全部内容。", downloads: 89000, likes: 12000, resourceType: "doc", resourceId: "1" },
    { icon: <DocIcon className="w-10 h-10" />, title: "命令方块教程合集", author: "CommandExpert", description: "详细的命令方块使用教程，从入门到精通。", downloads: 56000, likes: 7800, resourceType: "doc", resourceId: "2" },
  ],
  image: [
    { icon: <SkinIcon className="w-10 h-10" />, title: "星际战士皮肤系列", author: "像素画师", description: "一套以科幻太空为主题的皮肤系列，包含多款独特的星际战士造型。", downloads: 12000, likes: 890, resourceType: "image", resourceId: "1" },
    { icon: <SkinIcon className="w-10 h-10" />, title: "幻影刺客限定皮肤", author: "暗影工作室", description: "一款精心设计的独特皮肤，采用定制售卖方式，第一个购买的用户将永久独享。", downloads: 0, likes: 367, resourceType: "image", resourceId: "2" },
    { icon: <SkinIcon className="w-10 h-10" />, title: "龙骑士限定皮肤", author: "传说工作室", description: "一款极具收藏价值的限定皮肤，以东方龙文化为灵感，融合现代设计元素。", downloads: 0, likes: 378, resourceType: "image", resourceId: "3" },
    { icon: <SkinIcon className="w-10 h-10" />, title: "季节主题皮肤合集", author: "四季工坊", description: "一套持续更新的季节主题皮肤合集，包含春、夏、秋、冬四个系列。", downloads: 0, likes: 534, resourceType: "image", resourceId: "4" },
    { icon: <SkinIcon className="w-10 h-10" />, title: "经典像素皮肤合集（搬运）", author: "PixelMaster（原作者）", description: "一套经典的像素风格皮肤合集，已获得原作者授权。", downloads: 35000, likes: 1800, resourceType: "image", resourceId: "5" },
  ],
};

const mockCommunityResults = [
  { type: "user" as const, name: "茜特菈莉", description: "独立模组开发者，Jade系列作者" },
  { type: "team" as const, name: "FabricMC", description: "Fabric生态开发团队", memberCount: 45, status: "活跃中" },
  { type: "project" as const, name: "星辰骑士计划", description: "大型RPG整合包协作项目", memberCount: 12, status: "招募中", projectId: "modpack-1", projectType: "modpack", projectStatus: "筹备中" },
  { type: "project" as const, name: "星辰魔法：元素觉醒", description: "一款正在开发中的大型魔法模组", memberCount: 5, status: "开发中", projectId: "mod-1", projectType: "mod", projectStatus: "筹备中" },
  { type: "project" as const, name: "工业革命2.0", description: "机械动力模组的续作", memberCount: 8, status: "招募中", projectId: "mod-2", projectType: "mod", projectStatus: "筹备中" },
  { type: "project" as const, name: "失落文明：亚特兰蒂斯", description: "大型冒险地图项目", memberCount: 3, status: "开发中", projectId: "map-1", projectType: "map", projectStatus: "筹备中" },
  { type: "project" as const, name: "末日生存服务器", description: "末日生存主题服务器项目", memberCount: 6, status: "开发中", projectId: "server-1", projectType: "server", projectStatus: "筹备中" },
  { type: "project" as const, name: "神秘生物学：深渊探索", description: "深海生物群系与深渊维度模组", memberCount: 8, status: "开发中", projectId: "mod-3", projectType: "mod", projectStatus: "制作中" },
];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ResourceTypeId | "all">("mod");
  const [filterTags, setFilterTags] = useState<Record<string, string[]>>({});
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  const getFilterResourceId = (): ResourceTypeId => {
    return activeCategory === "all" ? "mod" : activeCategory;
  };

  const getCurrentResources = () => {
    if (activeCategory === "community") return [];
    if (activeCategory === "all") {
      return Object.values(mockResources).flat();
    }
    return mockResources[activeCategory] || [];
  };

  const getFilteredCommunityResults = () => {
    let results = mockCommunityResults;
    
    const directionTags = filterTags["direction"] || [];
    const projectTypeTags = filterTags["projectType"] || [];
    const projectStatusTags = filterTags["projectStatus"] || [];
    const teamTypeTags = filterTags["teamType"] || [];
    
    if (directionTags.length > 0) {
      results = results.filter(result => {
        if (directionTags.includes("user") && result.type === "user") return true;
        if (directionTags.includes("team") && result.type === "team") return true;
        if (directionTags.includes("project") && result.type === "project") return true;
        return false;
      });
    }
    
    if (projectTypeTags.length > 0) {
      results = results.filter(result => {
        if (result.type === "project" && "projectType" in result) {
          return projectTypeTags.includes(result.projectType as string);
        }
        return false;
      });
    }
    
    if (projectStatusTags.length > 0) {
      results = results.filter(result => {
        if (result.type === "project" && "projectStatus" in result) {
          const statusMap: Record<string, string> = {
            "preparing": "筹备中",
            "inProgress": "制作中"
          };
          return projectStatusTags.some(tag => statusMap[tag] === result.projectStatus);
        }
        return false;
      });
    }
    
    if (teamTypeTags.length > 0) {
      results = results.filter(result => {
        return result.type === "team";
      });
    }
    
    return results;
  };

  const handleCategoryChange = (id: string) => {
    if (id === "all") {
      setActiveCategory("all");
    } else {
      setActiveCategory(id as ResourceTypeId);
    }
    setFilterTags({});
  };

  const handleFilterResourceChange = (id: ResourceTypeId) => {
    setActiveCategory(id);
  };

  const showCommunity = activeCategory === "all" || activeCategory === "community";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Resource cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {getCurrentResources().map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>

          {/* Community results */}
          {showCommunity && (
            <div className="mt-6">
              {activeCategory === "all" && (
                <h3 className="text-sm font-medium text-muted-foreground mb-3">社交社区</h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {getFilteredCommunityResults().map((result, i) => (
                  <SocialSearchResult key={i} {...result} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <button className="p-2 bg-card rounded-lg shadow-card border border-border hover:shadow-card-hover transition-shadow">
          <QrCode className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 bg-card rounded-lg shadow-card border border-border hover:shadow-card-hover transition-shadow">
          <Languages className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="sticky bottom-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-40 flex-shrink-0">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜索..." />
            </div>

            <FilterPanel
              resourceId={getFilterResourceId()}
              selectedTags={filterTags}
              onTagsChange={setFilterTags}
              onResourceChange={handleFilterResourceChange}
            />

            <Button
              size="sm"
              className="h-9 px-3 text-xs gap-1"
              onClick={() => setShowCreateProjectModal(true)}
            >
              <Plus className="w-3.5 h-3.5" /> 创建项目
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showCreateProjectModal} onOpenChange={setShowCreateProjectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>创建新项目</DialogTitle>
            <DialogDescription>
              创建一个新项目，开始您的创作之旅
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="bg-secondary/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">项目说明</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 创建后可在编辑页面设置项目类型和制作形式</li>
                <li>• 项目完成后上传首个版本将进入审核流程</li>
                <li>• 审核通过后项目将转为对应类型的资源</li>
              </ul>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-end gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setShowCreateProjectModal(false);
              }}
            >
              取消
            </Button>
            <Button 
              size="sm"
              onClick={() => {
                console.log("创建项目");
                setShowCreateProjectModal(false);
                navigate({ 
                  to: "/project/$id", 
                  params: { id: "project-new" }
                });
              }}
            >
              开始创建
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
