import type { Metadata } from 'next'
import { Fraunces, Source_Sans_3, Source_Serif_4 } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'
import 'katex/dist/katex.min.css'

const body = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
})

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
})

const math = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-math',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'AP Physics C & Pre-Calc 20-Day Mastery',
  description:
    'Interactive 20-day mastery course connecting pre-calculus to AP Physics C with graphs, practice, and daily quizzes.',
}

const themeBoot = `(function(){try{var k='ap-physics-mastery-progress-v2';var r=localStorage.getItem(k);var t='dark';if(r){var p=JSON.parse(r);if(p&& (p.theme==='light'||p.theme==='dark')) t=p.theme;}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${body.variable} ${display.variable} ${math.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
