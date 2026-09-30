# FishRun

## About
This project is a small similar game to the famous Dino Run but here you have to move yourself. By jumping or ducking the *fish* moves ingame. 

## Direction
The app is directed to rach people that want to do something not very tiring but also something fun offline and online.

## Function
Provide entertainment anywhere with enough room.


## Runbook – Projekt starten

**Voraussetzungen:** [Node.js](https://nodejs.org) (LTS), Git und die App **Expo Go** auf dem Handy (App Store / Play Store).

```bash
git clone https://github.com/BruderJakub/FishRun.git
cd fishrun
npm install
npx expo install expo-sensors expo-screen-orientation @react-native-async-storage/async-storage
npx expo start
```

Dann den QR-Code im Terminal scannen:
- **Android:** mit der Expo-Go-App
- **iOS:** mit der Kamera-App, sie öffnet Expo Go

Handy und PC müssen im selben WLAN sein.

**Weitere Befehle:**
- `npm start`: dasselbe wie `npx expo start`
- `npm run android` / `npm run ios`: im Emulator/Simulator starten
- `npx expo start -c`: Start mit geleertem Cache, falls etwas hängt 