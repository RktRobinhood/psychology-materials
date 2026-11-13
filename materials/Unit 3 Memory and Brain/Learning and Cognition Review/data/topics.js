/* Odyssey: The Long Way Home. Unit 1 Learning and Cognition.
   Topic lessons (ODY.topics) and drill content (ODY.drills).
   All prose is original. Facts come from design/unit-1-review/research/ digests.
   Voice lines are spoken aloud by the Chronicler (see narrator bible). */
window.ODY = window.ODY || {};

ODY.topics = {

  /* ------------------------------------------------------------------ */
  concepts: {
    name: "The six concepts", short: "Concepts", paper: "C",
    hook: "Section C marks the concept, not the study: learn these six lenses and any area of study becomes an argument.",
    voice: [
      "Every sailor on this voyage sees the sea through some lens or other. Paper 1 asks you to name yours. Six concepts do the work: bias, causality, change, measurement, perspective and responsibility.",
      "A perspective is the pair of glasses you choose to wear. Bias is the smudge on them that you did not notice. Studying memory through biology alone is a choice of glasses, not a smudge.",
      "Section C hands you a concept and an area of study. Keep both on the table in every paragraph. An essay about bias with no memory research in it is simply a lecture on smudges.",
      "Try this before the next island. Take any study you know and ask it one question for each concept. Whichever question gives you the most to say is where your essay plan begins."
    ],
    tutor: [
      "Section C of Paper 1 is built on six concepts: bias, causality, change, measurement, perspective and responsibility. Every Section C question pairs one of these concepts with one area of study from a context.",
      "The concept is the focus, but the area of study must stay present in every paragraph. An essay that discussed only bias, with no real research content, was capped at about nine marks out of fifteen.",
      "Keep perspective and bias apart. A perspective is a deliberate lens, such as the biological or cognitive approach. Bias is a systematic error that distorts results without anyone intending it. Choosing one approach is a perspective, not a bias.",
      "Causality comes in degrees and shapes: linear, domino and cyclical. A correlation is a hint that can be strengthened, not a dead end, so say what supports or limits a causal claim and why.",
      "The most common mistake is the empty verdict, such as saying the study was biased or causality was low. Instead, name the specific issue, explain why it strengthens or limits the claim, and link it to the content.",
      "Also use the right validity term. A narrow sample threatens population validity, which is about who the results apply to. Ecological validity is about how lifelike the task and setting are.",
      "In the exam, choose one of the two Section C questions and plan for two minutes with a scaffold, such as sampling, participant and researcher bias. Two well-developed strands beat four thin ones, and your conclusion should add nothing new."
    ],
    key: [
      "Every Section C question pairs one concept with one area of study from a context, for example 'Discuss bias with regard to one model of memory'.",
      "The concept is the focus. Study details earn little on their own; what counts is how the evidence shows the concept at work.",
      "Perspective is a deliberate lens; bias is an unnoticed distortion. Choosing a biological approach is a perspective, not a bias.",
      "Causality comes in degrees and shapes: linear, domino and cyclical. Correlation is a hint to be strengthened, not a dead end.",
      "Planning scaffolds: Bias SPR, Causality 3Ms, Change MIT, Measurement CTC, Responsibility AEAC. Two well-developed strands are enough.",
      "Avoid verdicts such as 'the study was biased' or 'causality was low'. Say what strengthens or limits a claim, and why.",
      "A narrow sample threatens population validity (who the results generalise to), not ecological validity (how lifelike the task and setting are)."
    ],
    terms: [
      ["Bias", "A systematic error in thinking or research that pushes results in one direction and threatens validity, usually without anyone intending it."],
      ["Causality", "Whether, and how confidently, we can claim that one variable produces a change in another, and what shape that cause takes."],
      ["Change", "How behaviour, cognition and knowledge change over time, and how much agency people have to change them."],
      ["Measurement", "How abstract constructs are operationalised and recorded, and how valid and reliable those measures are."],
      ["Perspective", "A deliberate lens, such as biological, cognitive or sociocultural, that shapes which questions are asked and what counts as an explanation."],
      ["Responsibility", "The ethical duties of researchers and practitioners to participants, clients and society, including how findings are reported and used."],
      ["Operationalisation", "Defining a construct, such as aggression or memory, as something that can be observed and measured."],
      ["Triangulation", "Checking a finding with more than one method, data source or researcher to strengthen confidence in it."],
      ["Soft determinism", "The middle ground the cognitive approach takes: behaviour is influenced by factors, but changing how we think can change what we do."],
      ["WEIRD sample", "Participants from Western, educated, industrialised, rich and democratic societies, who may not represent people in general."],
      ["Demand characteristics", "Cues that let participants guess the aim of a study, so they change their behaviour to fit (or defy) it."]
    ],
    perConcept: {
      bias: {
        scaffold: "SPR: Sampling bias, Participant bias, Researcher bias.",
        terms: [
          ["Sampling bias", "The sample over-represents some groups, for example only army men or only university students."],
          ["Participant bias", "Participants change behaviour because they are studied: demand characteristics, social desirability, expectancy effects."],
          ["Researcher bias", "The researcher's expectations shape how data are collected or scored, for example confirmation bias in coding."],
          ["Cultural bias", "Judging all people by one culture's norms; linked to WEIRD samples and an etic lens."],
          ["Recall bias", "Errors in what people remember and report about their own past."]
        ],
        stems: ["The risk of researcher bias is reduced by ... because ...", "Because the sample consisted only of ..., the findings may not generalise to ...", "A single-approach study is a choice of perspective, not a bias; the bias lies in ..."]
      },
      causality: {
        scaffold: "3Ms: Methodology (is a true experiment possible?), Moderating variables, Measurement.",
        terms: [
          ["Linear causality", "An IV is manipulated under control, the cause comes before the effect, and the effect traces back to one cause."],
          ["Domino causality", "Each effect becomes the next cause, in a chain that may branch."],
          ["Cyclical causality", "Cause and effect feed back on each other in a loop."],
          ["Bidirectional ambiguity", "In a correlation, we cannot tell which variable is influencing the other."],
          ["Internal validity", "How confident we are that the IV, and not something else, caused the change in the DV."],
          ["Counterbalancing", "Varying the order of conditions across participants so order effects cancel out."]
        ],
        stems: ["A causal claim is supported by ... but limited by ...", "Internal validity is strengthened by ... because ...", "Because the IV occurred naturally, ... cannot be ruled out as an alternative cause."]
      },
      change: {
        scaffold: "MIT: Mechanisms, Impact, Time (longitudinal designs, temporal validity).",
        terms: [
          ["Agency", "A person's capacity to act intentionally, regulate themselves and take responsibility for change."],
          ["Self-efficacy", "Belief in one's own ability to carry out a behaviour successfully."],
          ["Locus of control", "Whether people see outcomes as controlled by themselves (internal) or by outside forces (external)."],
          ["Environmental determinism", "The view that behaviour is shaped entirely by the environment, as in strict behaviourism."],
          ["Temporal validity", "Whether findings still hold at a later time."]
        ],
        stems: ["This mechanism suggests behaviour could be changed by ...", "Over time, ... changed, which shows ...", "Knowledge about ... changed when later research showed ..."]
      },
      measurement: {
        scaffold: "CTC: Constructs, Tools, Context and culture.",
        terms: [
          ["Construct validity", "Whether a measure really captures the construct it claims to, such as aggression or cognitive load."],
          ["Reliability", "Whether a measure gives consistent results across time, raters or repetitions."],
          ["Inter-rater reliability", "Agreement between different observers scoring the same behaviour."],
          ["Self-report", "Data from what participants say about themselves; open to lack of insight and social desirability."],
          ["Reflexivity", "A qualitative researcher's awareness of how their own views shape the data."],
          ["Isolating variables", "Designing a task so it measures one process, not several at once."]
        ],
        stems: ["This measure captures ... but may miss ...", "Operationalising ... as ... raises the question of whether ...", "Triangulating ... with ... would strengthen confidence that ..."]
      },
      perspective: {
        scaffold: "Introduction, describe the model or theory, perspective 1 with its assumptions or support, brief evaluation of that perspective, perspective 2, conclusion on why one lens is not enough.",
        terms: [
          ["Cognitive approach", "Explains behaviour through mental processes such as memory and attention, studied scientifically."],
          ["Biological approach", "Explains behaviour through the brain, genes and hormones, for example HM's hippocampal damage."],
          ["Behaviourist perspective", "Explains behaviour through observable stimuli, responses and consequences, ignoring the mind."],
          ["Positivism", "Objective, quantitative, reductionist research that looks for general laws, as in Skinner's work."],
          ["Interpretivism", "Subjective, qualitative, holistic research that seeks meaning rather than laws."],
          ["Indigenous perspective", "Sees physical, spiritual, emotional and mental life as interconnected."]
        ],
        stems: ["Viewed through a cognitive lens, ...; a biological lens adds ...", "The cognitive perspective explains what happens and how, while the biological perspective shows ...", "Neither lens alone can explain ..., because ..."]
      },
      responsibility: {
        scaffold: "AEAC: Agency, Ethics, Application (avoid stigma, determinism and deficit framing), Cultural awareness.",
        terms: [
          ["Informed consent", "Participants agree to take part knowing what the study involves; difficult with young children or amnesic patients."],
          ["Right to withdraw", "Participants may leave at any time; harder in a case study or with a hierarchy, such as soldiers."],
          ["Debriefing", "Explaining the true aim and checking wellbeing after a study, especially one using deception."],
          ["Deception", "Misleading participants about a study; acceptable only when essential and followed by a debrief."],
          ["Confidentiality", "Protecting participants' identities, for example referring to a patient by initials."],
          ["Socially sensitive research", "Research whose findings could harm or stigmatise a group if reported carelessly."]
        ],
        stems: ["A responsible application of this finding would ...", "Reporting these results carelessly could ..., so researchers should ...", "The duty of care to participants was addressed by ... but ..."]
      }
    },
    studies: [],
    strengths: [], limitations: [],
    misconceptions: [
      ["A study that uses only one approach is biased.", "Choosing a lens is a perspective. Bias is an unnoticed error that distorts results."],
      ["A narrow sample lowers ecological validity.", "It limits population validity, who the results apply to. Ecological validity concerns how lifelike the task and setting are."],
      ["Correlation is not causation, so correlational studies say nothing about cause.", "Correlation is a hint. Temporality, consistency and dose-response can strengthen a causal case."],
      ["'The study was unethical' is a strong evaluation.", "It is a verdict with no reasoning. Name the issue, who it affects and how it was, or could be, managed."],
      ["Ethics belongs in every Section C essay.", "Only when the concept calls for it. In a perspective essay, ethics and generalisability earn no credit."],
      ["An age difference between groups is participant bias.", "It is a confounding variable. Participant bias means things like demand characteristics and social desirability."]
    ],
    examTips: [
      "Section C: choose one of two questions. Each names a concept, an area of study and a context.",
      "Keep the area of study in every paragraph. An essay that discussed only bias, with no real content, was capped at about 9.",
      "Link concept and content throughout, not in a final paragraph. End with a conclusion that follows from your argument and adds nothing new.",
      "Plan with a scaffold in two minutes, but two developed strands beat four thin ones.",
      "Unpack every technical term you use; examiners reward precise terminology in the third strand."
    ]
  },

  /* ------------------------------------------------------------------ */
  classical: {
    name: "Classical conditioning", short: "Classical", paper: "A, B and C",
    hook: "Why a phone buzz can make your stomach drop before you have read a single word.",
    voice: [
      "The ship's bell rang before every meal, and before long the crew grew hungry at the bell alone. Nobody taught them that. Two things simply arrived together often enough to become linked.",
      "That is classical conditioning. A neutral stimulus is paired with one that already triggers a reflex. After enough pairings, the once neutral stimulus triggers a similar response on its own.",
      "Pavlov did it with dogs, food and a metronome. Write bell in the exam and nobody will take a mark away, but you and I will know the truth.",
      "Your turn. In the next scene, find the unconditioned stimulus, the neutral stimulus that becomes conditioned, and the conditioned response, before I say a word."
    ],
    tutor: [
      "Classical conditioning is learning by association. A neutral stimulus is repeatedly paired with an unconditioned stimulus that already triggers a reflex, until the neutral stimulus triggers a similar response on its own.",
      "The unconditioned stimulus produces the unconditioned response without learning. After pairing, the neutral stimulus becomes the conditioned stimulus, and it produces the conditioned response. If the pairing stops, the response fades, which is called extinction.",
      "In Pavlov's 1903 study, food made dogs salivate as a reflex. A metronome was repeatedly sounded just before the food, and eventually the metronome alone produced salivation. Behaviour can be learned when a stimulus becomes associated with a biologically significant one.",
      "A strength is tight laboratory control: the pairing is isolated as the cause, and salivation can be measured objectively. A limitation is that the theory is reductionist, ignoring thought and expectation, and much of the evidence comes from animals.",
      "The most common mistake is confusing classical and operant conditioning. In classical conditioning, a stimulus comes before a reflexive response. Learning from consequences that follow a behaviour is operant conditioning. Also, the conditioned stimulus and the unconditioned stimulus are never the same thing.",
      "Classical conditioning can appear in Sections A, B and C. In Section A, write one paragraph using all five terms, then a second that maps each term onto one example. In Section B, map the terms onto the scenario explicitly.",
      "Give only one example, because only the first example is marked. In Section C, perspective and responsibility are strong angles: behaviourist versus biological evidence, and the historical misuse of aversion therapy."
    ],
    key: [
      "Classical conditioning is learning by association: a neutral stimulus (NS) is repeatedly paired with an unconditioned stimulus (UCS) that triggers a reflex, the unconditioned response (UCR).",
      "After pairing, the NS becomes a conditioned stimulus (CS) that produces a conditioned response (CR) on its own.",
      "Extinction: if the CS keeps appearing without the UCS, the CR fades.",
      "The stimulus comes before the response, and the response is a reflex. In operant conditioning, a consequence follows a behaviour.",
      "Pavlov's work laid the foundation of behaviourism: an environmental stimulus can become linked with a biologically significant one.",
      "Applications: aversion therapy (a nausea drug paired with alcohol), fear extinction in PTSD treatment, building a positive feeling towards reading.",
      "Garcia (1955): rats learned a taste aversion after a single pairing, so conditioning does not always need many trials."
    ],
    terms: [
      ["Neutral stimulus (NS)", "A stimulus that produces no particular response before conditioning, such as a metronome for a dog."],
      ["Unconditioned stimulus (UCS)", "A stimulus that triggers a reflex without any learning, such as food."],
      ["Unconditioned response (UCR)", "The unlearned, reflexive response to the UCS, such as salivating at food."],
      ["Conditioned stimulus (CS)", "A former NS that now triggers a response because it has been paired with the UCS."],
      ["Conditioned response (CR)", "The learned response to the CS, often the same behaviour as the UCR."],
      ["Extinction", "The fading of a CR when the CS is repeatedly presented without the UCS."],
      ["Taste aversion", "A learned avoidance of a taste that has been paired with illness, sometimes after one pairing."],
      ["Aversion therapy", "A treatment that pairs an unwanted behaviour, such as drinking alcohol, with an unpleasant stimulus such as nausea."],
      ["Behaviourism", "The perspective that explains behaviour through observable stimuli and responses, treating the mind as a black box."]
    ],
    studies: [
      {
        name: "Pavlov (1903)", tag: "Salivating dogs",
        aim: "To explain why dogs began salivating before food arrived, a chance observation Pavlov made while studying digestion.",
        method: "Laboratory experiments with dogs. Food (UCS) produced salivation (UCR). A metronome (NS) was repeatedly sounded just before food, and salivation was recorded.",
        results: "After repeated pairings, the metronome alone (now a CS) produced salivation (a CR).",
        conclusion: "Behaviour can be learned when an environmental stimulus becomes associated with a biologically significant one. This became the foundation of behaviourism.",
        eval: [
          "+ Tight laboratory control isolates the pairing as the cause of the new response.",
          "+ Salivation is an objective, quantifiable response.",
          "- Inner mental states are ignored, so the account is reductionist.",
          "- Dogs serve as an animal model; generalising to human learning is an assumption."
        ],
        concepts: {
          causality: "Careful control of the pairing means the association, not some other factor, is the likely cause of the conditioned response.",
          measurement: "Salivation can be objectively quantified, but this focus leaves out anything the dog might think or feel.",
          perspective: "A behaviourist, reductionist lens that assumes learning in dogs generalises to humans."
        }
      },
      {
        name: "Garcia (1955)", tag: "Taste aversion in rats",
        aim: "To investigate whether a taste could become associated with illness.",
        method: "Rats drank saccharin-flavoured water while being exposed to radiation, which made them ill.",
        results: "After a single pairing, the rats avoided saccharin for more than a month.",
        conclusion: "A taste (CS) can be linked to illness after one pairing, so classical conditioning does not always need many repetitions.",
        eval: [
          "+ A controlled procedure makes the pairing the likely cause of the avoidance.",
          "+ Explains real food aversions that follow a single bout of illness.",
          "- Making animals ill with radiation raises ethical questions.",
          "- Findings from rats must be generalised to humans with care."
        ],
        concepts: {
          responsibility: "Deliberately making animals ill must be justified by the value of the knowledge gained.",
          change: "One pairing produced a lasting change in behaviour, showing how quickly some learning can happen."
        }
      },
      {
        name: "Thompson (1983)", tag: "Eye-blink conditioning and the cerebellum",
        aim: "To find which brain structure is needed for a classically conditioned response.",
        method: "Rabbits were classically conditioned to blink in response to a stimulus, and the role of the cerebellum in the learned blink was investigated.",
        results: "The interpositus nucleus of the cerebellum was essential for the conditioned response.",
        conclusion: "Classical conditioning has an identifiable biological basis, so a behaviourist account can be complemented by a biological one.",
        eval: [
          "+ Adds a biological mechanism to a behaviourist theory.",
          "- The ethics of the animal procedures were debated."
        ],
        concepts: {
          perspective: "Shows a biological lens adding a mechanism to a behaviourist explanation of learning.",
          responsibility: "Invasive animal research raises questions about whether the knowledge justifies the harm."
        }
      },
      {
        name: "Meyer and Chesser (1970)", tag: "Aversion therapy for alcohol",
        aim: "To use classical conditioning to reduce drinking in people with alcohol problems.",
        method: "Alcohol was repeatedly paired with apomorphine, a drug that causes nausea, so that alcohol would become a CS for sickness.",
        results: "Some patients avoided alcohol afterwards, but some relapsed.",
        conclusion: "Conditioned aversion can reduce drinking, but the learned association may weaken once alcohol is no longer paired with the drug.",
        eval: [
          "+ A direct real-world application of classical conditioning.",
          "- Relapse suggests the learned aversion can fade.",
          "- Deliberately inducing nausea is unpleasant, and aversion methods were historically misused as so-called conversion therapy."
        ],
        concepts: {
          responsibility: "Aversion methods were misused as conversion therapy; today the APA and BPS oppose such practices.",
          change: "Relapse shows that conditioned changes in behaviour may not last."
        }
      }
    ],
    strengths: [
      "Strong experimental support from controlled laboratory research such as Pavlov's.",
      "Practical applications: aversion therapy and fear-extinction treatments for PTSD.",
      "Responses such as salivation are objective and measurable, so predictions are testable.",
      "Biological evidence (Thompson, 1983) identifies brain structures involved in conditioned responses."
    ],
    limitations: [
      "Reductionist: explains learning as stimulus and response, ignoring thought and expectation.",
      "Much evidence comes from animals; generalising to humans is an assumption.",
      "Conditioned responses can extinguish, so therapies may not last (Meyer and Chesser, 1970).",
      "Explains reflexive responses, not how new voluntary behaviours are learned, which operant conditioning and SLT address."
    ],
    misconceptions: [
      ["Pavlov used a bell.", "He used a metronome. Examiners will not penalise 'bell', but know the real stimulus."],
      ["The CS and the UCS are the same thing.", "The UCS triggers the reflex without learning. The CS triggers a response only after pairing."],
      ["The UCR and the CR must be different behaviours.", "Often they are the same behaviour, such as salivation. What differs is the stimulus that triggers it."],
      ["Classical conditioning is learning from consequences.", "That is operant conditioning. In classical conditioning one stimulus comes to predict another."]
    ],
    examTips: [
      "Section A, 'Explain classical conditioning with reference to one example': paragraph one uses NS, UCS, UCR, CS and CR; paragraph two maps each term onto one example.",
      "Section B change questions: map the scenario explicitly, for example favourite music = UCS, reading = NS that becomes the CS, pleasure = CR.",
      "Give one example only. Only the first example is marked.",
      "Section C: perspective (behaviourist versus biological evidence) and responsibility (the misuse of aversion therapy) are rich angles."
    ]
  },

  /* ------------------------------------------------------------------ */
  operant: {
    name: "Operant conditioning", short: "Operant", paper: "A, B and C",
    hook: "Loyalty cards, likes and lucky socks all run on the same machinery: behaviour shaped by what happens next.",
    voice: [
      "Each time you solve a riddle, a chest creaks open. Notice how the next riddle suddenly looks rather appealing. What follows a behaviour changes how often it happens. That is operant conditioning.",
      "Positive means something is added. Negative means something is taken away. Neither word means good or bad. Reinforcement makes a behaviour more likely, and punishment makes it less likely.",
      "A seatbelt buzzer that stops when you buckle up is not a punishment. Something unpleasant was removed, and buckling up increased. Negative reinforcement. It catches nearly everyone once.",
      "Skinner's pigeons were fed whatever they did, yet several repeated odd little rituals as if those had earned the food. Before judging them, consider your lucky pen. Then sort the next consequences."
    ],
    tutor: [
      "Operant conditioning is learning from consequences: a behaviour becomes more or less likely depending on what follows it. It builds on Thorndike's Law of Effect, and Skinner extended it.",
      "Reinforcement makes a behaviour more likely, and punishment makes it less likely. Positive means something is added, and negative means something is removed. Neither word means good or bad.",
      "That gives four combinations. Positive reinforcement adds something pleasant. Negative reinforcement removes something unpleasant. Positive punishment adds something unpleasant. Negative punishment removes something pleasant. Always classify a consequence by its effect on future behaviour, not by what anyone intended.",
      "In Skinner's 1948 study, pigeons were given food at fixed intervals whatever they did. Six of eight developed repeated behaviours, such as turning in circles. Skinner concluded that whatever the bird happened to be doing was accidentally reinforced, and used this to explain superstition.",
      "A strength is strong experimental support from controlled animal research, with behaviour that is observable and measurable. A limitation is that it treats the mind as a black box, and Bandura showed that learning can happen without direct reinforcement.",
      "The most common mistake is calling negative reinforcement a punishment. Negative reinforcement removes something unpleasant and increases a behaviour, as when a seatbelt buzzer stops once you buckle up. Punishment always decreases behaviour.",
      "Operant conditioning can appear in Sections A, B and C. In Section B, choose one strategy rather than all four quadrants, apply it to details in the scenario, and use the word because to explain why it would work."
    ],
    key: [
      "Operant conditioning: behaviour changes according to its consequences. It builds on Thorndike's Law of Effect, and Skinner extended it.",
      "Reinforcement increases a behaviour; punishment decreases it. Positive means something is added; negative means something is removed.",
      "Four quadrants: positive reinforcement (add something pleasant), negative reinforcement (remove something unpleasant), positive punishment (add something unpleasant), negative punishment (remove something pleasant).",
      "A consequence is defined by its effect on future behaviour, not by intention: praise is not automatically reinforcement.",
      "Schedules: fixed ratio, variable ratio, fixed interval, variable interval. Variable ratio produces fast, persistent responding, as with slot machines.",
      "Shaping builds a new behaviour by reinforcing successive approximations towards the target.",
      "ABC of behaviour: antecedent, behaviour, consequence.",
      "Reinforcement usually works better than punishment, which can bring emotional side effects and resentment."
    ],
    terms: [
      ["Law of Effect", "Thorndike: behaviour followed by a satisfying consequence is more likely to be repeated in that situation."],
      ["Positive reinforcement", "Adding something pleasant after a behaviour, so the behaviour becomes more likely."],
      ["Negative reinforcement", "Removing something unpleasant after a behaviour, so the behaviour becomes more likely."],
      ["Positive punishment", "Adding something unpleasant after a behaviour, so the behaviour becomes less likely."],
      ["Negative punishment", "Removing something pleasant after a behaviour, so the behaviour becomes less likely."],
      ["Shaping", "Reinforcing successive approximations: first rough steps towards a target behaviour, then only closer ones."],
      ["Fixed ratio", "Reinforcement after a set number of responses, such as every tenth coffee free."],
      ["Variable ratio", "Reinforcement after an unpredictable number of responses, such as a slot machine."],
      ["Fixed interval", "Reinforcement for the first response after a set amount of time."],
      ["Variable interval", "Reinforcement for the first response after an unpredictable amount of time."],
      ["Accidental reinforcement", "A behaviour is strengthened because a reward happened to follow it, though the reward did not depend on it."],
      ["ABC of behaviour", "Antecedent (the cue), Behaviour, Consequence: the sequence operant conditioning analyses."]
    ],
    studies: [
      {
        name: "Skinner (1948)", tag: "Superstition in the pigeon",
        aim: "To see what pigeons would do if food arrived at regular intervals, regardless of their behaviour.",
        method: "Pigeons were placed in a box where food was delivered automatically at fixed intervals (15 seconds in the setting Skinner reported), whatever the bird was doing.",
        results: "Six of eight pigeons developed distinctive repeated behaviours, such as turning in circles or tossing the head.",
        conclusion: "Skinner interpreted this as accidental reinforcement: whatever the bird happened to be doing when food arrived was strengthened. He used it to explain human superstition.",
        eval: [
          "+ A controlled setting isolates the timing of food as the only varying factor.",
          "+ Offers a simple explanation of superstitious behaviour.",
          "- Staddon and Simmelhag (1971) argued some repeated actions were time-linked, species-typical behaviours, not mistaken associations.",
          "- Generalising from pigeons to human superstition is a big leap."
        ],
        concepts: {
          causality: "Food did not depend on behaviour, so the study tests whether timing alone can create a learned link.",
          perspective: "A behaviourist lens ignores what, if anything, the bird expects; later researchers proposed a rival explanation."
        }
      },
      {
        name: "Thorndike (1898)", tag: "Cats in puzzle boxes",
        aim: "To study how animals learn to solve a problem by trial and error.",
        method: "Cats were placed in a puzzle box with a latch, with food outside. The time taken to escape was recorded over repeated trials.",
        results: "Escape time fell across trials as the cats repeated the actions that opened the box.",
        conclusion: "The Law of Effect: responses followed by satisfying outcomes become more likely in that situation.",
        eval: [
          "+ Escape time is an objective measure recorded over many trials.",
          "- Animal research: generalising to human learning needs care."
        ],
        concepts: {
          measurement: "Learning was operationalised as falling escape time, an objective behavioural measure.",
          perspective: "The foundation of a behaviourist view that explains learning without reference to the mind."
        }
      }
    ],
    strengths: [
      "Strong experimental support from controlled animal research such as the Skinner box and the puzzle box.",
      "Practical applications: classroom behaviour plans, loyalty schemes and habit change.",
      "Explains why some behaviours persist, such as gambling on a variable ratio schedule.",
      "Behaviour is observable and measurable, so predictions can be tested."
    ],
    limitations: [
      "Reductionist: treats the mind as a black box and ignores expectations and thinking.",
      "Humans work for delayed rewards, such as saving or exercise, which a simple stimulus and response account struggles to explain.",
      "Bandura showed learning can happen without direct reinforcement.",
      "Much evidence comes from rats and pigeons; generalising to humans is an assumption.",
      "The same consequence, such as a grade, can reinforce one person and punish another."
    ],
    misconceptions: [
      ["Negative reinforcement is a kind of punishment.", "Negative reinforcement removes something unpleasant and increases behaviour. Punishment always decreases behaviour."],
      ["Positive means pleasant and negative means unpleasant.", "Positive means added, negative means removed. The labels describe the contingency, not how it feels."],
      ["Detention is always a punishment.", "Only if the behaviour decreases. Classify by the effect on future behaviour, not by intention."],
      ["A Section B answer should use all four quadrants.", "One well-chosen strategy, applied to the scenario and justified, beats a list."],
      ["Skinner built the box to punish animals until they learned tricks.", "It let him control consequences precisely and measure their effect over many trials."]
    ],
    examTips: [
      "Section A: define operant conditioning with the quadrant terms, then give one example with each term mapped onto it.",
      "Section B change questions: choose one strategy, apply it to scenario details and explain why it would work, for example why a fixed ratio reward beats rewarding every on-time arrival.",
      "Write 'because': Mads arrives on time more often because each on-time arrival earns a point towards a reward he values.",
      "Section C: 'Discuss perspective with regard to operant conditioning' invites behaviourist, cognitive and social learning lenses."
    ]
  },

  /* ------------------------------------------------------------------ */
  slt: {
    name: "Social learning theory", short: "SLT", paper: "A, B and C",
    hook: "You have learned more from watching people than from any textbook; Bandura explains how, and when you will actually copy what you saw.",
    voice: [
      "A young sailor watched an older hand climb the mast and win the captain's praise. By the next storm, the young sailor was climbing too. Nobody had rewarded him. He had watched.",
      "That is social learning theory. We learn by observing models, and seeing a model rewarded, which Bandura called vicarious reinforcement, makes us more likely to copy them.",
      "Watching is not enough, though. You must pay attention, retain what you saw, be able to reproduce it, and be motivated to bother. Four conditions. Miss one and the lesson stays in the audience.",
      "Bandura's children watched an adult attack an inflatable doll, and many then did the same, sometimes word for word. Before the next island, can you name all four conditions without looking?"
    ],
    tutor: [
      "Social learning theory, from Bandura, says that people learn by observing and imitating models, without needing direct reinforcement themselves. A model is anyone whose behaviour is observed, such as a parent, a peer, a teacher or a media figure.",
      "Learning depends on four mediating processes. Attention means noticing the model. Retention means remembering what you saw. Reproduction means being able to perform it. Motivation means wanting to perform it, based on the outcomes you expect.",
      "Imitation is more likely with vicarious reinforcement, which means seeing the model rewarded, and with identification, which means feeling similar to the model, for example in age or gender. Self-efficacy, your belief that you can do it, supports reproduction.",
      "In the 1961 study by Bandura, Ross and Ross, seventy-two children aged three to nearly six watched an aggressive model, a non-aggressive model or no model. Those who saw aggression showed more physical and verbal aggression, often exact imitation. Aggression can be learned through observation.",
      "A strength of the theory is its range and support: it explains behaviours from aggression to eating, and mirror neurons offer a biological basis. A limitation is that its key evidence, hitting an inflatable doll, may measure play rather than aggression.",
      "The most common mistake is writing that people simply copy others. That earns about two marks out of four. Name attention, retention, reproduction and motivation, and show vicarious reinforcement and identification. Remember that self-efficacy is not one of the four processes.",
      "Social learning theory can appear in Sections A, B and C. In Section B, for example a recycling campaign, choose a model the students identify with, reward the model visibly, and explain each of the four processes using details from the scenario."
    ],
    key: [
      "Social learning theory: people learn by observing and imitating models, without needing direct reinforcement.",
      "Vicarious reinforcement: seeing a model rewarded makes imitation more likely.",
      "Four mediating processes: attention, retention, reproduction and motivation.",
      "Model factors: identification (similar age or gender), warmth, consistency, and whether the model's behaviour is rewarded.",
      "Self-efficacy supports reproduction; outcome expectancies drive motivation.",
      "Bandura, Ross and Ross (1961): children who watched an aggressive model imitated physical and verbal aggression.",
      "Applications: health campaigns such as Food Dudes; concerns about violent media and influencer food advertising.",
      "Biological support: mirror neurons fire both when an action is performed and when it is watched."
    ],
    terms: [
      ["Social learning theory", "Bandura's theory that behaviour is learned by observing and imitating others."],
      ["Model", "The person whose behaviour is observed, such as a parent, peer, teacher or media figure."],
      ["Vicarious reinforcement", "Learning that a behaviour pays off by seeing someone else rewarded for it."],
      ["Attention", "Noticing the model's behaviour; helped by the model's status and attractiveness, hurt by distraction."],
      ["Retention", "Remembering the observed behaviour so it can be used later."],
      ["Reproduction", "Being physically and mentally able to perform the observed behaviour."],
      ["Motivation", "Wanting to perform the behaviour, based on expected outcomes."],
      ["Identification", "Feeling similar to the model, for example in age or gender, which makes imitation more likely."],
      ["Self-efficacy", "Belief in one's ability to perform a behaviour successfully."],
      ["Outcome expectancy", "What a person expects will happen if they perform the behaviour."],
      ["Mirror neurons", "Neurons that fire both when an action is performed and when it is observed."]
    ],
    studies: [
      {
        name: "Bandura, Ross and Ross (1961)", tag: "The Bobo doll study",
        aim: "To test whether aggression can be learned by observing an adult model, and whether children imitate same-sex models more.",
        method: "72 children (36 boys, 36 girls) aged 3 to nearly 6 were matched on prior aggression. They watched an aggressive, non-aggressive or no model (male or female) for 10 minutes, were mildly frustrated, then observed for 20 minutes through a one-way mirror.",
        results: "Children who saw the aggressive model showed much more physical and verbal aggression, often exact imitation. Boys were more aggressive overall, and boys imitated the male model more.",
        conclusion: "Aggression can be learned through observation, with implications for violent media. The study did not test whether aggression is also innate.",
        eval: [
          "+ A true experiment with a control group and matching gives strong internal control.",
          "+ Systematic coded observation with high inter-rater reliability (r = 0.89).",
          "- Hitting an inflatable doll may be play, not aggression, so construct validity is doubtful.",
          "- Only short-term effects were measured, in a lab, with no follow-up.",
          "- Frustrating young children and possibly teaching them aggression raises ethical concerns."
        ],
        concepts: {
          causality: "A control group and high control support a causal claim, but only for short-term imitation in a lab.",
          measurement: "Behaviour was coded every 5 seconds with high inter-rater reliability, yet hitting a doll may not measure aggression.",
          bias: "Two observers knew the children, and the sample was an opportunity sample of university staff's children.",
          responsibility: "Consent from very young children is questionable, and they were deliberately frustrated with no follow-up."
        }
      },
      {
        name: "Coates et al. (2019)", tag: "Influencers and children's snacking",
        aim: "To test whether children eat more unhealthy food after seeing influencers with unhealthy snacks.",
        method: "Children aged 9 to 11 viewed mock Instagram posts of YouTubers with unhealthy food, healthy food or a non-food product, and their snack intake was then measured.",
        results: "The unhealthy-food group ate 26% more food overall (about 91 extra kcal) than the control group and 15% more than the healthy-food group, mainly unhealthy snacks. Healthy posts had no effect compared with the control.",
        conclusion: "Influencers can act as models that shape children's eating, but healthy models alone did not increase healthy eating.",
        eval: [
          "+ A realistic, modern media stimulus.",
          "+ A non-food control group allows a causal comparison.",
          "- Healthy posts had no effect, so modelling alone may not change eating for the better."
        ],
        concepts: {
          causality: "Comparison with a non-food control group supports a causal claim about the unhealthy posts.",
          responsibility: "Supports arguments for limiting influencer marketing of unhealthy food to children."
        }
      },
      {
        name: "Lowe et al. (2004)", tag: "Food Dudes",
        aim: "To test whether peer models plus rewards could increase children's fruit and vegetable intake.",
        method: "A quasi-experiment in two inner-city London schools. Children watched cartoon superhero peer models, the Food Dudes, eating fruit and vegetables, and received small rewards for eating them.",
        results: "Intake rose and was still higher at a 4-month follow-up; the biggest gains were among the children who ate least at the start.",
        conclusion: "Modelling combined with reinforcement can change a real health behaviour.",
        eval: [
          "+ A real-world setting with a follow-up.",
          "- Quasi-experimental: whole schools, not individuals, were compared.",
          "- Models and rewards were combined, so their separate effects are hard to untangle."
        ],
        concepts: {
          change: "The change in eating lasted at least four months, which suggests SLT can produce durable behaviour change.",
          causality: "Without random allocation of children, other school differences could explain some of the effect."
        }
      },
      {
        name: "Gallese et al. (1996)", tag: "Mirror neurons in macaques",
        aim: "To record premotor neuron activity in monkeys during action and observation.",
        method: "Activity of premotor neurons was recorded while a macaque reached for a peanut and while it watched a researcher do the same.",
        results: "The same neurons fired in both situations.",
        conclusion: "Mirror neurons offer a possible biological basis for learning by observation. Carr et al. (2003) later found similar brain areas active in humans imitating and observing emotional faces.",
        eval: [
          "+ Offers biological support for SLT.",
          "- Monkey data; human evidence comes from fMRI, which is correlational."
        ],
        concepts: {
          perspective: "A biological lens that supports a theory usually placed in the sociocultural approach."
        }
      }
    ],
    strengths: [
      "Robust: explains a wide range of behaviours, from aggression to eating habits.",
      "Makes predictions about which models will be imitated.",
      "Biological support from mirror neurons.",
      "Applied successfully in health campaigns such as Food Dudes."
    ],
    limitations: [
      "Hard to test in natural settings, so much evidence comes from the lab.",
      "Motivation, self-efficacy and attention are hard to measure.",
      "Leans towards nurture and cannot explain individual differences on its own.",
      "Key evidence (the Bobo doll) has doubtful construct validity: hitting a doll may be play."
    ],
    misconceptions: [
      ["SLT just means people copy others.", "Too thin for marks. Name attention, retention, reproduction and motivation, plus vicarious reinforcement and identification."],
      ["You only imitate models who are like you.", "Similarity helps through identification, but it is not required."],
      ["Seeing a behaviour means you will perform it.", "Without the ability or the motivation, observed behaviour may never be performed."],
      ["Bandura proved violent media causes aggression.", "The study showed short-term imitation with a doll in a lab, not long-term or real-world aggression."],
      ["Self-efficacy is one of the four processes.", "The four are attention, retention, reproduction and motivation. Self-efficacy supports reproduction."]
    ],
    examTips: [
      "SLT can be asked in Sections A and B, and 'the role of SLT in learning' can frame a Section C question.",
      "A 4/4 Section A answer names all four processes and shows vicarious reinforcement and identification inside the Bandura example. 'People copy others' earns about 2.",
      "Section B, for example a school recycling campaign: choose a model the students identify with, reward the model visibly, and explain each of the four processes using scenario details.",
      "Section C: Bandura (1961) is rich for causality, measurement, bias and responsibility."
    ]
  },

  /* ------------------------------------------------------------------ */
  schema: {
    name: "Schema theory", short: "Schema", paper: "A, B and C",
    hook: "Your memory is not a recording: it is a rebuild, and schemas are the blueprints.",
    voice: [
      "Describe a longship to a Greek sailor and he will picture a trireme with ambitions. We fit strange things into what we already know. That organised knowledge in the mind is called a schema.",
      "When new information fits, we assimilate it. When it will not fit, we accommodate: the schema is modified, or a new one is built. A child who calls a cow a doggie has assimilated it; learning the word cow is the renovation.",
      "Bartlett gave British readers an unfamiliar Native American legend. Their retellings grew shorter, more familiar and more sensible to them. Remembering, he argued, is reconstruction, not replay.",
      "One warning before the next island. Schema theory is a theory, not a model of memory. If a question asks for a cognitive model, reach for the multi-store model or the working memory model."
    ],
    tutor: [
      "A schema is a mental representation built from experience. It organises knowledge and guides attention, interpretation, recall and behaviour. Schema theory says we process new information through these existing structures, which makes processing fast and economical.",
      "When new information fits an existing schema, it is assimilated without changing the schema. When it does not fit, accommodation happens: the existing schema is modified, or a new schema is created. A script is a schema for a sequence of events.",
      "In Bartlett's 1932 study, British participants recalled an unfamiliar Native American legend, either repeatedly or passed from person to person. Both methods produced the same kinds of distortion: the story became shorter and more familiar. Remembering is active reconstruction shaped by schemas.",
      "A second study, by Bransford and Johnson in 1972, showed that knowledge must be activated at encoding. Participants told the topic before hearing a vague passage about washing clothes recalled more. Those told the topic afterwards were no better than those never told.",
      "A strength is that schema theory explains memory distortion, which neither the multi-store model nor the working memory model can. A limitation, from Cohen in 1993, is that a schema is too vague to observe or measure, which challenges construct validity.",
      "The most common mistake is offering schema theory as a cognitive model. It is a theory, not a model. Another is explaining reconstructive memory without first explaining schemas, assimilation and accommodation, which are the theory itself.",
      "Schema theory can appear in Sections A, B and C. In Section A, explain the theory before the example, then link Bartlett or Bransford and Johnson back to it. In Section C, Cohen's vagueness criticism is strong measurement material."
    ],
    key: [
      "A schema is a mental representation built from experience. It organises knowledge and guides attention, interpretation, recall and behaviour.",
      "Schemas make processing economical: schema-congruent information is processed quickly; incongruent information takes effort and may be forgotten, distorted or trigger schema change.",
      "Assimilation: new information fits an existing schema. Accommodation: the schema is modified or a new schema is created.",
      "Scripts are schemas for sequences of events, such as a restaurant visit, and are culture-specific.",
      "Bartlett (1932): memory is reconstructive; recall of an unfamiliar story became shorter and more culturally familiar.",
      "Bransford and Johnson (1972): prior knowledge helps only when the schema is activated at encoding.",
      "Schema theory explains memory distortion, which neither the multi-store model nor the working memory model can.",
      "Schema theory is a theory, not a cognitive model."
    ],
    terms: [
      ["Schema", "A mental representation, built from experience, that organises knowledge and guides how we process new information."],
      ["Assimilation", "Fitting new information into an existing schema without changing it."],
      ["Accommodation", "Modifying an existing schema, or creating a new one, when new information does not fit."],
      ["Disequilibrium", "Piaget's term for the discomfort felt when new information does not fit existing schemas."],
      ["Script", "A schema for a typical sequence of events, such as ordering in a restaurant."],
      ["Reconstructive memory", "Remembering as rebuilding: recall is shaped by schemas rather than replayed like a recording."],
      ["Effort after meaning", "Bartlett's idea that we actively try to make information make sense when we remember it."],
      ["Levelling", "Shortening a story by dropping details that seem unimportant."],
      ["Sharpening", "Emphasising, elaborating or reordering some details so they stand out."],
      ["Rationalisation", "Changing a story so it makes sense within one's own cultural expectations."],
      ["Schema-congruent", "Information that fits an existing schema and is processed quickly and easily."]
    ],
    studies: [
      {
        name: "Bartlett (1932)", tag: "The War of the Ghosts",
        aim: "To investigate whether prior cultural knowledge distorts recall of an unfamiliar story.",
        method: "British participants read 'The War of the Ghosts', a Native American legend with unfamiliar names and ideas. They recalled it by repeated reproduction (one person, many times) or serial reproduction (passed from person to person).",
        results: "Both methods produced the same kinds of distortion. The story shrank to about 180 words after 6 to 7 reproductions and became more conventional: 'hunting seals' became 'fishing'. Distortions showed levelling, sharpening and rationalisation, though the main themes survived.",
        conclusion: "Remembering is active reconstruction, an effort after meaning shaped by schemas.",
        eval: [
          "+ Relatively naturalistic story material; it studied mental processes when behaviourism dominated.",
          "- Unstandardised procedure with irregular recall intervals, so it is hard to replicate.",
          "- Bartlett scored recall himself, so researcher bias is possible.",
          "- A British-only sample."
        ],
        concepts: {
          bias: "A British-only sample and subjective scoring by Bartlett himself open the study to sampling and researcher bias.",
          change: "Memory for the story changed with each reproduction over time.",
          perspective: "Shows a cultural lens shaping what is remembered."
        }
      },
      {
        name: "Bransford and Johnson (1972)", tag: "Washing clothes",
        aim: "To test whether activating a schema before encoding improves comprehension and recall of an ambiguous passage.",
        method: "52 participants were randomly allocated to No Topic (17), Topic After (17) or Topic Before (18). All heard the same vague recorded passage, which was really about washing clothes. They rated comprehension from 1 to 7 and recalled the passage; two independent judges scored recall against 18 idea units.",
        results: "Topic Before recalled more idea units and rated the passage easier to understand than both other groups. Topic After was no better than No Topic. Approximate means: comprehension about 4.5 versus about 2.2; recall about 5.8 versus about 2.7 idea units out of 18.",
        conclusion: "Prior knowledge helps only when it is activated as context at encoding.",
        eval: [
          "+ Random allocation and a standardised procedure support a causal claim.",
          "+ Two independent judges improve the reliability of scoring.",
          "- Judging paraphrased idea units is partly subjective, and comprehension was self-rated.",
          "- An artificial passage in a lab gives low ecological validity."
        ],
        concepts: {
          causality: "Random allocation and a controlled procedure support a causal claim, though prior familiarity and attention remain possible confounds.",
          measurement: "Idea units scored by two judges improve reliability, but judging paraphrases is subjective and comprehension was self-rated.",
          responsibility: "Minimal risk; mild deception by omission, since participants were not told what the passage was about."
        }
      },
      {
        name: "Anderson and Pichert (1978)", tag: "Burglar or homebuyer",
        aim: "To test whether schemas affect retrieval as well as encoding.",
        method: "39 students read a story about a house from the perspective of a burglar or a homebuyer and recalled it. They recalled it again, some after switching perspective.",
        results: "Each group first recalled more details relevant to its perspective. On second recall, those who switched recalled 7.1% more information relevant to the new perspective; those who kept the same perspective recalled 2.9% less.",
        conclusion: "Schemas influence retrieval, not only encoding.",
        eval: [
          "+ Replicated by Borland et al. (1987) with 214 students.",
          "- A small student sample and an artificial story."
        ],
        concepts: {
          causality: "The same people recalled new details only after switching schema, pointing to the schema as the cause."
        }
      },
      {
        name: "Brewer and Treyens (1981)", tag: "The office study",
        aim: "To test whether schemas shape memory for a real environment.",
        method: "86 students waited 35 seconds in an office, not expecting a memory test, then recalled what had been in it.",
        results: "They recalled schema-consistent items, missed unusual items such as a skull, falsely recognised expected items that were absent, such as books, and distorted details.",
        conclusion: "Schemas fill gaps and filter what we remember from everyday scenes.",
        eval: [
          "+ More naturalistic than word lists, and 93% did not expect a memory test.",
          "- Participants were deceived about the purpose of the waiting room."
        ],
        concepts: {
          responsibility: "Deception was needed to avoid deliberate memorising, so a debrief was essential.",
          measurement: "A surprise recall test measures incidental memory for a real scene."
        }
      }
    ],
    strengths: [
      "Supported by many experiments, such as Bartlett and Bransford and Johnson, though often with artificial materials.",
      "Biological support: Mahon et al. (2009) found living and non-living things processed in different visual-cortex regions, even in blind people.",
      "Robust: applied to depression and anxiety therapy, mate selection and health campaigns.",
      "Explains memory distortion, which the multi-store and working memory models cannot."
    ],
    limitations: [
      "Cohen (1993): 'schema' is too vague to observe or measure, which challenges construct validity.",
      "It predicts group trends, not what an individual will recall.",
      "Explanations risk being circular: they recalled it that way because of their schema, and we know the schema from how they recalled it.",
      "Many experiments use artificial materials with low ecological validity."
    ],
    misconceptions: [
      ["Accommodation means old knowledge is thrown away and replaced.", "The existing schema is modified, or a new schema is created."],
      ["Schema theory is a cognitive model.", "It is a theory. For a model question, use the multi-store model or the working memory model."],
      ["Explaining reconstructive memory is explaining schema theory.", "Reconstructive memory is one application. Explain schemas, assimilation and accommodation first."],
      ["Having relevant knowledge is enough to help memory.", "Bransford and Johnson showed it must be activated at encoding: Topic After was no better than No Topic."],
      ["Schemas are bad because they distort.", "They make processing fast and economical; distortion is the cost."]
    ],
    examTips: [
      "Section A: explain the theory itself (schemas, assimilation, accommodation) before the example, then link Bartlett or Bransford and Johnson back to it.",
      "Section B, for example Emil moving from a school that prized solo work to one built on group work: his schema of good classwork guides his expectations, so he avoids group tasks because ...",
      "Never offer schema theory as your cognitive model.",
      "Section C: Cohen's vagueness criticism and the modern brain evidence (medial prefrontal cortex and hippocampus) make strong measurement and perspective material."
    ]
  },

  /* ------------------------------------------------------------------ */
  msm: {
    name: "Multi-store model of memory", short: "MSM", paper: "A, B and C",
    hook: "Why you remember the start and the end of a shopping list, and lose the middle.",
    voice: [
      "Read out a list of fifteen harbours, then count backwards for half a minute. The first few harbours survive. The last few vanish. Odd, unless memory has more than one store.",
      "The multi-store model, from Atkinson and Shiffrin in 1968, says information flows from sensory memory to short-term memory to long-term memory. Attention moves it along the first step, rehearsal the second.",
      "Short-term memory holds about seven items, give or take two, for up to about thirty seconds unless you rehearse. New arrivals push old ones out. Long-term memory seems almost limitless.",
      "After surgery, Henry Molaison could no longer form new long-term memories, yet he could hold a number in mind by constant rehearsal. Separate stores, it seems. Can you name all three, with their limits?"
    ],
    tutor: [
      "The multi-store model, proposed by Atkinson and Shiffrin in 1968, says memory has three stores in sequence: sensory memory, short-term memory and long-term memory. The stores differ in encoding, capacity and duration.",
      "Sensory memory holds a lot of raw sensory information for a fraction of a second or a few seconds. Attention passes information on to short-term memory, which holds about seven items, plus or minus two, for up to about thirty seconds.",
      "Short-term memory encodes mainly by sound. Without rehearsal, information decays or is displaced by new input. Rehearsal transfers it to long-term memory, which encodes mainly by meaning and has effectively unlimited capacity and duration. Retrieval brings information back into short-term memory.",
      "In Glanzer and Cunitz's 1966 study, forty-six army men recalled word lists immediately or after counting for ten or thirty seconds. Recency was sharply reduced at ten seconds and gone at thirty, because the counting displaced the last words from short-term memory.",
      "A strength is biological support: patient HM kept a working short-term memory but could not form new long-term memories. A limitation is oversimplification. HM learned a procedural skill, mirror drawing, without remembering it, so long-term memory is not one single store.",
      "The most common mistake is mixing vocabularies. The central executive belongs to the working memory model, never to the multi-store model. Also, do not call sensory memory selective memory: it is a brief store, and attention selects what moves on.",
      "The multi-store model can appear in Sections A, B and C. A full-mark Section A answer gives all three stores with capacity, duration and encoding, plus rehearsal and displacement, then links one study back to the model. A diagram alone is never enough."
    ],
    key: [
      "Atkinson and Shiffrin (1968): memory has three stores in sequence: sensory memory, short-term memory (STM) and long-term memory (LTM).",
      "The stores differ in encoding, capacity and duration. Sensory memory keeps the raw sensory form; STM encodes mainly acoustically (by sound); LTM encodes mainly semantically (by meaning).",
      "Sensory memory is modality-specific, holds a lot very briefly (iconic about 0.2 to 0.5 s, echoic about 2 to 4 s), and attention passes information on to STM.",
      "STM holds about 7 ± 2 items (Miller, 1956) for about 15 to 30 s. Without rehearsal, information decays or is displaced by new input.",
      "LTM has effectively unlimited capacity and duration. Retrieval brings information back into STM.",
      "Maintenance rehearsal (repetition) keeps information in STM; elaborative rehearsal (linking to existing knowledge) is deeper and more effective.",
      "Serial position effect: primacy (early items rehearsed into LTM) and recency (late items still in STM).",
      "Evidence: Glanzer and Cunitz (1966) removed recency with a filled delay; HM showed STM and LTM can be separated."
    ],
    terms: [
      ["Sensory memory", "A very brief, modality-specific store that holds large amounts of sensory information."],
      ["Iconic memory", "Sensory memory for vision, lasting a fraction of a second."],
      ["Echoic memory", "Sensory memory for sound, lasting a few seconds."],
      ["Short-term memory (STM)", "A limited store holding about 7 ± 2 items for up to about 30 seconds without rehearsal."],
      ["Long-term memory (LTM)", "A store with effectively unlimited capacity and duration."],
      ["Encoding", "Turning information into a form that can be stored; the stores differ in how they encode."],
      ["Maintenance rehearsal", "Repeating information to keep it active in STM."],
      ["Elaborative rehearsal", "Linking information to existing knowledge; deeper and more effective for LTM."],
      ["Displacement", "New information pushing older information out of a full STM."],
      ["Chunking", "Grouping items into meaningful units, which changes what counts as one item in STM."],
      ["Primacy effect", "Better recall of the first items in a list, explained as rehearsal into LTM."],
      ["Recency effect", "Better recall of the last items in a list, explained as items still held in STM."]
    ],
    studies: [
      {
        name: "Glanzer and Cunitz (1966)", tag: "The serial position curve",
        aim: "To test what happens to the serial position curve when rehearsal of the last items is blocked.",
        method: "46 enlisted army men, repeated measures, tested individually after 3 practice lists. They saw 15 lists of 15 common one-syllable words, each shown for 1 s with 2 s gaps and read aloud. Recall was immediate, or followed counting for 10 s or 30 s.",
        results: "Immediate recall showed primacy and recency. A 10 s delay sharply reduced recency, and after 30 s no trace of it remained. Primacy was unaffected.",
        conclusion: "Supports separate STM and LTM: early words had been rehearsed into LTM, while late words were displaced from STM by the counting task.",
        eval: [
          "+ A true experiment with high control supports a causal claim.",
          "+ Repeated measures controls participant variables.",
          "- Lists of unrelated words give low ecological validity.",
          "- Free recall under a time limit may underestimate memory.",
          "- Soldiers may not have felt free to withdraw."
        ],
        concepts: {
          causality: "Only the delay varied between conditions, so the loss of recency can be attributed to it.",
          measurement: "Free recall of word lists operationalises memory narrowly and may underestimate it.",
          bias: "An all-male military sample limits population validity.",
          responsibility: "Participants in a military hierarchy may not have felt free to withdraw."
        }
      },
      {
        name: "Patient HM (Milner, 1966)", tag: "A case of anterograde amnesia",
        aim: "To investigate how memory was affected after surgery removed parts of both medial temporal lobes.",
        method: "A longitudinal case study of Henry Molaison, who had surgery in 1953, at 27, to treat epilepsy. Researchers used IQ tests, memory tasks, observation, interviews, mirror drawing and later MRI (method triangulation).",
        results: "Severe anterograde amnesia: he could not form new episodic or semantic long-term memories. STM was intact: he held the number 584 for 15 minutes by constant rehearsal. He learned mirror drawing without remembering having done it.",
        conclusion: "The hippocampus is needed to transfer information from STM to LTM but is not the permanent store. STM and LTM are separate, supporting the model, but procedural memory is a separate system, challenging a single LTM store.",
        eval: [
          "+ Rich, triangulated data gathered over decades.",
          "+ Shows what could never ethically be created in a healthy person.",
          "- One person, so findings may not generalise.",
          "- The exact extent of damage was unknown until MRI, and baseline data were retrospective."
        ],
        concepts: {
          causality: "Correlational: the extent of damage was not known until MRI, so we cannot say exactly which structure caused which deficit.",
          responsibility: "HM could not remember agreeing to decades of testing; proxy consent and his initials protected him.",
          perspective: "Adds a biological lens to the cognitive model and challenges its single LTM store.",
          bias: "A long relationship between researchers and one participant risks researcher bias."
        }
      },
      {
        name: "Sperling (1960)", tag: "Partial report and sensory memory",
        aim: "To test whether more information is briefly available in sensory memory than people can report.",
        method: "Participants saw a grid of letters, such as three rows of four, for about 50 milliseconds. In whole report they recalled everything; in partial report a tone after the display told them which row to report.",
        results: "With an immediate tone, participants could report almost any row, but the advantage shrank as the tone was delayed.",
        conclusion: "Sensory memory is high-capacity but extremely short-lived.",
        eval: [
          "+ Clever logic lets researchers infer the contents of an invisible store.",
          "- A highly artificial task with letter grids flashed in a lab."
        ],
        concepts: {
          measurement: "Partial report estimates what was briefly available rather than only what survives a full report."
        }
      }
    ],
    strengths: [
      "Experimental support: the serial position effect and Glanzer and Cunitz support separate STM and LTM.",
      "Biological support: HM kept a working STM but could not form new LTM.",
      "Foundational: it made clear, testable predictions that shaped decades of research.",
      "Explains everyday experiences such as losing a phone number when interrupted."
    ],
    limitations: [
      "Oversimplified: stores are treated as independent and linear.",
      "STM is not one store: the working memory model and patient KF show separate verbal and visual components.",
      "LTM is not one store: HM learned procedural skills without episodic memory of learning them.",
      "Rehearsal is not the only route to LTM: levels of processing shows that depth matters.",
      "It cannot explain distortion or emotion in memory.",
      "Logie (1999): STM works with LTM as a workstation, not a one-way gateway."
    ],
    misconceptions: [
      ["The multi-store model has a central executive.", "That belongs to the working memory model. Keep the two vocabularies separate."],
      ["Sensory memory is 'selective memory'.", "Sensory memory is a brief, modality-specific store; attention selects what moves on to STM."],
      ["7 ± 2 is a fixed biological limit.", "It is a rough historical estimate. Chunking changes what counts as an item, and Cowan (2010) suggests 3 to 5 items when strategies are prevented."],
      ["Information only ever flows one way.", "Retrieval brings information from LTM back into STM."],
      ["HM only supports the model.", "His procedural learning challenges the idea of a single LTM store."]
    ],
    examTips: [
      "Only one memory model is required: the multi-store model or the working memory model. Know one thoroughly.",
      "A 4/4 Section A answer gives the three stores with capacity, duration and encoding, plus rehearsal and displacement, then links HM or Glanzer and Cunitz back to the model.",
      "A diagram alone never earns full marks: describe each component and how information moves between them.",
      "Section B, for example a 6-item shopping list interrupted by a phone call: name the stores, explain displacement and tie each point to the scenario.",
      "Section C: use HM both as support and as a challenge. Strategies to improve memory belong only in Section C."
    ]
  },

  /* ------------------------------------------------------------------ */
  wmm: {
    name: "Working memory model", short: "WMM", paper: "A, B and C",
    hook: "Why you can doodle while listening, but cannot text while someone is talking to you.",
    voice: [
      "Try steering a ship while humming a tune. Now try it while reciting the crew list and counting the oars aloud. One is far harder, and the reason suggests short-term memory has parts.",
      "Baddeley and Hitch proposed the working memory model in 1974. A central executive directs attention. A phonological loop handles sounds and words. A visuospatial sketchpad handles images and space.",
      "An episodic buffer was added later to bind everything into one experience and link with long-term memory. Two tasks clash when they need the same component, and coexist when they do not.",
      "Landry and Bartling had students chant one, two while remembering letters. Recall dropped sharply. Which component was the chanting keeping busy? Decide before you open the next chest."
    ],
    tutor: [
      "The working memory model, proposed by Baddeley and Hitch in 1974, says short-term memory is not a single store but a system of components that hold and work on information for a few seconds while you use it.",
      "The central executive controls attention: it allocates tasks, focuses and switches attention, and links to long-term memory. It controls rather than stores. The phonological loop handles sounds and words, and the visuospatial sketchpad handles visual and spatial information.",
      "The phonological loop contains the phonological store, or inner ear, where traces fade in about two seconds, and the articulatory control process, or inner voice, which rehearses them. The episodic buffer, added later, binds information from the components and long-term memory into one episode.",
      "The model's main support is the dual-task technique. Two tasks that need the same component interfere, while tasks using different components can run together. Patient KF also supports it: his short-term memory for spoken letters and digits was poor, but better when he saw them.",
      "In Landry and Bartling's 2011 study, thirty-four students recalled lists of seven letters in order. One group repeated one, two aloud throughout. Correct recall was 76 percent for the control group and 45 percent for the suppression group.",
      "The chanting occupied the inner voice, so the letters could not be rehearsed, which supports a separate phonological loop. A limitation of the model is that the central executive is vague, and its capacity cannot be measured separately.",
      "The most common mistake is treating the central executive as a store: it only controls attention. In Section B, for example a footballer forgetting a rapid instruction, name the phonological loop and explain its limited capacity and rehearsal using details from the scenario."
    ],
    key: [
      "Baddeley and Hitch (1974): short-term memory is a system of components, not a single store.",
      "Central executive: a limited-capacity, modality-free attention controller that allocates tasks, focuses, divides and switches attention, and links to LTM.",
      "Phonological loop: the phonological store (inner ear; traces fade in about 1.5 to 2 s) and the articulatory control process (inner voice; subvocal rehearsal).",
      "Visuospatial sketchpad (inner eye): visual and spatial information such as shapes, locations and routes.",
      "Episodic buffer, added later by Baddeley: integrates information from the subsystems and LTM into one episode; limited capacity.",
      "Dual-task logic: two tasks using the same component interfere; tasks using different components can run together.",
      "Evidence: Landry and Bartling (2011), patient KF, and brain scans showing different areas for verbal and visual tasks."
    ],
    terms: [
      ["Working memory", "A limited-capacity mental workspace that holds information for a few seconds while we use it."],
      ["Central executive", "The attention controller: directs attention, blocks distraction, switches tasks. It controls rather than stores."],
      ["Phonological loop", "The component for sounds and words, made of the phonological store and the articulatory control process."],
      ["Phonological store", "The 'inner ear': holds speech-based information for about 2 seconds unless rehearsed."],
      ["Articulatory control process", "The 'inner voice': rehearses words silently to keep them in the phonological store."],
      ["Visuospatial sketchpad", "The 'inner eye': holds what things look like and where they are."],
      ["Episodic buffer", "Combines sounds, images and long-term knowledge into a single episode; limited capacity."],
      ["Dual-task technique", "Doing two tasks at once to see whether they interfere, which shows whether they share a component."],
      ["Articulatory suppression", "Repeating a sound, such as 'one, two', to occupy the inner voice and block rehearsal."],
      ["Switch cost", "The loss of time and accuracy each time attention switches between tasks."]
    ],
    studies: [
      {
        name: "Landry and Bartling (2011)", tag: "Articulatory suppression",
        aim: "To test whether articulatory suppression impairs serial recall of letters that sound different from each other.",
        method: "34 psychology undergraduates, independent samples (17 per group). Ten lists of 7 letters drawn from F, K, L, M, R, X and Q were each shown for 5 s; after a 5 s wait, participants wrote them in order. The suppression group repeated 'one, two' aloud from presentation until writing.",
        results: "Mean correct recall was 76% for the control group and 45% for the suppression group (p ≤ 0.01).",
        conclusion: "Suppression occupied the articulatory control process, so the letters could not be rehearsed and faded from the phonological store. This supports a separate phonological loop.",
        eval: [
          "+ A standardised procedure that is easy to replicate.",
          "+ Only suppression differed between groups, giving clear cause and effect.",
          "- Independent samples of 17: the groups may have differed in memory ability.",
          "- Letter lists are artificial, so ecological validity is low.",
          "- A small sample of students from one university."
        ],
        concepts: {
          causality: "Only the chanting differed between groups, which supports a causal claim.",
          measurement: "Serial recall of letters operationalises the phonological loop, assuming the chant loads only that component.",
          bias: "Psychology undergraduates from one university may know the aim and may not represent people in general."
        }
      },
      {
        name: "Patient KF (Warrington and Shallice, 1970s)", tag: "A case of damaged verbal STM",
        aim: "To investigate the memory of a man with brain damage after a motorcycle accident.",
        method: "A case study using memory tests with information presented aloud or visually, carried out over several years.",
        results: "LTM was largely intact, but auditory-verbal STM was poor: he quickly forgot spoken letters and digits yet did better when he saw them, and could still recall meaningful sounds such as a phone ringing.",
        conclusion: "Verbal and visual short-term memory are separate, supporting the working memory model and challenging the single STM store of the multi-store model.",
        eval: [
          "+ Rich data followed over several years.",
          "+ Shows what could never ethically be tested in healthy people.",
          "- One person: not every brain may be organised this way.",
          "- His memory before the accident is unknown."
        ],
        concepts: {
          perspective: "A biological factor, brain damage, reveals the structure of a cognitive model.",
          causality: "Without a pre-accident baseline, we cannot be sure the injury caused every difference."
        }
      },
      {
        name: "Baddeley and Hitch (1974)", tag: "The dual-task technique",
        aim: "To test whether short-term memory is a single store.",
        method: "Participants held strings of digits in mind while doing a reasoning task, compared with doing each task alone.",
        results: "A few digits barely affected reasoning; heavy loads slowed it without making it collapse. Later studies found two similar tasks interfere far more than two different ones.",
        conclusion: "Short-term memory has several components.",
        eval: [
          "+ Dual-task logic gives a clear, testable way to separate components.",
          "- We cannot be sure which component a task really uses."
        ],
        concepts: {
          measurement: "Interference between tasks is used to infer shared components, an indirect measure of an invisible system."
        }
      }
    ],
    strengths: [
      "Dual-task experiments show two tasks clash most when they use the same component.",
      "Case studies such as KF show one component can be damaged while another works.",
      "Brain scans often show different areas active for verbal and visual tasks.",
      "Explains when multitasking works (music and drawing) and when it fails (podcast and conversation)."
    ],
    limitations: [
      "The central executive is vague, and its capacity cannot be measured separately from the other parts.",
      "It is unclear how the components work together.",
      "Brain imaging does not always show the same areas for each component.",
      "It says little about LTM, emotion or why memories get distorted."
    ],
    misconceptions: [
      ["The central executive stores information.", "It controls attention. It is not a store."],
      ["KF matters because he shows STM and LTM are separate.", "The multi-store model already claimed that. KF matters because one STM component was damaged while another worked."],
      ["Multitasking always fails.", "The question is what is competing. Tasks using different components can coexist, though never entirely without cost."],
      ["The working memory model explains all of memory.", "It models short-term memory and says little about LTM."]
    ],
    examTips: [
      "Only one memory model is required. If the working memory model is yours, know all four components and a study for each.",
      "Section B, for example a footballer forgetting one of three rapid instructions: name the phonological loop, explain its limited capacity and rehearsal, and tie each point to the scenario.",
      "Do not mix vocabularies: the central executive and the phonological loop belong to the working memory model, never inside a multi-store answer.",
      "KF works both as evidence for the model and as a biological factor in a cognitive process for Section C."
    ]
  },

  /* ------------------------------------------------------------------ */
  lop: {
    name: "Levels of processing", short: "LOP", paper: "C (and as evaluation of the MSM)",
    hook: "Staring at your notes is not the same as thinking about them, and your memory can tell the difference.",
    voice: [
      "Earlier on this voyage you met a few words under different questions. One asked how a word looked, one how it sounded, one what it meant. Which of them can you still recall?",
      "Craik and Lockhart suggested that memory depends less on which store information sits in, and more on how deeply it was processed when you first met it.",
      "Shallow processing notices appearance or sound. Deep processing works with meaning. Craik and Tulving found that words processed for meaning were recognised more often in a surprise test.",
      "One snag. Depth cannot be measured separately from memory itself, so the argument risks going round in a circle. Can you explain why that matters, before the owl does?"
    ],
    tutor: [
      "Levels of processing, from Craik and Lockhart in 1972, says that how long a memory lasts depends on how deeply the information was processed at encoding, not on which store it sits in.",
      "Shallow processing is structural, meaning what a word looks like, or phonological, meaning what it sounds like. Deep processing is semantic: working with meaning and linking to existing knowledge. Deep processing gives better recall.",
      "In Craik and Tulving's 1975 study, participants answered questions about words: whether a word was in capital letters, whether it rhymed, or whether it fitted a sentence. In a surprise recognition test, recognition was best for meaning and worst for appearance.",
      "The conclusion is that deeper, meaning-based processing produces more durable memory. Controlled experiments such as this one support it. The key limitation is circularity: depth cannot be measured independently of recall, so recall is used both to define depth and to prove it.",
      "The most common mistake is thinking that repeating something many times is deep processing. Repetition is maintenance rehearsal, which is shallow. Depth means working with meaning. Another mistake is treating levels of processing as a fourth memory store.",
      "Levels of processing is not one of the required models, and it mainly belongs in Section C. Use it as evidence that challenges the multi-store model, because it shows that the type of rehearsal matters, not just the amount."
    ],
    key: [
      "Craik and Lockhart (1972): how long a memory lasts depends on the depth of processing at encoding, not on the store it is in.",
      "Shallow processing: structural (appearance, such as capital letters) or phonological (sound, such as rhyme).",
      "Deep processing: semantic (meaning), linking to prior knowledge and imagery. It gives better recall.",
      "Levels of processing is not a fourth store; it is an alternative explanation of durable memory.",
      "Craik and Tulving (1975) operationalised depth with orienting questions followed by a surprise recognition test.",
      "It challenges the multi-store model: the type of rehearsal matters, not just the amount.",
      "Limitation: depth cannot be measured independently of recall, so the explanation risks circularity."
    ],
    terms: [
      ["Levels of processing", "The theory that memory durability depends on how deeply information is processed at encoding."],
      ["Structural processing", "Shallow processing of what a word looks like, such as its case or length."],
      ["Phonological processing", "Shallow processing of what a word sounds like, such as whether it rhymes."],
      ["Semantic processing", "Deep processing of what a word means and how it connects to other knowledge."],
      ["Orienting question", "A question that directs how a participant processes a word, used to manipulate depth."],
      ["Incidental learning", "Learning that happens without trying, because the memory test is a surprise."],
      ["Maintenance rehearsal", "Simple repetition: shallow processing that keeps information active without making it durable."],
      ["Elaborative rehearsal", "Linking information to meaning and existing knowledge: deep processing."],
      ["Circularity", "Using recall to define depth and depth to explain recall, so the argument proves nothing."]
    ],
    studies: [
      {
        name: "Craik and Tulving (1975)", tag: "Orienting questions and a surprise test",
        aim: "To test whether deeper processing at encoding leads to better memory.",
        method: "Participants answered orienting questions about words: structural (is it in capital letters?), phonemic (does it rhyme with another word?) or semantic (does it fit this sentence?). A surprise recognition test followed.",
        results: "Recognition rose with depth: it was best for words processed semantically and worst for words processed structurally.",
        conclusion: "Deeper, meaning-based processing produces more durable memory.",
        eval: [
          "+ A controlled experiment; the surprise test means participants were not deliberately memorising.",
          "- Depth cannot be measured independently: participants may have processed some shallow words more deeply.",
          "- Single words in a lab give low ecological validity."
        ],
        concepts: {
          measurement: "Depth was operationalised through question type, but we cannot check how deeply each participant actually processed each word.",
          causality: "Manipulating the question type supports a causal claim about depth, if the manipulation worked as intended."
        }
      }
    ],
    strengths: [
      "Supported by controlled experiments such as Craik and Tulving (1975).",
      "Corrects the multi-store model by showing that the type of rehearsal matters.",
      "Clear practical use: meaningful study beats repetition."
    ],
    limitations: [
      "Depth cannot be measured independently, so explanations risk circularity.",
      "Participants in shallow conditions may secretly form images or meanings.",
      "Laboratory tasks with single words have low ecological validity."
    ],
    misconceptions: [
      ["Levels of processing is a fourth memory store.", "It is an alternative account of how memories become durable."],
      ["Repeating something many times is deep processing.", "Repetition is maintenance rehearsal, which is shallow. Depth means working with meaning."],
      ["Levels of processing proves the multi-store model wrong.", "It challenges the multi-store view of rehearsal. Both remain useful and limited."]
    ],
    examTips: [
      "Levels of processing is not one of the required models. Use it as evidence that challenges the multi-store model.",
      "In a measurement essay, its circularity problem is a strong example of a construct that is hard to operationalise.",
      "Strategies to improve memory are Section C only; depth of processing helps explain why techniques such as the method of loci work."
    ]
  },

  /* ------------------------------------------------------------------ */
  load: {
    name: "Cognitive load theory", short: "Load", paper: "A, B and C",
    hook: "If revision feels exhausting but nothing sticks, the problem may be the room, not your brain.",
    voice: [
      "Imagine revising while the Sirens sing, your phone buzzes and a gull steals your notes. You finish exhausted and remember very little. Your working memory was not broken. It was overloaded.",
      "Cognitive load theory says working memory has a limited capacity, so learning suffers when the total demand grows too high. That demand comes in three kinds.",
      "Intrinsic load is how hard the task itself is. Extraneous load is distraction and poor presentation. Germane load is the useful effort of building a schema you can reuse.",
      "Sana and colleagues found that students who could merely see a classmate multitasking on a laptop understood less of a lecture. Which kind of load was that? Decide before we sail on."
    ],
    tutor: [
      "Cognitive load theory says that working memory has a limited capacity. Cognitive load is the total demand on it at a given moment. When demand exceeds capacity, learning and recall suffer. This is called cognitive overload.",
      "There are three types of load. Intrinsic load is the inherent difficulty of the task. Extraneous load comes from distraction or poor presentation. Germane load is the useful effort of building schemas in long-term memory.",
      "The loads interact. High extraneous load leaves less capacity for germane processing, so recall is poor. Intrinsic load cannot be removed, but it can be broken into smaller steps, while extraneous load is the easiest to remove.",
      "In Sana, Weston and Cepeda's 2013 study, university students took laptop notes in a lecture. Those who also multitasked scored about 11 percent lower on comprehension, and those who could see multitasking peers scored about 17 percent lower. Multitasking adds extraneous load.",
      "A strength is practical value: the theory guides teaching design, such as worked examples and removing distractions. A limitation is measurement: load is hard to measure directly, so studies such as Sana's infer it from performance rather than measuring it.",
      "The most common mistake is leaving germane load vague, or defining cognitive load as using lots of technology. Cognitive load is the demand on working memory. Also, worry during a test is extraneous load, not intrinsic load.",
      "Cognitive load theory can appear in Sections A, B and C. A full-mark Section B answer applies each relevant type of load to a detail in the scenario and shows how the loads interact to reduce recall."
    ],
    key: [
      "Cognitive load is the total demand on working memory. When demand exceeds its limited capacity, learning and recall suffer.",
      "Intrinsic load: the inherent difficulty of the task. It cannot be removed, but it can be broken into smaller steps.",
      "Extraneous load: distraction or poor presentation. It is the easiest load to remove.",
      "Germane load: the effort of building schemas. It is lower when previous learning helps process new information.",
      "The loads interact: high extraneous load leaves less capacity for germane processing, so recall is poor.",
      "Evidence: Sana et al. (2013) on laptop multitasking; Mani et al. (2013) on financial worry as a load.",
      "Load is hard to measure: self-report, performance and physiological measures each capture only part of it.",
      "Fiske and Taylor (1991): we are cognitive misers who save mental effort wherever we can."
    ],
    terms: [
      ["Cognitive load", "The total demand placed on working memory at a given moment."],
      ["Intrinsic load", "Load from the inherent complexity of the task, such as how many elements must be combined at once."],
      ["Extraneous load", "Load from things unrelated to the task: pop-ups, noise, messy design or worry."],
      ["Germane load", "Effort spent understanding and building reusable schemas in long-term memory."],
      ["Cognitive overload", "When demand exceeds working memory capacity, so learning and recall suffer."],
      ["Cognitive miser", "Fiske and Taylor's idea that people save mental effort whenever they can."],
      ["Worked example", "A fully solved problem that lowers load for beginners and helps build schemas."],
      ["Self-report measure", "Asking people to rate their own mental effort; open to bias."],
      ["Physiological measure", "A bodily signal, such as brain blood oxygen, used to infer load; it must be interpreted."]
    ],
    studies: [
      {
        name: "Sana, Weston and Cepeda (2013)", tag: "Laptop multitasking in lectures",
        aim: "To test whether multitasking on a laptop, or seeing others do it, reduces learning from a lecture.",
        method: "Experiment 1: 44 university students took laptop notes during a lecture; half were also given small online tasks. Experiment 2: nobody multitasked, but some sat where they could see others' laptops, used by actors who were multitasking.",
        results: "Multitaskers scored about 11% lower on comprehension. Students in view of multitasking peers scored about 17% lower.",
        conclusion: "Multitasking adds extraneous load, for the multitasker and for people nearby.",
        eval: [
          "+ Random allocation and a controlled lecture give strong cause and effect.",
          "+ Clear application to classroom laptop rules.",
          "- Cognitive load was assumed, not measured directly.",
          "- One short lecture with undergraduates at one Canadian university: a WEIRD sample."
        ],
        concepts: {
          causality: "Random allocation and a controlled lecture support a causal claim.",
          measurement: "Load was inferred from comprehension scores, never measured directly.",
          bias: "A WEIRD student sample limits how far the findings generalise."
        }
      },
      {
        name: "Mani et al. (2013)", tag: "Poverty as a cognitive load",
        aim: "To test whether thinking about financial problems takes up mental capacity.",
        method: "Lab: lower- and higher-income shoppers considered a car repair costing about $150 or about $1,500, then did Raven's matrices. Field: 464 Indian sugarcane farmers were tested before and after harvest.",
        results: "With the costly repair, lower-income participants scored clearly worse; with the cheap one there was no difference. Farmers scored 4.35 before and 5.45 after harvest on Raven's, and were faster on the Stroop test after harvest (131 s versus 146 s).",
        conclusion: "Financial worry acts as a cognitive load, leaving less capacity for other tasks: poverty is a load, not a lack of ability.",
        eval: [
          "+ A field study with high ecological validity and a non-WEIRD sample.",
          "+ Farmers were compared with themselves, controlling participant variables.",
          "- Load was inferred from income or season, never measured directly.",
          "- Diet, sleep, workload and practice on the tests also change after harvest."
        ],
        concepts: {
          causality: "The harvest was a natural IV, so other changes after harvest could explain the difference.",
          responsibility: "Findings must be reported without implying that poorer people are less capable."
        }
      },
      {
        name: "Modi et al. (2019)", tag: "Surgeons under load",
        aim: "To measure brain activity as load rises during a demanding task.",
        method: "33 trainee surgeons did simulated keyhole surgery while wearing an fNIRS cap, as demands such as time pressure, alarms and instructions were added.",
        results: "As load rose, performance fell and prefrontal cortex activity decreased.",
        conclusion: "Under high load the brain may disengage; such measures might one day warn of overload.",
        eval: [
          "+ An objective physiological measure alongside performance.",
          "- A simulator, not real surgery.",
          "- Blood oxygen is not load itself; it has to be interpreted."
        ],
        concepts: {
          measurement: "Brain activity gives an objective signal, but it must be interpreted as load.",
          perspective: "Adds a biological lens to a cognitive theory."
        }
      }
    ],
    strengths: [
      "Practical: guides teaching design, such as worked examples and removing distractions.",
      "Supported by experiments such as Sana et al. (2013).",
      "Built on the well-supported idea that working memory is limited.",
      "Explains real-world effects such as financial worry lowering performance (Mani et al., 2013)."
    ],
    limitations: [
      "Load is hard to measure directly, so studies often infer it.",
      "Each measure captures only part of load: self-report can be biased, and physiology shows arousal rather than load itself.",
      "Germane load is vaguely defined, and later research has refined it.",
      "The same task loads different people differently, depending on prior knowledge."
    ],
    misconceptions: [
      ["Cognitive load means using lots of technology.", "It is the demand on working memory. Technology may add extraneous load, but it is not the definition."],
      ["Worry during a test is intrinsic load.", "It is extraneous: it has nothing to do with the task itself."],
      ["The goal is zero mental effort.", "The goal is useful effort: germane load builds schemas."],
      ["'Internal load' is one of the three types.", "The three are intrinsic, extraneous and germane."],
      ["Brain scans measure cognitive load directly.", "They measure signals such as blood oxygen, which must be interpreted."]
    ],
    examTips: [
      "A 6/6 Section B answer shows the loads interacting: high extraneous load leaves less capacity for germane processing, so recall is poor.",
      "Develop germane load properly; it is the type most often left vague.",
      "Section A: define all three loads, then link one example, such as Sana et al., to a specific load.",
      "Section B, for example Freja revising with a video, a buzzing phone and a group chat: apply every relevant load type to a detail in the scenario."
    ]
  },

  /* ------------------------------------------------------------------ */
  dpt: {
    name: "Dual process theory", short: "DPT", paper: "A, B and C",
    hook: "Most of the decisions you made today were made by a part of you that never checked its working.",
    voice: [
      "A bat and a ball cost one pound ten together. The bat costs one pound more than the ball. What does the ball cost? If ten pence leapt to mind, hold on to that feeling.",
      "That quick answer came from System 1: fast, automatic and effortless, running on rules of thumb. System 2 is slow, deliberate and effortful, and it only checks when it has to.",
      "Dual process theory says thinking runs on both. We lean on System 1 because we are cognitive misers who save effort. Usually that works. Sometimes it produces errors in the same direction, which we call biases.",
      "The ball costs five pence. System 2 had to do that subtraction. Next, sort the tasks you meet by which system most likely handled them."
    ],
    tutor: [
      "Dual process theory says that thinking and decision-making run on two systems. System 1 is fast, automatic, intuitive and low in effort. System 2 is slow, conscious, effortful and analytic.",
      "System 1 runs on heuristics, which are mental rules of thumb. It is usually right but error-prone. System 2 is more reliable but needs time, motivation and spare capacity, so it steps in only when it must.",
      "We lean on System 1 because we are cognitive misers who save mental effort. When System 1 answers and System 2 fails to check, systematic errors called cognitive biases follow. System 1 also takes over when cognitive load is high or time is short.",
      "In 2005, Frederick gave a large sample the Cognitive Reflection Test. In the bat-and-ball problem, the intuitive answer is ten cents but the correct answer is five cents. Over half of students at highly selective universities gave the intuitive answer.",
      "The conclusion is that System 1 supplies a fast answer that System 2 often fails to check, even in very able people. A strength of the theory is that one framework explains a wide range of everyday errors and biases.",
      "A limitation is that the two systems cannot be observed directly: they are inferred from speed and errors. The most common mistake is thinking the systems are two brain regions. They describe two kinds of processing, not two places.",
      "Dual process theory can appear in Sections A, B and C. In Section A, describe both systems, then map them onto one example such as the bat-and-ball problem. Give an example even if the question does not ask for one."
    ],
    key: [
      "Dual process theory: thinking and decision-making run on two systems.",
      "System 1: fast, automatic, intuitive and low effort. It runs on heuristics, gives strong gut feelings and is error-prone.",
      "System 2: slow, conscious, effortful and analytic. It is more reliable but needs time, motivation and spare capacity.",
      "We are cognitive misers: System 1 handles most things, and System 2 steps in only when it must.",
      "When System 1 answers and System 2 fails to check, systematic errors called cognitive biases follow.",
      "System 1 takes over when cognitive load is high or time is short.",
      "With practice, tasks can move from System 2 to System 1, as when driving becomes automatic."
    ],
    terms: [
      ["Dual process theory", "The theory that thinking uses two systems: a fast intuitive one and a slow analytic one."],
      ["System 1", "Fast, automatic, low-effort thinking that relies on heuristics and gut feeling."],
      ["System 2", "Slow, conscious, effortful thinking that works through possibilities logically."],
      ["Heuristic", "A mental rule of thumb that gives quick answers, usually good enough but sometimes wrong."],
      ["Cognitive miser", "The idea that people save mental effort, relying on System 1 where possible."],
      ["Cognitive bias", "A systematic error in thinking: most people make the same error in the same direction."],
      ["Cognitive reflection", "The ability to stop an intuitive answer and check it with System 2."],
      ["Cognitive Reflection Test", "Short puzzles with a tempting wrong answer, such as the bat-and-ball problem."]
    ],
    studies: [
      {
        name: "Frederick (2005)", tag: "The Cognitive Reflection Test",
        aim: "To measure how often people override an intuitive but wrong answer.",
        method: "About 3,400 participants took the Cognitive Reflection Test: three short problems with a tempting wrong answer, such as the bat-and-ball problem (intuitive answer 10 cents; correct answer 5 cents).",
        results: "Many gave the intuitive answer to the bat-and-ball problem: over half of students at highly selective universities (Harvard, MIT, Princeton), and over 80% at less selective ones.",
        conclusion: "System 1 supplies a fast answer that System 2 often fails to check, even in very able people.",
        eval: [
          "+ A large sample and a quick, simple measure.",
          "- Artificial puzzles may exaggerate errors compared with everyday decisions."
        ],
        concepts: {
          measurement: "Choosing the tempting wrong answer operationalises a failure of System 2 to check System 1.",
          bias: "Largely university student samples limit how far results generalise."
        }
      },
      {
        name: "Wason (1968); Griggs and Cox (1982)", tag: "The selection task, abstract and familiar",
        aim: "To see how well people reason with a logical rule, and whether familiar content helps.",
        method: "Wason gave participants four cards and an abstract rule and asked which cards must be turned over to test it. Griggs and Cox used the same logic framed as a familiar drinking-age rule.",
        results: "Under 10% chose correctly in the abstract version; about 75% were correct in the drinking-age version.",
        conclusion: "Abstract logic invites quick matching by System 1; familiar content helps people reason correctly.",
        eval: [
          "+ A simple, replicable task with a clear correct answer.",
          "- Card puzzles are far removed from everyday decisions."
        ],
        concepts: {
          measurement: "Changing only the content of the task shows how much performance depends on what is being reasoned about.",
          perspective: "Suggests reasoning depends on context and experience, not only on a general logic ability."
        }
      }
    ],
    strengths: [
      "Explains a wide range of everyday errors and biases with one framework.",
      "Supported by experiments such as the Cognitive Reflection Test and the selection task.",
      "Practical: slowing down to engage System 2 can reduce errors.",
      "Brain imaging suggests different areas are active for logic-based and belief-based reasoning (Goel and Dolan, 2003)."
    ],
    limitations: [
      "The two systems cannot be observed directly; they are inferred from speed and errors.",
      "Artificial puzzles may exaggerate how often people get things wrong.",
      "Some findings have failed to replicate, such as the disfluent-font effect (Alter et al., 2007; Meyer et al., 2015).",
      "fMRI evidence is correlational."
    ],
    misconceptions: [
      ["System 1 is always wrong.", "It is usually right and very efficient. It errs in predictable situations."],
      ["System 1 and System 2 are two brain regions.", "They describe two kinds of processing, not two places in the brain."],
      ["A fast answer shows someone has a System 1 personality.", "Everyone uses both systems. Speed on one task is not a trait."],
      ["Writing about dual process theory answers a question on anchoring bias.", "Explain the bias asked about; use dual process theory only as the mechanism."]
    ],
    examTips: [
      "Section A, 'Describe dual process theory with reference to one example': describe both systems, then map them onto one example such as the bat-and-ball problem.",
      "Even if a question does not ask for an example, give one.",
      "Use dual process theory as the mechanism behind biases, but keep the named bias centre stage when a question asks about it."
    ]
  },

  /* ------------------------------------------------------------------ */
  biases: {
    name: "Cognitive biases", short: "Biases", paper: "A, B and C",
    hook: "The first price you see and the evidence you go looking for both shape decisions you believe are entirely your own.",
    voice: [
      "A trader offers you a cloak for nine hundred drachmas, then generously settles on three hundred. A bargain, surely. Would three hundred have looked cheap if he had started there?",
      "That is anchoring bias. The first number becomes a starting point, and we adjust away from it, but not far enough, even when the anchor is obviously random.",
      "Confirmation bias is its quieter cousin. We seek out, favour and remember evidence that fits what we already believe, and we explain away whatever does not.",
      "Both are System 1 shortcuts that System 2 fails to check. Next, spot which bias is at work in each scene, and be ready to say why it happened, not just its name."
    ],
    tutor: [
      "A cognitive bias is a systematic error in judgement: most people make the same error in the same direction. Two biases matter most here: anchoring bias and confirmation bias.",
      "Anchoring bias means relying too heavily on the first value you receive. That value acts as a reference point, and you adjust away from it too little, even when the anchor is obviously random.",
      "In Tversky and Kahneman's 1974 study, people had five seconds to estimate eight times seven times six and so on down to one, or the same numbers in ascending order. The median estimates were 2,250 for descending and 512 for ascending.",
      "The true answer is 40,320, so both groups were far too low, and the group that started with larger numbers anchored higher. People anchor on the first few numbers and adjust insufficiently.",
      "Confirmation bias means seeking, interpreting, favouring and remembering information that supports what you already believe, and explaining away what does not. It works through selective exposure, selective interpretation and selective memory.",
      "Both biases are explained by dual process theory: System 1 answers and System 2 fails to check. A strength is robustness, since anchoring is one of the most replicated effects. A limitation is that the tasks are artificial, with little motivation to be accurate.",
      "The most common mistake is naming or describing a bias without explaining why it happens. In Sections A and B, explain the mechanism, and when a question asks about one bias, keep that bias at the centre rather than writing about dual process theory."
    ],
    key: [
      "A cognitive bias is a systematic error: most people err in the same direction.",
      "Anchoring bias: an initial value acts as a reference point, and adjustment away from it is insufficient, even when the anchor is random.",
      "Tversky and Kahneman (1974): 8×7×6×5×4×3×2×1 was estimated far higher than 1×2×3×4×5×6×7×8.",
      "Confirmation bias: seeking, interpreting, favouring and remembering information that supports existing beliefs.",
      "Confirmation bias works through selective exposure, selective interpretation and selective memory.",
      "Framing effect: the same information leads to different choices depending on how it is presented.",
      "Availability heuristic: judging how likely something is by how easily examples come to mind.",
      "Dual process theory explains biases: System 1 answers, and System 2 fails to check."
    ],
    terms: [
      ["Cognitive bias", "A systematic error in judgement that most people make in the same direction."],
      ["Anchoring bias", "Relying too heavily on the first value received and adjusting away from it too little."],
      ["Anchor", "The initial value that acts as a reference point for a judgement."],
      ["Confirmation bias", "Seeking, interpreting and remembering information in ways that support what we already believe."],
      ["Selective exposure", "Choosing to encounter information that fits existing beliefs."],
      ["Attitude polarisation", "People with opposing views both becoming more extreme after seeing the same mixed evidence."],
      ["Framing effect", "Making different choices about the same information depending on how it is worded."],
      ["Availability heuristic", "Judging frequency or likelihood by how easily examples come to mind."],
      ["Falsification", "Actively looking for evidence that could prove a belief wrong: the scientific answer to confirmation bias."]
    ],
    studies: [
      {
        name: "Tversky and Kahneman (1974)", tag: "Anchoring in multiplication",
        aim: "To test whether an initial value biases numerical estimates.",
        method: "Participants had 5 seconds to estimate the product of 1×2×3×4×5×6×7×8, or the same numbers in descending order, 8×7×6×5×4×3×2×1.",
        results: "The median estimate was 512 for the ascending order and 2,250 for the descending order. The true answer is 40,320.",
        conclusion: "People anchor on the first few numbers and adjust insufficiently.",
        eval: [
          "+ A true experiment; anchoring is one of the most replicated effects in psychology.",
          "- An artificial task with little motivation to be accurate.",
          "- Mostly Western samples."
        ],
        concepts: {
          causality: "Only the order of the numbers differed, so the anchor is the likely cause of the difference.",
          measurement: "Group medians were compared, not individual reports of how people reasoned."
        }
      },
      {
        name: "Englich, Mussweiler and Strack (2006)", tag: "Anchoring in the courtroom",
        aim: "To test whether experts are anchored by a clearly irrelevant number.",
        method: "Legal professionals rolled loaded dice that showed 3 or 9, then decided a sentence for a case.",
        results: "Those who rolled 9 gave longer sentences (about 8 months) than those who rolled 3 (about 5 months).",
        conclusion: "Even experts are anchored by random numbers.",
        eval: [
          "+ Expert participants make the finding more relevant to real decisions.",
          "- A hypothetical case, not a real trial."
        ],
        concepts: {
          responsibility: "Anchoring in courts raises questions about fairness in sentencing."
        }
      },
      {
        name: "Lord, Ross and Lepper (1979)", tag: "Biased assimilation of evidence",
        aim: "To test how people with opposing views evaluate the same mixed evidence.",
        method: "48 Stanford undergraduates who supported or opposed capital punishment read two made-up studies, one supporting and one opposing their view.",
        results: "Each side rated the study that supported its view as better, and both became more extreme (attitude polarisation).",
        conclusion: "People interpret evidence in line with what they already believe.",
        eval: [
          "+ Shows bias in how evidence is interpreted, not only in what is sought out.",
          "- The studies were fabricated, so participants were deceived and needed a debrief.",
          "- Attitude change was self-reported."
        ],
        concepts: {
          responsibility: "Deception was used, so debriefing was essential.",
          measurement: "Self-reported attitude change is less convincing than behaviour measured before and after."
        }
      },
      {
        name: "Wason (1960)", tag: "The 2-4-6 task",
        aim: "To see how people test their own hypotheses.",
        method: "Participants tried to discover a rule that fitted the sequence 2, 4, 6 by proposing their own number sequences and receiving feedback.",
        results: "Only 6 of 29 (about 21%) found the rule at their first announcement.",
        conclusion: "People tend to test ideas with examples that fit them rather than examples that could prove them wrong.",
        eval: [
          "+ Measures behaviour directly rather than relying on self-report.",
          "- An abstract puzzle, far from real beliefs."
        ],
        concepts: {
          bias: "Researchers are prone to confirmation bias too, which is why science relies on falsification."
        }
      },
      {
        name: "Tversky and Kahneman (1981)", tag: "The framing effect",
        aim: "To test whether wording changes choices about identical outcomes.",
        method: "Participants chose between programmes for a disease outbreak, described in terms of lives saved or lives lost.",
        results: "In the 'saved' frame, 72% chose the certain option; in the 'die' frame, only 22% did.",
        conclusion: "The frame, not the outcome, changed people's choices.",
        eval: [
          "+ Identical outcomes isolate wording as the cause.",
          "- A hypothetical scenario with no real consequences."
        ],
        concepts: {
          responsibility: "Doctors and public bodies have a duty to present risks clearly and fairly."
        }
      }
    ],
    strengths: [
      "Robust: anchoring is one of the most replicated effects in psychology.",
      "Real-world relevance: courts, pricing, medicine and social media.",
      "Experiments with random allocation support causal claims."
    ],
    limitations: [
      "Artificial laboratory tasks with little motivation to be accurate.",
      "People cannot report their own heuristics, so mechanisms are inferred.",
      "Mostly Western student samples.",
      "Rival explanations exist, for example selective accessibility (Strack and Mussweiler) versus insufficient adjustment for anchoring."
    ],
    misconceptions: [
      ["Anchors only work when they are relevant.", "Random anchors, such as a dice roll, still pull judgements."],
      ["Confirmation bias is just stubbornness.", "It is a systematic shortcut: information that fits our schemas is easier to process than information that challenges them."],
      ["Explaining dual process theory answers a bias question.", "Answer the bias asked about. Writing mainly about dual process theory scores only 1 or 2 out of 4."],
      ["Experts are immune to bias.", "Legal professionals were anchored by dice rolls."]
    ],
    examTips: [
      "Section A, 'Explain anchoring bias with reference to one example': describe the bias, give one example, and explain why it happens (System 1, cognitive miser, insufficient adjustment).",
      "Common mistake: describing the study in detail but never explaining why the bias happened.",
      "Section B, for example a buyer set on one phone who dismisses other reviews: explain why she is prone to confirmation bias, not just that she has it."
    ]
  },

  /* ------------------------------------------------------------------ */
  models: {
    name: "Cognitive models", short: "Models", paper: "A, B and C",
    hook: "Nobody has ever seen a memory store; models are how psychologists study the invisible and test it anyway.",
    voice: [
      "No sailor has ever seen the wind, yet every one of them can read a sail. Psychologists face the same problem with the mind, and their answer is the model.",
      "The cognitive approach treats people as information processors. A model breaks an invisible process into parts we can name, predict and test, one component at a time.",
      "Every model simplifies. The multi-store model ignores emotion and distortion. As the statistician George Box put it, all models are wrong, but some are useful. The skill is knowing which parts to trust.",
      "Remember, you need only one memory model, and schema theory is not a model. Which model is yours, and which study tested it?"
    ],
    tutor: [
      "A cognitive model is a simplified representation of a cognitive process, broken into components that can be tested. It rests on the cognitive approach, which treats people as information processors and holds that mental processes can be studied scientifically.",
      "Psychologists use models because they simplify processes that cannot be seen, break them into parts that can be tested one at a time, predict behaviour, and communicate ideas clearly.",
      "Models also have limits. They oversimplify: the multi-store model ignores emotion and distortion. They rest on assumptions, such as linear flow between stores. And their components are hypothetical constructs, which are hard to measure and can only be inferred.",
      "Models are tested empirically, but one study rarely tests a whole model, and each construct must first be operationalised, meaning turned into something measurable, such as recall of a word list. Support from any one study is always partial.",
      "The most common mistake is offering schema theory or flashbulb memory as a cognitive model: examiners accept neither. You need only one memory model, the multi-store model or the working memory model, and you do not need to compare two.",
      "In the IB specimen Section B question, a three-stage model of imagination is tested with children. A top answer explains the value of models: they allow empirical testing, constructs must be operationalised, and one study supports only some stages.",
      "Also, a drawn model never earns full marks on its own. Describe each component and how information moves between them. In Section C perspective essays, the cognitive lens explains what happens, and the biological lens shows the mechanism."
    ],
    key: [
      "Cognitive approach assumptions: humans are information processors; mental processes can be studied scientifically; mental representations guide behaviour; soft determinism.",
      "The cognitive approach arose in the 1950s in reaction to behaviourism, which treated the mind as a black box.",
      "Why use models: they simplify invisible processes, break them into testable parts, predict behaviour, communicate ideas and let researchers test one component at a time.",
      "Limits of models: they oversimplify, rest on assumptions such as linear flow, and use hypothetical constructs that are hard to measure.",
      "Models are tested empirically, but one study rarely tests a whole model, and constructs must first be operationalised.",
      "Only one memory model is required: the multi-store model or the working memory model. Schema theory and flashbulb memory are not accepted as models.",
      "A drawn model never earns full marks on its own: describe its components and how they interact."
    ],
    terms: [
      ["Cognitive approach", "Explains behaviour through mental processes, treating people as information processors."],
      ["Information processing", "Input, processing and output: sensory input combined with stored knowledge."],
      ["Cognitive model", "A simplified representation of a cognitive process, broken into components that can be tested."],
      ["Hypothetical construct", "Something assumed to exist to explain behaviour, such as an STM store, but not directly observable."],
      ["Operationalisation", "Turning a construct into something measurable, such as recall of word lists."],
      ["Bottom-up processing", "Processing driven by incoming sensory information."],
      ["Top-down processing", "Processing guided by stored knowledge and expectations."],
      ["Mental representation", "An internal version of knowledge, such as a schema, that guides behaviour."],
      ["Soft determinism", "Behaviour is influenced by factors, but changing our thinking can change our behaviour."],
      ["Cognitive miser", "People save mental effort, skipping effortful processing when they can."]
    ],
    specimen: {
      stem: "Researchers propose a three-stage model of imagination (select elements, combine them at random, evaluate the result) and observe primary children building imaginary creatures from toy body parts. With reference to the study, explain the value of cognitive models for understanding cognitive processes.",
      points: [
        "Models let researchers test a process empirically.",
        "One study rarely tests a whole model.",
        "Constructs such as 'combine at random' must be operationalised before they can be tested.",
        "The study may support some stages (selecting, evaluating) but not the claim that combining is random."
      ]
    },
    studies: [],
    strengths: [
      "Models simplify processes that cannot be seen.",
      "They break a process into mechanisms that can be tested one at a time.",
      "They generate predictions about behaviour.",
      "They communicate ideas clearly and visually."
    ],
    limitations: [
      "Models oversimplify: the multi-store model ignores emotion and distortion.",
      "They rest on assumptions, such as linear flow between stores.",
      "Their components are hypothetical constructs that are hard to measure.",
      "The direction of information flow is often unclear.",
      "Cognitive processes can only be inferred, never observed directly."
    ],
    misconceptions: [
      ["Schema theory is a cognitive model.", "It is a theory. Examiners will not accept it as a model."],
      ["You must compare two memory models.", "That requirement was dropped. One model is enough."],
      ["A model is proven if one study supports it.", "One study rarely tests a whole model; support is always partial."],
      ["A labelled diagram is a full answer.", "Describe each component and how information moves between them."]
    ],
    examTips: [
      "IB specimen (Section B): a three-stage imagination model tested with children. Explain the value of models: empirical testing, operationalising constructs, and partial support from one study.",
      "Knowing one memory model well, plus why psychologists use models, is enough for a 'value of models' question.",
      "Section C perspective essays: the cognitive lens explains what happens and how; the biological lens (HM, KF) shows the mechanism."
    ]
  },

  /* ------------------------------------------------------------------ */
  exam: {
    name: "Paper 1 technique", short: "Exam", paper: "A, B and C",
    hook: "Knowing the psychology is half the voyage; Paper 1 rewards knowing exactly what each section wants you to do with it.",
    voice: [
      "Paper 1 is ninety minutes and three sections. Section A asks for knowledge with one example. Section B asks you to apply a theory to a stranger's problem. Section C asks for an argument.",
      "In Section A, two short paragraphs win. The theory in its own vocabulary, then one example with every term mapped onto it. Only your first example is marked, so choose it well.",
      "In Section B, open with a line of theory, then take two or three details from the scenario and explain why each one happens. If you could have written it without reading the scenario, it is not finished.",
      "In Section C, the concept is the star and the area of study is the stage. Keep both in every paragraph, and let your conclusion follow from what you argued. Which section needs you most?"
    ],
    tutor: [
      "Paper 1 lasts ninety minutes and is the same at standard and higher level. Section A has two four-mark questions, Section B has two six-mark questions, and Section C has one fifteen-mark response, chosen from two.",
      "Spend about twenty minutes on Section A, thirty on B and forty on C. Cognition in general can appear in any section, but objectives on memory itself, such as biological, cultural and environmental factors and strategies to improve it, appear only in Section C.",
      "In Section A, you describe or explain a named content point with one example. Write two paragraphs: the theory in its own vocabulary, then one example with each term linked to it. Only the first example is marked.",
      "Read the command term. Describe means say what the theory is and how it works. Explain means say why and how it happens, and link the example back. A description earns only about two out of four on an explain question.",
      "In Section B, you apply a theory to an unseen scenario. Explain the theory in one or two lines, then take two or three details from the scenario and explain why each happens, using because. Do not evaluate.",
      "Test your Section B answer: if you could have written it without reading the scenario, add more application. Theory with no reference to the scenario has an unofficial cap of three marks, and scenario with no theory a cap of two.",
      "In Section C, the concept is the focus and the area of study must stay present in every paragraph. Link them throughout, avoid absolute verdicts such as the study was biased, and end with a conclusion that follows from your argument and adds nothing new."
    ],
    key: [
      "Paper 1: 90 minutes, identical for SL and HL. Section A: two 4-mark questions. Section B: two 6-mark questions. Section C: one 15-mark response, chosen from two.",
      "Suggested timing: about 20 minutes for A, 30 for B and 40 for C.",
      "Section A: describe or explain a named content point with one example, a study or an everyday case. Two paragraphs; only the first example is marked.",
      "Section B: an unseen scenario, almost always 'Explain how X could be used to explain or change ...'. Theory plus links to scenario details, with no evaluation.",
      "Section B, unofficial caps: theory with no reference to the scenario, maximum 3; scenario with no theory, maximum 2.",
      "Section C: a concept, an area of study and a context. Mostly 'discuss', but evaluate, to what extent and examine are possible.",
      "Section C is marked best-fit on three strands: knowledge and understanding; critical analysis with a reasoned conclusion; accurate, precise terminology.",
      "Cognition in general, including one cognitive model such as the multi-store or working memory model, can appear in A, B or C. The objectives on your studied cognitive process (memory), such as biological, cultural and environmental factors and strategies to improve it, appear only in C."
    ],
    terms: [
      ["Describe", "Give a detailed account of what something is or how it works: the characteristics of a theory."],
      ["Explain", "Give the reasons or mechanisms behind something: why and how it happens, linked back to the example."],
      ["Discuss", "Offer a balanced review that weighs a range of arguments or factors and reaches a conclusion supported by evidence."],
      ["Evaluate", "Weigh strengths against limitations to reach a judgement about value or validity."],
      ["To what extent", "Weigh how far a claim holds, considering support and challenges, and reach a clear, justified judgement."],
      ["Examine", "Consider an argument or idea closely to uncover its assumptions and how its parts relate."],
      ["Best fit", "Examiners choose the markband that best matches the answer overall, even if strands are uneven."],
      ["Stimulus", "The unseen scenario in a Section B question, set in one of the contexts."],
      ["Anecdotal example", "An everyday example that is not a published study; it need not be personal."]
    ],
    markbands: [
      ["13 to 15", "Knowledge fully explained; well-developed critical analysis with links fully explained throughout; a reasoned, clearly stated, consistent conclusion; accurate, precise terminology with detailed points."],
      ["10 to 12", "The demands of the question are addressed; knowledge mostly explained; critical but underdeveloped analysis with explained links; a consistent conclusion; terminology mostly appropriate, points accurate but lacking detail."],
      ["7 to 9", "Demands only partly met; knowledge partly explained; undeveloped analysis with partly relevant links; a conclusion not always consistent; terminology sometimes appropriate, points lacking accuracy and development."],
      ["4 to 6", "Some understanding; knowledge described rather than explained; mostly descriptive with links stated but only partly relevant; a simplistic conclusion; terminology often misused, points vague."],
      ["1 to 3", "Little grasp of the question; very limited knowledge with errors; descriptive or superficial with missing or irrelevant links; a superficial or inconsistent conclusion; terminology absent or misused."]
    ],
    studies: [],
    strengths: [], limitations: [],
    misconceptions: [
      ["More examples earn more marks in Section A.", "Only the first example is marked. Extra examples waste time."],
      ["Describing a theory is enough when the command term is 'explain'.", "A description earns about 2 out of 4 on an explain question. Say why and how."],
      ["Section B rewards naming the right theory.", "Labelling without explaining does not meet the command term. Say why each scenario detail happens."],
      ["Evaluation shows depth in Section B.", "Section B asks for application, not evaluation."],
      ["Section C needs detailed study procedures.", "Study detail is not what is assessed. The concept must be the focus."],
      ["A good conclusion introduces a final new idea.", "The conclusion should follow from the argument and add nothing new."],
      ["Strategies to improve memory can be a Section A question.", "Strategies to improve a cognitive process can be asked only in Section C."]
    ],
    examTips: [
      "Section A: paragraph one explains the content point in its own vocabulary; paragraph two gives one example and links each term to it.",
      "Give an example even if the question does not ask for one.",
      "The example is marked for validity, not perfect study detail; a brief aim, procedure and finding plus a clear link is enough.",
      "Section B: explain the theory in one or two lines, then apply it to two or three scenario details with 'because'. A few well-developed links beat many shallow ones.",
      "Section B self-test: if you could have written it without reading the scenario, add more application.",
      "Section C: keep the area of study present throughout, link the concept in every paragraph and weigh perspectives against each other.",
      "Section C: avoid absolute verdicts such as 'internal validity was high'. Write 'internal validity is strengthened by ...'."
    ]
  }
};

