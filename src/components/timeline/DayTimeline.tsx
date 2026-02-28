import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import type { TimelineSegment } from '../../types';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface Props {
  segments: TimelineSegment[];
  onSegmentPress?: (segment: TimelineSegment) => void;
}

function getCurrentSegmentIndex(segments: TimelineSegment[]): number {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let i = 0; i < segments.length; i++) {
    const [startH, startM] = segments[i].startTime.split(':').map(Number);
    const [endH, endM] = segments[i].endTime.split(':').map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;
    if (currentMinutes >= start && currentMinutes < end) return i;
  }

  // Default to first segment
  return 0;
}

export function DayTimeline({ segments, onSegmentPress }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const currentIdx = getCurrentSegmentIndex(segments);
  const segmentWidth = 100;

  useEffect(() => {
    // Auto-scroll to current segment
    const offset = Math.max(0, currentIdx * segmentWidth - width / 2 + segmentWidth / 2);
    scrollRef.current?.scrollTo({ x: offset, animated: true });
  }, [currentIdx, width]);

  if (segments.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Today</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {segments.map((seg, i) => {
          const isCurrent = i === currentIdx;
          const isPast = i < currentIdx;
          return (
            <TouchableOpacity
              key={seg.id}
              style={[
                styles.segment,
                { backgroundColor: seg.color + (isCurrent ? 'FF' : isPast ? '40' : '80') },
                isCurrent && styles.segmentCurrent,
              ]}
              onPress={() => onSegmentPress?.(seg)}
            >
              <Text style={styles.segmentIcon}>{seg.icon}</Text>
              <Text style={[styles.segmentName, isCurrent && styles.segmentNameCurrent]} numberOfLines={1}>
                {seg.name}
              </Text>
              <Text style={styles.segmentTime}>
                {seg.startTime}
              </Text>
              {isCurrent && <View style={styles.currentDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.boardBorder,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scroll: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  segment: {
    width: 100,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  segmentCurrent: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    transform: [{ scale: 1.05 }],
  },
  segmentIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  segmentName: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.text,
  },
  segmentNameCurrent: {
    fontWeight: '800',
  },
  segmentTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  currentDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});
