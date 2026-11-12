#!/usr/bin/env bash

BOT_TOKEN="${DISCORD_BOT_TOKEN:-YOUR_BOT_TOKEN_HERE}"
GUILD_ID="${DISCORD_GUILD_ID:-YOUR_GUILD_ID_HERE}"

echo ">>> 1. Setting Bot Nickname to 8-Bit Font with Neon Cyan Glow..."
curl -s -X PATCH "https://discord.com/api/v10/guilds/${GUILD_ID}/members/@me" \
     -H "Authorization: Bot ${BOT_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "nick": "Listune 8Bit",
       "display_name_font_id": 8,
       "display_name_effect_id": 3,
       "display_name_colors": [45300]
     }' | grep -o '"nick":[^,]*'

echo -e "\n\n>>> 2. Setting Bot Nickname to Sakura Font with Magenta Gradient..."
curl -s -X PATCH "https://discord.com/api/v10/guilds/${GUILD_ID}/members/@me" \
     -H "Authorization: Bot ${BOT_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "nick": "Sakura Bloom",
       "display_name_font_id": 3,
       "display_name_effect_id": 2,
       "display_name_colors": [16777215, 15418782]
     }' | grep -o '"nick":[^,]*'

echo -e "\n\n>>> 3. Setting Bot Nickname with Rainbow Prism Effect..."
curl -s -X PATCH "https://discord.com/api/v10/guilds/${GUILD_ID}/members/@me" \
     -H "Authorization: Bot ${BOT_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "nick": "Prism Music",
       "display_name_font_id": 11,
       "display_name_effect_id": 7,
       "display_name_colors": [16777215]
     }' | grep -o '"nick":[^,]*'

echo -e "\n\n>>> 4. Resetting Custom Name Styles Back to Default..."
curl -s -X PATCH "https://discord.com/api/v10/guilds/${GUILD_ID}/members/@me" \
     -H "Authorization: Bot ${BOT_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "display_name_font_id": null,
       "display_name_effect_id": null,
       "display_name_colors": null
     }' | grep -o '"nick":[^,]*'

echo -e "\n\nFinished."

