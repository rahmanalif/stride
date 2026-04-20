import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { TIME_ACCURACY_THEME } from '@/time-accuracy/config';
import { RotatingTargetState } from '@/time-accuracy/types';

type RotatingTargetProps = {
  onPress: () => void;
  state: RotatingTargetState;
};

function getDotPosition(angle: number, radius: number) {
  const radians = (angle - 90) * (Math.PI / 180);
  return {
    x: Math.cos(radians) * radius,
    y: Math.sin(radians) * radius,
  };
}

export function RotatingTarget({ onPress, state }: RotatingTargetProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state.feedbackTone === 'idle') {
      return;
    }

    Animated.sequence([
      Animated.spring(scale, { toValue: 1.04, useNativeDriver: true, speed: 16, bounciness: 10 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 8 }),
    ]).start();
  }, [scale, state.feedbackTone]);

  const circleSize = 128;
  const radius = 45;
  const redPosition = getDotPosition(state.angleRed, radius);
  const bluePosition = getDotPosition(state.angleBlue, radius);
  const showSuccessRing = state.feedbackTone === 'perfect' || state.feedbackTone === 'good';
  const showDangerRing = state.feedbackTone === 'miss';
  const ringColor = showSuccessRing
    ? TIME_ACCURACY_THEME.successRing
    : showDangerRing
      ? TIME_ACCURACY_THEME.dangerRing
      : TIME_ACCURACY_THEME.track;
  const redSize = 13;
  const blueSize = 13;
  const innerZoneSize = 76;

  return (
    <Animated.View style={{ width: circleSize, height: circleSize, transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel="Timing target"
        accessibilityRole="button"
        className="items-center justify-center rounded-full"
        onPress={onPress}
        style={({ pressed }) => ({
          width: circleSize,
          height: circleSize,
          backgroundColor: '#ECEDEF',
          opacity: pressed ? 0.96 : 1,
        })}>
        {/* <View
          className="absolute inset-0 rounded-full"
          style={{
            borderColor: '#DCDDDF',
            borderWidth: 5,
          }}
        /> */}
        <View
          className="absolute rounded-full"
          style={{
            width: innerZoneSize,
            height: innerZoneSize,
            backgroundColor: '#5A5960',
          }}
        />
        <View
          className="absolute rounded-full border border-dashed"
          style={{
            width: 104,
            height: 104,
            borderColor: showSuccessRing || showDangerRing ? ringColor : 'rgba(195,198,214,0.7)',
          }}
        />

        {showSuccessRing ? (
          <View
            className="absolute rounded-full"
            style={{
              width: innerZoneSize,
              height: innerZoneSize,
              backgroundColor: 'rgba(0,64,161,0.05)',
            }}
          />
        ) : null}

        <View
          className="absolute rounded-full"
          style={{
            width: redSize,
            height: redSize,
            backgroundColor: TIME_ACCURACY_THEME.red,
            shadowColor: '#000000',
            shadowOpacity: 0.08,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
            zIndex: 2,
            borderColor: 'rgba(255,255,255,0.7)',
            borderWidth: 1,
            transform: [{ translateX: redPosition.x }, { translateY: redPosition.y }],
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: blueSize,
            height: blueSize,
            backgroundColor: TIME_ACCURACY_THEME.blue,
            shadowColor: '#000000',
            shadowOpacity: 0.08,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
            zIndex: 1,
            borderColor: 'rgba(255,255,255,0.7)',
            borderWidth: 1,
            transform: [{ translateX: bluePosition.x }, { translateY: bluePosition.y }],
          }}
        />
      </Pressable>
    </Animated.View>
  );
}
