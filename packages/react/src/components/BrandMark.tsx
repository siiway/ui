// Site logo: the configured site icon, or nothing. With no icon set, the
// site name beside it carries the brand on its own — a placeholder mark
// would only invent a logo the operator never chose.

import { Image } from "@fluentui/react-components";

interface BrandMarkProps {
  /** The image's alt text. Leave it out when the name is written beside the mark. */
  name?: string | null;
  /** The icon's URL. Without one, the mark renders nothing. */
  iconUrl?: string | null;
  /** Width and height, in pixels. */
  size?: number;
}

export function BrandMark({ name, iconUrl, size = 28 }: BrandMarkProps) {
  if (!iconUrl) return null;
  return (
    <Image
      src={iconUrl}
      alt={name ?? ""}
      fit="cover"
      width={size}
      height={size}
      style={{ borderRadius: Math.round(size * 0.28), flexShrink: 0 }}
    />
  );
}
