import { useState } from "react";
import { useRouter, useParams } from "@tanstack/react-router";
import { ArrowLeft, Download, Heart, Send, User, Eye, BookmarkPlus, Upload, Edit, Calendar, FileText, Clock, X, Save, Plus, ChevronDown, ChevronRight, Image, Edit2, XCircle, History, Trash2, Link2, Star, StarOff, CheckCircle } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Textarea } from "#/components/ui/textarea";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Separator } from "#/components/ui/separator";
import { Badge } from "#/components/ui/badge";
import { Input } from "#/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { tagSystemMap, contentCommonMeta, auxiliaryCommonMeta, modpackServerCommonMeta, ecoDocCommonMeta, imageCommonMeta, mapCommonMeta } from "#/data/tags";
import type { MainTag } from "#/data/tags";

interface WikiEntryImage {
  url: string;
  caption: string;
  isCover?: boolean;
}

interface WikiEntryRecipe {
  type: string;
  pattern?: string[][];
  ingredients?: Record<string, string>;
  result?: { item: string; count: number };
}

interface WikiEntryHistory {
  version: number;
  author: string;
  updatedAt: Date;
  changes: string;
  snapshot: any;
}

interface WikiEntry {
  id: string;
  name: string;
  category: string;
  type: string;
  images: WikiEntryImage[];
  description: string;
  recipes: WikiEntryRecipe[];
  attributes: { name: string; value: string; unit?: string }[];
  usage: string;
  relatedEntries: string[];
  author: string;
  updatedAt: Date;
  version: number;
  history: WikiEntryHistory[];
}

const mockWikiEntries: Record<string, WikiEntry> = {};

const allHotWordCategories = [
  { id: "items-blocks", label: "物品/方块", description: "游戏中的物品和方块", items: [] },
  { id: "biomes", label: "群系/群落", description: "世界生成的生物群系", items: [] },
  { id: "dimensions", label: "世界/维度", description: "不同的世界维度", items: [] },
  { id: "mobs", label: "生物/实体", description: "生物和实体", items: [] },
  { id: "enchantments", label: "附魔/魔咒", description: "附魔和魔咒", items: [] },
  { id: "buffs", label: "BUFF/DEBUFF", description: "状态效果", items: [] },
  { id: "multiblock", label: "多方块结构", description: "多方块结构机器", items: [] },
  { id: "natural", label: "自然生成", description: "自然生成的内容", items: [] },
  { id: "hotkeys", label: "热键", description: "快捷键和按键绑定", items: [] },
  { id: "settings", label: "游戏设定", description: "游戏配置和规则", items: [] },
  { id: "skills", label: "技能/能力", description: "技能和能力系统", items: [] },
];

