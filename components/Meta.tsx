import React from 'react';
import Head from 'next/head';

export type MetaProps = {
    title?: string,
    desc?: string,
    image?: string,
    url?: string
}

export function Meta ({ title, desc, image, url }: MetaProps) {
   
    return (
        <Head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>

            <title>Champion Trading Community</title>
            <meta name="description" content={"CTC merupakan komunitas trading khususnya Crypto Currency. Tujuan dibentuknya CTC ini agar masyakarat luas dapat belajar crypto Bersama para trainer dengan ,metode pembelajaran yang mudah dipahami, dan para peserta yang ikut kelas akan tetap belajar lebih lanjut lagi. CTC punya 4 trainer dan miliki kemampuan atau menguasai bidangnya masing-masing"} />

            <link rel="shortcut icon" href="/images/favicon.ico"></link>

            {/* <link rel="stylesheet" href="/css/style.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"></link> */}
            {/* <link rel="stylesheet" href="/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"></link> */}
            {/* <link href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" rel="stylesheet"></link> */}
            {/* <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Roboto:100,300,300i,400,700,900"></link> */}
        </Head>
    );
};