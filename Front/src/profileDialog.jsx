import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function ProfileDialog({ open, onClose, dialogTitle, dialogContent }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="profile-dialog-title"
      aria-describedby="profile-dialog-description"
    >
      <DialogTitle id="profile-dialog-title" style={{fontWeight: 'bold', fontSize: '24px'}}>{dialogTitle || "No title"}</DialogTitle>
      <hr style={{ width: '90%', border: '1px solid #ccc', marginTop: '-4px', marginBottom: '5px', marginLeft: 'auto', marginRight: 'auto' }} />
      <DialogContent>
        <DialogContentText id="profile-dialog-description" style={{whiteSpace: 'pre-line'}}>
          {dialogContent || "Default text if none provided."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
