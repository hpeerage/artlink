'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export default function NextAuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider basePath="/api/auth">{children}</SessionProvider>;
}
