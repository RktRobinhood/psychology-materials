/* Cast, shop items, achievements, endings and omens.
 * Voice names are Gemini TTS prebuilt voices used by the build script
 * (design/unit-1-review/tools/voices.mjs); `tts` is the browser-speech fallback. */
window.ODY = window.ODY || {};

/* Episode files call ODY.episode({...}); their load order is the voyage order. */
ODY.episodes = {};
ODY.episodeOrder = [];
ODY.episode = function (ep) {
  ODY.episodes[ep.id] = ep;
  ODY.episodeOrder.push(ep.id);
};

ODY.cast = {
  narrator: { name: 'The Chronicler', color: '#e8c979', voice: 'Sadaltager', lang: 'en-GB',
    style: 'British documentary narrator: warm, precise, unhurried, dryly amused, speaking to one capable student',
    tts: { pitch: 0.9, rate: 0.98, prefer: ['Google UK English Male', 'Daniel', 'Arthur', 'en-GB'] } },
  odysseus: { name: 'Odysseus', color: '#d9533f', voice: 'Alnilam', lang: 'en-GB', pose: 'stand', face: 'calm',
    style: 'weathered king in his forties: controlled baritone, clever, dry, restrained urgency',
    tts: { pitch: 0.8, rate: 0.95, prefer: ['Male', 'David', 'George'] } },
  athena: { name: 'Athena', color: '#f3dfa2', voice: 'Kore', lang: 'en-GB', pose: 'stand', face: 'calm',
    style: 'goddess and mentor: clear, calm, authoritative alto, warm but unsentimental',
    tts: { pitch: 1.05, rate: 0.95, prefer: ['Female', 'Libby', 'Sonia', 'Hazel'] } },
  eurylochus: { name: 'Eurylochus', color: '#8fb3c9', voice: 'Zubenelgenubi', lang: 'en-GB', pose: 'stand', face: 'calm',
    style: 'veteran sailor, second-in-command: grounded, sceptical, tired, loyal but blunt',
    tts: { pitch: 0.85, rate: 1.0, prefer: ['Male', 'Ryan'] } },
  polites: { name: 'Polites', color: '#e0a060', voice: 'Puck', lang: 'en-GB', pose: 'sit', face: 'calm',
    style: 'cheerful young sailor, Odysseus\'s friend: quick, warm, easily excited',
    tts: { pitch: 1.1, rate: 1.05, prefer: ['Male'] } },
  elpenor: { name: 'Elpenor', color: '#b8d98a', voice: 'Sadachbia', lang: 'en-GB', pose: 'stand', face: 'calm',
    style: 'youngest sailor: eager, a little clumsy, earnest',
    tts: { pitch: 1.2, rate: 1.05, prefer: ['Male'] } },
  cyclops: { name: 'Polyphemus', color: '#b07a4a', voice: 'Algenib', lang: 'en-GB', pose: 'stand', face: 'calm',
    style: 'giant one-eyed shepherd: gravelly, slow, heavy, menacing but understandable',
    tts: { pitch: 0.55, rate: 0.85, prefer: ['Male'] } },
  poseidon: { name: 'Poseidon', color: '#4fb3c7', voice: 'Orus', lang: 'en-GB', pose: 'stand', face: 'stern',
    style: 'ancient sea god: deep, deliberate, immense contained anger',
    tts: { pitch: 0.6, rate: 0.85, prefer: ['Male'] } },
  circe: { name: 'Circe', color: '#6fbf73', voice: 'Despina', lang: 'en-GB', pose: 'stand', face: 'calm',
    style: 'sorceress: smooth alto, amused, intelligent, self-possessed and dangerous',
    tts: { pitch: 1.0, rate: 0.92, prefer: ['Female'] } },
  sirens: { name: 'The Sirens', color: '#7fd1c4', voice: 'Aoede', lang: 'en-GB', pose: 'dark', face: 'calm',
    style: 'lyrical, intimate, persuasive, slow and hypnotic, trustworthy-sounding',
    tts: { pitch: 1.2, rate: 0.85, prefer: ['Female'] } },
  scylla: { name: 'Scylla', color: '#9ccf6b', voice: 'Enceladus', lang: 'en-GB', pose: 'rise', face: 'hiss',
    style: 'sea monster with six heads: clipped, breathy, predatory',
    tts: { pitch: 0.5, rate: 0.8, prefer: ['Male'] } },
  tiresias: { name: 'Tiresias', color: '#c9c3e6', voice: 'Schedar', lang: 'en-GB', pose: 'stand', face: 'calm',
    style: 'ancient blind prophet among the dead: even, hollow, patient',
    tts: { pitch: 0.75, rate: 0.85, prefer: ['Male'] } },
  penelope: { name: 'Penelope', color: '#e07a6a', voice: 'Sulafat', lang: 'en-GB', pose: 'stand', face: 'calm',
    style: 'queen of Ithaca: warm, restrained, observant, quiet authority',
    tts: { pitch: 1.05, rate: 0.93, prefer: ['Female'] } },
  antinous: { name: 'Antinous', color: '#c9a0dc', voice: 'Umbriel', lang: 'en-GB', pose: 'stand', face: 'smug',
    style: 'arrogant young aristocrat: confident, quick, dismissive, lightly mocking',
    tts: { pitch: 1.0, rate: 1.08, prefer: ['Male'] } },
  crew: { name: 'The crew', color: '#cfc2a4', voice: 'Achird', lang: 'en-GB',
    style: 'several tired sailors speaking together', tts: { pitch: 0.9, rate: 1.0, prefer: ['Male'] } }
};

