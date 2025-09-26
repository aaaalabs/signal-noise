// Refined Dark Mode Color System for Signal/Noise Blog
export const darkTheme = {
  // Base colors - softer than pure black/white
  background: {
    primary: '#0a0a0a',    // Main background (was #000)
    secondary: '#0f0f0f',  // Slightly lighter for cards
    tertiary: '#141414',   // Even lighter for nested elements
    elevated: '#1a1a1a',   // Floating elements
  },

  text: {
    primary: '#e8e8e8',    // Main text (was #fff)
    secondary: '#b8b8b8',  // Secondary text
    tertiary: '#888888',   // Muted text (was #666)
    inverse: '#0a0a0a',    // Text on light backgrounds
  },

  border: {
    subtle: '#1a1a1a',     // Very subtle borders
    default: '#242424',    // Standard borders (was #333)
    strong: '#2a2a2a',     // Emphasized borders
  },

  // Semantic colors remain vibrant
  signal: '#00ff88',       // Keep the brand green
  noise: '#ff6b6b',        // Error/noise red
  warning: '#ff8800',      // Admin orange

  // Table specific styles
  table: {
    background: '#0f0f0f',
    headerBg: '#0a1f14',   // Subtle green tint
    rowHover: '#141414',
    rowAlt: '#0d0d0d',     // Alternating rows
    borderColor: '#1f1f1f',
  }
};

// Refined table styles
export const tableStyles = {
  container: {
    overflowX: 'auto' as const,
    marginBottom: '2rem',
    borderRadius: '12px',
    backgroundColor: darkTheme.table.background,
    padding: '2px',
  },

  table: {
    width: '100%',
    borderCollapse: 'separate' as const,
    borderSpacing: '0',
    fontSize: '0.95rem',
  },

  thead: {
    backgroundColor: darkTheme.table.headerBg,
  },

  th: {
    padding: '14px 16px',
    textAlign: 'left' as const,
    color: darkTheme.signal,
    fontWeight: '500',
    fontSize: '0.85rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderBottom: `2px solid ${darkTheme.border.default}`,
  },

  tbody: {},

  tr: {
    borderBottom: `1px solid ${darkTheme.table.borderColor}`,
    transition: 'background-color 0.15s ease',
  },

  trHover: {
    backgroundColor: darkTheme.table.rowHover,
  },

  td: {
    padding: '12px 16px',
    color: darkTheme.text.secondary,
    borderBottom: `1px solid ${darkTheme.table.borderColor}`,
  },

  tdHighlight: {
    color: darkTheme.signal,
    fontWeight: '500',
  },

  // For alternating row colors
  trAlt: {
    backgroundColor: darkTheme.table.rowAlt,
  }
};

// Code block refinements
export const codeBlockStyles = {
  container: {
    backgroundColor: '#0d0d0d',
    border: `1px solid ${darkTheme.border.default}`,
    borderRadius: '8px',
    padding: '1rem',
    overflowX: 'auto' as const,
  },

  inline: {
    backgroundColor: '#1a1a1a',
    color: darkTheme.signal,
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '0.9em',
    fontFamily: 'monospace',
  }
};

// Box/Card styles
export const boxStyles = {
  info: {
    backgroundColor: 'rgba(0, 255, 136, 0.03)',
    border: '1px solid rgba(0, 255, 136, 0.15)',
    borderRadius: '8px',
    padding: '1.5rem',
  },

  warning: {
    backgroundColor: 'rgba(255, 136, 0, 0.03)',
    border: '1px solid rgba(255, 136, 0, 0.15)',
    borderRadius: '8px',
    padding: '1.5rem',
  },

  neutral: {
    backgroundColor: darkTheme.background.secondary,
    border: `1px solid ${darkTheme.border.subtle}`,
    borderRadius: '8px',
    padding: '1.5rem',
  }
};