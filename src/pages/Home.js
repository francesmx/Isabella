import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { colourWheel } from '../utils/ColorWheel';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cycleArrayIndex = (increment) => {
    const nextIndex =
      (currentIndex + increment + colourWheel.length) % colourWheel.length;
    setCurrentIndex(nextIndex);
  };

  const onGestureEvent = (event) => {
    const { translationX } = event.nativeEvent;

    if (translationX > 50) {
      // Right swipe
      cycleArrayIndex(1);
    } else if (translationX < -50) {
      // Left swipe
      cycleArrayIndex(-1);
    }
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      // Reset any state related to the gesture
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colourWheel[currentIndex] },
        ]}
      />
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
