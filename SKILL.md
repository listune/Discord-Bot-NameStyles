---
name: discord-bot-namestyles
description: "Instructions and API specifications for updating Discord bot display name styles (fonts, effects, and colors) via the Discord REST API v10 Member Profile endpoint (PATCH /guilds/{guild_id}/members/@me). Contains font ID mapping (1 to 12), effect ID mapping (1 to 7), decimal integer color calculations, and code implementations in TypeScript, Python, and cURL."
---

# Discord Bot Display Name Styles

Instructions and API specifications for updating Discord bot display name styles (fonts, text effects, and colors) per guild using the member profile endpoint.

## 1. When to Apply

Use this skill when:
- Setting or updating a Discord bot's display font or nickname text effect in a server.
- Constructing or debugging payloads for `display_name_font_id`, `display_name_effect_id`, and `display_name_colors`.
- Building dashboard preview components for Discord bot nickname styling.

## 2. Discord REST API Endpoint

Endpoint:
```http
PATCH https://discord.com/api/v10/guilds/{guild_id}/members/@me
```

Headers:
```http
Authorization: Bot YOUR_BOT_TOKEN
Content-Type: application/json
```

Request Payload:
```json
{
  "nick": "Bot Nickname",
  "display_name_font_id": 8,
  "display_name_effect_id": 2,
  "display_name_colors": [16777215, 15418782]
}
```

Parameters:
| Field | Type | Description |
|---|---|---|
| `nick` | string or null | Guild nickname (1 to 32 characters). Pass null to reset nickname. |
| `display_name_font_id` | number or null | Font ID from 1 to 12. Pass null to reset to default. |
| `display_name_effect_id` | number or null | Effect ID from 1 to 7. Pass null or 1 for solid color. |
| `display_name_colors` | number[] or null | Array of 24-bit RGB decimal integers. Pass null to reset. |

## 3. Font ID Catalog

| Font ID | Display Name | Google Font Equivalent | Style |
|:---:|---|---|---|
| 1 | Monkey Bars | Bangers | Comic book bold |
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

## 4. Effect ID Catalog

| Effect ID | Effect Name | Requires Secondary Color | Description |
|:---:|---|:---:|---|
| 1 | Solid | No | Flat single color using colors[0]. |
| 2 | Gradient | Yes | Horizontal gradient from color 1 to color 2. |
| 3 | Neon | No | Outer glow bloom effect. |
| 4 | Toon | Yes | Solid text with contrasting dark outline. |
| 5 | Pop | Yes | Retro 3D drop-shadow using color 2 as shadow depth. |
| 6 | Gummy | Yes | Translucent vertical gradient with drop-shadow. |
| 7 | Prism | No | Rainbow gradient spectrum. |

## 5. Color Conversion

Colors are passed as 24-bit decimal integers (0 to 16777215), not hex strings.

Formula:
```
integer = (red << 16) | (green << 8) | blue
```

TypeScript helper:
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

Preset reference:
- White (`#FFFFFF`): `16777215`
- Blurple (`#5865F2`): `5793266`
- Magenta (`#EB459E`): `15418782`
- Cyan (`#00B0F4`): `45300`
- Green (`#2ECC71`): `3066993`
- Yellow (`#F1C40F`): `15844367`

## 6. Implementation Examples

### TypeScript / Discord.js (v14)
```ts
import { REST, Routes } from "discord.js";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!);

export async function setBotNameStyle(guildId: string, options: {
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
    const res = await rest.patch(Routes.guildMember(guildId, "@me"), {
      body: payload,
    });
    return { success: true, data: res };
  } catch (err: any) {
    if (err.status === 400 && payload.display_name_font_id !== undefined) {
      const fallback = await rest.patch(Routes.guildMember(guildId, "@me"), {
        body: { nick: payload.nick ?? null },
      });
      return { success: true, data: fallback, fallback: true };
    }
    throw err;
  }
}
```

### Python (aiohttp)
```python
import aiohttp

async def set_bot_name_style(
    bot_token: str,
    guild_id: str,
    nick: str,
    font_id: int = 8,
    effect_id: int = 2,
    colors: list[int] = None
):
    url = f"https://discord.com/api/v10/guilds/{guild_id}/members/@me"
    headers = {
        "Authorization": f"Bot {bot_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "nick": nick,
        "display_name_font_id": font_id,
        "display_name_effect_id": effect_id,
        "display_name_colors": colors or [16777215, 15418782]
    }

    async with aiohttp.ClientSession() as session:
        async with session.patch(url, json=payload, headers=headers) as resp:
            if resp.status == 200:
                return await resp.json()
            elif resp.status == 400:
                async with session.patch(url, json={"nick": nick}, headers=headers) as fallback:
                    return await fallback.json()
            resp.raise_for_status()
```

### cURL
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

## 7. Rules and Edge Cases

1. Permissions: The bot must have the `CHANGE_NICKNAME` permission (`0x4000000`) in the server.
2. Nickname Length: Nicknames must be 32 characters or fewer.
3. Resetting: To remove custom styles, pass null for `display_name_font_id`, `display_name_effect_id`, and `display_name_colors`.
4. HTTP 400 Fallback: If a server rejects name styles with HTTP 400, retry patching with `nick` only.
