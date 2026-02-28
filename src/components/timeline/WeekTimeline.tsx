import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import type { TimelineSegment } from '../../types';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_COLORS = ['#FF8A65', '#4FC3F7', '#AED581', '#FFD54F', '#CE93D8', '#4DB6AC', '#FF8A65'];

interface Props {
  segments: TimelineSegment[];
  onSegmentPress?: (segment: TimelineSegment) => void;
}

function getTodayIndex(): number {
  return new Date().getDay(); // 0=Sun, 1=Mon, etc.
}

export function WeekTimeline({ segments, onSegmentPress }: Props) {
  const todayIdx = getTodayIndex();

  // Group segments by day type
  const weekdaySegments = segments.filter(s => s.dayType === 'weekday' || s.dayType === 'both');
  const weekendSegments = segments.filter(s => s.dayType === 'weekend' || s.dayType === 'both');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>This Week</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.grid}>
          {/* Day headers */}
          <View style={styles.headerRow}>
            {DAYS.map((day, i) => (
              <View
                key={day}
                style={[
                  styles.dayHeader,
                  { backgroundColor: DAY_COLORS[i] },
                  i === todayIdx && styles.todayHeader,
                ]}
              >
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Activity cells */}
          <View style={styles.bodyRow}>
            {DAYS.map((_, dayIdx) => {
              const isWeekend = dayIdx === 0 || dayIdx === 6;
              const daySegments = isWeekend ? weekendSegments : weekdaySegments;
              const isToday = dayIdx === todayIdx;

              return (
                <View
                  key={dayIdx}
                  style={[styles.dayColumn, isToday && styles.todayColumn]}
                >
                  {daySegments.map(seg => (
                    <TouchableOpacity
                      key={seg.id}
                      style={[styles.activityCell, { backgroundColor: seg.color + '30' }]}
                      onPress={() => onSegmentPress?.(seg)}
                    >
                      <Text style={styles.activityIcon}>{seg.icon}</Text>
                      <Text style={styles.activityName} numberOfLines={2}>
                        {seg.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const COL_WIDTH = 90;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  grid: {},
  headerRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 2,
  },
  dayHeader: {
    width: COL_WIDTH,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  todayHeader: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  dayHeaderText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
    textTransform: 'uppercase',
  },
  bodyRow: {
    flexDirection: 'row',
    gap: 2,
  },
  dayColumn: {
    width: COL_WIDTH,
    gap: 2,
  },
  todayColumn: {
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 1,
    paddingBottom: 2,
  },
  activityCell: {
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  activityIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  activityName: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
