import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../functions/config';
import { getUser } from '../../functions/tokenSet';

const initialState = {
  loading: false,
  data: [],
  error: null,
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (params = {}) => {
  const effectiveUserId = params?.userid || params?.userId || params?.id || getUser()?.id;
  if (!effectiveUserId) return { data: [] };
  const res = await axios.get(`${config.API_BASE_URL}/events`, { params: { id: effectiveUserId } });
  return res.data;
});

export const addEvent = createAsyncThunk(
  'events/addEvent',
  async ({ name, userid, activityid, distance, duration, image_url, caption, showintimeline }) => {
    const effectiveUserId = userid || getUser()?.id;
    const res = await axios.post(`${config.API_BASE_URL}/events`, {
      name,
      userid: effectiveUserId,
      activityid,
      distance,
      duration,
      image_url,
      caption,
      showintimeline,
    });
    return res.data;
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ eventid, showintimeline, userid }) => {
    const effectiveUserId = userid || getUser()?.id;
    const res = await axios.put(`${config.API_BASE_URL}/events`, {
      userid: effectiveUserId,
      eventid,
      showintimeline,
    });
    return res.data;
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async ({ eventid, userid }) => {
    const effectiveUserId = userid || getUser()?.id;
    const res = await axios.delete(`${config.API_BASE_URL}/events/${eventid}`, {
      params: { userid: effectiveUserId },
    });
    return { eventid, ...res.data };
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEvents: (state) => {
      state.loading = false;
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEvents
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Error fetching events';
      })
      // addEvent
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [action.payload.data, ...state.data];
        state.error = null;
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Error adding event';
      })
      // updateEvent
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.data = state.data.map((event) => {
          const id = event.id || event.eventid;
          const targetId = action.payload.data.id || action.payload.data.eventid;
          if (id === targetId) {
            return action.payload.data;
          }
          return event;
        });
      })
      // deleteEvent
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (event) => (event.id || event.eventid) !== action.payload.eventid
        );
      });
  },
});

export const { clearEvents } = eventsSlice.actions;

export default eventsSlice.reducer;