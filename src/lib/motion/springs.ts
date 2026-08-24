export const springPresets = {
  default: { type: "spring" as const, bounce: 0, duration: 0.4 },
  momentum: { type: "spring" as const, bounce: 0.2, duration: 0.4 },
  sheet: { type: "spring" as const, bounce: 0, duration: 0.35 },
  drawer: { type: "spring" as const, bounce: 0.15, duration: 0.3 },
} as const

export function project(initialVelocity: number, decelerationRate = 0.998) {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

export function rubberband(
  overshoot: number,
  dimension: number,
  constant = 0.55,
) {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  )
}
