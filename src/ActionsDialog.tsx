import React from 'react';
import { DialogTitle, DialogContent, Button, Dialog } from '@mui/material';

/** Action Dialog props. */
interface ActionsDialogProps {
    /** Checks whether dialog is open. */
    open: boolean;
    /** Handle logic for closing the dialog. */
    onClose: (event: object, reason: string) => void;
    /** Handle logic for clicking the 'Edit' button. */
    onEditClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
    /** Handle logic for clicking the 'Remove' button. */
    onRemoveClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}
const ActionsDialog = (
    props: ActionsDialogProps
): React.ReactElement<ActionsDialogProps> => {
    return (
        <Dialog open={props.open} onClose={props.onClose} disableEscapeKeyDown>
            <DialogTitle style={{ alignSelf: 'center' }}>Actions</DialogTitle>
            <DialogContent>
                What would you like to do?
                <Button style={{ marginLeft: 30 }} onClick={props.onEditClick}>
                    Edit
                </Button>
                <Button
                    style={{ marginLeft: 10 }}
                    onClick={props.onRemoveClick}
                    color={'error'}
                >
                    Remove
                </Button>
            </DialogContent>
        </Dialog>
    );
};
export default ActionsDialog;
