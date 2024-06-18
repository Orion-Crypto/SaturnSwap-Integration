'use client';

import { InfoTab } from '@/components/Elements/InfoTab';
import { ModalContainer } from '@/components/Layouts/Main/ModalContainer';
import { MobileNavbar } from '@/components/Layouts/Navbar/MobileNavbar';
import { Navbar } from '@/components/Layouts/Navbar/Navbar';
import { useGetInfoTab } from '@/hooks/Component/info-tab.hook';
import { usePathname } from 'next/navigation';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { data, isLoading }: any = useGetInfoTab();

    // Determine if the current page is the homepage
    const showInfoTab = !isLoading && data && Object.keys(data).length > 0;
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    return (
        <>
            <ModalContainer />
            <div className="flex h-full w-full flex-col justify-start overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#030418] from-50% to-space-600">
                {!isHomePage && <Navbar />}
                {!isHomePage && <MobileNavbar />}
                {showInfoTab && <InfoTab />}
                <div>{children}</div>
            </div>
        </>
    );
};
