import { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonBoneProps {
  colors: { skeleton: string; skeletonHighlight: string };
  style?: StyleProp<ViewStyle>;
}

export function SkeletonBone({ colors, style }: SkeletonBoneProps) {
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.55,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.bone,
        { backgroundColor: colors.skeleton, opacity },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bone: {
    borderRadius: 8,
  },
});
