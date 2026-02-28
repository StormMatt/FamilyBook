import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage } from '../../types';

let client: Anthropic | null = null;

export function initAI(apiKey: string) {
  client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

export function getAIClient(): Anthropic {
  if (!client) {
    throw new Error('AI client not initialized. Call initAI(apiKey) first.');
  }
  return client;
}

export async function sendChatMessage(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const ai = getAIClient();

  const response = await ai.messages.create({
    model: 'claude-sonnet-4-5-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock?.text ?? '';
}
