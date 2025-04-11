import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Modal,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";

const DoctorsTab = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const token = localStorage.getItem("token");

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/admin/doctors`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDoctors(res.data);
    } catch (err) {
      setError("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/doctors`,
        newDoctor,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowAdd(false);
      setNewDoctor({ name: "", email: "", password: "" });
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create doctor");
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/admin/doctors/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchDoctors();
    } catch (err) {
      setError("Failed to delete doctor");
    }
  };

  const handleEditDoctor = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/admin/doctors/${selectedDoctor.id}`,
        {
          name: selectedDoctor.name,
          email: selectedDoctor.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowEdit(false);
      fetchDoctors();
    } catch (err) {
      setError("Failed to update doctor");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h5>Doctors List</h5>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => setShowAdd(true)}>
            Add Doctor
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc, idx) => (
            <tr key={doc.id}>
              <td>{idx + 1}</td>
              <td>{doc.name}</td>
              <td>{doc.email}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setShowEdit(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteDoctor(doc.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Doctor Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddDoctor}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={newDoctor.name}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={newDoctor.email}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={newDoctor.password}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, password: e.target.value })
                }
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Create Doctor
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditDoctor}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={selectedDoctor?.name || ""}
                onChange={(e) =>
                  setSelectedDoctor({ ...selectedDoctor, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={selectedDoctor?.email || ""}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Update Doctor
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DoctorsTab;
