# MEMORY QUEST — DESIGN BIBLE

## 1. Creative north star

**Memory Quest** should feel like a lost late-1990s/early-2000s fantasy JRPG remastered for a modern browser: painterly character portraits, tiny pixel sprites, dark fantasy architecture, restrained parchment-and-metal UI, and short text boxes that teach while the party explores.

The experience is not a visual novel. Dialogue exists to pace instruction and make concepts memorable. The lesson must still work if the teacher knows only the basic psychology beforehand.

The dominant rhythm is:

**Foreshadow -> predict -> experience -> compare -> name the mechanism -> apply -> callback.**

No wall of text should appear during gameplay. Explanations live in short dialogue boxes, key-fact cards, and teacher notes.

---

## 2. Narrative premise

The **Mind Archive** is a vast cognitive library whose systems have begun to flicker. A crystalline core visible in the opening scene has developed a thin crack. Selene does not explain it immediately.

The party initially assumes the Archive is suffering from broken memory systems. They investigate the subsystems of working memory one by one.

After apparently repairing the system, the crack spreads. This is the **false victory**: nothing was fundamentally broken. The Archive is being asked to handle more demand than its limited workspace can sustain.

The second half reframes the mystery as **cognitive load**.

The final boss is not a monster. It is the **Overload Engine**: a machine that turns normal cognitive demands into unnecessary competition and clutter.

---

## 3. Literary devices deliberately used

### Chekhov's crystal
A cracked blue Memory Crystal appears during the prologue. It is visually present in chapter transitions but not explained. In the cognitive-load reveal, students learn that the crack expands when total load exceeds available capacity.

### Rule of three
The first act contains three "system trials": verbal, visuospatial, executive control. Students feel three distinct mechanisms before the full model is consolidated.

### False victory
After the Episodic Buffer chapter, the Archive appears restored for several seconds. Lyra celebrates. Then the crystal fractures further and the UI begins to clutter/glitch.

### Mentor withheld truth
Selene never lies, but deliberately waits to introduce cognitive load until students have enough evidence to understand why it matters.

### Reversal
Early claim: "If I focus harder, I can handle it." Later realization: **good design can matter more than brute-force effort**.

### Callbacks
- Lyra begins with: "That seems easy enough." In the final boss she catches herself and says, "Before I call it easy: what is competing?"
- Orin jokes that his inner voice "has union rules." Later, in the boss battle, he identifies verbal-on-verbal competition before Selene does.
- Cael initially treats distraction as a discipline problem. The Noisy Hall teaches him that some interference is created by the environment.
- Nova initially assumes visual presentation is automatically easier. The spatial-interference trial proves visual/spatial resources can be overloaded too.

---

## 4. Main cast

### Selene — The Wise Owl
**Narrative function:** mentor, teacher, keeper of the Archive.
**Psychology function:** synthesis and episodic integration.
**Personality:** calm, precise, slightly theatrical, dry humor.
**Arc:** does not change much; instead she reveals layers of the model as the party earns them.
**Text style:** short declarative sentences. Rarely asks rhetorical questions.

Signature lines:
- "Evidence first. Confidence second."
- "A clever mind is not an unlimited mind."
- "Name the competition, and the pattern becomes easier to see."
- "Wisdom is not enduring needless load. It is designing around it."

### Lyra — The Guide
**Narrative function:** emotional lead and student proxy.
**Psychology function:** asks the obvious question and paraphrases difficult ideas.
**Personality:** brave, energetic, optimistic, slightly overconfident.
**Arc:** moves from "I can just try harder" to "What resource is this using?"

Signature lines:
- "That seems easy enough."
- "Okay. That got impossible fast."
- "So it was not that I stopped trying. The task crowded the workspace."
- Final callback: "Before I call it easy: what is competing?"

### Orin — The Wordsmith
**Narrative function:** verbal specialist.
**Psychology function:** phonological loop and articulatory suppression.
**Personality:** analytical, bookish, confident until his own system is overloaded.
**Arc:** learns that expertise in a channel does not remove that channel's capacity limit.

Signature lines:
- "If it can be said, heard, or repeated, I can keep it active."
- "My inner voice has union rules."
- "Words are my realm. Crowding them is another matter."

### Nova — The Pathfinder
**Narrative function:** spatial specialist and practical problem solver.
**Psychology function:** visuospatial sketchpad.
**Personality:** perceptive, direct, more comfortable with maps than lectures.
**Arc:** learns that visual information is not automatically low-load.

Signature lines:
- "Show me the pattern."
- "I do not repeat the route. I picture it."
- "A picture can still be crowded."

### Cael — The Strategist
**Narrative function:** control, attention, tactics.
**Psychology function:** executive control, inhibition, switching.
**Personality:** disciplined, terse, initially inclined to frame mistakes as failures of focus.
**Arc:** learns that strong control cannot make poor information design free.

