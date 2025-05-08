import { users, type User, type InsertUser, events, type Event, type InsertEvent } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, or, ilike } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Event methods
  getAllEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: InsertEvent): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  searchEvents(query: string): Promise<Event[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private userCurrentId: number;
  private eventCurrentId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.userCurrentId = 1;
    this.eventCurrentId = 1;

    // Initialize with dummy events
    const dummyEvents: InsertEvent[] = [
      {
        title: "Open Day",
        date: "2025-05-10",
        location: "Campus Auditorium",
        description: "Explore university clubs and activities."
      },
      {
        title: "Tech Talk",
        date: "2025-06-05",
        location: "Lecture Hall A",
        description: "Future of AI and Machine Learning."
      },
      {
        title: "Sports Meet",
        date: "2025-07-15",
        location: "Campus Stadium",
        description: "Annual sports competitions!"
      }
    ];

    dummyEvents.forEach(event => this.createEvent(event));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Event methods implementation
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventCurrentId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, insertEvent: InsertEvent): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) {
      return undefined;
    }
    
    const updatedEvent: Event = { ...insertEvent, id };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  async searchEvents(query: string): Promise<Event[]> {
    if (!query) {
      return this.getAllEvents();
    }
    
    const lowerQuery = query.toLowerCase();
    return Array.from(this.events.values()).filter(
      (event) => 
        event.title.toLowerCase().includes(lowerQuery) ||
        event.location.toLowerCase().includes(lowerQuery) ||
        event.description.toLowerCase().includes(lowerQuery)
    );
  }
}

// PostgreSQL Database Storage implementation
export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    
    const client = postgres(process.env.DATABASE_URL);
    this.db = drizzle(client);
    
    // Initialize the database tables
    this.initDatabase();
  }
  
  private async initDatabase() {
    try {
      // First check if the table exists by running a simple query
      try {
        // Check if events table exists and has data
        const existingEvents = await this.getAllEvents();
        
        // If no events exist, seed with initial data
        if (existingEvents.length === 0) {
          const seedEvents: InsertEvent[] = [
            {
              title: "Open Day",
              date: "2025-05-10",
              location: "Campus Auditorium",
              description: "Explore university clubs and activities."
            },
            {
              title: "Tech Talk",
              date: "2025-06-05",
              location: "Lecture Hall A",
              description: "Future of AI and Machine Learning."
            },
            {
              title: "Sports Meet",
              date: "2025-07-15",
              location: "Campus Stadium",
              description: "Annual sports competitions!"
            }
          ];
          
          for (const event of seedEvents) {
            await this.createEvent(event);
          }
          console.log("Database seeded with initial events");
        }
      } catch (error) {
        // Table might not exist yet, which is fine - migrations will create it
        console.log("Events table not ready yet. Run migrations first.");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllEvents(): Promise<Event[]> {
    return await this.db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const result = await this.db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const result = await this.db.insert(events).values(insertEvent).returning();
    return result[0];
  }

  async updateEvent(id: number, insertEvent: InsertEvent): Promise<Event | undefined> {
    const result = await this.db
      .update(events)
      .set(insertEvent)
      .where(eq(events.id, id))
      .returning();
    
    return result[0];
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await this.db
      .delete(events)
      .where(eq(events.id, id))
      .returning({ id: events.id });
    
    return result.length > 0;
  }

  async searchEvents(query: string): Promise<Event[]> {
    if (!query) {
      return this.getAllEvents();
    }
    
    const searchPattern = `%${query}%`;
    return await this.db
      .select()
      .from(events)
      .where(
        or(
          ilike(events.title, searchPattern),
          ilike(events.location, searchPattern),
          ilike(events.description, searchPattern)
        )
      );
  }
}

// Uncomment this line to use PostgreSQL Database storage
export const storage = new DatabaseStorage();

// Comment out this line when using the database storage
// export const storage = new MemStorage();
