import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ApolloWrapper } from "@/lib/apollo-wrapper"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Todo App",
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
          {children}
          <Toaster />
        </ApolloWrapper>
      </body>
    </html>
  )
}
