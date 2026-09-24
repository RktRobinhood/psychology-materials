# Unit 1 review: what the repo's lessons actually teach

A content digest of the finished lessons in `materials/`, for building the Unit 1 review game (IB Psychology, Learning and Cognition, first assessment 2027). Everything below is taken from the lesson files. Wording is kept close to the lessons' own phrasing, trimmed for length. Anything I think is missing or doubtful is kept apart in [Gaps and concerns](#gaps-and-concerns) at the end.

Compiled 2026-09-24. `materials/Unit 1 Review - Learning and Cognition/` (the prototype) was deliberately ignored.

## Sources and short codes

Paths are relative to the repo root. Line numbers are given where they help.

| Code | File | Lesson |
| --- | --- | --- |
| **MoM** | `materials/Models of Memory/index.html` | Memory Lab: MSM (Sperling, Miller, Glanzer & Cunitz) and Levels of Processing |
| **OC** | `materials/Operant Conditioning/index.html` | Escape the Loop: operant conditioning escape room |
| **OC-js** | `materials/Operant Conditioning/js/app.js` | answer key (line 325) |
| **MQ** | `materials/Working Memory and Cognitive Load/data/lesson-data.js` | Memory Quest: WMM and cognitive load (all dialogue, key facts, quizzes) |
| **MQ-st** | `materials/Working Memory and Cognitive Load/js/studies.js` | Memory Quest study walkthroughs and interactive WMM |
| **MQ-g** | `materials/Working Memory and Cognitive Load/js/games.js` | Memory Quest mini-games, final "Overload Engine" scenarios |
| **MQ-d** | `design/working-memory-cognitive-load/docs/RESEARCH_BASIS.md` | Memory Quest design notes (prototype-era; the live lesson above is authoritative) |
| **DPT** | `materials/Dual Process Theory and Cognitive Biases/js/app.js` | Two Minds home page, theory, **the six IB concept definitions** |
| **DPT-n** | `materials/Dual Process Theory and Cognitive Biases/js/stations/0n-*.js` | Two Minds station files (n = 1 to 10) |

## Coverage at a glance

| Unit topic | Taught in the repo? | Where |
| --- | --- | --- |
| Six IB concepts | **Defined only in the Dual Process lesson**, and linked there per bias. Other lessons touch them implicitly, never by name. | DPT lines 469-476; DPT-n `concepts` |
| Classical conditioning | **Only as a contrast** to operant (one comparison table plus a six-card sort). | OC lines 154-168 |
| Operant conditioning | Yes, full lesson. | OC |
| Multi-store model | Yes, as a sequence of labs (sensory, STM, serial position). No explicit strengths/limitations list. | MoM |
| Working memory model | Yes, full lesson. | MQ, MQ-st |
| Cognitive load theory | Yes, the second half of the same lesson. | MQ chapters 9-14 |
| Levels of processing | Yes, one lab (Stage 4). No strengths/limitations list. | MoM lines 161-168 |
| Social learning theory and Bobo doll | **Not in any finished lesson.** | none |
| Schema theory, Bartlett, Bransford & Johnson | **Not in any finished lesson.** "Schema" appears only inside germane load and confirmation bias. | none |
| Dual process theory and cognitive biases | Yes, ten stations. **Possibly out of scope for this unit** (see its own section). | DPT, DPT-n |

---

## 1. The six IB concepts

### Definitions (as the lessons phrase them)

These definitions appear only in the Dual Process lesson (DPT lines 470-476). That lesson introduces them with: "IB Psychology is built around six concepts... Using them in an essay shows you can go beyond describing a study."

| Concept | Lesson definition |
| --- | --- |
| Bias | Systematic distortion, in how we think or in how research is done. |
| Causality | Can we conclude that one thing causes another? |
| Change | How thinking and behaviour change, and how knowledge changes. |
| Measurement | How we operationalise and measure things, and how valid that is. |
| Perspective | Other explanations, theories, cultures and viewpoints. |
| Responsibility | Ethics, and how findings should (and should not) be used. |

### Concept links in the other lessons

None of the other lessons names the six concepts. The links below are **implicit**: the lesson content clearly deals with the idea, but mapping it to a concept is my reading, not the lesson's label.

- **Measurement, in Memory Quest.** Chapter 13 is titled "Measuring the Invisible". Its teacher goal says "cognitive load can be measured by self-report, performance and physiology — none is perfect" (MQ line 438). There is a sort into Self-report / Performance / Physiological (MQ lines 447-457), and a key fact on "Why load is hard to measure" (MQ lines 458-460). Mani et al. is a write task, "How was cognitive load operationalised... what is one limitation" (MQ line 428). The spatial-span teacher note says "we cannot be sure which system a task really uses" is "a great measurement point" (MQ line 122). The central executive is unmeasurable on its own (MQ lines 270, 297-299).
- **Causality, in Memory Quest.** Landry & Bartling get "Clear cause and effect: only the suppression changed" (MQ-st line 33). Sana et al. get "Random allocation and a controlled lecture: strong cause and effect" (MQ-st line 95). For Mani et al., "Other things change after a harvest too" (MQ-st line 140). The mechanism is not the same as a decline over time: "testing the mechanism is not the same as proving a decline over time. For that you would need the same tests given to comparable groups, years apart" (MQ line 548).
- **Bias / perspective (WEIRD samples), in Memory Quest.** Sana et al. is "a WEIRD sample", and so is Sparrow et al. The Mani et al. farmers are "evidence from outside the usual WEIRD samples" (MQ-st lines 95, 115, 140).
- **Change (knowledge changes), in Memory Quest.** Sparrow et al. failed to replicate (Camerer et al., 2018): "Plausible is not the same as reliable" (MQ-st line 115). The episodic buffer was added to the model in 2000 (MQ line 244).
- **Responsibility, in Memory Quest.** Mani et al. is a walkthrough only because "financial stress cannot and should not be recreated in class" (MQ line 422). KF is "shown as a case file, not a game" (MQ line 144; MQ-d says "Do not turn it into a 'game' that trivializes acquired brain injury").
- **Operant conditioning.** The "Critical lens" room (OC lines 386-392) covers generalising from rats and pigeons to humans, reductionism ("What is lost if motivation is explained as only rewards and punishments?"), and grades that may reinforce one student but punish another. Part B asks for "a simple, ethical conditioning plan" (OC line 546). A rival explanation of superstition is Staddon & Simmelhag (1971) (OC line 347). The lucky-seat task asks for "one alternative explanation such as confirmation bias, selective memory, or social learning" (OC line 367).
- **Models of Memory.** This is a simulation, "not laboratory-grade measurements" (MoM line 87). "A browser is not a tachistoscope" (MoM line 188). Glanzer & Cunitz items were changed to nonsense syllables "because a classroom group brings very uneven familiarity and imagery to real words" (MoM line 186). Throughout: "One person is noisy evidence; the class pattern matters more" (MoM line 132).

---

## 2. Classical conditioning (only as a contrast to operant)

Source: OC lines 154-168 (Lock 02, "Sort the Loop").

