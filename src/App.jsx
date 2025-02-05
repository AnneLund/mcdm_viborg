import "./App.css";

function App() {
  return (
    <article className='app'>
      <img src='/assets/mcdm_logo.png' alt='logo' className='logo' />
      <header>
        <h1>Opgave: Den Glade Skorpe</h1>
      </header>

      <ol>
        <li>
          <a href='/assets/dgs_materialer.zip' download>
            Hent alle materialer som en zip fil (inkl. hovedopgave)
          </a>
        </li>
        <li>
          <a
            href='https://www.figma.com/design/yzjuDfwFzngz8EySrOXSf6/Den-Glade-Skorpe?node-id=0-1&t=Ptf1mkvakzT0DTO5-1'
            target='_blank'>
            Åbn Figma-designet
          </a>
        </li>
        {/* <li>
          <a href='./assets/dgs_postman_collection.json' target='_blank'>
            Postman API
          </a>
        </li> */}
      </ol>
    </article>
  );
}

export default App;
