import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },

  async redirects() {
    return [
      // Endereço antigo da bio, mantido para links já compartilhados.
      { source: '/bioh', destination: '/bio', permanent: true },
    ];
  },
};

export default nextConfig;
