/**
 * Header - Server Component
 * Navigation avec menus déroulants pour régions et départements
 */

import Link from 'next/link';
import { getAllRegions, getAllDepartements, getAllTypeCategories } from '@/lib/data/clubs';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';

export default async function Header() {
  const [regions, departements, typeCategories] = await Promise.all([
    getAllRegions(),
    getAllDepartements(),
    getAllTypeCategories(),
  ]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-bg-primary/80">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - For Good People */}
          <Link
            href="/"
            className="flex items-baseline"
            aria-label="For Good People - Accueil"
          >
            <span className="text-accent-primary text-2xl font-bold">F</span>
            <span className="text-text-secondary text-[10px] font-medium -ml-0.5">or</span>
            <span className="text-accent-primary text-2xl font-bold ml-0.5">G</span>
            <span className="text-text-secondary text-[10px] font-medium -ml-0.5">ood</span>
            <span className="text-text-primary text-xl font-bold ml-1.5">People</span>
          </Link>

          {/* Navigation Desktop */}
          <DesktopNav regions={regions} departements={departements} typeCategories={typeCategories} />

          {/* CTA Button Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/#regions" className="btn-primary text-sm">
              Explorer les clubs
            </Link>
          </div>

          {/* Menu Mobile */}
          <MobileMenu regions={regions} departements={departements} typeCategories={typeCategories} />
        </div>
      </div>
    </header>
  );
}
