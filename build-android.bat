@echo off
title Karigori Android Build
color 0A
echo.
echo  ============================================
echo    Karigori Android App Builder
echo  ============================================
echo.

:: ── Set paths ──────────────────────────────────
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"
set "CLIENT_DIR=%~dp0client"
set "ANDROID_DIR=%CLIENT_DIR%\android"

:: ── Verify Java ─────────────────────────────────
echo [1/4] Checking Java...
java -version 2>&1 | findstr "version"
if errorlevel 1 (
  echo  ERROR: Java not found at %JAVA_HOME%
  pause & exit /b 1
)
echo  OK
echo.

:: ── Build web app ───────────────────────────────
echo [2/4] Building web app (Vite)...
cd /d "%CLIENT_DIR%"
call npm run build
if errorlevel 1 (
  echo  ERROR: Web build failed
  pause & exit /b 1
)
echo  OK
echo.

:: ── Sync to Android ─────────────────────────────
echo [3/4] Syncing to Android...
call npx cap sync android
if errorlevel 1 (
  echo  ERROR: Capacitor sync failed
  pause & exit /b 1
)
echo  OK
echo.

:: ── Build APK ───────────────────────────────────
echo [4/4] Building Android APK...
cd /d "%ANDROID_DIR%"
call gradlew.bat assembleDebug
if errorlevel 1 (
  echo  ERROR: APK build failed
  pause & exit /b 1
)

:: ── Done ────────────────────────────────────────
echo.
echo  ============================================
echo    BUILD SUCCESSFUL!
echo  ============================================
echo.
echo  APK location:
echo  %ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk
echo.
echo  Install on device:
echo  adb install "%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk"
echo.

:: Copy APK to desktop for easy access
copy "%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk" "%USERPROFILE%\Desktop\Karigori.apk" 2>nul
if not errorlevel 1 echo  APK also copied to Desktop as Karigori.apk

pause
