'use client';

import { SessionConsumer } from './SessionWrapper';
import UserMenu from './UserMenu';

export default function BlankPageClient() {
  return (
    <SessionConsumer>
      {({ data: session }) => (
        <div className="flex items-center">
          {session && <UserMenu />}
        </div>
      )}
    </SessionConsumer>
  );
}