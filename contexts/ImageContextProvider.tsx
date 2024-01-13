import { createContext, useState } from "react";

type ImageContextType = {
  imgSrc: string;
  setImgSrc: React.Dispatch<React.SetStateAction<string>>;
};

export const ImageContext = createContext<ImageContextType>(null);

export const ImageContextProvider = ({ children }) => {
  const [imgSrc, setImgSrc] = useState<string>(null);

  return (
    <ImageContext.Provider value={{ imgSrc, setImgSrc }}>
      {children}
    </ImageContext.Provider>
  );
};