import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  id: string;
  label: string;
}

interface BreadcrumbDropdownProps {
  items: BreadcrumbItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const BreadcrumbDropdown = ({
  items,
  value,
  onChange,
  placeholder = "全部",
}: BreadcrumbDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = items.find((item) => item.id === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 px-2 py-1 text-sm rounded-md transition-colors hover:bg-secondary/80",
          value ? "text-foreground font-medium" : "text-muted-foreground"
        )}
      >
        <span className="max-w-[100px] truncate">{selectedLabel}</span>
        <ChevronDown
          className={cn("w-3 h-3 transition-transform flex-shrink-0", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-1 left-0 min-w-[140px] max-h-[240px] overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-50">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onChange(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors",
                value === item.id && "bg-primary/10 text-primary"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface BreadcrumbNavigationProps {
  levels: {
    items: BreadcrumbItem[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }[];
}

const BreadcrumbNavigation = ({ levels }: BreadcrumbNavigationProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {levels.map((level, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-3 h-3 text-muted-foreground mx-0.5 flex-shrink-0" />
          )}
          <BreadcrumbDropdown
            items={level.items}
            value={level.value}
            onChange={level.onChange}
            placeholder={level.placeholder}
          />
        </div>
      ))}
    </div>
  );
};

export { BreadcrumbDropdown, BreadcrumbNavigation };
