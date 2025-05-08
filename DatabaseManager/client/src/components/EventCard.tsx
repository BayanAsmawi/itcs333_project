import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const [_, navigate] = useLocation();

  const handleView = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card className="bg-[#ff9d23] rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="mb-1">
          <strong>Date:</strong> {event.date}
        </p>
        <p className="mb-3">
          <strong>Location:</strong> {event.location}
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleView}
          >
            View
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={() => onEdit(event)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => onDelete(event)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
