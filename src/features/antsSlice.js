import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as antsAPI from '../utils/antsAPI';
import { v4 as uuidv4 } from "uuid";
import { GlobalStatus } from '../components/GlobalStatus';

export const fetchAnts = createAsyncThunk(
  'users/fetchAnts',
  async () => {
    const response = await antsAPI.fetchAntsApi();
    return response;
  }
)

const initialState = {
  list: [],
  antStatus: {},
  isFetching: false,
  // globalStatus: 'Not yet run',
  // isRunning: false
}

export const antsSlice = createSlice({
  name: 'ants',
  initialState,
  reducers: {
    startRace: (state) => {
      state.list.forEach(({ id }) => {
        state.antStatus[id] = {
          status: 'In progress',
          likelihoodWinning: null,
        };
      });
      // state.globalStatus = 'In progress';
    },
    setLikelihoodWinning: (state, action) => {
      const { id, likelihoodWinning } = action.payload;

      state.antStatus[id] = {
        status: 'Calculated',
        likelihoodWinning
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAnts.pending, (state) => {
      state.list = [];
      state.antStatus = {};
      state.isFetching = true;
    })
    builder.addCase(fetchAnts.fulfilled, (state, action) => {
      // Add user to the state array
      state.list = action.payload.ants.map((item) => {
        item.id = uuidv4();
        state.antStatus[item.id] = {
          status: 'Not yet run',
          likelihoodWinning: null
        }
        return item;
      })
      state.isFetching = false;
    })
    builder.addCase(fetchAnts.rejected, (state) => {
      state.isFetching = false;
    })
  },
})

export const selectAnts = (state) => state.ants.list;
export const selectAntStatus = (state) => state.ants.antStatus;
export const selectIsFetching = (state) => state.ants.isFetching;
// export const selectGlobalStatus = (state) => state.ants.globalStatus;
// export const selectRunInProgress = (state) => state.ants.isRunning;

export const selectRunInProgress = (state) => {
  const antStatus = selectAntStatus(state);

  return Object.keys(antStatus).some((id) => {
    return antStatus[id].status === 'In progress';
  })
}

export const selectSortedAnts = (state) => {
  const ants = selectAnts(state);
  const antStatus = selectAntStatus(state);

  return [...ants].sort((firstAnt, secondAnt) => {
    const firstAntStatus = antStatus[firstAnt.id];
    const secondAntStatus = antStatus[secondAnt.id];

    if (firstAntStatus.likelihoodWinning !== null && secondAntStatus.likelihoodWinning !== null) {
      return secondAntStatus.likelihoodWinning - firstAntStatus.likelihoodWinning;
    } else if (firstAntStatus.likelihoodWinning === null && secondAntStatus.likelihoodWinning === null) {
      return 0;
    }

    if (firstAntStatus.likelihoodWinning !== null && secondAntStatus.likelihoodWinning === null) {
      return -1;
    } else {
      return 1;
    }
  })
}

export const selectAntsCount = (state) => {
  const ants = selectAnts(state);

  return ants?.length || 0;
}

export const selectAreAllCalculated = (state) => {
  const antsCount = selectAntsCount(state);
  const antStatus = selectAntStatus(state);

  const allCalculated = Object.keys(antStatus).every((id) => {
    return antStatus[id].status === 'Calculated';
  });
  return allCalculated && antsCount !== 0;
}

export const selectGlobalStatus = (state) => {
  const runInProgress = selectRunInProgress(state);
  const allCalculated = selectAreAllCalculated(state);

  if (runInProgress) {
    return GlobalStatus.inProgress;
  }

  if (allCalculated) {
    return GlobalStatus.calculated;
  }

  return GlobalStatus.notYetRun;
};
 
export const selectIsStartRaceAvailable = (state) => {
  const antsCount = selectAntsCount(state);
  const runInProgress = selectRunInProgress(state);
  const allCalculated = selectAreAllCalculated(state);

  return antsCount > 0 && !runInProgress && !allCalculated;
}

export const selectIsFetchAntsAvailable = (state) => {
  const fetchingInProgress = selectIsFetching(state);
  const runInProgress = selectRunInProgress(state);
  const allCalculated = selectAreAllCalculated(state);

  return (!fetchingInProgress && !runInProgress) || allCalculated;
}
// Action creators are generated for each case reducer function
export const { startRace, setLikelihoodWinning } = antsSlice.actions;
export default antsSlice.reducer;