# FamilyBook: Vision Document

## 1. The Problem in Human Terms

A parent of a non-verbal autistic child downloads an AAC app. They are immediately confronted with a grid of generic pictograms — a clip-art "house," a "cup," a "toilet." None of it is *their* house, *their* cup, *their* bathroom. The parent must now manually program hundreds of buttons, organize vocabulary into folders, add custom pictures, and learn a complicated interface — all while already stretched thin as a caregiver, advocate, scheduler, and therapist.

Research shows parents report AAC increases demands on their time. Roughly 60% of AAC users discontinue within a year. The system that was supposed to give their child a voice instead becomes another source of exhaustion.

And the child? They see a wall of unfamiliar symbols. They can tap "want" and "juice" — but they can't say "I'm mad because you turned off the TV." They can't demand. They can't refuse with emphasis. They can't say "that's hilarious." The device turns them into a polite request machine when what they need is a *voice*.

---

## 2. The Ideal Experience

### First Launch

The parent opens FamilyBook for the first time. A warm, conversational interface greets them:

> "I'm your personal AAC setup manager. I'm going to ask about your child so I can build them a communication system that's actually *theirs*. We'll go through a few topics — what they like to eat, do, hear, see — but you can skip anything or come back to it later. Ready?"

The parent talks naturally: *"His name is Marcus. He's five. He loves trains — specifically Thomas the Tank Engine. He goes to Bright Stars preschool. His teacher is Ms. Patel. He has a little sister named Ava. He gets really upset during transitions, especially leaving the playground. At dinner, he usually wants chicken nuggets or mac and cheese."*

### What Gets Generated

From that single conversation, FamilyBook builds:

- A **visual day timeline** showing Marcus's typical day — wake up, breakfast, school, park, dinner, bath, bed — that he can see, understand, and use to navigate to the right communication tools at the right time
- A **morning routine board** with his actual breakfast foods, his backpack, his school
- A **playground board** that appears when GPS detects they're at the park: "more swing," "want slide," "all done," "go home," "FIVE MORE MINUTES," "I don't want to leave"
- A **feelings board** with "too loud," "want break," "I'm mad," "that's not fair" — because the parent mentioned sensory sensitivity
- An **interests board** with Thomas characters, so Marcus can talk about what he *loves*, not just what he needs
- A **people board** with photos of Mom, Dad, Ava, Grandma, Ms. Patel
- A **week view** showing what's coming — school days, weekend, any special events the parent mentioned

### The Timeline

Children thrive on predictability. Many non-verbal autistic children already use visual schedules — a strip of pictures showing what happens next. FamilyBook makes this the *primary navigation*:

```
Marcus's Day (Tuesday)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌅 Wake Up  →  🥣 Breakfast  →  🚌 School  →  🏠 Home  →  🛝 Park  →  🍽 Dinner  →  🛁 Bath  →  📖 Bed
     ↑
  [YOU ARE HERE]
```

Tapping any point on the timeline opens the vocabulary and boards for that part of the day. The timeline also serves as a transition tool — Marcus can *see* what's coming next, which directly addresses one of the most common challenges parents report.

The **week view** extends this:

```
Marcus's Week
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mon: School → Park → Home
Tue: School → Grandma's → Home    ← TODAY
Wed: School → Speech therapy → Home
Thu: School → Park → Home
Fri: School → Home (movie night!)
Sat: No school! → Playground → Grocery store
Sun: No school! → Church → Grandma's
```

The child can see their week, anticipate what's coming, and communicate about future events ("I don't want to go to speech therapy tomorrow").

---

## 3. Communication with Agency

### Beyond Polite Requests

Most AAC systems are implicitly designed around a model of the child as a passive recipient — someone who *requests* things from caregivers. FamilyBook rejects this. Children are full people with opinions, frustrations, humor, and will. The vocabulary must support the full range of human expression:

**Demanding and Urgency**
- "I want that NOW"
- "Give me [thing]"
- "I need help RIGHT NOW"
- "Hurry up"
- Urgency modifiers: a way to mark any request as urgent (visual emphasis, louder TTS, repeated)

**Refusing and Rejecting**
- "NO"
- "Stop it"
- "I don't want that"
- "Go away"
- "Don't touch me"
- "That's gross"

**Negotiating**
- "Five more minutes"
- "After this one"
- "Can I have [X] instead?"
- "Not now, later"
- "If I do [X], then can I [Y]?"

**Expressing Emotions**
- "I'm mad because..."
- "That's not fair"
- "I'm scared"
- "I'm so happy!"
- "That hurts my feelings"
- "I miss [person]"

**Commenting and Social**
- "That's funny!"
- "Look at that!"
- "I like your [thing]"
- "Guess what happened"
- "Tell me a story"
- "That's boring"

