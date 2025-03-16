import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Article } from "../styles/containerStyles";
import { List, ListItem } from "../styles/listStyles";
import { Title } from "../styles/textStyles";

const Exam = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <Article>
      <Title>Eksamen</Title>
      <div className='grid'>
        <List>
          <h3>Før eksamen</h3>
          <ListItem>
            På selve eksamensdagen ankommer du til skolen i god tid, før
            eksaminator og censor har skuetid på din projektløsning. Projektet
            afvikles fra din egen maskine, der bliver forbundet til en større
            skærm via HDMI (Tjek hjemmefra at forbindelsen virker).
          </ListItem>
          <ListItem>
            Hvis ikke du medbringer strømforsyning, skal du sørge for at
            maskinen er fuldt opladet og at den ikke låser med kode efter få
            minutter.
          </ListItem>
          <ListItem>
            Fjern alt fra skrivebordet som er uvæsentlig for eksamen, og klargør
            programmer og browser med projektet tændt.
          </ListItem>
          <ListItem>
            Du bliver inviteret ind i eksamenslokalet kortvarigt for at opsætte
            din maskine, og skal derefter forlade lokalet under skuetiden.
          </ListItem>
          <ListItem>
            Ved skuetids ophør (ca. 30 minutter) bliver du hentet ind i lokalet
            igen, og skal begynde din præsentation af projektet.
          </ListItem>
        </List>

        <List>
          <h3>Under eksamen</h3>
          <ListItem>
            Du har ca. 25 minutters eksamenstid, hvorefter du skal forlade
            lokalet, mens eksaminator og censor voterer.
          </ListItem>
          <ListItem>
            De første 5 minutter skal du holde et oplæg om et valgfrit emne, der
            relaterer til din opgave.
          </ListItem>
          <ListItem>
            Under eksaminationen skal du præsentere din opgaveløsning. Derudover
            skal du kunne redegøre for enkeltelementer af løsningen - Dette kan
            være spørgsmål omkring koder, valg af metodikker,
            navigationselementer, databaselayout eller lignende.
          </ListItem>

          <ListItem>
            Udover projektopgaven kan øvrige emner, der relaterer sig til
            uddannelsens fagområde indgå i eksaminationen.
          </ListItem>
        </List>

        <List>
          <h3>Efter eksamen</h3>
          <ListItem>
            Du vil du blive kaldt ind i lokalet, og mundtligt få udleveret din
            karakter samt en kort forklaring af karakteren.
          </ListItem>
          <ListItem>
            I tilfælde af utilfredshed med karakteren, skal denne ikke
            diskuteres ved overdragelsen af karakteren, men kan klargøres i en
            skriftlig klage over karakteren eller formen ved eksamen eller
            karakterens afgivelse.
          </ListItem>
        </List>

        <List>
          <h3>Råd og fif&apos;s til en god eksamen</h3>
          <ListItem>Hils på både underviser og censor ved ankomst</ListItem>

          <ListItem>
            Start med at præsentere dit program (fx: &apos;Jeg vil starte med et
            5 minutters oplæg om custom-hooks i React. Her vil jeg fortrække, at
            I venter med at stille spørgsmål til jeg er færdig. Derefter vil jeg
            fortælle om rating-funktionen som jeg under &apos;fremhævelse af
            punkter til bedømmelse&apos; i min rapport har lagt op til. Jeg vil
            derudover gerne komme ind på, hvordan jeg funktionelt har opbygget
            min backoffice.&apos;)
          </ListItem>
          <ListItem>
            Brug ikke tid på at vise siden frem - vi har set den under skuetiden
          </ListItem>
          <ListItem>
            Hvis du bliver stillet et spørgsmål, som du ikke kan huske svaret
            på, så sig fx: &apos;Det vil jeg gerne lige vende tilbage til. Først
            vil jeg lige fortælle om....&apos;
          </ListItem>
        </List>

        <List id='extratime'>
          <h3>Ekstra tid til eksamensprojektet</h3>

          <p>
            Hvis du er ordblind eller har en psykisk diagnose, kan du anmode om
            mere tid til selve eksamensprojektet.
          </p>
          <br />
          <p>Skriv til din underviser hvis du ønsker dette.</p>
        </List>
      </div>
    </Article>
  );
};

export default Exam;