- **Comparison table.** Classical conditioning is an "Association between stimuli — one predicts another", in the form **STIMULUS → RESPONSE**. Operant conditioning is an "Association between behavior and consequence", in the form **BEHAVIOR → CONSEQUENCE → FUTURE PROBABILITY**.
- **Diagnostic clue:** "ask what is being learned. If a *stimulus predicts another stimulus*, think classical. If a *consequence changes a behavior*, think operant."
- **Sort cards** (classical or operant):
  - Classical: "A bell predicts food arriving"; "A dog salivates before it even tastes anything"; "Two stimuli become linked automatically".
  - Operant: "A rat presses a lever and gets a pellet"; "A fine follows littering and future littering decreases"; "A behavior changes because of what follows it".
- **Quiz distractor:** "Behaviors are modified in response to associations with other stimuli" is the wrong answer to "What does operant conditioning argue?" (OC line 424). "Pavlov's Law of Conditioning" is a distractor for the principle operant conditioning is based on (OC line 432).
- There are **no** terms for UCS/UCR/CS/NS/CR, no extinction or spontaneous recovery, no Pavlov study details and no Little Albert.

---

## 3. Operant conditioning ("Escape the Loop")

Source: OC. A 70-minute self-paced escape room with nine locks (Lock 00 to Lock 08). Each lock reveals one digit of a vault code, and the lesson ends with a PDF uploaded to Elevfeedback.

### Key terms (lesson phrasing)

- **Operant conditioning (field note):** "consequences alter the future probability of behavior" (OC line 71).
- **Reinforcer:** "increases a behavior". The quiz answer is "makes the behavior it follows more likely to happen again", because "it's defined by its effect on future behavior, not by how it feels or who gives it" (OC lines 71, 89-91).
- **Punisher:** "decreases it" (OC line 71).
- **Positive / negative:** "Positive means something is added; negative means something is removed. These labels describe the contingency, not whether the outcome feels morally 'good' or 'bad.'" (OC line 71).
- **Quadrant matrix** (OC lines 279-283):

  |  | Behavior MORE likely | Behavior LESS likely |
  | --- | --- | --- |
  | ADD something | Positive reinforcement | Positive punishment |
  | REMOVE something | Negative reinforcement | Negative punishment |

- **Positive punishment:** "Presenting an aversive stimulus to discourage a behavior" (OC line 444, the quiz answer).
- **Shaping:** "Reinforcing successive approximations toward a target behavior." It builds a new behavior "first a rough step toward the target, then a closer one, and eventually only the target response itself". Caption: "the criterion moves as the learner gets closer to the target response" (OC lines 124-128).
- **Law of Effect (Thorndike, 1898, puzzle box).** Cloze sentence: "Thorndike's Law of Effect states that any behavior followed by a satisfying consequence will likely be repeated" (OC line 217). The pattern it describes: "Responses followed by satisfying outcomes became more likely to occur again in that situation." Caption: "escape latency fell across trials" (OC lines 194-198). The quiz says operant conditioning is based on "Thorndike's Law of Effect" (OC line 435).
- **ABC contingency:** Antecedent (cue) → Behavior → Consequence → change in future behavior (OC lines 238-239). Cloze example: "A teacher asks a question [A]; a student answers [B]; the teacher praises the answer [C]" (OC line 254).
- **Skinner box:** built "to observe and precisely control an animal's behavior and its consequences, with no outside interference". Feedback: "it let him isolate behavior and consequence cleanly and measure the effect over many trials" (OC lines 104-107).
- **Reinforcement schedules** (OC lines 303-306):
  - Fixed ratio (FR): "after a predictable number of responses".
  - Variable ratio (VR): "after an unpredictable number of responses".
  - Fixed interval (FI): "first response after a predictable time interval".
  - Variable interval (VI): "first response after an unpredictable time interval".
  - Sort examples: "Every 10th lever press earns a pellet" (FR); "A pellet follows after an unpredictable number of presses" (VR); "The first press after 30 seconds earns a pellet" (FI); "The first press after an unpredictable time earns a pellet" (VI) (OC lines 310-313).
- **Accidental reinforcement / superstition:** "if a pigeon happened to be walking in circles when the pellet arrived, that movement could be 'accidentally reinforced,' even though the food's delivery did not depend on its actions" (OC line 354).
- **Extinction** is used only in a prompt: "What would have to happen for the behavior to extinguish?" (OC line 361). It is not defined.

### Worked examples used (quadrant sort and quiz)

Source: OC lines 287-290, 450-453.

- **Positive reinforcement:** "Specific praise follows a strong answer, and strong answers increase".
- **Positive punishment:** "A fine follows littering, and littering decreases".
- **Negative reinforcement:** "Buzzer stops after buckling up, and buckling up increases". The quiz example is "Removing a buzzer sound when a seatbelt is buckled".
- **Negative punishment:** "Gaming access is removed after missed homework, and missed homework decreases". The quiz distractor is "Taking away recess time for bad behavior".
- **Coffee card:** "BUY 10 COFFEES → GET THE 11TH FREE → returning is reinforced" (OC line 203). A loyalty card giving a free drink after every 10 purchases is **fixed ratio** (OC lines 324-329, answer key `qmid:'d'` in OC-js line 325).

### Studies

**Thorndike (1898), puzzle box** (OC lines 190-200)
- Method: a cat in a puzzle box with a latch, and food outside.
- Result: "escape latency fell across trials".
- Conclusion: the Law of Effect.
- No aim, sample size or numbers are given.

**Skinner (1948), "superstition" in the pigeon** (OC lines 339-347)
- Method: "Food was presented automatically; at an effective setting Skinner used **15-second intervals**." Food "appeared independently of the pigeon's behavior".
- Results: "**Six of eight** pigeons developed distinctive repeated patterns."
- Conclusion: "Skinner interpreted this as accidental reinforcement." The quiz answer: "Superstitions arose when pigeons accidentally associated their behavior with receiving food" (OC line 470).
- Evaluation ("Critical lens"): "later work challenged the simple 'accidental reinforcement' interpretation. **Staddon & Simmelhag (1971)** argued that some repeated actions reflected time-linked, species-typical behavior rather than a mistaken causal association."

### Strengths and limitations of the theory (as taught)

Source: Lock 06 "Critical Lens", OC lines 386-392. These are prompts, not model answers.

- "A consequence only counts as reinforcement or punishment by its effect on that behavior — and behaviorist explanations still have limits."
- **Animal research:** "How confidently can we generalize from rats and pigeons to humans?"
- **Reductionism:** "What is lost if motivation is explained as only rewards and punishments?"
- **Grades:** "Can one consequence (a grade) reinforce one student but punish another?"
- A rival explanation for superstition: Staddon & Simmelhag (above). The lucky-seat task asks for "one alternative explanation such as confirmation bias, selective memory, or social learning" (OC line 367).
- The phone transfer task is careful not to overclaim: "Your phone is not literally a Skinner box"; "Real apps are more complex than either laboratory schedule"; "Use them as prompts for analysis, not as proof that a phone is literally a Skinner box" (OC lines 492-502).

