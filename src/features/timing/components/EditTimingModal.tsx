import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Spin, Form } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timingApi } from '../api/timingApi';
import { timingSchema, TimingSchema } from '../schemas/timingSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';
import { FormTimePicker } from '@/shared/components/Form/FormTimePicker';

interface EditTimingModalProps {
    open: boolean;
    onClose: () => void;
    timingId: string | null;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => ({ label: d, value: d }));

export const EditTimingModal = ({ open, onClose, timingId }: EditTimingModalProps) => {
    const queryClient = useQueryClient();
    const { control, handleSubmit, reset, setValue, watch, formState: { errors, isDirty } } = useForm<TimingSchema>({
        resolver: zodResolver(timingSchema),
    });

    const { data: timingResponse, isLoading } = useQuery({
        queryKey: ['timing', timingId],
        queryFn: () => timingApi.getTimingById(timingId!),
        enabled: !!timingId && open,
    });

    useEffect(() => {
        if (timingResponse?.data) {
            const { day, title, startTime, startTimeAmPm, endTime, endTimeAmPm, breakStartTime, breakStartTimeAmPm, breakEndTime, breakEndTimeAmPm } = timingResponse.data;
            reset({
                day,
                title,
                startTime,
                startTimeAmPm,
                endTime,
                endTimeAmPm,
                breakStartTime,
                breakStartTimeAmPm,
                breakEndTime,
                breakEndTimeAmPm
            });
        }
    }, [timingResponse, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: TimingSchema) => timingApi.updateTiming(timingId!, data),
        onSuccess: () => {
            message.success('Timing updated successfully');
            queryClient.invalidateQueries({ queryKey: ['timings'] });
            onClose();
        },
        onError: (error) => {
            message.error('Failed to update timing');
            console.error(error);
        }
    });

    const onSubmit = (data: TimingSchema) => {
        updateMutation.mutate(data);
    };

    return (
        <Modal
            title="Edit Timing"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
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
                                    placeholder="e.g. Regular Shift"
                                    error={errors.title?.message}
                                />
                            </Col>
                        </Row>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h3 className="text-sm font-semibold mb-3 text-gray-700">Working Hours</h3>
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

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h3 className="text-sm font-semibold mb-3 text-gray-700">Break Time</h3>
                            <Row gutter={16} align="bottom">
                                <Col span={12}>
                                    <FormTimePicker
                                        name="breakStartTime"
                                        amPmName="breakStartTimeAmPm"
                                        control={control}
                                        setValue={setValue}
                                        watch={watch}
                                        label="Break Start"
                                        error={errors.breakStartTime?.message}
                                    />
                                </Col>
                                <Col span={12}>
                                    <FormTimePicker
                                        name="breakEndTime"
                                        amPmName="breakEndTimeAmPm"
                                        control={control}
                                        setValue={setValue}
                                        watch={watch}
                                        label="Break End"
                                        error={errors.breakEndTime?.message}
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
                            Update Timing
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
