import React from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, AlignLeft, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EventDetails: React.FC = () => {
  const [match, params] = useRoute<{ id: string }>("/events/:id");
  const [_, navigate] = useLocation();
  const eventId = match ? parseInt(params.id) : -1;

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/events/${eventId}`],
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}`);
      if (!res.ok) throw new Error("Failed to fetch event details");
      return res.json();
    },
    enabled: eventId > 0,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a89c29]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-50 inline-block p-6 rounded-lg">
          <h2 className="text-xl text-red-600 mb-2">Error Loading Event</h2>
          <p className="text-red-500">{(error as Error).message}</p>
          <Button
            onClick={() => navigate("/events")}
            className="mt-4 bg-[#a89c29]"
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl mb-4">Event not found</h2>
        <Button
          onClick={() => navigate("/events")}
          className="bg-[#a89c29]"
        >
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-6">
      <Button
        variant="link"
        className="mb-4 flex items-center text-blue-600"
        onClick={() => navigate("/events")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <Card className="bg-[#ff9d23] rounded-lg overflow-hidden shadow-xl">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <Calendar className="mr-3 h-5 w-5 mt-1" />
              <div>
                <p className="font-semibold">Date</p>
                <p>{event.date}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="mr-3 h-5 w-5 mt-1" />
              <div>
                <p className="font-semibold">Location</p>
                <p>{event.location}</p>
              </div>
            </div>

            <div className="flex items-start">
              <AlignLeft className="mr-3 h-5 w-5 mt-1" />
              <div>
                <p className="font-semibold">Description</p>
                <p className="whitespace-pre-line">{event.description}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#ff9d23]"
              onClick={() => navigate("/events")}
            >
              Back to Events
            </Button>
            <Button
              className="bg-white text-[#ff9d23] hover:bg-gray-100"
              onClick={() => {
                navigate(`/events`);
                // We'd dispatch an edit event here in a more connected app
              }}
            >
              Edit Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
