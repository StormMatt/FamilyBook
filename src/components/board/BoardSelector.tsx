import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { Board } from '../../types';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface Props {
  boards: Board[];
  activeBoard: Board | null;
  onSelect: (board: Board) => void;
}

export function BoardSelector({ boards, activeBoard, onSelect }: Props) {
  if (boards.length <= 1) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {boards.map(board => {
        const isActive = board.id === activeBoard?.id;
        return (
          <TouchableOpacity
            key={board.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onSelect(board)}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {board.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 44,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.boardBorder,
  },
  content: {
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.textOnPrimary,
  },
});
