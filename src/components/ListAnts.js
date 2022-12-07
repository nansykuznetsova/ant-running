import * as React from "react";
import { useSelector } from "react-redux";
import { selectSortedAnts } from '../features/antsSlice';
import { Ant } from "./Ant";

export const ListAnts = () => {
  const antsList = useSelector(selectSortedAnts);

  return (
    <section className="center">
      <ul className="ants-list">
        {antsList.map((ant) => (
          <li key={ant.id} className="ant">
            <Ant 
              ant={ant}
              id={ant.id}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}