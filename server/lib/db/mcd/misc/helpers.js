import { v4 as uuidv4 } from "uuid";
    
export const minmax = (min, max) => {
    return Math.floor(Math.random()
        * (max - min + 1)) + min;
};

export const getNewUID = () => {
    return uuidv4();
};
