import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { fetchComplaints, updateComplaints } from '../services/api';
import { Colors } from '../theme/colors';
import EditableField from '../components/EditableField';
import TableSection from '../components/TableSection';
import SaveBar from '../components/SaveBar';
import { LoadingScreen, ErrorScreen } from '../components/StateScreens';

// ─── Default blank row shapes ──────────────────────────────────
const blankCurrentRow = () => ({
  id: Date.now(),
  receivedFrom: '',
  pendingLastMonth: 0,
  received: 0,
  resolved: 0,
  totalPending: 0,
});

const blankTrendRow = (isAnnual = false) => ({
  id: Date.now(),
  [isAnnual ? 'year' : 'month']: '',
  carriedForward: 0,
  received: 0,
  resolved: 0,
  pending: 0,
});

// ─── Deep clone helper ─────────────────────────────────────────
const clone = (obj) => JSON.parse(JSON.stringify(obj));

export default function ComplaintsScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['complaints'],
    queryFn: fetchComplaints,
  });

  const [draft, setDraft] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data && !isDirty) {
      setDraft(clone(data));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateComplaints,
    onSuccess: (updated) => {
      queryClient.setQueryData(['complaints'], updated);
      setIsDirty(false);
      Toast.show({ type: 'success', text1: 'Saved!', text2: 'Complaints data updated.' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Save failed', text2: err.message });
    },
  });

  // ─── Helpers ────────────────────────────────────────────────
  const mark = () => setIsDirty(true);

  /**
   * Cross-platform confirm dialog.
   * Alert.alert is a no-op on Expo Web, so we fall back to window.confirm().
   */
  const confirm = (title, message, onConfirm) => {
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    } else {
      Alert.alert(title, message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onConfirm },
      ]);
    }
  };

  const setField = (path, value) => {
    setDraft((d) => {
      const next = clone(d);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
    mark();
  };

  const setRowField = (section, idx, field, value) => {
    setDraft((d) => {
      const next = clone(d);
      next[section][idx][field] = value;
      return next;
    });
    mark();
  };

  const addRow = (section, blank) => {
    setDraft((d) => {
      const next = clone(d);
      next[section].push(blank());
      return next;
    });
    mark();
  };

  const removeRow = (section, idx) => {
    confirm('Remove Row', 'Delete this row?', () => {
      setDraft((d) => {
        const next = clone(d);
        next[section].splice(idx, 1);
        return next;
      });
      mark();
    });
  };

  const handleSave = () => {
    // Strip _id / __v from sub-docs to avoid mongoose conflicts
    const payload = clone(draft);
    delete payload._id;
    delete payload.__v;
    mutation.mutate(payload);
  };

  const handleDiscard = () => {
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      if (window.confirm('Discard Changes\n\nRevert all unsaved edits?')) {
        setDraft(clone(data));
        setIsDirty(false);
      }
    } else {
      Alert.alert('Discard Changes', 'Revert all unsaved edits?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            setDraft(clone(data));
            setIsDirty(false);
          },
        },
      ]);
    }
  };

  // ─── States ─────────────────────────────────────────────────
  if (isLoading || !draft) return <LoadingScreen message="Fetching complaints data…" />;
  if (isError) return <ErrorScreen message={error?.message} onRetry={refetch} />;

  // ─── Row renderers ──────────────────────────────────────────
  const renderCurrentRow = (row, idx) => (
    <View key={row.id || idx}>
      <EditableField
        label="Received From"
        value={row.receivedFrom}
        onChangeText={(v) => setRowField('currentMonth', idx, 'receivedFrom', v)}
      />
      <View style={styles.numRow}>
        {['pendingLastMonth', 'received', 'resolved', 'totalPending'].map((f) => (
          <View key={f} style={styles.numCell}>
            <EditableField
              label={f.replace(/([A-Z])/g, ' $1')}
              value={String(row[f])}
              onChangeText={(v) => setRowField('currentMonth', idx, f, Number(v) || 0)}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={() => removeRow('currentMonth', idx)} style={styles.removeBtn}>
        <Text style={styles.removeBtnText}>✕ Remove Row</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTrendRow = (section, isAnnual) => (row, idx) => (
    <View key={row.id || idx}>
      <EditableField
        label={isAnnual ? 'Year' : 'Month'}
        value={row[isAnnual ? 'year' : 'month']}
        onChangeText={(v) => setRowField(section, idx, isAnnual ? 'year' : 'month', v)}
      />
      <View style={styles.numRow}>
        {['carriedForward', 'received', 'resolved', 'pending'].map((f) => (
          <View key={f} style={styles.numCell}>
            <EditableField
              label={f.replace(/([A-Z])/g, ' $1')}
              value={String(row[f])}
              onChangeText={(v) => setRowField(section, idx, f, Number(v) || 0)}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={() => removeRow(section, idx)} style={styles.removeBtn}>
        <Text style={styles.removeBtnText}>✕ Remove Row</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconText}>CB</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Complaints Board</Text>
            <Text style={styles.headerSub}>Disclosure data only. Keep language factual and non-promotional.</Text>
          </View>
        </View>
        {isDirty && <View style={styles.dirtyBadge}><Text style={styles.dirtyText}>Unsaved</Text></View>}
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          This screen is for regulated disclosures and reporting fields. Avoid adding marketing copy, performance promises, or unverified claims.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Month Ending */}
        <View style={styles.topCard}>
          <Text style={styles.sectionLabel}>Reporting Period</Text>
          <EditableField
            label="Month Ending"
            value={draft.monthEnding}
            onChangeText={(v) => setField('monthEnding', v)}
            placeholder="e.g. May 2026"
          />
        </View>

        {/* Current Month */}
        <TableSection
          title="Current Month Data"
          rows={draft.currentMonth}
          rowRenderer={renderCurrentRow}
          onAddRow={() => addRow('currentMonth', blankCurrentRow)}
        />

        {/* Monthly Trend */}
        <TableSection
          title="Monthly Trend (Last 8 Months)"
          rows={draft.monthlyTrend}
          rowRenderer={renderTrendRow('monthlyTrend', false)}
          onAddRow={() => addRow('monthlyTrend', () => blankTrendRow(false))}
        />

        {/* Annual Trend */}
        <TableSection
          title="Annual Trend"
          rows={draft.annualTrend}
          rowRenderer={renderTrendRow('annualTrend', true)}
          onAddRow={() => addRow('annualTrend', () => blankTrendRow(true))}
        />
      </ScrollView>

      {isDirty && (
        <SaveBar
          onSave={handleSave}
          onDiscard={handleDiscard}
          isSaving={mutation.isPending}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryDim,
  },
  iconText: { fontSize: 13, fontWeight: '800', color: Colors.primary, letterSpacing: 0.8 },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  dirtyBadge: {
    backgroundColor: Colors.warning + '22',
    borderWidth: 1,
    borderColor: Colors.warning,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dirtyText: {
    color: Colors.warning,
    fontSize: 11,
    fontWeight: '700',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 40 },
  notice: {
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noticeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  topCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  numRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numCell: {
    flex: 1,
    minWidth: '45%',
  },
  removeBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: Colors.error + '18',
    borderWidth: 1,
    borderColor: Colors.error + '40',
    marginBottom: 4,
  },
  removeBtnText: {
    color: Colors.error,
    fontSize: 11,
    fontWeight: '600',
  },
});
