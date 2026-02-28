# FamilyBook: Research Bibliography

Every design decision in FamilyBook is grounded in published research. This document catalogs the key studies, what they found, and how their findings directly inform FamilyBook's design.

---

## Core Studies

### AACessTalk: Fostering Communication between Minimally Verbal Autistic Children and Parents with LLM
**Source**: CHI 2025 (Best Paper Award) — https://arxiv.org/abs/2409.09641

**What they did**: Built an LLM-mediated communication system for minimally verbal autistic children and their parents. The system provides real-time contextual vocabulary cards to children and conversation guidance to parents during interactions.

**Key findings**:
- 2-week deployment with 11 child-parent dyads
- Children selected 2,244 recommended vocabulary cards across the study
- Parents incorporated the system's conversational guidance in **78% of their turns**
- The system increased turn-taking and sustained engagement
- Parents discovered their own interaction strategies through the AI guidance
- Contextual vocabulary cards (generated based on conversation flow) drove higher engagement than static vocabulary

**How this informs FamilyBook**:
- **Conversational onboarding**: If parents naturally incorporate AI guidance 78% of the time, a conversational onboarding will feel natural, not forced
- **Communication partner guidance**: Real-time tips for parents during AAC use, modeled on AACessTalk's approach
- **Contextual vocabulary**: Vocabulary should shift based on conversational and situational context, not remain static
- **Engagement through personalization**: AI-generated vocabulary matched to the child's interests and situation drives use

---

### QuickPic AAC: An AI-Based Application to Enable Just-in-Time Generation of Topic-Specific Displays
**Source**: PMC 2024 — https://pmc.ncbi.nlm.nih.gov/articles/PMC11431105/

**Also covered**: Psychology Today — https://www.psychologytoday.com/us/blog/inspectrum/202402/autism-app-targets-the-holy-grail-of-communication

**What they did**: Created an app that uses GPT-3.5 to generate topic-specific AAC communication boards from photographs in real-time. A parent takes a photo of an environment, and the AI generates relevant vocabulary and a usable communication board.

**Key findings**:
- SLPs expressed high satisfaction with the generated boards
- AI-generated vocabulary was contextually appropriate for the photographed environments
- The approach dramatically reduces the time needed to create topic-specific boards
- Called "the holy grail of communication" by researchers for its potential to make AAC truly responsive to the moment

**How this informs FamilyBook**:
- **Smart photo-to-board**: FamilyBook extends this — parents can photograph any environment and get an instant communication board
- **Just-in-time vocabulary**: Boards don't need to be pre-programmed for every possible situation
- **Conversational generation**: FamilyBook goes further by generating boards from *descriptions*, not just photos ("we're going to the dentist tomorrow")

---

### Temple University RERC: Context-Aware AAC Research
**Source**: Temple University News, October 2025 — https://news.temple.edu/news/2025-10-28/temple-research-brings-new-voice-people-communication-limitations

**Student research (Zastudil)**: https://cis.temple.edu/~pwang//5603-AI/Project/2023F/ZastudilCindy/Zastudil_FinalReport.pdf

**What they did**: With $5M in federal funding, Temple University's Rehabilitation Engineering Research Center is developing context-aware AAC that uses computer vision to provide relevant communication options as users move through environments. The Zastudil project demonstrated combining object detection with GPT-4 to generate not just nouns but verbs and descriptors from photos, using color-coded vocabulary categories.

**Key findings**:
- Computer vision can identify objects in an environment in real-time
- LLMs can generate appropriate verbs, adjectives, and social phrases from visual scenes (not just nouns)
- Color-coded vocabulary categories (nouns, verbs, descriptors, social phrases) help users navigate generated boards
- The RERC is actively pursuing this as a funded research direction, validating the approach

**How this informs FamilyBook**:
- **Computer vision integration**: Photo-to-board feature should generate full vocabulary (verbs, adjectives, social phrases) not just object labels
- **Color-coded categories**: Use established color-coding conventions from AAC research (modified Fitzgerald key)
- **Context from environment**: GPS + camera + time can infer context without the parent manually selecting it

