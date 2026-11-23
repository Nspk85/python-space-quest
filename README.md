# Python Space Quest

A space-themed Python course for complete beginners, written for kids around 10 years old. Learners code on Android phones or tablets in the built-in Code Pad, which runs real Python in the browser, so nothing needs to be installed. No AI is needed to use it.

## Worlds

| World | Topic | File |
|---|---|---|
| 1 · Talking to the Computer | `print()`, text, order, math, text art | [world1.html](world1.html) |
| 2 · Magic Boxes | variables, `input()` and `int()` | [world2.html](world2.html) |
| 3 · Choose Your Path | comparisons, `if` / `elif` / `else`, `random` | [world3.html](world3.html) |
| 4 · Loop-de-Loop Forest | `for`, `range()`, loop art, `while` | [world4.html](world4.html) |
| 5 · Spell Books | functions, parameters, `return` | [world5.html](world5.html) |
| 6 · Treasure Chests | lists, `append` / `remove`, looping over lists, `random.choice` | [world6.html](world6.html) |
| 7 · Final Boss | plan, build, test and launch a team game; graduation | [world7.html](world7.html) |

## What each world includes

- Lessons with a story, the big idea, code to type and the expected output
- Challenges at three levels (⭐ / ⭐⭐ / ⭐⭐⭐), bug hunts, pair activities and quizzes
- XP, ranks, badges and a certificate for each crew member (saved in the phone's browser)
- An unplugged game, an error message decoder, and a leader's guide with a full answer key

## How it's built

- `assets/quest.css` and `assets/quest.js` are shared by every World: page styles, crew, XP, ranks, badges, code colouring and copy buttons.
- `assets/codepad.js` adds the Code Pad: an editor with symbol keys, a Run button and "Try it" buttons on every example. It runs Python with [Pyodide](https://pyodide.org), hosted in `assets/pyodide/` (downloaded on the first Run, about 14 MB). `input()` answers are typed into a pop-up box; tapping Cancel stops the program. A program that runs longer than 5 seconds (not counting time spent answering) is stopped, so endless loops can't freeze the page.
- Each World page sets `window.QUEST` (its World number, boss task and lesson task lists) before loading `quest.js`.
- Progress is saved in the browser under one key, so the crew and total XP carry across Worlds. Progress saved by the first World 1 release is imported automatically.
- The **Save or load your crew's progress** panel (under the crew list) turns the crew and their progress into a backup code (`PSQ1.` followed by compressed data) that can be pasted back on any phone. Loading adds to the crew already there; it never removes anyone or loses progress.

## How to use

Open `index.html` (or the GitHub Pages link) in a phone or computer browser and tap World 1. Add each learner under **Your crew**, then pick who's playing in the top bar before tapping tasks.
