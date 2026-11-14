const path = require('path');
const { withProjectBuildGradle } = require('@expo/config-plugins');

// Windows caps CreateDirectory at 248 chars. Every native module's default
// .cxx dir sits deep inside node_modules, so the C++ build blows past it.
// Staging native builds on a short path keeps them under the cap.
//
// No-op off Windows, where none of this applies.
const MARKER = '// expo-config-plugin: windows native build staging';

const withWindowsNativePaths = (config) => {
  if (process.platform !== 'win32') return config;

  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error(
        'withWindowsNativePaths expects a groovy build.gradle, got ' +
          cfg.modResults.language,
      );
    }

    if (cfg.modResults.contents.includes(MARKER)) return cfg;

    // keep the staging root on the project's own drive, and short
    const drive = path.parse(cfg.modRequest.projectRoot).root.replace(/\\/g, '/');
    const staging = `${drive}x`;

    const block = `${MARKER}
subprojects { sp ->
  ["com.android.library", "com.android.application"].each { id ->
    sp.plugins.withId(id) {
      sp.android.externalNativeBuild.cmake.buildStagingDirectory = sp.file("${staging}/\${sp.name}")
    }
  }
}

`;

    // must land before the root plugins, which start configuring subprojects.
    // setting it later throws "It is too late to set buildStagingDirectory".
    const anchor = 'apply plugin: "expo-root-project"';
    if (!cfg.modResults.contents.includes(anchor)) {
      throw new Error('withWindowsNativePaths could not find ' + anchor);
    }

    cfg.modResults.contents = cfg.modResults.contents.replace(
      anchor,
      block + anchor,
    );

    return cfg;
  });
};

module.exports = withWindowsNativePaths;
