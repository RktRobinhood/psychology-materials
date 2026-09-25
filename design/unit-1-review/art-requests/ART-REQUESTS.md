# Art requests for Odyssey (for ChatGPT)

Three character sheets are needed (Eurylochus and Polites are must-haves, Elpenor would be nice) and three optional backgrounds. Each request below is self-contained: open a new ChatGPT image chat, attach the listed reference images from this folder, and paste the prompt.

## Rules for every sheet (why: so the game can cut it up automatically)

- **Transparent background** (PNG), no floor, no shadow blobs, no text, no labels, no numbers.
- **Separate every pose with clear empty space** (at least a finger's width). Nothing may touch or overlap: no capes or ropes crossing into a neighbour.
- **Layout like ref-1:** top row 4 full-body poses, middle row 4 full-body poses, bottom row 4 head-and-shoulders busts. Wide canvas, about 1536 x 1024 or larger.
- **Full bodies show the feet.** Every full-body pose at the same scale (same character height), standing on the same imaginary ground line.
- **Busts:** same crop in all four (top of head to upper chest), facing slightly towards the viewer.
- **Style:** match ref-1 exactly: painterly, graphic-novel ink lines, warm Mediterranean palette, same level of detail and lighting.

When a sheet comes back, check it against the list at the bottom before sending it to me.

---

## 1. Eurylochus, the second-in-command (must have)

**Why:** he currently has the same face, hair and beard as Odysseus (see ref-3), and they are on screen together constantly.

**Attach:** `ref-1-style-and-layout-odysseus.png`, `ref-3-eurylochus-too-similar-to-odysseus.png`

**Prompt:**

> Create a character sprite sheet for an educational game based on the Odyssey, in exactly the same art style, scale and layout as the first attached image (the Odysseus sheet): transparent background, top row four full-body poses, middle row four full-body poses, bottom row four head-and-shoulders busts, with clear empty space between every figure so nothing touches.
>
> The character is Eurylochus, Odysseus's blunt, sceptical second-in-command. He must look clearly different from Odysseus (the second attached image shows the problem: the current Eurylochus is on the right and looks almost identical to Odysseus on the left). Make him:
> - older, about 55, heavier and broader-shouldered, a little shorter than Odysseus
> - **close-cropped grey-streaked hair, receding**, no curls
> - a **short, squared, salt-and-pepper beard**
> - a weathered, sun-darkened face with a **scar through his left eyebrow** and a slightly broken nose
> - a **faded teal-blue sleeveless tunic** with a worn leather sailor's jerkin and a wide belt, bare forearms with leather bracers, rope coiled over one shoulder
> - no armour, no red cloak, no gold
>
> Full-body poses (in this order): 1 standing neutral; 2 arms crossed, unimpressed; 3 arguing, one hand thrust forward, palm up; 4 lookout, hand shading his eyes; 5 hauling a rope, leaning back; 6 holding a spear ready; 7 sitting on a wooden crate, head in hands, despairing; 8 walking, mid-stride.
>
> Busts (in this order): calm; wary, eyes narrowed; angry, shouting; tired and sad.

---

## 2. Polites, Odysseus's friend (must have)

**Why:** only his sitting pose and faces exist (the red-bandana sailor in ref-2). His standing and pointing poses are borrowed from other sailors who look like Odysseus, so he changes identity mid-game.

**Attach:** `ref-1-style-and-layout-odysseus.png`, `ref-2-polites-keep-this-look.png`

**Prompt:**

> Create a character sprite sheet for an educational game based on the Odyssey, in exactly the same art style, scale and layout as the first attached image: transparent background, top row four full-body poses, middle row four full-body poses, bottom row four head-and-shoulders busts, with clear empty space between every figure so nothing touches.
>
> The character is Polites, a cheerful, warm-hearted young sailor and Odysseus's friend. Keep him **exactly as in the second attached image**: the same face, the **red bandana**, the dark stubbly beard, the cream tunic and leather straps. He must stay recognisably the same man. He should read as younger and friendlier than Odysseus: about 28, open expression, quick to smile.
>
> Full-body poses (in this order): 1 standing neutral, relaxed; 2 pointing excitedly into the distance; 3 laughing, one hand on his belly; 4 kneeling, checking his own hands in wonder; 5 worried, hand to his forehead; 6 sitting on a crate with a coil of rope (as in the reference); 7 rowing, gripping an oar; 8 walking, mid-stride.
>
> Busts (in this order): calm and friendly; worried; laughing; in pain.

---

## 3. Elpenor, the youngest sailor (nice to have)

**Why:** his two existing poses come from a mixed sheet. A dedicated sheet adds a climbing pose for the roof scene.

**Attach:** `ref-1-style-and-layout-odysseus.png`

**Prompt:**

> Create a character sprite sheet for an educational game based on the Odyssey, in exactly the same art style, scale and layout as the attached image: transparent background, top row four full-body poses, middle row four full-body poses, bottom row four head-and-shoulders busts, with clear empty space between every figure so nothing touches.
>
> The character is Elpenor, the youngest sailor: about 17, slim, **beardless**, a mop of light-brown curly hair, big eager eyes, a sky-blue short tunic with a rope belt, bare feet. He must look nothing like a bearded warrior.
>
> Full-body poses (in this order): 1 standing eagerly; 2 sitting cross-legged holding a lotus flower, dreamy; 3 climbing a wooden ladder; 4 holding a wine cup up, laughing; 5 startled, stepping back; 6 pale and ghostly, translucent, standing still (his shade in the Underworld); 7 walking; 8 waving.
>
> Busts (in this order): calm; awed and dreamy; worried; ghostly and sad.

---

## 4. Optional backgrounds

Wide 16:9 painted scenes, **no characters in them**, the same style as the existing scenes. Leave empty space in the lower left and lower right thirds for characters to stand. At least 1672 x 941.

- **Thrinacia, the island of the Sun:** golden light, rolling grassy hills with fat sacred cattle grazing, a beached Greek ship, the sun low and huge. Currently the game reuses a flowery garden here.
- **Aeaea hillside:** a forest path at dusk climbing towards a stone house with smoke rising from it, faint green magic light between the trees. Currently reused for Circe's island.
- **Ithaca beach at dawn:** a quiet rocky cove, olive trees, a small cave, the palace far up on the hill. Currently the game jumps straight into the palace hall.

---

## Checklist before sending me a sheet

- [ ] Transparent background (not white or grey)
- [ ] No text or labels anywhere
- [ ] Every figure separated, nothing overlapping
- [ ] Twelve figures: eight full-body, four busts
- [ ] Eurylochus clearly different from Odysseus: grey crop, square beard, teal tunic
- [ ] Polites keeps the red bandana in every pose

Save the images into `design/unit-1-review/source-assets/characters/` (or just drop them in this chat). I will slice them, fit them to the game and swap them in.

---

## Outcome (25 September 2026)

Two rounds came back: eight sheets, then three more (sent twice, so eleven unique sheets in total). All sheets are kept in `source-assets/characters-v2/` and sliced with `tools/slice_sheets.py`.

| Role | Sheet used | Why this one |
|---|---|---|
| Eurylochus | `eurylochus_v2` (bald, grey beard, navy cloak, rope belt) | The only version that reads as a different man at a glance. `eurylochus_v3` (dark curly hair and beard, armour) still looks like Odysseus's twin. |
| Polites | `polites_v2` (scruffy, teal cloak, red scarf) | The red scarf keeps the old look. `polites_v3` wears a red cloak like Odysseus, so the two blur together on stage. It also has no pointing pose, which the script needs. |
| Elpenor | `elpenor_v3` (beardless 17-year-old, curly hair) | Matches the brief. `elpenor_v2` is a child, which is wrong for a sailor who falls asleep drunk on Circe's roof. His teal cloak is recoloured green in `tools/build_assets.py` (`RECOLOUR`) so he does not match Polites. |

Each crewman now has his own colour: Odysseus red, Eurylochus navy, Polites teal with a red scarf, Elpenor green.

Script changes: Eurylochus's "Torches on the ridge!" now uses his pointing pose (`lookout`), because the new sheet has no spear. Elpenor's two Underworld lines use a new `sad` face.

The rest are unused but kept for later: Telemachus (`telemachus_v2`), two palace servants (`maid_v2`, `servant_v2`), two spare bearded sailors (`spare-bearded-a_v2`, `spare-bearded-b_v2`), and the unused alternatives named above. None of them is published.
