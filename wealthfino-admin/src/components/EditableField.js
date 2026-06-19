import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';

/**
 * A labelled, editable field with optional multiline support.
 * Shows an "Edit" chip while viewing and collapses to view-mode on blur.
 */
export default function EditableField({
  label,
  value,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
  placeholder = '',
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={String(value ?? '')}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholder={placeholder || `Enter ${label}`}
        placeholderTextColor={Colors.textPlaceholder}
        textAlignVertical={multiline ? 'top' : 'center'}
        selectionColor={Colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
  },
  multiline: {
    minHeight: 90,
    paddingTop: 12,
  },
});
