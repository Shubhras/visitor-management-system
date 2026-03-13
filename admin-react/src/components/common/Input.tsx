import { forwardRef } from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

export type InputProps = TextFieldProps;

const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => {
    return (
        <TextField
            fullWidth
            variant="outlined"
            size="medium"
            ref={ref}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export default Input;
