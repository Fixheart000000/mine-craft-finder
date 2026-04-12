import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import SearchBar from "#/components/SearchBar";
import ResourceCard from "#/components/ResourceCard";
import SocialSearchResult from "#/components/SocialSearchResult";
import FilterPanel, { ResourceTypeId } from "#/components/FilterPanel";
import ModIcon from "#/components/icons/ModIcon";
import BuildingIcon from "#/components/icons/BuildingIcon";
import AudioIcon from "#/components/icons/AudioIcon";
import ToolIcon from "#/components/icons/ToolIcon";
import DocIcon from "#/components/icons/DocIcon";
import SkinIcon from "#/components/icons/SkinIcon";
import MapIcon from "#/components/icons/MapIcon";
import DataPackIcon from "#/components/icons/DataPackIcon";
import ModpackIcon from "#/components/icons/ModpackIcon";
import ServerIcon from "#/components/icons/ServerIcon";
import ResourcePackIcon from "#/components/icons/ResourcePackIcon";
import ShaderIcon from "#/components/icons/ShaderIcon";
import { ArrowLeft, QrCode, Languages, Plus, Users, ChevronDown, ChevronUp, Bell, User, Home, Briefcase, Calendar, Download, Heart, X, Eye, Edit2, Send, BookmarkPlus, ChevronRight, Image, Link2, Trash2, Save, XCircle, History, Upload, Star, StarOff, Edit, Calendar as CalendarIcon, Settings } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Separator } from "#/components/ui/separator";
import { Textarea } from "#/components/ui/textarea";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Input } from "#/components/ui/input";

// Mock data for resources
const mockResources: Record<string, Array<{ icon: React.ReactNode; title: string; author: string; description: string; downloads: number; likes: number; resourceType: string; resourceId: string; serverType?: string; onlinePlayers?: number; maxPlayers?: number; version?: string; ip?: string }>> = {
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
    { icon: <ServerIcon className="w-10 h-10" />, title: "纯净生存服务器", author: "纯净团队", description: "原版纯净生存体验，无模组修改，仅基础服务端插件。提供原版生存、原版极限、原版创造三种游戏模式。", downloads: 0, likes: 8900, resourceType: "server", serverType: "vanilla", resourceId: "1", onlinePlayers: 128, maxPlayers: 200, version: "1.20.1", ip: "mc.vanilla-survival.com" },
    { icon: <ServerIcon className="w-10 h-10" />, title: "方块王国 RPG", author: "王国运营团队", description: "一个专注于RPG体验的整合服。拥有独特的职业系统、经济系统、公会战和丰富的副本内容，包含科技、魔法、冒险等多种模组。", downloads: 0, likes: 15600, resourceType: "server", serverType: "modded", resourceId: "2", onlinePlayers: 356, maxPlayers: 500, version: "1.20.1", ip: "mc.block-kingdom.com" },
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
    { icon: <BuildingIcon className="w-10 h-10" />, title: "现代都市建筑", author: "ModernBuilder", description: "现代风格建筑合集，包含摩天大楼、商场、住宅等。", downloads: 45000, likes: 3200, resourceType: "building", resourceId: "2" },
  ],
  audio: [
    { icon: <AudioIcon className="w-10 h-10" />, title: "沉浸式环境音效包", author: "音效设计师", description: "一套高质量的环境音效资源包。替换和新增了游戏中的环境音效，包括风声、雨声、鸟鸣、洞穴回声等。", downloads: 23000, likes: 1800, resourceType: "audio", resourceId: "1" },
    { icon: <AudioIcon className="w-10 h-10" />, title: "史诗音乐", author: "MusicMaster", description: "替换游戏背景音乐为史诗级管弦乐，提升游戏氛围。", downloads: 34000, likes: 2800, resourceType: "audio", resourceId: "2" },
  ],
  ecoTool: [
    { icon: <ToolIcon className="w-10 h-10" />, title: "MCreator", author: "Pylo", description: "可视化模组制作工具，无需编程基础即可创建自定义模组。支持物品、方块、生物等多种内容类型。", downloads: 500000, likes: 25000, resourceType: "ecoTool", resourceId: "1" },
    { icon: <ToolIcon className="w-10 h-10" />, title: "Blockbench", author: "JannisX11", description: "专业3D建模工具，用于创建Minecraft模型和材质。", downloads: 800000, likes: 45000, resourceType: "ecoTool", resourceId: "2" },
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
  { type: "user" as const, name: "茜特菈莉", description: "独立模组开发者，Jade系列作者", userType: "creator", socialIntent: "meetCreator" },
  { type: "user" as const, name: "PixelArtist", description: "职业皮肤和材质创作者", userType: "creator", socialIntent: "meetFriend" },
  { type: "user" as const, name: "矿业大亨", description: "专注服务器插件开发", userType: "producer", socialIntent: "meetInvestor" },
  { type: "user" as const, name: "风投小明", description: "游戏行业天使投资人", userType: "investor", socialIntent: "meetProducer" },
  { type: "user" as const, name: "普通玩家01", description: "热爱MC的休闲玩家一枚", userType: "normal", socialIntent: "none" },
  { type: "user" as const, name: "建筑大师", description: "专业MC建筑设计", userType: "creator", socialIntent: "meetFriend" },
  { type: "team" as const, name: "FabricMC", description: "Fabric生态的核心开发团队，致力于为 Minecraft 社区提供开放、轻量的模组加载平台。", memberCount: 45, status: "活跃", teamType: "creator" },
  { type: "team" as const, name: "Hypixel", description: "Hypixel是全球最大的 Minecraft 服务器网络之一，提供各种小游戏和社区活动。", memberCount: 85, status: "活跃", teamType: "producer" },
  { type: "team" as const, name: "CurseForge", description: "CurseForge是最大的 Minecraft 模组分发平台之一，为开发者和玩家提供模组分享和下载服务。", memberCount: 60, status: "活跃", teamType: "producer" },
  { type: "team" as const, name: "Mojang Studios", description: "Mojang Studios是Minecraft 的官方开发团队，负责游戏的核心开发和更新。", memberCount: 150, status: "活跃", teamType: "creator" },
  { type: "team" as const, name: "OptiFine", description: "OptiFine是最受欢迎的Minecraft优化模组，提供性能提升和视觉增强功能。", memberCount: 10, status: "活跃", teamType: "creator" },
  { type: "team" as const, name: "MC投资联盟", description: "专注于Minecraft生态系统的投资机构，致力于发现和支持有潜力的Minecraft相关项目和团队。", memberCount: 8, status: "活跃", teamType: "investor" },
  { type: "project" as const, name: "星辰骑士计划", description: "大型RPG整合包协作项目", memberCount: 12, status: "招募中", projectId: "modpack-1", projectType: "modpack", projectStatus: "筹备中" },
  { type: "project" as const, name: "星辰魔法：元素觉醒", description: "一款正在开发中的大型魔法模组", memberCount: 5, status: "开发中", projectId: "mod-1", projectType: "mod", projectStatus: "筹备中" },
  { type: "project" as const, name: "工业革命2.0", description: "机械动力模组的续作", memberCount: 8, status: "招募中", projectId: "mod-2", projectType: "mod", projectStatus: "筹备中" },
  { type: "project" as const, name: "失落文明：亚特兰蒂斯", description: "大型冒险地图项目", memberCount: 3, status: "开发中", projectId: "map-1", projectType: "map", projectStatus: "筹备中" },
  { type: "project" as const, name: "末日生存服务器", description: "末日生存主题服务器项目", memberCount: 6, status: "开发中", projectId: "server-1", projectType: "server", projectStatus: "筹备中" },
  { type: "project" as const, name: "神秘生物学：深渊探索", description: "深海生物群系与深渊维度模组", memberCount: 8, status: "开发中", projectId: "mod-3", projectType: "mod", projectStatus: "制作中" },
];

const allHotWordCategories = [
  { id: "items", label: "物品/方块", description: "新增的物品、方块、材料等" },
  { id: "tools", label: "工具/装备", description: "工具、武器、盔甲等装备类物品" },
  { id: "crops", label: "农作物/食材", description: "作物、食材、原料等" },
  { id: "foods", label: "食物/料理", description: "可食用的食物、料理等" },
  { id: "biomes", label: "群系/群落", description: "生物群系、地形类型" },
  { id: "dimensions", label: "世界/维度", description: "新维度、传送门" },
  { id: "mobs", label: "生物/实体", description: "友好生物、中立生物、敌对生物、NPC等" },
  { id: "bosses", label: "Boss/首领", description: "Boss怪物、首领级敌人" },
  { id: "enchantments", label: "附魔/魔咒", description: "附魔效果、魔法" },
  { id: "potions", label: "药水/药剂", description: "药水、药剂、饮品效果" },
  { id: "buffs", label: "BUFF/DEBUFF", description: "状态效果、增益/减益" },
  { id: "machines", label: "机器/设备", description: "机器、设备、工作台等" },
  { id: "multiblocks", label: "多方块结构", description: "需要多方块搭建的结构" },
  { id: "energy", label: "能源/动力", description: "能源系统、动力系统" },
  { id: "logistics", label: "物流/管道", description: "物流系统、管道传输" },
  { id: "spells", label: "法术/咒语", description: "魔法系统、法术技能" },
  { id: "rituals", label: "仪式/祭坛", description: "魔法仪式、祭坛结构" },
  { id: "structures", label: "结构/建筑", description: "自然生成的结构、建筑" },
  { id: "dungeons", label: "地牢/副本", description: "地牢、副本、迷宫" },
  { id: "naturalGen", label: "自然生成", description: "自然生成的方块、矿物等" },
  { id: "ores", label: "矿物/资源", description: "矿物、资源、原材料" },
  { id: "crafting", label: "合成/配方", description: "合成配方、加工方法" },
  { id: "redstone", label: "红石/电路", description: "红石系统、电路元件" },
  { id: "quests", label: "任务/成就", description: "任务系统、成就系统" },
  { id: "trading", label: "交易/经济", description: "交易系统、经济系统" },
  { id: "villagers", label: "村民/交易", description: "村民职业、交易内容" },
  { id: "skills", label: "技能/能力", description: "技能系统、能力系统" },
  { id: "hotkeys", label: "热键/指令", description: "快捷键、指令" },
  { id: "gameSettings", label: "游戏设定", description: "游戏机制、系统设置" },
  { id: "mechanics", label: "机制/系统", description: "核心机制、游戏系统" },
];

const mockHotWordContents: Record<string, string[]> = {
  items: ["动力轴", "传送带", "机械臂"],
  tools: ["扳手", "应力计"],
  machines: ["搅拌机", "水车"],
  multiblocks: [],
};

// Mock data for announcements
const mockAnnouncements = [
  { id: 1, title: "网站更新公告", content: "我们的网站已经更新到最新版本，新增了项目管理功能和团队协作工具。", date: "2026-04-10" },
  { id: 2, title: "模组大赛开启", content: "第一届Minecraft模组创作大赛正式开始，欢迎各位开发者踊跃参加！", date: "2026-04-05" },
  { id: 3, title: "服务器维护通知", content: "将于4月5日进行服务器维护，预计维护时间为2小时。", date: "2026-04-01" },
];

