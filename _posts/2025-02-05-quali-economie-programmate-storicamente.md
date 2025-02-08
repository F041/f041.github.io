---
title: "Economia pianificata centralmente: la tecnica non risolve i problemi della natura della gestione"
date: 2025-02-06 14:09:12 +0100
categories: [storia, economia]
tags: [urss, bilanci]
math: true
---

In un’economia pianificata centralmente, come quella dell’URSS, ogni settore (ad esempio, l’industria, l’agricoltura, ecc.) produce dei beni. Questi beni non servono solo per la vendita a consumatori, ma anche come input per far produrre altri beni ad altre aziende. Tutto ciò che entra in un processo produttivo esce, magari sotto forma di prodotti finiti, scarti o come materia prima per altri settori, un po' come per i bilanciamenti delle equazioni chimiche. Possiamo esprimere e studiare questi bilanci utilizzando gli strumenti dell’algebra lineare e le equazioni di primo grado, quindi si può capire gran parte di quanto segue avendo completato la scuola media.

## Il concetto di bilancio materiale
Immagina un’economia divisa in vari settori (ad esempio: agricoltura, industria, trasporti, ecc.) in cui ogni settore produce un output che, a sua volta, diventa input per altri settori o soddisfa una domanda finale (come il consumo). Il principio fondamentale è quello della conservazione della materia:

$$ Input_{\text{totali}} = Output_{\text{totali}} + Scarti/Consumo_{\text{intermedio o finale}}  $$

i numeri che vedrai, per questioni di semplicità, avranno a che fare con **quantità**. Aggiungere il discorso prezzi appesentirebbe di molto l'articolo, perché ad esempio, bisognerebbe introdurre il ruolo contabile della banca centrale di questo modello.

## Rappresentare il problema con l’algebra lineare
Immagina di avere una lista, o vettore, in cui ogni voce rappresenta la quantità prodotta da un settore. Se abbiamo, ad esempio, tre settori, possiamo scrivere:

$$
\mathbf{S} =
\begin{pmatrix}
s_1 \\
s_2 \\
s_3
\end{pmatrix}
$$

dove $$s_1$$​ è la produzione del settore 1, $$s_2$$​ quella del settore 2 e così via.

## Rappresentare i rapporti tra settori
ovviamente i settori non vivono in maniera isolata, ma interagiscono. Tenendoci alla scrittura vettoriale:

$$
s_i = a_{i1} s_1 + a_{i2} s_2 + \cdots + a_{in} s_n + d_i
$$

dove $$s_i$$ rappresenta produzione totale del settore $$i$$.

Questa interazione si può rappresentare aumentando le *colonne della lista*, ossia costruendo una matrice o una "tabella". La matrice A raccoglie le informazioni su quanti beni di un settore sono necessari per produrre un’unità in un altro settore o altri settori.
Ad esempio, l’elemento $$a_{\text{ij}}$$​ della matrice indica quanta materia proveniente dal settore $$i$$ serve per produrre un’unità di output nel settore $$j$$.
Qui si inizia a vedere un elemento delicato del calcolo economico effettuato centralmente. Se immaginiamo che la produzione di ciascun settore viene in parte utilizzata da altri settori per produrre ulteriori beni, la matrice $$A$$ contiene tutti questi “rapporti di consumo” intermedio.
Si giunge quindi alla equazione
$$S = AS + C$$
dove $$C$$ sta per consumi

La matrice A detta dei coefficienti tecnici può portare a grosse distorsioni, perché magari centralmente non conoscono i miglioramenti di processo che portano ad usare meno input.

## Risoluzione equazione: esempio acciaio
Immaginiamo un’economia ipersemplificata con tre settori:
* Ferro (settore 1)
* Carbone (settore 2)
* Acciaio (settore 3)

Per produrre 1 unità di acciaio, servono, un'altra semplificazione: 0,4 unità di ferro e 0,3 unità di carbone. Facciamo anche finta, sempre per questioni di semplicità, che ferro e carbone non richiedono input da altri settori per la loro produzione (es. legno per i picconi, tessuti per i DPI, etc.)

La matrice dei coefficienti tecnici A risulterà una matrice 3×3 in cui:

Colonna 1 (Produzione di Ferro):

Non vengono utilizzati input da altri settori, quindi:

$$
a_{\text{11}}=0, \quad a_{\text{21}}=0, \quad a_{\text{31}}=0
$$

Colonna 2 (Produzione di Carbone)

Anche qui non sono necessari input interni:

$$
a_{\text{12}}=0, \quad a_{\text{22}}=0, \quad a_{\text{32}}=0
$$

Colonna 3 (Produzione di Acciaio)

Per ogni unità di acciaio:
* Occorrono 0,4 unità di ferro: $a_{13}=0,4$

* Occorrono 0,3 unità di carbone: $a_{23} = 0,3$

* Non serve acciaio come input: $a_{33}=0$
  * può sembrare una osservazione inutile ma in certi settori, tipo l'energia, serve un input energetico. Un po' come avviare la macchina tramite l'energia meccanica del girare la chiave   

di conseguenza la matrice A diventa
$$
A =
\begin{pmatrix}
0 & 0 & 0,4 \\
0 & 0 & 0,3 \\
0 & 0 & 0
\end{pmatrix}
$$
a questo punto definiamo
$$
\mathbf{S} =
\begin{pmatrix}
s_1 \\
s_2 \\
s_3
\end{pmatrix}
$$

dove $$s_1$$​ risulta la produzione di ferro, $$s_2$$​ quella del carbone e $$s_3$$ quella di acciaio.

Supponiamo che la domanda finale riguarda solo l’acciaio, per esempio:  

$$
\mathbf{C} =
\begin{pmatrix}
0 \\
0 \\
100
\end{pmatrix}
$$


## Passo 1: Equazione Matriciale

L'equazione di partenza è:

$$
S = AS + C \implies (I - A)S = C
$$

### Calcolare $( I - A )$

Abbiamo matrice identità \( I \) (di dimensione \( 3 x 3 \)):