**Asking Questions**
- "Why?"
- "When are we going?"
- "Where's [person]?"
- "What's that?"
- "Can I?"

This is not optional vocabulary. These categories are as important as "want" and "more." A child who can only request is a child whose communication system has already decided what kind of person they get to be.

### How Agency Shows Up in the UI

- **Emphasis controls**: Tap once for a normal statement, tap-and-hold or double-tap for emphasis ("want" vs. "WANT"). The TTS voice shifts in tone and volume.
- **Emotion overlays**: Any board can be overlaid with emotion modifiers — "I'm saying this because I'm mad" / "I'm saying this because I'm excited"
- **"No" is always visible**: The refusal vocabulary is never more than one tap away, in every context, on every board. A child must always be able to say no.
- **Conversation starters**: Not just responses — the child can initiate. "Guess what?" "I want to tell you something." "Come look at this."

---

## 4. Everything Is Conversational

### The Design Principle

Every aspect of FamilyBook can be personalized by talking or typing to it. There are no settings menus with dropdowns and toggles. There are no programming interfaces. When a parent wants to change something, they *tell* the system what they want, the same way they'd tell another person.

### Examples

**Adding vocabulary:**
> Parent: "Marcus started a new obsession — he's really into dinosaurs now, especially T-Rex and Triceratops."
>
> System: "Got it! I'll add a dinosaurs section to his interests board with T-Rex, Triceratops, and common dinosaur vocabulary. Want me to also add some dinosaur-related conversation starters so he can tell people about them?"

**Adjusting the schedule:**
> Parent: "We switched to a new daycare — it's called Sunshine Kids and his teacher is Mr. David."
>
> System: "Updated! I've changed the school references from Bright Stars to Sunshine Kids and replaced Ms. Patel with Mr. David. Want to add a photo of Mr. David?"

**Reporting a problem:**
> Parent: "He keeps accidentally hitting the 'all done' button when he's trying to hit 'more' — his fine motor isn't great."
>
> System: "I'll increase the spacing between those buttons and make the touch targets bigger. I can also add a short confirmation for 'all done' so accidental taps don't interrupt. Want to try that?"

**Preparing for something new:**
> Parent: "We have a dentist appointment on Thursday — it's his first time and I'm worried."
>
> System: "I'll create a dentist visit board with: open mouth, all done, scared, hurts, brave, go home, and a simple social story sequence about what happens at the dentist. Want me to add it to his Thursday timeline too?"

**Adjusting communication style:**
> Parent: "I feel like the boards are too simple for him now. He's starting to combine words more."
>
> System: "I've noticed that too — he's consistently using 2-word combinations. I'll start showing 3-word phrase options alongside the single words, so he can choose to expand when he's ready. I won't remove the single-word options."

This conversational interface applies to *everything*: changing the visual theme, adjusting voice settings, adding new people, modifying routines, reviewing progress, generating reports for the SLP. If a parent can describe what they want in plain language, the system can do it.

---

## 5. Context-Aware Communication

### The Context Engine

A child doesn't need the same vocabulary at breakfast that they need at the playground. Current AAC apps present the same static boards regardless of situation. FamilyBook's context engine combines multiple signals to surface the right vocabulary at the right time:

