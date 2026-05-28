import React, { useEffect, useState } from 'react';
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

import { fetchClientConsent, updateClientConsent } from '../services/api';
import { Colors } from '../theme/colors';
import EditableField from '../components/EditableField';
import SaveBar from '../components/SaveBar';
import { LoadingScreen, ErrorScreen } from '../components/StateScreens';

const clone = (obj) => JSON.parse(JSON.stringify(obj));
const blankSection = () => ({ title: '', content: '' });

export default function ConsentScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['clientConsent'],
    queryFn: fetchClientConsent,
  });

  const [draft, setDraft] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data && !isDirty) setDraft(clone(data));
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateClientConsent,
    onSuccess: (updated) => {
      queryClient.setQueryData(['clientConsent'], updated);
      setIsDirty(false);
      Toast.show({ type: 'success', text1: 'Saved!', text2: 'Client consent updated.' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Save failed', text2: err.message });
    },
  });

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

  const setHeader = (v) => {
    setDraft((d) => ({ ...clone(d), headerText: v }));
    mark();
  };

  const setSectionField = (idx, field, value) => {
    setDraft((d) => {
      const next = clone(d);
      next.sections[idx][field] = value;
      return next;
    });
    mark();
  };

  const addSection = () => {
    setDraft((d) => {
      const next = clone(d);
      next.sections.push(blankSection());
      return next;
    });
    mark();
  };

  const removeSection = (idx) => {
    confirm('Remove Section', 'Delete this consent section?', () => {
      setDraft((d) => {
        const next = clone(d);
        next.sections.splice(idx, 1);
        return next;
      });
      mark();
    });
  };

  const moveSection = (idx, dir) => {
    setDraft((d) => {
      const next = clone(d);
      const target = idx + dir;
      if (target < 0 || target >= next.sections.length) return next;
      [next.sections[idx], next.sections[target]] = [next.sections[target], next.sections[idx]];
      return next;
    });
    mark();
  };

  const handleSave = () => {
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

  if (isLoading || !draft) return <LoadingScreen message="Fetching consent data…" />;
  if (isError) return <ErrorScreen message={error?.message} onRetry={refetch} />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconText}>📄</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Client Consent</Text>
            <Text style={styles.headerSub}>{draft.sections?.length ?? 0} Sections</Text>
          </View>
        </View>
        {isDirty && <View style={styles.dirtyBadge}><Text style={styles.dirtyText}>Unsaved</Text></View>}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Text */}
        <View style={styles.topCard}>
          <Text style={styles.sectionLabel}>Header Declaration</Text>
          <EditableField
            label="Header Text"
            value={draft.headerText}
            onChangeText={setHeader}
            multiline
            placeholder="SEBI registration & disclosure statement…"
          />
        </View>

        {/* Sections */}
        <Text style={styles.groupTitle}>Consent Sections</Text>
        {draft.sections.map((section, idx) => (
          <View key={idx} style={styles.sectionCard}>
            {/* Section Controls */}
            <View style={styles.sectionTop}>
              <View style={styles.sectionNumBadge}>
                <Text style={styles.sectionNumText}>§{idx + 1}</Text>
              </View>
              <View style={styles.sectionActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => moveSection(idx, -1)}
                  disabled={idx === 0}
                >
                  <Text style={[styles.actionBtnText, idx === 0 && styles.disabled]}>↑</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => moveSection(idx, 1)}
                  disabled={idx === draft.sections.length - 1}
                >
                  <Text style={[styles.actionBtnText, idx === draft.sections.length - 1 && styles.disabled]}>↓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => removeSection(idx)}
                >
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            <EditableField
              label="Section Title"
              value={section.title}
              onChangeText={(v) => setSectionField(idx, 'title', v)}
              placeholder="e.g. 1. Acceptance of MITC & Terms…"
            />
            <EditableField
              label="Content (HTML allowed)"
              value={section.content}
              onChangeText={(v) => setSectionField(idx, 'content', v)}
              multiline
              placeholder="<p>Section body text…</p>"
            />
          </View>
        ))}

        {/* Add Section */}
        <TouchableOpacity style={styles.addBtn} onPress={addSection} activeOpacity={0.7}>
          <Text style={styles.addBtnText}>+ Add New Section</Text>
        </TouchableOpacity>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryDim,
  },
  iconText: { fontSize: 20 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: 11, color: Colors.textSecondary, letterSpacing: 0.5 },
  dirtyBadge: {
    backgroundColor: Colors.warning + '22',
    borderWidth: 1,
    borderColor: Colors.warning,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dirtyText: { color: Colors.warning, fontSize: 11, fontWeight: '700' },

  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 40 },

  topCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 12,
  },
  sectionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionNumBadge: {
    backgroundColor: Colors.primaryGlow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sectionNumText: { color: Colors.accent, fontWeight: '800', fontSize: 13 },
  sectionActions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: { color: Colors.textSecondary, fontSize: 16, fontWeight: '700' },
  disabled: { color: Colors.textPlaceholder },
  deleteBtn: {
    backgroundColor: Colors.error + '18',
    borderColor: Colors.error + '40',
  },
  deleteBtnText: { color: Colors.error, fontSize: 14, fontWeight: '700' },

  addBtn: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryDim,
    borderStyle: 'dashed',
    alignItems: 'center',
    backgroundColor: Colors.primaryGlow,
  },
  addBtnText: { color: Colors.accent, fontWeight: '700', fontSize: 14 },
});
