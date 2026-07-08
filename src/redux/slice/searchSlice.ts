import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchFilterState {
  location: string;
  category: string;
  startDate: string;
  endDate: string;
}

const initialState: SearchFilterState = {
  location: '',
  category: '',
  startDate: '',
  endDate: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<SearchFilterState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setSearchFilter } = searchSlice.actions;
export default searchSlice.reducer;
