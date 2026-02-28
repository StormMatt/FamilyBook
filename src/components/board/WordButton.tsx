import React, { useCallback, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { COLOR_HEX } from '../../constants/vocabulary';
import { speak } from '../../lib/tts';
import type { VocabWord } from '../../types';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface Props {
  word: VocabWord;
  size: number;
  onPress?: (word: VocabWord) => void;
  onLongPress?: (word: VocabWord) => void;
}

export function WordButton({ word, size, onPress, onLongPress }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgColor = COLOR_HEX[word.colorCode];

  const handlePress = useCallback(() => {
    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 50, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    speak(word.label);
    onPress?.(word);
  }, [word, onPress, scaleAnim]);

  const handleLongPress = useCallback(() => {
    // Emphatic speech on long press
    speak(word.label, { emphatic: true });
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
            backgroundColor: bgColor + '20', // 12% opacity background
            borderColor: bgColor,
          },
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.7}
      >
        {word.imageUri ? (
          // TODO: Add image support
          <Text style={[styles.label, { color: bgColor }]} numberOfLines={2}>
            {word.label}
          </Text>
        ) : (
          <Text style={[styles.label, { color: bgColor }]} numberOfLines={2}>
            {word.label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
    margin: 2,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    textAlign: 'center',
  },
});
