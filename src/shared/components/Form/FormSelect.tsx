import { Controller, Control } from 'react-hook-form';
import { Select, Form } from 'antd';

interface Option {
    label: string;
    value: string | number;
}

interface FormSelectProps {
    name: string;
    control: Control<any>;
    options: Option[];
    placeholder?: string;
    label?: string;
    error?: string;
    className?: string;
}

export const FormSelect = ({ name, control, options, placeholder, label, error, className }: FormSelectProps) => {
    return (
        <Form.Item
            label={label}
            htmlFor={name}
            validateStatus={error ? 'error' : ''}
            help={error}
            className={className}
        >
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        id={name}
                        placeholder={placeholder}
                        options={options}
                        className="w-full h-11"
                    />
                )}
            />
        </Form.Item>
    );
};
