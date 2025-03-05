import styles from "./button.module.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdDelete, MdOutlineEditNote, MdAdd } from "react-icons/md";

const ActionButton = ({
  buttonText,
  background,
  type = "button",
  arrow,
  onClick,
  showDetails,
  actionType,
}) => {
  return (
    <button
      className={
        background === "red"
          ? styles.redButton
          : background === "green"
          ? styles.greenButton
          : styles.blueButton
      }
      onClick={onClick}
      type={type}>
      <p>
        {buttonText}
        {actionType === "add" && <MdAdd />}
        {actionType === "delete" && <MdDelete />}
        {actionType === "edit" && <MdOutlineEditNote />}
        {arrow &&
          (showDetails ? (
            <IoIosArrowUp color='white' size={30} />
          ) : (
            <IoIosArrowDown color='white' size={30} />
          ))}
      </p>
    </button>
  );
};

export default ActionButton;
