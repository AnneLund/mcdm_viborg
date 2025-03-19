import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdDelete, MdOutlineEditNote } from "react-icons/md";
import styled from "styled-components";

export const Close = ({ onClick }) => {
  return (
    <Icon>
      <IoMdClose size={40} color='#820909ce' onClick={onClick} />
    </Icon>
  );
};

export const Remove = ({ onClick }) => {
  return (
    <Icon>
      <MdDelete size={40} color='#820909ce' onClick={onClick} />
    </Icon>
  );
};

export const Edit = ({ onClick }) => {
  return (
    <Icon>
      <MdOutlineEditNote size={40} color='#2c3e50d6' onClick={onClick} />
    </Icon>
  );
};

export const Add = ({ onClick }) => {
  return (
    <Icon>
      <IoMdAdd color='#004d00' size={40} onClick={onClick} />
    </Icon>
  );
};

const Icon = styled.div`
  font-size: 18px;
  background: none;
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  svg {
    box-shadow: #00000067 2px 2px 5px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-radius: 5px;
  }

  &:hover svg {
    transform: scale(1.1);
    box-shadow: #00000067 4px 4px 10px;
  }
`;