/* ==================================================================== */
ODY.drills = {

  sort: {

    oc_quadrants: {
      topic: "operant", title: "Four ways to change a behaviour",
      prompt: "Tap a card, then tap the consequence it shows. Ask two questions: was something added or removed, and did the behaviour go up or down?",
      buckets: ["Positive reinforcement", "Negative reinforcement", "Positive punishment", "Negative punishment"],
      cards: [
        { t: "Signe gets specific praise after a strong answer, and she answers more often.", b: 0, why: "Praise is added and answering increases." },
        { t: "Emil earns a sticker for each on-time arrival, and he is late less often.", b: 0, why: "A sticker is added and arriving on time increases." },
        { t: "A dog gets a treat each time it sits on command, and it sits more readily.", b: 0, why: "A treat is added and sitting increases." },
        { t: "The seatbelt buzzer stops when Oliver buckles up, and he buckles up faster each time.", b: 1, why: "An unpleasant noise is removed and buckling up increases." },
        { t: "Asta's headache goes away after a painkiller, and she reaches for one sooner next time.", b: 1, why: "Pain is removed and taking painkillers increases." },
        { t: "Anyone who finishes classwork early has no homework; Mads now finishes early more often.", b: 1, why: "Homework, an unpleasant task, is removed and finishing early increases." },
        { t: "A driver gets a speeding fine and speeds less afterwards.", b: 2, why: "A fine is added and speeding decreases." },
        { t: "Freja is given extra chores after swearing, and she swears less.", b: 2, why: "Chores are added and swearing decreases." },
        { t: "Jonas touches an electric fence, gets a shock, and avoids the fence afterwards.", b: 2, why: "A shock is added and touching the fence decreases." },
        { t: "Karl loses his gaming time after missing homework, and misses homework less.", b: 3, why: "Gaming, something pleasant, is removed and missing homework decreases." },
        { t: "A chatty student is moved away from his friends and chats less in class.", b: 3, why: "Time with friends is removed and chatting decreases." },
        { t: "Ida's phone is taken for the evening after she breaks curfew, and she breaks it less often.", b: 3, why: "Her phone is removed and breaking curfew decreases." }
      ]
    },

    oc_schedules: {
      topic: "operant", title: "Schedules of reinforcement",
      prompt: "Does the reward depend on a number of responses or on time? Is that requirement fixed or unpredictable?",
      buckets: ["Fixed ratio", "Variable ratio", "Fixed interval", "Variable interval"],
      cards: [
        { t: "A loyalty card gives a free coffee after every 10 coffees bought.", b: 0, why: "A set number of responses earns the reward." },
        { t: "A factory worker is paid for every 20 shirts sewn.", b: 0, why: "Pay depends on a fixed number of responses." },
        { t: "A slot machine pays out after an unpredictable number of pulls.", b: 1, why: "An unpredictable number of responses earns the reward." },
        { t: "Refreshing a feed shows something exciting after an unpredictable number of swipes.", b: 1, why: "Reward depends on how many swipes, and the number varies." },
        { t: "A rat's first lever press after 30 seconds earns a pellet.", b: 2, why: "The first response after a set time is rewarded." },
        { t: "A cake is ready after exactly 40 minutes, so checking the oven earlier earns nothing.", b: 2, why: "Only the first check after a fixed time pays off." },
        { t: "A pellet follows the first press after an unpredictable length of time.", b: 3, why: "The first response after a varying time is rewarded." },
        { t: "Checking for new messages pays off only after unpredictable stretches of time.", b: 3, why: "Messages arrive with time, not with checks, and the timing varies." }
      ]
    },

    cc_vs_oc: {
      topic: "classical", title: "Classical or operant?",
      prompt: "Ask what is being learned. If one stimulus comes to predict another, think classical. If a consequence changes a behaviour, think operant.",
      buckets: ["Classical conditioning", "Operant conditioning"],
      cards: [
        { t: "A dog salivates at the sound of a metronome that used to come just before food.", b: 0, why: "One stimulus has come to predict another and triggers a reflex." },
        { t: "After painful visits, Freja's heart races at the smell of the dentist's surgery.", b: 0, why: "The smell was paired with pain and now triggers a fear response." },
        { t: "Rats avoid saccharin after it was paired with radiation sickness.", b: 0, why: "A taste has been associated with illness." },
        { t: "Two stimuli become linked, and one starts to trigger the other's reflex.", b: 0, why: "This is the definition of learning by association between stimuli." },
        { t: "Alcohol paired with a nausea drug starts to make a patient feel sick.", b: 0, why: "Aversion therapy pairs a stimulus with a reflex response." },
        { t: "A rat presses a lever more often after it delivers food.", b: 1, why: "A consequence, food, increases a behaviour." },
        { t: "A cat escapes a puzzle box faster over trials because escaping leads to food.", b: 1, why: "The Law of Effect: a satisfying consequence strengthens the response." },
        { t: "Emil stops interrupting after losing break time for it.", b: 1, why: "Removing something pleasant decreases a behaviour." },
        { t: "A behaviour becomes more likely because of what follows it.", b: 1, why: "This is the definition of learning through consequences." },
        { t: "A pigeon repeats a head-toss that happened to come just before food.", b: 1, why: "Accidental reinforcement of a behaviour by a consequence." }
      ]
    },

    slt_arrm: {
      topic: "slt", title: "Attention, retention, reproduction, motivation",
      prompt: "Which of Bandura's four processes does each moment show?",
      buckets: ["Attention", "Retention", "Reproduction", "Motivation"],
      cards: [
        { t: "Asta watches her favourite footballer's free kicks closely because she admires him.", b: 0, why: "An admired model captures her attention." },
        { t: "Oliver misses the demonstration because he is checking his phone.", b: 0, why: "Distraction means the behaviour is never noticed." },
        { t: "Signe rehearses the dance steps in her head on the bus home.", b: 1, why: "She is storing the observed behaviour in memory." },
        { t: "Mads writes down the chef's steps so he will remember them later.", b: 1, why: "Keeping a record helps him retain what he observed." },
        { t: "Emil has watched the backflip, but his body is not yet strong enough to do it.", b: 2, why: "He lacks the physical ability to reproduce the behaviour." },
        { t: "Freja practises the serve until she can physically copy the coach's technique.", b: 2, why: "She is building the ability to reproduce what she saw." },
        { t: "Jonas copies the prefect after seeing her praised for tidying up.", b: 3, why: "Vicarious reinforcement gives him a reason to act." },
        { t: "Ida knows how to cheat at the game she saw but decides it is not worth getting caught.", b: 3, why: "She learned it, but expected outcomes remove her motivation." }
      ]
    },

    bartlett_distortions: {
      topic: "schema", title: "How the story changed",
      prompt: "Levelling drops details. Sharpening emphasises, exaggerates or reorders details. Rationalisation changes the story so it makes sense in the reteller's culture.",
      buckets: ["Levelling", "Sharpening", "Rationalisation"],
      cards: [
        { t: "The retelling leaves out the names of the villages entirely.", b: 0, why: "Details that seemed unimportant were dropped." },
        { t: "A long story shrinks to a few short sentences after several retellings.", b: 0, why: "Shortening by omission is levelling." },
        { t: "Minor details, like the mist on the river, vanish from the retelling.", b: 0, why: "Small details are omitted." },
        { t: "The battle becomes the dramatic centre of the story, with added noise and fear.", b: 1, why: "One part is emphasised and given extra emotion." },
        { t: "Events are reordered so the story follows a neat beginning, middle and end.", b: 1, why: "Reordering details is sharpening." },
        { t: "A small wound becomes a vivid, detailed injury that the reteller dwells on.", b: 1, why: "A detail is elaborated and exaggerated." },
        { t: "The ghosts are explained away as an ordinary enemy war party.", b: 2, why: "A puzzling element is changed so it makes sense to the reteller." },
        { t: "A motive is invented: the warriors attacked because the villagers had wronged them.", b: 2, why: "An explanation is invented to make the story logical." },
        { t: "The strange ending gets a tidy cause: the warrior simply died of his wounds.", b: 2, why: "The unfamiliar ending is made to fit the reteller's expectations." }
      ]
    },

    schema_assim: {
      topic: "schema", title: "Assimilation or accommodation?",
      prompt: "Does the new information fit an existing schema, or does the schema have to change?",
      buckets: ["Assimilation", "Accommodation"],
      cards: [
        { t: "A toddler who knows 'dog' calls a new poodle a dog.", b: 0, why: "The poodle fits the existing dog schema." },
        { t: "Emil visits a new bakery that sells rye bread, just as he expected.", b: 0, why: "The new bakery fits his existing bakery schema." },
        { t: "A student reads a new example of positive reinforcement and files it with the others.", b: 0, why: "New information fits an existing category." },
        { t: "Freja shops in a new supermarket using her usual routine, without surprise.", b: 0, why: "Her shopping script applies unchanged." },
        { t: "Oliver learns that seals live in the sea and adds them to his 'sea animals' schema.", b: 0, why: "The new fact fits without changing the schema." },
        { t: "A child who called a cow 'doggie' learns it is a cow and forms a new category.", b: 1, why: "A new schema is created." },
        { t: "Asta learns whales are mammals, not fish, and changes her schema for fish.", b: 1, why: "The existing schema is modified." },
        { t: "Mads moves to a school built on group work and revises what 'good classwork' means.", b: 1, why: "His schema is changed to fit a new reality." },
        { t: "After meeting a friendly spider expert, Signe revises her belief that all spiders are dangerous.", b: 1, why: "The schema is modified by information that did not fit." },
        { t: "A student learns negative reinforcement is not punishment and restructures her understanding.", b: 1, why: "Her existing schema has to change." }
      ]
    },

    msm_stores: {
      topic: "msm", title: "Which store?",
      prompt: "Sort each fact into the store of the multi-store model it describes.",
      buckets: ["Sensory memory", "Short-term memory", "Long-term memory"],
      cards: [
        { t: "Holds visual information for only a fraction of a second.", b: 0, why: "Iconic sensory memory is extremely brief." },
        { t: "Modality-specific: separate stores for sight and sound.", b: 0, why: "Sensory memory is divided by sense." },
        { t: "Sperling's partial report showed it holds a lot, very briefly.", b: 0, why: "High capacity, very short duration." },
        { t: "Holds about 7 ± 2 items.", b: 1, why: "Miller's estimate of STM capacity." },
        { t: "Information lasts roughly 15 to 30 seconds without rehearsal.", b: 1, why: "The duration of STM." },
        { t: "New items push old ones out: displacement.", b: 1, why: "A full STM loses older items." },
        { t: "Effectively unlimited capacity and duration.", b: 2, why: "The defining features of LTM." },
        { t: "After surgery, HM could no longer form new memories in this store.", b: 2, why: "HM's anterograde amnesia affected LTM." },
        { t: "Early items in a list reach this store through rehearsal, creating primacy.", b: 2, why: "Primacy is explained by transfer to LTM." }
      ]
    },

    wmm_components: {
      topic: "wmm", title: "Which component is working?",
      prompt: "Match each task to the component of the working memory model that mainly handles it.",
      buckets: ["Central executive", "Phonological loop", "Visuospatial sketchpad", "Episodic buffer"],
      cards: [
        { t: "Deciding which of two tasks to focus on, and switching between them.", b: 0, why: "Allocating and switching attention is the executive's job." },
        { t: "Naming the ink colour of a word while ignoring the word itself (Stroop).", b: 0, why: "Blocking an automatic response is executive control." },
        { t: "Repeating a phone number under your breath until you dial it.", b: 1, why: "Subvocal rehearsal uses the inner voice." },
        { t: "Chanting 'one, two' wrecks your recall of a list of letters.", b: 1, why: "Articulatory suppression occupies the loop." },
        { t: "Picturing the route from the harbour to the temple.", b: 2, why: "Spatial routes are held in the inner eye." },
        { t: "Remembering where the pieces stood on a chessboard.", b: 2, why: "Visual and spatial locations." },
        { t: "Combining what you heard and what you saw into one memory of a scene.", b: 3, why: "Integrating the subsystems into one episode." },
        { t: "Binding a spoken name to a face and to what you already know about that person.", b: 3, why: "Integrating sound, image and LTM knowledge." }
      ]
    },

    lop_levels: {
      topic: "lop", title: "How deep is the question?",
      prompt: "Sort each orienting question by the level of processing it demands.",
      buckets: ["Structural", "Phonological", "Semantic"],
      cards: [
        { t: "Is the word printed in capital letters?", b: 0, why: "Only its appearance matters." },
        { t: "Does the word have more than five letters?", b: 0, why: "Length is a visual, structural feature." },
        { t: "Is the word printed in italics?", b: 0, why: "Typeface is appearance only." },
        { t: "Does the word rhyme with 'boat'?", b: 1, why: "Rhyme depends on sound." },
        { t: "Does the word start with the same sound as 'ship'?", b: 1, why: "Sound, not meaning." },
        { t: "Does the word sound like 'sale'?", b: 1, why: "A judgement about sound." },
        { t: "Is the word a type of fish?", b: 2, why: "You must think about its meaning." },
        { t: "Would the word fit the sentence 'The sailor tied the ___ to the mast'?", b: 2, why: "Fitting a sentence requires meaning." },
        { t: "Is the word something you could eat?", b: 2, why: "A judgement about meaning." }
      ]
    },

    load_types: {
      topic: "load", title: "Three kinds of load",
      prompt: "Is the load from the task itself, from something irrelevant, or from building understanding?",
      buckets: ["Intrinsic", "Extraneous", "Germane"],
      cards: [
        { t: "Calculus has more pieces to combine at once than simple sums.", b: 0, why: "The difficulty belongs to the task itself." },
        { t: "A problem needs six facts held and combined at the same time.", b: 0, why: "Many interacting elements raise intrinsic load." },
        { t: "A chemistry equation with many interacting parts is hard even in a silent room.", b: 0, why: "Nothing irrelevant is present; the task is simply complex." },
        { t: "Pop-up notifications during an online lesson.", b: 1, why: "They have nothing to do with the task." },
        { t: "A cluttered revision sheet with clashing colours.", b: 1, why: "Poor presentation adds irrelevant load." },
        { t: "Worrying about money while taking a test.", b: 1, why: "Worry is unrelated to the task itself." },
        { t: "Studying worked examples to build a reusable pattern.", b: 2, why: "Effort spent building a schema." },
        { t: "Effort spent linking a new theory to one you already understand.", b: 2, why: "Useful effort that builds understanding." },
        { t: "The second cipher feels easier because a schema formed while cracking the first.", b: 2, why: "Germane effort built a schema that now helps." }
      ]
    },

    dpt_systems: {
      topic: "dpt", title: "System 1 or System 2?",
      prompt: "Which system most likely handles each task for a typical adult?",
      buckets: ["System 1", "System 2"],
      cards: [
        { t: "Reading a shop sign as you walk past.", b: 0, why: "Automatic and effortless for fluent readers." },
        { t: "Hearing from a friend's voice that they are upset.", b: 0, why: "Fast, intuitive judgement." },
        { t: "Completing the phrase 'salt and ...'.", b: 0, why: "An automatic association." },
        { t: "Flinching when a ball flies towards your face.", b: 0, why: "Immediate, with no deliberate thought." },
        { t: "An experienced driver steering along an empty, familiar road.", b: 0, why: "Practice has made the task automatic." },
        { t: "Working out 17 × 24 in your head.", b: 1, why: "Slow, effortful calculation." },
        { t: "Comparing two phone contracts to find the cheaper one.", b: 1, why: "Deliberate weighing of details." },
        { t: "Checking the logic of an essay argument.", b: 1, why: "Analytic and effortful." },
        { t: "Counting every letter 'e' in a paragraph.", b: 1, why: "Needs sustained, deliberate attention." },
        { t: "A learner driver parallel parking for the first time.", b: 1, why: "Unpractised, so every step needs conscious control." }
      ]
    },

    bias_types: {
      topic: "biases", title: "Name the bias",
      prompt: "Which bias or heuristic is at work in each scene?",
      buckets: ["Anchoring bias", "Confirmation bias", "Framing effect", "Availability heuristic"],
      cards: [
        { t: "A jacket marked 'was 2,000 kr, now 900 kr' feels like a bargain.", b: 0, why: "The first price anchors the judgement of value." },
        { t: "Judges who rolled a 9 on a die gave longer sentences than those who rolled a 3.", b: 0, why: "A random number acted as an anchor." },
        { t: "Mads, sure his phone brand is best, reads only positive reviews of it.", b: 1, why: "He seeks out evidence that supports his belief." },
        { t: "Convinced her teacher dislikes her, Signe notices only his criticisms.", b: 1, why: "She notices and remembers what fits her belief." },
        { t: "A treatment with '90% survival' is chosen more often than one with '10% mortality'.", b: 2, why: "Identical information, presented differently." },
        { t: "Minced meat labelled '75% lean' sells better than '25% fat'.", b: 2, why: "The same fact in a positive frame." },
        { t: "After news of a plane crash, Oliver thinks flying is more dangerous than driving.", b: 3, why: "A vivid, recent example comes easily to mind." },
        { t: "Asta overestimates shark attacks because dramatic stories about them are easy to recall.", b: 3, why: "Ease of recall drives her estimate of likelihood." }
      ]
    },

    concept_lens: {
      topic: "concepts", title: "Which concept is this question about?",
      prompt: "Each critical question looks at a Learning and Cognition study through one concept. Which one?",
      buckets: ["Bias", "Causality", "Change", "Measurement", "Perspective", "Responsibility"],
      cards: [
        { t: "Two of Bandura's observers knew the children. Could that colour how they coded behaviour?", b: 0, why: "Researcher bias in data collection." },
        { t: "Glanzer and Cunitz tested only army men. Whose memory does the sample represent?", b: 0, why: "Sampling bias." },
        { t: "Bransford and Johnson allocated people at random. Did the topic cause better recall?", b: 1, why: "Whether a causal claim is supported." },
        { t: "HM's damage was not known exactly until MRI. Which structure caused his amnesia?", b: 1, why: "Whether we can identify the cause." },
        { t: "If a student reinforces her own revision, how much do her habits change, and does the change last?", b: 2, why: "Mechanisms, impact and time: change." },
        { t: "Bartlett's story shifted with every retelling. How does a memory transform over time?", b: 2, why: "Change over time." },
        { t: "Is hitting an inflatable doll a valid measure of real aggression?", b: 3, why: "Construct validity of a measure." },
        { t: "How can depth of processing be measured without using recall itself?", b: 3, why: "Operationalising a construct." },
        { t: "Does HM show that a biological lens reveals something the cognitive model misses?", b: 4, why: "Comparing lenses." },
        { t: "Can a behaviourist explain the pigeon's ritual without asking what the pigeon expects?", b: 4, why: "Behaviourist versus cognitive lens." },
        { t: "Could children under 6 meaningfully consent to the Bobo doll study?", b: 5, why: "Informed consent is an ethical duty." },
        { t: "How should findings on poverty and load be reported so they do not stigmatise people?", b: 5, why: "Responsible reporting of socially sensitive research." }
      ]
    },

    strength_limit_msm: {
      topic: "msm", title: "Multi-store model: strength or limitation?",
      prompt: "Does each point support the multi-store model or expose a weakness?",
      buckets: ["Strength", "Limitation"],
      cards: [
        { t: "A filled delay removed recency but not primacy (Glanzer and Cunitz).", b: 0, why: "Supports separate STM and LTM." },
        { t: "HM could hold a number by rehearsal but could not form new long-term memories.", b: 0, why: "Biological evidence that STM and LTM are separate." },
        { t: "The serial position curve fits rehearsal into LTM plus items still in STM.", b: 0, why: "The model explains a reliable finding." },
        { t: "It made clear, testable predictions that shaped decades of research.", b: 0, why: "Foundational and testable." },
        { t: "KF had impaired verbal STM but better visual STM, so STM is not one store.", b: 1, why: "Challenges a single STM store." },
        { t: "HM learned mirror drawing without remembering doing it, so LTM is not one store.", b: 1, why: "Procedural memory is a separate system." },
        { t: "Deep processing can create lasting memories without much rehearsal.", b: 1, why: "Rehearsal is not the only route into LTM." },
        { t: "It cannot explain why memories get distorted, as Bartlett found.", b: 1, why: "It ignores reconstruction and distortion." }
      ]
    },

    strength_limit_wmm: {
      topic: "wmm", title: "Working memory model: strength or limitation?",
      prompt: "Does each point support the working memory model or expose a weakness?",
      buckets: ["Strength", "Limitation"],
      cards: [
        { t: "Two tasks clash most when they use the same component.", b: 0, why: "Dual-task evidence supports separate components." },
        { t: "KF's verbal STM was damaged while his visual STM worked.", b: 0, why: "Case evidence for separate components." },
        { t: "Brain scans often show different areas active for verbal and visual tasks.", b: 0, why: "Biological support." },
        { t: "It explains why we can sometimes multitask and sometimes cannot.", b: 0, why: "Explains real-world behaviour." },
        { t: "Nobody can measure the central executive's capacity separately.", b: 1, why: "A key component is vague and hard to test." },
        { t: "It is unclear how the components actually work together.", b: 1, why: "The interactions are underspecified." },
        { t: "It says little about long-term memory, emotion or distortion.", b: 1, why: "Limited scope." },
        { t: "Brain imaging does not always show the same areas for each component.", b: 1, why: "Inconsistent biological evidence." }
      ]
    },

    strength_limit_slt: {
      topic: "slt", title: "Social learning theory: strength or limitation?",
      prompt: "Does each point support social learning theory or expose a weakness?",
      buckets: ["Strength", "Limitation"],
      cards: [
        { t: "Children imitated aggression they had only watched (Bandura, 1961).", b: 0, why: "Experimental support for observational learning." },
        { t: "Mirror neurons offer a possible biological basis for learning by watching.", b: 0, why: "Biological support." },
        { t: "It explains a wide range of behaviours, from aggression to eating habits.", b: 0, why: "Robust and broad." },
        { t: "Modelling plus rewards raised children's fruit and vegetable intake (Food Dudes).", b: 0, why: "A successful application." },
        { t: "Motivation, attention and self-efficacy are hard to measure.", b: 1, why: "Key constructs are hard to operationalise." },
        { t: "It leans on nurture and cannot explain individual differences on its own.", b: 1, why: "Limited explanatory scope." },
        { t: "It is hard to test in natural settings, so much evidence comes from the lab.", b: 1, why: "Low ecological validity of evidence." },
        { t: "Hitting a Bobo doll may be play, so the key evidence may not measure aggression.", b: 1, why: "Doubtful construct validity." }
      ]
    },

    strength_limit_schema: {
      topic: "schema", title: "Schema theory: strength or limitation?",
      prompt: "Does each point support schema theory or expose a weakness?",
      buckets: ["Strength", "Limitation"],
      cards: [
        { t: "Recall of an unfamiliar story became more culturally familiar (Bartlett).", b: 0, why: "Evidence of schemas shaping memory." },
        { t: "Different visual-cortex regions process living and non-living things, even in blind people.", b: 0, why: "Biological support (Mahon et al., 2009)." },
        { t: "It explains memory distortion, which memory models cannot.", b: 0, why: "Explains what other accounts cannot." },
        { t: "It has been applied in therapy for depression and anxiety and in health campaigns.", b: 0, why: "Robust real-world application." },
        { t: "Cohen (1993): 'schema' is too vague to observe or measure directly.", b: 1, why: "Weak construct validity." },
        { t: "It predicts group trends, not what an individual will recall.", b: 1, why: "Limited predictive precision." },
        { t: "'They recalled it that way because of their schema' risks a circular explanation.", b: 1, why: "Circular reasoning." },
        { t: "Many supporting experiments use artificial materials in a lab.", b: 1, why: "Low ecological validity." }
      ]
    }
  },

  order: {

    pavlov: {
      topic: "classical", title: "Build Pavlov's conditioning",
      prompt: "Put the stages of classical conditioning in order.",
      steps: [
        "Food (UCS) makes the dog salivate (UCR) without any learning.",
        "A metronome (NS) on its own produces no salivation.",
        "The metronome is sounded just before food, over many trials.",
        "The metronome alone now makes the dog salivate: a CS triggering a CR.",
        "The metronome keeps sounding without food, and salivation fades: extinction."
      ]
    },

    bobo_procedure: {
      topic: "slt", title: "Run the Bobo doll study",
      prompt: "Put the procedure of Bandura, Ross and Ross (1961) in order.",
      steps: [
        "Children are rated on prior aggression and matched across groups.",
        "Each child watches an aggressive, non-aggressive or no model for 10 minutes.",
        "The child is shown attractive toys, then told they are for other children.",
        "The child spends 20 minutes in a room with aggressive and non-aggressive toys.",
        "Observers behind a one-way mirror code behaviour every 5 seconds.",
        "Aggression is compared across model type, model sex and child sex."
      ]
    },

    glanzer_procedure: {
      topic: "msm", title: "Run Glanzer and Cunitz",
      prompt: "Put the procedure of Glanzer and Cunitz (1966) in order.",
      steps: [
        "Participants complete 3 practice lists.",
        "A list of 15 one-syllable words is presented, one word at a time.",
        "Recall is immediate, or follows 10 or 30 seconds of counting.",
        "Participants freely recall as many words as they can.",
        "Recall is plotted by word position to form a serial position curve.",
        "Recency shrinks with delay while primacy stays: separate STM and LTM."
      ]
    },

    bj_procedure: {
      topic: "schema", title: "Run Bransford and Johnson",
      prompt: "Put the procedure of Bransford and Johnson (1972) in order.",
      steps: [
        "Participants are randomly allocated to No Topic, Topic After or Topic Before.",
        "The Topic Before group is told the passage is about washing clothes.",
        "Everyone hears the same vague recorded passage.",
        "The Topic After group is now told the topic.",
        "Participants rate their comprehension of the passage from 1 to 7.",
        "Participants recall the passage, scored by two judges against 18 idea units."
      ]
    },

    msm_flow: {
      topic: "msm", title: "Follow information through the multi-store model",
      prompt: "Put the journey of a piece of information in order.",
      steps: [
        "Stimuli from the environment reach the senses.",
        "Information is held very briefly in modality-specific sensory memory.",
        "Attention passes some of it into short-term memory.",
        "Rehearsal keeps it in STM and transfers it into long-term memory.",
        "Retrieval brings stored information back into STM when it is needed."
      ]
    },

    sectionA_answer: {
      topic: "exam", title: "Build a 4-mark Section A answer",
      prompt: "Put the moves of a strong Section A answer in order.",
      steps: [
        "Read the command term: describe (what) or explain (why and how).",
        "Paragraph one: state the content point using its own key terms.",
        "Explain the mechanism: why the behaviour or process happens.",
        "Paragraph two: give one example, a study or an everyday case.",
        "Map each key term onto the example explicitly.",
        "Stop there: a second example will not be marked."
      ]
    },

    sectionB_answer: {
      topic: "exam", title: "Build a 6-mark Section B answer",
      prompt: "Put the moves of a strong Section B answer in order.",
      steps: [
        "Identify the theory named and whether you must explain or change behaviour.",
        "Open with a one or two line explanation of the theory.",
        "Pick two or three relevant details from the scenario.",
        "For each detail, explain why it happens, or would work, using key terms.",
        "Self-test: could this be written without the scenario? If so, add application.",
        "Stop without evaluating: Section B rewards application."
      ]
    },

    landry_procedure: {
      topic: "wmm", title: "Run Landry and Bartling",
      prompt: "Put the procedure of Landry and Bartling (2011) in order.",
      steps: [
        "Undergraduates are split into a control group and a suppression group.",
        "A list of 7 dissimilar letters appears for 5 seconds; the suppression group chants.",
        "Everyone waits 5 seconds, the suppression group still chanting.",
        "Participants write down the letters in their original order.",
        "The procedure is repeated until 10 lists are done.",
        "Mean correct recall is compared: 76% control, 45% suppression."
      ]
    },

    bartlett_procedure: {
      topic: "schema", title: "Run Bartlett's serial reproduction",
      prompt: "Put Bartlett's serial reproduction procedure in order.",
      steps: [
        "A British participant reads The War of the Ghosts, an unfamiliar legend.",
        "After a delay, they write down the story from memory.",
        "The next participant reads that version and reproduces it in turn.",
        "The story passes along a chain of participants.",
        "Bartlett compares versions and finds levelling, sharpening and rationalisation."
      ]
    }
  },

  cloze: {

    bandura1961: {
      topic: "slt", title: "Rebuild the Bobo doll study",
      text: "Bandura, Ross and Ross studied {0} children aged 3 to nearly 6. The children were {1} on their earlier aggression, then watched an aggressive model, a {2} model or no model. After being mildly frustrated, each child was observed for {3} minutes through a one-way mirror. Children who saw the aggressive model showed more {4} and verbal aggression, often exact imitation. Boys were more aggressive overall, and boys imitated the {5} model more.",
      gaps: [
        { a: "72", d: ["24", "150"] },
        { a: "matched", d: ["interviewed", "paid"] },
        { a: "non-aggressive", d: ["cartoon", "silent film"] },
        { a: "20", d: ["5", "60"] },
        { a: "physical", d: ["emotional", "written"] },
        { a: "male", d: ["female", "older"] }
      ]
    },

    bartlett1932: {
      topic: "schema", title: "Rebuild The War of the Ghosts",
      text: "Bartlett asked {0} participants to recall 'The War of the Ghosts', a Native American legend. In {1} reproduction one person recalled the story many times; in serial reproduction it passed from person to person. After 6 to 7 reproductions the story shrank to about {2} words, and 'hunting seals' became '{3}'. Dropping details is called {4}, and changing the story to make sense within one's own culture is called {5}. Bartlett concluded that memory is {6}.",
      gaps: [
        { a: "British", d: ["American", "Danish"] },
        { a: "repeated", d: ["free", "cued"] },
        { a: "180", d: ["30", "500"] },
        { a: "fishing", d: ["sailing", "swimming"] },
        { a: "levelling", d: ["sharpening", "assimilation"] },
        { a: "rationalisation", d: ["levelling", "displacement"] },
        { a: "reconstructive", d: ["photographic", "permanent"] }
      ]
    },

    bj1972: {
      topic: "schema", title: "Rebuild Bransford and Johnson",
      text: "Bransford and Johnson randomly allocated {0} participants to three groups. Everyone heard the same vague passage, which was really about {1}. The group that recalled most had been told the topic {2} hearing the passage. Two independent judges scored recall against {3} idea units. Being told the topic afterwards was no better than never being told. Prior knowledge helps only when it is activated at {4}.",
      gaps: [
        { a: "52", d: ["18", "120"] },
        { a: "washing clothes", d: ["cooking dinner", "flying a kite"] },
        { a: "before", d: ["while", "a week after"] },
        { a: "18", d: ["7", "50"] },
        { a: "encoding", d: ["retrieval", "storage"] }
      ]
    },

    glanzer1966: {
      topic: "msm", title: "Rebuild Glanzer and Cunitz",
      text: "Glanzer and Cunitz tested {0} army men. They saw lists of {1} words, then recalled them at once or after counting for {2} or 30 seconds. Immediate recall showed primacy and {3} effects. After a 30-second delay, recency had disappeared, but {4} was unaffected. This supports separate short-term and {5} stores.",
      gaps: [
        { a: "46", d: ["72", "12"] },
        { a: "15", d: ["7", "40"] },
        { a: "10", d: ["2", "60"] },
        { a: "recency", d: ["halo", "anchoring"] },
        { a: "primacy", d: ["rehearsal", "chunking"] },
        { a: "long-term", d: ["sensory", "episodic"] }
      ]
    },

    hm: {
      topic: "msm", title: "Rebuild the case of HM",
      text: "In {0}, at the age of 27, Henry Molaison had surgery that removed tissue from both {1} lobes, including most of the hippocampi. Afterwards he had severe {2} amnesia: he could not form new episodic or semantic long-term memories. His short-term memory was {3}: he held a number for 15 minutes by constant rehearsal. He learned {4} without remembering having done it, suggesting that {5} memory is a separate system.",
      gaps: [
        { a: "1953", d: ["1966", "1932"] },
        { a: "medial temporal", d: ["frontal", "occipital"] },
        { a: "anterograde", d: ["infantile", "sensory"] },
        { a: "intact", d: ["destroyed", "enlarged"] },
        { a: "mirror drawing", d: ["new vocabulary", "people's names"] },
        { a: "procedural", d: ["episodic", "semantic"] }
      ]
    },

    landry2011: {
      topic: "wmm", title: "Rebuild Landry and Bartling",
      text: "Landry and Bartling tested {0} psychology undergraduates in two independent groups. Each list had {1} letters, chosen because they sound {2}. The suppression group repeated 'one, two' aloud, which occupies the {3}. Mean recall was {4} for the control group and 45% for the suppression group. The chanting blocks {5}, so the letters fade from the phonological store.",
      gaps: [
        { a: "34", d: ["17", "120"] },
        { a: "7", d: ["3", "15"] },
        { a: "different", d: ["similar", "familiar"] },
        { a: "articulatory control process", d: ["visuospatial sketchpad", "episodic buffer"] },
        { a: "76%", d: ["58%", "98%"] },
        { a: "rehearsal", d: ["attention", "retrieval"] }
      ]
    },

    craik_tulving: {
      topic: "lop", title: "Rebuild Craik and Tulving",
      text: "Craik and Tulving asked participants {0} questions about words. A structural question asked whether a word was in {1}; a phonemic question asked whether it {2}; a semantic question asked whether it fitted a {3}. A {4} recognition test followed. Recognition was best for words processed {5}.",
      gaps: [
        { a: "orienting", d: ["leading", "open"] },
        { a: "capital letters", d: ["a category", "the dictionary"] },
        { a: "rhymed with another word", d: ["was a noun", "named an animal"] },
        { a: "sentence", d: ["rhyme", "font"] },
        { a: "surprise", d: ["practised", "announced"] },
        { a: "semantically", d: ["structurally", "phonemically"] }
      ]
    },

    pavlov: {
      topic: "classical", title: "Rebuild Pavlov",
      text: "Pavlov, a physiologist studying {0} in dogs, noticed they salivated at the sight of the assistants who fed them. Food is an {1} stimulus: it causes salivation without learning. He repeatedly sounded a {2} just before food. Eventually it produced salivation on its own, a {3} response. When it kept sounding without food, the response faded: {4}.",
      gaps: [
        { a: "digestion", d: ["memory", "aggression"] },
        { a: "unconditioned", d: ["conditioned", "neutral"] },
        { a: "metronome", d: ["trumpet", "drum"] },
        { a: "conditioned", d: ["unconditioned", "voluntary"] },
        { a: "extinction", d: ["shaping", "punishment"] }
      ]
    },

    skinner1948: {
      topic: "operant", title: "Rebuild Skinner's superstitious pigeons",
      text: "Skinner placed pigeons in a box where food arrived at {0} intervals, whatever the bird was doing. {1} of eight pigeons developed repeated rituals, such as turning in circles. Skinner called this {2} reinforcement and used it to explain human {3}. Staddon and Simmelhag later argued that some of the actions were time-linked, {4} behaviours.",
      gaps: [
        { a: "fixed", d: ["variable", "unpredictable"] },
        { a: "Six", d: ["Two", "All"] },
        { a: "accidental", d: ["negative", "vicarious"] },
        { a: "superstition", d: ["aggression", "forgetting"] },
        { a: "species-typical", d: ["punished", "imitated"] }
      ]
    },

    sana2013: {
      topic: "load", title: "Rebuild Sana, Weston and Cepeda",
      text: "In the first experiment, {0} university students took laptop notes during a lecture, and half were also given small online tasks. Multitaskers scored about {1} lower on comprehension. In a second experiment nobody multitasked, but students who could {2} other people's laptops scored about 17% lower. Cognitive load theory calls this kind of distraction {3} load. A limitation is that load was {4}, not measured directly.",
      gaps: [
        { a: "44", d: ["464", "12"] },
        { a: "11%", d: ["50%", "1%"] },
        { a: "see", d: ["hear", "borrow"] },
        { a: "extraneous", d: ["intrinsic", "germane"] },
        { a: "assumed", d: ["removed", "doubled"] }
      ]
    }
  }
};

