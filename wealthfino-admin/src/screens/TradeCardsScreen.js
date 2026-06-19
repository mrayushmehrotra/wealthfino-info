import React, { useState } from 'react';
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

import { fetchTradeCards, createTradeCard, updateTradeCard, deleteTradeCard } from '../services/api';
import { Colors } from '../theme/colors';
import EditableField from '../components/EditableField';
import { LoadingScreen, ErrorScreen } from '../components/StateScreens';

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const blankCard = () => ({
  badge: '',
  tag: 'NEW TRADE',
  name: '',
  logo: '',
  date: '',
  dateEnd: '',
  entry: '',
  sl: '',
  exit: '',
  target: '',
  updates: [],
  segment: 'Index Options',
  status: 'Active',
});

const SEGMENTS = ['Stock Options', 'Index Options', 'Equity', 'Commodity', 'Futures'];
const STATUSES = ['Active', 'Target Achieved', 'Stop Loss', 'Profit Booked'];

export default function TradeCardsScreen() {
  const queryClient = useQueryClient();
  const { data: cards = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['tradeCards'],
    queryFn: fetchTradeCards,
  });

  const [edits, setEdits] = useState({});
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCard, setNewCard] = useState(blankCard());

  const confirm = (title, message, onConfirm) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    } else {
      Alert.alert(title, message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onConfirm },
      ]);
    }
  };

  const createMutation = useMutation({
    mutationFn: createTradeCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tradeCards'] });
      setShowNewForm(false);
      setNewCard(blankCard());
      Toast.show({ type: 'success', text1: 'Created', text2: 'New trade card added.' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Create failed', text2: err.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTradeCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tradeCards'] });
      setEdits({});
      Toast.show({ type: 'success', text1: 'Saved', text2: 'Trade card updated.' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Save failed', text2: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTradeCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tradeCards'] });
      Toast.show({ type: 'success', text1: 'Deleted', text2: 'Trade card removed.' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Delete failed', text2: err.message });
    },
  });

  const setEditField = (id, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const getVal = (card, field) => {
    if (edits[card._id] && edits[card._id][field] !== undefined) {
      return edits[card._id][field];
    }
    return card[field];
  };

  const handleSave = (card) => {
    const patch = edits[card._id];
    if (!patch) return;
    const payload = { ...patch };
    updateMutation.mutate({ id: card._id, ...payload });
  };

  const handleDelete = (card) => {
    confirm('Delete Card', `Delete "${card.name}"? This cannot be undone.`, () => {
      deleteMutation.mutate(card._id);
    });
  };

  const handleCreate = () => {
    const payload = clone(newCard);
    payload.updates = payload.updates.filter(Boolean);
    createMutation.mutate(payload);
  };

  const setNewField = (field, value) => {
    setNewCard((prev) => ({ ...prev, [field]: value }));
  };

  const setNewUpdates = (text) => {
    setNewField('updates', text.split('\n').filter(Boolean));
  };

  const hasEdit = (card) => {
    const patch = edits[card._id];
    return patch && Object.keys(patch).length > 0;
  };

  // ─── Chip selector ─────────────────────────────────────────
  const ChipRow = ({ label, options, value, onSelect, disabled }) => (
    <View style={styles.chipSection}>
      <Text style={styles.chipLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, value === opt && styles.chipActive, disabled && styles.chipDisabled]}
            onPress={() => onSelect(opt)}
            disabled={disabled}
          >
            <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCard = (card) => {
    const saving = updateMutation.isPending;
    return (
      <View key={card._id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{card.name || 'Untitled Card'}</Text>
          <TouchableOpacity onPress={() => handleDelete(card)} style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <EditableField
              label="Badge"
              value={getVal(card, 'badge')}
              onChangeText={(v) => setEditField(card._id, 'badge', v)}
            />
          </View>
          <View style={styles.fieldHalf}>
            <EditableField
              label="Tag"
              value={getVal(card, 'tag')}
              onChangeText={(v) => setEditField(card._id, 'tag', v)}
            />
          </View>
        </View>

        <EditableField
          label="Trade Name"
          value={getVal(card, 'name')}
          onChangeText={(v) => setEditField(card._id, 'name', v)}
        />

        <EditableField
          label="Logo URL"
          value={getVal(card, 'logo')}
          onChangeText={(v) => setEditField(card._id, 'logo', v)}
        />

        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <EditableField
              label="Start Date"
              value={getVal(card, 'date')}
              onChangeText={(v) => setEditField(card._id, 'date', v)}
            />
          </View>
          <View style={styles.fieldHalf}>
            <EditableField
              label="End Date"
              value={getVal(card, 'dateEnd')}
              onChangeText={(v) => setEditField(card._id, 'dateEnd', v)}
            />
          </View>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <EditableField
              label="Entry"
              value={getVal(card, 'entry')}
              onChangeText={(v) => setEditField(card._id, 'entry', v)}
            />
          </View>
          <View style={styles.fieldHalf}>
            <EditableField
              label="Stop Loss"
              value={getVal(card, 'sl')}
              onChangeText={(v) => setEditField(card._id, 'sl', v)}
            />
          </View>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.fieldHalf}>
            <EditableField
              label="Exit"
              value={getVal(card, 'exit')}
              onChangeText={(v) => setEditField(card._id, 'exit', v)}
            />
          </View>
          <View style={styles.fieldHalf}>
            <EditableField
              label="Target"
              value={getVal(card, 'target')}
              onChangeText={(v) => setEditField(card._id, 'target', v)}
            />
          </View>
        </View>

        <ChipRow
          label="Segment"
          options={SEGMENTS}
          value={getVal(card, 'segment')}
          onSelect={(v) => setEditField(card._id, 'segment', v)}
          disabled={saving}
        />

        <ChipRow
          label="Status"
          options={STATUSES}
          value={getVal(card, 'status')}
          onSelect={(v) => setEditField(card._id, 'status', v)}
          disabled={saving}
        />

        <EditableField
          label="Updates (one per line)"
          value={(getVal(card, 'updates') || []).join('\n')}
          onChangeText={(v) => setEditField(card._id, 'updates', v.split('\n').filter(Boolean))}
          multiline
        />

        {hasEdit(card) && (
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={() => handleSave(card)}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Card'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading) return <LoadingScreen message="Fetching trade cards…" />;
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
            <Text style={styles.iconText}>TC</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Trade Cards</Text>
            <Text style={styles.headerSub}>{cards.length} card{cards.length !== 1 ? 's' : ''} on file</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* New Card Form */}
        {showNewForm && (
          <View style={styles.newCardSection}>
            <Text style={styles.sectionLabel}>New Trade Card</Text>

            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <EditableField label="Badge" value={newCard.badge} onChangeText={(v) => setNewField('badge', v)} />
              </View>
              <View style={styles.fieldHalf}>
                <EditableField label="Tag" value={newCard.tag} onChangeText={(v) => setNewField('tag', v)} />
              </View>
            </View>

            <EditableField label="Trade Name" value={newCard.name} onChangeText={(v) => setNewField('name', v)} />
            <EditableField label="Logo URL" value={newCard.logo} onChangeText={(v) => setNewField('logo', v)} />

            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <EditableField label="Start Date" value={newCard.date} onChangeText={(v) => setNewField('date', v)} />
              </View>
              <View style={styles.fieldHalf}>
                <EditableField label="End Date" value={newCard.dateEnd} onChangeText={(v) => setNewField('dateEnd', v)} />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <EditableField label="Entry" value={newCard.entry} onChangeText={(v) => setNewField('entry', v)} />
              </View>
              <View style={styles.fieldHalf}>
                <EditableField label="Stop Loss" value={newCard.sl} onChangeText={(v) => setNewField('sl', v)} />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <EditableField label="Exit" value={newCard.exit} onChangeText={(v) => setNewField('exit', v)} />
              </View>
              <View style={styles.fieldHalf}>
                <EditableField label="Target" value={newCard.target} onChangeText={(v) => setNewField('target', v)} />
              </View>
            </View>

            <ChipRow
              label="Segment"
              options={SEGMENTS}
              value={newCard.segment}
              onSelect={(v) => setNewField('segment', v)}
            />

            <ChipRow
              label="Status"
              options={STATUSES}
              value={newCard.status}
              onSelect={(v) => setNewField('status', v)}
            />

            <EditableField
              label="Updates (one per line)"
              value={newCard.updates.join('\n')}
              onChangeText={setNewUpdates}
              multiline
            />

            <View style={styles.newCardActions}>
              <TouchableOpacity
                style={[styles.createBtn, createMutation.isPending && styles.saveBtnDisabled]}
                onPress={handleCreate}
                disabled={createMutation.isPending}
              >
                <Text style={styles.createBtnText}>
                  {createMutation.isPending ? 'Creating…' : 'Create Card'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowNewForm(false); setNewCard(blankCard()); }}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Existing Cards */}
        {cards.map(renderCard)}

        {/* Add New Button */}
        {!showNewForm && (
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowNewForm(true)}>
            <Text style={styles.addBtnText}>+ Add New Trade Card</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  deleteBtn: {
    backgroundColor: Colors.error + '18',
    borderWidth: 1,
    borderColor: Colors.error + '40',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  deleteBtnText: {
    color: Colors.error,
    fontSize: 11,
    fontWeight: '700',
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldHalf: {
    flex: 1,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.primaryDim,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  addBtn: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryDim,
    borderStyle: 'dashed',
    paddingVertical: 18,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  newCardSection: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primaryDim,
    padding: 14,
    marginBottom: 14,
  },
  newCardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  createBtn: {
    flex: 2,
    backgroundColor: Colors.success,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  chipSection: {
    marginBottom: 12,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primaryGlow,
    borderColor: Colors.primary,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
