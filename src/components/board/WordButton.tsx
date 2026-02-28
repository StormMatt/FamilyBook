import React, { useCallback, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { COLOR_HEX } from '../../constants/vocabulary';
import type { VocabWord } from '../../types';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface Props {
  word: VocabWord;
  size: number;
  onPress?: (word: VocabWord) => void;
  onLongPress?: (word: VocabWord) => void;
}

// Emoji symbols for common AAC words — gives visual meaning like the TD devices
const WORD_SYMBOLS: Record<string, string> = {
  // Core strip
  'I': '🙋',
  'want': '👉',
  'more': '🔄',
  'stop': '✋',
  'help': '🆘',
  'go': '➡️',
  'all done': '✅',
  'yes': '👍',
  'no': '🚫',

  // Verbs
  'eat': '🍽️',
  'drink': '🥤',
  'play': '🎮',
  'look': '👀',
  'like': '❤️',
  "don't like": '👎',
  'make': '🛠️',
  'get': '🤲',
  'put': '📥',
  'open': '📭',
  'turn': '🔄',
  'come': '🫳',
  'sit': '🪑',
  'read': '📖',
  'feel': '💭',
  'watch': '📺',
  'listen': '🎵',
  'show me': '👁️',

  // Nouns
  'bathroom': '🚽',
  'water': '💧',
  'outside': '🌳',
  'home': '🏠',
  'school': '🏫',
  'book': '📚',
  'toy': '🧸',
  'food': '🍎',
  'bed': '🛏️',
  'TV': '📺',

  // Descriptors
  'big': '⬆️',
  'little': '⬇️',
  'hot': '🔥',
  'cold': '🧊',
  'good': '😊',
  'bad': '😞',
  'mine': '🙋',
  'up': '⬆️',
  'down': '⬇️',

  // Social
  'hi': '👋',
  'bye': '👋',
  'please': '🙏',
  'thank you': '🙏',
  'sorry': '😔',
  'my turn': '🙋',
  'your turn': '👉',
  'look!': '👀',
  'I love': '❤️',
  'I love you': '💕',

  // Questions
  'what': '❓',
  'where': '📍',
  'who': '👤',
  'when': '🕐',
  'why': '🤔',
  'how': '💡',
  'where is': '🔍',
  'are we there': '🗺️',

  // Urgent / Feelings
  'hurt': '🤕',
  'scared': '😨',
  'angry': '😠',
  'happy': '😊',
  'sad': '😢',
  'tired': '😴',
  'not yet': '⏳',
  'wait': '⏳',
  'too loud': '🔊',
  'need break': '🧘',
  'frustrated': '😤',
  'excited': '🎉',
  'sick': '🤒',
  'need help': '🆘',
  'too bright': '☀️',
  "don't touch": '🚫',

  // Food related
  'hungry': '🍽️',
  'thirsty': '💧',
  'yucky': '🤢',
  'yummy': '😋',
  'more please': '🙏',
  'all done eating': '✅',

  // Activity related
  'fun': '🎉',
  'again': '🔄',
  'miss you': '💙',
  'come here': '🫳',
  'go to': '➡️',
  'go home': '🏠',
  'where are we': '📍',

  // Interest related
  'tell me about': '💬',

  // Transition
  '5 more minutes': '⏰',
};

export function WordButton({ word, size, onPress, onLongPress }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgColor = COLOR_HEX[word.colorCode];
  const symbol = WORD_SYMBOLS[word.label];

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 40, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    onPress?.(word);
  }, [word, onPress, scaleAnim]);

  const handleLongPress = useCallback(() => {
    onLongPress?.(word);
  }, [word, onLongPress]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: size,
            height: size,
            backgroundColor: bgColor,
          },
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.8}
      >
        {symbol && (
          <Text style={styles.symbol}>{symbol}</Text>
        )}
        <View style={styles.labelBg}>
          <Text style={styles.label} numberOfLines={2}>
            {word.label}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    overflow: 'hidden',
    // Subtle shadow for depth like the TD devices
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  symbol: {
    fontSize: 24,
    marginBottom: 2,
  },
  labelBg: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    position: 'absolute',
    bottom: 3,
    left: 2,
    right: 2,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1A1D26',
  },
});
