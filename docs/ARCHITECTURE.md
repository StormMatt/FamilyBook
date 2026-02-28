# FamilyBook: Technical Architecture

## 1. System Overview

```
┌──────────────────────────────────────────────────────────┐
│                   MOBILE APP (iOS/Android)                │
│                                                          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │ Child View    │  │ Parent View   │  │ Timeline     │  │
│  │ (AAC boards,  │  │ (Onboarding,  │  │ (Day/week    │  │
│  │  tap-to-speak │  │  conversation │  │  visual      │  │
│  │  core strip)  │  │  dashboard)   │  │  schedule)   │  │
│  └──────┬────────┘  └───────┬───────┘  └──────┬───────┘  │
│         │                   │                  │          │
│  ┌──────┴───────────────────┴──────────────────┴───────┐  │
│  │              LOCAL INTELLIGENCE LAYER                │  │
│  │  - On-device ML (speech, vision, prediction)        │  │
│  │  - Context engine (time, location, calendar)        │  │
│  │  - Usage pattern tracker                            │  │
│  │  - Offline-first boards and vocabulary              │  │
│  │  - Local encrypted storage (AES-256)                │  │
│  └──────────────────────┬──────────────────────────────┘  │
│                         │ (when online)                    │
└─────────────────────────┼────────────────────────────────┘
                          │
                    ┌─────┴──────┐
                    │  SECURE    │
                    │  API GW    │
                    └─────┬──────┘
                          │
┌─────────────────────────┼────────────────────────────────┐
│                    CLOUD BACKEND                          │
│                                                          │
│  ┌──────────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ LLM Service  │  │ Computer │  │ Profile & Progress│  │
│  │ (Onboarding, │  │ Vision   │  │ Store (encrypted) │  │
│  │  board gen,  │  │ Service  │  │                   │  │
│  │  guidance,   │  │          │  │                   │  │
│  │  convo UI)   │  │          │  │                   │  │
│  └──────────────┘  └──────────┘  └───────────────────┘  │
│  ┌──────────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Image Gen /  │  │ Analytics│  │ SLP Portal        │  │
│  │ Asset Mgmt   │  │ Engine   │  │ (future: web app) │  │
│  └──────────────┘  └──────────┘  └───────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Mobile app | React Native | Cross-platform (iOS + Android) from one codebase; large ecosystem; accessible to most developers |
| Child-facing UI | Custom rendering layer | Must have sub-100ms tap-to-speech response; no network calls in the critical path |
| Timeline component | Custom RN component | Visual day/week timeline is a core navigation element; needs smooth scrolling and animations |
| On-device ML | Core ML (iOS) / TF Lite (Android) | Privacy-preserving, works offline, handles prediction and basic vision |
| LLM integration | Claude API (Anthropic) | Conversational onboarding, board generation, parent guidance, all conversational personalization |
| Computer vision | On-device: Apple Vision / ML Kit; Cloud: Claude vision | Photo-to-board feature, object recognition |
| Text-to-speech | Platform native + premium voice API | Immediate tap-to-speak must use on-device TTS; natural child voice for pre-cached phrases |
| Backend | Python (FastAPI) | Fast to develop, excellent ML/AI library ecosystem |
| Database | PostgreSQL + encrypted blob storage | Structured profile data + media assets (photos, custom images) |
| Local storage | SQLite + encrypted file storage | Offline-first boards, profiles, usage data |
| Auth | OAuth 2.0 + biometric parent lock | COPPA compliance, parent-only access to settings |
| Image storage | S3 (encrypted at rest) | Parent-uploaded photos, generated board assets |
| API gateway | AWS API Gateway or similar | Rate limiting, auth, request routing |

---

## 3. Critical Design Constraints

### Offline-First (Non-Negotiable)

The app **must work fully offline**. Children don't stop needing to communicate when there's no internet. Plane rides, rural areas, spotty school Wi-Fi — AAC must always work.

**What works offline:**
- All generated boards and vocabulary
- Tap-to-speak (on-device TTS)
- Timeline navigation
- Context switching (time-based)
- Usage tracking (logs stored locally, synced later)
- All core and personalized vocabulary
- Parent-uploaded photos (cached locally)

**What requires connectivity:**
- Initial onboarding conversation (LLM API call)
- Generating new boards from conversation ("we're going to the dentist")
- Photo-to-board generation (cloud vision API)
- Syncing progress data to SLP portal
- Downloading new voice packs or image assets

**Sync strategy:** Changes queue locally and sync when connectivity returns. Conflict resolution favors the most recent change. The app never blocks on a network call during active AAC use.

### Sub-100ms Tap Response (Non-Negotiable)

When a child taps a symbol, audio must play **immediately**. Any perceptible delay breaks communication flow and causes frustration.

**Implementation:**
- All audio files for active boards are pre-loaded in memory
- TTS for custom phrases is pre-generated and cached on-device
- The tap → audio path has zero network calls
- Symbol images are pre-rendered at display resolution
- Board transitions use pre-loaded layouts (no on-the-fly rendering)

### Privacy and Compliance

This system processes data about **minors with disabilities**. Data handling must be extremely careful.

**COPPA compliance:**
- Parental consent flow before any data collection
- No advertising, no data selling, no third-party tracking
- Children under 13 never interact with cloud services directly
- Parent controls all data sharing

**HIPAA considerations:**
- If SLP portal is implemented, health data flows must be HIPAA-compliant
- Encrypted storage (AES-256) for all personal data, both on-device and cloud
- Minimal cloud data — process on-device whenever possible
- Data retention policies with parent-controlled deletion

**On-device priority:**
- Photos processed on-device when possible (face detection, cropping)
- Usage patterns analyzed on-device
- LLM calls use the minimum data necessary (no raw photos sent to cloud unless parent initiates photo-to-board)

### Battery Life

AAC is an all-day tool. The app cannot drain the battery in 2 hours.

- GPS polling at reasonable intervals (every 5 minutes when active, not continuous)
- On-device ML models run only when context changes, not continuously
- Camera/vision only when parent explicitly invokes photo-to-board
- Background sync at low frequency
- Display optimization for always-on tablet use

---

## 4. Data Model

```
Child Profile
├── Identity
│   ├── name: string
│   ├── age: number
│   ├── photo: image (optional)
│   └── created_at: timestamp
│
├── Communication Level
│   ├── stage: enum (beginning, emerging, expanding, advanced)
│   ├── existing_words: string[] (words they can say verbally)
│   ├── current_strategies: string[] (leading by hand, pointing, etc.)
│   └── aac_history: string[] (previous tools tried)
│
├── Interests[]
│   ├── name: string
│   ├── category: enum (character, activity, food, toy, topic)
│   ├── intensity: enum (passing, strong, obsession)
│   └── related_vocabulary: string[]
│
├── People[]
│   ├── name: string
│   ├── role: string (mom, dad, sibling, teacher, therapist, friend)
│   ├── photo: image (optional)
│   └── contexts: string[] (home, school, therapy)
│
├── Sensory Profile
│   ├── sensitivities: string[] (loud noises, bright lights, textures)
│   ├── preferences: string[] (crunchy foods, water play, deep pressure)
│   └── calming_strategies: string[]
│
├── Routines[]
│   ├── name: string (morning, school, after_school, dinner, bedtime)
│   ├── days: enum[] (mon, tue, wed, thu, fri, sat, sun)
│   ├── time_range: { start: time, end: time }
│   ├── location: Location (optional)
│   ├── activities: Activity[]
│   │   ├── name: string
│   │   ├── order: number
│   │   └── vocabulary: string[]
│   └── transitions: Transition[]
│       ├── from: string
│       ├── to: string
│       ├── difficulty: enum (easy, moderate, hard)
│       └── support_vocabulary: string[]
│
├── Timeline
│   ├── day_templates: DayTemplate[] (one per day-of-week pattern)
│   │   ├── day_type: string (school_day, weekend, etc.)
│   │   ├── segments: TimelineSegment[]
│   │   │   ├── name: string
│   │   │   ├── icon: image
│   │   │   ├── time_range: { start: time, end: time }
│   │   │   ├── location: Location (optional)
│   │   │   └── board_id: reference
│   │   └── applicable_days: enum[]
│   └── special_events: SpecialEvent[]
│       ├── date: date
│       ├── name: string
│       ├── board_id: reference (auto-generated)
│       └── prep_board_id: reference (social story / preparation)
│
├── Vocabulary
│   ├── core_words: CoreWord[] (research-backed, ~75 high-frequency words)
│   │   ├── word: string
│   │   ├── symbol: image
│   │   ├── audio: audio_file
│   │   ├── position: { row: number, col: number }
│   │   └── usage_count: number
│   ├── fringe_words: FringeWord[] (personalized from onboarding)
│   │   ├── word: string
│   │   ├── symbol: image (photo or generated)
│   │   ├── audio: audio_file
│   │   ├── source: enum (onboarding, parent_added, ai_suggested)
│   │   ├── contexts: string[]
│   │   └── usage_count: number
│   └── agency_words: AgencyWord[] (always available)
│       ├── category: enum (demand, refuse, negotiate, emotion, question, comment)
│       ├── word: string
│       ├── emphasis_variant: string (e.g., "want" vs "WANT")
│       ├── audio: audio_file
│       ├── emphasis_audio: audio_file (louder/more urgent)
│       └── always_visible: boolean
│
├── Boards[]
│   ├── id: uuid
│   ├── name: string
│   ├── type: enum (context, people, feelings, interests, custom, timeline_segment)
│   ├── context_triggers: ContextTrigger[]
│   │   ├── type: enum (time, location, calendar, manual, timeline_position)
│   │   └── value: varies
│   ├── layout: Layout
│   │   ├── grid_size: { rows: number, cols: number }
│   │   ├── style: enum (grid, visual_scene, hybrid)
│   │   └── positions: Position[]
│   ├── symbols: Symbol[]
│   │   ├── image: image
│   │   ├── label: string
│   │   ├── audio: audio_file
│   │   ├── color_code: string (modified Fitzgerald key)
│   │   ├── position: { row: number, col: number }
│   │   └── size: enum (normal, large, extra_large)
│   └── generated_by: enum (onboarding, ai_conversation, photo, parent_manual)
│
└── Progress
    ├── daily_logs: DailyLog[]
    │   ├── date: date
    │   ├── total_selections: number
    │   ├── unique_words: number
    │   ├── word_combinations: string[][]
    │   ├── contexts_used: string[]
    │   └── session_durations: number[]
    ├── vocabulary_growth: VocabSnapshot[] (weekly)
    │   ├── week: date
    │   ├── total_unique_words_used: number
    │   ├── new_words_this_week: string[]
    │   ├── most_used_words: string[]
    │   └── average_utterance_length: number
    ├── milestones: Milestone[]
    │   ├── type: enum (first_word, first_combination, new_stage, etc.)
    │   ├── date: date
    │   └── details: string
    └── motor_patterns: MotorPattern
        ├── avg_tap_accuracy: number
        ├── common_miss_patterns: MissPattern[]
        ├── preferred_screen_zones: Zone[]
        └── recommended_grid_size: { rows: number, cols: number }
