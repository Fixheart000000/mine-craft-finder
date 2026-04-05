import { cn } from "@/lib/utils";

interface CategoryTabProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const CategoryTab = ({ icon, label, active, onClick }: CategoryTabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
        active
          ? "text-primary bg-mc-blue-light"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default CategoryTab;
