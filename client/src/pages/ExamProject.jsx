import styled from "styled-components";

const ExamProject = () => {
  return (
    <Container>
      <Section>
        <Title>Eksamensprojektet</Title>
        <List>
          <ListItem>
            Alle filnavne, mappenavne og funktionsnavne skal være på engelsk.
          </ListItem>
          <ListItem>
            Skriv kommentarer til din kode (dine egne!) – både for din egen og
            undervisernes skyld.
          </ListItem>
          <ListItem>
            Slet alle `console.log()` inden du afleverer (for at rydde
            konsollen).
          </ListItem>
          <ListItem>
            Sørg for at konsollen er helt clean for fejl inden du afleverer.
          </ListItem>
          <ListItem>
            Hvis du afleverer en zip: Husk at slette `node_modules`.
          </ListItem>
          <ListItem>
            Hvis du afleverer en zip: Navngiv mappen med dit navn samt
            projektets navn, fx: `anne_glamping.zip`.
          </ListItem>
          <ListItem>
            Hvis du afleverer et git repository: Husk at tilføje en
            `.gitignore`-fil, hvor du udelukker `node_modules`, så de ikke
            pushes til GitHub.
          </ListItem>
        </List>
      </Section>

      <Section>
        <Title>Rapport</Title>
        <Paragraph>
          Du skal udarbejde en projektrapport sammen med opgaveløsningen.
        </Paragraph>
        <Paragraph>
          Hvis du bruger et agilt projektstyringsværktøj (SCRUM, Trello eller
          lign.), kan du med fordel indsætte et link til dit projekt i
          rapporten.
        </Paragraph>
        <Paragraph>
          Du kan også tage et dagligt screenshot og vedhæfte dette som bilag til
          rapporten.
        </Paragraph>
        <Paragraph>
          Vi vil meget gerne se en daglig planlægning og eksekvering.
        </Paragraph>

        <h4>Projektrapporten skal som minimum indeholde følgende:</h4>
        <List>
          <ListItem>
            Vurdering af din egen indsats og gennemførelse af prøven.
          </ListItem>
          <ListItem>
            Argumentation for de valg du har truffet under løsningen af opgaven.
          </ListItem>
          <ListItem>
            Redegørelse for oprindelsen af de forskellige kodeelementer i
            prøven.
          </ListItem>
          <ListItem>
            Beskrivelse af eventuelle særlige punkter til bedømmelse.
          </ListItem>
          <ListItem>
            Angivelse af URL-adresser, brugernavne og passwords, så lærer og
            censor kan se opgaven.
          </ListItem>
          <ListItem>Dokumentation på daglig planlægning.</ListItem>
        </List>

        <h4>På forsiden af rapporten skal fremgå:</h4>

        <List>
          <ListItem>
            Opgavens navn samt dit navn og holdnummer (navn – WebHXXX-X).
          </ListItem>
          <ListItem>Brugernavn/adgangskoder.</ListItem>
        </List>

        <Paragraph>
          Omfanget af rapporten skal være på maks. fem A4-sider eksklusive
          bilag.
        </Paragraph>
        <Paragraph>
          Projektrapporten afleveres enten som en PDF-fil navngivet med dit navn
          + rapport (fx: `jens_jensen_rapport.pdf`) eller som en Markdown-fil
          (`.md`), fx: `jens_jensen_rapport.md`.
        </Paragraph>

        <DownloadLink
          href='/assets/materials/smallprojects/rapport_example.pdf'
          download>
          Eksempel på en rapport
        </DownloadLink>
      </Section>

      <Section>
        <Title>Projektstyring</Title>
        <h4>Forslag til projektstyringsværktøjer</h4>
        <List>
          <DownloadLink
            href='/assets/materials/smallprojects/github_projects.pdf'
            download>
            Introduktion til Github som projektstyringsværktøj
          </DownloadLink>

          <DownloadLink
            href='/assets/materials/smallprojects/trello_projects.pdf'
            download>
            Introduktion til Trello som projektstyringsværktøj
          </DownloadLink>

          <ExternalLink href='https://tree.taiga.io/' target='_blank'>
            Taiga
          </ExternalLink>
        </List>
      </Section>
    </Container>
  );
};

export default ExamProject;

// ---------------- STYLED COMPONENTS ----------------

const Container = styled.article`
  margin: 70px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Section = styled.section`
  margin-bottom: 30px;

  h4 {
    margin: 10px 0;
  }
`;

const Title = styled.h2`
  color: #2c3e50;
  border-bottom: 2px solid #4ca1af;
  padding-bottom: 5px;
  margin-bottom: 15px;
  font-size: 20px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.li`
  background: #e9ecef;
  padding: 10px;
  color: #333;
  margin-bottom: 5px;
  border-radius: 5px;
`;

const Paragraph = styled.p`
  margin: 20px 0;
  color: #333;
  line-height: 1.5;
`;

const DownloadLink = styled.a`
  padding: 10px;
  background: #217022;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;
  margin: 5px 0;

  &:hover {
    background: #447645;
  }
`;

const ExternalLink = styled.a`
  padding: 10px;
  background: #217022;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;
  margin: 5px 0;

  &:hover {
    background: #447645;
  }
`;
