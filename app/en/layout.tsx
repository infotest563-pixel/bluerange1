import type { ReactNode } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default async function EnglishLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header lang="en" />
            {children}
            <Footer lang="en" />
        </>
    );
}
