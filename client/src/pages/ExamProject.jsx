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
      </div>
    </article>
  );
};

export default ExamProject;
