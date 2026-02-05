import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Spin, Form } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shiftApi } from '../api/shiftApi';
import { shiftSchema, ShiftSchema } from '../schemas/shiftSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';
import { FormTimePicker } from '@/shared/components/Form/FormTimePicker';

interface EditShiftModalProps {
    open: boolean;
    onClose: () => void;
    shiftId: string | null;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => ({ label: d, value: d }));

export const EditShiftModal = ({ open, onClose, shiftId }: EditShiftModalProps) => {
    const queryClient = useQueryClient();
    const { control, handleSubmit, reset, setValue, watch, formState: { errors, isDirty } } = useForm<ShiftSchema>({
        resolver: zodResolver(shiftSchema),
    });

    const { data: shiftResponse, isLoading } = useQuery({
        queryKey: ['shift', shiftId],
        queryFn: () => shiftApi.getShiftById(shiftId!),
        enabled: !!shiftId && open,
    });

    useEffect(() => {
        if (shiftResponse?.data) {
            const { day, title, startTime, startTimeAmPm, endTime, endTimeAmPm } = shiftResponse.data;
            reset({
                day,
                title,
                startTime,
                startTimeAmPm,
                endTime,
                endTimeAmPm
            });
        }
    }, [shiftResponse, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: ShiftSchema) => shiftApi.updateShift(shiftId!, data),
        onSuccess: () => {
            message.success('Shift updated successfully');
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
            onClose();
        },
        onError: (error) => {
            message.error('Failed to update shift');
            console.error(error);
        }
    });

    const onSubmit = (data: ShiftSchema) => {
        updateMutation.mutate(data);
    };

    return (
        <Modal
            title="Edit Shift"
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
                                <FormSelect
                                    name="day"
                                    control={control}
                                    label="Day"
                                    options={DAYS}
                                    placeholder="Select Day"
                                    error={errors.day?.message}
                                />
                            </Col>
                            <Col span={12}>
                                <FormInput
                                    name="title"
                                    control={control}
                                    label="Title"
                                    placeholder="e.g. Morning Shift"
                                    error={errors.title?.message}
                                />
                            </Col>
                        </Row>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h3 className="text-sm font-semibold mb-3 text-gray-700">Shift Timing</h3>
                            <Row gutter={16} align="bottom">
                                <Col span={12}>
                                    <FormTimePicker
                                        name="startTime"
                                        amPmName="startTimeAmPm"
                                        control={control}
                                        setValue={setValue}
                                        watch={watch}
                                        label="Start Time"
                                        error={errors.startTime?.message}
                                    />
                                </Col>
                                <Col span={12}>
                                    <FormTimePicker
                                        name="endTime"
                                        amPmName="endTimeAmPm"
                                        control={control}
                                        setValue={setValue}
                                        watch={watch}
                                        label="End Time"
                                        error={errors.endTime?.message}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Form>

                    <div className="flex justify-end gap-3 mt-8">
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={!isDirty}
                            loading={updateMutation.isPending}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Update Shift
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
