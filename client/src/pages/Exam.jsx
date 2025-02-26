const Exam = () => {
  return (
    <article className='exam'>
      <h2>Eksamen</h2>
      <div className='grid'>
        <ul>
          <h3>Før eksamen</h3>
          <li>
            På selve eksamensdagen ankommer du til skolen i god tid, før
            eksaminator og censor har skuetid på din projektløsning. Projektet
            afvikles fra din egen maskine, der bliver forbundet til en større
            skærm via HDMI (Tjek hjemmefra at forbindelsen virker).
          </li>
          <li>
            Hvis ikke du medbringer strømforsyning, skal du sørge for at
            maskinen er fuldt opladet og at den ikke låser med kode efter få
            minutter.
          </li>
          <li>
            Fjern alt fra skrivebordet som er uvæsentlig for eksamen, og klargør
            programmer og browser med projektet tændt.
          </li>
          <li>
            Du bliver inviteret ind i eksamenslokalet kortvarigt for at opsætte
            din maskine, og skal derefter forlade lokalet under skuetiden.
          </li>
          <li>
            Ved skuetids ophør (ca. 30 minutter) bliver du hentet ind i lokalet
            igen, og skal begynde din præsentation af projektet.
          </li>
        </ul>

        <ul>
          <h3>Under eksamen</h3>
          <li>
            Du har ca. 25 minutters eksamenstid, hvorefter du skal forlade
            lokalet, mens eksaminator og censor voterer.
          </li>
          <li>
            Under eksaminationen skal du præsentere din opgaveløsning. Derudover
            skal du kunne redegøre for enkeltelementer af løsningen - Dette kan
            være spørgsmål omkring koder, valg af metodikker,
            navigationselementer, databaselayout eller lignende.
          </li>

          <li>
            Udover projektopgaven kan øvrige emner, der relaterer sig til
            uddannelsens fagområde indgå i eksaminationen.
          </li>
        </ul>

        <ul>
          <h3>Efter eksamen</h3>
          <li>
            Du vil du blive kaldt ind i lokalet, og mundtligt få udleveret din
            karakter samt en kort forklaring af karakteren.
          </li>
          <li>
            I tilfælde af utilfredshed med karakteren, skal denne ikke
            diskuteres ved overdragelsen af karakteren, men kan klargøres i en
            skriftlig klage over karakteren eller formen ved eksamen eller
            karakterens afgivelse.
          </li>
        </ul>
      </div>
    </article>
  );
};

export default Exam;
