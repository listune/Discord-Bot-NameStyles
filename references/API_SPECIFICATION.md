# Discord Member Profile Name Styles - REST API Specification

HTTP format, headers, payload requirements, permissions, and error handling for the member profile endpoint (/guilds/{guild_id}/members/@me).

## 1. HTTP Endpoint

```http
PATCH https://discord.com/api/v10/guilds/{guild_id}/members/@me
```

- Base URL: `https://discord.com/api/v10`
- Rate Limit: Per-guild member profile bucket.

## 2. Authentication and Headers

| Header | Value | Description |
|---|---|---|
| `Authorization` | `Bot <DISCORD_BOT_TOKEN>` | Standard bot token |
| `Content-Type` | `application/json` | Required |

## 3. JSON Request Body

```json
{
  "nick": "Bot Nickname",
  "display_name_font_id": 8,
  "display_name_effect_id": 2,
  "display_name_colors": [16777215, 15418782]
}
```

### Field Definitions

| Field | Type | Required | Constraints |
|---|:---:|:---:|---|
| `nick` | string or null | No | 32 characters or fewer. Pass null or empty string to reset nickname. |
| `display_name_font_id` | integer or null | No | 1 to 12. Pass null or 0 to remove custom font. |
| `display_name_effect_id` | integer or null | No | 1 to 7. Pass null or 1 for solid color. |
| `display_name_colors` | integer[] or null | No | Array of 24-bit decimal integers (0 to 16777215). Single-color effects use 1 element. Two-tone effects use 2 elements. |

## 4. Resetting to Default

To clear custom fonts, effects, and colors:

```json
{
  "display_name_font_id": null,
  "display_name_effect_id": null,
  "display_name_colors": null
}
```

## 5. Required Bot Permissions

| Permission | Bitflag (Decimal) | Bitflag (Hex) | Description |
|---|:---:|:---:|---|
| Change Nickname | 67108864 | 0x4000000 | Required for the bot to modify its nickname in the guild. |

If missing, Discord returns:
```json
{
  "message": "Missing Permissions",
  "code": 50013
}
```

## 6. Error Handling

If a server rejects custom name styles with HTTP 400 Bad Request:

```ts
async function patchMemberWithFallback(guildId: string, payload: any) {
  try {
    return await api.patch(`/guilds/${guildId}/members/@me`, payload);
  } catch (err: any) {
    if (err.status === 400 && payload.display_name_font_id !== undefined) {
      const fallback = { nick: payload.nick ?? null };
      return await api.patch(`/guilds/${guildId}/members/@me`, fallback);
    }
    throw err;
  }
}
```
