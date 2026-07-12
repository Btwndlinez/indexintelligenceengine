import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DOMAIN_MAP: Record<string, string> = {
  'hardhatrequired.com': 'hhr',
  'www.hardhatrequired.com': 'hhr',
  'sparkywiz.com': 'sparkywiz',
  'www.sparkywiz.com': 'sparkywiz',
  'gcleadhub.com': 'gcleadhub',
  'www.gcleadhub.com': 'gcleadhub',
  'madefrom.us': 'madefrom',
  'www.madefrom.us': 'madefrom',
  'intelligentindexengine.com': 'iie',
  'www.intelligentindexengine.com': 'iie',
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/static') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const tenant = DOMAIN_MAP[hostname] || url.searchParams.get('__tenant');

  if (tenant) {
    url.pathname = `/${tenant}${url.pathname}`;
    url.searchParams.set('__tenant', tenant);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
