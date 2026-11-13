# NativeUpload

A small React Native app for picking PDFs off your phone and uploading them to a
local Node server. It keeps a running count of how uploads went and lists the
files you have sent.

Built with Expo Router, NativeWind and Zustand.

---

## What you need first

- **Node 20+**
- **Android Studio** (for the SDK and an emulator, if you want one)
- **JDK 17 or newer** — Android Studio ships one at
  `C:\Program Files\Android\Android Studio\jbr`, so you usually do not have to
  install Java separately
- A phone with USB debugging on, or an emulator

This app uses native modules and config plugins, so **Expo Go will not run it**.
You need a development build or an APK.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Point the app at your backend

Create a `.env` file in the project root:

```
EXPO_PUBLIC_API_URL=http://192.168.1.50:5000
```

The right value depends on where the app runs, because `localhost` on a phone
means the phone itself, not your computer:

| Running on            | Use                        |
| --------------------- | -------------------------- |
| Web or iOS simulator  | `http://localhost:5000`    |
| Android emulator      | `http://10.0.2.2:5000`     |
| A real phone          | `http://<your-pc-ip>:5000` |

Find your IP with `ipconfig` and take the IPv4 address of your Wi-Fi adapter.
The phone and the computer have to be on the same network.

Two things worth knowing about this variable:

- `EXPO_PUBLIC_*` values are **baked into the bundle when it builds**. Changing
  `.env` means restarting Metro with `-c`, or rebuilding the APK. It is not read
  at runtime.
- There is a fallback IP hardcoded in `src/api/config.ts` for when `.env` is
  missing. Change it to yours or delete it.

### 3. Start the backend

The server lives in a separate repo, `node-for-auth`:

```bash
cd ../node-for-auth
node server.js
```

It listens on port 5000 and exposes:

| Method | Route          | Does                                  |
| ------ | -------------- | ------------------------------------- |
| `POST` | `/api/upload`  | takes one PDF in a `file` form field  |
| `GET`  | `/api/upload`  | lists everything uploaded so far      |
| `GET`  | `/uploads/...` | serves a stored PDF                   |

PDFs only, 10 MB maximum. Anything else comes back as a 400.

### 4. Run the app

```bash
npx expo start
```

Then open it in your development build. JS changes reload in a second or two,
which is how you want to work day to day — building an APK for every change is
the slow way round.

---

## Building an APK

Do this when you want something installable that runs without Metro.

### 1. Check `.env` before you start

The API URL gets compiled in. Getting it wrong means building again, so look
before you build.

### 2. Point Gradle at a modern JDK

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
```

Only needed if your default `java` is older than 17. Check with `java -version`.

### 3. Build

```bash
cd android
./gradlew assembleRelease
```

Adding `-PreactNativeArchitectures=arm64-v8a` builds for modern phones only. The
APK comes out roughly a third of the size and builds noticeably quicker, which
is usually what you want while testing.

For a debug APK that loads JS from Metro instead of bundling it:

```bash
./gradlew assembleDebug
```

### 4. Grab the file

```
android/app/build/outputs/apk/release/app-release.apk
```

**Check the timestamp.** A failed build leaves the previous APK sitting there,
and installing a stale one is a confusing way to lose half an hour.

### 5. Install it

```bash
adb devices                      # is the phone actually connected?
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

`-r` replaces the existing install and keeps its data. Copying the APK to the
phone and tapping it works too.

### How long it takes

A first release build compiles native C++ for every dependency and can take
hours. After that, a JS-only change is a few minutes because the native work is
cached. Avoid `./gradlew clean` unless you have to — it throws that cache away.

---

## If you change `app.json`

The `android/` folder is generated. Native config in `app.json` only reaches the
app after:

```bash
npx expo prebuild --platform android
```

This overwrites hand edits inside `android/`, so put native settings in
`app.json` and let prebuild generate them.

---

## Project layout

```
src/
  api/
    config.ts        single source for the API base URL
    upload.ts        posts a PDF to the backend
  app/
    _layout.tsx      root stack
    index.tsx        redirects into the tabs
    (home)/
      _layout.tsx    the bottom tab bar
      index.tsx      dashboard: 4 stat boxes + recent files
      files.tsx      full list, tap a row to open the PDF
      contact.tsx
      setting.tsx
  component/
    screen.tsx       page shell: safe area + header
    header.tsx       title and the Upload button
    button.tsx
  store/
    useStore.ts      Zustand store: files, stats, triggerUpload
  theme/
    colors.ts        colours for StyleSheet
```

### A note on colours

There are two copies of the palette and they do not talk to each other:

- `src/theme/colors.ts` for `StyleSheet` (`COLORS.surface`)
- `tailwind.config.js` for NativeWind classes (`className="bg-surface"`)

If you add a colour, **add it to both**. Miss one and that syntax silently
renders nothing, which looks like a styling bug rather than a missing value.

---

## When things go wrong

**Uploads fail with "Network request failed"**
The phone cannot see your computer. Check the IP in `.env`, check both devices
are on the same Wi-Fi, and check the server is running. Remember the APK has the
URL compiled in — editing `.env` afterwards changes nothing.

**Uploads fail on a release build but work in development**
Android blocks plain HTTP in release builds. `usesCleartextTraffic` is already
set in `app.json`; if you regenerate `android/`, make sure it survived.

**"Unsupported FormDataPart implementation"**
Expo's `fetch` does not accept the old `{ uri, name, type }` object that most RN
tutorials show. Append a `File` from `expo-file-system` instead — see
`src/api/upload.ts`.

**Styling changes do nothing**
Tailwind config changes need a cache clear: `npx expo start -c`.

**Gradle refuses to start**
Almost always an old JDK. Gradle 9 needs 17 or newer; set `JAVA_HOME` as above.

---

## What is not done yet

- The file list lives in memory, so it empties when the app restarts. The
  backend already has `GET /api/upload` to load it back.
- Uploads have no timeout, so an unreachable server hangs for a while instead of
  failing quickly.
- Tapping a file opens it in the browser rather than inside the app.
