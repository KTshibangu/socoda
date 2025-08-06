import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus } from "lucide-react";
import type { User } from "@shared/schema";

export default function UserManagement() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "business":
        return "bg-blue-100 text-blue-800";
      case "composer":
        return "bg-green-100 text-green-800";
      case "author":
        return "bg-orange-100 text-orange-800";
      case "vocalist":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <>
      <Header
        title="User Management"
        description="Manage system users and their roles"
      />
      <div className="p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">System Users</h2>
          <Button data-testid="button-add-user">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Users List */}
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Skeleton className="h-6 w-20 inline-block" />
                      <Skeleton className="h-8 w-16 inline-block" />
                    </div>
                  </div>
                ))}
              </div>
            ) : users && users.length > 0 ? (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    data-testid={`card-user-${user.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.profileImageUrl || undefined} />
                        <AvatarFallback data-testid={`text-user-initials-${user.id}`}>
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900" data-testid={`text-user-name-${user.id}`}>
                          {user.firstName} {user.lastName}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span data-testid={`text-user-email-${user.id}`}>{user.email}</span>
                          <span data-testid={`text-user-joined-${user.id}`}>
                            Joined: {new Date(user.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getRoleColor(user.role)} data-testid={`badge-user-role-${user.id}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                      <Button variant="outline" size="sm" data-testid={`button-edit-user-${user.id}`}>
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">
                  System users will appear here once they register
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