### Exam-style item

Source: OC lines 394-403.
- Question: "Chris is highly disruptive in class. He talks a lot with his friends, often making it difficult for others to focus. **Explain how operant conditioning could be used to change Chris's behavior.**"
- "What an examiner looks for":
  - "Clear understanding of operant conditioning, with correct terminology".
  - "One worked example — e.g. positive reinforcement when Chris is attentive, or negative punishment such as moving his seat away from friends".
  - "An explanation of *why* that particular strategy would work".

### Misconceptions the lesson flags

- A reinforcer is not "anything that feels pleasant" or "given by a teacher as a reward" (OC lines 88-92).
- "Negative" does not mean unpleasant or undesirable. "This one trips almost everyone up at first" (OC lines 95-100). Also "POSITIVE ≠ good · NEGATIVE ≠ bad" (OC line 284).
- "Why is negative reinforcement *not* punishment?" is a watch-for question (OC line 244).
- "**Do not classify by intention.** Praise is not automatically reinforcement; detention is not automatically punishment. The label depends on what happens to the future behavior" (OC line 387).
- The Skinner box was not built "To punish animals until they learned a trick" (OC line 105).
- Schedules: "Ask whether the rule depends on time or on the number of responses, then whether that requirement is fixed or variable" (OC line 330).
- The escape room itself made the same point: its locks and sounds were "designed to function as reinforcers... Whether they actually reinforced your behavior is an empirical question" (OC line 576).

### Classroom activities to echo

- Nine locks, each revealing one vault-code digit. Wrong multiple-choice picks lock the question for 4 seconds. Questions and cards are shuffled per student (`materials/Operant Conditioning/README.md`).
- **Lock 00 Foundation:** three multiple-choice questions (reinforcer, "negative", why the Skinner box).
- **Lock 01 Shaping:** list three approximations for shaping a dog to close a drawer with its nose. Follow-ups: "Did the dog need to 'understand' the plan?" and "What happens if the reward stops?"
- **Lock 02:** the classical versus operant six-card sort.
- **Lock 03:** Law of Effect cloze, plus coffee-card Behavior / Consequence / Desired future behavior boxes.
- **Lock 04:** ABC cloze, then write your own A → B → C. Video: Sprouts, "Skinner's Operant Conditioning: Rewards & Punishments" (about 3 minutes).
- **Lock 05 Midway Vault:**
  - Quadrant sort.
  - Schedule sort, plus the loyalty-card multiple-choice question.
  - Superstition cloze.
  - "Lucky socks" and "lucky seat" explanations.
- **Lock 06:** Critical lens prompts plus the Chris exam item.
- **Lock 07:** six-question check. The answer key is in OC-js line 325.
  1. Operant conditioning argues that behaviours are modified in response to reward or punishment.
  2. It is based on Thorndike's Law of Effect.
  3. Positive punishment is presenting an aversive stimulus.
  4. Negative reinforcement: the seatbelt buzzer.
  5. Fixed ratio: a reward after every 10 responses.
  6. Superstition is accidental association.
- **Lock 08 Final Vault:**
  - Part A "Is your phone a Skinner box?": ABC plus classify it. Message checking resembles **variable interval**; refreshing or swiping resembles **variable ratio**.
  - Part B "Flip the script": design an ethical self-conditioning plan with evidence of success.

---

## 4. Multi-store model (Memory Lab)

Source: MoM. There are four labs, and each one "tests a claim that makes the model plausible—or exposes a complication" (MoM line 96).

### Key terms (lesson phrasing)

- **The MSM:** "Atkinson and Shiffrin describe memory as information moving through distinguishable stores" (MoM line 96).
- **Route:** Sensory → STM → LTM.
  - Sensory memory, "Stage 1 · fraction of a second".
  - Arrow labelled **attention**.
  - Short-term memory, "Stage 2 · seconds".
  - Arrow labelled **encoding / rehearsal**.
  - Long-term memory, "Stage 3 · durable storage" (MoM lines 99-103).
- **Retrieval:** "Retrieval moves stored information back into active use; the process is not simply one-way" (MoM line 105).
- **Iconic memory:** "a rich but rapidly fading" visual trace (MoM line 128).
- **Echoic memory:** "the auditory counterpart of iconic memory" (MoM line 133).
- **Whole report / partial report:** "**Whole report** asks for everything you can remember. **Partial report**... after the display has disappeared, a tone tells you which row to report" (MoM line 119).
- **STM:** "limited in both duration and capacity" (MoM line 140).
- **Chunking:** "changes what counts as an item". "Chunking can turn several symbols into one meaningful unit, so '7 ± 2 items' is not a simple count of characters" (MoM lines 142, 146).
- **Primacy:** "better recall for early items. In a multi-store interpretation, early items receive more opportunity for rehearsal and entry into long-term memory" (MoM line 153).
- **Recency:** "better recall for the final items, which may still be active in short-term memory when recall begins" (MoM line 153).
- **In Memory Quest:** "The multi-store model treated short-term memory as one simple store" (MQ line 84). "The MSM already separated STM and LTM" (MQ line 175).

### Studies

**Sperling (1960)** (MoM lines 113-132, 183)
- Aim/problem: "whether more information is briefly available than you can report before it fades".
- Method: a 3×3 letter grid, whole report versus partial report. The tone arrives after the display (high = top row, medium = middle, low = bottom).
- Numbers given: "Classic exposures were about 50 ms; cue delay rapidly reduces partial-report advantage." The lab default is 100 ms, and cue delays are 0/500/1000 ms.
- Logic: "If you can report almost any row when it is cued immediately, then information from the whole display must have been available for a very short time." A delayed tone should shrink the advantage "as the visual trace decays".
- Lab metric: "Partial-report 'estimated available' = row accuracy × 3. This illustrates Sperling's logic rather than providing a laboratory estimate" (MoM line 132).
- Supported claim (dashboard question): sensory memory is "high-capacity but extremely short-lived" rather than low-capacity (MoM line 175).
- No original results figures are given.

**Darwin, Turvey & Crowder (1972)**, optional extension (MoM lines 133, 184)
- "auditory partial report across spatial channels; superiority was present at short indicator delays and decayed over roughly 2–4 seconds depending on the experiment."
- The browser task uses the **suffix effect** instead: an irrelevant spoken "zero" after 7 digits "can interfere disproportionately with the final items". It is "not a reproduction" of the original.

**Miller (1956)** (MoM lines 142, 185)
- "magical number seven, plus or minus two", "a rough historical description of immediate-memory capacity".
- "should not be treated as a precise modern estimate of a universal STM capacity."
- Lab: an ordered digit span starting at 5 digits (7 trials), then chunking with an 8-digit Danish-style and a 10-digit Canadian-style phone number held for 10 seconds.

