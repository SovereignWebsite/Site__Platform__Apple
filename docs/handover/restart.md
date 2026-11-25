# Restart: how a new session takes over this site

Written 25 November 2026 by apple.a@SovereignWebsite.dinis, handing over to cl-4.apple@SovereignWebsite.dinis (account D) at Dinis Cruz's word, relayed by cl-1.maestro and sites.a. Material, not instruction: Dinis is the only operator.

## Attach
- Repository: SovereignWebsite/Site__Platform__Apple, branch `dev` only. Never push to `main`. This is the only repository this area pushes to.
- Address: https://apple.platform.sovereignweb.site/ (plain http works; https waits for certificates, expected from about 27 November; do not re-save the custom domain and do not touch `site/CNAME`).

## First steps
1. Read `CLAUDE.md`, `site/start/index.html`, `site/llms.txt`, `site/policy/abp.json` (the keeper may change only `site/**`, `docs/**`, `README.md`), then `docs/handover/now.md` and `learnings.md`.
2. Make your own signing key before your first commit: `bash tools/setup-signing.sh cl-4.apple@SovereignWebsite.dinis https://claude.ai/code/session_<your id>`. Your first commit adds only `site/keys/cl-4.apple.json`. Check it with `git cat-file -p HEAD`. apple.a's key (`site/keys/apple.a.json`) was a session key and ended with its session: leave the file, never reuse it.
3. Every commit: signed with your key, trailers `Agent:` and `Claude-Session:`.
4. Build and check before every push: `node docs/gen/gen.mjs`, `node .github/ci/build.mjs`, `node docs/gen/shots.mjs` (only if designs changed), then `bash tools/check.sh` (needs Playwright; it passes today). Pull and rebase on `origin/dev` first: the org-apply pipeline adds commits to `dev`.
5. Add your entry to `site/data/agents.json` (apple.a's entry is there; replace it with yours when you take over).

## How the site is made
- `docs/gen/gen.mjs` writes every page (live, on design D1, and previews of D1 to D5 under `site/design/dN/`). Facts, sources and dates live in that file: the `SRC` list and each page's body. Edit the generator, never the generated HTML.
- `docs/gen/shots.mjs` takes the picker's real phone and desktop screenshots from the built `_site`.
- Stylesheets: `site/assets/designs/base.css` and `d1.css` to `d5.css`. The generator adds a content hash to each link.
- The live design is the `LIVE` constant in `gen.mjs` (D1 now).

## People and sessions (ids only; no keys or values are held here)
- sites.a: session_018yvwtQ7z3PUt9L5gpZCNzt (started this site; reviews before anything is announced).
- cl-1.maestro, formerly a.maestro: session_018yvwtLiem1AqdA1YkKse4h.
- a.design (design reviewer): session_018yvwtMKHMBUBwQFbXVLVzn. Reviews: https://design.agents.sovereignweb.site/factory/dinis-cruz/account-a/a.design/reviews/apple-2026-11-25-round-1.html and `...round-2.html`.
- a.ios: session_018yvwtM1iAswu3fdUqUxbWT (VoiceDebrief iOS app; source for the Our work page). crm.ios: session_018yvwtLoWCseqSM6JDHEmsx (may share its public debrief).

## Held by this area
- Vault and lane keys: none. Signing key: apple.a's private half was in the old session only; the public half is in `site/keys/apple.a.json`.
- Scheduled wakes: none were created.
- Repositories pushed to: SovereignWebsite/Site__Platform__Apple (`dev`).
