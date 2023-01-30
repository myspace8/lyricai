import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Generate lyrics in seconds."
          />
          <meta property="og:site_name" content="" />
          <meta
            property="og:description"
            content="Generate lyrics in seconds."
          />
          <meta property="og:title" content="AI Lyric Generator" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="AI Lyric Generator" />
          <meta
            name="twitter:description"
            content="Generate lyrics in seconds."
          />
          <meta
            property="og:image"
            content=""
          />
          <meta
            name="twitter:image"
            content=""
          />
        </Head>
        <body className="bg-secondary-black overflow-hidden">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
