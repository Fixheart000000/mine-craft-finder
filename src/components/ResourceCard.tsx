import { Download, Heart } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  author: string;
  description: string;
  downloads: number;
  likes: number;
  resourceType?: string;
  resourceId?: string;
}

const generalTypes = ["mod", "map", "datapack", "modpack", "server", "resourcepack", "shader", "building", "audio"];
const otherTypes = ["ecoTool", "doc", "image"];

const ResourceCard = ({
  icon,
  title,
  author,
  description,
  downloads,
  likes,
  resourceType,
  resourceId = "1",
}: ResourceCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!resourceType) return;
    if (resourceType === "project") {
      navigate({ to: "/project/$id", params: { id: resourceId } });
    } else if (generalTypes.includes(resourceType)) {
      navigate({ to: "/resource/$type/$id", params: { type: resourceType, id: resourceId } });
    } else if (otherTypes.includes(resourceType)) {
      navigate({ to: "/other/$type/$id", params: { type: resourceType, id: resourceId } });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-card rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow duration-200 border border-border max-w-xs cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary truncate">{title}</h3>
          <p className="text-sm text-mc-link">by {author}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>
      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Download className="w-4 h-4" />
          {downloads}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          {likes}
        </span>
      </div>
    </div>
  );
};

export default ResourceCard;
