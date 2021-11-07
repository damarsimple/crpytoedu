import dynamic from "next/dynamic";

/**
 * Purpose :
 * ApexChart library is not compatible with nextjs SSR mode because
 * it need to access window object so we have to import the library
 * after we sure that this library is loaded on the browser side
 * we can use next dynamic import with option ssr disabled
 * alternative would be to add check if browser but this is better and encouraged
 */

const DynamicComponent = dynamic(() => import("./ChartComponent"), {
  ssr: false,
});

export default DynamicComponent;
