import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import { ToastProvider } from "@/components/ToastProvider";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "Sanjpriya — Heritage Moderne Ethnic Fashion",
    template: "%s | Sanjpriya",
  },
  description:
    "Discover Sanjpriya's curated collection of premium ethnic wear — Kurtis, Blouses, and Dresses that blend timeless Indian craftsmanship with contemporary luxury.",
  keywords: ["kurtis", "blouses", "ethnic dresses", "Indian fashion", "women's ethnic wear", "Sanjpriya"],
  openGraph: {
    siteName: "Sanjpriya",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <ToastProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
