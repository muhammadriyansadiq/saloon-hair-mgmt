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

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<SalonSchema>({
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

            // Handle arrays which might be populated objects or IDs
            let initialBarbers: number[] = [];
            if (Array.isArray(barberId) && barberId.length > 0) {
                initialBarbers = barberId.map((b: any) => typeof b === 'object' ? b.id : Number(b));
            } else if (salonResponse.data.barbers && Array.isArray(salonResponse.data.barbers)) {
                initialBarbers = salonResponse.data.barbers.map((b: any) => Number(b.id));
            } else if (typeof barberId === 'number') {
                initialBarbers = [barberId]; // Fallback if single ID returned
            }

            let initialTimings: number[] = [];
            if (Array.isArray(timingsId) && timingsId.length > 0) {
                initialTimings = timingsId.map((t: any) => typeof t === 'object' ? t.id : Number(t));
            } else if (salonResponse.data.timings && Array.isArray(salonResponse.data.timings)) {
                initialTimings = salonResponse.data.timings.map((t: any) => Number(t.id));
            } else if (typeof timingsId === 'number') {
                initialTimings = [timingsId]; // Fallback
            }

            reset({
                name,
                description,
                barbersId: initialBarbers,
                timingsId: initialTimings,
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
                            loading={updateMutation.isPending}
                            disabled={!isDirty}
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
