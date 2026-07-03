import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { fetchContact, updateContact } from '../services/api';
import { Colors } from '../theme/colors';
import EditableField from '../components/EditableField';
import SaveBar from '../components/SaveBar';
import { LoadingScreen, ErrorScreen } from '../components/StateScreens';

const clone = (obj) => JSON.parse(JSON.stringify(obj));

export default function ContactScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['contact'],
    queryFn: fetchContact,
  });

  const [draft, setDraft] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data && !isDirty) setDraft(clone(data));
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateContact,
    onSuccess: (updated) => {
      queryClient.setQueryData(['contact'], updated);
      setIsDirty(false);
      Toast.show({ type: 'success', text1: 'Saved!', text2: 'Contact info updated.' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Save failed', text2: err.message });
    },
  });

  const mark = () => setIsDirty(true);

  const setField = (field, value) => {
    setDraft((d) => ({ ...clone(d), [field]: value }));
    mark();
  };

  const handleSave = () => {
    const payload = clone(draft);
    delete payload._id;
    delete payload.__v;
    mutation.mutate(payload);
  };

  const handleDiscard = () => {
    setDraft(clone(data));
    setIsDirty(false);
  };

  if (isLoading || !draft) return <LoadingScreen message="Fetching contact data…" />;
  if (isError) return <ErrorScreen message={error?.message} onRetry={refetch} />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconText}>CT</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Contact Info</Text>
            <Text style={styles.headerSub}>Phone, WhatsApp & Email displayed on the site.</Text>
          </View>
        </View>
        {isDirty && <View style={styles.dirtyBadge}><Text style={styles.dirtyText}>Unsaved</Text></View>}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <EditableField
            label="Phone Number"
            value={draft.phone}
            onChangeText={(v) => setField('phone', v)}
            keyboardType="phone-pad"
            placeholder="+91 9876543210"
          />
          <EditableField
            label="WhatsApp Number"
            value={draft.whatsapp}
            onChangeText={(v) => setField('whatsapp', v)}
            keyboardType="phone-pad"
            placeholder="+91 9876543210"
          />
          <EditableField
            label="Email Address"
            value={draft.email}
            onChangeText={(v) => setField('email', v)}
            keyboardType="email-address"
            placeholder="support@wealthfino.com"
          />
        </View>
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
    borderRadius: 14,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryDim,
  },
  iconText: { fontSize: 13, fontWeight: '800', color: Colors.primary, letterSpacing: 0.8 },
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
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
});
