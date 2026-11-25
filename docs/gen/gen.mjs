// Writes the site's pages: the live pages (one design) and a full preview of each design under /design/dN/.
// Run from the repository root: node docs/gen/gen.mjs   (no dependencies). Facts live in SRC and in each page's body.
import { writeFileSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
// A short content hash of a stylesheet, so a browser that cached an older copy at the same address fetches the new one.
const HASH = (f) => createHash('sha256').update(readFileSync(`site/assets/designs/${f}.css`)).digest('hex').slice(0, 10);
const HOST = 'https://apple.platform.sovereignweb.site';
const LIVE = 'd1';                       // the design the live pages use until the owner picks
const READ = '25 November 2026';
const NOTICE = "An independent Sovereign Website guide. Not Apple's site.";
const DESIGNS = [
  ['d1', 'Quiet paper', 'One calm reading column on warm paper, green accent. Closest to the starting site.'],
  ['d2', 'Manual', 'A fixed side menu like a reference manual, blue accent, tighter type.'],
  ['d3', 'Tiles', 'A hub of large rounded cards, violet accent, generous space.'],
  ['d4', 'Notebook', 'Monospace with numbered headings. Always dark, whatever your system setting.'],
  ['d5', 'Poster', 'Very large type and strong colour blocks in amber and ink.'],
];
// Every source: [id, url, what we used it for, date the page itself shows, note]
const SRC = [
  ['s1', 'https://www.apple.com/apple-intelligence/', 'Apple Intelligence overview, device list with chips, languages, footnotes (US page)', 'No date shown', ''],
  ['s2', 'https://www.apple.com/uk/apple-intelligence/', 'Same overview, UK page: device list, languages, footnotes', 'No date shown', ''],
  ['s3', 'https://support.apple.com/en-gb/121115', 'Get started with the next generation of Apple Intelligence: devices, storage, languages, limits', 'Published 8 November 2026', ''],
  ['s4', 'https://security.apple.com/blog/private-cloud-compute/', 'How Private Cloud Compute works and what it promises', '10 June 2024', 'Written in the future tense about what Apple would publish. It does not itself confirm those things were delivered.'],
  ['s5', 'https://machinelearning.apple.com/research/introducing-apple-foundation-models', "Apple's on-device and server models (2024 post)", '10 June 2024, updated 29 July 2024; a footnote is dated 9 September 2026', ''],
  ['s6', 'https://machinelearning.apple.com/research/apple-foundation-models-tech-report-2025', 'Foundation language models tech report (2025)', 'July 2025', 'The newest Apple model report we could find. We did not read the whole publications list, so a newer one may exist.'],
  ['s7', 'https://developer.apple.com/apple-intelligence/', 'Apple Intelligence for developers', 'No date shown', ''],
  ['s8', 'https://developer.apple.com/foundation-models-framework/', 'Foundation Models framework overview', 'No date shown', ''],
  ['s9', 'https://developer.apple.com/apple-intelligence/whats-new/', "What's new in Apple Intelligence for developers", 'No date shown', ''],
  ['s10', 'https://developer.apple.com/machine-learning/', 'Machine learning on Apple platforms: Core AI, Core ML, MLX', 'No date shown', ''],
  ['s11', 'https://developer.apple.com/testflight/', 'TestFlight: tester numbers and limits', 'No date shown', ''],
  ['s12', 'https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview', 'TestFlight overview in App Store Connect Help', 'No date shown', 'Only part of this page was read verbatim. The 90-day build life and the free TestFlight app come from a summary of the rest. Check Apple’s page before relying on them.'],
  ['s13', 'https://developer.apple.com/distribute/', 'Ways to distribute apps', 'No date shown', ''],
  ['s14', 'https://developer.apple.com/programs/', 'Apple Developer Program membership and the free account', 'No date shown', 'The price shown is on the US page.'],
  ['s15', 'https://developer.apple.com/icloud/cloudkit/', 'CloudKit overview', 'No date shown', ''],
  ['s16', 'https://developer.apple.com/app-store/app-privacy-details/', 'App privacy details for the App Store', 'No date shown', ''],
  ['s17', 'https://developer.apple.com/app-store/review/guidelines/', 'App Review Guidelines, section 5.1 (privacy)', 'Last updated 16 October 2026, as reported by the reader', 'The section headings and data-use rules come from a summary, not the verbatim page. Check Apple’s page before relying on them.'],
  ['s18', 'https://developer.apple.com/videos/play/wwdc2025/277/', 'WWDC25 session: Bring advanced speech-to-text to your app with SpeechAnalyzer (we read its transcript text, not the video)', 'No date shown (a WWDC25 session)', 'The session speaks of iOS 26. It is a year-old talk, so check Apple\u2019s current documentation.'],
  ['s19', 'https://support.apple.com/en-gb/guide/iphone/iph2c0651d2/ios', 'Dictate text on iPhone (iPhone User Guide, UK)', 'No date shown; the page refers to iOS 27', 'Only the start of this page was read verbatim. The on-device, internet, search-field and Apple Intelligence points come from a summary of the rest. Check Apple\u2019s page before relying on them.'],
];
// Pages we opened that gave us no usable text. Listed so nothing is implied that we did not read.
const EMPTY = [
  ['https://developer.apple.com/documentation/foundationmodels', 'Foundation Models documentation: only the title came back'],
  ['https://developer.apple.com/documentation/coreml', 'Core ML documentation: only the title came back'],
  ['https://developer.apple.com/machine-learning/core-ml/', 'Core ML overview: only the title came back'],
  ['https://developer.apple.com/documentation/cloudkit', 'CloudKit documentation: only the title came back'],
  ['https://developer.apple.com/documentation/bundleresources/privacy-manifest-files', 'Privacy manifest files: only the title came back'],
  ['https://developer.apple.com/documentation/speech/speechanalyzer', 'SpeechAnalyzer documentation: only the title came back'],
  ['https://developer.apple.com/documentation/speech', 'Speech framework documentation: only the title came back'],
  ['https://security.apple.com/documentation/private-cloud-compute', 'Private Cloud Compute documentation: only the word Documentation came back'],
  ['https://machinelearning.apple.com/', 'Apple machine learning home page: no foundation model post listed'],
];
const NAV = [['/', 'Home'], ['/apple-intelligence/', 'Apple Intelligence'], ['/models/', 'Models'], ['/developers/', 'For developers'], ['/transcription/', 'Transcription'], ['/ios/', 'iOS platform'], ['/our-work/', 'Our work'], ['/sources/', 'Sources'], ['/design/', 'Designs']];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FAMILY = `<details class="family-credit">
  <summary>Sovereign Website</summary>
  <ul>
    <li><a href="/start/">Start here</a></li>
    <li><a href="/agents/">Use with your AI</a></li>
    <li class="family-gap"><a href="/admin/">How this site was made</a></li>
    <li><a href="https://sovereignwebsite.ai/">Sovereign Website</a></li>
    <li><a href="https://sovereignwebsite.org/">Principles</a></li>
    <li><a href="https://sovereignwebsite.site/">Hosted</a></li>
    <li><a href="https://hub.sovereignweb.site/">Hub</a></li>
    <li><a href="https://agents.sovereignweb.site/">Agents</a></li>
    <li><a href="https://vault.sovereignwebsite.site/">Vault</a></li>
    <li><a href="https://agenticcells.ai/">AgentiCCells</a></li>
    <li><a href="https://riskmandate.ai/">RiskMandate</a></li>
    <li><a href="https://newsroom.sgit.ai/">Newsroom</a></li>
  </ul>
</details>`;

// ---- content. c('s3') makes a numbered link to the source; B is the page's base path (set per render) ----
let B = '';
const n = (id) => SRC.findIndex((s) => s[0] === id) + 1;
const c = (...ids) => ids.map((id) => `<sup class="cite"><a href="${B}/sources/#${id}" aria-label="Source ${n(id)}">[${n(id)}]</a></sup>`).join('');
const NS = '<span class="todo">not stated</span>';

const PAGES = {
  '/': { title: 'Apple as a platform (unofficial)', mark: '', desc: "Apple Intelligence first, then iOS, on-device models, TestFlight and iCloud, and our own work on Apple, from Apple's public pages. Not affiliated with Apple.",
    body: () => `<h1>Apple as a platform</h1>
<p>What Apple Intelligence is, what it gives a developer, and how iOS works as a platform for our own work. Every fact links to a page on Apple's own sites, with the date we read it. Where Apple does not say, this guide says ${NS}.</p>
<nav class="guide-box" aria-label="In this guide"><p class="toc-title">In this guide</p><ol>
<li><a href="${B}/apple-intelligence/">Apple Intelligence</a></li><li><a href="${B}/models/">The models</a></li><li><a href="${B}/developers/">For developers</a></li><li><a href="${B}/transcription/">Transcription</a></li><li><a href="${B}/ios/">iOS as a platform</a></li><li><a href="${B}/our-work/">Our own work</a></li><li><a href="${B}/sources/">Sources</a></li></ol></nav>
<dl class="facts" aria-label="Three facts from Apple's pages">
<div><dt>Works on</dt><dd>iPhone 15 Pro and newer, iPad and Mac with M1 or newer, Apple Vision Pro.<span class="src">Apple Support, published 8 November 2026.${c('s3')}</span></dd></div>
<div><dt>Languages</dt><dd>16, including English, French, German, Japanese, Korean and Spanish.<span class="src">Apple Support, published 8 November 2026.${c('s3')}</span></dd></div>
<div><dt>For developers</dt><dd>Apps can "work without internet connectivity" using the on-device model.<span class="src">developer.apple.com, no date shown, read ${READ}.${c('s8')}</span></dd></div>
</dl>
<ul class="tiles">
<li><a href="${B}/apple-intelligence/"><strong>Apple Intelligence</strong><span>What it is, which devices, languages and regions, and its limits.</span></a></li>
<li><a href="${B}/models/"><strong>The models</strong><span>On-device, server and Private Cloud Compute.</span></a></li>
<li><a href="${B}/developers/"><strong>For developers</strong><span>The Foundation Models framework and what an app can do.</span></a></li>
<li><a href="${B}/transcription/"><strong>Transcription</strong><span>Apple's on-device speech to text, and what it needs.</span></a></li>
<li><a href="${B}/ios/"><strong>iOS as a platform</strong><span>App Store, TestFlight, on-device ML, iCloud and privacy rules.</span></a></li>
<li><a href="${B}/our-work/"><strong>Our own work</strong><span>The Sovereign Website app and the iOS demo. Only what is confirmed.</span></a></li>
<li><a href="${B}/sources/"><strong>Sources</strong><span>Every page we read, with the date we read it.</span></a></li>
</ul>
<div class="note"><p>How to read this guide: a small number such as ${c('s3')} links to its entry on the <a href="${B}/sources/">sources page</a>. Apple's pages change, so each entry says what date the page itself shows (often none) and the day we read it: ${READ}.</p></div>
<p>Not sure about the look? <a href="/design/">Choose a design</a>.</p>` },

  '/apple-intelligence/': { title: 'Apple Intelligence', mark: 'Scope 1', desc: 'What Apple Intelligence is, which devices, languages and regions it supports, and its stated limits, from Apple pages read on 25 November 2026.',
    body: () => `<h1>Apple Intelligence</h1>
<p>Apple describes the next generation of Apple Intelligence as integrated deeply into the operating system, and "private at every step".${c('s1', 's3')} It is automatically available on eligible devices when you update to the 27.0 software releases.${c('s3')}</p>
<section><h2>What it includes</h2>
<p>Apple's page names these among its features: Siri AI, Visual Intelligence, photo editing tools, Image Playground, Write with Siri, Live Translation, Safari tools, Genmoji and Workout Buddy.${c('s1')} Siri AI is described as available in beta in iOS 27, iPadOS 27, macOS 27, watchOS 27 and visionOS 27.${c('s1')}</p></section>
<section><h2>Which devices</h2>
<p>Apple's overview page lists these devices, with chips as shown there.${c('s1', 's2')}</p>
<div class="scroll"><table><caption class="mark">Device list as on Apple's page, read ${READ}</caption>
<thead><tr><th scope="col">Family</th><th scope="col">Models and chips, as listed</th></tr></thead><tbody>
<tr><th scope="row">iPhone</th><td>iPhone Duo (A20 Pro); iPhone 18 Pro Max and 18 Pro (A20 Pro); iPhone 17 Pro Max, 17 Pro and Air (A19 Pro); iPhone 17 and 17e (A19); iPhone 16 Pro Max and 16 Pro (A18 Pro); iPhone 16 Plus, 16 and 16e (A18); iPhone 15 Pro Max and 15 Pro (A17 Pro)</td></tr>
<tr><th scope="row">iPad</th><td>iPad Pro and iPad Air (M1 and later); iPad mini (A17 Pro and later)</td></tr>
<tr><th scope="row">Mac</th><td>MacBook Neo (A18 Pro); MacBook Air and MacBook Pro (M1 and later); MacBook Pro with the newer display (M5 Pro and later); iMac and Mac mini (M1 and later); Mac Studio (M1 Max and later); Mac Pro (M2 Ultra)</td></tr>
<tr><th scope="row">Vision</th><td>Apple Vision Pro (M2 and later)</td></tr>
</tbody></table></div>
<p>Apple's support page words the list differently and adds the watch: iPhone 16 models or later, iPhone 15 Pro and 15 Pro Max, iPhone Air and iPhone Duo; iPad models with M1 or later and iPad mini (A17 Pro and A20 Pro); Mac with M1 or later; Apple Vision Pro; and Apple Watch Series 9 or later, Ultra 2 or later and SE 3 when paired with an Apple Intelligence iPhone.${c('s3')} Use Apple's own pages for the current list.</p></section>
<section><h2>Languages and regions</h2>
<p>Apple Intelligence is listed as available in English, Danish, Dutch, French, German, Italian, Norwegian, Portuguese, Spanish, Swedish, Turkish, Vietnamese, Chinese (simplified), Chinese (traditional), Japanese and Korean. The device language and the Siri language must be set to the same supported language.${c('s3')}</p>
<ul>
<li>Siri AI is available "in English, French, Japanese, Korean, Portuguese, and Spanish to start".${c('s1')}</li>
<li>Siri AI "will not be initially available in the EU on iOS, iPadOS, and watchOS", and is not available to users under 13.${c('s1')}</li>
<li>Apple says many features are available in most regions, and that Apple Intelligence features "will not currently work" on supported devices bought in mainland China.${c('s3')}</li>
<li>A full list of countries: ${NS}.</li>
</ul></section>
<section><h2>Storage, limits and cost</h2>
<ul>
<li>Storage: up to 14 GB on the newest iPhones, on iPad with M4 and later and on Macs with M3 and later (12 GB or more memory); up to 8 GB on other models; up to 1.5 GB on Apple Watch.${c('s3')}</li>
<li>Features that rely on server-side models are subject to daily usage limits. Apple says expanded access "will be available for a fee in the future". The fee: ${NS}.${c('s3')}</li>
</ul></section>` },

  '/models/': { title: 'The models', mark: 'Scope 1', desc: "Apple's on-device and server models and Private Cloud Compute, from Apple's own pages, with the dates of each source.",
    body: () => `<h1>The models, and Private Cloud Compute</h1>
<div class="note"><p>Apple's model descriptions we could read are from 2024 and 2025. We found no Apple page giving the size of the 2026 models, so for those this guide says ${NS}.</p></div>
<section><h2>On-device model</h2>
<p>In June 2024 Apple described a "~3 billion parameter on-device language model".${c('s5')} Its July 2025 report describes a "~3B-parameter on-device model optimized for Apple silicon through architectural innovations such as KV-cache sharing and 2-bit quantization-aware training".${c('s6')}</p></section>
<section><h2>Server model</h2>
<p>The 2025 report describes "a scalable server model built on a novel Parallel-Track Mixture-of-Experts (PT-MoE) transformer", for Apple's Private Cloud Compute platform. Its parameter count: ${NS}.${c('s6')} The 2024 post says the server model runs on Apple silicon servers with Private Cloud Compute.${c('s5')}</p>
<p>Languages the models support: the 2025 report says "multilingual, multimodal" and "several additional languages" without listing them.${c('s6')} For the languages of the features, see <a href="${B}/apple-intelligence/">Apple Intelligence</a>.</p></section>
<section><h2>Private Cloud Compute</h2>
<p>Apple's security blog (June 2024) describes what it says Private Cloud Compute does:${c('s4')}</p>
<ul>
<li>It runs on custom Apple silicon nodes using "a hardened subset of the foundations of iOS and macOS".</li>
<li>The device encrypts the request "directly to the public keys of the PCC nodes" it has confirmed are valid. Load balancers and privacy gateways sit outside that trust boundary and do not have the keys.</li>
<li>A third-party relay hides the device's source IP address.</li>
<li>"User data is never available to Apple, even to staff with administrative access", and is "not retained in any form after the response is returned".</li>
<li>There is no remote shell and no general-purpose logging. Only pre-specified, structured and audited logs and metrics can leave a node.</li>
</ul>
<p>For outside checking, the post says Apple would make software images of every production build "publicly available for security research", keep a transparency log, and provide a virtual research environment that runs a node on a Mac with Apple silicon. That post is written in the future tense, so this guide does not say those were all delivered: ${NS}.${c('s4')}</p>
<p>On training data, Apple says it does not use users' private personal data or interactions to train its foundation models unless they explicitly choose to help improve them.${c('s5')}</p></section>` },

  '/developers/': { title: 'For developers', mark: 'Scope 1', desc: 'The Foundation Models framework and what an app can do with Apple Intelligence, from developer.apple.com pages read on 25 November 2026.',
    body: () => `<h1>For developers: the Foundation Models framework</h1>
<p>Apple calls it "a native Swift API that gives you direct access to Apple Foundation Models, on device and in Private Cloud Compute".${c('s7')} It is also described as the way to reach "the same on-device model that powers Apple Intelligence".${c('s9')}</p>
<section><h2>What it offers</h2>
<ul>
<li>Named capabilities: guided generation, tool calling, image understanding and Dynamic Profiles.${c('s8')}</li>
<li>Dynamic Profiles are "declarative APIs for continuously updating your session's model, tools, and instructions on the fly". Each profile has its own model, temperature, reasoning level and toolset, and the session transcript is shared across switches.${c('s8')}</li>
<li>On device, apps can "work without internet connectivity".${c('s8')}</li>
<li>It can work with other models: Apple lists Core AI, MLX, Claude and Gemini providers, each linked to a GitHub repository.${c('s8')}</li>
<li>Also named: an Evaluations framework, an <code>fm</code> command line tool in macOS 27 and a Python SDK.${c('s7', 's8')}</li>
<li>Vision tools such as text recognition and barcode reading are described as on-device.${c('s9')}</li>
</ul></section>
<section><h2>Cost and limits</h2>
<ul>
<li>Developers in the small business programme with fewer than 2 million first-time downloads can use Apple Foundation Models on Private Cloud Compute "at no cloud API cost".${c('s7', 's8')}</li>
<li>Some server-side features have daily usage limits, and expanded access "will be available for a fee in the future". The fee: ${NS}.${c('s8')}</li>
<li>Apple says users' data in Private Cloud Compute "is not stored or accessible to Apple or anyone else".${c('s8')}</li>
</ul></section>
<section><h2>Other things an app can plug into</h2>
<p>Apple's developer page also names App Intents, Image Playground, Shortcuts, Visual Intelligence, Write with Siri and Genmoji.${c('s7')} Image Playground images are "generated on Private Cloud Compute, so photos are never stored or shared".${c('s7')}</p></section>
<section><h2>What Apple's pages do not say</h2>
<p>The minimum operating system version, the device requirements for the framework, how to check whether the model is available, class names and code samples: ${NS}. The framework's documentation page returned only its title when we read it, so we have not copied any code from it.</p></section>` },

  '/transcription/': { title: 'Transcription', mark: 'Scope 1', desc: "Apple's on-device speech to text: SpeechAnalyzer for developers and Dictation for people, what Apple's pages say it needs, and what they leave out.",
    body: () => `<h1>Transcription on Apple devices</h1>
<p>Apple's developer pages say that with SpeechAnalyzer "you can bring advanced, on-device transcription to your app".${c('s10')} This page sets out what Apple's own pages say about it, and what they do not.</p>
<section><h2>For developers: SpeechAnalyzer</h2>
<ul>
<li>Apple's WWDC25 session calls it "the next evolution of our speech-to-text API", introduced in iOS 26 and following the older SFSpeechRecognizer from iOS 10.${c('s18')}</li>
<li>It runs on the device: "transcription is entirely on device but the models need to be fetched".${c('s18')}</li>
<li>The model is kept in system storage, and does not add to the app's download size, its storage or its memory use. The system installs updates itself.${c('s18')}</li>
<li>Apple Intelligence is not required for transcription. In the session's demo it is used for a separate step, generating a title.${c('s18')}</li>
<li>An app can hold support for "a limited number of languages at a time". The number: ${NS}.${c('s18')}</li>
<li>Apple names these types: SpeechAnalyzer, SpeechTranscriber, DictationTranscriber and AssetInventory. DictationTranscriber supports the same languages, model and devices as the older on-device SFSpeechRecognizer.${c('s18')}</li>
</ul></section>
<section><h2>Which devices</h2>
<p>The session says SpeechTranscriber "is available for all platforms but watchOS with certain hardware requirements". The hardware requirements: ${NS}.${c('s18')} Apple's machine learning page lists speech among features for iPhone, iPad, Apple Vision Pro, Mac and Apple Watch, without versions.${c('s10')}</p></section>
<section><h2>Languages</h2>
<p>Apple says speech recognition covers "a variety of languages".${c('s10')} The session says the transcriber handles a set of languages "with more to come", and its transcript text does not give the list.${c('s18')} The list of languages: ${NS}.</p></section>
<section><h2>For people: Dictation, and Notes</h2>
<ul>
<li>Apple's iPhone guide says Dictation is processed on the iPhone in many languages and needs no internet connection. Dictating into a search field may send the text to a search engine. These points come from a summary of the page.${c('s19')}</li>
<li>Better spelling, punctuation and capitalisation need Apple Intelligence and are described as English on newer iPhones. Basic Dictation does not. Also from the summary.${c('s19')}</li>
<li>Apple lists "Notes transcription summaries" for iPhone, iPad, Mac and Apple Vision Pro, among features that work with iOS 26 and later.${c('s3')}</li>
<li>Dictation's own device and operating system requirements, and its language list: ${NS}.</li>
</ul></section>
<section><h2>What our own app uses</h2>
<p>The team behind the VoiceDebrief iOS app reports that it uses SpeechAnalyzer to transcribe speech on the device, with no key and no server of ours. See <a href="${B}/our-work/">Our own work</a>.</p></section>
<section><h2>What Apple's pages do not say</h2>
<p>The hardware requirements, the languages, the number of languages an app may hold, and anything in the Speech documentation: ${NS}. Those documentation pages returned only their titles when we read them.</p></section>` },

  '/ios/': { title: 'iOS as a platform', mark: 'Scope 2', desc: 'App Store and TestFlight distribution, on-device machine learning, iCloud and CloudKit, and privacy rules, from Apple pages read on 25 November 2026.',
    body: () => `<h1>iOS as a platform for our work</h1>
<section><h2>Distribution and the developer account</h2>
<ul>
<li>Apple lists App Store distribution, alternative distribution "in certain regions", and Developer ID with notarisation for Mac apps outside the Mac App Store.${c('s13')}</li>
<li>The Apple Developer Program is shown as a "$99 annual membership" (US page), with an Enterprise Program at "$299/year" for private distribution to employees.${c('s14')} Prices in other countries: ${NS}.</li>
<li>A free Apple developer account gives beta Xcode and operating systems, device testing, forums and Feedback Assistant. Membership adds TestFlight and App Store distribution.${c('s14')}</li>
</ul></section>
<section><h2>TestFlight</h2>
<ul>
<li>Up to 100 builds can be shared.${c('s11')}</li>
<li>Internal testers: up to 100 members of your team in certain roles. External testers: up to 10,000, by email invite or public link. A tester can use builds on up to 30 devices.${c('s11')}</li>
<li>The first build for external testing must be approved by App Review for TestFlight.${c('s11')}</li>
<li>A build can be tested for up to 90 days, and the TestFlight app is free. These two points come from a summary, so check the page.${c('s12')}</li>
</ul></section>
<section><h2>On-device machine learning</h2>
<p>Apple's machine learning page names Core AI, the Foundation Models framework, Vision, Speech, Core ML, Metal and MLX.${c('s10')}</p>
<ul>
<li>Core AI is "designed to be the best way to bring and run AI models on device", with "zero server dependencies and zero token costs".${c('s10')}</li>
<li>Core ML gives "fast performance for integrating traditional machine learning models", with Core ML Tools for conversion. For large language models and other generative models Apple points to Core AI.${c('s10')}</li>
<li>MLX is an open-source array framework.${c('s10')}</li>
<li>Core ML's own documentation page returned only its title, so details beyond this: ${NS}.</li>
</ul></section>
<section><h2>iCloud and CloudKit</h2>
<ul>
<li>Apple says CloudKit gives "up to 1PB of storage for your app's public data", and private data is stored in the users' own iCloud accounts.${c('s15')}</li>
<li>It names automatic syncing, encrypted fields and the CloudKit Console.${c('s15')}</li>
<li>Whether it needs a paid membership: ${NS}. Its documentation page returned only its title.</li>
</ul></section>
<section><h2>Privacy rules for apps</h2>
<ul>
<li>Developers must give privacy practice information in App Store Connect to submit new apps and updates, and a privacy policy link is required.${c('s16')}</li>
<li>The App Review Guidelines section on privacy (5.1) covers data collection and storage, data use and sharing, health data, kids and location. As summarised for us: personal data may not be used or shared without permission, tracking needs the App Tracking Transparency APIs, and kids' apps should not include third-party analytics or advertising.${c('s17')} Read the guidelines before relying on these.</li>
<li>Privacy manifests: ${NS} (the page returned only its title).</li>
</ul></section>` },

  '/our-work/': { title: 'Our own work on Apple', mark: 'Scope 3', desc: 'Our owner-mode view and the Sovereign Website app inside the VoiceDebrief iOS app: what the team has confirmed, with the rest marked not stated.',
    body: () => `<h1>Our own work on Apple</h1>
<div class="note"><p>Everything on this page was reported to this site by the team's agent a.ios on 25 November 2026 (00:50 UTC), through a.maestro. We have not read the code ourselves. Where it says nothing, this page says ${NS}.</p></div>
<section><h2>Where it lives</h2>
<p>Both features are inside the VoiceDebrief iOS app, in the public repository <a href="https://github.com/VoiceDebrief/VoiceDebrief__App__iOS">github.com/VoiceDebrief/VoiceDebrief__App__iOS</a> (code under Apache 2.0, content under CC BY 4.0). It runs on iPhone and iPad with iOS 26, is written in SwiftUI and uses the Apple SDK only. It uses Apple's on-device models only: SpeechAnalyzer for transcripts and the Foundation Models framework for text. There is no API key and no backend of ours.${c('s7', 's8')}</p></section>
<section><h2>Owner mode (R6)</h2>
<p>A section for one person, the site's owner. It shows every agent from the biggest to the smallest, with its status, what it is doing, what it waits for and its home repository. It also shows the latest websites, videos, briefs and decision slides, and the decisions waiting for the owner. The owner answers there, or uses "talk to this page", typed or spoken, to reach the agent that made it. Decisions and the owner's own actions are listed apart.</p>
<ul>
<li>It reads one JSON contract, <code>owner.feed/v1</code>, from three sources: a demo feed with invented data, published public feeds, and the owner's own encrypted vault.</li>
<li>Answers are sealed to an agent's lane. Live data and sending are limited to devices the owner registers with their own key. The app checks the owner's grant against a pinned owner fingerprint, which is not yet pinned.</li>
</ul></section>
<section><h2>Sites, the Sovereign Website app (R7)</h2>
<p>This is tier 1 of the app. You scan a Sovereign Website's QR code, which carries a key the site's keeper issued and which goes to the Keychain. You see the site in a web view, pick what your comment is about, speak (transcribed on the device) or type, add up to four photos and send. The request is signed and sealed as the site's own send page does it and added to the keeper's lane. The keeper, an agent, answers; the app opens the reply on the device and says when the site has changed.</p>
<p>Tiers 2 (edits on the device with Apple Intelligence, through tools) and 3 (a site from photos and a theme) are proposed, not built.</p>
<p>A demo of the Sovereign Website app on iOS is planned for Thursday 26 November 2026.</p></section>
<section><h2>Build and TestFlight state</h2>
<ul>
<li>The work is on the branch <code>work/sites</code> and is green in continuous integration (build plus unit tests on iPhone and iPad simulators) at commit <code>ee83b1a</code>.</li>
<li>None of it has run on a real device yet.</li>
<li>It is not on the main development branch and not in TestFlight. A green push there uploads a TestFlight build, and that waits for the owner's yes.</li>
<li>The App Store: ${NS}.</li>
</ul></section>` },

  '/sources/': { title: 'Sources', mark: 'Evidence', desc: 'Every Apple page this guide uses, with the date the page shows and the date we read it.',
    body: () => `<h1>Sources</h1>
<p>Each page below was read on ${READ}. "Date on the page" is what the page itself shows, and many Apple pages show none apart from a copyright year. Apple's pages change, so check the link for the current wording.</p>
<div class="note"><p>How we read them: through a reader that returns text, and in places a summary of it. Entries where only a summary was available say so in the notes. Facts that we could not source are written as "not stated".</p></div>
<div class="scroll"><table><caption class="mark">Pages used</caption><thead><tr><th scope="col">No.</th><th scope="col">Page</th><th scope="col">Used for</th><th scope="col">Date on the page</th><th scope="col">Read</th></tr></thead><tbody>
${SRC.map((s, i) => `<tr id="${s[0]}"><th scope="row">${i + 1}</th><td><a href="${s[1]}">${esc(s[1])}</a>${s[4] ? `<br>${esc(s[4])}` : ''}</td><td>${esc(s[2])}</td><td>${esc(s[3])}</td><td>${READ}</td></tr>`).join('\n')}
</tbody></table></div>
<h2>Opened, but no usable text</h2>
<p>These pages loaded but gave us only a title or nothing useful, so nothing on this site rests on them.</p>
<ul>${EMPTY.map((e) => `<li><a href="${e[0]}">${esc(e[0])}</a>: ${esc(e[1])} (read ${READ})</li>`).join('\n')}</ul>
<h2>From our own team</h2>
<p>The "Our own work" page rests on a message from the team's agent, a.ios, on 25 November 2026, not on a page we read. The repository it points to is <a href="https://github.com/VoiceDebrief/VoiceDebrief__App__iOS">github.com/VoiceDebrief/VoiceDebrief__App__iOS</a>. We have not read its code.</p>
<p>Our own pages: the dates above are when we read Apple's pages, not when Apple wrote them. Apple's logos, product images and trade dress are not used here.</p>` },
};

const IDEA = (d) => {
  const name = DESIGNS.find((x) => x[0] === d)[1];
  return `<div class="shots"><img src="/assets/designs/shots/${d}-phone.jpg" width="195" height="422" loading="lazy" alt="${name} on a phone: the top of the home page"><img src="/assets/designs/shots/${d}-desktop.jpg" width="440" height="272" loading="lazy" alt="${name} on a desktop screen: the top of the Apple Intelligence page"></div>`;
};
const REC = LIVE;
PAGES['/design/'] = { title: 'Choose a design', mark: 'Design', desc: 'Five visual directions for this guide. Look at each, then tell us which to keep.', raw: true,
  body: () => `<h1>Choose a design</h1>
<p>Five directions for the same content, shown as real screenshots of the pages. Each opens a full working copy of this guide in that design, in light and dark. The live pages use ${esc(DESIGNS.find((d) => d[0] === LIVE)[1])} until the owner picks. These are round 2 drafts, changed after a design review.</p>
<ul class="picker">
${DESIGNS.map(([id, name, text]) => `<li>${IDEA(id)}<h2>${name} ${id === REC ? '<span class="badge">Live now</span>' : ''}</h2><p>${text}</p><div class="acts"><a href="/design/${id}/">Preview ${name}</a><a href="/design/${id}/apple-intelligence/">Preview a content page</a></div></li>`).join('\n')}
</ul>
<h2>How to choose</h2>
<p>Tell us your pick by <a href="https://github.com/SovereignWebsite/Site__Platform__Apple/issues/new?title=Design%20choice">opening an issue on GitHub</a> with the design's name in the title. Nothing on the live pages changes until then.</p>` };

// ---- rendering ----
const head = (design, path, p, canonical, noindex) => {
  const url = `${HOST}${canonical}`;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}${p.title.includes('unofficial') ? '' : ' | Apple as a platform (unofficial)'}</title>
<meta name="description" content="${esc(p.desc)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<meta property="og:type" content="website">
<meta property="og:site_name" content="Apple as a platform (unofficial)">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:image" content="${HOST}/assets/share/card-1200x630.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Apple as a platform (unofficial)">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.desc)}">
<meta name="twitter:image" content="${HOST}/assets/share/card-1200x630.jpg">
<link rel="canonical" href="${url}">
<link rel="stylesheet" href="/assets/designs/base.css?v=${HASH('base')}">
<link rel="stylesheet" href="/assets/designs/${design}.css?v=${HASH(design)}">
</head>`;
};
function render(design, base, path, noindex) {
  B = base; PREVIEW = noindex;
  const p = PAGES[path];
  const nav = NAV.map(([h, l]) => `<a href="${h === '/design/' ? h : base + h}"${h === path ? ' aria-current="page"' : ''}>${l}</a>`).join('\n    ');
  const canonical = noindex ? (path === '/' ? '/' : path) : (base + path);
  return `${head(design, path, p, noindex ? base + path : canonical, noindex)}
<body class="${design}">
<a class="skip" href="#main">Skip to content</a>
${FAMILY}
<header class="top">
  <a class="name" href="${base}/">Apple as a platform (unofficial)</a>
  <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label="Show the menu">
  <label for="nav-toggle" class="nav-btn" aria-hidden="true">Menu</label>
  <nav class="own" aria-label="This guide">
    ${nav}
  </nav>
</header>
<aside class="notice" aria-label="Independence notice"><p>${NOTICE}</p></aside>
<main id="main">
${designBar(design, path)}${p.mark ? `<div class="mark">${esc(p.mark)}</div>\n` : ''}${withToc(p)}
</main>
<footer>
<nav class="site-links" aria-label="About this site">
  <a href="/start/">Start here</a>
  <a href="/agents/">Use with your AI</a>
  <a href="/admin/">How this site was made</a>
  <a href="/policy/">How this site is governed</a>
</nav>
${NOTICE} Read on ${READ}; see <a href="${base}/sources/">sources</a>. A sovereign website, made with the <a href="https://sovereignwebsite.org/">open pattern</a>. Source: <a href="https://github.com/SovereignWebsite/Site__Platform__Apple">github.com/SovereignWebsite/Site__Platform__Apple</a>.
</footer>
</body>
</html>
`;
}
function withToc(p) {
  let html = p.body(); const items = [];
  html = html.replace(/<h2>(.*?)<\/h2>/g, (m, t) => { const text = t.replace(/<[^>]+>/g, '').replace(/\s+(Live now)$/, '').trim(); const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); items.push([id, text]); return `<h2 id="${id}">${t}</h2>`; });
  if (p.raw || items.length < 3) return html;
  const toc = `<nav class="toc" aria-label="On this page"><p class="toc-title">On this page</p><ul>${items.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join('')}</ul></nav>`;
  return html.replace('</h1>', '</h1>\n' + toc);
}
function designBar(cur, path) {
  if (path === '/design/') return '';
  const cards = DESIGNS.map(([id, name]) => {
    const here = id === cur;
    const href = (here && cur === LIVE && !PREVIEW) ? path : `/design/${id}${path}`;
    return `<li><a href="${href}"${here ? ' aria-current="true"' : ''}><span class="thumbs"><img src="/assets/designs/shots/${id}-phone.jpg" width="49" height="106" alt="" loading="lazy"><img src="/assets/designs/shots/${id}-desktop.jpg" width="110" height="68" alt="" loading="lazy"></span><span class="nm">${name}${here ? ' (showing)' : ''}${id === LIVE ? ' (live)' : ''}</span></a></li>`;
  }).join('');
  return `<aside class="design-bar" aria-label="Choose a design"><p class="bar-title"><strong>Choose a design</strong> <span>Five directions are open. Each card opens this page in that design. <a href="/design/">See them larger</a> or <a href="https://github.com/SovereignWebsite/Site__Platform__Apple/issues/new?title=Design%20choice">tell us your pick</a>.</span></p><ul>${cards}</ul></aside>
`;
}
let PREVIEW = false;
const out = (file, s) => { mkdirSync(file.replace(/\/[^/]*$/, ''), { recursive: true }); writeFileSync(file, s); };
rmSync('site/design', { recursive: true, force: true });
for (const path of Object.keys(PAGES)) {
  const file = (b) => `site${b}${path}index.html`;
  if (path !== '/design/') {
    out(file(''), render(LIVE, '', path, false));                       // live
    for (const [id] of DESIGNS) out(file(`/design/${id}`), render(id, `/design/${id}`, path, true)); // previews
  }
}
// The picker itself uses the live design.
out('site/design/index.html', render(LIVE, '', '/design/', false));
// Each preview's own "Designs" link must go to the picker, not to a copy: NAV points at /design/ under the base.
console.log('pages written');
