import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}


const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, () => {
        console.log("incrementAsync.pending");
      })
      .addCase(
        incrementAsync.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.value = action.payload;
        }
      );
  },
});


export const incrementAsync = createAsyncThunk(
  "counter/incrementAsync",
  async (prodId: string) => {

    const userId = localStorage.getItem('userId');
    
    const formData = {
      custId: userId,
      prodId
    }; 

    try {
      const saveToCart = await fetch('http://localhost:4000/api/v1/addtocart', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const res = await saveToCart.json();
      console.log(res.data);


      return res.data.cart.length;
    } catch (error) {
      throw error;
    }
  }
);

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;