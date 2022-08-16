import React from 'react';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { Button } from '@mui/material';
import {
    DEFAULT_AVAILIBILTITY,
    DAYS_OF_WEEK,
    DAY_MAP,
    formatTime,
} from './constants';
import theme from './theme';
import TimeButton from './TimeButton';
import AvailabilityDialog from './AvailabilityDialog';
import ActionsDialog from './ActionsDialog';
import { availabilty, availabiltyList } from './types';
import './App.css';

/** List of user availabilty. */
const availablePeriods: availabiltyList = [];

/** Pre-load default availabilties into avaialable periods. */
for (let x in DEFAULT_AVAILIBILTITY) {
    availablePeriods.push(DEFAULT_AVAILIBILTITY[x]);
}

/** Get 3 letter day abbreviations. */
const getAbbrev = (day: string): string => {
    return day.slice(0, 3);
};

/**
 * Returns an array of hours 0-23.
 *
 * @returns Array of numbers.
 */
const getTime = (): number[] => {
    let time = [];
    for (let i = 0; i < 24; i++) {
        time.push(i);
    }
    return time;
};

function App() {
    /**
     * Start and end value need to be strings here to be able
     * to start off with blank values without using null
     * or undefined. The data is then processed as numbers.
     */
    const [dayValue, setDayValue] = React.useState('');
    const [startValue, setStartValue] = React.useState('');
    const [endValue, setEndValue] = React.useState('');
    const [addOpen, setAddOpen] = React.useState(false);
    const [actionsOpen, setActionsOpen] = React.useState(false);
    const [updateEnabled, setUpdateEnabled] = React.useState(false);
    const [updatingDayValue, setUpdatingDayValue] = React.useState('');
    const [updatingStartValue, setUpdatingStartValue] = React.useState('');
    const [updatingEndValue, setUpdatingEndValue] = React.useState('');

    /**
     * List of TimeButton items based on availablePeriods entries.
     * Sorted by day and start time.
     */
    const timeButtons = availablePeriods.map((obj) => {
        availablePeriods.sort((a, b) => a.start - b.start);
        availablePeriods.sort((a, b) => DAY_MAP[a.day] - DAY_MAP[b.day]);
        return (
            <li
                className='availability-items'
                key={`${obj.day}-${obj.start}-${obj.end}`}
            >
                <TimeButton
                    day={getAbbrev(obj.day)}
                    start={formatTime(obj.start)}
                    end={formatTime(obj.end)}
                    onClick={() => handleActionsDialog(obj)}
                />
            </li>
        );
    });

    /** Clears availability values. */
    const clearValues = (): void => {
        setDayValue('');
        setStartValue('');
        setEndValue('');
    };

    /** Closes Dialog and clears state values. */
    const handleAddClose = () => {
        setAddOpen(false);
        clearValues();
        setUpdateEnabled(false);
    };

    /**
     * Logic whether to enable or disable Add/Update button based on user selection.
     *
     * @returns {boolean}
     */
    const isButtonDisabled = (): boolean => {
        return dayValue === '' || startValue === '' || endValue === '';
    };

    /**
     * Logic to modify the availability's start time value.
     *
     * @param {string} time Time value of the Select component.
     */
    const handleStartChange = (time: string): void => {
        setStartValue(time);
        if (Number(time) > Number(endValue)) setEndValue('');
    };

    /**
     * Logic to handle a new availability creation that overlaps an existing one.
     * Works with addAvailability, broken into separate function for reduction in complexity.
     *
     * Merges 2 availability slots together if the start time of the new slot is earlier than
     * the original one, and the original slot's end time is later than the new one.
     * Ex: 9am-12pm and 7am-10am becomes 7am-12pm.
     *
     * @param {string} day The day of the week.
     * @param {number} start The availability start time.
     * @param {availabilty} i Availability object.
     * @param {number} index Index in availablePeriods array.
     * @param {number} count Running count of how many times a merge has occured.
     * @returns {number} Updated counter.
     */
    const handleEarlierStart = (
        day: string,
        start: number,
        i: availabilty,
        index: number,
        count: number
    ): number => {
        // Remove original entry for the day.
        availablePeriods.splice(index, 1);
        count++;
        //More than 1 operation needed, rerun with new merged availability.
        if (count > 1) {
            addAvailability(day, start, i.end);
        } else {
            // Merge complete, push new availability.
            availablePeriods.splice(index, 0, {
                day,
                start,
                end: i.end,
            });
        }
        return count;
    };

    /**
     * Logic to handle a new availability creation that overlaps an existing one.
     * Works with addAvailability, broken into separate function for reduction in complexity.
     *
     * Merges 2 availability slots together if the start time of the original slot is earlier than
     * the new one, and the new slot's end time is later than the original.
     * Ex: 9am-12pm and 11am-3pm becomes 9am-3pm.
     *
     * @param {string} day The day of the week.
     * @param {number} end The availability end time.
     * @param {availabilty} i Availability object.
     * @param {number} index Index in availablePeriods array.
     * @param {number} count Running count of how many times a merge has occured.
     * @returns {number} Updated counter.
     */
    const handleLaterEnd = (
        day: string,
        end: number,
        i: availabilty,
        index: number,
        count: number
    ): number => {
        availablePeriods.splice(index, 1);
        count++;
        count > 1
            ? addAvailability(day, i.start, end)
            : availablePeriods.splice(index, 0, {
                  day,
                  start: i.start,
                  end,
              });
        return count;
    };

    /**
     * Checks if two given availability objects are the same as each other.
     *
     * @param {availabilty} obj1 Availability object 1.
     * @param {availabilty} obj2 Availability object 2.
     * @returns {boolean}
     */
    const compareDayTime = (obj1: availabilty, obj2: availabilty): boolean => {
        return (
            obj1.day === obj2.day &&
            obj1.start === obj2.start &&
            obj1.end === obj2.end
        );
    };

    /**
     * Logic to add selected availability to the availablePeriods array.
     *
     * @param {string} day The day of the week.
     * @param {number} start The availability start time.
     * @param {number} end The availability end time.
     */
    const addAvailability = (day: string, start: number, end: number) => {
        // See if there is already availability for current day.
        if (availablePeriods.findIndex((object) => object.day === day) !== -1) {
            const x = availablePeriods.filter((object) => object.day === day);
            let count = 0;
            // Check if availability can be added to current availabilty with no gap to prevent overlap.
            for (let i of x) {
                let index = availablePeriods.findIndex((object) =>
                    compareDayTime(object, i)
                );
                // Desired availability already covered by bigger availability.
                if (start > i.start && end <= i.end) break;
                // Earlier start and later end.
                else if (start <= i.start && end >= i.end) {
                    availablePeriods.splice(index, 1);
                    if (count > 0) {
                        addAvailability(day, i.start, end);
                    } else if (
                        availablePeriods.findIndex((object) =>
                            compareDayTime(object, { day, start, end })
                        ) === -1
                    ) {
                        availablePeriods.splice(index, 0, {
                            day,
                            start,
                            end,
                        });
                        count++;
                    }
                }
                // Earlier start, end in current avalibility.
                else if (start <= i.start && end >= i.start && end <= i.end) {
                    count = handleEarlierStart(day, start, i, index, count);
                }
                // Later end, start in current avalibility.
                else if (start >= i.start && end >= i.end && start <= i.end) {
                    count = handleLaterEnd(day, end, i, index, count);
                }
                // Can't merge new availability slot with an existing, new entry.
                else {
                    if (
                        availablePeriods.findIndex((object) =>
                            compareDayTime(object, { day, start, end })
                        ) === -1 &&
                        count < 1
                    ) {
                        availablePeriods.push({ day, start, end });
                        count++;
                    }
                    break;
                }
                handleAddClose();
            }
        }
        //New entry.
        else {
            availablePeriods.push({ day, start, end });
        }
        handleAddClose();
    };
    /**
     * Updates the selected time slot's values with new user-given info.
     *
     * @param {string} day The selected availabilty's day value.
     * @param {number} start The selected availabilty's start value.
     * @param {number} end The selected availabilty's end value.
     */
    const updateAvailability = (
        day: string,
        start: number,
        end: number
    ): void => {
        let index = availablePeriods.findIndex((object) =>
            compareDayTime(object, {
                day: updatingDayValue,
                start: Number(updatingStartValue),
                end: Number(updatingEndValue),
            })
        );
        availablePeriods.splice(index, 1);
        addAvailability(day, start, end);
        handleAddClose();
        setUpdateEnabled(false);
        setUpdatingDayValue('');
        setUpdatingStartValue('');
        setUpdatingEndValue('');
    };

    /**
     * Opens Actions dialog and populates states with selected TimeButton values.
     *
     * @param {availabilty} x Availability object.
     */
    const handleActionsDialog = (x: availabilty): void => {
        setActionsOpen(true);
        setDayValue(x.day);
        setStartValue(String(x.start));
        setEndValue(String(x.end));
    };

    /** Removes the time slot from the array and resets state values. */
    const handleRemoveButton = (): void => {
        let index = availablePeriods.findIndex((object) =>
            compareDayTime(object, {
                day: dayValue,
                start: Number(startValue),
                end: Number(endValue),
            })
        );
        availablePeriods.splice(index, 1);
        setActionsOpen(false);
        clearValues();
    };

    /** Opens Availability dialog. */
    const handleEditButton = (): void => {
        setActionsOpen(false);
        setAddOpen(true);
        setUpdateEnabled(true);
        setUpdatingDayValue(dayValue);
        setUpdatingStartValue(startValue);
        setUpdatingEndValue(endValue);
    };

    /** Closes Actions dialog and resets state values. */
    const handleActionsClose = (): void => {
        setActionsOpen(false);
        clearValues();
    };

    /**
     * Available values in the Select component.
     * End values are filtered based of user selection of start values.
     */
    const startTime: number[] = getTime().filter((time) => time < 23);
    const endTime: number[] = getTime().filter(
        (time) => time > Number(startValue) && time < 24
    );

    return (
        <ThemeProvider theme={theme}>
            <div className='App'>
                <header className='App-header'>
                    <Typography
                        variant='h2'
                        style={{ paddingBottom: '10%', paddingTop: 25 }}
                    >
                        Availability Calendar
                    </Typography>
                    <Button
                        style={{ marginRight: '20px' }}
                        className='action-buttons'
                        onClick={() => setAddOpen(true)}
                        variant='contained'
                    >
                        Add Availability
                    </Button>
                    <Button
                        className='action-buttons'
                        onClick={() => {
                            console.log(JSON.stringify(availablePeriods));
                        }}
                        variant='contained'
                        color='error'
                    >
                        Print Availability
                    </Button>
                    <AvailabilityDialog
                        dayChildren={DAYS_OF_WEEK}
                        startChildren={startTime}
                        endChildren={endTime}
                        open={addOpen}
                        onClose={handleAddClose}
                        dayValue={dayValue}
                        startValue={startValue}
                        endValue={endValue}
                        onDayChange={(e): void => {
                            setDayValue(e.target.value);
                        }}
                        onStartChange={(e): void => {
                            handleStartChange(e.target.value);
                        }}
                        onEndChange={(e): void => {
                            setEndValue(e.target.value);
                        }}
                        disabled={isButtonDisabled()}
                        onAdd={() =>
                            addAvailability(
                                dayValue,
                                Number(startValue),
                                Number(endValue)
                            )
                        }
                        onUpdate={() =>
                            updateAvailability(
                                dayValue,
                                Number(startValue),
                                Number(endValue)
                            )
                        }
                        isUpdate={updateEnabled}
                    />
                    <Typography
                        variant='h3'
                        gutterBottom
                        style={{ marginTop: '75px' }}
                    >
                        My Availabilty
                    </Typography>
                    <Typography variant='subtitle1' fontStyle='italic'>
                        Click on availability slots to view more actions.
                    </Typography>
                    <ul className='availability-container'>{timeButtons}</ul>
                    <ActionsDialog
                        open={actionsOpen}
                        onRemoveClick={() => handleRemoveButton()}
                        onEditClick={() => handleEditButton()}
                        onClose={() => handleActionsClose()}
                    />
                </header>
            </div>
        </ThemeProvider>
    );
}
export default App;
