import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          {/* <link
            href="https://fonts.googleapis.com/css2?family=Kalam&family=Montserrat&family=Open+Sans&family=Roboto&display=swap"
            rel="stylesheet"
          /> */}

          
          <link rel="stylesheet" 
            href="https://fonts.googleapis.com/css?family=Roboto:100,300,300i,400,700,900&display=swap"
          />

        </Head>
        <body> 
          <Main />
          <NextScript />
        </body>

        {/* <script src="/js/core.min.js" async></script> */}
        {/* <script src="/js/script.js" async></script> */}
      </Html>
    );
  }
}

export default MyDocument;
