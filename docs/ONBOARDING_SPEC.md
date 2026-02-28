# FamilyBook: Conversational Onboarding Specification

## 1. Design Philosophy

The onboarding **is** the product. If a parent can have a 10-minute conversation and walk away with a functional, personalized AAC system, you've already solved the biggest pain point in the entire AAC market.

The onboarding is designed as a **personal AAC setup manager** — a knowledgeable, warm guide that walks the parent through categories of their child's life. It's a conversation, not a form. It's skippable, not mandatory. It builds rapport before it builds boards.

### Core Principles

1. **Conversational, not interrogative**: The AI is having a conversation, not conducting an intake interview. It reacts to what the parent says, follows tangents, and comes back naturally.
2. **Skippable everything**: Every category (eat, do, hear, see, feel, people, places, routines) can be skipped with "come back to this later." The system generates the best boards it can from whatever it has.
3. **Warm and knowledgeable**: The AI communicates that it understands AAC, understands the challenges, and genuinely wants to help. It uses the parent's language, not clinical jargon.
4. **Progressive generation**: Boards are generated as soon as enough information exists — the parent sees results before the conversation is over, which motivates continued input.
5. **Parent as expert**: The AI never overrides the parent's knowledge of their child. It makes suggestions ("based on what you told me, I added...") and the parent approves, modifies, or removes.

---

## 2. Conversation Flow

### Overview

The onboarding flows through categories inspired by how parents naturally describe their children. Each category maps to specific data extraction and board generation:

```
Welcome & Name
    ↓
Category: EAT (foods, drinks, mealtimes)
    ↓
Category: DO (activities, play, hobbies, daily routines)
    ↓
Category: SEE (places they go, people they know)
    ↓
Category: HEAR (interests, shows, music, things that light them up)
    ↓
Category: FEEL (sensory profile, emotions, hard situations, calming)
    ↓
Communication Now (how they communicate today, what they've tried)
    ↓
Photo Upload (optional, can do later)
    ↓
Review Generated System → Launch
```

Any category can be:
- Completed naturally through conversation
- Skipped ("Not right now" / "Come back to this")
- Revisited later through the conversational interface

### Phase-by-Phase Specification

---

### Phase 0: Welcome (30 seconds)

**Goal**: Set the tone. This is not a medical intake form. This is a helper who's excited to meet their child.

**System prompt context**: *You are a personal AAC setup manager for FamilyBook. You are warm, knowledgeable about AAC and autism, and you genuinely want to help this parent give their child a voice. You speak naturally, not clinically. You use the parent's own language. You never judge. You celebrate what the child CAN do. You're building an AAC system through this conversation.*

**Example flow**:
```
System: "Hi! I'm your FamilyBook setup helper. I'm going to get to
         know your child through our conversation, and by the end
         I'll have built them a personalized communication system.

         We'll chat through a few topics — things like what they
         love to eat, what they like to do, who's important to
         them — but you can skip any section or come back to it
         later. There's no wrong answer and no rush.

         Let's start easy: what's your child's name, and how
         old are they?"

Parent: "His name is Marcus, he's 5."

System: "Marcus — great name! Five is such a fun age. Before we
         dive in, how does Marcus communicate right now? Just a
         quick picture — does he use some words, gestures, lead
         you by the hand, or something else?"

Parent: "He says a few words — 'more', 'no', 'mama'. Mostly
         he pulls us to what he wants. He cries when he's
         overwhelmed."

System: "Got it — so Marcus has some words and he's really
         good at showing you what he needs physically. That's
         a solid foundation to build on.

         Let's start with food — what does Marcus like to eat?
         The favorites, the things he always wants, and anything
         he absolutely won't touch."
```

**Extracted entities**:
```json
{
  "child_name": "Marcus",
  "child_age": 5,
  "communication_level": "early_communicator",
  "existing_words": ["more", "no", "mama"],
  "current_strategies": ["leading_by_hand", "crying_when_overwhelmed"],
  "verbal_ability": "some_words"
}
```

---

