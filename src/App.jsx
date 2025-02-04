import "./App.css";

function App() {
  return (
    <article className='app'>
      <img src='/assets/mcdm_logo.png' alt='logo' className='logo' />
      <header>
        <h1>Opgave Legekrogen</h1>
      </header>

      <ol>
        <li>
          <a href='/assets/legekrogen_materialer.zip' download>
            Hent alle materialer som en zip fil (inkl. hovedopgave)
          </a>
        </li>
        <li>
          <a
            href='https://www.figma.com/design/QRXvgpGryPImTWgx8gSx6F/Legekrogen?node-id=0-1&node-type=canvas&t=CYYiE187pdcDVkXU-0'
            target='_blank'>
            Åbn Figma-designet
          </a>
        </li>
        <li>
          <a
            href='https://documenter.getpostman.com/view/17346811/2s93RNzFRN'
            target='_blank'>
            Postman API dokumentation
          </a>
        </li>
      </ol>
    </article>
  );
}

export default App;
