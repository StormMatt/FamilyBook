import * as Speech from 'expo-speech';

export async function speak(text: string, options?: { emphatic?: boolean }) {
  const rate = options?.emphatic ? 0.85 : 1.0;
  const pitch = options?.emphatic ? 1.1 : 1.0;

  // Stop any current speech before speaking new word
  await Speech.stop();

  Speech.speak(text, {
    language: 'en-US',
    rate,
    pitch,
    // Use a child-appropriate voice if available
    voice: undefined, // will use system default
  });
}

export async function stopSpeaking() {
  await Speech.stop();
}

export async function isSpeaking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}
