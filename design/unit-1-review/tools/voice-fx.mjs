// Monster voices for the Odyssey review game: per-line acting directions (with inline
// audio tags that only the TTS hears; subtitles keep the plain text) and post-processing
// that pushes the rendered voice past what a human throat can do.
//
// DIRECT is keyed by the line's subtitle text, so the file name (hash of speaker|text)
// does not change. `say` is what the TTS reads; `dir` is added to the speaker's style.

export const DIRECT = {
  cyclops: {
    'Strangers. In my cave. Where did you leave your ship, little men?':
      { say: '[sniffing the air] Strangers. [low rumbling growl] In my cave. Where did you leave your ship... little men?', dir: 'suspicious and predatory, sniffing out prey, a low rumbling growl under the words' },
    'The gods? I am a son of Poseidon. I care nothing for your gods, or your guests, or your expecting.':
      { say: '[contemptuous snort] The gods? [roaring] I am a son of POSEIDON! I care nothing for your gods, or your guests, or your expecting!', dir: 'contempt boiling into a thunderous roar' },
    'More of that wine, little man. It is good. Tell me your name, and I will give you a guest-gift.':
      { say: '[grunts] More of that wine, little man. [slurps] It is good. Tell me your name... and I will give you a guest-gift.', dir: 'drowsy, getting drunk, greedy and slurring, heavy satisfied grunts' },
    'Nobody. Then here is your gift, Nobody. I will eat you last.':
      { say: 'Nobody. [deep cruel chuckle] Then here is your gift, Nobody. [slow, savouring it] I will eat you... last.', dir: 'slow cruel amusement, a deep rumbling laugh, savouring the threat' },
    'Odysseus. A proud name. I will say it to my father. Here is your gift: I will eat you last.':
      { say: 'Odysseus. [growling] A proud name. I will say it to my father. [snarling] Here is your gift: I will eat you... last.', dir: 'angry, menacing, a growl in the throat' },
    'My eye! My EYE!':
      { say: '[agonised howl] My eye! [screaming in pain] My EYE!', dir: 'howling in agony, a wounded beast screaming' },
    'Nobody! Nobody is hurting me!':
      { say: '[wailing] Nobody! [sobbing roar] Nobody is hurting me!', dir: 'wailing in pain and panic, bellowing for help' },
    'Odysseus! The man called Odysseus!':
      { say: '[howling with rage] Odysseus! [bellowing] The man called Odysseus!', dir: 'howling fury, bellowing across the sea' },
    "My ram. You are last out today. Are you sad for your master's eye?":
      { say: "[heavy ragged breathing] My ram. You are last out today. [sniffing] Are you sad... for your master's eye?", dir: 'blind and wounded, groping, pitiful self-pity with menace underneath, heavy breathing' },
    'Odysseus! Father! Poseidon, Earth-Shaker, hear me! Let him come home late, alone, and to trouble in his house!':
      { say: '[roaring to the sky] Odysseus! Father! Poseidon, Earth-Shaker, HEAR ME! [snarling curse] Let him come home late... alone... and to trouble in his house!', dir: 'a monstrous roaring curse hurled at the sky, then a slow snarled prophecy' }
  },
  sirens: {
    'Come closer, Odysseus, pride of the Greeks. Rest your oars. No one has ever sailed past us without hearing our song.':
      { say: '[soft eerie giggle] Come closer, Odysseus... pride of the Greeks. [singing] Rest your oars. No one has ever sailed past us... without hearing our song.', dir: 'high, sweet and eerie, sing-song like a lullaby, a teasing giggle' },
    'We know everything that happened at Troy. Everything you missed while you were fighting. Everything the gods said about you.':
      { say: '[singing] We know everything that happened at Troy. [whispering] Everything you missed while you were fighting. [high trilling laugh] Everything the gods said about you.', dir: 'melodic and seductive, sliding between song and whisper, a shrill trilling laugh' },
    'We know how your story ends. Come, and we will tell you.':
      { say: '[singing] We know how your story ends. [shrill, eager] Come... [giggling] and we will tell you.', dir: 'a rising shrill, hungry song, the sweetness cracking into something predatory' }
  }
};

