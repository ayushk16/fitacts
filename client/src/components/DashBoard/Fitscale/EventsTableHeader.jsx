import React from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';

const EventsTableHeader = ({
  valueToOrderBy,
  orderDirection,
  handleRequestSort,
}) => {
  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell key="eventname">
          <TableSortLabel
            active={valueToOrderBy === 'eventname'}
            direction={valueToOrderBy === 'eventname' ? orderDirection : 'asc'}
            onClick={createSortHandler('eventname')}
          >
            Workout Name
          </TableSortLabel>
        </TableCell>
        <TableCell key="activityname">
          <TableSortLabel
            active={valueToOrderBy === 'activityname'}
            direction={valueToOrderBy === 'activityname' ? orderDirection : 'asc'}
            onClick={createSortHandler('activityname')}
          >
            Activity
          </TableSortLabel>
        </TableCell>
        <TableCell key="distance">
          <TableSortLabel
            active={valueToOrderBy === 'distance'}
            direction={valueToOrderBy === 'distance' ? orderDirection : 'asc'}
            onClick={createSortHandler('distance')}
          >
            Distance
          </TableSortLabel>
        </TableCell>
        <TableCell key="duration">
          <TableSortLabel
            active={valueToOrderBy === 'duration'}
            direction={valueToOrderBy === 'duration' ? orderDirection : 'asc'}
            onClick={createSortHandler('duration')}
          >
            Duration
          </TableSortLabel>
        </TableCell>
        <TableCell key="timestamp">
          <TableSortLabel
            active={valueToOrderBy === 'timestamp'}
            direction={valueToOrderBy === 'timestamp' ? orderDirection : 'asc'}
            onClick={createSortHandler('timestamp')}
          >
            Date
          </TableSortLabel>
        </TableCell>
        <TableCell key="showintimeline">Timeline</TableCell>
        <TableCell key="actions" align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default EventsTableHeader;
