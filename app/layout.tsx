import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ApolloWrapper } from "@/lib/apollo-wrapper"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Todo by Aemitez",
  description: "A full-stack todo application with Next.js and Hasura",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <footer className="py-4 text-center text-sm text-muted-foreground bg-white border-t">
              Created by <span className="font-semibold text-primary">Aemitez</span>
            </footer>
          </div>
          <Toaster />
        </ApolloWrapper>
      </body>
    </html>
  )
}
