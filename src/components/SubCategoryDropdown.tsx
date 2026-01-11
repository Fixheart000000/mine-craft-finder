import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubCategory {
  id: string;
  label: string;
}

interface SubCategoryDropdownProps {
  categories: SubCategory[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SubCategoryDropdown = ({
  categories,
  value,
  onChange,
  placeholder = "全部",
}: SubCategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    categories.find((c) => c.id === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
          "flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors border",
          value
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-secondary text-muted-foreground border-border hover:bg-secondary/80"
        )}
      >
        <span className="max-w-[120px] truncate">{selectedLabel}</span>
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-1 left-0 min-w-[160px] max-h-[200px] overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className={cn(
              "w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors",
              !value && "bg-primary/10 text-primary"
            )}
          >
            {placeholder}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onChange(category.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors",
                value === category.id && "bg-primary/10 text-primary"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoryDropdown;
