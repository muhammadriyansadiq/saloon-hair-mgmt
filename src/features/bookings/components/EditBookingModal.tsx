
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form, Spin, Input } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { barberApi } from '@/features/barbers/api/barberApi';
import { serviceApi } from '@/features/services/api/serviceApi';
import { packageApi } from '@/features/packages/api/packageApi';
import { bookingSchema } from '../schemas/bookingSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';

interface EditBookingModalProps {
    open: boolean;
    onClose: () => void;
    bookingId: number | null;
}

export const EditBookingModal = ({ open, onClose, bookingId }: EditBookingModalProps) => {
    const queryClient = useQueryClient();
    const [userName, setUserName] = useState('');

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
        resolver: zodResolver(bookingSchema),
    });

    const { data: bookingResponse, isLoading } = useQuery({
        queryKey: ['booking', bookingId],
        queryFn: () => bookingApi.getBookingById(bookingId!),
        enabled: !!bookingId && open,
    });

    // Fetch dependencies
    const { data: barbersData } = useQuery({ queryKey: ['barbers-all'], queryFn: () => barberApi.getBarbers({ limit: 100 }) });
    const { data: servicesData } = useQuery({ queryKey: ['services-all'], queryFn: () => serviceApi.getServices({ limit: 100 }) });
    const { data: packagesData } = useQuery({ queryKey: ['packages-all'], queryFn: () => packageApi.getPackages({ limit: 100 }) });

    const barberOptions = barbersData?.data.map(barber => ({ label: barber.name, value: Number(barber.id) })) || [];
    const serviceOptions = servicesData?.data.map(s => ({ label: `${s.name} ($${s.basePrice})`, value: Number(s.id) })) || [];
    const packageOptions = packagesData?.data.map(p => ({ label: `${p.packageName} ($${p.discountedPrice})`, value: Number(p.id) })) || [];

    useEffect(() => {
        if (bookingResponse?.data) {
            const { barberId, userId, services, packages, user } = bookingResponse.data;
            setUserName(user?.username || 'Unknown User');
            reset({
                barberId,
                userId,
                serviceIds: services?.map((s: any) => s.id) || [],
                packageIds: packages?.map((p: any) => p.id) || [],
            });
        }
    }, [bookingResponse, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => bookingApi.updateBooking(bookingId!, data),
        onSuccess: () => {
            message.success('Booking updated successfully');
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            onClose();
        },
        onError: (error) => {
            message.error('Failed to update booking');
            console.error(error);
        }
    });

    const onSubmit = (data: any) => {
        updateMutation.mutate(data);
    };

    return (
        <Modal
            title="Edit Booking"
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
                                    name="barberId"
                                    control={control}
                                    label="Select Barber"
                                    options={barberOptions}
                                    placeholder="Choose a barber"
                                    error={errors.barberId?.message as string}
                                />
                            </Col>
                            <Col span={12}>
                                <FormInput
                                    name="userId"
                                    control={control}
                                    type="hidden"
                                    className="hidden"
                                />
                                <Form.Item label="Customer">
                                    <Input
                                        value={userName}
                                        disabled
                                        className="w-full h-11 px-4 rounded-lg border-gray-200 text-gray-700 font-medium bg-gray-50"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <FormSelect
                                    name="serviceIds"
                                    control={control}
                                    label="Select Services"
                                    options={serviceOptions}
                                    placeholder="Choose services"
                                    mode="multiple"
                                    error={errors.serviceIds?.message as string}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <FormSelect
                                    name="packageIds"
                                    control={control}
                                    label="Select Packages"
                                    options={packageOptions}
                                    placeholder="Choose packages"
                                    mode="multiple"
                                    error={errors.packageIds?.message as string}
                                />
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
                            Update Booking
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
