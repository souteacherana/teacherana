import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },

  async redirects() {
    return [
      // Enquanto não existe uma home própria, a raiz do site leva para a bio.
      // Temporário (307) para não ficar em cache quando a home for criada.
      { source: '/', destination: '/bioh', permanent: false },
    ];
  },
};

export default nextConfig;
