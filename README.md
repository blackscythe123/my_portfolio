# Next.js to Android APK using Capacitor

This project is a Next.js web application packaged into a real Android app (APK) using Capacitor and Android Studio. The app is exported as static files and bundled inside a native Android WebView so it can run offline like a mobile app.

## Development (Run as a Website)
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open http://localhost:3000 in your browser.

Edit app/page.tsx — changes auto-reload.

## Build Static Export (Required for Capacitor)

Static export mode is enabled in next.config.js:
```
output: "export"
```
Build the project:
```
npm run build
```
The static site is generated in the /out directory.

## Capacitor Setup

Install Capacitor:
```
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```
Initialize Capacitor (first time only):
```
npx cap init
```
Set webDir to “out” in capacitor.config.(ts|json):
```
webDir: "out"
```
Copy the exported build:
```
npx cap copy

Add Android platform:

npx cap add android
```
## Open in Android Studio

Open the native project:
```
npx cap open android
```
To run or debug, click the Run button.

## Build Debug APK

Android Studio → Build → Build APK(s)

APK output path:
```
android/app/build/outputs/apk/debug/app-debug.apk
```
## Build Signed Release APK

Android Studio → Build → Generate Signed App Bundle / APK → APK

Create or select a keystore → Finish

Output path:
```
android/app/release/app-release.apk
```
## Notes

- The app works offline because files are bundled inside the APK.
- Remote images or APIs require internet.
- After changing the website, rebuild and sync:
```
npm run build
npx cap copy
```
## Docs

Next.js static 

[export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

[Capacitor](https://capacitorjs.com/docs)

[Android Studio Build](https://developer.android.com/studio/build)
