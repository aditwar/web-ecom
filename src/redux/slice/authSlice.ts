import { IUserState } from '@/app/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: IUserState = {
  name: '',
  email: '',
  provider: '',
  avatar: '',
  token: null,
  isStored: false,
};

export const authSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    loginUserAction: (state, action: PayloadAction<IUserState>) => {
      const { name, email, provider, avatar, token } = action.payload;
      state.name = name;
      state.email = email;
      state.provider = provider;
      state.avatar = avatar;
      state.token = token;
      state.isStored = true;

    },

    logoutUserAction: (state) => {
      state.name = '';
      state.email = '';
      state.provider = '';
      state.avatar = '';
      state.token = null;
      state.isStored = false;

    },
  },
});

export const { loginUserAction, logoutUserAction } = authSlice.actions
export default authSlice.reducer