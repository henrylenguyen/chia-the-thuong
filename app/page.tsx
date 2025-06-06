/**
 * Root Page - Redirect to Home
 * Trang gốc redirect đến trang home
 */

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/home');
}
