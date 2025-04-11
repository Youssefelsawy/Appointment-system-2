import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const PatientsTab = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${process.env.BACKEND_URL}/admin/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (err) {
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await axios.delete(`${process.env.BACKEND_URL}/admin/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPatients();
    } catch (err) {
      setError("Failed to delete patient");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h5>Patient List</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr key={p.id}>
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deletePatient(p.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PatientsTab;
