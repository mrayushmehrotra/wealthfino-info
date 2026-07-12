import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Updates from 'expo-updates';
import { useQuery } from '@tanstack/react-query';

import { fetchAppVersion } from '../services/api';
import { Colors } from '../theme/colors';

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return 1;
    if ((pa[i] || 0) < (pb[i] || 0)) return -1;
  }
  return 0;
}

export default function UpdatePrompt() {
  const [otaState, setOtaState] = useState('idle'); // idle | available | downloading | downloaded
  const [binaryUpdate, setBinaryUpdate] = useState(null);

  const { data: versionData } = useQuery({
    queryKey: ['appVersion'],
    queryFn: fetchAppVersion,
    retry: 1,
    staleTime: 1000 * 60 * 10,
  });

  // Binary version check (APK download / store redirect)
  useEffect(() => {
    if (!versionData) return;
    const current = Updates.appVersion || '1.0.0';
    if (compareVersions(versionData.latestVersion, current) > 0) {
      setBinaryUpdate(versionData);
    }
  }, [versionData]);

  // OTA update check via expo-updates
  useEffect(() => {
    (async () => {
      try {
        const check = await Updates.checkForUpdateAsync();
        if (check.isAvailable) {
          setOtaState('available');
        }
      } catch {
        // expo-updates not available (web) or check failed — ignore
      }
    })();
  }, []);

  const handleOtaDownload = async () => {
    setOtaState('downloading');
    try {
      await Updates.fetchUpdateAsync();
      setOtaState('downloaded');
    } catch {
      setOtaState('available');
    }
  };

  const handleOtaReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch {
      // ignore
    }
  };

  const handleBinaryDownload = () => {
    const url = binaryUpdate?.downloadUrl;
    if (url) {
      Linking.openURL(url);
    } else if (Platform.OS === 'android') {
      Linking.openURL(
        `https://play.google.com/store/apps/details?id=${Updates.appManifest?.android?.package || 'com.wealthfino.admin'}`
      );
    }
    setBinaryUpdate(null);
  };

  const showOta = otaState !== 'idle';
  const showBinary = !!binaryUpdate;
  const visible = showOta || showBinary;

  if (!visible) return null;

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {showBinary && (
            <>
              <Text style={styles.icon}>📲</Text>
              <Text style={styles.title}>New Version Available</Text>
              <Text style={styles.subtitle}>
                Version {binaryUpdate.latestVersion} is now available
                {binaryUpdate.releaseNotes ? `\n\n${binaryUpdate.releaseNotes}` : ''}
              </Text>
              {binaryUpdate.isRequired && (
                <Text style={styles.required}>
                  This update is required to continue using the app.
                </Text>
              )}
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleBinaryDownload}
                activeOpacity={0.7}
              >
                <Text style={styles.primaryBtnText}>Download Update</Text>
              </TouchableOpacity>
              {!binaryUpdate.isRequired && (
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => setBinaryUpdate(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryBtnText}>Later</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {showOta && !showBinary && (
            <>
              <Text style={styles.icon}>⚡</Text>
              <Text style={styles.title}>
                {otaState === 'downloading'
                  ? 'Downloading…'
                  : otaState === 'downloaded'
                    ? 'Ready to Update'
                    : 'Quick Update Available'}
              </Text>
              <Text style={styles.subtitle}>
                {otaState === 'downloading'
                  ? 'Please wait while the update downloads.'
                  : otaState === 'downloaded'
                    ? 'Restart the app to apply the latest improvements.'
                    : 'A quick over-the-air update is available for instant installation.'}
              </Text>

              {otaState === 'downloading' && (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginBottom: 16 }} />
              )}

              {otaState === 'available' && (
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleOtaDownload}
                  activeOpacity={0.7}
                >
                  <Text style={styles.primaryBtnText}>Download</Text>
                </TouchableOpacity>
              )}

              {otaState === 'downloaded' && (
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleOtaReload}
                  activeOpacity={0.7}
                >
                  <Text style={styles.primaryBtnText}>Restart Now</Text>
                </TouchableOpacity>
              )}

              {otaState !== 'downloading' && otaState !== 'downloaded' && (
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => setOtaState('idle')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryBtnText}>Dismiss</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 28,
    alignItems: 'center',
  },
  icon: { fontSize: 44, marginBottom: 14 },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  required: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
