import { useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';

export const useCalendarWidth = () => {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // 폴더블 대응: 너비 800px 이상일 때 50px로 설정
  const dayWidth = useMemo(
    () => (screenWidth > 800 ? 50 : (screenWidth - 40) / 7),
    [screenWidth],
  );

  return {
    screenWidth,
    dayWidth,
  };
};
