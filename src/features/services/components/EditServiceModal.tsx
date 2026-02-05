import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form, Spin } from 'antd';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { serviceApi } from '../api/serviceApi';
import { barberApi } from '@/features/barbers/api/barberApi';
import { serviceSchema, ServiceSchema } from '../schemas/serviceSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';

interface EditServiceModalProps {
    open: boolean;
    onClose: () => void;
    serviceId: number | null;
}

export const EditServiceModal = ({ open, onClose, serviceId }: EditServiceModalProps) => {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ServiceSchema>({
        resolver: zodResolver(serviceSchema),
    });

    const { data: serviceResponse, isLoading } = useQuery({
        queryKey: ['service', serviceId],
        queryFn: () => serviceApi.getServiceById(serviceId!),
        enabled: !!serviceId && open,
    });

    const { data: barbersData } = useQuery({
        queryKey: ['barbers-all'],
        queryFn: () => barberApi.getBarbers({ limit: 100 }),
    });

    const barberOptions = barbersData?.data.map(barber => ({
        label: barber.name,
        value: Number(barber.id)
    })) || [];

    useEffect(() => {
        if (serviceResponse?.data) {
            const { name, description, duration, basePrice, discountPrice, premiumPrice, barbersId } = serviceResponse.data;
            // Handle barbersId: it might be an array of IDs or an array of Barber objects if populated
            // Check if we have 'barbers' property populated or if 'barbersId' is used
            // This depends on what the backend actually sends. Safest is to check both.
            let initialBarbers: number[] = [];
            if (Array.isArray(barbersId) && barbersId.length > 0) {
                // Check if it's numbers or objects (though type says numbers, runtime might differ)
                initialBarbers = barbersId.map((b: any) => typeof b === 'object' ? b.id : Number(b));
            } else if (serviceResponse.data.barbers && Array.isArray(serviceResponse.data.barbers)) {
                // If backend sends populated 'barbers' array
                initialBarbers = serviceResponse.data.barbers.map((b: any) => Number(b.id));
            }

            reset({
                name,
                description,
                duration,
                basePrice,
                discountPrice,
                premiumPrice,
                barbersId: initialBarbers,
            });
        }
    }, [serviceResponse, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: ServiceSchema) => serviceApi.updateService(serviceId!, data),
        onSuccess: () => {
            message.success('Service updated successfully');
            queryClient.invalidateQueries({ queryKey: ['services'] });
            onClose();
        },
        onError: (error) => {
            message.error('Failed to update service');
            console.error(error);
        }
    });

    const onSubmit = (data: ServiceSchema) => {
        updateMutation.mutate(data);
    };

    return (
        <Modal
            title="Edit Service"
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
                                    placeholder="Service Name"
                                    error={errors.name?.message}
                                />
                            </Col>
                            <Col span={12}>
                                <FormInput
                                    name="duration"
                                    control={control}
                                    label="Duration"
                                    placeholder="e.g. 1 Hours"
                                    error={errors.duration?.message}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <FormInput
                                    name="description"
                                    control={control}
                                    label="Description"
                                    placeholder="Service Description"
                                    error={errors.description?.message}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <FormInput
                                    name="basePrice"
                                    control={control}
                                    label="Base Price"
                                    placeholder="100"
                                    type="number"
                                    error={errors.basePrice?.message}
                                />
                            </Col>
                            <Col span={8}>
                                <FormInput
                                    name="discountPrice"
                                    control={control}
                                    label="Discount Price (Optional)"
                                    placeholder="50"
                                    type="number"
                                    error={errors.discountPrice?.message}
                                />
                            </Col>
                            <Col span={8}>
                                <FormInput
                                    name="premiumPrice"
                                    control={control}
                                    label="Premium Price (Optional)"
                                    placeholder="150"
                                    type="number"
                                    error={errors.premiumPrice?.message}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16} className="mb-4">
                            <Col span={24}>
                                <FormSelect
                                    name="barbersId"
                                    control={control}
                                    label="Assign Barbers"
                                    options={barberOptions}
                                    placeholder="Select Barbers"
                                    mode="multiple"
                                    error={errors.barbersId?.message}
                                />
                            </Col>
                        </Row>
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
                            Update Service
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
