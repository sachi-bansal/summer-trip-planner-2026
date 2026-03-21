# Summer Trip Planner 2026 — Design Spec

**Date:** 2026-03-21
**Repo:** https://github.com/sachi-bansal/summer-trip-planner-2026
**Status:** Approved

---

## Overview

A shareable, mobile-friendly web app that helps a friend group (7 people) figure out when everyone is free for a summer trip. Each person marks their unavailable dates and receives a compact share code. The organizer (Sachi) collects all codes, pastes them into a results page, and sees a heat map + ranked list of the best trip windows.

No backend, no accounts, no installation required.

---

## Users

Seven friends, listed alphabetically by last name:

1. Navya Annam
2. Sachi Bansal
3. Alaka Gorur
4. Riyana Patel
5. Shivangi Sharma
6. Natasha Shetty
7. Sirina Yeung

---

## Tech Stack

- **Pure HTML + CSS + vanilla JavaScript** — no frameworks, no build step
- **Two files**: `index.html` (availability entry) and `results.html` (group results)
- **Deployed to GitHub Pages** at `sachi-bansal/summer-trip-planner-2026`
- **Zero external dependencies** except a Google Font (optional)

---

## Visual Design

- **Theme:** Summer Bright — warm orange/coral accent (`#ff7043`), cream backgrounds (`#fff9f0`), clean sans-serif typography
- **Emoji** are permitted in page headings and section titles (e.g., "☀️ Summer Trip 2026", "🏆 Best Windows") but not in button labels or body copy
- **Responsive:** Works on iPhone and Mac browser without any separate mobile layout

---

## Page 1 — Availability Entry (`index.html`)

### Step 1: Name Selection

- Header: "☀️ Summer Trip 2026"
- Nav link to Results page (top right): "View Results →"
- Welcome copy: *"We're planning a summer trip! Select your name to mark when you can't make it."*
- Vertical list of 7 names as tappable buttons, alphabetical by last name
- Selecting a name advances to Step 2

### Step 2: Calendar + Code Generation

- Month-by-month calendar grid for **May 1 – October 31, 2026** (6 months)
- **Marking dates unavailable:**
  - Tap a single date to mark it unavailable (highlighted red/coral); tap again to unmark
  - Drag/swipe across days to mark a range: if the drag begins on an unmarked day, all traversed days are marked unavailable; if the drag begins on an already-marked day, all traversed days are unmarked. Dragging across month boundaries is supported.
- **Reason popover:** After the user lifts their finger/mouse from a completed tap or drag gesture that creates or extends a contiguous unavailable block, a small popover appears once for that block:
  - Label: "Reason? (optional)"
  - Quick-tap suggestions: `Wedding · Conference · Travel · Work · Other`
  - Short free-text input (max 20 characters, URL-safe) for custom reasons
  - Dismiss button skips adding a reason
  - If an existing block is extended by adjacent taps, the popover reappears to allow updating the reason
  - If a block is split (a marked day in the middle is unmarked), the original reason is inherited by both resulting sub-blocks
- **"Generate My Code"** button at the bottom:
  - Produces a share code (see Encoding section for format)
  - Shows a Copy button
  - Shows instructions: *"Text this code to Sachi!"*
- **State persistence:** Selections are held in a JavaScript in-memory object for the current browser session. Refreshing the page clears all selections. Users should generate their code before closing or refreshing.
- A "← Change name" back link returns to Step 1 without losing current selections (state stays in memory as long as the page is not refreshed)

---

## Page 2 — Results (`results.html`)

### Code Input

- Collapsible panel at the top: "**+ Add / update codes**"
- One labeled input per person (by name); pasting a new code for a name that already has one replaces the previous code and immediately re-renders results
- A status indicator shows how many codes have been loaded: e.g., *"4 of 7 codes entered"*
- Malformed or unparseable codes display an inline error label next to the input: *"Invalid code — please check and re-paste"*; the rest of the page continues to render with valid codes

### Partial Results

- Results are computed and displayed as soon as any code is entered — there is no minimum number of codes required
- All scores are shown as "X / N people free" where N = number of codes currently loaded (not always 7)
- A note is shown when fewer than 7 codes are loaded: *"Showing results for N of 7 people — add more codes to refine"*

### Hero: Best Trip Windows

- Section title: **"🏆 Best Windows for Your Trip"**
- Ranked list of the **top 5 contiguous date ranges** of **at least 6 days** where the most people are available
- Each card shows:
  - Date range (e.g., "Jun 3 – Jun 11")
  - Duration in days
  - Availability count (e.g., "7/7 people free" or "6/7 people free")
  - "★ Best" badge on the top result
- Results are always shown regardless of score — the score is displayed for context
- **Algorithm:**
  1. For every possible start date D and window length L ≥ 6 days, compute `score(D, L)` = sum of people available on each day in the window
  2. Rank all windows by `score / L` (average people free per day), descending
  3. Select top 5 **non-overlapping** windows greedily: a candidate is disqualified if it shares any day with an already-selected window. Scores are computed once before any selection and do not change as windows are selected.

### Heat Map Calendar

- Full May–October grid below the best windows
- Each day cell colored on a **green → yellow → red** gradient:
  - Deep green = all loaded people free
  - Yellow/orange = some conflicts
  - Red = most people unavailable
- Tapping a day opens a tooltip/popover showing each person's status:
  - ✅ Name — free
  - ❌ Name — unavailable · *"reason"* (if a reason was provided)
  - Names for whom no code has been entered are omitted from the tooltip

---

## Data Encoding

### Share Code Format

The share code is a string with two parts separated by `_` (underscore, which is outside the base62 alphabet):

```
<bitfield><_><reasons>
```

If there are no reasons, the code is just the bitfield with no delimiter:

```
<bitfield>
```

### Part 1: Availability Bitfield

- 184 bits, one per day from May 1 to October 31, 2026. `1` = unavailable, `0` = available. Bit 0 = May 1, bit 183 = Oct 31.
- Encoded as **exactly 31 base62 characters** (digits `0-9`, uppercase `A-Z`, lowercase `a-z`).

### Part 2: Reasons Suffix (optional)

- Format: one or more `<block_index>:<reason>` pairs separated by `|`
- `block_index` is the 0-based index of the contiguous unavailable block (blocks sorted by start day)
- `reason` is the reason text, max 20 URL-safe characters, no `|` or `_` characters
- Example: `0:Wedding|2:Conference`
- Full code example with reasons: `A7x2Kp9mNqR4wTv8cBzL3Yd6Qfh_0:Wedding|2:Work`

### Decoding

- Split on first `_` to separate bitfield from reasons
- Decode 31-char base62 bitfield to 184 bits
- Parse reasons suffix to map block indices to reason strings
- Invalid or malformed codes are rejected with an inline error; they do not crash the page

---

## Navigation

- `index.html` has a "View Results →" link in the top-right
- `results.html` has a "← Back" link to `index.html`
- Both pages share the same header style and color theme

---

## Out of Scope

- User authentication
- Saving state server-side or in localStorage
- Push notifications
- Editing a submitted code (user re-generates and sends a new one)
- More than 7 participants
- Minimum score thresholds for best windows (all top 5 are shown regardless of score)
