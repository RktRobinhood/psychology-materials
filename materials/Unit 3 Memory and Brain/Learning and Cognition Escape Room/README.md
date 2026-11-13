# Mindvault: Learning and Cognition Escape Room

A review of Units 2 and 3 (learning, bias, memory and the brain) for students working alone. About 40 to 65 minutes.

- **Nine rooms** of multiple-choice questions: short- and long-term memory, Glanzer and Cunitz, neuroplasticity, localization, classical conditioning, operant conditioning, cognitive load, cognitive bias and the six IB concepts. Each room draws five questions at random (six for the concepts), with an explanation after every answer.
- **Notes workshop**: students write a note per topic and link the six concepts. They download a submission report (JSON) for the teacher and an Obsidian ZIP for themselves (extract it, then "Open folder as vault").

## Editing questions

Questions live in `questions.js`, grouped by room ID. Format: `[room id, question, unused field, four choices, index of correct choice (0 to 3), explanation]`. Keep the array structure. The questions are original practice items, not official IB questions.

## Limits and privacy

- Nothing is uploaded and no names are required. Progress is saved in the browser on that device only; students should use Backup before switching device or clearing site data.
- Answers are visible in the page source, and the report is self-reported browser data with no identity check or tamper protection. Treat it as formative practice, not a secure test.
