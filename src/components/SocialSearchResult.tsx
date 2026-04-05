import { User, Users, FolderKanban } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "@tanstack/react-router";

interface SocialResultProps {
  type: "user" | "team" | "project";
  name: string;
  description?: string;
  avatar?: string;
  memberCount?: number;
  status?: string;
  projectId?: string;
  projectType?: string;
  projectStatus?: string;
}

const typeConfig = {
  user: { icon: User, label: "用户" },
  team: { icon: Users, label: "团队" },
  project: { icon: FolderKanban, label: "项目" },
};

const projectTypeLabels: Record<string, string> = {
  mod: "模组",
  map: "地图",
  datapack: "数据包",
  modpack: "整合包",
  server: "服务器",
  resourcepack: "材质",
  shader: "光影",
  building: "建筑",
  audio: "音频",
  ecoTool: "生态工具",
  doc: "知识文档",
  image: "形象",
};

const SocialSearchResult = ({ type, name, description, memberCount, status, projectId, projectType, projectStatus }: SocialResultProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "project" && projectId) {
      navigate({ to: "/project/$id", params: { id: projectId } });
    }
  };

  return (
    <div 
      className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:shadow-card transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <Avatar className="w-10 h-10">
        <AvatarFallback className="bg-secondary text-muted-foreground">
          <Icon className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground truncate">{name}</span>
          <span className="px-1.5 py-0.5 text-[10px] bg-secondary text-muted-foreground rounded">{config.label}</span>
          {type === "project" && projectType && (
            <span className="px-1.5 py-0.5 text-[10px] bg-purple-500/10 text-purple-600 rounded">{projectTypeLabels[projectType] || projectType}</span>
          )}
          {type === "project" && projectStatus && (
            <span className={`px-1.5 py-0.5 text-[10px] rounded ${
              projectStatus === "筹备中" 
                ? "bg-blue-500/10 text-blue-600" 
                : "bg-green-500/10 text-green-600"
            }`}>{projectStatus}</span>
          )}
          {status && type !== "project" && (
            <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded">{status}</span>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground truncate mt-0.5">{description}</p>}
        {memberCount !== undefined && (
          <span className="text-[10px] text-muted-foreground">{memberCount} 成员</span>
        )}
      </div>
    </div>
  );
};

export default SocialSearchResult;
