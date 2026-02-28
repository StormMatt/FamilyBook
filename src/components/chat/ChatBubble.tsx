import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import type { ChatMessage } from '../../types';

interface Props {
  message: ChatMessage;
}

export function ChatBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.text, isUser && styles.textUser]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  bubbleAI: {
    backgroundColor: COLORS.chatBubbleAI,
    borderTopLeftRadius: RADIUS.sm,
  },
  bubbleUser: {
    backgroundColor: COLORS.chatBubbleUser,
    borderTopRightRadius: RADIUS.sm,
  },
  text: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    color: COLORS.text,
  },
  textUser: {
    color: COLORS.textOnPrimary,
  },
});
