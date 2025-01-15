import 'css/tailwind.css'
import 'pliny/search/algolia.css'

import { Space_Grotesk } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider } from '@/components/search/SearchProvider'
import Header from '@/components/navigation/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/navigation/Footer'
import siteMetadata from '@/data/siteMetadata'
import { maintitle, maindescription } from '@/data/localeMetadata'
import { ThemeProvider } from '@/components/theme/ThemeContext'
import { Metadata } from 'next'
import { dir } from 'i18next'
import { LocaleTypes, locales } from './i18n/settings'
import TwSizeIndicator from '@/components/helper/TwSizeIndicator'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export async function generateMetadata({
  params,
}: {
  params: { locale: LocaleTypes }
}): Promise<Metadata> {
  const locale = (await params).locale

  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      default: maintitle[locale],
      template: `%s | ${maintitle[locale]}`,
    },
    description: maindescription[locale],
    openGraph: {
      title: maintitle[locale],
      description: maindescription[locale],
      url: './',
      siteName: maintitle[locale],
      images: [siteMetadata.socialBanner],
      locale: locale,
      type: 'website',
    },
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    twitter: {
      title: maintitle[locale],
      description: maindescription[locale],
      site: siteMetadata.siteUrl,
      creator: siteMetadata.author,
      card: 'summary_large_image',
      images: [siteMetadata.socialBanner],
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: LocaleTypes }
}) {
  const locale = (await params).locale

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" href="/static/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
      <link rel="shortcut icon" href="/static/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
        <TwSizeIndicator />
        <ThemeProvider>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <div className="flex h-screen flex-col justify-between font-sans">
              <SearchProvider>
                <Header />
                <main className="mb-auto">{children}</main>
              </SearchProvider>
              <Footer />
            </div>
          </SectionContainer>
        </ThemeProvider>
      </body>
    </html>
  )
}
