import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { speak } from '../../lib/tts';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface Props {
  words: string[];
  onClear: () => void;
  onDeleteLast: () => void;
}

export function MessageBar({ words, onClear, onDeleteLast }: Props) {
  const sentence = words.join(' ');

  const handleSpeak = () => {
    if (sentence) {
      speak(sentence);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
        <Ionicons name="volume-high" size={22} color={COLORS.textOnPrimary} />
        <Text style={styles.speakLabel}>Speak</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        style={styles.messageArea}
        contentContainerStyle={styles.messageContent}
        showsHorizontalScrollIndicator={false}
      >
        {words.length > 0 ? (
          words.map((word, i) => (
            <View key={i} style={styles.wordChip}>
              <Text style={styles.wordChipText}>{word}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.placeholder}>Tap words to build a sentence...</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.iconButton} onPress={onDeleteLast}>
        <Ionicons name="backspace-outline" size={22} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={onClear}>
        <Ionicons name="close-circle" size={20} color={COLORS.textOnPrimary} />
        <Text style={styles.clearLabel}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.boardBorder,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    minHeight: 56,
    gap: SPACING.xs,
  },
  speakButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
  },
  speakLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
    marginTop: 2,
  },
  messageArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    minHeight: 44,
  },
  messageContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  wordChip: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.boardBorder,
  },
  wordChipText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  iconButton: {
    padding: SPACING.xs,
  },
  clearButton: {
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  },
  clearLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
    marginTop: 2,
  },
});
