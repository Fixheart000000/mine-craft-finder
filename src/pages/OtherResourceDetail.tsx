import { useState } from "react";
import { useParams, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Download, Heart, Send, User, Eye, BookmarkPlus, Upload, Edit, Calendar, ChevronDown } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Textarea } from "#/components/ui/textarea";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Separator } from "#/components/ui/separator";
import { Input } from "#/components/ui/input";
import { Badge } from "#/components/ui/badge";
import { tagSystemMap } from "#/data/tags";
import { auxiliaryCommonMeta, ecoDocCommonMeta, imageCommonMeta } from "#/data/tags/commonMeta";

interface ChangeLog {
  id: string;
  timestamp: Date;
  author: string;
  action: "create" | "update" | "delete";
  section: string;
  description: string;
  details?: string;
}

const mockChangeLogs: ChangeLog[] = [
  {
    id: "1",
    timestamp: new Date("2024-11-01 10:00:00"),
    author: "数据工匠",
    action: "create",
    section: "基本介绍",
    description: "创建资源",
    details: "首次发布NBT Explorer专业版工具"
  },
  {
    id: "2",
    timestamp: new Date("2024-11-05 14:30:00"),
    author: "数据工匠",
    action: "update",
    section: "基本介绍",
    description: "更新资源简介",
    details: "优化了工具简介，增加了更多功能说明和使用场景"
  },
  {
    id: "3",
    timestamp: new Date("2024-11-08 16:20:00"),
    author: "数据工匠",
    action: "update",
    section: "下载",
    description: "添加新版本 v2.5.1",
    details: "修复了NBT数据保存问题，优化了内存使用"
  },
  {
    id: "4",
    timestamp: new Date("2024-11-10 09:15:00"),
    author: "数据工匠",
    action: "update",
    section: "基本介绍",
    description: "更新基本信息",
    details: "修改了适用对象标签，增加了「模组开发者」"
  },
  {
    id: "5",
    timestamp: new Date("2024-11-12 11:45:00"),
    author: "数据工匠",
    action: "update",
    section: "协议",
    description: "提交原创协议",
    details: "提交并发布了工具的原创协议"
  },
  {
    id: "6",
    timestamp: new Date("2024-11-15 15:30:00"),
    author: "数据工匠",
    action: "update",
    section: "下载",
    description: "更新版本信息",
    details: "为 v2.5.1 版本更新了更新日志说明"
  }
];

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    ecoTool: "生态工具", doc: "知识文档", image: "形象",
  };
  return map[type] || type;
}

