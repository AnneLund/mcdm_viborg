import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BackArrow = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(-1);
  };
  return (
    <div>
      <IoMdArrowRoundBack
        onClick={handleNavigate}
        size={50}
        className='backArrow'
      />
    </div>
  );
};

export default BackArrow;