**Glanzer & Cunitz (1966)** (MoM lines 151-157, 186)
- Aim: "used a filled delay to ask whether the two ends [of a list] depend on different processes."
- Method: "the commonly reported Experiment 2 timing: **15 items**, each displayed for **1 second** with about **2 seconds** between items, then immediate or filled-delay recall." The on-screen arithmetic adapts "their counting distractor". The original lists were monosyllabic words; the lab uses nonsense syllables. The lab delay is **30 s**, and recall is free recall.
- Result / prediction: "a filled delay should remove the immediate advantage for the most recent items more than it removes primacy."
- Conclusion: "A filled delay weakens this advantage, which historically supported a distinction between short- and long-term stores" (MoM line 157).

### Strengths and limitations of the MSM (as taught)

There is no explicit list. The nearest material:
- **Supports:** "Immediate ordered recall becomes fragile as the amount of information increases. That is consistent with a capacity-limited short-term store" (MoM line 146). Serial position and filled delay support separate stores (MoM line 157).
- **Complicates:** "Capacity depends on how information is represented" (chunking, MoM line 146). "modern working-memory accounts are more complex than a single number" (MoM line 142).
- **Challenged by LOP:** "How does this challenge a simple 'rehearsal moves STM into LTM' account?" (MoM line 168).
- **Challenged by the WMM:** STM is "really a set of parts working together" (MQ line 84). "What is the key change the WMM made to the multi-store model? → Short-term memory is several components, not one store" (MQ lines 164-166).

### Dashboard questions (MoM line 175)

1. Does sensory memory appear low-capacity, or high-capacity but extremely short-lived?
2. What does chunking do to a simple numerical limit on short-term memory?
3. Why does removing recency with a filled delay support the idea of distinct memory processes?
4. How can depth of processing explain durable memory without treating rehearsal as the only route into long-term memory?

### Misconceptions flagged

- 7 ± 2 is "not... a fixed biological limit" (MoM line 142).
- Retrieval means memory is "not simply one-way" (MoM line 105).
- Individual results are noisy: "compare the class pattern rather than treating one person as decisive" (MoM sensory interpretation text).
- In Sperling, a vague fragment still counts: "A weak, fading impression is exactly what this task is trying to catch" (MoM line 119).

### Classroom activities to echo

- Sperling whole/partial report with tones.
- The echoic suffix task.
- Digit span.
- Phone-number chunking prediction: "decide whether the ten-digit number must necessarily be harder simply because it contains more digits".
- Two 15-syllable serial-position lists (immediate versus 30 s arithmetic delay), with a toggled graph.
- The evidence dashboard.

---

## 5. Levels of processing (Memory Lab, Stage 4)

Source: MoM lines 107, 161-168, 187.

### Key terms

- **LOP:** "Craik and Lockhart ask a different question: perhaps later memory depends less on passing through stores and more on **how deeply information is processed at encoding**" (MoM line 107). It shifts the question "from 'Where is the memory stored?' to 'What kind of processing happened when it was encoded?'" (MoM line 162).
- It is "**not a fourth memory store**", but "an **alternative way of explaining later memory**. Instead of assuming that rehearsal moves information from short-term to long-term storage, the approach proposes that deeper, more meaningful processing creates a more durable memory trace" (MoM line 164).
- **Levels table:**

  | Level | Typical question | Processing |
  | --- | --- | --- |
  | Structural | "Is the word in capital letters?" | Appearance |
  | Phonological | "Does the word rhyme with ___?" | Sound |
  | Semantic | "Is the word a type of ___?" | Meaning |

- **Incidental learning:** "The surprise recognition phase is intentional: it separates incidental encoding from deliberate memorization."

### Study: Craik & Tulving (1975)

Source: MoM lines 164, 168, 187.
- Method: "Craik and Tulving operationalized depth with different orienting questions." There were "structural/phonemic/semantic orienting questions followed by an unexpected memory test."
- Prediction: "words processed semantically should later be recognized more often than words processed only by appearance."
- The classroom version is "shortened" and "inspired by Craik & Tulving's incidental-learning procedure". It uses yes/no orienting questions, then old/new recognition, with six targets per depth.
- Interpretation text: "memory improved as encoding moved from appearance toward sound and meaning." For noisy data: "With six targets per depth, a few items can move the percentages a lot; class data are more informative."
- **No original participant numbers or results are given.**

### Strengths and limitations

**None are listed explicitly.** The lesson positions LOP only as a challenge to the MSM.

### Activities to echo

Orienting questions with YES/NO buttons, then a surprise OLD/NEW recognition test, then hit rates by level. Example items include SALMON ("Is the word a type of fish?"), HAMMER, CARROT, LAMP ("Is the word an animal?", no) and PIANO ("a type of fruit?", no).

---

## 6. Working memory model (Memory Quest)

Source: MQ, MQ-st, MQ-g. This is a story-driven, self-paced lesson, about 110 minutes core. Characters stand for the components: Orin is the phonological loop, Nova the visuospatial sketchpad, Cael the central executive, Selene the mentor.

### Key terms (lesson phrasing)

- **Working memory:** "a mental workspace. It holds information for a few seconds while you use it — and it has a limited capacity" (MQ line 83).
- **The model:** "Baddeley & Hitch (1974) argued [STM] is really a set of parts working together" (MQ line 84). The episodic buffer was added by Baddeley (2000) (MQ-st line 260).
- **Central executive:** "the boss of working memory. It directs attention, blocks out distractions, switches between tasks and sends information to the right part of the system. It has limited capacity and handles any kind of information." The video's "executive function" is "roughly this" (MQ lines 200-201; MQ-st line 242).
- **Phonological loop:** "holds sounds and words. Its 'inner voice' (articulatory control process) rehearses them; its 'inner ear' (phonological store) holds them for about 2 seconds unless they are rehearsed" (MQ line 108).
- **Articulatory suppression:** "repeating '1, 2' — keeps the inner voice busy, so the letters cannot be rehearsed and fade" (MQ line 109).
- **Visuospatial sketchpad:** "the 'inner eye'. It holds what things look like and where they are — shapes, locations, routes and movement" (MQ line 130). MQ-st adds colours.
- **Episodic buffer:** "added by Baddeley in 2000. It combines sounds, images and long-term knowledge into a single 'episode' you are aware of... It has limited capacity too — and it is hard to test on its own" (MQ lines 244-245).
- **Long-term memory:** "Not part of working memory itself, but all components exchange information with it" (MQ-st line 254).
- **Switch cost:** "Switching attention between tasks is a central executive job. It is possible — but each switch costs time and accuracy" (MQ line 224).
- **Dual-task logic:** "If two tasks clash, they probably use the **same** component. If they coexist, they probably use **different** ones" (MQ-st line 52).
- **Recap summary** (MQ line 554): "Central executive (attention boss), phonological loop (inner voice + inner ear), visuospatial sketchpad (inner eye), episodic buffer (combines everything into one episode)."

### Studies

**Baddeley & Hitch (1974), dual-task technique** (MQ-st lines 37-53)
- Problem: "The multi-store model said short-term memory was a single store. If so, filling it with one task should wreck performance on any other task."
- Method: "Participants held a string of digits in mind **while** doing a reasoning task", compared with doing each task alone.
- Findings: "A few digits barely affected the reasoning task. Heavy loads slowed it — but it did not collapse. Later studies found that two **similar** tasks (two verbal, or two visual) interfere much more than two **different** tasks."
- Conclusion: "Short-term memory has several parts."
- No participant numbers are given.

