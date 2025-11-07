import React, { useCallback, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  nativeSetTimeout,
  nativeClearTimeout,
  TimeoutId,
} from 'react-native-native-timeout';

const App = () => {
  const timeoutRef = useRef<TimeoutId | null>(null);

  const handleStart = useCallback(() => {
    if (timeoutRef.current) {
      nativeClearTimeout(timeoutRef.current);
    }

    timeoutRef.current = nativeSetTimeout(() => {
      console.log('Native timeout fired');
      timeoutRef.current = null;
    }, 1000);
  }, []);

  const handleCancel = useCallback(() => {
    if (timeoutRef.current) {
      nativeClearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>react-native-native-timeout</Text>
        <TouchableOpacity onPress={handleStart} style={styles.button}>
          <Text style={styles.buttonText}>Start 1s timeout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel} style={styles.buttonSecondary}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101828',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F2F4F7',
    marginBottom: 32,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#1570EF',
    marginBottom: 16,
  },
  buttonSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#475467',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default App;