---

## Abandonment and Adoption Research

### SLP Perspectives on AAC Success vs. Abandonment
**Source**: PubMed — https://pubmed.ncbi.nlm.nih.gov/17114167/

**Key findings**:
- **Up to 60% of AAC devices are abandoned** within the first year
- Primary drivers of abandonment: poor device fit, inadequate training, insufficient ongoing support
- SLPs identified "match between device and user needs" as the #1 factor in success
- Lack of personalization leads to frustration and disuse

**How this informs FamilyBook**:
- **Conversational onboarding solves fit**: The device is personalized from the first conversation
- **Built-in guidance solves training**: The parent learns how to use it through the onboarding itself
- **Continuous AI assistance solves support**: Not a one-time SLP visit; ongoing help through conversation

---

### Parents' Perceptions of AAC: A Systematic Review
**Source**: PMC 2022 — https://pmc.ncbi.nlm.nih.gov/articles/PMC9266194/

**Key findings**:
- Parents report AAC **increases demands on their time** for programming and customization
- Parents feel AAC systems are not designed for the reality of daily life
- Parents want systems that adapt to their child's changing needs without constant manual updates
- Successful AAC use correlates strongly with how well the vocabulary matches the child's actual daily activities and interests

**How this informs FamilyBook**:
- **Zero-programming design**: Conversational interaction replaces manual programming entirely
- **Automatic adaptation**: The system learns and adjusts over time without parent intervention
- **Daily-life grounding**: Onboarding focuses specifically on the child's real routines, places, people, and interests

---

### A Parent's Perspective on Non-Speaking Communication
**Source**: Illinois LEND — https://www.illinoislend.org/new-blog/2025/3/9/aac-a-parents-perspective-on-non-speaking-communication

**Key insights**:
- Parents describe a difficult path of system-hopping, incompatible devices, and inadequate training
- The emotional burden of feeling like your child's ability to communicate depends on your ability to program a device
- The importance of the child having their own voice — not a sanitized, polite version of communication
- Parents express need for a system that grows with the child instead of being outgrown

**How this informs FamilyBook**:
- **Agency in communication**: Vocabulary for demanding, refusing, expressing frustration — not just polite requests
- **Developmental scaffolding**: The system grows with the child, scaffolding toward more complex language
- **Reducing parent burden**: If the system is easy enough that it doesn't create additional stress, families will use it

---

## Vocabulary and Display Research

### AAC Core Vocabulary Research (ASHA)
**Source**: ASHA Practice Portal — https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/

**Key findings**:
- A small set of **core words accounts for approximately 80% of what people say** in daily communication
- Core vocabulary (want, more, stop, go, help, like, not, I, you, it, that, is, the, etc.) is consistent across ages, contexts, and communicators
- Fringe vocabulary (specific nouns, proper names, topic-specific words) makes up the remaining 20% but is critical for personalized, meaningful communication
- AAC does **NOT** inhibit speech development — it facilitates it across multiple studies

**How this informs FamilyBook**:
- **Core + fringe model**: Research-backed core vocabulary is always available; personalized fringe vocabulary from onboarding conversation
- **Core strip always visible**: The high-frequency words are never hidden behind navigation
- **Both are essential**: Core words enable grammar and sentence building; fringe words enable personal, specific communication

---

### Designing Effective AAC Displays: State of the Science
**Source**: PMC — https://pmc.ncbi.nlm.nih.gov/articles/PMC6436972/

**Key findings**:
- **Visual Scene Displays (VSDs)** — photographs of real scenes with embedded hotspots — outperform traditional grid displays for young children and beginning communicators
- Personalized photographs of the child's own environments, people, and objects drive higher engagement than generic symbols
- Grid size should match the child's visual and motor abilities — too many options overwhelm, too few limit expression
- Consistent placement of high-frequency words improves speed and reduces cognitive load

