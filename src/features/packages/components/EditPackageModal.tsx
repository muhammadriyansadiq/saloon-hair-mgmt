import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, message, Row, Col, Form, Spin } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { packageApi } from '../api/packageApi';
import { serviceApi } from '@/features/services/api/serviceApi';
import { packageSchema, PackageSchema } from '../schemas/packageSchema';
import { FormInput } from '@/shared/components/Form/FormInput';
import { FormSelect } from '@/shared/components/Form/FormSelect';

interface EditPackageModalProps {
    open: boolean;
    onClose: () => void;
    packageId: number | null;
}

export const EditPackageModal = ({ open, onClose, packageId }: EditPackageModalProps) => {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PackageSchema>({
        resolver: zodResolver(packageSchema),
    });

    const { data: packageResponse, isLoading } = useQuery({
        queryKey: ['package', packageId],
        queryFn: () => packageApi.getPackageById(packageId!),
        enabled: !!packageId && open,
    });

    const { data: servicesData } = useQuery({
        queryKey: ['services-all'],
        queryFn: () => serviceApi.getServices({ limit: 100 }),
    });

    const serviceOptions = servicesData?.data.map(service => ({
        label: `${service.name} (${service.duration}) - $${service.basePrice}`,
        value: Number(service.id)
    })) || [];

    useEffect(() => {
        if (packageResponse?.data) {
            const { packageName, totalPrice, discountedPrice, totalDuration, services } = packageResponse.data;

            // Map services to their IDs
            const serviceIds = services?.map((s: any) => s.id) || [];

            reset({
                packageName,
                totalPrice: Number(totalPrice),
                discountedPrice: Number(discountedPrice),
                totalDuration,
                serviceIds,
            });
        }
    }, [packageResponse, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: PackageSchema) => packageApi.updatePackage(packageId!, data),
        onSuccess: () => {
            message.success('Package updated successfully');
            queryClient.invalidateQueries({ queryKey: ['packages'] });
            onClose();
        },
        onError: (error) => {
            message.error('Failed to update package');
            console.error(error);
        }
    });

    const onSubmit = (data: PackageSchema) => {
        updateMutation.mutate(data);
    };

    return (
        <Modal
            title="Edit Package"
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
                            loading={updateMutation.isPending}
                            disabled={!isDirty}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Update Package
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
