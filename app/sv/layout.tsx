import type { ReactNode } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default async function SwedishLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header lang="sv" />
            {children}
            <Footer lang="sv" />
        </>
    );
}
