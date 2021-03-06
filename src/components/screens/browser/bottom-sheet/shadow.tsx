import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import styled from 'styled-components/native'

import { Color } from 'src/const'
import {
  IDimensions,
  useDimensions,
  useBottomSheetContext,
  useBottomSheetInitialTop,
} from 'src/hooks'

const { interpolateNode } = Animated

export function Shadow() {
  const initialPositionY = useBottomSheetInitialTop()
  const { screen: screenDimensions } = useDimensions()
  const { isOpen, translateY, closeBottomSheet } = useBottomSheetContext()

  const onPress = useCallback(() => {
    closeBottomSheet()
  }, [closeBottomSheet])

  const opacity = interpolateNode(translateY, {
    inputRange: [0, initialPositionY],
    outputRange: [1, 0],
  })

  if (!isOpen) {
    return null
  }

  return (
    <StyledTouchable onPress={onPress} screenDimensions={screenDimensions}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.shadow, { opacity }]}
      />
    </StyledTouchable>
  )
}

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: Color.MOSTLY_BLACK,
  },
})

interface IStyledTouchableProps {
  screenDimensions: IDimensions['screen']
}

const StyledTouchable = styled.TouchableWithoutFeedback<IStyledTouchableProps>`
  position: absolute;

  ${({ screenDimensions }) => `
    height: ${screenDimensions.height};
    width: ${screenDimensions.width};
  `}
`
