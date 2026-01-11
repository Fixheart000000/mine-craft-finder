import { Download, Heart } from "lucide-react";

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  author: string;
  description: string;
  downloads: number;
  likes: number;
}

const ResourceCard = ({
  icon,
  title,
  author,
  description,
  downloads,
  likes,
}: ResourceCardProps) => {
  return (
    <div className="bg-card rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow duration-200 border border-border max-w-xs">
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
