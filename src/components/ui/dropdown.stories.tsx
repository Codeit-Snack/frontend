import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const meta: Meta = {
  title: 'UI/Dropdown',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const CategorySelect: StoryObj = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState("카테고리를 선택해주세요.");
    const categories = ["청량/탄산음료", "과즙음료", "에너지음료", "원두커피", "건강음료"];
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="group flex h-12 w-[260px] items-center justify-between border-[#F97B22] border-[1px] rounded-[16px] px-4 transition-all duration-200 hover:bg-orange-50/30 outline-none focus:ring-1 focus:ring-[#F97B22]" 
          >
            <span className={selected !== "카테고리를 선택해주세요." ? "text-[#F97B22] font-bold" : "text-[#94A3B8]"}>
              {selected}
            </span>
            <ChevronDown className="size-4 text-[#F97B22] transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-[260px] rounded-[16px] border-[#F97B22] p-1 shadow-lg">
          {categories.map((category) => (
            <DropdownMenuItem 
              key={category}
              onSelect={() => setSelected(category)}
              className="rounded-[10px] py-2.5 focus:bg-orange-50 focus:text-[#F97B22] cursor-pointer"
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};