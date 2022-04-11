import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface IProps {
  close: () => void;
  content: JSX.Element;
  open: boolean;
  title: JSX.Element | string;
}

export default function Modal(props: IProps) {
  const { close, content, title, open } = props;

  return (
    <div>
      <BootstrapDialog aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle id='customized-dialog-title' sx={{ textAlign: "center" }}>
          <strong>{title}</strong>
          <IconButton
            aria-label='close'
            onClick={close}
            sx={{ position: "absolute", right: 0, top: 5 }}>
            <CloseIcon width={16} height={16} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{content}</DialogContent>
      </BootstrapDialog>
    </div>
  );
}
