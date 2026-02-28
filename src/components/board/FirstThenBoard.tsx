import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { speak } from '../../lib/tts';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';

interface Props {
  firstActivity: { name: string; icon: string };
  thenActivity: { name: string; icon: string };
  onDismiss?: () => void;
}

export function FirstThenBoard({ firstActivity, thenActivity, onDismiss }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Transition</Text>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn}>
            <Text style={styles.dismissText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.board}>
        {/* First */}
        <TouchableOpacity
          style={styles.panel}
          onPress={() => speak(`First, ${firstActivity.name}`)}
        >
          <View style={styles.panelHeader}>
            <Text style={styles.panelLabel}>First</Text>
          </View>
          <View style={styles.panelContent}>
            <Text style={styles.panelIcon}>{firstActivity.icon}</Text>
            <Text style={styles.panelName}>{firstActivity.name}</Text>
          </View>
        </TouchableOpacity>

        {/* Arrow */}
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>➡️</Text>
        </View>

        {/* Then */}
        <TouchableOpacity
          style={styles.panel}
          onPress={() => speak(`Then, ${thenActivity.name}`)}
        >
          <View style={[styles.panelHeader, styles.thenHeader]}>
            <Text style={styles.panelLabel}>Then</Text>
          </View>
          <View style={styles.panelContent}>
            <Text style={styles.panelIcon}>{thenActivity.icon}</Text>
            <Text style={styles.panelName}>{thenActivity.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    margin: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceSecondary,
  },
  headerText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  dismissBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  dismissText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
  board: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  panel: {
    flex: 1,
    borderWidth: 3,
    borderColor: COLORS.boardBorder,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  panelHeader: {
    backgroundColor: '#4FC3F7',
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  thenHeader: {
    backgroundColor: '#AED581',
  },
  panelLabel: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    color: COLORS.textOnPrimary,
  },
  panelContent: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  panelIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  panelName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  arrow: {
    paddingHorizontal: SPACING.sm,
  },
  arrowText: {
    fontSize: 32,
  },
});
