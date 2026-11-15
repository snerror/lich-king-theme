# Lich King theme for Claude Code

A frozen, Northrend-at-night look for the Claude desktop and mobile apps, inspired by World of Warcraft: Wrath of the Lich King.

- **Icecrown-teal palette (dark mode):** frost-cyan for focus and code keywords, deep teal-slate surfaces, frost-white text. Errors stay blood red, success a frosty green, warnings amber.
- **Animated backdrop:** an original frozen citadel spire with a pulsing rune glow and slowly turning rune rings, an aurora, twinkling stars and three layers of drifting snow, behind frosted panels. It adapts to phones and narrow windows, and stops animating when your system asks for reduced motion.

The theme draws in the desktop and mobile apps. The terminal can't draw custom themes, so there it does nothing.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install lich-king --marketplace snerror/lich-king-theme
```

Answer `y` to add the marketplace, then pick a scope (user scope loads it in every session).

From a shell:

```bash
claude plugin install lich-king --marketplace snerror/lich-king-theme
```

In the desktop app, where `/plugin` doesn't run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `snerror/lich-king-theme`, then **Add plugin**.

The theme appears in the next session you start. It's made for dark mode, so switch the app to dark if it looks off.

## Your own scene

When you load the mod from a clone of this repo (with `--plugin-dir` or `CLAUDE_CODE_PLUGIN_DIRS`), put an SVG at `local/scene.svg` in the clone and the mod draws it instead of the spire, from the next session on. The `local/` folder is ignored by git, so a picture you can't share stays on your machine. A marketplace install keeps the mod in a folder per version that an update replaces, so the slot is for clones. The file must start with `<svg` and be at most 131,072 characters; anything else falls back to the spire. The scene runs no script, so animate it with CSS in its own `<style>`.

## What's inside

- `hooks/register.tsx`: sets the palette and backdrop at session start, and draws the scene.
- `hooks/scene.js`: the animated SVG scene.
- `hooks/make-colors.js`: Claude Code's palette helper, unchanged.
- `tests/look.test.tsx`: run with `claude plugin test .`

## Notes

This is an unofficial fan theme. It is not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft and Wrath of the Lich King are trademarks of Blizzard Entertainment, Inc. All artwork here is original, and no game assets are included.

MIT licensed.
