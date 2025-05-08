import React, { useState } from "react";
import { Event } from "@shared/schema";
import EventCard from "./EventCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventsListProps {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onSearch,
  onSort,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSortChange = (value: string) => {
    onSort(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#493628]">All Events</h2>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a89c29] w-40">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sort By</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            id="searchEvents"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a89c29] sm:w-60"
            placeholder="Search by title..."
          />
        </div>

        {/* Database connection status */}
        <div className="text-sm text-gray-600 flex items-center">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              error ? "bg-red-500" : "bg-green-500"
            } mr-2`}
          ></span>
          <span>{error ? "Database connection error" : "Connected to database"}</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-8 text-center">
          <div className="animate-spin mx-auto h-8 w-8 border-4 border-[#a89c29] border-t-transparent rounded-full"></div>
          <p className="mt-3 text-gray-600">Loading events from database...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="py-8 text-center">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Failed to fetch events. Please try again later.</span>
          </div>
          <Button
            onClick={onRetry}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Retry Connection
          </Button>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !error && (
        <>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600">No events found. Create your first event!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventsList;
