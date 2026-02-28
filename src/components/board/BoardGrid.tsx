import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { WordButton } from './WordButton';
import type { Board, VocabWord } from '../../types';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

interface Props {
  board: Board;
  onWordPress?: (word: VocabWord) => void;
}

export function BoardGrid({ board, onWordPress }: Props) {
  const { width } = useWindowDimensions();
  const padding = SPACING.sm * 2;
  const gap = 4;
  const availableWidth = width - padding;
  const cellSize = Math.floor((availableWidth - (gap * (board.gridColumns - 1))) / board.gridColumns);

  return (
    <View style={styles.container}>
      <Text style={styles.boardName}>{board.name}</Text>
      <View style={styles.grid}>
        {board.words.map(word => (
          <WordButton
            key={word.id}
            word={word}
            size={cellSize}
            onPress={onWordPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.sm,
  },
  boardName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
