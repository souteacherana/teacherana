import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },

  async redirects() {
    return [
      // Enquanto não existe uma home própria, a raiz do site leva para a bio.
      // Temporário (307) para não ficar em cache quando a home for criada.
      { source: '/', destination: '/bio', permanent: false },
      // Endereço antigo da bio, mantido para links já compartilhados.
      { source: '/bioh', destination: '/bio', permanent: true },
    ];
  },
};

export default nextConfig;
