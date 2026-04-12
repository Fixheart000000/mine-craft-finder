import { useState } from "react";
import { useRouter, useParams } from "@tanstack/react-router";
import { ArrowLeft, User, Calendar, MapPin, Link2, Eye, Heart, BookmarkPlus, Upload, MessageSquare, FolderKanban, Users, Crown, Handshake, Rss, Check, X, CreditCard, Clock, Zap, Diamond, Star, AlertCircle } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { Label } from "#/components/ui/label";
import { Separator } from "#/components/ui/separator";
import ResourceCard from "#/components/ResourceCard";
import ModIcon from "#/components/icons/ModIcon";
import MapIcon from "#/components/icons/MapIcon";
import DataPackIcon from "#/components/icons/DataPackIcon";
import ResourcePackIcon from "#/components/icons/ResourcePackIcon";
import ShaderIcon from "#/components/icons/ShaderIcon";
import BuildingIcon from "#/components/icons/BuildingIcon";

const userTemplates: Record<string, any> = {
  "1": {
    id: "1",
    name: "茜特菈莉",
    avatar: "",
    title: "独立模组开发者",
    bio: "专注于 Minecraft 模组开发，热爱创造独特的游戏体验。Jade系列作者，致力于提升玩家的游戏体验。",
    location: "中国 · 上海",
    website: "https://example.com",
    joinDate: "2020-03-15",
    followers: 12500,
    following: 89,
    views: 456000,
    works: 28,
    status: "活跃中",
    userType: "creator",
    socialIntent: "meetCreator",
    skills: ["Java", "Kotlin", "OpenGL", "模型设计"],
    socialLinks: {
      github: "https://github.com",
      discord: "https://discord.com",
      bilibili: "https://bilibili.com",
    },
    resources: [
      { icon: <ModIcon className="w-10 h-10" />, title: "Jade - 物品信息显示", author: "茜特菈莉", description: "一款轻量级的物品信息显示模组，支持显示物品耐久、附魔等详细信息。", downloads: 560000, likes: 32000, resourceType: "mod", resourceId: "jade-1" },
      { icon: <ModIcon className="w-10 h-10" />, title: "AppleSkin - 饱食度显示", author: "茜特菈莉", description: "显示食物的饱食度和饱和度恢复值，帮助玩家合理规划饮食。", downloads: 420000, likes: 25000, resourceType: "mod", resourceId: "appleskin-1" },
    ],
    projects: [
      { name: "Jade 2.0 重构计划", description: "Jade模组的全面重构，提升性能和扩展性", status: "开发中", members: 5 },
    ],
    teams: [
      { name: "创世工匠", role: "核心开发者", joined: "2021-06-01" },
    ],
    subscribers: 8500,
  },
  "2": {
    id: "2",
    name: "PixelArtist",
    avatar: "",
    title: "职业皮肤和材质创作者",
    bio: "专注于高质量皮肤和材质创作，曾为多个大型服务器定制专属美术资源。热爱像素艺术，追求极致细节。",
    location: "中国 · 北京",
    website: "https://pixelart.studio",
    joinDate: "2019-08-20",
    followers: 28900,
    following: 156,
    views: 1200000,
    works: 156,
    status: "活跃中",
    userType: "creator",
    socialIntent: "meetFriend",
    skills: ["像素绘画", "Photoshop", "Blender", "材质设计"],
    socialLinks: {
      artstation: "https://artstation.com",
      twitter: "https://twitter.com",
    },
    resources: [
      { icon: <ResourcePackIcon className="w-10 h-10" />, title: "幻想国度材质包 64x", author: "PixelArtist", description: "一款融合奇幻风格的高清材质包，细节丰富，色彩绚丽。", downloads: 350000, likes: 28000, resourceType: "resourcepack", resourceId: "fantasy-1" },
      { icon: <ResourcePackIcon className="w-10 h-10" />, title: "现代简约材质包 32x", author: "PixelArtist", description: "简洁现代的风格，适合建筑展示和视频录制。", downloads: 180000, likes: 12500, resourceType: "resourcepack", resourceId: "modern-1" },
    ],
    projects: [
      { name: "4K 超高清材质计划", description: "制作4K分辨率的MC材质包", status: "筹备中", members: 3 },
    ],
    teams: [],
    subscribers: 18200,
  },
  "3": {
    id: "3",
    name: "矿业大亨",
    avatar: "",
    title: "专注服务器插件开发",
    bio: "拥有10年服务器开发经验，开发过多个热门服务器插件，服务过上百万玩家。",
    location: "中国 · 深圳",
    website: "https://mineplugin.dev",
    joinDate: "2018-01-10",
    followers: 45600,
    following: 42,
    views: 2800000,
    works: 89,
    status: "活跃中",
    userType: "producer",
    socialIntent: "meetInvestor",
    skills: ["Java", "Spigot/Paper", "数据库", "高并发", "反作弊"],
    socialLinks: {
      spigot: "https://spigotmc.org",
    },
    resources: [
      { icon: <ModIcon className="w-10 h-10" />, title: "AdvancedAntiCheat", author: "矿业大亨", description: "专业级反作弊插件，支持多种检测机制。", downloads: 890000, likes: 45000, resourceType: "mod", resourceId: "aac-1" },
    ],
    projects: [
      { name: "云服管理系统", description: "一站式服务器运维管理平台", status: "开发中", members: 8 },
    ],
    teams: [
      { name: "MineDev Team", role: "创始人", joined: "2018-03-15" },
    ],
    subscribers: 0,
  },
  "4": {
    id: "4",
    name: "风投小明",
    avatar: "",
    title: "游戏行业天使投资人",
    bio: "专注游戏领域的天使投资人，已投资多个成功的游戏工作室和独立开发团队。看好MC生态的发展潜力。",
    location: "中国 · 杭州",
    website: "https://vcgames.com",
    joinDate: "2021-06-01",
    followers: 8900,
    following: 230,
    views: 560000,
    works: 0,
    status: "活跃中",
    userType: "investor",
    socialIntent: "meetProducer",
    skills: ["项目评估", "商业谈判", "战略规划", "资源对接"],
    socialLinks: {
      linkedin: "https://linkedin.com",
    },
    resources: [],
    projects: [
      { name: "MC 生态投资基金", description: "专项投资MC相关创业项目", status: "进行中", members: 5 },
    ],
    teams: [
      { name: "游戏创投联盟", role: "合伙人", joined: "2021-08-15" },
    ],
    subscribers: 0,
  },
  "5": {
    id: "5",
    name: "普通玩家001",
    avatar: "",
    title: "热爱MC的休闲玩家一枚",
    bio: "从1.6.4版本开始玩MC，经历了无数个日夜。喜欢生存和建筑，偶尔也玩模组。虽然不是什么大佬，但对MC的热爱是真的！",
    location: "中国 · 成都",
    website: "",
    joinDate: "2022-09-15",
    followers: 128,
    following: 45,
    views: 3500,
    works: 2,
    status: "在线",
    userType: "normal",
    socialIntent: "none",
    skills: ["生存模式", "基础建筑"],
    socialLinks: {},
    resources: [
      { icon: <MapIcon className="w-10 h-10" />, title: "我的小窝生存地图", author: "普通玩家001", description: "一个普通的生存地图，记录了我一年的生存成果。", downloads: 560, likes: 32, resourceType: "map", resourceId: "myhome-1" },
    ],
    projects: [],
    teams: [],
    subscribers: 0,
  },
  "6": {
    id: "6",
    name: "建筑大师",
    avatar: "",
    title: "专业MC建筑设计",
    bio: "国家一级注册建造师转行做MC建筑，擅长中世纪、东方、现代等多种建筑风格。提供专业的建筑教学和定制服务。",
    location: "中国 · 广州",
    website: "https://mcbuilder.pro",
    joinDate: "2019-03-25",
    followers: 52000,
    following: 88,
    views: 3200000,
    works: 234,
    status: "直播中",
    userType: "creator",
    socialIntent: "meetFriend",
    skills: ["建筑设计", "WorldEdit", "Litematica", "教学"],
    socialLinks: {
      bilibili: "https://bilibili.com",
      youtube: "https://youtube.com",
    },
    resources: [
      { icon: <BuildingIcon className="w-10 h-10" />, title: "东方古建筑合集", author: "建筑大师", description: "包含50+种中国传统建筑的schematics文件。", downloads: 280000, likes: 35000, resourceType: "building", resourceId: "chinese-1" },
      { icon: <BuildingIcon className="w-10 h-10" />, title: "欧洲中世纪城镇包", author: "建筑大师", description: "完整的中世纪城镇建筑合集。", downloads: 190000, likes: 22000, resourceType: "building", resourceId: "medieval-1" },
    ],
    projects: [
      { name: "1:1 故宫还原计划", description: "在MC中1:1还原北京故宫", status: "制作中", members: 15 },
    ],
    teams: [
      { name: "国建 Team", role: "队长", joined: "2019-06-01" },
    ],
    subscribers: 35600,
  },
};

