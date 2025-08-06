import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";
import { insertWorkSchema, insertContributorSchema, type User } from "@shared/schema";
import { z } from "zod";

const workFormSchema = insertWorkSchema.extend({
  contributors: z.array(insertContributorSchema.omit({ workId: true })),
});

type WorkFormData = z.infer<typeof workFormSchema>;

interface Contributor {
  userId: string;
  role: "composer" | "author" | "vocalist";
  percentage: string;
  userName?: string;
}

export default function WorkRegistrationForm() {
  const { toast } = useToast();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<WorkFormData>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      title: "",
      iswc: "",
      isrc: "",
      duration: "",
      status: "pending",
      registeredBy: "mock-user-id", // In production, this would come from auth
      contributors: [],
    },
  });

  const { data: searchResults } = useQuery<User[]>({
    queryKey: ["/api/users/search", { q: searchTerm }],
    enabled: searchTerm.length > 2,
  });

  const createWorkMutation = useMutation({
    mutationFn: async (data: WorkFormData) => {
      await apiRequest("POST", "/api/works", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/works"] });
      toast({
        title: "Success",
        description: "Work registered successfully",
      });
      form.reset();
      setContributors([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addContributor = () => {
    setContributors([
      ...contributors,
      {
        userId: "",
        role: "composer",
        percentage: "40",
        userName: "",
      },
    ]);
  };

  const removeContributor = (index: number) => {
    setContributors(contributors.filter((_, i) => i !== index));
  };

  const updateContributor = (index: number, field: keyof Contributor, value: string) => {
    const updated = [...contributors];
    updated[index] = { ...updated[index], [field]: value };
    setContributors(updated);
  };

  const onSubmit = (data: WorkFormData) => {
    const formData = {
      ...data,
      contributors: contributors.map(c => ({
        userId: c.userId,
        role: c.role,
        percentage: c.percentage,
      })),
    };
    createWorkMutation.mutate(formData);
  };

  const getDefaultPercentage = (role: string) => {
    switch (role) {
      case "composer":
        return "40";
      case "author":
        return "40";
      case "vocalist":
        return "20";
      default:
        return "0";
    }
  };

  return (
    <Card className="max-w-4xl mx-auto" data-testid="card-work-registration">
      <CardHeader>
        <CardTitle>Register New Work</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter work title"
                        {...field}
                        data-testid="input-work-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iswc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISWC</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="T-123456789-1"
                        {...field}
                        data-testid="input-work-iswc"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="isrc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISRC</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="USRC17607839"
                        {...field}
                        data-testid="input-work-isrc"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="03:45"
                        {...field}
                        data-testid="input-work-duration"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contributors */}
            <div>
              <FormLabel className="text-base font-medium">Contributors</FormLabel>
              <div className="space-y-3 mt-2">
                {contributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    data-testid={`contributor-row-${index}`}
                  >
                    <div className="flex-1">
                      <Input
                        placeholder="Search by name or User ID..."
                        value={contributor.userName || ""}
                        onChange={(e) => {
                          updateContributor(index, "userName", e.target.value);
                          setSearchTerm(e.target.value);
                        }}
                        data-testid={`input-contributor-search-${index}`}
                      />
                      {searchResults && searchResults.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                          {searchResults.slice(0, 5).map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-gray-50"
                              onClick={() => {
                                updateContributor(index, "userId", user.id);
                                updateContributor(index, "userName", `${user.firstName} ${user.lastName} (ID: ${user.id})`);
                                setSearchTerm("");
                              }}
                              data-testid={`button-select-user-${user.id}`}
                            >
                              {user.firstName} {user.lastName} (ID: {user.id})
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Select
                      value={contributor.role}
                      onValueChange={(value: "composer" | "author" | "vocalist") => {
                        updateContributor(index, "role", value);
                        updateContributor(index, "percentage", getDefaultPercentage(value));
                      }}
                    >
                      <SelectTrigger className="w-32" data-testid={`select-contributor-role-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="composer">Composer</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                        <SelectItem value="vocalist">Vocalist</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="w-16 text-sm text-gray-600" data-testid={`text-contributor-percentage-${index}`}>
                      {contributor.percentage}%
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContributor(index)}
                      className="text-red-500 hover:text-red-700"
                      data-testid={`button-remove-contributor-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                  onClick={addContributor}
                  data-testid="button-add-contributor"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contributor
                </Button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" data-testid="button-cancel-work">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createWorkMutation.isPending}
                data-testid="button-submit-work"
              >
                {createWorkMutation.isPending ? "Registering..." : "Register Work"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
