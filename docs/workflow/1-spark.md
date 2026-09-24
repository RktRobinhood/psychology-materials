# Stage 1: Spark

**Role:** producer. The user arrives with a wild idea and raw material: a ChatGPT prototype, InThinking pages, papers, a video, notes. Your job is to catch the idea before it cools and turn it into something playable. Rigour and polish come in later stages; here, aim for a playable whole over a polished part.

## Steps

1. **Take stock of the raw material.** List every source the user gave and its copyright status. Copyrighted prose (InThinking, textbooks) is a syllabus guide only: reuse study facts, write every sentence fresh.
2. **Ask only the questions that change the build**, in one round: lesson format (solo, group rotation, escape room, projector-led), target length, and anything in the idea that can go two very different ways. Everything else, pick a sensible default and note it in the brief.
3. **Write the brief** at `design/<lesson-slug>/brief.md`:
   - the idea in the user's own words
   - where it sits in the IB course (approach, topic, which IB concepts it serves)
   - learning outcomes, as things a student can do by the end
   - format, length, hook, the chapter or station outline
   - sources, with copyright status
   - open questions and assumed defaults
4. **Build the first playable version** in `materials/<Lesson Name>/`, following the build conventions in [preferences.md](../preferences.md). Salvage what is good from any prototype; move prototype leftovers (docs, style boards, crops) into `design/<lesson-slug>/`.
5. **List what is missing**: assets the user needs to make or source (the user often generates art with ChatGPT and relays it), content gaps, anything you stubbed.

## Done when

- The lesson opens from `file://` and from the local server, and every chapter or station is reachable start to finish.
- The brief exists and its open questions are listed.
- The lesson has a row in [lessons.md](../lessons.md) marked Spark done, with the missing-items list linked.