const userTypeLabels: Record<string, string> = {
  normal: "普通用户",
  creator: "创作者",
  producer: "生产者",
  investor: "投资者",
};

const socialIntentLabels: Record<string, string> = {
  none: "不交友",
  meetCreator: "认识创作者",
  meetProducer: "认识生产者",
  meetInvestor: "认识投资者",
  meetFriend: "认识好朋友",
};

const subscriptionPlans = [
  {
    id: "monthly",
    name: "月度会员",
    price: 19,
    originalPrice: 29,
    period: "月",
    icon: <Zap className="w-5 h-5" />,
    features: ["专属粉丝徽章", "观看专属创作内容", "提前获取资源更新", "Discord专属频道"],
    popular: false,
    discount: null,
  },
  {
    id: "quarterly",
    name: "季度会员",
    price: 49,
    originalPrice: 87,
    period: "季度",
    icon: <Star className="w-5 h-5" />,
    features: ["包含月度会员全部权益", "每月额外获得50积分", "资源下载9折优惠", "专属粉丝群"],
    popular: true,
    discount: "立省38",
  },
  {
    id: "yearly",
    name: "年度会员",
    price: 159,
    originalPrice: 348,
    period: "年",
    icon: <Diamond className="w-5 h-5" />,
    features: ["包含季度会员全部权益", "每月额外获得200积分", "资源下载8折优惠", "定制粉丝牌", "优先技术支持"],
    popular: false,
    discount: "立省189",
  },
];

