import type {Metadata} from "next";
import {Geist, Geist_Mono, Noto_Sans_SC, Noto_Serif_SC} from "next/font/google";
import {NextIntlClientProvider, hasLocale} from "next-intl";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";
import {localeOption, routing} from "@/i18n/routing";
import type commonMessages from "@/i18n/messages/zh-CN/common.json";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const geist = Geist({subsets: ["latin"], variable: "--font-geist-sans"});
const geistMono = Geist_Mono({subsets: ["latin"], variable: "--font-geist-mono"});
const notoSans = Noto_Sans_SC({variable: "--font-noto-sans-sc", display: "swap", preload: false});
const notoSerif = Noto_Serif_SC({variable: "--font-noto-serif-sc", display: "swap", preload: false});

type Props = {children: React.ReactNode; params: Promise<{locale: string}>};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Props["params"]}): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages({locale});
  const common = messages.common as typeof commonMessages;
  return {
    metadataBase: new URL(siteUrl),
    title: {default: common.siteTitle, template: `%s · ${common.brandName}`},
    description: common.siteDescription,
    icons: {
      icon: [{url:"/brand/favicon.svg?v=blocks-1",type:"image/svg+xml"},{url:"/brand/icon-32.png?v=blocks-1",type:"image/png",sizes:"32x32"}],
      apple: {url:"/brand/apple-touch-icon.png",sizes:"180x180",type:"image/png"}
    },
    openGraph: {type: "website", locale: localeOption(locale)?.ogLocale, siteName: common.brandName}
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <html lang={locale} className={`${geist.variable} ${geistMono.variable} ${notoSans.variable} ${notoSerif.variable}`}><body><NextIntlClientProvider locale={locale} messages={null}>{children}</NextIntlClientProvider></body></html>;
}
