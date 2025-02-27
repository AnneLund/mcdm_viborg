import { dates } from "../calendar.json";
import { useMemo } from "react";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Dates = () => {
  const today = new Date();

  const sortedDates = useMemo(() => {
    return dates
      .map((date) => ({
        ...date,
        dateObj: new Date(date.date),
      }))
      .filter((date) => date.dateObj >= today)
      .sort((a, b) => a.dateObj - b.dateObj);
  }, [dates]);

  return (
    <article className='dates'>
      <div>
        <h2>Vigtige datoer</h2>
        <ul>
          {sortedDates.length > 0 ? (
            sortedDates.map((date, index) => {
              const formattedDate = date.dateObj.toLocaleDateString("da-DK", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              });

              return (
                <li
                  key={index}
                  className={
                    date.dateObj.toDateString() === today.toDateString()
                      ? "highlight"
                      : ""
                  }>
                  <strong>
                    {capitalizeFirstLetter(formattedDate)} {""}
                    Kl. {date.time}
                  </strong>
                  : {date.event}
                  <p>{date.description}</p>
                </li>
              );
            })
          ) : (
            <p>Ingen kommende begivenheder.</p>
          )}
        </ul>
      </div>
    </article>
  );
};

export default Dates;
