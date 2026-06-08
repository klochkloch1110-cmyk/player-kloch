#!/usr/bin/env node

/**
 * Postinstall script для React Native 0.85+ с react-native-nitro-modules
 * 
 * Проблема: React Native autolinking пытается добавить nitro-modules в CMake,
 * но nitro-modules использует собственную архитектуру (Nitro), а не TurboModules/Codegen.
 * 
 * Решение: Создаём stub-директорию codegen/jni для nitro-modules,
 * чтобы CMake не падал с ошибкой "directory not found" и мог найти
 * ожидаемый target react_codegen_NitroModulesSpec.
 */

const fs = require('fs');
const path = require('path');

const nitroModulesCodegenDir = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-nitro-modules',
  'android',
  'build',
  'generated',
  'source',
  'codegen',
  'jni'
);

try {
  if (!fs.existsSync(nitroModulesCodegenDir)) {
    fs.mkdirSync(nitroModulesCodegenDir, { recursive: true });

    console.log('✅ Создана директория codegen для react-native-nitro-modules');
  }

  // Создаём stub CMake target, который ожидает React Native autolinking.
  // React Native линкует этот target обычным способом, поэтому INTERFACE library
  // не подходит — нужен обычный пустой STATIC target.
  // Реальная интеграция nitro-modules происходит через его android/CMakeLists.txt.
  const dummyCppFile = path.join(nitroModulesCodegenDir, 'dummy.cpp');
  fs.writeFileSync(dummyCppFile, 'void react_codegen_nitro_modules_spec_dummy() {}\n');

  const cmakeFile = path.join(nitroModulesCodegenDir, 'CMakeLists.txt');
  fs.writeFileSync(
    cmakeFile,
    [
      '# Stub CMakeLists.txt for react-native-nitro-modules compatibility',
      'cmake_minimum_required(VERSION 3.13)',
      'add_library(react_codegen_NitroModulesSpec STATIC dummy.cpp)',
      '',
    ].join('\n')
  );
} catch (error) {
  console.warn('⚠️  Не удалось создать директорию codegen для nitro-modules:', error.message);
  // Не падаем, чтобы не блокировать установку
}
