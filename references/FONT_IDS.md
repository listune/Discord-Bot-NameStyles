# Discord Name Styles - Font ID Reference

Discord supports 12 internal fonts for member display names.

## Font Catalog

| Font ID | Internal Name | Google Font Equivalent | Fallback Stack | Category |
|:---:|---|---|---|---|
| 1 | Monkey Bars | Bangers | `'Bangers', cursive, sans-serif` | Comic, Action, Bold |
| 2 | BioRhyme | BioRhyme | `'BioRhyme', serif` | Slab Serif, Sturdy, Tech |
| 3 | Sakura | Cherry Bomb One | `'Cherry Bomb One', cursive` | Cute, Anime, Japanese Pop |
| 4 | Jellybean | Chicle | `'Chicle', cursive` | Playful, Organic, Friendly |
| 5 | Mainframe | VT323 | `'VT323', monospace` | Terminal, Monospace |
| 6 | Modern | MuseoModerno | `'MuseoModerno', cursive, sans-serif` | Clean, Rounded, Geometric |
| 7 | Medieval | MedievalSharp | `'MedievalSharp', cursive` | Fantasy, RPG, Gothic |
| 8 | 8Bit | Pixelify Sans | `'Pixelify Sans', monospace` | Gaming, Retro, Arcade |
| 9 | Journal | Caveat | `'Caveat', cursive` | Handwriting, Casual |
| 10 | Vampyre | Creepster | `'Creepster', cursive` | Horror, Gothic |
| 11 | gg sans | Discord Default | `gg sans, 'Noto Sans', sans-serif` | Standard Discord UI Font |
| 12 | Tempo | Zilla Slab | `'Zilla Slab', serif` | Editorial, News, Crisp |

## Web Preview Integration (HTML / React)

To render preview text in a browser, import the Google Fonts stylesheet:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bangers&family=BioRhyme:wght@700;800&family=Caveat:wght@700&family=Cherry+Bomb+One&family=Chicle&family=Creepster&family=MedievalSharp&family=MuseoModerno:wght@700;800;900&family=Pixelify+Sans:wght@700&family=VT323&family=Zilla+Slab:wght@700&display=swap" rel="stylesheet">
```

### TypeScript Font Lookup Helper
```ts
export interface DisplayNameFont {
  id: number;
  name: string;
  fontFamily: string;
}

export const DISPLAY_NAME_FONTS: DisplayNameFont[] = [
  { id: 11, name: "gg sans", fontFamily: "gg sans, 'Noto Sans', sans-serif" },
  { id: 12, name: "Tempo", fontFamily: "'Zilla Slab', serif" },
  { id: 3, name: "Sakura", fontFamily: "'Cherry Bomb One', cursive" },
  { id: 4, name: "Jellybean", fontFamily: "'Chicle', cursive" },
  { id: 6, name: "Modern", fontFamily: "'MuseoModerno', cursive, sans-serif" },
  { id: 2, name: "BioRhyme", fontFamily: "'BioRhyme', serif" },
  { id: 8, name: "8Bit", fontFamily: "'Pixelify Sans', monospace" },
  { id: 10, name: "Vampyre", fontFamily: "'Creepster', cursive" },
  { id: 1, name: "Monkey Bars", fontFamily: "'Bangers', cursive" },
  { id: 5, name: "Mainframe", fontFamily: "'VT323', monospace" },
  { id: 7, name: "Medieval", fontFamily: "'MedievalSharp', cursive" },
  { id: 9, name: "Journal", fontFamily: "'Caveat', cursive" },
];
```
