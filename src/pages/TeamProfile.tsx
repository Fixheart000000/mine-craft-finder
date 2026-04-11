import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Users, Calendar, MapPin, Link2, Eye, Heart, BookmarkPlus, Upload, MessageSquare, FolderKanban, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResourceCard from "@/components/ResourceCard";
import ModIcon from "@/components/icons/ModIcon";
import ModpackIcon from "@/components/icons/ModpackIcon";
import MapIcon from "@/components/icons/MapIcon";

const mockTeamData = {
  id: "1",
  name: "FabricMC",
  avatar: "",
  title: "Fabric生态开发团队",
  description: "Fabric生态的核心开发团队，致力于为 Minecraft 社区提供开放、轻量的模组加载平台。我们相信开源的力量。",
  location: "全球协作",
  website: "https://fabricmc.net",
  foundationDate: "2018-12-10",
  followers: 89500,
  views: 2500000,
  works: 45,
  status: "活跃中",
  memberCount: 45,
  categories: ["核心开发", "模组工具", "文档维护"],
  members: [
    { name: "asiekierka", role: "项目负责人", avatar: "", joinDate: "2018-12-10" },
    { name: "modmuss50", role: "核心开发者", avatar: "", joinDate: "2018-12-15" },
    { name: "sfPlayer1", role: "核心开发者", avatar: "", joinDate: "2019-01-05" },
    { name: "Juuz", role: "文档维护", avatar: "", joinDate: "2019-03-20" },
    { name: "i509VCB", role: "API维护", avatar: "", joinDate: "2019-06-10" },
    { name: "CheaterCodes", role: "社区运营", avatar: "", joinDate: "2020-01-15" },
  ],
  resources: [
    { icon: <ModIcon className="w-10 h-10" />, title: "Fabric Loader", author: "FabricMC", description: "Fabric 模组加载器核心，提供模组加载和运行的基础框架。", downloads: 15000000, likes: 89000, resourceType: "mod", resourceId: "fabric-loader" },
    { icon: <ModIcon className="w-10 h-10" />, title: "Fabric API", author: "FabricMC", description: "Fabric 的基础 API 库，为模组提供各种钩子和工具。", downloads: 12000000, likes: 75000, resourceType: "mod", resourceId: "fabric-api" },
    { icon: <ModpackIcon className="w-10 h-10" />, title: "Fabric 测试整合包", author: "FabricMC", description: "用于测试 Fabric 生态系统的整合包。", downloads: 250000, likes: 3200, resourceType: "modpack", resourceId: "fabric-test" },
    { icon: <MapIcon className="w-10 h-10" />, title: "API 测试地图", author: "FabricMC", description: "用于 API 功能测试的专用地图。", downloads: 45000, likes: 890, resourceType: "map", resourceId: "api-test-map" },
  ],
  projects: [
    { name: "Fabric Loader 0.16", description: "下一代模组加载器架构", status: "开发中", members: 8 },
    { name: "Quilt 兼容层", description: "与 Quilt 生态的双向兼容支持", status: "筹备中", members: 4 },
    { name: "文档本地化计划", description: "官方文档多语言支持", status: "进行中", members: 12 },
  ],
};

const TeamProfile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("intro");
  const team = mockTeamData;

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
              <Heart className="w-3.5 h-3.5" /> {team.followers.toLocaleString()}
            </span>
            <Button size="sm" className="text-xs h-7">
              <MessageSquare className="w-3.5 h-3.5 mr-1" /> 联系
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
                { id: "intro", label: "团队介绍" },
                { id: "members", label: "团队成员" },
                { id: "resources", label: "发布资源" },
                { id: "projects", label: "进行项目" },
                { id: "activity", label: "团队动态" },
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
                        <Calendar className="w-4 h-4" /> 成立于 {team.foundationDate}
                      </span>
                      <a href={team.website} className="flex items-center gap-1 text-primary hover:underline">
                        <Link2 className="w-4 h-4" /> 官方网站
                      </a>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{team.followers.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">关注者</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{team.memberCount}</div>
                        <div className="text-xs text-muted-foreground">团队成员</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{team.works}</div>
                        <div className="text-xs text-muted-foreground">作品数</div>
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
                    <UserPlus className="w-3 h-3 mr-1" /> 邀请成员
                  </Button>
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
                            <CardDescription className="text-[10px]">{member.role}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-[10px] text-muted-foreground">
                          加入于 {member.joinDate}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">发布的资源 ({team.resources.length})</h2>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <Upload className="w-3 h-3 mr-1" /> 发布新资源
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.resources.map((resource, index) => (
                    <ResourceCard key={index} {...resource} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-0">
                <h2 className="text-xl font-bold text-foreground mb-4">进行中的项目</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.projects.map((project, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{project.name}</CardTitle>
                          <Badge variant={project.status === "开发中" ? "default" : project.status === "进行中" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
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
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <h2 className="text-xl font-bold text-foreground mb-4">团队动态</h2>
                <div className="space-y-4">
                  {[
                    { time: "3小时前", action: "发布了新版本", target: "Fabric Loader 0.15.11" },
                    { time: "1天前", action: "更新了项目状态", target: "文档本地化计划" },
                    { time: "2天前", action: "发布了公告", target: "1.21 版本支持计划" },
                    { time: "5天前", action: "新增了团队成员", target: "CheaterCodes 加入团队" },
                    { time: "1周前", action: "更新了 API", target: "Fabric API 0.92.0 发布" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FolderKanban className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{team.name}</span> {activity.action}：
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

export default TeamProfile;
