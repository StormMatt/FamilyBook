import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChatBubble } from '../../src/components/chat/ChatBubble';
import { ChatInput } from '../../src/components/chat/ChatInput';
import { OnboardingProgress } from '../../src/components/chat/OnboardingProgress';
import { useAppStore } from '../../src/store';
import { sendChatMessage } from '../../src/lib/ai/client';
import { buildSystemPrompt, parseAIResponse, mergeExtractedData } from '../../src/lib/ai/onboarding-prompt';
import type { ChatMessage, OnboardingCategory } from '../../src/types';
import { COLORS } from '../../src/constants/theme';

export default function OnboardingChat() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState(false);

  const {
    chatMessages,
    addChatMessage,
    currentCategory,
    completedCategories,
    extractedData,
    setCurrentCategory,
    completeCategory,
    updateExtractedData,
    getNextCategory,
    generateAndSaveBoards,
    setChildProfile,
    setOnboardingComplete,
  } = useAppStore();

  // Send initial welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      sendAIMessage([]);
    }
  }, []);

  const sendAIMessage = useCallback(async (messages: ChatMessage[]) => {
    setLoading(true);
    try {
      const systemPrompt = buildSystemPrompt(currentCategory, extractedData, completedCategories);
      const response = await sendChatMessage(systemPrompt, messages);
      const { visibleText, extracted, categoryComplete } = parseAIResponse(response);

      // Add AI message
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: visibleText,
        timestamp: new Date().toISOString(),
        category: currentCategory,
      };
      addChatMessage(aiMsg);

      // Merge extracted data
      if (extracted) {
        const merged = mergeExtractedData(extractedData, extracted);
        updateExtractedData(merged);

        // Create/update child profile if we have a name
        if (merged.childName) {
          setChildProfile({
            id: 'child-1',
            name: merged.childName,
            age: merged.childAge,
            communicationLevel: merged.communicationLevel ?? 'beginning',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      // Move to next category if complete
      if (categoryComplete) {
        completeCategory(currentCategory);
        const next = getNextCategory();
        if (next) {
          setCurrentCategory(next);
          if (next === 'review') {
            // Trigger final review — generate boards
            await handleReview(messages, aiMsg);
          }
        }
      }
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I'm having trouble connecting right now. Please check your API key and try again. (${error.message})`,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [currentCategory, extractedData, completedCategories]);

  const handleReview = async (previousMessages: ChatMessage[], lastMsg: ChatMessage) => {
    // Generate boards from the onboarding data
    await generateAndSaveBoards();
  };

  const handleSend = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      category: currentCategory,
    };
    addChatMessage(userMsg);

    const allMessages = [...chatMessages, userMsg];
    await sendAIMessage(allMessages);
  }, [chatMessages, currentCategory, sendAIMessage]);

  const handleSkip = useCallback(() => {
    completeCategory(currentCategory);
    const next = getNextCategory();
    if (next) {
      setCurrentCategory(next);
    }
  }, [currentCategory]);

  const { onboardingComplete, boards } = useAppStore();

  // Navigate to boards when onboarding is complete
  useEffect(() => {
    if (onboardingComplete && boards.length > 0) {
      // Small delay to let the user see the review message
      const timer = setTimeout(() => {
        router.replace('/(tabs)/boards');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [onboardingComplete, boards]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <OnboardingProgress
        current={currentCategory}
        completed={completedCategories}
        onSkip={handleSkip}
      />

      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />

      <ChatInput
        onSend={handleSend}
        loading={loading}
        placeholder={
          currentCategory === 'welcome'
            ? "Tell me about your child..."
            : currentCategory === 'eat'
            ? "What does your child love to eat?"
            : currentCategory === 'do'
            ? "What does a typical day look like?"
            : currentCategory === 'see'
            ? "Who are the important people?"
            : currentCategory === 'hear'
            ? "What makes them light up?"
            : currentCategory === 'feel'
            ? "What are the hard moments?"
            : "Type a message..."
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messageList: {
    paddingVertical: 16,
  },
});
