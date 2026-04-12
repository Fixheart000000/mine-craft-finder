import { useState, useEffect } from "react";
import { useParams, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Users, Calendar, MapPin, Link2, Eye, Heart, BookmarkPlus, Upload, MessageSquare, FolderKanban, UserPlus, Check, Server, Building, Map, Modpack } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import ResourceCard from "#/components/ResourceCard";
import ModIcon from "#/components/icons/ModIcon";
import ModpackIcon from "#/components/icons/ModpackIcon";
import MapIcon from "#/components/icons/MapIcon";
import ServerIcon from "#/components/icons/ServerIcon";
import BuildingIcon from "#/components/icons/BuildingIcon";

const mockTeams = [
  {
    id: "1",
    name: "FabricMC",
    avatar: "",
    title: "Fabric生态开发团�?,
    description: "Fabric生态的核心开发团队，致力于为 Minecraft 社区提供开放、轻量的模组加载平台。我们相信开源的力量�?,
    location: "全球协作",
    website: "https://fabricmc.net",
    foundationDate: "2018-12-10",
    followers: 89500,
    views: 2500000,
    works: 45,
    status: "活跃�?,
    memberCount: 45,
    teamType: "creator",
    categories: ["核心开�?, "模组工具", "文档维护"],
    members: [
      { name: "asiekierka", role: "项目负责�?, avatar: "", joinDate: "2018-12-10" },
      { name: "modmuss50", role: "核心开发�?, avatar: "", joinDate: "2018-12-15" },
      { name: "sfPlayer1", role: "核心开发�?, avatar: "", joinDate: "2019-01-05" },
      { name: "Juuz", role: "文档维护", avatar: "", joinDate: "2019-03-20" },
      { name: "i509VCB", role: "API维护", avatar: "", joinDate: "2019-06-10" },
      { name: "CheaterCodes", role: "社区运营", avatar: "", joinDate: "2020-01-15" },
    ],
    resources: [
      { icon: <ModIcon className="w-10 h-10" />, title: "Fabric Loader", author: "FabricMC", description: "Fabric 模组加载器核心，提供模组加载和运行的基础框架�?, downloads: 15000000, likes: 89000, resourceType: "mod", resourceId: "fabric-loader" },
      { icon: <ModIcon className="w-10 h-10" />, title: "Fabric API", author: "FabricMC", description: "Fabric 的基础 API 库，为模组提供各种钩子和工具�?, downloads: 12000000, likes: 75000, resourceType: "mod", resourceId: "fabric-api" },
      { icon: <ModpackIcon className="w-10 h-10" />, title: "Fabric 测试整合�?, author: "FabricMC", description: "用于测试 Fabric 生态系统的整合包�?, downloads: 250000, likes: 3200, resourceType: "modpack", resourceId: "fabric-test" },
      { icon: <MapIcon className="w-10 h-10" />, title: "API 测试地图", author: "FabricMC", description: "用于 API 功能测试的专用地图�?, downloads: 45000, likes: 890, resourceType: "map", resourceId: "api-test-map" },
    ],
    projects: [
      { name: "Fabric Loader 0.16", description: "下一代模组加载器架构", status: "开发中", members: 8, role: "发起�? },
      { name: "Quilt 兼容�?, description: "�?Quilt 生态的双向兼容支持", status: "筹备�?, members: 4, role: "发起�? },
      { name: "文档本地化计�?, description: "官方文档多语言支持", status: "进行�?, members: 12, role: "生产�? },
    ],
    activities: [
      { time: "3小时�?, action: "发布了新版本", target: "Fabric Loader 0.15.11" },
      { time: "1天前", action: "更新了项目状�?, target: "文档本地化计�? },
      { time: "2天前", action: "发布了公�?, target: "1.21 版本支持计划" },
      { time: "5天前", action: "新增了团队成�?, target: "CheaterCodes 加入团队" },
      { time: "1周前", action: "更新�?API", target: "Fabric API 0.92.0 发布" },
    ],
  },
  {
    id: "2",
    name: "Hypixel",
    avatar: "",
    title: "Hypixel服务器团�?,
    description: "Hypixel是全球最大的 Minecraft 服务器网络之一，提供各种小游戏和社区活动。我们致力于为玩家创造最好的游戏体验�?,
    location: "美国",
    website: "https://hypixel.net",
    foundationDate: "2013-04-13",
    followers: 1500000,
    views: 25000000,
    works: 120,
    status: "活跃�?,
    memberCount: 85,
    teamType: "producer",
    categories: ["服务器开�?, "游戏设计", "社区管理"],
    members: [
      { name: "Simon", role: "创始�?, avatar: "", joinDate: "2013-04-13" },
      { name: "Polish", role: "技术总监", avatar: "", joinDate: "2013-06-01" },
      { name: "Noxy", role: "服务器管理员", avatar: "", joinDate: "2014-01-15" },
      { name: "MinecraftYoutuber", role: "内容创作�?, avatar: "", joinDate: "2015-03-20" },
      { name: "HypixelMod", role: "社区 moderator", avatar: "", joinDate: "2016-05-10" },
      { name: "BuilderPro", role: "建筑设计�?, avatar: "", joinDate: "2017-02-15" },
    ],
    resources: [
      { icon: <ServerIcon className="w-10 h-10" />, title: "Hypixel服务器插�?, author: "Hypixel", description: "Hypixel服务器使用的核心插件，提供各种游戏功能�?, downloads: 5000000, likes: 250000, resourceType: "plugin", resourceId: "hypixel-core" },
      { icon: <BuildingIcon className="w-10 h-10" />, title: "Hypixel建筑资产", author: "Hypixel", description: "Hypixel服务器使用的建筑设计和资产�?, downloads: 1200000, likes: 89000, resourceType: "build", resourceId: "hypixel-builds" },
      { icon: <ModIcon className="w-10 h-10" />, title: "Hypixel客户端模�?, author: "Hypixel", description: "官方推荐的客户端模组，提供更好的游戏体验�?, downloads: 3500000, likes: 150000, resourceType: "mod", resourceId: "hypixel-client" },
      { icon: <MapIcon className="w-10 h-10" />, title: "SkyWars地图�?, author: "Hypixel", description: "Hypixel SkyWars游戏模式的地图集合�?, downloads: 850000, likes: 45000, resourceType: "map", resourceId: "skywars-maps" },
    ],
    projects: [
      { name: "Hytale", description: "Hypixel开发的全新游戏项目", status: "开发中", members: 45, role: "发起�? },
      { name: "SkyBlock 2.0", description: "SkyBlock游戏模式重大更新", status: "进行�?, members: 25, role: "生产�? },
      { name: "服务器扩容计�?, description: "全球服务器基础设施升级", status: "进行�?, members: 15, role: "生产�? },
    ],
    activities: [
      { time: "1小时�?, action: "发布了新游戏模式", target: "BedWars 2.0" },
      { time: "6小时�?, action: "进行了服务器维护", target: "性能优化" },
      { time: "1天前", action: "举办了社区活�?, target: "周末双倍经�? },
      { time: "3天前", action: "更新了反作弊系统", target: "CheatGuard V3" },
      { time: "1周前", action: "发布了开发�?API", target: "Hypixel API v2" },
    ],
  },
  {
    id: "3",
    name: "CurseForge",
    avatar: "",
    title: "CurseForge模组平台团队",
    description: "CurseForge是最大的 Minecraft 模组分发平台之一，为开发者和玩家提供模组分享和下载服务�?,
    location: "全球",
    website: "https://curseforge.com",
    foundationDate: "2006-06-01",
    followers: 2000000,
    views: 50000000,
    works: 150000,
    status: "活跃�?,
    memberCount: 60,
    teamType: "producer",
    categories: ["平台开�?, "内容管理", "开发者支�?],
    members: [
      { name: "OverwolfTeam", role: "平台管理", avatar: "", joinDate: "2020-05-15" },
      { name: "CurseDev", role: "技术开�?, avatar: "", joinDate: "2018-03-10" },
      { name: "ModReviewer", role: "内容审核", avatar: "", joinDate: "2019-07-20" },
      { name: "CommunityManager", role: "社区管理", avatar: "", joinDate: "2021-02-15" },
      { name: "SupportTeam", role: "用户支持", avatar: "", joinDate: "2022-01-10" },
      { name: "API Developer", role: "API开�?, avatar: "", joinDate: "2021-06-05" },
    ],
    resources: [
      { icon: <ModIcon className="w-10 h-10" />, title: "CurseForge launcher", author: "CurseForge", description: "官方启动器，方便管理模组和整合包�?, downloads: 8000000, likes: 450000, resourceType: "launcher", resourceId: "curseforge-launcher" },
      { icon: <ModpackIcon className="w-10 h-10" />, title: "CurseForge整合包模�?, author: "CurseForge", description: "开发者使用的整合包创建模板�?, downloads: 1200000, likes: 89000, resourceType: "modpack", resourceId: "modpack-template" },
      { icon: <ModIcon className="w-10 h-10" />, title: "CurseForge API客户�?, author: "CurseForge", description: "用于访问 CurseForge API 的客户端库�?, downloads: 500000, likes: 35000, resourceType: "mod", resourceId: "curseforge-api-client" },
      { icon: <ServerIcon className="w-10 h-10" />, title: "CurseForge服务器管理工�?, author: "CurseForge", description: "服务器管理员使用的模组管理工具�?, downloads: 300000, likes: 22000, resourceType: "tool", resourceId: "server-manager" },
    ],
    projects: [
      { name: "CurseForge重制�?, description: "平台全新设计和功能升�?, status: "开发中", members: 30 },
      { name: "开发者激励计�?, description: "模组开发者奖励系�?, status: "进行�?, members: 15 },
      { name: "多语言支持", description: "平台多语言本地�?, status: "进行�?, members: 10 },
    ],
    activities: [
      { time: "2小时�?, action: "上线了新功能", target: "模组评分系统" },
      { time: "4小时�?, action: "更新了平台政�?, target: "内容审核指南" },
      { time: "1天前", action: "举办了开发者大�?, target: "CurseForge DevCon 2024" },
      { time: "2天前", action: "发布了移动应�?, target: "CurseForge Mobile" },
      { time: "1周前", action: "与微软达成合�?, target: "Minecraft官方集成" },
    ],
  },
  {
    id: "4",
    name: "Mojang Studios",
    avatar: "",
    title: "Minecraft官方开发团�?,
    description: "Mojang Studios�?Minecraft 的官方开发团队，负责游戏的核心开发和更新。我们致力于为全球玩家创造最好的游戏体验�?,
    location: "瑞典",
    website: "https://mojang.com",
    foundationDate: "2009-05-17",
    followers: 5000000,
    views: 100000000,
    works: 200,
    status: "活跃�?,
    memberCount: 150,
    teamType: "creator",
    categories: ["游戏开�?, "设计", "社区管理"],
    members: [
      { name: "Notch", role: "创始�?, avatar: "", joinDate: "2009-05-17" },
      { name: "Jeb", role: "游戏总监", avatar: "", joinDate: "2010-02-01" },
      { name: "Searge", role: "技术主�?, avatar: "", joinDate: "2011-06-15" },
      { name: "Dinnerbone", role: "开发�?, avatar: "", joinDate: "2012-03-10" },
      { name: "Cubfan135", role: "社区经理", avatar: "", joinDate: "2014-07-20" },
      { name: "LadyAgnes", role: "设计�?, avatar: "", joinDate: "2015-04-15" },
    ],
    resources: [
      { icon: <ModIcon className="w-10 h-10" />, title: "Minecraft Java�?, author: "Mojang Studios", description: "Minecraft的Java版，提供完整的游戏体验�?, downloads: 300000000, likes: 5000000, resourceType: "game", resourceId: "minecraft-java" },
      { icon: <ModIcon className="w-10 h-10" />, title: "Minecraft基岩�?, author: "Mojang Studios", description: "跨平台的Minecraft版本，支持多设备�?, downloads: 200000000, likes: 3000000, resourceType: "game", resourceId: "minecraft-bedrock" },
      { icon: <ModIcon className="w-10 h-10" />, title: "Minecraft Dungeons", author: "Mojang Studios", description: "Minecraft风格的地牢探险游戏�?, downloads: 25000000, likes: 1500000, resourceType: "game", resourceId: "minecraft-dungeons" },
      { icon: <ModIcon className="w-10 h-10" />, title: "Minecraft Earth", author: "Mojang Studios", description: "AR增强现实Minecraft体验�?, downloads: 10000000, likes: 800000, resourceType: "game", resourceId: "minecraft-earth" },
    ],
    projects: [
      { name: "Minecraft 1.21", description: "下一个主要版本更�?, status: "开发中", members: 50 },
      { name: "Minecraft Legends", description: "全新策略游戏", status: "已发�?, members: 40 },
      { name: "Minecraft电影", description: "真人版电影项�?, status: "筹备�?, members: 20 },
    ],
    activities: [
      { time: "5小时�?, action: "发布了预览版", target: "Minecraft 1.21 Pre-release 3" },
      { time: "1天前", action: "举办了直播活�?, target: "Minecraft Live 2024" },
      { time: "3天前", action: "更新了游戏服务条�?, target: "EULA更新" },
      { time: "1周前", action: "与社区合�?, target: "Minecraft社区创意大赛" },
      { time: "2周前", action: "发布了补�?, target: "1.20.6 补丁更新" },
    ],
  },
  {
    id: "5",
    name: "OptiFine",
    avatar: "",
    title: "OptiFine优化模组团队",
    description: "OptiFine是最受欢迎的Minecraft优化模组，提供性能提升和视觉增强功能。我们致力于让Minecraft在各种硬件上流畅运行�?,
    location: "全球",
    website: "https://optifine.net",
    foundationDate: "2010-05-20",
    followers: 1000000,
    views: 20000000,
    works: 300,
    status: "活跃�?,
    memberCount: 10,
    teamType: "creator",
    categories: ["性能优化", "图形增强", "模组开�?],
    members: [
      { name: "sp614x", role: "创始�?, avatar: "", joinDate: "2010-05-20" },
      { name: "OptiFineDev", role: "核心开发�?, avatar: "", joinDate: "2012-03-15" },
      { name: "TextureExpert", role: "材质专家", avatar: "", joinDate: "2014-07-10" },
      { name: "ShaderDev", role: "着色器开发�?, avatar: "", joinDate: "2016-04-20" },
      { name: "SupportTeam", role: "技术支�?, avatar: "", joinDate: "2018-02-15" },
      { name: "Translator", role: "多语言翻译", avatar: "", joinDate: "2020-01-10" },
    ],
    resources: [
      { icon: <ModIcon className="w-10 h-10" />, title: "OptiFine HD", author: "OptiFine", description: "主要优化模组，提供性能提升和视觉效果�?, downloads: 50000000, likes: 2500000, resourceType: "mod", resourceId: "optifine-hd" },
      { icon: <ModIcon className="w-10 h-10" />, title: "OptiFine Ultra", author: "OptiFine", description: "高级版本，提供更多视觉增强功能�?, downloads: 30000000, likes: 1800000, resourceType: "mod", resourceId: "optifine-ultra" },
      { icon: <ModIcon className="w-10 h-10" />, title: "OptiFine Preview", author: "OptiFine", description: "测试版本，包含最新功能�?, downloads: 10000000, likes: 800000, resourceType: "mod", resourceId: "optifine-preview" },
      { icon: <ModIcon className="w-10 h-10" />, title: "OptiFine Cape", author: "OptiFine", description: "OptiFine专属披风系统�?, downloads: 5000000, likes: 450000, resourceType: "tool", resourceId: "optifine-cape" },
    ],
    projects: [
      { name: "OptiFine 1.21", description: "支持最新Minecraft版本", status: "开发中", members: 5 },
      { name: "OptiFine RTX", description: "实时光线追踪支持", status: "测试�?, members: 3 },
      { name: "OptiFine Mobile", description: "移动版优�?, status: "筹备�?, members: 2 },
    ],
    activities: [
      { time: "1小时�?, action: "发布了新版本", target: "OptiFine 1.20.6 HD_U_I6" },
      { time: "1天前", action: "修复了漏�?, target: "OptiFine 1.20.4 补丁" },
      { time: "3天前", action: "发布了预览版", target: "OptiFine 1.21 Preview 1" },
      { time: "1周前", action: "更新了披风系�?, target: "OptiFine Cape 2.0" },
      { time: "2周前", action: "与材质包作者合�?, target: "官方推荐材质�? },
    ],
  },
  {
    id: "6",
    name: "MC投资联盟",
    avatar: "",
    title: "Minecraft生态投资团�?,
    description: "专注于Minecraft生态系统的投资机构，致力于发现和支持有潜力的Minecraft相关项目和团队。我们相信Minecraft生态的巨大潜力�?,
    location: "中国 · 北京",
    website: "https://mc-invest.com",
    foundationDate: "2021-03-15",
    followers: 15000,
    views: 250000,
    works: 0,
    status: "活跃�?,
    memberCount: 8,
    teamType: "investor",
    categories: ["投资", "孵化", "资源对接"],
    members: [
      { name: "投资总监", role: "首席投资�?, avatar: "", joinDate: "2021-03-15" },
      { name: "分析师A", role: "投资分析�?, avatar: "", joinDate: "2021-04-10" },
      { name: "分析师B", role: "行业分析�?, avatar: "", joinDate: "2021-05-01" },
      { name: "顾问A", role: "技术顾�?, avatar: "", joinDate: "2021-06-15" },
      { name: "顾问B", role: "法律顾问", avatar: "", joinDate: "2021-07-10" },
      { name: "运营", role: "投后管理", avatar: "", joinDate: "2021-08-05" },
    ],
    resources: [],
    projects: [
      { name: "MC生态基�?, description: "专项投资Minecraft相关项目的基�?, status: "进行�?, members: 5 },
      { name: "创业孵化计划", description: "支持Minecraft相关创业项目", status: "进行�?, members: 3 },
      { name: "行业研究报告", description: "Minecraft生态行业分�?, status: "进行�?, members: 2 },
    ],
    activities: [
      { time: "1天前", action: "投资了新项目", target: "星辰骑士计划" },
      { time: "3天前", action: "发布了行业报�?, target: "2024 Minecraft生态发展报�? },
      { time: "1周前", action: "举办了路演活�?, target: "Minecraft创业项目路演" },
      { time: "2周前", action: "与团队达成合�?, target: "FabricMC技术合�? },
      { time: "1个月�?, action: "设立了新基金", target: "MC生态二期基�? },
    ],
  },
];

const TeamProfile = () => {
  const router = useRouter();
  const { id: teamId = "1" } = useParams({ from: "/team/$id" });
  const [activeTab, setActiveTab] = useState("intro");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const team = mockTeams.find(t => t.id === teamId) || mockTeams[0];
  const [followers, setFollowers] = useState(team.followers);

  // 当团队ID变化时，重置状�?  useEffect(() => {
    setFollowers(team.followers);
    setIsSubscribed(false);
  }, [teamId, team.followers]);

  const toggleSubscription = () => {
    if (isSubscribed) {
      setFollowers(prev => prev - 1);
    } else {
      setFollowers(prev => prev + 1);
    }
    setIsSubscribed(!isSubscribed);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.history.back()} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-foreground truncate">{team.name}</h1>
                <Badge className="text-[10px] h-5 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20">官方团队</Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{team.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs text-green-500">
              <Users className="w-3.5 h-3.5" /> {team.status}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3.5 h-3.5" /> {team.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3.5 h-3.5" /> {followers.toLocaleString()}
            </span>
            <Button size="sm" className="text-xs h-7">
              <MessageSquare className="w-3.5 h-3.5 mr-1" /> 联系
            </Button>
            {team.teamType === "creator" && (
              <Button 
                size="sm" 
                variant={isSubscribed ? "default" : "outline"} 
                className="text-xs h-7"
                onClick={toggleSubscription}
              >
                {isSubscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" /> 已关�?                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5 mr-1" /> 关注
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-border bg-card">
            <TabsList className="h-auto p-0 bg-transparent rounded-none">
              {[
                { id: "intro", label: "团队介绍" },
                { id: "members", label: "团队花名�? },
                { id: "resources", label: "作品�? },
                { id: "projects", label: "参与项目" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-4 py-2.5 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex gap-6 p-6">
            <div className="flex-1 min-w-0">
              <TabsContent value="intro" className="mt-0">
                <div className="flex gap-6 mb-6">
                  <Avatar className="w-24 h-24 border-4 border-border">
                    <AvatarFallback className="bg-primary/10">
                      <Users className="w-12 h-12 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-1">{team.name}</h2>
                    <p className="text-muted-foreground mb-3">{team.title}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {team.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> 成立�?{team.foundationDate}
                      </span>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{followers.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">关注�?/div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{team.memberCount}</div>
                        <div className="text-xs text-muted-foreground">团队成员</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{team.works}</div>
                        <div className="text-xs text-muted-foreground">作品�?/div>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="mb-6">
                  <h3 className="text-sm font-semibold text-primary mb-2">团队介绍</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{team.description}</p>
                </section>

                <section className="mb-6">
                  <h3 className="text-sm font-semibold text-primary mb-2">团队分类</h3>
                  <div className="flex flex-wrap gap-2">
                    {team.categories.map((category) => (
                      <Badge key={category} variant="secondary">{category}</Badge>
                    ))}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="members" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">团队成员 ({team.members.length})</h2>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <UserPlus className="w-3 h-3 mr-1" /> 邀请成�?                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.members.map((member, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-secondary">
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-sm">{member.name}</CardTitle>
                            <CardDescription className="text-[10px]">
                              {member.role === "创始�? || member.role === "项目负责�? ? "团队成立�? : 
                               member.role === "技术总监" || member.role === "服务器管理员" || member.role === "平台管理" ? "团队管理�? : "团队成员"}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-[10px] text-muted-foreground">
                          加入�?{member.joinDate}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">发布的资�?({team.resources.length})</h2>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <Upload className="w-3 h-3 mr-1" /> 发布新资�?                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.resources.map((resource, index) => (
                    <ResourceCard key={index} {...resource} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-0">
                <h2 className="text-xl font-bold text-foreground mb-4">参与项目</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.projects
                    .filter((project) => project.status === "筹备�? || project.status === "制作�?)
                    .map((project, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{project.name}</CardTitle>
                          <Badge variant={project.status === "制作�? ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {project.members} 成员参与
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {project.role || "参与�?}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>


            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamProfile;

