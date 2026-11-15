import { expect, test } from 'claude-code/testing'
import type { ThemeSetArgs } from 'claude-code'

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

test("another plugin's scene goes to the engine", async ($, on) => {
  on('ui.render', ($, e) => {
    const { Box } = $.ui.resolve(e)

    return <Box key="engine" />
  })

  const ui = await $.ui.mount({ ...backdrop('someone-else', 'lagoon'), surface: 'desktop' })

  expect((await ui.drawn()).type).toBe('Box')
  await ui.unmount()
})
