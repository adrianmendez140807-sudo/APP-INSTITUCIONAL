import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet, Image } from 'react-native';

export default function LoadingScreen() {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
        />
      </Animated.View>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Estamos preparando todo para ti...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
    fontStyle: 'italic',
  },
});
