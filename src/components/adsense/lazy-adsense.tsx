import { useRouterState } from "@tanstack/react-router"
import { useEffect, useRef } from "react"

const ADSENSE_CLIENT_ID = "ca-pub-4946821479056257"
const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`
const FALLBACK_TIMEOUT_MS = 8000
const TRIGGER_EVENTS = [
  "scroll",
  "click",
  "keydown",
  "touchstart",
  "pointerdown",
] as const

function loadAdsenseScript(): HTMLScriptElement {
  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${ADSENSE_SCRIPT_SRC}"]`,
  )
  if (existing) return existing
  const script = document.createElement("script")
  script.src = ADSENSE_SCRIPT_SRC
  script.async = true
  script.crossOrigin = "anonymous"
  document.body.appendChild(script)
  return script
}

function pushPendingAds(): void {
  const slots = Array.from(
    document.querySelectorAll<HTMLModElement>("ins.manual-adsense"),
  )
  for (const ins of slots) {
    if (ins.querySelector("iframe")) continue
    window.adsbygoogle ??= []
    window.adsbygoogle.push({})
  }
}

export function LazyAdsense() {
  const armedRef = useRef(false)

  useEffect(() => {
    const scriptAlreadyPresent = Boolean(
      document.querySelector(`script[src="${ADSENSE_SCRIPT_SRC}"]`),
    )
    if (window.adsbygoogle && scriptAlreadyPresent) {
      armedRef.current = true
      pushPendingAds()
      return
    }

    const timeoutRef = { current: undefined as number | undefined }

    const arm = () => {
      if (armedRef.current) return
      armedRef.current = true
      for (const evt of TRIGGER_EVENTS) {
        window.removeEventListener(evt, arm)
      }
      window.clearTimeout(timeoutRef.current)
      try {
        if (window.adsbygoogle) {
          pushPendingAds()
          return
        }
        const script = loadAdsenseScript()
        script.addEventListener(
          "load",
          () => {
            pushPendingAds()
          },
          { once: true },
        )
      } catch (err) {
        console.error("LazyAdsense arm failed", err)
      }
    }

    for (const evt of TRIGGER_EVENTS) {
      window.addEventListener(evt, arm, { passive: true })
    }
    timeoutRef.current = window.setTimeout(arm, FALLBACK_TIMEOUT_MS)

    return () => {
      for (const evt of TRIGGER_EVENTS) {
        window.removeEventListener(evt, arm)
      }
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (!armedRef.current) return
    pushPendingAds()
    void pathname
  }, [pathname])

  return null
}