const paymentMethods = [
  {
    id: "wechat",
    name: "微信支付",
    icon: "💬",
    description: "推荐使用，安全快捷",
  },
  {
    id: "alipay",
    name: "支付宝",
    icon: "💰",
    description: "支付宝快捷支付",
  },
  {
    id: "balance",
    name: "余额支付",
    icon: "💳",
    description: "当前余额: ¥128.50",
  },
];

const UserProfile = () => {
  const router = useRouter();
  const { id } = useParams({ from: "/user/$id" });
  const [activeTab, setActiveTab] = useState("intro");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("quarterly");
  const [selectedPayment, setSelectedPayment] = useState("wechat");
  const [paymentStep, setPaymentStep] = useState<"plan" | "payment" | "processing" | "success">("plan");
  
  const user = userTemplates[id] || userTemplates["1"];

  const getUserTypeBadge = () => {
    if (user.userType === "creator") {
      return <Badge className="text-[10px] h-5 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20">✓ 创作者认证</Badge>;
    } else if (user.userType === "producer") {
      return <Badge className="text-[10px] h-5 bg-green-500/10 text-green-600 hover:bg-green-500/20">✓ 生产者认证</Badge>;
    } else if (user.userType === "investor") {
      return <Badge className="text-[10px] h-5 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">✓ 投资者认证</Badge>;
    }
    return null;
  };

  const getSocialIntentBadge = () => {
    if (!user.socialIntent || user.socialIntent === "none") return null;
    return (
      <Badge variant="outline" className="text-[10px] h-5">
        <Handshake className="w-3 h-3 mr-1" />
        {socialIntentLabels[user.socialIntent]}
      </Badge>
    );
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
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm font-semibold text-foreground truncate">{user.name}</h1>
                {getUserTypeBadge()}
                {getSocialIntentBadge()}
              </div>
              <p className="text-xs text-muted-foreground truncate">{user.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs text-green-500">
              <User className="w-3.5 h-3.5" /> {user.status}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3.5 h-3.5" /> {user.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3.5 h-3.5" /> {user.followers.toLocaleString()}
            </span>
            {user.userType === "creator" && user.subscribers > 0 && (
              <>
                <Button 
                  size="sm" 
                  className={`text-xs h-7 ${isSubscribed ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                  onClick={() => !isSubscribed && setShowSubscribeModal(true)}
                >
                  <Rss className="w-3.5 h-3.5 mr-1" /> 
                  {isSubscribed ? '已订阅' : '订阅'}
                  {!isSubscribed && user.subscribers > 0 && (
                    <span className="ml-1 opacity-70">({user.subscribers.toLocaleString()})</span>
                  )}
                </Button>

                <Dialog open={showSubscribeModal} onOpenChange={setShowSubscribeModal}>
                  <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                    {paymentStep === "plan" && (
                      <>
                        <DialogHeader className="p-6 pb-4">
                          <DialogTitle className="text-xl flex items-center gap-2">
                            <Rss className="w-5 h-5 text-amber-500" />
                            订阅 {user.name} 的创作者频道
                          </DialogTitle>
                          <DialogDescription>
                            订阅后即可解锁专属内容和权益，与创作者近距离互动
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="px-6 pb-4">
                          <div className="grid grid-cols-3 gap-3">
                            {subscriptionPlans.map((plan) => (
                              <div
                                key={plan.id}
                                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                                  selectedPlan === plan.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                                onClick={() => setSelectedPlan(plan.id)}
                              >
                                {plan.popular && (
                                  <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px]">
                                    推荐
                                  </Badge>
                                )}
                                {plan.discount && (
                                  <Badge className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px]">
                                    {plan.discount}
                                  </Badge>
                                )}
                                <div className="flex flex-col items-center text-center">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                    plan.id === "monthly" ? "bg-blue-500/10 text-blue-500" :
                                    plan.id === "quarterly" ? "bg-amber-500/10 text-amber-500" :
                                    "bg-purple-500/10 text-purple-500"
                                  }`}>
                                    {plan.icon}
                                  </div>
                                  <h3 className="font-semibold text-sm mb-1">{plan.name}</h3>
                                  <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-2xl font-bold text-foreground">¥{plan.price}</span>
                                    <span className="text-xs text-muted-foreground">/{plan.period}</span>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground line-through">
                                    原价 ¥{plan.originalPrice}
                                  </span>
                                </div>
                                {selectedPlan === plan.id && (
                                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              包含权益
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {subscriptionPlans.find(p => p.id === selectedPlan)?.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <DialogFooter className="p-6 pt-0">
                          <Button variant="outline" onClick={() => setShowSubscribeModal(false)}>
                            取消
                          </Button>
                          <Button onClick={() => setPaymentStep("payment")}>
                            继续支付
                          </Button>
                        </DialogFooter>
                      </>
                    )}

                    {paymentStep === "payment" && (
                      <>
                        <DialogHeader className="p-6 pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setPaymentStep("plan")}
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <DialogTitle className="text-lg">选择支付方式</DialogTitle>
                          </div>
                          <DialogDescription>
                            订单金额：
                            <span className="text-primary font-semibold">
                              ¥{subscriptionPlans.find(p => p.id === selectedPlan)?.price}
                            </span>
                          </DialogDescription>
                        </DialogHeader>

                        <div className="px-6 pb-4">
                          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                            <div className="space-y-2">
                              {paymentMethods.map((method) => (
                                <div
                                  key={method.id}
                                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    selectedPayment === method.id
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                  onClick={() => setSelectedPayment(method.id)}
                                >
                                  <RadioGroupItem value={method.id} id={method.id} />
                                  <span className="text-2xl">{method.icon}</span>
                                  <div className="flex-1">
                                    <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                      {method.name}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                  </div>
                                  {selectedPayment === method.id && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </RadioGroup>

                          <div className="mt-4 p-3 bg-amber-500/10 rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">
                              支付后即表示同意《创作者订阅服务协议》，订阅权益在订阅周期内有效，自动续费可随时取消。
                            </p>
                          </div>
                        </div>

                        <DialogFooter className="p-6 pt-0">
                          <Button
                            className="w-full"
                            onClick={() => {
                              setPaymentStep("processing");
                              setTimeout(() => {
                                setPaymentStep("success");
                              }, 2000);
                            }}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            确认支付 ¥{subscriptionPlans.find(p => p.id === selectedPlan)?.price}
                          </Button>
                        </DialogFooter>
                      </>
                    )}

                    {paymentStep === "processing" && (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                          <Clock className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">支付处理中</h3>
                        <p className="text-sm text-muted-foreground">
                          正在确认支付结果，请稍候...
                        </p>
                      </div>
                    )}

                    {paymentStep === "success" && (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">订阅成功！🎉</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          您已成功订阅 {user.name} 的创作者频道
                        </p>
                        <div className="p-4 bg-muted/30 rounded-lg mb-6">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">订阅套餐</span>
                            <span className="font-medium">
                              {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">到期时间</span>
                            <span className="font-medium">
                              {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setIsSubscribed(true);
                            setShowSubscribeModal(false);
                            setPaymentStep("plan");
                          }}
                        >
                          开始探索专属内容
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </>
            )}
            <Button size="sm" className="text-xs h-7">
              <MessageSquare className="w-3.5 h-3.5 mr-1" /> 私信
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-7">
              <BookmarkPlus className="w-3.5 h-3.5 mr-1" /> 关注
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-border bg-card">
            <TabsList className="h-auto p-0 bg-transparent rounded-none">
              {[
                { id: "intro", label: "个人简介" },
                { id: "resources", label: "发布资源" },
                { id: "projects", label: "参与项目" },
                { id: "teams", label: "所属团队" },
                { id: "activity", label: "动态" },
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
                      <User className="w-12 h-12 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                      {user.name}
                      {user.userType === "creator" && <Crown className="w-5 h-5 text-purple-500" />}
                      {user.userType === "producer" && <Crown className="w-5 h-5 text-green-500" />}
                      {user.userType === "investor" && <Crown className="w-5 h-5 text-amber-500" />}
                    </h2>
                    <p className="text-muted-foreground mb-3">{user.title}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {user.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> 加入于 {user.joinDate}
                      </span>
                      {user.website && (
                        <a href={user.website} className="flex items-center gap-1 text-primary hover:underline">
                          <Link2 className="w-4 h-4" /> 个人网站
                        </a>
                      )}
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{user.followers.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">关注者</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{user.following}</div>
                        <div className="text-xs text-muted-foreground">正在关注</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{user.works}</div>
                        <div className="text-xs text-muted-foreground">作品数</div>
                      </div>
                      {user.userType === "creator" && user.subscribers > 0 && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-amber-500">{user.subscribers.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">订阅数</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <section className="mb-6">
                  <h3 className="text-sm font-semibold text-primary mb-2">个人简介</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
                </section>

                {user.skills.length > 0 && (
                  <section className="mb-6">
                    <h3 className="text-sm font-semibold text-primary mb-2">技能标签</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="resources" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">发布的资源 ({user.resources.length})</h2>
                  {user.userType !== "normal" && (
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Upload className="w-3 h-3 mr-1" /> 上传新资源
                    </Button>
                  )}
                </div>
                {user.resources.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.resources.map((resource: any, index: number) => (
                      <ResourceCard key={index} {...resource} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    该用户暂未发布任何资源
                  </div>
                )}
              </TabsContent>

              <TabsContent value="projects" className="mt-0">
                <h2 className="text-xl font-bold text-foreground mb-4">参与的项目</h2>
                {user.projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.projects.map((project: any, index: number) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{project.name}</CardTitle>
                            <Badge variant={project.status === "开发中" || project.status === "制作中" || project.status === "进行中" ? "default" : "secondary"}>{project.status}</Badge>
                          </div>
                          <CardDescription className="text-xs">{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" /> {project.members} 成员参与
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    该用户暂未参与任何项目
                  </div>
                )}
              </TabsContent>

              <TabsContent value="teams" className="mt-0">
                <h2 className="text-xl font-bold text-foreground mb-4">所属团队</h2>
                {user.teams.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.teams.map((team: any, index: number) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary/10">
                                <Users className="w-5 h-5 text-primary" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{team.name}</CardTitle>
                              <CardDescription className="text-xs">{team.role} · 加入于 {team.joined}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    该用户暂未加入任何团队
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <h2 className="text-xl font-bold text-foreground mb-4">最近动态</h2>
                <div className="space-y-4">
                  {[
                    { time: "2小时前", action: "发布了新版本", target: "Jade - 物品信息显示 1.8.0" },
                    { time: "1天前", action: "更新了项目状态", target: "通用物品渲染库" },
                    { time: "3天前", action: "回复了反馈", target: "AppleSkin - 饱食度显示" },
                    { time: "1周前", action: "加入了团队", target: "创世工匠" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FolderKanban className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{user.name}</span> {activity.action}：
                          <span className="text-primary ml-1">{activity.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                      </div>
                    </div>
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

export default UserProfile;
