import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const meta: Meta = {
  title: 'UI/Dropdown',
  component: DropdownMenu,
  tags: ['autodocs'], 
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState("카테고리를 선택해주세요.");
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="group flex h-12 w-[260px] items-center justify-between border-[#F97B22] border-[1px] rounded-[16px] px-4 transition-all duration-200 hover:bg-orange-50/30" >
            <span className={selected ? "text-[#F97B22] font-bold" : "text-[#94A3B8]"}>
              {selected}
            </span>
            <ChevronDown className="size-4 opacity-50 text-[#F97B22] transition-transform duration-100 group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[260px] rounded-[16px] border-[#F97B22]">
          <DropdownMenuItem onSelect={() => setSelected("청량/탄산음료")}>
            청량/탄산음료</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSelected("과즙음료")}>
            과즙음료</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSelected("에너지음료")}>
            에너지음료</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSelected("원두커피")}>
            원두커피</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSelected("건강음료")}>
            건강음료</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};