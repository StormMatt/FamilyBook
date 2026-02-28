import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { DayTimeline } from '../../src/components/timeline/DayTimeline';
import { WeekTimeline } from '../../src/components/timeline/WeekTimeline';
import { FirstThenBoard } from '../../src/components/board/FirstThenBoard';
import { useAppStore } from '../../src/store';
import type { TimelineSegment } from '../../src/types';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function ScheduleScreen() {
  const { timeline } = useAppStore();
  const [view, setView] = useState<'day' | 'week'>('day');
  const [transition, setTransition] = useState<{
    first: { name: string; icon: string };
    then: { name: string; icon: string };
  } | null>(null);

  const handleSegmentPress = (segment: TimelineSegment) => {
    // Find the next segment for a First/Then preview
    const idx = timeline.findIndex(s => s.id === segment.id);
    if (idx >= 0 && idx < timeline.length - 1) {
      const next = timeline[idx + 1];
      setTransition({
        first: { name: segment.name, icon: segment.icon },
        then: { name: next.name, icon: next.icon },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* View toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'day' && styles.toggleActive]}
          onPress={() => setView('day')}
        >
          <Text style={[styles.toggleText, view === 'day' && styles.toggleTextActive]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'week' && styles.toggleActive]}
          onPress={() => setView('week')}
        >
          <Text style={[styles.toggleText, view === 'week' && styles.toggleTextActive]}>
            This Week
          </Text>
        </TouchableOpacity>
      </View>

      {/* First/Then transition board */}
      {transition && (
        <FirstThenBoard
          firstActivity={transition.first}
          thenActivity={transition.then}
          onDismiss={() => setTransition(null)}
        />
      )}

      {/* Timeline view */}
      {view === 'day' ? (
        <View style={styles.dayContainer}>
          <DayTimeline segments={timeline} onSegmentPress={handleSegmentPress} />
        </View>
      ) : (
        <WeekTimeline segments={timeline} onSegmentPress={handleSegmentPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  toggleRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.textOnPrimary,
  },
  dayContainer: {
    flex: 1,
  },
});
