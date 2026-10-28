'use client'

import { Tabs } from "@/shared/ui/tabs";
import { ProfileInfo } from "./profile-info";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader } from "@/shared/ui/loader";
import { useTranslations } from "next-intl";

const Statistics = dynamic(() => import('./statistics').then(m => m.Statistics), {
  ssr: false,
  loading: () => <Loader isBlock/>
});

export default function ProfilePage() {
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

      { activeTab === 'info' && <ProfileInfo/> }
      { activeTab === 'stats' && <Statistics/> }
    </>
  );
};