const { withProjectBuildGradle } = require('@expo/config-plugins');

// codegen paths run past 260 chars, so ninja has to be 1.11+ and
// LongPathsEnabled on. cmake 3.22 ships 1.10, so pin a newer cmake.
const CMAKE_VERSION = '3.31.6';
const MARKER = '// expo-config-plugin: cmake version';

const withCmakeVersion = (config) => {
  if (process.platform !== 'win32') return config;

  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error(
        'withCmakeVersion expects a groovy build.gradle, got ' +
          cfg.modResults.language,
      );
    }

    if (cfg.modResults.contents.includes(MARKER)) return cfg;

    const block = `${MARKER}
subprojects { sp ->
  ["com.android.library", "com.android.application"].each { id ->
    sp.plugins.withId(id) {
      sp.android.externalNativeBuild.cmake.version = "${CMAKE_VERSION}"
    }
  }
}

`;

    // must land before the root plugins configure subprojects
    const anchor = 'apply plugin: "expo-root-project"';
    if (!cfg.modResults.contents.includes(anchor)) {
      throw new Error('withCmakeVersion could not find ' + anchor);
    }

    cfg.modResults.contents = cfg.modResults.contents.replace(
      anchor,
      block + anchor,
    );

    return cfg;
  });
};

module.exports = withCmakeVersion;
