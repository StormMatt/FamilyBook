import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../src/store';
import { initAI } from '../src/lib/ai/client';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../src/constants/theme';

export default function Welcome() {
  const router = useRouter();
  const { onboardingComplete, apiKey, setApiKey } = useAppStore();
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (onboardingComplete) {
      router.replace('/(tabs)/boards');
    }
  }, [onboardingComplete]);

  // If we already have an API key, init and go to onboarding
  useEffect(() => {
    if (apiKey) {
      initAI(apiKey);
    }
  }, [apiKey]);

  const handleStart = () => {
    const key = keyInput.trim();
    if (!key.startsWith('sk-ant-')) {
      setError('Please enter a valid Anthropic API key (starts with sk-ant-)');
      return;
    }
    setApiKey(key);
    initAI(key);
    router.push('/onboarding/chat');
  };

  const handleSkipToDemo = () => {
    // Demo mode — skip onboarding with sample data
    const { setChildProfile, updateExtractedData, generateAndSaveBoards } = useAppStore.getState();

    setChildProfile({
      id: 'child-1',
      name: 'Demo Child',
      age: 5,
      communicationLevel: 'emerging',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    updateExtractedData({
      childName: 'Demo Child',
      childAge: 5,
      communicationLevel: 'emerging',
      foods: { likes: ['chicken nuggets', 'mac and cheese', 'apple juice', 'goldfish crackers'], dislikes: ['broccoli', 'soup'] },
      activities: { favorites: ['swinging', 'drawing', 'iPad', 'bubbles'], routines: ['school', 'park time', 'bath'] },
      people: [
        { name: 'Mama', role: 'mom', contexts: ['home'] },
        { name: 'Dada', role: 'dad', contexts: ['home'] },
        { name: 'Ms. Patel', role: 'teacher', contexts: ['school'] },
        { name: 'Grandma', role: 'grandparent', contexts: ['home'] },
      ],
      places: ['school', 'park', 'grandma house', 'store'],
      interests: { media: ['Thomas the Train', 'Bluey'], sensory: ['spinning', 'music'], topics: ['trains', 'dinosaurs'] },
      sensory: { sensitivities: ['loud noises', 'bright lights'], preferences: ['deep pressure', 'music'], calming: ['squeeze', 'headphones'] },
      hardSituations: ['transitions', 'leaving the park', 'waiting'],
    });

    generateAndSaveBoards().then(() => {
      router.replace('/(tabs)/boards');
    });
  };

  if (onboardingComplete) {
    return null; // Will redirect
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>FamilyBook</Text>
          <Text style={styles.subtitle}>Tell us about your child.{'\n'}We'll give them a voice.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Get Started</Text>
          <Text style={styles.cardDescription}>
            Enter your Anthropic API key to enable the conversational onboarding.
            We'll have a 10-minute chat to learn about your child and create personalized communication boards.
          </Text>

          <TextInput
            style={styles.input}
            value={keyInput}
            onChangeText={(t) => { setKeyInput(t); setError(''); }}
            placeholder="sk-ant-..."
            placeholderTextColor={COLORS.textLight}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start Conversation</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.demoButton} onPress={handleSkipToDemo}>
          <Text style={styles.demoButtonText}>Try Demo Mode (no API key needed)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  cardDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  error: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
  demoButton: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  demoButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
