import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene.js'

const SCENE_NAME = 'lich-king-icecrown'
const SVG_LIMIT = 131072
const SPIRE = {
  source: SCENE,
  alt: 'A frozen citadel spire with a pulsing rune glow under an aurora, snow drifting down',
}

// Icecrown teal: frost-cyan on deep teal slate, dark mode only.
const { theme, problems } = makeColors({
  label: 'Lich King',
  only: 'dark',
  roles: { accent: '#3ccbdc', danger: '#d64545', success: '#5fd3a0', warning: '#e0b04a', pro: '#9b8cff' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#071419',
        'surface-1': '#0b1a20',
        'surface-2': '#0f1f26',
        'surface-3': '#12242b',
        'text-primary': '#e2f5f7',
        'text-secondary': '#aac8cd',
        'text-muted': '#86a7ad',
      },
    },
    git: { added: '#5fd3a0', removed: '#ef6b66', modified: '#3ccbdc', merged: '#b0a6ff', conflicting: '#e0b04a' },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: SCENE_NAME, glass: { blur: 12, tint: '#071419', opacity: 0.5 } },
}

export const register: Register = on => {
  // The mod folder's local/scene.svg when it holds a usable one, else the bundled spire.
  let scene = SPIRE

  on('session.start', async ($, e, next) => {
    const local = await $.fs.read(`${$.plugin.root}/local/scene.svg`).catch(() => undefined)

    scene =
      local !== undefined && local.length <= SVG_LIMIT && local.trimStart().startsWith('<svg')
        ? { source: local, alt: "The backdrop scene from the mod's local folder" }
        : SPIRE
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

    return <Svg source={scene.source} alt={scene.alt} isInteractive />
  })
}