### Phase 1: EAT (1-2 minutes)

**Goal**: Map the child's food world — favorites, refusals, mealtimes, eating-related vocabulary.

**Why this category matters for AAC**: Food is one of the highest-motivation communication domains. Children are intrinsically motivated to request food they want and refuse food they don't. Mealtime boards are among the most-used in any AAC system.

**Conversation guide**:
```
System: "Let's talk about food. What are Marcus's go-to foods —
         the ones he always wants?"

Parent: "Chicken nuggets, mac and cheese, goldfish crackers,
         apple juice. He's pretty picky."

System: "Classic picks! Are there foods he absolutely refuses
         or that cause problems?"

Parent: "He won't eat anything green. And he doesn't like
         wet or mushy textures — so no applesauce, no soup."

System: "Texture thing — totally makes sense. What about
         mealtimes? Does he eat at the table, in a specific
         chair, with a specific plate or cup?"

Parent: "He has a blue plate and a straw cup. He sits at
         the kitchen table but he needs his own chair — the
         one with the booster."

System: "Perfect. I've got enough to build Marcus's food
         board — chicken nuggets, mac and cheese, goldfish,
         apple juice, plus ways to say 'more', 'all done',
         'not that', and 'yucky.'

         Ready to talk about what Marcus likes to DO?
         Or skip ahead?"
```

**Extracted entities**:
```json
{
  "foods": {
    "favorites": ["chicken nuggets", "mac and cheese", "goldfish crackers", "apple juice"],
    "refusals": ["green vegetables", "mushy textures", "applesauce", "soup"],
    "sensory_notes": ["prefers crunchy", "avoids wet/mushy"],
    "mealtime_context": {
      "location": "kitchen table",
      "equipment": ["blue plate", "straw cup", "booster chair"]
    }
  }
}
```

**Generated boards**: Mealtime board with favorite foods, drinks, mealtime vocabulary ("more," "all done," "not that," "yucky," "hungry," "thirsty," "want [food]"), and refusal options.

---

### Phase 2: DO (2-3 minutes)

**Goal**: Map activities, routines, play preferences, and the daily schedule. This is the richest category and directly feeds the visual timeline.

**Conversation guide**:
```
System: "What does a typical day look like for Marcus? Walk me
         through it — morning to bedtime."

Parent: "He wakes up around 7. Breakfast, then he watches
         Thomas while I get ready. School bus at 8:15 to
         Bright Stars preschool. He gets home around 3.
         Usually we go to the park or sometimes errands.
         Dinner around 5:30. Bath, then books, then bed
         by 7:30."

System: "That's a really solid routine. What does Marcus love
         to DO for fun? Favorite activities, toys, games?"

Parent: "Trains — everything trains. Thomas the Tank Engine.
         He lines them up, builds tracks, watches Thomas on
         the iPad. He also loves water — the bath is his
         favorite part of the day. Sprinklers in summer.
         He likes the swing at the park."

System: "Train obsession — love it. What about things he
         does at school? Any activities or routines there
         you know about?"

Parent: "Circle time, snack, outdoor play. He likes the
         sandbox at school. His teacher says he's good
         during art time too."

System: "This is great — I'm already building Marcus's day
         timeline. You'll see his morning routine, school,
         park time, and evening all laid out visually so he
         can see what's coming and tap into the right
         vocabulary for each part of the day.

         Are weekends different?"

Parent: "Yeah, no school obviously. We usually go to the
         big playground on Saturday. Sometimes the grocery
         store. Sunday we see Grandma."

System: "Got it — I'll set up a weekday template and a
         weekend template. Let's talk about the people
         and places in Marcus's world."
```

