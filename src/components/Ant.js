import * as React from "react";
import { Card, CardHeader, CardBody, Text, Divider, CardFooter, Progress } from '@chakra-ui/react';
import { useSelector } from "react-redux";
import { selectAntStatus } from "../features/antsSlice";

export const Ant = ({ ant, id }) => {
  const antsStatus = useSelector(selectAntStatus);
  const status = antsStatus[id];

  return (
    <Card>
      <CardHeader>
        <Text 
          fontSize='3xl' 
          as='b' 
          title="name"
        >
          {ant.name}
        </Text>
      </CardHeader>
      <Progress 
        colorScheme='teal' 
        hasStripe size='sm' 
        value={status.likelihoodWinning * 100} 
        isIndeterminate={status.status === 'In progress' && status.likelihoodWinning === null}
      />
      <CardBody>
        <Text fontSize='sm' title="color">
          Color: {ant.color}
        </Text>
        <Text fontSize='sm' title="length">
          Length: {ant.length}
        </Text>
        <Text fontSize='sm' title="weight">
          Weight: {ant.weight}
        </Text>
        {status.likelihoodWinning !== null && (
        <Text fontSize='sm' title="weight">
          Likelihood of winning: {status.likelihoodWinning}
        </Text>)}
      </CardBody>
      <Divider />
      <CardFooter>
        <Text fontSize='lg' title="status">
          Status: {status.status}
        </Text>
      </CardFooter>
    </Card>
  );
}