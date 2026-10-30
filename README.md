# The Bitcoin Whitepapers, Evolution.

A self-contained static website tracing four stages in the Bitcoin whitepaper’s history: the August 2008 email abstract, the October eight-page PDF, Nicholas Bohm’s November revision, and the familiar March 2009 edition.

## Quick start on your computer

1. Extract the ZIP completely.
2. Open `index.html` in a modern browser.
3. Keep `index.html`, `style.css`, `app.js`, `data.js`, `theme.js`, `theme.css`, and `assets/` together.

There is no installation or build step. The timeline, comparison and page viewer work locally. The PDF links open Gwern, NicholasBohm/Emails on GitHub, and bitcoin.org, so those links require an internet connection. All three unchanged PDFs are also bundled under `assets/documents/` for offline use. The Bohm evidence row also offers a direct download of the bundled verified copy. Clipboard support depends on the browser; hashes remain selectable.

## Publish with free GitHub Pages hosting

Use a **new public repository** for this standalone site. GitHub Free supports Pages in public repositories.

1. Create a repository, for example `whitepaper-evolution`.
2. Extract the ZIP. Upload its **contents**, including the complete `assets` folder, into the repository. Upload the files themselves, not the ZIP. `index.html` should be at the repository’s top level.
3. Commit the files to the `main` branch.
4. Open the repository’s **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
6. Choose **main** and **/(root)**, then **Save**.
7. Wait for the Pages deployment to finish. GitHub will show the published URL in the Pages settings.

For a project repository, the address normally follows `https://YOUR-USERNAME.github.io/whitepaper-evolution/`. All asset paths are relative, so the site also works below an existing site’s subdirectory. Keep the supplied `.nojekyll` file when uploading through Git. This site does not need Jekyll or a custom Actions build.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## What is included

- A four-stop timeline, accessible range slider, previous/next controls and a manually started 7.5-second-per-stage tour.
- Full surviving abstracts with edits highlighted against the preceding stage.
- Any-pair word comparisons for seven selected passages or fields.
- A draggable overlay of original pages from two surviving PDFs.
- A page viewer for all 26 PDF pages, including each references page.
- Three unchanged original PDF files, exact metadata, file sizes and copyable SHA-256 hashes.
- Source links and provenance notes distinguishing embedded dates from publication and download claims.
- Responsive desktop and narrow-screen layouts, keyboard controls, reduced-motion support, and a print stylesheet.
- A top-right light/dark-mode switch; your choice is remembered locally in your browser.
- A three-address history from AnonymousSpeech through Vistomail to GMX, with the August email sender clearly distinguished from printed PDF contacts.
- The Bohm MD5 and SHA-256 checked against Madden’s Appendix PM3 and the supplied JFIF excerpt, plus links to both text-comparison reports.
- Deep links using query parameters such as `?stage=bohm&from=october&to=bohm&section=fees#compare`.

The site has no analytics, third-party scripts, externally loaded fonts, cookies, accounts, API keys or backend. The hosted preview and this portable package use the same site files.

## The historical stages

| Stage | Date used in the timeline | What the date means | Surviving object |
|---|---|---|---|
| August | 20–22 August 2008 | Displayed dates in Back/Dai correspondence | Title, abstract and sender address; complete authenticated PDF not located in the source record |
| October | 3 October 2008 | Embedded PDF creation date | 8-page StealthMonger/Gwern copy |
| November | 11 November 2008 | Embedded PDF creation date | 9-page Bohm copy |
| March | 24 March 2009 | Embedded PDF creation date | 9-page familiar bitcoin.org/SourceForge edition |

The four stages are an editorial structure, not Satoshi’s own version numbering and not proof that no other drafts existed. The October title and abstract match the 31 October 2008 public announcement. That supports describing the file as the likely release-era edition, without treating its exact release-day identity as conclusively proved.

StealthMonger reported receipt on 8 November 2008; a separate post gives a 2 November local file date. These remain separate, unreconciled claims. Bohm’s witness statement, paragraph 19, records a download on 18 January 2009 at 13:27 GMT (UTC).

