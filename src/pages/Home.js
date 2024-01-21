import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import { colourWheel } from '../utils/ColorWheel';
import { Audio } from 'expo-av';
import AnimatableImage from '../components/AnimatableImage';

const animalArray = [
  require('../../assets/animals/bear.png'),
  require('../../assets/animals/elephant.png'),
  require('../../assets/animals/fox.png'),
  require('../../assets/animals/giraffe.png'),
  require('../../assets/animals/hippo.png'),
  require('../../assets/animals/lion.png'),
  require('../../assets/animals/monkey.png'),
  require('../../assets/animals/moose.png'),
  require('../../assets/animals/tiger.png'),
  require('../../assets/animals/zebra.png'),
];

const babySoundsArray = [
  require('../../assets/sounds/laugh1.mp3'),
  require('../../assets/sounds/laugh2.mp3'),
  require('../../assets/sounds/awoodah.mp3'),
];

export default function Home() {
  const [colourIndex, setColourIndex] = useState(0);
  const [animalIndex, setAnimalIndex] = useState(0);
  const [colourIndexChanged, setColourIndexChanged] = useState(false);
  const [animalIndexChanged, setAnimalIndexChanged] = useState(false);
  const [sound, setSound] = useState();
  const animatableImageRef = useRef();

  const playSound = async () => {
    console.log('Loading Sound');

    const randomIndex = Math.floor(Math.random() * babySoundsArray.length);
    const randomSound = babySoundsArray[randomIndex];

    const { sound } = await Audio.Sound.createAsync(randomSound);
    setSound(sound);
    console.log('Playing Sound');
    await sound.playAsync();
  };

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const cycleColourArrayIndex = (increment) => {
    const nextIndex =
      (colourIndex + increment + colourWheel.length) % colourWheel.length;
    setColourIndex(nextIndex);
    setColourIndexChanged(true);
  };

  const cycleAnimalArrayIndex = (increment) => {
    const nextIndex =
      (animalIndex + increment + animalArray.length) % animalArray.length;
    setAnimalIndex(nextIndex);
    setAnimalIndexChanged(true);
  };

  const getRandomAnimation = () => {
    const animations = [
      animatableImageRef.current.rotate,
      animatableImageRef.current.rotateReverse,
      animatableImageRef.current.moveLeft,
      animatableImageRef.current.moveRight,
      animatableImageRef.current.jumpUp,
      animatableImageRef.current.jumpDown,
      animatableImageRef.current.zoomIn,
      animatableImageRef.current.zoomOut,
    ];

    const randomIndex = Math.floor(Math.random() * animations.length);
    const randomAnimation = animations[randomIndex];

    console.log(`Animating with ${randomAnimation}`);

    randomAnimation();
  };

  const handleImageTouch = () => {
    console.log('image touched');
    playSound();
    getRandomAnimation();
  };

  const onPanGestureEvent = (event) => {
    const { translationX, translationY } = event.nativeEvent;

    if (translationX > 50 && !colourIndexChanged) {
      cycleColourArrayIndex(-1);
    } else if (translationX < -50 && !colourIndexChanged) {
      cycleColourArrayIndex(1);
    }

    if (translationY > 50 && !animalIndexChanged) {
      cycleAnimalArrayIndex(1);
    } else if (translationY < -50 && !animalIndexChanged) {
      cycleAnimalArrayIndex(-1);
    }
  };

  const onPanHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      setColourIndexChanged(false);
      setAnimalIndexChanged(false);
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onPanHandlerStateChange}
    >
      <PinchGestureHandler
        onGestureEvent={handleImageTouch}
        simultaneousHandlers={animatableImageRef}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: colourWheel[colourIndex] },
          ]}
        >
          <TouchableWithoutFeedback onPress={handleImageTouch}>
            <View style={styles.imageContainer}>
              <AnimatableImage
                ref={animatableImageRef}
                source={animalArray[animalIndex]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </PinchGestureHandler>
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
