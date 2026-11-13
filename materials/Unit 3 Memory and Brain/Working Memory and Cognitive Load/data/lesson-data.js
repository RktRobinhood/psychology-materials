/* Memory Quest — lesson content.
   All narrative, teacher notes and checks live here; js/app.js renders them.
   Screen types: dialogue, keyfact, video, poll, game, study, model, sort, quiz, trial (timed Static Surge), recap, write, tally, title, finish. */
window.MEMORY_QUEST = {
  meta: {
    title: 'Memory Quest: The Mind Archive',
    subtitle: 'Working memory, executive control & cognitive load',
    video: { id: 'ZYG4Dg9JEMw', start: 0, end: 245 },
    storageKey: 'memoryQuestStateV2'
  },

  characters: {
    Selene: { role: 'The Wise Owl · Mentor', color: '#8c6a3c', side: 'left',
      expressions: ['neutral', 'happy', 'serious', 'teaching'] },
    Lyra: { role: 'The Guide · Student proxy', color: '#a8452f', side: 'left',
      expressions: ['neutral', 'happy', 'surprised', 'concerned'] },
    Orin: { role: 'The Wordsmith · Phonological loop', color: '#3f6f9c', side: 'right',
      expressions: ['neutral', 'happy', 'confused', 'frustrated'] },
    Nova: { role: 'The Pathfinder · Visuospatial sketchpad', color: '#3f7d5a', side: 'right',
      expressions: ['neutral', 'happy', 'surprised', 'determined'] },
    Cael: { role: 'The Strategist · Executive control', color: '#8a6420', side: 'right',
      expressions: ['neutral', 'serious', 'talking', 'confident'] }
  },

  sigils: [
    { id: 'working_memory', label: 'Working Memory' },
    { id: 'phonological_loop', label: 'Phonological Loop' },
    { id: 'visuospatial', label: 'Visuospatial Sketchpad' },
    { id: 'executive_control', label: 'Central Executive' },
    { id: 'episodic_buffer', label: 'Episodic Buffer' },
    { id: 'intrinsic_load', label: 'Intrinsic Load' },
    { id: 'extraneous_load', label: 'Extraneous Load' },
    { id: 'germane_load', label: 'Germane Load' }
  ],

  chapters: [
    /* ───────────────────────────── PROLOGUE ───────────────────────────── */
    {
      id: 'prologue', title: 'Prologue — The Archive Flickers', short: 'Hook video + claim',
      minutes: 8, core: true, background: 'mind_archive',
      teacher: {
        goal: 'Hook the class with a big claim, then turn it into a question we can test.',
        say: 'The video makes a big claim about attention and self-control. Today we will not decide whether a whole generation is getting worse. We will test the mental systems that claim depends on.',
        ask: 'What would you need to measure to know whether executive skills are really declining?',
        expect: 'Most students lean towards "yes, it is getting worse". Keep their poll answer — we return to it at the end.',
        fidelity: 'Hook only. The clip stops at about 4:05, after it names executive function. The rest of the video makes causal claims (bread additives, AI) that are weakly supported.'
      },
      screens: [
        { type: 'title' },
        { type: 'dialogue', speaker: 'Lyra', expr: 'concerned', text: 'Pages are vanishing from the Archive. Routes blur. Even simple instructions get tangled.' },
        { type: 'dialogue', speaker: 'Nova', expr: 'surprised', text: 'Look at the east stacks. That grey haze. Wherever it drifts, the shelves go blank.' },
        { type: 'dialogue', speaker: 'Orin', expr: 'confused', text: 'The archivists call it the Static. Nobody knows where it came from. Only that it moves faster when we fumble.' },
        { type: 'dialogue', speaker: 'Cael', expr: 'serious', text: 'Then something is broken and the Static got in through the crack. Find the crack. Fix it.' },
        { type: 'dialogue', speaker: 'Selene', expr: 'neutral', text: 'Perhaps. Or perhaps the Archive is being asked to do too much at once. Before we decide, let us hear the rumour going around the outside world.' },
        { type: 'video', speaker: 'Selene', expr: 'teaching', text: 'Watch the opening. Listen for the skills the narrator says are declining.' },
        { type: 'dialogue', speaker: 'Orin', expr: 'confused', text: '"Executive function." Sustained attention, working memory, resisting a quick reward, reasoning under pressure. That is quite a list.' },
        { type: 'poll', id: 'hookPoll', speaker: 'Selene', expr: 'neutral', text: 'Hold on to your first reaction. We will come back to it.',
          prompt: 'Is our ability to focus and hold things in mind getting worse?',
          options: ['Yes, probably', 'Maybe, but I would need better evidence', 'No, I am not convinced'] },
        { type: 'dialogue', speaker: 'Lyra', expr: 'happy', text: 'Testing a few memory systems? That seems easy enough.' },
        { type: 'dialogue', speaker: 'Selene', expr: 'serious', text: 'Those words have a habit of becoming evidence. Evidence first. Confidence second.' },
        { type: 'dialogue', speaker: 'Selene', expr: 'teaching', text: 'Three times today the Static will surge. Each time you must answer against the clock to hold it back. Learn well between surges.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 1 ───────────────────────────── */
    {
      id: 'workshop', title: 'Chapter 1 — The Limit of the Workshop', short: 'Digit span · limited capacity',
      minutes: 5, core: true, background: 'mind_archive', sigil: 'working_memory',
      teacher: {
        goal: 'Students feel that short-term holding space runs out quickly.',
        say: 'Your number is not a score of how clever you are. Watch for the pattern: at some length, everyone starts to fail.',
        ask: 'When the list got too long, did you stop trying — or did the space run out?',
        expect: 'Most students reach 5 to 8 digits. Ask for a show of hands at 5, 6, 7 and 8+ to see the class spread.',
        fidelity: 'Demonstration of limited capacity (digit span), not a replication of one specific study.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Lyra', expr: 'happy', text: 'Numbers. Fine. I can remember numbers.' },
        { type: 'dialogue', speaker: 'Selene', expr: 'teaching', text: 'Then do not theorise yet. Test it.' },
        { type: 'game', gameId: 'digitSpan', speaker: 'Selene', expr: 'neutral', text: 'Watch the digits appear one at a time. When they vanish, enter them in the same order.' },
        { type: 'dialogue', speaker: 'Lyra', expr: 'surprised', text: 'Okay. That got impossible fast.' },
        { type: 'keyfact', icon: 'working_memory', title: 'Working memory', speaker: 'Selene', expr: 'teaching',
          text: 'Working memory is a mental workspace. It holds information for a few seconds while you use it — and it has a limited capacity.',
          detail: 'The multi-store model treated short-term memory as one simple store. Baddeley & Hitch (1974) argued it is really a set of parts working together. That is the model we will build today.' },
        { type: 'dialogue', speaker: 'Selene', expr: 'neutral', text: 'The Archive is a workshop, not an endless warehouse. Now let us find out what the workshop is made of.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 2 ───────────────────────────── */
    {
      id: 'echo', title: 'Chapter 2 — The Echo Chamber', short: 'Articulatory suppression · Landry & Bartling',
      minutes: 10, core: true, background: 'echo_chamber', sigil: 'phonological_loop',
      teacher: {
        goal: 'Run an informal replication of Landry & Bartling (2011) and link it to the phonological loop.',
        say: 'In round 2 everybody must say "one, two, one, two" OUT LOUD — together with the ticking. It feels silly. That is the experiment.',
        ask: 'Saying "1, 2" is incredibly easy. So why did it hurt your memory for letters?',
        expect: 'Most students drop by 15–35 percentage points. Round 2 always comes second, so practice should help it — any drop is despite that.',
        fidelity: 'Close informal replication: same letter set, 5-second display, 5-second delay, "1–2" suppression. Fewer trials, repeated measures instead of independent samples.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Orin', expr: 'happy', text: 'Words, sounds, sequences. Finally, civilised material. If it can be said, I can keep it.' },
        { type: 'dialogue', speaker: 'Nova', expr: 'neutral', text: 'You said the numbers were easy too.' },
        { type: 'game', gameId: 'letterRecall', speaker: 'Orin', expr: 'neutral', text: 'Round 1: just remember the letters. Round 2: same task, but say "one, two, one, two" out loud the whole time.' },
        { type: 'dialogue', speaker: 'Orin', expr: 'frustrated', text: 'My inner voice appears to have union rules. It will not do two jobs at once.' },
        { type: 'tally', id: 'echoTally', speaker: 'Selene', expr: 'teaching', text: 'One result is an anecdote. A class is a sample. Working alone? Your one result still counts: compare it with the study next.' },
        { type: 'study', studyId: 'landry', speaker: 'Selene', expr: 'teaching', text: 'You just repeated a real experiment. Here is the original.' },
        { type: 'keyfact', icon: 'phonological_loop', title: 'Phonological loop', speaker: 'Selene', expr: 'teaching',
          text: 'The phonological loop holds sounds and words. Its "inner voice" (articulatory control process) rehearses them; its "inner ear" (phonological store) holds them for about 2 seconds unless they are rehearsed.',
          detail: 'Articulatory suppression — repeating "1, 2" — keeps the inner voice busy, so the letters cannot be rehearsed and fade.' },
        { type: 'dialogue', speaker: 'Orin', expr: 'neutral', text: 'So being good with words does not remove the limit on words. Humbling.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 3 ───────────────────────────── */
    {
      id: 'shards', title: 'Chapter 3 — The Map of Shards', short: 'Spatial memory · sketchpad',
      minutes: 4, core: false, background: 'map_of_shards', sigil: 'visuospatial',
      teacher: {
        goal: 'Give students a nonverbal memory task so they can feel a different kind of holding.',
        say: 'This should feel different from rehearsing letters. Notice how you are keeping hold of the pattern.',
        ask: 'Did you picture the route, or did you secretly name the squares ("top-left, middle…")?',
        expect: 'Some students will say they labelled the squares in words. That is a great measurement point: we cannot be sure which system a task really uses.',
        fidelity: 'Corsi-style spatial span demonstration.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Nova', expr: 'determined', text: 'Good. No chanting. Just show me where to go.' },
        { type: 'game', gameId: 'spatialSpan', speaker: 'Nova', expr: 'neutral', text: 'Watch the tiles light up. Then tap the same tiles in the same order.' },
        { type: 'dialogue', speaker: 'Nova', expr: 'happy', text: 'I did not say the route to myself. I pictured it.' },
        { type: 'keyfact', icon: 'visuospatial', title: 'Visuospatial sketchpad', speaker: 'Selene', expr: 'teaching',
          text: 'The visuospatial sketchpad is the "inner eye". It holds what things look like and where they are — shapes, locations, routes and movement.',
          detail: 'You use it to picture the way to school or to remember where you left your phone.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 4 ───────────────────────────── */
    {
      id: 'dual', title: 'Chapter 4 — Two Hands, Two Tools', short: 'Dual task · the model · patient KF',
      minutes: 16, core: true, background: 'map_of_shards',
      teacher: {
        goal: 'Show that two tasks clash most when they use the same component — the key evidence for the WMM.',
        say: 'The question is not "Can we multitask?" It is "What is competing?"',
        ask: 'If the spatial + spatial round was worse, what does that suggest about how short-term memory is organised?',
        expect: 'On average, tapping (spatial) hurts the grid memory more than chanting (verbal). Individual results are noisy — compare the class pattern.',
        fidelity: 'Conceptual replication of the dual-task / selective interference method. KF is shown as a case file, not a game. Static Surge I is a timed 6-question check (25 s per question; untimed if "Calm mode" is on).'
      },
      screens: [
        { type: 'dialogue', speaker: 'Lyra', expr: 'neutral', text: 'So the important question is not "Can we multitask?"' },
        { type: 'dialogue', speaker: 'Cael', expr: 'serious', text: 'The question is: what is competing?' },
        { type: 'game', gameId: 'dualTask', speaker: 'Selene', expr: 'neutral', text: 'Remember a pattern on the grid twice: once while chanting, once while tapping targets.' },
        { type: 'dialogue', speaker: 'Nova', expr: 'surprised', text: 'The tapping was not harder than the chanting. It just fought for the same space as the pattern.' },
        { type: 'study', studyId: 'dualTask', speaker: 'Selene', expr: 'teaching', text: 'This is the method Baddeley and Hitch used to take short-term memory apart.' },
        { type: 'model', speaker: 'Selene', expr: 'teaching', text: 'Now you have earned the whole model. Open each part.' },
        { type: 'study', studyId: 'kf', speaker: 'Selene', expr: 'serious', text: 'Some of the strongest evidence came from one man after a serious accident.' },
        { type: 'keyfact', icon: 'working_memory', title: 'A biological link', speaker: 'Selene', expr: 'teaching',
          text: 'KF shows how a biological factor, damage to the brain, can affect one part of memory and leave another intact.',
          detail: 'Exam tip: KF works as evidence for the model AND as an example of a biological factor in a cognitive process.' },
        { type: 'dialogue', speaker: 'Nova', expr: 'surprised', text: 'The haze is back. It is rolling down the east stairs!' },
        { type: 'trial', id: 'surge1', speaker: 'Cael', expr: 'serious', text: 'Answer fast and answer right. Every correct answer pushes the Static back.',
          title: 'Static Surge I: The East Stairs', seconds: 25, pass: 4,
          questions: [
            { q: 'Someone repeats "the, the, the" while memorising a shopping list. Which component are they blocking?',
              options: ['Phonological loop', 'Visuospatial sketchpad', 'Episodic buffer', 'Long-term memory'], answer: 0,
              explain: 'Saying a word over and over keeps the inner voice busy, so the list cannot be rehearsed in the phonological loop.' },
            { q: 'What is the key change the WMM made to the multi-store model?',
              options: ['Short-term memory is several components, not one store', 'Long-term memory is several stores', 'Short-term memory has no capacity limit', 'Rehearsal is not needed to keep information'], answer: 0,
              explain: 'The WMM split short-term memory into components that can work side by side.' },
            { q: 'Which of these is NOT a job of the central executive?',
              options: ['Storing information permanently in long-term memory', 'Switching attention between tasks', 'Sending information to the right component', 'Blocking out distractions'], answer: 0,
              explain: 'The central executive controls attention. It is not a permanent store.' },
            { q: 'How does the WMM explain Landry & Bartling\'s result?',
              options: ['Saying "1, 2" stopped rehearsal in the phonological loop', 'Saying "1, 2" overloaded the visuospatial sketchpad', 'The control group improved through practice', 'The letters sounded too similar to each other'], answer: 0,
              explain: 'Suppression occupies the inner voice, so the letters fade from the inner ear. The letters were chosen to sound different.' },
            { q: 'Why does KF\'s case support the WMM in particular?',
              options: ['Heard verbal information was impaired but seen information was much better', 'It proved that short-term and long-term memory are separate', 'He lost all short-term memory', 'His visual memory was worse than his verbal memory'], answer: 0,
              explain: 'The MSM already separated STM and LTM. KF matters for the WMM because one STM component was damaged while another worked.' },
            { q: 'In a dual-task study, two tasks can be done together with almost no loss. What does the WMM conclude?',
              options: ['They probably use different components', 'They both use the central executive only', 'Working memory has no limit', 'One of the tasks was too easy to count'], answer: 0,
              explain: 'Little interference suggests the tasks draw on different components. Heavy interference suggests the same one.' }
          ] },
        { type: 'dialogue', speaker: 'Selene', expr: 'teaching', text: 'Did you notice? The questions were not harder than a normal quiz. The clock made them feel harder. Hold on to that feeling. We will give it a name later.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 5 ───────────────────────────── */
    {
      id: 'focus', title: 'Chapter 5 — The Gate of Focus', short: 'Stroop · central executive',
      minutes: 6, core: true, background: 'focus_gate', sigil: 'executive_control',
      teacher: {
        goal: 'Link the video\'s "executive function" to the central executive through the Stroop effect.',
        say: 'Knowing the rule does not make the conflict disappear. Your reading habit fights you every time.',
        ask: 'The video said executive skills are declining. What would you need to compare to show that?',
        expect: 'Mismatched trials are usually 100–300 ms slower, with more errors.',
        fidelity: 'Classic Stroop interference demonstration.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Cael', expr: 'talking', text: 'The rule is simple. Name the ink colour. Ignore the word.' },
        { type: 'game', gameId: 'stroop', speaker: 'Cael', expr: 'neutral', text: 'Pick the INK colour as fast and accurately as you can. Keys R, G, B and Y work too.' },
        { type: 'dialogue', speaker: 'Lyra', expr: 'concerned', text: 'I knew the rule. My brain still wanted to read the word.' },
        { type: 'keyfact', icon: 'executive_control', title: 'Central executive', speaker: 'Selene', expr: 'teaching',
          text: 'The central executive is the boss of working memory. It directs attention, blocks out distractions, switches between tasks and sends information to the right part of the system.',
          detail: 'It has limited capacity and handles any kind of information. The "executive function" in the video is roughly this — the skill of staying on goal when something else competes.' },
        { type: 'dialogue', speaker: 'Cael', expr: 'confident', text: 'Focus is choosing what not to follow.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 6 ───────────────────────────── */
    {
      id: 'switchyard', title: 'Chapter 6 — The Switchyard', short: 'Task switching cost',
      minutes: 5, core: false, background: 'switchyard',
      teacher: {
        goal: 'Show that switching between rules has a cost, even when both rules are easy.',
        say: 'Adapting is not the same as switching for free.',
        ask: 'Why might jumping between apps feel productive even if every switch costs a little?',
        expect: 'Switch trials are usually slower and less accurate than repeat trials.',
        fidelity: 'Task-switching demonstration of central executive control.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Cael', expr: 'talking', text: 'Read the rule. Execute it.' },
        { type: 'dialogue', speaker: 'Nova', expr: 'happy', text: 'You make everything sound like a military briefing.' },
        { type: 'game', gameId: 'taskSwitch', speaker: 'Cael', expr: 'neutral', text: 'The rule above the shape tells you what to sort by. It changes without warning.' },
        { type: 'dialogue', speaker: 'Cael', expr: 'confident', text: 'The rule changed. I adapted.' },
        { type: 'dialogue', speaker: 'Lyra', expr: 'happy', text: 'Slower, though.' },
        { type: 'keyfact', icon: 'executive_control', title: 'Switch cost', speaker: 'Selene', expr: 'teaching',
          text: 'Switching attention between tasks is a central executive job. It is possible — but each switch costs time and accuracy.',
          detail: 'Checking a phone "for a second" is a switch out and a switch back in.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 7 ───────────────────────────── */
    {
      id: 'loom', title: 'Chapter 7 — The Story Loom', short: 'Episodic buffer',
      minutes: 4, core: false, background: 'story_loom', sigil: 'episodic_buffer',
      teacher: {
        goal: 'Show why the model needed a part that combines sights and sounds into one experience.',
        say: 'The picture and the voice give different pieces. You need both to answer.',
        ask: 'Why is "combining information" harder to measure than remembering a list?',
        expect: 'Turn sound on for the projector. If speech does not work, the message appears as a caption.',
        fidelity: 'Model demonstration, not a measurement of the episodic buffer.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Lyra', expr: 'neutral', text: 'We keep splitting everything up. But life does not feel split up.' },
        { type: 'game', gameId: 'storyLoom', speaker: 'Selene', expr: 'neutral', text: 'Watch the scene and listen to the message. Then answer using both.' },
        { type: 'keyfact', icon: 'episodic_buffer', title: 'Episodic buffer', speaker: 'Selene', expr: 'teaching',
          text: 'The episodic buffer was added by Baddeley in 2000. It combines sounds, images and long-term knowledge into a single "episode" you are aware of.',
          detail: 'Like a screen showing everything together. It has limited capacity too — and it is hard to test on its own.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 8 ───────────────────────────── */
    {
      id: 'examiner', title: 'Chapter 8 — The Examiner\'s Desk', short: 'Evaluating the WMM',
      minutes: 10, core: true, background: 'pattern_shrine',
      teacher: {
        goal: 'Students evaluate the model and think about measurement. Static Surge II checks research-methods understanding (design, SD, p-values).',
        say: 'A good model explains evidence AND can be tested. Where is this one weak?',
        ask: 'How would you measure the capacity of the central executive on its own?',
        expect: 'The honest answer is: we cannot easily. That is the main limitation.',
        fidelity: 'Evaluation activity.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Cael', expr: 'serious', text: 'We have a model. Is it any good?' },
        { type: 'sort', id: 'wmmEval', speaker: 'Selene', expr: 'teaching', text: 'Sort each statement: strength or limitation of the working memory model?',
          prompt: 'Tap a card, then tap where it belongs.',
          categories: ['Strength', 'Limitation'],
          items: [
            { text: 'Dual-task experiments show two tasks clash most when they use the same component.', cat: 0 },
            { text: 'Case studies like KF show one store can be damaged while another works.', cat: 0 },
            { text: 'It explains why we can sometimes multitask and sometimes cannot.', cat: 0 },
            { text: 'Brain scans often show different areas active for verbal and visual tasks.', cat: 0 },
            { text: 'Nobody can measure the central executive\'s capacity separately from the other parts.', cat: 1 },
            { text: 'It is unclear how the four components actually work together.', cat: 1 },
            { text: 'It says little about long-term memory, emotion or why memories get distorted.', cat: 1 },
            { text: 'Brain imaging results do not always show the same areas for each component.', cat: 1 }
          ] },
        { type: 'write', id: 'wmmMeasure', speaker: 'Selene', expr: 'neutral', text: 'One sentence is enough.',
          prompt: 'Which part of the working memory model is hardest to measure, and why?',
          hint: 'Think about the central executive or episodic buffer. Can you observe them directly?' },
        { type: 'dialogue', speaker: 'Orin', expr: 'frustrated', text: 'Selene. The Static has reached the reading room. It is eating the methods section.' },
        { type: 'trial', id: 'surge2', speaker: 'Selene', expr: 'serious', text: 'Examiners ask about methods as often as findings. Defend the reading room.',
          title: 'Static Surge II: The Reading Room', seconds: 30, pass: 4,
          questions: [
            { q: 'Landry & Bartling used an independent samples design. What is one advantage of that?',
              options: ['No order effects, because nobody does both conditions', 'Individual differences are fully controlled', 'Fewer participants are needed', 'Each person acts as their own control'], answer: 0,
              explain: 'Nobody could improve through practice or get bored between conditions. The cost is that the two groups may differ in memory ability.' },
            { q: 'The standard deviations were 0.13 (control) and 0.14 (suppression). What does that tell us?',
              options: ['Scores were spread out by a similar amount in both groups', 'Both groups had the same average', 'The difference between groups was not significant', 'The sample was large enough to generalise'], answer: 0,
              explain: 'Similar SDs mean neither group was unusually variable, so the gap between the means is not just a few extreme scorers.' },
            { q: 'The result was significant at p ≤ 0.01. What does that mean?',
              options: ['There is a 1% chance or less that a difference this big happened by chance alone', '99% of participants did worse when chanting', 'Chanting lowered recall by 1%', 'The hypothesis has been proven true'], answer: 0,
              explain: 'The null hypothesis can be rejected. Significance never means "proven".' },
            { q: 'Why did the researchers use only the letters F, K, L, M, R, X and Q?',
              options: ['They sound different and contain no vowels, so they are hard to chunk or confuse', 'They are the most common letters in English', 'They form a word that is easy to rehearse', 'They were chosen at random with no special reason'], answer: 0,
              explain: 'Similar-sounding letters (like B, D, P) or vowels (which help make pronounceable chunks) would have muddied the results.' },
            { q: 'Which of these is NOT a limitation of the WMM?',
              options: ['There is no biological evidence for it', 'The role of the central executive is unclear', 'It does not explain how the components interact', 'It says little about memory distortion'], answer: 0,
              explain: 'KF and brain imaging DO give biological support, even if the imaging results are not always consistent.' },
            { q: 'Why is the central executive so hard to test?',
              options: ['Its capacity cannot be measured separately from the other components', 'It only works when people are asleep', 'It was removed from the model in 2000', 'It only handles visual information'], answer: 0,
              explain: 'Every task that uses the central executive also uses a slave system, so its own capacity is never isolated.' }
          ] }
      ]
    },

    /* ───────────────────────────── CHAPTER 9 ───────────────────────────── */
    {
      id: 'falseVictory', title: 'Chapter 9 — False Victory', short: 'Bridge to cognitive load',
      minutes: 3, core: true, background: 'overload_engine',
      teacher: {
        goal: 'Move from "what are the parts?" to "what happens when they are overloaded?"',
        say: 'A system can work perfectly and still fail if we ask too much of it.',
        ask: 'What is the difference between a broken system and an overloaded one?',
        expect: 'Link back to the digit span: the space was not broken, it was full.',
        fidelity: 'Conceptual bridge.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Lyra', expr: 'happy', text: 'Every part checked. The Archive is fixed!' },
        { type: 'dialogue', speaker: 'Cael', expr: 'serious', text: 'Systems intact. Performance still collapsing.' },
        { type: 'dialogue', speaker: 'Lyra', expr: 'concerned', text: 'Then what did we miss?' },
        { type: 'keyfact', icon: 'working_memory', title: 'Cognitive load theory', speaker: 'Selene', expr: 'teaching',
          text: 'Cognitive load is the total demand placed on working memory. Because working memory is limited, when the demand is greater than its capacity we get overload — and learning and recall suffer.',
          detail: 'Fiske & Taylor (1991) called us "cognitive misers": we save mental effort wherever we can, because there is only so much to spend.' },
        { type: 'dialogue', speaker: 'Selene', expr: 'serious', text: 'Nothing was broken. The Archive was being asked to carry more than its workshop can hold.' },
        { type: 'dialogue', speaker: 'Nova', expr: 'surprised', text: 'So the Static never broke in through a crack. It IS the overload. It thickens every time we pile on more than the workshop can hold.' },
        { type: 'dialogue', speaker: 'Cael', expr: 'serious', text: 'Then we cannot fight it with force. We have to understand what feeds it.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 10 ───────────────────────────── */
    {
      id: 'loads', title: 'Chapter 10 — The Three Load Trials', short: 'Intrinsic · extraneous · germane',
      minutes: 10, core: true, background: 'noisy_hall', sigils: ['intrinsic_load', 'extraneous_load', 'germane_load'],
      teacher: {
        goal: 'Students experience each type of load and rate their effort — which is itself a way of measuring load.',
        say: 'After each trial, rate how hard your brain worked. That rating is a real research method: self-report.',
        ask: 'Which kind of load should a teacher try to remove first?',
        expect: 'Hard sums and cluttered screens both feel effortful, for different reasons. The second code should be faster once the pattern is known.',
        fidelity: 'Demonstrations of the three load types, using the course definitions.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Selene', expr: 'teaching', text: 'A task can feel hard for three different reasons. Three chambers. Rate your effort after each.' },
        { type: 'game', gameId: 'intrinsicTrial', speaker: 'Nova', expr: 'determined', text: 'Chamber one: same clean layout. Only the difficulty of the problem changes.' },
        { type: 'keyfact', icon: 'intrinsic_load', title: 'Intrinsic load', speaker: 'Selene', expr: 'teaching', sigil: 'intrinsic_load',
          text: 'Intrinsic load is how hard the task itself is — how many pieces you must hold and combine at once.',
          detail: 'Calculus has more intrinsic load than simple arithmetic. You cannot remove it, but you can break it into smaller steps.' },
        { type: 'game', gameId: 'extraneousTrial', speaker: 'Orin', expr: 'frustrated', text: 'Chamber two: the same easy search, first in a clean room, then in a noisy one.' },
        { type: 'keyfact', icon: 'extraneous_load', title: 'Extraneous load', speaker: 'Selene', expr: 'teaching', sigil: 'extraneous_load',
          text: 'Extraneous load comes from things that have nothing to do with the task: pop-ups, noise, messy design, or worrying about something else.',
          detail: 'Remember the Static\'s countdown clock? It added nothing to the questions, only pressure. That was extraneous load. It is the load that teachers, and you, can most easily remove.' },
        { type: 'game', gameId: 'germaneTrial', speaker: 'Lyra', expr: 'neutral', text: 'Chamber three: crack a code. Then crack another one.' },
        { type: 'keyfact', icon: 'germane_load', title: 'Germane load', speaker: 'Selene', expr: 'teaching', sigil: 'germane_load',
          text: 'Germane load is the effort of actually understanding: building a pattern (a schema) you can reuse. Once you have one, new information is easier to process.',
          detail: 'The first code took effort to figure out. That effort built a schema, so the second code was easier. In exam answers: germane load is lower when previous learning helps you process new information.' },
        { type: 'dialogue', speaker: 'Cael', expr: 'serious', text: 'So "just focus harder" is sometimes poor advice. Sometimes the room is the problem.' },
        { type: 'dialogue', speaker: 'Selene', expr: 'happy', text: 'The goal is not zero effort. The goal is useful effort.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 11 ───────────────────────────── */
    {
      id: 'lecture', title: 'Chapter 11 — The Distracted Lecture', short: 'Multitasking · Sana et al.',
      minutes: 10, core: true, background: 'mind_archive',
      teacher: {
        goal: 'Informal replication of Sana et al. (2013): does multitasking during learning reduce comprehension?',
        say: 'Each device is randomly given one of two conditions. Do not tell your neighbour which one you got until the end.',
        ask: 'What makes our class version weaker than the real experiment?',
        expect: 'The pop-up group usually scores a little lower. With small groups it may not — that is a good discussion about sample size.',
        fidelity: 'Short conceptual replication with random allocation per device. Use the class tally to compare groups.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Orin', expr: 'happy', text: 'I can listen to a lecture and clear a few messages. Easy.' },
        { type: 'dialogue', speaker: 'Cael', expr: 'serious', text: 'That sentence has already cost us once.' },
        { type: 'game', gameId: 'microLecture', speaker: 'Selene', expr: 'neutral', text: 'Read the short lesson carefully. A quiz follows. Some of you will also get interruptions.' },
        { type: 'tally', id: 'sanaTally', speaker: 'Selene', expr: 'teaching', text: 'In class, pool the results by group. Working alone? Note your score and read on.' },
        { type: 'study', studyId: 'sana', speaker: 'Selene', expr: 'teaching', text: 'Here is what happened when researchers ran it properly.' },
        { type: 'dialogue', speaker: 'Lyra', expr: 'concerned', text: 'So I can finish both jobs and still learn less. And my laptop can distract the person behind me.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 11b ───────────────────────────── */
    {
      id: 'outsourced', title: 'Chapter 11½ — The Outsourced Memory', short: 'Google effect · Sparrow et al.',
      minutes: 6, core: false, background: 'pattern_shrine',
      teacher: {
        goal: 'A second environmental factor (technology) and a study that did not replicate: good material for evaluating research and for the HL extension.',
        say: 'If you know you can look it up, do you bother to remember it?',
        ask: 'A big replication project could not reproduce Sparrow\'s result. What should that do to our confidence in the "Google effect"?',
        expect: 'Students often accept the Google effect as obvious. The failed replication is the key teaching point: a plausible idea still needs reliable evidence.',
        fidelity: 'Study walkthrough plus a 4-question check. No classroom replication.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Orin', expr: 'happy', text: 'I have a solution to the Static. I will simply stop remembering things. The Archive\'s search engine can do it for me.' },
        { type: 'dialogue', speaker: 'Nova', expr: 'neutral', text: 'Does that lower the load, or just move it somewhere else?' },
        { type: 'study', studyId: 'sparrow', speaker: 'Selene', expr: 'teaching', text: 'Researchers asked the same question about the internet.' },
        { type: 'quiz', id: 'sparrowCheck', speaker: 'Selene', expr: 'neutral', text: 'Four quick questions.',
          questions: [
            { q: 'What is the "Google effect"?',
              options: ['Treating the internet as an external memory store, so we remember less ourselves', 'Search engines making people more intelligent', 'Social media improving recall', 'Technology having no effect on memory'], answer: 0,
              explain: 'It is a modern form of transactive memory: remembering WHERE information is instead of the information itself.' },
            { q: 'In Sparrow et al., what lowered recall of the trivia facts?',
              options: ['Believing the computer would save them', 'Being told to try to remember them', 'Typing them slowly', 'Reading them on paper'], answer: 0,
              explain: 'Being told to remember made little difference. Believing the facts would be saved did.' },
            { q: 'What is the main ecological validity concern with this study?',
              options: ['Trivia facts are not like the meaningful information we need in daily life', 'It took place in a real classroom', 'There were too many conditions', 'Participants were randomly allocated'], answer: 0,
              explain: 'Why try hard to remember trivia? We might behave differently with information that matters to us.' },
            { q: 'Participants guess the aim and change how hard they try. What is this called?',
              options: ['Demand characteristics', 'Participant variability', 'A confounding variable from the room', 'Random allocation'], answer: 0,
              explain: 'Demand characteristics: knowing you are being studied changes behaviour.' }
          ] },
        { type: 'dialogue', speaker: 'Orin', expr: 'confused', text: 'So the famous result may not even be real. I will keep remembering things. For now.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 12 ───────────────────────────── */
    {
      id: 'worry', title: 'Chapter 12 — The Weight of Worry', short: 'Mani et al. · sugarcane farmers',
      minutes: 8, core: true, background: 'overload_engine',
      teacher: {
        goal: 'Show that extraneous load can come from inside: worry uses working memory too.',
        say: 'The farmers were not less intelligent before the harvest. They were carrying more.',
        ask: 'How did the researchers decide that cognitive load was high? Did they measure it directly?',
        expect: 'Key point: cognitive load was inferred (from income, or from a hypothetical car repair), not measured directly.',
        fidelity: 'Animated study walkthrough only — financial stress cannot and should not be recreated in class.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Nova', expr: 'neutral', text: 'Pop-ups are one thing. What about a worry you cannot close?' },
        { type: 'study', studyId: 'mani', speaker: 'Selene', expr: 'teaching', text: 'Mani and colleagues tested this in two very different settings.' },
        { type: 'write', id: 'maniMeasure', minWords: 15, speaker: 'Selene', expr: 'neutral', text: 'This is exactly the kind of evaluation examiners look for.',
          prompt: 'How was cognitive load operationalised in the two Mani et al. studies — and what is one limitation of that?',
          hint: 'Lab study: a hypothetical car repair. Field study: before vs after the harvest. Was load ever measured directly?' }
      ]
    },

    /* ───────────────────────────── CHAPTER 13 ───────────────────────────── */
    {
      id: 'measure', title: 'Chapter 13 — Measuring the Invisible', short: 'fNIRS · Modi et al. · measurement',
      minutes: 6, core: false, background: 'pattern_shrine',
      teacher: {
        goal: 'Measurement: cognitive load can be measured by self-report, performance and physiology — none is perfect.',
        say: 'Today you have used two of these methods already: effort ratings and reaction times.',
        ask: 'Which measure would you trust most for a surgeon mid-operation, and why?',
        expect: 'There is no single right answer; combining methods is the strongest approach.',
        fidelity: 'Animated walkthrough of Modi et al. (2019) plus a sorting task.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Cael', expr: 'serious', text: 'In the Archive, overload loses a page. In an operating theatre, it could lose a life.' },
        { type: 'study', studyId: 'modi', speaker: 'Selene', expr: 'teaching', text: 'Can we see overload in the brain as it happens?' },
        { type: 'sort', id: 'measureSort', speaker: 'Selene', expr: 'teaching', text: 'You have used several of these today. Sort each measure by type.',
          prompt: 'Tap a card, then tap its type.',
          categories: ['Self-report', 'Performance', 'Physiological'],
          items: [
            { text: 'Your 1–9 mental effort rating', cat: 0 },
            { text: 'A questionnaire after the task', cat: 0 },
            { text: 'Stroop reaction time', cat: 1 },
            { text: 'Quiz score after the lecture', cat: 1 },
            { text: 'fNIRS blood oxygen in the prefrontal cortex', cat: 2 },
            { text: 'Heart rate', cat: 2 }
          ] },
        { type: 'keyfact', icon: 'working_memory', title: 'Why load is hard to measure', speaker: 'Selene', expr: 'teaching',
          text: 'Load differs from person to person and task to task. It involves attention, memory and speed together. Noise and stress muddy the picture. And every method captures only part of it.',
          detail: 'Self-report can be biased; performance can drop for other reasons; physiology shows arousal, not "load" itself.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 13b: SURGE III ───────────────────────────── */
    {
      id: 'surge3', title: 'Chapter 13½ — The Last Surge', short: 'Timed check · cognitive load',
      minutes: 5, core: true, background: 'overload_engine',
      teacher: {
        goal: 'Timed retrieval practice on the cognitive load half of the lesson before the final challenge.',
        say: 'This is retrieval practice. Getting one wrong and reading why is still learning.',
        ask: 'Which question did most people miss? Read its explanation aloud.',
        expect: 'Students who skipped Chapter 13 may miss the Modi and measurement questions. The explanations cover them.',
        fidelity: 'Timed multiple-choice check (8 questions, 25 s each; untimed in Calm mode).'
      },
      screens: [
        { type: 'dialogue', speaker: 'Lyra', expr: 'concerned', text: 'It is everywhere now. The whole Archive is grey.' },
        { type: 'dialogue', speaker: 'Selene', expr: 'serious', text: 'Then this is the last surge before the Engine itself. Everything you learned about load, all at once.' },
        { type: 'trial', id: 'surge3', speaker: 'Selene', expr: 'serious', text: 'Hold the line.',
          title: 'Static Surge III: The Great Hall', seconds: 25, pass: 6,
          questions: [
            { q: 'What does cognitive load theory assume about working memory?',
              options: ['It has a limited capacity', 'It has an unlimited capacity', 'It is not affected by the environment', 'Everyone processes information the same way'], answer: 0,
              explain: 'Everything in CLT follows from the limit: too much demand means overload.' },
            { q: 'Which type of load comes from how difficult the task itself is?',
              options: ['Intrinsic', 'Extraneous', 'Germane', 'Internal'], answer: 0,
              explain: 'Intrinsic load is built into the material. "Internal load" is not one of the three types.' },
            { q: 'A student worries about an argument with a friend during a test. Which load is that?',
              options: ['Extraneous', 'Intrinsic', 'Germane', 'No load at all'], answer: 0,
              explain: 'The worry has nothing to do with the test content, so it is extraneous, like the farmers\' money worries.' },
            { q: 'In Sana et al.\'s second experiment, what happened to students who could SEE classmates multitasking?',
              options: ['They scored about 17% lower, even though they did not multitask', 'They scored higher because they were more alert', 'There was no difference', 'They started multitasking too'], answer: 0,
              explain: 'Other people\'s screens were enough extraneous load to reduce learning.' },
            { q: 'How was cognitive load increased in Mani et al.\'s lab study?',
              options: ['A hypothetical car repair bill of about $150 or $1,500', 'Participants chanted while solving problems', 'A noisy room during the test', 'A real bill they had to pay'], answer: 0,
              explain: 'Load was manipulated with an imaginary scenario, which is one limitation of the study.' },
            { q: 'Why is the sugarcane farmer study a natural experiment?',
              options: ['The IV (before vs after harvest) happens naturally; researchers did not manipulate it', 'It was done outdoors', 'Participants were randomly allocated to be poor or rich', 'There was no dependent variable'], answer: 0,
              explain: 'Researchers measured the same farmers at two times that nature and the economy provided.' },
            { q: 'According to Modi et al. (2019), what happened in the prefrontal cortex as load increased?',
              options: ['Activity decreased, possibly showing disengagement', 'Activity kept increasing', 'Nothing changed', 'The hippocampus took over'], answer: 0,
              explain: 'fNIRS showed the PFC deactivating as surgical performance dropped.' },
            { q: 'Which statement about measuring cognitive load is true?',
              options: ['Load differs between people and tasks, so there is no single perfect measure', 'Self-report measures are completely reliable', 'Load is the same for everyone doing a task', 'Brain scans measure load directly'], answer: 0,
              explain: 'That is why researchers combine self-report, performance and physiological measures.' }
          ] },
        { type: 'dialogue', speaker: 'Cael', expr: 'confident', text: 'The Static is thinning. Now we go to its source.' }
      ]
    },

    /* ───────────────────────────── CHAPTER 14 ───────────────────────────── */
    {
      id: 'boss', title: 'Chapter 14 — The Overload Engine', short: 'Final challenge',
      minutes: 7, core: true, background: 'overload_engine',
      teacher: {
        goal: 'Apply everything: name the component, name the load, choose a fix.',
        say: 'Name the system. Remove needless conflict. Support the structure.',
        ask: 'Which scenario was hard because of the task itself rather than bad design?',
        expect: 'Read each explanation aloud after the class votes.',
        fidelity: 'Application / synthesis.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Lyra', expr: 'neutral', text: 'This one looks easy… no. Before I call it easy: what is competing?' },
        { type: 'dialogue', speaker: 'Cael', expr: 'confident', text: 'Now we are ready.' },
        { type: 'game', gameId: 'bossBattle', speaker: 'Selene', expr: 'serious', text: 'Each layer of the Engine is a real situation. Diagnose it to break through.' },
        { type: 'dialogue', speaker: 'Orin', expr: 'happy', text: 'Protect the rehearsal channel.' },
        { type: 'dialogue', speaker: 'Nova', expr: 'happy', text: 'And remember: a picture can be crowded too.' },
        { type: 'dialogue', speaker: 'Cael', expr: 'confident', text: 'Control helps. Design decides how much control we must spend.' },
        { type: 'keyfact', icon: 'germane_load', title: 'Strategies to improve memory', speaker: 'Selene', expr: 'teaching',
          text: 'Dual coding: learn with words AND pictures, so the loop and the sketchpad share the work. Chunking: group items so they take fewer slots. Cut extraneous load: phone out of the room, one task at a time.',
          detail: 'Worked examples lower intrinsic load for beginners and help build schemas. Paivio\'s dual coding theory fits the WMM: two channels, two memory traces.' }
      ]
    },

    /* ───────────────────────────── EPILOGUE ───────────────────────────── */
    {
      id: 'epilogue', title: 'Epilogue — Return to the Claim', short: 'Exam question + evidence PDF',
      minutes: 15, core: true, background: 'mind_archive',
      teacher: {
        goal: 'Return to the hook claim, recap the lesson, think like an examiner, write an application answer and save the evidence.',
        say: 'We tested the mechanisms. That is not the same as proving a whole generation has changed.',
        ask: 'Plenary (5 min): compare the start and end polls by show of hands. Then cold-call two "Not yet" items from the recap list and have a confident student explain each.',
        expect: 'If students worked alone, the recap screen is their self-check and its ratings go into the PDF, so you can see who is not yet confident. The PDF screen has four ways to save evidence (download, open in tab, print/save as PDF, copy text) for devices where downloads fail.',
        fidelity: 'Recap, examiner-marking practice with original sample answers, and an application question.'
      },
      screens: [
        { type: 'dialogue', speaker: 'Selene', expr: 'neutral', text: 'We began with a claim: that our executive skills are getting worse.' },
        { type: 'dialogue', speaker: 'Cael', expr: 'talking', text: 'We now know what those skills are, and how to test them.' },
        { type: 'dialogue', speaker: 'Selene', expr: 'serious', text: 'But testing the mechanism is not the same as proving a decline over time. For that you would need the same tests given to comparable groups, years apart.' },
        { type: 'poll', id: 'endPoll', speaker: 'Selene', expr: 'neutral', text: 'Compare this with your first answer.',
          prompt: 'Now: is our ability to focus and hold things in mind getting worse?',
          options: ['Yes, probably', 'Maybe, but I would need better evidence', 'No, I am not convinced'] },
        { type: 'recap', id: 'recap', speaker: 'Selene', expr: 'teaching', text: 'Before you leave the Archive, check what you can do. Be honest. Your teacher sees these ratings.',
          items: [
            ['Describe the four components of the WMM and one job of each.', 'Central executive (attention boss), phonological loop (inner voice + inner ear), visuospatial sketchpad (inner eye), episodic buffer (combines everything into one episode).'],
            ['Explain how dual-task studies and patient KF support the WMM.', 'Tasks clash most when they share a component. KF lost heard verbal STM but kept visual STM, so the stores are separate.'],
            ['Describe Landry & Bartling (2011): aim, method, results, conclusion.', '34 students, independent samples. 7 letters, "1, 2" suppression. 76% vs 45%. Suppression blocks rehearsal in the phonological loop.'],
            ['Evaluate the WMM: one strength and one limitation.', 'Strength: explains when we can and cannot multitask. Limitation: the central executive cannot be measured on its own.'],
            ['Define cognitive load and tell intrinsic, extraneous and germane load apart.', 'Intrinsic: difficulty of the task. Extraneous: anything unrelated (noise, pop-ups, worry). Germane: effort of building schemas; lower when prior learning helps.'],
            ['Explain how an environmental factor affects memory, using Sana et al. or Mani et al.', 'Multitasking, or seeing others multitask, lowered comprehension. Money worries lowered reasoning scores in the same farmers.'],
            ['Explain why cognitive load is hard to measure.', 'It differs between people and tasks. Self-report, performance and physiology (e.g. fNIRS in Modi et al.) each capture only part of it.'],
            ['Suggest strategies to improve memory using the WMM or CLT.', 'Dual coding, chunking, removing extraneous load, worked examples.']
          ] },
        { type: 'quiz', id: 'examinerDesk', speaker: 'Selene', expr: 'teaching', text: 'You have seen the evidence. Now sit in the examiner\'s chair.',
          intro: 'Question: "Freja is revising cell division, a topic she has never studied. Her tablet plays a video lesson while her phone buzzes with a group chat about the weekend. After two hours she remembers very little. Explain the role of cognitive load in Freja\'s revision." Read three student answers and judge them.',
          questions: [
            { q: 'Which answer would an examiner place in the highest band?',
              passage: '<p><b>A.</b> Cognitive load is when you use too much technology. Freja has a tablet and a phone, so her cognitive load is very high. This is why she cannot remember anything. She should use less technology.</p><p><b>B.</b> Cognitive load is the demand on working memory, which has limited capacity. Freja\'s phone creates extraneous load: the group chat has nothing to do with cell division. This is why she remembers little.</p><p><b>C.</b> Cognitive load is the total demand on working memory, which has limited capacity. Cell division is new to Freja, so intrinsic load is high: she has no schema to build on, which also makes germane processing harder. On top of this, the group chat adds extraneous load, taking capacity away from the lesson. Together these overload her working memory, so little is encoded.</p>',
              options: ['A', 'B', 'C', 'They would all score the same'], answer: 2, fixed: true, inline: true,
              explain: 'C defines the theory accurately AND applies every relevant type of load to details in the scenario. That application is what lifts it to the top band.' },
            { q: 'What is the biggest problem with answer A?',
              passage: '<p><b>A.</b> Cognitive load is when you use too much technology. Freja has a tablet and a phone, so her cognitive load is very high. This is why she cannot remember anything. She should use less technology.</p>',
              options: ['It defines cognitive load wrongly, as "technology", not as demand on working memory', 'It is too long', 'It does not mention a study', 'It gives advice'], answer: 0,
              explain: 'Without an accurate definition, nothing that follows can be good psychology. Technology is only one possible source of load.' },
            { q: 'Answer B is accurate. What would improve it most?',
              passage: '<p><b>B.</b> Cognitive load is the demand on working memory, which has limited capacity. Freja’s phone creates extraneous load: the group chat has nothing to do with cell division. This is why she remembers little.</p>',
              options: ['Applying intrinsic load too: the topic is new to Freja', 'Adding the date of the theory', 'Describing Sana et al. in detail', 'Making it shorter'], answer: 0,
              explain: 'B only uses one clue in the scenario. "A topic she has never studied" is an obvious clue about intrinsic load and schemas.' }
          ] },
        { type: 'write', id: 'examAnswer', minWords: 50, speaker: 'Selene', expr: 'teaching', text: 'Your turn. Aim for about 100–150 words.', large: true,
          prompt: 'Using cognitive load theory, explain two changes Freja could make to remember more from her revision.',
          hint: 'Start with a one-sentence definition. Then take each change (for example: phone in another room; start with worked examples or a summary video before the details) and say WHICH type of load it changes and WHY that helps her working memory.' },
        { type: 'dialogue', speaker: 'Orin', expr: 'happy', text: 'For the record, my inner voice has returned to work.' },
        { type: 'dialogue', speaker: 'Lyra', expr: 'happy', text: 'And I am officially retiring "that seems easy enough."' },
        { type: 'finish', speaker: 'Selene', expr: 'happy', text: 'Well done. Download your evidence and upload it to Elevfeedback.' }
      ]
    }
  ]
};