**Landry & Bartling (2011)**, a laboratory experiment (MQ-st lines 14-34; MQ lines 282-293)
- Aim: "To test whether **articulatory suppression** reduces recall of letter lists that sound different from each other."
- Participants: "**34 psychology undergraduates**". Independent samples design, **17 control / 17 suppression**.
- Materials: letters **F, K, L, M, R, X and Q**, "chosen because they do not rhyme". Also: "They sound different and contain no vowels, so they are hard to chunk or confuse."
- Procedure:
  - A list of **7 letters** was shown for **5 seconds**, followed by a **5-second** wait, then written recall in order.
  - The suppression group said **"1, 2" twice a second** from seeing the list until they finished writing.
  - **Ten lists** each.
- Results: mean correct recall **76%** (control) versus **45%** (suppression). **SD = 0.13 and 0.14**. A t-test gave **p ≤ 0.01**.
- Conclusion: "Saying '1, 2' occupied the articulatory control process, so the letters could not be rehearsed and faded from the phonological store. This supports the WMM."
- Evaluation:
  - Plus: "Standardised procedure: easy to replicate".
  - Plus: "Clear cause and effect: only the suppression changed".
  - Minus: "Independent samples: the groups may have differed in memory ability".
  - Minus: "Letter lists are artificial — low ecological validity".
  - Minus: "Small sample of students from one university".
- Research-methods quiz points (Surge II):
  - Independent samples means "No order effects, because nobody does both conditions".
  - Similar SDs mean "Scores were spread out by a similar amount in both groups".
  - p ≤ 0.01 means "a 1% chance or less that a difference this big happened by chance alone... The null hypothesis can be rejected. Significance never means 'proven'."

**Warrington & Shallice (1969–1974), patient KF**, a case study (MQ-st lines 56-74)
- Background: "A brain injury after a motorcycle accident". LTM was "largely intact — he could still learn new things"; STM was "badly affected".
- Findings: "KF quickly forgot letters and numbers that were **read aloud** to him — but remembered them much better when he **saw** them written down." Later testing showed "he could still recall **meaningful sounds** like a phone ringing or a cat meowing. The damage was specific to **verbal** auditory information."
- Conclusion: "verbal and visual short-term memory are separate — the phonological loop and visuospatial sketchpad."
- Evaluation:
  - Plus: "Rich, detailed data followed over several years".
  - Plus: "Shows what cannot be tested ethically in healthy people".
  - Minus: "One person — we cannot be sure every brain is organised like this".
  - Minus: "We do not know exactly what KF's memory was like before the accident".
- Exam tip: "KF works as evidence for the model AND as an example of a biological factor in a cognitive process" (MQ line 156).

### Strengths and limitations of the WMM (the lesson's sort, MQ lines 262-274)

**Strengths**
- "Dual-task experiments show two tasks clash most when they use the same component."
- "Case studies like KF show one store can be damaged while another works."
- "It explains why we can sometimes multitask and sometimes cannot."
- "Brain scans often show different areas active for verbal and visual tasks."

**Limitations**
- "Nobody can measure the central executive's capacity separately from the other parts."
- "It is unclear how the four components actually work together."
- "It says little about long-term memory, emotion or why memories get distorted."
- "Brain imaging results do not always show the same areas for each component."

**Also stated**
- "Every task that uses the central executive also uses a slave system, so its own capacity is never isolated" (MQ line 299).
- "Which of these is NOT a limitation? → There is no biological evidence for it", because "KF and brain imaging DO give biological support" (MQ lines 294-296).

### Misconceptions flagged

- The central executive is **not** a permanent store (MQ lines 167-169).
- KF supports the WMM "in particular" because "one STM component was damaged while another worked". It does **not** matter because it separates STM and LTM, which "the MSM already" did (MQ lines 173-175).
- "The question is not 'Can we multitask?' It is 'What is competing?'" (MQ line 141).
- Cross-channel multitasking is "not... cost-free" (MQ-d, dual-task section).
- Digit span "is not a score of how clever you are" (MQ line 72).
- In the spatial task, students may secretly name squares in words, "borrowing the phonological loop" (MQ-g line 369).
- Individual results are noisy: compare the class.

### Classroom activities to echo

- **Memory Span Gate:** digit span. "Most people manage somewhere between 5 and 8."
- **Echo Chamber:** a Landry & Bartling replication, quiet versus chanting "1, 2", shown against the study's 76%/45% bars.
- **Map of Shards:** Corsi-style spatial span.
- **Twin Paths:** remember a 5-tile route while chanting (different systems) or tapping (same system).
- **Gate of Focus:** Stroop. "Mismatched trials are usually 100–300 ms slower."
- **Switchyard:** task switching.
- **Story Loom:** seen plus heard facts combined (episodic buffer).
- **Interactive WMM diagram:** tap all five parts.
- **Strength/limitation sort.**
- **Static Surge I and II:** timed multiple-choice, 25-30 s per question.

---

## 7. Cognitive load theory (Memory Quest, chapters 9-14)

### Key terms (lesson phrasing)

- **Cognitive load:** "the total demand placed on working memory. Because working memory is limited, when the demand is greater than its capacity we get overload — and learning and recall suffer" (MQ line 320).
- **Cognitive misers:** "Fiske & Taylor (1991) called us 'cognitive misers': we save mental effort wherever we can, because there is only so much to spend" (MQ line 321).
- **CLT assumption:** working memory "has a limited capacity" (MQ line 482).
- **Intrinsic load:** "how hard the task itself is — how many pieces you must hold and combine at once. Calculus has more intrinsic load than simple arithmetic. You cannot remove it, but you can break it into smaller steps" (MQ lines 343-344).
- **Extraneous load:** "comes from things that have nothing to do with the task: pop-ups, noise, messy design, or worrying about something else... It is the load that teachers, and you, can most easily remove" (MQ lines 347-348). The timed Surge clock "added nothing to the questions, only pressure. That was extraneous load."
- **Germane load:** "the effort of actually understanding: building a pattern (a schema) you can reuse. Once you have one, new information is easier to process." In exam answers: "germane load is lower when previous learning helps you process new information" (MQ lines 351-352).
- **Transactive memory / Google effect:** "a modern form of transactive memory: remembering WHERE information is instead of the information itself" (MQ line 398). This is also "Cognitive offloading" (MQ-st line 112).
- **Strategies to improve memory** (MQ lines 529-530):
  - "Dual coding: learn with words AND pictures, so the loop and the sketchpad share the work."
  - "Chunking: group items so they take fewer slots."
  - "Cut extraneous load: phone out of the room, one task at a time."
  - "Worked examples lower intrinsic load for beginners and help build schemas."
  - "Paivio's dual coding theory fits the WMM."
- **Why load is hard to measure:** "Load differs from person to person and task to task. It involves attention, memory and speed together. Noise and stress muddy the picture. And every method captures only part of it. Self-report can be biased; performance can drop for other reasons; physiology shows arousal, not 'load' itself" (MQ lines 459-460).

