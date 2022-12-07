import * as React from "react";
import { Button, Stack, Box, Text } from '@chakra-ui/react';
import { useDispatch } from "react-redux";
import { fetchAnts } from "../features/antsSlice";
import { useSelector } from "react-redux";
import { selectAnts, selectGlobalStatus, selectIsStartRaceAvailable, selectIsFetchAntsAvailable } from "../features/antsSlice";
import { startRace, setLikelihoodWinning } from "../features/antsSlice";
import { generateAntWinLikelihoodCalculator } from "../utils/likelihoodCalculator";

export const StartBar = () => {
  const dispatch = useDispatch();
  // const globalStatus = useSelector(selectGlobalStatus);
  const ants = useSelector(selectAnts);
  const globalStatus = useSelector(selectGlobalStatus);
  const isStartRaceAvailable = useSelector(selectIsStartRaceAvailable);
  const isFetchAntsAvailable = useSelector(selectIsFetchAntsAvailable);

  const handleFetch = (e) => {
    e.preventDefault();
    dispatch(fetchAnts());
  };

  const handleRace = (e) => {
    e.preventDefault();
    dispatch(startRace());

    ants.forEach(({ id }) => {
      const callback = (likelihoodWinning) => {
        dispatch(setLikelihoodWinning({
          id,
          likelihoodWinning
        }));
      };
      generateAntWinLikelihoodCalculator()(callback);
    });


  };
  
  return (
    <Box margin={3}>
      <Stack spacing={4} direction='row' align='center'>
        <Button
          colorScheme='green'
          onClick={handleFetch}
          disabled={!isFetchAntsAvailable}
        >
          Fetch Ants
        </Button>
        <Button 
          colorScheme='teal'
          onClick={handleRace}
          disabled={!isStartRaceAvailable}
        >
          Start Race
        </Button>
        <Text fontSize='lg' title="status">
          Status: {globalStatus}
        </Text>

      </Stack>
    </Box>
  )
}