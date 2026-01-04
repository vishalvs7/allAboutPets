import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Import all our pet-specific types
import {
  Service,
  ServiceFormData,
  Appointment,
  AppointmentFormData,
  Session,
  SessionFormData,
  Product,
  ProductFormData,
  Order,
} from "../types";

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
function toDate(timestamp: any): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp && typeof timestamp.toDate === "function") return timestamp.toDate();
  return new Date(timestamp);
}

/**
 * Convert form data to Firestore data (adds timestamps)
 */
function prepareForFirestore(data: any) {
  return {
    ...data,
    updatedAt: serverTimestamp(),
  };
}

// ==================== CLINIC OPERATIONS ====================

// ---------- SERVICES ----------

/**
 * Get all services for a specific clinic
 */
export async function fetchClinicServices(clinicId: string): Promise<Service[]> {
  try {
    const q = query(
      collection(db, "services"),
      where("clinicId", "==", clinicId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: toDate(doc.data().createdAt),
      updatedAt: toDate(doc.data().updatedAt),
    } as Service));
  } catch (error) {
    console.error("Error fetching clinic services:", error);
    throw new Error("Failed to fetch services");
  }
}

/**
 * Get a single service by ID
 */
export async function fetchServiceById(serviceId: string): Promise<Service | null> {
  try {
    const docRef = doc(db, "services", serviceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      } as Service;
    }
    return null;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw new Error("Failed to fetch service");
  }
}

/**
 * Create a new clinic service (vaccination, grooming, etc.)
 */
export async function createClinicService(
  clinicId: string, 
  serviceData: ServiceFormData
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "services"), {
      ...serviceData,
      clinicId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating service:", error);
    throw new Error("Failed to create service");
  }
}

/**
 * Update an existing clinic service
 */
export async function updateClinicService(
  serviceId: string, 
  updates: Partial<ServiceFormData>
): Promise<void> {
  try {
    const docRef = doc(db, "services", serviceId);
    await updateDoc(docRef, prepareForFirestore(updates));
  } catch (error) {
    console.error("Error updating service:", error);
    throw new Error("Failed to update service");
  }
}

/**
 * Delete a clinic service
 */