| Signal | Source | What It Determines |
|--------|--------|--------------------|
| Time of day | Device clock | Routine phase (morning, school, afternoon, evening, bedtime) |
| Day of week | Device clock | Weekday vs. weekend, specific day activities |
| Location | GPS + saved locations | Environment (home, school, park, grandma's house, store) |
| Wi-Fi network | Network detection | Finer-grained location (home vs. school) |
| Calendar | Integrated calendar | Upcoming events (dentist, birthday party, field trip) |
| Timeline position | Visual schedule | What the child is doing *right now* in their day |
| Recent selections | Usage history | Conversation topic continuity |
| Photo input | Camera | Immediate environmental context |

### Board Architecture

```
┌─────────────────────────────────────────────────────────┐
│  ALWAYS VISIBLE: Core Strip                             │
│  want │ more │ stop │ help │ go │ done │ yes │ NO │ I   │
├─────────────────────────────────────────────────────────┤
│  TIMELINE: Current position in day/week                 │
│  [Morning] → [School] → [*Park*] → [Dinner] → [Bed]    │
├─────────────────────────────────────────────────────────┤
│  CONTEXT LAYER: Vocabulary for current situation        │
│  (switches based on timeline + location + signals)      │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌──────┐ ┌────────┐ │
│  │swing│ │slide│ │water│ │turn │ │chase │ │5 more  │ │
│  │     │ │     │ │     │ │     │ │      │ │minutes │ │
│  └─────┘ └─────┘ └─────┘ └─────┘ └──────┘ └────────┘ │
├─────────────────────────────────────────────────────────┤
│  PERSONAL: Always accessible                            │
│  People │ Feelings │ Interests │ Questions               │
└─────────────────────────────────────────────────────────┘
```

- **Core strip** persists everywhere — high-frequency words that account for ~80% of communication (research-backed)
- **Timeline** shows where in the day the child is, and serves as navigation
- **Context layer** changes based on signals — this is where the personalized, situation-specific vocabulary lives
- **Personal layer** is always accessible — feelings, people, interests, and questions are never hidden behind navigation

### Transition Support

Transitions are the #1 reported challenge for autistic children. The context engine specifically addresses this:

1. **Advance warning**: 5 minutes before a typical transition, the system surfaces transition vocabulary: "5 more minutes," "almost time to go," visual countdown
2. **First-then boards**: "First [current activity], then [next activity]" — a visual bridge between contexts
3. **The timeline itself**: Seeing what comes next reduces anxiety about transitions
4. **Transition feelings**: "I don't want to leave," "this is hard," "I'm not ready" — acknowledging the child's experience

---

## 6. Continuous Learning

### Individual Adaptation

**Days 1-30:**
- Tracks which words are actually used vs. ignored
- Identifies common word combinations
- Learns daily rhythms (always asks for snack at 3 PM)
- Adjusts button sizes based on motor patterns
- Moves frequently-used words to more accessible positions

**Weeks 2-8:**
- Parent provides feedback through conversation
- System surfaces new vocabulary based on expanding interests
- Seasonal and event-based updates
- Sibling interaction boards when both children are detected

**Months 2-12 — Developmental Scaffolding:**
```
Stage 1 (Beginning): Single symbols → "want"
Stage 2 (Emerging):  Two-symbol combos → "want" + "train"
Stage 3 (Expanding): Three+ symbol sentences → "I" + "want" + "big" + "train"
Stage 4 (Advanced):  Novel combinations, questions → "why" + "no" + "park" + "today"
```

The system detects when a child is consistently performing at one level and scaffolds toward the next — not by removing the current level, but by offering opportunities to expand.

### The Parent Feedback Loop

The system periodically checks in conversationally:

> "I noticed Marcus hasn't used the feelings board much this week. Would you like me to embed feeling words into his other boards instead, try a different layout, or keep it as is? He might just not be ready yet — you know him best."

AI suggests. Parent decides. Always.

---

## 7. Impact

### The Numbers

- **400M+ people** worldwide have significant speech or communication disorders (WHO)
- **25-50% of autistic children** are minimally verbal, even after intervention
- AAC market: **$1.41B** in 2026, projected to **$2.94B** by 2035
- Current apps cost **$150-$300**, dedicated devices up to **$7,000+**
- **60% abandonment rate** driven by poor fit, lack of training, lack of support

### Three Impact Vectors

**1. Reduce Abandonment**
FamilyBook directly addresses the three drivers of abandonment:
- **Fit**: Personalized from the first conversation, adapts over time
- **Training**: The system teaches the parent through the onboarding conversation and ongoing conversational guidance
- **Support**: Continuous AI assistance, not a one-time SLP visit

**2. Democratize Access**
Current AAC requires: expensive device + knowledgeable SLP + hours of parent time + ongoing customization.
FamilyBook requires: **a smartphone + a 10-minute conversation**.

This changes who can access AAC:
- Families in rural areas without nearby SLPs
- Families in developing countries
- Families who can't afford $300 apps or $7,000 devices
- Families where parents work multiple jobs
- Multilingual families (the conversational onboarding works in any language the LLM supports)

**3. Generate Research Data**
With consent, anonymized usage patterns could become the largest AAC dataset ever assembled — informing which vocabulary items matter most at which ages, how context-awareness affects communication development, and what board layouts lead to the fastest communication.

---

## 8. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary navigation | Visual day/week timeline | Children already use visual schedules; makes the familiar the interface |
| Onboarding method | Conversational AI, skippable categories | Reduces cognitive burden; parents talk naturally about their child |
| Personalization method | Conversational everywhere | No settings menus; talk to it like a person |
| Agency model | Full expression including demands, refusals, emotions | AAC should enable a *voice*, not a request machine |
| Vocabulary approach | Core + personalized fringe | Research-backed core ensures coverage; fringe provides personalization |
| "No" placement | Always visible, every context | A child must always be able to refuse |
| Context switching | Multi-signal (time, location, timeline, manual) | No single signal is reliable; layering increases accuracy |
| Offline capability | Full offline-first | AAC is critical infrastructure; can't depend on connectivity |
| Privacy | On-device first, minimal cloud | Data about disabled minors requires highest protection |
| Progress tracking | Automatic, always-on | Removes burden from parents; provides data for SLPs |
| Visual style | Real photos preferred, symbols as fallback | Research shows personalized photos outperform generic symbols for young children |
| Developmental model | Detect and scaffold, never remove | System offers opportunities to expand, doesn't force progression |