/* Items sold at the Chronicler's stall. Stock is drawn at random each visit. */
ODY.items = {
  owl:     { name: "Athena's Owl", icon: 'owl', price: 30, use: 'qte',
             desc: 'In a quick-time question, removes two wrong answers.' },
  wax:     { name: 'Beeswax', icon: 'wax', price: 25, use: 'qte',
             desc: 'Stops the clock on one quick-time question. Think it through.' },
  laurel:  { name: 'Laurel Wreath', icon: 'laurel', price: 40, use: 'passive',
             desc: 'The next wrong quick-time answer costs no crew. Used up automatically.' },
  moly:    { name: 'Moly Herb', icon: 'moly', price: 60, use: 'choice',
             desc: 'Rewind the story to your last choice and choose again. Crew, drachmae and satchel stay as they are now. Story choices are normally final.' },
  lantern: { name: "Tiresias' Lantern", icon: 'lantern', price: 35, use: 'choice',
             desc: 'Reveals what each option in the next choice will cost or gain.' },
  lyre:    { name: 'Lyre of Phemius', icon: 'lyre', price: 50, use: 'now',
             desc: 'A song lifts spirits: two sailors rejoin the crew at once.' },
  bag:     { name: "Aeolus' Bag", icon: 'bag', price: 45, use: 'qte',
             desc: 'A gust carries you past one quick-time question: no crew lost, no coins won.' },
  amphora: { name: 'Amphora of Plenty', icon: 'amphora', price: 30, use: 'now',
             desc: 'Double drachmae from every correct quick-time answer until the end of this episode.' }
};
ODY.itemMax = 6;

/* The Chronicler comments once, after the fourth chest (the bible's running joke). */
ODY.chestLines = [
  'You may wish to notice how quickly one more chest became a perfectly reasonable sentence. Some are empty. You open them anyway.',
  'Four chests. Some empty, some not, and no way of telling which. For the record, that is a variable ratio schedule. Do carry on.'
];

ODY.omens = [
  { id: 'fair', name: 'Fair winds', text: 'A steady wind and a lucky catch: +15 drachmae.', coins: 15 },
  { id: 'swell', name: "Poseidon's swell", text: 'The sea is restless. Quick-time questions are 2 seconds faster this episode.', timer: -2 },
  { id: 'owl', name: "Athena's favour", text: 'An owl lands on the mast. You gain an Owl.', item: 'owl' },
  { id: 'gust', name: 'Following gust', text: 'Your first three correct answers pay double.', firstDouble: 3 },
  { id: 'calm', name: 'Calm seas', text: 'Nothing stirs. Enjoy it while it lasts.' },
  { id: 'recruit', name: 'Stowaway', text: 'A fisherman\'s son hid among the cargo. +1 crew.', crew: 1 },
  { id: 'rations', name: 'Short rations', text: 'Supplies are low and tempers are short. Crew trust -1.', trust: -1 }
];

