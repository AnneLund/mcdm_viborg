import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import styles from "./button.module.css";

const BackArrow = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(-1);
  };
  return (
    <div className={styles.backArrow}>
      <IoMdArrowRoundBack color=' #2f4b68' onClick={handleNavigate} size={40} />
    </div>
  );
};

export default BackArrow;
