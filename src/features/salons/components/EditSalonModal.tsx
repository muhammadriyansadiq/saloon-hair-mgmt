import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form, Switch, Spin } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salonApi } from '../api/salonApi';
import { barberApi } from '@/features/barbers/api/barberApi';
import { timingApi } from '@/features/timing/api/timingApi';
import { salonSchema, SalonSchema } from '../schemas/salonSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';

interface EditSalonModalProps {
    open: boolean;
    onClose: () => void;
    salonId: number | null;
}

export const EditSalonModal = ({ open, onClose, salonId }: EditSalonModalProps) => {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<SalonSchema>({
        resolver: zodResolver(salonSchema),
    });

    const { data: salonResponse, isLoading } = useQuery({
        queryKey: ['salon', salonId],
        queryFn: () => salonApi.getSalonById(salonId!),
        enabled: !!salonId && open,
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
        value: Number(timing.id) || Number(timing._id) || 0
    })) || [];

    useEffect(() => {
        if (salonResponse?.data) {
            const { name, description, barberId, timingsId, isBookingClosed } = salonResponse.data;
            reset({
                name,
                description,
                barberId: Number(barberId),
                timingsId: Number(timingsId),
                isBookingClosed,
            });
        }
    }, [salonResponse, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: SalonSchema) => salonApi.updateSalon(salonId!, data),
        onSuccess: () => {
            message.success('Salon updated successfully');
            queryClient.invalidateQueries({ queryKey: ['salons'] });
            onClose();
        },
        onError: (error) => {
            message.error('Failed to update salon');
            console.error(error);
        }
    });

    const onSubmit = (data: SalonSchema) => {
        updateMutation.mutate(data);
    };

    return (
        <Modal
            title="Edit Salon"
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
                                    name="barberId"
                                    control={control}
                                    label="Associate Barber"
                                    options={barberOptions}
                                    placeholder="Select Barber"
                                    error={errors.barberId?.message}
                                />
                            </Col>
                            <Col span={12}>
                                <FormSelect
                                    name="timingsId"
                                    control={control}
                                    label="Assign Timing"
                                    options={timingOptions}
                                    placeholder="Select Timing"
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
                            loading={updateMutation.isPending}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Update Salon
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
