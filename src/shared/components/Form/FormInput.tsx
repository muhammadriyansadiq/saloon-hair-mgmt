import { Controller, Control } from 'react-hook-form';
import { Input, Form } from 'antd';

interface FormInputProps {
    name: string;
    control: Control<any>;
    placeholder?: string;
    label?: string;
    type?: string;
    error?: string;
    className?: string;
}

export const FormInput = ({ name, control, placeholder, label, type = 'text', error, className }: FormInputProps) => {
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
                    <Input
                        {...field}
                        id={name}
                        type={type}
                        placeholder={placeholder}
                        className="w-full h-11 px-4 rounded-lg border-gray-200 hover:border-primary focus:border-primary"
                    />
                )}
            />
        </Form.Item>
    );
};
