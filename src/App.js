import React from "react";
import { StartBar } from './components/StartBar';
import { ListAnts } from './components/ListAnts';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <div>
        <StartBar />
        <ListAnts />
      </div>
    </ChakraProvider>
  );
}

export default App;
