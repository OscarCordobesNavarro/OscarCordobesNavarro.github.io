import { useEffect, useState, type RefObject } from "react"

type Point = [number, number]

// Fuerza vertical fija de la curva (en px), independiente de la distancia real entre los puntos.
// Un generador de curva "bump" (tipo d3-shape linkVertical) calcula el control proporcional a la
// distancia total, lo que da una curva casi plana cuando el salto horizontal es mucho mayor que
// el vertical (nuestro caso) — por eso se construye el path a mano con una fuerza fija.
const CURVE_STRENGTH = 32

// El destino suele ser el centro de un punto (nodo) real, no un ancla invisible — sin este margen
// el path terminaría dentro del círculo en vez de detenerse justo antes de tocarlo.
const TARGET_MARGIN = 9

function buildSmoothPath(source: Point, target: Point) {
    const [sx, sy] = source
    const [tx, rawTy] = target
    // El destino siempre queda por debajo del origen en este grafo (el trazo va hacia abajo),
    // así que recortar el margen hacia arriba acerca el final del trazo al origen, no al revés.
    const ty = rawTy - TARGET_MARGIN
    return `M ${sx} ${sy} C ${sx} ${sy + CURVE_STRENGTH}, ${tx} ${ty - CURVE_STRENGTH}, ${tx} ${ty}`
}

// Mide en tiempo real la posición de dos elementos del DOM (dentro de un contenedor común)
// y devuelve el "path" SVG de una curva suave que los conecta, recalculado ante cualquier
// cambio de layout (resize, reflow por texto, cambio de breakpoint...).
export function useLinkPath(
    containerRef: RefObject<HTMLElement | null>,
    sourceRef: RefObject<HTMLElement | null>,
    targetRef: RefObject<HTMLElement | null>
) {
    const [path, setPath] = useState<string | null>(null)

    useEffect(() => {
        const container = containerRef.current
        const source = sourceRef.current
        const target = targetRef.current
        if (!container || !source || !target) return

        const measure = () => {
            const containerRect = container.getBoundingClientRect()
            const sourceRect = source.getBoundingClientRect()
            const targetRect = target.getBoundingClientRect()

            const sourcePoint: Point = [
                sourceRect.left + sourceRect.width / 2 - containerRect.left,
                sourceRect.top + sourceRect.height / 2 - containerRect.top,
            ]
            const targetPoint: Point = [
                targetRect.left + targetRect.width / 2 - containerRect.left,
                targetRect.top + targetRect.height / 2 - containerRect.top,
            ]

            setPath(buildSmoothPath(sourcePoint, targetPoint))
        }

        measure()

        const observer = new ResizeObserver(measure)
        observer.observe(container)
        observer.observe(source)
        observer.observe(target)
        window.addEventListener("resize", measure)

        return () => {
            observer.disconnect()
            window.removeEventListener("resize", measure)
        }
    }, [containerRef, sourceRef, targetRef])

    return path
}