const mockOtherData: Record<string, any> = {
  "ecoTool-1": {
    type: "ecoTool",
    title: "NBT Explorer 专业版",
    author: "数据工匠",
    authorType: "工具开发者",
    description: "一款功能强大的 NBT 数据编辑器，支持可视化编辑 Minecraft 的各种数据文件。包括玩家数据、区块数据、实体数据等。提供直观的树形结构展示，支持批量操作和撤销重做功能。适用于地图制作者、服务器管理员和模组开发者。",
    authorNote: "这个工具是我多年开发经验的结晶。希望能帮助大家更方便地处理 NBT 数据。如果遇到任何问题或有功能建议，欢迎在评论区留言！",
    tags: ["开发工具", "NBT编辑", "跨平台"],
    basicInfo: {
      "内容方向": "通用工具",
      "产出方式": "原创",
      "产出时间": "2023.06",
      "运行平台": "跨平台",
      "适用对象": "模组开发者、地图制作者、服务器管理者",
    },
    downloads: 89000,
    views: 450000,
    favorites: 5600,
    likes: 4500,
    donationLeaders: [
      { name: "数据爱好者", amount: "20k", avatar: "🏆" },
      { name: "地图制作者", amount: "15k", avatar: "🌟" },
    ],
    donationFeed: [
      { user: "服务器管理员", date: "2024.11.10", amount: "1k" },
    ],
    comments: [
      { user: "开发者A", date: "2024-11-12", content: "终于找到好用的NBT编辑器了" },
    ],
    versions: [
      { id: "1", version: "v2.5.1", gameVersion: "全版本", releaseDate: "2024-11-10", downloads: 45000, fileSize: "12.5 MB", changelog: "修复了NBT数据保存问题", isLatest: true },
      { id: "2", version: "v2.5.0", gameVersion: "全版本", releaseDate: "2024-10-15", downloads: 32000, fileSize: "12.3 MB", changelog: "新增批量编辑功能" },
      { id: "3", version: "v2.4.0", gameVersion: "全版本", releaseDate: "2024-09-01", downloads: 12000, fileSize: "11.8 MB", changelog: "优化界面性能" },
    ],
    changelogs: [
      { version: "v2.5.1", date: "2024-11-10", content: "## 修复\n- 修复了NBT数据保存问题\n- 优化了内存使用" },
      { version: "v2.5.0", date: "2024-10-15", content: "## 新功能\n- 新增批量编辑功能\n- 支持更多NBT标签类型" },
    ],
  },
  "doc-1": {
    type: "doc",
    title: "数据包开发完全指南",
    author: "命令方块大师",
    authorType: "技术作者",
    description: "从零开始学习 Minecraft 数据包开发的完整教程。涵盖 JSON 语法基础、函数系统、战利品表、进度系统、标签系统、谓词和维度等核心内容。每个章节都配有实际案例和练习项目，帮助读者在实践中掌握数据包开发技能。",
    authorNote: "这份教程是我两年数据包开发经验的总结。希望能帮助更多玩家进入数据包开发的世界。教程会持续更新，有问题欢迎评论区交流！",
    tags: ["教程", "数据包", "命令"],
    basicInfo: {
      "内容方向": "教程文档",
      "涉及领域": "数据包、命令方块",
      "产出方式": "原创",
      "产出时间": "2024.03",
      "适用对象": "地图制作者、普通玩家",
    },
    downloads: 45000,
    views: 230000,
    favorites: 3400,
    likes: 3200,
    donationLeaders: [
      { name: "学习者", amount: "12k", avatar: "🏆" },
    ],
    donationFeed: [],
    comments: [
      { user: "新手", date: "2024-11-08", content: "讲得很清楚，终于入门了" },
    ],
    versions: [
      { id: "1", version: "v3.0", gameVersion: "1.20.x", releaseDate: "2024-11-01", downloads: 25000, fileSize: "5.2 MB", changelog: "新增1.21内容章节", isLatest: true },
      { id: "2", version: "v2.5", gameVersion: "1.20.x", releaseDate: "2024-09-15", downloads: 15000, fileSize: "4.8 MB", changelog: "更新进度系统章节" },
    ],
    changelogs: [
      { version: "v3.0", date: "2024-11-01", content: "## 新增内容\n- 新增1.21版本内容章节\n- 添加更多实例代码" },
    ],
  },
  "image-1": {
    type: "image",
    title: "星际战士皮肤系列",
    author: "像素画师",
    authorType: "皮肤设计师",
    description: "一套以科幻太空为主题的皮肤系列，包含多款独特的星际战士造型。每款皮肤都经过精心设计，细节丰富，风格统一。适合喜欢科幻风格的玩家使用。提供 Steve 和 Alex 两种模型版本。",
    authorNote: "科幻一直是我最爱的主题！这套皮肤花了我很多心思，希望大家喜欢。如果你有想要的其他主题，欢迎告诉我！",
    tags: ["皮肤", "科幻", "战士"],
    basicInfo: {
      "内容方向": "皮肤",
      "视觉基调": "科幻风",
      "内容来源": "原创",
      "形象范围": "游戏形象",
      "使用条件": "免费",
      "情感导向": "震撼/敬畏、好奇/探索",
    },
    downloads: 12000,
    views: 56000,
    favorites: 890,
    likes: 890,
    donationLeaders: [
      { name: "皮肤收藏家", amount: "8k", avatar: "🏆" },
    ],
    donationFeed: [],
    comments: [
      { user: "科幻迷", date: "2024-10-25", content: "太帅了！" },
    ],
    versions: [
      { id: "1", version: "v1.2", gameVersion: "全版本", releaseDate: "2024-10-20", downloads: 8000, fileSize: "256 KB", changelog: "新增3款皮肤", isLatest: true },
      { id: "2", version: "v1.0", gameVersion: "全版本", releaseDate: "2024-02-15", downloads: 4000, fileSize: "128 KB", changelog: "首发版本" },
    ],
    gallery: [
      { id: "1", url: "https://picsum.photos/seed/skin1/400/600", caption: "星际战士-指挥官", status: "approved" },
      { id: "2", url: "https://picsum.photos/seed/skin2/400/600", caption: "星际战士-突击兵", status: "approved" },
      { id: "3", url: "https://picsum.photos/seed/skin3/400/600", caption: "星际战士-侦察兵", status: "approved" },
    ],
    changelogs: [
      { version: "v1.2", date: "2024-10-20", content: "## 新增\n- 新增3款皮肤\n- 优化皮肤细节" },
    ],
  },
  "image-2": {
    type: "image",
    title: "幻影刺客限定皮肤",
    author: "暗影工作室",
    authorType: "皮肤艺术家",
    description: "一款精心设计的独特皮肤，以暗影刺客为主题，融合了神秘的紫色光效和流畅的披风设计。这款皮肤采用定制售卖方式，第一个购买的用户将永久独享此皮肤，之后不会再出售给其他用户。皮肤细节精致，包含独特的武器造型和动态光效。",
    authorNote: "这款皮肤花了我两个月的时间精心打造。我希望它能找到一个真正欣赏它的主人。采用定制售卖的方式，是为了让购买者拥有真正独一无二的体验。",
    tags: ["皮肤", "刺客", "限定"],
    basicInfo: {
      "内容方向": "皮肤",
      "视觉基调": "暗黑风",
      "内容来源": "原创",
      "形象范围": "游戏形象",
      "使用条件": "定制",
      "情感导向": "神秘/悬疑、成就/满足",
    },
    price: 299,
    downloads: 0,
    views: 12500,
    favorites: 456,
    likes: 367,
    donationLeaders: [],
    donationFeed: [],
    comments: [
      { user: "皮肤收藏家", date: "2024-11-12", content: "设计太精美了，等待购买机会！" },
    ],
    versions: [
      { id: "1", version: "限定版", gameVersion: "全版本", releaseDate: "2024-11-10", downloads: 0, fileSize: "384 KB", changelog: "首发限定版", isLatest: true },
    ],
    gallery: [
      { id: "1", url: "https://picsum.photos/seed/assassin1/400/600", caption: "幻影刺客正面", status: "approved" },
      { id: "2", url: "https://picsum.photos/seed/assassin2/400/600", caption: "幻影刺客背面", status: "approved" },
      { id: "3", url: "https://picsum.photos/seed/assassin3/400/600", caption: "光效展示", status: "approved" },
    ],
    changelogs: [
      { version: "限定版", date: "2024-11-10", content: "## 限定发售\n- 独特设计\n- 首位买家独享\n- 永久不再出售" },
    ],
  },
  "image-3": {
    type: "image",
    title: "龙骑士限定皮肤",
    author: "传说工作室",
    authorType: "皮肤艺术家",
    description: "一款极具收藏价值的限定皮肤。以东方龙文化为灵感，融合现代设计元素，打造出威严霸气的龙骑士形象。皮肤细节精致，包含独特的鳞片纹理、流光特效和专属动作。购买后该皮肤将完全属于您，不再对外出售。",
    authorNote: "这款皮肤是我对东方龙文化的致敬之作。从设计到完成历时三个月，每一个细节都经过反复打磨。希望拥有它的玩家能感受到其中的用心。",
    tags: ["皮肤", "限定", "龙骑士"],
    basicInfo: {
      "内容方向": "皮肤",
      "视觉基调": "幻想风",
      "内容来源": "原创",
      "形象范围": "游戏形象",
      "使用条件": "买断",
      "情感导向": "震撼/敬畏、成就/满足",
    },
    price: 199,
    downloads: 0,
    views: 15600,
    favorites: 456,
    likes: 378,
    donationLeaders: [],
    donationFeed: [],
    comments: [
      { user: "收藏家", date: "2024-11-08", content: "太精美了，值得收藏！" },
    ],
    versions: [
      { id: "1", version: "限定版", gameVersion: "全版本", releaseDate: "2024-08-15", downloads: 0, fileSize: "512 KB", changelog: "首发限定版", isLatest: true },
    ],
    gallery: [
      { id: "1", url: "https://picsum.photos/seed/dragon1/400/600", caption: "龙骑士正面", status: "approved" },
      { id: "2", url: "https://picsum.photos/seed/dragon2/400/600", caption: "龙骑士背面", status: "approved" },
      { id: "3", url: "https://picsum.photos/seed/dragon3/400/600", caption: "特效展示", status: "approved" },
    ],
    changelogs: [
      { version: "限定版", date: "2024-08-15", content: "## 限定发售\n- 独家设计\n- 买断独享\n- 不再对外出售" },
    ],
  },
  "image-4": {
    type: "image",
    title: "季节主题皮肤合集",
    author: "四季工坊",
    authorType: "皮肤设计团队",
    description: "一套持续更新的季节主题皮肤合集。包含春、夏、秋、冬四个系列的皮肤，每个季节都会推出新的主题皮肤。订阅后可在订阅期间使用所有已发布的皮肤，并第一时间获取新发布的季节限定皮肤。",
    authorNote: "我们希望用皮肤记录四季的美好。订阅我们的合集，您将拥有一个不断丰富的皮肤库，每个季节都有新的惊喜等着您！",
    tags: ["皮肤", "季节", "合集"],
    basicInfo: {
      "内容方向": "皮肤",
      "视觉基调": "自然风",
      "内容来源": "原创",
      "形象范围": "游戏形象",
      "使用条件": "订阅",
      "情感导向": "温馨/治愈、好奇/探索",
    },
    subscriptionPrice: 29,
    downloads: 0,
    views: 23400,
    favorites: 678,
    likes: 534,
    donationLeaders: [],
    donationFeed: [],
    comments: [
      { user: "订阅用户", date: "2024-11-10", content: "每个季节的皮肤都很用心！" },
    ],
    versions: [
      { id: "1", version: "秋季篇", gameVersion: "全版本", releaseDate: "2024-09-01", downloads: 0, fileSize: "1.2 MB", changelog: "秋季主题皮肤上线", isLatest: true },
      { id: "2", version: "夏季篇", gameVersion: "全版本", releaseDate: "2024-06-01", downloads: 0, fileSize: "1.1 MB", changelog: "夏季主题皮肤" },
      { id: "3", version: "春季篇", gameVersion: "全版本", releaseDate: "2024-03-01", downloads: 0, fileSize: "1.0 MB", changelog: "首发春季系列" },
    ],
    gallery: [
      { id: "1", url: "https://picsum.photos/seed/spring1/400/600", caption: "春季-樱花", status: "approved" },
      { id: "2", url: "https://picsum.photos/seed/summer1/400/600", caption: "夏季-海洋", status: "approved" },
      { id: "3", url: "https://picsum.photos/seed/autumn1/400/600", caption: "秋季-枫叶", status: "approved" },
    ],
    changelogs: [
      { version: "秋季篇", date: "2024-09-01", content: "## 秋季更新\n- 新增5款秋季主题皮肤\n- 优化皮肤细节" },
      { version: "夏季篇", date: "2024-06-01", content: "## 夏季更新\n- 新增6款夏季主题皮肤" },
      { version: "春季篇", date: "2024-03-01", content: "## 首发\n- 春季系列首发" },
    ],
  },
  "image-5": {
    type: "image",
    title: "经典像素皮肤合集（搬运）",
    author: "PixelMaster（原作者）",
    authorType: "搬运者：像素搬运组",
    description: "一套经典的像素风格皮肤合集，包含20款精心设计的像素艺术风格皮肤。每款皮肤都采用独特的像素艺术风格，色彩鲜明，造型可爱。本资源已获得原作者授权，搬运至本平台供中文玩家使用。",
    authorNote: "作为搬运者，我们承诺保持皮肤的完整性和原汁原味。所有更新都会第一时间同步，确保中文玩家能够获得最佳的使用体验。如有任何问题，欢迎在评论区反馈！",
    tags: ["皮肤", "像素", "合集"],
    basicInfo: {
      "内容方向": "皮肤",
      "视觉基调": "像素风",
      "内容来源": "搬运",
      "形象范围": "游戏形象",
      "使用条件": "免费",
      "情感导向": "快乐/创造、怀旧/回忆",
    },
    downloads: 35000,
    views: 120000,
    favorites: 2100,
    likes: 1800,
    donationLeaders: [
      { name: "像素爱好者", amount: "12k", avatar: "🏆" },
    ],
    donationFeed: [
      { user: "像素迷", date: "2024.11.10", amount: "1k" },
    ],
    comments: [
      { user: "老玩家", date: "2024-11-12", content: "经典皮肤，搬运辛苦了！" },
    ],
    versions: [
      { id: "1", version: "v2.0", gameVersion: "全版本", releaseDate: "2024-11-01", downloads: 35000, fileSize: "512 KB", changelog: "新增5款皮肤", isLatest: true },
    ],
    gallery: [
      { id: "1", url: "https://picsum.photos/seed/pixel1/400/600", caption: "像素战士", status: "approved" },
      { id: "2", url: "https://picsum.photos/seed/pixel2/400/600", caption: "像素法师", status: "approved" },
    ],
    changelogs: [
      { version: "v2.0", date: "2024-11-01", content: "## 更新\n- 新增5款像素皮肤\n- 优化细节" },
    ],
  },
};