ODY.achievements = [
  { id: 'first_steps', name: 'Cast Off', desc: 'Finish the first episode.' },
  { id: 'homecoming', name: 'Homecoming', desc: 'Reach Ithaca and finish the voyage.' },
  { id: 'all_hands', name: 'All Hands', desc: 'Finish an episode without losing a single sailor.' },
  { id: 'streak10', name: 'Unbroken Oar', desc: 'Answer 10 quick-time questions in a row correctly.' },
  { id: 'nobody', name: 'Nobody Knows', desc: 'Leave the Cyclops without giving him your name.' },
  { id: 'hubris', name: 'Hubris', desc: 'Tell Polyphemus exactly who blinded him.' },
  { id: 'moly', name: 'Second Thoughts', desc: 'Use a Moly herb to undo a choice.' },
  { id: 'shopper', name: 'Regular Customer', desc: 'Buy five items from the Chronicler.' },
  { id: 'chests', name: 'One More Chest', desc: 'Open five chests hidden in the scenery.' },
  { id: 'lop3', name: 'Deep Waters', desc: 'Recognise all nine words the Chronicler hid in Troy, with no false alarms.' },
  { id: 'wax', name: 'Bound to the Mast', desc: 'Hear the Sirens and keep your course.' },
  { id: 'shipwreck', name: 'Lost at Sea', desc: 'Lose your whole crew. It happens to the best captains.' },
  { id: 'scholar', name: 'Scholar of Ithaca', desc: 'Reach the Scholar ending.' },
  { id: 'all_endings', name: 'Every Road Home', desc: 'Find all five endings.' },
  { id: 'master1', name: 'Mastery', desc: 'Reach 80% mastery in any topic.' },
  { id: 'master_all', name: 'Polymath', desc: 'Reach 80% mastery in every topic.' },
  { id: 'trial_a', name: 'First Mark', desc: 'Write and self-mark a Section A answer.' },
  { id: 'mock', name: 'The Full Trial', desc: 'Complete a whole mock Paper 1.' },
  { id: 'calm', name: 'Steady Hand', desc: 'Finish an episode in Calm mode.' },
  { id: 'rich', name: 'Treasure of Troy', desc: 'Hold 300 drachmae at once.' }
];

ODY.endings = {
  crew:    { title: 'The Crew Comes Home', icon: 'medal_ship',
             text: 'Against every version of the story ever told, Odysseus sails into Ithaca with living sailors at the oars. The poets will have to rewrite a great deal.' },
  canon:   { title: 'The Long Way Home', icon: 'compass',
             text: 'Odysseus comes home as Homer said he would: late, alone and changed. Ithaca is his again. The sea keeps the rest.' },
  scholar: { title: 'Scholar of Ithaca', icon: 'medal_owl',
             text: 'The bow is strung, the hall is quiet, and Athena leaves the owl behind. Whatever the sea did to the ship, it did nothing to what you know.' },
  wrath:   { title: "Poseidon's Tide", icon: 'medal_chain',
             text: 'Ithaca is won, but every night the tide climbs a little higher on the beach. A god who was named and mocked does not forget. Neither, it turns out, do you.' },
  doubt:   { title: "Penelope's Doubt", icon: 'medal_tree',
             text: 'The stranger won the bow, but the story he told of his voyage did not match the one she had pieced together. Penelope keeps her door shut a while longer. Memory, it seems, is a reconstruction.' },
  lost:    { title: 'Lost at Sea', icon: 'lock',
             text: 'The last oar goes quiet. The Chronicler closes the book, then, because this is a review and not a tragedy, opens it again.' }
};
ODY.endingOrder = ['crew', 'canon', 'scholar', 'wrath', 'doubt', 'lost'];
