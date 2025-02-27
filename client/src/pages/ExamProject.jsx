const ExamProject = () => {
  return (
    <article className='examproject'>
      <div>
        <h2>Eksamensprojektet</h2>

        <ul>
          <li>
            Alle filnavne, mappenavne og funktions-navne skal være på engelsk
          </li>
          <li>
            Skriv kommentarer til din kode (dine egne!) - både for din egen og
            undervisernes skyld
          </li>
          <li>
            Slet alle console.log() inden du afleverer (For at rydde konsollen)
          </li>
          <li>
            Sørg for at konsollen er helt clean for fejl inden du afleverer
          </li>
          <li>Hvis du afleverer en zip: Husk at slette node-modules.</li>
          <li>
            Hvis du afleverer en zip: Navngiv mappen med dit navn samt navn på
            projektet, fx: anne_glamping.zip
          </li>
          <li>
            Hvis du afleverer et git repository: Husk at tilføje en
            .gitignore-fil til dit projekt, hvor du tilføjer node-modules, så
            disse ikke pushes til github
          </li>
        </ul>

        <h2>Rapport</h2>

        <ul>
          <p>
            Du skal udarbejde en projektrapport sammen med opgaveløsningen.
            Projektrapporten skal som minimum indeholde følgende:
          </p>
          <li>Vurdering af din egen indsats og gennemførelse af prøven</li>
          <li>
            Argumentation for de valg du har truffet under løsningen af opgaven
          </li>
          <li>
            Redegørelse for oprindelsen af de forskellige kodeelementer i prøven
          </li>
          <li>Beskrivelse af eventuelle særlige punkter til bedømmelse</li>
          <li>
            Angivelse af url adresser, brugernavne og passwords der er
            nødvendige for at lærer og censor kan se opgaven.
          </li>

          <p>
            Hvis du bruger et agilt projektstyringsværktøj (SCRUM, Trello eller
            lign.) kan du med fordel indsætte et link til dit projekt i
            rapporten.
          </p>
          <p>Vi vil meget gerne se en daglig planlægning og eksekvering.</p>
          <p>På forsiden af rapporten skal fremgå:</p>
          <li>Opgavens navn samt dit navn og holdnummer (navn – WebHXXX-X)</li>
          <li>Brugernavn/adgangskoder</li>
          <p>
            Omfanget af rapporten skal være på maksimum fem A4-sider eksklusive
            bilag.
          </p>
          <p>
            Projektrapporten afleveres enten som en pdf-fil og navngives med dit
            navn plus rapport. Eksempel: jens_jensen_rapport.pdf. Eller som en
            Mark Down (.md) fil jens_jensen_rapport.md.
          </p>
          <li>
            <a
              href='/assets/materials/smallprojects/rapport_example.pdf'
              download>
              Eksempel på en rapport
            </a>
          </li>
        </ul>
        <h2>Projektstyring</h2>
        <ul>
          <li>
            <a
              href='/assets/materials/smallprojects/github_projects.pdf'
              download>
              Introduktion til Github som projektstyringsværktøj
            </a>
          </li>
          <li>
            <a
              href='/assets/materials/smallprojects/trello_projects.pdf'
              download>
              Introduktion til Trello som projektstyringsværktøj
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
};

export default ExamProject;
