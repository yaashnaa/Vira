// metro.config.js
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
const { getDefaultConfig } = require("expo/metro-config");

// start from Expo’s default
const config = getDefaultConfig(__dirname);

// support .html as assets
config.resolver.assetExts.push("html");

// support .cjs modules
config.resolver.sourceExts.push("cjs");

// ←–– This is the important bit from SO:
// disable the new package-exports resolver so Firebase’s native modules
// get registered properly under Hermes
config.resolver.unstable_enablePackageExports = false;

module.exports = wrapWithReanimatedMetroConfig(config);
