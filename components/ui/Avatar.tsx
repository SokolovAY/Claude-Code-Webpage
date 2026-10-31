import Image from "next/image";
import clsx from "clsx";
import { t } from "@/lib/content";

export type AvatarPose = "waving" | "coffee" | "confused";

export interface AvatarProps {
  pose: AvatarPose;
  size?: "sm" | "md" | "lg";
  /** Preload for above-the-fold use (hero). Replaces next/image `priority`, deprecated in Next 16. */
  priority?: boolean;
  className?: string;
}

const sizes = { sm: 96, md: 160, lg: 240 } as const;

const alts = {
  waving: "avatar.waving.alt",
  coffee: "avatar.coffee.alt",
  confused: "avatar.confused.alt",
} as const;

export function Avatar({ pose, size = "md", priority = false, className }: AvatarProps) {
  const px = sizes[size];
  return (
    <Image
      src={`/avatar/${pose}.svg`}
      alt={t(alts[pose])}
      width={px}
      height={px}
      preload={priority}
      unoptimized
      className={clsx("shrink-0", className)}
    />
  );
}
