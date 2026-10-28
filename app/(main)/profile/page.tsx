'use client'

import "./profile-page.css";
import { useTranslation } from "react-i18next";
import { Tabs } from "@/shared/ui/tabs";
import { ProfileInfo } from "./_components/profile-info";
import { Statistics } from "./_components/statistics";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function Profile() {
  const { t } = useTranslation('profile');
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
    <div className='profile-page'>
      <h1 hidden>{ t('title') }</h1>

      <div className='tabs-container'>
        <Tabs tabs={ TABS } activeTab={ activeTab } onChange={ handleTabChange }/>
      </div>

      { activeTab === 'info' && <ProfileInfo/> }
      { activeTab === 'stats' && <Statistics/> }

    </div>
  );
};