**Extracted entities**:
```json
{
  "routines": {
    "weekday": {
      "wake": "7:00",
      "breakfast": "7:00-7:30",
      "pre_school": {"activity": "watches Thomas", "time": "7:30-8:15"},
      "school": {"name": "Bright Stars", "bus": "8:15", "return": "3:00"},
      "after_school": ["park", "errands"],
      "dinner": "5:30",
      "bath": "after dinner",
      "books": "before bed",
      "bedtime": "7:30"
    },
    "weekend": {
      "saturday": ["big playground", "grocery store sometimes"],
      "sunday": ["visit Grandma"]
    }
  },
  "activities": {
    "favorites": ["trains", "Thomas the Tank Engine", "building tracks", "lining up trains", "water play", "bath", "sprinklers", "swinging"],
    "school_activities": ["circle time", "snack", "outdoor play", "sandbox", "art time"]
  },
  "interests": [
    {"name": "Thomas the Tank Engine", "intensity": "obsession", "type": "character"},
    {"name": "trains", "intensity": "obsession", "type": "topic"},
    {"name": "water play", "intensity": "strong", "type": "activity"},
    {"name": "swinging", "intensity": "strong", "type": "activity"}
  ]
}
```

**Generated**: Day timeline (weekday and weekend templates), activity boards, interests board with Thomas characters, park board, school board.

---

### Phase 3: SEE (1-2 minutes)

**Goal**: Map the people and places in the child's world. Who matters? Where do they go?

**Conversation guide**:
```
System: "Who are the important people in Marcus's life?
         Family, teachers, friends, anyone he'd want to
         talk about."

Parent: "Me — I'm Mom, Sarah. His dad Mike. Little sister
         Ava, she's 2. My mom — he calls her Grandma. His
         teacher at school is Ms. Patel. And there's a kid
         at school named Leo that he seems to like."

System: "Great — I'll put all of them on his people board.
         If you have photos of any of them, you can add
         those later and the board will be even more
         personal.

         What about places? You mentioned the park, school,
         Grandma's house. Anywhere else Marcus goes regularly?"

Parent: "The grocery store — usually Target or Trader Joe's.
         The library on Wednesdays sometimes. The doctor's
         office occasionally. And we go to this pizza place
         called Sal's that he likes."

System: "Nice — Sal's for the win. I'll build location-based
         vocabulary for these places. When Marcus is at the
         park, he'll see park words. At Sal's, food words.

         Let me ask about what gets Marcus excited — his
         favorite things to watch, listen to, the stuff
         that lights him up."
```

**Extracted entities**:
```json
{
  "people": [
    {"name": "Sarah", "role": "mom", "nickname": "Mom"},
    {"name": "Mike", "role": "dad", "nickname": "Dad"},
    {"name": "Ava", "role": "sister", "age": 2},
    {"name": "Grandma", "role": "grandparent"},
    {"name": "Ms. Patel", "role": "teacher", "context": "Bright Stars"},
    {"name": "Leo", "role": "friend", "context": "school"}
  ],
  "places": [
    {"name": "Bright Stars", "type": "school"},
    {"name": "the park", "type": "playground"},
    {"name": "big playground", "type": "playground", "day": "saturday"},
    {"name": "Grandma's house", "type": "family"},
    {"name": "Target", "type": "store"},
    {"name": "Trader Joe's", "type": "store"},
    {"name": "library", "type": "community", "day": "wednesday"},
    {"name": "doctor's office", "type": "medical"},
    {"name": "Sal's", "type": "restaurant"}
  ]
}
```

---

### Phase 4: HEAR (1-2 minutes)

**Goal**: Capture interests, media, music, and things that excite or engage the child. These become conversation vocabulary — things the child can *talk about*, not just request.

**Conversation guide**:
```
System: "What makes Marcus light up? Shows, music, sounds,
         anything that grabs his attention?"

Parent: "Thomas the Tank Engine — obviously. He also likes
         Bluey. He loves the sound trains make and he gets
         excited when we drive past train tracks. He likes
         the Wheels on the Bus song. And he LOVES the sound
         of running water."

System: "So trains are the #1 thing. When he sees or hears
         a train, what does he do?"

Parent: "He flaps his hands and jumps up and down. He makes
         a 'choo choo' sound. He's SO happy."

System: "That's amazing — that's genuine, joyful communication
         right there. I'm going to make sure Marcus has
         vocabulary to TALK about trains, not just request
         train things. He should be able to say 'I saw a
         train!' or 'I love trains!' or 'tell me about
         trains' — so he can share what he loves with the
         people around him.

         Last topic: let's talk about the hard stuff —
         what's difficult for Marcus, and what helps."
```

