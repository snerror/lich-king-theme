import { expect, test } from 'claude-code/testing'
import type { TestBody } from 'claude-code/testing'
import type { ThemeSetArgs } from 'claude-code'

import { SCENE } from '../hooks/scene.js'

const LOCAL = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>'

const backdrop = (plugin: string, scene: string) =>
  ({
    plugin: 'lich-king',
    component: 'Backdrop',
    props: { plugin, scene, glass: { blur: 18, tint: '#0b1119', opacity: 0.6 } },
  }) as const

test('session start sets the dark palette and the icecrown scene', async ($, on) => {
  let sent: ThemeSetArgs | undefined

  on('theme.set', (_, e) => {
    sent = e

    return { value: { isDrawn: true, requestId: 'theme' } }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(sent?.backdrop).toMatchObject({ scene: 'lich-king-icecrown' })
  expect(Object.keys(sent?.colors?.inputs ?? {})).toEqual(['dark'])
})

test('the backdrop draws the scene on desktop and mobile', async $ => {
  for (const surface of ['desktop', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...backdrop('lich-king', 'lich-king-icecrown'), surface })

    expect((await ui.drawn()).type).toBe('Svg')
    await ui.unmount()
  }
})

// Starts a session whose mod folder holds `local` as local/scene.svg (none when undefined), then reads the backdrop's markup.
const sceneDrawn = async ([$, on]: Parameters<TestBody>, local: string | undefined) => {
  on('fs.read', (_, e) => {
    if (local !== undefined && e.path.endsWith('/local/scene.svg')) {
      return { value: local }
    }
    throw new Error(`ENOENT: no such file, open '${e.path}'`)
  })
  on('theme.set', () => ({ value: { isDrawn: true, requestId: 'theme' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...backdrop('lich-king', 'lich-king-icecrown'), surface: 'desktop' })
  const drawn = await ui.drawn()

  await ui.unmount()

  return drawn
}

test('with no local scene the backdrop draws the bundled spire', async ($, on) => {
  expect(await sceneDrawn([$, on], undefined)).toMatchObject({ type: 'Svg', props: { source: SCENE } })
})

test('a local scene in the mod folder replaces the bundled one', async ($, on) => {
  expect(await sceneDrawn([$, on], LOCAL)).toMatchObject({ type: 'Svg', props: { source: LOCAL } })
})

test('a local scene over the size limit falls back to the spire', async ($, on) => {
  const big = LOCAL.replace('</svg>', `<!--${'x'.repeat(131072)}--></svg>`)

  expect(await sceneDrawn([$, on], big)).toMatchObject({ type: 'Svg', props: { source: SCENE } })
})

test('a local file that is not an svg falls back to the spire', async ($, on) => {
  expect(await sceneDrawn([$, on], '<html><body>no</body></html>')).toMatchObject({
    type: 'Svg',
    props: { source: SCENE },
  })
})

test("another plugin's scene goes to the engine", async ($, on) => {
  on('ui.render', ($, e) => {
    const { Box } = $.ui.resolve(e)

    return <Box key="engine" />
  })

  const ui = await $.ui.mount({ ...backdrop('someone-else', 'lagoon'), surface: 'desktop' })

  expect((await ui.drawn()).type).toBe('Box')
  await ui.unmount()
})
