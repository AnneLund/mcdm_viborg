import styled from "styled-components";

export const ToggleButton = styled.h4`
  cursor: pointer;
  background: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  margin: 5px 0;
  user-select: none;
  display: flex;
  align-items: center;

  svg {
    margin: 5px;
  }
`;

export const ArrowIcon = styled.span`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  transition: transform 0.3s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

export const StudentList = styled.ul`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
  opacity: 0;

  &.show {
    max-height: 100%;
    opacity: 1;
  }
`;

export const User = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  gap: 50px;
  justify-content: space-between;
  margin: 10px auto;
`;
