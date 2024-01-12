import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const TransactionDetailsDialog = ({ open, handleClose, activitys }) => {
    const shortenHash = (hash) => {
        return hash?.substring(0, 4) + '...' + hash?.substring(hash.length - 4);
    };
console.log(activitys)
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <div style={{ position: 'absolute', right: 0, top: 0 }}>
                <IconButton aria-label="Close" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            <DialogContent>
                <Typography variant="h6" gutterBottom>
                    <b>Transaction Details</b>
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">
                            <b>Sender Address:</b>
                        </Typography>
                        <Typography variant="body1">
                            {shortenHash(activitys.txreceipt.Sender)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">
                            <b>Receiver Address:</b>
                        </Typography>
                        <Typography variant="body1">
                            {shortenHash(activitys.txreceipt.Recipient)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">
                            <b>Amount:</b>
                        </Typography>
                        <Typography variant="body1">{activitys.txreceipt.Amount}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">
                            <b>Block Hash:</b>
                        </Typography>
                        <Typography variant="body1">
                            {shortenHash(activitys.txreceipt.BlockHash)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">
                            <b>Transaction Hash:</b>
                        </Typography>
                        <Typography variant="body1">
                            {shortenHash(activitys.txreceipt.TxHash)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">
                            <b>Date Time:</b>
                        </Typography>
                        <Typography variant="body1">
                            {new Date(activitys.Date).toLocaleString()}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionDetailsDialog;
