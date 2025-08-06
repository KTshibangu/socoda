import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertBusinessLicenseSchema } from "@shared/schema";
import { z } from "zod";

const licenseFormSchema = insertBusinessLicenseSchema;
type LicenseFormData = z.infer<typeof licenseFormSchema>;

interface LicenseApplicationFormProps {
  onCancel: () => void;
}

export default function LicenseApplicationForm({ onCancel }: LicenseApplicationFormProps) {
  const { toast } = useToast();

  const form = useForm<LicenseFormData>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: {
      businessName: "",
      businessType: "bar",
      contactEmail: "",
      contactPhone: "",
      address: "",
      annualFee: "0",
      status: "pending",
      appliedBy: "mock-user-id", // In production, this would come from auth
    },
  });

  const businessType = form.watch("businessType");

  // Get calculated fee when business type changes
  const { data: feeData } = useQuery({
    queryKey: ["/api/business-licenses/fee", businessType],
    enabled: !!businessType,
  });

  // Update form when fee data changes
  React.useEffect(() => {
    if (feeData?.fee) {
      form.setValue("annualFee", feeData.fee.toString());
    }
  }, [feeData, form]);

  const createLicenseMutation = useMutation({
    mutationFn: async (data: LicenseFormData) => {
      await apiRequest("POST", "/api/business-licenses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business-licenses"] });
      toast({
        title: "Success",
        description: "License application submitted successfully",
      });
      onCancel();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LicenseFormData) => {
    createLicenseMutation.mutate(data);
  };

  return (
    <Card className="max-w-2xl mx-auto" data-testid="card-license-application">
      <CardHeader>
        <CardTitle>Apply for Business License</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter business name"
                        {...field}
                        data-testid="input-business-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-business-type">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="venue">Venue</SelectItem>
                        <SelectItem value="radio">Radio</SelectItem>
                        <SelectItem value="tv">TV</SelectItem>
                        <SelectItem value="gym">Gym</SelectItem>
                        <SelectItem value="mall">Mall</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@business.com"
                        {...field}
                        data-testid="input-contact-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        data-testid="input-contact-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter full business address"
                      {...field}
                      data-testid="textarea-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fee Display */}
            <div>
              <FormLabel>Estimated Annual Fee</FormLabel>
              <div className="mt-1">
                <Input
                  value={feeData?.fee ? `$${feeData.fee.toLocaleString()}` : "$0.00"}
                  readOnly
                  className="bg-gray-50"
                  data-testid="input-annual-fee"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                data-testid="button-cancel-license"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createLicenseMutation.isPending}
                data-testid="button-submit-license"
              >
                {createLicenseMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
