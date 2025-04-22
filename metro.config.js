const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// ✅ Add support for .html files as assets
defaultConfig.resolver.assetExts.push("html");

// ✅ Fix: Also ensure .cjs files work for Reanimated or other deps
defaultConfig.resolver.sourceExts.push("cjs");

module.exports = wrapWithReanimatedMetroConfig(defaultConfig);