**How this informs FamilyBook**:
- **Real photos preferred**: The system uses parent-provided photos and AI-generated personalized images, not generic clip-art
- **Visual Scene Displays**: For younger children, photograph-based boards with hotspots may work better than grids
- **Consistent core placement**: Core vocabulary strip stays in the same position across all contexts
- **Adaptive grid size**: Grid density adjusts based on the child's demonstrated motor and visual abilities

---

### Video Visual Scene Displays for Preschoolers with ASD
**Source**: PMC — https://pmc.ncbi.nlm.nih.gov/articles/PMC8492768/

**Key findings**:
- Video-based visual scene displays (showing short video clips of familiar activities) increased engagement and communication attempts in preschool-aged children with ASD
- Dynamic, familiar content was more engaging than static representations
- Children showed higher rates of symbolic communication with personalized video content

**How this informs FamilyBook**:
- **Future feature: video boards**: Short video clips of familiar routines could serve as powerful communication boards
- **Dynamic content**: The timeline and context-switching create a sense of the boards being "alive" and connected to real life

---

## AI and Autism Communication Research

### Generative AI for Neurodivergent Communication
**Source**: PMC 2025 — https://pmc.ncbi.nlm.nih.gov/articles/PMC12380814/

**Key findings**:
- Generative AI can process complex non-verbal inputs including gaze patterns, repetitive movement, and environmental cues
- AI can translate non-verbal states into coherent messages while affirming neurodivergent communication styles
- The approach validates non-verbal communication rather than trying to normalize it
- Multi-modal input processing can detect frustration, engagement, and preferences from behavioral signals

**How this informs FamilyBook**:
- **Multi-modal understanding**: Future versions can learn from interaction patterns — what the child taps repeatedly, what they skip, motor patterns
- **Affirming, not normalizing**: The system supports communication as the child naturally does it, not forcing a neurotypical communication model
- **Behavioral adaptation**: Button sizing, layout, and vocabulary adjust based on observed interaction patterns

---

### AI Technologies for Autism Communication
**Source**: Path2Potential, February 2025 — https://www.path2potential.org/2025/02/18/ai-technologies-autism/

**Key findings**:
- AI can enable real-time text-to-speech with personalized, natural-sounding voices
- Predictive text and context-aware suggestions can dramatically speed up communication
- AI can adapt to individual communication styles over time
- Integration of AI into existing AAC frameworks is an active area of development

**How this informs FamilyBook**:
- **Natural voice**: TTS should sound like a child, not a robot — age and personality-appropriate
- **Predictive vocabulary**: Context + history + time of day to surface the right words proactively
- **Individual adaptation**: Every child's system evolves differently based on their unique usage patterns

---

### Cooking Up Communication: AI for AAC Modeling Scripts
**Source**: Autism Spectrum News — https://autismspectrumnews.org/cooking-up-communication-a-recipe-for-using-ai-to-support-aac-with-modeling-scripts/