### Studies

**Sana, Weston & Cepeda (2013)**, laboratory experiments (MQ-st lines 77-96)
- Experiment 1: "**44 university students** listened to a lecture on meteorology and took notes on laptops. Half were also given small online tasks." Multitaskers scored "about **11% lower**" on comprehension.
- Experiment 2: "**nobody** multitasked themselves". Some sat where they could see others' laptops (actors). They scored "about **17% lower**".
- Evaluation:
  - Plus: "Random allocation and a controlled lecture: strong cause and effect".
  - Plus: "Clear real-world use: laptop rules in classrooms".
  - Minus: "Cognitive load was assumed, not measured directly".
  - Minus: "One short lecture — real lessons, motivation and grades differ".
  - Minus: "Undergraduates at one Canadian university: a WEIRD sample".

**Sparrow, Liu & Wegner (2011)**, a laboratory experiment (MQ-st lines 99-116). This is an optional chapter.
- Method: participants typed **40 trivia facts**. It was a **2 × 2 independent samples design**: told the computer would save or erase the facts, crossed with told or not told to try to remember them.
- Results: the "erased" group recalled more than the "saved" group. Being told to remember "made little difference".
- Conclusion: "Cognitive offloading... the **Google effect**". "Effort" was never measured directly.
- Evaluation:
  - Plus: two IVs with random allocation.
  - Minus: trivia gives low ecological validity.
  - Minus: Harvard undergraduates, a WEIRD sample.
  - Minus: "A large replication project (**Camerer et al., 2018**) did not find the effect again."
- Quiz: participants guessing the aim is called "Demand characteristics" (MQ line 405).

**Mani, Mullainathan, Shafir & Zhao (2013)**, a lab experiment plus a natural experiment (MQ-st lines 119-141)
- Aim: "To test whether thinking about financial problems takes up mental capacity — leaving less for other tasks."
- **Study 1 (lab):**
  - Shoppers with lower or higher incomes read a car-repair scenario, with a bill of about **$150** or about **$1,500**, then did **Raven's Progressive Matrices**.
  - Easy scenario: both groups about the same.
  - Hard scenario: lower-income participants scored clearly worse; the higher-income group did not.
- **Study 2 (field):**
  - **464 sugarcane farmers**, **54 villages in Tamil Nadu**, India. The same people were tested before and after harvest, "a natural experiment", with Raven's and a Stroop test.
  - After harvest: Raven's **5.45 vs 4.35**, Stroop **131 s vs 146 s**, errors **5.16 vs 5.93**.
- Conclusion: "Poverty is a load, not a lack of ability... Worrying about money uses up working memory."
- Evaluation:
  - Plus: field study, high ecological validity.
  - Plus: same farmers compared with themselves.
  - Plus: a non-WEIRD sample.
  - Minus: the lab car and bill were imaginary.
  - Minus: "Load was **inferred** (from income or season), never measured directly".
  - Minus: "Other things change after a harvest too: diet, sleep, workload, and practice on the tests".
- Quiz: it is a natural experiment because "The IV (before vs after harvest) happens naturally; researchers did not manipulate it" (MQ line 497).

**Modi et al. (2019)**, a laboratory experiment with brain imaging (MQ-st lines 144-162)
- Method: **33 trainee surgeons** did simulated keyhole surgery wearing an **fNIRS** cap. Demands were added step by step: time pressure, alarms, instructions.
- Results: "As load rose, performance fell and activity in the **prefrontal cortex decreased**... may show the surgeon **disengaging**."
- Evaluation:
  - Plus: objective.
  - Plus: could one day warn surgeons in real time.
  - Minus: a simulator.
  - Minus: "Blood oxygen is not 'cognitive load' itself — it has to be interpreted".
  - Minus: cannot yet be read live.

### Strengths and limitations of CLT (as taught)

There is no explicit strength/limitation list for CLT itself. The evaluation content sits in the study evaluations above and the measurement key fact. MQ-d notes the three-type taxonomy "is therefore kept even though later cognitive-load literature has refined how germane load is conceptualized".

### Exam-style items (Epilogue, MQ lines 563-581)

- **Scenario:** "Freja is revising cell division, a topic she has never studied. Her tablet plays a video lesson while her phone buzzes with a group chat about the weekend. After two hours she remembers very little. **Explain the role of cognitive load in Freja's revision.**"
- **Three sample answers to judge:**
  - **A:** "cognitive load is when you use too much technology". The biggest problem is that "It defines cognitive load wrongly, as 'technology', not as demand on working memory."
  - **B:** accurate, but uses only extraneous load. It is improved most by "Applying intrinsic load too: the topic is new to Freja."
  - **C** is the top band: it "defines the theory accurately AND applies every relevant type of load to details in the scenario. That application is what lifts it to the top band."
- **Written task:** "Using cognitive load theory, explain two changes Freja could make to remember more from her revision" (100-150 words). The hint: "Start with a one-sentence definition. Then take each change... and say WHICH type of load it changes and WHY that helps her working memory."
- **Recap checklist** of eight can-do statements with model answers (MQ lines 553-561). This is a ready-made review list.

### Misconceptions flagged

- "Internal load" is not one of the three types (MQ line 486).
- Worry during a test is **extraneous**, not intrinsic (MQ line 489).
- "So 'just focus harder' is sometimes poor advice. Sometimes the room is the problem" (MQ line 353).
- "The goal is not zero effort. The goal is useful effort" (MQ line 354).
- Broken versus overloaded: "A system can work perfectly and still fail if we ask too much of it" (MQ line 310).
- "Finishing the messages is not the same as learning the lesson" (MQ-g line 874).
- Brain scans do not "measure load directly" (MQ line 503).

### Activities to echo

- **Three Load Chambers,** each with a 1-9 effort rating:
  - Intrinsic: harder sums, same layout.
  - Extraneous: the same search in a clean versus noisy room.
  - Germane: crack one cipher, then a second, easier because a schema has formed.
- **Distracted Lecture:** a Sana-style random allocation to a Focus or Multitask group. Read "Signal Towers" for 50 s (the multitask group gets pop-ups), then a 5-question quiz.
- **Measure sort:** Self-report / Performance / Physiological.
- **Static Surge III:** 8 timed questions.
- **"Overload Engine" final scenarios** (MQ-g lines 882-890). Each names the component or load:
  - Sam repeats a number while names are read: both use the phonological loop.
  - Aisha drives and chats: different components, so they clash less.
  - The Stroop reader: the central executive failing to block an automatic response.
  - A cluttered revision sheet: extraneous load.
  - Chemistry equations in silence: intrinsic load.
  - Worked examples: a schema formed (germane).
  - Farmers: extraneous (money worries).
  - Best exam prep: "Phone in another room, quiet space, past-paper practice".
- **Hook and end poll:** "Is our ability to focus and hold things in mind getting worse?"

---

## 8. Social learning theory and Bandura's Bobo doll

