import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {
    picture: string | undefined;
    name: string;
    email: string;
    location: string;
} | null;

interface UserState {
    user: User;
}

const initialState: UserState = {
    user: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
