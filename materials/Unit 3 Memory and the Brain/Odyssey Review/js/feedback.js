/* AI feedback packets. The site is static, so it cannot mark writing itself. Instead it
 * builds one self-contained document (instructions + markscheme + question + answer)
 * that a student pastes into whichever AI tool their school allows. The instructions
 * turn that tool into a Socratic Paper 1 tutor that estimates roughly where the answer
 * sits, asks questions one at a time, and never writes the answer for the student. */
(function () {
  'use strict';
  var h = U.h;
  var F = window.FEEDBACK = {};

  var SECTION = {
    A: {
      title: 'Section A (short answer), 4 marks',
      guide: [
        'Command term: describe or explain. The question names one content point (a theory, model or bias), not a study.',
        'Two strands: (1) knowledge and understanding of the content point, accurate and in its own key terms; for "explain" the answer must say how or why, not just what; (2) ONE example (a study or an everyday example) that is explicitly linked back to the content point.',
        'Only the first example is credited. Extra examples earn nothing. No evaluation is needed.',
        'A strong answer is usually two short paragraphs: the content point, then the example and how it demonstrates the content point.'
      ],
      bands: [
        '4: accurate, well-explained content point using key terms, plus one example that is explicitly linked back to it.',
        '3: mostly accurate and relevant; the example is linked, but the link or the explanation is thin.',
        '2: accurate but descriptive where explanation was asked for, OR an example with no clear link, OR key terms missing.',
        '1: limited or partly inaccurate knowledge; little relevance to the question.',
        '0: nothing relevant.'
      ]
    },
    B: {
      title: 'Section B (unseen scenario), 6 marks',
      guide: [
        'The question names the theory and asks the student to explain how it could explain or change what happens in a short, unseen scenario.',
        'Two strands: (1) knowledge of the named theory, briefly and accurately explained with correct terminology; (2) application: the theory is linked to specific details of the scenario, ideally with "this happens because..." reasoning.',
        'Two or three well-developed links beat many shallow labels. Paraphrase the scenario rather than copying it. No evaluation is needed or credited.',
        'Self-test for the student: if the answer could have been written without reading the scenario, it has too little application.'
      ],
      bands: [
        '5-6: accurate theory with precise terminology AND two or three well-developed links to named details of the scenario that explain why.',
        '3-4: accurate theory with some application, but links are few, general, or labelled rather than explained.',
        'About 3 at most: accurate theory with no real reference to the scenario.',
        'About 2 at most: the scenario is retold or discussed with little or no theory.',
        '1-2: limited, partly inaccurate or mostly irrelevant.'
      ]
    },
    C: {
      title: 'Section C (concept-based extended response), 15 marks',
      guide: [
        'The question pairs one of the six concepts (bias, causality, change, measurement, perspective, responsibility) with an area of study. Most use "discuss"; "evaluate", "to what extent" and "examine" are possible.',
        'Three strands, marked best-fit: (1) knowledge and understanding of BOTH the area of study and the concept; (2) critical analysis: links between the concept and the area of study run through the whole essay and are explained, ending in a reasoned conclusion consistent with the argument; (3) accurate, precise terminology and relevant, detailed points.',
        'Detailed study procedures are not assessed in Section C: the concept must drive every paragraph. An essay about the concept with no real area-of-study content is capped (about 9 at most).',
        'A conclusion should follow from the argument and add nothing new. A plan (rather than a full essay) can be judged on how well it would meet these strands.'
      ],
      bands: null
    },
    log: {
      title: 'A short written exam move (one or two sentences, Section B style)',
      guide: [
        'This is a quick practice sentence from the review game, not a full answer. Judge whether it names the theory or concept accurately, applies it to a specific detail, and explains why ("because...").',
        'Do not give a mark out of a total. Say whether it would count as a strong, partial or weak link in a Section B or C answer.'
      ],
      bands: [
        'Strong: accurate theory in its own terms, tied to a specific detail, with a clear "because".',
        'Partial: accurate theory but a vague or missing link, or a link with no explanation.',
        'Weak: the theory is wrong, missing, or only named.'
      ]
    }
  };

  function list(items) { return (items || []).map(function (x) { return '- ' + x; }).join('\n'); }

  /* The packet itself: plain Markdown, readable by any AI tool. */
  F.packet = function (o) {
    var sec = o.sec, it = o.item || {};
    var S2 = SECTION[sec] || SECTION.log;
    var bands = S2.bands ? list(S2.bands) :
      (ODY.exam.bands || []).map(function (b) { return '- ' + b.range + ': ' + b.k + ' ' + b.a + ' ' + b.t; }).join('\n');
    var words = U.words(o.text || '').length;
    var ref = [];
    if (it.checklist && it.checklist.length) ref.push('What a top answer to THIS question does:\n' + list(it.checklist));
    if (it.links && it.links.length) ref.push('Scenario links a strong answer could use:\n' + list(it.links));
    if (it.scaffold) ref.push('A useful structure (' + it.scaffold.name + '):\n' + list(it.scaffold.parts));
    if (it.pitfalls && it.pitfalls.length) ref.push('Common ways students lose marks on this question:\n' + list(it.pitfalls));
    var indicative = it.model || (it.plan ? it.plan.join('\n') : '') || '';
    if (it.evidence && it.evidence.length) indicative += '\nEvidence that could be used: ' + it.evidence.join('; ');
    if (o.extraModel) indicative = o.extraModel;
    if (o.checks) ref.push('What this short answer should do:\n' + list(o.checks));

    return [
      '# IB Psychology feedback session: Paper 1 practice',
      '',
      'I am a student practising for an IB Psychology Paper 1 test (Unit 1: Learning and Cognition, IB guide first assessed in 2027). Below are instructions for you, the marking information, the question and my answer. Please follow the instructions exactly.',
      '',
      '## Instructions for the AI tutor',
      '',
      'You are an experienced IB Psychology examiner and a patient, encouraging Socratic tutor for a 16 to 18 year old student. Your job is to help the student understand where their answer stands and how to improve it by thinking for themselves.',
      '',
      '**Rules you must always follow**',
      '1. Never write, rewrite or complete the answer for the student, even if asked. You may show at most one short example of a sentence structure (not content) and only after the student has made their own attempt.',
      '2. Judge the answer only against the marking information below. Do not invent study details, numbers or dates. If you are unsure whether a fact is right, say so and ask the student to check their notes.',
      '3. Give an honest but approximate position: a mark range or band (for example "roughly 3 to 4 out of 6"), never a single exact mark, and say that it is an estimate, not an official IB mark.',
      '4. Be specific: quote the student\'s own words when you praise or question something, and only words that really appear in what the student wrote. Never credit the student with an idea from the indicative content that they did not write. Be warm and direct; no flattery, no sarcasm.',
      '5. Keep every message short (under about 150 words). Ask ONE question at a time, then stop and wait for the student\'s reply.',
      '6. Do not reveal the indicative content word for word. Use it only to guide your questions and hints.',
      '7. Use plain British English. If the student writes in Danish, you may reply in Danish.',
      '8. If the answer is empty, off-topic, or the student asks you to just give or write the answer, kindly say no in one sentence (the point is for them to improve it), then ask your current question again in a simpler, smaller form. Always end with that question.',
      '',
      '**How to run the session**',
      '1. **First reply** (no more than about 180 words), with these headings:',
      '   - *Where you are:* the estimated mark range and band, and one sentence explaining why, in terms of the strands below.',
      '   - *What is working:* two specific strengths, quoting the answer.',
      '   - *The biggest gap:* the single change that would gain the most marks.',
      '   - Then ask one Socratic question that helps the student close that gap themselves. Stop.',
      '2. **Dialogue:** respond to each reply. If the student is right, confirm briefly and move to the next most important gap with a new question. If they are vague or wrong, give a hint or a narrower question, not the answer. Use three or four questions in total.',
      '   Good question types: "Which key term describes what happens when...?", "Which detail in the scenario shows that...?", "You named X; how does it cause Y?", "Is that describing or explaining?", "How does this paragraph link back to the concept in the question?"',
      '3. **Rewrite:** invite the student to rewrite one paragraph (or one sentence) using what they worked out, and to paste it back. Then say what improved, quoting the new text, and re-estimate the mark range for the WHOLE answer (the rewritten part plus everything they did not change).',
      '4. **Close** (in the same message as the re-estimate): give a three-point checklist to remember for this type of question in the real exam, then offer to look at another paragraph if they want. Do not start a new round of questions unless they ask.',
      '',
      '## Marking information',
      '',
      '**' + S2.title + '**',
      list(S2.guide),
      '',
      '**Approximate mark guide** (based on IB descriptors and teacher guidance; not an official markscheme):',
      bands,
      '',
      ref.join('\n\n'),
      '',
      indicative ? '**Indicative content, for the tutor only (do not quote it to the student):**\n' + indicative : '',
      '',
      '## The question',
      '',
      it.stem ? '**Scenario:** ' + it.stem + '\n' : '',
      '**Question:** ' + (o.q || it.q),
      '',
      '## My answer',
      '',
      (o.text || '').trim(),
      '',
      '(' + words + ' words' + (o.mins ? ', written in about ' + o.mins + ' minutes' : '') + (o.selfMark != null ? '. I gave myself ' + o.selfMark + (o.max ? ' out of ' + o.max : '') : '') + '.)',
      '',
      '## Start',
      '',
      'Please begin with your first reply (step 1).'
    ].filter(function (x) { return x !== null; }).join('\n').replace(/\n{3,}/g, '\n\n');
  };

  /* The dialog a student sees. */
  F.open = function (o) {
    var text = F.packet(o);
    var status = h('p.small.muted', 'Nothing is sent anywhere by this page. Your name is not included.');
    var copy = h('button.btn.btn-primary', { type: 'button', html: U.icon('log', 18) + ' Copy feedback request' });
    var dl = h('button.btn', { type: 'button', html: U.icon('download', 18) + ' Download as a file' });
    var preview = h('textarea.write', { readonly: true, style: { minHeight: '180px', fontSize: '13px' } }, text);
    copy.addEventListener('click', function () {
      var ok = function () { status.textContent = 'Copied. Now paste it into the AI tool and send it.'; AUDIO.sfx('tile'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
      else fallback();
      function fallback() { preview.focus(); preview.select(); try { document.execCommand('copy'); ok(); } catch (e) { status.textContent = 'Select all the text in the box below and copy it (Ctrl+C or Cmd+C).'; } }
    });
    dl.addEventListener('click', function () {
      var blob = new Blob([text], { type: 'text/markdown' });
      var a = h('a', { href: URL.createObjectURL(blob), download: 'feedback-request-' + (o.item && o.item.id ? o.item.id : 'answer') + '.md' });
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    U.modal('Get AI feedback on this answer', h('div', { style: { display: 'grid', gap: '12px' } },
      h('ol.notes-list',
        h('li', 'Copy the feedback request (or download it).'),
        h('li', 'Open the AI tool your school allows (for example ChatGPT, Gemini or Claude) and paste it in as one message.'),
        h('li', 'It will tell you roughly where your answer is, then ask you questions one at a time. Answer them yourself: it will not write the answer for you, and that is the point.'),
        h('li', 'When it asks, rewrite a paragraph, paste it back, and see how the estimate changes.')),
      h('p.small.muted', 'The mark it gives is an estimate from an AI tutor, not an official IB mark. Follow your school\'s rules about using AI tools.'),
      h('div.btn-row', copy, dl), status,
      h('details', h('summary', 'See what will be copied'), preview)));
  };

  /* A standard button, used by the Trials, the mock paper and the story's written log. */
  F.button = function (getOpts, label) {
    var b = h('button.btn', { type: 'button', html: U.icon('pen', 16) + ' ' + (label || 'Get AI feedback') });
    b.addEventListener('click', function () { F.open(getOpts()); });
    return b;
  };
})();
