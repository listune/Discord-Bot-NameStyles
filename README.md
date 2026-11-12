# Discord Bot Display Name Styles

Documentation for updating bot nicknames with custom fonts, effects, and colors via the Discord REST API v10.

## Overview

Discord allows server members, including bot accounts, to customize their display name with specific fonts, text effects, and colors. This is handled through the member profile endpoint:

`PATCH https://discord.com/api/v10/guilds/{guild_id}/members/@me`

This feature is used by Discord's client for server profiles and is available via the REST API using three fields:
- `display_name_font_id`: integer from 1 to 12
- `display_name_effect_id`: integer from 1 to 7
- `display_name_colors`: array of 24-bit decimal RGB integers

## Quick Start (cURL)

```bash
curl -X PATCH "https://discord.com/api/v10/guilds/YOUR_GUILD_ID/members/@me" \
     -H "Authorization: Bot YOUR_BOT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "nick": "Bot Nickname",
       "display_name_font_id": 8,
       "display_name_effect_id": 2,
       "display_name_colors": [16777215, 15418782]
     }'
```

## API Specification

- Method: `PATCH`
- URL: `https://discord.com/api/v10/guilds/{guild_id}/members/@me`
- Headers:
  - `Authorization: Bot <BOT_TOKEN>`
  - `Content-Type: application/json`

### Payload Fields

| Field | Type | Description |
|---|---|---|
| `nick` | string or null | Guild nickname (1 to 32 characters). Set to null to remove nickname. |
| `display_name_font_id` | integer or null | Font ID from 1 to 12. Set to null to reset to default. |
| `display_name_effect_id` | integer or null | Effect ID from 1 to 7. Set to null or 1 for solid color. |
| `display_name_colors` | array of integers or null | Array of 24-bit decimal integers. One color for solid/neon/prism; two colors for gradient/pop/toon/gummy. |

## Font Catalog

Font IDs map to these typography styles in Discord:

| Font ID | Discord Name | Google Font Equivalent | Style |
|:---:|---|---|---|
| 1 | Monkey Bars | Bangers | Comic book style bold |
| 2 | BioRhyme | BioRhyme | Slab serif |
| 3 | Sakura | Cherry Bomb One | Rounded bubble script |
| 4 | Jellybean | Chicle | Organic cartoon script |
| 5 | Mainframe | VT323 | Monospace terminal font |
| 6 | Modern | MuseoModerno | Rounded geometric sans |
| 7 | Medieval | MedievalSharp | Gothic medieval script |
| 8 | 8Bit | Pixelify Sans | Pixel art font |
| 9 | Journal | Caveat | Casual handwriting |
| 10 | Vampyre | Creepster | Horror display script |
| 11 | gg sans | gg sans / Noto Sans | Default Discord font |
| 12 | Tempo | Zilla Slab | Crisp slab serif |

## Effect Catalog

| Effect ID | Effect Name | Requires Secondary Color | Description |
|:---:|---|:---:|---|
| 1 | Solid | No | Single flat color using colors[0]. |
| 2 | Gradient | Yes | Horizontal gradient from color 1 to color 2. |
| 3 | Neon | No | Outer glow bloom effect. |
| 4 | Toon | Yes | Solid text with contrasting dark outline. |
| 5 | Pop | Yes | Retro 3D drop-shadow using color 2 as shadow color. |
| 6 | Gummy | Yes | Translucent vertical gradient with drop-shadow. |
| 7 | Prism | No | Rainbow gradient spectrum. |

## Color Format

Colors are passed as 24-bit decimal integers, not hex strings.

### Formula
```
integer = (red << 16) | (green << 8) | blue
```

### Conversion Functions (TypeScript)
```ts
export function hexToRgbInt(hex: string): number {
  const clean = hex.replace("#", "").trim();
  const int = parseInt(clean, 16);
  return isNaN(int) ? 16777215 : int;
}

export function rgbIntToHex(int: number): string {
  return "#" + Math.max(0, Math.min(16777215, int)).toString(16).padStart(6, "0");
}
```

### Common Colors
| Color | Hex | Integer Value |
|---|---|:---:|
| White | `#FFFFFF` | 16777215 |
| Blurple | `#5865F2` | 5793266 |
| Magenta | `#EB459E` | 15418782 |
| Cyan | `#00B0F4` | 45300 |
| Green | `#2ECC71` | 3066993 |
| Yellow | `#F1C40F` | 15844367 |
| Orange | `#F47B67` | 16022375 |
| Red | `#E74C3C` | 15158332 |

## Code Examples

### 1. TypeScript and Discord.js (v14)
Source: [`examples/nodejs-discordjs.ts`](examples/nodejs-discordjs.ts)

```ts
import { REST, Routes } from "discord.js";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!);

async function updateBotNameStyle(guildId: string, options: {
  nick?: string;
  fontId?: number;
  effectId?: number;
  colors?: number[];
}) {
  const payload: Record<string, any> = {};

  if (options.nick !== undefined) payload.nick = options.nick;
  if (options.fontId !== undefined) payload.display_name_font_id = options.fontId;
  if (options.effectId !== undefined) payload.display_name_effect_id = options.effectId;
  if (options.colors !== undefined) payload.display_name_colors = options.colors;

  try {
    return await rest.patch(Routes.guildMember(guildId, "@me"), {
      body: payload,
    });
  } catch (err: any) {
    if (err.status === 400 && payload.display_name_font_id !== undefined) {
      return await rest.patch(Routes.guildMember(guildId, "@me"), {
        body: { nick: payload.nick ?? null },
      });
    }
    throw err;
  }
}
```

### 2. Python and aiohttp
Source: [`examples/python-discordpy.py`](examples/python-discordpy.py)

```python
import aiohttp

async def set_bot_name_style(
    bot_token: str,
    guild_id: str,
    nick: str = "Bot Name",
    font_id: int = 8,
    effect_id: int = 2,
    colors: list[int] = None
):
    if colors is None:
        colors = [16777215, 15418782]

    url = f"https://discord.com/api/v10/guilds/{guild_id}/members/@me"
    headers = {
        "Authorization": f"Bot {bot_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "nick": nick,
        "display_name_font_id": font_id,
        "display_name_effect_id": effect_id,
        "display_name_colors": colors
    }

    async with aiohttp.ClientSession() as session:
        async with session.patch(url, json=payload, headers=headers) as resp:
            if resp.status == 200:
                return await resp.json()
            elif resp.status == 400:
                async with session.patch(url, json={"nick": nick}, headers=headers) as fallback:
                    return await fallback.json()
            else:
                text = await resp.text()
                raise Exception(f"HTTP {resp.status}: {text}")
```

## Resetting to Default

To reset custom styling back to standard Discord display:

```json
{
  "display_name_font_id": null,
  "display_name_effect_id": null,
  "display_name_colors": null
}
```

## Requirements and Limitations

1. Bot Permission: The bot requires the `CHANGE_NICKNAME` permission (`0x4000000`) in the server.
2. Character Limit: Nickname text is limited to 32 characters.
3. Fallback Handling: If a guild returns HTTP 400 on custom styles, catch the error and retry updating `nick` without the `display_name_*` fields.
