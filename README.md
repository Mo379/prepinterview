# prepinterview
Back to square one, taking the original idea and implementing a very basic and efficent version
with b2b and direct to consumer focus.

[KEY, FIX, BUG, CLEANUP, FEATURE, GENERALISATION, BACKEND, FRONTEND]
## Key Development Milestones
- [ ] KEY: Everything is super simple ?

# Features and Optimisations
- [ ] FEATURE: Notes and Highlighting ?
- [ ] FEATURE: Business model


## Bugs, Patches and Changes
- [ ] DEBUG: shared sources access and editing permissions, admin control etc
- [ ] DEBUG: references popup scroll
- [ ] DEBUG: phone UX with nav
- [ ] DEBUG: references warning and limitations
- [ ] DEBUG: site slow: Dynamic loading pages, and href navigation will break so needs fix
    - href breaks because elements not loaded, figure a workaround
- [ ] CLEANUP: Final Debug and polish

## Completed Tasks
- [x] BUG: Tags are broken, related to highlighting and tag changed ('undefined') 
- [x] FEATURE: Space sharing
- [x] FEATURE: Hightlighted text as context extracts for rabiits
- [x] CLEANUP: Markdown formattihng
- [x] CLEANUP: Outline HyperLinks and slider
- [x] CLEANUP: Context engineering
- [x] SEO: landing page
- [x] SEO: past papers
- [x] SEO: specifications
- [x] SEO: sitemap
- [x] CLEANUP: Round up by polishing the landing page showing all the features
- [x] BUG: Total marks for some quetions are based on the whole paper instead for the question only, solve by summing each part's marks
    - Remove the total marks feature from the structured output and use the sum instead
- [x] FEATURE: Allow logged in users to create upto 3 free practice session
- [x] FEATURE: tutors control when answers are shown
- [x] ClEANUP: correctly initialise and reset assignees for practice sessions
- [x] FEATURE: The solutions button needs to point to the exact correct page, use trigram search
- [x] PIPELINE UPDATE: for each source, pass images through another model call for verification
- [-] PIPELINE UPDATE: Images in the solutions need to be forced where needed
    - No need to worry, just make the button to the solution page work easy.
- [x] ClEANUP: personal workspace, unnessary buttons and features to be diabled (back and front end)
- [x] ClEANUP: not every account has access to teams (only team accounts)
- [x] FEATURE: billing structure, free, premium, teams.
- [x] BUG: figureout why loader2 shows up for too long without data showing
- [x] BUG: logout/re-login behaviour, just remove all states
