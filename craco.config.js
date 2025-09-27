// CRACO Configuration for optimal hot reload and instant change detection
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Disable persistent caching to prevent chunk errors
      if (webpackConfig.cache) {
        webpackConfig.cache = false;
      }

      // Enhanced cache busting for instant updates
      if (webpackConfig.output) {
        webpackConfig.output.filename = env === 'production'
          ? 'static/js/[name].[contenthash:8].js'
          : 'static/js/[name].[fullhash:8].js';
        webpackConfig.output.chunkFilename = env === 'production'
          ? 'static/js/[name].[contenthash:8].chunk.js'
          : 'static/js/[name].[fullhash:8].chunk.js';

        // Force immediate updates in development
        if (env === 'development') {
          webpackConfig.output.pathinfo = false;
          webpackConfig.output.publicPath = '/';
        }
      }

      // Optimize for faster hot reloads
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: env === 'development' ? false : webpackConfig.optimization.splitChunks,
      };

      // Enhanced file watching for instant detection
      if (env === 'development') {
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          poll: 1000, // Check for changes every second
          aggregateTimeout: 300, // Delay rebuild after change
          ignored: /node_modules/,
        };
      }

      return webpackConfig;
    },
  },
  devServer: {
    // Enhanced dev server configuration for instant updates
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    hot: true, // Enable hot module replacement
    liveReload: true, // Enable live reload
    watchFiles: {
      paths: ['src/**/*', 'public/**/*'],
      options: {
        usePolling: true, // Use polling for better change detection
        interval: 1000, // Poll every second
      },
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
  },
};