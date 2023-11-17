import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateEvent } from '../../../features/dashboard/eventSlice';
import {
  TableCell,
  TableContainer,
  Table,
  TableRow,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';

import EventsTableHeader from './EventsTableHeader';

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const sortedData = (data, comparator) => {
  const stabilizedRows = data.map((el, index) => [el, index]);
  stabilizedRows.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedRows.map((el) => el[0]);
};

const EventsTable = () => {
  const [orderDirection, setOrderDirection] = useState('asc');
  const [valueToOrderBy, setValueToOrderBy] = useState('Eventname');
  const dispatch = useDispatch();
  const userData = useSelector((state) => {
    if (state.user) {
      return state.user;
    }
  });

  const eventsData = useSelector((state) => {
    if (state.events) {
      return state.events;
    }
  });

  const handleChangeEvent = ({ eventid, showintimeline }) => {
    dispatch(
      updateEvent({
        eventid,
        showintimeline,
        userid: userData.data.data.user.id,
      })
    );
  };
  const handleRequestSort = (event, property) => {
    const isAscending = valueToOrderBy === property && orderDirection === 'asc';
    setValueToOrderBy(property);
    setOrderDirection(isAscending ? 'desc' : 'asc');
  };
  const dataToDisplay = sortedData(
    eventsData.data,
    getComparator(orderDirection, valueToOrderBy)
  );

  if (eventsData.loading) {
    return <div>loading</div>;
  }
  if (eventsData.error !== null && eventsData.error !== '') {
    return <div>error fetching events</div>;
  } else {
    return (
      <>
        <TableContainer>
          <Table
            style={{
              background: 'linear-gradient(to bottom, #fff, #EDDBC7)',
            }}
          >
            <EventsTableHeader
              valueToOrderBy={valueToOrderBy}
              orderDirection={orderDirection}
              handleRequestSort={handleRequestSort}
            />
            {dataToDisplay.map((event, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{event.eventname}</TableCell>
                  <TableCell>{event.activityname}</TableCell>
                  <TableCell>
                    {event.distance} {event.distanceunit}
                  </TableCell>
                  <TableCell>
                    duration -{' '}
                    {Math.floor(event.duration / 3600) < 10
                      ? `0${Math.floor(event.duration / 3600)}`
                      : `${Math.floor(event.duration / 3600)}`}
                    :
                    {Math.floor((event.duration % 3600) / 60) < 10
                      ? `0${Math.floor((event.duration % 3600) / 60)}`
                      : `${Math.floor((event.duration % 3600) / 60)}`}
                    :
                    {Math.floor((event.duration % 3600) % 60) < 10
                      ? `0${Math.floor((event.duration % 3600) % 60)}`
                      : `${Math.floor((event.duration % 3600) % 60)}`}
                  </TableCell>
                  <TableCell>
                    {new Date(event.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={event.showintimeline}
                            onChange={(e) => {
                              handleChangeEvent({
                                eventid: event.eventid,
                                showintimeline: e.target.checked,
                              });
                            }}
                            name="checkedB"
                            color="primary"
                          />
                        }
                        label="Show in timeline"
                      />
                    </FormGroup>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        </TableContainer>
      </>
    );
  }
};

export default EventsTable;
