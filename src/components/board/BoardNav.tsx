import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import type { Board } from '../../types';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

const BOARD_ICONS: Record<string, string> = {
  core: '⭐',
  mealtime: '🍽️',
  activity: '⚡',
  people: '👥',
  feelings: '💛',
  interests: '🎯',
  location: '📍',
  routine: '🔄',
  custom: '✏️',
};

interface Props {
  boards: Board[];
  activeBoard: Board | null;
  onSelect: (board: Board) => void;
  onShowWeek?: () => void;
}

export function BoardNav({ boards, activeBoard, onSelect, onShowWeek }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {boards.map(board => {
          const isActive = board.id === activeBoard?.id;
          const icon = BOARD_ICONS[board.type] ?? '📋';
          return (
            <TouchableOpacity
              key={board.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onSelect(board)}
            >
              <Text style={styles.navIcon}>{icon}</Text>
              <Text
                style={[styles.navLabel, isActive && styles.navLabelActive]}
                numberOfLines={2}
              >
                {board.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Week view shortcut */}
        {onShowWeek && (
          <TouchableOpacity style={styles.navItem} onPress={onShowWeek}>
            <Text style={styles.navIcon}>📅</Text>
            <Text style={styles.navLabel}>Week</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 72,
    backgroundColor: '#2D3142',
    paddingTop: SPACING.sm,
  },
  scroll: {
    gap: 2,
    paddingBottom: SPACING.lg,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginHorizontal: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  navLabelActive: {
    color: '#FFFFFF',
  },
});
