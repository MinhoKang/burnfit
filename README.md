# BurnFit

요구사항 외에 있으면 좋을 기능들을 추가했습니다.

- 시작 요일 설정 기능: MyPage에서 시작 요일 설정 가능
- 다크모드: MyPage에서 다크모드 설정 가능
- 폴더블 대응: 너비 800px 이상일 때 50px로 설정
- 오늘 날짜로 바로 가기: 달력의 오른쪽 상단에 버튼으로 이동

시작 요일과 다크모드는 앱이 백그라운드로 가거나 꺼졌을 떄도 유지하기 위해 AsyncStorage를 사용했습니다.

## 영상
### Fold(Google Pixel Fold)
기본 테스트
<img src="https://github.com/user-attachments/assets/9522a6a9-11b8-4f59-847f-c4d3b93cb353" alt="demo" width="600">

<br/>폴드 테스트
[untitled.webm](https://github.com/user-attachments/assets/a611b026-2806-4f25-8cc0-5242154692f8)

### ios(iPhone 17 Pro)
https://github.com/user-attachments/assets/6ec30588-28e4-404b-adaf-b38ee595dc3c


## 시작 요일 설정 + 다크모드

### 상태 관리 (Zustand + AsyncStorage)

#### 스토어 구조

```typescript
interface SettingsState {
  startOfWeek: 'sunday' | 'monday'; // 주 시작일
  setStartOfWeek: (day: StartDayOfWeek) => void;
  themeMode: 'light' | 'dark'; // 테마 모드
  setThemeMode: (mode: ThemeMode) => void;
}
```

#### 영구 저장 구현

```typescript
export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      startOfWeek: 'sunday',
      setStartOfWeek: day => set({ startOfWeek: day }),
      themeMode: 'light',
      setThemeMode: mode => set({ themeMode: mode }),
    }),
    {
      name: 'calendar-settings-storage', // AsyncStorage 키
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

#### 사용 예시 (최적화)

```typescript
// useShallow로 불필요한 리렌더링 방지
const { startOfWeek, themeMode } = useSettingsStore(
  useShallow(state => ({
    startOfWeek: state.startOfWeek,
    themeMode: state.themeMode,
  })),
);
```

---

### 다크모드

#### 색상 정의

```typescript
export const COLORS = {
  LIGHT_BLUE: '#12C1E8',

  LIGHT: {
    BACKGROUND: '#FFFFFF',
    TEXT: '#000000',
    TEXT_SECONDARY: '#4E4E4E',
    CARD_BACKGROUND: '#FFFFFF',
    BORDER: '#E3E6EA',
  },
  DARK: {
    BACKGROUND: '#121212',
    TEXT: '#FFFFFF',
    TEXT_SECONDARY: '#B0B0B0',
    CARD_BACKGROUND: '#1E1E1E',
    BORDER: '#2C2C2C',
  },
};
```

#### 테마 적용

```typescript
// 테마 색상 가져오기
const themeColors = getThemeColors(themeMode);

// 스타일 적용
<View style={{ backgroundColor: themeColors.BACKGROUND }}>
  <Text style={{ color: themeColors.TEXT }}>Hello</Text>
</View>;
```

### 시작 요일 설정

#### 핵심 함수: `generateCalendarMatrix()`

**목적**: 특정 년/월에 대한 6주 x 7일 캘린더 매트릭스 생성

**날짜 인코딩 규칙** (다른 달 날짜 구분을 위한 특수 인코딩):

```typescript
// 이전 달 날짜: 음수로 표현
// 예: 이전 달 30일 → -30, 31일 → -31

// 현재 달 날짜: 그대로 표현
// 예: 1일 → 1, 15일 → 15, 31일 → 31

// 다음 달 날짜: 100 + 날짜로 표현
// 예: 다음 달 1일 → 101, 2일 → 102
```

**예시 출력** (2025년 10월, 일요일 시작):

```typescript
[
  [-29, -30, -31, 1, 2, 3, 4], // 1주차: 9월 29~31일, 10월 1~4일
  [5, 6, 7, 8, 9, 10, 11], // 2주차: 10월 5~11일
  [12, 13, 14, 15, 16, 17, 18], // 3주차: 10월 12~18일
  [19, 20, 21, 22, 23, 24, 25], // 4주차: 10월 19~25일
  [26, 27, 28, 29, 30, 31, 101], // 5주차: 10월 26~31일, 11월 1일
  [102, 103, 104, 105, 106, 107, 108], // 6주차: 11월 2~8일
];
```

**주 시작일 처리**:

```typescript
// 일요일 시작: 0 = 일요일
const firstDayIndex = firstDayIndexofMonth;

// 월요일 시작: 0 = 월요일
const firstDayIndex = (firstDayIndexofMonth + 6) % 7;
```

## 문제 해결 (Troubleshooting)

### iOS 빌드 실패

```sh
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Metro 캐시 문제

```sh
npm start -- --reset-cache
```

### Android 빌드 실패

```sh
cd android
./gradlew clean
cd ..
npm run android
```

---

## 트러블 슈팅

### 폴더블 대응

기존 코드

```typescript
const dayWidth = (width - 40) / 7;
```

이렇게 되면 하나의 날짜의 너비가 100px 이상이 되고, 폴더블 폰을 펼칠 때 화면이 깨지는 문제가 발생했습니다.

폴더블 대응을 위해 800px 이상일 때 50px로 설정하니 문제가 해결되었습니다.

```typescript
const dayWidth = width > 800 ? 50 : (width - 40) / 7;
```

### 다크모드

기존에는 react-navigation의 static api를 사용했으나, 바텀탭 다크모드 설정에 어려움이 있어 비교적 다크모드 설정이 용이한 dynamic api를 사용했습니다.
