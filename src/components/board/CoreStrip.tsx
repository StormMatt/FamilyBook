import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { WordButton } from './WordButton';
import { CORE_STRIP } from '../../constants/vocabulary';
import { COLORS, SPACING } from '../../constants/theme';
import type { VocabWord } from '../../types';

interface Props {
  onWordPress?: (word: VocabWord) => void;
}

export function CoreStrip({ onWordPress }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {CORE_STRIP.map(word => (
          <WordButton
            key={word.id}
            word={word}
            size={64}
            onPress={onWordPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.coreStripBg,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.boardBorder,
  },
  scroll: {
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
});
