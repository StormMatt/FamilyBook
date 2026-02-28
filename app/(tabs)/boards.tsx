import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CoreStrip } from '../../src/components/board/CoreStrip';
import { BoardGrid } from '../../src/components/board/BoardGrid';
import { BoardSelector } from '../../src/components/board/BoardSelector';
import { DayTimeline } from '../../src/components/timeline/DayTimeline';
import { useAppStore } from '../../src/store';
import { logWordUsage } from '../../src/lib/db';
import type { VocabWord, TimelineSegment, Board } from '../../src/types';
import { COLORS } from '../../src/constants/theme';

export default function BoardsScreen() {
  const { boards, activeBoard, setActiveBoard, timeline, childProfile } = useAppStore();

  const handleWordPress = useCallback((word: VocabWord) => {
    if (!childProfile || !activeBoard) return;
    logWordUsage({
      id: `log-${Date.now()}`,
      childId: childProfile.id,
      wordId: word.id,
      boardId: activeBoard.id,
      timestamp: new Date().toISOString(),
    });
  }, [childProfile, activeBoard]);

  const handleTimelinePress = useCallback((segment: TimelineSegment) => {
    // Switch to the board associated with this timeline segment
    if (segment.boardId) {
      const board = boards.find(b => b.id === segment.boardId);
      if (board) setActiveBoard(board);
    }
  }, [boards]);

  return (
    <View style={styles.container}>
      {/* Core strip — always visible */}
      <CoreStrip onWordPress={handleWordPress} />

      {/* Day timeline */}
      <DayTimeline segments={timeline} onSegmentPress={handleTimelinePress} />

      {/* Board selector tabs */}
      <BoardSelector boards={boards} activeBoard={activeBoard} onSelect={setActiveBoard} />

      {/* Board grid */}
      <ScrollView style={styles.boardArea}>
        {activeBoard && (
          <BoardGrid board={activeBoard} onWordPress={handleWordPress} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  boardArea: {
    flex: 1,
  },
});
