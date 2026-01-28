import styles from './Hero.module.css';

export function Hero() {
     return (
          <section className={styles.hero}>
               <h1 className={`${styles.title} text-hero`}>
                    Visualize the <span className={styles.badge}>Compile</span> Process
               </h1>
               <p className={styles.subtitle}>
                    An interactive journey through <span className={styles.badge}>Tokenization</span>,{' '}
                    <span className={styles.badge}>Parsing</span>, and{' '}
                    <span className={styles.badge}>Execution</span>.
                    See how code becomes action.
               </p>

               {/* Floating Icons Decorations */}
               <div className={styles.floatingIcon} style={{ top: '15%', left: '10%', fontSize: '3rem', animationDelay: '0s' }}>
                    {'{ }'}
               </div>
               <div className={styles.floatingIcon} style={{ top: '20%', right: '15%', fontSize: '2.5rem', animationDelay: '1s' }}>
                    {'</>'}
               </div>
               <div className={styles.floatingIcon} style={{ bottom: '25%', left: '20%', fontSize: '2rem', animationDelay: '2s' }}>
                    {';'}
               </div>
               <div className={styles.floatingIcon} style={{ bottom: '15%', right: '10%', fontSize: '3.5rem', animationDelay: '1.5s' }}>
                    {'01'}
               </div>
          </section>
     );
}
