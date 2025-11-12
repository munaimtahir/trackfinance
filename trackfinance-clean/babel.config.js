module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // any plugins you need, e.g.
      // 'expo-router/babel',
    ],
  };
};