// Mock data for team dynamics
const mockTeamDynamics = [
  { id: 1, teamName: "FabricMC", content: "Fabric 1.21 正式版发布，支持最新版本的Minecraft。", date: "2026-04-12" },
  { id: 2, teamName: "Hypixel", content: "Hypixel 推出全新小游戏'星际战争'，欢迎各位玩家体验。", date: "2026-04-11" },
  { id: 3, teamName: "Mojang Studios", content: "Minecraft 1.21.1 补丁更新，修复了多个游戏漏洞。", date: "2026-04-10" },
  { id: 4, teamName: "OptiFine", content: "OptiFine 1.20.6 预览版发布，带来性能优化和新特性。", date: "2026-04-09" },
];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ResourceTypeId | "all">('all');
  const [filterTags, setFilterTags] = useState<Record<string, string[]>>({});
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [sortBy, setSortBy] = useState<'downloads' | 'likes' | 'date'>('downloads');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<any>(null);
  
  // Section expansion states
  const [panelExpanded, setPanelExpanded] = useState(false);

  // Resource detail states
  const [detailTab, setDetailTab] = useState("intro");
  const [detailResourceType, setDetailResourceType] = useState<"mod" | "map" | "datapack" | "modpack" | "server" | "resourcepack" | "shader" | "building" | "audio" | "ecoTool" | "doc" | "image">("all");
  const [contentDetails, setContentDetails] = useState<Record<string, Record<string, string[]>>>({});
  
  // Gallery states
  const [galleryImages, setGalleryImages] = useState([
    { id: "1", url: "", caption: "自动化农场全貌", uploader: "玩家A", uploadDate: "2024-01-15", status: "approved" as const },
    { id: "2", url: "", caption: "机械臂工作状态", uploader: "玩家B", uploadDate: "2024-01-16", status: "approved" as const },
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newGalleryImage, setNewGalleryImage] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");
  
  // Guides
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showGuideDetailModal, setShowGuideDetailModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [newGuideTitle, setNewGuideTitle] = useState("");
  const [newGuideContent, setNewGuideContent] = useState("");
  const [guides, setGuides] = useState([
    { id: "1", title: "机械动力模组入门指南", author: "资深玩家A", publishDate: "2024-01-15", views: 12580, likes: 342, content: "详细的入门教程..", status: "approved" as const },
    { id: "2", title: "高级自动化系统设计", author: "技术大佬B", publishDate: "2024-01-18", views: 8956, likes: 256, content: "进阶技术..", status: "approved" as const },
  ]);
  
  // Download versions
  const [versionFilter, setVersionFilter] = useState("all");
  const [loaderFilter, setLoaderFilter] = useState("all");
  const [selectedDownloadVersion, setSelectedDownloadVersion] = useState<string>("1");
  const [showDownloadUploadModal, setShowDownloadUploadModal] = useState(false);
  const [downloadUploadTab, setDownloadUploadTab] = useState<"version" | "related">("version");
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showObtainMethodModal, setShowObtainMethodModal] = useState(false);
  
  // Licenses
  const [showLicenseSubmitModal, setShowLicenseSubmitModal] = useState(false);
  const [showLicenseDetailModal, setShowLicenseDetailModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<{type: string; title: string; description: string} | null>(null);
  const [selectedLicenseTemplate, setSelectedLicenseTemplate] = useState<"original-normal" | "original-image" | "repost-normal" | "repost-image" | null>(null);
  const [newLicenseContent, setNewLicenseContent] = useState("");
  
  const resourceVersions = [
    { id: "1", version: "1.20.1-0.5.1f", gameVersion: "1.20.1", loader: "Forge", releaseDate: "2024-03-15", downloads: 125430, fileSize: "4.2 MB", changelog: "修复了多个崩溃问题，优化了性能", isLatest: true },
    { id: "2", version: "1.20.1-0.5.1e", gameVersion: "1.20.1", loader: "Forge", releaseDate: "2024-03-10", downloads: 98532, fileSize: "4.1 MB", changelog: "新增了自动化农场系统", isLatest: false },
    { id: "3", version: "1.20.1-0.5.1d", gameVersion: "1.20.1", loader: "Fabric", releaseDate: "2024-03-08", downloads: 76234, fileSize: "3.9 MB", changelog: "Fabric 版本首发", isLatest: false },
  ];

  const relatedVersions = [
    {
      id: "1",
      prerequisites: [
        { id: "1", name: "机械核心", description: "机械动力前置核心", author: "创世工匠", downloads: 2500000 },
        { id: "2", name: "Fabric API", description: "Fabric 模组基础 API", author: "FabricMC", downloads: 15000000 },
      ],
      dependencies: [
        { id: "1", name: "能量接口", description: "通用能量系统接口", author: "能源工作室", downloads: 850000 },
      ],
      integrations: [
        { id: "1", name: "应用能源2", description: "AE2 ME 系统深度联动", author: "Applied Energistics", downloads: 8000000 },
        { id: "2", name: "热力膨胀", description: "跨模组能源传输", author: "Team CoFH", downloads: 6500000 },
      ]
    },
    {
      id: "2",
      prerequisites: [
        { id: "1", name: "机械核心", description: "机械动力前置核心", author: "创世工匠", downloads: 2500000 },
        { id: "2", name: "Fabric API", description: "Fabric 模组基础 API", author: "FabricMC", downloads: 15000000 },
      ],
      dependencies: [],
      integrations: [
        { id: "1", name: "应用能源2", description: "AE2 ME 系统深度联动", author: "Applied Energistics", downloads: 8000000 },
      ]
    },
    {
      id: "3",
      prerequisites: [
        { id: "1", name: "机械核心", description: "机械动力前置核心", author: "创世工匠", downloads: 2500000 },
        { id: "2", name: "Fabric API", description: "Fabric 模组基础 API", author: "FabricMC", downloads: 15000000 },
      ],
      dependencies: [],
      integrations: []
    }
  ];

  // ===== WIKI ENTRY EDITOR STATES =====
  const [showImageCaption, setShowImageCaption] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");
  const [entryEditData, setEntryEditData] = useState<any>(null);
  const [hotWordContents, setHotWordContents] = useState<Record<string, string[]>>(mockHotWordContents);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["items"]));
  const [selectedEntry, setSelectedEntry] = useState<{ category: string; item: string } | null>(null);
  const [showContentUploadModal, setShowContentUploadModal] = useState(false);
  const [addFunctionTab, setAddFunctionTab] = useState<"entry" | "category">("entry");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [newHotWord, setNewHotWord] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) newExpanded.delete(categoryId);
    else newExpanded.add(categoryId);
    setExpandedCategories(newExpanded);
  };

  const handleAddHotWord = () => {
    if (!selectedCategory || !newHotWord.trim()) return;
    setHotWordContents(prev => ({
      ...prev,
      [selectedCategory]: [...(prev[selectedCategory] || []), newHotWord.trim()]
    }));
    setNewHotWord("");
  };

  const handleRemoveHotWord = (categoryId: string, index: number) => {
    setHotWordContents(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter((_, i) => i !== index)
    }));
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;
    setNewCategoryName("");
    setNewCategoryDesc("");
  };

  const withContent = allHotWordCategories.filter(cat => hotWordContents[cat.id]?.length > 0);
  const withoutContent = allHotWordCategories.filter(cat => !hotWordContents[cat.id]?.length || hotWordContents[cat.id].length === 0);

  // ===== ELEMENT MANAGEMENT STATES =====
  const [selectedElementType, setSelectedElementType] = useState<string>("all");
  const [showElementModal, setShowElementModal] = useState(false);
  const [elements, setElements] = useState([
    { id: "1", type: "mod", name: "机械动力", description: "核心科技模组", version: "0.5.1", author: "创世工匠" },
    { id: "2", type: "mod", name: "JEI物品管理器", description: "物品配方查看模组", version: "15.2.0", author: "Mezz" },
    { id: "3", type: "mod", name: "旅行地图", description: "小地图导航模组", version: "8.1.6", author: "Techbrew" },
    { id: "4", type: "map", name: "RPG主城地图", description: "方块王国专属主城", version: "1.0.0", author: "地图大师" },
    { id: "5", type: "datapack", name: "职业系统数据包", description: "战士/法师/射手三大职业", version: "2.3.0", author: "数据团队" },
    { id: "6", type: "resourcepack", name: "王国风格材质", description: "方块王国专属32x材质", version: "1.5.0", author: "像素艺术家" },
    { id: "7", type: "shader", name: "适配版柔和光影", description: "服务器优化版光影", version: "1.2.0", author: "光影工作室" },
    { id: "8", type: "structure", name: "公会领地建筑", description: "公会专属建筑结构", version: "1.0.0", author: "建筑大师" },
    { id: "9", type: "audio", name: "王国BGM", description: "主城、副本、战斗背景音乐", version: "2.0.0", author: "音效设计师" },
    { id: "10", type: "mod", name: "任务系统", description: "主线/支线任务系统", version: "1.3.0", author: "任务开发组" },
  ]);
  const [newElement, setNewElement] = useState({ type: "mod", name: "", description: "", version: "", author: "" });

  // ===== SERVER RULES STATES =====
  const [showServerRuleModal, setShowServerRuleModal] = useState(false);
  const [showServerRuleDetailModal, setShowServerRuleDetailModal] = useState(false);
  const [newServerRuleTitle, setNewServerRuleTitle] = useState("");
  const [newServerRuleContent, setNewServerRuleContent] = useState("");
  const [selectedServerRule, setSelectedServerRule] = useState<any>(null);
  const [serverRules, setServerRules] = useState<Array<{
    id: string;
    title: string;
    author: string;
    publishDate: string;
    views: number;
    likes: number;
    content: string;
    status: "pending" | "approved" | "rejected";
  }>>([
    {
      id: "1",
      title: "方块王国服务器规则",
      author: "王国运营团队",
      publishDate: "2024-01-15",
      views: 8560,
      likes: 234,
      content: `# 方块王国服务器规则
## 基本规则
- 禁止使用任何作弊客户端或外挂
- 禁止恶意破坏他人建筑和财产
- 禁止辱骂、骚扰其他玩家
- 禁止利用游戏漏洞获取不当利益
- 禁止在非指定区域进行PVP

## 建筑规则
- 主城周围500格内禁止随意建筑
- 大型建筑需提前向管理团队申请
- 建筑风格需与周边环境协调
## 经济规则
- 禁止恶意操纵市场价格
- 禁止使用漏洞刷取货币或物品
- 交易需在指定交易区进行

## 服务器文化
我们致力于打造一个友好、公平、有趣的RPG生存社区。在这里，你可以
- 选择自己喜欢的职业发展
- 参与公会战争，争夺领地
- 挑战各种副本和Boss
- 结交志同道合的朋友
让我们一起创造美好的游戏回忆！`,
      status: "approved"
    },
    {
      id: "2",
      title: "玩家行为准则",
      author: "管理团队",
      publishDate: "2024-02-20",
      views: 5420,
      likes: 156,
      content: `# 玩家行为准则

## 社区交流
- 使用文明用语，保持友好态度
- 尊重他人的游戏方式和选择
- 遇到问题及时联系管理�?- 积极参与社区活动

## 游戏体验
- 新手提问时耐心解答
- 分享自己的游戏经�?- 组织集体活动增强凝聚�?- 共同维护良好的游戏环�?
## 违规处理
- 首次违规：口头警�?- 二次违规：禁言1�?- 三次违规：封�?�?- 严重违规：永久封禁`,
      status: "approved"
    },
  ]);

  // ===== WIKI HOTWORD EDITOR STATES =====
  const [showAddHotword, setShowAddHotword] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showCategoryDelete, setShowCategoryDelete] = useState<string | null>(null);
  const [newHotwordName, setNewHotwordName] = useState("");
  const [newEntryName, setNewEntryName] = useState("");
  const [selectedHotwordCategory, setSelectedHotwordCategory] = useState("");

  // Mock Wiki Entry Data
  const mockWikiEntries: Record<string, any> = {
    "动力�?: {
      id: "power-source",
      name: "动力�?,
      category: "物品/方块",
      type: "block",
      images: [{ url: "", caption: "动力源外�?, isCover: true }],
      description: "动力源是机械动力的核心组件，提供旋转动能。它可以被多种方式驱动，包括水流、风力、蒸汽等。动力源是所有机械设备的能量起点，通过动力轴将动能传输到其他机器�?,
      recipes: [],
      attributes: [
        { name: "最大转�?, value: "256", unit: "RPM" },
        { name: "应力消�?, value: "4", unit: "SU" },
        { name: "耐久�?, value: "无限", unit: "" },
      ],
      usage: "1. 将动力源放置在地面\n2. 使用动力轴连接到其他机器\n3. 提供动力源（水流、风力等）\n4. 机器开始运�?,
      relatedEntries: ["传送带", "机械�?],
      author: "创世工匠",
      updatedAt: new Date("2024-11-15"),
      version: 2,
      history: [
        { version: 1, author: "创世工匠", updatedAt: new Date("2024-11-10"), changes: "创建词条", snapshot: { description: "动力源是机械动力的核心组件�? } }
      ],
    },
  };
  
  // Handle panel expansion toggle
  const handlePanelToggle = () => {
    if (panelExpanded) {
      setSelectedResource(null);
    }
    setPanelExpanded(!panelExpanded);
  };

  // Handle resource selection
  const handleResourceSelect = (resource: any) => {
    setSelectedResource(resource);
    // Auto-detect resource type based on resourceType field
    setDetailResourceType(resource.resourceType);
    setDetailTab("intro");
    setPanelExpanded(true);
  };

  // Minecraft Java Edition versions
  const minecraftVersions = [
    { value: 'all', label: '全部版本' },
    { value: '1.21', label: '1.21' },
    { value: '1.20.6', label: '1.20.6' },
    { value: '1.20.5', label: '1.20.5' },
    { value: '1.20.4', label: '1.20.4' },
    { value: '1.20.3', label: '1.20.3' },
    { value: '1.20.2', label: '1.20.2' },
    { value: '1.20.1', label: '1.20.1' },
    { value: '1.20', label: '1.20' },
    { value: '1.19.4', label: '1.19.4' },
    { value: '1.19.3', label: '1.19.3' },
    { value: '1.19.2', label: '1.19.2' },
    { value: '1.19.1', label: '1.19.1' },
    { value: '1.19', label: '1.19' },
    { value: '1.18.2', label: '1.18.2' },
    { value: '1.18.1', label: '1.18.1' },
    { value: '1.18', label: '1.18' },
    { value: '1.17.1', label: '1.17.1' },
    { value: '1.17', label: '1.17' },
    { value: '1.16.5', label: '1.16.5' },
    { value: '1.16.4', label: '1.16.4' },
    { value: '1.16.3', label: '1.16.3' },
    { value: '1.16.2', label: '1.16.2' },
    { value: '1.16.1', label: '1.16.1' },
    { value: '1.16', label: '1.16' },
  ];

  const getFilterResourceId = (): ResourceTypeId => {
    return activeCategory === "all" ? "mod" : activeCategory;
  };

  const getCurrentResources = () => {
    if (activeCategory === "community") return [];
    let resources = [];
    
    if (activeCategory === "all" || (searchQuery && (!filterTags.direction || filterTags.direction.length === 0))) {
      resources = Object.values(mockResources).flat();
    } else {
      resources = mockResources[activeCategory] || [];
    }
    
    // Filter by version
    if (selectedVersion !== 'all') {
      resources = resources.filter(resource => {
        return true;
      });
    }
    
    // Sort resources
    return resources.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'downloads':
          aValue = a.downloads || 0;
          bValue = b.downloads || 0;
          break;
        case 'likes':
          aValue = a.likes || 0;
          bValue = b.likes || 0;
          break;
        case 'date':
          aValue = resources.indexOf(a);
          bValue = resources.indexOf(b);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  };

  const getFilteredCommunityResults = () => {
    let results = mockCommunityResults;
    
    const directionTags = filterTags["direction"] || [];
    const projectTypeTags = filterTags["projectType"] || [];
    const projectStatusTags = filterTags["projectStatus"] || [];
    const teamTypeTags = filterTags["teamType"] || [];
    const userTypeTags = filterTags["userType"] || [];
    const socialIntentTags = filterTags["socialIntent"] || [];
    
    if (directionTags.length > 0) {
      results = results.filter(result => {
        if (directionTags.includes("user") && result.type === "user") return true;
        if (directionTags.includes("team") && result.type === "team") return true;
        if (directionTags.includes("project") && result.type === "project") return true;
        return false;
      });
    }
    
    if (userTypeTags.length > 0) {
      results = results.filter(result => {
        if (result.type === "user" && "userType" in result) {
          return userTypeTags.includes(result.userType as string);
        }
        return false;
      });
    }
    
    if (socialIntentTags.length > 0) {
      results = results.filter(result => {
        if (result.type === "user" && "socialIntent" in result) {
          return socialIntentTags.includes(result.socialIntent as string);
        }
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
            "preparing": "筹备�?,
            "inProgress": "制作�?
          };
          return projectStatusTags.some(tag => statusMap[tag] === result.projectStatus);
        }
        return false;
      });
    }
    
    if (teamTypeTags.length > 0) {
      results = results.filter(result => {
        if (result.type === "team" && "teamType" in result) {
          return teamTypeTags.includes(result.teamType as string);
        }
        return false;
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

  const showCommunity = activeCategory === "community" || (searchQuery && filterTags.direction && filterTags.direction.length > 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="p-4 pt-4">
        <div className="max-w-[1920px] mx-auto">
          {/* Upper Section (1920x1080) - Full viewport height */}
          <div className="flex gap-2 h-[1000px]">
            {/* Left Column - 33% width */}
            <div className="w-[33%] flex flex-col gap-2 h-full">
              {/* Announcement Section */}
              <div className="bg-card border border-border rounded-lg p-4 flex-[4.4] overflow-hidden">
                <div className="space-y-3 overflow-y-auto h-full">
                  {mockAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="bg-secondary/20 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-foreground">{announcement.title}</h3>
                        <span className="text-xs text-muted-foreground">{announcement.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* User View Switch */}
              <div className="bg-card border border-border rounded-lg p-3 flex-[0.4] flex items-center justify-center min-h-[48px]">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    游客
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    鉴赏�?                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    创作�?                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    生产�?                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    投资�?                  </Button>
                </div>
              </div>

              {/* Team Dynamics */}
              <div className="bg-card border border-border rounded-lg p-4 flex-[5.2] overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <Button size="sm" className="text-xs">
                    查看更多
                  </Button>
                </div>
                <div className="space-y-3 overflow-y-auto h-[calc(100%-44px)]">
                  {mockTeamDynamics.map((dynamic) => (
                    <div key={dynamic.id} className="bg-secondary/20 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-foreground">{dynamic.teamName}</h3>
                        <span className="text-xs text-muted-foreground">{dynamic.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{dynamic.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - 67% width */}
            <div className="w-[67%] flex flex-col gap-2 h-full relative">
              {/* Detail Section */}
              <div className={`bg-card border border-border rounded-lg p-4 ${panelExpanded ? 'h-full' : 'flex-[4.4]'} overflow-hidden transition-all duration-300 relative`}>
                <div className={`h-full ${panelExpanded ? 'pb-[80px]' : ''} overflow-y-auto`}>
                  {/* Resource list */}
                  {!selectedResource ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getCurrentResources().slice(0, panelExpanded ? 12 : 4).map((resource, index) => (
                        <ResourceCard
                          key={index}
                          {...resource}
                          onSelect={() => handleResourceSelect(resource)}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Resource Detail View - COMPLETE version with ALL 7 subpages */
                    <div className="h-full flex flex-col">
                      {/* Simplified Header - Compact */}
                      <div className="flex items-center gap-4 px-4 py-3 border-b border-border flex-shrink-0">
                        {/* Back Button */}
                        <button
                          onClick={() => setSelectedResource(null)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-secondary transition-colors flex-shrink-0"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        {/* Resource Name */}
                        <h2 className="text-base font-semibold text-foreground flex-1 truncate">
                          {selectedResource.title}
                        </h2>
                        
                        {/* Stats - Right Side */}
                        <div className="flex items-center gap-4 flex-shrink-0 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {(selectedResource.downloads * 7).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {selectedResource.downloads?.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {selectedResource.likes?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Edit Resource Info Modal - FULLY FUNCTIONAL */}
                      <Dialog open={isEditing} onOpenChange={setIsEditing}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>编辑资源信息</DialogTitle>
                            <DialogDescription>修改资源的基本信息，修改后将保存并更新历史记�?/DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-2">
                            {/* Resource Name */}
                            <div>
                              <label className="text-xs font-medium mb-1 block">资源名称</label>
                              <Input defaultValue={selectedResource?.title} placeholder="输入资源名称" />
                            </div>
                            
                            {/* Author Message */}
                            <div>
                              <label className="text-xs font-medium mb-1 block">制作方寄�?/label>
                              <Textarea 
                                defaultValue="感谢大家一直以来的支持！这个模组我已经开发了两年，终于可以和大家见面了。如果遇到任何问题或者有好的建议，欢迎在讨论区留言。特别感谢测试团队的辛勤付出�?
                                placeholder="输入制作方寄�?
                                className="min-h-[100px]"
                              />
                            </div>
                            
                            {/* Resource Description */}
                            <div>
                              <label className="text-xs font-medium mb-1 block">资源简�?/label>
                              <Textarea 
                                defaultValue={selectedResource?.description}
                                placeholder="输入资源简�?
                                className="min-h-[120px]"
                              />
                            </div>
                            
                            {/* Basic Information Row 1 */}
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-medium mb-1 block">内容方向</label>
                                <Input defaultValue="科技工业" placeholder="输入内容方向" />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">内容风格</label>
                                <Input defaultValue="写实风、科幻风" placeholder="输入内容风格" />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">独特系统</label>
                                <Input defaultValue="自动化产线、能源网络、物流系�? placeholder="输入独特系统" />
                              </div>
                            </div>
                            
                            {/* Basic Information Row 2 */}
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-medium mb-1 block">加载�?/label>
                                <Input defaultValue="Fabric" placeholder="输入支持的加载器" />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">叙事</label>
                                <Input defaultValue="无叙�? placeholder="输入叙事类型" />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">模组权重</label>
                                <Input defaultValue="核心主体" placeholder="输入模组权重" />
                              </div>
                            </div>
                            
                            {/* Basic Information Row 3 */}
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-medium mb-1 block">维护状�?/label>
                                <select className="w-full h-9 px-3 border border-border rounded-md bg-card text-sm">
                                  <option>活跃维护</option>
                                  <option>缓慢更新</option>
                                  <option>暂停维护</option>
                                  <option>已停止维�?/option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">游戏版本</label>
                                <Input defaultValue="1.20.x" placeholder="输入支持的游戏版�? />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">产出方式</label>
                                <select className="w-full h-9 px-3 border border-border rounded-md bg-card text-sm">
                                  <option>原创</option>
                                  <option>改编</option>
                                  <option>搬运（已授权�?/option>
                                  <option>搬运（未授权�?/option>
                                </select>
                              </div>
                            </div>
                            
                            {/* Basic Information Row 4 */}
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-medium mb-1 block">产出时间</label>
                                <Input defaultValue="2023.06" placeholder="输入产出时间" />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">运行环境</label>
                                <Input defaultValue="客户端需装、服务端需�? placeholder="输入运行环境" />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">许可证类�?/label>
                                <select className="w-full h-9 px-3 border border-border rounded-md bg-card text-sm">
                                  <option>开�?/option>
                                  <option>MIT 开�?/option>
                                  <option>All Rights Reserved</option>
                                  <option>CC BY-NC-SA 4.0</option>
                                  <option>GPL v3</option>
                                </select>
                              </div>
                            </div>
                            
                            {/* Basic Information Row 5 */}
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-medium mb-1 block">性能负载</label>
                                <select className="w-full h-9 px-3 border border-border rounded-md bg-card text-sm">
                                  <option>高负�?/option>
                                  <option>中负�?/option>
                                  <option>低负�?/option>
                                  <option>极低负载</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">内容规模</label>
                                <select className="w-full h-9 px-3 border border-border rounded-md bg-card text-sm">
                                  <option>大体�?/option>
                                  <option>中体�?/option>
                                  <option>小体�?/option>
                                  <option>微型</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">体验体量</label>
                                <select className="w-full h-9 px-3 border border-border rounded-md bg-card text-sm">
                                  <option>大型 300分钟+</option>
                                  <option>中型 100-300分钟</option>
                                  <option>小型 30-100分钟</option>
                                  <option>微型 30分钟�?/option>
                                </select>
                              </div>
                            </div>
                            
                            {/* Basic Information Row 6 */}
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-medium mb-1 block">难易�?/label>
                                <select className="w-full h-9 px-3 border border-border rounded-md bg-card text-sm">
                                  <option>标准</option>
                                  <option>简�?/option>
                                  <option>困难</option>
                                  <option>专家</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">情感导向</label>
                                <Input defaultValue="快乐/创造、成�?满足" placeholder="输入情感导向" />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">数值平�?/label>
                                <select className="w-full h-9 px-3 border border-border rounded-md bg-card text-sm">
                                  <option>原版平衡</option>
                                  <option>轻度OP</option>
                                  <option>重度OP</option>
                                  <option>硬核</option>
                                </select>
                              </div>
                            </div>
                            
                            {/* Content Tags */}
                            <div>
                              <label className="text-xs font-medium mb-2 block">内容标签</label>
                              <div className="flex flex-wrap gap-2">
                                {["科技", "自动�?, "机械", "多线�?].map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-[10px]">
                                    {tag}
                                    <X className="w-3 h-3 ml-1 cursor-pointer" />
                                  </Badge>
                                ))}
                                <Button size="sm" variant="outline" className="h-6 text-xs">
                                  <Plus className="w-3 h-3 mr-1" /> 添加标签
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              取消
                            </Button>
                            <Button onClick={() => setIsEditing(false)}>
                              <Save className="w-4 h-4 mr-1" /> 保存修改
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Tabs - MOD: 7 tabs | MAP: 6 tabs */}
                      <Tabs value={detailTab} onValueChange={setDetailTab} className="flex-1 flex flex-col overflow-hidden">
                        <TabsList className="px-4 justify-start border-b border-border rounded-none bg-transparent h-auto flex-wrap">
                            <TabsTrigger value="intro" className="text-xs h-9">基本介绍</TabsTrigger>
                            {/* Show content tab for mod, datapack, modpack, and modded server */}
                            {(detailResourceType === "mod" || detailResourceType === "datapack" || detailResourceType === "modpack" || (detailResourceType === "server" && selectedResource?.serverType === "modded")) && (
                              <TabsTrigger value="content" className="text-xs h-9">内容详情</TabsTrigger>
                            )}
                            {/* Screenshot tab - NOT for audio/ecoTool/doc */}
                            {!(["audio", "ecoTool", "doc"].includes(detailResourceType)) && (
                              <TabsTrigger value="screenshot" className="text-xs h-9">画廊</TabsTrigger>
                            )}
                            {/* Download/Obtain tab */}
                            <TabsTrigger value="download" className="text-xs h-9">
                              {detailResourceType === "image" ? "获取" : "下载"}
                            </TabsTrigger>
                            {/* Server rules tab for servers */}
                            {detailResourceType === "server" && (
                              <TabsTrigger value="serverRules" className="text-xs h-9">服务器规�?/TabsTrigger>
                            )}
                            {/* Guide tab - NOT for resourcepack/shader/building/audio/ecoTool/doc/image */}
                            {!(["resourcepack", "shader", "building", "audio", "ecoTool", "doc", "image"].includes(detailResourceType)) && (
                              <TabsTrigger value="guide" className="text-xs h-9">攻略</TabsTrigger>
                            )}
                            <TabsTrigger value="agreement" className="text-xs h-9">协议</TabsTrigger>
                            <TabsTrigger value="changelog" className="text-xs h-9">日志</TabsTrigger>
                          </TabsList>
                        
                        <div className="flex-1 overflow-hidden px-4 py-4 h-full">
                          {/* ============ 1. 基本介绍 - COMPLETE ============ */}
                          <TabsContent value="intro" className="mt-0 h-full overflow-hidden">
                            {/* Two-column layout with independent scrolling */}
                            <div className="flex gap-4 h-full">
                              {/* Left - Main Content - Scrollable */}
                              <div className="flex-1 min-w-0 overflow-y-auto space-y-3 pr-2">
                                <div className="flex justify-end mb-1">
                                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setIsEditing(true)}>
                                    <Edit className="w-3.5 h-3.5 mr-1" /> 编辑资源信息
                                  </Button>
                                </div>
                                
                                {/* Author Note - Compact */}
                                <div className="bg-secondary/20 rounded-lg p-3">
                                  <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-muted-foreground">
                                    <User className="w-3.5 h-3.5" /> 制作方寄�?                                  </h3>
                                  <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary pl-3">
                                    感谢所有支持我们的玩家！这个模组是我们团队两年心血的结晶。我们希望带给玩家真正的工业革命体验，而不仅仅是简单的机器堆砌。如果你在游玩过程中遇到任何问题，或者有好的建议，欢迎在评论区留言�?                                  </p>
                                </div>

                                {/* Resource Description - Compact */}
                                <div className="bg-secondary/20 rounded-lg p-3">
                                  <h3 className="text-xs font-semibold mb-2 text-muted-foreground">资源简�?/h3>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    一款专注于机械自动化与工业生产的科技模组。引入全新的动能传输系统、多种类型的机器设备，以及复杂的自动化生产线。玩家可以从最基础的手动加工开始，逐步建立起庞大的工业帝国。支持与其他科技模组的联动，提供丰富的API接口�?                                  </p>
                                </div>

                                {/* Basic Info Tags - ALIGNED GRID LAYOUT Compact */}
                                <div className="bg-secondary/20 rounded-lg p-3">
                                  <h3 className="text-xs font-semibold mb-2.5 text-muted-foreground">基本信息</h3>
                                  <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">内容方向�?/span>
                                      <span className="text-sm font-medium">科技工业</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">内容风格�?/span>
                                      <span className="text-sm font-medium">写实风、科幻风</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">独特系统�?/span>
                                      <span className="text-sm font-medium">自动化产线、能源网�?/span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">加载器：</span>
                                      <span className="text-sm font-medium">Fabric</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">叙事�?/span>
                                      <span className="text-sm font-medium">无叙�?/span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">模组权重�?/span>
                                      <span className="text-sm font-medium">核心主体</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">维护状态：</span>
                                      <span className="text-sm font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        活跃维护
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">游戏版本�?/span>
                                      <span className="text-sm font-medium">1.20.x</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">产出方式�?/span>
                                      <span className="text-sm font-medium">原创</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">产出时间�?/span>
                                      <span className="text-sm font-medium">2023.06</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">运行环境�?/span>
                                      <span className="text-sm font-medium">双端需�?/span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">许可证类型：</span>
                                      <span className="text-sm font-medium">开�?/span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">性能负载�?/span>
                                      <span className="text-sm font-medium">高负�?/span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">内容规模�?/span>
                                      <span className="text-sm font-medium">大体�?/span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">体验体量�?/span>
                                      <span className="text-sm font-medium">大型 300分钟+</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">难易度：</span>
                                      <span className="text-sm font-medium">标准</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">情感导向�?/span>
                                      <span className="text-sm font-medium">快乐/创造、成�?/span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-[11px] text-muted-foreground w-[72px] flex-shrink-0">数值平衡：</span>
                                      <span className="text-sm font-medium">原版平衡</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right - Sidebar - Scrollable Compact */}
                              <div className="w-72 flex-shrink-0 overflow-y-auto space-y-3">
                                {/* Resource Logo Compact */}
                                <div className="bg-secondary/20 rounded-lg p-3 flex justify-center">
                                  <div className="w-16 h-16 flex items-center justify-center text-primary bg-card rounded-lg">
                                    {selectedResource.icon}
                                  </div>
                                </div>

                                {/* Creator Info - Compact */}
                                <div className="bg-secondary/20 rounded-lg p-2.5">
                                  <h3 className="text-[11px] font-semibold mb-1.5 text-muted-foreground">制作方信�?/h3>
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                      <User className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium">创世工匠工作�?/p>
                                      <p className="text-[10px] text-muted-foreground">模组开发�?/p>
                                    </div>
                                  </div>
                                </div>

                                {/* Donation Leaderboard Compact */}
                                <div className="bg-secondary/20 rounded-lg p-2.5">
                                  <h3 className="text-[11px] font-semibold mb-1.5 text-muted-foreground">打赏总榜</h3>
                                  <div className="space-y-1">
                                    {[
                                      { rank: 1, name: "史蒂夫大�?, amount: 500 },
                                      { rank: 2, name: "红石工程�?, amount: 300 },
                                      { rank: 3, name: "末影龙骑�?, amount: 200 },
                                      { rank: 4, name: "村民交易�?, amount: 150 },
                                      { rank: 5, name: "下界探险�?, amount: 100 },
                                    ].map((user) => (
                                      <div key={user.rank} className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                            user.rank === 1 ? "bg-yellow-500 text-yellow-900" :
                                            user.rank === 2 ? "bg-gray-300 text-gray-700" :
                                            user.rank === 3 ? "bg-amber-600 text-amber-100" :
                                            "bg-muted text-muted-foreground"
                                          }`}>
                                            {user.rank}
                                          </span>
                                          <span className="text-[11px]">{user.name}</span>
                                        </div>
                                        <span className="text-[11px] font-medium text-primary">¥{user.amount}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Recent Donations Compact */}
                                <div className="bg-secondary/20 rounded-lg p-2.5">
                                  <h3 className="text-[11px] font-semibold mb-1.5 text-muted-foreground">打赏动�?/h3>
                                  <div className="space-y-1.5">
                                    {[
                                      { name: "MC新手玩家", amount: 20, time: "5分钟�?, message: "支持一下！" },
                                      { name: "方块爱好�?, amount: 50, time: "15分钟�?, message: "太棒了！" },
                                      { name: "模组收藏�?, amount: 30, time: "32分钟�?, message: "加油�? },
                                      { name: "服务器管理员", amount: 100, time: "1小时�?, message: "我们服务器在用！" },
                                    ].map((item, i) => (
                                      <div key={i} className="border-b border-border last:border-0 pb-1 last:pb-0">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[11px] font-medium">{item.name}</span>
                                          <span className="text-[9px] text-primary font-medium">+¥{item.amount}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-0.5">
                                          <p className="text-[9px] text-muted-foreground">{item.message}</p>
                                          <p className="text-[9px] text-muted-foreground">{item.time}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          {/* ============ 2. 内容详情 - FULL Wiki Editor COMPLETE ============ */}
                          <TabsContent value="content" className="mt-0 h-full overflow-y-auto">
                            {selectedResource?.resourceType === "modpack" || selectedResource?.resourceType === "server" ? (
                              /* ===== INTEGRATED PACK / SERVER ELEMENT MANAGEMENT ===== */
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h2 className="text-lg font-bold text-foreground">内容详情 - 元素管理</h2>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setShowElementModal(true)}
                                  >
                                    <Plus className="w-3 h-3 mr-1" /> 添加元素
                                  </Button>
                                </div>

                                <div className="flex gap-2 mb-4 flex-wrap">
                                  <Button
                                    size="sm"
                                    variant={selectedElementType === "all" ? "default" : "outline"}
                                    className="h-7 text-xs"
                                    onClick={() => setSelectedElementType("all")}
                                  >
                                    全部 ({elements.length})
                                  </Button>
                                  {[
                                    { id: "mod", icon: "🧩", label: "模组" },
                                    { id: "map", icon: "🗺�?, label: "地图" },
                                    { id: "datapack", icon: "📦", label: "数据�? },
                                    { id: "resourcepack", icon: "🎨", label: "材质�? },
                                    { id: "shader", icon: "🌅", label: "光影" },
                                    { id: "structure", icon: "🏛�?, label: "建筑" },
                                    { id: "audio", icon: "🔊", label: "音频" },
                                  ].map(type => {
                                    const count = elements.filter((e: any) => e.type === type.id).length;
                                    return (
                                      <Button
                                        key={type.id}
                                        size="sm"
                                        variant={selectedElementType === type.id ? "default" : "outline"}
                                        className="h-7 text-xs"
                                        onClick={() => setSelectedElementType(type.id)}
                                      >
                                        {type.icon} {type.label} ({count})
                                      </Button>
                                    );
                                  })}
                                </div>

                                <div className="border border-border rounded-lg overflow-hidden">
                                  <div className="grid grid-cols-12 gap-4 p-3 bg-secondary/50 border-b border-border text-xs font-medium text-muted-foreground">
                                    <div className="col-span-2">类型</div>
                                    <div className="col-span-3">名称</div>
                                    <div className="col-span-3">描述</div>
                                    <div className="col-span-1">版本</div>
                                    <div className="col-span-2">作�?/div>
                                    <div className="col-span-1">操作</div>
                                  </div>
                                  <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                                    {elements
                                      .filter((e: any) => selectedElementType === "all" || e.type === selectedElementType)
                                      .map((element: any) => {
                                        const typeInfo: any = {
                                          mod: { icon: "🧩", label: "模组" },
                                          map: { icon: "🗺�?, label: "地图" },
                                          datapack: { icon: "📦", label: "数据�? },
                                          resourcepack: { icon: "🎨", label: "材质�? },
                                          shader: { icon: "🌅", label: "光影" },
                                          structure: { icon: "🏛�?, label: "建筑" },
                                          audio: { icon: "🔊", label: "音频" },
                                        }[element.type] || { icon: "📦", label: "其他" };
                                        return (
                                          <div key={element.id} className="grid grid-cols-12 gap-4 p-3 text-sm hover:bg-secondary/20 transition-colors">
                                            <div className="col-span-2 flex items-center gap-2">
                                              <span>{typeInfo.icon}</span>
                                              <span className="text-muted-foreground">{typeInfo.label}</span>
                                            </div>
                                            <div className="col-span-3 font-medium text-foreground truncate">{element.name}</div>
                                            <div className="col-span-3 text-muted-foreground truncate">{element.description}</div>
                                            <div className="col-span-1 text-muted-foreground">{element.version || "-"}</div>
                                            <div className="col-span-2 text-muted-foreground truncate">{element.author || "-"}</div>
                                            <div className="col-span-1">
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 w-6 p-0 hover:bg-destructive/20"
                                                onClick={() => setElements((prev: any) => prev.filter((e: any) => e.id !== element.id))}
                                              >
                                                <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                                              </Button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>

                                {/* ELEMENT MODAL */}
                                {showElementModal && (
                                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowElementModal(false)}>
                                    <div className="bg-card border border-border rounded-lg w-full max-w-md p-4" onClick={e => e.stopPropagation()}>
                                      <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold">添加元素</h3>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowElementModal(false)}>
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      <div className="space-y-3">
                                        <div>
                                          <label className="text-xs text-muted-foreground mb-1 block">元素类型</label>
                                          <select
                                            value={newElement.type}
                                            onChange={(e) => setNewElement({ ...newElement, type: e.target.value })}
                                            className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background"
                                          >
                                            <option value="mod">🧩 模组</option>
                                            <option value="map">🗺�?地图</option>
                                            <option value="datapack">📦 数据�?/option>
                                            <option value="resourcepack">🎨 材质�?/option>
                                            <option value="shader">🌅 光影</option>
                                            <option value="structure">🏛�?建筑</option>
                                            <option value="audio">🔊 音频</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="text-xs text-muted-foreground mb-1 block">名称 *</label>
                                          <Input
                                            value={newElement.name}
                                            onChange={(e) => setNewElement({ ...newElement, name: e.target.value })}
                                            placeholder="输入元素名称..."
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-muted-foreground mb-1 block">描述</label>
                                          <Input
                                            value={newElement.description}
                                            onChange={(e) => setNewElement({ ...newElement, description: e.target.value })}
                                            placeholder="输入元素描述..."
                                            className="text-sm"
                                          />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">版本</label>
                                            <Input
                                              value={newElement.version}
                                              onChange={(e) => setNewElement({ ...newElement, version: e.target.value })}
                                              placeholder="例如: 0.5.1"
                                              className="text-sm"
                                            />
                                          </div>
                                          <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">作�?/label>
                                            <Input
                                              value={newElement.author}
                                              onChange={(e) => setNewElement({ ...newElement, author: e.target.value })}
                                              placeholder="作者名�?
                                              className="text-sm"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                          <Button size="sm" variant="outline" onClick={() => setShowElementModal(false)}>取消</Button>
                                          <Button 
                                            size="sm" 
                                            onClick={() => {
                                              if (!newElement.name.trim()) return;
                                              setElements((prev: any) => [...prev, { ...newElement, id: Date.now().toString() }]);
                                              setNewElement({ type: "mod", name: "", description: "", version: "", author: "" });
                                              setShowElementModal(false);
                                            }}
                                            disabled={!newElement.name.trim()}
                                          >
                                            添加
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* ===== ADD HOTWORD MODAL ===== */}
                                {showAddHotword && (
                                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddHotword(false)}>
                                    <div className="bg-card border border-border rounded-lg w-full max-w-md p-4" onClick={e => e.stopPropagation()}>
                                      <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold flex items-center gap-2">
                                          <span>🔥</span> 创建热词分类
                                        </h3>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowAddHotword(false)}>
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      <div className="space-y-3">
                                        <div>
                                          <label className="text-xs text-muted-foreground mb-1 block">热词分类名称 *</label>
                                          <Input
                                            value={newHotwordName}
                                            onChange={(e) => setNewHotwordName(e.target.value)}
                                            placeholder="例如：多方块结构"
                                            className="text-sm"
                                          />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                          <Button size="sm" variant="outline" onClick={() => setShowAddHotword(false)}>取消</Button>
                                          <Button 
                                            size="sm" 
                                            onClick={() => {
                                              if (!newHotwordName.trim()) return;
                                              setNewHotwordName("");
                                              setShowAddHotword(false);
                                            }}
                                            disabled={!newHotwordName.trim()}
                                          >
                                            创建
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* ===== ADD ENTRY MODAL ===== */}
                                {showAddEntry && (
                                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddEntry(false)}>
                                    <div className="bg-card border border-border rounded-lg w-full max-w-md p-4" onClick={e => e.stopPropagation()}>
                                      <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold flex items-center gap-2">
                                          <span>📝</span> 添加词条
                                        </h3>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowAddEntry(false)}>
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      <div className="space-y-3">
                                        <div>
                                          <label className="text-xs text-muted-foreground mb-1 block">选择分类</label>
                                          <select
                                            value={newEntryCategory}
                                            onChange={(e) => setNewEntryCategory(e.target.value)}
                                            className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background"
                                          >
                                            <option value="items">物品/方块</option>
                                            <option value="tools">工具/装备</option>
                                            <option value="machines">机器/设备</option>
                                            <option value="multiblock">多方块结�?/option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="text-xs text-muted-foreground mb-1 block">词条名称 *</label>
                                          <Input
                                            value={newEntryName}
                                            onChange={(e) => setNewEntryName(e.target.value)}
                                            placeholder="例如：动力源"
                                            className="text-sm"
                                          />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                          <Button size="sm" variant="outline" onClick={() => setShowAddEntry(false)}>取消</Button>
                                          <Button 
                                            size="sm" 
                                            onClick={() => {
                                              if (!newEntryName.trim()) return;
                                              setNewEntryName("");
                                              setShowAddEntry(false);
                                            }}
                                            disabled={!newEntryName.trim()}
                                          >
                                            添加
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              /* ===== WIKI HOTWORD EDITOR - FULL FUNCTIONALITY ===== */
                              <div className="flex flex-col gap-3 min-h-[500px]">
                                {/* Top Bar with Add Content Button */}
                                <div className="flex justify-end">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 text-xs"
                                    onClick={() => setShowContentUploadModal(true)}
                                  >
                                    <Plus className="w-3.5 h-3.5 mr-1" /> 添加内容
                                  </Button>
                                </div>
                                
                                {/* Wiki Main Content */}
                                <div className="flex gap-4 flex-1">
                                  {/* Left - Category Tree - COMPLETE WITH UNINVOLVED CATEGORIES */}
                                  <div className="w-56 flex-shrink-0 border border-border rounded-lg bg-card overflow-hidden">
                                    <div className="p-3 border-b border-border bg-secondary/50">
                                      <h3 className="text-sm font-semibold text-foreground">热词分类</h3>
                                      <p className="text-xs text-muted-foreground mt-1">点击词条查看详情</p>
                                    </div>
                                    <div className="overflow-y-auto max-h-[520px]">
                                      {/* Categories with content */}
                                      {withContent.map((category) => (
                                        <div key={category.id} className="border-b border-border">
                                          <div
                                            className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-secondary/30 transition-colors"
                                            onClick={() => toggleCategory(category.id)}
                                          >
                                            <div className="flex items-center gap-2">
                                              {expandedCategories.has(category.id) ? (
                                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                              ) : (
                                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                              )}
                                              <span className="text-sm font-medium text-foreground">{category.label}</span>
                                            </div>
                                            <Badge variant="default" className="text-xs h-5">{hotWordContents[category.id].length}</Badge>
                                          </div>
                                          {expandedCategories.has(category.id) && (
                                            <div className="bg-secondary/10 py-1">
                                              {hotWordContents[category.id].map((item: string, index: number) => (
                                                <div
                                                  key={index}
                                                  className={`px-3 py-1.5 pl-8 text-xs cursor-pointer hover:bg-secondary/50 transition-colors flex items-center justify-between group ${
                                                    selectedEntry?.category === category.label && selectedEntry?.item === item
                                                      ? "bg-primary/10 text-primary font-medium"
                                                      : "text-muted-foreground"
                                                  }`}
                                                  onClick={() => setSelectedEntry({ category: category.label, item })}
                                                >
                                                  <span>{item}</span>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleRemoveHotWord(category.id, index);
                                                      if (selectedEntry?.item === item) setSelectedEntry(null);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-opacity"
                                                  >
                                                    <X className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                      
                                      {/* Uninvolved categories - 未涉及的分类 */}
                                      {withoutContent.length > 0 && (
                                        <>
                                          <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/30">
                                            未涉及的分类
                                          </div>
                                          {withoutContent.map((category) => (
                                            <div key={category.id} className="border-b border-border opacity-50">
                                              <div
                                                className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-secondary/30 transition-colors"
                                                onClick={() => toggleCategory(category.id)}
                                              >
                                                <div className="flex items-center gap-2">
                                                  {expandedCategories.has(category.id) ? (
                                                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                                  ) : (
                                                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                                  )}
                                                  <span className="text-sm text-muted-foreground">{category.label}</span>
                                                </div>
                                                <Badge variant="secondary" className="text-xs h-5">0</Badge>
                                              </div>
                                              {expandedCategories.has(category.id) && (
                                                <div className="bg-secondary/10 py-2 px-3 pl-8">
                                                  <p className="text-xs text-muted-foreground">{category.description}</p>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Right - Wiki Entry Panel */}
                                  <div className="flex-1 min-w-0">
                                    {selectedEntry ? (
                                      <div className="border border-border rounded-lg bg-card h-full flex flex-col">
                                        <div className="p-4 border-b border-border flex items-center justify-between">
                                          <div>
                                            <h2 className="text-lg font-bold text-foreground">{selectedEntry.item}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Badge variant="outline" className="text-xs">{selectedEntry.category}</Badge>
                                              <Badge variant="secondary" className="text-xs">词条</Badge>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {isEditing ? (
                                              <>
                                                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                                                  <XCircle className="w-4 h-4 mr-1" /> 取消
                                                </Button>
                                                <Button size="sm" onClick={() => setIsEditing(false)}>
                                                  <Save className="w-4 h-4 mr-1" /> 保存
                                                </Button>
                                              </>
                                            ) : (
                                              <>
                                                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                                                  <Edit2 className="w-4 h-4 mr-1" /> 编辑
                                                </Button>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4">
                                          {isEditing ? (
                                            <div className="space-y-4">
                                              <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">描述</label>
                                                <Textarea className="text-sm min-h-[100px]" placeholder="输入词条描述..." />
                                              </div>
                                              <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">使用方法</label>
                                                <Textarea className="text-sm min-h-[80px]" placeholder="输入使用方法..." />
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="space-y-4">
                                              <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">描述</label>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                  这是「{selectedEntry.item}」的详细描述内容。点击右上角「编辑」按钮可以修改词条内容�?                                                </p>
                                              </div>
                                              <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">使用方法</label>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                  详细的使用说明和教程将在这里显示�?                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="h-full flex items-center justify-center border border-border rounded-lg bg-card">
                                        <div className="text-center">
                                          <div className="w-16 h-16 bg-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
                                            <Eye className="w-8 h-8 text-muted-foreground" />
                                          </div>
                                          <h3 className="text-sm font-medium text-foreground mb-1">选择词条查看详情</h3>
                                          <p className="text-xs text-muted-foreground">从左侧分类导航中选择一个词�?/p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              )}

                              {/* ===== FULL CONTENT UPLOAD MODAL - DOUBLE TABS ===== */}
                              {showContentUploadModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowContentUploadModal(false)}>
                                  <div className="bg-card border border-border rounded-lg w-full max-w-2xl p-4" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center justify-between mb-4">
                                      <h3 className="text-sm font-semibold text-foreground">添加内容</h3>
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowContentUploadModal(false)}>
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>

                                    <Tabs value={addFunctionTab} onValueChange={(v) => setAddFunctionTab(v as "entry" | "category")}>
                                      <TabsList className="h-auto p-0 bg-transparent mb-3">
                                        <TabsTrigger 
                                          value="entry" 
                                          className="text-xs px-3 py-1.5 data-[state=active]:text-primary data-[state=active]:bg-primary/10"
                                        >
                                          添加词条
                                        </TabsTrigger>
                                        <TabsTrigger 
                                          value="category" 
                                          className="text-xs px-3 py-1.5 data-[state=active]:text-primary data-[state=active]:bg-primary/10"
                                        >
                                          创建热词
                                        </TabsTrigger>
                                      </TabsList>

                                      <TabsContent value="entry" className="mt-0">
                                        {selectedEntry && (
                                          <div className="mb-3 p-2 bg-primary/5 border border-primary/20 rounded-md flex items-center justify-between">
                                            <span className="text-xs text-primary">
                                              快捷添加到当前分类：{selectedEntry.category}
                                            </span>
                                            <Button 
                                              size="sm" 
                                              variant="ghost"
                                              className="h-6 text-xs"
                                              onClick={() => {
                                                const cat = allHotWordCategories.find(c => c.label === selectedEntry.category);
                                                if (cat) {
                                                  setSelectedCategory(cat.id);
                                                }
                                              }}
                                            >
                                              使用此分�?                                            </Button>
                                          </div>
                                        )}
                                      
                                        <div className="flex gap-3">
                                          <div className="w-48 flex-shrink-0">
                                            <label className="text-xs text-muted-foreground mb-1 block">选择热词分类</label>
                                            <select
                                              value={selectedCategory}
                                              onChange={(e) => setSelectedCategory(e.target.value)}
                                              className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background"
                                            >
                                              <option value="">请选择...</option>
                                              {allHotWordCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                              ))}
                                            </select>
                                          </div>
                                          <div className="flex-1">
                                            <label className="text-xs text-muted-foreground mb-1 block">词条名称</label>
                                            <div className="flex gap-2">
                                              <Input
                                                value={newHotWord}
                                                onChange={(e) => setNewHotWord(e.target.value)}
                                                placeholder="输入词条名称后按 Enter 或点击添�?.."
                                                className="text-sm flex-1"
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter") handleAddHotWord();
                                                }}
                                              />
                                              <Button size="sm" onClick={handleAddHotWord} disabled={!selectedCategory || !newHotWord.trim()}>
                                                <Plus className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </TabsContent>

                                      <TabsContent value="category" className="mt-0">
                                        <div className="flex gap-3">
                                          <div className="flex-1">
                                            <label className="text-xs text-muted-foreground mb-1 block">热词名称</label>
                                            <Input
                                              value={newCategoryName}
                                              onChange={(e) => setNewCategoryName(e.target.value)}
                                              placeholder="输入新热词名�?.."
                                              className="text-sm"
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddNewCategory();
                                              }}
                                            />
                                          </div>
                                          <div className="flex-1">
                                            <label className="text-xs text-muted-foreground mb-1 block">描述（可选）</label>
                                            <div className="flex gap-2">
                                              <Input
                                                value={newCategoryDesc}
                                                onChange={(e) => setNewCategoryDesc(e.target.value)}
                                                placeholder="输入热词描述..."
                                                className="text-sm flex-1"
                                              />
                                              <Button size="sm" onClick={handleAddNewCategory} disabled={!newCategoryName.trim()}>
                                                <Plus className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </TabsContent>
                                    </Tabs>
                                  </div>
                                </div>
                              )}
                          </TabsContent>

                          {/* ============ 3. 攻略 - COMPLETE - NOT for resourcepack/shader/building/audio/ecoTool/doc/image ============ */}
                          {!(["resourcepack", "shader", "building", "audio", "ecoTool", "doc", "image"].includes(detailResourceType)) && (
                          <TabsContent value="guide" className="mt-0 h-full overflow-y-auto">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">攻略</h3>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => setShowGuideModal(true)}
                                >
                                  <Edit className="w-3 h-3 mr-1" /> 提交攻略
                                </Button>
                              </div>

                              <div className="space-y-3">
                                {guides
                                  .filter(g => g.status === "approved")
                                  .sort((a, b) => (b.views + b.likes * 10) - (a.views + a.likes * 10))
                                  .map((guide) => (
                                  <div 
                                    key={guide.id} 
                                    className="border border-border rounded-lg p-4 bg-card hover:bg-secondary/20 transition-colors cursor-pointer"
                                    onClick={() => {
                                      setSelectedGuide(guide);
                                      setShowGuideDetailModal(true);
                                    }}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                                        {guide.title}
                                      </h4>
                                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                          <Eye className="w-3 h-3" />
                                          <span>{(guide.views / 1000).toFixed(1)}K</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Heart className="w-3 h-3" />
                                          <span>{guide.likes}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>{guide.author}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{guide.publishDate}</span>
                                      </div>
                                    </div>

                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                      {guide.content.split('\n').find((line: string) => line.trim() && !line.startsWith('#') && !line.startsWith('!')) || '点击查看完整内容...'}
                                    </div>
                                  </div>
                                ))}

                                {guides.filter((g: any) => g.status === "approved").length === 0 && (
                                  <div className="text-center py-12 text-muted-foreground text-sm">
                                    暂无攻略文章
                                  </div>
                                )}
                              </div>

                              {showGuideModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowGuideModal(false)}>
                                  <div className="bg-card border border-border rounded-lg w-full max-w-3xl p-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center justify-between mb-4">
                                      <h3 className="text-sm font-semibold text-foreground">提交攻略</h3>
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowGuideModal(false)}>
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                                      <div className="text-xs font-semibold text-blue-600 mb-2">提交须知</div>
                                      <ul className="text-[10px] text-muted-foreground space-y-1">
                                        <li>�?攻略内容需与该资源相关，帮助其他玩家更好地使用该资�?/li>
                                        <li>�?内容需原创或已获授权，不得抄袭他人作品</li>
                                        <li>�?提交的攻略需经制作方审核后才会显�?/li>
                                        <li>�?支持Markdown格式，可使用 # 标题�? 列表�?[图片](链接) 等语�?/li>
                                      </ul>
                                    </div>

                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">攻略标题</label>
                                        <Input
                                          value={newGuideTitle}
                                          onChange={(e) => setNewGuideTitle(e.target.value)}
                                          placeholder="输入攻略标题..."
                                          className="text-sm"
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">攻略内容（支持Markdown�?/label>
                                        <textarea
                                          value={newGuideContent}
                                          onChange={(e) => setNewGuideContent(e.target.value)}
                                          placeholder={`示例格式�?# 标题

## 二级标题

正文内容...

- 列表�?
- 列表�?

![图片描述](图片链接)`}
                                          className="w-full min-h-[300px] px-3 py-2 text-sm font-mono border border-input rounded-md bg-background resize-none"
                                        />
                                      </div>

                                      <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => setShowGuideModal(false)}>取消</Button>
                                        <Button size="sm" onClick={() => {
                                          if (newGuideTitle && newGuideContent) {
                                            setGuides([...guides, {
                                              id: Date.now().toString(),
                                              title: newGuideTitle,
                                              author: "当前用户",
                                              publishDate: new Date().toISOString().split('T')[0],
                                              views: 0,
                                              likes: 0,
                                              content: newGuideContent,
                                              status: "pending"
                                            }]);
                                            setNewGuideTitle("");
                                            setNewGuideContent("");
                                            setShowGuideModal(false);
                                          }
                                        }}>提交</Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {showGuideDetailModal && selectedGuide && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowGuideDetailModal(false)}>
                                  <div className="bg-card border border-border rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-start justify-between mb-4">
                                      <div>
                                        <h2 className="text-lg font-bold text-foreground mb-2">{selectedGuide.title}</h2>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                          <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            <span>{selectedGuide.author}</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{selectedGuide.publishDate}</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            <span>{selectedGuide.views.toLocaleString()} 浏览</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Heart className="w-3 h-3" />
                                            <span>{selectedGuide.likes} 点赞</span>
                                          </div>
                                        </div>
                                      </div>
                                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowGuideDetailModal(false)}>
                                        <X className="w-5 h-5" />
                                      </Button>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="prose prose-sm max-w-none">
                                      {selectedGuide.content.split('\n').map((line: string, index: number) => {
                                        if (line.startsWith('# ')) {
                                          return <h1 key={index} className="text-xl font-bold text-foreground mt-6 mb-3">{line.slice(2)}</h1>;
                                        } else if (line.startsWith('## ')) {
                                          return <h2 key={index} className="text-lg font-semibold text-foreground mt-5 mb-2">{line.slice(3)}</h2>;
                                        } else if (line.startsWith('### ')) {
                                          return <h3 key={index} className="text-base font-semibold text-foreground mt-4 mb-2">{line.slice(4)}</h3>;
                                        } else if (line.startsWith('- ')) {
                                          return <li key={index} className="text-sm text-muted-foreground ml-4">{line.slice(2)}</li>;
                                        } else if (line.startsWith('![')) {
                                          const match = line.match(/!\[(.*?)\]\((.*?)\)/);
                                          if (match) {
                                            return (
                                              <div key={index} className="my-4">
                                                <div className="w-full h-48 bg-secondary rounded-lg flex items-center justify-center">
                                                  <Image className="w-12 h-12 text-muted-foreground/50" />
                                                </div>
                                                <p className="text-xs text-muted-foreground text-center mt-2">{match[1]}</p>
                                              </div>
                                            );
                                          }
                                        } else if (line.trim()) {
                                          return <p key={index} className="text-sm text-muted-foreground mb-2">{line}</p>;
                                        }
                                        return null;
                                      })}
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" className="h-8">
                                          <Heart className="w-3 h-3 mr-1" /> 点赞 {selectedGuide.likes}
                                        </Button>
                                        <Button size="sm" variant="outline" className="h-8">
                                          <BookmarkPlus className="w-3 h-3 mr-1" /> 收藏
                                        </Button>
                                      </div>
                                      <Button size="sm" variant="outline" className="h-8" onClick={() => setShowGuideDetailModal(false)}>
                                        关闭
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                              </div>
                          </TabsContent>
                          )}

                          {/* ============ 4. 画廊 - COMPLETE - NOT for audio/ecoTool/doc ============ */}
                          {!(["audio", "ecoTool", "doc"].includes(detailResourceType)) && (
                          <TabsContent value="screenshot" className="mt-0 h-full overflow-y-auto">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">画廊</h3>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => setShowUploadModal(true)}
                                >
                                  <Upload className="w-3 h-3 mr-1" /> 提交图片
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {galleryImages.filter(img => img.status === "approved").map((image) => (
                                  <div key={image.id} className="group relative aspect-square bg-secondary rounded-lg overflow-hidden border border-border">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                      <Image className="w-12 h-12 text-muted-foreground/50" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="text-xs text-white font-medium truncate">{image.caption}</p>
                                        <p className="text-[10px] text-white/70 mt-1">by {image.uploader} · {image.uploadDate}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {galleryImages.filter(img => img.status === "approved").length === 0 && (
                                <div className="text-center py-12 text-muted-foreground text-sm">
                                  暂无已审核的图片
                                </div>
                              )}
                            </div>

                            {showUploadModal && (
                              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowUploadModal(false)}>
                                <div className="bg-card border border-border rounded-lg w-full max-w-md p-4" onClick={e => e.stopPropagation()}>
                                  <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-foreground">提交图片</h3>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowUploadModal(false)}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                                    <div className="text-xs font-semibold text-blue-600 mb-2">上传规则</div>
                                    <ul className="text-[10px] text-muted-foreground space-y-1">
                                      <li>�?图片需与该资源相关，展示资源的使用效果或特色内�?/li>
                                      <li>�?图片内容需健康向上，不得包含违规信�?/li>
                                      <li>�?图片需为原创或已获得授权，不得侵犯他人版权</li>
                                      <li>�?上传的图片需经制作方审核后才会显示在画廊�?/li>
                                      <li>�?请确保图片清晰，分辨率不低于 800x600</li>
                                    </ul>
                                  </div>

                                  <div className="space-y-3">
                                    <div>
                                      <label className="text-xs text-muted-foreground mb-1 block">图片链接</label>
                                      <Input
                                        value={newGalleryImage}
                                        onChange={(e) => setNewGalleryImage(e.target.value)}
                                        placeholder="输入图片URL..."
                                        className="text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-muted-foreground mb-1 block">图片描述</label>
                                      <Input
                                        value={newGalleryCaption}
                                        onChange={(e) => setNewGalleryCaption(e.target.value)}
                                        placeholder="描述这张图片..."
                                        className="text-sm"
                                      />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                      <Button size="sm" variant="outline" onClick={() => setShowUploadModal(false)}>取消</Button>
                                      <Button size="sm" onClick={() => {
                                        if (newGalleryImage && newGalleryCaption) {
                                          setGalleryImages([...galleryImages, {
                                            id: Date.now().toString(),
                                            url: newGalleryImage,
                                            caption: newGalleryCaption,
                                            uploader: "当前用户",
                                            uploadDate: new Date().toISOString().split('T')[0],
                                            status: "pending"
                                          }]);
                                          setNewGalleryImage("");
                                          setNewGalleryCaption("");
                                          setShowUploadModal(false);
                                        }
                                      }}>提交</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </TabsContent>
                          )}

                          {/* ============ 5. 下载/获取 - COMPLETE ============ */}
                          <TabsContent value="download" className="mt-0 h-full overflow-y-auto">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">
                                  {detailResourceType === "image" ? "获取方式" : "版本下载"}
                                </h3>
                                {detailResourceType !== "image" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setShowDownloadUploadModal(true)}
                                  >
                                    <Upload className="w-3 h-3 mr-1" /> 上传版本
                                  </Button>
                                )}
                              </div>

                              {/* IMAGE: Special obtain interface */}
                              {detailResourceType === "image" && (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold">获取方式</h3>
                                    <div className="flex items-center gap-2">
                                      <Badge className="text-[10px] h-5 px-2 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                        审核�?                                      </Badge>
                                      <div className="relative">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button size="sm" variant="outline" className="h-7 px-2 text-[10px]">
                                              <Settings className="w-3.5 h-3.5 mr-1" /> 管理
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem onClick={() => setShowImageUploadModal(true)} className="text-xs cursor-pointer">
                                              <Upload className="w-3.5 h-3.5 mr-2" /> 上传文件
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setShowObtainMethodModal(true)} className="text-xs cursor-pointer">
                                              <Edit className="w-3.5 h-3.5 mr-2" /> 修改获取方式
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-lg p-4 border">
                                    <div className="flex items-center gap-3 mb-3">
                                      <span className="text-3xl">🆓</span>
                                      <div className="flex-1">
                                        <div className="text-base font-semibold text-foreground">免费</div>
                                        <div className="text-xs text-muted-foreground">所有用户可直接下载使用</div>
                                      </div>
                                      <span className="text-2xl font-bold text-primary">免费</span>
                                    </div>
                                    <Button className="w-full h-9 text-sm">
                                      <Download className="w-4 h-4 mr-2" /> 立即获取
                                    </Button>
                                  </div>

                                  <div>
                                    <h4 className="text-xs font-semibold text-foreground mb-3">版本历史</h4>
                                    <div className="border border-border rounded-lg overflow-hidden">
                                      <div className="divide-y divide-border">
                                        {[
                                          { version: "v2.1.0", date: "2024-03-28", author: "Designer_A", changes: "优化光影效果", size: "256KB" },
                                          { version: "v2.0.0", date: "2024-03-15", author: "Designer_A", changes: "全新高清重制", size: "234KB" },
                                          { version: "v1.5.2", date: "2024-02-20", author: "Designer_A", changes: "修复披风显示", size: "198KB" },
                                          { version: "v1.0.0", date: "2024-01-10", author: "Designer_A", changes: "首次发布", size: "128KB" },
                                        ].map((v, i) => (
                                          <div key={i} className="px-3 py-2.5 hover:bg-secondary/20 transition-colors">
                                            <div className="flex items-center justify-between mb-1">
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-foreground">{v.version}</span>
                                                <span className="text-[10px] text-muted-foreground">{v.date}</span>
                                              </div>
                                              <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]">
                                                <Download className="w-3 h-3 mr-1" /> 下载
                                              </Button>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                              <span>作者：{v.author}</span>
                                              <span>更新：{v.changes}</span>
                                              <span>大小：{v.size}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Non-image content - version download */}
                              {detailResourceType !== "image" && (
                                <div className={`gap-4 min-h-[500px] ${detailResourceType === "mod" ? "flex" : ""}`}>
                                  <div className={`flex flex-col ${detailResourceType === "mod" ? "w-1/2" : "w-full"}`}>
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="text-xs font-semibold text-foreground">版本列表</h4>
                                    </div>

                                    <div className="flex gap-2 mb-3">
                                    <select
                                      value={versionFilter}
                                      onChange={(e) => setVersionFilter(e.target.value)}
                                      className="h-7 px-2 text-[10px] border border-input rounded-md bg-background flex-1"
                                    >
                                      <option value="all">所有游戏版�?/option>
                                      <option value="1.20.1">1.20.1</option>
                                      <option value="1.19.2">1.19.2</option>
                                      <option value="1.18.2">1.18.2</option>
                                    </select>
                                    {detailResourceType === "mod" && (
                                      <select
                                        value={loaderFilter}
                                        onChange={(e) => setLoaderFilter(e.target.value)}
                                        className="h-7 px-2 text-[10px] border border-input rounded-md bg-background flex-1"
                                      >
                                        <option value="all">所有加载器</option>
                                        <option value="Forge">Forge</option>
                                        <option value="Fabric">Fabric</option>
                                        <option value="NeoForge">NeoForge</option>
                                        <option value="Quilt">Quilt</option>
                                      </select>
                                    )}
                                  </div>

                                  <div className="flex-1 overflow-y-auto border border-border rounded-lg">
                                    <div className="divide-y divide-border">
                                      {resourceVersions
                                        .filter(v => versionFilter === "all" || v.gameVersion === versionFilter)
                                        .filter(v => detailResourceType !== "mod" || loaderFilter === "all" || v.loader === loaderFilter)
                                        .map((v) => (
                                          <div 
                                            key={v.id} 
                                            className={`px-3 py-2.5 cursor-pointer transition-colors ${
                                              selectedDownloadVersion === v.id 
                                                ? "bg-primary/10 border-l-2 border-primary" 
                                                : "hover:bg-secondary/20"
                                            }`}
                                            onClick={() => setSelectedDownloadVersion(v.id)}
                                          >
                                            <div className="flex items-center justify-between mb-1.5">
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-foreground">{v.version}</span>
                                                {v.isLatest && (
                                                  <Badge className="text-[9px] h-3.5 px-1 bg-green-500/10 text-green-600 border-green-500/20">
                                                    最�?                                                  </Badge>
                                                )}
                                              </div>
                                              <Button size="sm" className="h-5.5 px-2 text-[10px]">
                                                <Download className="w-2.5 h-2.5 mr-0.5" /> 下载
                                              </Button>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
                                              <span>{v.gameVersion}</span>
                                              {detailResourceType === "mod" && (
                                                <Badge variant="outline" className="text-[9px] h-3.5">{v.loader}</Badge>
                                              )}
                                              <span>{v.releaseDate}</span>
                                              <span>{(v.downloads / 1000).toFixed(1)}K 下载</span>
                                              <span>{v.fileSize}</span>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </div>

                                  {resourceVersions.filter(v => versionFilter === "all" || v.gameVersion === versionFilter).filter(v => detailResourceType !== "mod" || loaderFilter === "all" || v.loader === loaderFilter).length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground text-xs">
                                      没有找到符合条件的版�?                                    </div>
                                  )}
                                </div>

                                {detailResourceType === "mod" && (
                                  <div className="w-1/2 flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="text-xs font-semibold text-foreground">
                                        {selectedDownloadVersion 
                                          ? `${resourceVersions.find(v => v.id === selectedDownloadVersion)?.version || ""} 联动模组`
                                          : "联动模组"
                                        }
                                      </h4>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                      <div className="border border-border rounded-lg p-2 bg-blue-500/5">
                                        <div className="text-[9px] font-semibold text-blue-600">前置模组</div>
                                        <div className="text-[8px] text-muted-foreground">必须安装</div>
                                      </div>
                                      <div className="border border-border rounded-lg p-2 bg-purple-500/5">
                                        <div className="text-[9px] font-semibold text-purple-600">依赖模组</div>
                                        <div className="text-[8px] text-muted-foreground">需要该模组</div>
                                      </div>
                                      <div className="border border-border rounded-lg p-2 bg-green-500/5">
                                        <div className="text-[9px] font-semibold text-green-600">联动模组</div>
                                        <div className="text-[8px] text-muted-foreground">特殊效果</div>
                                      </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto border border-border rounded-lg">
                                      {selectedDownloadVersion ? (
                                        <div className="p-2.5 space-y-2.5">
                                          {(() => {
                                            const selectedVer = relatedVersions.find(v => v.id === selectedDownloadVersion);
                                            if (!selectedVer) {
                                              return (
                                                <div className="text-center py-8 text-muted-foreground text-[10px]">
                                                  该版本暂无联动模组信�?                                                </div>
                                              );
                                            }

                                          return (
                                            <>
                                              {selectedVer.prerequisites.length > 0 && (
                                                <div>
                                                  <div className="text-[10px] font-semibold text-blue-600 mb-1.5 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                    前置模组 ({selectedVer.prerequisites.length})
                                                  </div>
                                                  <div className="space-y-1.5">
                                                    {selectedVer.prerequisites.map((mod) => (
                                                      <div 
                                                        key={mod.id} 
                                                        className="flex items-center gap-2 px-2 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-md hover:bg-blue-500/20 transition-colors cursor-pointer"
                                                      >
                                                        <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                                                          <Image className="w-3 h-3 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                          <div className="text-[10px] font-medium text-foreground truncate">{mod.name}</div>
                                                          <div className="text-[8px] text-muted-foreground truncate">{mod.description}</div>
                                                        </div>
                                                        <div className="text-[8px] text-muted-foreground text-right">
                                                          <div>by {mod.author}</div>
                                                          <div>{(mod.downloads / 1000000).toFixed(1)}M</div>
                                                        </div>
                                                        <Button size="sm" className="h-5 px-1.5 text-[8px] flex-shrink-0">
                                                          <Download className="w-2 h-2 mr-0.5" />
                                                        </Button>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}

                                              {selectedVer.dependencies.length > 0 && (
                                                <div>
                                                  <div className="text-[10px] font-semibold text-purple-600 mb-1.5 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                                    依赖模组 ({selectedVer.dependencies.length})
                                                  </div>
                                                  <div className="space-y-1.5">
                                                    {selectedVer.dependencies.map((mod) => (
                                                      <div 
                                                        key={mod.id} 
                                                        className="flex items-center gap-2 px-2 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-md hover:bg-purple-500/20 transition-colors cursor-pointer"
                                                      >
                                                        <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0">
                                                          <Image className="w-3 h-3 text-purple-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                          <div className="text-[10px] font-medium text-foreground truncate">{mod.name}</div>
                                                          <div className="text-[8px] text-muted-foreground truncate">{mod.description}</div>
                                                        </div>
                                                        <div className="text-[8px] text-muted-foreground text-right">
                                                          <div>by {mod.author}</div>
                                                          <div>{(mod.downloads / 1000).toFixed(0)}K</div>
                                                        </div>
                                                        <Button size="sm" className="h-5 px-1.5 text-[8px] flex-shrink-0">
                                                          <Download className="w-2 h-2 mr-0.5" />
                                                        </Button>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}

                                              {selectedVer.integrations.length > 0 && (
                                                <div>
                                                  <div className="text-[10px] font-semibold text-green-600 mb-1.5 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    联动模组 ({selectedVer.integrations.length})
                                                  </div>
                                                  <div className="space-y-1.5">
                                                    {selectedVer.integrations.map((mod) => (
                                                      <div 
                                                        key={mod.id} 
                                                        className="flex items-center gap-2 px-2 py-1.5 bg-green-500/10 border border-green-500/20 rounded-md hover:bg-green-500/20 transition-colors cursor-pointer"
                                                      >
                                                        <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0">
                                                          <Image className="w-3 h-3 text-green-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                          <div className="text-[10px] font-medium text-foreground truncate">{mod.name}</div>
                                                          <div className="text-[8px] text-muted-foreground truncate">{mod.description}</div>
                                                        </div>
                                                        <div className="text-[8px] text-muted-foreground text-right">
                                                          <div>by {mod.author}</div>
                                                          <div>{(mod.downloads / 1000000).toFixed(1)}M</div>
                                                        </div>
                                                        <Button size="sm" className="h-5 px-1.5 text-[8px] flex-shrink-0">
                                                          <Download className="w-2 h-2 mr-0.5" />
                                                        </Button>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}

                                              {selectedVer.prerequisites.length === 0 && selectedVer.dependencies.length === 0 && selectedVer.integrations.length === 0 && (
                                                <div className="text-center py-8 text-muted-foreground text-[10px]">
                                                  该版本暂无联动模�?                                                </div>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-muted-foreground text-[10px]">
                                        请在左侧选择一个版本查看联动模�?                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              </div>
                              )}
                            </div>
                          </TabsContent>

                          {showDownloadUploadModal && (
                              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDownloadUploadModal(false)}>
                                <div className="bg-card border border-border rounded-lg w-full max-w-md p-4" onClick={e => e.stopPropagation()}>
                                  <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-foreground">上传版本</h3>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowDownloadUploadModal(false)}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  {detailResourceType === "mod" && (
                                    <>
                                  <div className="flex gap-2 mb-4">
                                    <button
                                      onClick={() => setDownloadUploadTab("version")}
                                      className={`flex-1 px-3 py-2 text-xs rounded-md border transition-colors ${
                                        downloadUploadTab === "version"
                                          ? "bg-primary/10 border-primary/20 text-primary"
                                          : "border-border hover:bg-secondary"
                                      }`}
                                    >
                                      上传版本
                                    </button>
                                    <button
                                      onClick={() => setDownloadUploadTab("related")}
                                      className={`flex-1 px-3 py-2 text-xs rounded-md border transition-colors ${
                                        downloadUploadTab === "related"
                                          ? "bg-primary/10 border-primary/20 text-primary"
                                          : "border-border hover:bg-secondary"
                                      }`}
                                    >
                                      上传联动
                                    </button>
                                  </div>
                                    </>
                                  )}
                                  {detailResourceType === "map" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传地图版本</h4>
                                  )}
                                  {detailResourceType === "datapack" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传数据包版�?/h4>
                                  )}
                                  {detailResourceType === "modpack" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传整合包版�?/h4>
                                  )}
                                  {detailResourceType === "server" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传服务器配�?/h4>
                                  )}
                                  {detailResourceType === "resourcepack" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传材质�?/h4>
                                  )}
                                  {detailResourceType === "shader" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传光影�?/h4>
                                  )}
                                  {detailResourceType === "building" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传建筑文件</h4>
                                  )}
                                  {detailResourceType === "audio" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传音频资源�?/h4>
                                  )}
                                  {detailResourceType === "ecoTool" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传工具软件</h4>
                                  )}
                                  {detailResourceType === "doc" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传文档文件</h4>
                                  )}
                                  {detailResourceType === "image" && (
                                    <h4 className="text-xs font-semibold text-foreground mb-3">上传皮肤文件</h4>
                                  )}

                                  {(detailResourceType !== "mod" || downloadUploadTab === "version") && (
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">版本�?/label>
                                        <Input placeholder="例如: 1.20.1-0.5.1" className="text-sm h-8" />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs text-muted-foreground mb-1 block">游戏版本</label>
                                          <select className="w-full h-8 px-2 text-sm border border-input rounded-md bg-background">
                                            <option>1.20.1</option>
                                            <option>1.19.2</option>
                                            <option>1.18.2</option>
                                          </select>
                                        </div>
                                        {detailResourceType === "mod" && (
                                          <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">加载�?/label>
                                            <select className="w-full h-8 px-2 text-sm border border-input rounded-md bg-background">
                                              <option>Forge</option>
                                              <option>Fabric</option>
                                              <option>NeoForge</option>
                                            </select>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">文件</label>
                                        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/20 transition-colors">
                                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                          <p className="text-xs text-muted-foreground">
                                            {detailResourceType === "mod" && "点击或拖拽上�?JAR 文件"}
                                            {detailResourceType === "map" && "点击或拖拽上传地图存档文�?}
                                            {detailResourceType === "datapack" && "点击或拖拽上传数据包 ZIP 文件"}
                                            {detailResourceType === "modpack" && "点击或拖拽上传整合包配置文件"}
                                            {detailResourceType === "server" && "点击或拖拽上传服务器配置文件"}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">更新日志</label>
                                        <textarea 
                                          className="w-full h-20 px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
                                          placeholder="描述此版本的更新内容..."
                                        />
                                      </div>
                                      <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => setShowDownloadUploadModal(false)}>取消</Button>
                                        <Button size="sm">上传</Button>
                                      </div>
                                    </div>
                                  )}
                                  {detailResourceType === "mod" && downloadUploadTab === "related" && (
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">选择版本</label>
                                        <select className="w-full h-8 px-2 text-sm border border-input rounded-md bg-background">
                                          {resourceVersions.map(v => (
                                            <option key={v.id}>{v.version}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">联动类型</label>
                                        <select className="w-full h-8 px-2 text-sm border border-input rounded-md bg-background">
                                          <option value="prerequisite">前置模组</option>
                                          <option value="dependency">依赖模组</option>
                                          <option value="integration">联动模组</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">模组名称</label>
                                        <Input placeholder="输入模组名称" className="text-sm h-8" />
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">模组描述</label>
                                        <Input placeholder="简要描述该联动" className="text-sm h-8" />
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex gap-2 justify-end">
                                    <Button size="sm" variant="outline" onClick={() => setShowDownloadUploadModal(false)}>取消</Button>
                                    <Button size="sm">添加</Button>
                                  </div>
                                </div>
                              </div>
                            )}

                          {showImageUploadModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageUploadModal(false)}>
                              <div className="bg-card border border-border rounded-lg w-full max-w-md p-4" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-sm font-semibold text-foreground">上传形象文件</h3>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowImageUploadModal(false)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="space-y-4">
                                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                    <div className="w-12 h-12 mx-auto mb-3 bg-secondary rounded-lg flex items-center justify-center">
                                      <Upload className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">点击或拖拽文件到此处上传</div>
                                    <div className="text-[10px] text-muted-foreground">支持 PNG 格式，建�?64x64 �?128x128 分辨�?/div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">版本�?/label>
                                    <Input placeholder="例如: v1.0.0" className="text-sm h-8" />
                                  </div>
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">更新说明</label>
                                    <textarea className="w-full h-20 px-3 py-2 text-sm border border-input rounded-md bg-background resize-none" placeholder="描述本次更新的内�? />
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <Button size="sm" variant="outline" onClick={() => setShowImageUploadModal(false)}>取消</Button>
                                    <Button size="sm">上传</Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {showObtainMethodModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowObtainMethodModal(false)}>
                              <div className="bg-card border border-border rounded-lg w-full max-w-md p-4" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-sm font-semibold text-foreground">修改获取方式</h3>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowObtainMethodModal(false)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                                  <div className="flex items-center gap-2 text-xs text-yellow-600">
                                    <span>⚠️</span>
                                    <span>修改获取方式后需要经过管理员审核才能生效</span>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  {[
                                    { type: "free", name: "免费", desc: "所有用户免费下�?, price: "" },
                                    { type: "exclusive", name: "定制", desc: "首位买家独享定制�?, price: "99" },
                                    { type: "buyout", name: "买断", desc: "一次性付费永久使�?, price: "29" },
                                    { type: "subscription", name: "订阅", desc: "按月订阅使用", price: "9.9" },
                                  ].map((method, i) => (
                                    <div key={i} className="p-3 border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-foreground">{method.name}</span>
                                        <input type="radio" name="obtainMethod" defaultChecked={i === 0} className="text-primary" />
                                      </div>
                                      <div className="text-[10px] text-muted-foreground mb-2">{method.desc}</div>
                                      {method.price && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] text-muted-foreground">价格：�?/span>
                                          <input 
                                            type="number" 
                                            defaultValue={method.price}
                                            className="w-20 h-6 px-2 text-[10px] border border-input rounded"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  <div className="flex gap-2 justify-end pt-2">
                                    <Button size="sm" variant="outline" onClick={() => setShowObtainMethodModal(false)}>取消</Button>
                                    <Button size="sm">保存</Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ============ 6. 协议 - COMPLETE ============ */}
                          <TabsContent value="agreement" className="mt-0 h-full overflow-y-auto">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">协议</h3>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => setShowLicenseSubmitModal(true)}
                                >
                                  <Edit className="w-3 h-3 mr-1" /> 提交协议
                                </Button>
                              </div>

                              {detailResourceType === "image" ? (
                                <div className="space-y-3">
                                  <div 
                                    className="border rounded-lg p-4 bg-card hover:bg-secondary/20 transition-colors cursor-pointer border-purple-500/30 bg-purple-500/5"
                                    onClick={() => {
                                      setSelectedLicense({
                                        type: "original-image",
                                        title: "形象资源原创协议",
                                        description: "适用于皮肤、披风等形象类资源的原创协议"
                                      });
                                      setShowLicenseDetailModal(true);
                                    }}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">形象专属协议</Badge>
                                        <span className="text-xs text-muted-foreground">形象资源</span>
                                      </div>
                                      <Badge className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                                        当前
                                      </Badge>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                      针对皮肤、披风、角色形象等资源的特殊使用约定，包括商业使用授权、二次创作、署名要求等条款
                                    </div>
                                  </div>

                                  <div 
                                    className="border border-border rounded-lg p-4 bg-card hover:bg-secondary/20 transition-colors cursor-pointer"
                                    onClick={() => {
                                      setSelectedLicense({
                                        type: "repost-image",
                                        title: "形象资源转载协议",
                                        description: "适用于非原创形象类资源的转载使用协议"
                                      });
                                      setShowLicenseDetailModal(true);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline">转载协议</Badge>
                                      <span className="text-xs text-muted-foreground">形象资源</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                      非原创形象资源的使用规范，包括原作者署名要求、使用范围限制、禁止商用等条款
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <div 
                                    className="border rounded-lg p-4 bg-card hover:bg-secondary/20 transition-colors cursor-pointer border-blue-500/30 bg-blue-500/5"
                                    onClick={() => {
                                      setSelectedLicense({
                                        type: "original-normal",
                                        title: "常规资源原创协议",
                                        description: "适用于非形象类常规资源的原创协议"
                                      });
                                      setShowLicenseDetailModal(true);
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">原创协议</Badge>
                                        <span className="text-xs text-muted-foreground">常规资源</span>
                                      </div>
                                      <Badge className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                                        当前
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {showLicenseDetailModal && selectedLicense && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLicenseDetailModal(false)}>
                                  <div className="bg-card border border-border rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-start justify-between mb-4">
                                      <div>
                                        <h2 className="text-lg font-bold text-foreground mb-2">{selectedLicense.title}</h2>
                                        <p className="text-xs text-muted-foreground">{selectedLicense.description}</p>
                                      </div>
                                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowLicenseDetailModal(false)}>
                                        <X className="w-5 h-5" />
                                      </Button>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="bg-secondary/30 border border-border rounded-lg p-4">
                                      <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {selectedLicense.type === "original-normal" && (
                                          `【免责声明�?
本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联�?
【基本声明�?
本资源内容严格遵守微软官方《Minecraft 最终用户许可协议�?EULA) 和《Minecraft 商业使用指南》的相关规定�?
根据Minecraft官方政策，本资源属于游戏内容资源，必须免费提供给所有用户。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素�?
本资源内容免费无偿供所有用户使用。用户在遵守相关使用条款的前提下，可自由下载、使用和分享该资源内容，无需支付任何费用�?
【平台声明�?
本平台要求平台内的制作原创内容的制作方如果使用本平台发布自己的原创作品，便不能再其它网站发布这些作品，本平台对搬运内容不做要求�?
【作者声明�?
本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源�?
本人同样遵守自己身为该平台的进行原创活动的制作方的各项基本要求�?
用户在使用本资源时，应遵守以下约定：
�?允许个人非商业用途使�?�?允许在游戏中展示和使�?�?允许制作视频、直播等Minecraft相关内容并通过平台广告、赞助、捐赠等方式获得收益
�?允许接受用户自愿捐赠
�?用户对制作方及作品的订阅及打赏行为均为自主无偿赠予行为，平台及作者不会要求用户必须订阅或打赏后才能使用这些内�?�?禁止直接出售本资源或通过本资源直接盈�?�?禁止未经授权的二次分�?�?禁止将本资源用于推广与Minecraft无关的产品、服务或品牌

【知识产权声明�?
本资源中所有原创内容的知识产权归作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`
                                        )}
                                        {selectedLicense.type === "repost-normal" && (
                                          `【免责声明�?
本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联�?
【基本声明�?
本资源内容严格遵守微软官方《Minecraft 最终用户许可协议�?EULA) 和《Minecraft 商业使用指南》的相关规定�?
根据Minecraft官方政策，本资源属于游戏内容资源，必须免费提供给所有用户。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素�?
本资源内容免费无偿供所有用户使用。用户在遵守相关使用条款的前提下，可自由下载、使用和分享该资源内容，无需支付任何费用�?
【作者声明�?
本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源�?
用户在使用本资源时，应遵守以下约定：
�?允许个人非商业用途使�?�?允许在游戏中展示和使�?�?允许制作视频、直播等Minecraft相关内容并通过平台广告、赞助、捐赠等方式获得收益
�?允许接受用户自愿捐赠
�?用户对制作方及作品的订阅及打赏行为均为自主无偿赠予行为，平台及作者不会要求用户必须订阅或打赏后才能使用这些内�?�?禁止直接出售本资源或通过本资源直接盈�?�?禁止未经授权的二次分�?�?禁止将本资源用于推广与Minecraft无关的产品、服务或品牌

【搬运声明�?
本资源已获得原制作方的明确授权，允许搬运至本平台并交由搬运方进行管理�?
搬运方承诺遵守原制作方的所有使用要求，并确保资源的完整性和合规性。搬运方应及时同步原资源的更新，保持资源内容的最新状态�?
搬运方与原作者之间的约定�?�?搬运方需在资源页面明确标注原作者信�?�?搬运方需及时同步原作者的更新内容
�?搬运方不得擅自修改资源内�?�?如原作者要求下架，搬运方应立即配合

【知识产权声明�?
本资源中所有原创内容的知识产权归原作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`
                                        )}
                                        {selectedLicense.type === "original-image" && (
                                          `【免责声明�?
本形象为非官方Minecraft产品，未经Mojang或Microsoft批准或关联�?
【基本声明�?
本形象内容严格遵守微软官方《Minecraft 最终用户许可协议�?EULA) 和《Minecraft 商业使用指南》的相关规定。所有内容均为原创设计，不包含任何侵犯微软或Mojang Studios知识产权的元素�?
根据Minecraft官方政策，本形象属于装饰性物品。游戏形象（如皮肤、光环等）属于游戏内装饰性物品，社区形象（如头像、徽章等）属于游戏外装饰性物品。无论游戏形象还是社区形象，制作方均可自主决定收费方式。用户需按照制作方设定的获取方式（免费、定制、买断、订阅）获取该形象内容的使用权�?
本平台要求平台内的制作原创内容的制作方如果使用本平台发布自己的原创作品，便不能再其它网站发布这些作品，本平台对搬运内容不做要求�?
【作者声明�?
本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源�?
本人同样遵守自己身为该平台的进行原创活动的制作方的各项基本要求�?
用户在使用本资源时，应遵守以下约定：
�?允许个人非商业用途使�?�?允许在游戏中展示和使�?�?按照制作方设定的获取方式使用
�?禁止未经授权的二次分�?
【知识产权声明�?
本形象中所有原创内容的知识产权归作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`
                                        )}
                                        {selectedLicense.type === "repost-image" && (
                                          `【免责声明�?
本形象为非官方Minecraft产品，未经Mojang或Microsoft批准或关联�?
【基本声明�?
本形象内容严格遵守微软官方《Minecraft 最终用户许可协议�?EULA) 和《Minecraft 商业使用指南》的相关规定。所有内容均为原创设计，不包含任何侵犯微软或Mojang Studios知识产权的元素�?
根据Minecraft官方政策，本形象属于装饰性物品。游戏形象（如皮肤、光环等）属于游戏内装饰性物品，社区形象（如头像、徽章等）属于游戏外装饰性物品。无论游戏形象还是社区形象，制作方均可自主决定收费方式。用户需按照制作方设定的获取方式（免费、定制、买断、订阅）获取该形象内容的使用权�?
【作者声明�?
本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源�?
用户在使用本资源时，应遵守以下约定：
�?允许个人非商业用途使�?�?允许在游戏中展示和使�?�?按照制作方设定的获取方式使用
�?禁止未经授权的二次分�?
【搬运声明�?
本资源已获得原制作方的明确授权，允许搬运至本平台并交由搬运方进行管理�?
搬运方承诺遵守原制作方的所有使用要求，并确保资源的完整性和合规性。搬运方应及时同步原资源的更新，保持资源内容的最新状态�?
搬运方与原作者之间的约定�?�?搬运方需在资源页面明确标注原作者信�?�?搬运方需及时同步原作者的更新内容
�?搬运方不得擅自修改资源内�?�?如原作者要求下架，搬运方应立即配合

【知识产权声明�?
本形象中所有原创内容的知识产权归原作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`
                                        )}
                                      </div>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="flex justify-end">
                                      <Button size="sm" variant="outline" className="h-8" onClick={() => setShowLicenseDetailModal(false)}>
                                        关闭
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {showLicenseSubmitModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLicenseSubmitModal(false)}>
                                  <div className="bg-card border border-border rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-start justify-between mb-4">
                                      <div>
                                        <h2 className="text-lg font-bold text-foreground mb-2">提交协议</h2>
                                        <p className="text-xs text-muted-foreground">选择协议模板并进行编�?/p>
                                      </div>
                                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowLicenseSubmitModal(false)}>
                                        <X className="w-5 h-5" />
                                      </Button>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-xs text-muted-foreground mb-2 block">选择协议模板</label>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div 
                                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                              selectedLicenseTemplate === "original-normal" ? "border-blue-500 bg-blue-500/10" : "border-border hover:bg-secondary/20"
                                            }`}
                                            onClick={() => {
                                              setSelectedLicenseTemplate("original-normal");
                                              setNewLicenseContent(`【免责声明�?
本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联�?
【基本声明�?
本资源内容严格遵守微软官方《Minecraft 最终用户许可协议�?EULA) 和《Minecraft 商业使用指南》的相关规定�?
根据Minecraft官方政策，本资源属于游戏内容资源，必须免费提供给所有用户。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素�?
本资源内容免费无偿供所有用户使用。用户在遵守相关使用条款的前提下，可自由下载、使用和分享该资源内容，无需支付任何费用�?
【平台声明�?
本平台要求平台内的制作原创内容的制作方如果使用本平台发布自己的原创作品，便不能再其它网站发布这些作品，本平台对搬运内容不做要求�?
【作者声明�?
本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源�?
本人同样遵守自己身为该平台的进行原创活动的制作方的各项基本要求�?
用户在使用本资源时，应遵守以下约定：
�?允许个人非商业用途使�?�?允许在游戏中展示和使�?�?允许制作视频、直播等Minecraft相关内容并通过平台广告、赞助、捐赠等方式获得收益
�?允许接受用户自愿捐赠
�?用户对制作方及作品的订阅及打赏行为均为自主无偿赠予行为，平台及作者不会要求用户必须订阅或打赏后才能使用这些内�?�?禁止直接出售本资源或通过本资源直接盈�?�?禁止未经授权的二次分�?�?禁止将本资源用于推广与Minecraft无关的产品、服务或品牌

【知识产权声明�?
本资源中所有原创内容的知识产权归作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`);
                                            }}
                                          >
                                            <div className="flex items-center gap-2 mb-1">
                                              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">原创协议</Badge>
                                              <span className="text-[10px] text-muted-foreground">常规资源</span>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">适用于非形象类资�?/div>
                                          </div>

                                          <div 
                                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                              selectedLicenseTemplate === "repost-normal" ? "border-orange-500 bg-orange-500/10" : "border-border hover:bg-secondary/20"
                                            }`}
                                            onClick={() => {
                                              setSelectedLicenseTemplate("repost-normal");
                                              setNewLicenseContent(`【免责声明�?
本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联�?
【基本声明�?
本资源内容严格遵守微软官方《Minecraft 最终用户许可协议�?EULA) 和《Minecraft 商业使用指南》的相关规定�?
根据Minecraft官方政策，本资源属于游戏内容资源，必须免费提供给所有用户。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素�?
本资源内容免费无偿供所有用户使用。用户在遵守相关使用条款的前提下，可自由下载、使用和分享该资源内容，无需支付任何费用�?
【作者声明�?
本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源�?
用户在使用本资源时，应遵守以下约定：
�?允许个人非商业用途使�?�?允许在游戏中展示和使�?�?允许制作视频、直播等Minecraft相关内容并通过平台广告、赞助、捐赠等方式获得收益
�?允许接受用户自愿捐赠
�?用户对制作方及作品的订阅及打赏行为均为自主无偿赠予行为，平台及作者不会要求用户必须订阅或打赏后才能使用这些内�?�?禁止直接出售本资源或通过本资源直接盈�?�?禁止未经授权的二次分�?�?禁止将本资源用于推广与Minecraft无关的产品、服务或品牌

【搬运声明�?
本资源已获得原制作方的明确授权，允许搬运至本平台并交由搬运方进行管理�?
搬运方承诺遵守原制作方的所有使用要求，并确保资源的完整性和合规性。搬运方应及时同步原资源的更新，保持资源内容的最新状态�?
搬运方与原作者之间的约定�?�?搬运方需在资源页面明确标注原作者信�?�?搬运方需及时同步原作者的更新内容
�?搬运方不得擅自修改资源内�?�?如原作者要求下架，搬运方应立即配合

【知识产权声明�?
本资源中所有原创内容的知识产权归原作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`);
                                            }}
                                          >
                                            <div className="flex items-center gap-2 mb-1">
                                              <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-[10px]">搬运协议</Badge>
                                              <span className="text-[10px] text-muted-foreground">常规资源</span>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">适用于已授权搬运的资�?/div>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <label className="text-xs text-muted-foreground mb-2 block">协议内容（可编辑�?/label>
                                        <textarea
                                          value={newLicenseContent}
                                          onChange={(e) => setNewLicenseContent(e.target.value)}
                                          placeholder="请选择模板或手动输入协议内�?.."
                                          className="w-full min-h-[400px] px-3 py-2 text-xs font-mono border border-input rounded-md bg-background resize-none"
                                          disabled={!selectedLicenseTemplate}
                                        />
                                      </div>

                                      <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => {
                                          setShowLicenseSubmitModal(false);
                                          setSelectedLicenseTemplate(null);
                                          setNewLicenseContent("");
                                        }}>取消</Button>
                                        <Button size="sm" onClick={() => {
                                          if (selectedLicenseTemplate && newLicenseContent) {
                                            setShowLicenseSubmitModal(false);
                                            setSelectedLicenseTemplate(null);
                                            setNewLicenseContent("");
                                          }
                                        }} disabled={!selectedLicenseTemplate || !newLicenseContent}>提交审核</Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          {/* ============ 7. 日志 - COMPLETE ============ */}
                          <TabsContent value="changelog" className="mt-0 h-full overflow-y-auto">
                            <div className="space-y-4">
                              <h3 className="text-sm font-semibold">编辑历史记录</h3>
                              
                              <div className="space-y-3">
                                {[
                                  { id: "1", timestamp: new Date("2024-12-22 14:20:00"), author: "创世工匠", action: "update", section: "下载", description: "添加新版�?v1.3.0", details: "新增了多方块结构系统，添加了齿轮箱和应力�? },
                                  { id: "2", timestamp: new Date("2024-12-20 10:00:00"), author: "创世工匠", action: "update", section: "内容详情", description: "编辑词条内容", details: "更新了「动力源」词条的描述和配方信�? },
                                  { id: "3", timestamp: new Date("2024-12-18 13:45:00"), author: "创世工匠", action: "update", section: "基本介绍", description: "更新基本信息", details: "修改了内容方向标签，从「科技」调整为「科技、辅助�? },
                                  { id: "4", timestamp: new Date("2024-12-15 15:00:00"), author: "创世工匠", action: "update", section: "协议", description: "提交原创协议", details: "提交并发布了资源的原创协�? },
                                  { id: "5", timestamp: new Date("2024-12-12 11:30:00"), author: "创世工匠", action: "update", section: "下载", description: "添加联动模组", details: "�?v1.2.0 版本添加了前置模组「机械核心」和联动模组「工业时代�? },
                                  { id: "6", timestamp: new Date("2024-12-10 09:20:00"), author: "创世工匠", action: "update", section: "内容详情", description: "添加热词词条", details: "在物�?方块分类下添加了「动力源」「传送带」等词条" },
                                  { id: "7", timestamp: new Date("2024-12-08 16:45:00"), author: "创世工匠", action: "update", section: "下载", description: "添加新版�?v1.2.0", details: "新增了传送带系统，修复了动力源崩溃问题，优化了性能" },
                                  { id: "8", timestamp: new Date("2024-12-05 10:15:00"), author: "创世工匠", action: "update", section: "基本介绍", description: "更新资源简�?, details: "优化了资源简介的描述，增加了更多功能说明" },
                                  { id: "9", timestamp: new Date("2024-12-01 14:30:00"), author: "创世工匠", action: "create", section: "基本介绍", description: "创建资源", details: "首次发布模组资源，包含基础的机械动力系�? },
                                ]
                                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                                  .map((log) => (
                                    <div 
                                      key={log.id} 
                                      className="border border-border rounded-lg p-4 bg-card hover:bg-secondary/10 transition-colors"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                          <div className={`w-2 h-2 rounded-full ${
                                            log.action === "create" ? "bg-green-500" :
                                            log.action === "update" ? "bg-blue-500" :
                                            "bg-red-500"
                                          }`} />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <Badge 
                                              variant="outline" 
                                              className={`text-[10px] px-2 py-0.5 ${
                                                log.action === "create" ? "border-green-500/30 text-green-600" :
                                                log.action === "update" ? "border-blue-500/30 text-blue-600" :
                                                "border-red-500/30 text-red-600"
                                              }`}
                                            >
                                              {log.action === "create" ? "创建" :
                                               log.action === "update" ? "更新" : "删除"}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{log.section}</span>
                                          </div>
                                          
                                          <h4 className="text-sm font-medium text-foreground mb-1">
                                            {log.description}
                                          </h4>
                                          
                                          {log.details && (
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                              {log.details}
                                            </p>
                                          )}
                                          
                                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                              <User className="w-3 h-3" />
                                              <span>{log.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Calendar className="w-3 h-3" />
                                              <span>
                                                {log.timestamp.toLocaleDateString('zh-CN', { 
                                                  year: 'numeric', 
                                                  month: '2-digit', 
                                                  day: '2-digit',
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                })}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </TabsContent>

                          {/* ============ 8. 服务器规�?- COMPLETE ============ */}
                          {detailResourceType === "server" && (
                            <TabsContent value="serverRules" className="mt-0 h-full overflow-y-auto">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h2 className="text-lg font-bold text-foreground">服务器规�?/h2>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setShowServerRuleModal(true)}
                                  >
                                    <Edit className="w-3 h-3 mr-1" /> 提交规则
                                  </Button>
                                </div>

                                <div className="space-y-3">
                                  {serverRules
                                    .filter(r => r.status === "approved")
                                    .sort((a, b) => (b.views + b.likes * 10) - (a.views + a.likes * 10))
                                    .map((rule) => (
                                    <div 
                                      key={rule.id} 
                                      className="border border-border rounded-lg p-4 bg-card hover:bg-secondary/20 transition-colors cursor-pointer"
                                      onClick={() => {
                                        setSelectedServerRule(rule);
                                        setShowServerRuleDetailModal(true);
                                      }}
                                    >
                                      <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                                          {rule.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                          <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            <span>{(rule.views / 1000).toFixed(1)}K</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Heart className="w-3 h-3" />
                                            <span>{rule.likes}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                        <div className="flex items-center gap-1">
                                          <User className="w-3 h-3" />
                                          <span>{rule.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          <span>{rule.publishDate}</span>
                                        </div>
                                      </div>
                                      
                                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {rule.content.replace(/^#+\s*/gm, '').replace(/^-\s*/gm, '�?').substring(0, 200)}...
                                      </p>
                                    </div>
                                  ))}
                                </div>

                                {/* SERVER RULE SUBMIT MODAL */}
                                {showServerRuleModal && (
                                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowServerRuleModal(false)}>
                                    <div className="bg-card border border-border rounded-lg w-full max-w-2xl p-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                      <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold">提交服务器规�?/h3>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowServerRuleModal(false)}>
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      
                                      <div className="space-y-3">
                                        <div>
                                          <label className="text-xs text-muted-foreground mb-1 block">规则标题 *</label>
                                          <Input
                                            value={newServerRuleTitle}
                                            onChange={(e) => setNewServerRuleTitle(e.target.value)}
                                            placeholder="输入规则标题，例如：服务器行为准�?
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-muted-foreground mb-1 block">规则内容 *</label>
                                          <textarea
                                            value={newServerRuleContent}
                                            onChange={(e) => setNewServerRuleContent(e.target.value)}
                                            className="w-full h-64 px-3 py-2 text-sm border border-input rounded-md bg-background resize-none font-mono"
                                            placeholder="支持 Markdown 格式编写规则内容..."
                                          />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                          <Button size="sm" variant="outline" onClick={() => setShowServerRuleModal(false)}>取消</Button>
                                          <Button 
                                            size="sm" 
                                            onClick={() => {
                                              if (!newServerRuleTitle.trim() || !newServerRuleContent.trim()) return;
                                              setServerRules(prev => [...prev, {
                                                id: Date.now().toString(),
                                                title: newServerRuleTitle,
                                                author: "当前用户",
                                                publishDate: new Date().toISOString().split('T')[0],
                                                views: 0,
                                                likes: 0,
                                                content: newServerRuleContent,
                                                status: "pending"
                                              }]);
                                              setNewServerRuleTitle("");
                                              setNewServerRuleContent("");
                                              setShowServerRuleModal(false);
                                            }}
                                            disabled={!newServerRuleTitle.trim() || !newServerRuleContent.trim()}
                                          >
                                            提交审核
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* SERVER RULE DETAIL MODAL */}
                                {showServerRuleDetailModal && selectedServerRule && (
                                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowServerRuleDetailModal(false)}>
                                    <div className="bg-card border border-border rounded-lg w-full max-w-3xl p-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                      <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-base font-semibold">{selectedServerRule.title}</h3>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowServerRuleDetailModal(false)}>
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                                        <div className="flex items-center gap-1">
                                          <User className="w-3.5 h-3.5" />
                                          <span>{selectedServerRule.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-3.5 h-3.5" />
                                          <span>{selectedServerRule.publishDate}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Eye className="w-3.5 h-3.5" />
                                          <span>{selectedServerRule.views} 次查�?/span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Heart className="w-3.5 h-3.5" />
                                          <span>{selectedServerRule.likes} 点赞</span>
                                        </div>
                                      </div>
                                      
                                      <div className="prose prose-sm max-w-none dark:prose-invert">
                                        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                          {selectedServerRule.content}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                          )}
                        </div>
                      </Tabs>

                      {/* ============ GLOBAL DISCUSSION AREA - ALL TABS SHARED ============ */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="bg-secondary/20 rounded-lg overflow-hidden">
                          <Tabs defaultValue="public" className="w-full">
                            <div className="px-3 pt-2.5 border-b border-border">
                              <TabsList className="h-7 bg-transparent gap-1.5">
                                <TabsTrigger 
                                  value="public" 
                                  className="text-[11px] h-6 px-2.5 data-[state=active]:bg-card"
                                >
                                  公共交流�?                                </TabsTrigger>
                                <TabsTrigger 
                                  value="feedback" 
                                  className="text-[11px] h-6 px-2.5 data-[state=active]:bg-card"
                                >
                                  制作方反馈区
                                </TabsTrigger>
                                <TabsTrigger 
                                  value="premium" 
                                  className="text-[11px] h-6 px-2.5 data-[state=active]:bg-card"
                                >
                                  订阅/打赏交流�?                                </TabsTrigger>
                              </TabsList>
                            </div>
                            
                            {/* Public Discussion */}
                            <TabsContent value="public" className="mt-0 p-3">
                              <div className="space-y-2.5">
                                {[
                                  { user: "红石爱好�?, time: "10分钟�?, content: "有没有大佬知道怎么调整齿轮的转速啊？卡在这里好久了", replies: 5, likes: 12 },
                                  { user: "新手玩家", time: "25分钟�?, content: "第一次玩这个模组，感觉好复杂，有没有入门教程推荐�?, replies: 8, likes: 23 },
                                  { user: "机械工程�?, time: "1小时�?, content: "分享一个我自己设计的全自动生产线，效率超高！链接在评论�?, replies: 15, likes: 67 },
                                ].map((post, i) => (
                                  <div key={i} className="bg-card rounded-lg p-2.5">
                                    <div className="flex items-center justify-between mb-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                          <User className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-xs font-medium">{post.user}</span>
                                        <span className="text-[10px] text-muted-foreground">{post.time}</span>
                                      </div>
                                      <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
                                        <span>💬 {post.replies}</span>
                                        <span>❤️ {post.likes}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{post.content}</p>
                                  </div>
                                ))}
                                <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                                  <Plus className="w-3 h-3 mr-1" /> 发布新话�?                                </Button>
                              </div>
                            </TabsContent>
                            
                            {/* Creator Feedback */}
                            <TabsContent value="feedback" className="mt-0 p-3">
                              <div className="space-y-2.5">
                                {[
                                  { user: "BUG猎人", time: "30分钟�?, content: "�?.20.1版本使用水车的时候偶尔会出现崩溃，日志已经上传到附件了，麻烦看看�?, status: "已确�?, statusColor: "bg-blue-500" },
                                  { user: "创意玩家", time: "2小时�?, content: "建议添加更多的装饰性方块，现在的工业风有点单调", status: "已采�?, statusColor: "bg-green-500" },
                                  { user: "性能测试�?, time: "5小时�?, content: "大型模组包中使用时TPS下降明显，能不能优化一下渲染性能�?, status: "处理�?, statusColor: "bg-yellow-500" },
                                ].map((post, i) => (
                                  <div key={i} className="bg-card rounded-lg p-2.5">
                                    <div className="flex items-center justify-between mb-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                          <User className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-xs font-medium">{post.user}</span>
                                        <span className="text-[10px] text-muted-foreground">{post.time}</span>
                                      </div>
                                      <Badge className={`${post.statusColor} text-[10px] px-1.5 py-0`}>
                                        {post.status}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{post.content}</p>
                                  </div>
                                ))}
                                <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                                  <Send className="w-3 h-3 mr-1" /> 提交反馈
                                </Button>
                              </div>
                            </TabsContent>
                            
                            {/* Premium Discussion */}
                            <TabsContent value="premium" className="mt-0 p-3">
                              <div className="space-y-2.5">
                                {[
                                  { user: "钻石赞助�?, time: "5分钟�?, content: "赞助�?00块！希望能出一个专属的皮肤�?, badge: "💎 钻石赞助" },
                                  { user: "黄金支持�?, time: "1小时�?, content: "有没有专属的Beta测试版本可以体验？想提前玩到新内�?, badge: "🥇 黄金支持" },
                                  { user: "订阅用户", time: "3小时�?, content: "这个月的更新太棒了！感谢制作团队的辛勤付�?, badge: "�?月度订阅" },
                                ].map((post, i) => (
                                  <div key={i} className="bg-card rounded-lg p-2.5 border border-primary/20">
                                    <div className="flex items-center justify-between mb-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                          <Star className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-xs font-medium">{post.user}</span>
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{post.badge}</Badge>
                                        <span className="text-[10px] text-muted-foreground">{post.time}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{post.content}</p>
                                  </div>
                                ))}
                                <div className="bg-primary/5 rounded-lg p-2.5 border border-dashed border-primary/30">
                                  <p className="text-[10px] text-center text-muted-foreground">
                                    🔒 此区域仅对订�?打赏用户开�?                                  </p>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Search & User Center - Floating at bottom right when panel is expanded */}
                {panelExpanded && (
                  <div className="absolute bottom-2 right-2 left-2">
                    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 h-[48px] shadow-lg">
                      <div className="flex items-center justify-between h-full">
                        {/* Left: Search Area */}
                        <div className="flex items-center gap-2">
                          <div className="w-48">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜索资源、用户、项�?.." />
                          </div>
                          <FilterPanel
                            resourceId={getFilterResourceId()}
                            selectedTags={filterTags}
                            onTagsChange={setFilterTags}
                            onResourceChange={handleFilterResourceChange}
                          />
                          {activeCategory !== "community" && (
                            <>
                              <select 
                                value={selectedVersion} 
                                onChange={(e) => setSelectedVersion(e.target.value)}
                                className="h-8 text-xs border border-border rounded-md px-2 bg-card"
                              >
                                {minecraftVersions.slice(0, 8).map(version => (
                                  <option key={version.value} value={version.value}>
                                    {version.label}
                                  </option>
                                ))}
                              </select>
                              <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value as 'downloads' | 'likes' | 'date')}
                                className="h-8 text-xs border border-border rounded-md px-2 bg-card"
                              >
                                <option value="downloads">下载�?/option>
                                <option value="likes">收藏�?/option>
                                <option value="date">发布时间</option>
                              </select>
                              <button 
                                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                className="h-8 w-8 text-xs border border-border rounded-md bg-card hover:bg-secondary transition-colors"
                              >
                                {sortOrder === 'desc' ? '�? : '�?}
                              </button>
                            </>
                          )}
                        </div>
                        
                        {/* Right: User Controls */}
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <User className="w-4.5 h-4.5" />
                          </button>
                          {/* Unified panel control button */}
                          <button
                            onClick={handlePanelToggle}
                            className="p-1 rounded-full hover:bg-secondary transition-colors"
                            title={panelExpanded ? "收起详情面板" : "展开详情面板"}
                          >
                            {panelExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Search & User Center */}
              {!panelExpanded && (
                <div className="bg-card border border-border rounded-lg p-3 flex-[0.4] min-h-[48px] overflow-visible">
                  <div className="flex items-center justify-between">
                    {/* Left: Search Area */}
                    <div className="flex items-center gap-2">
                      <div className="w-48">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜索资源、用户、项�?.." />
                      </div>
                      <FilterPanel
                        resourceId={getFilterResourceId()}
                        selectedTags={filterTags}
                        onTagsChange={setFilterTags}
                        onResourceChange={handleFilterResourceChange}
                      />
                      {activeCategory !== "community" && (
                        <>
                          <select 
                            value={selectedVersion} 
                            onChange={(e) => setSelectedVersion(e.target.value)}
                            className="h-9 text-xs border border-border rounded-md px-2 bg-card"
                          >
                            {minecraftVersions.map(version => (
                              <option key={version.value} value={version.value}>
                                {version.label}
                              </option>
                            ))}
                          </select>
                          <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as 'downloads' | 'likes' | 'date')}
                            className="h-9 text-xs border border-border rounded-md px-2 bg-card"
                          >
                            <option value="downloads">下载�?/option>
                            <option value="likes">收藏�?/option>
                            <option value="date">发布时间</option>
                          </select>
                          <button 
                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                            className="h-9 w-9 text-xs border border-border rounded-md bg-card hover:bg-secondary transition-colors"
                          >
                            {sortOrder === 'desc' ? '�? : '�?}
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Right: User Controls */}
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </button>
                      {/* Unified panel control button */}
                      <button
                        onClick={handlePanelToggle}
                        className="p-1 rounded-full hover:bg-secondary transition-colors"
                        title={panelExpanded ? "收起详情面板" : "展开详情面板"}
                      >
                        {panelExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Scene Section - Hidden when panel is expanded */}
              {!panelExpanded && (
                <div className="bg-card border border-border rounded-lg p-4 flex-[5.2] overflow-hidden transition-all duration-300 relative">
                  <div className="absolute top-4 right-4">
                    <Button
                      size="sm"
                      className="h-9 px-3 text-xs gap-1"
                      onClick={() => setShowCreateProjectModal(true)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      创建项目
                    </Button>
                  </div>
                  <div className="h-full flex items-center justify-center bg-secondary/20 rounded-lg">
                    <div className="text-center">
                      <Home className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">场景内容将在此显�?/p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lower Section - Scroll to reveal */}
          <div className="bg-card border border-border rounded-lg p-4 h-screen overflow-hidden mt-2">
            <div className="h-full flex items-center justify-center bg-secondary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">空白显示</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        <button className="p-2 bg-card rounded-lg shadow-card border border-border hover:shadow-card-hover transition-shadow">
          <QrCode className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 bg-card rounded-lg shadow-card border border-border hover:shadow-card-hover transition-shadow">
          <Languages className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <Dialog open={showCreateProjectModal} onOpenChange={setShowCreateProjectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>创建新项�?/DialogTitle>
            <DialogDescription>
              创建一个新项目，开始您的创作之�?            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="bg-secondary/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">项目说明</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>�?创建后可在编辑页面设置项目类型和制作形式</li>
                <li>�?项目完成后上传首个版本将进入审核流程</li>
                <li>�?审核通过后项目将转为对应类型的资�?/li>
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
              开始创�?            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
