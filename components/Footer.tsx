import styles from './Footer.module.css';

export function Footer() {
     const currentYear = new Date().getFullYear();

     return (
          <footer className={styles.footer}>
               <p className={styles.text}>
                    © {currentYear} Compilr. All rights reserved.
               </p>
               <div className={styles.socials}>
                    <a
                         href="https://github.com/sahilmane69/compilr"
                         target="_blank"
                         rel="noopener noreferrer"
                         className={styles.link}
                    >
                         GitHub
                    </a>
                    <a
                         href="https://sahilmane-one.vercel.app"
                         target="_blank"
                         rel="noopener noreferrer"
                         className={styles.link}
                    >
                         Portfolio
                    </a>
               </div>
          </footer>
     );
}
