renamed template as lowercase_username.github.io. Settings -> Pages -> Build and deployment -> Source ->GitHub Actions
for config.yml edit, or stuff like uploading assets, logo, I use codescpaces, from Code (green button) ->Codespaces

when doing posts, do not trust the date format, enforce time zone even though you specified it in the _config...
add math: true when creating articles with math notation. Good luck with markdown

## Grafica del sito (stile A) sopra Chirpy

Il tema è [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy), bloccato alla **7.4.0** nel `Gemfile`.
Sopra c'è uno strato nostro che sostituisce alcune parti del tema: per questo un aggiornamento di Chirpy va fatto a mano, non con un `bundle update` alla cieca.

### File che sostituiscono quelli di Chirpy

| File nostro | Sostituisce | Cosa fa |
| --- | --- | --- |
| `_layouts/default.html` | `_layouts/default.html` del tema | menu in alto al posto della sidebar (che resta nel DOM, nascosta), barra del percorso negli articoli, footer scuro |
| `_layouts/home.html` | `_layouts/home.html` del tema | homepage: apertura con ingranaggi, percorsi, ultimi articoli, numeri, gruppi di lavoro |
| `assets/css/jekyll-theme-chirpy.scss` | lo stesso file del tema | carica lo stile del tema e poi `_sass/epp.scss` |
| `_data/locales/it-IT.yml` | la traduzione italiana del tema | nomi delle pagine allineati al menu (Articoli, Chi siamo, Tag) |
| `assets/img/favicons/site.webmanifest` | il manifest del tema | nome e colori dell'app |

### File nostri (non toccati dagli aggiornamenti)

- `_sass/epp.scss`: colori, font e tutte le classi `.epp-*`, più gli override delle regole di Chirpy che usano `!important`
- `_includes/epp-header.html`, `epp-footer.html`, `epp-percorso.html`, `metadata-hook.html`
- `_data/percorsi.yml`: unica fonte dei percorsi (pagina Percorsi, homepage, barra negli articoli)
- `_data/glossary.yml`: termini evidenziati negli articoli; ogni `id` deve avere un'ancora `{: #id}` in `_tabs/glossario.md`
- `assets/js/epp-gears.js` (ingranaggi, three.js da jsDelivr), `assets/js/glossary-tooltip.js`

### Il JavaScript di Chirpy cerca questi elementi per id

`#sidebar`, `#sidebar-trigger`, `#topbar-title`, `#search`, `#search-trigger`, `#search-cancel`, `#search-input`,
`#search-results`, `#search-result-wrapper`, `#search-hints`, `#mode-toggle`, `#back-to-top`, `#mask`, `#toc-*`
e il selettore `#main-wrapper > .container > .row`.
`_layouts/default.html` li mantiene tutti: se un aggiornamento ne aggiunge o rinomina qualcuno, ricerca, indice o tema chiaro/scuro smettono di funzionare senza errori evidenti.

### Come aggiornare Chirpy

1. Cambiare la versione nel `Gemfile` e fare `bundle update jekyll-theme-chirpy`.
2. Confrontare `_layouts/default.html` e `_layouts/home.html` del tema nuovo (`bundle info jekyll-theme-chirpy --path`) con i nostri e riportare le differenze (include nuovi, script, id).
3. Confrontare `_data/locales/it-IT.yml` con quello del tema: le chiavi nuove vanno copiate, altrimenti compaiono vuote.
4. Cercare negli id usati dal JS del tema (`assets/js/dist/*.min.js`) eventuali novità.
5. Provare in locale: homepage, un articolo (barra del percorso, glossario, indice), la ricerca, l'archivio, da desktop e da telefono.

### Avvertenze

- Nei testi di `_data/locales/it-IT.yml` usare l'apostrofo tipografico `’`: alcuni finiscono in script tra apici singoli (la ricerca si rompe con `'`).
- Chirpy richiede Ruby 3.x (`~> 3.1`); la GitHub Action usa la 3.3. Ruby 4 non è compatibile.
- Negli script scritti dentro l'HTML (`<script>` in layout e include) usare solo commenti `/* … */`, mai `//`: in produzione Chirpy comprime l'HTML su una riga e un `//` disattiva tutto il codice che segue, senza errori in console. In locale (`jekyll serve`) l'HTML non è compresso e il problema non si vede.

### Provare il sito in locale (Windows)

- Ruby 3.3 x64 di RubyInstaller (con DevKit) in `C:\Ruby33-x64`, nel PATH. Le gem si installano nella cartella utente e i loro comandi (`bundle`, `jekyll`, `htmlproofer`) finiscono in `%LOCALAPPDATA%\Microsoft\WindowsApps`, che deve stare nel PATH dell'utente.
- `bundle install`, poi `bundle exec jekyll serve --livereload` e il sito è su http://127.0.0.1:4000.
- Per vedere il sito come online (HTML compresso): `$env:JEKYLL_ENV='production'; bundle exec jekyll build -d <cartella>`.
- htmlproofer, come nella GitHub Action: `bundle exec htmlproofer <cartella> --disable-external`. Su Windows gli serve libcurl, da installare una volta da un PowerShell come amministratore con `ridk exec pacman -S --needed --noconfirm mingw-w64-ucrt-x86_64-curl`, poi copiare `C:\Ruby33-x64\msys64\ucrt64\bin\libcurl-4.dll` in `libcurl.dll` nella stessa cartella.
