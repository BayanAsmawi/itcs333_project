import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertEventSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Event } from "@shared/schema";

const formSchema = insertEventSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  eventToEdit?: Event | null;
  onSubmit: (values: FormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ eventToEdit, onSubmit, onCancel, isSubmitting = false }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      description: "",
    },
  });

  // Update form values when editing an event
  useEffect(() => {
    if (eventToEdit) {
      form.reset({
        title: eventToEdit.title,
        date: eventToEdit.date,
        location: eventToEdit.location,
        description: eventToEdit.description,
      });
    } else {
      form.reset({
        title: "",
        date: "",
        location: "",
        description: "",
      });
    }
  }, [eventToEdit, form]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-[#493628]">
        {eventToEdit ? "Edit Event" : "Create New Event"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a89c29]" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a89c29]" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a89c29]" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={3} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a89c29]" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#a89c29] hover:bg-[#a89c29]/90 text-white py-2 px-4 rounded-md transition duration-200"
            >
              {isSubmitting ? "Saving..." : (eventToEdit ? "Update Event" : "Add Event")}
            </Button>
            {eventToEdit && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-200"
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventForm;
