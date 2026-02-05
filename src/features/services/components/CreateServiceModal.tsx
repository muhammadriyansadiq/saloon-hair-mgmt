import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form } from 'antd';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { serviceApi } from '../api/serviceApi';
import { barberApi } from '@/features/barbers/api/barberApi';
import { serviceSchema, ServiceSchema } from '../schemas/serviceSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';

interface CreateServiceModalProps {
    open: boolean;
    onClose: () => void;
}

export const CreateServiceModal = ({ open, onClose }: CreateServiceModalProps) => {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<ServiceSchema>({
        resolver: zodResolver(serviceSchema),
    });

    const { data: barbersData } = useQuery({
        queryKey: ['barbers-all'],
        queryFn: () => barberApi.getBarbers({ limit: 100 }),
    });

    const barberOptions = barbersData?.data.map(barber => ({
        label: barber.name,
        value: Number(barber.id)
    })) || [];

    const createMutation = useMutation({
        mutationFn: serviceApi.createService,
        onSuccess: () => {
            message.success('Service created successfully');
            queryClient.invalidateQueries({ queryKey: ['services'] });
            reset();
            onClose();
        },
        onError: (error) => {
            message.error('Failed to create service');
            console.error(error);
        }
    });

    const onSubmit = (data: ServiceSchema) => {
        createMutation.mutate(data);
    };

    return (
        <Modal
            title="Add New Service"
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
                        loading={createMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Create Service
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
