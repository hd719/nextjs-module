import Image from "next/image";

import { Product } from "./products";

import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  // return (
  //   <div className={styles.card}>
  //     <div className={styles.cardContainer}>
  //       <div className={styles.imageContainer}>
  //         <Image
  //           src={product.image}
  //           alt={product.title}
  //           width={300}
  //           height={300}
  //         />
  //       </div>
  //       <div className={styles.infoContainer}>
  //         <h1 className={styles.title}>{product.title}</h1>
  //         <p className={styles.price}>{product.price}</p>
  //       </div>
  //     </div>
  //   </div>

  // return (
  //   <div className={styles.card}>
  //     <div className="flex flex-col @md:flex-row">
  //       <div className="w-full @md:w-1/4">
  //         <Image
  //           src={product.image}
  //           alt={product.title}
  //           width={300}
  //           height={300}
  //           className="w-full h-auto rounded-tl-2xl rounded-tr-2xl @md:rounded-tr-none rounded-bl-none @md:rounded-bl-2xl"
  //         />
  //       </div>
  //       <div className={styles.infoContainer}>
  //         <h1 className={styles.title}>{product.title}</h1>
  //         <p className={styles.price}>{product.price}</p>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className={`${styles.card} bg-red-400`}>
      <div className={styles.cardContainer}>
        <div className={styles.imageContainer}>
          <Image
            src={product.image}
            alt={product.title}
            width={300}
            height={300}
            className={styles.image}
          />
        </div>
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.price}>{product.price}</p>
        </div>
      </div>
    </div>
  );
};