const getOtherResourceData = (type: string, id: string) => {
  const key = `${type}-${id}`;
  if (mockOtherData[key]) return mockOtherData[key];

  const defaultBasicInfo = {
    "游戏版本": "1.20.x",
    "产出方式": "原创",
    "产出时间": "2024.01",
    "许可证类型": "开源",
  };

  const typeSpecificInfo: Record<string, any> = {
    ecoTool: { "适用对象": "开发者" },
    doc: { "适用对象": "学习者" },
    image: {},
  };

  return {
    type,
    title: `示例${getTypeLabel(type)}`,
    author: "示例作者",
    authorType: "创作者",
    description: "这是一个示例资源。",
    authorNote: "感谢大家的支持！",
    tags: ["示例"],
    basicInfo: { ...defaultBasicInfo, ...typeSpecificInfo[type] },
    downloads: 0,
    views: 0,
    favorites: 0,
    likes: 0,
    donationLeaders: [],
    donationFeed: [],
    comments: [],
    versions: [
      { id: "1", version: "v1.0", gameVersion: "1.20.x", releaseDate: "2024-01-01", downloads: 0, fileSize: "1 MB", changelog: "首发版本", isLatest: true },
    ],
    gallery: [],
    changelogs: [
      { version: "v1.0", date: "2024-01-01", content: "首发版本" },
    ],
  };
};

