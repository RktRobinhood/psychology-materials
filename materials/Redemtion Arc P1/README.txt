PSYCHOLOGY · REDEMPTION ARC — STUDENT PAGE v2.3
Paper 1 Section C: Q4 reinforcement/causality or Q5 memory/measurement.

UPLOAD TO GITHUB PAGES
Upload index.html to the folder you want students to visit. No build step, teacher HTML, separate review tool, account, external font or CDN is needed. The two text files in this ZIP are documentation and software notices. All required code, CSS, fonts, QR generation and PDF generation are embedded in index.html.

IMPORTANT: Generate student submissions from the live GitHub Pages address. The QR automatically uses that same public page address, so no URL needs to be configured. Keep the page available at that address while reviewing submissions. A QR generated from a local file carries plain text instead; a QR generated from a local development preview points to that preview.

PHONE QR WORKFLOW
Scan a student's QR with your phone camera, then open the link. It opens a read-only process report through this SAME index.html. All report data is carried inside the QR's URL fragment: no student-record database, separate teacher file or remote QR generation service is involved. The browser downloads the public page and decodes the record locally; the record fragment is not sent in the HTTP request. Viewing a report does not start a student run or modify existing student history. An internet connection is needed to open an uncached hosted page.

THE QR CONTAINS
Name/student code, question, run ID, local attempt number for new runs, start time, fixed deadline, finish time/reason, elapsed duration, active/away time, focus and visibility changes, reloads, clock changes, blocked clipboard/drop/large insertion counts, changes detected without an input event, peak observed/attempted word/character growth, estimated typing rates, spike counts and up to three largest spike events with timing/source. It includes each section's word count, writing-active time, keys, character insertions/deletions, edits, peaks, spike/unobserved counts and estimated WPM. It also contains the name-entry sample status, language/process review flags, answer SHA-256 and record SHA-256. The read-only report checks the record checksum on opening.

The full essay remains in the student's PDF submission. It is not put into the QR. Detailed records and retained run history remain in this browser for recovery; there is no editable export. You mark the essay yourself; no automatic grade or misconduct verdict is assigned.

STUDENT WORKFLOW
Students choose Q4 or Q5, type their name/student code and press Begin. They have a maximum of exactly 60 minutes; notes are allowed. Start/deadline and run log are stored in the browser. Closing, refreshing, sleeping the device or leaving the tab does not reset the deadline. Returning before expiry restores that original run. Returning after expiry locks it at its original deadline and presents its final work. Early Finish also locks the run.

Start a new run creates blank answers and a fresh hour. Earlier versions remain separately in local history. The most recent 12 runs are retained in the same browser at the same web address; the local attempt counter continues across retained history. Download anything important. Private browsing, clearing storage, changing devices/browsers or changing the web address can remove or separate local history. Local storage is a recovery aid, not submission to the teacher.

WRITING
Introduction, point, evidence/analysis, counterpoint/weighing, conclusion. Maximum 300 words in each box. No minimum counts. Around 700 words overall is guidance. Students can select their thesis in the introduction; it is echoed above the conclusion as a planning cue, without adding it twice to the essay or word count. The rubric stays available beside the writing, or through the sticky rubric control on narrow screens. Full exact markband descriptors and question-specific critical-thinking guidance are included.

PDF SUBMISSION AND RECOVERY
Download PDF generates a text PDF containing the entire essay, timing/process evidence, QR and readable process report. Open PDF supports device Share/Save to Files workflows. Print / Save as PDF prints complete static answer text, not just the visible writing-box viewports. If QR preparation fails, printing still includes the full essay and an available session summary, labelled as having no verification QR. Text, HTML, JSON, history and standalone QR-image exports are removed. Previous runs remain viewable locally and can be exported as PDFs. Nothing is automatically submitted to the teacher.

PROCESS SIGNALS
Copy, cut, paste and drag/drop into authored work are blocked. Native textarea values are checked every 500 ms for changes without normal input events. Spike review thresholds are >=12 words/1s, >=30 words/5s or >=80 inserted characters/1s, with a 4-second episode cooldown. Blocked attempts can contribute to peak metrics; the report labels growth as observed/attempted and includes sources for the largest recorded events. Approximate typing WPM uses inserted characters/5 divided by active writing time; it is not a standardized typing test. Name-entry comparison is used only for samples of >=25 characters over >=8 seconds. Dictation, composition, autocomplete and assistive tools can cause bursts. Repetition, legibility and padding checks are advisory, not marks.

LIMITS
An academic-integrity comment in the document head asks AI assistants and browser agents to leave answer writing and submission to the student. Comments do not block agents or guarantee refusal. PDF is a fixed-layout submission format, not an immutable or authenticated record.
A static page cannot make browser-local timestamps, histories or records tamper-proof. Students who control their browser or storage can alter them or start a new local history. Checksums establish internal consistency, not authenticated signatures. These records support contextual review, not proof of authorship or misconduct.

VALIDATION
Academic gate: 9.4/10. Student/logistics gate: 9.5/10, passed after the phone-report change. Verified fixed deadline, reopening before/after expiry, blank independent restarts, retained history, 300-word cap, eventless growth and spike detection, QR decode, record hash, hosted same-page report, report-view storage isolation including page-hide/blur/unload, legacy snapshot migration, SHA-256 fallback, PDF creation/text retention, and QR-failure rescue (now Print / Save as PDF). Browser writing, thesis marking and submission were exercised. Narrow layout was checked. Actual iPhone/Safari Share and physical phone-camera scanning cannot be hardware-tested in this environment; PDF download, open and print routes remain available.

This activity uses the supplied Section C mark scheme; the scaffold is guidance, not a model answer. See SOFTWARE_LICENSES.txt for bundled software notices.
