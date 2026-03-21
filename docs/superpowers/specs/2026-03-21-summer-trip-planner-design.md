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
- **Responsive:** Works on iPhone and Mac browser without any separate mobile layout
- **No emoji in UI chrome** — kept clean and minimal

---

## Page 1 — Availability Entry (`index.html`)

### Step 1: Name Selection

- Header: "☀️ Summer Trip 2026"
- Nav link to Results page (top right)
- Welcome copy: *"We're planning a summer trip! Select your name to mark when you can't make it."*
- Vertical list of 7 names as tappable buttons, alphabetical by last name
- Selecting a name advances to Step 2

### Step 2: Calendar + Code Generation

- Month-by-month calendar grid for **May 1 – October 31, 2026** (6 months)
- Tap a date to mark it **unavailable** (highlighted red/coral); tap again to unmark
- Drag/swipe across days to mark a range at once (mobile-friendly)
- When one or more dates are marked, a popover appears: **"Reason? (optional)"** with:
  - Quick-tap suggestions: `Wedding · Conference · Travel · Work · Other`
  - Short free-text input for custom reasons
  - Dismiss option (reason stays blank)
- Reasons are attached per contiguous block of unavailable dates (not per individual day)
- **"Generate My Code"** button at the bottom:
  - Produces a ~31-character alphanumeric share code
  - Shows a **Copy** button
  - Shows instructions: *"Text this code to Sachi!"*
- A "← Change name" back link returns to Step 1 without losing selections

---

## Page 2 — Results (`results.html`)

### Code Input

- Collapsible panel at the top: **"+ Add / update codes"**
- One text input per person (labeled by name) or a single "paste and add" flow
- As each code is added, the page updates immediately

### Hero: Best Trip Windows

- Section title: **"🏆 Best Windows for Your Trip"**
- Ranked list of the **top 5 contiguous date ranges** of **at least 6 days** where the most people are available
- Each card shows:
  - Date range (e.g., "Jun 3 – Jun 11")
  - Duration in days
  - Availability count (e.g., "7/7 people free" or "6/7 people free")
  - "★ Best" badge on the top result
- Algorithm: sliding window over May–Oct, score = sum of available people per day across the window, ranked by average score descending, minimum 6-day length

### Heat Map Calendar

- Full May–October grid below the best windows
- Each day cell colored on a **green → yellow → red** gradient:
  - Deep green = all 7 free
  - Yellow/orange = some conflicts
  - Red = most people unavailable
- Tapping a day opens a tooltip/popover showing:
  - ✅ Name — free
  - ❌ Name — unavailable · *"reason"* (if provided)
- Month labels and day-of-week headers for readability

---

## Data Encoding

### Format

Each person's submission is encoded as a single ~31-character base62 string (alphanumeric, case-sensitive: `0-9A-Za-z`).

### Structure

The code encodes two things:

1. **Availability bitfield** — 184 bits (one per day, May 1–Oct 31). `1` = unavailable, `0` = available. Encoded as base62.
2. **Reasons** — compact suffix encoding contiguous unavailable blocks with optional short text reasons (URL-safe characters, truncated to ~20 chars per reason). Separated from the bitfield by a fixed delimiter character.

### Decoding

The results page decodes each code client-side in JavaScript. No network request needed. Invalid/malformed codes are silently ignored with a visible error label.

---

## Algorithm: Finding Best Windows

```
For each possible start date D from May 1 to Oct 31:
  For each window length L from 6 to (Oct 31 - D):
    score(D, L) = sum of people available on each day in [D, D+L)
    normalized_score = score / (L * 7)  // 7 people total
Keep top 5 non-overlapping windows by normalized score, minimum L=6
```

Windows are de-duplicated so results don't overlap (once a window is selected, its days are excluded from subsequent candidates).

---

## Navigation

- `index.html` has a "View Results →" link in the top-right
- `results.html` has a "← Back" link to `index.html`
- Both pages use the same header style and color theme

---

## Out of Scope

- User authentication
- Saving state server-side
- Push notifications
- Editing a submitted code (user re-generates and sends a new one)
- More than 7 participants
