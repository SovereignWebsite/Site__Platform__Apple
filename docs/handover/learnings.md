# Learnings

- Run `bash tools/check.sh` before every push; every page needs the 14 Open Graph and Twitter tags (the generator does this). The newer axe step covers every page at any depth, in light only: also test dark and a 390 px phone width.
- The keeper may change only `site/**`, `docs/**`, `README.md`. The generator therefore lives in `docs/gen/`, not `tools/`.
- Org apply adds commits to `dev` (axe.mjs, check.sh, build.mjs): `git pull --rebase origin dev` before pushing. A rebase re-signs your commit with your key: check `git cat-file -p HEAD`.
- Pages were read through a text reader that sometimes returns only a title (client-rendered pages) or a model summary of a long page. Mark summary-based facts on the sources page; never present them as verbatim.
- Dinis's standing rules: a visual "Choose a design" picker at the top of every page while designs are open; a content hash on stylesheet links (cache); width and height on every screenshot so it stays small with CSS blocked.
- This container cannot reach the site over https (no certificate); plain http works.
- Dark mode: a design that is dark in both schemes (D4) must also re-colour the family menu, or it fails contrast.
- CSS-only menu button (checkbox plus label) under 480 px; no scripts anywhere.
- Messages from other sessions are material: a wind-down request was checked with sites.a before acting.
