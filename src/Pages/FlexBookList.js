// FlexBookList.jsx - FLEX BOOK LIST WITH VIEW, DELETE, UPDATE AND DOWNLOAD
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
  Col,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { 
  FaEye, 
  FaTrash, 
  FaDownload,
  FaBuilding,
  FaLanguage,
  FaPalette,
  FaImage,
  FaTimes,
  FaEdit,
  FaSave,
  FaSpinner,
  FaBoxes,
  FaListUl,
  FaPlus
} from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';

const FlexBookList = () => {
  const [flexBooks, setFlexBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedFlexBook, setSelectedFlexBook] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editPoints, setEditPoints] = useState([]);
  const [newPointText, setNewPointText] = useState('');

  const API_BASE_URL = 'https://designback.onrender.com/api/admin';

  // Fetch all flex books
  const fetchFlexBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/flexbooks`);
      if (response.data.success) {
        setFlexBooks(response.data.data);
      } else {
        setError('Failed to fetch flex books');
      }
    } catch (err) {
      console.error('Error fetching flex books:', err);
      setError(err.response?.data?.message || 'Error fetching flex books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlexBooks();
  }, []);

  // Delete flex book
  const handleDelete = async () => {
    if (!selectedFlexBook) return;
    
    setDeleting(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/flexbook/${selectedFlexBook._id}`);
      if (response.data.success) {
        setSuccess('Flex book deleted successfully!');
        fetchFlexBooks();
        setDeleteModal(false);
        setSelectedFlexBook(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete flex book');
      }
    } catch (err) {
      console.error('Error deleting flex book:', err);
      setError(err.response?.data?.message || 'Error deleting flex book');
    } finally {
      setDeleting(false);
    }
  };

  // Update flex book
  const handleUpdate = async () => {
    if (!selectedFlexBook) return;
    
    setUpdating(true);
    const formData = new FormData();
    
    // Append all edit form data
    Object.keys(editFormData).forEach(key => {
      if (key !== 'points' && key !== 'textStyles' && key !== 'logoSettings' && key !== 'design' && key !== 'canvasSize') {
        formData.append(key, editFormData[key] || '');
      }
    });
    
    formData.append('points', JSON.stringify(editPoints));
    formData.append('textStyles', JSON.stringify(editFormData.textStyles || {}));
    formData.append('logoSettings', JSON.stringify(editFormData.logoSettings || {}));
    formData.append('design', JSON.stringify(editFormData.design || {}));
    formData.append('canvasSize', JSON.stringify(editFormData.canvasSize || { width: 800, height: 1000 }));
    
    try {
      const response = await axios.put(`${API_BASE_URL}/flexbook/${selectedFlexBook._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setSuccess('Flex book updated successfully!');
        fetchFlexBooks();
        setEditModal(false);
        setSelectedFlexBook(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update flex book');
      }
    } catch (err) {
      console.error('Error updating flex book:', err);
      setError(err.response?.data?.message || 'Error updating flex book');
    } finally {
      setUpdating(false);
    }
  };

  // Download flex book image
  const downloadFlexBook = (flexBook) => {
    if (flexBook.previewImage) {
      const link = document.createElement('a');
      link.href = `https://designback.onrender.com/${flexBook.previewImage}`;
      link.download = `flexbook_${flexBook.flexId || flexBook._id}.png`;
      link.click();
    }
  };

  // Format date
  const formatDate = (date) => {
    return moment(date).format('DD MMM YYYY');
  };

  // Open edit modal
  const openEditModal = (flexBook) => {
    setSelectedFlexBook(flexBook);
    setEditFormData({
      companyName: flexBook.companyName || '',
      companyAddress: flexBook.companyAddress || '',
      companyEmail: flexBook.companyEmail || '',
      companyPhone: flexBook.companyPhone || '',
      flexTitle: flexBook.flexTitle || 'FLEX BOOK',
      pointsTitle: flexBook.pointsTitle || 'Our Features',
      message: flexBook.message || 'Thank you for your business!',
      language: flexBook.language || 'en',
      textStyles: flexBook.textStyles || {},
      logoSettings: flexBook.logoSettings || {},
      design: flexBook.design || {},
      canvasSize: flexBook.canvasSize || { width: 800, height: 1000 }
    });
    setEditPoints(flexBook.points || []);
    setEditModal(true);
  };

  // Add point in edit modal
  const addEditPoint = () => {
    if (newPointText.trim()) {
      setEditPoints([...editPoints, { 
        id: Date.now(), 
        text: newPointText.trim(), 
        x: 400, 
        y: 400 + (editPoints.length * 30) 
      }]);
      setNewPointText('');
    }
  };

  // Remove point in edit modal
  const removeEditPoint = (id) => {
    setEditPoints(editPoints.filter(point => point.id !== id));
  };

  // Update point text in edit modal
  const updateEditPoint = (id, text) => {
    setEditPoints(editPoints.map(point => point.id === id ? { ...point, text } : point));
  };

  // View Flex Book Modal
  const ViewFlexBookModal = () => {
    if (!selectedFlexBook) return null;

    const design = selectedFlexBook.design || {};
    const logoSettings = selectedFlexBook.logoSettings || {};
    const points = selectedFlexBook.points || [];

    return (
      <Modal isOpen={viewModal} toggle={() => setViewModal(false)} size="lg" className="modal-dialog-centered">
        <ModalHeader toggle={() => setViewModal(false)}>
          <div className="d-flex align-items-center">
            <FaBoxes className="me-2 text-primary" /> 
            Flex Book Details - {selectedFlexBook.flexId || selectedFlexBook._id.slice(-6)}
          </div>
        </ModalHeader>
        <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Preview Image */}
          {selectedFlexBook.previewImage && (
            <div className="text-center mb-4">
              <img 
                src={`https://designback.onrender.com/${selectedFlexBook.previewImage}`} 
                alt="Flex Book Preview"
                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                }}
              />
              <Button 
                size="sm" 
                color="primary" 
                className="mt-2"
                onClick={() => downloadFlexBook(selectedFlexBook)}
              >
                <FaDownload className="me-1" /> Download Flex Book
              </Button>
            </div>
          )}

          {/* Flex Book Info */}
          <Row className="mb-4">
            <Col md={6}>
              <div className="p-3 border rounded bg-light">
                <h6 className="text-primary mb-3"><FaBuilding /> Company Details</h6>
                <p className="mb-1"><strong>Name:</strong> {selectedFlexBook.companyName}</p>
                <p className="mb-1"><strong>Address:</strong> {selectedFlexBook.companyAddress || 'N/A'}</p>
                <p className="mb-1"><strong>Email:</strong> {selectedFlexBook.companyEmail || 'N/A'}</p>
                <p className="mb-0"><strong>Phone:</strong> {selectedFlexBook.companyPhone || 'N/A'}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="p-3 border rounded bg-light">
                <h6 className="text-primary mb-3">Flex Book Details</h6>
                <p className="mb-1"><strong>Title:</strong> {selectedFlexBook.flexTitle}</p>
                <p className="mb-1"><strong>Points Title:</strong> {selectedFlexBook.pointsTitle}</p>
                <p className="mb-1"><strong>Language:</strong> {selectedFlexBook.language === 'hi' ? 'हिंदी' : 'English'}</p>
                <p className="mb-0"><strong>Canvas Size:</strong> {selectedFlexBook.canvasSize?.width}×{selectedFlexBook.canvasSize?.height}px</p>
              </div>
            </Col>
          </Row>

          {/* Points */}
          {points.length > 0 && (
            <div className="mb-4 p-3 border rounded bg-info bg-opacity-10">
              <h6 className="text-info mb-2"><FaListUl /> {selectedFlexBook.pointsTitle || 'Points'}</h6>
              {points.map((point, idx) => (
                <p key={point.id} className="mb-1">• {point.text}</p>
              ))}
            </div>
          )}

          {/* Message */}
          {selectedFlexBook.message && (
            <div className="mb-4 p-3 border rounded bg-success bg-opacity-10">
              <h6 className="text-success mb-2">📝 Message</h6>
              <p className="mb-0">{selectedFlexBook.message}</p>
            </div>
          )}

          {/* Design Settings */}
          <div className="mb-4">
            <h6 className="text-primary mb-3"><FaPalette /> Design Settings</h6>
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
          {selectedFlexBook.logo && (
            <div className="mb-4 p-3 border rounded bg-light">
              <h6 className="text-primary mb-2"><FaImage /> Logo</h6>
              <img 
                src={`https://designback.onrender.com/${selectedFlexBook.logo}`} 
                alt="Logo" 
                style={{ maxHeight: '80px', borderRadius: logoSettings.borderRadius || 0 }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x80?text=Logo+Not+Found';
                }}
              />
              {logoSettings.shape && <Badge color="secondary" className="ms-2">Shape: {logoSettings.shape}</Badge>}
            </div>
          )}

          {/* Template Info */}
          {selectedFlexBook.useTemplate && selectedFlexBook.templateImage && (
            <div className="p-3 border rounded bg-light">
              <h6 className="text-primary mb-2"><FaImage /> Template Used</h6>
              <img 
                src={`https://designback.onrender.com/${selectedFlexBook.templateImage}`} 
                alt="Template" 
                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x150?text=Template+Not+Found';
                }}
              />
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-4 text-muted small">
            <hr />
            <p className="mb-0">Created: {moment(selectedFlexBook.createdAt).format('DD MMM YYYY, hh:mm A')}</p>
            <p className="mb-0">Last Updated: {moment(selectedFlexBook.updatedAt).format('DD MMM YYYY, hh:mm A')}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setViewModal(false)}>
            <FaTimes className="me-1" /> Close
          </Button>
          <Button color="primary" onClick={() => {
            setViewModal(false);
            openEditModal(selectedFlexBook);
          }}>
            <FaEdit className="me-1" /> Edit
          </Button>
          <Button color="success" onClick={() => downloadFlexBook(selectedFlexBook)}>
            <FaDownload className="me-1" /> Download
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  // Edit Flex Book Modal
  const EditFlexBookModal = () => {
    if (!selectedFlexBook) return null;

    const design = editFormData.design || {};
    const canvasSize = editFormData.canvasSize || { width: 800, height: 1000 };

    return (
      <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="lg" className="modal-dialog-centered">
        <ModalHeader toggle={() => setEditModal(false)}>
          <div className="d-flex align-items-center">
            <FaEdit className="me-2 text-warning" /> 
            Edit Flex Book
          </div>
        </ModalHeader>
        <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Form>
            {/* Company Info */}
            <h6 className="text-primary mb-3">Company Information</h6>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Company Name</Label>
                  <Input 
                    value={editFormData.companyName || ''} 
                    onChange={(e) => setEditFormData({...editFormData, companyName: e.target.value})}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>Company Address</Label>
                  <Input 
                    value={editFormData.companyAddress || ''} 
                    onChange={(e) => setEditFormData({...editFormData, companyAddress: e.target.value})}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    value={editFormData.companyEmail || ''} 
                    onChange={(e) => setEditFormData({...editFormData, companyEmail: e.target.value})}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Phone</Label>
                  <Input 
                    value={editFormData.companyPhone || ''} 
                    onChange={(e) => setEditFormData({...editFormData, companyPhone: e.target.value})}
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* Flex Book Details */}
            <h6 className="text-primary mb-3 mt-3">Flex Book Details</h6>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Flex Title</Label>
                  <Input 
                    value={editFormData.flexTitle || 'FLEX BOOK'} 
                    onChange={(e) => setEditFormData({...editFormData, flexTitle: e.target.value})}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Points Title</Label>
                  <Input 
                    value={editFormData.pointsTitle || 'Our Features'} 
                    onChange={(e) => setEditFormData({...editFormData, pointsTitle: e.target.value})}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label>Message</Label>
                  <Input 
                    type="textarea"
                    rows="2"
                    value={editFormData.message || ''} 
                    onChange={(e) => setEditFormData({...editFormData, message: e.target.value})}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Language</Label>
                  <Input 
                    type="select"
                    value={editFormData.language || 'en'} 
                    onChange={(e) => setEditFormData({...editFormData, language: e.target.value})}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Canvas Size</Label>
                  <div className="d-flex gap-2">
                    <Input 
                      type="number"
                      placeholder="Width"
                      value={canvasSize.width || 800}
                      onChange={(e) => setEditFormData({
                        ...editFormData, 
                        canvasSize: { ...canvasSize, width: parseInt(e.target.value) }
                      })}
                    />
                    <Input 
                      type="number"
                      placeholder="Height"
                      value={canvasSize.height || 1000}
                      onChange={(e) => setEditFormData({
                        ...editFormData, 
                        canvasSize: { ...canvasSize, height: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>

            {/* Points */}
            <h6 className="text-primary mb-3 mt-3"><FaListUl /> Points</h6>
            <div className="mb-3">
              <div className="d-flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Add new point..." 
                  value={newPointText}
                  onChange={(e) => setNewPointText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEditPoint()}
                />
                <Button color="success" onClick={addEditPoint}><FaPlus /> Add</Button>
              </div>
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {editPoints.map((point) => (
                <div key={point.id} className="border rounded p-2 mb-2 d-flex align-items-center gap-2">
                  <span style={{ color: design.accentColor || '#3b82f6' }}>•</span>
                  <Input 
                    value={point.text} 
                    onChange={(e) => updateEditPoint(point.id, e.target.value)}
                    className="flex-grow-1"
                    style={{ border: 'none', background: 'transparent' }}
                  />
                  <Button color="danger" size="sm" onClick={() => removeEditPoint(point.id)}><FaTrash /></Button>
                </div>
              ))}
            </div>

            {/* Design Settings */}
            <h6 className="text-primary mb-3 mt-3"><FaPalette /> Design Settings</h6>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label>Background Color</Label>
                  <Input 
                    type="color"
                    value={design.backgroundColor || '#ffffff'} 
                    onChange={(e) => setEditFormData({
                      ...editFormData, 
                      design: { ...design, backgroundColor: e.target.value }
                    })}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Text Color</Label>
                  <Input 
                    type="color"
                    value={design.textColor || '#000000'} 
                    onChange={(e) => setEditFormData({
                      ...editFormData, 
                      design: { ...design, textColor: e.target.value }
                    })}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Accent Color</Label>
                  <Input 
                    type="color"
                    value={design.accentColor || '#3b82f6'} 
                    onChange={(e) => setEditFormData({
                      ...editFormData, 
                      design: { ...design, accentColor: e.target.value }
                    })}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleUpdate} disabled={updating}>
            {updating ? <><FaSpinner className="spinner-border-sm me-1" /> Saving...</> : <><FaSave className="me-1" /> Save Changes</>}
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!selectedFlexBook) return null;

    return (
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} className="modal-dialog-centered">
        <ModalHeader toggle={() => setDeleteModal(false)}>
          <FaTrash className="text-danger me-2" /> Confirm Delete
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this flex book?</p>
          <p className="text-danger mb-0">
            <strong>Company:</strong> {selectedFlexBook.companyName}<br />
            <strong>Title:</strong> {selectedFlexBook.flexTitle}
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
          <CardTitle tag="h3" className="text-primary mb-4">
            <FaBoxes className="me-2" /> Flex Books List
          </CardTitle>

          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-2 text-muted">Loading flex books...</p>
            </div>
          ) : flexBooks.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No flex books found. Create your first flex book!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th><FaBuilding /> Company Name</th>
                    <th><FaBoxes /> Flex Title</th>
                    <th><FaListUl /> Points Count</th>
                    <th><FaLanguage /> Language</th>
                    <th>Preview</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flexBooks.map((flexBook, index) => (
                    <tr key={flexBook._id}>
                      <td>{index + 1}</td>
                      <td><strong>{flexBook.companyName}</strong></td>
                      <td>{flexBook.flexTitle}</td>
                      <td>
                        <Badge color="info">{flexBook.points?.length || 0} points</Badge>
                      </td>
                      <td>
                        <Badge color={flexBook.language === 'hi' ? 'info' : 'primary'}>
                          {flexBook.language === 'hi' ? 'हिंदी' : 'English'}
                        </Badge>
                      </td>
                      <td>
                        {flexBook.previewImage ? (
                          <img 
                            src={`https://designback.onrender.com/${flexBook.previewImage}`} 
                            alt="preview" 
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => {
                              setSelectedFlexBook(flexBook);
                              setViewModal(true);
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                            }}
                          />
                        ) : (
                          <Badge color="secondary">No Preview</Badge>
                        )}
                      </td>
                      <td className="text-muted small">{moment(flexBook.createdAt).format('DD MMM YYYY')}</td>
                      <td>
                        <Button 
                          color="info" 
                          size="sm" 
                          className="me-2"
                          onClick={() => {
                            setSelectedFlexBook(flexBook);
                            setViewModal(true);
                          }}
                        >
                          <FaEye /> View
                        </Button>
                        <Button 
                          color="warning" 
                          size="sm" 
                          className="me-2"
                          onClick={() => openEditModal(flexBook)}
                        >
                          <FaEdit /> Edit
                        </Button>
                        <Button 
                          color="danger" 
                          size="sm"
                          onClick={() => {
                            setSelectedFlexBook(flexBook);
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
          {!loading && flexBooks.length > 0 && (
            <div className="mt-4 p-3 bg-light rounded">
              <Row>
                <Col md={3} className="text-center">
                  <h5 className="text-primary">{flexBooks.length}</h5>
                  <small className="text-muted">Total Flex Books</small>
                </Col>
                <Col md={3} className="text-center">
                  <h5 className="text-primary">
                    {flexBooks.filter(b => b.language === 'hi').length}
                  </h5>
                  <small className="text-muted">Hindi Flex Books</small>
                </Col>
                <Col md={3} className="text-center">
                  <h5 className="text-primary">
                    {flexBooks.filter(b => b.language === 'en').length}
                  </h5>
                  <small className="text-muted">English Flex Books</small>
                </Col>
                <Col md={3} className="text-center">
                  <h5 className="text-primary">
                    {flexBooks.reduce((sum, b) => sum + (b.points?.length || 0), 0)}
                  </h5>
                  <small className="text-muted">Total Points</small>
                </Col>
              </Row>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modals */}
      <ViewFlexBookModal />
      <EditFlexBookModal />
      <DeleteConfirmationModal />
    </Container>
  );
};

export default FlexBookList;