import { REST, Routes } from "discord.js";

// Helper: Convert Hex color string (e.g. "#EB459E") to 24-bit Decimal RGB Integer
export function hexToRgbInt(hex: string): number {
  const clean = hex.replace("#", "").trim();
  const int = parseInt(clean, 16);
  return isNaN(int) ? 16777215 : int;
}

// Helper: Convert 24-bit Decimal RGB Integer back to Hex string
export function rgbIntToHex(int: number): string {
  return "#" + Math.max(0, Math.min(16777215, int)).toString(16).padStart(6, "0");
}

export interface SetBotNameStyleOptions {
  nick?: string;
  fontId?: number;    // 1 to 12 (e.g., 8 for 8Bit, 3 for Sakura)
  effectId?: number;  // 1 to 7 (e.g., 2 for Gradient, 3 for Neon)
  colors?: number[];  // Array of RGB decimal integers, e.g. [16777215, 15418782]
}

/**
 * Updates the bot's server member profile with custom name styles.
 */
export async function setBotNameStyle(
  botToken: string,
  guildId: string,
  options: SetBotNameStyleOptions
) {
  const rest = new REST({ version: "10" }).setToken(botToken);

  const payload: Record<string, any> = {};

  if (options.nick !== undefined) {
    // Discord enforces max 32 chars for nickname
    payload.nick = options.nick.slice(0, 32);
  }

  if (options.fontId !== undefined) {
    payload.display_name_font_id = options.fontId;
  }

  if (options.effectId !== undefined) {
    payload.display_name_effect_id = options.effectId;
  }

  if (options.colors !== undefined) {
    payload.display_name_colors = options.colors;
  }

  try {
    const result = await rest.patch(Routes.guildMember(guildId, "@me"), {
      body: payload,
    });
    console.log(`[Success] Updated name styles for guild ${guildId}`);
    return result;
  } catch (error: any) {
    // If the server tier or feature rejects name styles with 400 Bad Request,
    // fallback to updating the nickname only.
    if (error.status === 400 && payload.display_name_font_id !== undefined) {
      console.warn(`[Fallback] Server ${guildId} rejected name styles. Retrying with nickname only...`);
      const fallbackResult = await rest.patch(Routes.guildMember(guildId, "@me"), {
        body: { nick: payload.nick ?? null },
      });
      return fallbackResult;
    }

    console.error(`[Error] Failed to update member profile:`, error);
    throw error;
  }
}

if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
  setBotNameStyle(process.env.DISCORD_BOT_TOKEN, process.env.DISCORD_GUILD_ID, {
    nick: "Pixel 8-Bit Bot",
    fontId: 8,      // 8Bit font (Pixelify Sans)
    effectId: 2,    // Gradient effect
    colors: [
      hexToRgbInt("#FFFFFF"), // Color 1: White
      hexToRgbInt("#EB459E"), // Color 2: Neon Magenta
    ],
  }).catch(console.error);
}