**Not found in any finished lesson.** No mention of Bandura, Bobo, modelling, vicarious reinforcement, observational learning or attention/retention/reproduction/motivation. The only trace is Escape the Loop listing "social learning" as a possible alternative explanation for a "lucky seat" (OC line 367). See Gaps.

## 9. Schema theory: Bartlett (War of the Ghosts) and Bransford & Johnson

**Not found in any finished lesson.** "Schema" appears only as:
- The product of germane load: "building a pattern (a schema) you can reuse" (MQ line 351). Also "Effort spent understanding built a schema in long-term memory, freeing working memory" (MQ-g line 888) and "she has no schema to build on" (MQ line 567).
- A reason for confirmation bias: "Information that fits our existing schemas is easy to process. Information that challenges them means rethinking" (DPT-4).

No Bartlett, no War of the Ghosts, no reconstructive memory, no Bransford & Johnson. See Gaps.

---

## 10. Dual process theory and cognitive biases ("Two Minds"): POSSIBLY OUT OF SCOPE

Flagged separately because the unit list did not include it. It is a ten-station Learn/Teach rotation, about 75 minutes, in groups of 2-3. The lesson itself marks **Anchoring (station 3)** and **Confirmation bias (station 4)** as "IB-required" (DPT lines 177, 205). It is also the only place the six concepts are defined (section 1), so a review game may want to borrow the concept definitions even if the biases are out of scope.

### Theory (DPT lines 136-155)

- **Dual process theory:** "says that thinking and decision-making run on two systems."
- The brain "acts as a **cognitive miser**: a fast, automatic system handles most things, and slow, careful reasoning is brought in only when it has to be."
- **System 1:** "Automatic, quick, needs almost no effort; Runs on **heuristics**, mental rules of thumb; Driven by context and the evidence in front of it; ignores what's missing; Gives gut feelings and a strong sense of certainty; Takes over when cognitive load is high or time is short."
- **System 2:** "Conscious, slow, takes effort; Works through possibilities one by one; Can think abstractly and apply a rule to a new situation; More logical and reliable, but feels less certain; Needs time, motivation and spare mental capacity."
- **Chain:** System 1 answers first → it feels right → System 2 doesn't check → cognitive bias ("a systematic error"). "A bias is **systematic**: most people make the same error in the same direction."
- **Warm-up sort (S1 or S2),** DPT lines 67-76:
  - System 1: reading a shop sign; hearing that a friend is upset; "salt and …"; flinching at a ball.
  - System 2: 17 × 24; comparing phone contracts; checking an essay's logic; counting the letter "e".

### Stations, definitions and key studies (DPT-n, "Name the bias" and "The evidence" steps)

| # | Bias (lesson definition, trimmed) | Key studies with the lesson's numbers |
| --- | --- | --- |
| 1 | **Matching bias:** "choose options because they match the words or features mentioned in a problem, not because logic says they're relevant." | **Wason (1968):** under 10% correct on the four-card task. **Griggs & Cox (1982):** about 75% correct on the drinking-age version. **Goel et al. (2000):** fMRI, abstract problems → parietal, concrete → left temporal. |
| 2 | **Intuitive error:** "System 1 gives a quick answer that feels right and System 2 fails to check it." The opposite skill is "cognitive reflection". | **Frederick (2005):** CRT, about 3,400 participants. Over 50% at Harvard/MIT/Princeton answered 10p; over 80% at less selective universities. **Alter et al. (2007):** 40 Princeton students; clear font 90% made at least one error versus 35% with a disfluent font. Did not replicate in **Meyer et al. (2015)** (over 7,000 participants). |
| 3 | **Anchoring bias:** "rely too heavily on the first piece of information we receive (the anchor)... adjust away from the anchor, but not far enough, even when the anchor is random." | **Tversky & Kahneman (1974):** 5 s estimate, median 512 (ascending) versus 2,250 (descending); true answer 40,320. **Strack & Mussweiler (1997):** Gandhi, mean 50.1 (anchor 9) versus 66.7 (anchor 140); he died at 78. **Englich, Mussweiler & Strack (2006):** legal professionals, loaded dice 3 or 9 → about 5 versus 8 months' sentence. **Debate:** Many Labs 1 (Klein et al., 2014, 36 samples, over 6,000 participants) versus Maniadis, Tufano & List (2014). |
| 4 | **Confirmation bias:** "search for, interpret, favour and remember information in a way that supports what we already believe." Three processes: selective exposure, selective perception (interpretation), selective retention (memory). | **Wason (1960):** 2-4-6 task, 6 of 29 (about 21%) correct first time. **Lord, Ross & Lepper (1979):** 48 Stanford undergraduates for/against capital punishment read two made-up studies; each rated the supporting study better, and both became more extreme (attitude polarisation). **Debate:** Miller et al. (1993) and Guess & Coppock (2020). **Nuance:** Klayman & Ha (1987). |
| 5 | **Framing effect:** "different decisions about the same information depending on how it is presented." | **Tversky & Kahneman (1981):** disease problem, "saved" 72% chose the certain option versus "die" 22% (78% gambled). **McNeil et al. (1982):** radiation chosen by 18% (survival frame) versus 44% (death frame). **Levin & Gaeth (1988):** "75% lean" versus "25% fat". |
| 6 | **Availability heuristic:** "judge how frequent or likely something is by how easily examples come to mind." | **Tversky & Kahneman (1973):** K, L, N, R, V; about two-thirds judged the first position more likely. **Lichtenstein et al. (1978):** dramatic causes of death overestimated. **Schwarz et al. (1991):** recalling 6 versus 12 assertive examples; the 6 group rated themselves more assertive. |
| 7 | **Representativeness heuristic:** judging likelihood "by how much it resembles a typical example or stereotype". **Conjunction fallacy:** judging A and B more probable than A. | **Tversky & Kahneman (1983):** Linda, about 85% commit the fallacy. **Fiedler (1988); Hertwig & Gigerenzer (1999):** the frequency format drops it from about 80-90% to about 20% or less. |
| 8 | **Base-rate neglect:** "Ignoring or underweighting general information about how common something is... when you are given specific information." | **Kahneman & Tversky (1973):** engineers/lawyers (30/70 versus 70/30), "Jack". **Tversky & Kahneman (1980, 1982):** taxi problem, median answer 80% versus the correct 41%. |
| 9 | **Belief bias:** "judge how logically strong an argument is by how believable its conclusion is." | **Evans, Barston & Pollard (1983):** accepted as valid: valid-believable 89%, valid-unbelievable 56%, invalid-believable 71%, invalid-unbelievable 10%. **Evans & Curtis-Holmes (2005):** about 10 s time limit → more belief-based answers. **Goel & Dolan (2003):** fMRI, right lateral PFC (logic) versus vmPFC (belief). |
| 10 | **Illusory correlation:** "Perceiving a relationship between two variables... when none exists, or seeing a relationship as stronger than it really is." | **Hamilton & Gifford (1976):** Group A 26 statements, Group B 13, same ratio (18:8, 9:4); B rated worse, and study 2 reversed the effect. **Chapman & Chapman (1967, 1969):** expectation-based. |

