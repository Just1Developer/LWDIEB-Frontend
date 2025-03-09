export const rgba = (hex: string, alpha: number) => {
  hex = hex.replace(/^#/, '') // Remove '#' if present
  let r, g, b

  if (hex.length === 3) {
    const c1 = hex[0] ?? '0'
    const c2 = hex[1] ?? '0'
    const c3 = hex[2] ?? '0'
    // Convert 3-digit hex to 6-digit
    r = parseInt(c1 + c1, 16)
    g = parseInt(c2 + c2, 16)
    b = parseInt(c3 + c3, 16)
  } else {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
