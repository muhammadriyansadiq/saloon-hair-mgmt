import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form, Switch, Upload, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { barberApi } from '../api/barberApi';
import { shiftApi } from '@/features/shifts/api/shiftApi';
import { barberSchema, BarberSchema } from '../schemas/barberSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';

interface EditBarberModalProps {
    open: boolean;
    onClose: () => void;
    barberId: number | null;
}

export const EditBarberModal = ({ open, onClose, barberId }: EditBarberModalProps) => {
    const queryClient = useQueryClient();
    const [fileList, setFileList] = useState<any[]>([]);

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<BarberSchema>({
        resolver: zodResolver(barberSchema),
    });

    const { data: barberResponse, isLoading } = useQuery({
        queryKey: ['barber', barberId],
        queryFn: () => barberApi.getBarberById(barberId!),
        enabled: !!barberId && open,
    });

    const { data: shiftsData } = useQuery({
        queryKey: ['shifts-all'],
        queryFn: () => shiftApi.getShifts({ limit: 100 }),
    });

    const shiftOptions = shiftsData?.data.map(shift => ({
        label: `${shift.title} (${shift.startTime}${shift.startTimeAmPm} - ${shift.endTime}${shift.endTimeAmPm})`,
        value: shift.id || shift._id || ''
    })) || [];

    useEffect(() => {
        if (barberResponse?.data) {
            const { name, email, phone, shiftId, isAvailable, isPremium, picture } = barberResponse.data;
            reset({
                name,
                email,
                phone,
                shiftId: Number(shiftId),
                isAvailable,
                isPremium,
            });
            // If there's an existing picture, show it in the list (visual only)
            if (picture) {
                setFileList([{
                    uid: '-1',
                    name: 'Current Profile Picture',
                    status: 'done',
                    url: picture,
                }]);
            } else {
                setFileList([]);
            }
        }
    }, [barberResponse, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: FormData) => barberApi.updateBarber(barberId!, data),
        onSuccess: () => {
            message.success('Barber updated successfully');
            queryClient.invalidateQueries({ queryKey: ['barbers'] });
            onClose();
        },
        onError: (error) => {
            message.error('Failed to update barber');
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

        // Only append picture if a NEW file is selected
        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('picture', fileList[0].originFileObj);
        }

        updateMutation.mutate(formData);
    };

    return (
        <Modal
            title="Edit Barber"
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            centered
        >
            {isLoading ? (
                <div className="flex justify-center py-10"><Spin /></div>
            ) : (
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
                                            return false;
                                        }}
                                        onRemove={() => setFileList([])}
                                    >
                                        <Button icon={<UploadOutlined />}>Change Picture</Button>
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
                            // disabled={!isDirty && fileList.length === 0} // Optional strictness
                            loading={updateMutation.isPending}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Update Barber
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
