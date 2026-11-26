import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },

  // 90 é usado nas fotos da home; 75 segue sendo o padrão das outras rotas.
  images: { qualities: [75, 90] },

  async redirects() {
    return [
      // Endereço antigo da bio, mantido para links já compartilhados.
      { source: '/bioh', destination: '/bio', permanent: true },
    ];
  },
};

export default nextConfig;
