
import QueryProvider from "./components/QueryProvider";

export const metadata = {
  title: "SisPET",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
  return (
    <html lang="en" >
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
