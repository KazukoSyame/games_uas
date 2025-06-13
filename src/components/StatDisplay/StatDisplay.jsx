import styles from './StatDisplay.module.css';

function StatDisplay({ hunger, money, stamina, happy, spiritual }){
    return (
        <div className={styles.statsContainer}> 
          <div className={styles.statRow}>
            <span className={styles.statName}>Hunger:</span>
            <span className={styles.statValue}>{hunger}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statName}>Money:</span>
            <span className={styles.statValue}>{money}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statName}>Stamina:</span>
            <span className={styles.statValue}>{stamina}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statName}>Happy:</span>
            <span className={styles.statValue}>{happy}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statName}>Spiritual:</span>
            <span className={styles.statValue}>{spiritual}</span>
          </div>
        </div>
    );
}

export default StatDisplay;