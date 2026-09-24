# CLAUDE / CODEX HANDOFF

## Goal
Turn this production pack into a polished, projector-friendly, fully interactive static lesson site without redesigning the concept.

## Preserve these decisions

1. **Campaign order and narrative beats** in `PRODUCTION_SCRIPT.md`.
2. The core cast and their psychology roles.
3. The short dialogue-box teaching style.
4. The sequence: experience first -> name mechanism second.
5. The distinction between informal replication and demonstration.
6. The visual language established by the generated style boards.
7. A teacher should be able to walk in with only basic subject familiarity and run the lesson from the interface.

## Do not

- Turn the site into a conventional scrolling textbook.
- Put full-paragraph explanations on game screens.
- Treat class performance as diagnostic.
- Claim the hook video proves that "this generation" has declining executive control.
- Replace the visual assets with generic Bootstrap/card-dashboard design.
- Remove chapter-jump capability.

## Engineering priority

### Phase 1 — reliability
- Convert current prototype to a clean component/state architecture.
- Harden each mini-game.
- Add deterministic reset and replay.
- Make all timing independent of display refresh rate.
- Improve keyboard accessibility.

### Phase 2 — presentation
- Add true portrait mouth A/B frames and sprite animations.
- Add scene transitions and sigil-acquisition animation.
- Add responsive projector mode and student-laptop mode.
- Add reduced-motion support.

### Phase 3 — classroom analytics (optional)
- If a backend is available, allow anonymous session codes and class aggregate results.
- Never store personally identifying student data by default.
- Teacher display can show condition means and simple distributions.

## Data architecture

Keep narrative in data rather than hard-coding dialogue into components. A chapter should contain:

```js
{
  id,
  title,
  background,
  recap,
  screens: [
    { type: 'dialogue', speaker, expression, text },
    { type: 'teacherBeat', ... },
    { type: 'game', gameId, ... },
    { type: 'result', ... },
    { type: 'sigil', ... }
  ]
}
```

## Audio

The included WAV files are simple original UI cues. Use Web Speech API only as an optional enhancement; the lesson must not depend on browser speech synthesis.

## Image notes

`assets/reference/style_board_primary.png` is the strongest character/UI reference.
`assets/reference/style_board_environment_ui.png` is the strongest environment/layout reference.

The cropped backgrounds are upscaled from the reference board and are good enough for prototyping. A final production pass can regenerate them at native 16:9 resolution while preserving composition.

The sprite strips are references, not ideal final atlases. Regenerate/clean them before shipping if smooth sprite animation becomes important.

## Hook video

Current URL:
`https://www.youtube.com/watch?v=ZYG4Dg9JEMw`

Do not depend on a transcript being available. The production script uses the video only as a provocative hook and tests the underlying cognitive mechanisms independently.
