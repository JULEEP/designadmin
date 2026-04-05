// PrescriptionsList.jsx - SIRF IMAGE DIKHEGA (NO EXTRA SECTIONS)
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardBody, Button, Table,
  Alert, Input, Spinner, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPlus, FaEye, FaTrash, FaSearch, FaSync, FaUserMd, 
  FaHospital, FaCalendarAlt, FaDownload, FaSpinner,
  FaPhone, FaGraduationCap
} from 'react-icons/fa';

const API_URL = 'https://designback.onrender.com/api/admin';
const STATIC_URL = 'https://designback.onrender.com';

const PrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrescriptions();
  }, [search]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/doctorprescriptions`, {
        params: { search }
      });
      
      if (response.data.success) {
        setPrescriptions(response.data.data);
      } else {
        setError('Failed to load prescriptions');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prescription?')) return;
    
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/doctorprescription/${id}`);
      fetchPrescriptions();
    } catch (error) {
      setError('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handlePreview = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPreviewModal(true);
  };

  const downloadPrescription = () => {
    if (selectedPrescription?.previewImage) {
      const imageUrl = `${STATIC_URL}${selectedPrescription.previewImage}`;
      const link = document.createElement('a');
      link.download = `prescription_${selectedPrescription._id}.png`;
      link.href = imageUrl;
      link.click();
    }
  };

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary mb-0">
                <FaUserMd className="me-2" />
                Doctor Prescriptions
              </h2>
              <p className="text-muted">Total: {prescriptions.length} prescriptions</p>
            </div>
            <Button color="primary" onClick={() => navigate('/create-prescription')}>
              <FaPlus className="me-2" />
              Create New
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <div className="d-flex gap-2">
            <Input
              placeholder="Search by doctor or hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button color="secondary" onClick={fetchPrescriptions}>
              <FaSearch />
            </Button>
            <Button color="info" onClick={fetchPrescriptions}>
              <FaSync />
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert color="danger">{error}</Alert>}

      <Card>
        <CardBody>
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p>Loading...</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-5">
              <p>No prescriptions found</p>
              <Button color="primary" onClick={() => navigate('/create-prescription')}>
                Create your first prescription
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Hospital</th>
                  <th>Phone</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong>{p.doctorName}</strong>
                      <br/>
                      <small className="text-muted">{p.qualification}</small>
                    </td>
                    <td><FaHospital className="me-1" />{p.hospitalName}</td>
                    <td><FaPhone className="me-1" />{p.phone}</td>
                    <td><FaCalendarAlt className="me-1" />{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button size="sm" color="info" onClick={() => handlePreview(p)}>
                          <FaEye /> Preview
                        </Button>
                        <Button size="sm" color="danger" onClick={() => handleDelete(p._id)} disabled={deleting}>
                          <FaTrash /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Preview Modal - SIRF IMAGE, KUCH EXTRA NAHI */}
      <Modal isOpen={showPreviewModal} toggle={() => setShowPreviewModal(false)} size="lg" centered>
        <ModalHeader toggle={() => setShowPreviewModal(false)}>
          {selectedPrescription?.doctorName} - {selectedPrescription?.hospitalName}
        </ModalHeader>
        <ModalBody className="text-center">
          {selectedPrescription?.previewImage ? (
            <img 
              src={`${STATIC_URL}${selectedPrescription.previewImage}`} 
              alt="Prescription" 
              style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          ) : (
            <div className="p-5 bg-light">
              <p>No preview image available</p>
              <p className="text-muted">Doctor: {selectedPrescription?.doctorName}</p>
              <p className="text-muted">Hospital: {selectedPrescription?.hospitalName}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {selectedPrescription?.previewImage && (
            <Button color="success" onClick={downloadPrescription}>
              <FaDownload className="me-2" />
              Download
            </Button>
          )}
          <Button color="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default PrescriptionsList;