export async function deleteClinicService(serviceId: string): Promise<void> {
  try {
    const docRef = doc(db, "services", serviceId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting service:", error);
    throw new Error("Failed to delete service");
  }
}

// ---------- APPOINTMENTS ----------

/**
 * Get all appointments for a clinic
 */
export async function fetchClinicAppointments(clinicId: string): Promise<Appointment[]> {
  try {
    const q = query(
      collection(db, "appointments"),
      where("clinicId", "==", clinicId),
      orderBy("appointmentDate", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        appointmentDate: toDate(data.appointmentDate),
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      } as Appointment;
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
}

/**
 * Create a new appointment (pet owner books a service)
 */
export async function createAppointment(
  clinicId: string,
  appointmentData: AppointmentFormData
): Promise<string> {
  try {
    // Convert string date to Firestore timestamp
    const appointmentDate = new Date(appointmentData.appointmentDate);
    
    const docRef = await addDoc(collection(db, "appointments"), {
      ...appointmentData,
      clinicId,
      appointmentDate: Timestamp.fromDate(appointmentDate),
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error("Failed to create appointment");
  }
}

/**
 * Update appointment status (confirm, complete, cancel)
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: Appointment["status"]
): Promise<void> {
  try {
    const docRef = doc(db, "appointments", appointmentId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw new Error("Failed to update appointment");
  }
}

// ==================== TRAINER OPERATIONS ====================

// ---------- SESSIONS ----------

/**
 * Get all sessions for a trainer
 */
export async function fetchTrainerSessions(trainerId: string): Promise<Session[]> {
  try {
    const q = query(
      collection(db, "sessions"),
      where("trainerId", "==", trainerId),
      orderBy("sessionDate", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        sessionDate: toDate(data.sessionDate),
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      } as Session;
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw new Error("Failed to fetch sessions");
  }
}

/**
 * Create a new training session (obedience, agility, etc.)
 */
export async function createTrainingSession(
  trainerId: string,
  sessionData: SessionFormData
): Promise<string> {
  try {
    // Convert string date to Firestore timestamp
    const sessionDate = new Date(sessionData.sessionDate);
    
    const docRef = await addDoc(collection(db, "sessions"), {
      ...sessionData,
      trainerId,
      sessionDate: Timestamp.fromDate(sessionDate),
      participants: [],
      currentParticipants: 0,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Failed to create session");
  }
}

/**
 * Update a training session
 */
export async function updateTrainingSession(
  sessionId: string,
  updates: Partial<SessionFormData>
): Promise<void> {
  try {
    const docRef = doc(db, "sessions", sessionId);
    
    // Convert date if provided
    const firestoreUpdates: any = { ...updates };
    if (updates.sessionDate) {
      firestoreUpdates.sessionDate = Timestamp.fromDate(new Date(updates.sessionDate));
    }
    
    await updateDoc(docRef, prepareForFirestore(firestoreUpdates));
  } catch (error) {
    console.error("Error updating session:", error);
    throw new Error("Failed to update session");
  }
}

/**
 * Delete a training session
 */
export async function deleteTrainingSession(sessionId: string): Promise<void> {
  try {
    const docRef = doc(db, "sessions", sessionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting session:", error);
    throw new Error("Failed to delete session");
  }
}

/**
 * Add a participant to a session (pet owner signs up)
 */
export async function addSessionParticipant(
  sessionId: string,
  participantId: string
): Promise<void> {
  try {
    const docRef = doc(db, "sessions", sessionId);
    const sessionDoc = await getDoc(docRef);
    
    if (!sessionDoc.exists()) {
      throw new Error("Session not found");
    }
    
    const sessionData = sessionDoc.data();
    const currentParticipants = sessionData.participants || [];
    
    // Check if already participating
    if (currentParticipants.includes(participantId)) {
      throw new Error("Already participating in this session");
    }
    
    // Check if session is full
    if (currentParticipants.length >= sessionData.maxParticipants) {
      throw new Error("Session is full");
    }
    
    await updateDoc(docRef, {
      participants: [...currentParticipants, participantId],
      currentParticipants: currentParticipants.length + 1,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding participant:", error);
    throw error; // Re-throw with original message
  }
}

// ==================== STORE OPERATIONS ====================

// ---------- PRODUCTS ----------

/**
 * Get all products for a seller/store
 */
export async function fetchSellerProducts(sellerId: string): Promise<Product[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("sellerId", "==", sellerId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      } as Product;
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

/**
 * Create a new product (dog food, pet toys, etc.)
 */
export async function createStoreProduct(
  sellerId: string,
  productData: ProductFormData
): Promise<string> {
  try {
    // Convert image URLs string to array
    const images = productData.imageUrls
      ? productData.imageUrls.split(',').map((url: string) => url.trim()).filter((url: string) => url)
      : [];
    
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      sellerId,
      images,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

/**
 * Update a product
 */
export async function updateStoreProduct(
  productId: string,
  updates: Partial<ProductFormData>
): Promise<void> {
  try {
    const docRef = doc(db, "products", productId);
    
    // Handle image URLs conversion if provided
    const firestoreUpdates: any = { ...updates };
    if (updates.imageUrls !== undefined) {
      firestoreUpdates.images = updates.imageUrls
        ? updates.imageUrls.split(',').map((url: string) => url.trim()).filter((url: string) => url)
        : [];
      delete firestoreUpdates.imageUrls;
    }
    
    await updateDoc(docRef, prepareForFirestore(firestoreUpdates));
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

/**
 * Delete a product
 */
export async function deleteStoreProduct(productId: string): Promise<void> {
  try {
    const docRef = doc(db, "products", productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}

// ---------- ORDERS ----------

/**
 * Get all orders for a seller
 */
export async function fetchSellerOrders(sellerId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, "orders"),
      where("sellerId", "==", sellerId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        shippedAt: toDate(data.shippedAt),
        deliveredAt: toDate(data.deliveredAt),
      } as Order;
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

/**
 * Update order status (processing, shipped, delivered)
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  try {
    const docRef = doc(db, "orders", orderId);
    const updates: any = { status, updatedAt: serverTimestamp() };
    
    // Add timestamps for specific status changes
    if (status === "shipped") {
      updates.shippedAt = serverTimestamp();
    } else if (status === "delivered") {
      updates.deliveredAt = serverTimestamp();
    }
    
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
  }
}

// ==================== ADMIN OPERATIONS ====================

/**
 * Get all users (for admin dashboard)
 */
export async function fetchAllUsers(): Promise<any[]> {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

/**
 * Get dashboard statistics (for admin overview)
 */
export async function fetchDashboardStats(): Promise<{
  totalUsers: number;
  totalServices: number;
  totalSessions: number;
  totalProducts: number;
  totalAppointments: number;
  totalOrders: number;
  pendingAppointments: number;
  pendingOrders: number;
}> {
  try {
    const [
      usersSnapshot,
      servicesSnapshot,
      sessionsSnapshot,
      productsSnapshot,
      appointmentsSnapshot,
      ordersSnapshot,
    ] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "services")),
      getDocs(collection(db, "sessions")),
      getDocs(collection(db, "products")),
      getDocs(collection(db, "appointments")),
      getDocs(collection(db, "orders")),
    ]);
    
    return {
      totalUsers: usersSnapshot.size,
      totalServices: servicesSnapshot.size,
      totalSessions: sessionsSnapshot.size,
      totalProducts: productsSnapshot.size,
      totalAppointments: appointmentsSnapshot.size,
      totalOrders: ordersSnapshot.size,
      pendingAppointments: appointmentsSnapshot.docs.filter(
        (doc: any) => doc.data().status === "pending"
      ).length,
      pendingOrders: ordersSnapshot.docs.filter(
        (doc: any) => doc.data().status === "pending"
      ).length,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
}

// ==================== UTILITY QUERIES ====================

/**
 * Get user by ID
 */
export async function fetchUserById(userId: string): Promise<any> {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Get clinic by ID
 */
export async function fetchClinicById(clinicId: string): Promise<any> {
  try {
    const docRef = doc(db, "clinics", clinicId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching clinic:", error);
    throw new Error("Failed to fetch clinic");
  }
}