import React from 'react';
import {
    Button,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { formatTime } from './constants';
import './dialog.css';

const dialogStyle = {
    paddingTop: '4rem',
    paddingBottom: '4rem',
};

/** Availability Dialog props. */
interface AvailabilityDialogProps {
    /** Contents of day Select component. */
    dayChildren: string[];
    /** Contents of start Select component. */
    startChildren: number[];
    /** Contents of end Select component. */
    endChildren: number[];
    /** Checks whether dialog is open. */
    open: boolean;
    /** Handle logic for closing the dialog. */
    onClose: (event: object, reason: string) => void;
    /** Current value of day Select component. */
    dayValue: string;
    /** Current value of start Select component. */
    startValue: string;
    /** Current value of end Select component. */
    endValue: string;
    /** Handles logic when selected day is changed. */
    onDayChange: (event: any, value: unknown) => void;
    /** Handles logic when selected start is changed. */
    onStartChange: (event: any, value: unknown) => void;
    /** Handles logic when selected end is changed. */
    onEndChange: (event: any, value: unknown) => void;
    /** Checks whether 'Add' or 'Update' button should be disbaled. */
    disabled: boolean;
    /** Handles logic when 'Add' button is clicked. */
    onAdd: React.MouseEventHandler<HTMLButtonElement> | undefined;
    /** Handles logic when 'Update' button is clicked. */
    onUpdate: React.MouseEventHandler<HTMLButtonElement> | undefined;
    /** Checks whether an availability is being updated or created. */
    isUpdate: boolean;
}
const AvailabilityDialog = (
    props: AvailabilityDialogProps
): React.ReactElement<AvailabilityDialogProps> => {
    const dayList = props.dayChildren.map((day) => (
        <MenuItem key={day} value={day}>
            {day}
        </MenuItem>
    ));
    const startList = props.startChildren.map((time) => (
        <MenuItem key={time} value={time}>
            {formatTime(time)}
        </MenuItem>
    ));
    const endList = props.endChildren.map((time) => (
        <MenuItem key={time} value={time}>
            {formatTime(time)}
        </MenuItem>
    ));
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            fullWidth
            disableEscapeKeyDown
        >
            <DialogTitle style={{ alignSelf: 'center' }}>
                Availability
            </DialogTitle>
            <DialogContent className='availability-inputs' style={dialogStyle}>
                <FormControl>
                    <InputLabel required>Date</InputLabel>
                    <Select
                        style={{ minWidth: '8rem' }}
                        variant='standard'
                        defaultValue='Monday'
                        onChange={props.onDayChange}
                        value={props.dayValue}
                    >
                        {dayList}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel required>Start</InputLabel>
                    <Select
                        style={{ minWidth: '8rem' }}
                        variant='standard'
                        defaultValue=''
                        onChange={props.onStartChange}
                        value={props.startValue}
                    >
                        {startList}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel required>End</InputLabel>
                    <Select
                        style={{ minWidth: '8rem' }}
                        variant='standard'
                        defaultValue=''
                        onChange={props.onEndChange}
                        value={props.endValue}
                    >
                        {endList}
                    </Select>
                </FormControl>
                {!props.isUpdate && (
                    <Button
                        style={{ marginLeft: '50px', borderRadius: '50px' }}
                        variant='contained'
                        disabled={props.disabled}
                        onClick={props.onAdd}
                    >
                        Add
                    </Button>
                )}
                {props.isUpdate && (
                    <Button
                        style={{ marginLeft: '50px', borderRadius: '50px' }}
                        variant='contained'
                        disabled={props.disabled}
                        onClick={props.onUpdate}
                    >
                        Update
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    );
};
export default AvailabilityDialog;
