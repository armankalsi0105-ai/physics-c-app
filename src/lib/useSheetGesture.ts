'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { projectMomentum, rubberband, spring, type SpringHandle } from './spring'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type Options = {
  open: boolean
  onClose: () => void
  panelRef: RefObject<HTMLElement | null>
  /** Optional scrim; its opacity tracks the sheet 1:1 while dragging. */
  backdropRef?: RefObject<HTMLElement | null>
  /** Which edge the sheet lives on. */
  side: 'left' | 'right'
  /** Skip the gesture entirely (e.g. the desktop rail is not a sheet). */
  disabled?: boolean
}

// Apple's published drawer feel: a little overshoot, quick response.
const SHEET_SPRING = { response: 0.3, damping: 0.8 }
const DRAG_THRESHOLD = 8

function clearInlineStyles(panel: HTMLElement | null, backdrop: HTMLElement | null) {
  if (panel) panel.style.removeProperty('--sheet-x')
  if (backdrop) backdrop.style.opacity = ''
}

/**
 * Makes an edge sheet draggable: the panel tracks the finger 1:1, resists
 * past its open position, and on release projects the flick's momentum to
 * decide whether to settle open or closed — handing the release velocity to
 * the spring so there is no seam between dragging and animating.
 *
 * Grabbing a sheet that is already animating takes over from its current
 * position and velocity rather than restarting.
 */
export function useSheetGesture({
  open,
  onClose,
  panelRef,
  backdropRef,
  side,
  disabled = false,
}: Options) {
  const reducedMotion = usePrefersReducedMotion()

  // Refs so the pointer handlers never go stale between renders.
  const anim = useRef<SpringHandle | null>(null)
  const offset = useRef(0)
  const target = useRef(0)
  const openRef = useRef(open)
  const closeRef = useRef(onClose)

  // Kept current in an effect: writing a ref during render is not allowed,
  // and the pointer handlers only ever read these outside render anyway.
  useEffect(() => {
    openRef.current = open
    closeRef.current = onClose
  }, [open, onClose])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel || disabled) return

    // Closed sits one panel-width off its own edge.
    const closedOffset = () =>
      side === 'left' ? -panel.offsetWidth : panel.offsetWidth

    const paint = (x: number) => {
      offset.current = x
      panel.style.setProperty('--sheet-x', `${x}px`)
      const backdrop = backdropRef?.current
      if (backdrop) {
        const span = Math.abs(closedOffset()) || 1
        const progress = 1 - Math.min(1, Math.abs(x) / span)
        backdrop.style.opacity = String(progress)
      }
    }

    const settle = (to: number, velocity: number) => {
      anim.current?.stop()
      target.current = to
      // rAF does not tick in a hidden document, so a spring started here
      // would never run and the sheet would be stranded mid-transform.
      if (reducedMotion || document.hidden) {
        paint(to)
        if (to !== 0) closeRef.current()
        return
      }
      anim.current = spring(offset.current, to, {
        ...SHEET_SPRING,
        velocity,
        onUpdate: paint,
        onRest: () => {
          anim.current = null
          if (to !== 0) closeRef.current()
        },
      })
    }

    let pointerId: number | null = null
    let startX = 0
    let startOffset = 0
    let dragging = false
    let history: { x: number; t: number }[] = []

    const onPointerDown = (e: PointerEvent) => {
      if (!openRef.current) return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      // Let controls and scrollable regions inside the sheet keep their input.
      const target = e.target as HTMLElement
      if (target.closest('button, a, input, textarea, select')) return

      // Interruption: take over the in-flight animation where it actually is.
      const live = anim.current?.stop()
      if (live) offset.current = live.value
      anim.current = null

      pointerId = e.pointerId
      startX = e.clientX
      startOffset = offset.current
      dragging = false
      history = [{ x: e.clientX, t: performance.now() }]
    }

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return
      const dx = e.clientX - startX

      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return
        // Only claim the gesture once it heads toward the closing edge.
        const closing = side === 'left' ? dx < 0 : dx > 0
        if (!closing) return
        dragging = true
        // Throws if the pointer was already released between frames.
        try {
          panel.setPointerCapture(e.pointerId)
        } catch {
          /* tracking still works without capture */
        }
      }

      history.push({ x: e.clientX, t: performance.now() })
      if (history.length > 6) history.shift()

      let next = startOffset + dx
      // Past fully-open, resist instead of letting it fly off the far side.
      const overshoot = side === 'left' ? next : -next
      if (overshoot > 0) {
        next = rubberband(overshoot, panel.offsetWidth) * (side === 'left' ? 1 : -1)
      }
      paint(next)
    }

    const endDrag = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return
      pointerId = null
      if (!dragging) return
      dragging = false
      try {
        if (panel.hasPointerCapture(e.pointerId)) {
          panel.releasePointerCapture(e.pointerId)
        }
      } catch {
        /* already released */
      }

      // Velocity from the recent history, not the last event alone — a single
      // frame is noisy and often reads ~0 right at release.
      const now = performance.now()
      const recent = history.filter((p) => now - p.t < 100)
      const first = recent[0] ?? history[0]
      const dt = (now - first.t) / 1000
      const velocity = dt > 0 ? (e.clientX - first.x) / dt : 0

      const closed = closedOffset()
      const projected = offset.current + projectMomentum(velocity)
      // Decide from where the flick is *going*, not where the finger stopped.
      const shouldClose =
        side === 'left'
          ? projected < closed / 2
          : projected > closed / 2

      settle(shouldClose ? closed : 0, velocity)
    }

    panel.addEventListener('pointerdown', onPointerDown)
    panel.addEventListener('pointermove', onPointerMove)
    panel.addEventListener('pointerup', endDrag)
    panel.addEventListener('pointercancel', endDrag)

    return () => {
      panel.removeEventListener('pointerdown', onPointerDown)
      panel.removeEventListener('pointermove', onPointerMove)
      panel.removeEventListener('pointerup', endDrag)
      panel.removeEventListener('pointercancel', endDrag)
    }
  }, [panelRef, backdropRef, side, disabled, reducedMotion])

  // Drive the sheet whenever `open` changes from outside the gesture.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel || disabled) return

    const closed = side === 'left' ? -panel.offsetWidth : panel.offsetWidth
    const to = open ? 0 : closed
    const paint = (x: number) => {
      offset.current = x
      panel.style.setProperty('--sheet-x', `${x}px`)
      const backdrop = backdropRef?.current
      if (backdrop) {
        const progress = 1 - Math.min(1, Math.abs(x) / (Math.abs(closed) || 1))
        backdrop.style.opacity = String(progress)
      }
    }

    const live = anim.current?.stop()
    const from = live ? live.value : open ? closed : 0
    target.current = to

    if (reducedMotion || document.hidden) {
      paint(to)
      return
    }

    anim.current = spring(from, to, {
      ...SHEET_SPRING,
      velocity: live?.velocity ?? 0,
      onUpdate: paint,
      onRest: () => {
        anim.current = null
      },
    })

    const onVisibility = () => {
      if (!document.hidden) return
      anim.current?.stop()
      anim.current = null
      paint(target.current)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      anim.current?.stop()
      anim.current = null
    }
  }, [open, panelRef, backdropRef, side, disabled, reducedMotion])

  // Clear inline transforms when the sheet stops being a sheet (desktop).
  useEffect(() => {
    if (!disabled) return
    anim.current?.stop()
    anim.current = null
    clearInlineStyles(panelRef.current, backdropRef?.current ?? null)
  }, [disabled, panelRef, backdropRef])
}
