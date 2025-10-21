# Získej Mince – demo

Malá statická ukázka obrazovky pro dobíjení mincí inspirovaná TikTok UI. Neprovádí skutečné platby – pouze simulace s potvrzovacím oknem a odpočtem 5 minut.

## Spuštění

Stačí otevřít `index.html` v prohlížeči. V prostředí s HTTP serverem (např. VS Code Live Server) se načtou fonty korektně.

## Funkce

- Výběr balíčků mincí (20–17 500) + vlastní množství
- Dynamický výpočet ceny v USD dle množství
- Panel „Poslat někomu jinému“ s polem pro username
- Tlačítko „Dobít“ aktivní při zadaném množství
- Modal „Posláno“ s informací „Bude obdrženo do 5 minut“ a odpočtem 05:00, tlačítko „Zavřít“

## Poznámky

- Ceny jsou pouze ilustrativní (výpočet ~ $1 za 70 mincí).
- Stylování cílí na vizuál blízký screenshotu, optimalizováno pro šířku ~430 px.
