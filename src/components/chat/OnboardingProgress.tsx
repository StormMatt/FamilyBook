import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import type { OnboardingCategory } from '../../types';

const CATEGORIES: { key: OnboardingCategory; label: string; icon: string }[] = [
  { key: 'eat', label: 'Eat', icon: '🍽️' },
  { key: 'do', label: 'Do', icon: '⚡' },
  { key: 'see', label: 'See', icon: '👀' },
  { key: 'hear', label: 'Hear', icon: '👂' },
  { key: 'feel', label: 'Feel', icon: '💛' },
];

interface Props {
  current: OnboardingCategory;
  completed: OnboardingCategory[];
  onSkip?: () => void;
}

export function OnboardingProgress({ current, completed, onSkip }: Props) {
  if (current === 'welcome' || current === 'review' || current === 'photos') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.pills}>
        {CATEGORIES.map(cat => {
          const isActive = cat.key === current;
          const isDone = completed.includes(cat.key);
          return (
            <View
              key={cat.key}
              style={[
                styles.pill,
                isActive && styles.pillActive,
                isDone && styles.pillDone,
              ]}
            >
              <Text style={styles.pillIcon}>{cat.icon}</Text>
              <Text style={[
                styles.pillLabel,
                isActive && styles.pillLabelActive,
                isDone && styles.pillLabelDone,
              ]}>
                {cat.label}
              </Text>
            </View>
          );
        })}
      </View>
      {onSkip && (
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.boardBorder,
  },
  pills: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
  },
  pillDone: {
    backgroundColor: COLORS.success,
  },
  pillIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  pillLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  pillLabelActive: {
    color: COLORS.textOnPrimary,
  },
  pillLabelDone: {
    color: COLORS.textOnPrimary,
  },
  skipButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  skipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
