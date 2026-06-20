import { cn } from "@/lib/utils/style"

export const FacebookIcon = ({
  size = 4,
  color = "#000000",
  strokeWidth = 2,
  background = "transparent",
  className,
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0,
}: {
  size?: number
  className?: string
  color?: string
  strokeWidth?: number
  background?: string
  opacity?: number
  rotation?: number
  shadow?: number
  flipHorizontal?: boolean
  flipVertical?: boolean
  padding?: number
}) => {
  const transforms = []
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`)
  if (flipHorizontal) transforms.push("scaleX(-1)")
  if (flipVertical) transforms.push("scaleY(-1)")

  const viewBoxSize = 24 + padding * 2
  const viewBoxOffset = -padding
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      className={cn(className)}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        opacity,
        transform: transforms.join(" ") || undefined,
        filter:
          shadow > 0
            ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))`
            : undefined,
        backgroundColor: background !== "transparent" ? background : undefined,
      }}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      />
    </svg>
  )
}
