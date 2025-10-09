#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT_DIR/android"

echo "[prepare-android-ci] Starting Android CI normalization..."

if [ ! -d "$ANDROID_DIR" ]; then
  echo "[prepare-android-ci] Android directory not present yet (first run may create it later). Exiting gracefully."
  exit 0
fi

GRADLE_PROPERTIES="$ANDROID_DIR/gradle.properties"

touch "$GRADLE_PROPERTIES"

add_prop () {
  local key="$1"
  local value="$2"
  if ! grep -q "^${key}=" "$GRADLE_PROPERTIES"; then
    echo "${key}=${value}" >> "$GRADLE_PROPERTIES"
    echo "  + Added ${key}"
  else
    echo "  = ${key} already present"
  fi
}

add_prop "android.useAndroidX" "true"
add_prop "android.enableJetifier" "true"
add_prop "org.gradle.jvmargs" "-Xmx3g -Dfile.encoding=UTF-8"
add_prop "org.gradle.parallel" "true"
add_prop "org.gradle.configuration-cache" "true"

ROOT_BUILD="$ANDROID_DIR/build.gradle"
if [ -f "$ROOT_BUILD" ]; then
  if ! grep -q "google()" "$ROOT_BUILD"; then
    sed -i '/repositories {/a \	google()' "$ROOT_BUILD"
    echo "  + Injected google() into root build.gradle"
  fi
  if ! grep -q "mavenCentral()" "$ROOT_BUILD"; then
    sed -i '/repositories {/a \	mavenCentral()' "$ROOT_BUILD"
    echo "  + Injected mavenCentral() into root build.gradle"
  fi
else
  echo "WARNING: root build.gradle not found."
fi

APP_BUILD="$ANDROID_DIR/app/build.gradle"
if [ -f "$APP_BUILD" ]; then
  echo "[prepare-android-ci] App module build.gradle present."
else
  echo "WARNING: app module build.gradle missing."
fi

echo "[prepare-android-ci] Completed normalization."