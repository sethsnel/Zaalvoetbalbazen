import { NextPage } from "next";

import { useAppSettings } from "../lib/appSettingsDBO";

import styles from "../styles/Home.module.css";
import { useRef } from "react";

const SeizoenenBeheer: NextPage = () => {
  const newSeasonInput = useRef<HTMLInputElement | null>(null);
  const { appSettings, addSeason, setCurrentSeason } = useAppSettings("");

  const currentSeasonSelect = (
    <select value={appSettings.activeSeason} onChange={(season) => {console.info(season.currentTarget.value); setCurrentSeason(season.currentTarget.value)}}>
      {Object.keys(appSettings.seasons).map((season) => {
        return (
          <option
            key={season}
            value={season}
          >
            {decodeURI(season)}
          </option>
        );
      })}
    </select>
  );

  return (
    <div className={styles.container}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h3 className="mb-3">Huidige seizoen: {currentSeasonSelect}</h3>

          <div className={styles.sessions}>
            <h2 className="mb-3">Seizoen toevoegen</h2>
            <input type="text" ref={newSeasonInput} />
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => {
                if (newSeasonInput.current !== null) {
                  addSeason(newSeasonInput.current.value);
                  newSeasonInput.current.value = "";
                }
              }}
              disabled={newSeasonInput.current === null}
            >
              Seizoen toevoegen
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeizoenenBeheer;
