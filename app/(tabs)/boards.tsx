import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { MessageBar } from '../../src/components/board/MessageBar';
import { CoreStrip } from '../../src/components/board/CoreStrip';
import { BoardGrid } from '../../src/components/board/BoardGrid';
import { BoardNav } from '../../src/components/board/BoardNav';
import { DayTimeline } from '../../src/components/timeline/DayTimeline';
import { WeekTimeline } from '../../src/components/timeline/WeekTimeline';
import { FirstThenBoard } from '../../src/components/board/FirstThenBoard';
import { useAppStore } from '../../src/store';
import { logWordUsage } from '../../src/lib/db';
import { speak } from '../../src/lib/tts';
import type { VocabWord, TimelineSegment } from '../../src/types';
import { COLORS } from '../../src/constants/theme';

export default function BoardsScreen() {
  const { boards, activeBoard, setActiveBoard, timeline, childProfile } = useAppStore();
  const [sentence, setSentence] = useState<string[]>([]);
  const [showWeek, setShowWeek] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const handleWordPress = useCallback((word: VocabWord) => {
    // Add to sentence builder
    setSentence(prev => [...prev, word.label]);

    // Speak the individual word immediately
    speak(word.label);

    // Log usage
    if (childProfile && activeBoard) {
      logWordUsage({
        id: `log-${Date.now()}`,
        childId: childProfile.id,
        wordId: word.id,
        boardId: activeBoard.id,
        timestamp: new Date().toISOString(),
      });
    }
  }, [childProfile, activeBoard]);

  const handleLongPress = useCallback((word: VocabWord) => {
    // Emphatic speech on long press
    speak(word.label, { emphatic: true });
    setSentence(prev => [...prev, word.label.toUpperCase()]);
  }, []);

  const handleTimelinePress = useCallback((segment: TimelineSegment) => {
    if (segment.boardId) {
      const board = boards.find(b => b.id === segment.boardId);
      if (board) setActiveBoard(board);
    }
  }, [boards]);

  return (
    <View style={styles.container}>
      {/* Message bar at top — like TD devices */}
      <MessageBar
        words={sentence}
        onClear={() => setSentence([])}
        onDeleteLast={() => setSentence(prev => prev.slice(0, -1))}
      />

      {/* Day timeline strip */}
      <DayTimeline segments={timeline} onSegmentPress={handleTimelinePress} />

      {/* Main content area: sidebar nav + board grid */}
      <View style={styles.mainArea}>
        {/* Left navigation sidebar — like TD Navio */}
        <BoardNav
          boards={boards}
          activeBoard={activeBoard}
          onSelect={setActiveBoard}
          onShowWeek={() => setShowWeek(true)}
        />

        {/* Board + core strip */}
        <View style={styles.boardArea}>
          {/* Core strip — always visible */}
          <CoreStrip onWordPress={handleWordPress} />

          {/* Board grid */}
          <ScrollView style={styles.boardScroll}>
            {activeBoard && (
              <BoardGrid
                board={activeBoard}
                onWordPress={handleWordPress}
              />
            )}
          </ScrollView>
        </View>
      </View>

      {/* Week view modal */}
      <Modal visible={showWeek} animationType="slide" onRequestClose={() => setShowWeek(false)}>
        <View style={styles.modalContainer}>
          <WeekTimeline segments={timeline} onSegmentPress={(seg) => {
            handleTimelinePress(seg);
            setShowWeek(false);
          }} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
  },
  boardArea: {
    flex: 1,
  },
  boardScroll: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
});
