import PRODUCTS from "./products";
import { ProductCard } from "./ProductCard";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className="mx-auto max-w-[960px] flex flex-wrap">
      {PRODUCTS.map((product) => (
        <div key={product.id} className={styles.card}>
          <ProductCard product={product} />
        </div>
      ))}
    </main>
  );
}
