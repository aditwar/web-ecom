import { IAuthorState } from '@/app/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IAuthorState = {
  id: 0,
  name: '',
  email: '',
  password: '',
  role: '',
  avatar: '',
  token: null,
  users: undefined,
};

export const authorSlice = createSlice({
  name: 'author',
  initialState,
  reducers: {

    loginAction: (state, action: PayloadAction<IAuthorState>) => {
      const { id, name, email, password, role, avatar, token, users } =
        action.payload;

      state.id = id;
      state.name = name;
      state.email = email;
      state.password = password;
      state.role = role;
      state.avatar = avatar;
      state.token = token;
      state.users = users;
    },

    logoutAction: (state) => {
      state.id = 0;
      state.name = '';
      state.email = '';
      state.password = '';
      state.role = '';
      state.avatar = '';
      state.token = null;
      state.users = undefined;
    },

    setAuthorEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const { loginAction, logoutAction, setAuthorEmail } =
  authorSlice.actions;
export default authorSlice.reducer;
