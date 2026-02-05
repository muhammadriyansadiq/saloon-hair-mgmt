import { TimePicker, Form } from 'antd';
import dayjs from 'dayjs';
import { Control, useController, UseFormSetValue } from 'react-hook-form';
import { AmPm } from '@/features/timing/types';

interface FormTimePickerProps {
    name: string; // "startTime"
    amPmName: string; // "startTimeAmPm"
    control: Control<any>;
    setValue: UseFormSetValue<any>;
    label?: string;
    error?: string;
    watch: (name: string) => any;
}

export const FormTimePicker = ({ name, amPmName, control, setValue, label, error, watch }: FormTimePickerProps) => {
    const timeValue = watch(name);
    const amPmValue = watch(amPmName);

    const getValue = () => {
        if (!timeValue || !amPmValue) return undefined;
        // Construct full time string "HH:mm A" for dayjs parsing
        // We need to convert 12h format back to a parseable string that Dayjs likes, or manually construct date
        // Simplest: "2020-01-01 10:00 PM"
        return dayjs(`2020-01-01 ${timeValue} ${amPmValue}`, 'YYYY-MM-DD hh:mm A');
    };

    return (
        <Form.Item
            label={label}
            validateStatus={error ? 'error' : ''}
            help={error}
            htmlFor={name}
            className="flex-1"
        >
            <TimePicker
                id={name}
                use12Hours
                format="h:mm a"
                value={getValue()}
                onChange={(date) => {
                    if (date) {
                        const timeStr = date.format('hh:mm');
                        const amPmStr = date.format('A') as AmPm;
                        setValue(name, timeStr, { shouldValidate: true, shouldDirty: true });
                        setValue(amPmName, amPmStr, { shouldValidate: true, shouldDirty: true });
                    } else {
                        setValue(name, '', { shouldValidate: true, shouldDirty: true });
                        setValue(amPmName, 'AM', { shouldValidate: true, shouldDirty: true });
                    }
                }}
                className="w-full h-11"
                needConfirm={false}
            />
        </Form.Item>
    );
};
