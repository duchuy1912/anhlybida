import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bida Anh Lý',
    short_name: 'Bida Anh Lý',
    description: 'Cửa hàng bán cơ bida và phụ kiện chuyên nghiệp',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e5a3e',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
