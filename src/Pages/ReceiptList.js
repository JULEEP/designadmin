// ReceiptList.jsx - RECEIPT LIST WITH VIEW AND DELETE
import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Table,
  Button,
  Badge,
  Alert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col
} from 'reactstrap';
import { 
  FaEye, 
  FaTrash, 
  FaDownload,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaHashtag,
  FaLanguage,
  FaPalette,
  FaImage,
  FaTimes
} from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';

const ReceiptList = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all receipts
  const fetchReceipts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://designback.onrender.com/api/admin/receipts');
      if (response.data.success) {
        setReceipts(response.data.data);
      } else {
        setError('Failed to fetch receipts');
      }
    } catch (err) {
      console.error('Error fetching receipts:', err);
      setError(err.response?.data?.message || 'Error fetching receipts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  // Delete receipt
  const handleDelete = async () => {
    if (!selectedReceipt) return;
    
    setDeleting(true);
    try {
      const response = await axios.delete(`https://designback.onrender.com/api/admin/receipt/${selectedReceipt._id}`);
      if (response.data.success) {
        setSuccess('Receipt deleted successfully!');
        fetchReceipts();
        setDeleteModal(false);
        setSelectedReceipt(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete receipt');
      }
    } catch (err) {
      console.error('Error deleting receipt:', err);
      setError(err.response?.data?.message || 'Error deleting receipt');
    } finally {
      setDeleting(false);
    }
  };

  // Download receipt image
  const downloadReceipt = (receipt) => {
    if (receipt.previewImage) {
      const link = document.createElement('a');
      link.href = `https://designback.onrender.com${receipt.previewImage}`;
      link.download = `receipt_${receipt.receiptNumber}.png`;
      link.click();
    }
  };

  // Format date
  const formatDate = (date) => {
    return moment(date).format('DD MMM YYYY');
  };

  // View Receipt Modal
  const ViewReceiptModal = () => {
    if (!selectedReceipt) return null;

    const design = selectedReceipt.design || {};
    const textStyles = selectedReceipt.textStyles || {};
    const logoSettings = selectedReceipt.logoSettings || {};

    return (
      <Modal isOpen={viewModal} toggle={() => setViewModal(false)} size="lg" className="modal-dialog-centered">
        <ModalHeader toggle={() => setViewModal(false)}>
          <div className="d-flex align-items-center">
            <FaEye className="me-2 text-success" /> 
            Receipt Details - {selectedReceipt.receiptNumber}
          </div>
        </ModalHeader>
        <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Preview Image */}
          {selectedReceipt.previewImage && (
            <div className="text-center mb-4">
              <img 
                src={`https://designback.onrender.com${selectedReceipt.previewImage}`} 
                alt="Receipt Preview"
                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Button 
                size="sm" 
                color="success" 
                className="mt-2"
                onClick={() => downloadReceipt(selectedReceipt)}
              >
                <FaDownload className="me-1" /> Download Receipt
              </Button>
            </div>
          )}

          {/* Receipt Info */}
          <Row className="mb-4">
            <Col md={6}>
              <div className="p-3 border rounded bg-light">
                <h6 className="text-success mb-3"><FaBuilding /> Company Details</h6>
                <p className="mb-1"><strong>Name:</strong> {selectedReceipt.companyName}</p>
                <p className="mb-1"><strong>Address:</strong> {selectedReceipt.companyAddress || 'N/A'}</p>
                <p className="mb-1"><strong>Email:</strong> {selectedReceipt.companyEmail || 'N/A'}</p>
                <p className="mb-0"><strong>Phone:</strong> {selectedReceipt.companyPhone || 'N/A'}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="p-3 border rounded bg-light">
                <h6 className="text-success mb-3"><FaHashtag /> Receipt Details</h6>
                <p className="mb-1"><strong>Receipt No:</strong> {selectedReceipt.receiptNumber}</p>
                <p className="mb-1"><strong>Title:</strong> {selectedReceipt.receiptTitle}</p>
                <p className="mb-1"><strong>Date:</strong> {formatDate(selectedReceipt.receiptDate)}</p>
                <p className="mb-0"><strong>Language:</strong> {selectedReceipt.language === 'hi' ? 'हिंदी' : 'English'}</p>
              </div>
            </Col>
          </Row>

          {/* Message */}
          {selectedReceipt.message && (
            <div className="mb-4 p-3 border rounded bg-info bg-opacity-10">
              <h6 className="text-info mb-2">📝 Message</h6>
              <p className="mb-0">{selectedReceipt.message}</p>
            </div>
          )}

          {/* Design Settings */}
          <div className="mb-4">
            <h6 className="text-success mb-3"><FaPalette /> Design Settings</h6>
            <Row>
              <Col md={4}>
                <div className="p-2 border rounded text-center">
                  <small>Background</small>
                  <div style={{ width: '100%', height: '30px', backgroundColor: design.backgroundColor, border: '1px solid #ddd', marginTop: '5px' }}></div>
                  <small className="text-muted">{design.backgroundColor}</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-2 border rounded text-center">
                  <small>Text Color</small>
                  <div style={{ width: '100%', height: '30px', backgroundColor: design.textColor, border: '1px solid #ddd', marginTop: '5px' }}></div>
                  <small className="text-muted">{design.textColor}</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-2 border rounded text-center">
                  <small>Accent Color</small>
                  <div style={{ width: '100%', height: '30px', backgroundColor: design.accentColor, border: '1px solid #ddd', marginTop: '5px' }}></div>
                  <small className="text-muted">{design.accentColor}</small>
                </div>
              </Col>
            </Row>
            <div className="mt-2">
              <Badge color="info" className="me-1">Font: {design.fontFamily || 'Poppins'}</Badge>
              {design.roundedCorners && <Badge color="success" className="me-1">Rounded Corners</Badge>}
              {design.shadow && <Badge color="success" className="me-1">Shadow</Badge>}
              {design.border && <Badge color="success">Border</Badge>}
            </div>
          </div>

          {/* Logo Settings */}
          {selectedReceipt.logo && (
            <div className="mb-4 p-3 border rounded bg-light">
              <h6 className="text-success mb-2"><FaImage /> Logo</h6>
              <img 
                src={`https://designback.onrender.com${selectedReceipt.logo}`} 
                alt="Logo" 
                style={{ maxHeight: '80px', borderRadius: logoSettings.borderRadius || 0 }}
              />
              {logoSettings.shape && <Badge color="secondary" className="ms-2">Shape: {logoSettings.shape}</Badge>}
            </div>
          )}

          {/* Template Info */}
          {selectedReceipt.useTemplate && selectedReceipt.templateImage && (
            <div className="p-3 border rounded bg-light">
              <h6 className="text-success mb-2"><FaImage /> Template Used</h6>
              <img 
                src={`https://designback.onrender.com${selectedReceipt.templateImage}`} 
                alt="Template" 
                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-4 text-muted small">
            <hr />
            <p className="mb-0">Created: {moment(selectedReceipt.createdAt).format('DD MMM YYYY, hh:mm A')}</p>
            <p className="mb-0">Last Updated: {moment(selectedReceipt.updatedAt).format('DD MMM YYYY, hh:mm A')}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setViewModal(false)}>
            <FaTimes className="me-1" /> Close
          </Button>
          <Button color="success" onClick={() => downloadReceipt(selectedReceipt)}>
            <FaDownload className="me-1" /> Download
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!selectedReceipt) return null;

    return (
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} className="modal-dialog-centered">
        <ModalHeader toggle={() => setDeleteModal(false)}>
          <FaTrash className="text-danger me-2" /> Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this receipt?</p>
          <p className="text-danger mb-0">
            <strong>Receipt No:</strong> {selectedReceipt.receiptNumber}<br />
            <strong>Company:</strong> {selectedReceipt.companyName}
          </p>
          <p className="text-warning mt-2 mb-0 small">⚠️ This action cannot be undone!</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-1" /> : <FaTrash className="me-1" />}
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <Container fluid className="my-5">
      <Card className="shadow-lg border-0">
        <CardBody className="p-4">
          <CardTitle tag="h3" className="text-success mb-4">
            <FaEye className="me-2" /> Receipts List
          </CardTitle>

          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner color="success" />
              <p className="mt-2 text-muted">Loading receipts...</p>
            </div>
          ) : receipts.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No receipts found. Create your first receipt!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th><FaHashtag /> Receipt No</th>
                    <th><FaBuilding /> Company Name</th>
                    <th><FaCalendarAlt /> Date</th>
                    <th><FaLanguage /> Language</th>
                    <th>Preview</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt, index) => (
                    <tr key={receipt._id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong className="text-success">{receipt.receiptNumber}</strong>
                      </td>
                      <td>{receipt.companyName}</td>
                      <td>{formatDate(receipt.receiptDate)}</td>
                      <td>
                        <Badge color={receipt.language === 'hi' ? 'info' : 'primary'}>
                          {receipt.language === 'hi' ? 'हिंदी' : 'English'}
                        </Badge>
                      </td>
                      <td>
                        {receipt.previewImage ? (
                          <img 
                            src={`https://designback.onrender.com${receipt.previewImage}`} 
                            alt="preview" 
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => {
                              setSelectedReceipt(receipt);
                              setViewModal(true);
                            }}
                          />
                        ) : (
                          <Badge color="secondary">No Preview</Badge>
                        )}
                      </td>
                      <td className="text-muted small">{moment(receipt.createdAt).format('DD MMM YYYY')}</td>
                      <td>
                        <Button 
                          color="info" 
                          size="sm" 
                          className="me-2"
                          onClick={() => {
                            setSelectedReceipt(receipt);
                            setViewModal(true);
                          }}
                        >
                          <FaEye /> View
                        </Button>
                        <Button 
                          color="danger" 
                          size="sm"
                          onClick={() => {
                            setSelectedReceipt(receipt);
                            setDeleteModal(true);
                          }}
                        >
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Statistics */}
          {!loading && receipts.length > 0 && (
            <div className="mt-4 p-3 bg-light rounded">
              <Row>
                <Col md={4} className="text-center">
                  <h5 className="text-success">{receipts.length}</h5>
                  <small className="text-muted">Total Receipts</small>
                </Col>
                <Col md={4} className="text-center">
                  <h5 className="text-success">
                    {receipts.filter(r => r.language === 'hi').length}
                  </h5>
                  <small className="text-muted">Hindi Receipts</small>
                </Col>
                <Col md={4} className="text-center">
                  <h5 className="text-success">
                    {receipts.filter(r => r.language === 'en').length}
                  </h5>
                  <small className="text-muted">English Receipts</small>
                </Col>
              </Row>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modals */}
      <ViewReceiptModal />
      <DeleteConfirmationModal />
    </Container>
  );
};

export default ReceiptList;