import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@shared/schema";
import EventForm from "@/components/EventForm";
import EventsList from "@/components/EventsList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

const Events: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { toast } = useToast();

  // Fetch events with query parameters
  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/events", searchQuery, sortBy],
    queryFn: async ({ queryKey }) => {
      const [_, search, sort] = queryKey;
      let url = `/api/events`;
      
      const params = new URLSearchParams();
      if (search) params.append("search", search as string);
      if (sort) params.append("sortBy", sort as string);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: async (eventData: Omit<Event, "id">) => {
      const res = await apiRequest("POST", "/api/events", eventData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event Created",
        description: "Your event has been created successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...eventData }: Event) => {
      const res = await apiRequest("PUT", `/api/events/${id}`, eventData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setCurrentEvent(null);
      toast({
        title: "Event Updated",
        description: "Your event has been updated successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/events/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event Deleted",
        description: "Your event has been deleted successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const handleSubmit = (data: Omit<Event, "id">) => {
    if (currentEvent) {
      updateMutation.mutate({ ...data, id: currentEvent.id });
    } else {
      createMutation.mutate(data);
    }
  };

  // Edit handler
  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete handler
  const handleDelete = (event: Event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      deleteMutation.mutate(event.id);
    }
  };

  // Cancel edit handler
  const handleCancelEdit = () => {
    setCurrentEvent(null);
  };

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Sort handler
  const handleSort = (value: string) => {
    // If "none" is selected, we don't want to sort
    if (value === "none") {
      setSortBy("");
    } else {
      setSortBy(value);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* API Status Indicator for Mutations */}
      {(createMutation.isPending || updateMutation.isPending || deleteMutation.isPending) && (
        <div className="mb-6">
          <div className="flex items-center p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="mr-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-blue-700">
              {createMutation.isPending
                ? "Creating new event..."
                : updateMutation.isPending
                ? "Updating event..."
                : "Deleting event..."}
            </p>
          </div>
        </div>
      )}

      {/* Success Feedback */}
      {(createMutation.isSuccess || updateMutation.isSuccess || deleteMutation.isSuccess) && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            {createMutation.isSuccess
              ? "Event created successfully!"
              : updateMutation.isSuccess
              ? "Event updated successfully!"
              : "Event deleted successfully!"}
          </AlertDescription>
        </Alert>
      )}

      {/* Event Form */}
      <EventForm
        eventToEdit={currentEvent}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Events List */}
      <EventsList
        events={events}
        isLoading={isLoading}
        error={error as Error}
        onRetry={refetch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
        onSort={handleSort}
      />
    </div>
  );
};

export default Events;
