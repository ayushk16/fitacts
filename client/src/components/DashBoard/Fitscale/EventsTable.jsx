import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateEvent, deleteEvent, fetchEvents } from '../../../features/dashboard/eventSlice';
import { getUser } from '../../../functions/tokenSet';
import {
  TableCell,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography,
  Skeleton,
  IconButton,
  Tooltip,
  Paper,
  Box,
} from '@mui/material';
import { FaTrashAlt } from 'react-icons/fa';
import EventsTableHeader from './EventsTableHeader';
import { useThemeMode } from '../../../theme/ThemeContext';

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const sortedData = (data, comparator) => {
  const stabilizedRows = (data || []).map((el, index) => [el, index]);
  stabilizedRows.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedRows.map((el) => el[0]);
};

const EventsTable = () => {
  const [orderDirection, setOrderDirection] = useState('asc');
  const [valueToOrderBy, setValueToOrderBy] = useState('eventname');
  const dispatch = useDispatch();
  const { mode } = useThemeMode();

  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const userData = reduxUser || getUser();
  const eventsData = useSelector((state) => state.events);

  useEffect(() => {
    if (userData?.id) {
      dispatch(fetchEvents({ userid: userData.id }));
    }
  }, [dispatch, userData?.id]);

  const handleChangeEvent = ({ eventid, showintimeline }) => {
    if (!userData) return;
    dispatch(
      updateEvent({
        eventid,
        showintimeline,
        userid: userData.id,
      })
    );
  };

  const handleDeleteRecord = (eventid) => {
    if (!userData || !eventid) return;
    if (window.confirm('Are you sure you want to delete this workout record?')) {
      dispatch(deleteEvent({ eventid, userid: userData.id }));
    }
  };

  const handleRequestSort = (event, property) => {
    const isAscending = valueToOrderBy === property && orderDirection === 'asc';
    setValueToOrderBy(property);
    setOrderDirection(isAscending ? 'desc' : 'asc');
  };

  if (eventsData.loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rounded" height={200} />
      </Box>
    );
  }

  const dataToDisplay = sortedData(
    eventsData.data || [],
    getComparator(orderDirection, valueToOrderBy)
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
        border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Table>
        <EventsTableHeader
          valueToOrderBy={valueToOrderBy}
          orderDirection={orderDirection}
          handleRequestSort={handleRequestSort}
        />
        <TableBody>
          {dataToDisplay.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No workouts recorded yet.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            dataToDisplay.map((event, index) => {
              const eventId = event.id || event.eventid;
              const durationSec = event.duration || 0;
              const h = Math.floor(durationSec / 3600);
              const m = Math.floor((durationSec % 3600) / 60);
              const s = durationSec % 60;
              const formattedDuration = `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;

              return (
                <TableRow
                  key={eventId || index}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{event.name || event.eventname}</TableCell>
                  <TableCell>{event.activityname || 'Workout'}</TableCell>
                  <TableCell>
                    {event.distance} {event.distanceunit || 'km'}
                  </TableCell>
                  <TableCell>{formattedDuration}</TableCell>
                  <TableCell>
                    {new Date(event.created_at || event.timestamp || Date.now()).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(event.showintimeline)}
                            onChange={(e) => {
                              handleChangeEvent({
                                eventid: eventId,
                                showintimeline: e.target.checked,
                              });
                            }}
                            color="primary"
                          />
                        }
                        label="Timeline"
                      />
                    </FormGroup>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete Workout Record">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteRecord(eventId)}
                      >
                        <FaTrashAlt fontSize={14} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventsTable;
