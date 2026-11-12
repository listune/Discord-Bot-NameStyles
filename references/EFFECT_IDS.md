# Discord Name Styles - Effect ID Reference

Discord supports 7 text rendering effects for member display names.

## Effect Catalog

| Effect ID | Effect Name | Requires Secondary Color | Description |
|:---:|---|:---:|---|
| 1 | Solid | No | Flat single color using colors[0]. |
| 2 | Gradient | Yes | Horizontal gradient blending from color 1 to color 2. |
| 3 | Neon | No | Glowing luminescent bloom around the letters. |
| 4 | Toon | Yes | Solid text with contrasting dark outline. |
| 5 | Pop | Yes | Retro 3D drop-shadow using color 2 as shadow depth. |
| 6 | Gummy | Yes | Glossy translucent vertical gradient with drop-shadow. |
| 7 | Prism | No | Full spectrum rainbow gradient across the text. |

## CSS Simulation Formulas (Web Previews)

When building web applications or dashboard previews, use these CSS rules:

### 1. Solid (ID: 1)
```css
.name-solid {
  color: var(--primary-hex);
}
```

### 2. Gradient (ID: 2)
```css
.name-gradient {
  background-image: linear-gradient(90deg, var(--primary-hex), var(--secondary-hex));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--primary-hex);
}
```

### 3. Neon (ID: 3)
```css
.name-neon {
  color: var(--primary-hex);
  text-shadow: 
    0 0 4px var(--primary-hex),
    0 0 10px var(--primary-hex),
    0 0 20px var(--primary-hex);
}
```

### 4. Toon (ID: 4)
```css
.name-toon {
  color: var(--primary-hex);
  text-shadow: 
    1.5px 1.5px 0 #000,
    -1.5px -1.5px 0 #000,
    1.5px -1.5px 0 #000,
    -1.5px 1.5px 0 #000,
    0 2px 0 #000,
    0 -2px 0 #000,
    2px 0 0 #000,
    -2px 0 0 #000;
}
```

### 5. Pop (ID: 5)
```css
.name-pop {
  color: var(--primary-hex);
  text-shadow: 
    2.5px 2.5px 0px var(--secondary-hex),
    3.5px 3.5px 0px rgba(0, 0, 0, 0.8);
}
```

### 6. Gummy (ID: 6)
```css
.name-gummy {
  background-image: linear-gradient(
    180deg,
    #ffffff 0%,
    var(--primary-hex) 45%,
    var(--secondary-hex) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--primary-hex);
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4));
}
```

### 7. Prism (ID: 7)
```css
.name-prism {
  background-image: linear-gradient(
    90deg,
    #ff4d4d,
    #ffa64d,
    #ffff4d,
    #4dff4d,
    #4da6ff,
    #b34dff,
    #ff4d94
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}
```
