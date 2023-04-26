import type { NextPage } from "next";
import dayjs from "dayjs";
import { useRef, useState } from "react";

import { useSeasonDatesManagement } from "../lib/seasonDBO";
import { useAppSettings } from "../lib/appSettingsDBO";

import styles from "../styles/Home.module.css";

const SessionManagement: NextPage = () => {
  const datePickerRef = useRef<HTMLInputElement | null>(null);
  const { appSettings } = useAppSettings("");
  const activeSeason = appSettings?.activeSeason || "";
  const { seasonDates, addSessionDate, removeSessionDate } =
    useSeasonDatesManagement(activeSeason);
  const filteredDates = Object.values(seasonDates || {}).filter(
    (date) => date > dayjs().unix()
  );
  const [dateIssue, setdateIssue] = useState(false);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Zaalvoetbalbazen ADMIN</h1>

        <p>Alle sessies:</p>

        <input type="datetime-local" ref={datePickerRef} />
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => {
            if (isNaN(dayjs(`${datePickerRef.current?.value}`).unix())) {
              setdateIssue(true);
              return;
            }
            addSessionDate(dayjs(`${datePickerRef.current?.value}`).unix());
            setdateIssue(false);
          }}
          disabled={datePickerRef.current === null}
        >
          Sessie toevoegen
        </button>

        {dateIssue && (
          <div
            className="alert alert-danger d-flex align-items-center mt-3"
            role="alert"
          >
            Geen geldige datum, zijn datum en tijd goed ingevoerd?
          </div>
        )}

        {filteredDates.length > 0 && (
          <div className={styles.sessions}>
            {filteredDates.map((date, index) => (
              <div key={index} className={styles.sessionContainer}>
                <p className="mt-2 mb-2">
                  {dayjs.unix(date).format("D MMMM HH:mm")}
                </p>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeSessionDate(date)}
                >
                  verwijder sessie
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SessionManagement;
