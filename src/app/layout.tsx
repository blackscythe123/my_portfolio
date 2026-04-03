import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Simiyon Vinscent Samuel | Automation & Web3 Engineer',
  description: 'Engineering Student & Developer from India. I craft intelligent Automation Systems, Web3 Protocols, and Full Stack Apps.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className='antialiased'>
        {children}
      </body>
    </html>
  );
}

