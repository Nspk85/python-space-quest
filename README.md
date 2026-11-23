# Python Space Quest

A space-themed Python course for complete beginners, written for kids around 10 years old. Learners code on Android phones or tablets using the free Pydroid 3 app. No AI is needed to use it.

## Worlds

| World | Topic | File |
|---|---|---|
| 1 · Talking to the Computer | `print()`, text, order, math, text art | [world1.html](world1.html) |
| 2 · Magic Boxes | variables, `input()` and `int()` | [world2.html](world2.html) |
| 3 · Choose Your Path | `if` / `else` | coming soon |
| 4 · Loop-de-Loop Forest | loops | coming soon |
| 5 · Spell Books | functions | coming soon |
| 6 · Treasure Chests | lists | coming soon |
| 7 · Final Boss | team project | coming soon |

## What each world includes

- Lessons with a story, the big idea, code to type and the expected output
- Challenges at three levels (⭐ / ⭐⭐ / ⭐⭐⭐), bug hunts, pair activities and quizzes
- XP, ranks, badges and a certificate for each crew member (saved in the phone's browser)
- An unplugged game, an error message decoder, and a leader's guide with a full answer key

## How it's built

- `assets/quest.css` and `assets/quest.js` are shared by every World: page styles, crew, XP, ranks, badges, code colouring and copy buttons.
- Each World page sets `window.QUEST` (its World number, boss task and lesson task lists) before loading `quest.js`.
- Progress is saved in the browser under one key, so the crew and total XP carry across Worlds. Progress saved by the first World 1 release is imported automatically.

## How to use

Open `index.html` (or the GitHub Pages link) in a phone or computer browser and tap World 1. Add each learner under **Your crew**, then pick who's playing in the top bar before tapping tasks.
