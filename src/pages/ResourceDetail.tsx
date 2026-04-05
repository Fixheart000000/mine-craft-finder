import { useState } from "react";
import { useParams, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Download, Heart, Send, User, Eye, BookmarkPlus, Plus, X, ChevronDown, ChevronRight, Edit2, Image, Link2, Trash2, Save, XCircle, History, Upload, Star, StarOff, Edit, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { tagSystemMap } from "@/data/tags";
import { contentCommonMeta, auxiliaryCommonMeta, modpackServerCommonMeta } from "@/data/tags/commonMeta";

interface WikiEntry {
  id: string;
  name: string;
  category: string;
  type: "item" | "block" | "entity" | "mechanic" | "structure" | "other";
  images: Array<{
    url: string;
    caption: string;
    isCover: boolean;
  }>;
  description: string;
  recipes: Array<{
    type: "crafting" | "smelting" | "custom";
    pattern: string[][];
    ingredients: Record<string, string>;
    result: { item: string; count: number };
  }>;
  attributes: Array<{
    name: string;
    value: string;
    unit?: string;
  }>;
  usage: string;
  relatedEntries: string[];
  author: string;
  updatedAt: Date;
  version: number;
  history: Array<{
    version: number;
    author: string;
    updatedAt: Date;
    changes: string;
    snapshot: Partial<WikiEntry>;
  }>;
}

const mockWikiEntries: Record<string, WikiEntry> = {
  "动力源": {
    id: "power-source",
    name: "动力源",
    category: "物品/方块",
    type: "block",
    images: [
      { url: "/placeholder-power-source.png", caption: "动力源外观", isCover: true },
    ],
    description: "动力源是机械动力的核心组件，提供旋转动能。它可以被多种方式驱动，包括水流、风力、蒸汽等。动力源是所有机械设备的能量起点，通过动力轴将动能传输到其他机器。",
    recipes: [
      {
        type: "crafting",
        pattern: [
          ["铁锭", "铁锭", "铁锭"],
          ["", "活塞", ""],
          ["铁锭", "铁锭", "铁锭"],
        ],
        ingredients: { "铁锭": "iron_ingot", "活塞": "piston" },
        result: { item: "动力源", count: 1 },
      },
    ],
    attributes: [
      { name: "最大转速", value: "256", unit: "RPM" },
      { name: "应力消耗", value: "4", unit: "SU" },
      { name: "耐久度", value: "无限", unit: "" },
    ],
    usage: "1. 将动力源放置在地面\n2. 使用动力轴连接到其他机器\n3. 提供动力源（水流、风力等）\n4. 机器开始运转",
    relatedEntries: ["传送带", "机械臂", "动力轴", "齿轮箱"],
    author: "创世工匠",
    updatedAt: new Date("2024-11-15"),
    version: 2,
    history: [
      {
        version: 1,
        author: "创世工匠",
        updatedAt: new Date("2024-11-10"),
        changes: "创建词条",
        snapshot: { description: "动力源是机械动力的核心组件。" }
      }
    ],
  },
  "传送带": {
    id: "conveyor-belt",
    name: "传送带",
    category: "物品/方块",
    type: "block",
    images: [],
    description: "传送带用于自动传输物品，是自动化产线的基础组件。可以连接多个传送带形成长距离传输线路，支持转弯和上下坡。",
    recipes: [],
    attributes: [
      { name: "传输速度", value: "1", unit: "物品/秒" },
      { name: "最大长度", value: "无限", unit: "" },
    ],
    usage: "放置传送带并连接动力源即可开始传输物品。",
    relatedEntries: ["动力源", "机械臂", "物品管道"],
    author: "创世工匠",
    updatedAt: new Date("2024-11-15"),
    version: 1,
    history: [],
  },
  "动力网络": {
    id: "power-network",
    name: "动力网络",
    category: "多方块结构",
    type: "structure",
    images: [],
    description: "动力网络是由动力源、动力轴、齿轮箱等组成的动能传输系统。通过合理的布局，可以将动能高效地分配到各个机器设备。",
    recipes: [],
    attributes: [
      { name: "网络类型", value: "独立网络", unit: "" },
      { name: "总应力容量", value: "根据动力源计算", unit: "SU" },
    ],
    usage: "1. 放置动力源作为网络起点\n2. 使用动力轴连接各个机器\n3. 使用齿轮箱分流动力\n4. 确保应力不超过容量",
    relatedEntries: ["动力源", "动力轴", "齿轮箱", "应力计"],
    author: "创世工匠",
    updatedAt: new Date("2024-11-15"),
    version: 1,
    history: [],
  },
};

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
    timestamp: new Date("2024-12-01 14:30:00"),
    author: "创世工匠",
    action: "create",
    section: "基本介绍",
    description: "创建资源",
    details: "首次发布模组资源，包含基础的机械动力系统"
  },
  {
    id: "2",
    timestamp: new Date("2024-12-05 10:15:00"),
    author: "创世工匠",
    action: "update",
    section: "基本介绍",
    description: "更新资源简介",
    details: "优化了资源简介的描述，增加了更多功能说明"
  },
  {
    id: "3",
    timestamp: new Date("2024-12-08 16:45:00"),
    author: "创世工匠",
    action: "update",
    section: "下载",
    description: "添加新版本 v1.2.0",
    details: "新增了传送带系统，修复了动力源崩溃问题，优化了性能"
  },
  {
    id: "4",
    timestamp: new Date("2024-12-10 09:20:00"),
    author: "创世工匠",
    action: "update",
    section: "内容详情",
    description: "添加热词词条",
    details: "在物品/方块分类下添加了「动力源」「传送带」等词条"
  },
  {
    id: "5",
    timestamp: new Date("2024-12-12 11:30:00"),
    author: "创世工匠",
    action: "update",
    section: "下载",
    description: "添加联动模组",
    details: "为 v1.2.0 版本添加了前置模组「机械核心」和联动模组「工业时代」"
  },
  {
    id: "6",
    timestamp: new Date("2024-12-15 15:00:00"),
    author: "创世工匠",
    action: "update",
    section: "协议",
    description: "提交原创协议",
    details: "提交并发布了资源的原创协议"
  },
  {
    id: "7",
    timestamp: new Date("2024-12-18 13:45:00"),
    author: "创世工匠",
    action: "update",
    section: "基本介绍",
    description: "更新基本信息",
    details: "修改了内容方向标签，从「科技」调整为「科技、辅助」"
  },
  {
    id: "8",
    timestamp: new Date("2024-12-20 10:00:00"),
    author: "创世工匠",
    action: "update",
    section: "内容详情",
    description: "编辑词条内容",
    details: "更新了「动力源」词条的描述和配方信息"
  },
  {
    id: "9",
    timestamp: new Date("2024-12-22 14:20:00"),
    author: "创世工匠",
    action: "update",
    section: "下载",
    description: "添加新版本 v1.3.0",
    details: "新增了多方块结构系统，添加了齿轮箱和应力计"
  },
  {
    id: "10",
    timestamp: new Date("2024-12-25 16:30:00"),
    author: "创世工匠",
    action: "update",
    section: "内容详情",
    description: "创建新热词分类",
    details: "创建了「多方块结构」热词分类，并添加了「动力网络」词条"
  }
];

