/* Odyssey: The Long Way Home. Paper 1 practice content (Unit 1: Learning and Cognition).
   IB Psychology, guide first assessed 2027. All prose is original; study facts only are reused.
   Sections A and B use approach-table content only. Memory as a cognitive process and
   strategies to improve memory appear in Section C only. */
window.ODY = window.ODY || {};
window.ODY.exam = {

  format: {
    minutes: 90,
    marks: 35,
    sections: [
      { id: "A", title: "Section A: Short answers", questions: 2, marks: 4, minutes: 20,
        what: "Two compulsory questions, 4 marks each, about 10 minutes each. Describe or explain one content point (for example operant conditioning or dual process theory) and give one example, either a study or an everyday case. Write two paragraphs: the theory first, then the example and how it links back. Only your first example is marked." },
      { id: "B", title: "Section B: Theory meets scenario", questions: 2, marks: 6, minutes: 30,
        what: "Two compulsory questions, 6 marks each, about 15 minutes each. You read an unseen scenario and explain how a theory could explain or change what happens in it. Open with a short, accurate explanation of the theory, then make two or three developed links to details in the scenario. Do not evaluate." },
      { id: "C", title: "Section C: Concept essay", questions: 1, of: 2, marks: 15, minutes: 40,
        what: "Choose one of two questions, 15 marks, about 40 minutes. Each question pairs one of the six concepts (bias, causality, change, measurement, perspective, responsibility) with an area of study. Most use 'discuss'. The concept must drive every paragraph, links must run throughout, and the conclusion must follow from your argument." }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* SECTION A: 4 marks. Two strands: content point + one linked example */
  /* ------------------------------------------------------------------ */
  A: [
    {
      id: "A1", topic: "operant", cmd: "explain",
      q: "Explain operant conditioning with reference to one example. [4]",
      strands: ["Explains the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "Defines operant conditioning as learning in which consequences change how likely a behaviour is to happen again",
        "Names Thorndike's Law of Effect as the basis, which Skinner extended",
        "Uses reinforcement (behaviour increases) and punishment (behaviour decreases) correctly",
        "Explains that positive means something is added and negative means something is removed",
        "Gives one example only and names the exact consequence type it shows",
        "Says why the behaviour changes in the example, not just what happens"
      ],
      model: "Operant conditioning is learning in which the consequences of a behaviour change how likely it is to be repeated. It is based on Thorndike's Law of Effect: behaviour followed by a satisfying consequence tends to be repeated, and behaviour followed by an unpleasant one tends to stop. Skinner described four types of consequence. Reinforcement makes a behaviour more likely, either by adding something pleasant (positive reinforcement) or by removing something unpleasant (negative reinforcement). Punishment makes a behaviour less likely, either by adding something unpleasant (positive punishment) or by removing something pleasant (negative punishment). Positive and negative mean added or removed, not good or bad.\n\nOne example is the seatbelt buzzer in a car. If the driver starts the car without a seatbelt, an annoying buzzer sounds. Buckling up makes the buzzer stop, so an unpleasant stimulus is removed straight after the behaviour. This is negative reinforcement. Because buckling up is followed by relief from the noise, the driver becomes more likely to buckle up quickly on future journeys. The consequence, not a rule or an instruction, is what strengthens the behaviour.",
      pitfalls: [
        "Calling negative reinforcement a punishment: it removes something unpleasant and makes the behaviour more likely.",
        "Giving an example for all four consequence types. Only the first example is marked, so the rest is wasted time.",
        "Describing a Skinner box in detail without saying why the behaviour changed."
      ]
    },
    {
      id: "A2", topic: "classical", cmd: "explain",
      q: "Explain classical conditioning with reference to one example. [4]",
      strands: ["Explains the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "Defines classical conditioning as learning by association between two stimuli",
        "Uses UCS, UCR, NS, CS and CR correctly",
        "Explains the process: the NS is repeatedly paired with the UCS until it predicts it",
        "Maps every term onto the example (what is the UCS, the NS, the CS, the CR?)",
        "Explains why the response transfers: the organism learns that one stimulus signals the other",
        "Keeps to one example, with only a brief outline of the study"
      ],
      model: "Classical conditioning is learning by association between two stimuli. Some stimuli trigger a reflex without any learning: an unconditioned stimulus (UCS) produces an unconditioned response (UCR). If a neutral stimulus (NS), which produces no response on its own, is repeatedly presented together with the UCS, the organism learns that the NS predicts the UCS. The NS then becomes a conditioned stimulus (CS), which triggers a conditioned response (CR) on its own. If the CS keeps appearing without the UCS, the CR gradually fades, which is called extinction.\n\nPavlov (1903) showed this with dogs. Food (UCS) made the dogs salivate (UCR), which is a natural reflex. Pavlov then repeatedly sounded a metronome (NS) just before the food was given. After many pairings, the metronome alone (now a CS) made the dogs salivate (CR). The dogs had learned that the sound signalled that food was coming, so their bodies started preparing for food before it arrived. The response itself was not new, but the stimulus that triggered it was.",
      pitfalls: [
        "Mixing up the UCR and the CR: they can be the same behaviour (salivation), but the trigger is different.",
        "Describing learning through consequences, which is operant conditioning, not classical.",
        "Naming the terms in paragraph 1 but never mapping them onto the example."
      ]
    },
    {
      id: "A3", topic: "classical", cmd: "explain",
      q: "Explain classical conditioning using one example. [4]",
      strands: ["Explains the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "Explains that classical conditioning involves involuntary, reflex-like responses, not chosen behaviour",
        "States the sequence: before, during and after conditioning, with correct terms",
        "Explains why the pairing matters: the NS comes to predict the UCS",
        "Uses an everyday example if it is clear: anecdotal examples are allowed",
        "Maps UCS, UCR, NS, CS and CR onto the example",
        "Explains why the learned response appears in the new situation"
      ],
      model: "Classical conditioning explains how we learn to respond to a stimulus that previously meant nothing to us. It works with involuntary responses such as fear, nausea or salivation, not with behaviour we choose. Before conditioning, an unconditioned stimulus (UCS) automatically produces an unconditioned response (UCR), and a neutral stimulus (NS) produces nothing. During conditioning, the NS repeatedly occurs just before or together with the UCS. Because the NS starts to predict the UCS, it becomes a conditioned stimulus (CS), and after conditioning it produces a conditioned response (CR) on its own.\n\nAn everyday example is fear of the dentist. A painful drilling (UCS) naturally causes fear (UCR). At first, the high-pitched sound of the drill is a neutral stimulus. Because the sound is heard every time the painful drilling happens, the person associates the two. The sound becomes a CS, so later the person feels anxious (CR) just hearing a drill from the waiting room, before anything painful has happened. The fear is triggered by the sound because it has become a signal that pain is coming.",
      pitfalls: [
        "Choosing an example that is really about consequences (for example a child who cries to get sweets), which is operant.",
        "Leaving out the neutral stage, so it is not clear what was learned.",
        "Writing 'the person learns to be scared' without explaining the pairing."
      ]
    },
    {
      id: "A4", topic: "slt", cmd: "describe",
      q: "Describe social learning theory with reference to one example. [4]",
      strands: ["Describes the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "States that behaviour can be learned by observing and imitating a model, without direct reinforcement",
        "Names all four mediating processes: attention, retention, reproduction, motivation",
        "Explains vicarious reinforcement and outcome expectancies as part of motivation",
        "Mentions identification with the model (similar age or gender, liked or admired)",
        "Links the mediators or identification to the example, not only the finding",
        "Keeps the study outline brief: what children saw, what they did later"
      ],
      model: "Social learning theory (Bandura) says that people can learn new behaviour by observing a model and imitating it, without being reinforced themselves. Learning depends on four mediating processes. The observer must pay attention to the model, retain the behaviour in memory, be able to reproduce it, which needs self-efficacy, and be motivated to perform it. Motivation depends on outcome expectancies: seeing a model rewarded (vicarious reinforcement) makes imitation more likely. Imitation is also more likely when the observer identifies with the model, for example because they are similar in age or gender.\n\nBandura, Ross and Ross (1961) showed this with 72 children aged about 3 to 6. Some watched an adult hit a Bobo doll with a mallet and shout at it, some saw a calm model and some saw no model. Later, after being mildly frustrated, the children who had seen the aggressive model were much more aggressive towards a Bobo doll and often copied the exact actions and words. They had attended to and retained the behaviour just by watching. Boys copied the male model more, which fits identification with a same-sex model.",
      pitfalls: [
        "Writing only 'people copy others': this is about a 2/4 answer without the mediators.",
        "Claiming the model in the 1961 study was rewarded. The key finding is that children imitated without anyone being reinforced.",
        "Spending the whole second paragraph on procedure (rooms, timings, coding) and never linking it to the theory."
      ]
    },
    {
      id: "A5", topic: "schema", cmd: "describe",
      q: "Describe schema theory with reference to one example of how it helps us to understand one cognitive process. [4]",
      strands: ["Describes the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "Defines a schema as a mental representation built from experience that organises knowledge",
        "Explains top-down processing: schemas guide attention, interpretation, prediction and recall",
        "Uses assimilation and accommodation correctly",
        "Names the cognitive process the example illustrates (memory or comprehension)",
        "Gives the key finding and explains it in terms of schemas",
        "Treats schema theory as a theory, not as a model of memory"
      ],
      model: "Schema theory says that knowledge is stored as schemas: mental representations built from experience that organise what we know about objects, people and events. Schemas work top-down: they guide what we pay attention to, help us interpret new information, and let us fill gaps and predict what comes next. New information that fits a schema is assimilated into it. Information that does not fit can lead to accommodation, where the schema is changed or a new one is formed. Because schemas make processing more economical, they affect how information is encoded and retrieved.\n\nBransford and Johnson (1972) show how schemas help us understand memory. Participants heard a vague passage that was really about washing clothes. One group was told the topic before hearing it, one afterwards, and one never. The topic-before group rated the passage as easier to understand and recalled more idea units than both other groups, while the topic-after group did no better than the no-topic group. This shows that a schema helps memory only when it is activated at encoding, because it gives the listener a framework to organise the information as it comes in.",
      pitfalls: [
        "Describing reconstructive memory instead of the theory itself: explain what schemas are before showing their effects.",
        "Calling schema theory a cognitive model. It cannot answer a 'one cognitive model' question.",
        "Saying the topic-after group also improved. They did not, which is the whole point of the study."
      ]
    },
    {
      id: "A6", topic: "msm", cmd: "describe",
      q: "Describe one cognitive model with reference to one example of how it explains a cognitive process or behaviour. [4]",
      strands: ["Describes the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "Names the model and its authors: the multi-store model (Atkinson and Shiffrin, 1968)",
        "Describes all three stores in order: sensory memory, STM, LTM",
        "Gives capacity, duration and encoding for the stores (for example 7 ± 2 items, about 15 to 30 seconds and mainly acoustic encoding for STM)",
        "Describes the processes between stores: attention, rehearsal, retrieval, and displacement or decay",
        "Uses MSM terms only: no 'central executive' or 'working memory' in an MSM answer",
        "Explains the example with the stores, not just reports the result"
      ],
      model: "The multi-store model (Atkinson and Shiffrin, 1968) describes memory as information moving through three separate stores that differ in encoding, capacity and duration. Sensory memory holds a large amount of input for a very short time, for example about 0.2 to 0.5 seconds for visual information. Information that we pay attention to passes into short-term memory (STM), which encodes mainly by sound and holds about 7 ± 2 items for about 15 to 30 seconds. Without rehearsal, information in STM decays or is displaced by new input. Rehearsal transfers information into long-term memory (LTM), which encodes mainly by meaning and has an effectively unlimited capacity and duration. Retrieval brings information from LTM back into STM when we need it.\n\nThe model explains the serial position effect found by Glanzer and Cunitz (1966). Participants recalled lists of 15 words. When they recalled straight away, they remembered the first words (primacy) and the last words (recency) best. When they had to count for 30 seconds first, the recency effect disappeared but primacy stayed. The MSM explains this because the first words had been rehearsed into LTM, while the last words were still only in STM and were displaced by the counting.",
      pitfalls: [
        "Drawing the model without describing what each store does and how information moves between them.",
        "Mixing MSM and WMM vocabulary, for example putting a central executive inside STM.",
        "Calling sensory memory 'selective memory', or forgetting to say how information leaves STM."
      ]
    },
    {
      id: "A7", topic: "wmm", cmd: "explain",
      q: "Explain one cognitive model with reference to one example of how it explains a cognitive process or behaviour. [4]",
      strands: ["Explains the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "Names the model: the working memory model (Baddeley and Hitch, 1974)",
        "Explains that STM is an active workspace with several components, not one store",
        "Describes the central executive as a limited-capacity attention controller, not a store",
        "Splits the phonological loop into the phonological store and the articulatory control process",
        "Includes the visuospatial sketchpad and the episodic buffer",
        "Explains the dual-task logic: tasks using the same component interfere",
        "Explains the example with the named component (for example suppression blocks the inner voice)"
      ],
      model: "The working memory model (Baddeley and Hitch, 1974) explains short-term memory as an active workspace made of several components rather than one store. The central executive is a limited-capacity attention controller that directs information to two slave systems and switches between tasks. In the phonological loop, the phonological store ('inner ear') holds sounds for about 2 seconds, and the articulatory control process ('inner voice') refreshes them by silent rehearsal. The visuospatial sketchpad holds visual and spatial information. The episodic buffer, added later, combines information from the other parts and LTM. Because each component has a limited capacity, two tasks that use the same component interfere, while tasks using different components can be done together.\n\nLandry and Bartling (2011) show this. Students saw lists of seven letters that did not sound alike and recalled them in order. Half of them kept repeating '1, 2' during the task (articulatory suppression). This group recalled 45% correctly compared with 76% in the control group. The model explains this because saying '1, 2' kept the articulatory control process busy, so the letters could not be rehearsed and faded from the phonological store.",
      pitfalls: [
        "Describing the central executive as a store of information: it controls attention and holds nothing permanently.",
        "Naming the components without explaining how they interact or why tasks interfere.",
        "Explaining the study as proof that STM and LTM are separate. The MSM already said that; the point here is separate components within STM."
      ]
    },
    {
      id: "A8", topic: "load", cmd: "explain",
      q: "Explain cognitive load theory with reference to one example of how it helps us to understand human cognition. [4]",
      strands: ["Explains the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "States the key assumption: working memory has a limited capacity",
        "Defines cognitive load as the total demand a task places on working memory, not 'using technology'",
        "Explains that overload happens when demand exceeds capacity, and learning and recall suffer",
        "Defines intrinsic, extraneous and germane load accurately",
        "Explains how the loads interact: extraneous load uses capacity that germane processing needs",
        "Links the example to a named type of load and explains its effect on learning"
      ],
      model: "Cognitive load theory assumes that working memory has a limited capacity. Cognitive load is the total mental demand a task places on working memory. When demand is greater than capacity, overload happens, and learning and recall suffer. Intrinsic load is the difficulty of the material itself, such as how many elements must be combined at once. Extraneous load comes from things that do not help learning, such as distractions or poorly presented material. Germane load is the effort used to build schemas in long-term memory, and it is lower when prior knowledge helps us process new information. Because all three share the same capacity, high extraneous load leaves less room for the processing that builds understanding.\n\nSana et al. (2013) show this. University students listened to a lecture and took notes on laptops. Those also given small online tasks scored about 11% lower on a comprehension test, and in a second experiment students who only sat where they could see other people's laptops scored about 17% lower. The multitasking and the screens added extraneous load, so less working memory capacity was left to understand and store the lecture.",
      pitfalls: [
        "Defining cognitive load as 'using too much technology' instead of demand on working memory.",
        "Leaving germane load undeveloped or confusing it with intrinsic load.",
        "Listing the three types without explaining why overload harms learning."
      ]
    },
    {
      id: "A9", topic: "dpt", cmd: "describe",
      q: "Describe dual process theory with reference to one example. [4]",
      strands: ["Describes the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "States that thinking and decision-making rely on two systems",
        "Gives at least three features of System 1 (fast, automatic, low effort, heuristics, error-prone)",
        "Gives at least three features of System 2 (slow, conscious, effortful, analytic)",
        "Explains the link to cognitive bias: System 1 answers first and System 2 often fails to check",
        "Mentions the cognitive miser idea or the conditions System 2 needs (time, motivation, capacity)",
        "Uses the example to show which system produced which answer"
      ],
      model: "Dual process theory states that thinking and decision-making rely on two systems. System 1 is fast, automatic and intuitive. It uses heuristics (mental shortcuts), so it gives quick answers that feel right but can produce systematic errors called cognitive biases. System 2 is slow, conscious and effortful. It works through a problem step by step and is more logical, but it needs time, motivation and spare mental capacity. Because we are cognitive misers, System 1 handles most everyday decisions and System 2 is only brought in when needed, so System 1's answers often go unchecked.\n\nThe bat-and-ball problem from the Cognitive Reflection Test is an example. A bat and a ball cost $1.10 in total, and the bat costs $1.00 more than the ball. The first answer most people think of is 10 cents, which is System 1 quickly splitting the numbers. The correct answer, 5 cents, needs System 2 to check: a 10 cent ball would make the bat $1.10 and the total $1.20. Frederick (2005) found that over half of students at top universities gave the intuitive answer, because System 2 was never engaged to check it.",
      pitfalls: [
        "Presenting System 1 as simply 'bad' and System 2 as 'good': System 1 handles most things well.",
        "Giving a list of features with no example of the two systems at work.",
        "Using a bias study as the example without saying which system is responsible and why."
      ]
    },
    {
      id: "A10", topic: "biases", cmd: "explain",
      q: "Explain anchoring bias with reference to one example. [4]",
      strands: ["Explains the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "Defines anchoring: over-reliance on the first piece of information when making a judgement",
        "Explains insufficient adjustment: people move away from the anchor, but not far enough",
        "Notes that even random or irrelevant anchors work",
        "Explains why it happens (System 1 takes the anchor as a starting point; the cognitive miser stops adjusting early)",
        "Outlines one example with the anchor clearly identified",
        "Links the result back to insufficient adjustment, not just 'the numbers were different'"
      ],
      model: "Anchoring bias happens when people rely too heavily on the first piece of information they receive (the anchor) when making a judgement. They adjust away from the anchor, but not far enough, so the final judgement stays close to it, even when the anchor is random or irrelevant. Dual process theory helps explain why. System 1 automatically takes the anchor as a starting point, and because we are cognitive misers, System 2 makes only a small, effortful adjustment and stops too early. It is a systematic error because most people are pulled in the same direction.\n\nTversky and Kahneman (1974) gave participants 5 seconds to estimate the answer to a multiplication. One group saw 8×7×6×5×4×3×2×1 and the other saw 1×2×3×4×5×6×7×8. The median estimate was 2,250 for the descending group and 512 for the ascending group, although the true answer is 40,320. With no time to finish the sum, participants multiplied the first few numbers and used that result as an anchor. Larger first numbers gave a higher anchor, and both groups adjusted upwards too little, so both underestimated.",
      pitfalls: [
        "Writing mainly about dual process theory and never explaining anchoring itself (1 to 2 marks at most).",
        "Describing the study in detail but never explaining why the bias happened.",
        "Confusing the anchor with the final answer: the anchor is the first value people start from."
      ]
    },
    {
      id: "A11", topic: "biases", cmd: "explain",
      q: "Explain confirmation bias with reference to one example. [4]",
      strands: ["Explains the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "Defines confirmation bias: seeking, interpreting, favouring and remembering information that supports existing beliefs",
        "Names the processes: selective exposure, selective interpretation, selective memory",
        "Explains why it happens: schema-consistent information is easy for System 1; challenging a belief takes effort",
        "Can add a motivational reason: protecting self-esteem or identity",
        "Outlines one example and shows which process it illustrates",
        "Explains the example in terms of the bias, not just the result"
      ],
      model: "Confirmation bias is the tendency to search for, interpret, favour and remember information in a way that supports what we already believe. It works through selective exposure (seeking out supporting evidence), selective interpretation (judging supporting evidence as stronger) and selective memory (remembering what fits). It happens because information that fits our existing schemas is easy to process with fast System 1 thinking, while information that challenges a belief would require effortful rethinking, which cognitive misers avoid. Beliefs that are part of our identity may also be defended to protect self-esteem.\n\nLord, Ross and Lepper (1979) studied 48 university students who either supported or opposed the death penalty. All of them read two made-up studies, one supporting the death penalty and one against it. Each group rated the study that agreed with their own view as better and found more flaws in the other one. After reading the same mixed evidence, both groups became more extreme in their views. This shows confirmation bias because the students interpreted identical evidence to fit what they already believed instead of weighing it evenly.",
      pitfalls: [
        "Explaining dual process theory in general instead of confirmation bias.",
        "Saying the students 'ignored' the other study. They read it but judged it as weaker, which is selective interpretation.",
        "Giving the finding (attitudes became more extreme) without explaining why that shows the bias."
      ]
    },
    {
      id: "A12", topic: "schema", cmd: "explain",
      q: "Explain schema theory with reference to one example. [4]",
      strands: ["Explains the content point accurately with key terms", "One example, clearly linked to the content point"],
      checklist: [
        "Defines schemas as mental frameworks built from experience, including cultural experience",
        "Explains top-down processing: schemas guide interpretation and fill gaps",
        "Explains why schemas can distort memory: memory is reconstructed, not replayed",
        "Outlines Bartlett's material and method briefly (unfamiliar story; repeated or serial reproduction)",
        "Names at least one distortion (levelling, sharpening, rationalisation) with a concrete change from the story",
        "Explains the distortions as the story being made to fit cultural schemas"
      ],
      model: "Schema theory explains cognition as top-down processing guided by schemas: mental frameworks built from past experience, including cultural experience. Schemas help us interpret and remember information economically, because we do not have to process every detail from scratch. However, because we use schemas to fill gaps, they can also distort memory. When information does not fit our schemas, we tend to change it so that it makes sense. This is why memory is reconstructive: we rebuild a memory from stored fragments and schema-based expectations instead of replaying an exact copy.\n\nBartlett (1932) asked British participants to read 'The War of the Ghosts', a Native American legend with unfamiliar names and ideas. They then recalled it several times (repeated reproduction) or passed it from person to person (serial reproduction). With each recall the story became shorter and more conventional: 'canoe' became 'boat' and 'hunting seals' became 'fishing'. Participants left out details that seemed unimportant (levelling) and changed unfamiliar parts to fit British expectations (rationalisation). This happened because the story did not fit their cultural schemas, so they reconstructed it into a version that made sense to them.",
      pitfalls: [
        "Retelling the story or the method at length and never mentioning schemas in the second paragraph.",
        "Explaining only reconstructive memory without first saying what a schema is.",
        "Claiming only one method distorted the story: both repeated and serial reproduction showed the same kinds of distortion."
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  /* SECTION B: 6 marks. Knowledge of the theory + links to the scenario */
  /* ------------------------------------------------------------------ */
  B: [
    {
      id: "B1", topic: "operant",
      stem: "Jonas is in his first year at gymnasium. In maths lessons he spends most of the time on his phone, and he has handed in only two of the last eight homework assignments. His teacher has tried telling him off in front of the class, but Jonas just laughs and his friends grin. When he does hand in homework, nobody says anything about it. His mother says he will happily spend hours practising football tricks when his coach notices his progress.",
      q: "Explain how operant conditioning could be used to change Jonas's behaviour. [6]",
      checklist: [
        "Opens with a short, accurate explanation of operant conditioning (consequences change the future likelihood of behaviour)",
        "Uses the terms precisely: reinforcement increases behaviour, punishment decreases it; positive adds, negative removes",
        "Chooses one main strategy and explains why it suits Jonas, rather than listing all four quadrants",
        "Explains why the current telling-off is not working, using the idea that a consequence is defined by its effect",
        "Uses at least two scenario details with 'this happens because' reasoning",
        "Could add a reinforcement schedule and say why it would keep the behaviour going",
        "No evaluation of operant conditioning"
      ],
      links: [
        "Telling-off in front of friends who grin: meant as positive punishment, but the attention may be positively reinforcing the phone use.",
        "Nobody comments when homework is handed in: the desired behaviour gets no reinforcement, so it is not strengthened.",
        "Works hard when his coach notices progress: recognition is an effective positive reinforcer for Jonas, so it is the basis for the strategy."
      ],
      model: "Operant conditioning is learning through consequences. Behaviour that is followed by reinforcement becomes more likely, and behaviour that is followed by punishment becomes less likely. Positive means something is added and negative means something is removed. Whether a consequence is a reinforcer or a punisher depends on its effect on the behaviour, not on what the teacher intends.\n\nThis explains why the telling-off has not worked. The teacher meant it as positive punishment, but Jonas laughs and his friends grin, so the attention he gets from his friends is probably reinforcing the phone use instead of reducing it. At the same time, handing in homework is followed by nothing, so there is no consequence to make it more likely.\n\nThe teacher could instead use positive reinforcement. Every time Jonas hands in homework, she could give him specific recognition of his progress, ideally privately so that it does not become a show for his friends. This is likely to work because Jonas already works hard when his football coach notices his progress, which shows that recognition is a reinforcer for him. To keep the behaviour going, she could later add a fixed-ratio schedule, such as letting him choose his seat after every four assignments handed in on time. Reinforcing the behaviour she wants is more likely to work than punishing him again, because the public punishment has already backfired.",
      pitfalls: [
        "Listing all four types of consequence with a suggestion for each instead of developing one strategy.",
        "Suggesting a punishment without noticing that the scenario shows punishment is already failing.",
        "Evaluating operant conditioning (for example 'it is based on animal research'), which earns nothing in Section B."
      ]
    },
    {
      id: "B2", topic: "classical",
      stem: "Mikkel is nine and used to enjoy playing the piano. Last year he had a strict teacher who often shouted at him when he made mistakes. Mikkel now has a new, kind teacher, but he still tenses up and feels sick as soon as he sees the piano in the living room, and he groans whenever his mother mentions practice. Mikkel loves hot chocolate, and he gets very happy when his grandmother visits and sings along to his favourite film songs.",
      q: "Explain how classical conditioning could be used to change how Mikkel feels about the piano. [6]",
      checklist: [
        "Explains classical conditioning: an NS paired with a UCS becomes a CS that triggers a CR",
        "Uses the terms to explain how the negative feeling was learned in the first place",
        "Proposes a pairing of the piano with a stimulus that already produces a pleasant response",
        "Maps the new UCS, UCR, NS/CS and CR onto the scenario details",
        "Explains extinction: the old CR fades when the piano keeps appearing without the shouting",
        "Explains why the plan would work (the piano comes to predict something pleasant)",
        "No evaluation"
      ],
      links: [
        "Shouting teacher last year: shouting (UCS) caused fear (UCR); the piano (NS) was repeatedly paired with it and became a CS that now triggers tension (CR).",
        "New, kind teacher: the piano now appears without shouting, so extinction of the fear response can begin.",
        "Hot chocolate and grandmother's film songs: stimuli that already produce happiness, which can be paired with the piano so it triggers a new, positive CR."
      ],
      model: "Classical conditioning is learning by association. An unconditioned stimulus (UCS) naturally produces an unconditioned response (UCR). If a neutral stimulus (NS) is repeatedly paired with the UCS, it becomes a conditioned stimulus (CS) that triggers a conditioned response (CR) on its own. If the CS then keeps appearing without the UCS, the CR weakens, which is called extinction.\n\nThis explains how Mikkel's feeling was learned. Being shouted at (UCS) naturally caused fear (UCR). Because the shouting happened again and again at the piano, the piano, which used to be neutral, became a CS. Now just seeing it makes him tense and feel sick (CR), even though the strict teacher is gone.\n\nTo change the feeling, his mother could pair the piano with stimuli that already make him happy. For example, she could give him a cup of hot chocolate at the piano, and invite his grandmother to sing along while Mikkel plays his favourite film songs. The hot chocolate and his grandmother's singing act as the UCS, producing happiness and relaxation (UCR). If this pairing is repeated over many sessions, the piano should start to predict pleasant experiences instead of shouting, so it becomes a CS for a positive feeling. At the same time, because the new teacher never shouts, the piano keeps appearing without the original UCS, so the old fear response should gradually go through extinction.",
      pitfalls: [
        "Suggesting rewards for practising (operant) instead of pairing stimuli (classical).",
        "Mapping the terms wrongly, for example calling the piano the UCS.",
        "Proposing the plan without saying why repeated pairing would change the feeling."
      ]
    },
    {
      id: "B3", topic: "slt",
      stem: "Lucas is fourteen and almost never eats vegetables at school lunch. He says vegetables are 'for little kids', and his friends at his table always pick pizza. Every Saturday he watches his cousin Anton, who is nineteen, play for the local football club, and he has started copying Anton's warm-up routine exactly. Anton's coach often praises players who eat well before matches, and Anton has just been made team captain. The school canteen serves a salad bar every day.",
      q: "Explain how social learning theory could be used to change Lucas's eating behaviour. [6]",
      checklist: [
        "Explains SLT: learning by observing and imitating a model, without direct reinforcement",
        "Names and applies all four mediators: attention, retention, reproduction, motivation",
        "Explains vicarious reinforcement and outcome expectancies",
        "Explains why Anton is a good model (identification: same gender, admired, similar interests)",
        "Uses scenario details to show why each mediator is likely to be met",
        "Proposes a realistic plan (for example Anton eating vegetables where Lucas can see, with the praise visible)",
        "No evaluation"
      ],
      links: [
        "Copies Anton's warm-up exactly: Anton already holds Lucas's attention and is a model he identifies with, so he is likely to be imitated.",
        "Coach praises players who eat well; Anton made captain: if Lucas sees Anton rewarded for healthy eating, this is vicarious reinforcement that raises his motivation.",
        "Salad bar every day; friends pick pizza: reproduction is easy because vegetables are available, but his friends are current models for the opposite behaviour."
      ],
      model: "Social learning theory (Bandura) says that we can learn behaviour by observing a model and imitating it, without being reinforced ourselves. Imitation depends on four mediating processes: attention to the model, retention of the behaviour, the ability to reproduce it, and motivation to do so. Motivation increases when we see the model being rewarded (vicarious reinforcement), and imitation is more likely when we identify with the model.\n\nAnton would be an effective model for Lucas. Lucas already copies Anton's warm-up routine exactly, which shows that Anton holds his attention and that Lucas identifies with him: they are both male, both play football, and Anton is older and admired. At the moment Lucas's friends are his models at lunch, and they choose pizza.\n\nA plan could be for Anton to talk about and show his pre-match meals, for example eating vegetables with Lucas after a Saturday match. Because the meal is simple and repeated every week, Lucas can easily retain it. Reproduction is realistic because the canteen has a salad bar every day, so he can feel confident he can copy it. Most importantly, Lucas can see that Anton is praised by his coach for eating well and has just been made captain. This vicarious reinforcement creates the outcome expectancy that eating vegetables leads to success in football, which gives Lucas a reason to change and weakens his belief that vegetables are 'for little kids'.",
      pitfalls: [
        "Writing 'Lucas will copy Anton' without explaining any of the mediating processes.",
        "Suggesting that Lucas is rewarded directly: that is operant conditioning, not social learning.",
        "Ignoring details such as the salad bar and the coach's praise, which carry the application marks."
      ]
    },
    {
      id: "B4", topic: "schema",
      stem: "Emil is seventeen and has just started a summer job as a waiter in an expensive restaurant. For two years he worked at a busy burger bar, where staff cleared plates the moment customers finished and handed over the bill with the food. On his first evening he cleared one guest's plate while the other guest was still eating, and he put the bill on a table before the guests had been offered dessert. A customer complained to the manager. When the manager explained the restaurant's rules, Emil kept forgetting the ones that were different from the burger bar. He told his friends that the customers were 'just fussy'.",
      q: "Explain how schema theory could be used to explain Emil's behaviour. [6]",
      checklist: [
        "Explains schema theory: schemas are mental frameworks from experience that guide attention, interpretation, memory and behaviour",
        "Explains scripts as schemas for a typical sequence of events",
        "Uses assimilation, accommodation and disequilibrium correctly",
        "Explains the behaviour at work as an old script running automatically",
        "Explains the forgetting as schema-inconsistent information being harder to process",
        "Explains the 'fussy' comment as top-down interpretation that protects the existing schema",
        "No evaluation"
      ],
      links: [
        "Two years at a burger bar; cleared plates early and brought the bill: his restaurant script was built at the burger bar, so it guided his behaviour automatically in the new setting.",
        "Kept forgetting the rules that were different: schema-inconsistent information needs more effort, so it is more easily forgotten than information that fits.",
        "Called the customers 'just fussy': he interpreted the complaint through his existing schema (assimilation) instead of changing the schema (accommodation)."
      ],
      model: "Schema theory says that we store knowledge in schemas, mental frameworks built from experience. Schemas work top-down: they guide what we notice, how we interpret situations, what we remember and how we behave. A script is a schema for a typical sequence of events, such as how a restaurant visit goes. New information that fits is assimilated into a schema, while information that does not fit creates disequilibrium and may lead to accommodation, where the schema is changed.\n\nEmil's mistakes on his first evening came from the script he built during two years at the burger bar, where plates are cleared as soon as someone finishes and the bill comes with the food. Because a script runs quickly and automatically, he followed it in the new restaurant without noticing that the situation was different.\n\nHis forgetting of the new rules can also be explained by schemas. Rules that matched the burger bar fitted his existing schema and were easy to remember. Rules that were different did not fit, so they needed more effort to process and were more easily forgotten.\n\nFinally, the complaint should have caused disequilibrium, which could lead to accommodation. Instead, Emil called the customers 'just fussy'. This is top-down interpretation: he assimilated the complaint into his existing schema, so the problem seemed to be the customers, not his script. Until he accommodates his schema, he is likely to keep making the same mistakes.",
      pitfalls: [
        "Defining schema theory and then retelling the scenario without saying 'this happens because'.",
        "Using Bartlett or another study in place of application: studies are not needed in Section B.",
        "Confusing assimilation and accommodation."
      ]
    },
    {
      id: "B5", topic: "wmm",
      stem: "Priya is driving to a friend's new house for the first time. On a hands-free call, her friend gives her the directions: 'Second left at the roundabout, then third right, and park opposite the bakery.' While her friend is talking, Priya is singing along to a song on the radio. By the time she reaches the roundabout, she cannot remember any of the directions. She pulls over, calls back, switches off the radio and quietly repeats the directions to herself all the way there. This time she arrives without any problems.",
      q: "Explain how the working memory model could be used to explain why Priya forgot the directions. [6]",
      checklist: [
        "Explains the WMM: STM as several limited-capacity components managed by the central executive",
        "Explains the phonological loop in detail: phonological store (about 2 seconds) and articulatory control process",
        "Explains why two tasks that use the same component interfere",
        "Identifies the spoken directions as phonological information",
        "Explains that singing occupied the articulatory control process, so the directions were not rehearsed and decayed",
        "Uses the second trip to show rehearsal working when the loop is free",
        "Uses at least two components by name; no evaluation"
      ],
      links: [
        "Spoken directions on the phone: sound-based information enters the phonological store and fades within about 2 seconds unless rehearsed.",
        "Singing along to the radio: this occupies the articulatory control process (like articulatory suppression), so the directions cannot be rehearsed.",
        "Radio off and quietly repeating the directions: the inner voice is free to rehearse, so the directions stay in working memory; driving uses the visuospatial sketchpad, so it does not block this."
      ],
      model: "The working memory model (Baddeley and Hitch, 1974) sees short-term memory as a set of limited-capacity components. The central executive controls attention and sends information to the slave systems. The phonological loop holds sound-based information: the phonological store holds it for only about 2 seconds, and the articulatory control process keeps it active by silent rehearsal. The visuospatial sketchpad holds visual and spatial information. Two tasks that use the same component interfere with each other, but tasks that use different components can run together.\n\nThe directions Priya heard on the call are spoken, so they entered her phonological store. To keep them for several minutes she needed to rehearse them with her articulatory control process. However, she was singing along to the radio at the same time. Singing uses the same inner voice, so it works like articulatory suppression: the loop was busy with the song lyrics, the directions were never rehearsed, and they faded from the phonological store within seconds. Her central executive also had to divide attention between the phone call, the song and the road, which left less capacity for the directions.\n\nOn the second attempt, Priya switched off the radio and repeated the directions to herself. Now her articulatory control process was free to rehearse them, so they were refreshed all the way to the house. Driving did not stop this, because driving mainly uses the visuospatial sketchpad, a different component from the phonological loop.",
      pitfalls: [
        "Answering with the multi-store model (displacement from a single STM) when the question asks for the WMM.",
        "Saying 'she was multitasking' without naming which component was overloaded and why.",
        "Treating the central executive as the place where the directions were stored."
      ]
    },
    {
      id: "B6", topic: "msm",
      stem: "Oliver's grandmother reads him a shopping list of eight items just as he is leaving the house: milk, eggs, bread, apples, coffee, rice, butter and soap. As she reads, Oliver repeats the first few items to himself. The moment she finishes, his phone rings, and he spends two minutes talking to a friend about the weekend. At the supermarket he remembers milk, eggs and bread, but none of the other items.",
      q: "Explain how the multi-store model of memory could be used to explain why Oliver forgot most of the list. [6]",
      checklist: [
        "Explains the MSM: sensory memory, STM and LTM as separate stores linked by attention and rehearsal",
        "Gives STM capacity (about 7 ± 2 items) and duration (about 15 to 30 seconds without rehearsal)",
        "Explains displacement or decay of unrehearsed items",
        "Links the length of the list to STM capacity",
        "Explains why the first items survived: they were rehearsed and transferred to LTM (primacy)",
        "Explains why the later items were lost: the phone call displaced them before they could be rehearsed",
        "No evaluation"
      ],
      links: [
        "Eight items read out: this is at the limit of STM capacity (about 7 ± 2), so not all items can be held at once.",
        "Repeated the first few items: rehearsal transferred milk, eggs and bread to LTM, like the primacy effect.",
        "Phone call straight after the list: new information from the conversation displaced the unrehearsed later items from STM, which lasts only about 15 to 30 seconds without rehearsal."
      ],
      model: "The multi-store model (Atkinson and Shiffrin, 1968) says memory passes through three separate stores. Information we pay attention to moves from sensory memory into short-term memory (STM), which holds about 7 ± 2 items for about 15 to 30 seconds. Without rehearsal, information in STM decays or is displaced by new information. Rehearsal transfers information into long-term memory (LTM), which has an effectively unlimited capacity and duration.\n\nOliver paid attention to his grandmother, so the list entered his STM. However, eight items is at the upper limit of STM capacity, so the list was already hard to hold at once.\n\nOliver remembered milk, eggs and bread because he repeated these items to himself while she was reading. This rehearsal transferred them from STM into LTM, so they were still available at the supermarket. This matches the primacy effect: the first items in a list get the most rehearsal.\n\nThe other five items were lost because of the phone call. Oliver had not had time to rehearse them, so they were still only in STM. As soon as he started talking to his friend, the new information from the conversation entered STM and displaced them. The call also lasted two minutes, much longer than the 15 to 30 seconds that unrehearsed information lasts in STM. Normally the last items might show a recency effect, but the call removed them before he could recall them.",
      pitfalls: [
        "Saying Oliver forgot because 'STM is small' without explaining rehearsal, transfer and displacement.",
        "Using WMM terms (central executive, phonological loop) in an MSM answer.",
        "Suggesting a memory strategy instead of explaining the forgetting: strategies belong to Section C."
      ]
    },
    {
      id: "B7", topic: "load",
      stem: "Ida has a biology test on genetics, a topic she found confusing in class. She revises on the sofa with the TV on. She reads the textbook while a video on the same topic plays on her laptop, and she keeps replying to a class group chat that is planning a party. The diagrams in her textbook are on a different page from the text that explains them, so she has to flip back and forth. After three hours she feels exhausted, but in the test the next day she can remember very little.",
      q: "Explain how cognitive load theory could be used to explain why Ida's revision was unsuccessful. [6]",
      checklist: [
        "Explains the key assumption: working memory has a limited capacity",
        "Defines cognitive load as the demand on working memory, and overload as demand exceeding capacity",
        "Applies intrinsic load: genetics is new and confusing to Ida",
        "Applies extraneous load: TV, group chat, video plus text at once, diagrams separated from the text",
        "Applies germane load: little capacity was left to build schemas in LTM",
        "Explains how the loads interacted to cause poor recall",
        "No evaluation; does not define load as 'using technology'"
      ],
      links: [
        "Genetics is confusing and new to her: high intrinsic load, and she has no schema to reduce it.",
        "TV, group chat, a video playing while she reads, and flipping between diagrams and text: all extraneous load that uses capacity without helping learning.",
        "Exhausted after three hours but remembers little: her effort went into handling extraneous load, not into germane processing that builds schemas in LTM."
      ],
      model: "Cognitive load theory assumes that working memory has a limited capacity. Cognitive load is the total demand a task places on working memory. When the demand is greater than the capacity, overload happens and learning suffers. Intrinsic load is how difficult the material itself is. Extraneous load comes from anything that does not help learning, such as distractions or poor presentation. Germane load is the effort used to build schemas in long-term memory, which is what makes information easier to recall later.\n\nIda's intrinsic load was already high. Genetics is a topic she found confusing, so she has no schema to help her organise the information and must hold many new ideas at once.\n\nOn top of this, her revision created a lot of extraneous load. The TV and the party chat are distractions that took up her attention. Reading while a video was playing meant processing two streams of information at once. Flipping between the diagrams and the text also added load, because she had to hold one in mind while looking for the other.\n\nBecause her working memory was already full with the difficult material and these distractions, very little capacity was left for germane processing. She was spending effort, which is why she felt exhausted, but it went into managing extraneous load rather than into understanding genetics and building schemas in LTM. That is why she could remember so little in the test.",
      pitfalls: [
        "Defining cognitive load as 'using too much technology' instead of demand on working memory.",
        "Applying only extraneous load and ignoring that the topic is new to Ida (intrinsic load).",
        "Suggesting how she should revise instead of explaining why this revision failed."
      ]
    },
    {
      id: "B8", topic: "biases",
      stem: "Karim is convinced that a new energy drink makes him better at online games, and he has recommended it to his whole team. When he looks it up, he reads only the five-star reviews and skips articles about side effects. When he wins, he says it was the drink; when he loses, he blames the internet connection. His sister shows him a study that found no effect of the drink on reaction times, but Karim says the researchers were probably paid by a rival company. A month later he tells his friends that he has 'won almost every game' since he started drinking it.",
      q: "Explain how confirmation bias could be used to explain Karim's behaviour. [6]",
      checklist: [
        "Defines confirmation bias: seeking, interpreting, favouring and remembering belief-consistent information",
        "Names and applies selective exposure, selective interpretation and selective memory",
        "Explains why it happens: System 1, schema-consistent information is easier, cognitive miser",
        "Explains the motivational side: protecting self-esteem or a public position",
        "Uses three different scenario details, one per process",
        "Explains the dismissal of the study as explaining away disconfirming evidence",
        "No evaluation"
      ],
      links: [
        "Reads only five-star reviews and skips side-effect articles: selective exposure to supporting evidence.",
        "Wins are due to the drink, losses to the connection; the study is dismissed as paid for: selective interpretation that explains away disconfirming evidence.",
        "Remembers winning 'almost every game': selective memory for belief-consistent outcomes; having recommended it to his team gives him a motive to protect the belief."
      ],
      model: "Confirmation bias is the tendency to search for, interpret, favour and remember information in a way that supports what we already believe. It happens partly because information that fits our existing beliefs and schemas is easy to process with fast, automatic System 1 thinking, while challenging a belief requires effortful System 2 thinking, which cognitive misers avoid. People are also motivated to protect beliefs that are linked to their self-esteem.\n\nKarim shows selective exposure. He reads only the five-star reviews and skips articles about side effects, so everything he takes in already supports his belief and he never meets evidence that could challenge it.\n\nHe also shows selective interpretation. A win is taken as proof that the drink works, but a loss is explained away by the internet connection. When his sister shows him a study that found no effect, he decides the researchers were paid by a rival. Evidence against his belief is judged as weak or biased, so the belief is never tested.\n\nFinally, he remembers winning 'almost every game'. This is selective memory: wins that fit his belief are remembered, while losses are forgotten or were never linked to the drink.\n\nKarim is especially prone to this bias because he has recommended the drink to his whole team. Admitting it does not work would threaten his self-esteem, so he has a strong motive to keep the belief.",
      pitfalls: [
        "Labelling the details ('this is confirmation bias') without explaining why each one happens.",
        "Not explaining why Karim is prone to the bias: the command term is explain, not identify.",
        "Writing about dual process theory in general and losing sight of Karim."
      ]
    },
    {
      id: "B9", topic: "biases",
      stem: "Nikolaj wants to buy a used car. At the dealership, the salesperson first shows him a luxury model priced at 250,000 kroner before walking him over to the small car he came to see, which is priced at 90,000 kroner. Compared with the first car, the small car seems cheap. The salesperson says another buyer is coming to look at it in an hour. Nikolaj offers 80,000, and after a short negotiation he pays 85,000. At home, his friend Camilla shows him that similar cars sell online for around 60,000 kroner. Nikolaj replies that at least he negotiated 5,000 off.",
      q: "Explain how anchoring bias could be used to explain Nikolaj's decision. [6]",
      checklist: [
        "Defines anchoring: relying too heavily on the first value as a reference point",
        "Explains insufficient adjustment away from the anchor",
        "Explains why it happens (System 1 takes the anchor as a starting point; System 2 adjusts too little)",
        "Identifies the asking price of 90,000 as an anchor for the negotiation",
        "Identifies the 250,000 luxury car as a first value shaping what seems cheap",
        "Uses the time pressure to explain why System 2 did not correct the judgement",
        "No evaluation"
      ],
      links: [
        "Asking price of 90,000: acted as the anchor, so his offer of 80,000 and the final 85,000 were adjusted too little from it, far above the 60,000 market value.",
        "Luxury car at 250,000 shown first: a high first value made 90,000 seem cheap, so his judgement of value started from an irrelevant number.",
        "Another buyer coming in an hour: time pressure meant System 2 did not check the real market price, leaving the System 1 judgement in charge."
      ],
      model: "Anchoring bias is the tendency to rely too heavily on the first piece of information we receive when making a judgement. We use this first value, the anchor, as a starting point and then adjust away from it, but the adjustment is usually too small, so our final judgement stays close to the anchor. According to dual process theory, System 1 automatically takes the anchor as a reference point, and System 2 only makes a small, effortful correction, especially when there is little time.\n\nThe first number Nikolaj saw was the luxury car at 250,000 kroner. This high value set his sense of what cars cost, so the small car at 90,000 seemed cheap, even though the luxury car had nothing to do with its value.\n\nThe 90,000 asking price then acted as the anchor for the negotiation. His offer of 80,000 was an adjustment down from this anchor, and the final price of 85,000 stayed close to it. He adjusted too little, because similar cars sell for around 60,000. He started from the dealer's number, not from what the car was worth.\n\nThe salesperson also said another buyer was coming in an hour. This time pressure made it less likely that System 2 would engage to check prices, so the quick System 1 judgement was not corrected. His comment that he 'negotiated 5,000 off' shows he is still judging the deal against the anchor rather than the market value.",
      pitfalls: [
        "Calling this confirmation bias or a general 'bad decision' without explaining the anchor.",
        "Identifying the anchor but not explaining insufficient adjustment.",
        "Adding evaluation of anchoring research, such as low ecological validity, which earns nothing here."
      ]
    },
    {
      id: "B10", topic: "models",
      stem: "Researchers proposed a three-stage model of how people learn a new route. First, people notice landmarks. Second, they link the landmarks into a sequence. Third, they form a mental map that lets them find shortcuts. To test the model, they asked 40 first-year university students who had just moved to Aarhus to walk the same route across the city every day for two weeks. On days 1, 5 and 14, the students named landmarks from the route, put photos of the landmarks in the correct order, and tried to find a shortcut between two points. By day 5, most students could name the landmarks and put them in order, but even by day 14 only a few found the shortcut. The researchers concluded that their model was only partly supported.",
      q: "With reference to the study, explain the value of cognitive models for understanding cognitive processes. [6]",
      checklist: [
        "Explains what a cognitive model is: a simplified representation of an unobservable process broken into components",
        "Explains why models are valuable: they make testable predictions and let researchers test one part at a time",
        "Explains that the components are hypothetical constructs that must be operationalised",
        "Links each stage to how it was operationalised in the study (naming, ordering, shortcut)",
        "Explains that the results support some stages but not others, so the model can be revised",
        "Notes that one study rarely tests a whole model; can compare with how a memory model (MSM or WMM) was tested",
        "Keeps the focus on the value of models; does not simply evaluate the study's method"
      ],
      links: [
        "Three named stages: the model breaks an invisible process (route learning) into testable components that predict an order of learning.",
        "Naming landmarks, ordering photos, finding a shortcut: each stage is a hypothetical construct that had to be operationalised as a measurable task.",
        "Stages 1 and 2 by day 5, few shortcuts by day 14: the model is only partly supported, so it can be revised, which is how models improve our understanding."
      ],
      model: "A cognitive model is a simplified representation of a cognitive process that cannot be observed directly, such as the multi-store model of memory. It breaks the process into components and shows how information moves between them. Models are valuable because they make clear predictions, let researchers test one component at a time, and can be revised when the evidence does not fit.\n\nThe route-learning model shows this value. It breaks an invisible process, learning a route, into three stages in a set order. This gives a testable prediction: people should know landmarks first, then the sequence, and only later be able to take shortcuts.\n\nBecause the stages cannot be seen, the researchers had to operationalise each one as a task: naming landmarks, putting photos in order, and finding a shortcut. A model only becomes testable once its constructs are made measurable, and the conclusions depend on whether these tasks really capture each stage.\n\nThe results supported the first two stages, since most students could name and order the landmarks by day 5. However, few found a shortcut even by day 14, so the third stage was not supported, at least within two weeks. This is still useful: it shows which part of the model to revise, just as research on short-term memory led the working memory model to split the MSM's single short-term store into components. One study rarely tests a whole model, but each test sharpens our understanding.",
      pitfalls: [
        "Describing the MSM or WMM in detail and never referring to the study in the stem.",
        "Evaluating the study (sample size, one city) instead of explaining what the study shows about the value of models.",
        "Saying the model was 'proved' or 'wrong': it was partly supported, which is exactly what makes models useful."
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  /* SECTION C: 15 marks. Concept + area of study                         */
  /* ------------------------------------------------------------------ */
  C: [
    {
      id: "C1", concept: "perspective", area: "one model of one cognitive process", cmd: "discuss",
      q: "Discuss perspective with regard to one model of one cognitive process. [15]",
      scaffold: {
        name: "The perspective structure",
        parts: [
          "Introduction: define perspective as the lens used to explain behaviour; name the model and state your line of argument",
          "Describe the model briefly: its components and how information flows",
          "Perspective 1 (cognitive): what the lens explains, its assumptions and supporting evidence",
          "Brief evaluation of the perspective itself: what it can and cannot show",
          "Perspective 2 (biological): what this lens adds and where it challenges the model",
          "Conclusion: why one lens is not enough"
        ]
      },
      plan: [
        "Introduction: perspective = the lens used to explain a process. MSM (Atkinson and Shiffrin, 1968) = cognitive model of memory. Argue: the cognitive and biological lenses support the MSM in different ways, and each shows a limit the other cannot.",
        "Paragraph 1: model in brief (sensory memory, STM, LTM; attention, rehearsal, displacement). The model itself is a product of the cognitive lens: humans as information processors, stores as mental constructs.",
        "Paragraph 2: cognitive lens. Glanzer and Cunitz: 30 s counting removed recency, primacy stayed, so separate STM and LTM are inferred from behaviour. Limit of the lens: stores are only inferred, never observed. Levels of processing is a rival cognitive view: depth of processing, not rehearsal alone, predicts later memory.",
        "Paragraph 3: biological lens. HM: medial temporal lobes removed; new LTM lost but STM intact (held 584 by rehearsal), so separate stores have a physical basis. But he learned mirror drawing without remembering it, so LTM is more than one store, which the cognitive model missed.",
        "Conclusion: the cognitive lens explains what memory does and in what order; the biological lens shows where and how. HM both supports and challenges the MSM, so the model is best understood through both lenses together."
      ],
      evidence: [
        "Glanzer and Cunitz (1966): 46 army men, 15 lists of 15 words, recency reduced at 10 s and gone at 30 s of counting; primacy unaffected",
        "Patient HM (Milner; Corkin): anterograde amnesia after hippocampal removal in 1953; STM intact; mirror-drawing learning shows procedural memory",
        "Levels of processing (Craik and Lockhart, 1972): deeper, semantic processing gives better recall, a different cognitive perspective on the same process",
        "Cognitive approach assumptions: information processing; mental processes can only be inferred from behaviour"
      ],
      pitfalls: [
        "Discussing ethics or generalisability of HM: these earn nothing in a perspective essay.",
        "Spending paragraphs on Glanzer and Cunitz's method instead of what the cognitive lens shows.",
        "Using HM only as support and missing that his procedural learning challenges the model's single LTM store.",
        "Calling the cognitive approach 'biased': choosing a lens is perspective, not bias."
      ]
    },
    {
      id: "C2", concept: "causality", area: "environmental influences on one cognitive process", cmd: "discuss",
      q: "Discuss causality with regard to one or more environmental influences on one cognitive process. [15]",
      scaffold: {
        name: "The 3 Ms",
        parts: [
          "Methodology: was a true experiment possible, with the IV manipulated and variables controlled?",
          "Moderating variables: for whom and under what conditions does the effect appear?",
          "Measurement: was the proposed cause or mechanism actually measured, or only inferred?"
        ]
      },
      plan: [
        "Introduction: causality = whether we can claim that one factor produces a change in another. Environmental influences on memory: technology (laptop multitasking) and poverty-related worry. Mechanism proposed: cognitive load on limited working memory. Argue: a short-term causal claim is well supported; a long-term claim is not.",
        "Paragraph 1 (methodology): Sana et al. Random allocation and a controlled lecture support a linear causal claim that multitasking lowers comprehension (about 11%), and even seeing others' screens did (about 17%). Limit: one short lecture, so only an immediate effect.",
        "Paragraph 2 (moderating variables): Mani et al. lab study. The costly car repair lowered scores only for lower-income participants, so income moderates the effect. The farmer natural experiment compared the same people before and after harvest, but the IV was not manipulated: diet, sleep and practice also change, which weakens the causal claim.",
        "Paragraph 3 (measurement): in both studies load was inferred, never measured. Sparrow et al.'s 'Google effect' did not replicate, showing that a plausible cause is not the same as an established one.",
        "Conclusion: good support for a short-term causal effect via cognitive load; weak support for lasting decline, which would need the same tests on comparable groups years apart."
      ],
      evidence: [
        "Sana et al. (2013): 44 students; multitasking on laptops about 11% lower comprehension; seeing others' laptops about 17% lower",
        "Mani et al. (2013): lab study with a car repair of about $150 or $1,500, Raven's matrices; field study of 464 Indian sugarcane farmers, Raven's 4.35 before vs 5.45 after harvest, Stroop 146 s vs 131 s",
        "Sparrow et al. (2011): told the computer would erase facts, participants recalled more; failed to replicate (Camerer et al., 2018)",
        "Cognitive load theory as the proposed mechanism: extraneous load uses limited working memory capacity"
      ],
      pitfalls: [
        "Writing about causality in general, with no actual environmental effect on memory (capped at about 9 marks).",
        "Using 'correlation is not causation' as a slogan instead of explaining what limits the causal claim in each study.",
        "Forgetting that Raven's and Stroop measure reasoning and control, so the link to memory is itself an inference.",
        "Writing 'causality was low': say what supports or limits the causal claim instead."
      ]
    },
    {
      id: "C3", concept: "measurement", area: "the multi-store model of memory", cmd: "discuss",
      q: "Discuss measurement with regard to the multi-store model of memory. [15]",
      scaffold: {
        name: "CTC",
        parts: [
          "Constructs: what exactly is being measured, and can it be defined clearly?",
          "Tools: which methods were used, and how valid and reliable are they?",
          "Context and culture: does the setting or the sample change what the measure captures?"
        ]
      },
      plan: [
        "Introduction: measurement = how constructs are operationalised and how valid that is. The MSM's stores are hypothetical constructs, so they can only be measured indirectly through performance. Argue: the MSM is measurable enough to test, but its numbers depend on the tasks used.",
        "Paragraph 1 (constructs): STM capacity. Miller's 7 ± 2 vs Cowan's 3 to 5 when list length is unknown; chunking changes what counts as an item. Rehearsal is also hard to define: levels of processing shows there are different kinds.",
        "Paragraph 2 (tools): Glanzer and Cunitz operationalised STM as the recency effect and blocked rehearsal with a counting task. Standardised, quantitative and repeatable, so the store distinction can be tested. But free recall under a time limit may underestimate memory.",
        "Paragraph 3 (tools and triangulation): HM was measured with IQ tests, memory tasks, mirror drawing and later MRI. Method triangulation strengthens the claim that STM and LTM are separate, but the extent of damage was unknown until MRI and early observations were subjective.",
        "Paragraph 4 (context): lists of random words in a lab measure a narrow kind of memory, far from everyday remembering.",
        "Conclusion: the MSM's stores can be measured indirectly well enough to test the model, but capacity and duration figures are products of the tasks, so they should not be treated as fixed facts about memory."
      ],
      evidence: [
        "Miller (1956): 7 ± 2 items; Cowan (2010): 3 to 5 items in running span",
        "Glanzer and Cunitz (1966): serial position curve; a 10 s counting delay sharply reduced recency and a 30 s delay removed it",
        "HM: method triangulation (IQ, memory tasks, mirror drawing, MRI); held 584 for 15 minutes by rehearsal",
        "Levels of processing: rehearsal is not one process, and depth cannot be measured independently"
      ],
      pitfalls: [
        "Describing the MSM in full and adding a line about measurement at the end.",
        "Writing 'the study had low validity' without saying which construct was measured, how, and what the measure misses.",
        "Confusing ecological validity with population validity when discussing the army sample."
      ]
    },
    {
      id: "C4", concept: "bias", area: "the role of schema in cognition", cmd: "discuss",
      q: "Discuss bias with regard to the role of schema in cognition. [15]",
      scaffold: {
        name: "SPR",
        parts: [
          "Sampling bias: who was studied, and who can the findings be generalised to?",
          "Participant bias: demand characteristics, self-report and expectancy effects",
          "Researcher bias: how the researcher's expectations could affect procedure or scoring"
        ]
      },
      plan: [
        "Introduction: bias = systematic error that threatens validity. Schema research is about bias in memory itself, but the studies can also be biased. Argue: the general claim that schemas shape memory survives, but specific studies are open to bias.",
        "Paragraph 1 (researcher bias): Bartlett scored the recalls himself, with no standard procedure, so deciding what counted as distortion may reflect his own expectations. Bransford and Johnson reduced this by using two independent judges and 18 idea units.",
        "Paragraph 2 (sampling bias): Bartlett's British-only sample and the small student samples in later studies limit population validity. This matters more for schema theory than most, because schemas are culture-specific, so British students cannot tell us how other cultures reconstruct stories.",
        "Paragraph 3 (participant bias): demand characteristics could lead participants to recall what they think is expected. Brewer and Treyens reduced this: 93% did not expect a memory test. Bransford and Johnson's self-rated comprehension is open to self-report bias, but recall was scored separately.",
        "Conclusion: bias is reduced in later, more controlled studies that still show schema effects, so the role of schemas in memory is supported; claims about culture and everyday memory are less secure."
      ],
      evidence: [
        "Bartlett (1932): British participants, unstandardised intervals, scored by Bartlett himself; levelling, sharpening, rationalisation",
        "Bransford and Johnson (1972): 52 participants, random allocation, two independent judges, 18 idea units, 1 to 7 comprehension rating",
        "Brewer and Treyens (1981): 86 students, 35 s in an office, 93% did not expect a memory test",
        "Anderson and Pichert (1978): 39 students, burglar or homebuyer perspective",
        "Cohen (1993): 'schema' is vague and hard to measure"
      ],
      pitfalls: [
        "Writing about bias in general without explaining what the studies show about schemas (capped at about 9).",
        "Calling a study 'biased' as a verdict instead of naming the type of bias and its effect.",
        "Saying a small or British sample lowers ecological validity: it limits population validity."
      ]
    },
    {
      id: "C5", concept: "responsibility", area: "applying operant conditioning to change behaviour", cmd: "discuss",
      q: "Discuss responsibility with regard to applying operant conditioning to change behaviour. [15]",
      scaffold: {
        name: "AEAC",
        parts: [
          "Agency: whose choice is the change, and does the method respect autonomy?",
          "Ethics: harm, consent and the treatment of participants, human or animal",
          "Application: how findings are used; avoid stigma, determinism and deficit framing",
          "Cultural awareness: do the reinforcers and targets fit the person's culture?"
        ]
      },
      plan: [
        "Introduction: responsibility = the ethical duty of researchers and users of psychology. Operant conditioning gives powerful tools to change behaviour. Argue: responsibility lies mostly with whoever designs the consequences, not with the theory.",
        "Paragraph 1 (agency): OC treats behaviour as shaped by the environment. Used on someone, it can bypass their choice; apps using variable schedules keep users checking, and variable ratio is linked to gambling addiction. Used with the person, as a self-chosen plan, it supports agency.",
        "Paragraph 2 (ethics): punishment can cause resentment and emotional side effects, so reinforcement is the more responsible first choice. The theory rests on animal research (Skinner's pigeons, rats), so generalising to humans needs caution.",
        "Paragraph 3 (application and culture): a consequence is defined by its effect, so the same grade or public praise can reinforce one student and punish another. Responsible use means checking the effect, not assuming it.",
        "Conclusion: OC can be applied responsibly when the person has a say, reinforcement is preferred to punishment, and the effect is monitored; the risk comes from hidden contingencies designed for someone else's benefit."
      ],
      evidence: [
        "Skinner: variable ratio schedules give fast, persistent responding (slot machines, gambling)",
        "Phone apps: message checking resembles a variable interval schedule and refreshing a variable ratio schedule",
        "Lowe et al. (2004), Food Dudes: peer models plus rewards raised fruit and vegetable intake, still present at 4-month follow-up",
        "Skinner's superstition study: pigeons; animal research as the base of the theory",
        "Classroom examples: praise for a strong answer; moving a talkative student away from friends (negative punishment)"
      ],
      pitfalls: [
        "Listing ethical guidelines (consent, withdrawal) without linking them to applying operant conditioning.",
        "Drifting into classical conditioning or aversion therapy without linking back to the question.",
        "Writing 'operant conditioning is unethical' as a verdict instead of explaining when its use is or is not responsible."
      ]
    },
    {
      id: "C6", concept: "perspective", area: "the role of social learning theory in learning", cmd: "evaluate",
      q: "Evaluate perspective with regard to the role of social learning theory in learning. [15]",
      scaffold: {
        name: "The perspective structure",
        parts: [
          "Introduction: define perspective; state that SLT sits between the behaviourist and cognitive lenses",
          "Describe SLT briefly: modelling, the four mediators, vicarious reinforcement",
          "Perspective 1: behaviourist lens, with its strengths and limits",
          "Perspective 2: cognitive lens, with its strengths and limits",
          "Perspective 3: biological and sociocultural lenses",
          "Conclusion: weigh the lenses and judge the value of combining them"
        ]
      },
      plan: [
        "Introduction: perspective = the lens used to explain learning. SLT (Bandura) explains learning by observing models. Evaluate: SLT's strength is that it combines lenses; its weakness is that the cognitive parts are hard to observe.",
        "Paragraph 1 (behaviourist lens): SLT keeps reinforcement, but as vicarious reinforcement. Bobo doll: children imitated aggression without being reinforced themselves, which pure behaviourism cannot explain. Strength: still makes clear, testable predictions.",
        "Paragraph 2 (cognitive lens): attention, retention, reproduction and motivation are mental processes that explain why not everything observed is copied. Limit: these mediators, and self-efficacy, are hard to measure and are inferred from behaviour.",
        "Paragraph 3 (biological and sociocultural lenses): mirror neurons (Gallese; Carr) suggest a possible mechanism, but macaque and fMRI data are indirect. Children in the Bobo study objected to the female model's aggression, so gender norms shaped imitation. Coates et al.: YouTubers as models in media culture.",
        "Conclusion: no single lens explains observational learning; SLT is strongest as a combined account, but it leans towards nurture and cannot explain individual differences on its own."
      ],
      evidence: [
        "Bandura, Ross and Ross (1961): 72 children aged about 3 to 6; aggressive model imitated; boys copied the male model more",
        "Coates et al. (2019): children who saw YouTubers with unhealthy snacks ate 26% more food overall than controls",
        "Gallese et al. (1996): macaque neurons fired when acting and when watching; Carr et al. (2003): fMRI of imitating and observing emotional faces",
        "Lowe et al. (2004), Food Dudes: peer models plus rewards raised fruit and vegetable intake"
      ],
      pitfalls: [
        "Describing the Bobo doll study and then evaluating its method (sample, lab setting) instead of the perspectives.",
        "Stating that SLT is 'cognitive' without explaining what the cognitive lens adds and misses.",
        "Not reaching a judgement: 'evaluate' requires weighing strengths and limitations of each lens."
      ]
    },
    {
      id: "C7", concept: "change", area: "strategies to improve memory", cmd: "to what extent",
      q: "To what extent can strategies to improve memory bring about lasting change? [15]",
      scaffold: {
        name: "MIT",
        parts: [
          "Mechanisms: how does the strategy change memory, cognitively and biologically?",
          "Impact: how big is the change, and for whom?",
          "Time: how long does the change last, and was it measured over time?"
        ]
      },
      plan: [
        "Introduction: change = how cognition changes and our agency to change it. Strategies such as the method of loci and spaced repetition claim to improve memory. Argue: they bring measurable change to a large extent for trained tasks, less clearly in everyday life.",
        "Paragraph 1 (mechanisms): loci uses strong spatial memory and elaborative encoding. Dresler et al.: after 6 weeks of training, brain connectivity came to resemble memory athletes', so change was both cognitive and biological.",
        "Paragraph 2 (impact): loci trainees more than doubled recall of 72 words. Gilbert et al.: heavier Anki use went with 12.9% higher exam scores, but the students chose to use it, so motivation and self-efficacy may explain part of the change.",
        "Paragraph 3 (time and culture): Dresler's gain was still there at 4 months, which supports lasting change; Gilbert followed only one cohort. Kearins: Aboriginal Australian children recalled object locations better, suggesting practice and culture shape what can change.",
        "Conclusion: strategies can bring lasting change for specific tasks over months, but whether it transfers to everyday memory is less clear, and change depends on continued use and motivation (soft determinism)."
      ],
      evidence: [
        "Dresler et al. (2017): 23 memory athletes compared with matched controls; 51 novices randomly allocated to 6 weeks of loci training, working-memory training or none; loci trainees more than doubled recall of 72 words; gain persisted at 4 months",
        "Gilbert et al. (2023): 131 medical students, 78 used Anki; heavier use linked to 12.9% higher exam scores; quasi-experimental",
        "Kearins (1981): Aboriginal Australian children outperformed white Australian children at recalling object locations",
        "Reser (2021): Aboriginal place-based story methods improved medical students' recall"
      ],
      pitfalls: [
        "Describing strategies without ever discussing change (how much, how, how long).",
        "Treating Gilbert et al. as proof that Anki causes better grades: it was a self-selected sample.",
        "Giving no judgement: 'to what extent' needs a clear, reasoned answer."
      ]
    },
    {
      id: "C8", concept: "perspective", area: "the role of schema in behaviour and/or cognition", cmd: "discuss",
      q: "Discuss perspective with regard to the role of schema in behaviour and/or cognition. [15]",
      scaffold: {
        name: "The perspective structure",
        parts: [
          "Introduction: define perspective; schema theory as a cognitive theory; line of argument",
          "Perspective 1 (cognitive): schemas as mental frameworks guiding encoding and retrieval",
          "Brief evaluation of the lens: what it can and cannot show",
          "Perspective 2 (sociocultural): schemas are learned within a culture",
          "Perspective 3 (biological): where schema-based processing happens in the brain",
          "Conclusion: why the perspectives together explain more"
        ]
      },
      plan: [
        "Introduction: perspective = the lens used to explain behaviour and cognition. Schema theory is a cognitive theory. Argue: the cognitive lens explains how schemas work, the sociocultural lens explains where they come from, and the biological lens gives them a physical basis.",
        "Paragraph 1 (cognitive lens): Bransford and Johnson: a schema improves recall only when activated at encoding. Anderson and Pichert: switching perspective brought back new details, so schemas also act at retrieval. Limit: Cohen says 'schema' is vague and only inferred, which risks circular explanation.",
        "Paragraph 2 (sociocultural lens): Bartlett: British participants rationalised a Native American story ('canoe' to 'boat'), so cultural schemas shaped recall. Martin and Halverson: children changed gender-inconsistent pictures when recalling them. Scripts differ between cultures.",
        "Paragraph 3 (biological lens): Mahon et al.: living and non-living objects are processed in different visual areas, even in blind people. The medial prefrontal cortex and hippocampus combine new information with prior knowledge. This answers Cohen's criticism in part, but shows where, not what a schema contains.",
        "Conclusion: each lens covers a gap in the others, so a full account of schemas needs all three."
      ],
      evidence: [
        "Bransford and Johnson (1972): topic-before group understood and recalled more than topic-after and no-topic groups",
        "Anderson and Pichert (1978): burglar or homebuyer perspective; switching perspective recalled 7.1% more new-perspective information",
        "Bartlett (1932): War of the Ghosts; levelling, sharpening, rationalisation",
        "Martin and Halverson (1983): 48 children aged 5 to 6 distorted gender-inconsistent pictures a week later",
        "Mahon et al. (2009): category-specific processing in the visual cortex, even in blind people"
      ],
      pitfalls: [
        "Treating schema theory as a cognitive model of memory.",
        "Evaluating Bartlett's method (unstandardised, British sample) instead of what the sociocultural lens explains.",
        "Listing three perspectives one after the other without comparing them or reaching a conclusion."
      ]
    }
  ],

  /* Section C markbands, paraphrased. Best fit across three strands. */
  bands: [
    { range: "13-15",
      k: "Knowledge of both the area of study and the concept is fully explained and clearly aimed at the question.",
      a: "Critical analysis is well developed. Links between the concept and the area of study run through the whole essay and are fully explained. The conclusion is clearly reasoned and consistent with the argument.",
      t: "Terminology is accurate and precise. Points are relevant, accurate and detailed." },
    { range: "10-12",
      k: "The demands of the question are addressed. Knowledge is mostly explained rather than just described.",
      a: "There is critical analysis, but it is not fully developed. Links are included and explained. The conclusion is consistent with the argument.",
      t: "Terminology is mostly appropriate. Points are accurate but could be more detailed." },
    { range: "7-9",
      k: "The demands of the question are only partly met. Knowledge is partly explained.",
      a: "Analysis is undeveloped. Links are explained but only partly relevant. The conclusion is not always consistent with the argument.",
      t: "Terminology is sometimes appropriate. Points lack accuracy and development." },
    { range: "4-6",
      k: "Some understanding of the question. Knowledge is described rather than explained.",
      a: "Mostly descriptive. Links are stated rather than explained and are only partly relevant. The conclusion is simplistic.",
      t: "Terminology is often misused. Points are vague." },
    { range: "1-3",
      k: "Little grasp of the question. Knowledge is very limited and contains errors.",
      a: "Descriptive or superficial. Links are missing or irrelevant. The conclusion is superficial or inconsistent.",
      t: "Terminology is absent or misused." }
  ],

  /* Sentence stems for writing about each concept precisely (avoid bare verdicts such as 'the study was biased'). */
  stems: {
    bias: [
      "A possible source of researcher bias here is ..., because the researcher ...",
      "Sampling bias limits how far these findings can be generalised to ..., since the sample was ...",
      "The risk of participant bias was reduced by ..., which makes it less likely that ...",
      "This bias threatens the validity of the claim that ..., because ...",
      "Using one approach is a choice of perspective, not a bias; the bias would be ...",
      "Bias also operates inside the process being studied: ... leads people to ..."
    ],
    causality: [
      "A causal claim is supported by ..., because the IV was manipulated while ... was controlled.",
      "The causal claim is limited by ..., since ... could also explain the change.",
      "This is correlational evidence: it hints at a causal link, but it cannot rule out ...",
      "... may act as a moderating variable, since the effect appeared only when ...",
      "The proposed mechanism is ..., but it was inferred rather than measured directly.",
      "This supports a short-term causal effect, but not a long-term one, because ..."
    ],
    change: [
      "This suggests that ... can change when ..., which fits a soft determinist view.",
      "The mechanism of change appears to be ..., as shown by ...",
      "The change was measured after ..., so we cannot tell whether it lasts beyond ...",
      "Whether the change happens depends partly on the person's agency and self-efficacy, because ...",
      "A barrier to change here is ..., which means ...",
      "Our understanding of ... has itself changed, because later research showed ..."
    ],
    measurement: [
      "The construct of ... was operationalised as ...",
      "This measure is valid to the extent that ..., but it may actually capture ...",
      "Because ... cannot be observed directly, it has to be inferred from ...",
      "Reliability is strengthened by ..., such as ...",
      "Triangulating ... with ... gives a fuller measure of ...",
      "A self-report measure of ... may be distorted by ..."
    ],
    perspective: [
      "From a cognitive perspective, ... is explained as ...",
      "A biological perspective adds ... by showing where and how ...",
      "A sociocultural perspective suggests that ... is shaped by ...",
      "This lens explains what happens, but not why, so ...",
      "Taking one perspective is a deliberate choice of lens, but it leaves out ...",
      "Combining these perspectives shows that ..."
    ],
    responsibility: [
      "Researchers have a responsibility to ..., which was met / not fully met when ...",
      "Applying ... raises a question of responsibility, because it could be used to ...",
      "To use these findings responsibly, practitioners should ...",
      "These findings should be presented cautiously, because ...",
      "Consent is a concern here because the participants were ...",
      "A culturally aware use of ... would ..."
    ]
  },

  /* Three balanced mock papers: each mixes learning and cognition topics and avoids repeating a topic within a paper. */
  mocks: [
    { title: "Mock paper 1", A: ["A1", "A9"], B: ["B4", "B10"], C: ["C2", "C6"] },
    { title: "Mock paper 2", A: ["A2", "A6"], B: ["B3", "B9"], C: ["C4", "C7"] },
    { title: "Mock paper 3", A: ["A12", "A8"], B: ["B2", "B8"], C: ["C1", "C5"] }
  ]
};
