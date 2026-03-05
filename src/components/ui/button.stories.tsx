import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Pencil, ChevronDown } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#2D2D2D" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "solid",
        "solid-selected",
        "solid-disabled",
        "outlined",
        "outlined-selected",
        "outlined-disabled",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Solid Button - Small
export const SolidSmall: Story = {
  args: {
    variant: "solid",
    size: "sm",
    children: "Primary CTA 버튼",
  },
};

// Solid Button - Large
export const SolidLarge: Story = {
  args: {
    variant: "solid",
    size: "lg",
    children: "Primary CTA 버튼",
  },
};

// Solid Selected - Small
export const SolidSelectedSmall: Story = {
  args: {
    variant: "solid-selected",
    size: "sm",
    children: "Primary CTA 버튼",
  },
};

// Solid Selected - Large
export const SolidSelectedLarge: Story = {
  args: {
    variant: "solid-selected",
    size: "lg",
    children: "Primary CTA 버튼",
  },
};

// Solid Disabled - Small
export const SolidDisabledSmall: Story = {
  args: {
    variant: "solid-disabled",
    size: "sm",
    children: "Primary CTA 버튼",
  },
};

// Solid Disabled - Large
export const SolidDisabledLarge: Story = {
  args: {
    variant: "solid-disabled",
    size: "lg",
    children: "Primary CTA 버튼",
  },
};

// Solid with Icon - Small
export const SolidWithIconSmall: Story = {
  args: {
    variant: "solid",
    size: "sm",
    children: (
      <>
        Primary CTA 버튼
        <Pencil className="size-4" />
      </>
    ),
  },
};

// Solid with Icon - Large
export const SolidWithIconLarge: Story = {
  args: {
    variant: "solid",
    size: "lg",
    children: (
      <>
        Primary CTA 버튼
        <Pencil className="size-5" />
      </>
    ),
  },
};

// Solid Disabled with Icon - Small
export const SolidDisabledWithIconSmall: Story = {
  args: {
    variant: "solid-disabled",
    size: "sm",
    children: (
      <>
        Primary CTA 버튼
        <Pencil className="size-4" />
      </>
    ),
  },
};

// Solid Disabled with Icon - Large
export const SolidDisabledWithIconLarge: Story = {
  args: {
    variant: "solid-disabled",
    size: "lg",
    children: (
      <>
        Primary CTA 버튼
        <Pencil className="size-5" />
      </>
    ),
  },
};

// 모든 Solid 버튼 한눈에 보기
export const AllSolidVariants: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      {/* Solid */}
      <div className="flex items-start gap-4">
        <Button variant="solid" size="sm">Primary CTA 버튼</Button>
        <Button variant="solid" size="lg">Primary CTA 버튼</Button>
      </div>

      {/* Solid Selected */}
      <div className="flex items-start gap-4">
        <Button variant="solid-selected" size="sm">Primary CTA 버튼</Button>
        <Button variant="solid-selected" size="lg">Primary CTA 버튼</Button>
      </div>

      {/* Solid Disabled */}
      <div className="flex items-start gap-4">
        <Button variant="solid-disabled" size="sm">Primary CTA 버튼</Button>
        <Button variant="solid-disabled" size="lg">Primary CTA 버튼</Button>
      </div>

      {/* Solid with Icon */}
      <div className="flex items-start gap-4">
        <Button variant="solid" size="sm">
          Primary CTA 버튼 <Pencil className="size-4" />
        </Button>
        <Button variant="solid" size="lg">
          Primary CTA 버튼 <Pencil className="size-5" />
        </Button>
      </div>

      {/* Solid Disabled with Icon */}
      <div className="flex items-start gap-4">
        <Button variant="solid-disabled" size="sm">
          Primary CTA 버튼 <Pencil className="size-4" />
        </Button>
        <Button variant="solid-disabled" size="lg">
          Primary CTA 버튼 <Pencil className="size-5" />
        </Button>
      </div>
    </div>
  ),
};

// ========== Outlined 버튼 ==========

// Outlined Button - Small
export const OutlinedSmall: Story = {
  args: {
    variant: "outlined",
    size: "sm",
    children: "Primary CTA 버튼",
  },
};

// Outlined Button - Large
export const OutlinedLarge: Story = {
  args: {
    variant: "outlined",
    size: "lg",
    children: "Primary CTA 버튼",
  },
};

// Outlined Selected - Small
export const OutlinedSelectedSmall: Story = {
  args: {
    variant: "outlined-selected",
    size: "sm",
    children: "Primary CTA 버튼",
  },
};

// Outlined Selected - Large
export const OutlinedSelectedLarge: Story = {
  args: {
    variant: "outlined-selected",
    size: "lg",
    children: "Primary CTA 버튼",
  },
};

// Outlined Disabled - Small
export const OutlinedDisabledSmall: Story = {
  args: {
    variant: "outlined-disabled",
    size: "sm",
    children: "Primary CTA 버튼",
  },
};

// Outlined Disabled - Large
export const OutlinedDisabledLarge: Story = {
  args: {
    variant: "outlined-disabled",
    size: "lg",
    children: "Primary CTA 버튼",
  },
};

// Outlined Dropdown - Small
export const OutlinedDropdownSmall: Story = {
  args: {
    variant: "outlined",
    size: "sm",
    children: (
      <>
        Primary CTA 버튼
        <ChevronDown className="size-4" />
      </>
    ),
  },
};

// Outlined Dropdown - Large
export const OutlinedDropdownLarge: Story = {
  args: {
    variant: "outlined",
    size: "lg",
    children: (
      <>
        Primary CTA 버튼
        <ChevronDown className="size-5" />
      </>
    ),
  },
};

// 모든 Outlined 버튼 한눈에 보기
export const AllOutlinedVariants: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      {/* Outlined */}
      <div className="flex items-start gap-4">
        <Button variant="outlined" size="sm">Primary CTA 버튼</Button>
        <Button variant="outlined" size="lg">Primary CTA 버튼</Button>
      </div>

      {/* Outlined Selected */}
      <div className="flex items-start gap-4">
        <Button variant="outlined-selected" size="sm">Primary CTA 버튼</Button>
        <Button variant="outlined-selected" size="lg">Primary CTA 버튼</Button>
      </div>

      {/* Outlined Disabled */}
      <div className="flex items-start gap-4">
        <Button variant="outlined-disabled" size="sm">Primary CTA 버튼</Button>
        <Button variant="outlined-disabled" size="lg">Primary CTA 버튼</Button>
      </div>

      {/* Outlined Dropdown */}
      <div className="flex items-start gap-4">
        <Button variant="outlined" size="sm">
          Primary CTA 버튼 <ChevronDown className="size-4" />
        </Button>
        <Button variant="outlined" size="lg">
          Primary CTA 버튼 <ChevronDown className="size-5" />
        </Button>
      </div>
    </div>
  ),
};
