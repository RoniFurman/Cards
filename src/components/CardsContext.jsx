import React, { createContext, useState, useContext } from "react";

const CardsContext = createContext();

export const useCards = () => useContext(CardsContext);

export const CardsProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <CardsContext.Provider
      value={{
        cards,
        setCards,
        filteredCards,
        setFilteredCards,
        searchQuery,
        setSearchQuery,
      }}>
      {children}
    </CardsContext.Provider>
  );
};
