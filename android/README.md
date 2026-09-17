# ReceiptMind - Native Android App (Kotlin & Jetpack Compose)

This directory contains the production-ready native Android project for **ReceiptMind: AI Receipt Scanner & Warranty Vault**, designed for deployment to the **Google Play Store**.

## Tech Stack & Architecture
- **Language**: Kotlin 2.1.0
- **UI Framework**: Jetpack Compose with Material 3 Design
- **Architecture**: Modern Android MVVM with Repository Pattern
- **Local Persistence**: Android Room SQLite Database (Encrypted Offline Vault)
- **Asynchronous State**: Kotlin Coroutines & StateFlow / SharedFlow
- **Camera & Scanner**: CameraX + Google ML Kit Text Recognition with heuristic extraction
- **Play Store Requirements**: Target SDK 35 (Android 15+ compatible), 64-bit compliance, Android App Bundle (AAB).

---

## Getting Started in Android Studio

1. **Open Android Studio** (Ladybug / Hedgehog or newer).
2. Select **Open**, then navigate to the `/android` directory of this repository.
3. Allow Gradle to sync dependencies automatically via `android/gradle/libs.versions.toml`.
4. Connect an Android device with USB debugging enabled or launch an Android Emulator.
5. Click **Run** (`Shift + F10`) to launch the app.

---

## Building for Google Play Store (Production Release)

### 1. Generate an Upload Keystore
Run the following command in your terminal to create your release keystore:

```bash
keytool -genkey -v -keystore release.keystore -alias receiptmind -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing in `app/build.gradle.kts`
Set your signing configuration in `android/app/build.gradle.kts`:

```kotlin
signingConfigs {
    create("release") {
        storeFile = file("../release.keystore")
        storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "your_password"
        keyAlias = "receiptmind"
        keyPassword = System.getenv("KEY_PASSWORD") ?: "your_password"
    }
}
buildTypes {
    release {
        isMinifyEnabled = true
        isShrinkResources = true
        signingConfig = signingConfigs.getByName("release")
    }
}
```

### 3. Build the Android App Bundle (.aab)
Run:
```bash
./gradlew :app:bundleRelease
```
The output file will be generated at:
`app/build/outputs/bundle/release/app-release.aab`

---

## Google Play Console Deployment Checklist

1. **Create App in Google Play Console**:
   - App Name: `ReceiptMind: AI Receipt Scanner & Warranty Vault`
   - Default Language: `English (United States)`
   - App or Game: `App`
   - Free or Paid: `Free`

2. **Upload Store Listing Assets** (Generated in `public/icons/`):
   - **App Icon**: 512 x 512 px (use `/public/icons/icon-square.png`)
   - **Feature Graphic**: 1024 x 500 px
   - **Phone Screenshots**: Minimum 2 phone screenshots (1080 x 1920 px)
   - **Short Description**: "AI receipt scanner, expense tracker, and warranty expiration vault."
   - **Full Description**: "ReceiptMind is your intelligent personal finance assistant. Scan receipts instantly with on-device camera OCR, extract merchant totals, track equipment warranties, and generate insurance claim letters."

3. **Data Safety Declaration**:
   - Data stored locally on device via encrypted SQLite Room database.
   - User has full control to export and delete receipts.

4. **Rollout**:
   - Upload `app-release.aab` to **Production** or **Open Testing** track.
   - Submit for Google Play review!