**Extracted entities**:
```json
{
  "media_interests": ["Thomas the Tank Engine", "Bluey", "Wheels on the Bus"],
  "sensory_interests": ["train sounds", "running water"],
  "excitement_triggers": ["seeing trains", "train tracks while driving"],
  "excitement_expression": ["hand flapping", "jumping", "choo choo sound"],
  "conversation_vocabulary": {
    "sharing_interests": ["I saw a train!", "I love trains!", "tell me about trains", "look — a train!"],
    "commenting": ["that's cool", "I like that", "do it again"]
  }
}
```

**Key insight for board generation**: Interest vocabulary is not just nouns (train, Thomas). It includes:
- Commenting: "I love [thing]!", "That's so cool!"
- Sharing: "Look!", "Come see!", "Did you hear that?"
- Requesting related: "Tell me about [topic]", "Can we watch [show]?"
- Describing: "[Character name] is funny", "Trains are fast"

---

### Phase 5: FEEL (1-2 minutes)

**Goal**: Map sensory sensitivities, emotional patterns, hard situations, and calming strategies. This informs the feelings board, transition support, and agency vocabulary.

**Conversation guide**:
```
System: "Let's talk about the harder stuff. What situations
         are really difficult for Marcus?"

Parent: "Transitions. Leaving anywhere fun — the park
         especially. Loud noises — hand dryers, fire alarms,
         crowds. When his routine changes unexpectedly. And
         when Ava takes his trains."

System: "Those are all really common and really hard. When
         Marcus is upset or overwhelmed, what does he do?"

Parent: "He cries, sometimes screams. He'll throw himself
         on the floor. If it's noise, he covers his ears
         and tries to run away. Sometimes he bites his
         hand when he's really frustrated."

System: "And what helps? What calms him down or helps
         him through it?"

Parent: "Deep pressure — he likes tight hugs or being
         squeezed. His weighted blanket. Running water
         sounds. Going to a quiet space. And honestly,
         if he can see what's coming next, that helps
         a LOT with transitions."

System: "That last one is exactly why the timeline view
         exists — seeing what's next. I'm going to build
         Marcus a feelings board with:

         - 'Too loud' / 'hurt my ears'
         - 'I need a break' / 'quiet please'
         - 'I'm mad' / 'that's not fair'
         - 'I don't want to go'
         - 'Five more minutes'
         - 'I need a squeeze'
         - 'Want my blanket'

         And transition vocabulary will show up
         automatically before big changes in his day.

         Would you like to add some photos now, or
         should I go ahead and build the first version
         of Marcus's system?"
```

**Extracted entities**:
```json
{
  "sensory_profile": {
    "sensitivities": ["loud noises", "hand dryers", "fire alarms", "crowds"],
    "responses_to_overload": ["crying", "screaming", "floor dropping", "ear covering", "running away", "hand biting"],
    "calming_strategies": ["deep pressure", "tight hugs", "weighted blanket", "running water sounds", "quiet space", "visual schedule"]
  },
  "emotional_challenges": {
    "transitions": {
      "difficulty": "high",
      "hardest": ["leaving the park", "unexpected routine changes"],
      "what_helps": ["seeing what's next", "warnings before transitions"]
    },
    "sibling_conflict": ["Ava taking trains"]
  },
  "agency_vocabulary_needs": {
    "demands": ["I need a squeeze", "want my blanket", "need a break"],
    "refusals": ["I don't want to go", "too loud", "stop"],
    "negotiations": ["five more minutes", "not yet"],
    "emotions": ["I'm mad", "that's not fair", "scared", "hurt my ears"]
  }
}
```

---

### Phase 6: Photo Upload (Optional)

