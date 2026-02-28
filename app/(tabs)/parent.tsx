import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../src/store';
import { getUsageStats } from '../../src/lib/db';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function ParentDashboard() {
  const router = useRouter();
  const { childProfile, boards, extractedData } = useAppStore();
  const [stats, setStats] = useState({ totalTaps: 0, uniqueWords: 0, recentWords: [] as string[] });

  useEffect(() => {
    if (childProfile) {
      getUsageStats(childProfile.id).then(setStats);
    }
  }, [childProfile]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Child info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {childProfile?.name ? `${childProfile.name}'s Dashboard` : 'Dashboard'}
        </Text>
        {childProfile?.age && (
          <Text style={styles.cardSubtitle}>Age {childProfile.age}</Text>
        )}
      </View>

      {/* Quick stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalTaps}</Text>
          <Text style={styles.statLabel}>Total taps</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.uniqueWords}</Text>
          <Text style={styles.statLabel}>Unique words</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{boards.length}</Text>
          <Text style={styles.statLabel}>Boards</Text>
        </View>
      </View>

      {/* Interests summary */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What we know</Text>
        {extractedData.foods.likes.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Favorite foods</Text>
            <Text style={styles.infoValue}>{extractedData.foods.likes.join(', ')}</Text>
          </View>
        )}
        {extractedData.activities.favorites.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Activities</Text>
            <Text style={styles.infoValue}>{extractedData.activities.favorites.join(', ')}</Text>
          </View>
        )}
        {extractedData.people.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>People</Text>
            <Text style={styles.infoValue}>
              {extractedData.people.map(p => `${p.name} (${p.role})`).join(', ')}
            </Text>
          </View>
        )}
        {extractedData.interests.topics.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Interests</Text>
            <Text style={styles.infoValue}>{extractedData.interests.topics.join(', ')}</Text>
          </View>
        )}
      </View>

      {/* Boards list */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Boards ({boards.length})</Text>
        {boards.map(board => (
          <View key={board.id} style={styles.boardRow}>
            <Text style={styles.boardName}>{board.name}</Text>
            <Text style={styles.boardInfo}>{board.words.length} words</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push('/onboarding/chat')}
      >
        <Text style={styles.actionButtonText}>Tell me more about {childProfile?.name ?? 'your child'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginTop: 2,
  },
  boardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceSecondary,
  },
  boardName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  boardInfo: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
});
