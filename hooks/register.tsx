import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene.js'

const SCENE_NAME = 'lich-king-icecrown'

// Frostmourne ice: runeglow blue on Icecrown night slate, dark mode only.
const { theme, problems } = makeColors({
  label: 'Lich King',
  only: 'dark',
  roles: { accent: '#5ec8ff', danger: '#d64545', success: '#5fd3a0', warning: '#e0b04a', pro: '#9b8cff' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b1119',
        'surface-1': '#111a25',
        'surface-2': '#16212e',
        'surface-3': '#192431',
        'text-primary': '#e6f1fa',
        'text-secondary': '#b4c7d8',
        'text-muted': '#8ea5ba',
      },
    },
    git: { added: '#5fd3a0', removed: '#ef6b66', modified: '#5ec8ff', merged: '#b0a6ff', conflicting: '#e0b04a' },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: SCENE_NAME, glass: { blur: 12, tint: '#0b1119', opacity: 0.45 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== SCENE_NAME) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return (
      <Svg
        source={SCENE}
        alt="A frozen citadel spire with a pulsing rune glow under an aurora, snow drifting down"
        isInteractive
      />
    )
  })
}
