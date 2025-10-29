task

# BurnFit

번핀 과제 프로젝트입니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [핵심 구현 로직](#핵심-구현-로직)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)

---

## 주요 기능

### 1. 📅 인터랙티브 캘린더

#### 월간/주간 뷰 전환

- **수직 스와이프**로 월간 ↔ 주간 캘린더 전환
- 위로 스와이프: 월간 → 주간 (축소)
- 아래로 스와이프: 주간 → 월간 (확대)
- 실시간 애니메이션으로 부드러운 전환

#### 좌우 스와이프 네비게이션

- **수평 스와이프**로 이전/다음 월(주) 이동
- 왼쪽 스와이프: 다음 월/주
- 오른쪽 스와이프: 이전 월/주
- 헤더 화살표 버튼으로도 이동 가능

#### 날짜 선택

- 날짜 탭으로 선택
- 선택한 날짜로 자동 뷰 이동
- 다른 달의 날짜 선택 시 해당 월로 자동 전환
- 선택된 날짜는 파란색 원으로 표시

#### 애니메이션

- React Native Reanimated 활용
- 60fps 부드러운 전환 효과
- Spring 애니메이션으로 자연스러운 움직임
- UI 스레드에서 실행되어 성능 최적화

### 2. 🧭 네비게이션

Bottom Tab Navigation으로 4개 화면 구성:

- **HOME**: 홈 화면
- **CALENDAR**: 캘린더 화면 (메인 기능)
- **LIBRARY**: 운동 라이브러리
- **MY PAGE**: 마이페이지

---

## 기술 스택

| 카테고리       | 기술                                | 사용 목적                       |
| -------------- | ----------------------------------- | ------------------------------- |
| **프레임워크** | React Native 0.82.1                 | 크로스 플랫폼 모바일 앱 개발    |
| **언어**       | TypeScript 5.8.3                    | 타입 안정성 및 개발 생산성 향상 |
| **네비게이션** | React Navigation 7.x                | 화면 전환 및 탭 네비게이션      |
| **애니메이션** | React Native Reanimated 4.1.3       | 고성능 UI 스레드 애니메이션     |
| **제스처**     | React Native Gesture Handler 2.29.0 | 터치 제스처 인식 및 처리        |
| **아이콘**     | React Native Vector Icons 10.3.0    | 아이콘 라이브러리               |

---

## 핵심 구현 로직

### 1. 캘린더 로직 (`useCalendarLogic.ts`)

#### 상태 관리

```typescript
const [selectedDate, setSelectedDate] = useState<Date>(initialDate); // 선택된 날짜
const [viewMonth, setViewMonth] = useState<Date>(initialDate); // 현재 보이는 월
const [mode, setMode] = useState<CalendarMode>('month'); // 'month' | 'week'
```

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

**구현 코드**:

```typescript
export const generateCalendarMatrix = (
  year: number,
  month: number,
): number[][] => {
  const firstDay = new Date(year, month, 1).getDay(); // 1일의 요일 (0=일요일)
  const maxDays = getDaysInMonth(year, month); // 해당 월의 총 일수
  const prevMonthDays = getDaysInMonth(year, month - 1); // 이전 달의 총 일수

  const totalCells = firstDay + maxDays;
  const weeksNeeded = Math.ceil(totalCells / 7); // 필요한 주 수 (보통 5~6주)

  const dateRows = Array.from({ length: weeksNeeded }, (_, rowIndex) => {
    return Array.from({ length: 7 }, (__, colIndex) => {
      const dayNumber = rowIndex * 7 + colIndex - firstDay + 1;

      if (dayNumber < 1) {
        // 이전 달 날짜
        return -(prevMonthDays + dayNumber);
      }
      if (dayNumber > maxDays) {
        // 다음 달 날짜
        return 100 + (dayNumber - maxDays);
      }
      // 현재 달 날짜
      return dayNumber;
    });
  });

  return dateRows;
};
```

#### 핵심 함수: `selectDate(day: number)`

**목적**: 날짜 선택 시 이전/현재/다음 달 자동 전환

```typescript
const selectDate = (day: number) => {
  const newDate = new Date(viewMonth);

  if (day < 0) {
    // 이전 달 날짜 선택
    newDate.setMonth(viewMonth.getMonth() - 1);
    newDate.setDate(-day); // 음수를 양수로 변환
  } else if (day > 100) {
    // 다음 달 날짜 선택
    newDate.setMonth(viewMonth.getMonth() + 1);
    newDate.setDate(day - 100); // 100을 빼서 실제 날짜 추출
  } else {
    // 현재 달 날짜 선택
    newDate.setDate(day);
  }

  setSelectedDate(newDate);
  setViewMonth(newDate); // 뷰도 함께 이동
};
```

#### 월/주 변경 함수

```typescript
// 월 변경 (헤더 버튼 또는 스와이프)
const changeMonth = (direction: number) => {
  const newDate = new Date(viewMonth);
  newDate.setMonth(viewMonth.getMonth() + direction); // +1 또는 -1
  setViewMonth(newDate);
};

// 주 변경 (헤더 버튼 또는 스와이프)
const changeWeek = (direction: number) => {
  const newDate = new Date(viewMonth);
  newDate.setDate(viewMonth.getDate() + direction * 7); // ±7일
  setViewMonth(newDate);
};
```

#### 3개의 매트릭스 생성 (스와이프 애니메이션용)

```typescript
// 이전 달/주 매트릭스
const prevMatrix = useMemo(
  () =>
    mode === 'week'
      ? generateCalendarMatrix(
          prevWeekDate.getFullYear(),
          prevWeekDate.getMonth(),
        )
      : generateCalendarMatrix(
          prevMonthDate.getFullYear(),
          prevMonthDate.getMonth(),
        ),
  [mode, prevWeekDate, prevMonthDate],
);

// 현재 달/주 매트릭스
const currentMatrix = useMemo(
  () => generateCalendarMatrix(viewMonth.getFullYear(), viewMonth.getMonth()),
  [viewMonth],
);

// 다음 달/주 매트릭스
const nextMatrix = useMemo(
  () =>
    mode === 'week'
      ? generateCalendarMatrix(
          nextWeekDate.getFullYear(),
          nextWeekDate.getMonth(),
        )
      : generateCalendarMatrix(
          nextMonthDate.getFullYear(),
          nextMonthDate.getMonth(),
        ),
  [mode, nextWeekDate, nextMonthDate],
);
```

**왜 3개의 매트릭스가 필요한가?**

- 좌우 스와이프 시 이전/현재/다음 달을 동시에 렌더링
- 사용자가 스와이프하면 3개의 캘린더가 수평으로 배치되어 슬라이드
- 부드러운 전환 효과를 위해 미리 렌더링

---

### 2. 캘린더 애니메이션 (`useCalendarAnimation.ts`)

#### 애니메이션 상태 값

```typescript
const calendarHeight = useSharedValue(CALENDAR_HEIGHT_MONTH); // 300px ↔ 60px
const dragProgress = useSharedValue(0); // 0: 월간, 1: 주간
const translateX = useSharedValue(-width); // 좌우 스와이프 위치 (-width = 중앙)
```

**상수 정의**:

```typescript
const CALENDAR_HEIGHT_MONTH = 300; // 월간 모드 높이
const CALENDAR_HEIGHT_WEEK = 60; // 주간 모드 높이
const ROW_HEIGHT = 50; // 각 주(행)의 높이
const SWIPE_THRESHOLD = 100; // 스와이프 인식 임계값 (px)
const VELOCITY_THRESHOLD = 800; // 빠른 스와이프 인식 임계값
```

#### 제스처 처리 로직

**1단계: 제스처 방향 판단**

```typescript
panGesture.onUpdate(event => {
  const { translationX, translationY } = event;

  // 탭과의 충돌 방지 (10px 미만 움직임 무시)
  if (Math.abs(translationX) < 10 && Math.abs(translationY) < 10) {
    return;
  }

  // 수직 vs 수평 판단
  const isVertical = Math.abs(translationY) > Math.abs(translationX);

  if (isVertical) {
    // 수직 스와이프 → 월/주 전환
  } else {
    // 수평 스와이프 → 이전/다음 월(주) 이동
  }
});
```

**2단계: 수직 스와이프 (월 ↔ 주 전환)**

```typescript
if (mode === 'month') {
  // 월 → 주 (위로 스와이프)
  const progress = Math.max(0, Math.min(1, -translationY / heightDiff));
  dragProgress.value = progress; // 0 → 1
  calendarHeight.value = interpolate(
    progress,
    [0, 1],
    [CALENDAR_HEIGHT_MONTH, CALENDAR_HEIGHT_WEEK], // 300 → 60
    Extrapolation.CLAMP,
  );
} else {
  // 주 → 월 (아래로 스와이프)
  const progress = Math.max(0, Math.min(1, translationY / heightDiff));
  dragProgress.value = 1 - progress; // 1 → 0
  calendarHeight.value = interpolate(
    1 - progress,
    [0, 1],
    [CALENDAR_HEIGHT_MONTH, CALENDAR_HEIGHT_WEEK], // 60 → 300
    Extrapolation.CLAMP,
  );
}
```

**3단계: 수평 스와이프 (월/주 변경)**

```typescript
// 실시간 위치 업데이트
translateX.value = -width + translationX;

// 제스처 종료 시 판단
panGesture.onEnd(event => {
  const shouldChange =
    Math.abs(translationX) > SWIPE_THRESHOLD || // 100px 이상 이동
    Math.abs(velocityX) > VELOCITY_THRESHOLD; // 빠른 스와이프 (속도 800 이상)

  if (shouldChange) {
    const direction = translationX < 0 ? 1 : -1; // 왼쪽: 다음, 오른쪽: 이전
    translateX.value = withTiming(-width * (1 + direction), { duration: 200 });

    // JS 스레드에서 상태 변경
    if (mode === 'month') {
      scheduleOnRN(changeMonth, direction);
    } else {
      scheduleOnRN(changeWeek, direction);
    }
  } else {
    // 임계값 미달 → 제자리로 복귀
    translateX.value = withSpring(-width, { damping: 20, stiffness: 90 });
  }
});
```

#### 행별 애니메이션 (주간 모드)

**목적**: 선택된 주만 표시하고 나머지는 숨김

```typescript
const useAnimatedRowStyle = (rowIndex, selectedWeekIndex, dragProgress) => {
  return useAnimatedStyle(() => {
    if (rowIndex === selectedWeekIndex) {
      // 선택된 주는 항상 표시
      return { height: ROW_HEIGHT, opacity: 1, overflow: 'hidden' };
    }

    // 나머지 주는 dragProgress에 따라 높이/투명도 조절
    const rowHeight = interpolate(
      dragProgress.value,
      [0, 1], // 월간 → 주간
      [ROW_HEIGHT, 0], // 50px → 0px
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      dragProgress.value,
      [0, 0.5, 1], // 월간 → 중간 → 주간
      [1, 0.5, 0], // 완전 표시 → 반투명 → 숨김
      Extrapolation.CLAMP,
    );

    return { height: rowHeight, opacity, overflow: 'hidden' };
  }, [selectedWeekIndex]);
};
```

**6개 행에 대한 스타일 생성**:

```typescript
const row0Style = useAnimatedRowStyle(0, selectedWeekIndex, dragProgress);
const row1Style = useAnimatedRowStyle(1, selectedWeekIndex, dragProgress);
const row2Style = useAnimatedRowStyle(2, selectedWeekIndex, dragProgress);
const row3Style = useAnimatedRowStyle(3, selectedWeekIndex, dragProgress);
const row4Style = useAnimatedRowStyle(4, selectedWeekIndex, dragProgress);
const row5Style = useAnimatedRowStyle(5, selectedWeekIndex, dragProgress);

const rowStyles = [
  row0Style,
  row1Style,
  row2Style,
  row3Style,
  row4Style,
  row5Style,
];
```

#### 애니메이션 흐름도

```
사용자 제스처
    ↓
┌─────────────────────┐
│ 방향 판단           │
│ (수직 vs 수평)      │
└─────────────────────┘
    ↓           ↓
[수직]        [수평]
    ↓           ↓
월↔주 전환   월/주 변경
    ↓           ↓
높이 조절    좌우 이동
투명도 조절   (translateX)
(dragProgress)
    ↓           ↓
Spring       Timing
애니메이션    애니메이션
```

---

### 3. 날짜 헬퍼 함수

#### `checkIsSelectedDay()` - 선택된 날짜 확인

```typescript
export const checkIsSelectedDay = (
  day: number,
  viewMonth: Date,
  selectedDate: Date,
): boolean => {
  if (day < 0) {
    // 이전 달 날짜
    const prevMonth = new Date(viewMonth);
    prevMonth.setMonth(viewMonth.getMonth() - 1);
    return (
      -day === selectedDate.getDate() &&
      prevMonth.getMonth() === selectedDate.getMonth() &&
      prevMonth.getFullYear() === selectedDate.getFullYear()
    );
  }

  if (day > 100) {
    // 다음 달 날짜
    const nextMonth = new Date(viewMonth);
    nextMonth.setMonth(viewMonth.getMonth() + 1);
    return (
      day - 100 === selectedDate.getDate() &&
      nextMonth.getMonth() === selectedDate.getMonth() &&
      nextMonth.getFullYear() === selectedDate.getFullYear()
    );
  }

  // 현재 달 날짜
  return (
    day === selectedDate.getDate() &&
    viewMonth.getMonth() === selectedDate.getMonth() &&
    viewMonth.getFullYear() === selectedDate.getFullYear()
  );
};
```

#### `getDisplayDay()` - 화면에 표시할 날짜 추출

```typescript
export const getDisplayDay = (day: number | string): number | string => {
  if (typeof day !== 'number') return day;
  if (day < 0) return -day; // -30 → 30
  if (day > 100) return day - 100; // 101 → 1
  return day; // 15 → 15
};
```

#### `getDaysInMonth()` - 특정 월의 일수 계산

```typescript
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// 예시:
// getDaysInMonth(2025, 0)  → 31 (1월)
// getDaysInMonth(2025, 1)  → 28 (2월, 평년)
// getDaysInMonth(2024, 1)  → 29 (2월, 윤년)
```

#### `formatMonthYear()` - 헤더 텍스트 포맷팅

```typescript
export const formatMonthYear = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

// 예시:
// formatMonthYear(new Date(2025, 9, 15)) → "October 2025"
```

---

## 프로젝트 구조

```
burnfit/
├── src/
│   ├── components/
│   │   └── calendar/
│   │       ├── Calendar.tsx              # 메인 캘린더 컴포넌트
│   │       ├── CalendarItem.tsx          # 캘린더 행 (주) 컴포넌트
│   │       └── calendar.style.ts         # 캘린더 스타일 정의
│   │
│   ├── constants/
│   │   ├── colors.ts                     # 색상 상수
│   │   └── date.ts                       # 요일 상수 (일요일 시작)
│   │
│   ├── helpers/
│   │   └── calendar.ts                   # 캘린더 헬퍼 함수
│   │                                     # - generateCalendarMatrix()
│   │                                     # - checkIsSelectedDay()
│   │                                     # - isOtherMonthDay()
│   │                                     # - getDisplayDay()
│   │
│   ├── hooks/
│   │   └── calendar/
│   │       ├── useCalendarLogic.ts       # 캘린더 비즈니스 로직
│   │       │                             # - 상태 관리 (mode, viewMonth, selectedDate)
│   │       │                             # - 날짜 선택/변경 함수
│   │       │                             # - 3개 매트릭스 생성
│   │       │
│   │       └── useCalendarAnimation.ts   # 캘린더 애니메이션 로직
│   │                                     # - 제스처 처리 (수직/수평)
│   │                                     # - 애니메이션 값 관리
│   │                                     # - 행별 애니메이션
│   │
│   ├── navigations/
│   │   └── BottomTabNavigations.tsx      # 하단 탭 네비게이션
│   │
│   ├── screens/
│   │   ├── home/
│   │   │   └── HomeScreen.tsx            # 홈 화면
│   │   ├── calendar/
│   │   │   └── CalendarScreen.tsx        # 캘린더 화면 (메인)
│   │   ├── library/
│   │   │   └── LibraryScreen.tsx         # 라이브러리 화면
│   │   └── myPage/
│   │       └── MyPageScreen.tsx          # 마이페이지
│   │
│   └── utils/
│       └── date.ts                       # 날짜 유틸리티 함수
│                                         # - getDaysInMonth()
│                                         # - formatMonthYear()
│                                         # - checkIsToday()
│
├── App.tsx                               # 앱 진입점
├── package.json                          # 의존성 관리
└── README.md                             # 프로젝트 문서
```

### 주요 파일 설명

#### `useCalendarLogic.ts` (비즈니스 로직)

- 캘린더의 모든 상태 관리 (mode, viewMonth, selectedDate)
- 날짜 선택, 월/주 변경 로직
- 3개의 매트릭스 생성 (이전/현재/다음)
- 선택된 주의 인덱스 계산

#### `useCalendarAnimation.ts` (애니메이션)

- 제스처 인식 및 처리 (Pan Gesture)
- UI 스레드 애니메이션 (Reanimated)
- 월/주 전환 애니메이션
- 좌우 스와이프 애니메이션
- 6개 행에 대한 개별 애니메이션 스타일

#### `Calendar.tsx` (UI 컴포넌트)

- 로직과 애니메이션 훅 통합
- 헤더 (월/년 표시, 이전/다음 버튼)
- 요일 헤더 (일~토)
- 날짜 그리드 렌더링
- 제스처 디텍터 적용

#### `CalendarItem.tsx` (행 컴포넌트)

- 각 주(행)를 렌더링
- 날짜 선택 처리
- 선택된 날짜 스타일링
- 다른 달 날짜 스타일링 (회색)
- React.memo로 최적화

#### `calendar.ts` (헬퍼 함수)

- 캘린더 매트릭스 생성
- 날짜 인코딩/디코딩
- 선택된 날짜 확인
- 다른 달 날짜 확인

---

## 시작하기

### 사전 요구사항

- **Node.js** >= 20
- **React Native 개발 환경** 설정 완료
  - iOS: Xcode 및 CocoaPods
  - Android: Android Studio 및 SDK

### 설치

```sh
# 1. 의존성 설치
npm install

# 2. iOS 의존성 설치 (Mac만 해당)
cd ios
bundle install
bundle exec pod install
cd ..
```

### 실행

```sh
# Metro 서버 시작
npm start

# Android 실행 (새 터미널)
npm run android

# iOS 실행 (새 터미널, Mac만 해당)
npm run ios
```

### 테스트

```sh
npm test
```

---

## 성능 최적화

### 1. React.memo 사용

```typescript
// CalendarItem.tsx
export const CalendarItem = React.memo(({ ... }) => {
  // 불필요한 리렌더링 방지
  // props가 변경되지 않으면 리렌더링 스킵
});
```

### 2. useMemo로 계산 캐싱

```typescript
// 매트릭스 생성은 비용이 큰 작업이므로 캐싱
const currentMatrix = useMemo(
  () => generateCalendarMatrix(viewMonth.getFullYear(), viewMonth.getMonth()),
  [viewMonth], // viewMonth가 변경될 때만 재계산
);
```

### 3. useCallback으로 함수 메모이제이션

```typescript
// 함수 재생성 방지
const changeMonth = useCallback(
  (direction: number) => {
    const newDate = new Date(viewMonth);
    newDate.setMonth(viewMonth.getMonth() + direction);
    setViewMonth(newDate);
  },
  [viewMonth], // viewMonth가 변경될 때만 함수 재생성
);
```

### 4. UI 스레드 애니메이션

```typescript
// Reanimated의 useSharedValue와 useAnimatedStyle 사용
// JS 스레드 블로킹 없이 60fps 애니메이션 구현
const calendarHeight = useSharedValue(300);

const animatedStyle = useAnimatedStyle(() => {
  return {
    height: calendarHeight.value, // UI 스레드에서 직접 실행
  };
});
```

### 5. scheduleOnRN으로 스레드 분리

```typescript
// UI 스레드에서 JS 스레드로 작업 전달
scheduleOnRN(changeMonth, direction);
// 애니메이션은 UI 스레드에서, 상태 변경은 JS 스레드에서
```

---


## 문제 해결 (Troubleshooting)

### iOS 빌드 실패

```sh
# CocoaPods 재설치
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Metro 캐시 문제

```sh
# Metro 캐시 초기화
npm start -- --reset-cache
```

### Android 빌드 실패

```sh
# Gradle 캐시 정리
cd android
./gradlew clean
cd ..
npm run android
```

### 제스처가 작동하지 않을 때

```sh
# react-native-gesture-handler 재설치
npm install react-native-gesture-handler
cd ios && pod install && cd ..
```

### 애니메이션이 끊길 때

- Reanimated 설정 확인: `babel.config.js`에 플러그인 추가 필요

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // 이 줄 확인
};
```

---

## 구현 세부사항

### 캘린더 렌더링 구조

```
Calendar (메인 컴포넌트)
  ├── Header (헤더)
  │   ├── 이전 버튼
  │   ├── "October 2025" (월/년 표시)
  │   └── 다음 버튼
  │
  ├── Week Header (요일 헤더)
  │   └── Sun, Mon, Tue, Wed, Thu, Fri, Sat
  │
  └── GestureDetector (제스처 감지)
      └── Animated.View (애니메이션 컨테이너)
          └── Animated.View (좌우 스와이프 래퍼)
              ├── 이전 달/주 (왼쪽)
              │   └── CalendarItem × 6 (6주)
              │
              ├── 현재 달/주 (중앙)
              │   └── CalendarItem × 6 (6주)
              │
              └── 다음 달/주 (오른쪽)
                  └── CalendarItem × 6 (6주)
```