The March time below is the PDF’s creation time. Appendix PM3, paragraphs 33–35, reproduces an archived SourceForge RSS pubDate of 24 March 2009, 17:50:18 UTC, with an MD5 matching that PDF. Export and publication are distinct events, separated by 17 minutes and 3 seconds.

## Verified original files

| Included file | Bytes | Pages, including references | Embedded creation field | Converted UTC |
|---|---:|---:|---|---|
| `assets/documents/october.pdf` | 183697 | 8 | `D:20081003134958-07'00'` | 2008-10-03 20:49:58 UTC |
| `assets/documents/bohm.pdf` | 184366 | 9 | `D:20081111080034-08'00'` | 2008-11-11 16:00:34 UTC |
| `assets/documents/march.pdf` | 184292 | 9 | `D:20090324113315-06'00'` | 2009-03-24 17:33:15 UTC |

SHA-256:

```text
427c63b364c6db914cf23072a09ffd53ee078397b7c6ab2d604e12865a982faa  assets/documents/october.pdf
e6cc7c952c688b234f9872c3e2f50060ae6556fd27925cba503c6460048e50a9  assets/documents/bohm.pdf
b1674191a88ec5cdd733e4240a81803105dc412d6c6708d53ab94fc248f4f553  assets/documents/march.pdf
```

On Linux, verify from this folder with `sha256sum -c SHA256SUMS.txt`.
On Windows PowerShell, use `Get-FileHash .\assets\documents\october.pdf -Algorithm SHA256`, and similarly for the other two files.

## Source provenance and transcription

The October PDF was retrieved from https://gwern.net/doc/bitcoin/2008-10-03-nakamoto-bitcoindraft.pdf and matches StealthMonger’s published hash. The Bohm PDF at https://github.com/NicholasBohm/Emails/blob/main/bitcoin-nb1.pdf was retrieved on 21 October 2026 and verified identical to the attached `bitcoin-nb1(1).pdf`, the earlier `bitcoin-nb1.pdf`, and the unchanged bundled copy. The March file was retrieved from https://bitcoin.org/bitcoin.pdf. The files were examined on 20 October 2026. Metadata timestamps are claims recorded inside the files, not cryptographic timestamp proofs.

The August abstract is transcribed from the Wei Dai correspondence at https://gwern.net/doc/bitcoin/2008-nakamoto. The typeset email specimen is labeled as a transcription; it does not recreate the missing PDF’s unknown design. Adam Back’s original email is linked as an exhibit image. Both the Back email and Dai transcript identify `satoshi@anonymousspeech.com` as sender. This is not evidence of the missing PDF’s printed address, which remains unknown. Displayed email dates are not silently converted into UTC.

The PDF abstracts and comparison passages are extracted from the preserved files. Line wrapping, split line-end hyphens and repeated spaces are normalized for reading. Word comparisons use whitespace-delimited tokens, with punctuation attached, and a longest-common-subsequence alignment. Counts describe that algorithm; they are not counts of semantic changes. Equations and diagrams are inspected through the original pages, not compared as extracted text.

The text comparison covers the abstract, title, fee paragraph, first network step, second SPV paragraph, email sender / printed contact address, and opening honesty-incentive sentence. It is not a full-document diff. The difficulty-adjustment paragraph is identical across all three PDFs; its relocation from §6 to §4 is documented separately, rather than shown as a wording comparison. The extracted difficulty text remains in the downloadable research data. The complete PDFs remain available for independent analysis.

Key findings: the October and November abstracts match; November adds the fee-and-predetermined-circulation paragraph; March revises that paragraph, changes the abstract and contact address, moves the difficulty paragraph, and edits the SPV text. None of the three PDFs states the numerical 21-million cap.

All source URLs and editorial notes are in `archive-data.json` and the on-page Source desk. Historical texts are by Satoshi Nakamoto. Witness accounts and archival commentary remain attributed to their respective sources.

## Bohm evidence and comparison-report review