```

---

## 5. Key Subsystems

### 5.1 Conversational Interface (The Universal Interaction Layer)

Every part of FamilyBook is accessible through conversation. This is implemented as a persistent conversational interface available throughout the parent view.

**Architecture:**
```
Parent speaks/types
    ↓
Intent Classification (LLM)
    ├── onboarding_conversation → Onboarding Flow
    ├── modify_vocabulary → Vocabulary Manager
    ├── modify_schedule → Timeline Manager
    ├── add_person → People Manager
    ├── prepare_for_event → Board Generator
    ├── report_problem → Adaptation Engine
    ├── ask_about_progress → Analytics Reporter
    └── general_question → Help / Guidance
    ↓
Structured Action (extracted entities + operation)
    ↓
Execute change → Update local state → Sync to cloud
    ↓
Conversational confirmation to parent
```

The LLM does not directly modify the child's boards. It generates a structured action, which the application logic validates and executes. The parent sees a preview of changes and can accept, modify, or reject.

### 5.2 Context Engine

The context engine determines which boards and vocabulary to surface based on multiple signals.

```
Signals:
  time_of_day ────┐
  day_of_week ────┤
  gps_location ───┤
  wifi_network ───┤     ┌──────────────┐     ┌────────────────┐
  calendar ───────┼────→│   Context    │────→│  Board         │
  timeline_pos ───┤     │   Resolver   │     │  Selector      │
  recent_taps ────┤     └──────────────┘     └────────────────┘
  manual_input ───┘            │                     │
                               ↓                     ↓
                        Context State          Active Boards
                        (e.g., "park,           (core strip +
                         afternoon,             park board +
                         with_sibling")         feelings +
                                                interests)
