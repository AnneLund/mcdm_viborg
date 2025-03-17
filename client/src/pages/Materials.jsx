import { Link } from "react-router-dom";
import { Article } from "../styles/containerStyles";
import { List, ListItem } from "../styles/listStyles";
import { Title } from "../styles/textStyles";

const Materials = () => {
  return (
    <Article>
      <Title>Materialer</Title>
      <List>
        <ListItem>
          <Link
            target='_blank'
            to='https://github.com/AnneLundM/backofficeexample'>
            Gittes Glamping Backoffice (git-repository)
          </Link>
        </ListItem>
      </List>
    </Article>
  );
};

export default Materials;
