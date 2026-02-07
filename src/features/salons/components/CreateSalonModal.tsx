import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form, Switch } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salonApi } from '../api/salonApi';
import { barberApi } from '@/features/barbers/api/barberApi';
import { timingApi } from '@/features/timing/api/timingApi';
import { salonSchema, SalonSchema } from '../schemas/salonSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';

interface CreateSalonModalProps {
    open: boolean;
    onClose: () => void;
}

export const CreateSalonModal = ({ open, onClose }: CreateSalonModalProps) => {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<SalonSchema>({
        resolver: zodResolver(salonSchema),
        defaultValues: {
            isBookingClosed: false,
        }
    });

    const { data: barbersData } = useQuery({
        queryKey: ['barbers-all'],
        queryFn: () => barberApi.getBarbers({ limit: 100 }),
    });

    const { data: timingsData } = useQuery({
        queryKey: ['timings-all'],
        queryFn: () => timingApi.getTimings({ limit: 100 }),
    });

    const barberOptions = barbersData?.data.map(barber => ({
        label: barber.name,
        value: Number(barber.id)
    })) || [];

    const timingOptions = timingsData?.data.map(timing => ({
        label: `${timing.title} (${timing.startTime}${timing.startTimeAmPm} - ${timing.endTime}${timing.endTimeAmPm})`,
        value: Number(timing.id) || Number(timing._id) || 0 // Assuming numeric ID, fallback 0
    })) || [];

    const createMutation = useMutation({
        mutationFn: salonApi.createSalon,
        onSuccess: () => {
            message.success('Salon created successfully');
            queryClient.invalidateQueries({ queryKey: ['salons'] });
            reset();
            onClose();
        },
        onError: (error) => {
            message.error('Failed to create salon');
            console.error(error);
        }
    });

    const onSubmit = (data: SalonSchema) => {
        createMutation.mutate(data);
    };

    return (
        <Modal
            title="Add New Salon"
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
                                placeholder="Salon Name"
                                error={errors.name?.message}
                            />
                        </Col>
                        <Col span={12}>
                            <FormInput
                                name="description"
                                control={control}
                                label="Description"
                                placeholder="Description"
                                error={errors.description?.message}
                            />
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <FormSelect
                                name="barbersId"
                                control={control}
                                label="Associate Barbers"
                                options={barberOptions}
                                placeholder="Select Barbers"
                                mode="multiple"
                                error={errors.barbersId?.message}
                            />
                        </Col>
                        <Col span={12}>

                            <FormSelect
                                name="timingsId"
                                control={control}
                                label="Assign Timings"
                                options={timingOptions}
                                placeholder="Select Timings"
                                mode="multiple"
                                error={errors.timingsId?.message}
                            />
                        </Col>
                    </Row>

                    <Row gutter={16} className="mb-4">
                        <Col span={12}>
                            <Form.Item label="Booking Status" className="mb-0">
                                <Controller
                                    name="isBookingClosed"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onChange={field.onChange}
                                            checkedChildren="Closed"
                                            unCheckedChildren="Open"
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
                        Create Salon
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
