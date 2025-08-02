import timelineData from "@/pages/changelog/changes.json";
import {
  Scale,
  Coins,
  Github,
  Image,
  House,
  Network,
  Globe,
  Hexagon,
  CircleHelp
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Icon mapping for the changelog entries
const iconMap: Record<string, LucideIcon> = {
  Scale,
  Coins,
  Github,
  Image,
  House,
  Network,
  Globe,
  Hive: Hexagon,
  CircleHelp
};

/**
 * Renders a vertical timeline of changelog entries, sorted by date (newest first).
 * Each entry displays an icon, date, title, and a list of description points.
 */
export function ChangelogTimeline() {
  const sortedTimelineData = [...timelineData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ul className="timeline timeline-vertical timeline-compact">
      {sortedTimelineData.map((entry: { date: string; icon: string; title: string; description: string[] }, index) => {
        // Get the icon component from our icon map
        const Icon = iconMap[entry.icon] || CircleHelp;

        return (
          <li key={`${entry.date}-${index}`}>
            {index !== 0 && <hr />}

            <div className="timeline-middle">
              <Icon className="h-5 w-5" />
            </div>

            <div className="timeline-end timeline-box mb-4">
              <div className="flex items-center gap-2 mb-2 ">
                <div className="text-lg font-bold card-title">{entry.title}</div>
                <time className="font-mono italic text-sm opacity-60">{entry.date}</time>
              </div>
              <ul className="list-disc text-sm ml-4">
                {entry.description.map((point: string, i: number) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>


            {index !== sortedTimelineData.length - 1 && <hr />}
          </li>
        );
      })}
    </ul>
  );
}