```

**Priority rules:**
1. Manual override (parent taps "going to dentist") → highest priority
2. Calendar events (dentist appointment on Thursday at 2pm) → high priority
3. Location (GPS detects park) → medium-high priority
4. Timeline position (it's the "park" segment of the day) → medium priority
5. Time of day (3:30 PM, after-school time) → baseline

**Transition logic:**
- Context changes do not instantly swap all boards
- A transition animation shows the boards shifting
- Core strip never changes
- The previous context's most-used items remain accessible for 2 minutes (conversation continuity)
- Transition warning vocabulary appears 5 minutes before expected context change

### 5.3 Timeline Engine

The visual timeline is both a display component and a navigation system.

**Day view:**
```
┌─────────────────────────────────────────────────────┐
│  Tuesday, February 28                               │
│                                                     │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐     │
│  │ 🌅  │→│ 🥣  │→│ 🏫  │→│ 🛝  │→│ 🍽  │→ ...│
│  │Wake │  │Bkfst│  │School│  │Park │  │Dinner│     │
│  │ Up  │  │     │  │      │  │ ★   │  │      │     │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘     │
│                               ↑                     │
│                          [NOW - 3:45pm]              │
└─────────────────────────────────────────────────────┘
```

**Behaviors:**
- Current segment is highlighted and expanded
- Tapping a segment opens its associated board
- A "YOU ARE HERE" indicator moves through the day
- Past segments are slightly dimmed; future segments are visible for anticipation
- The timeline scrolls horizontally; current segment auto-centers

**Week view:**
- Shows 7 day columns, each with major segments
- Special events are highlighted (dentist, birthday, field trip)
- Tapping a day expands to the day view
- Helps the child understand and anticipate what's coming

### 5.4 Board Generation Engine

Converts structured data (from onboarding or conversation) into functional AAC boards.

**Input:** Child profile + context triggers + vocabulary list
**Output:** Fully laid-out board with symbols, positions, images, audio

**Generation rules:**
1. Always include core vocabulary access (strip or integrated)
2. Place high-priority agency words (NO, stop, help) in consistent, accessible positions
3. Use color coding: verbs (green), nouns (orange), descriptors (blue), social phrases (pink), people (yellow) — modified Fitzgerald key
4. Size buttons based on the child's motor profile (larger for less precise motor skills)
5. Group related vocabulary visually (all foods together, all feelings together)
6. Include at least 2 transition/escape words per board ("all done," "go [next activity]")
7. Leave space for growth — boards shouldn't be 100% full at generation time
8. Match vocabulary complexity to the child's communication stage

### 5.5 Progress Tracking

Runs passively in the background during all AAC use.

**What it tracks:**
- Every symbol selection (word, time, context, board)
- Word combinations (multi-tap sequences within a time window)
- Session duration and frequency
- Context distribution (how much time in each context)
- New words (first-time selections)
- Motor patterns (tap location accuracy, timing)

**What it reports:**
- Weekly vocabulary growth chart
- New words this week
- Most-used words and combinations
- Average utterance length over time
- Milestone alerts ("First 3-word combination!")
- Suggested next steps based on developmental stage
- Exportable report for SLPs (PDF or structured data)

**Privacy:**
- All tracking data stored encrypted on-device
- Cloud sync only with explicit parent consent
- SLP access only through parent-authorized sharing
- Anonymized aggregation only with consent (separate from individual tracking)

---

## 6. MVP Scope

### What's In

| Feature | In MVP | Why |
|---------|--------|-----|
| Conversational onboarding (eat/do/hear/see, skippable) | Yes | This IS the core innovation |
| Personalized boards from conversation | Yes | Proves the value proposition |
| Core vocabulary strip | Yes | Research-backed, essential |
| Visual day timeline | Yes | Key differentiator; children already use visual schedules |
| Agency vocabulary (demand, refuse, emotions) | Yes | Non-negotiable for real communication |
| Time-of-day context switching | Yes | Simplest context signal, high impact |
| Photo upload for boards | Yes | Personalization with real images |
| Conversational personalization (talk to change anything) | Yes | Core design principle |
| Basic progress tracking (word count, frequency) | Yes | Enough to show value |
| Offline mode (boards, TTS, timeline) | Yes | Critical for real use |
| Emphasis/urgency on taps | Yes | Agency feature, simple to implement |

### What's Not in MVP

| Feature | Deferred | Why |
|---------|----------|-----|
| AI photo-to-board (camera → instant board) | v2 | Complex vision pipeline; manual photo upload covers the need initially |
| GPS-based context switching | v2 | Time-of-day covers most cases; GPS adds battery/privacy complexity |
| SLP portal | v2 | Focus on parents first; export PDF report as stopgap |
| Week view timeline | v2 | Day view is the priority; week view is additive |
| Video visual scene displays | v3 | Research promising but complex to implement |
| Multiple languages | v2 | English first, expand after validation |
| Communication partner guidance | v2 basic, v3 full | Start with simple post-selection tips |
| Aggregated research data | v3 | Requires significant user base and privacy infrastructure |

### MVP Architecture (Simplified)

```
┌───────────────────────────────────────────┐
│         MOBILE APP (React Native)          │
│                                           │
│  ┌──────────────┐  ┌──────────────────┐   │
│  │ Child View    │  │ Parent View      │   │
│  │ - AAC boards  │  │ - Onboarding     │   │
│  │ - Core strip  │  │ - Conversation   │   │
│  │ - Day timeline│  │ - Dashboard      │   │
│  │ - Tap-to-speak│  │ - Progress       │   │
│  └──────────────┘  └──────────────────┘   │
│                                           │
│  ┌────────────────────────────────────┐   │
│  │  Local Storage (SQLite + images)   │   │
│  └──────────────┬─────────────────────┘   │
└─────────────────┼─────────────────────────┘
                  │ (when online)
        ┌─────────┴───────────┐
        │  Backend (FastAPI)   │
        │  + Claude API (LLM)  │
        │  + PostgreSQL        │
        │  + S3 (images)       │
        └─────────────────────┘
