"use client";

import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

export function LoadingScreen() {
     const [isVisible, setIsVisible] = useState(true);

     useEffect(() => {
          // Keep visible for a set time (e.g., 2.2s) to allow animation to play, then fade out
          const timer = setTimeout(() => {
               setIsVisible(false);
          }, 2200);

          return () => clearTimeout(timer);
     }, []);

     return (
          <div className={`${styles.loaderContainer} ${!isVisible ? styles.hidden : ''}`}>
               <div className={styles.loaderContent}>
                    <div className={styles.loaderText}>
                         <span className={styles.brackets}>&#123;</span>
                         <span style={{ margin: '0 8px', color: '#ededed' }}>Compilr</span>
                         <span className={styles.brackets}>&#125;</span>
                    </div>
               </div>
          </div>
     );
}
