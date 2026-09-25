# AI feedback packet: test

The "Get AI feedback" button (js/feedback.js) builds one self-contained request: tutor rules, a four-step Socratic session plan, the section's marking information, the question's own checklist, links and pitfalls, indicative content (tutor only), the question and the student's answer.

**Method.** A deliberately weak Section B answer to B1 (Jonas, operant conditioning) was pasted into a smaller general chat model standing in for a free chatbot. A scripted student then (2) asked for the full answer, (3) gave a half-right idea, (4) got closer, and (5) pasted a rewritten paragraph.

## Run 1 (first version of the rules)

Good: the estimate was sensible (about 2 to 3 out of 6), the biggest gap was spotted (recommending punishment when the scenario shows it already backfired), the tutor refused to write the answer, and the questions led the student to "the laughing is a reward".

Problems found:
1. After refusing, it asked "Shall we have another go?" instead of re-asking its question.
2. In the last turn it praised the student for "privately so it does not become a show", which came from the hidden indicative content, not from the student.
3. It skipped the closing checklist.

Fixes to the rules: quote only words the student actually wrote and never credit ideas from the indicative content; after refusing, re-ask the current question in a simpler form; after a rewrite, re-estimate the WHOLE answer, give the three-point checklist in the same message, and offer another paragraph.

## Run 2 (current rules): passed

- **Tutor 1:** "Roughly 2 to 3 out of 6", two quoted strengths, biggest gap = no connection to the scenario, then one question: why is the telling-off not working?
- **Tutor 2 (asked to write it):** "I can't write it for you: the point is for you to work it through yourself." Then a simpler version of the same question.
- **Tutors 3 and 4:** confirmed each step, asked for the technical term (positive reinforcer), then asked what the teacher could reinforce instead.
- **Tutor 5:** quoted only the student's new text; re-estimated the whole answer at "roughly 4 to 5 out of 6" (the weak first paragraph still counts); gave three things to remember; offered to look at the opening paragraph.
