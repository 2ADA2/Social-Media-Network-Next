'use client'

import { Tabs } from "@/shared/ui/tabs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";



export default function ProfilePage({ProfileInfo, Statistics}:{ProfileInfo: React.ReactNode, Statistics:React.ReactNode}) {
  const t = useTranslations('profile');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get('tab') === 'stats' ? 'stats' : 'info';

  const TABS = [
    { id: 'info', label: t('tabs.info') },
    { id: 'stats', label: t('tabs.stats') },
  ];

  const handleTabChange = (tab: string) => {
    router.replace(`${pathname}?tab=${tab}`);
  };

  return (
    <>
      <h1 hidden>{ t('title') }</h1>

      <div className='tabs-container'>
        <Tabs tabs={ TABS } activeTab={ activeTab } onChange={ handleTabChange }/>
      </div>

      { activeTab === 'info' && ProfileInfo }
      { activeTab === 'stats' && Statistics }
    </>
  );
};