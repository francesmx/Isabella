import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { StyleSheet, Image, Animated, Easing } from 'react-native';

const AnimatableImage = ({ source }, ref) => {
  const shakeValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const translateXValue = useRef(new Animated.Value(0)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeValue, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: -10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotate = () => {
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      rotateValue.setValue(0);
    });
  };

  const rotateReverse = () => {
    Animated.timing(rotateValue, {
      toValue: -1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      rotateValue.setValue(0);
    });
  };

  const jumpUp = () => {
    Animated.sequence([
      Animated.timing(translateYValue, {
        toValue: -50,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(translateYValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const jumpDown = () => {
    Animated.sequence([
      Animated.timing(translateYValue, {
        toValue: 50,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(translateYValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const moveLeft = () => {
    Animated.sequence([
      Animated.timing(translateXValue, {
        toValue: -50,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(translateXValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const moveRight = () => {
    Animated.sequence([
      Animated.timing(translateXValue, {
        toValue: 50,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(translateXValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const zoomIn = () => {
    Animated.timing(scaleValue, {
      toValue: 1.3,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      scaleValue.setValue(1);
    });
  };

  const zoomOut = () => {
    Animated.timing(scaleValue, {
      toValue: 0.7,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      scaleValue.setValue(1);
    });
  };

  // Expose the animation functions to be called from the parent component
  useImperativeHandle(ref, () => ({
    shake,
    rotate,
    rotateReverse,
    jumpUp,
    jumpDown,
    moveLeft,
    moveRight,
    zoomIn,
    zoomOut,
  }));

  // Trigger the zoomIn effect when the component mounts
  useEffect(() => {
    zoomIn();
  }, []);

  const animatedStyle = {
    transform: [
      { translateX: translateXValue },
      { translateY: translateYValue },
      {
        rotate: rotateValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
      { scale: scaleValue },
    ],
  };

  return (
    <Animated.View style={[styles.imageContainer, animatedStyle]}>
      <Image source={source} style={styles.image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default forwardRef(AnimatableImage);
