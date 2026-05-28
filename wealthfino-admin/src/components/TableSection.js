import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

/**
 * Collapsible card for a table section (currentMonth / monthlyTrend / annualTrend).
 * Each row renders using the provided `rowRenderer` function.
 */
export default function TableSection({ title, rows = [], rowRenderer, onAddRow }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setCollapsed((c) => !c)}
        activeOpacity={0.7}
      >
        <View style={styles.titleRow}>
          <View style={styles.dot} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.chevron}>{collapsed ? '▶' : '▼'}</Text>
      </TouchableOpacity>

      {!collapsed && (
        <View style={styles.body}>
          {rows.map((row, idx) => (
            <View key={idx} style={[styles.row, idx < rows.length - 1 && styles.rowDivider]}>
              <Text style={styles.rowIndex}>#{idx + 1}</Text>
              {rowRenderer(row, idx)}
            </View>
          ))}
          {onAddRow && (
            <TouchableOpacity style={styles.addBtn} onPress={onAddRow} activeOpacity={0.7}>
              <Text style={styles.addBtnText}>+ Add Row</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.bgElevated,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  title: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  chevron: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    paddingTop: 6,
  },
  row: {
    paddingVertical: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowIndex: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  addBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryDim,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.accent,
    fontWeight: '600',
    fontSize: 13,
  },
});
