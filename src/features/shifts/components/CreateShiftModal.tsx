import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftApi } from '../api/shiftApi';
import { shiftSchema, ShiftSchema } from '../schemas/shiftSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';
import { FormTimePicker } from '@/shared/components/Form/FormTimePicker';

interface CreateShiftModalProps {
    open: boolean;
    onClose: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => ({ label: d, value: d }));

export const CreateShiftModal = ({ open, onClose }: CreateShiftModalProps) => {
    const queryClient = useQueryClient();
    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ShiftSchema>({
        resolver: zodResolver(shiftSchema),
        defaultValues: {
            day: 'Monday',
            startTime: '09:00',
            startTimeAmPm: 'AM',
            endTime: '05:00',
            endTimeAmPm: 'PM',
        }
    });

    const createMutation = useMutation({
        mutationFn: shiftApi.createShift,
        onSuccess: () => {
            message.success('Shift created successfully');
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
            reset();
            onClose();
        },
        onError: (error) => {
            message.error('Failed to create shift');
            console.error(error);
        }
    });

    const onSubmit = (data: ShiftSchema) => {
        createMutation.mutate(data);
    };

    return (
        <Modal
            title="Create New Shift"
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
                        loading={createMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Create Shift
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
