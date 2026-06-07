@echo off
title Open in Android Studio
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"
set "CLIENT_DIR=%~dp0client"

cd /d "%CLIENT_DIR%"
echo Building web app first...
call npm run build
echo Syncing to Android...
call npx cap sync android
echo Opening Android Studio...
set "CAPACITOR_ANDROID_STUDIO_PATH=C:\Program Files\Android\Android Studio\bin\studio64.exe"
call npx cap open android
pause
