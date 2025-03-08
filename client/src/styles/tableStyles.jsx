import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

export const Th = styled.th`
  background: #253545ee;
  color: white;
  padding: 10px;
  text-align: left;
`;

export const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  img {
    width: 40px;
  }
`;
