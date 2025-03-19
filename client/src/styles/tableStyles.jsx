import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 20px;

  thead {
    background: #f4f4f4;
  }

  .link {
    text-decoration: none;
    color: #2c3e50;
    font-weight: bold;
    transition: color 0.3s ease, transform 0.2s ease, text-shadow 0.3s ease;
    cursor: pointer;
  }

  .link:hover {
    color: #4ca1af;
    transform: translate(5px);
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  }

  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }

  img {
    border-radius: 5px;
  }

  .actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  @media (max-width: 600px) {
    font-size: 15px;
    display: block;
    thead {
      display: none;
    }
    tbody {
      display: block;
    }
    tr {
      display: block;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      padding: 10px;
    }

    td {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      text-align: right;
      position: relative;
    }

    td[data-label="Billede"] {
      display: none;
    }

    td[data-label="Navn"] {
      svg {
        display: none;
      }
    }

    td::before {
      content: attr(data-label);
      font-weight: bold;
    }

    .teamActions {
      svg {
        margin: 0;
      }
    }
  }
`;

export const Th = styled.th`
  background: #253545ee;
  color: white;
  padding: 10px;
  text-align: left;
`;

export const Td = styled.td`
  padding: 5px;
  border-bottom: 1px solid #ddd;
  display: flex;

  &:last-child {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  svg {
    margin: 0 auto;
  }

  img {
    width: 40px;
  }
`;
