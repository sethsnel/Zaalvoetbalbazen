import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="nl">  {/* Verwijder data-bs-theme="auto" */}
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}