### Concept links per station (DPT-n `concepts`, summarised)

- **Anchoring (3):**
  - Causality: "a true experiment... random" allocation; real house prices cannot be randomised.
  - Measurement: group medians, not individual reports; low ecological validity.
  - Responsibility: courts (Englich) and "was £200, now £99" consumer law.
  - Perspective: insufficient adjustment versus Strack & Mussweiler's "selective accessibility"; mostly Western students.
- **Confirmation (4):**
  - Measurement: self-reported attitude change versus before/after measures; the 2-4-6 task measures behaviour.
  - Bias: researchers are also affected, hence falsification.
  - Responsibility: Lord et al. used deception, so debrief; social media algorithms.
  - Perspective: cognitive (miser), motivational (self-esteem), sociocultural (group identity), and Klayman & Ha.
- **Other stations** follow the same pattern. Recurring themes:
  - fMRI is correlational (Causality).
  - Frequency formats change results (Measurement, Change).
  - Replication failures change knowledge (Change).
  - Gigerenzer's alternative perspective (Perspective).
  - Duty to present risks clearly (Responsibility).
  - The illusory correlation behind stereotypes (Bias, Responsibility).

### Exam format info found (the only explicit Paper 1 mentions in the repo)

- **DPT-3 "Exam focus":** "a Paper 1 Section A question might ask you to 'Explain anchoring bias with reference to one example.'" Three moves: Describe, Example, Explain why (System 1, cognitive miser, insufficient adjustment). "Common mistake: describing the study in detail but never explaining why the bias happened."
- **DPT-4:** the same three-move template for "Explain confirmation bias with reference to one example."
- **Evaluation of anchoring (DPT-3 "Critical thinking"):**
  - Strengths: "one of the most replicated effects"; random assignment; Englich shows experts are affected.
  - Limitations: the anchor cannot be isolated in real life; people cannot report their heuristics (rationalisation); mostly Western students; low motivation.
- **"How to judge any disagreement" (DPT line 505):** "compare the sample sizes and who was sampled; check how each study measured the behaviour; ask whether one result is a single study and the other a large replication or meta-analysis; watch for publication bias...; and ask whether both could be right under different conditions."

### Activities to echo

Learn/Teach modes, the S1/S2 warm-up, randomised-condition experiments at each station, "Evidence A versus Evidence B" debates with a trust vote, and a head-to-head host-versus-guest quiz.

---

## Cross-lesson exam and format information

- **Paper 1 is named explicitly only in the Dual Process lesson** ("Paper 1 Section A... 'Explain X with reference to one example'", DPT-3, DPT-4).
- **Operant:** an "Exam-style: apply it" item with examiner criteria (terminology, one worked example, explain why) (OC lines 394-403).
- **Memory Quest:**
  - An examiner-marking task with three sample answers, where the top band needs an accurate definition plus application to scenario details (MQ lines 563-577). It also has an application write-up.
  - "Examiners ask about methods as often as findings" (MQ line 279).
  - The Mani et al. operationalisation task is "exactly the kind of evaluation examiners look for" (MQ line 427).
  - The KF "exam tip" (MQ line 156).
- **Research-methods vocabulary** used across lessons: independent samples, order effects, standard deviation, p-value / null hypothesis, natural experiment, random allocation, demand characteristics, ecological validity, WEIRD sample, operationalisation, self-report / performance / physiological measures, replication, meta-analysis, publication bias, between-subjects design, correlational fMRI.

---

## Gaps and concerns

### Missing unit content (nothing in the repo to draw on)

1. **Social learning theory and Bandura's Bobo doll study:** entirely absent. The review game would need new content, which must be checked at the Examiner stage.
2. **Schema theory, Bartlett (War of the Ghosts) and Bransford & Johnson:** entirely absent. "Schema" is used, but never defined as a theory.
3. **Classical conditioning:** only a contrast table and a six-card sort. There is no terminology (UCS/UCR/NS/CS/CR, acquisition, extinction, spontaneous recovery, generalisation) and no Pavlov or Watson & Rayner detail.
4. **The six IB concepts:** defined only in the Dual Process lesson. The memory and conditioning lessons never label them, so any concept-linking in the review game for MSM, WMM, LOP and operant would be new. The implicit links in section 1 are my mapping.
5. **MSM evaluation:** no explicit strengths/limitations list. There are no duration studies (for example Peterson & Peterson), no case of HM, and no original numeric results for Sperling, Miller or Glanzer & Cunitz. The lesson gives only the procedure and the expected pattern.
6. **LOP evaluation:** no strengths/limitations. There are no Craik & Tulving results or sample details, and no year for Craik & Lockhart.
7. **Cognitive load theory origin:** the lesson never names who proposed CLT or gives a year. It cites only Fiske & Taylor for "cognitive miser".
8. **Operant conditioning:** Skinner's rat studies are described only generally ("to observe and precisely control"). No sample sizes or data are given, and no named application study (for example token economies). Extinction is not defined. There is no single study with a full aim/method/results/conclusion.
9. **Paper 1 format for the 2027 guide:** the only explicit exam-format statement is "Paper 1 Section A... Explain X with reference to one example" in the Dual Process lesson. Check this against the 2027 assessment structure before the review game repeats it. I have not verified it against the guide, and this label may reflect the previous syllabus.

### Possible accuracy points to check at the Examiner stage (not errors I have confirmed)

- **"Fiske & Taylor (1991)"** for "cognitive misers" (MQ line 321). The term is often dated to the first edition of their book. Check which year the course uses.
- **KF's dates**, given as "Warrington & Shallice (1969–1974)" (MQ-st line 58). Confirm the citation the course expects.
- **The Mani et al. farmer figures** (Raven's 5.45 vs 4.35; Stroop 131 s vs 146 s; errors 5.16 vs 5.93; 464 farmers; 54 villages) and **Modi et al.'s 33 trainee surgeons** are precise numbers worth checking against the papers before the game quizzes on them.
- **Landry & Bartling:** the lesson says both "chosen because they do not rhyme" (MQ-st) and "contain no vowels, so they are hard to chunk" (MQ Surge II). These are consistent, but it is worth confirming that the second rationale is from the paper and not an inference.
- **Glanzer & Cunitz:** the lab's 30 s arithmetic delay is an adaptation (the lesson says so). A review question should use the lesson's own phrasing about "filled delay" rather than assert the original task was arithmetic.
- **Dual Process station 2** reports Alter et al.'s headline result alongside its failed replication. A review game should not quiz the 90%/35% figure as settled fact.

### Other notes

- `design/working-memory-cognitive-load/docs/` holds the ChatGPT-era production pack. Where it differs from the live lesson (chapter numbering, for example), the live `data/lesson-data.js` is authoritative. RESEARCH_BASIS.md is useful for its "classroom fidelity" framing: informal replication versus demonstration.
- The unit's memory content is split across two lessons (Memory Lab for MSM and LOP, Memory Quest for WMM and CLT). The lesson tracker notes "MSM comparison not covered" in Memory Quest (`docs/lessons.md`). A review game could usefully bridge the two.