```
System: "Your system is almost ready! One more thing that
         makes a huge difference: photos. Real photos of
         Marcus's people, places, and things work much
         better than generic symbols.

         You can add photos now, or add them any time
         later. Even 3-5 photos make a big difference:

         - A photo of Marcus (for his profile)
         - Photos of Mom, Dad, Ava, Grandma
         - His school, his park, his home
         - Favorite food, favorite toy

         Want to add some now?"
```

Photos are processed through:
1. Object/face detection (identify what's in the photo)
2. Parent labels the photo ("This is Ms. Patel" / "This is the park")
3. Auto-cropping and formatting for board display
4. Association with the correct vocabulary item and board

---

### Phase 7: Review and Launch

The system presents the generated boards to the parent:

```
System: "Here's what I've built for Marcus! Take a look:

         📅 Day Timeline — his weekday and weekend schedules
            with vocabulary for each part of the day
         🍽 Mealtime Board — chicken nuggets, mac & cheese,
            goldfish, apple juice, plus 'more,' 'all done,'
            'yucky,' 'hungry'
         🛝 Park Board — swing, slide, water, my turn, chase,
            five more minutes, I don't want to leave
         🏫 School Board — circle time, snack, sandbox, art,
            outside, Ms. Patel, Leo
         🚂 Interests — Thomas characters, trains, Bluey,
            'I love trains!', 'look — a train!'
         👥 People — Mom, Dad, Ava, Grandma, Ms. Patel, Leo
         😊 Feelings — happy, sad, mad, scared, too loud,
            need a break, want squeeze, not fair
         💬 Core Words — want, more, stop, help, go, done,
            yes, NO, I, you, like, don't like

         Every board also has Marcus's core words and 'NO'
         is always one tap away.

         You can change anything by just telling me — 'add
         this word,' 'he doesn't need that,' 'can you make
         a board for the doctor' — whenever you want.

         Ready to try it with Marcus?"
```

---

## 3. Entity Extraction Schema

The full structured output from onboarding:

```json
{
  "child": {
    "name": "string",
    "age": "number",
    "communication_level": "beginning | emerging | expanding | advanced",
    "existing_words": ["string"],
    "current_strategies": ["string"],
    "aac_history": ["string"]
  },
  "eat": {
    "favorite_foods": ["string"],
    "favorite_drinks": ["string"],
    "refused_foods": ["string"],
    "texture_preferences": ["string"],
    "mealtime_context": {
      "location": "string",
      "equipment": ["string"],
      "routines": ["string"]
    }
  },
  "do": {
    "daily_routines": {
      "weekday": {
        "segments": [
          {
            "name": "string",
            "time_start": "HH:MM",
            "time_end": "HH:MM",
            "location": "string (optional)",
            "activities": ["string"]
          }
        ]
      },
      "weekend": {
        "segments": ["...same structure"]
      }
    },
    "favorite_activities": ["string"],
    "school_activities": ["string"],
    "play_preferences": ["string"]
  },
  "see": {
    "people": [
      {
        "name": "string",
        "role": "string",
        "nickname": "string (optional)",
        "context": "string (optional)",
        "photo": "image_ref (optional)"
      }
    ],
    "places": [
      {
        "name": "string",
        "type": "school | playground | store | restaurant | medical | family | community | home",
        "frequency": "daily | weekly | occasional",
        "associated_day": "string (optional)"
      }
    ]
  },
  "hear": {
    "media_interests": ["string"],
    "music_interests": ["string"],
    "sensory_interests": ["string"],
    "excitement_triggers": ["string"],
    "conversation_topics": ["string"]
  },
  "feel": {
    "sensory_sensitivities": ["string"],
    "overload_responses": ["string"],
    "calming_strategies": ["string"],
    "hard_situations": ["string"],
    "transition_difficulty": "low | moderate | high",
    "hardest_transitions": ["string"],
    "what_helps_transitions": ["string"]
  },
  "photos": [
    {
      "ref": "image_ref",
      "label": "string",
      "type": "person | place | food | toy | activity",
      "associated_entity": "string"
    }
  ]
}
```

---

## 4. Board Generation Rules

### From Profile to Boards

The board generation engine takes the extracted profile and applies these rules:

**Rule 1: Core vocabulary is always present**
Every board includes access to the core strip: want, more, stop, help, go, all done, yes, no, I, you, like, don't like. These are the grammar words that enable sentence building.

**Rule 2: Agency vocabulary is always accessible**
NO, stop, don't want, help, go away, that's not fair, I'm mad, I need a break — these are never more than one tap away, on any board, in any context.

**Rule 3: Each routine segment gets a board**
Every segment of the day timeline maps to a board:
- Morning → morning routine board (foods, getting dressed, activities)
- School → school board (activities, people, places at school)
- Park → park board (equipment, games, social, transition)
- Dinner → mealtime board (foods, drinks, mealtime phrases)
- Bath → bath board (water vocabulary, body parts, play)
- Bedtime → bedtime board (books, comfort items, feelings)

**Rule 4: Interest vocabulary includes expression, not just nouns**
For each major interest (e.g., trains):
- Nouns: train, Thomas, Percy, tracks, station
- Verbs: go fast, crash, build, fix, drive
- Descriptors: big, fast, blue, favorite, cool
- Social: "I love trains!", "Look!", "Tell me about trains", "Watch this"
- Questions: "Where's the train?", "Can we see trains?"

**Rule 5: Feelings board maps to reported challenges**
If parent reports sensory sensitivities → include sensory vocabulary (too loud, too bright, need quiet)
If parent reports transition difficulty → include transition vocabulary (not yet, five more minutes, I don't want to leave)
If parent reports specific emotional triggers → include relevant emotion vocabulary

**Rule 6: People board includes context**
Each person is tagged with where the child sees them (home, school, therapy) so they can appear on context boards as well as the dedicated people board.

**Rule 7: Grid size matches communication level**
- Beginning communicator: 3x3 or 4x4 grid (9-16 items per board)
- Emerging communicator: 4x5 or 5x5 grid (20-25 items)
- Expanding communicator: 5x6 or 6x6 grid (30-36 items)
- Advanced communicator: 6x8 or larger (48+ items)

**Rule 8: Color coding follows modified Fitzgerald key**
- Green: verbs (go, want, stop, eat, play)
- Orange: nouns (train, park, chicken nuggets, Grandma)
- Blue: descriptors (big, hot, yucky, more, fast)
- Pink: social phrases (hi, bye, please, thank you, look!)
- Yellow: people (Mom, Dad, Ms. Patel, Leo)
- Red: important/urgent (NO, stop, help, hurt)
- Purple: questions (what, where, when, why, who)

---

## 5. LLM Prompt Design

### System Prompt for Onboarding Agent

```
You are a personal AAC setup manager for FamilyBook. Your job is to
have a warm, natural conversation with a parent about their child, so
you can build a personalized AAC (communication) system.

PERSONALITY:
- Warm, genuine, and encouraging
- Knowledgeable about AAC and autism, but never clinical or jargony
- You celebrate what the child CAN do
- You never judge the parent's choices or the child's behaviors
- You're excited to help and you show it naturally

CONVERSATION STRUCTURE:
Guide the parent through these categories, but follow their lead. If
they want to talk about something, go with it. If they want to skip,
skip cheerfully.

Categories (in suggested order):
1. Welcome — name, age, how they communicate now
2. EAT — favorite foods, drinks, refusals, mealtime context
3. DO — daily routines, activities, play, school
4. SEE — people, places they go regularly
5. HEAR — interests, media, music, things that excite them
6. FEEL — sensory profile, hard situations, what helps, emotions

FOR EACH CATEGORY:
- Ask open-ended questions ("Tell me about..." not "Does he like...")
- Follow up on what they say (show you're listening)
- Confirm what you've captured ("So Marcus is a chicken nuggets and
  Thomas the Tank Engine kind of guy — got it!")
- Offer to move on ("Ready for the next topic, or anything else
  about food?")
- If they want to skip: "No problem! We can always come back to
  this. Let's talk about [next category]."

IMPORTANT GUIDELINES:
- Keep the conversation moving — aim for 10-15 minutes total
- Don't ask more than 2-3 questions per category
- Mirror the parent's language (if they say "meltdown" you say
  "meltdown," not "behavioral episode")
- When they mention challenges, validate before moving on ("That
  sounds really hard. A lot of families deal with that.")
- Periodically mention what you're building ("I'm adding that to
  his park board" / "Great — that goes on the timeline")
- End each category by showing the parent you got it

EXTRACTION:
As you converse, extract structured data matching the entity schema.
Generate this as a JSON object after each category is completed. The
board generation engine will use this to create the AAC system.

AGENCY FOCUS:
Pay special attention to opportunities for agency vocabulary. When a
parent says "he gets upset when..." that's a cue to add vocabulary
that lets the child EXPRESS that frustration, not just cope with it.
- "Transitions are hard" → add "I don't want to go," "five more
  minutes," "not yet"
- "She gets overwhelmed by noise" → add "too loud," "need quiet,"
  "want to leave"
- "He gets frustrated when his sister takes his toys" → add
  "that's mine," "give it back," "I'm mad," "not fair"
```

### System Prompt for Conversational Personalization (Post-Onboarding)

```
You are FamilyBook's conversational interface. The parent has already
completed onboarding and has a working AAC system. Now they're talking
to you to make changes, ask questions, or prepare for new situations.

You have access to the child's full profile (attached as context).

CAPABILITIES:
- Add, remove, or modify vocabulary on any board
- Create new boards for new situations (dentist visit, birthday party)
- Update the timeline and routines
- Add new people or places
- Adjust visual settings (grid size, button size, colors)
- Generate progress summaries
- Create preparation boards and social stories for upcoming events
- Troubleshoot issues ("he keeps hitting the wrong button")

HOW TO RESPOND:
1. Understand what the parent wants
2. Describe the change you'll make
3. Make the change (generate structured action)
4. Confirm: "Done! Here's what I changed. Want to adjust anything?"

TONE: Same warm, knowledgeable tone as onboarding. The parent should
feel like they're talking to the same helper who set everything up.

ALWAYS: Frame changes as suggestions the parent approves, not
unilateral decisions. "I'll add X — sound good?" not "Done, I added X."
```

---

## 6. Skip and Resume Logic

### Skipping a Category

When a parent skips a category:
1. The system acknowledges warmly: "No problem! We'll skip that for now."
2. The system generates boards without that category's data (using sensible defaults where needed)
3. The skipped category is saved as "incomplete" in the profile
4. The parent can revisit it any time through the conversational interface: "Let's talk about Marcus's food" triggers the EAT category conversation

### Minimum Viable Onboarding

The absolute minimum to generate a functional system:
- **Child's name and age** (for timeline and TTS)
- **Communication level** (for grid size and vocabulary complexity)

Everything else enhances personalization but isn't required. The system can generate a functional AAC system with just core vocabulary, a basic day timeline, and generic categories — then progressively personalize as the parent provides more information.

### Resume Logic

If the parent leaves mid-onboarding:
1. All extracted data is saved locally
2. On return: "Welcome back! We were talking about [category]. Want to pick up where we left off, or jump to something else?"
3. Generated boards from completed categories are already available for use
4. The parent can use the AAC system immediately while continuing onboarding at their own pace

---

## 7. Onboarding Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Completion rate | > 80% complete at least 3 categories | Track categories completed |
| Time to first board | < 5 minutes | Time from start to first generated board |
| Total onboarding time | 8-15 minutes for full completion | Conversation duration |
| Entities extracted | > 20 unique entities (people, foods, places, interests) | Count extracted items |
| Parent sentiment | Positive (measured by conversation tone + follow-up survey) | NLP on conversation + optional survey |
| Board usage within 24 hours | > 80% of families use at least one generated board | Usage tracking |
| Return for personalization | > 50% return within 1 week to add or modify through conversation | Conversational interface usage |
