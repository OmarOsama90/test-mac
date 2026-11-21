# Highness Vet Clinic (Mac app)

Tauri 2 + React. Mac (Intel + Apple Silicon, macOS 10.15+) and Windows 10/11 (64-bit).

## بناء التطبيق بدون ماك (GitHub)
1. ارفع الفولدر على GitHub (repo خاص).
2. تبويب Actions ← "Build macOS app" ← Run workflow.
3. بعد ~10-15 دقيقة نزّل الـ artifact: ملف `.dmg`.
4. أول فتح: كليك يمين على التطبيق ← Open ← Open (لأنه غير موقّع من Apple).

## ويندوز
Actions ← "Build Windows app" ← Run workflow ← نزّل ملف `...-setup.exe` وثبّته (بدون صلاحيات أدمن).
لو ويندوز قديم من غير WebView2، المثبّت بيحمّله تلقائياً (محتاج إنترنت مرة واحدة).
البيانات: `%APPDATA%\com.highness.vetclinic\cases.json`

## بناء محلي على ماك
    npm install --legacy-peer-deps
    npx tauri build --target universal-apple-darwin   # needs Rust (rustup) + Xcode CLT
    npx tauri dev                                      # للتجربة

## البيانات
تتخزن في: `~/Library/Application Support/com.highness.vetclinic/cases.json`
مع نسخة احتياطية تلقائية `cases.bak.json`. زرار Backup بيحفظ نسخة JSON في أي مكان.
