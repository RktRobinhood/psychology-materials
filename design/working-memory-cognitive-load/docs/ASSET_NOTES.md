# ASSET NOTES

## Primary style references

- `assets/reference/style_board_primary.png`
  - Preferred character identities and overall palette.
  - Includes the anthropomorphic cast direction: Selene (owl), Nova (fox/cat-like pathfinder), Cael (wolf/lion-like strategist), plus one conventional male and one conventional female human character.
  - Includes pixel sprite references, expressive portraits, UI examples, mini-game concepts and cognitive sigils.

- `assets/reference/style_board_environment_ui.png`
  - Preferred reference for scene composition, background locations and game-screen layout.
  - Includes clean examples of the Archive, Echo Chamber, Map of Shards, Focus Gate, Switchyard, Story Loom, Noisy Hall, Pattern Shrine and Overload Engine.

## Runtime-ready crops

### Portraits
`assets/portraits/*_main.png`

These are enlarged crops from the primary generated style board. They are appropriate for the prototype dialogue window. A final art pass should regenerate them as native-resolution portraits with matching mouth-open/mouth-closed talk frames.

### Expressions
`assets/expressions/*.png`

Four expression references per character. These are intended mainly as visual references and placeholders. They can be used for reactions, but the crops are lower resolution than a final production set should be.

### Sprites
`assets/sprites/*`

The `*_strip.png` files preserve the generated pose strip with labels/background for reference. The `*_atlas_transparent.png` files are rough background-removed crops intended as prototyping aids, not final polished atlases.

Production target is documented in `DESIGN_BIBLE.md`:
- idle x2
- walk each direction x4
- talk x2
- surprise x2
- interact x3
- celebrate x3

### Backgrounds
`assets/backgrounds/*.jpg`

These are 1280x720 prototype upscales from the environment style board. They are compositionally useful and can be used immediately, but they should eventually be regenerated natively at 16:9 for higher projector sharpness.

### Icons
`assets/icons/*.png`

Prototype cognitive-system and cognitive-load sigils.

### Audio
`assets/audio/*.wav`

Original synthesized UI cues created for this prototype. No external music or copyrighted game audio is included.

## Copyright/style note

The generated artwork is original and is not copied from a specific JRPG franchise. The direction intentionally uses broad genre conventions: painterly fantasy portraits, pixel sprites, parchment UI, sigils and dark fantasy architecture.