```

---

## 7. MVP Development Phases

### Phase 1: Foundation (Weeks 1-4)

- Set up React Native project with navigation (child view / parent view)
- Build the child-facing AAC display engine:
  - Grid layout with configurable rows/columns
  - Tap-to-speak with on-device TTS (sub-100ms response)
  - Symbol rendering (image + label + color code)
  - Core vocabulary strip (persistent across all views)
  - Emphasis: tap-and-hold for urgent/emphatic speech
- Build the visual day timeline component:
  - Horizontal scrollable timeline
  - "You are here" indicator based on current time
  - Tap segment to navigate to associated board
  - Time-based context switching (boards change as time progresses)
- Implement local data storage (SQLite for profiles, encrypted file storage for images)
- Create a research-backed default core vocabulary set (~75 core words)
- Implement agency vocabulary set (NO, stop, don't want, more, help, why, feelings)

### Phase 2: The Conversation (Weeks 5-8)

- Build the conversational onboarding interface (chat UI in parent view)
- Integrate Claude API for the onboarding conversation
  - Structured prompt with category guidance (eat, do, hear, see)
  - Skippable sections with "come back later" support
  - Empathetic, warm tone
- Build the entity extraction pipeline (conversation → structured child profile)
- Build the board generation engine (profile → personalized boards + timeline)
- Parent photo upload: integrate into boards, associate with people/places/things
- Build the conversational personalization interface:
  - Parent can modify anything by typing/talking
  - Intent classification → structured action → preview → apply
  - Change vocabulary, schedule, people, boards, settings — all through conversation

### Phase 3: Intelligence (Weeks 9-12)

- Implement time-of-day context switching (morning boards at 7am, park boards at 3pm)
- Add usage tracking (which words tapped, when, in what combinations, in what context)
- Build the parent dashboard:
  - Word count and unique words over time
  - Most-used words
  - New words this week
  - Simple progress chart
- Basic communication partner tips (simple post-selection suggestions)
- Parent feedback mechanism via conversation ("he's not using the feelings board")
- Developmental stage detection (is the child consistently combining 2 words? → suggest 3-word opportunities)
- Motor pattern adaptation (adjust button sizes based on tap accuracy)

### Phase 4: Polish and Test (Weeks 13-16)

- Recruit 5-10 families with non-verbal or minimally verbal children for beta
- Iterate based on real-world feedback
- Performance optimization:
  - Tap response time audit (must be <100ms)
  - Battery life testing (must last a full day)
  - Offline reliability testing
- Accessibility audit (motor accommodations, visual accommodations)
- Privacy and security review (encryption, COPPA compliance, data handling)
- Generate exportable progress report (PDF) for SLP sharing

---

## 8. Success Metrics

### MVP Launch Criteria

| Metric | Target | Why |
|--------|--------|-----|
| Onboarding completion rate | > 80% | Parents must finish the conversation to get value |
| Onboarding time | < 15 minutes | Must feel quick, not burdensome |
| First-week retention | > 70% | Family uses the app at least 3 of first 7 days |
| Tap-to-speech latency | < 100ms | Perceptible delay breaks communication flow |
| Child engagement | 10+ selections per session | Minimum meaningful interaction |
| Board relevance | > 60% of generated vocabulary used within 2 weeks | AI-generated boards must match real needs |
| Parent satisfaction (NPS) | > 50 | On "easier to set up than other AAC tools" |
| Offline reliability | 100% core features work offline | AAC is critical infrastructure |
| Battery usage | < 15% over 8 hours of active use | Must last a full day |

---

## 9. Repository Structure

```
FamilyBook/
├── README.md
├── docs/
│   ├── VISION.md
│   ├── RESEARCH.md
│   ├── ARCHITECTURE.md          ← this document
│   ├── ONBOARDING_SPEC.md
│   └── PRIVACY.md               (future)
│
├── app/                          React Native mobile app
│   ├── src/
│   │   ├── screens/
│   │   │   ├── child/            Child-facing AAC display
│   │   │   │   ├── BoardView     Grid/VSD board display
│   │   │   │   ├── CoreStrip     Persistent core vocabulary
│   │   │   │   ├── Timeline      Visual day/week timeline
│   │   │   │   └── TapHandler    Tap-to-speak with emphasis
│   │   │   ├── parent/           Parent-facing views
│   │   │   │   ├── Onboarding    Chat-based onboarding flow
│   │   │   │   ├── Conversation  Conversational personalization
│   │   │   │   ├── Dashboard     Progress and overview
│   │   │   │   └── PhotoUpload   Photo management
│   │   │   └── shared/           Shared components
│   │   ├── services/
│   │   │   ├── ai/               LLM integration
│   │   │   │   ├── onboarding    Onboarding conversation agent
│   │   │   │   ├── extraction    Entity extraction from conversation
│   │   │   │   ├── generation    Board generation from profile
│   │   │   │   └── conversation  General conversational interface
│   │   │   ├── context/          Context engine
│   │   │   │   ├── signals       Time, location, calendar readers
│   │   │   │   ├── resolver      Multi-signal context resolution
│   │   │   │   └── transitions   Transition detection and support
│   │   │   ├── speech/           Text-to-speech
│   │   │   │   ├── engine        On-device TTS wrapper
│   │   │   │   ├── cache         Pre-generated audio cache
│   │   │   │   └── emphasis      Emphasis/urgency variants
│   │   │   ├── storage/          Local data persistence
│   │   │   │   ├── profiles      Child profile CRUD
│   │   │   │   ├── boards        Board storage and retrieval
│   │   │   │   ├── media         Image and audio file management
│   │   │   │   └── sync          Cloud sync when online
│   │   │   └── tracking/         Usage analytics
│   │   │       ├── logger        Event logging
│   │   │       ├── analyzer      Pattern detection
│   │   │       └── reporter      Progress report generation
│   │   ├── models/               TypeScript data models
│   │   └── assets/               Default symbols, sounds, voices
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                      Server-side API
│   ├── api/
│   │   ├── onboarding/           Conversation + profile extraction
│   │   ├── boards/               Board generation endpoints
│   │   ├── profiles/             Child profile management
│   │   ├── media/                Image upload/processing
│   │   └── analytics/            Usage data endpoints
│   ├── services/
│   │   ├── llm/                  LLM API integration (Claude)
│   │   ├── vision/               Computer vision (future)
│   │   └── images/               Image processing pipeline
│   ├── models/                   Database models
│   ├── requirements.txt
│   └── Dockerfile
│
└── research/                     Research references
    ├── vocabulary/               Core vocabulary lists
    ├── papers/                   Key paper summaries
    └── user_studies/             Study protocols (future)
```