// Post-processing per speaker. `pitch` < 1 lowers pitch and slows the voice (tape-style).
export const FX = {
  cyclops: { pitch: 0.8, drive: 1.8, reverb: { size: 1.25, decay: 0.84, damp: 0.45, mix: 0.3 } },
  sirens: { chorus: true, reverb: { size: 1.0, decay: 0.86, damp: 0.2, mix: 0.35 } }
};

const toF = pcm => Float32Array.from(pcm, v => v / 32768);
function toI(x) {
  let peak = 0;
  for (const v of x) peak = Math.max(peak, Math.abs(v));
  const g = peak > 0 ? 0.89 / peak : 1;
  return Int16Array.from(x, v => Math.round(Math.max(-1, Math.min(1, v * g)) * 32767));
}
function resample(x, f) {
  const n = Math.floor(x.length / f), y = new Float32Array(n);
  for (let i = 0; i < n; i++) { const p = i * f, a = Math.floor(p), t = p - a; y[i] = x[a] * (1 - t) + (x[a + 1] || 0) * t; }
  return y;
}
function drive(x, d) {
  const n = Math.tanh(d);
  return x.map(v => Math.tanh(v * d) / n);
}
// Freeverb-style: parallel damped combs into series allpasses, with a tail appended.
function reverb(x, rate, { size, decay, damp, mix }) {
  const s = rate / 44100 * size, tail = Math.round(rate * 1.6);
  const inp = new Float32Array(x.length + tail); inp.set(x);
  const wet = new Float32Array(inp.length);
  for (const d0 of [1116, 1188, 1277, 1356, 1422, 1491]) {
    const d = Math.round(d0 * s), buf = new Float32Array(d); let idx = 0, lp = 0;
    for (let i = 0; i < inp.length; i++) {
      const out = buf[idx];
      lp = out * (1 - damp) + lp * damp;
      buf[idx] = inp[i] + lp * decay;
      idx = (idx + 1) % d;
      wet[i] += out / 6;
    }
  }
  for (const d0 of [556, 441]) {
    const d = Math.round(d0 * s), buf = new Float32Array(d); let idx = 0;
    for (let i = 0; i < wet.length; i++) {
      const b = buf[idx], v = wet[i];
      buf[idx] = v + b * 0.5;
      wet[i] = b - v;
      idx = (idx + 1) % d;
    }
  }
  const y = new Float32Array(inp.length);
  for (let i = 0; i < y.length; i++) y[i] = inp[i] * (1 - mix * 0.5) + wet[i] * mix * 2;
  // Drop the silent end of the tail.
  let end = y.length;
  while (end > x.length && Math.abs(y[end - 1]) < 0.002) end--;
  return y.subarray(0, end);
}
// Several copies on slowly wobbling delays: one voice becomes a shimmering choir.
function chorus(x, rate) {
  const voices = [[18, 4, 0.31, 0.7, 0], [27, 6, 0.23, 0.6, 2.1], [11, 3, 0.47, 0.55, 4.2], [35, 7, 0.17, 0.45, 1.3]];
  const y = Float32Array.from(x, v => v * 0.8);
  for (const [dms, depth, hz, gain, ph] of voices) {
    for (let i = 0; i < x.length; i++) {
      const d = (dms + depth * Math.sin(2 * Math.PI * hz * i / rate + ph)) * rate / 1000;
      const p = i - d; if (p < 0) continue;
      const a = Math.floor(p), t = p - a;
      y[i] += (x[a] * (1 - t) + (x[a + 1] || 0) * t) * gain;
    }
  }
  return y;
}

export function applyFx(who, pcm, rate) {
  const fx = FX[who];
  if (!fx) return pcm;
  let x = toF(pcm);
  if (fx.pitch) x = resample(x, fx.pitch);
  if (fx.drive) x = drive(x, fx.drive);
  if (fx.chorus) x = chorus(x, rate);
  if (fx.reverb) x = reverb(x, rate, fx.reverb);
  return toI(x);
}
