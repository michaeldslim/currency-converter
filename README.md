# Currency Converter (환율 변환기)

Android-only React Native app that displays **USD** and **JPY** exchange rates against **Korean Won (KRW)** in large cards.

## Features

- **USD** — KRW rate for `$1`
- **JPY** — KRW rate for `¥100`
- **Rate date picker** — view historical rates on business days via calendar (weekends, holidays, and future dates are disabled)
- **Today's rates** — return to the latest rates after viewing a past date
- **Midnight refresh** — shows a refresh banner when the calendar day changes while the app stays open
- **Pull to refresh** with haptic feedback on success
- **Dark mode** — follows system appearance settings
- **Skeleton loading** — card-shaped placeholders during initial load

Exchange rate data: [Frankfurter API](https://www.frankfurter.app/) (no API key required; reference daily rates)

## Tech Stack

| | |
|---|---|
| Framework | React Native 0.86, Expo SDK 57 |
| Language | TypeScript (strict) |
| Platform | Android only |
| Build / OTA | EAS Build + EAS Update |
| Package | `com.mike008.currencyconverter` |

## Getting Started

### Install & run

```bash
npm install
npm start          # Expo dev server
npm run android    # Local native build + run on device/emulator
npm run typecheck  # TypeScript check
```

> **Custom app icons do not apply in Expo Go.** Install via `npm run android` or an EAS build.

### First-time Android setup

If the `android/` folder is missing or you changed icons/splash assets:

```bash
npx expo prebuild --platform android --clean
npx expo run:android
```

## EAS Build

```bash
# Internal test APK
eas build -p android --profile preview

# Play Store AAB
eas build -p android --profile production
```

`runtimeVersion` in `app.json` and EAS Update channels are used for JS-only updates. A new native build is required after native changes (icons, permissions, new native modules).

## Project Structure

```
App.tsx
app.json
eas.json
assets/                    # Icons, splash
src/
  components/              # CurrencyCard, Calendar, Skeleton
  constants/               # Currency metadata
  hooks/                   # Rates, theme, date
  screens/                 # HomeScreen
  services/                # Frankfurter API
  theme/                   # Light/dark colors
  types/
  utils/                   # Formatting, calendar, haptics
```
