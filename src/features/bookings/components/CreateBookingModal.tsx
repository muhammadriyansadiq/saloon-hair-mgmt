
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form, Input } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { barberApi } from '@/features/barbers/api/barberApi';
import { serviceApi } from '@/features/services/api/serviceApi';
import { packageApi } from '@/features/packages/api/packageApi';
import { bookingSchema } from '../schemas/bookingSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';

interface CreateBookingModalProps {
    open: boolean;
    onClose: () => void;
}

export const CreateBookingModal = ({ open, onClose }: CreateBookingModalProps) => {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            serviceIds: [],
            packageIds: [],
            userId: 3,
        }
    });

    // Fetch Barbers
    const { data: barbersData } = useQuery({
        queryKey: ['barbers-all'],
        queryFn: () => barberApi.getBarbers({ limit: 100 }),
    });

    // Fetch Services
    const { data: servicesData } = useQuery({
        queryKey: ['services-all'],
        queryFn: () => serviceApi.getServices({ limit: 100 }),
    });

    // Fetch Packages
    const { data: packagesData } = useQuery({
        queryKey: ['packages-all'],
        queryFn: () => packageApi.getPackages({ limit: 100 }),
    });

    const barberOptions = barbersData?.data.map(barber => ({
        label: barber.name,
        value: Number(barber.id)
    })) || [];

    const serviceOptions = servicesData?.data.map(service => ({
        label: `${service.name} (${service.duration}) - $${service.basePrice}`,
        value: Number(service.id)
    })) || [];

    const packageOptions = packagesData?.data.map(pkg => ({
        label: `${pkg.packageName} (${pkg.totalDuration}) - $${pkg.discountedPrice}`,
        value: Number(pkg.id)
    })) || [];

    const createMutation = useMutation({
        mutationFn: bookingApi.createBooking,
        onSuccess: () => {
            message.success('Booking created successfully');
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            reset();
            onClose();
        },
        onError: (error) => {
            message.error('Failed to create booking');
            console.error(error);
        }
    });

    const onSubmit = (data: any) => {
        createMutation.mutate(data);
    };

    return (
        <Modal
            title="Create New Booking"
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
                                name="barberId"
                                control={control}
                                label="Select Barber"
                                options={barberOptions}
                                placeholder="Choose a barber"
                                error={errors.barberId?.message as string}
                            />
                        </Col>
                        <Col span={12}>
                            {/* Hidden User ID Field */}
                            <FormInput
                                name="userId"
                                control={control}
                                type="hidden"
                                className="hidden"
                            />
                            {/* Visual Customer Name Field */}
                            <Form.Item label="Customer">
                                <Input
                                    value="Akhtar Hameed"
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
                        loading={createMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Create Booking
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
