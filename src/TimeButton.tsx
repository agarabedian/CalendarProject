import React from 'react';
import Button from '@mui/material/Button';

const myStyle = {
    width: 200,
    borderRadius: '20px',
};

/** Time Button props. */
interface TimeButtonProps {
    /** Availability object's day value. */
    day: string;
    /** Availability object's start value. */
    start: string;
    /** Availability object's end value. */
    end: string;
    /** Handles logic when time button is clicked. */
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}
const TimeButton = (
    props: TimeButtonProps
): React.ReactElement<TimeButtonProps> => {
    return (
        <Button
            style={myStyle}
            variant='contained'
            color='success'
            size='large'
            onClick={props.onClick}
        >
            {props.day} | {props.start} - {props.end}
        </Button>
    );
};
export default TimeButton;