function createDefaultEntry(name: string, category: string): WikiEntry {
  return {
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    category,
    type: "other",
    images: [],
    description: `这是${name}的描述信息。点击编辑按钮添加详细内容。`,
    recipes: [],
    attributes: [],
    usage: "",
    relatedEntries: [],
    author: "用户",
    updatedAt: new Date(),
    version: 1,
    history: [],
  };
}

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
                        {recipe.pattern.flat().map((item, pIndex) => (
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
                      <div className="text-xs text-muted-foreground">产出: {recipe.result.item} x{recipe.result.count}</div>
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

const allHotWordCategories = [
  { id: "items", label: "物品/方块", description: "新增的物品、方块、材料等" },
  { id: "tools", label: "工具/装备", description: "工具、武器、盔甲等装备类物品" },
  { id: "crops", label: "农作物/食材", description: "作物、食材、原料等" },
  { id: "foods", label: "食物/料理", description: "可食用的食物、料理等" },
  { id: "biomes", label: "群系/群落", description: "生物群系、地形类型" },
  { id: "dimensions", label: "世界/维度", description: "新维度、传送门" },
  { id: "mobs", label: "生物/实体", description: "友好生物、中立生物、敌对生物、NPC等" },
  { id: "bosses", label: "Boss/首领", description: "Boss怪物、首领级敌人" },
  { id: "enchantments", label: "附魔/魔咒", description: "附魔效果、魔咒" },
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
  { id: "crafting", label: "合成/配方", description: "合成配方、加工方式" },
  { id: "redstone", label: "红石/电路", description: "红石系统、电路元件" },
  { id: "quests", label: "任务/成就", description: "任务系统、成就系统" },
  { id: "trading", label: "交易/经济", description: "交易系统、经济系统" },
  { id: "villagers", label: "村民/交易", description: "村民职业、交易内容" },
  { id: "skills", label: "技能/能力", description: "技能系统、能力系统" },
  { id: "hotkeys", label: "热键/指令", description: "快捷键、指令" },
  { id: "gameSettings", label: "游戏设定", description: "游戏机制、系统设定" },
  { id: "mechanics", label: "机制/系统", description: "核心机制、游戏系统" },
];

const mockResourceData: Record<string, any> = {
  "mod-1": {
    type: "mod",
    title: "机械动力：工业革命",
    author: "创世工匠",
    authorType: "模组开发团队",
    description: "一款专注于机械自动化与工业生产的科技模组。引入全新的动能传输系统、多种类型的机器设备，以及复杂的自动化生产线。玩家可以从最基础的手动加工开始，逐步建立起庞大的工业帝国。支持与其他科技模组的联动，提供丰富的API接口。",
    authorNote: "感谢所有支持我们的玩家！这个模组是我们团队两年心血的结晶。我们希望带给玩家真正的工业革命体验，而不仅仅是简单的机器堆砌。如果你在游玩过程中遇到任何问题，或者有好的建议，欢迎在评论区留言！",
    tags: ["科技", "自动化", "Fabric"],
    basicInfo: {
      "内容方向": "科技工业",
      "内容风格": "写实风、科幻风",
      "独特系统": "自动化产线、能源网络、物流系统",
      "加载器": "Fabric",
      "叙事": "无叙事",
      "模组权重": "核心主体",
      "维护状态": "活跃维护",
      "游戏版本": "1.20.x",
      "产出方式": "原创",
      "产出时间": "2023.06",
      "运行环境": "客户端需装、服务端需装",
      "许可证类型": "开源",
      "性能负载": "高负载",
      "内容规模": "大体量",
      "体验体量": "大型 300分钟+",
      "难易度": "标准",
      "情感导向": "快乐/创造、成就/满足",
      "数值平衡": "原版平衡",
    },
    contentDetails: {
      "物品/方块": ["动力源", "传送带", "机械臂", "齿轮箱", "动力轴", "应力计", "动力泵", "旋转力场"],
      "工具/装备": ["工程师护目镜", "扳手", "动力钻头"],
      "机器/设备": ["动力辊压机", "搅拌机", "机械压榨机", "石磨", "鼓风机", "喷射器"],
      "多方块结构": ["动力网络", "自动化产线", "面粉加工线", "矿石处理线"],
      "能源/动力": ["旋转动能", "应力系统", "动力传输"],
      "物流/管道": ["传送带系统", "物品管道", "流体管道"],
      "BUFF/DEBUFF": ["过热", "过载", "应力过载"],
      "热键/指令": ["J - 打开机器配置界面", "K - 动能网络视图"],
      "游戏设定": ["动能传输系统", "机器自动化", "工业生产链", "应力管理"],
      "机制/系统": ["旋转动力系统", "应力计算", "齿轮传动"],
    },
    downloads: 125000,
    views: 890000,
    favorites: 15600,
    likes: 8900,
    donationLeaders: [
      { name: "工业迷", amount: "50k", avatar: "🏆" },
      { name: "自动化爱好者", amount: "35k", avatar: "🌟" },
      { name: "红石工程师", amount: "28k", avatar: "💎" },
    ],
    donationFeed: [
      { user: "工业迷", date: "2024.11.15", amount: "2k" },
      { user: "新手玩家", date: "2024.11.14", amount: "0.5k" },
    ],
    comments: [
      { user: "科技玩家", date: "2024-11-15", content: "终于等到1.20版本了！" },
      { user: "自动化达人", date: "2024-11-14", content: "动能系统设计得太棒了" },
    ],
  },
  "mod-2": {
    type: "mod",
    title: "暮色森林（搬运）",
    author: "Benimatic（原作者）",
    authorType: "搬运者：暮色搬运组",
    description: "探索神秘的暮色森林维度，挑战强大的Boss，发现隐藏的宝藏和古老的遗迹。这是一个经典的冒险模组，包含多个独特的生物群系、复杂的地下城和丰富的战利品系统。本资源已获得原作者授权，搬运至本平台供中文玩家使用。",
    authorNote: "作为暮色森林的搬运者，我们承诺保持模组的完整性和原汁原味。所有更新都会第一时间同步，确保中文玩家能够获得最佳的游戏体验。如有任何问题，欢迎在评论区反馈！",
    tags: ["冒险", "维度", "Boss"],
    basicInfo: {
      "内容方向": "冒险",
      "加载器": "Forge",
      "游戏版本": "1.20.x",
      "产出方式": "搬运",
      "产出时间": "2024.10",
      "运行环境": "客户端需装、服务端需装",
      "许可证类型": "开源",
      "性能负载": "中负载",
      "内容规模": "大体量",
      "体验体量": "大型 300分钟+",
      "难易度": "标准",
      "情感导向": "好奇/探索、成就/满足",
      "数值平衡": "原版平衡",
    },
    contentDetails: {
      "群系/群落": ["暮色森林", "黑暗森林", "蘑菇森林", "火焰沼泽", "冰川"],
      "世界/维度": ["暮色维度"],
      "结构/建筑": ["娜迦庭院", "巫妖塔", "迷宫", "九头蛇巢穴", "巨魔洞穴"],
      "Boss/首领": ["娜迦", "巫妖", "九头蛇", "幻影骑士", "雪怪"],
      "生物/实体": ["暮色鹿", "松鼠", "乌鸦", "迷你僵尸", "骷髅德鲁伊"],
      "物品/方块": ["暮色橡木", "魔法地图", "暮色护甲", "玻璃剑"],
      "附魔/魔咒": ["灼烧", "冰霜"],
      "成就/进度": ["暮色探索者", "Boss猎手", "宝藏猎人"],
      "游戏设定": ["暮色传送门", "进度系统", "Boss挑战顺序"],
    },
    downloads: 200000,
    views: 1500000,
    favorites: 25000,
    likes: 15000,
    donationLeaders: [
      { name: "冒险王", amount: "80k", avatar: "🏆" },
      { name: "暮色迷", amount: "60k", avatar: "🌟" },
      { name: "探索者", amount: "45k", avatar: "💎" },
    ],
    donationFeed: [
      { user: "暮色粉丝", date: "2024.11.16", amount: "3k" },
      { user: "新玩家", date: "2024.11.15", amount: "1k" },
    ],
    comments: [
      { user: "老玩家", date: "2024-11-16", content: "经典模组，必装！" },
      { user: "冒险爱好者", date: "2024-11-15", content: "搬运辛苦了，更新很及时" },
    ],
  },
  "map-1": {
    type: "map",
    title: "失落王国：暗影诅咒",
    author: "暗影建筑师",
    authorType: "地图创作工作室",
    description: "一款沉浸式冒险地图，讲述一个被诅咒笼罩的古老王国的故事。玩家将扮演最后一位王室后裔，穿越被黑暗侵蚀的城堡、地下迷宫和神秘森林，解开古老的谜题，击败强大的Boss，最终拯救这片土地。地图包含完整的剧情线、自定义音效和精心设计的机关陷阱。",
    authorNote: "这张地图我们团队花了整整半年时间打磨，每一个细节都经过反复推敲。希望你们能沉浸在这个故事中，感受失落王国的悲壮与希望。如果喜欢的话，别忘了给我们点个赞！",
    tags: ["冒险", "剧情", "解谜"],
    basicInfo: {
      "内容方向": "冒险剧情、解密探索",
      "内容场景": "建筑群场景、地形场景",
      "内容风格": "奇幻风、中世纪",
      "叙事": "有叙事",
      "游戏版本": "1.20.x",
      "产出方式": "原创",
      "产出时间": "2024.05",
      "运行环境": "不涉及",
      "许可证类型": "闭源",
      "性能负载": "中负载",
      "内容规模": "大体量",
      "体验体量": "大型 300分钟+",
      "难易度": "困难/挑战",
      "情感导向": "神秘/悬疑、紧张/压迫、悲伤/感动",
      "内容警示": "恐怖警告、黑暗主题",
    },
    contentDetails: {
      "物品/方块": ["古老的钥匙", "诅咒之石", "王国徽章", "暗影碎片"],
      "结构/建筑": ["失落城堡", "地下迷宫", "神秘森林", "王座大厅"],
      "地牢/副本": ["暗影地牢", "诅咒墓穴", "深渊试炼"],
      "Boss/首领": ["暗影领主", "诅咒骑士", "堕落国王"],
      "生物/实体": ["暗影仆从", "诅咒亡灵", "幽灵守卫"],
      "任务/成就": ["拯救王国", "解除诅咒", "寻找真相"],
      "游戏设定": ["诅咒系统", "剧情分支", "多结局"],
    },
    downloads: 45000,
    views: 320000,
    favorites: 5600,
    likes: 3200,
    donationLeaders: [
      { name: "冒险家", amount: "15k", avatar: "🏆" },
      { name: "剧情党", amount: "10k", avatar: "🌟" },
    ],
    donationFeed: [
      { user: "故事爱好者", date: "2024.10.20", amount: "1k" },
    ],
    comments: [
      { user: "RPG玩家", date: "2024-10-22", content: "剧情太感人了，结局哭死" },
    ],
  },
  "datapack-1": {
    type: "datapack",
    title: "原版增强：生存进化",
    author: "数据大师",
    authorType: "数据包开发者",
    description: "一个轻量级但功能丰富的数据包，在不改变原版风格的前提下增强生存体验。新增多种合成配方、改进的刷怪机制、更合理的战利品表，以及一系列生活质量改进。完美兼容原版游戏，无需任何模组即可使用。",
    authorNote: "我一直觉得原版生存还有很多可以优化的地方，所以做了这个数据包。希望它能让你的生存之旅更加顺畅有趣！有任何建议欢迎反馈。",
    tags: ["生存", "原版增强", "轻量"],
    basicInfo: {
      "内容方向": "功能增强、规则修改",
      "内容风格": "不涉及",
      "叙事": "无叙事",
      "游戏版本": "1.20.x",
      "产出方式": "原创",
      "产出时间": "2024.02",
      "运行环境": "服务端需装",
      "许可证类型": "开源",
      "性能负载": "低负载",
      "内容规模": "轻体量",
      "体验体量": "不涉及",
      "难易度": "休闲/简单",
      "情感导向": "快乐/创造",
      "数值平衡": "温和数值",
    },
    contentDetails: {
      "合成/配方": ["新增合成配方", "熔炉配方优化", "切石机配方扩展"],
      "游戏设定": ["刷怪机制改进", "战利品表优化", "生活质量改进"],
      "机制/系统": ["生存增强", "平衡调整"],
    },
    downloads: 89000,
    views: 560000,
    favorites: 12000,
    likes: 5600,
    donationLeaders: [],
    donationFeed: [],
    comments: [
      { user: "原版党", date: "2024-11-10", content: "终于有不用装模组的增强包了" },
    ],
  },
  "modpack-1": {
    type: "modpack",
    title: "科技纪元：太空探索",
    author: "整合包工作室",
    authorType: "整合包制作团队",
    description: "一款以太空探索为主题的科技向整合包。从地球起步，建立工业基础，发展航天技术，最终征服星辰大海。包含超过200个精心挑选和配置的模组，涵盖科技、魔法、探索等多个领域。提供完整的任务线和成就系统引导玩家。",
    authorNote: "这个整合包是我们对太空梦想的致敬。我们花了很多时间调整模组之间的平衡，确保玩家能获得流畅的游玩体验。祝你们探索愉快！",
    tags: ["科技", "太空", "探索"],
    basicInfo: {
      "内容方向": "科技工业、冒险探索",
      "内容风格": "科幻风",
      "叙事": "有叙事",
      "游戏版本": "1.19.x",
      "产出方式": "原创",
      "产出时间": "2023.11",
      "许可证类型": "闭源",
      "性能负载": "高负载",
      "内容规模": "大体量",
      "体验体量": "大型 300分钟+",
      "难易度": "标准",
      "情感导向": "好奇/探索、成就/满足、震撼/敬畏",
      "数值平衡": "原版平衡",
    },
    contentDetails: {
      "物品/方块": ["火箭", "空间站组件", "宇航服", "太阳能板", "氧气瓶", "太空舱"],
      "工具/装备": ["宇航服套装", "太空工具", "激光武器"],
      "群系/群落": ["月球荒原", "火星沙漠", "小行星带"],
      "世界/维度": ["月球", "火星", "金星", "空间站", "小行星带"],
      "生物/实体": ["外星生物", "太空怪物"],
      "机器/设备": ["火箭发射台", "燃料精炼厂", "氧气生成器"],
      "多方块结构": ["火箭", "空间站", "卫星"],
      "能源/动力": ["电力系统", "太阳能", "核能"],
      "BUFF/DEBUFF": ["缺氧", "低重力", "辐射"],
      "自然生成": ["月球陨石坑", "火星峡谷", "外星遗迹"],
      "任务/成就": ["太空探索任务线", "科技发展成就"],
      "热键/指令": ["G - 打开星图", "H - 宇航服状态"],
      "游戏设定": ["氧气系统", "重力系统", "航天科技"],
    },
    downloads: 230000,
    views: 1500000,
    favorites: 32000,
    likes: 15600,
    donationLeaders: [
      { name: "太空迷", amount: "80k", avatar: "🏆" },
    ],
    donationFeed: [],
    comments: [],
  },
  "server-1": {
    type: "server",
    title: "纯净生存服",
    author: "纯净团队",
    authorType: "服务器运营团队",
    description: "原版纯净生存体验，无模组修改，仅基础服务端插件。提供原版生存、原版极限、原版创造三种游戏模式，让玩家体验最纯粹的Minecraft乐趣。",
    authorNote: "我们坚持原版体验，拒绝任何可能破坏游戏平衡的模组，让每一位玩家都能享受最纯粹的Minecraft！",
    tags: ["纯净服", "生存", "原版"],
    basicInfo: {
      "服务器类型": "纯净服",
      "联机特性": "JAVA桌面和移动端互通",
      "内容方向": "原版生存",
      "产出方式": "原创",
      "产出时间": "2021.03",
      "性能负载": "低负载",
      "内容规模": "普通",
      "体验体量": "大型 300分钟+",
      "难易度": "标准",
      "情感导向": "放松/治愈、快乐/创造、怀旧/回忆",
    },
    downloads: 0,
    views: 320000,
    favorites: 8900,
    likes: 8900,
    onlinePlayers: 156,
    donationLeaders: [],
    donationFeed: [],
    comments: [],
  },
  "server-2": {
    type: "server",
    title: "方块王国 RPG",
    author: "王国运营组",
    authorType: "服务器运营团队",
    description: "一个专注于RPG体验的整合服。拥有独特的职业系统、经济系统、公会战和丰富的副本内容。玩家可以选择战士、法师、弓箭手等多种职业，通过完成任务和打怪升级，参与每周的公会战争，争夺领地和资源。",
    authorNote: "我们致力于打造一个公平、有趣、长久的RPG生存社区。服务器已稳定运营两年，欢迎新玩家加入我们的大家庭！",
    tags: ["整合服", "RPG", "职业"],
    basicInfo: {
      "服务器类型": "整合服",
      "联机特性": "仅JAVA桌面端",
      "内容方向": "角色扮演类、冒险类、竞技类",
      "视觉基调": "奇幻风",
      "产出方式": "原创",
      "产出时间": "2022.08",
      "性能负载": "中负载",
      "内容规模": "大体量",
      "体验体量": "大型 300分钟+",
      "难易度": "标准",
      "情感导向": "快乐/创造、共情/代入、成就/满足",
      "内容警示": "不涉及",
      "数值平衡": "强化数值",
    },
    downloads: 0,
    views: 450000,
    favorites: 15600,
    likes: 15600,
    onlinePlayers: 328,
    donationLeaders: [],
    donationFeed: [],
    comments: [],
  },
  "resourcepack-1": {
    type: "resourcepack",
    title: "像素幻想 32x",
    author: "像素艺术家",
    authorType: "材质创作者",
    description: "一款融合像素艺术与奇幻风格的材质包。在保持原版像素感的同时，为每个方块和物品注入更多细节和色彩。特别适合喜欢奇幻风格的玩家，与光影模组搭配效果更佳。",
    authorNote: "这是我第一个公开发布的材质包，希望你们喜欢！如果有什么建议或者发现bug，请告诉我，我会持续更新改进的。",
    tags: ["奇幻", "像素", "32x"],
    basicInfo: {
      "内容风格": "奇幻风、像素风",
      "游戏版本": "1.20.x",
      "产出方式": "原创",
      "产出时间": "2024.03",
      "许可证类型": "闭源",
      "性能负载": "低负载",
      "内容规模": "普通",
      "体验体量": "不涉及",
      "情感导向": "快乐/创造、震撼/敬畏",
      "内容警示": "不涉及",
    },
    downloads: 34000,
    views: 180000,
    favorites: 4500,
    likes: 2100,
    donationLeaders: [],
    donationFeed: [],
    comments: [],
  },
  "shader-1": {
    type: "shader",
    title: "柔和光影 Pro",
    author: "光影工作室",
    authorType: "光影开发者",
    description: "一款追求真实感与性能平衡的光影包。采用优化的光照算法，实现柔和的阴影、逼真的水面反射和动态云彩。支持多种显卡配置，低配电脑也能流畅运行。",
    authorNote: "我们相信好的光影不应该只属于高端电脑。这款光影经过反复优化，希望让更多玩家享受到美丽的光影效果。",
    tags: ["真实", "柔和", "性能优化"],
    basicInfo: {
      "内容风格": "写实风",
      "游戏版本": "1.16.x - 1.21.x",
      "产出方式": "原创",
      "产出时间": "2023.09",
      "许可证类型": "开源",
      "性能负载": "中负载",
      "内容规模": "普通",
      "体验体量": "不涉及",
      "情感导向": "震撼/敬畏、放松/治愈",
      "内容警示": "不涉及",
    },
    downloads: 560000,
    views: 3200000,
    favorites: 78000,
    likes: 32000,
    donationLeaders: [
      { name: "光影收藏家", amount: "25k", avatar: "🏆" },
    ],
    donationFeed: [],
    comments: [],
  },
  "building-1": {
    type: "building",
    title: "中世纪城镇建筑包",
    author: "建筑大师",
    authorType: "建筑创作者",
    description: "一套完整的中世纪风格建筑 schematic 文件包。包含房屋、教堂、城堡、市场等20余种建筑，每座建筑都经过精心设计，可直接导入世界使用或作为建筑参考。",
    authorNote: "这些建筑是我两年来积累的作品，现在分享给大家。你可以自由使用它们，但请不要直接转卖哦。",
    tags: ["中世纪", "城镇", "建筑"],
    basicInfo: {
      "内容风格": "中世纪",
      "游戏版本": "1.18.x - 1.21.x",
      "产出方式": "原创",
      "产出时间": "2024.01",
      "许可证类型": "开源",
      "性能负载": "低负载",
      "内容规模": "普通",
      "体验体量": "不涉及",
      "情感导向": "快乐/创造、怀旧/回忆",
      "内容警示": "不涉及",
    },
    downloads: 78000,
    views: 450000,
    favorites: 12000,
    likes: 4500,
    donationLeaders: [],
    donationFeed: [],
    comments: [],
  },
  "audio-1": {
    type: "audio",
    title: "沉浸式环境音效包",
    author: "音效设计师",
    authorType: "音频创作者",
    description: "一套高质量的环境音效资源包。替换和新增了游戏中的环境音效，包括风声、雨声、鸟鸣、洞穴回声等，让游戏世界更加生动沉浸。支持动态音效，会根据玩家所处环境自动切换。",
    authorNote: "声音是沉浸感的重要组成部分。希望这个音效包能让你们的世界更加生动！",
    tags: ["环境音效", "沉浸", "高质量"],
    basicInfo: {
      "内容风格": "写实风",
      "游戏版本": "全版本",
      "产出方式": "原创",
      "产出时间": "2024.04",
      "许可证类型": "闭源",
      "性能负载": "低负载",
      "内容规模": "轻体量",
      "体验体量": "不涉及",
      "情感导向": "放松/治愈、共情/代入",
      "内容警示": "不涉及",
    },
    downloads: 23000,
    views: 120000,
    favorites: 3200,
    likes: 1800,
    donationLeaders: [],
    donationFeed: [],
    comments: [],
  },
};

const getResourceData = (type: string, id: string) => {
  const key = `${type}-${id}`;
  if (mockResourceData[key]) return mockResourceData[key];

  return {
    type,
    title: `示例${getTypeLabel(type)}资源`,
    author: "示例作者",
    authorType: "创作者",
    description: "这是一个示例资源的描述信息。",
    authorNote: "感谢大家的支持！",
    tags: ["示例标签"],
    basicInfo: {
      "游戏版本": "1.20.x",
      "产出方式": "原创",
      "产出时间": "2024.01",
      "许可证类型": "开源",
    },
    downloads: 100,
    views: 500,
    favorites: 50,
    likes: 10,
    donationLeaders: [],
    donationFeed: [],
    comments: [],
  };
};

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    mod: "模组", map: "地图", datapack: "数据包", modpack: "整合包",
    server: "服务器", resourcepack: "材质", shader: "光影",
    building: "建筑", audio: "音频",
  };
  return map[type] || type;
}

const ResourceDetail = () => {
  const { type, id } = useParams({ from: "/resource/$type/$id" });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("intro");
  const [commentTab, setCommentTab] = useState("public");
  const [newComment, setNewComment] = useState("");
  const [contentDetails, setContentDetails] = useState<Record<string, Record<string, string[]>>>({});
  const [newHotWord, setNewHotWord] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [addFunctionTab, setAddFunctionTab] = useState<"entry" | "category">("entry");
  const [showContentUploadModal, setShowContentUploadModal] = useState(false);
  
  const [selectedEntry, setSelectedEntry] = useState<{ category: string; item: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [entryContent, setEntryContent] = useState<Record<string, WikiEntry>>({});
  
  const elementTypes = [
    { id: "mod", label: "模组", icon: "🔧" },
    { id: "map", label: "地图", icon: "🗺️" },
    { id: "datapack", label: "数据包", icon: "📦" },
    { id: "resourcepack", label: "材质", icon: "🎨" },
    { id: "building", label: "建筑", icon: "🏠" },
    { id: "audio", label: "音频", icon: "🎵" },
    { id: "shader", label: "光影", icon: "✨" },
  ];
  
  const [elements, setElements] = useState<Array<{
    id: string;
    type: string;
    name: string;
    description: string;
    version?: string;
    author?: string;
  }>>([
    { id: "1", type: "mod", name: "机械动力", description: "机械自动化模组", version: "0.5.1", author: "Create Team" },
    { id: "2", type: "mod", name: "JEI物品管理器", description: "物品和配方查看", version: "15.2.0", author: "mezz" },
    { id: "3", type: "mod", name: "小地图", description: "游戏内小地图显示", version: "1.20.1", author: "TechBrew" },
    { id: "4", type: "resourcepack", name: "Faithful材质包", description: "高清原版风格材质", version: "32x", author: "Faithful Team" },
    { id: "5", type: "shader", name: "BSL光影", description: "高质量光影包", version: "8.2", author: "capttatsu" },
    { id: "6", type: "datapack", name: "更多合成", description: "添加新合成配方", version: "1.0", author: "DataPack Creator" },
  ]);
  const [showElementModal, setShowElementModal] = useState(false);
  const [newElement, setNewElement] = useState({ type: "mod", name: "", description: "", version: "", author: "" });
  const [selectedElementType, setSelectedElementType] = useState<string>("all");
  
  const [galleryImages, setGalleryImages] = useState<Array<{
    id: string;
    url: string;
    caption: string;
    uploader: string;
    uploadDate: string;
    status: "pending" | "approved" | "rejected";
  }>>([
    {
      id: "1",
      url: "/placeholder-gallery-1.png",
      caption: "自动化农场全景",
      uploader: "玩家A",
      uploadDate: "2024-01-15",
      status: "approved"
    },
    {
      id: "2",
      url: "/placeholder-gallery-2.png",
      caption: "机械臂工作状态",
      uploader: "玩家B",
      uploadDate: "2024-01-16",
      status: "approved"
    },
    {
      id: "3",
      url: "/placeholder-gallery-3.png",
      caption: "动力系统展示",
      uploader: "玩家C",
      uploadDate: "2024-01-17",
      status: "pending"
    }
  ]);
  const [newGalleryImage, setNewGalleryImage] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDownloadUploadModal, setShowDownloadUploadModal] = useState(false);
  const [downloadUploadTab, setDownloadUploadTab] = useState<"version" | "related">("version");
  
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [newGuideTitle, setNewGuideTitle] = useState("");
  const [newGuideContent, setNewGuideContent] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<typeof guides[0] | null>(null);
  const [showGuideDetailModal, setShowGuideDetailModal] = useState(false);
  
  const [showServerRuleModal, setShowServerRuleModal] = useState(false);
  const [newServerRuleTitle, setNewServerRuleTitle] = useState("");
  const [newServerRuleContent, setNewServerRuleContent] = useState("");
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
      author: "王国运营组",
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
我们致力于打造一个友好、公平、有趣的RPG生存社区。在这里，你可以：
- 选择自己喜欢的职业发展
- 参与公会战争，争夺领地
- 挑战各种副本和Boss
- 结交志同道合的朋友

让我们一起创造美好的游戏回忆！`,
      status: "approved"
    },
    {
      id: "2",
      title: "纯净生存服玩家守则",
      author: "纯净团队",
      publishDate: "2024-02-20",
      views: 5230,
      likes: 189,
      content: `# 纯净生存服玩家守则

## 核心理念
我们坚持原版体验，拒绝任何可能破坏游戏平衡的模组。

## 行为规范
- 尊重每一位玩家，保持友好交流
- 禁止恶意PK，PVP需双方同意
- 禁止偷窃他人物品
- 禁止恶意破坏地形和建筑

## 建筑指南
- 请在距离出生点1000格外建立基地
- 大型公共建筑需经过投票决定
- 保护自然环境，避免过度开采

## 社区文化
我们是一个热爱原版Minecraft的社区，在这里你可以：
- 体验最纯粹的生存乐趣
- 与朋友一起探索、建造
- 参与社区活动，赢取奖励
- 分享你的建筑作品

欢迎加入我们的大家庭！`,
      status: "approved"
    }
  ]);
  const [selectedServerRule, setSelectedServerRule] = useState<typeof serverRules[0] | null>(null);
  const [showServerRuleDetailModal, setShowServerRuleDetailModal] = useState(false);
  
  const [selectedLicense, setSelectedLicense] = useState<{
    type: "original-normal" | "original-image" | "repost-normal" | "repost-image";
    title: string;
    description: string;
  } | null>(null);
  const [showLicenseDetailModal, setShowLicenseDetailModal] = useState(false);
  const [showLicenseSubmitModal, setShowLicenseSubmitModal] = useState(false);
  const [selectedLicenseTemplate, setSelectedLicenseTemplate] = useState<"original-normal" | "original-image" | "repost-normal" | "repost-image" | null>(null);
  const [newLicenseContent, setNewLicenseContent] = useState("");
  const [guides, setGuides] = useState<Array<{
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
      title: "机械动力模组入门指南",
      author: "资深玩家A",
      publishDate: "2024-01-15",
      views: 12580,
      likes: 342,
      content: `# 机械动力模组入门指南

## 简介
机械动力是一个专注于自动化和机械工程的模组，让玩家可以建造复杂的自动化系统。

## 快速开始

### 1. 资源收集
首先需要收集基础资源：
- 铁矿
- 铜矿
- 锌矿

### 2. 制作基础机器
制作以下基础设备：
- 机械动力源
- 传送带
- 机械臂

### 3. 自动化系统
学习如何搭建自动化生产线...

![自动化示例](/guide-image-1.png)

## 进阶技巧

### 多线程处理
通过合理布局可以实现多线程并行处理...

### 效率优化
一些提高效率的小技巧...`,
      status: "approved"
    },
    {
      id: "2",
      title: "高级自动化系统设计",
      author: "技术大佬B",
      publishDate: "2024-01-18",
      views: 8956,
      likes: 256,
      content: `# 高级自动化系统设计

## 概述
本文将介绍如何设计高效的自动化系统...

## 核心概念
- 模块化设计
- 资源流向优化
- 故障检测机制

## 实战案例
详细的设计案例...`,
      status: "approved"
    },
    {
      id: "3",
      title: "新手必看：常见问题解答",
      author: "热心玩家C",
      publishDate: "2024-01-20",
      views: 5623,
      likes: 189,
      content: `# 新手必看：常见问题解答

## Q: 如何开始？
A: 首先收集基础资源...

## Q: 遇到崩溃怎么办？
A: 检查模组版本兼容性...`,
      status: "pending"
    }
  ]);
  
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const [loaderFilter, setLoaderFilter] = useState<string>("all");
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedResource, setEditedResource] = useState<any>({});
  
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
    {
      id: "2",
      version: "1.20.1-0.5.1e",
      gameVersion: "1.20.1",
      loader: "Forge",
      releaseDate: "2024-03-10",
      downloads: 98532,
      fileSize: "4.1 MB",
      changelog: "新增了自动化农场系统",
      isLatest: false,
    },
    {
      id: "3",
      version: "1.20.1-0.5.1d",
      gameVersion: "1.20.1",
      loader: "Fabric",
      releaseDate: "2024-03-08",
      downloads: 76234,
      fileSize: "3.9 MB",
      changelog: "Fabric 版本首发",
      isLatest: false,
    },
    {
      id: "4",
      version: "1.19.2-0.4.2b",
      gameVersion: "1.19.2",
      loader: "Forge",
      releaseDate: "2024-02-20",
      downloads: 234567,
      fileSize: "3.8 MB",
      changelog: "支持 1.19.2 版本",
      isLatest: false,
    },
    {
      id: "5",
      version: "1.18.2-0.3.1a",
      gameVersion: "1.18.2",
      loader: "Forge",
      releaseDate: "2024-01-15",
      downloads: 189234,
      fileSize: "3.5 MB",
      changelog: "初始版本",
      isLatest: false,
    },
  ];

  const [relatedVersions, setRelatedVersions] = useState([
    {
      id: "1",
      version: "1.20.1-0.5.1f",
      gameVersion: "1.20.1",
      loader: "Forge",
      dependencies: [
        {
          id: "d1",
          name: "虚无世界附属-武器扩展",
          type: "依赖模组",
          description: "基于虚无世界制作的武器扩展模组",
          author: "社区开发者",
          downloads: 234000,
        },
      ],
      prerequisites: [
        {
          id: "p1",
          name: "GeckoLib",
          type: "前置模组",
          description: "3D动画库，支持实体、方块、物品和盔甲动画",
          author: "Gecko",
          downloads: 334800000,
        },
      ],
      integrations: [
        {
          id: "i1",
          name: "暮色森林",
          type: "联动模组",
          description: "与虚无世界联动，添加特殊战利品和成就",
          author: "Benimatic",
          downloads: 156000000,
        },
        {
          id: "i2",
          name: "天境",
          type: "联动模组",
          description: "联动添加跨维度传送功能",
          author: "Gilded Games",
          downloads: 45000000,
        },
      ],
    },
    {
      id: "2",
      version: "1.19.2-0.4.2b",
      gameVersion: "1.19.2",
      loader: "Forge",
      dependencies: [],
      prerequisites: [
        {
          id: "p2",
          name: "GeckoLib",
          type: "前置模组",
          description: "3D动画库",
          author: "Gecko",
          downloads: 334800000,
        },
      ],
      integrations: [
        {
          id: "i3",
          name: "暮色森林",
          type: "联动模组",
          description: "基础联动功能",
          author: "Benimatic",
          downloads: 156000000,
        },
      ],
    },
  ]);

  const [addModalType, setAddModalType] = useState<"version" | "related">("version");
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");
  const [selectedDownloadVersion, setSelectedDownloadVersion] = useState<string>("");
  const [newRelatedMod, setNewRelatedMod] = useState({
    name: "",
    type: "前置模组",
    description: "",
    author: "",
  });

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

  const resource = getResourceData(type || "mod", id || "1");

  const filteredBasicInfo = Object.entries(resource.basicInfo || {}).filter(
    ([_, value]) => value && value !== "不涉及"
  );

  const hasContentDetails = ["mod", "modpack", "datapack", "server"].includes(resource.type);
  const isModpackOrServer = ["modpack", "server"].includes(resource.type);
  const hasGallery = resource.type !== "audio";
  const isAuxiliaryResource = ["resourcepack", "shader", "building", "audio"].includes(resource.type);

  const currentContentDetails = contentDetails[type && id ? `${type}-${id}` : "default"] || resource.contentDetails || {};

  const categorizedDetails = () => {
    const withContent: Array<{ id: string; label: string; description: string; items: string[] }> = [];
    const withoutContent: Array<{ id: string; label: string; description: string; items: string[] }> = [];
    
    allHotWordCategories.forEach(cat => {
      const items = currentContentDetails[cat.label] || [];
      if (items.length > 0) {
        withContent.push({ ...cat, items });
      } else {
        withoutContent.push({ ...cat, items: [] });
      }
    });
    
    return { withContent, withoutContent };
  };

  const { withContent, withoutContent } = categorizedDetails();

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
    const key = type && id ? `${type}-${id}` : "default";
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
    setShowAddModal(false);
  };

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;
    const key = type && id ? `${type}-${id}` : "default";
    
    setContentDetails(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [newCategoryName.trim()]: []
      }
    }));
    setNewCategoryName("");
    setNewCategoryDesc("");
  };

  const handleRemoveHotWord = (categoryLabel: string, index: number) => {
    const key = type && id ? `${type}-${id}` : "default";
    setContentDetails(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [categoryLabel]: (prev[key]?.[categoryLabel] || []).filter((_: string, i: number) => i !== index)
      }
    }));
  };

  const handleAddToCategory = (categoryLabel: string, item: string) => {
    const key = type && id ? `${type}-${id}` : "default";
    setContentDetails(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [categoryLabel]: [...(prev[key]?.[categoryLabel] || []), item]
      }
    }));
  };

  const getTagSystem = () => {
    if (!type) return null;
    return tagSystemMap[type] || null;
  };

  const getCommonMeta = () => {
    if (!type) return null;
    const gameContentTypes = ["mod", "datapack", "map"];
    const auxiliaryTypes = ["resourcepack", "shader", "building", "audio", "ecoTool", "doc", "community", "image"];
    const modpackServerTypes = ["modpack", "server"];
    
    if (gameContentTypes.includes(type)) {
      return contentCommonMeta;
    } else if (auxiliaryTypes.includes(type)) {
      return auxiliaryCommonMeta;
    } else if (modpackServerTypes.includes(type)) {
      return modpackServerCommonMeta;
    }
    return null;
  };

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
            {resource.type === "server" && (resource as any).onlinePlayers !== undefined && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Users className="w-3.5 h-3.5" /> {(resource as any).onlinePlayers} 在线
              </span>
            )}
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
            <Button size="sm" className="text-xs">
              <Download className="w-3.5 h-3.5 mr-1" /> 下载
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-border bg-card">
            <TabsList className="h-auto p-0 bg-transparent rounded-none">
              {[
                { id: "intro", label: "基本介绍" },
                ...(hasContentDetails ? [{ id: "content", label: "内容详情" }] : []),
                ...(hasGallery ? [{ id: "gallery", label: "画廊" }] : []),
                { id: "download", label: "下载" },
                ...(resource.type === "server" ? [{ id: "serverRules", label: "服务器规则" }] : []),
                ...(!isAuxiliaryResource ? [{ id: "guide", label: "攻略" }] : []),
                { id: "license", label: "协议" },
                { id: "changelog", label: "日志" },
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
              </TabsContent>

              {hasContentDetails && (
                <TabsContent value="content" className="mt-0">
                  {isModpackOrServer ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">内容详情</h2>
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
                        {elementTypes.map(type => {
                          const count = elements.filter(e => e.type === type.id).length;
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
                          <div className="col-span-2">作者</div>
                          <div className="col-span-1">操作</div>
                        </div>
                        <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                          {elements
                            .filter(e => selectedElementType === "all" || e.type === selectedElementType)
                            .map(element => {
                              const typeInfo = elementTypes.find(t => t.id === element.type);
                              return (
                                <div key={element.id} className="grid grid-cols-12 gap-4 p-3 text-sm hover:bg-secondary/20 transition-colors">
                                  <div className="col-span-2 flex items-center gap-2">
                                    <span>{typeInfo?.icon}</span>
                                    <span className="text-muted-foreground">{typeInfo?.label}</span>
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
                                      onClick={() => setElements(prev => prev.filter(e => e.id !== element.id))}
                                    >
                                      <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          {elements.filter(e => selectedElementType === "all" || e.type === selectedElementType).length === 0 && (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                              暂无{selectedElementType !== "all" ? elementTypes.find(t => t.id === selectedElementType)?.label : ""}元素
                            </div>
                          )}
                        </div>
                      </div>

                      {showElementModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                          <div className="bg-card border border-border rounded-lg w-full max-w-md p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-semibold text-foreground">添加元素</h3>
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
                                  {elementTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                                  ))}
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
                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <label className="text-xs text-muted-foreground mb-1 block">版本</label>
                                  <Input
                                    value={newElement.version}
                                    onChange={(e) => setNewElement({ ...newElement, version: e.target.value })}
                                    placeholder="版本号..."
                                    className="text-sm"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs text-muted-foreground mb-1 block">作者</label>
                                  <Input
                                    value={newElement.author}
                                    onChange={(e) => setNewElement({ ...newElement, author: e.target.value })}
                                    placeholder="作者名..."
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
                                    setElements(prev => [...prev, { ...newElement, id: Date.now().toString() }]);
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
                    </div>
                  ) : (
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
                                <Badge variant="default" className="text-xs h-5">{category.items.length}</Badge>
                              </div>
                              {expandedCategories.has(category.id) && (
                                <div className="bg-secondary/10 py-1">
                                  {category.items.map((item: string, index: number) => (
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

                      <div className="flex-1 min-w-0">
                        {selectedEntry ? (
                          <WikiEntryPanel
                            entry={mockWikiEntries[selectedEntry.item] || createDefaultEntry(selectedEntry.item, selectedEntry.category)}
                            isEditing={isEditing}
                            onEdit={() => setIsEditing(true)}
                            onSave={(entry) => {
                              setEntryContent(prev => ({ ...prev, [selectedEntry.item]: entry }));
                              setIsEditing(false);
                            }}
                            onCancel={() => setIsEditing(false)}
                            onRelatedClick={(item) => {
                              const cat = withContent.find(c => c.items.includes(item))?.label;
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
                  )}

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
                </TabsContent>
              )}

              {hasGallery && (
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
                            <li>• 图片需与该资源相关，展示资源的使用效果或特色内容</li>
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

                  {type === "mod" ? (
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
                                    <Badge variant="outline" className="text-[10px] h-4">{v.loader}</Badge>
                                    <span>{v.releaseDate}</span>
                                    <span>{(v.downloads / 1000).toFixed(1)}K 下载</span>
                                    <span>{v.fileSize}</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {resourceVersions.filter(v => versionFilter === "all" || v.gameVersion === versionFilter).filter(v => loaderFilter === "all" || v.loader === loaderFilter).length === 0 && (
                          <div className="text-center py-12 text-muted-foreground text-sm">
                            没有找到符合条件的版本
                          </div>
                        )}
                      </div>

                      <div className="w-1/2 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base font-semibold text-foreground">
                            {selectedDownloadVersion 
                              ? `${resourceVersions.find(v => v.id === selectedDownloadVersion)?.version || ""} 联动模组`
                              : "联动模组"
                            }
                          </h3>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="border border-border rounded-lg p-2 bg-blue-500/5">
                            <div className="text-[10px] font-semibold text-blue-600">前置模组</div>
                            <div className="text-[9px] text-muted-foreground">必须安装</div>
                          </div>
                          <div className="border border-border rounded-lg p-2 bg-purple-500/5">
                            <div className="text-[10px] font-semibold text-purple-600">依赖模组</div>
                            <div className="text-[9px] text-muted-foreground">需要该模组</div>
                          </div>
                          <div className="border border-border rounded-lg p-2 bg-green-500/5">
                            <div className="text-[10px] font-semibold text-green-600">联动模组</div>
                            <div className="text-[9px] text-muted-foreground">特殊效果</div>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto border border-border rounded-lg">
                          {selectedDownloadVersion ? (
                            <div className="p-3 space-y-3">
                              {(() => {
                                const selectedVer = relatedVersions.find(v => v.id === selectedDownloadVersion);
                                if (!selectedVer) {
                                  return (
                                    <div className="text-center py-8 text-muted-foreground text-xs">
                                      该版本暂无联动模组信息
                                    </div>
                                  );
                                }

                                return (
                                  <>
                                    {selectedVer.prerequisites.length > 0 && (
                                      <div>
                                        <div className="text-xs font-semibold text-blue-600 mb-2 flex items-center gap-1">
                                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                          前置模组 ({selectedVer.prerequisites.length})
                                        </div>
                                        <div className="space-y-1.5">
                                          {selectedVer.prerequisites.map((mod) => (
                                            <div 
                                              key={mod.id} 
                                              className="flex items-center gap-2 px-2.5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-md hover:bg-blue-500/20 transition-colors cursor-pointer"
                                            >
                                              <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                                                <Image className="w-4 h-4 text-blue-600" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium text-foreground truncate">{mod.name}</div>
                                                <div className="text-[10px] text-muted-foreground truncate">{mod.description}</div>
                                              </div>
                                              <div className="text-[10px] text-muted-foreground text-right">
                                                <div>by {mod.author}</div>
                                                <div>{(mod.downloads / 1000000).toFixed(1)}M</div>
                                              </div>
                                              <Button size="sm" className="h-6 px-2 text-[10px] flex-shrink-0">
                                                <Download className="w-2.5 h-2.5 mr-0.5" /> 下载
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {selectedVer.dependencies.length > 0 && (
                                      <div>
                                        <div className="text-xs font-semibold text-purple-600 mb-2 flex items-center gap-1">
                                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                          依赖模组 ({selectedVer.dependencies.length})
                                        </div>
                                        <div className="space-y-1.5">
                                          {selectedVer.dependencies.map((mod) => (
                                            <div 
                                              key={mod.id} 
                                              className="flex items-center gap-2 px-2.5 py-2 bg-purple-500/10 border border-purple-500/20 rounded-md hover:bg-purple-500/20 transition-colors cursor-pointer"
                                            >
                                              <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0">
                                                <Image className="w-4 h-4 text-purple-600" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium text-foreground truncate">{mod.name}</div>
                                                <div className="text-[10px] text-muted-foreground truncate">{mod.description}</div>
                                              </div>
                                              <div className="text-[10px] text-muted-foreground text-right">
                                                <div>by {mod.author}</div>
                                                <div>{(mod.downloads / 1000).toFixed(0)}K</div>
                                              </div>
                                              <Button size="sm" className="h-6 px-2 text-[10px] flex-shrink-0">
                                                <Download className="w-2.5 h-2.5 mr-0.5" /> 下载
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {selectedVer.integrations.length > 0 && (
                                      <div>
                                        <div className="text-xs font-semibold text-green-600 mb-2 flex items-center gap-1">
                                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                          联动模组 ({selectedVer.integrations.length})
                                        </div>
                                        <div className="space-y-1.5">
                                          {selectedVer.integrations.map((mod) => (
                                            <div 
                                              key={mod.id} 
                                              className="flex items-center gap-2 px-2.5 py-2 bg-green-500/10 border border-green-500/20 rounded-md hover:bg-green-500/20 transition-colors cursor-pointer"
                                            >
                                              <div className="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center flex-shrink-0">
                                                <Image className="w-4 h-4 text-green-600" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium text-foreground truncate">{mod.name}</div>
                                                <div className="text-[10px] text-muted-foreground truncate">{mod.description}</div>
                                              </div>
                                              <div className="text-[10px] text-muted-foreground text-right">
                                                <div>by {mod.author}</div>
                                                <div>{(mod.downloads / 1000000).toFixed(1)}M</div>
                                              </div>
                                              <Button size="sm" className="h-6 px-2 text-[10px] flex-shrink-0">
                                                <Download className="w-2.5 h-2.5 mr-0.5" /> 下载
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
                            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                              请在左侧选择一个版本查看联动模组
                            </div>
                          )}
                        </div>
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

                      {resourceVersions.filter(v => versionFilter === "all" || v.gameVersion === versionFilter).length === 0 && (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                          没有找到符合条件的版本
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {showDownloadUploadModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card border border-border rounded-lg w-full max-w-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground">上传版本</h3>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowDownloadUploadModal(false)}>
                          ×
                        </Button>
                      </div>

                      {type === "mod" && (
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
                      )}

                      {(type === "mod" ? downloadUploadTab === "version" : true) ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">版本号</label>
                            <Input
                              value={newRelatedMod.name}
                              onChange={(e) => setNewRelatedMod({ ...newRelatedMod, name: e.target.value })}
                              placeholder="如：1.20.1-0.5.1f"
                              className="text-sm"
                            />
                          </div>
                          <div className={type === "mod" ? "grid grid-cols-2 gap-3" : ""}>
                            <div className={type === "mod" ? "" : "mb-3"}>
                              <label className="text-xs text-muted-foreground mb-1 block">游戏版本</label>
                              <Input
                                value={newRelatedMod.author}
                                onChange={(e) => setNewRelatedMod({ ...newRelatedMod, author: e.target.value })}
                                placeholder="如：1.20.1"
                                className="text-sm"
                              />
                            </div>
                            {type === "mod" && (
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">加载器</label>
                                <select
                                  value={newRelatedMod.type}
                                  onChange={(e) => setNewRelatedMod({ ...newRelatedMod, type: e.target.value })}
                                  className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background"
                                >
                                  <option value="Forge">Forge</option>
                                  <option value="Fabric">Fabric</option>
                                  <option value="NeoForge">NeoForge</option>
                                  <option value="Quilt">Quilt</option>
                                </select>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setShowDownloadUploadModal(false)}>取消</Button>
                            <Button size="sm" onClick={() => {
                              if (newRelatedMod.name && newRelatedMod.author) {
                                handleAddVersion(newRelatedMod.name, newRelatedMod.author, type === "mod" ? newRelatedMod.type : undefined);
                                setNewRelatedMod({ name: "", type: "前置模组", description: "", author: "" });
                                setShowDownloadUploadModal(false);
                              }
                            }}>确认</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">选择版本</label>
                            <select
                              value={selectedVersionId}
                              onChange={(e) => setSelectedVersionId(e.target.value)}
                              className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background"
                            >
                              <option value="">请选择版本</option>
                              {relatedVersions.map(v => (
                                <option key={v.id} value={v.id}>{v.version} ({v.gameVersion} - {v.loader})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">模组名称</label>
                            <Input
                              value={newRelatedMod.name}
                              onChange={(e) => setNewRelatedMod({ ...newRelatedMod, name: e.target.value })}
                              placeholder="输入模组名称"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">联动类型</label>
                            <div className="grid grid-cols-3 gap-2">
                              {["前置模组", "依赖模组", "联动模组"].map(type => (
                                <button
                                  key={type}
                                  onClick={() => setNewRelatedMod({ ...newRelatedMod, type })}
                                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                                    newRelatedMod.type === type 
                                      ? type === "前置模组" 
                                        ? "bg-blue-500/10 border-blue-500/20 text-blue-600"
                                        : type === "依赖模组"
                                        ? "bg-purple-500/10 border-purple-500/20 text-purple-600"
                                        : "bg-green-500/10 border-green-500/20 text-green-600"
                                      : "border-border hover:bg-secondary"
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">作者</label>
                              <Input
                                value={newRelatedMod.author}
                                onChange={(e) => setNewRelatedMod({ ...newRelatedMod, author: e.target.value })}
                                placeholder="输入作者"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">描述</label>
                              <Input
                                value={newRelatedMod.description}
                                onChange={(e) => setNewRelatedMod({ ...newRelatedMod, description: e.target.value })}
                                placeholder="输入描述"
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setShowDownloadUploadModal(false)}>取消</Button>
                            <Button size="sm" onClick={() => {
                              if (newRelatedMod.name && selectedVersionId) {
                                handleAddRelatedMod(selectedVersionId, newRelatedMod);
                                setNewRelatedMod({ name: "", type: "前置模组", description: "", author: "" });
                                setShowDownloadUploadModal(false);
                              }
                            }}>确认</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
• 禁止将本资源用于推广与Minecraft无关的产品、服务或品牌

【知识产权声明】

本资源中所有原创内容的知识产权归作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`
                            )}
                            {selectedLicense.type === "repost-normal" && (
                              `【免责声明】

本资源为非官方Minecraft产品，未经Mojang或Microsoft批准或关联。

【基本声明】

本资源内容严格遵守微软官方《Minecraft 最终用户许可协议》(EULA) 和《Minecraft 商业使用指南》的相关规定。

根据Minecraft官方政策，本资源属于游戏内容资源，必须免费提供给所有用户。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素。

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

本资源中所有原创内容的知识产权归原作者所有。Minecraft游戏的名称、品牌、标识等知识产权归Mojang Studios和Microsoft所有。本协议不授予用户任何Minecraft游戏本身的权利。`
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

根据Minecraft官方政策，本资源属于游戏内容资源，必须免费提供给所有用户。所有内容均为原创制作，不包含任何侵犯微软或Mojang Studios知识产权的元素。

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
              </TabsContent>

              <TabsContent value="changelog" className="mt-0">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">日志</h2>
                  
                  <div className="space-y-3">
                    {mockChangeLogs
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                      .map((log, index) => (
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
              </TabsContent>

              {resource.type === "server" && (
                <TabsContent value="serverRules" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">服务器规则</h2>
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

                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {rule.content.split('\n').find(line => line.trim() && !line.startsWith('#') && !line.startsWith('!')) || '点击查看完整内容...'}
                          </div>
                        </div>
                      ))}

                      {serverRules.filter(r => r.status === "approved").length === 0 && (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                          暂无服务器规则文章
                        </div>
                      )}
                    </div>

                    {showServerRuleModal && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-card border border-border rounded-lg w-full max-w-3xl p-4 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-foreground">提交服务器规则</h3>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowServerRuleModal(false)}>
                              ×
                            </Button>
                          </div>

                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                            <div className="text-xs font-semibold text-blue-600 mb-2">提交须知</div>
                            <ul className="text-[10px] text-muted-foreground space-y-1">
                              <li>• 规则内容需与该服务器相关，如服务器规则、服务器文化、玩法介绍等</li>
                              <li>• 内容需原创或已获授权，不得抄袭他人作品</li>
                              <li>• 提交的规则需经服务器管理方审核后才会显示</li>
                              <li>• 支持Markdown格式，可使用 # 标题、- 列表、![图片](链接) 等语法</li>
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">规则标题</label>
                              <Input
                                value={newServerRuleTitle}
                                onChange={(e) => setNewServerRuleTitle(e.target.value)}
                                placeholder="输入规则标题..."
                                className="text-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">规则内容（支持Markdown）</label>
                              <Textarea
                                value={newServerRuleContent}
                                onChange={(e) => setNewServerRuleContent(e.target.value)}
                                placeholder={`示例格式：
# 服务器规则

## 基本规则
- 禁止使用作弊客户端
- 禁止恶意破坏他人建筑
- 禁止辱骂其他玩家

## 服务器文化
我们致力于打造一个友好、公平的游戏环境...`}
                                className="text-sm min-h-[300px] font-mono"
                              />
                            </div>

                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline" onClick={() => setShowServerRuleModal(false)}>取消</Button>
                              <Button size="sm" onClick={() => {
                                if (newServerRuleTitle && newServerRuleContent) {
                                  setServerRules([...serverRules, {
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
                                }
                              }}>提交</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {showServerRuleDetailModal && selectedServerRule && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-card border border-border rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h2 className="text-lg font-bold text-foreground mb-2">{selectedServerRule.title}</h2>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  <span>{selectedServerRule.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{selectedServerRule.publishDate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{selectedServerRule.views.toLocaleString()} 浏览</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  <span>{selectedServerRule.likes} 点赞</span>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-lg hover:bg-secondary" onClick={() => setShowServerRuleDetailModal(false)}>
                              ×
                            </Button>
                          </div>

                          <Separator className="my-4" />

                          <div className="prose prose-sm max-w-none">
                            {selectedServerRule.content.split('\n').map((line, index) => {
                              if (line.startsWith('# ')) {
                                return <h1 key={index} className="text-xl font-bold text-foreground mt-6 mb-3">{line.slice(2)}</h1>;
                              }
                              if (line.startsWith('## ')) {
                                return <h2 key={index} className="text-lg font-semibold text-foreground mt-4 mb-2">{line.slice(3)}</h2>;
                              }
                              if (line.startsWith('### ')) {
                                return <h3 key={index} className="text-base font-medium text-foreground mt-3 mb-2">{line.slice(4)}</h3>;
                              }
                              if (line.startsWith('- ')) {
                                return <li key={index} className="text-sm text-muted-foreground ml-4">{line.slice(2)}</li>;
                              }
                              if (line.startsWith('![')) {
                                const match = line.match(/!\[(.*?)\]\((.*?)\)/);
                                if (match) {
                                  return <img key={index} src={match[2]} alt={match[1]} className="max-w-full h-auto rounded-lg my-3" />;
                                }
                              }
                              if (line.trim()) {
                                return <p key={index} className="text-sm text-muted-foreground mb-2">{line}</p>;
                              }
                              return null;
                            })}
                          </div>

                          <Separator className="my-4" />

                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              const rule = serverRules.find(r => r.id === selectedServerRule.id);
                              if (rule) {
                                rule.likes += 1;
                                setServerRules([...serverRules]);
                              }
                            }}>
                              <Heart className="w-3 h-3 mr-1" /> 点赞
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}

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
                          <h3 className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                            {guide.title}
                          </h3>
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
                          {guide.content.split('\n').find(line => line.trim() && !line.startsWith('#') && !line.startsWith('!')) || '点击查看完整内容...'}
                        </div>
                      </div>
                    ))}

                    {guides.filter(g => g.status === "approved").length === 0 && (
                      <div className="text-center py-12 text-muted-foreground text-sm">
                        暂无攻略文章
                      </div>
                    )}
                  </div>

                  {showGuideModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-card border border-border rounded-lg w-full max-w-3xl p-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-foreground">提交攻略</h3>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowGuideModal(false)}>
                            ×
                          </Button>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                          <div className="text-xs font-semibold text-blue-600 mb-2">提交须知</div>
                          <ul className="text-[10px] text-muted-foreground space-y-1">
                            <li>• 攻略内容需与该资源相关，帮助其他玩家更好地使用该资源</li>
                            <li>• 内容需原创或已获授权，不得抄袭他人作品</li>
                            <li>• 提交的攻略需经制作方审核后才会显示</li>
                            <li>• 支持Markdown格式，可使用 # 标题、- 列表、![图片](链接) 等语法</li>
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
                            <label className="text-xs text-muted-foreground mb-1 block">攻略内容（支持Markdown）</label>
                            <Textarea
                              value={newGuideContent}
                              onChange={(e) => setNewGuideContent(e.target.value)}
                              placeholder={`示例格式：
# 标题

## 二级标题

正文内容...

- 列表项1
- 列表项2

![图片描述](图片链接)`}
                              className="text-sm min-h-[300px] font-mono"
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
                            ×
                          </Button>
                        </div>

                        <Separator className="my-4" />

                        <div className="prose prose-sm max-w-none">
                          {selectedGuide.content.split('\n').map((line, index) => {
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
            </div>
          </div>
        </Tabs>

        <div className="px-6 pb-6">
          <Separator className="my-6" />
          
          <div>
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
        </div>
      </div>
      {renderEditModal()}
    </div>
  );
};

export default ResourceDetail;