const WikiEntryPanel = ({ 
  entry, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel,
  onRelatedClick 
}: { 
  entry: WikiEntry; 
  isEditing: boolean; 
  onEdit: () => void; 
  onSave: (entry: WikiEntry) => void; 
  onCancel: () => void;
  onRelatedClick: (item: string) => void;
}) => {
  const [editData, setEditData] = useState<WikiEntry>(entry);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newImageCaption, setNewImageCaption] = useState("");
  const [changeDescription, setChangeDescription] = useState("");

  const handleAddAttribute = () => {
    if (newAttrName.trim() && newAttrValue.trim()) {
      setEditData(prev => ({
        ...prev,
        attributes: [...prev.attributes, { name: newAttrName.trim(), value: newAttrValue.trim() }]
      }));
      setNewAttrName("");
      setNewAttrValue("");
    }
  };

  const handleRemoveAttribute = (index: number) => {
    setEditData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          url: reader.result as string,
          caption: newImageCaption || file.name,
          isCover: editData.images.length === 0,
        };
        setEditData(prev => ({
          ...prev,
          images: [...prev.images, newImage]
        }));
        setNewImageCaption("");
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setEditData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index).map((img, i) => ({
        ...img,
        isCover: i === 0
      }))
    }));
  };

  const handleSetCover = (index: number) => {
    setEditData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isCover: i === index
      }))
    }));
  };

  const handleSaveWithHistory = () => {
    const newVersion = (entry.version || 1) + 1;
    const historyEntry = {
      version: entry.version || 1,
      author: entry.author,
      updatedAt: entry.updatedAt,
      changes: changeDescription || "更新内容",
      snapshot: {
        description: entry.description,
        usage: entry.usage,
        attributes: entry.attributes,
        relatedEntries: entry.relatedEntries,
      }
    };
    
    const updatedEntry: WikiEntry = {
      ...editData,
      version: newVersion,
      updatedAt: new Date(),
      history: [historyEntry, ...(entry.history || [])],
    };
    
    onSave(updatedEntry);
    setChangeDescription("");
  };

  const handleRestoreVersion = (historyEntry: WikiEntry['history'][0]) => {
    setEditData(prev => ({
      ...prev,
      ...historyEntry.snapshot,
      version: entry.version,
    }));
    setShowHistory(false);
  };

  return (
    <div className="border border-border rounded-lg bg-card h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">{entry.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">{entry.category}</Badge>
            <Badge variant="secondary" className="text-xs">{entry.type}</Badge>
            <Badge variant="outline" className="text-xs">v{entry.version}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={onCancel}>
                <XCircle className="w-4 h-4 mr-1" /> 取消
              </Button>
              <Button size="sm" onClick={handleSaveWithHistory}>
                <Save className="w-4 h-4 mr-1" /> 保存
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={() => setShowHistory(!showHistory)}>
                <History className="w-4 h-4 mr-1" /> 历史
              </Button>
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit2 className="w-4 h-4 mr-1" /> 编辑
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowImageUpload(!showImageUpload)}>
                <Image className="w-4 h-4 mr-1" /> 图片
              </Button>
            </>
          )}
        </div>
      </div>

      {showHistory && !isEditing && entry.history && entry.history.length > 0 && (
        <div className="border-b border-border p-4 bg-secondary/20">
          <h3 className="text-sm font-semibold text-primary mb-3">版本历史</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {entry.history.map((h, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-card rounded border border-border">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">v{h.version}</Badge>
                    <span className="text-xs text-muted-foreground">{h.author}</span>
                    <span className="text-xs text-muted-foreground">{h.updatedAt.toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-foreground mt-1">{h.changes}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs"
                  onClick={() => handleRestoreVersion(h)}
                >
                  恢复
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showImageUpload && !isEditing && (
        <div className="border-b border-border p-4 bg-secondary/20">
          <h3 className="text-sm font-semibold text-primary mb-3">添加图片</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">图片说明</label>
              <Input
                value={newImageCaption}
                onChange={(e) => setNewImageCaption(e.target.value)}
                className="text-sm"
                placeholder="输入图片说明..."
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">选择图片</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-muted-foreground">支持 JPG、PNG、GIF 格式</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">图片管理</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {editData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                      {img.url.startsWith("data:") ? (
                        <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                      ) : (
                        <Image className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-6 w-6 p-0"
                        onClick={() => handleSetCover(index)}
                        disabled={img.isCover}
                      >
                        {img.isCover ? <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> : <StarOff className="w-3 h-3" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="h-6 w-6 p-0"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    {img.isCover && (
                      <div className="absolute top-0.5 left-0.5">
                        <Badge variant="default" className="text-[10px] h-4">封面</Badge>
                      </div>
                    )}
                  </div>
                ))}
                <label className="aspect-square border border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground mt-1">上传</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">描述</label>
              <Textarea
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                className="text-sm min-h-[100px]"
                placeholder="输入词条描述..."
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">使用方法</label>
              <Textarea
                value={editData.usage}
                onChange={(e) => setEditData(prev => ({ ...prev, usage: e.target.value }))}
                className="text-sm min-h-[80px]"
                placeholder="输入使用方法..."
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">属性数据</label>
              <div className="space-y-2">
                {editData.attributes.map((attr, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={attr.name}
                      onChange={(e) => {
                        const newAttrs = [...editData.attributes];
                        newAttrs[index] = { ...newAttrs[index], name: e.target.value };
                        setEditData(prev => ({ ...prev, attributes: newAttrs }));
                      }}
                      className="text-sm flex-1"
                      placeholder="属性名称"
                    />
                    <Input
                      value={attr.value}
                      onChange={(e) => {
                        const newAttrs = [...editData.attributes];
                        newAttrs[index] = { ...newAttrs[index], value: e.target.value };
                        setEditData(prev => ({ ...prev, attributes: newAttrs }));
                      }}
                      className="text-sm flex-1"
                      placeholder="属性值"
                    />
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveAttribute(index)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newAttrName}
                    onChange={(e) => setNewAttrName(e.target.value)}
                    className="text-sm flex-1"
                    placeholder="新属性名称"
                  />
                  <Input
                    value={newAttrValue}
                    onChange={(e) => setNewAttrValue(e.target.value)}
                    className="text-sm flex-1"
                    placeholder="属性值"
                  />
                  <Button size="sm" variant="outline" onClick={handleAddAttribute}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">相关词条（用逗号分隔）</label>
              <Input
                value={editData.relatedEntries.join(", ")}
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  relatedEntries: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                }))}
                className="text-sm"
                placeholder="传送带, 机械臂, 动力轴"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">修改说明</label>
              <Input
                value={changeDescription}
                onChange={(e) => setChangeDescription(e.target.value)}
                className="text-sm"
                placeholder="描述本次修改的内容（可选）"
              />
            </div>
          </>
        ) : (
          <>
            {entry.images.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">图片展示</h3>
                <div className="grid grid-cols-3 gap-2">
                  {entry.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                        {img.url.startsWith("data:") ? (
                          <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-7 px-2"
                          onClick={() => handleSetCover(index)}
                          disabled={img.isCover}
                        >
                          {img.isCover ? <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> : <StarOff className="w-3 h-3" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="h-7 px-2"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      {img.isCover && (
                        <div className="absolute top-1 left-1">
                          <Badge variant="default" className="text-xs">封面</Badge>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1 truncate">{img.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-primary mb-2">简介</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{entry.description}</p>
            </div>

            {entry.recipes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">合成配方</h3>
                <div className="bg-secondary/30 rounded-lg p-3">
                  {entry.recipes.map((recipe, rIndex) => (
                    <div key={rIndex} className="space-y-2">
                      <div className="text-xs text-muted-foreground mb-1">{recipe.type === "crafting" ? "工作台合成" : recipe.type}</div>
                      <div className="grid grid-cols-3 gap-1 w-fit">
                        {recipe.pattern?.flat().map((item, pIndex) => (
                          <div 
                            key={pIndex} 
                            className={`w-12 h-12 border border-border rounded flex items-center justify-center text-xs ${
                              item ? "bg-secondary" : "bg-transparent"
                            }`}
                          >
                            {item || ""}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">产出: {recipe.result?.item} x{recipe.result?.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entry.attributes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">属性数据</h3>
                <div className="bg-secondary/30 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {entry.attributes.map((attr, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          <td className="px-3 py-2 text-muted-foreground w-1/3">{attr.name}</td>
                          <td className="px-3 py-2 text-foreground">{attr.value} {attr.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {entry.usage && (
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">使用方法</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{entry.usage}</p>
              </div>
            )}

            {entry.relatedEntries.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">相关内容</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.relatedEntries.map((item, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => onRelatedClick(item)}
                    >
                      <Link2 className="w-3 h-3 mr-1" /> {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              最后编辑: {entry.author} · {entry.updatedAt.toLocaleDateString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mockProjectData: Record<string, any> = {
  "mod-1": {
    id: "mod-1",
    type: "mod",
    projectStatus: "筹备中",
    title: "星辰魔法：元素觉醒",
    author: "魔法工作室",
    authorType: "模组开发团队",
    productionForm: "团队",
    description: "一款正在开发中的大型魔法模组，将引入全新的元素魔法系统、魔法生物和神秘维度。目前处于早期开发阶段。",
    authorNote: "我们正在努力打造一个独特的魔法体验，敬请期待！",
    tags: ["魔法", "元素", "维度"],
    basicInfo: {
      "内容方向": "魔法",
      "产出方式": "原创",
      "产出时间": "2024.01",
      "制作形式": "团队",
    },
    status: "开发中",
    progress: 35,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-20"),
    views: 12580,
    favorites: 234,
    likes: 234,
    objectives: "打造一个包含元素魔法系统、魔法生物和神秘维度的完整魔法模组，为玩家提供沉浸式的魔法体验。",
    personnel: {
      preparationStatus: "筹备中",
      count: "5-10人",
      cooperationType: "仅分成",
      description: "需要Java开发者、美术设计师和策划人员。分成比例根据贡献度分配。"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "5000-10000元",
      cooperationType: "无偿",
      description: "目前为无偿开发，如有赞助将用于服务器和美术资源。"
    },
    implementation: {
      timeline: "预计6-12个月完成",
      description: "第一阶段完成核心魔法系统，第二阶段添加魔法生物，第三阶段开发神秘维度。"
    }
  },
  "mod-2": {
    id: "mod-2",
    type: "mod",
    projectStatus: "筹备中",
    title: "工业革命2.0",
    author: "科技团队",
    authorType: "模组开发团队",
    productionForm: "团队",
    description: "机械动力模组的续作，全新的电力系统、更复杂的自动化生产线和多人协作机制。正在招募开发者。",
    authorNote: "欢迎有经验的开发者加入我们！",
    tags: ["科技", "自动化", "电力"],
    basicInfo: {
      "内容方向": "科技",
      "产出方式": "原创",
      "产出时间": "2024.02",
      "制作形式": "团队",
    },
    status: "招募中",
    progress: 15,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-18"),
    views: 23450,
    favorites: 567,
    likes: 567,
    objectives: "开发机械动力的续作，引入电力系统、高级自动化和多人协作功能。",
    personnel: {
      preparationStatus: "筹备中",
      count: "10-15人",
      cooperationType: "全部",
      description: "急需Java开发者（熟悉Mixin和渲染）、3D建模师和UI设计师。提供报酬和分成。"
    },
    funding: {
      preparationStatus: "筹备完成",
      amount: "20000-50000元",
      cooperationType: "全部",
      description: "有投资方支持，可提供开发报酬和项目分成。"
    },
    implementation: {
      timeline: "预计12-18个月完成",
      description: "分三个阶段：核心系统重构、新功能开发、优化与测试。"
    }
  },
  "map-1": {
    id: "map-1",
    type: "map",
    projectStatus: "筹备中",
    title: "失落文明：亚特兰蒂斯",
    author: "探险家团队",
    authorType: "地图制作团队",
    productionForm: "团队",
    description: "一张大型冒险地图，探索失落的亚特兰蒂斯文明，包含水下城市、古代遗迹和深海Boss。",
    authorNote: "水下建筑的制作很有挑战性，但我们相信会带来独特的体验！",
    tags: ["冒险", "水下", "探索"],
    basicInfo: {
      "内容方向": "冒险",
      "产出方式": "原创",
      "产出时间": "2024.01",
      "制作形式": "团队",
    },
    status: "开发中",
    progress: 50,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-15"),
    views: 8900,
    favorites: 123,
    likes: 123,
    objectives: "打造一个沉浸式的水下冒险地图，让玩家探索神秘的亚特兰蒂斯文明。",
    personnel: {
      preparationStatus: "筹备中",
      count: "3-5人",
      cooperationType: "仅分成",
      description: "需要建筑设计师和命令方块专家。"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "1000-3000元",
      cooperationType: "无偿",
      description: "目前为无偿开发。"
    },
    implementation: {
      timeline: "预计4-6个月完成",
      description: "已完成主城区域，正在进行Boss战设计。"
    }
  },
  "datapack-1": {
    id: "datapack-1",
    type: "datapack",
    projectStatus: "筹备中",
    title: "硬核生存：极限挑战",
    author: "硬核玩家",
    authorType: "独立开发者",
    productionForm: "个人",
    description: "一个极具挑战性的数据包，添加温度系统、口渴值、疲劳度等真实生存要素。",
    authorNote: "喜欢硬核生存的玩家一定会喜欢这个数据包！",
    tags: ["生存", "硬核", "挑战"],
    basicInfo: {
      "内容方向": "生存",
      "产出方式": "原创",
      "产出时间": "2024.02",
      "制作形式": "个人",
    },
    status: "开发中",
    progress: 60,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-03-19"),
    views: 5600,
    favorites: 89,
    likes: 89,
    objectives: "为追求真实生存体验的玩家打造一个硬核生存数据包。",
    personnel: {
      preparationStatus: "无需筹备",
      count: "1人",
      cooperationType: "无偿",
      description: "独立开发"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "0元",
      cooperationType: "无偿",
      description: "个人兴趣项目"
    },
    implementation: {
      timeline: "预计2-3个月完成",
      description: "温度系统和口渴值已完成，正在开发疲劳度系统。"
    }
  },
  "modpack-1": {
    id: "modpack-1",
    type: "modpack",
    projectStatus: "筹备中",
    title: "星辰骑士计划",
    author: "RPG工作室",
    authorType: "整合包制作团队",
    productionForm: "团队",
    description: "大型RPG整合包项目，包含原创剧情、自定义Boss、独特职业系统和完整的任务线。正在招募团队成员。",
    authorNote: "这是一个雄心勃勃的项目，欢迎志同道合的伙伴加入！",
    tags: ["RPG", "剧情", "职业"],
    basicInfo: {
      "内容方向": "角色扮演类",
      "产出方式": "原创",
      "产出时间": "2023.12",
      "制作形式": "团队",
    },
    status: "招募中",
    progress: 25,
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-03-20"),
    views: 45600,
    favorites: 890,
    likes: 890,
    objectives: "打造一个完整的RPG整合包，包含原创剧情、职业系统和任务线。",
    personnel: {
      preparationStatus: "筹备中",
      count: "15-20人",
      cooperationType: "全部",
      description: "需要剧情策划、任务设计师、美术师和测试人员。"
    },
    funding: {
      preparationStatus: "筹备完成",
      amount: "30000-50000元",
      cooperationType: "全部",
      description: "有投资方支持，可提供报酬和分成。"
    },
    implementation: {
      timeline: "预计18-24个月完成",
      description: "第一阶段完成核心框架，第二阶段开发剧情和任务，第三阶段优化和测试。"
    }
  },
  "server-1": {
    id: "server-1",
    type: "server",
    projectStatus: "筹备中",
    title: "末日生存服务器",
    author: "末日团队",
    authorType: "服务器运营团队",
    productionForm: "团队",
    description: "一个以末日生存为主题的服务器项目，包含丧尸系统、资源匮乏、基地建设等玩法。",
    authorNote: "末日生存爱好者的天堂！",
    tags: ["生存", "末日", "PVE"],
    basicInfo: {
      "服务器类型": "整合服",
      "内容方向": "生存",
      "产出方式": "原创",
      "产出时间": "2024.01",
      "制作形式": "团队",
    },
    status: "开发中",
    progress: 40,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-03-18"),
    views: 18900,
    favorites: 456,
    likes: 456,
    objectives: "打造一个沉浸式的末日生存服务器体验。",
    personnel: {
      preparationStatus: "筹备中",
      count: "5-8人",
      cooperationType: "仅分成",
      description: "需要插件开发者、建筑设计师和运营人员。"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "5000-10000元",
      cooperationType: "无偿",
      description: "目前为无偿开发，服务器上线后通过捐赠维持运营。"
    },
    implementation: {
      timeline: "预计4-6个月完成",
      description: "已完成核心插件开发，正在进行地图制作和测试。"
    }
  },
  "resourcepack-1": {
    id: "resourcepack-1",
    type: "resourcepack",
    projectStatus: "筹备中",
    title: "水彩风格材质包",
    author: "艺术工作室",
    authorType: "材质创作者",
    productionForm: "团队",
    description: "一款独特的水彩风格材质包，为Minecraft带来柔和、艺术感的视觉体验。",
    authorNote: "让Minecraft变成一幅水彩画！",
    tags: ["水彩", "艺术", "柔和"],
    basicInfo: {
      "视觉基调": "特殊风格",
      "产出方式": "原创",
      "产出时间": "2024.02",
      "制作形式": "团队",
    },
    status: "开发中",
    progress: 55,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-03-19"),
    views: 7800,
    favorites: 178,
    likes: 178,
    objectives: "打造一个独特的水彩风格材质包，为玩家带来艺术感的视觉体验。",
    personnel: {
      preparationStatus: "筹备中",
      count: "2-3人",
      cooperationType: "仅分成",
      description: "需要像素美术师。"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "500-1000元",
      cooperationType: "无偿",
      description: "目前为无偿开发。"
    },
    implementation: {
      timeline: "预计3-4个月完成",
      description: "已完成基础方块材质，正在进行物品和生物材质制作。"
    }
  },
  "shader-1": {
    id: "shader-1",
    type: "shader",
    title: "卡通渲染光影",
    author: "光影爱好者",
    authorType: "独立开发者",
    productionForm: "个人",
    projectStatus: "筹备中",
    description: "专为卡通风格设计的非真实感渲染光影，让游戏呈现出独特的卡通画面效果。",
    authorNote: "让Minecraft变成卡通世界！",
    tags: ["卡通", "NPR", "风格化"],
    basicInfo: {
      "视觉基调": "基础风格",
      "产出方式": "原创",
      "产出时间": "2024.01",
      "制作形式": "个人",
    },
    status: "开发中",
    progress: 45,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-03-17"),
    views: 9200,
    favorites: 234,
    likes: 234,
    objectives: "开发一款卡通风格的NPR光影，为Minecraft带来独特的视觉体验。",
    personnel: {
      preparationStatus: "无需筹备",
      count: "1人",
      cooperationType: "无偿",
      description: "独立开发"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "0元",
      cooperationType: "无偿",
      description: "个人兴趣项目"
    },
    implementation: {
      timeline: "预计4-5个月完成",
      description: "已完成基础卡通着色，正在进行阴影和光照优化。"
    }
  },
  "building-1": {
    id: "building-1",
    type: "building",
    projectStatus: "筹备中",
    title: "赛博朋克城市建筑包",
    author: "未来建筑师",
    authorType: "建筑设计团队",
    productionForm: "团队",
    description: "一套赛博朋克风格的建筑包，包含霓虹灯建筑、未来科技设施和城市基础设施。",
    authorNote: "欢迎来到赛博朋克的世界！",
    tags: ["赛博朋克", "未来", "城市"],
    basicInfo: {
      "视觉基调": "科技风格",
      "产出方式": "原创",
      "产出时间": "2024.02",
      "制作形式": "团队",
    },
    status: "开发中",
    progress: 30,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-03-16"),
    views: 11200,
    favorites: 345,
    likes: 345,
    objectives: "打造一套完整的赛博朋克风格建筑包，为玩家提供未来城市建设素材。",
    personnel: {
      preparationStatus: "筹备中",
      count: "3-4人",
      cooperationType: "仅分成",
      description: "需要建筑设计师和红石工程师（霓虹灯效果）。"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "1000-2000元",
      cooperationType: "无偿",
      description: "目前为无偿开发。"
    },
    implementation: {
      timeline: "预计5-6个月完成",
      description: "已完成基础建筑框架，正在进行细节装饰和霓虹灯效果。"
    }
  },
  "audio-1": {
    id: "audio-1",
    type: "audio",
    projectStatus: "筹备中",
    title: "动态战斗音效包",
    author: "音效团队",
    authorType: "音效设计师",
    productionForm: "团队",
    description: "一套根据战斗情况动态变化的音效包，让战斗体验更加沉浸。",
    authorNote: "让每一场战斗都充满激情！",
    tags: ["战斗", "动态", "沉浸"],
    basicInfo: {
      "内容风格": "史诗/震撼",
      "产出方式": "原创",
      "产出时间": "2024.03",
      "制作形式": "团队",
    },
    status: "开发中",
    progress: 20,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-20"),
    views: 4500,
    favorites: 67,
    likes: 67,
    objectives: "开发一套动态战斗音效系统，根据战斗强度和类型自动切换音效。",
    personnel: {
      preparationStatus: "筹备中",
      count: "2-3人",
      cooperationType: "仅分成",
      description: "需要音效设计师和音频程序员。"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "500-1000元",
      cooperationType: "无偿",
      description: "目前为无偿开发。"
    },
    implementation: {
      timeline: "预计3-4个月完成",
      description: "正在设计音效触发系统和录制基础音效。"
    }
  },
  "ecoTool-1": {
    id: "ecoTool-1",
    type: "ecoTool",
    projectStatus: "筹备中",
    title: "资源打包工具Pro",
    author: "工具开发者",
    authorType: "独立开发者",
    productionForm: "个人",
    description: "一款可视化资源打包工具，支持一键打包、自动压缩和版本管理。",
    authorNote: "让资源打包变得简单！",
    tags: ["工具", "打包", "自动化"],
    basicInfo: {
      "运行平台": "Windows",
      "产出方式": "原创",
      "产出时间": "2024.02",
      "制作形式": "个人",
    },
    status: "开发中",
    progress: 70,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-19"),
    views: 6700,
    favorites: 123,
    likes: 123,
    objectives: "开发一款易用的资源打包工具，帮助创作者快速发布资源。",
    personnel: {
      preparationStatus: "无需筹备",
      count: "1人",
      cooperationType: "无偿",
      description: "独立开发"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "0元",
      cooperationType: "无偿",
      description: "个人兴趣项目"
    },
    implementation: {
      timeline: "预计2-3个月完成",
      description: "核心功能已完成，正在进行UI优化和测试。"
    }
  },
  "doc-1": {
    id: "doc-1",
    type: "doc",
    projectStatus: "筹备中",
    title: "Fabric模组开发进阶教程",
    author: "教程团队",
    authorType: "教程编写团队",
    productionForm: "团队",
    description: "Fabric模组开发进阶教程，涵盖网络通信、Mixin、渲染等高级主题。",
    authorNote: "帮助你成为高级模组开发者！",
    tags: ["教程", "Fabric", "进阶"],
    basicInfo: {
      "涉及领域": "模组开发",
      "适用对象": "有基础的开发者",
      "产出方式": "原创",
      "产出时间": "2024.01",
      "制作形式": "团队",
    },
    status: "开发中",
    progress: 40,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-18"),
    views: 8900,
    favorites: 89,
    likes: 89,
    objectives: "编写一套完整的Fabric模组开发进阶教程，帮助开发者掌握高级技术。",
    personnel: {
      preparationStatus: "筹备中",
      count: "2-3人",
      cooperationType: "无偿",
      description: "需要资深模组开发者参与编写。"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "0元",
      cooperationType: "无偿",
      description: "开源项目"
    },
    implementation: {
      timeline: "预计6-8个月完成",
      description: "已完成网络通信章节，正在编写Mixin章节。"
    }
  },
  "image-1": {
    id: "image-1",
    type: "image",
    projectStatus: "筹备中",
    title: "动漫角色皮肤系列",
    author: "动漫爱好者",
    authorType: "皮肤设计师",
    productionForm: "个人",
    description: "一套热门动漫角色的皮肤系列，包含多款经典动漫角色造型。",
    authorNote: "用你喜欢的动漫角色畅游Minecraft！",
    tags: ["动漫", "角色", "皮肤"],
    basicInfo: {
      "获取方式": "免费",
      "产出方式": "原创",
      "产出时间": "2024.03",
      "制作形式": "个人",
    },
    status: "开发中",
    progress: 60,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-20"),
    views: 12300,
    favorites: 456,
    likes: 456,
    objectives: "制作一套高质量的动漫角色皮肤系列，涵盖热门动漫角色。",
    personnel: {
      preparationStatus: "无需筹备",
      count: "1人",
      cooperationType: "无偿",
      description: "独立创作"
    },
    funding: {
      preparationStatus: "无需筹备",
      amount: "0元",
      cooperationType: "无偿",
      description: "个人兴趣项目"
    },
    implementation: {
      timeline: "预计2-3个月完成",
      description: "已完成10款皮肤，计划总共制作30款。"
    }
  },
  "mod-3": {
    id: "mod-3",
    type: "mod",
    projectStatus: "制作中",
    title: "神秘生物学：深渊探索",
    author: "深渊工作室",
    authorType: "模组开发团队",
    productionForm: "团队",
    description: "一个添加深海生物群系、神秘海洋生物和深渊维度的模组。项目已完成筹备，正在积极开发中。",
    authorNote: "探索未知的深渊世界，发现神秘的海洋生物！",
    tags: ["海洋", "生物", "维度"],
    basicInfo: {
      "内容方向": "冒险",
      "产出方式": "原创",
      "产出时间": "2024.03",
      "制作形式": "团队",
    },
    status: "开发中",
    progress: 45,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-04-05"),
    views: 28900,
    favorites: 678,
    likes: 678,
    objectives: "打造一个完整的深海探索体验，包含新生物群系、独特海洋生物和神秘的深渊维度。",
    personnel: {
      preparationStatus: "筹备完成",
      count: "8人",
      cooperationType: "全部",
      description: "团队已组建完成，包括Java开发者、美术设计师和策划人员。"
    },
    funding: {
      preparationStatus: "筹备完成",
      amount: "15000-25000元",
      cooperationType: "全部",
      description: "投资方已确认，资金充足。"
    },
    implementation: {
      timeline: "预计8-10个月完成",
      description: "深海群系已完成60%，生物AI开发中，深渊维度设计阶段。"
    }
  },
};

const mockProject: any = {
  id: "project-new",
  type: "mod",
  projectStatus: "筹备中",
  title: "",
  author: "",
  authorType: "",
  productionForm: "",
  description: "",
  authorNote: "",
  tags: [],
  basicInfo: {},
  status: "开发中",
  progress: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  views: 0,
  favorites: 0,
  likes: 0,
  donationLeaders: [],
  donationFeed: [],
  comments: [],
  objectives: "",
  personnel: {
    preparationStatus: "筹备中",
    count: "",
    cooperationType: "",
    description: ""
  },
  funding: {
    preparationStatus: "筹备中",
    amount: "",
    cooperationType: "",
    description: ""
  },
  implementation: {
    timeline: "",
    description: ""
  }
};

const mockChangeLogs: any[] = [];

const ProjectDetail = () => {
  const router = useRouter();
  const params = useParams({ from: "/project/$id" });
  const projectId = params.id;
  
  const initialProject = mockProjectData[projectId] || mockProject;
  
  const [activeTab, setActiveTab] = useState("intro");
  const [commentTab, setCommentTab] = useState("public");
  const [newComment, setNewComment] = useState("");
  const [project, setProject] = useState(initialProject);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedProject, setEditedProject] = useState(initialProject);
  
  const [contentDetails, setContentDetails] = useState<Record<string, Record<string, string[]>>>({});
  const [newHotWord, setNewHotWord] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showContentUploadModal, setShowContentUploadModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [addFunctionTab, setAddFunctionTab] = useState<"entry" | "category">("entry");
  
  const [selectedEntry, setSelectedEntry] = useState<{ category: string; item: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [entryContent, setEntryContent] = useState<Record<string, WikiEntry>>({});
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newGalleryImage, setNewGalleryImage] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guides, setGuides] = useState<any[]>([]);
  const [newGuideTitle, setNewGuideTitle] = useState("");
  const [newGuideContent, setNewGuideContent] = useState("");
  
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [newLicenseTitle, setNewLicenseTitle] = useState("");
  const [newLicenseContent, setNewLicenseContent] = useState("");
  const [selectedLicenseType, setSelectedLicenseType] = useState<string>("");
  
  const [showDownloadUploadModal, setShowDownloadUploadModal] = useState(false);
  const [downloadUploadTab, setDownloadUploadTab] = useState<"version" | "related">("version");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [loaderFilter, setLoaderFilter] = useState<string>("all");
  const [selectedDownloadVersion, setSelectedDownloadVersion] = useState<string>("");
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");
  const [newRelatedMod, setNewRelatedMod] = useState({
    name: "",
    type: "前置模组",
    description: "",
    author: "",
  });
  
  const [selectedGuide, setSelectedGuide] = useState<typeof guides[0] | null>(null);
  const [showGuideDetailModal, setShowGuideDetailModal] = useState(false);
  
  const [selectedLicense, setSelectedLicense] = useState<{
    type: string;
    title: string;
    description: string;
    content?: string;
  } | null>(null);
  const [showLicenseDetailModal, setShowLicenseDetailModal] = useState(false);
  const [showLicenseSubmitModal, setShowLicenseSubmitModal] = useState(false);
  const [selectedLicenseTemplate, setSelectedLicenseTemplate] = useState<"original-normal" | "original-image" | "repost-normal" | "repost-image" | null>(null);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showAcquisitionEditModal, setShowAcquisitionEditModal] = useState(false);
  const [showSubmitReviewModal, setShowSubmitReviewModal] = useState(false);
  const [projectContract, setProjectContract] = useState<string | null>(null);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [selectedAcquisition, setSelectedAcquisition] = useState("免费");
  const [acquisitionPrice, setAcquisitionPrice] = useState(99);
  const [acquisitionSubscriptionPrice, setAcquisitionSubscriptionPrice] = useState(19);

  const [cooperationRequests, setCooperationRequests] = useState([
    {
      id: "1",
      userId: "user-1",
      userName: "星空开发者",
      userAvatar: "",
      userType: "Java开发者",
      requestType: "人员合作",
      message: "我有3年Forge模组开发经验，擅长Mixin和渲染系统，希望能加入这个项目！",
      status: "pending" as const,
      createdAt: new Date("2024-03-18"),
    },
    {
      id: "2",
      userId: "user-2",
      userName: "像素画师",
      userAvatar: "",
      userType: "美术设计师",
      requestType: "人员合作",
      message: "可以负责UI设计和材质绘制，有丰富的像素艺术经验。",
      status: "pending" as const,
      createdAt: new Date("2024-03-17"),
    },
    {
      id: "3",
      userId: "user-3",
      userName: "投资方A",
      userAvatar: "",
      userType: "投资人",
      requestType: "资金合作",
      message: "对这个项目很感兴趣，愿意提供资金支持，详情可以详谈。",
      status: "pending" as const,
      createdAt: new Date("2024-03-16"),
    },
    {
      id: "4",
      userId: "user-4",
      userName: "策划小王",
      userAvatar: "",
      userType: "游戏策划",
      requestType: "人员合作",
      message: "可以协助设计魔法系统和任务线，有RPG游戏策划经验。",
      status: "accepted" as const,
      createdAt: new Date("2024-03-15"),
    },
    {
      id: "5",
      userId: "user-5",
      userName: "测试玩家",
      userAvatar: "",
      userType: "测试员",
      requestType: "人员合作",
      message: "可以帮忙测试和反馈bug，每周有20小时空闲时间。",
      status: "rejected" as const,
      createdAt: new Date("2024-03-14"),
    },
  ]);
  const [showCooperationRequestModal, setShowCooperationRequestModal] = useState(false);
  const [newCooperationRequest, setNewCooperationRequest] = useState({
    requestType: "人员合作",
    message: "",
  });

  const resourceVersions = [
    {
      id: "1",
      version: "1.20.1-0.5.1f",
      gameVersion: "1.20.1",
      loader: "Forge",
      releaseDate: "2024-03-15",
      downloads: 125430,
      fileSize: "4.2 MB",
      changelog: "修复了多个崩溃问题，优化了性能",
      isLatest: true,
    },
  ];

  const [relatedVersions, setRelatedVersions] = useState([
    {
      id: "1",
      version: "1.20.1-0.5.1f",
      gameVersion: "1.20.1",
      loader: "Forge",
      dependencies: [] as any[],
      prerequisites: [] as any[],
      integrations: [] as any[],
    },
  ]);

  const handleAddVersion = (version: string, gameVersion: string, loader: string) => {
    setRelatedVersions([
      ...relatedVersions,
      {
        id: Date.now().toString(),
        version,
        gameVersion,
        loader,
        dependencies: [],
        prerequisites: [],
        integrations: [],
      }
    ]);
  };

  const handleAddRelatedMod = (versionId: string, mod: typeof newRelatedMod) => {
    setRelatedVersions(relatedVersions.map(v => {
      if (v.id === versionId) {
        const newMod = {
          id: Date.now().toString(),
          ...mod,
          downloads: 0,
        };
        if (mod.type === "依赖模组") {
          return { ...v, dependencies: [...v.dependencies, newMod] };
        } else if (mod.type === "前置模组") {
          return { ...v, prerequisites: [...v.prerequisites, newMod] };
        } else {
          return { ...v, integrations: [...v.integrations, newMod] };
        }
      }
      return v;
    }));
  };

  const getTagSystem = (type?: string) => {
    const targetType = type || project.type;
    if (!targetType) return null;
    return tagSystemMap[targetType] || null;
  };

  const getCommonMeta = (type?: string) => {
    const targetType = type || project.type;
    if (!targetType) return null;
    const gameContentTypes = ["mod", "datapack"];
    const auxiliaryTypes = ["resourcepack", "shader", "building", "audio"];
    const modpackServerTypes = ["modpack", "server"];
    const ecoDocTypes = ["ecoTool", "doc"];
    
    if (gameContentTypes.includes(targetType)) {
      return contentCommonMeta;
    } else if (targetType === "map") {
      return mapCommonMeta;
    } else if (ecoDocTypes.includes(targetType)) {
      return ecoDocCommonMeta;
    } else if (auxiliaryTypes.includes(targetType)) {
      return auxiliaryCommonMeta;
    } else if (modpackServerTypes.includes(targetType)) {
      return modpackServerCommonMeta;
    } else if (targetType === "image") {
      return imageCommonMeta;
    }
    return null;
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleAddHotWord = () => {
    if (!newHotWord.trim() || !selectedCategory) return;
    const key = `project-${project.id}`;
    const categoryLabel = allHotWordCategories.find(c => c.id === selectedCategory)?.label || selectedCategory;
    
    setContentDetails(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [categoryLabel]: [...(prev[key]?.[categoryLabel] || []), newHotWord.trim()]
      }
    }));
    setNewHotWord("");
    setSelectedCategory("");
    setShowContentUploadModal(false);
  };

  const handleRemoveHotWord = (categoryLabel: string, index: number) => {
    const key = `project-${project.id}`;
    setContentDetails(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [categoryLabel]: (prev[key]?.[categoryLabel] || []).filter((_: string, i: number) => i !== index)
      }
    }));
    if (selectedEntry?.category === categoryLabel && selectedEntry?.item === (contentDetails[key]?.[categoryLabel] || [])[index]) {
      setSelectedEntry(null);
    }
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;
    const key = `project-${project.id}`;
    
    setContentDetails(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [newCategoryName.trim()]: []
      }
    }));
    setNewCategoryName("");
    setNewCategoryDesc("");
    setShowContentUploadModal(false);
  };

  const createDefaultEntry = (name: string, category: string): WikiEntry => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    category,
    type: "unknown",
    images: [],
    description: "",
    recipes: [],
    attributes: [],
    usage: "",
    relatedEntries: [],
    author: "当前用户",
    updatedAt: new Date(),
    version: 1,
    history: [],
  });

  const hasContentDetails = ["mod", "modpack", "server", "datapack"].includes(project.type);
  const hasGallery = project.type !== "audio";
  const isAuxiliaryResource = ["resourcepack", "shader", "building", "audio", "ecoTool", "doc"].includes(project.type);
  const isImageProject = project.type === "image";
  const isMapProject = project.type === "map";
  const isNewProject = project.status === "开发中" && project.progress === 0;

  const tabItems = isNewProject
    ? [
        { id: "intro", label: "基本介绍" },
        { id: "plan", label: "项目方案" },
        { id: "cooperation", label: "合作意向" },
      ]
    : [
        { id: "intro", label: "基本介绍" },
        { id: "plan", label: "项目方案" },
        { id: "cooperation", label: "合作意向" },
        ...(hasContentDetails ? [{ id: "content", label: "内容详情" }] : []),
        ...(hasGallery && !isImageProject ? [{ id: "gallery", label: "画廊" }] : []),
        ...(isImageProject ? [{ id: "gallery", label: "画廊" }] : []),
        { id: "download", label: isImageProject ? "获取" : "下载" },
        ...(!isAuxiliaryResource && !isImageProject ? [{ id: "guide", label: "攻略" }] : []),
        { id: "license", label: "协议" },
        { id: "changelog", label: "日志" },
      ];

  const filteredBasicInfo = Object.entries(project.basicInfo || {}).filter(
    ([_, value]) => value && value !== "不涉及"
  );

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
          {project.comments.map((c: any, i: number) => (
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
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-foreground truncate">{project.title}</h1>
                <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${
                  project.projectStatus === "筹备中" 
                    ? "border-blue-500/30 text-blue-600" 
                    : "border-green-500/30 text-green-600"
                }`}>
                  {project.projectStatus || "筹备中"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3.5 h-3.5" /> {project.views}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookmarkPlus className="w-3.5 h-3.5" /> {project.favorites}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3.5 h-3.5" /> {project.likes}
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
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground mb-3">简介</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{project.description || "暂无简介"}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 px-2 text-xs ml-4"
                      onClick={() => {
                        setEditedProject({ ...project });
                        setShowEditModal(true);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" /> 编辑
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">制作方寄语</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.authorNote || "暂无寄语"}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">基本信息</h3>
                    {filteredBasicInfo.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {filteredBasicInfo.map(([key, value]) => (
                          <div key={key} className="border border-border rounded-lg p-3">
                            <div className="text-xs text-muted-foreground mb-1">{key}</div>
                            <div className="text-sm font-medium text-foreground">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">暂无基本信息</p>
                    )}
                  </div>

                  {renderCommentSection()}
                </div>
              </TabsContent>

              <TabsContent value="plan" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">项目方案</h2>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => setShowEditPlanModal(true)}
                      >
                        <Edit className="w-3 h-3 mr-1" /> 编辑方案
                      </Button>
                      {isNewProject && (
                        <Button 
                          size="sm" 
                          className="h-7 px-3 text-xs"
                          onClick={() => setShowSubmitReviewModal(true)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> 完成筹备
                        </Button>
                      )}
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4" /> 项目目标
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {project.objectives || "暂无项目目标说明。项目目标用于描述该项目创建后目的是产出一个具体怎样的内容。"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="w-4 h-4" /> 人员事宜
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">筹备状态</span>
                          <Badge variant={project.personnel?.preparationStatus === "筹备完成" ? "default" : project.personnel?.preparationStatus === "无需筹备" ? "secondary" : "outline"} className="text-xs">
                            {project.personnel?.preparationStatus || "筹备中"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">预计参与人数</span>
                          <span className="font-medium text-foreground">{project.personnel?.count || "待定"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">合作方式</span>
                          <span className="font-medium text-foreground">{project.personnel?.cooperationType || "待定"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                          {project.personnel?.description || "暂无人员事宜说明。人员事宜用于说明完成该项目需要多少人参与以及合作方式。"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Heart className="w-4 h-4" /> 资金事宜
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">筹备状态</span>
                          <Badge variant={project.funding?.preparationStatus === "筹备完成" ? "default" : project.funding?.preparationStatus === "无需筹备" ? "secondary" : "outline"} className="text-xs">
                            {project.funding?.preparationStatus || "筹备中"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">预计资金需求</span>
                          <span className="font-medium text-foreground">{project.funding?.amount || "待定"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">合作方式</span>
                          <span className="font-medium text-foreground">{project.funding?.cooperationType || "待定"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                          {project.funding?.description || "暂无资金事宜说明。资金事宜用于说明完成该项目需要多少资金以及合作方式。"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" /> 实施计划
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">预计完成时间</span>
                          <span className="font-medium text-foreground">{project.timeline?.deadline || "待定"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                          {project.timeline?.description || "暂无实施计划说明。实施计划用于说明大概多少时间完成以及如何完成。"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="cooperation" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">合作意向</h2>
                    <Button 
                      size="sm" 
                      className="h-7 px-3 text-xs"
                      onClick={() => setShowCooperationRequestModal(true)}
                    >
                      <Plus className="w-3 h-3 mr-1" /> 申请合作
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {cooperationRequests.filter(r => r.status === "pending").length > 0 && (
                      <>
                        <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                          待处理申请
                          <Badge variant="outline" className="text-xs">
                            {cooperationRequests.filter(r => r.status === "pending").length}
                          </Badge>
                        </div>
                        {cooperationRequests.filter(r => r.status === "pending").map((request) => (
                          <Card key={request.id} className="hover:shadow-sm transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="text-xs">
                                    {request.userName.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-foreground">{request.userName}</span>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                      {request.userType}
                                    </Badge>
                                    <Badge variant={request.requestType === "资金合作" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                                      {request.requestType}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {request.message}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground">
                                      {request.createdAt.toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50">
                                        接受
                                      </Button>
                                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                                        拒绝
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    )}

                    {cooperationRequests.filter(r => r.status === "accepted").length > 0 && (
                      <>
                        <div className="text-sm font-semibold text-muted-foreground mt-4 flex items-center gap-2">
                          已接受
                          <Badge variant="default" className="text-xs bg-green-600">
                            {cooperationRequests.filter(r => r.status === "accepted").length}
                          </Badge>
                        </div>
                        {cooperationRequests.filter(r => r.status === "accepted").map((request) => (
                          <Card key={request.id} className="opacity-80">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="text-xs">
                                    {request.userName.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-foreground">{request.userName}</span>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                      {request.userType}
                                    </Badge>
                                    <Badge variant={request.requestType === "资金合作" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                                      {request.requestType}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-green-600 border-green-200">
                                      已接受
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {request.message}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    )}

                    {cooperationRequests.filter(r => r.status === "rejected").length > 0 && (
                      <>
                        <div className="text-sm font-semibold text-muted-foreground mt-4 flex items-center gap-2">
                          已拒绝
                          <Badge variant="secondary" className="text-xs">
                            {cooperationRequests.filter(r => r.status === "rejected").length}
                          </Badge>
                        </div>
                        {cooperationRequests.filter(r => r.status === "rejected").map((request) => (
                          <Card key={request.id} className="opacity-50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="text-xs">
                                    {request.userName.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-foreground">{request.userName}</span>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                      {request.userType}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-red-600 border-red-200">
                                      已拒绝
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {request.message}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    )}

                    {cooperationRequests.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">暂无合作意向申请</p>
                        <p className="text-xs mt-1">项目发布后，其他用户可以申请加入合作</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {hasContentDetails && (
                <>
                  <TabsContent value="content" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">内容详情</h2>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          onClick={() => setShowContentUploadModal(true)}
                        >
                          <Plus className="w-3 h-3 mr-1" /> 添加内容
                        </Button>
                      </div>

                      <div className="flex gap-4 min-h-[600px]">
                        <div className="w-64 flex-shrink-0 border border-border rounded-lg bg-card overflow-hidden">
                          <div className="p-3 border-b border-border bg-secondary/50">
                            <h3 className="text-sm font-semibold text-foreground">内容分类</h3>
                            <p className="text-xs text-muted-foreground mt-1">点击词条查看详情</p>
                          </div>
                          <div className="overflow-y-auto max-h-[520px]">
                            {(() => {
                              const key = `project-${project.id}`;
                              const details = contentDetails[key] || {};
                              const withContent = allHotWordCategories.filter(cat => (details[cat.label] || []).length > 0);
                              const withoutContent = allHotWordCategories.filter(cat => !details[cat.label] || details[cat.label].length === 0);
                              
                              return (
                                <>
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
                                        <Badge variant="default" className="text-xs h-5">{(details[category.label] || []).length}</Badge>
                                      </div>
                                      {expandedCategories.has(category.id) && (
                                        <div className="bg-secondary/10 py-1">
                                          {(details[category.label] || []).map((item: string, index: number) => (
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
                                                  handleRemoveHotWord(category.label, index);
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
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          {selectedEntry ? (
                            <WikiEntryPanel
                              entry={entryContent[selectedEntry.item] || createDefaultEntry(selectedEntry.item, selectedEntry.category)}
                              isEditing={isEditing}
                              onEdit={() => setIsEditing(true)}
                              onSave={(entry) => {
                                setEntryContent(prev => ({ ...prev, [selectedEntry.item]: entry }));
                                setIsEditing(false);
                              }}
                              onCancel={() => setIsEditing(false)}
                              onRelatedClick={(item) => {
                                const key = `project-${project.id}`;
                                const details = contentDetails[key] || {};
                                const cat = allHotWordCategories.find(c => (details[c.label] || []).includes(item))?.label;
                                if (cat) setSelectedEntry({ category: cat, item });
                              }}
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center border border-border rounded-lg bg-card">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
                                  <Eye className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-sm font-medium text-foreground mb-1">选择词条查看详情</h3>
                                <p className="text-xs text-muted-foreground">从左侧分类导航中选择一个词条</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="gallery" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">画廊</h2>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          onClick={() => setShowUploadModal(true)}
                        >
                          <Upload className="w-3 h-3 mr-1" /> 提交图片
                        </Button>
                      </div>
                      
                      {galleryImages.length > 0 ? (
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
                      ) : (
                        <div className="border border-border rounded-lg p-8 bg-card">
                          <div className="text-center py-8 text-muted-foreground">
                            <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">暂无图片</p>
                            <p className="text-xs mt-1">点击右上角按钮上传图片</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="download" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">下载</h2>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          onClick={() => setShowDownloadUploadModal(true)}
                        >
                          <Upload className="w-3 h-3 mr-1" /> 上传版本
                        </Button>
                      </div>

                      {project.type === "mod" ? (
                        <div className="flex gap-4 min-h-[600px]">
                          <div className="w-1/2 flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-base font-semibold text-foreground">版本列表</h3>
                            </div>

                            <div className="flex gap-2 mb-3">
                              <select
                                value={versionFilter}
                                onChange={(e) => setVersionFilter(e.target.value)}
                                className="h-8 px-3 text-xs border border-input rounded-md bg-background flex-1"
                              >
                                <option value="all">所有游戏版本</option>
                                <option value="1.20.1">1.20.1</option>
                                <option value="1.19.2">1.19.2</option>
                                <option value="1.18.2">1.18.2</option>
                              </select>
                              <select
                                value={loaderFilter}
                                onChange={(e) => setLoaderFilter(e.target.value)}
                                className="h-8 px-3 text-xs border border-input rounded-md bg-background flex-1"
                              >
                                <option value="all">所有加载器</option>
                                <option value="Forge">Forge</option>
                                <option value="Fabric">Fabric</option>
                                <option value="NeoForge">NeoForge</option>
                                <option value="Quilt">Quilt</option>
                              </select>
                            </div>

                            <div className="flex-1 overflow-y-auto border border-border rounded-lg">
                              {resourceVersions.length > 0 ? (
                                <div className="divide-y divide-border">
                                  {resourceVersions
                                    .filter(v => versionFilter === "all" || v.gameVersion === versionFilter)
                                    .filter(v => loaderFilter === "all" || v.loader === loaderFilter)
                                    .map((v) => (
                                      <div 
                                        key={v.id} 
                                        className={`px-4 py-3 cursor-pointer transition-colors ${
                                          selectedDownloadVersion === v.id 
                                            ? "bg-primary/10 border-l-2 border-primary" 
                                            : "hover:bg-secondary/20"
                                        }`}
                                        onClick={() => setSelectedDownloadVersion(v.id)}
                                      >
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
                                          <span>{v.gameVersion}</span>
                                          <span>{v.releaseDate}</span>
                                          <span>{(v.downloads / 1000).toFixed(1)}K 下载</span>
                                          <span>{v.fileSize}</span>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="text-center py-12 text-muted-foreground text-sm">
                                  暂无版本
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="w-1/2 flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-base font-semibold text-foreground">联动模组</h3>
                            </div>

                            {selectedDownloadVersion ? (
                              <div className="flex-1 overflow-y-auto border border-border rounded-lg">
                                {(() => {
                                  const selectedVer = relatedVersions.find(v => v.id === selectedDownloadVersion);
                                  if (!selectedVer) return null;

                                  return (
                                    <>
                                      {selectedVer.prerequisites.length > 0 && (
                                        <div className="p-3 border-b border-border">
                                          <h4 className="text-xs font-semibold text-blue-600 mb-2 flex items-center gap-1">
                                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] mr-1">前置</Badge>
                                            前置模组
                                          </h4>
                                          <div className="space-y-2">
                                            {selectedVer.prerequisites.map((mod) => (
                                              <div key={mod.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                                                <div className="flex-1 min-w-0">
                                                  <div className="text-xs font-medium text-foreground truncate">{mod.name}</div>
                                                  <div className="text-[10px] text-muted-foreground truncate">{mod.description}</div>
                                                </div>
                                                <Button size="sm" className="h-6 px-2 text-xs ml-2">
                                                  <Download className="w-3 h-3 mr-1" /> 下载
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {selectedVer.dependencies.length > 0 && (
                                        <div className="p-3 border-b border-border">
                                          <h4 className="text-xs font-semibold text-purple-600 mb-2 flex items-center gap-1">
                                            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px] mr-1">依赖</Badge>
                                            依赖模组
                                          </h4>
                                          <div className="space-y-2">
                                            {selectedVer.dependencies.map((mod) => (
                                              <div key={mod.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                                                <div className="flex-1 min-w-0">
                                                  <div className="text-xs font-medium text-foreground truncate">{mod.name}</div>
                                                  <div className="text-[10px] text-muted-foreground truncate">{mod.description}</div>
                                                </div>
                                                <Button size="sm" className="h-6 px-2 text-xs ml-2">
                                                  <Download className="w-3 h-3 mr-1" /> 下载
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {selectedVer.integrations.length > 0 && (
                                        <div className="p-3">
                                          <h4 className="text-xs font-semibold text-green-600 mb-2 flex items-center gap-1">
                                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] mr-1">联动</Badge>
                                            联动模组
                                          </h4>
                                          <div className="space-y-2">
                                            {selectedVer.integrations.map((mod) => (
                                              <div key={mod.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                                                <div className="flex-1 min-w-0">
                                                  <div className="text-xs font-medium text-foreground truncate">{mod.name}</div>
                                                  <div className="text-[10px] text-muted-foreground truncate">{mod.description}</div>
                                                </div>
                                                <Button size="sm" className="h-6 px-2 text-xs ml-2">
                                                  <Download className="w-3 h-3 mr-1" /> 下载
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {selectedVer.prerequisites.length === 0 && selectedVer.dependencies.length === 0 && selectedVer.integrations.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground text-xs">
                                          该版本暂无联动模组
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full text-muted-foreground text-xs border border-border rounded-lg">
                                请在左侧选择一个版本查看联动模组
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="border border-border rounded-lg">
                          <div className="flex items-center justify-between p-3 border-b border-border">
                            <h3 className="text-base font-semibold text-foreground">版本列表</h3>
                            <select
                              value={versionFilter}
                              onChange={(e) => setVersionFilter(e.target.value)}
                              className="h-8 px-3 text-xs border border-input rounded-md bg-background"
                            >
                              <option value="all">所有游戏版本</option>
                              <option value="1.20.1">1.20.1</option>
                              <option value="1.19.2">1.19.2</option>
                              <option value="1.18.2">1.18.2</option>
                            </select>
                          </div>

                          {resourceVersions.length > 0 ? (
                            <div className="divide-y divide-border">
                              {resourceVersions
                                .filter(v => versionFilter === "all" || v.gameVersion === versionFilter)
                                .map((v) => (
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
                                      <span>{v.gameVersion}</span>
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
                          ) : (
                            <div className="text-center py-12 text-muted-foreground text-sm">
                              暂无版本
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </>
              )}

              {isImageProject && (
                <>
                  <TabsContent value="acquisition" className="mt-0">
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-foreground">获取</h2>
                      <div className="border border-border rounded-lg p-8 bg-card">
                        <div className="text-center">
                          <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">暂无可用版本</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            该项目还在开发中，尚未发布任何版本
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="gallery" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">画廊</h2>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 px-2 text-xs"
                          onClick={() => setShowUploadModal(true)}
                        >
                          <Upload className="w-3 h-3 mr-1" /> 提交图片
                        </Button>
                      </div>
                      
                      {galleryImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {galleryImages.map((image) => (
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
                      ) : (
                        <div className="border border-border rounded-lg p-8 bg-card">
                          <div className="text-center py-8 text-muted-foreground">
                            <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">暂无图片</p>
                            <p className="text-xs mt-1">点击右上角按钮上传图片</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </>
              )}

              {isImageProject && (
                <TabsContent value="download" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">获取</h2>
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
                              setSelectedAcquisition(project.basicInfo?.["使用条件"] || "免费");
                              setAcquisitionPrice(project.price || 99);
                              setAcquisitionSubscriptionPrice(project.subscriptionPrice || 19);
                              setShowAcquisitionEditModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3 mr-2" /> 修改获取方式
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="border border-border rounded-lg p-8 bg-card">
                      <div className="text-center">
                        <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">暂未设置获取方式</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          该项目还在开发中，尚未设置获取方式
                        </p>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 inline-block">
                          <p className="text-xs text-orange-600">
                            请点击右上角「管理」按钮设置获取方式并上传文件
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">获取方式说明</h4>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span><strong>免费</strong> - 所有用户可免费获取使用</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span><strong>定制</strong> - 首位买家独享，永久不再出售</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span><strong>买断</strong> - 一次性付费，永久使用</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span><strong>订阅</strong> - 订阅制作方后可使用</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}

              {(!isAuxiliaryResource && !isImageProject) && (
                <TabsContent value="guide" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">攻略</h2>
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
                        .sort((a, b) => ((b.views || 0) + (b.likes || 0) * 10) - ((a.views || 0) + (a.likes || 0) * 10))
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
                            <h3 className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                              {guide.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{((guide.views || 0) / 1000).toFixed(1)}K</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{guide.likes || 0}</span>
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
                              <span>{guide.date}</span>
                            </div>
                          </div>

                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {guide.content.split('\n').find((line: string) => line.trim() && !line.startsWith('#') && !line.startsWith('!')) || '点击查看完整内容...'}
                          </div>
                        </div>
                      ))}

                      {guides.filter(g => g.status === "approved").length === 0 && (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                          暂无攻略文章
                        </div>
                      )}
                    </div>

                    {showGuideDetailModal && selectedGuide && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-card border border-border rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
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
                                  <span>{selectedGuide.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{(selectedGuide.views || 0).toLocaleString()} 浏览</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  <span>{selectedGuide.likes || 0} 点赞</span>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowGuideDetailModal(false)}>
                              ×
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
                                <Heart className="w-3 h-3 mr-1" /> 点赞 {selectedGuide.likes || 0}
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

              {isAuxiliaryResource && (
                <TabsContent value="download" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">{project.type === "image" ? "获取" : "下载"}</h2>
                  
                  <div className="border border-border rounded-lg p-8 bg-card">
                    <div className="text-center">
                      <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">暂无可用版本</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        该项目还在开发中，尚未发布任何版本
                      </p>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 inline-block">
                        <p className="text-xs text-blue-600">
                          项目完成开发并上传首个版本后，将自动进入审核流程
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/20 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">项目状态</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">开发进度</span>
                        <span className="font-medium text-foreground">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-orange-500/30 text-orange-600">
                          开发中
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          创建于 {project.createdAt.toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              )}

              <TabsContent value="changelog" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">日志</h2>
                  
                  {mockChangeLogs.length > 0 ? (
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
                  ) : (
                    <div className="border border-border rounded-lg p-8 bg-card">
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">暂无日志</p>
                        <p className="text-xs mt-1">项目变更记录将显示在这里</p>
                      </div>
                    </div>
                  )}
                </div>
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

                  {licenses.length > 0 ? (
                    <div className="space-y-3">
                      {licenses.map((license) => (
                        <div 
                          key={license.id}
                          className="border rounded-lg p-4 bg-card hover:bg-secondary/20 transition-colors cursor-pointer border-blue-500/30 bg-blue-500/5"
                          onClick={() => {
                            setSelectedLicense({
                              type: license.type,
                              title: license.title,
                              description: license.description || ""
                            });
                            setShowLicenseDetailModal(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={license.type === "原创协议" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"}>
                                {license.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{license.title}</span>
                            </div>
                            <Badge className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-600 border-green-500/20">
                              当前
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg p-8 bg-card">
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm font-medium text-foreground mb-1">暂无协议</p>
                        <p className="text-xs mb-4">项目需要提交协议后才能发布</p>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 inline-block">
                          <p className="text-xs text-orange-600">
                            请点击右上角「提交协议」按钮，选择合适的协议模板并提交
                          </p>
                        </div>
                      </div>
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
                            {selectedLicense.type === "original-normal" && (
                              `【免责声明】

本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。

【基本声明】

本资源内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。

根据Minecraft官方政策，本资源属于游戏内容资源，必须免费提供给所有用户。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素。

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
• 禁止将本资源用于推广与Minecraft无关的产品、服务或品牌`
                            )}
                            {selectedLicense.type === "repost-normal" && (
                              `【免责声明】

本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。

【基本声明】

本资源内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。

根据Minecraft官方政策，本资源属于游戏内容资源，必须免费提供给所有用户。本资源已获得原作者授权，搬运至本平台供中文玩家使用。

【搬运声明】

本资源已获得原制作方的明确授权，允许搬运至本平台并交由搬运方进行管理。

搬运方承诺遵守原制作方的所有使用要求，并确保资源的完整性和合规性。搬运方应及时同步原资源的更新，保持资源内容的最新状态。

搬运方与原作者之间的约定：
• 搬运方需在资源页面明确标注原作者信息
• 搬运方需及时同步原作者的更新内容
• 搬运方不得擅自修改资源内容
• 如原作者要求下架，搬运方应立即配合`
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
                      <div className="bg-card border border-border rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-lg font-bold text-foreground mb-2">提交协议</h2>
                            <p className="text-xs text-muted-foreground">选择协议模板并进行编辑</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowLicenseSubmitModal(false)}>
                            ×
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-muted-foreground mb-2 block">选择协议模板</label>
                            <div className="grid grid-cols-2 gap-3">
                              <div
                                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                  selectedLicenseTemplate === "original-normal"
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-secondary/20"
                                }`}
                                onClick={() => {
                                  setSelectedLicenseTemplate("original-normal");
                                  setNewLicenseContent(`【免责声明】

本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。

【基本声明】

本资源内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。`);
                                }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">原创协议</Badge>
                                  <span className="text-[10px] text-muted-foreground">常规资源</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground">适用于非形象类资源</div>
                              </div>
                              <div
                                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                  selectedLicenseTemplate === "repost-normal"
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-secondary/20"
                                }`}
                                onClick={() => {
                                  setSelectedLicenseTemplate("repost-normal");
                                  setNewLicenseContent(`【免责声明】

本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。

【基本声明】

本资源内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。`);
                                }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-[10px]">搬运协议</Badge>
                                  <span className="text-[10px] text-muted-foreground">常规资源</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground">适用于非形象类资源</div>
                              </div>
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
                          <Button size="sm" variant="outline" className="h-8" onClick={() => {
                            setShowLicenseSubmitModal(false);
                            setSelectedLicenseTemplate(null);
                            setNewLicenseContent("");
                          }}>
                            取消
                          </Button>
                          <Button size="sm" className="h-8" disabled={!selectedLicenseTemplate || !newLicenseContent.trim()} onClick={() => {
                            if (selectedLicenseTemplate && newLicenseContent.trim()) {
                              const licenseType = selectedLicenseTemplate === "original-normal" ? "原创协议" : "搬运协议";
                              setLicenses([{
                                id: Date.now().toString(),
                                type: licenseType,
                                title: licenseType === "原创协议" ? "原创资源协议" : "搬运资源协议",
                                content: newLicenseContent,
                                date: new Date().toISOString().split('T')[0]
                              }]);
                              setShowLicenseSubmitModal(false);
                              setSelectedLicenseTemplate(null);
                              setNewLicenseContent("");
                            }
                          }}>
                            提交
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑项目信息</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">项目名称</label>
              <Input
                value={editedProject.title || ""}
                onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
                placeholder="输入项目名称..."
                className="text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">项目简介</label>
              <Textarea
                value={editedProject.description || ""}
                onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                placeholder="输入项目简介..."
                className="text-sm min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">制作方寄语</label>
              <Textarea
                value={editedProject.authorNote || ""}
                onChange={(e) => setEditedProject({ ...editedProject, authorNote: e.target.value })}
                placeholder="输入制作方寄语..."
                className="text-sm min-h-[80px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">项目类型</label>
              <select
                value={editedProject.type || "mod"}
                onChange={(e) => setEditedProject({ ...editedProject, type: e.target.value })}
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="mod">模组</option>
                <option value="map">地图</option>
                <option value="datapack">数据包</option>
                <option value="modpack">整合包</option>
                <option value="server">服务器</option>
                <option value="resourcepack">材质</option>
                <option value="shader">光影</option>
                <option value="building">建筑</option>
                <option value="audio">音频</option>
                <option value="ecoTool">生态工具</option>
                <option value="doc">知识文档</option>
                <option value="image">形象</option>
              </select>
            </div>

            {(() => {
              const tagSystem = getTagSystem(editedProject.type);
              const commonMeta = getCommonMeta(editedProject.type);
              
              const shouldShowTag = (tag: MainTag) => {
                if (!tag.conditionalOn) return true;
                const parentValue = (editedProject as any)[tag.conditionalOn.tagId];
                return parentValue === tag.conditionalOn.optionId;
              };
              
              return (
                <>
                  {tagSystem && tagSystem.mainTags && tagSystem.mainTags.filter(shouldShowTag).map((tag) => (
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
                                const currentValues = (editedProject as any)[tag.id] || [];
                                const newValues = currentValues.includes(option.id)
                                  ? currentValues.filter((v: string) => v !== option.id)
                                  : [...currentValues, option.id];
                                setEditedProject({ ...editedProject, [tag.id]: newValues });
                              } else {
                                setEditedProject({ ...editedProject, [tag.id]: option.id });
                              }
                            }}
                            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                              tag.multiSelect
                                ? ((editedProject as any)[tag.id] || []).includes(option.id)
                                  ? "bg-primary/10 border-primary/20 text-primary"
                                  : "border-border hover:bg-secondary"
                                : (editedProject as any)[tag.id] === option.id
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
                                const currentValues = (editedProject as any)[tag.id] || [];
                                const newValues = currentValues.includes(option.id)
                                  ? currentValues.filter((v: string) => v !== option.id)
                                  : [...currentValues, option.id];
                                setEditedProject({ ...editedProject, [tag.id]: newValues });
                              } else {
                                setEditedProject({ ...editedProject, [tag.id]: option.id });
                              }
                            }}
                            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                              tag.multiSelect
                                ? ((editedProject as any)[tag.id] || []).includes(option.id)
                                  ? "bg-primary/10 border-primary/20 text-primary"
                                  : "border-border hover:bg-secondary"
                                : (editedProject as any)[tag.id] === option.id
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
                </>
              );
            })()}
          </div>

          <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => setShowEditModal(false)}>取消</Button>
            <Button size="sm" onClick={() => {
              setProject(editedProject);
              setShowEditModal(false);
            }}>保存</Button>
          </div>
        </DialogContent>
      </Dialog>

      {showContentUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">添加内容</h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowContentUploadModal(false)}>
                ×
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
                      使用此分类
                    </Button>
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
                        placeholder="输入词条名称后按 Enter 或点击添加..."
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
                      placeholder="输入新热词名称..."
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

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">提交图片</h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowUploadModal(false)}>
                ×
              </Button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
              <div className="text-xs font-semibold text-blue-600 mb-2">上传规则</div>
              <ul className="text-[10px] text-muted-foreground space-y-1">
                <li>• 图片需与该项目相关，展示项目的使用效果或特色内容</li>
                <li>• 图片内容需健康向上，不得包含违规信息</li>
                <li>• 图片需为原创或已获得授权，不得侵犯他人版权</li>
                <li>• 上传的图片需经制作方审核后才会显示在画廊中</li>
                <li>• 请确保图片清晰，分辨率不低于 800x600</li>
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

      {showGuideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">提交攻略</h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowGuideModal(false)}>
                ×
              </Button>
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
                <label className="text-xs text-muted-foreground mb-1 block">攻略内容</label>
                <Textarea
                  value={newGuideContent}
                  onChange={(e) => setNewGuideContent(e.target.value)}
                  placeholder="输入攻略内容..."
                  className="text-sm min-h-[200px]"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="outline" onClick={() => setShowGuideModal(false)}>取消</Button>
                <Button size="sm" onClick={() => {
                  if (newGuideTitle && newGuideContent) {
                    setGuides([...guides, {
                      id: Date.now().toString(),
                      title: newGuideTitle,
                      content: newGuideContent,
                      author: "当前用户",
                      date: new Date().toISOString().split('T')[0],
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

      {showLicenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">提交协议</h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowLicenseModal(false)}>
                ×
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">协议类型</label>
                <select
                  value={selectedLicenseType}
                  onChange={(e) => setSelectedLicenseType(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
                >
                  <option value="">选择协议类型</option>
                  <option value="原创协议">原创协议</option>
                  <option value="搬运协议">搬运协议</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">协议标题</label>
                <Input
                  value={newLicenseTitle}
                  onChange={(e) => setNewLicenseTitle(e.target.value)}
                  placeholder="输入协议标题..."
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">协议内容</label>
                <Textarea
                  value={newLicenseContent}
                  onChange={(e) => setNewLicenseContent(e.target.value)}
                  placeholder="输入协议内容..."
                  className="text-sm min-h-[200px]"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="outline" onClick={() => setShowLicenseModal(false)}>取消</Button>
                <Button size="sm" onClick={() => {
                  if (selectedLicenseType && newLicenseTitle && newLicenseContent) {
                    setLicenses([...licenses, {
                      id: Date.now().toString(),
                      type: selectedLicenseType,
                      title: newLicenseTitle,
                      content: newLicenseContent,
                      date: new Date().toISOString().split('T')[0],
                    }]);
                    setSelectedLicenseType("");
                    setNewLicenseTitle("");
                    setNewLicenseContent("");
                    setShowLicenseModal(false);
                  }
                }}>提交</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAcquisitionEditModal && (
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
                      onClick={() => setSelectedAcquisition(type)}
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
                  setProject({
                    ...project,
                    basicInfo: {
                      ...project.basicInfo,
                      "使用条件": selectedAcquisition
                    },
                    price: acquisitionPrice,
                    subscriptionPrice: acquisitionSubscriptionPrice
                  });
                  setShowAcquisitionEditModal(false);
                }}
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {showImageUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">上传文件</h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowImageUploadModal(false)}>
                ×
              </Button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
              <div className="text-xs font-semibold text-blue-600 mb-2">上传规则</div>
              <ul className="text-[10px] text-muted-foreground space-y-1">
                <li>• 文件需为该形象资源的实际内容文件</li>
                <li>• 文件内容需健康向上，不得包含违规信息</li>
                <li>• 文件需为原创或已获得授权，不得侵犯他人版权</li>
                <li>• 请确保文件完整可用</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">文件链接</label>
                <Input
                  placeholder="输入文件URL..."
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">版本号</label>
                <Input
                  placeholder="例如: v1.0.0"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">更新说明</label>
                <Textarea
                  placeholder="描述这个版本的更新内容..."
                  className="text-sm min-h-[80px]"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="outline" onClick={() => setShowImageUploadModal(false)}>取消</Button>
                <Button size="sm" onClick={() => setShowImageUploadModal(false)}>上传</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubmitReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">完成筹备</h2>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowSubmitReviewModal(false)}>
                ×
              </Button>
            </div>

            <Separator className="my-4" />

            {!projectContract ? (
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="text-xs font-semibold text-blue-600 mb-2">完成筹备须知</div>
                  <ul className="text-[10px] text-muted-foreground space-y-1">
                    <li>• 完成筹备后将生成项目合同，包含项目方案和合作方信息</li>
                    <li>• 项目合同提交平台审核通过后，项目将进入制作中状态</li>
                    <li>• 筹备中状态的项目无需上传初版项目文件</li>
                    <li>• 请确保已接受合适的合作意向申请</li>
                  </ul>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">项目方案摘要</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-20">项目目标:</span>
                      <span className="text-foreground">{project.objectives || "未填写"}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-20">人员需求:</span>
                      <span className="text-foreground">
                        {project.personnel?.preparationStatus === "无需筹备" ? "无需筹备" : 
                          `${project.personnel?.count || "未填写"} · ${project.personnel?.cooperationType || "未选择"}`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-20">资金需求:</span>
                      <span className="text-foreground">
                        {project.funding?.preparationStatus === "无需筹备" ? "无需筹备" : 
                          `${project.funding?.amount || "未填写"} · ${project.funding?.cooperationType || "未选择"}`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-20">实施计划:</span>
                      <span className="text-foreground">{project.implementation?.timeline || "未填写"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">已接受的合作意向</h3>
                  {cooperationRequests.filter(r => r.status === "accepted").length === 0 ? (
                    <p className="text-xs text-muted-foreground">暂无已接受的合作意向</p>
                  ) : (
                    <div className="space-y-2">
                      {cooperationRequests.filter(r => r.status === "accepted").map((request) => (
                        <div key={request.id} className="flex items-center gap-2 p-2 bg-background rounded border border-border">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-foreground">{request.userName}</div>
                            <div className="text-[10px] text-muted-foreground">{request.userType} · {request.requestType}</div>
                          </div>
                          <Badge variant="outline" className="text-[10px]">{request.requestType}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">项目合同已生成</span>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    项目合同
                  </h3>
                  <div className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                    {projectContract}
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                  <div className="text-xs font-semibold text-orange-600 mb-2">提交审核须知</div>
                  <ul className="text-[10px] text-muted-foreground space-y-1">
                    <li>• 平台将审核项目合同的完整性和合规性</li>
                    <li>• 审核通过后项目将进入制作中状态</li>
                    <li>• 审核期间可继续完善项目内容</li>
                  </ul>
                </div>
              </div>
            )}

            <Separator className="my-4" />

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => {
                setShowSubmitReviewModal(false);
                setProjectContract(null);
              }}>
                取消
              </Button>
              {!projectContract ? (
                <Button 
                  size="sm"
                  onClick={() => {
                    const acceptedRequests = cooperationRequests.filter(r => r.status === "accepted");
                    const personnelRequests = acceptedRequests.filter(r => r.requestType === "人员合作");
                    const fundingRequests = acceptedRequests.filter(r => r.requestType === "资金合作");
                    
                    const contract = `项目合同

一、项目基本信息
项目名称：${project.title || "未命名项目"}
项目类型：${project.type || "未选择"}
项目发起方：${project.author || "未填写"}
创建时间：${project.createdAt?.toLocaleDateString() || new Date().toLocaleDateString()}

二、项目目标
${project.objectives || "未填写"}

三、人员事宜
筹备状态：${project.personnel?.preparationStatus || "未选择"}
需求人数：${project.personnel?.count || "未填写"}
合作方式：${project.personnel?.cooperationType || "未选择"}
详细说明：${project.personnel?.description || "未填写"}

已确认加入的生产方：
${personnelRequests.length > 0 ? personnelRequests.map((r, i) => 
  `${i + 1}. ${r.userName}（${r.userType}）
   合作说明：${r.message}`
).join("\n") : "暂无"}

四、资金事宜
筹备状态：${project.funding?.preparationStatus || "未选择"}
资金需求：${project.funding?.amount || "未填写"}
合作方式：${project.funding?.cooperationType || "未选择"}
详细说明：${project.funding?.description || "未填写"}

已确认加入的投资方：
${fundingRequests.length > 0 ? fundingRequests.map((r, i) => 
  `${i + 1}. ${r.userName}（${r.userType}）
   合作说明：${r.message}`
).join("\n") : "暂无"}

五、实施计划
预计时间：${project.implementation?.timeline || "未填写"}
详细说明：${project.implementation?.description || "未填写"}

六、合作规则
1. 项目发起方负责项目的整体规划和管理
2. 生产方按照分工完成各自负责的开发任务
3. 投资方按照约定提供资金支持
4. 收益分配按照各方约定的合作方式执行
5. 项目相关决策由项目发起方主导，重大决策需各方协商

七、声明
本合同由项目发起方、生产方、投资方共同确认，各方应遵守合同约定，共同推进项目完成。

合同生成时间：${new Date().toLocaleString()}`;
                    
                    setProjectContract(contract);
                  }}
                >
                  生成项目合同
                </Button>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => {
                    setShowSubmitReviewModal(false);
                    setProjectContract(null);
                    setProject({
                      ...project,
                      projectStatus: "制作中",
                      status: "审核中"
                    });
                  }}
                >
                  提交平台审核
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showCooperationRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">申请合作</h2>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowCooperationRequestModal(false)}>
                ×
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">合作类型</label>
                <div className="flex gap-2">
                  {["人员合作", "资金合作"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewCooperationRequest({ ...newCooperationRequest, requestType: type })}
                      className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                        newCooperationRequest.requestType === type
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">申请说明</label>
                <Textarea
                  placeholder="请详细说明您的合作意向，包括您的技能、经验或资源..."
                  className="text-sm min-h-[150px]"
                  value={newCooperationRequest.message}
                  onChange={(e) => setNewCooperationRequest({ ...newCooperationRequest, message: e.target.value })}
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="text-xs font-semibold text-blue-600 mb-2">申请须知</div>
                <ul className="text-[10px] text-muted-foreground space-y-1">
                  <li>• 请详细说明您的技能、经验或可提供的资源</li>
                  <li>• 项目发起方将审核您的申请并决定是否接受</li>
                  <li>• 申请通过后，您将成为项目团队成员</li>
                  <li>• 请保持联系方式畅通，以便项目方与您沟通</li>
                </ul>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowCooperationRequestModal(false)}>
                取消
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  if (newCooperationRequest.message.trim()) {
                    setCooperationRequests([
                      {
                        id: Date.now().toString(),
                        userId: "current-user",
                        userName: "当前用户",
                        userAvatar: "",
                        userType: "开发者",
                        requestType: newCooperationRequest.requestType,
                        message: newCooperationRequest.message,
                        status: "pending" as const,
                        createdAt: new Date(),
                      },
                      ...cooperationRequests
                    ]);
                    setNewCooperationRequest({ requestType: "人员合作", message: "" });
                    setShowCooperationRequestModal(false);
                  }
                }}
              >
                提交申请
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEditPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">编辑项目方案</h2>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowEditPlanModal(false)}>
                ×
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> 项目目标
                </label>
                <p className="text-xs text-muted-foreground mb-2">描述该项目创建后目的是产出一个具体怎样的内容</p>
                <Textarea
                  placeholder="请输入项目目标..."
                  className="text-sm min-h-[100px]"
                  value={project.objectives || ""}
                  onChange={(e) => setProject({ ...project, objectives: e.target.value })}
                />
              </div>

              <Separator />

              <div>
                <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> 人员事宜
                </label>
                <p className="text-xs text-muted-foreground mb-3">说明完成该项目需要多少人参与以及合作方式</p>
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-1 block">筹备状态</label>
                  <div className="flex flex-wrap gap-1">
                    {["筹备中", "筹备完成", "无需筹备"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setProject({ 
                          ...project, 
                          personnel: { ...project.personnel, preparationStatus: status } 
                        })}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          project.personnel?.preparationStatus === status
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">预计参与人数</label>
                    <Input
                      placeholder="例如: 5人"
                      className="text-sm"
                      value={project.personnel?.count || ""}
                      onChange={(e) => setProject({ 
                        ...project, 
                        personnel: { ...project.personnel, count: e.target.value } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">合作方式</label>
                    <div className="flex flex-wrap gap-1">
                      {["无偿", "仅分成", "仅报酬", "全部"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setProject({ 
                            ...project, 
                            personnel: { ...project.personnel, cooperationType: type } 
                          })}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            project.personnel?.cooperationType === type
                              ? "bg-primary/10 border-primary/20 text-primary"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Textarea
                  placeholder="详细说明人员事宜，如分成或报酬的具体数额..."
                  className="text-sm min-h-[80px]"
                  value={project.personnel?.description || ""}
                  onChange={(e) => setProject({ 
                    ...project, 
                    personnel: { ...project.personnel, description: e.target.value } 
                  })}
                />
              </div>

              <Separator />

              <div>
                <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> 资金事宜
                </label>
                <p className="text-xs text-muted-foreground mb-3">说明完成该项目需要多少资金以及合作方式</p>
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-1 block">筹备状态</label>
                  <div className="flex flex-wrap gap-1">
                    {["筹备中", "筹备完成", "无需筹备"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setProject({ 
                          ...project, 
                          funding: { ...project.funding, preparationStatus: status } 
                        })}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          project.funding?.preparationStatus === status
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">预计资金需求</label>
                    <Input
                      placeholder="例如: 5000元"
                      className="text-sm"
                      value={project.funding?.amount || ""}
                      onChange={(e) => setProject({ 
                        ...project, 
                        funding: { ...project.funding, amount: e.target.value } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">合作方式</label>
                    <div className="flex flex-wrap gap-1">
                      {["无偿", "仅分成", "仅报酬", "全部"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setProject({ 
                            ...project, 
                            funding: { ...project.funding, cooperationType: type } 
                          })}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            project.funding?.cooperationType === type
                              ? "bg-primary/10 border-primary/20 text-primary"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Textarea
                  placeholder="详细说明资金事宜，如分成或报酬的具体数额..."
                  className="text-sm min-h-[80px]"
                  value={project.funding?.description || ""}
                  onChange={(e) => setProject({ 
                    ...project, 
                    funding: { ...project.funding, description: e.target.value } 
                  })}
                />
              </div>

              <Separator />

              <div>
                <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 实施计划
                </label>
                <p className="text-xs text-muted-foreground mb-3">说明大概多少时间完成以及如何完成</p>
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-1 block">预计完成时间</label>
                  <Input
                    placeholder="例如: 2024年12月"
                    className="text-sm"
                    value={project.timeline?.deadline || ""}
                    onChange={(e) => setProject({ 
                      ...project, 
                      timeline: { ...project.timeline, deadline: e.target.value } 
                    })}
                  />
                </div>
                <Textarea
                  placeholder="详细说明实施计划..."
                  className="text-sm min-h-[80px]"
                  value={project.timeline?.description || ""}
                  onChange={(e) => setProject({ 
                    ...project, 
                    timeline: { ...project.timeline, description: e.target.value } 
                  })}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowEditPlanModal(false)}>
                取消
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  setShowEditPlanModal(false);
                }}
              >
                保存修改
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