The Bohm PDF has MD5 `3e5e11e1e3208d2829e887fb1c86bd05`. Both this MD5 and the SHA-256 above were recomputed and match **Appendix PM3, §42, pp. 14–15**. The supplied JFIF reproduces the same entry. The document identifies itself as **Madden Appendix PM3**, an 80-page Bitcoin White Paper appendix in COPA v Wright. Its NB1 examination begins at §41; §47 records the creation metadata; §§49–60 discuss textual and forensic comparisons.

- Appendix: https://github.com/NicholasBohm/Emails/blob/main/Appendix%20PM3.pdf
- Hash excerpt: https://github.com/NicholasBohm/Emails/blob/main/md5%20Bohm's%20whitepaper%20copy%20e37bb348-0839-4c41-a299-30e9e6adc830.jfif
- October → Bohm report: https://github.com/NicholasBohm/Emails/blob/main/Text-Compare-Report-1.html
- Bohm → March report: https://github.com/NicholasBohm/Emails/blob/main/Text-Compare-Report-2.html

Both HTML reports were reviewed against the preserved PDFs on **21 October 2026**. Every wording edit they flag is already represented by the site’s seven comparison passages. Report 1 adds the fee paragraph and removes “also” from the following sentence; Report 2 changes the abstract, contact, fees, first network step and second SPV paragraph. The remaining differences are repagination, line wrapping and the unchanged difficulty paragraph’s move. Line-end splits such as “peer-to-” / “peer” are normalized. No additional wording edits were inferred from these layout changes. The revision room includes links to both reports and a shortcut to the small “also” edit.

The JFIF is an excerpt of PM3, not a separate independent account. The linked HTML reports are described by their own filenames; the site does not assume they are identical to the PM3.3 / PM3.4 exhibits mentioned in the appendix.

## Editing the site

- `index.html`: layout, editorial headings and permanent explanatory text.
- `style.css`: palette, type, spacing, responsive layout and print rules.
- `app.js`: timeline, word diff, page overlay, viewer and URL state.
- `theme.js` and `theme.css`: persistent light/dark-mode control and accessible theme colours.
- `data.js`: historical records used by the site, under `window.WHITEPAPER_ARCHIVE`.
- `archive-data.json`: a downloadable copy of the same research data; update it alongside `data.js`.
- `assets/documents/`: original PDFs. Do not re-export them if you want their hashes to stay unchanged.
- `assets/pages/`: WebP page renders derived from those PDFs.

No external packages are needed. To change the branding, edit the masthead and footer in `index.html`. The initial comparison is October → March, abstract. The timeline starts at the August correspondence unless a `stage` query parameter is present.


## Documentary chronology and research brief

The **Timeline & evidence** navigation link opens `#chronology`, after the date-evidence section and before the source desk. It adds the revised month-by-month graphic, an enlarging viewer, an HTML version-comparison table, a 16-event text record and a 13-item chart source key. The graphic and numbered table use the chart source key; the wider source desk has 24 records. The layout uses the existing theme variables and supports dark mode, horizontal table scrolling, keyboard navigation and printing. The graphic, table, findings and source key remain available without JavaScript; the event ledger and modal viewer use `chronology.js`.

- `assets/research/bitcoin-whitepapers-timeline.png`: high-resolution research plate.
- `assets/research/bitcoin-whitepapers-overview.pdf`: the two-page research brief, with selectable text and linked sources.
- `chronology.css` and `chronology.js`: scoped supplemental styles and viewer/ledger behavior.
- `chronology` in `archive-data.json` / `data.js`: event precision, source references, website edit window and word-count method.

The 31 January capture preserves the earlier website abstract; the 3 March capture has the final wording. This brackets a website edit, not the creation of an earlier PDF. The January 6 SourceForge capture's “1 month ago” listing suggests possible December availability, with late November not excluded and no hash establishing the PDF version.

The table counts 8 known-fragment edits from August to October, then 60 and 53. One added, deleted or replaced word is one edit in corresponding passages, ignoring case, punctuation and layout. The missing full August draft cannot be counted. This is intentionally different from the interactive passage-diff algorithm, which retains punctuation. The three original PDFs and their checksums are unchanged.
