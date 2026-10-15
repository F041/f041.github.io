---
layout: page
icon: fas fa-route
order: 2
toc: true
---

{% comment %}
  I percorsi stanno in _data/percorsi.yml: si modificano lì (testi, ordine degli articoli).
  Questa pagina, la homepage e la barra del percorso negli articoli li leggono da quel file.
{% endcomment %}

Non serve sapere tutto subito. Qui trovi dei **percorsi di lettura** pensati per il tuo punto di partenza. Ogni percorso è una sequenza ordinata: parti dal primo articolo e vai avanti quando ti senti a tuo agio. Alla fine di ogni percorso capirai (e potrai spiegare a qualcun altro) cosa intendiamo per *economia programmata partecipata*.

Se non ti ritrovi nei punti di partenza qui sotto, il percorso **"Da zero"** (in fondo) fa per te.

{% for p in site.data.percorsi %}
---

## {{ p.titolo }}

{{ p.intro }}

{% for s in p.passi %}{{ forloop.index }}. [{{ s.testo }}]({{ s.url | relative_url }}?percorso={{ p.id }}): {{ s.desc }}
{% endfor %}
{% endfor %}
