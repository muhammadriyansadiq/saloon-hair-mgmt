import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form, Switch, Upload } from 'antd'; // Removed Input
import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { barberApi } from '../api/barberApi';
import { shiftApi } from '@/features/shifts/api/shiftApi'; // Reuse shift API
import { barberSchema, BarberSchema } from '../schemas/barberSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';

interface CreateBarberModalProps {
    open: boolean;
    onClose: () => void;
}

export const CreateBarberModal = ({ open, onClose }: CreateBarberModalProps) => {
    const queryClient = useQueryClient();
    const [fileList, setFileList] = useState<any[]>([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<BarberSchema>({
        resolver: zodResolver(barberSchema),
        defaultValues: {
            isAvailable: true,
            isPremium: false,
        }
    });

    // Fetch Shifts for Dropdown
    const { data: shiftsData } = useQuery({
        queryKey: ['shifts-all'], // Use a distinct key or params if needed to get ALL shifts
        queryFn: () => shiftApi.getShifts({ limit: 100 }), // Assuming we want all for dropdown
    });

    const shiftOptions = shiftsData?.data
        .filter(shift => shift.id || shift._id)
        .map(shift => ({
            label: `${shift.title} (${shift.startTime}${shift.startTimeAmPm} - ${shift.endTime}${shift.endTimeAmPm})`,
            value: (shift.id || shift._id) as string
        })) || [];

    const createMutation = useMutation({
        mutationFn: barberApi.createBarber,
        onSuccess: () => {
            message.success('Barber created successfully');
            queryClient.invalidateQueries({ queryKey: ['barbers'] });
            reset();
            setFileList([]);
            onClose();
        },
        onError: (error) => {
            message.error('Failed to create barber');
            console.error(error);
        }
    });

    const onSubmit = (data: BarberSchema) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('shiftId', String(data.shiftId));
        formData.append('isAvailable', String(data.isAvailable));
        formData.append('isPremium', String(data.isPremium));

        if (fileList.length > 0) {
            formData.append('picture', fileList[0].originFileObj);
        }

        createMutation.mutate(formData);
    };

    const handleDisplayFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Modal
            title="Add New Barber"
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            centered
        >
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <Form layout="vertical" component="div">
                    <Row gutter={16}>
                        <Col span={12}>
                            <FormInput
                                name="name"
                                control={control}
                                label="Name"
                                placeholder="Full Name"
                                error={errors.name?.message}
                            />
                        </Col>
                        <Col span={12}>
                            <FormInput
                                name="email"
                                control={control}
                                label="Email"
                                placeholder="email@example.com"
                                error={errors.email?.message}
                            />
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <FormInput
                                name="phone"
                                control={control}
                                label="Phone"
                                placeholder="03001234567"
                                error={errors.phone?.message}
                            />
                        </Col>
                        <Col span={12}>
                            <FormSelect
                                name="shiftId"
                                control={control}
                                label="Assign Shift"
                                options={shiftOptions}
                                placeholder="Select Shift"
                                error={errors.shiftId?.message}
                            />
                        </Col>
                    </Row>

                    <Row gutter={16} className="mb-4">
                        <Col span={12}>
                            <Form.Item label="Picture">
                                <Upload
                                    listType="picture"
                                    maxCount={1}
                                    fileList={fileList}
                                    beforeUpload={(file) => {
                                        setFileList([file]);
                                        return false; // Prevent auto upload
                                    }}
                                    onRemove={() => setFileList([])}
                                >
                                    <Button icon={<UploadOutlined />}>Select Picture</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Availability" className="mb-0">
                                <Controller
                                    name="isAvailable"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onChange={field.onChange}
                                            checkedChildren="Available"
                                            unCheckedChildren="Unavailable"
                                        />
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Premium Status" className="mb-0">
                                <Controller
                                    name="isPremium"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="bg-gray-300"
                                        />
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <div className="flex justify-end gap-3 mt-8">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={createMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Create Barber
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
