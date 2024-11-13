import Navbar from "@/components/navbar";

export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full h-full">
      <Navbar />
      <section className="w-full h-[calc(100%_-_5rem)] flex flex-col items-center">
        <section className="w-full max-w-7xl h-full">{children}</section>
      </section>
    </main>
  );
}
