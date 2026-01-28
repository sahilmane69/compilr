import styles from './AuthorBadge.module.css';

export function AuthorBadge() {
     return (
          <a
               href="https://sahilmane-one.vercel.app"
               target="_blank"
               rel="noopener noreferrer"
               className={styles.badge}
          >
               Made by Sahil Mane ↗
          </a>
     );
}
