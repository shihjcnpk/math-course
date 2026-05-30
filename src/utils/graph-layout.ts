/**
 * Knowledge graph layout utilities.
 * Uses a simple layered layout algorithm (no external dagre dependency needed for now).
 * Each concept category gets its own column; nodes are layered by prerequisite depth.
 */

/**
 * Simple column-based layout:
 * - Each category gets its own horizontal column
 * - Within each column, nodes are stacked vertically
 * - Grade 7 nodes above, Grade 8 nodes below
 */
export function computeLayout(
  nodes: Array<{ id: string; category: string; grade: number }>,
  categoryOrder: string[],
): Map<string, { x: number; y: number }> {
  const layout = new Map<string, { x: number; y: number }>()
  const columnWidth = 280
  const rowHeight = 80
  const startX = 50
  const startY = 50

  // Group nodes by category
  const groups = new Map<string, Array<{ id: string; grade: number }>>()
  for (const node of nodes) {
    if (!groups.has(node.category)) groups.set(node.category, [])
    groups.get(node.category)!.push({ id: node.id, grade: node.grade })
  }

  categoryOrder.forEach((cat, colIdx) => {
    const group = groups.get(cat) || []
    // Sort by grade then alphabetically
    group.sort((a, b) => a.grade - b.grade || a.id.localeCompare(b.id))

    group.forEach((node, rowIdx) => {
      layout.set(node.id, {
        x: startX + colIdx * columnWidth,
        y: startY + rowIdx * rowHeight,
      })
    })
  })

  return layout
}

export const CATEGORY_ORDER = [
  'number-and-expression',
  'equation-and-inequality',
  'geometry-and-proof',
  'coordinate-and-function',
  'statistics-and-data',
]
