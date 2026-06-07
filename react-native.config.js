module.exports = {
  dependencies: {
    // Exclude react-native-nitro-modules from React Native autolinking
    // It uses its own integration system (Nitro Modules, not Turbo Modules)
    'react-native-nitro-modules': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
