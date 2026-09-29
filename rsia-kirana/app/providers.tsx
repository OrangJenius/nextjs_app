'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// Bungkus <body> di app/layout.tsx dengan komponen ini agar useSession()
// bisa dipakai di seluruh aplikasi. Contoh di app/layout.tsx:
//
//   import SessionProviderWrapper from '@/components/SessionProviderWrapper';
//
//   export default function RootLayout({ children }: { children: React.ReactNode }) {
//     return (
//       <html lang="id">
//         <body>
//           <SessionProviderWrapper>{children}</SessionProviderWrapper>
//         </body>
//       </html>
//     );
//   }
export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}