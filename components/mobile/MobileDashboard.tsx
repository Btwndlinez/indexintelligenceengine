'use client';

import { useState } from 'react';
import MobileHeader from './MobileHeader';
import MobileSearchCard from './MobileSearchCard';
import MobileResults from './MobileResults';

export default function MobileDashboard() {
  const [searchData, setSearchData] = useState<{ companies: any[]; count: number } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  return (
    <div className="min-h-screen bg-black pb-24">
      <MobileHeader />

      <div className="p-4 space-y-6">
        <MobileSearchCard
          onSearch={(data) => {
            setSearchData(data);
            setSearchLoading(false);
          }}
          onSearchStart={() => setSearchLoading(true)}
        />
        <MobileResults results={searchData?.companies ?? null} loading={searchLoading} />
      </div>
    </div>
  );
}