/* Research methods that recur across the unit's studies (added for the Library). */
ODY.topics.methods = {
  name: 'Research methods in the unit', short: 'Methods', paper: 'C (and evaluation anywhere)',
  hook: 'The same handful of method terms decide how far every study in this unit can be trusted.',
  voice: [
    'Every study in this unit is only as strong as its method. So before you trust a finding, ask how the groups were formed and how the behaviour was measured.',
    'Manipulating the IV and allocating people at random is what supports a causal claim. Matching and repeated measures deal with differences between people. Neither makes a laboratory any less artificial.',
    'When you evaluate, be precise. A small, unusual sample threatens population validity. An artificial task threatens ecological validity. They are not the same problem, and examiners notice.'
  ],
  tutor: [
    "Every study in this unit is only as strong as its method. Before you trust a finding, ask two things: how were the groups formed, and how was the behaviour measured?",
    "In an independent samples design, different people do each condition. There are no order effects, but the groups may differ, as in Landry and Bartling, where each group had only seventeen students.",
    "In a repeated measures design, the same people do every condition, which controls participant differences but risks order effects, as in Glanzer and Cunitz. In a matched pairs design, participants are matched first, as Bandura matched children on prior aggression.",
    "Random allocation strengthens a causal claim, because participant differences are spread evenly across conditions. A natural experiment, such as Mani and colleagues comparing farmers before and after harvest, cannot allocate at random, so other changes may explain the result.",
    "Case studies such as HM and KF give rich data on rare cases, but one person may not generalise. Inter-rater reliability checks that observers agree, as in Bandura's study, where the raters' scores correlated at 0.89.",
    "The most common mistake is confusing validity terms. A small or narrow sample threatens population validity. An artificial task threatens ecological validity. In Section C, method points earn credit only when tied to the concept in the question."
  ],
  key: [
    'Independent samples: different people in each condition, so no order effects, but groups may differ (Sana et al., Landry and Bartling).',
    'Repeated measures: the same people do every condition, which controls participant differences but risks order effects (Glanzer and Cunitz).',
    'Matched pairs: participants matched on a relevant variable before allocation (Bandura matched children on prior aggression).',
    'Random allocation strengthens causal claims; a natural experiment (Mani et al. harvest) cannot allocate at random.',
    'Inter-rater reliability checks that observers agree (Bandura: r = 0.89).',
    'Case studies (HM, KF) give rich data on rare cases, but one person may not generalise.',
    'Ecological validity is about how natural the task is; population validity is about who was sampled (WEIRD samples).'
  ],
  terms: [
    ['Operationalisation', 'Turning a construct, such as aggression or cognitive load, into something that can be measured.'],
    ['Demand characteristics', 'Cues that let participants guess the aim, so they change their behaviour.'],
    ['Triangulation', 'Using several methods, sources or researchers to check that a finding holds.'],
    ['Natural experiment', 'The IV varies naturally (before and after a harvest); the researcher does not manipulate it.'],
    ['WEIRD', 'Western, educated, industrialised, rich and democratic samples, which may not represent humans in general.'],
    ['Standardisation', 'Keeping procedures identical for every participant so results can be compared and replicated.']
  ],
  studies: [], strengths: [], limitations: [],
  misconceptions: [['"The sample was small, so ecological validity is low."', 'A sampling problem affects population validity. Ecological validity is about how realistic the task or setting is.']],
  examTips: ['In Section C, method points only earn credit when they are tied to the concept in the question, for example measurement or causality.']
};
