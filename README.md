# NativeUpload

Expo + NativeWind app that uploads files to a server and views them in the app.
PDFs and images render inside the app; Word, Excel and PowerPoint are converted
to PDF by the server first.

Backend repo: https://github.com/shivansh983/node-for-auth

You need **both** repos. Start the backend first.

---

## 1. Start the backend

```bash
git clone https://github.com/shivansh983/node-for-auth.git
cd node-for-auth
cp .env.example .env
docker compose up -d --build
```

Needs only Docker Desktop. Postgres and the `files` table come with it. Full
details in that repo's README.

## 2. Run the app

```bash
git clone https://github.com/shivansh983/native-wind.git
cd native-wind
npm install
cp .env.example .env     # optional, the Config tab overrides it
npx expo start --dev-client
```

## 3. Point the app at the server

The phone and the computer must be on the **same Wi-Fi**.

1. Get the computer's Wi-Fi IP — `ipconfig` on Windows, *IPv4 Address* under the
   Wi-Fi adapter.
2. In the app, open the **Config** tab, type `http://<that-ip>:5000`, press
   **Test**, then **Save**.

`Test` says whether the server answered. If nothing replies, it is usually the
Windows firewall blocking inbound TCP 5000:

```powershell
New-NetFirewallRule -DisplayName "Upload API 5000" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

---

## Building an APK

`android/` is generated, not committed, so generate it first:

```bash
npx expo prebuild --platform android --clean
cd android
./gradlew assembleRelease
```

The APK lands at `android/app/build/outputs/apk/release/app-release.apk`.

Needs JDK 17 and the Android SDK (Android Studio installs both). The release
build is signed with the debug keystore, which is fine for testing but not for
the Play Store.

`EXPO_PUBLIC_API_URL` is baked in at build time, but the **Config** tab
overrides it and remembers the value, so one APK works against any server.

---

## What it does

| Screen        | What you can do                                                |
| ------------- | -------------------------------------------------------------- |
| **Dashboard** | how many files are stored, total size, when the last one landed |
| **Files**     | every row from the database — tap to view, **Rename** to rename, long-press to open in another app, pull down to refresh |
| **Config**    | set and test the server address                                 |

Picking a file asks for a name before it uploads. That name is what goes in the
database and on the server's disk, and **Rename** changes it later.

The list is read from Postgres, so it survives closing the app — pull down to
refresh after a restart.

## Notes

- `src/api/config.ts` keeps the server address in secure storage, so it is only
  typed once per device.
- There is no login. Anyone on the Wi-Fi can upload and read files, which is
  fine for testing on a trusted network.
- Office previews need LibreOffice, which ships inside the backend's Docker
  image. Without Docker those files upload but will not preview.
