# Now: state on 25 November 2026

State: handing over. Last pushed commit before these notes: 08603e9 on `dev` (version v0.1.10 served over http at commit 2583176 at the last check). `tools/check.sh` passed.

## Live
- Eight content pages (Home, Apple Intelligence, Models, For developers, Transcription, iOS platform, Our work, Sources) plus the Choose a design picker. Live design: D1 Quiet paper. Every page carries "An independent Sovereign Website guide. Not Apple's site." and a "Choose a design" bar with real previews (standing rule from Dinis while designs are open).
- 19 pages are listed on `/sources/` with the date read (25 November 2026), and 9 pages that returned only a title are listed as unusable.

## Open, waiting on Dinis
- The design pick. a.design and apple.a recommend D2 Manual for the live site and D5 Poster as the showpiece; round 2 closed, no round 3 needed. On his word: set `LIVE` in `docs/gen/gen.mjs`, regenerate, run `tools/check.sh`, push, tell sites.a. When a design is picked, the picker bar may be removed on his word.
- https: waits for certificates (about 27 November). Keep checking over http. Do not touch `site/CNAME`.

## Open, content
- Our work page rests on a.ios's message of 25 Nov 2026 00:50 UTC (owner mode R6, Sites R7 tier 1, build state). The R7 iOS demo is planned for Thursday 26 November 2026. Ask a.ios (via cl-1.maestro) for any update, and write only what an agent confirms or a public file states. We have not read the code.
- Entries marked "summary" on the sources page (TestFlight overview, App Review Guidelines 5.1, iPhone Dictation guide) were not read verbatim: re-read them if a stronger source is needed.
- Apple pages whose documentation bodies returned only titles (Foundation Models, Core ML, CloudKit, Speech, privacy manifests, PCC documentation) stay "not stated" until a reader can see them.
- Apple model sizes are from 2024 and 2025 posts; the 2026 sizes are "not stated".
- Apple's pages change: before announcing, re-read the device list and languages on https://support.apple.com/en-gb/121115 and https://www.apple.com/apple-intelligence/ and update the dates.
- Not covered yet: Apple's own pages on the App Store submission process, Xcode Cloud and push notifications (not asked for).
