/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.ts$/, // Remplacez `.ext` par votre extension de fichier spécifique
      use: {
        loader: 'ts-loader', // Spécifiez le chargeur (loader) nécessaire
        options: {
          transpileOnly: true,
        },
      },
    });
    return config
  },
}
