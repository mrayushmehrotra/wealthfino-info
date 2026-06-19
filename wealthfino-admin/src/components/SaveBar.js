import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

/**
 * A horizontal pill-shaped save/cancel bar that floats above the keyboard.
 */
export default function SaveBar({ onSave, onDiscard, isSaving }) {
  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.discard} onPress={onDiscard} activeOpacity={0.7}>
        <Text style={styles.discardText}>Discard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.save, isSaving && styles.saving]}
        onPress={onSave}
        activeOpacity={0.8}
        disabled={isSaving}
      >
        <Text style={styles.saveText}>{isSaving ? 'Saving…' : 'Save Changes'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
  },
  discard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  discardText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  save: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  saving: {
    backgroundColor: Colors.primaryDim,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
