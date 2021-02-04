## Pravila
http://www.slovenski-tarok.si/pravila.html

http://www.tarok.net/pravila106.pdf

https://e-mesto.si/vsebina/v/pravila-tarok

## Server
Bash  
`$ export FLASK_APP=server.py`  
PowerShell  
`PS C:\...\src\api> $env:FLASK_APP = "server.py"`  
  
`python server.py`

## Specification
- LOBBY:
  - Zbere se skupina 3-4 igralcev (Tarok za 3, Tarok za 4), vsi začnejo z 0 radelci (več o radlcih pod TOČKOVANJE)
  - IGRANJE: (main game loop)
    - MEŠANJE IN DELITEV KART:
      - Pri taroku v živo ima igralec, ki je za tistim, ki je mešal, "prednost",
        ta igralec igro napoveduje zadnji
      - Vsako novo rundo se ta pozicija pomakne za 1 naprej
    - NAJAVA IGRE:
      - Vsak igralec mora napovedati igro višje vrednosti od najvišje vrednosti igre, ki je bila napovedana preden je bil na vrsti on
      - Igralec, ki ima "prednost", ima pravico najaviti igro enake vrednosti, kot jo je izbral že nekdo pred njim, ne pa igre nižje vrednosti
      - V primeru, da igralec ne želi napovedati nobene od iger, ki jih ima na voljo, lahko izbere "naprej", s tem torej ne igra nobene igre (vseeno je lahko soigralec)
      - V primeru, da je več igralcev najavilo igro, se ponovi najavljanje igre, v novem krogu pa ne sodelujejo igralci, ki so v prejšnjem krogu izbrali "naprej"
      - V primeru, da noben igralec ni najavil igre, igralec s "prednostjo" ne more iti "naprej" ampak se mu namesto te možnosti ponudi najava igre Klop
      - Tri:
        - Možno samo ob 4 igralcih
        - Talon se razdeli na 2 dela [po 3 karte]
        - Igralec kliče kralja ene od barv **(a)**
        - To igro lahko napove samo igralec, ki ima "prednost", tj. tisti, ki igro najavlja zadnji
        - Vrednost igre: 10
      - Dve:
        - Možno samo ob 4 igralcih
        - Talon se razdeli na 3 dele [po 2 karti]
        - Igralec kliče kralja ene od barv **(a)**
        - Vrednost igre: 20
      - Ena:
        - Možno samo ob 4 igralcih
        - Talon se razdeli na 6 delov [po 1 karta]
        - Igralec kliče kralja ene od barv **(a)**
        - Vrednost igre: 30
      - Solo tri:
        - Ob treh igralcih lahko to igro napove samo igralec, ki ima "prednost"
        - Talon se razdeli na 2 dela [po 3 karte]
        - Igralec igra sam
        - Vrednost igre: 40 (ob 4 igralcih), 10 (ob 3 igralcih)
      - Solo dve:
        - Talon se razdeli na 3 dele [po 2 karti]
        - Igralec igra sam
        - Vrednost igre: 50 (ob 4 igralcih), 20 (ob 3 igralcih)
      - Solo ena:
        - Talon se razdeli na 6 delov [po 1 karta]
        - Igralec igra sam
        - Vrednost igre: 60 (ob 4 igralcih), 30 (ob 3 igralcih)
      - Solo brez
        - Brez talona, vrednost se ob koncu igre prišteje skupnemu seštevku preostalih igralcev
        - Igralec igra sam
        - Vrednost igre: 80
      - Pikolo:
        - Brez talona
        - Igralec igra sam
        - Velja pravilo nadigravanja **(b)**
        - Igralec mora pobrati ZGOLJ en krog, če ne pobere nobenega ALI jih pobere več, igro izgubi
        - Vrednost igre: 55
      - Berač:
        - Brez talona
        - Igralec igra sam
        - Velja pravilo nadigravanja **(b)**
        - Igralec ne sme pobrati NOBENE karte, v tem primeru igro takoj izgubi
        - Vrednost igre: 70
      - Odprti berač:
        - Brez talona
        - Igralec igra sam
        - Velja pravilo nadigravanja **(b)**
        - Karte igralca so vidne vsem, enako kot pri beraču, igralec ne sme pobrati nobene karte
        - Vrednost igre: 85
      - Klop:
        - Vsak igralec igra sam
        - Prvim šestim vzetkom (ko igralec pobere karte z mize) se doda še po 1 karta iz talona
        - Velja pravilo nadigravanja (b)
        - Ob koncu igre se vsota pobranih kart steje v minus vsakemu igralcu posebej, razen v primeru, ko nek igralec preseže vrednost 35 (polovica skupne možne vrednosti kart),
          v tem primeru se temu igralcu šteje -70, ostalim pa 0
    - IZMENJAVA KART:
      - Igralec izbere poljuben del talona, ter enako število kart "založi", tj. doda h kupčku pobranih kart.
      - Založiti ne sme kraljev
      - Taroke lahko založi, a mora preostalim igralcem pokazati, katere taroke je založil
    - Podigre: (možno le pri igrah s talonom ali igri Solo brez)
      - Trula:
        - Možno ob: Tri, Dve, Ena, Solo tri, Solo dve, Solo ena, Solo brez
        - Ekipa pobere vse taroke trule (1, 21, 22)
        - Tiha vrednost: 10
        - Napovedana vrednost: 20
      - Kralji:
        - Možno ob: Tri, Dve, Ena, Solo tri, Solo dve, Solo ena, Solo brez
        - Ekipa pobere vse 4 kralje
        - Tiha vrednost: 10
        - Napovedana vrednost: 20
      - Kralj ultimo:
        - Možno ob: Tri, Dve, Ena
        - Kralj barve, ki je bil klican, je igran in pobran v zadnji rundi, s strani ekipe, ki igra
      - Pagat ultimo:
        - Možno ob: Tri, Dve, Ena, Solo tri, Solo dve, Solo ena, Solo brez
        - Pagat (Tarok 1 / Tarok I) je zadnja karta, ki jo igralec odvrže IN z njo tudi pobere vzetek
        - Tiha vrednost: 25
        - Napovedana vrednost: 50
      - Valat:
        - Možno ob: Tri, Dve, Ena, Solo tri, Solo dve, Solo ena, Solo brez
        - Ekipa pobere VSE vzetke
        - Tiha vrednost: 250
        - Napovedana vrednost: 500
      - Barvni valat: 
        - Možno ob: Solo tri, Solo dve, Solo ena, Solo Brez
        - Velja, da so barve več vredne od tarokov, tj. Kralj pobere vse, tudi taroke.
        - Tiha izvedba ni možna, zgolj napovedana
        - Igralec mora pobrati vse vzetke
        - Vrednosti igre: 250
    - NAPOVEDI IN NASPROTOVANJA:
      - Enak vrstni red kot pri najavi igre
      - Igralci lahko napovejo podigre (ki so možne)
      - Igre Pikolo, Berač, Odprti berač se tu štejejo kot napovedi (napovedi podiger pa niso možne)
      - Nasprotovanje:
        - Vsaki napovedi lahko igralci nasprotne ekipe nasprotujejo (kontra), kar pomeni, da se vrednost igre šteje dvojno. Ekipa, ki je prejela nasprotovanje,
          lahko le-temu nasprotuje (rekontra), s tem pa še podvoji vrednost (4x osnovna vrednost).
          To se lahko ponovi do max faktorja: 16x (Kontra, ReKontra, SubKontra, MordKontra)
        - Privzeto je faktor nasprotovanja 1x
    - IGRA:
      - Igro začne/odpre igralec, ki je imel pri najavi igre prednost (tj. tisti, ki je najavljal zadnji)
      - V primeru iger Pikolo, Berač, Odprti Berač, in podiger Valat in Barvni Valat, igro začne/odpre tisti igralec, ki je igro ali podigro napovedal
    - TOČKOVANJE:
      - Ob točkovanju se seštejejo vrednost igre (ki se pomnoži s faktorjem nasprotovanja)
        in vrednosti vseh podiger (katere se najprej, vsaka posebej, pomnožijo s faktorjem nasprotovanja)
      - Če ima igralec, ki je igro igral, vsaj 1 radelc, se ta sešteta vrednost podvoji (x2)
      - V primeru zmage se ta izračuna vrednost prišteje skupnemu seštevku točk vsem igralcem ekipe, 1 radelc pa se izbriše igralcu, ki je igro igral (ne celi ekipi)
      - V primeru poraza se ta izračunana vrednost odšteje skupnemu seštevku točk vsem igralcem ekipe, igralcu, ki je igro igral, pa se ne izbriše noben radelc
      - V primeru, da je bila igrana ena od posebnih iger / podiger (Solo brez, Berač, Odprti Berač, Valat, Barvni Valat, Klop),
        se vsem igralcem doda en radelc

  - Dodatno:
    1. Igralec igra z igralcem, ki tega kralja drži v roki. Kdo to je, se razktije, ko je ta kralj igran (položen na mizo).
        V primeru, da je ta kralj v talonu, igralec igra sam. Če iz talona vzame kralja in z njim pobere vzetek, dobi k svojim pobranim/založenim
        kartam tudi preostanek talona

    2. Pravilo nadigravanja: Vsak igralec, ki ima možnost igrati višjo karto, od ostalih na mizi, to MORA storiti.
        V nasprotnem primeru pa lahko odvrže poljubno (legalno) karto
