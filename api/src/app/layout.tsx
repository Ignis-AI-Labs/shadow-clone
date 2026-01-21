export const metadata = {
  title: 'Shadow Clone API',
  description: 'License validation API for Shadow Clone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