const OtherResourceDetail = () => {
  const { type, id } = useParams({ from: "/other/$type/$id" });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("intro");
  const [commentTab, setCommentTab] = useState("public");
  const [newComment, setNewComment] = useState("");
  const [resource, setResource] = useState(getOtherResourceData(type || "ecoTool", id || "1"));
  const [editedResource, setEditedResource] = useState<any>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [versionFilter, setVersionFilter] = useState("all");
  const [showGalleryUploadModal, setShowGalleryUploadModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<{
    type: "original-normal" | "original-image" | "repost-normal" | "repost-image";
    title: string;
    description: string;
  } | null>(null);
  const [showLicenseDetailModal, setShowLicenseDetailModal] = useState(false);
  const [showLicenseSubmitModal, setShowLicenseSubmitModal] = useState(false);
  const [selectedLicenseTemplate, setSelectedLicenseTemplate] = useState<"original-normal" | "original-image" | "repost-normal" | "repost-image" | null>(null);
  const [newLicenseContent, setNewLicenseContent] = useState("");
  const [showAcquisitionEditModal, setShowAcquisitionEditModal] = useState(false);
  const [selectedAcquisition, setSelectedAcquisition] = useState<"免费" | "定制" | "买断" | "订阅">(
    resource.basicInfo?.["使用条件"] || "免费"
  );
  const [acquisitionPrice, setAcquisitionPrice] = useState(resource.price || 99);
  const [acquisitionSubscriptionPrice, setAcquisitionSubscriptionPrice] = useState(resource.subscriptionPrice || 19);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);

  const filteredBasicInfo = Object.entries(resource.basicInfo || {}).filter(
    ([_, value]) => value && value !== "不涉及"
  );

  const getTagSystem = () => {
    const { type } = resource;
    if (!type) return null;
    return tagSystemMap[type] || null;
  };

  const getCommonMeta = () => {
    const { type } = resource;
    if (type === "ecoTool" || type === "doc") {
      return ecoDocCommonMeta;
    }
    if (type === "image") {
      return imageCommonMeta;
    }
    return auxiliaryCommonMeta;
  };

  const tabItems = [
    { id: "intro", label: "基本介绍" },
    ...(resource.type === "image" ? [{ id: "gallery", label: "画廊" }] : []),
    { id: "download", label: resource.type === "image" ? "获取" : "下载" },
    { id: "license", label: "协议" },
    { id: "changelog", label: "日志" },
  ];

  const renderEditModal = () => {
    const tagSystem = getTagSystem();
    const commonMeta = getCommonMeta();
    
    if (!showEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">编辑资源信息</h2>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowEditModal(false)}>
              ×
            </Button>
          </div>

          <div className="p-4 space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">资源标题</label>
              <Input
                value={editedResource.title || ""}
                onChange={(e) => setEditedResource({ ...editedResource, title: e.target.value })}
                placeholder="输入资源标题..."
                className="text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">资源简介</label>
              <Textarea
                value={editedResource.description || ""}
                onChange={(e) => setEditedResource({ ...editedResource, description: e.target.value })}
                placeholder="输入资源简介..."
                className="text-sm min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">制作方寄语</label>
              <Textarea
                value={editedResource.authorNote || ""}
                onChange={(e) => setEditedResource({ ...editedResource, authorNote: e.target.value })}
                placeholder="输入制作方寄语..."
                className="text-sm min-h-[80px]"
              />
            </div>

            {tagSystem && tagSystem.mainTags && tagSystem.mainTags.map((tag) => (
              <div key={tag.id}>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {tag.label}
                  {tag.multiSelect && <span className="text-xs text-muted-foreground ml-1">(可多选)</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {tag.options && tag.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (tag.multiSelect) {
                          const currentValues = editedResource[tag.id] || [];
                          const newValues = currentValues.includes(option.id)
                            ? currentValues.filter((v: string) => v !== option.id)
                            : [...currentValues, option.id];
                          setEditedResource({ ...editedResource, [tag.id]: newValues });
                        } else {
                          setEditedResource({ ...editedResource, [tag.id]: option.id });
                        }
                      }}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                        tag.multiSelect
                          ? (editedResource[tag.id] || []).includes(option.id)
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-border hover:bg-secondary"
                          : editedResource[tag.id] === option.id
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-border hover:bg-secondary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {commonMeta && commonMeta.map((tag) => (
              <div key={tag.id}>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {tag.label}
                  {tag.multiSelect && <span className="text-xs text-muted-foreground ml-1">(可多选)</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {tag.options && tag.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (tag.multiSelect) {
                          const currentValues = editedResource[tag.id] || [];
                          const newValues = currentValues.includes(option.id)
                            ? currentValues.filter((v: string) => v !== option.id)
                            : [...currentValues, option.id];
                          setEditedResource({ ...editedResource, [tag.id]: newValues });
                        } else {
                          setEditedResource({ ...editedResource, [tag.id]: option.id });
                        }
                      }}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                        tag.multiSelect
                          ? (editedResource[tag.id] || []).includes(option.id)
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-border hover:bg-secondary"
                          : editedResource[tag.id] === option.id
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-border hover:bg-secondary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => setShowEditModal(false)}>取消</Button>
            <Button size="sm" onClick={() => {
              setResource(editedResource);
              setShowEditModal(false);
            }}>保存</Button>
          </div>
        </div>
      </div>
    );
  };

  const renderGalleryUploadModal = () => {
    if (!showGalleryUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card border border-border rounded-lg w-full max-w-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">提交图片</h3>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowGalleryUploadModal(false)}>
              ×
            </Button>
          </div>

          <div className="space-y-3 mb-4">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">上传规则：</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>图片需与资源内容相关</li>
                <li>禁止上传违规内容</li>
                <li>图片大小不超过5MB</li>
                <li>支持JPG、PNG格式</li>
              </ul>
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">点击或拖拽图片到此处上传</p>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button size="sm" variant="outline" onClick={() => setShowGalleryUploadModal(false)}>取消</Button>
            <Button size="sm" onClick={() => setShowGalleryUploadModal(false)}>提交</Button>
          </div>
        </div>
      </div>
    );
  };

  const renderAcquisitionEditModal = () => {
    if (!showAcquisitionEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card border border-border rounded-lg w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">修改获取方式</h2>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowAcquisitionEditModal(false)}>
              ×
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">获取方式</label>
              <div className="grid grid-cols-2 gap-2">
                {["免费", "定制", "买断", "订阅"].map((type) => (
                  <div
                    key={type}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedAcquisition === type 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:bg-secondary/20"
                    }`}
                    onClick={() => setSelectedAcquisition(type as any)}
                  >
                    <div className="text-sm font-medium text-foreground">{type}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {type === "免费" && "用户可免费获取"}
                      {type === "定制" && "首位买家独享"}
                      {type === "买断" && "一次性付费购买"}
                      {type === "订阅" && "按月订阅使用"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {(selectedAcquisition === "定制" || selectedAcquisition === "买断") && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {selectedAcquisition === "定制" ? "定制独享价" : "买断价格"} (元)
                </label>
                <Input
                  type="number"
                  value={acquisitionPrice}
                  onChange={(e) => setAcquisitionPrice(Number(e.target.value))}
                  placeholder="输入价格..."
                  className="text-sm"
                />
                {selectedAcquisition === "定制" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    定制价格为首买独享价格，购买后其他用户将无法购买
                  </p>
                )}
              </div>
            )}

            {selectedAcquisition === "订阅" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">订阅价格 (元/月)</label>
                <Input
                  type="number"
                  value={acquisitionSubscriptionPrice}
                  onChange={(e) => setAcquisitionSubscriptionPrice(Number(e.target.value))}
                  placeholder="输入月订阅价格..."
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  用户订阅期间可使用该形象，取消订阅后将无法继续使用
                </p>
              </div>
            )}

            {selectedAcquisition === "免费" && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="text-xs text-green-600">
                  免费获取方式下，所有用户均可免费使用该形象
                </div>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" className="h-8" onClick={() => setShowAcquisitionEditModal(false)}>
              取消
            </Button>
            <Button 
              size="sm" 
              className="h-8"
              onClick={() => {
                console.log("保存前 - selectedAcquisition:", selectedAcquisition);
                console.log("保存前 - acquisitionPrice:", acquisitionPrice);
                console.log("保存前 - acquisitionSubscriptionPrice:", acquisitionSubscriptionPrice);
                
                const updatedResource = {
                  ...resource,
                  basicInfo: {
                    ...resource.basicInfo,
                    "使用条件": selectedAcquisition
                  }
                };
                
                if (selectedAcquisition === "定制" || selectedAcquisition === "买断") {
                  updatedResource.price = acquisitionPrice;
                  if (updatedResource.subscriptionPrice) delete updatedResource.subscriptionPrice;
                } else if (selectedAcquisition === "订阅") {
                  updatedResource.subscriptionPrice = acquisitionSubscriptionPrice;
                  if (updatedResource.price) delete updatedResource.price;
                } else {
                  if (updatedResource.price) delete updatedResource.price;
                  if (updatedResource.subscriptionPrice) delete updatedResource.subscriptionPrice;
                }
                
                console.log("保存后 - updatedResource:", updatedResource);
                
                setResource(updatedResource);
                setShowAcquisitionEditModal(false);
              }}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderImageUploadModal = () => {
    if (!showImageUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card border border-border rounded-lg w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">上传形象文件</h2>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowImageUploadModal(false)}>
              ×
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-2">上传须知：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>支持上传形象相关文件（皮肤、披风等）</li>
                <li>文件格式：PNG、JPG、ZIP</li>
                <li>单个文件大小不超过10MB</li>
                <li>上传后文件将关联到该形象资源</li>
              </ul>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">点击或拖拽文件到此处上传</p>
              <p className="text-xs text-muted-foreground">支持 PNG、JPG、ZIP 格式</p>
              <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.zip" />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="text-xs text-blue-600">
                <span className="font-semibold">提示：</span>上传的文件将作为该形象的资源文件，用户获取形象后可下载使用
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" className="h-8" onClick={() => setShowImageUploadModal(false)}>
              取消
            </Button>
            <Button 
              size="sm" 
              className="h-8"
              onClick={() => {
                console.log("上传文件");
                setShowImageUploadModal(false);
              }}
            >
              确认上传
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCommentSection = () => (
    <div className="mt-6">
      <Separator className="my-6" />
      <Tabs value={commentTab} onValueChange={setCommentTab}>
        <TabsList className="h-auto p-0 bg-transparent">
          <TabsTrigger value="public" className="text-xs px-3 py-1.5 data-[state=active]:text-primary">公共交流区</TabsTrigger>
          <TabsTrigger value="feedback" className="text-xs px-3 py-1.5 data-[state=active]:text-primary">制作方反馈区</TabsTrigger>
          <TabsTrigger value="donation" className="text-xs px-3 py-1.5 data-[state=active]:text-primary">订阅及打赏交流区</TabsTrigger>
        </TabsList>

        <TabsContent value="public" className="mt-3 space-y-3">
          {resource.comments.map((c: any, i: number) => (
            <div key={i} className="border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-primary">{c.user}</span>
                <span className="text-xs text-muted-foreground">{c.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{c.content}</p>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="feedback" className="mt-3">
          <p className="text-sm text-muted-foreground text-center py-4">暂无反馈</p>
        </TabsContent>
        <TabsContent value="donation" className="mt-3">
          <p className="text-sm text-muted-foreground text-center py-4">暂无打赏交流</p>
        </TabsContent>
      </Tabs>

      <div className="mt-4 flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="发表评论..."
          className="text-sm resize-none"
          rows={1}
        />
        <Button size="icon" variant="ghost" className="flex-shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.history.back()} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-foreground truncate">{resource.title}</h1>
              <p className="text-xs text-muted-foreground truncate">{resource.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3.5 h-3.5" /> {resource.views}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Download className="w-3.5 h-3.5" /> {resource.downloads}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookmarkPlus className="w-3.5 h-3.5" /> {resource.favorites}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3.5 h-3.5" /> {resource.likes}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-border bg-card">
            <TabsList className="h-auto p-0 bg-transparent rounded-none">
              {tabItems.map((tab) => (
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
                <div className="mb-6 flex items-start justify-between">
                  <h2 className="text-xl font-bold text-foreground">{resource.title}</h2>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setEditedResource({ ...resource });
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="w-3 h-3 mr-1" /> 编辑
                  </Button>
                </div>

                <section className="mb-6">
                  <h3 className="text-sm font-semibold text-primary mb-2">资源简介</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
                </section>

                <section className="mb-6">
                  <h3 className="text-sm font-semibold text-primary mb-2">制作方寄语</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{resource.authorNote}</p>
                </section>

                {filteredBasicInfo.length > 0 && (
                  <section className="mb-6">
                    <h3 className="text-sm font-semibold text-primary mb-2">基本信息</h3>
                    <div className="space-y-1.5">
                      {filteredBasicInfo.map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-muted-foreground">{key}：</span>
                          <span className="text-foreground">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {renderCommentSection()}
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">画廊</h2>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => setShowGalleryUploadModal(true)}
                    >
                      <Upload className="w-3 h-3 mr-1" /> 提交图片
                    </Button>
                  </div>

                  {resource.gallery && resource.gallery.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {resource.gallery.map((img: any) => (
                        <div key={img.id} className="aspect-video bg-secondary rounded-lg overflow-hidden relative group">
                          <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-xs text-white">{img.caption}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      暂无图片
                    </div>
                  )}
                </div>

                {renderCommentSection()}
              </TabsContent>

              <TabsContent value="download" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">{resource.type === "image" ? "获取" : "下载"}</h2>
                    {resource.type === "image" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 px-2 text-xs"
                          >
                            管理 <ChevronDown className="w-3 h-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem 
                            className="text-xs cursor-pointer"
                            onClick={() => setShowImageUploadModal(true)}
                          >
                            <Upload className="w-3 h-3 mr-2" /> 上传文件
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-xs cursor-pointer"
                            onClick={() => {
                              setSelectedAcquisition(resource.basicInfo?.["使用条件"] || "免费");
                              setAcquisitionPrice(resource.price || 99);
                              setAcquisitionSubscriptionPrice(resource.subscriptionPrice || 19);
                              setShowAcquisitionEditModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3 mr-2" /> 修改获取方式
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {resource.type === "image" ? (
                    <div className="space-y-4">
                      {resource.basicInfo?.["使用条件"] === "免费" && (
                        <div className="border border-border rounded-lg p-6">
                          <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-foreground mb-2">免费获取</h3>
                            <p className="text-sm text-muted-foreground">该形象可免费使用，点击下方按钮即可获取</p>
                          </div>
                          <div className="flex justify-center">
                            <Button size="lg" className="px-8">
                              <Download className="w-4 h-4 mr-2" /> 免费获取
                            </Button>
                          </div>
                        </div>
                      )}

                      {resource.basicInfo?.["使用条件"] === "定制" && (
                        <div className="border border-border rounded-lg p-6">
                          <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-foreground mb-2">定制独享</h3>
                            <p className="text-sm text-muted-foreground">首位买家独享，永久不再出售</p>
                          </div>
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">¥{resource.price || 299}</div>
                              <div className="text-xs text-muted-foreground">定制独享价</div>
                            </div>
                          </div>
                          <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                            <h4 className="text-sm font-semibold text-foreground mb-2">购买须知</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              <li>• 该形象仅出售给第一位买家</li>
                              <li>• 购买后其他用户将无法购买</li>
                              <li>• 申请购买后需预支付款项</li>
                              <li>• 制作方同意后完成支付</li>
                              <li>• 制作方不同意则自动退款</li>
                            </ul>
                          </div>
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
                            <div className="text-xs text-orange-600 text-center">
                              <span className="font-semibold">预支付机制：</span>点击申请购买后需先付款，款项将处于预支付状态。制作方同意后完成支付，不同意则自动退款
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Button size="lg" className="px-8">
                              申请购买
                            </Button>
                          </div>
                        </div>
                      )}

                      {resource.basicInfo?.["使用条件"] === "买断" && (
                        <div className="border border-border rounded-lg p-6">
                          <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-foreground mb-2">买断获取</h3>
                            <p className="text-sm text-muted-foreground">购买后可永久使用该形象</p>
                          </div>
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">¥{resource.price || 99}</div>
                              <div className="text-xs text-muted-foreground">一次性付费</div>
                            </div>
                          </div>
                          <div className="bg-secondary/20 rounded-lg p-3 mb-4">
                            <div className="text-xs text-muted-foreground text-center">
                              购买后该形象将独属于您，其他用户将无法获取
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Button size="lg" className="px-8">
                              立即购买
                            </Button>
                          </div>
                        </div>
                      )}

                      {resource.basicInfo?.["使用条件"] === "订阅" && (
                        <div className="border border-border rounded-lg p-6">
                          <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-foreground mb-2">订阅获取</h3>
                            <p className="text-sm text-muted-foreground">订阅制作方后可使用该形象</p>
                          </div>
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">¥{resource.subscriptionPrice || 19}/月</div>
                              <div className="text-xs text-muted-foreground">订阅制</div>
                            </div>
                          </div>
                          <div className="bg-secondary/20 rounded-lg p-3 mb-4">
                            <div className="text-xs text-muted-foreground text-center">
                              订阅期间可使用该形象，取消订阅后将无法继续使用
                            </div>
                          </div>
                          <div className="flex justify-center gap-2">
                            <Button size="lg" className="px-8">
                              订阅制作方
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="border border-border rounded-lg">
                        <h3 className="text-base font-semibold text-foreground p-3 border-b border-border">版本历史</h3>
                        <div className="divide-y divide-border">
                          {resource.versions.map((v: any) => (
                            <div key={v.id} className="px-4 py-3 hover:bg-secondary/20 transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-foreground">{v.version}</span>
                                  {v.isLatest && (
                                    <Badge className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                                      最新
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">{v.releaseDate}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{(v.downloads / 1000).toFixed(1)}K 获取</span>
                                <span>{v.fileSize}</span>
                              </div>
                              {v.changelog && (
                                <div className="text-xs text-muted-foreground mt-1">{v.changelog}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg">
                      <h3 className="text-base font-semibold text-foreground p-3 border-b border-border">版本列表</h3>
                      <div className="divide-y divide-border">
                        {resource.versions.map((v: any) => (
                          <div key={v.id} className="px-4 py-3 hover:bg-secondary/20 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{v.version}</span>
                                {v.isLatest && (
                                  <Badge className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                                    最新
                                  </Badge>
                                )}
                              </div>
                              <Button size="sm" className="h-6 px-2 text-xs">
                                <Download className="w-3 h-3 mr-1" /> 下载
                              </Button>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{v.releaseDate}</span>
                              <span>{(v.downloads / 1000).toFixed(1)}K 下载</span>
                              <span>{v.fileSize}</span>
                            </div>
                            {v.changelog && (
                              <div className="text-xs text-muted-foreground mt-1">{v.changelog}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {renderCommentSection()}
              </TabsContent>

              <TabsContent value="license" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">协议</h2>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => setShowLicenseSubmitModal(true)}
                    >
                      <Edit className="w-3 h-3 mr-1" /> 提交协议
                    </Button>
                  </div>

                  {resource.type === "image" ? (
                    <div className="space-y-3">
                      {resource.basicInfo?.["内容来源"] === "原创" ? (
                        <div 
                          className="border rounded-lg p-4 bg-card hover:bg-secondary/20 transition-colors cursor-pointer border-blue-500/30 bg-blue-500/5"
                          onClick={() => {
                            setSelectedLicense({
                              type: "original-image",
                              title: "形象资源原创协议",
                              description: "适用于形象类资源的原创协议"
                            });
                            setShowLicenseDetailModal(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">原创协议</Badge>
                              <span className="text-xs text-muted-foreground">形象资源</span>
                            </div>
                            <Badge className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                              当前
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border rounded-lg p-4 bg-card hover:bg-secondary/20 transition-colors cursor-pointer border-orange-500/30 bg-orange-500/5"
                          onClick={() => {
                            setSelectedLicense({
                              type: "repost-image",
                              title: "形象资源搬运协议",
                              description: "适用于形象类资源的搬运协议"
                            });
                            setShowLicenseDetailModal(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">搬运协议</Badge>
                              <span className="text-xs text-muted-foreground">形象资源</span>
                            </div>
                            <Badge className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                              当前
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resource.basicInfo?.["产出方式"] === "原创" ? (
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
                      ) : (
                        <div 
                          className="border rounded-lg p-4 bg-card hover:bg-secondary/20 transition-colors cursor-pointer border-orange-500/30 bg-orange-500/5"
                          onClick={() => {
                            setSelectedLicense({
                              type: "repost-normal",
                              title: "常规资源搬运协议",
                              description: "适用于非形象类常规资源的搬运协议"
                            });
                            setShowLicenseDetailModal(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">搬运协议</Badge>
                              <span className="text-xs text-muted-foreground">常规资源</span>
                            </div>
                            <Badge className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                              当前
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {showLicenseDetailModal && selectedLicense && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-card border border-border rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-lg font-bold text-foreground mb-2">{selectedLicense.title}</h2>
                            <p className="text-xs text-muted-foreground">{selectedLicense.description}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowLicenseDetailModal(false)}>
                            ×
                          </Button>
                        </div>

                        <Separator className="my-4" />

                        <div className="bg-secondary/30 border border-border rounded-lg p-4">
                          <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                            {(selectedLicense.type === "original-normal" || selectedLicense.type === "original-image") && (
                              `【免责声明】

${selectedLicense.type === "original-image" 
  ? "本形象为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。"
  : "本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。"
}

【基本声明】

${selectedLicense.type === "original-image" 
  ? "本形象内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。所有内容均为原创设计，不包含任何侵犯微软或Mojang Studios知识产权的元素。"
  : "本资源内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素。"
}

${selectedLicense.type === "original-image"
  ? "根据Minecraft官方政策，本形象属于装饰性物品。游戏形象（如皮肤、光环等）属于游戏内装饰性物品，社区形象（如头像、徽章等）属于游戏外装饰性物品。无论游戏形象还是社区形象，制作方均可自主决定收费方式。用户需按照制作方设定的获取方式（免费、定制、买断、订阅）获取该形象内容的使用权。"
  : "根据Minecraft官方政策，本资源属于辅助工具或知识文档，必须免费提供给所有用户。用户在遵守相关使用条款的前提下，可自由下载、使用和分享该资源内容，无需支付任何费用。"
}

【平台声明】

本平台要求平台内的制作原创内容的制作方如果使用本平台发布自己的原创作品，便不能再其它网站发布这些作品，本平台对搬运内容不做要求。

【作者声明】

本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源。

本人同样遵守自己身为该平台的进行原创活动的制作方的各项基本要求。

用户在使用本资源时，应遵守以下约定：
• 允许个人非商业用途使用
• 允许在游戏中展示和使用
${selectedLicense.type === "original-image"
  ? "• 按照制作方设定的获取方式使用"
  : "• 允许制作视频、直播等Minecraft相关内容并通过平台广告、赞助、捐赠等方式获得收益"
}
${selectedLicense.type === "original-image"
  ? "• 禁止未经授权的二次分发"
  : "• 允许接受用户自愿捐赠"
}
${selectedLicense.type === "original-image"
  ? ""
  : "• 用户对制作方及作品的订阅及打赏行为均为自主无偿赠予行为，平台及作者不会要求用户必须订阅或打赏后才能使用这些内容"
}
${selectedLicense.type === "original-image"
  ? ""
  : "• 禁止直接出售本资源或通过本资源直接盈利"
}
${selectedLicense.type === "original-image"
  ? ""
  : "• 禁止未经授权的二次分发"
}
${selectedLicense.type === "original-image"
  ? ""
  : "• 禁止将本资源用于推广与Minecraft无关的产品、服务或品牌"
}

【知识产权声明】

${selectedLicense.type === "original-image"
  ? "本形象中所有原创内容的知识产权归作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。"
  : "本资源中所有原创内容的知识产权归作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。"
}`
                            )}
                            {(selectedLicense.type === "repost-normal" || selectedLicense.type === "repost-image") && (
                              `【免责声明】

${selectedLicense.type === "repost-image"
  ? "本形象为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。"
  : "本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。"
}

【基本声明】

${selectedLicense.type === "repost-image"
  ? "本形象内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。所有内容均为原创设计，不包含任何侵犯微软或Mojang Studios知识产权的元素。"
  : "本资源内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素。"
}

${selectedLicense.type === "repost-image"
  ? "根据Minecraft官方政策，本形象属于装饰性物品。游戏形象（如皮肤、光环等）属于游戏内装饰性物品，社区形象（如头像、徽章等）属于游戏外装饰性物品。无论游戏形象还是社区形象，制作方均可自主决定收费方式。用户需按照制作方设定的获取方式（免费、定制、买断、订阅）获取该形象内容的使用权。"
  : "根据Minecraft官方政策，本资源属于辅助工具或知识文档，必须免费提供给所有用户。用户在遵守相关使用条款的前提下，可自由下载、使用和分享该资源内容，无需支付任何费用。"
}

【作者声明】

本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源。

用户在使用本资源时，应遵守以下约定：
• 允许个人非商业用途使用
• 允许在游戏中展示和使用
${selectedLicense.type === "repost-image"
  ? "• 按照制作方设定的获取方式使用"
  : "• 允许制作视频、直播等Minecraft相关内容并通过平台广告、赞助、捐赠等方式获得收益"
}
${selectedLicense.type === "repost-image"
  ? "• 禁止未经授权的二次分发"
  : "• 允许接受用户自愿捐赠"
}
${selectedLicense.type === "repost-image"
  ? ""
  : "• 用户对制作方及作品的订阅及打赏行为均为自主无偿赠予行为，平台及作者不会要求用户必须订阅或打赏后才能使用这些内容"
}
${selectedLicense.type === "repost-image"
  ? ""
  : "• 禁止直接出售本资源或通过本资源直接盈利"
}
${selectedLicense.type === "repost-image"
  ? ""
  : "• 禁止未经授权的二次分发"
}
${selectedLicense.type === "repost-image"
  ? ""
  : "• 禁止将本资源用于推广与Minecraft无关的产品、服务或品牌"
}

【搬运声明】

本资源已获得原制作方的明确授权，允许搬运至本平台并交由搬运方进行管理。

搬运方承诺遵守原制作方的所有使用要求，并确保资源的完整性和合规性。搬运方应及时同步原资源的更新，保持资源内容的最新状态。

搬运方与原作者之间的约定：
• 搬运方需在资源页面明确标注原作者信息
• 搬运方需及时同步原作者的更新内容
• 搬运方不得擅自修改资源内容
• 如原作者要求下架，搬运方应立即配合

【知识产权声明】

${selectedLicense.type === "repost-image"
  ? "本形象中所有原创内容的知识产权归原作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。"
  : "本资源中所有原创内容的知识产权归原作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。"
}`
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
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-card border border-border rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-lg font-bold text-foreground mb-2">提交协议</h2>
                            <p className="text-xs text-muted-foreground">选择协议模板并进行编辑</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowLicenseSubmitModal(false)}>
                            ×
                          </Button>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">选择协议模板</label>
                            <div className="grid grid-cols-2 gap-3">
                              {resource.type === "image" ? (
                                <>
                                  <div 
                                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                      selectedLicenseTemplate === "original-image" ? "border-blue-500 bg-blue-500/10" : "border-border hover:bg-secondary/20"
                                    }`}
                                    onClick={() => {
                                      setSelectedLicenseTemplate("original-image");
                                      setNewLicenseContent(`【免责声明】

本形象为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。

【基本声明】

本形象内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。所有内容均为原创设计，不包含任何侵犯微软或Mojang Studios知识产权的元素。

根据Minecraft官方政策，本形象属于装饰性物品。游戏形象（如皮肤、光环等）属于游戏内装饰性物品，社区形象（如头像、徽章等）属于游戏外装饰性物品。无论游戏形象还是社区形象，制作方均可自主决定收费方式。用户需按照制作方设定的获取方式（免费、定制、买断、订阅）获取该形象内容的使用权。

【平台声明】

本平台要求平台内的制作原创内容的制作方如果使用本平台发布自己的原创作品，便不能再其它网站发布这些作品，本平台对搬运内容不做要求。

【作者声明】

本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源。

本人同样遵守自己身为该平台的进行原创活动的制作方的各项基本要求。

用户在使用本资源时，应遵守以下约定：
• 允许个人非商业用途使用
• 允许在游戏中展示和使用
• 按照制作方设定的获取方式使用
• 禁止未经授权的二次分发

【知识产权声明】

本形象中所有原创内容的知识产权归作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">原创协议</Badge>
                                      <span className="text-[10px] text-muted-foreground">形象资源</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">适用于形象类资源</div>
                                  </div>

                                  <div 
                                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                      selectedLicenseTemplate === "repost-image" ? "border-orange-500 bg-orange-500/10" : "border-border hover:bg-secondary/20"
                                    }`}
                                    onClick={() => {
                                      setSelectedLicenseTemplate("repost-image");
                                      setNewLicenseContent(`【免责声明】

本形象为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。

【基本声明】

本形象内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。所有内容均为原创设计，不包含任何侵犯微软或Mojang Studios知识产权的元素。

根据Minecraft官方政策，本形象属于装饰性物品。游戏形象（如皮肤、光环等）属于游戏内装饰性物品，社区形象（如头像、徽章等）属于游戏外装饰性物品。无论游戏形象还是社区形象，制作方均可自主决定收费方式。用户需按照制作方设定的获取方式（免费、定制、买断、订阅）获取该形象内容的使用权。

【作者声明】

本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源。

用户在使用本资源时，应遵守以下约定：
• 允许个人非商业用途使用
• 允许在游戏中展示和使用
• 按照制作方设定的获取方式使用
• 禁止未经授权的二次分发

【搬运声明】

本资源已获得原制作方的明确授权，允许搬运至本平台并交由搬运方进行管理。

搬运方承诺遵守原制作方的所有使用要求，并确保资源的完整性和合规性。搬运方应及时同步原资源的更新，保持资源内容的最新状态。

搬运方与原作者之间的约定：
• 搬运方需在资源页面明确标注原作者信息
• 搬运方需及时同步原作者的更新内容
• 搬运方不得擅自修改资源内容
• 如原作者要求下架，搬运方应立即配合

【知识产权声明】

本形象中所有原创内容的知识产权归原作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-[10px]">搬运协议</Badge>
                                      <span className="text-[10px] text-muted-foreground">形象资源</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">适用于形象类资源</div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div 
                                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                      selectedLicenseTemplate === "original-normal" ? "border-blue-500 bg-blue-500/10" : "border-border hover:bg-secondary/20"
                                    }`}
                                    onClick={() => {
                                      setSelectedLicenseTemplate("original-normal");
                                      setNewLicenseContent(`【免责声明】

本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。

【基本声明】

本资源内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。

根据Minecraft官方政策，本资源属于辅助工具或知识文档，必须免费提供给所有用户。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素。

本资源内容免费无偿供所有用户使用。用户在遵守相关使用条款的前提下，可自由下载、使用和分享该资源内容，无需支付任何费用。

【平台声明】

本平台要求平台内的制作原创内容的制作方如果使用本平台发布自己的原创作品，便不能再其它网站发布这些作品，本平台对搬运内容不做要求。

【作者声明】

本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源。

本人同样遵守自己身为该平台的进行原创活动的制作方的各项基本要求。

用户在使用本资源时，应遵守以下约定：
• 允许个人非商业用途使用
• 允许在游戏中展示和使用
• 允许制作视频、直播等Minecraft相关内容并通过平台广告、赞助、捐赠等方式获得收益
• 允许接受用户自愿捐赠
• 用户对制作方及作品的订阅及打赏行为均为自主无偿赠予行为，平台及作者不会要求用户必须订阅或打赏后才能使用这些内容
• 禁止直接出售本资源或通过本资源直接盈利
• 禁止未经授权的二次分发
• 禁止将本资源用于推广与Minecraft无关的产品、服务或品牌

【知识产权声明】

本资源中所有原创内容的知识产权归作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">原创协议</Badge>
                                      <span className="text-[10px] text-muted-foreground">常规资源</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">适用于非形象类资源</div>
                                  </div>

                                  <div 
                                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                      selectedLicenseTemplate === "repost-normal" ? "border-orange-500 bg-orange-500/10" : "border-border hover:bg-secondary/20"
                                    }`}
                                    onClick={() => {
                                      setSelectedLicenseTemplate("repost-normal");
                                      setNewLicenseContent(`【免责声明】

本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。

【基本声明】

本资源内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。

根据Minecraft官方政策，本资源属于辅助工具或知识文档，必须免费提供给所有用户。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素。

本资源内容免费无偿供所有用户使用。用户在遵守相关使用条款的前提下，可自由下载、使用和分享该资源内容，无需支付任何费用。

【作者声明】

本人作为本资源的原创作者，承诺所发布的内容均为原创制作，不涉及任何侵权行为。本人保留对本资源的著作权，并授权用户在遵守本协议的前提下使用本资源。

用户在使用本资源时，应遵守以下约定：
• 允许个人非商业用途使用
• 允许在游戏中展示和使用
• 允许制作视频、直播等Minecraft相关内容并通过平台广告、赞助、捐赠等方式获得收益
• 允许接受用户自愿捐赠
• 用户对制作方及作品的订阅及打赏行为均为自主无偿赠予行为，平台及作者不会要求用户必须订阅或打赏后才能使用这些内容
• 禁止直接出售本资源或通过本资源直接盈利
• 禁止未经授权的二次分发
• 禁止将本资源用于推广与Minecraft无关的产品、服务或品牌

【搬运声明】

本资源已获得原制作方的明确授权，允许搬运至本平台并交由搬运方进行管理。

搬运方承诺遵守原制作方的所有使用要求，并确保资源的完整性和合规性。搬运方应及时同步原资源的更新，保持资源内容的最新状态。

搬运方与原作者之间的约定：
• 搬运方需在资源页面明确标注原作者信息
• 搬运方需及时同步原作者的更新内容
• 搬运方不得擅自修改资源内容
• 如原作者要求下架，搬运方应立即配合

【知识产权声明】

本资源中所有原创内容的知识产权归原作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-[10px]">搬运协议</Badge>
                                      <span className="text-[10px] text-muted-foreground">常规资源</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">适用于非形象类资源</div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {selectedLicenseTemplate && (
                            <div>
                              <label className="text-xs text-muted-foreground mb-2 block">协议内容（可编辑）</label>
                              <textarea
                                value={newLicenseContent}
                                onChange={(e) => setNewLicenseContent(e.target.value)}
                                className="w-full h-80 px-3 py-2 text-xs bg-secondary/30 border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="编辑协议内容..."
                              />
                            </div>
                          )}
                        </div>

                        <Separator className="my-4" />

                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-8" onClick={() => setShowLicenseSubmitModal(false)}>
                            取消
                          </Button>
                          <Button size="sm" className="h-8" disabled={!selectedLicenseTemplate}>
                            提交
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {renderCommentSection()}
              </TabsContent>

              <TabsContent value="changelog" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">日志</h2>
                  
                  <div className="space-y-3">
                    {mockChangeLogs
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
                              
                              <h3 className="text-sm font-medium text-foreground mb-1">
                                {log.description}
                              </h3>
                              
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

                {renderCommentSection()}
              </TabsContent>
            </div>

            <div className="w-64 flex-shrink-0 space-y-4 hidden lg:block">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="w-16 h-16 bg-secondary rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{resource.title?.split(" ")[0]}</h4>
                  <p className="text-xs text-muted-foreground">by {resource.author}</p>
                </div>
                <Separator className="my-3" />
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">制作方</span>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-[10px]">{resource.author?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-foreground text-xs">{resource.author}</div>
                      <div className="text-[10px] text-muted-foreground">{resource.authorType}</div>
                    </div>
                  </div>
                </div>
              </div>

              {resource.donationLeaders?.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-primary mb-3">☆ 打赏总榜</h4>
                  <div className="flex justify-center gap-4">
                    {resource.donationLeaders.map((d: any, i: number) => (
                      <div key={i} className="text-center">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-lg mb-1">
                          {d.avatar}
                        </div>
                        <div className="text-[10px] text-foreground truncate max-w-[60px]">{d.name}</div>
                        <div className="text-[10px] text-muted-foreground">{d.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resource.donationFeed?.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-primary mb-3">💬 打赏动态</h4>
                  <div className="space-y-2">
                    {resource.donationFeed.map((d: any, i: number) => (
                      <div key={i} className="text-[11px] text-muted-foreground">
                        <span className="text-primary">● </span>
                        {d.user}于{d.date}打赏了资源{d.amount}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-card border border-border rounded-lg p-4">
                <Button size="sm" className="w-full text-xs" variant="outline">
                  <Heart className="w-3.5 h-3.5 mr-1" /> 打赏支持
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </div>

      {renderEditModal()}
      {renderGalleryUploadModal()}
      {renderAcquisitionEditModal()}
      {renderImageUploadModal()}
    </div>
  );
};

export default OtherResourceDetail;
