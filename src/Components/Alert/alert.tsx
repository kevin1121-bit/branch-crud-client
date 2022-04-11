import { forwardRef } from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

export interface IAlert {
  severty: "success" | "error" | undefined;
  message: string;
  open: boolean;
}

const AlertCustom = forwardRef<HTMLDivElement, AlertProps>(
  function AlertCustomFun(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  }
);

interface IProps extends IAlert {
  onClose: () => void;
}

export default function Alert(props: IProps) {
  const { severty, onClose, message, open } = props;

  return (
    <div>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
          <AlertCustom
            onClose={onClose}
            severity={severty}
            sx={{ width: "100%" }}>
            {message}
          </AlertCustom>
        </Snackbar>
      </Stack>
    </div>
  );
}
