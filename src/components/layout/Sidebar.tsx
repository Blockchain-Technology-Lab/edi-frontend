import { LayerMenuItem } from "@/components";
import { Link, useRouterState } from "@tanstack/react-router";

import {
  consensusTo,
  tokenomicsTo,
  networkTo,
  softwareTo,
  geographyTo,
  governanceTo,
} from "@/routes/routePaths";

import { Scale, Coins, Network, Code, Globe, Gavel } from "lucide-react";

const layerItems = [
  {
    label: "Consensus",
    path: consensusTo,
    bg: "bg-base-200",
    text: "text-base-content",
    icon: <Scale size={36} />, // Reduced icon size for smaller sidebar
    shortcut: "1",
  },
  {
    label: "Tokenomics",
    path: tokenomicsTo,
    bg: "bg-base-200",
    text: "text-base-content",
    icon: <Coins size={36} />,
    shortcut: "2",
  },
  {
    label: "Network",
    path: networkTo,
    bg: "bg-base-200",
    text: "text-base-content",
    icon: <Network size={36} />,
    shortcut: "3",
  },
  {
    label: "Software",
    path: softwareTo,
    bg: "bg-base-200",
    text: "text-base-content",
    icon: <Code size={36} />,
    shortcut: "4",
  },
  {
    label: "Geography",
    path: geographyTo,
    bg: "bg-base-200",
    text: "text-base-content",
    icon: <Globe size={36} />,
    shortcut: "5",
  },
  {
    label: "Governance",
    path: governanceTo,
    bg: "bg-base-200",
    text: "text-base-content",
    icon: <Gavel size={36} />,
    disabled: false,
    shortcut: "6",
  },
];


export function Sidebar() {
  const { location } = useRouterState();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex flex-col h-full pt-6 px-2">
      {layerItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          {...(item.disabled && { onClick: (e) => e.preventDefault() })}
          className="mb-4"
        >
          <LayerMenuItem
            label={item.label}
            icon={item.icon}

            bgColor={item.bg}
            textColor={item.text}
            active={isActive(item.path)}
            disabled={item.disabled}
          />
        </Link>
      ))}
    </div>
  );
}
