import { useState, useEffect } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import DoctorsTab from "../components/admin/DoctorsTab";
import PatientsTab from "../components/admin/PatientsTab";
import AppointmentsTab from "../components/admin/AppointmentsTab";

const AdminDashboard = () => {
  return (
    <Container className="mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <Tabs defaultActiveKey="doctors" id="admin-tabs" className="mb-3">
        <Tab eventKey="doctors" title="Doctors">
          <DoctorsTab />
        </Tab>
        <Tab eventKey="patients" title="Patients">
          <PatientsTab />
        </Tab>
        <Tab eventKey="appointments" title="Appointments">
          <AppointmentsTab />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;
