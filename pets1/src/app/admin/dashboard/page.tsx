"use client";

import { useEffect, useState } from "react";
import { fetchAllUsers } from "@/lib/utils/firestoreQueries";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/config/firebase";
import { toReadableDate } from "@/lib/utils/date";

// Admin dashboard: high-level overview of counts across collections.

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchAllUsers();
        const clinicData = await getDocs(collection(db, "clinics"));
        const trainerData = await getDocs(collection(db, "trainers"));
        const sellerData = await getDocs(collection(db, "sellers"));
        const appointmentData = await getDocs(collection(db, "appointments"));
        const orderData = await getDocs(collection(db, "orders"));

        setUsers(userData);
        setClinics(clinicData.docs.map((d) => d.data()));
        setTrainers(trainerData.docs.map((d) => d.data()));
        setSellers(sellerData.docs.map((d) => d.data()));
        setAppointments(appointmentData.docs.map((d) => d.data()));
        setOrders(orderData.docs.map((d) => d.data()));
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      {loading && <p>Loading data...</p>}

      <h2>Users</h2>
      <p>Total: {users.length}</p>

      <h2>Clinics</h2>
      <p>Total: {clinics.length}</p>

      <h2>Trainers</h2>
      <p>Total: {trainers.length}</p>

      <h2>Sellers</h2>
      <p>Total: {sellers.length}</p>

      <h2>Appointments</h2>
      <p>Total: {appointments.length}</p>

      <h2>Orders</h2>
      <p>Total: {orders.length}</p>

      {/* Example: show latest order date if present */}
      {orders.length > 0 && (
        <p>Latest order at: {toReadableDate(orders[0]?.createdAt)}</p>
      )}
    </div>
  );
}
