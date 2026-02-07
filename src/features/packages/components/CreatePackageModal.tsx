import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { packageApi } from '../api/packageApi';
import { serviceApi } from '@/features/services/api/serviceApi';
import { packageSchema, PackageSchema } from '../schemas/packageSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';

interface CreatePackageModalProps {
    open: boolean;
    onClose: () => void;
}

export const CreatePackageModal = ({ open, onClose }: CreatePackageModalProps) => {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<PackageSchema>({
        resolver: zodResolver(packageSchema),
    });

    const { data: servicesData } = useQuery({
        queryKey: ['services-all'],
        queryFn: () => serviceApi.getServices({ limit: 100 }),
    });

    const serviceOptions = servicesData?.data.map(service => ({
        label: `${service.name} (${service.duration}) - $${service.basePrice}`,
        value: Number(service.id)
    })) || [];

    const createMutation = useMutation({
        mutationFn: packageApi.createPackage,
        onSuccess: () => {
            message.success('Package created successfully');
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            reset();
            onClose();
        },
        onError: (error) => {
            message.error('Failed to create package');
            console.error(error);
        }
    });

    const onSubmit = (data: PackageSchema) => {
        createMutation.mutate(data);
    };

    return (
        <Modal
            title="Add New Package"
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
                                name="packageName"
                                control={control}
                                label="Package Name"
                                placeholder="e.g. Bridal Package"
                                error={errors.packageName?.message}
                            />
                        </Col>
                        <Col span={12}>
                            <FormInput
                                name="totalDuration"
                                control={control}
                                label="Total Duration"
                                placeholder="e.g. 120 mins"
                                error={errors.totalDuration?.message}
                            />
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <FormInput
                                name="totalPrice"
                                control={control}
                                label="Total Price"
                                type="number"
                                placeholder="0.00"
                                error={errors.totalPrice?.message}
                            />
                        </Col>
                        <Col span={12}>
                            <FormInput
                                name="discountedPrice"
                                control={control}
                                label="Discounted Price"
                                type="number"
                                placeholder="0.00"
                                error={errors.discountedPrice?.message}
                            />
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <FormSelect
                                name="serviceIds"
                                control={control}
                                label="Included Services"
                                options={serviceOptions}
                                placeholder="Select Services"
                                mode="multiple"
                                error={errors.serviceIds?.message}
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
                        Create Package
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
