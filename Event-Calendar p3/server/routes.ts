import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Events API routes
  const eventsRouter = express.Router();

  // Get all events
  eventsRouter.get("/", async (req: Request, res: Response) => {
    try {
      const query = req.query.search as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      
      let events = query 
        ? await storage.searchEvents(query)
        : await storage.getAllEvents();
      
      // Handle sorting
      if (sortBy === 'title') {
        events = events.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'date') {
        events = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Get event by ID
  eventsRouter.get("/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Create new event
  eventsRouter.post("/", async (req: Request, res: Response) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  // Update event
  eventsRouter.put("/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const eventData = insertEventSchema.parse(req.body);
      const updatedEvent = await storage.updateEvent(id, eventData);

      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  // Delete event
  eventsRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const deleted = await storage.deleteEvent(id);
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Register events router
  app.use("/api/events", eventsRouter);

  const httpServer = createServer(app);

  return httpServer;
}
