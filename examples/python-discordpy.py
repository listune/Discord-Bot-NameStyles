"""
Discord Bot Display Name Styles - Python Implementation (aiohttp & requests)

Demonstrates updating a bot's nickname, font, effect, and colors
using the official REST API v10 endpoint: PATCH /guilds/{guild_id}/members/@me
"""

import asyncio
import os
import aiohttp


def hex_to_rgb_int(hex_code: str) -> int:
    """Converts a hex color string (e.g. '#EB459E') to a 24-bit Decimal RGB Integer."""
    clean = hex_code.lstrip("#").strip()
    try:
        return int(clean, 16)
    except ValueError:
        return 16777215  # Fallback to white


def rgb_int_to_hex(int_val: int) -> str:
    """Converts a 24-bit Decimal RGB Integer back to hex string."""
    clamped = max(0, min(16777215, int_val))
    return f"#{clamped:06x}"


async def set_bot_name_style(
    bot_token: str,
    guild_id: str,
    nick: str = "Pixel Bot",
    font_id: int = 8,       # 8Bit font (Pixelify Sans)
    effect_id: int = 2,     # Gradient effect
    colors: list[int] = None # Defaults to White + Neon Magenta
):
    """
    Updates the bot's server member profile with custom name styles.
    """
    if colors is None:
        colors = [hex_to_rgb_int("#FFFFFF"), hex_to_rgb_int("#EB459E")]

    url = f"https://discord.com/api/v10/guilds/{guild_id}/members/@me"
    headers = {
        "Authorization": f"Bot {bot_token}",
        "Content-Type": "application/json"
    }

    # Nicknames are capped at 32 characters
    payload = {
        "nick": nick[:32],
        "display_name_font_id": font_id,
        "display_name_effect_id": effect_id,
        "display_name_colors": colors
    }

    async with aiohttp.ClientSession() as session:
        async with session.patch(url, json=payload, headers=headers) as resp:
            if resp.status == 200:
                data = await resp.json()
                print(f"[Success] Updated bot name style in guild {guild_id}")
                return data
            elif resp.status == 400:
                # Fallback: Server tier or feature rejected styling, update nickname only
                print(f"[Fallback] Name styles rejected by guild {guild_id}. Falling back to plain nickname...")
                async with session.patch(url, json={"nick": payload["nick"]}, headers=headers) as fallback:
                    return await fallback.json()
            else:
                text = await resp.text()
                raise Exception(f"[Error] Discord API returned {resp.status}: {text}")


# Example usage:
if __name__ == "__main__":
    token = os.getenv("DISCORD_BOT_TOKEN")
    guild = os.getenv("DISCORD_GUILD_ID")

    if token and guild:
        asyncio.run(
            set_bot_name_style(
                bot_token=token,
                guild_id=guild,
                nick="8-Bit Neon Bot",
                font_id=8,
                effect_id=3,  # Neon glow
                colors=[hex_to_rgb_int("#00B0F4")] # Electric Cyan
            )
        )
    else:
        print("Please set DISCORD_BOT_TOKEN and DISCORD_GUILD_ID environment variables to run the example.")