$$
I =
\begin{pmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{pmatrix}
$$

**Qui, la matrice identità $I$ serve a:**

- **Rappresentare l'elemento neutro per le matrici:** Poiché non possiamo scrivere $1X$ come nei numeri reali, usiamo $I$ per indicare l'elemento neutro nelle operazioni matriciali.
- **Facilitare la fattorizzazione:** Scrivendo $S$ come $I - S$, possiamo sottrarre $AS$ e raccogliere $S$ come fattore comune, ottenendo così $(I - A)S$.







Pertanto:

$$
I - A =
\begin{pmatrix}
1 & 0 & -0,4 \\
0 & 1 & -0,3 \\
0 & 0 & 1
\end{pmatrix}
$$

---

### Scrivere il sistema $(I - A)S = C$

Questo sistema equivale a:

$$\
\begin{cases}
1 \cdot s_1 + 0 \cdot s_2 - 0.4 \cdot s_3 = 0 \\
0 \cdot s_1 + 1 \cdot s_2 - 0.3 \cdot s_3 = 0 \\
0 \cdot s_1 + 0 \cdot s_2 + 1 \cdot s_3 = 100
\end{cases}
\$$

---

### Risolvere il sistema

- Dalla terza equazione otteniamo immediatamente il valore di una variabile:
 
  $$s_3 = 100$$

- Sostituendo nella prima equazione il precedente valore noto:

  $$s_1 - 0,4 \cdot 100 = 0 \quad \Rightarrow \quad s_1 = 40$$

- Sostituendo nella seconda equazione:

  $$s_2 - 0,3 \cdot 100 = 0 \quad \Rightarrow \quad s_2 = 30$$

---

### d. Interpretazione del risultato

La soluzione risulta:

$$
S =
\begin{pmatrix}
40 \\
30 \\
100
\end{pmatrix}
$$

Per soddisfare la domanda finale di 100 unità di acciaio, l'economia pianificata centralmente produce:

100 unità di acciaio

40 unità di ferro (per fornire il 40% necessario alla produzione di acciaio: 0.4×100=40)

30 unità di carbone (per fornire il 30% necessario: 0.3×100=30)

Questi valori garantiscono che ogni bene prodotto viene utilizzato *correttamente* nel processo produttivo o soddisfi la domanda finale. Dal punto di vista stettamente algebrico-matematico.

Penserai che ci si poteva risparmiare tutti questi conti e formalità facendo una moltiplicazione una volta saputi i coefficienti tecnici e la domanda finale di acciaio. Ma ti ricordo che la forza della rappresentazione del problema, in termini algebrici, si vede quando si eliminano le semplificazioni.

Questo approccio garantisce una pianificazione centrale accurata **dal punto di vista matematico**, in cui ogni settore sa esattamente quanto produrre e come si collega agli altri, evitando squilibri **matematici** nell'uso delle risorse.

## Chi decide gli input e gli output: da dove vengono i numeri?
E qui veniamo alla parte meno tecnica, *il tallone d'Achille* del discorso. Dal punto di vista matematico, il modello input-output dei bilanci materiali e la sua risoluzione tramite sistemi di equazioni lineari danno una parvenza di un quadro *complessivamente* rigoroso e gestibile a livello computazionale. Tuttavia, quando questo modello viene applicato in un contesto di pianificazione centrale, soprattutto nel contesto storico sovietico, emergono diverse distorsioni di natura burocratica. Ricordiamo innanzitutto che [il modello sovietico](https://f041.github.io/posts/quali-economie-programmate-storicamente/) governava con la repressione ed incentivi materiali. La produttività aveva forte contraddizioni.
Se il piano diceva "produci x", gli esecutori materiali potevano trovare irrealistico quell'obiettivo e avevano varie strade: produrre quell'x a scapito della qualità o mentire spudoratamente sulla quantità effettiva prodotta. Con la seconda strada aumentano i rischi di finire ai lavori forzati (gulag). La prima strada porta ad una crescita del PIL che fa impressione, ma se viene corretta per la qualità, la crescita risulta ancora positiva ma ridimensionata. Ora capisci perché gli scarti saltano fuori solo nella parte iniziale dell'articolo.  

La pianificazione, in generale, ha come aspetto positivo più crescita ma i burocrati venivano valutati in base al raggiungimento degli obiettivi del piano, spesso manipolavano i dati per mostrare successi, indipendentemente dalla realtà economica. Moltiplica questa distorsione per n milioni di beni e n mila settori ed emerge un caos che non può durare, con forti contraddizioni nel miglioramento delle condizioni materiali delle persone, per il discorso della qualità già citata.

Per quanto riguarda i coefficienti tecnici, venivano determinati in base alla tecnologia esistente. Se però un’impresa voleva introdurre un metodo di produzione più efficiente, questo avrebbe modificato i coefficienti tecnici, creando problemi nel bilancio materiale dell’intero sistema. In altre parole noti un altra contraddizione fra pianificatori ed esecutori materiali: i secondi avevano più consapevolezza della realtà produttività in cui lavoravano.


Chiaramente esistono anche problemi più tecnici, giusto per dirne uno: i piani economici venivano formulati in anticipo, quindi in maniera statica, ma l’economia reale risulta dinamica: le esigenze possono cambiare improvvisamente e i lavoratori se ne accorgono prima della burocrazia, perché semplicemente vivono in prima persona le realtà produttive (aziende). Il sistema pianificato si basava su dati storici e aggiornamenti lenti, risultando spesso obsoleto. I piani spesso venivano aggiornati durante l'esecuzione, o in corso d'opera, i famosi zig zag già citati, con tutti i problemi del caso connessi al "contrordine".

A questo punto risulta chiara la necessità della decentralizzazione tramite una programmazione partecipata, anziché una calata dall'altro da persone che, oltre a non avere conoscenza infinita su ogni branca dell'economia, venivano da un partito che non favoriva lo scambio di dati ed informazioni.

Concludendo, le distorsioni della burocrazia si possono riassumere in un problema di qualità del dato. Hanno provato di tutto per aumentare quella qualità, tranne il guardarsi dentro, perché questo avrebbe significato la perdita dei loro privilegi per spese personali sfiziose.

## La burocrazia non sovietica

in tante aziende d'informatica, ad esempio di consulenza, capita di manager che decidono, senza consultare gli sviluppatori, che il progetto $$x$$ richiede $$y$$ ore-uomo. Quando il manager che decide ha un passato nello sviluppo, la stima di solito ha meno problemi. Invece spesso succede che la realizzazione di obiettivi irrealistici, decisi senza partecipazione, comportano risultati discutibili. Torna insomma il problema della qualità.
Non diverso il discorso nella pubblica amministrazione. Certe pianificazioni vengono fatte da persone che non hanno mai speso un'ora della loro vita in un ufficio o uno sportello.
Ai lavoratori informatici va però meglio dei dipendenti pubblici: esistono casi di auto-organizzazione, tramite la metodologia AGILE. I lavoratori prendono decisioni e gestiscono le proprie attività senza dover attendere direttive continue da un supervisore. La dirigenza, agisce da facilitatore, creando l'ambiente giusto affinché l squadra prosperi. Il partito della burocrazia sovietica, nella pratica, aveva obiettivi molto diversi da questo. Nonostante si trattava di una istituzione pubblica, anziché privata come nel caso delle aziende d'informatica citate.