**Key findings**:
- AI can generate modeling scripts — specific instructions for caregivers on how to model AAC use during daily activities
- This reduces the burden on SLPs (who can't be present at every meal, bath, and playground visit)
- Modeling scripts matched to the activity context improve caregiver confidence and consistency
- The approach extends professional guidance into the home environment

**How this informs FamilyBook**:
- **Communication partner guidance**: The system generates context-specific tips for parents ("Try modeling 'Lily wants the big swing!' while pointing to the words")
- **Activity-matched scripts**: Guidance changes based on what the child is doing — breakfast modeling is different from playground modeling
- **Extending professional reach**: SLPs can set guidance preferences that the AI delivers throughout the day

---

## Market and Access Research

### AAC for Children with Autism: Current Status and Future Trends
**Source**: PMC 2016 — https://pmc.ncbi.nlm.nih.gov/articles/PMC5036660/

**Key findings**:
- 25-50% of autistic children remain minimally verbal even after intervention
- Early introduction of AAC leads to better outcomes across multiple studies
- Access disparities are significant — income, geography, and race all predict AAC access
- The field has been "waiting for technology to catch up" — AI may be the catalyst

**How this informs FamilyBook**:
- **Urgency**: Hundreds of thousands of children need better AAC tools now
- **Early access**: The system should be accessible to families with very young children (2-3 years)
- **Equity**: A smartphone-based, low-cost, AI-powered solution addresses access disparities directly

---

### AAC App Comparisons
**Sources**:
- Speech and Language Kids — https://www.speechandlanguagekids.com/aac-apps-review/
- Goally comparison — https://getgoally.com/compare-aac-apps/proloquo2go-vs-touchchat-aac/

**Current landscape**:
| App | Cost | Strengths | Weaknesses |
|-----|------|-----------|------------|
| Proloquo2Go | $250 | Comprehensive, well-established | Complex setup, steep learning curve, iOS only |
| TouchChat | $300 | Customizable, multiple page sets | Expensive, requires SLP knowledge to configure |
| LAMP Words for Life | $300 | Motor planning based, consistent layout | Less flexible, specific methodology |
| TD Snap | Free-$250 | Growing symbol library, Tobii integration | Less established, limited customization |
| Free AAC apps | Free | Accessible | Limited vocabulary, no personalization, often abandoned |

**Common gap across all**: None offer conversational setup, AI-driven personalization, context-awareness, or a visual timeline. Every one requires manual programming.

**How this informs FamilyBook**:
- **Clear market gap**: No current app does what FamilyBook proposes
- **Price accessibility**: Most families can't afford $250-$300 for an app that might be abandoned
- **Setup is the bottleneck**: Every competitor review mentions setup difficulty as a primary complaint

---

### Vanderbilt: Parent/Family Perspectives on AI-Enhanced AAC
**Source**: https://wp0.vanderbilt.edu/youngscientistjournal/article/enhancing-aac-systems-through-artificial-intelligence-parent-and-family-perspective-on-limitations-and-solutions

**Key findings**:
- Parents want AI that predicts frequently used symbols
- Parents want dynamic adjustment of scanning speeds for switch-access users
- Parents want contextually relevant phrases that reduce navigation time
- AI could help bridge the gap for families without regular SLP access
- Biggest frustration: generic symbols that don't represent the child's actual world

**How this informs FamilyBook**:
- **Predictive vocabulary**: Surface the most likely needed words based on context
- **Adaptive motor accommodation**: Adjust touch targets, scanning speed, layout based on observed motor patterns
- **Real representation**: Photos of the child's actual world, not generic symbols
- **Reduced navigation**: Context-aware boards mean less searching through folders

---

## Summary: Research → Design Mapping

| Research Finding | FamilyBook Feature |
|-----------------|-------------------|
| 60% abandonment driven by poor fit, lack of training, lack of support | Conversational onboarding (fit), built-in guidance (training), continuous AI (support) |
| 78% parent incorporation of AI guidance (AACessTalk) | Communication partner guidance built into the system |
| Photos outperform generic symbols (VSD research) | Real photos from parent uploads, AI-generated personalized images |
| Core vocabulary accounts for 80% of communication | Persistent core vocabulary strip visible in all contexts |
| Context-specific vocabulary drives engagement | Multi-signal context engine with timeline navigation |
| Parents report increased burden from AAC programming | Zero-programming: conversation replaces configuration |
| Transitions are the #1 challenge for autistic children | Visual timeline with transition warnings and support vocabulary |
| AAC facilitates (not inhibits) speech development | Designed for developmental scaffolding toward more complex language |
| Access disparities by income, geography, race | Smartphone-based, conversational setup, multilingual capable |
| AI can generate vocabulary from photos in real-time | Smart photo-to-board feature |
| Children need agency, not just request vocabulary | Full expression vocabulary: demands, refusals, emotions, questions, comments |