Signature lines:
- "Follow the rule. Ignore the bait."
- "Switching costs."
- "Distraction is not neutral."
- Later: "Control helps. Design decides how much control we must spend."

---

## 5. Visual system

### Overall tone
- Gritty fantasy architecture, but not horror.
- Painterly portraits + pixel sprites.
- Warm parchment panels over deep navy/charcoal interface surfaces.
- Gold metal edges used sparingly for important controls.
- Blue crystalline light represents working-memory capacity.
- Red crystalline distortion represents overload.

### UI hierarchy
1. **Scene/environment** occupies full viewport background.
2. **Dialogue portrait** appears left or right depending on speaker.
3. **Dialogue box** sits low in the viewport, large enough for projection.
4. **Game panel** appears centered above the dialogue area when active.
5. **Teacher controls** remain visually secondary.

### Typography
Use browser-safe fallbacks. Do not bundle fonts.

- Display/title: `Georgia`, `Times New Roman`, serif fallback.
- Dialogue/UI: `Trebuchet MS`, `Arial`, sans-serif fallback.
- Numeric game readouts: `Consolas`, `Courier New`, monospace fallback.

### Text limits
- Dialogue bubble: target 8-20 words; hard ceiling ~32 words.
- Key fact: 1-2 sentences.
- Teacher panel: can be longer because students do not need to read it.
- Never stack more than three bubbles before an interaction.

---

## 6. Character animation rules

### Pixel sprites
Production target per character:
- idle: 2 frames
- walk down: 4 frames
- walk up: 4 frames
- walk left: 4 frames
- walk right: 4 frames
- talk: 2 frames
- surprised: 2 frames
- interact/use skill: 3 frames
- celebrate/sigil gained: 3 frames

The supplied sprite strips are **visual references**, not final transparent production atlases.

### Portraits
Production target:
- neutral
- talking mouth A/B
- happy
- surprised
- concerned/frustrated
- teaching/determined

The prototype uses static generated portraits plus small CSS motion. A production pass should create true mouth-open / mouth-closed pairs while preserving facial identity.

### Dialogue motion
While typewriter text is appearing:
- portrait bobs 1-2 px every ~240 ms
- talking-state portrait can alternate A/B if available
- stop animation when line finishes

Do not lip-sync phonemes. It should feel like a SNES-era talk animation.

---

## 7. Environments

### Mind Archive — hub / working memory
Tall cathedral-library architecture, blue crystal light, broad central aisle. Calm and mysterious.

### Echo Chamber — phonological loop
Circular chamber, luminous panels or suspended pages, repeated glyphs, strong cool-blue acoustical feel.

### Map of Shards — visuospatial
Floating islands, fragmented bridges, navigable visual routes. Brightest chapter visually.

### Focus Gate — Stroop / inhibition
Architectural gate with colored sigils that display conflicting labels.

### Switchyard — task switching
Mechanical rail junction / routing chamber. Signs and pathways change state.

### Story Loom — episodic buffer
Warm library/laboratory with orrery-like device combining threads of light.

### Noisy Hall — extraneous load
Same basic architecture as a clean learning space, but cluttered with floating notes, alerts, redundant signage, overlapping panels.

### Pattern Shrine — germane processing / schema building
Quiet, ordered architecture. Repeated motifs become visibly meaningful as the player learns the rule.

### Overload Engine — final boss
Dark red crystalline machinery. Elements from earlier chapters appear simultaneously and compete for space.

---

## 8. Iconography

Systems:
- Working memory: blue eye/brain/crystal motif
- Phonological loop: waveform/ear motif, violet-blue
- Visuospatial sketchpad: eye/cube/map motif, teal-green
- Executive control: gear/compass/star motif, gold
- Episodic buffer: linked rings / knot motif, violet

Load:
- Intrinsic: mountain / weight motif
- Extraneous: warning burst / clutter motif
- Germane: leaf / structured growth motif

Icons should appear as sigils that are "earned" after a chapter. The student can always click an earned sigil for a 1-sentence recap.

---

## 9. Teacher mode

Teacher controls:
- jump to chapter
- replay current activity
- reveal teacher notes
- toggle sound
- toggle reduced motion
- reset lesson data
- skip animation
- open recap

Teacher notes for each activity must include:
1. What students should notice.
2. What to say if the class result is messy.
3. One discussion question.
4. One syllabus/exam connection.
5. Whether this is a replication, conceptual replication, or demonstration.

---

## 10. Student mode

Student can:
- run the campaign independently
- replay mini-games
- see their own scores and reaction times
- open chapter recap
- access earned sigils

Student cannot see teacher-note wording by default.

---

## 11. Results philosophy

Never tell a student that a low score means they have "bad working memory" or "weak executive control."

Use language such as:
- "Your score dropped in the interference condition."
- "This pattern is consistent with competition for the same resource."
- "One trial is noisy; compare the conditions rather than diagnosing yourself."

Classroom activities are demonstrations, not clinical assessments.
