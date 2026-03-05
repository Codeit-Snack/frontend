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
          <Button variant="outline" className="group flex w-[200px] items-center justify-between">
            <span>{selected}</span>
            <ChevronDown className="size-4 opacity-50 transition-transform duration-100 group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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