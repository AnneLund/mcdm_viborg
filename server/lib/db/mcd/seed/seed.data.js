import bcrypt from "bcryptjs";

export const stubTerms = [
  {
    term: "Komponent",
    definition:
      "En genanvendelig funktion eller klasse, der returnerer JSX og styrer en del af UI'et.",
  },
  {
    term: "JSX",
    definition:
      "En syntaksudvidelse for JavaScript, der ligner HTML og bruges i React til at definere UI-struktur.",
  },
  {
    term: "Props",
    definition:
      "Kort for 'properties', bruges til at sende data fra en komponent til en anden.",
  },
  {
    term: "State",
    definition:
      "Et objekt, der gemmer dynamiske data for en komponent og kan ændres over tid.",
  },
  {
    term: "useState",
    definition:
      "En React Hook, der bruges til at håndtere state i funktionelle komponenter.",
  },
  {
    term: "useEffect",
    definition:
      "En React Hook, der håndterer sideeffekter, som f.eks. datahentning eller DOM-manipulation.",
  },
  {
    term: "Virtual DOM",
    definition:
      "En optimeringsteknik, hvor React holder en kopi af DOM'en og opdaterer kun de nødvendige dele.",
  },
  {
    term: "Event Handling",
    definition:
      "Metoder til at håndtere brugerinteraktioner, såsom klik og tastetryk i React.",
  },
  {
    term: "Context API",
    definition:
      "En måde at dele data globalt i en React-app uden at prop-drille gennem komponenttræet.",
  },
  {
    term: "useContext",
    definition:
      "En React Hook, der gør det muligt at bruge Context API direkte i en funktionel komponent.",
  },
  {
    term: "React Router",
    definition:
      "Et bibliotek til at håndtere navigation og rutehåndtering i en React-applikation.",
  },
  {
    term: "Fragment",
    definition:
      "Et usynligt wrapper-element (<></>), der kan bruges til at gruppere elementer uden at tilføje ekstra HTML-tags.",
  },
  {
    term: "Keys",
    definition:
      "Unikke identifikatorer, der bruges i lister for at optimere Reacts opdateringsproces.",
  },
  {
    term: "Refs",
    definition:
      "Bruges til at få direkte adgang til DOM-elementer eller React-komponenter.",
  },
  {
    term: "Controlled Component",
    definition:
      "En formular-komponent, hvor React håndterer state for inputfelterne.",
  },
  {
    term: "Uncontrolled Component",
    definition:
      "En formular-komponent, hvor DOM’en selv håndterer state for inputfelterne.",
  },
  {
    term: "Lazy Loading",
    definition:
      "En teknik til at loade komponenter eller moduler kun, når de skal bruges, ofte med React.lazy.",
  },
  {
    term: "Suspense",
    definition:
      "En komponent, der gør det muligt at vise fallback-indhold, mens noget bliver loadet asynkront.",
  },
  {
    term: "Custom Hook",
    definition:
      "En genanvendelig funktion, der bruger React Hooks til at indkapsle logik, der kan genbruges på tværs af komponenter.",
  },
  {
    term: "Strict Mode",
    definition:
      "En funktion i React, der hjælper med at identificere potentielle problemer i en applikation.",
  },
  {
    term: "Tree Shaking",
    definition:
      "En optimeringsteknik, hvor ubrugt kode fjernes fra en produktion-build.",
  },
];

export const stubUsers = [
  {
    name: "admin",
    email: "admin@mediacollege.dk",
    picture: "/users/no-user.jpg",
    role: "admin",
    hashedPassword: await bcrypt.hash("admin", 10),
  },
  {
    name: "guest",
    email: "guest@mediacollege.dk",
    picture: "/users/no-user.jpg",
    role: "guest",
    hashedPassword: await bcrypt.hash("guest", 10),
  },
];
