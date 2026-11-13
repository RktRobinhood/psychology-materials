/* Episode 6: The Sirens. The working memory model (the song floods the phonological
 * loop; wax removes the input; Landry and Bartling demonstration) and cognitive load
 * theory (steering the strait with too many orders at once). */
ODY.episode({
  id: 'sirens', n: 6, title: 'The Sirens', topic: 'Working memory and cognitive load', topics: ['wmm', 'load', 'models'],
  scene: 'sirens', minutes: 14,
  blurb: 'A song that promises to tell you everything. Why you cannot listen and rehearse at once, and what happens when every channel is full.',
  teacher: 'Students run an informal articulatory-suppression demonstration (they must really say "one, two" aloud; headphones help). The Sirens scene uses a shortened timed choice. Cognitive load is framed through steering orders and then through revision with a phone.',
  next: 'Next time: six heads on one side, a whirlpool on the other, and a hungry crew on an island full of forbidden cattle.',
  script: [
    '@scene deck',
    'N: Previously: you sailed to the edge of the world, watched the dead forget, and found that the words you processed most deeply were the ones that stayed.',
    '?ask_crew N: Tiresias told you to keep your crew fed and trusting. Remember that. It is about to matter.',
    '?ask_poseidon N: Tiresias told you how to cool Poseidon\'s anger. Some of it already has.',
    '?ask_home N: Tiresias told you Penelope is waiting, and that you will have to prove who you are.',
    'N: A warm-up from the House of Hades. Drachmae only. || N: Before anything else, a little retrieval from last time. No sailors at stake.',
    { qte: { t: ['msm', 'lop'], n: 2, timer: 18, stakes: 'coins', title: 'Previously on: warm-up', lv: 1 } },
    '@scene deck left=eurylochus.stand right=odysseus.stand',
    'N: Circe gave clear instructions for the next stretch of sea. Two women on a meadow of bones, and a song no sailor has ever sailed past.',
    'eurylochus~wary: Beeswax in every ear, she said. Soften it in the sun and pack it in. Nobody hears, nobody steers for the rocks.',
    'odysseus.think~calm: She also said that a man tied to the mast could hear it and live.',
    'eurylochus.arms~angry: She said a man tied very tightly to the mast. By men who have wax in their ears and will not untie him whatever he screams.',
    { choice: { id: 'mast', ask: 'Approaching the Sirens, what did you choose?', prompt: 'The wax is warm and ready.', opts: [
      { t: 'Tie me to the mast. I want to hear it. Wax for everyone else.', set: 'mast_bound', remember: 'Eurylochus will remember that.' },
      { t: 'Wax for everyone, me too. Nobody needs to hear it.', set: 'mast_wax', fx: { trust: 1 }, remember: 'The crew will remember that.' },
      { t: 'No wax. We are strong enough to row past a song.', set: 'mast_none', fx: { wrath: 1 }, remember: 'The crew will remember that. Nervously.', risk: 'the whole crew will hear the song' }
    ] } },
    '?mast_bound N: The poem\'s choice. The one where you get to learn something, at some risk.',
    '?mast_wax N: The safe choice. You will not hear the Sirens, and you will miss nothing except a very good lesson. So, you get the lesson anyway: from me.',
    '?mast_none N: Brave. I will be interested to see how brave in about four minutes.',
    'N: Why does wax work? The Sirens\' song gets into the part of your mind that holds words and rehearses them. Try this, to see what happens when that part is kept busy.',
    { drill: 'dualtask' },
    { notes: 'wmm', say: [
      'Baddeley and Hitch argued that short-term memory is not one store but a working memory with several parts, each with a limited capacity.',
      'The central executive directs attention. The phonological loop holds sounds and words: an inner ear that fades in about two seconds, and an inner voice that rehearses. The visuospatial sketchpad holds what things look like and where they are.',
      'Later Baddeley added the episodic buffer, which binds it all, and long-term knowledge, into a single experience.',
      'Two tasks that use the same part clash. Two tasks that use different parts can share. Saying "one, two" jams the inner voice, so the letters could not be rehearsed. Landry and Bartling found recall fell from about three quarters to under half.'
    ] },
    { drill: 'sort', id: 'wmm_components' },
    '@scene sirens left=sirens.dark right=sirens.fair',
    '@fx gold',
    '?mast_bound @enter center=odysseus.listen',
    'N: The wind drops. The sea goes flat as oil. And from the meadow, the singing begins.',
    'sirens.dark~sing: Come closer, Odysseus, pride of the Greeks. Rest your oars. No one has ever sailed past us without hearing our song.',
    'sirens.fair~fairsing: We know everything that happened at Troy. Everything you missed while you were fighting. Everything the gods said about you.',
    'sirens.dark~sing: We know how your story ends. Come, and we will tell you.',
    '?mast_bound odysseus.fist~shout: Untie me! Eurylochus! Untie me, that is an order!',
    '?mast_bound N: You are tied to the mast, with the song in your ears. Your crew cannot hear you. But the choice below is still yours to make, and the song is pulling on it.',
    { choice: { id: 'song', ask: 'While the Sirens sang, what did you do?', prompt: 'The song fills everything.', timer: 7, opts: [
      { t: 'Signal the crew to row harder. Past them. Now.', set: 'song_row', fx: { trust: 1 } },
      { t: 'Signal the crew to turn towards the meadow.', set: 'song_turn' }
    ], silence: { t: '(Listen. Just listen.)', set: 'song_listen' } }, if: '!mast_wax' },
    '?song_listen&mast_bound N: You listened. You heard everything they promised, and nobody untied you. Try to remember afterwards exactly what they said. It is harder than you think.',
    '?song_listen&!mast_bound N: You listened, and so did the crew. The oars slow. Try to remember afterwards exactly what they sang. It is harder than you think.',
    '?song_row&!mast_bound N: One clear order, through all that noise. The crew row, and the meadow slides past.',
    '?mast_bound&song_turn eurylochus.rope~angry: No, Captain! Tighter! Perimedes, another rope!',
    '?mast_bound&song_turn N: Precommitment. Odysseus used his calm mind earlier to constrain the mind he knew he would have later. His crew obeyed the earlier Odysseus, not this one.',
    '?mast_bound&song_row N: The song pours into the loop that holds words, and there is no room left to rehearse anything else. Odysseus still manages one order. That is his central executive, fighting for control.',
    '?mast_wax N: Your crew sees the Sirens\' mouths moving, and hears nothing at all. Without the input, the song has nowhere to go. Wax is the oldest attention management strategy ever recorded.',
    '?mast_none @fx shake',
    '?mast_none N: The whole crew hears it. Oars slow. Heads turn. Your only hope is that they can think straight while the song fills their heads. Four answers. Every miss, a sailor goes over the side.',
    { qte: { t: ['wmm'], n: 4, timer: 13, title: 'The whole crew hears the song', lv: 2 }, if: 'mast_none' },
    { qte: { t: ['wmm'], n: 2, timer: 15, title: 'Past the meadow of bones', lv: 2 }, if: '!mast_none' },
    '?mast_bound @award wax',
    '@scene strait left=eurylochus.lookout right=odysseus.point',
    '@fx storm',
    'N: The Sirens fall behind. Ahead, the strait. The orders start to come very fast.',
    'odysseus.point~shout: Two points to starboard! Watch the rock on the left! Keep the stroke steady, count it out! And someone get the water out of the stern!',
    'eurylochus.lookout~angry: Which first, Captain? The men can only hold so much!',
    'N: Eurylochus has just stated cognitive load theory in ten words. Let me give it its proper shape.',
    { notes: 'load', say: [
      'Cognitive load theory starts from one assumption: working memory has a limited capacity, and learning suffers when the demands on it exceed that capacity.',
      'Intrinsic load comes from the task itself: how many parts must be held together at once. Extraneous load comes from anything that is not the task: noise, clutter, alarms, a phone buzzing on the desk.',
      'Germane load is the useful effort of building a schema, so that next time the same task takes less capacity. The goal is not zero effort; it is to spend the effort on the right thing.',
      'Sana and colleagues found that students who multitasked on laptops in a lecture understood less. So did students who simply sat where they could see someone else\'s screen.'
    ] },
    { drill: 'sort', id: 'load_types' },
    '@fx clear',
    { log: { title: 'Section B: explain the forgetting', say: 'The exam move. When a Section B question asks you to use the working memory model, name the component and tie it to a detail of the scenario.',
      stem: 'During a match, Oliver\'s coach shouts three quick instructions from the sideline while the crowd is chanting. Oliver remembers two of them and forgets the third.',
      items: [
        { q: 'Which component is most directly overloaded by the shouted instructions and the chanting?', a: 'The phonological loop', d: ['The visuospatial sketchpad', 'Sensory memory', 'Long-term memory'], why: 'Both the instructions and the chanting are verbal, auditory input competing for the same limited component.' },
        { q: 'Which sentence best links the model to Oliver?', a: 'The chanting competes with the instructions in his phonological loop, so he cannot rehearse all three.', d: ['Oliver probably has a poor memory, so he forgets instructions more than his teammates.', 'The working memory model was proposed by Baddeley and Hitch in 1974 to replace the MSM.', 'Studies of the phonological loop use letter lists, so they have low ecological validity.'], why: 'Name the component, then say why it explains the scenario detail. No evaluation in Section B.' },
        { q: 'A cognitive load answer about a student revising with a phone scores top marks when it...', a: 'Shows extraneous load from the phone leaving less capacity for germane processing', d: ['Lists and defines intrinsic, extraneous and germane load accurately', 'Explains that technology is bad for memory and should be banned', 'Describes Sana et al. in full detail, including both experiments'], why: 'Top answers show how the loads interact in the scenario, not just a list of their names.' }
      ] } },
    { write: { id: 'oliver', keys: ['phonological|articulat|inner voice|inner ear|loop', '\\b(because|so|since|therefore|which means|as a result|this means)\\b'], title: 'The working memory model on the pitch', q: 'Using the working memory model, explain why Oliver forgot the third instruction. One or two sentences.', model: 'The coach\'s instructions and the crowd\'s chanting are both verbal, so they compete for the phonological loop, which has a limited capacity. Because the chanting occupies the loop, Oliver cannot rehearse all three instructions with his inner voice, so the third fades from the phonological store.', checks: ['Names the phonological loop (and its parts)', 'Explains the competition or limited capacity', 'Links to a detail of the match with "because"'], stem: 'During a match, Oliver\'s coach shouts three quick instructions from the sideline while the crowd is chanting. Oliver remembers two of them and forgets the third.' } },
    'N: The Sirens are silent behind you. The strait is not. Here is how you stand.',
    '@end'
  ]
});
