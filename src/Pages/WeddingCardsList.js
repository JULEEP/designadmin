// WeddingCardsList.jsx - MODERN & STYLISH DESIGN (NO EXTERNAL DEPENDENCIES)
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardBody, Button, Table,
  Alert, Input, Spinner, Modal, ModalHeader, ModalBody, ModalFooter,
  Badge, Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaEye, FaTrash, FaSearch, FaSync, FaHeart, 
  FaCalendarAlt, FaDownload, FaSpinner, FaUser, FaVenusMars,
  FaMapMarkerAlt, FaPhone, FaClock, FaImage,
  FaPalette, FaFont, FaInfoCircle, FaBuilding, FaUsers,
  FaTshirt, FaLanguage, FaStar, FaRegClock, FaExternalLinkAlt,
  FaRing, FaGift, FaCamera, FaEnvelope, FaWhatsapp
} from 'react-icons/fa';

const API_URL = 'https://designback.onrender.com/api/admin';
const STATIC_URL = 'https://designback.onrender.com';

const WeddingCardsList = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [previewSide, setPreviewSide] = useState('front');
  const [activeInfoTab, setActiveInfoTab] = useState('details');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeddingCards();
  }, [currentPage, search]);

  const fetchWeddingCards = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/weddingcards`, {
        params: {
          page: currentPage,
          limit: 10,
          search: search
        }
      });
      
      if (response.data.success) {
        setCards(response.data.data);
        setTotalPages(response.data.pagination.pages);
        setTotalCount(response.data.pagination.total);
      } else {
        setError('Failed to load wedding cards');
      }
    } catch (error) {
      console.error('Error fetching wedding cards:', error);
      setError(error.response?.data?.message || 'Failed to load wedding cards');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this wedding card?')) return;
    
    setDeleting(true);
    setDeleteId(id);
    try {
      const response = await axios.delete(`${API_URL}/weddingcard/${id}`);
      if (response.data.success) {
        fetchWeddingCards();
      } else {
        setError(response.data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      setError(error.response?.data?.message || 'Failed to delete wedding card');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handlePreview = (card) => {
    setSelectedCard(card);
    setPreviewSide('front');
    setActiveInfoTab('details');
    setShowPreviewModal(true);
  };

  const downloadCard = (side) => {
    let imageUrl = null;
    if (side === 'front') {
      imageUrl = selectedCard?.frontPreview ? `${STATIC_URL}${selectedCard.frontPreview}` : 
                 selectedCard?.frontImage ? `${STATIC_URL}${selectedCard.frontImage}` : null;
    } else if (side === 'inside') {
      imageUrl = selectedCard?.insidePreview ? `${STATIC_URL}${selectedCard.insidePreview}` : 
                 selectedCard?.insideImage ? `${STATIC_URL}${selectedCard.insideImage}` : null;
    } else if (side === 'back') {
      imageUrl = selectedCard?.backPreview ? `${STATIC_URL}${selectedCard.backPreview}` : 
                 selectedCard?.backImage ? `${STATIC_URL}${selectedCard.backImage}` : null;
    }
    
    if (imageUrl) {
      const link = document.createElement('a');
      link.download = `wedding_card_${side}_${selectedCard._id}.png`;
      link.href = imageUrl;
      link.target = '_blank';
      link.click();
    } else {
      alert(`No image available for ${side} side`);
    }
  };

  const downloadAllSides = () => {
    if (hasImageForSide('front')) downloadCard('front');
    if (hasImageForSide('inside')) setTimeout(() => downloadCard('inside'), 500);
    if (hasImageForSide('back')) setTimeout(() => downloadCard('back'), 1000);
  };

  const getImageUrl = () => {
    if (!selectedCard) return null;
    
    if (previewSide === 'front') {
      return selectedCard.frontPreview ? `${STATIC_URL}${selectedCard.frontPreview}` : 
             selectedCard.frontImage ? `${STATIC_URL}${selectedCard.frontImage}` : null;
    } else if (previewSide === 'inside') {
      return selectedCard.insidePreview ? `${STATIC_URL}${selectedCard.insidePreview}` : 
             selectedCard.insideImage ? `${STATIC_URL}${selectedCard.insideImage}` : null;
    } else {
      return selectedCard.backPreview ? `${STATIC_URL}${selectedCard.backPreview}` : 
             selectedCard.backImage ? `${STATIC_URL}${selectedCard.backImage}` : null;
    }
  };

  const hasImageForSide = (side) => {
    if (!selectedCard) return false;
    if (side === 'front') return !!(selectedCard.frontPreview || selectedCard.frontImage);
    if (side === 'inside') return !!(selectedCard.insidePreview || selectedCard.insideImage);
    if (side === 'back') return !!(selectedCard.backPreview || selectedCard.backImage);
    return false;
  };

  const openImageInNewTab = () => {
    const imageUrl = getImageUrl();
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fff5f0 50%, #fefce8 100%)'
    }}>
      <Container className="py-5">
        {/* Hero Section */}
        <div className="text-center mb-5 fade-in">
          <div className="mb-3">
            <FaRing size={40} className="text-danger" />
            <FaHeart size={35} className="text-danger mx-2" style={{ transform: 'rotate(15deg)' }} />
            <FaRing size={40} className="text-danger" />
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #dc2626, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px'
          }}>
            Wedding Gallery
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
            <FaHeart className="text-danger me-2" />
            {totalCount} Beautiful Wedding Stories
            <FaHeart className="text-danger ms-2" />
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-4 slide-up">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <div style={{
                background: 'white',
                borderRadius: '50px',
                padding: '5px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: '10px'
              }}>
                <Input
                  placeholder="🔍 Search by groom or bride name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    border: 'none',
                    borderRadius: '50px',
                    padding: '12px 20px',
                    fontSize: '16px',
                    background: 'transparent'
                  }}
                />
                <Button
                  onClick={fetchWeddingCards}
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '0 30px',
                    fontWeight: '600'
                  }}
                >
                  <FaSearch className="me-2" /> Search
                </Button>
                <Button
                  onClick={fetchWeddingCards}
                  style={{
                    background: '#6c757d',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '0 20px'
                  }}
                >
                  <FaSync />
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {error && (
          <Alert color="danger" toggle={() => setError('')} className="rounded-3">
            {error}
          </Alert>
        )}

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="danger" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Loading beautiful wedding cards...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-5 fade-in">
            <div style={{
              width: '150px',
              height: '150px',
              background: 'linear-gradient(135deg, #fee2e2, #fff0e6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <FaHeart size={60} className="text-danger" />
            </div>
            <h3 className="text-muted">No wedding cards found</h3>
            <p className="text-muted">Start creating beautiful wedding memories</p>
          </div>
        ) : (
          <>
            {cards.map((card, index) => (
              <div
                key={card._id}
                className="modern-card fade-in"
                style={{
                  background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
                  borderRadius: '20px',
                  padding: '20px',
                  marginBottom: '20px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(220, 38, 38, 0.1)',
                  transition: 'all 0.3s ease',
                  animationDelay: `${index * 0.05}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
                }}
              >
                <Row className="align-items-center">
                  <Col md={3}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px'
                      }}>
                        <FaHeart />
                      </div>
                      <div>
                        <h5 className="mb-0" style={{ fontWeight: '700', color: '#dc2626' }}>
                          {card.groomName} <span style={{ color: '#999' }}>&</span> {card.brideName}
                        </h5>
                        <small className="text-muted">
                          <FaCalendarAlt className="me-1" size={12} />
                          {card.ceremonyDate || 'Date TBA'}
                        </small>
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="venue-info">
                      <FaMapMarkerAlt className="text-danger me-2" />
                      <span style={{ fontSize: '14px' }}>
                        {card.ceremonyVenue?.substring(0, 35) || 'Venue TBA'}
                      </span>
                    </div>
                  </Col>
                  <Col md={2}>
                    <div className="preview-badges">
                      {card.frontPreview && <Badge color="danger" pill className="me-1">🎨 Front</Badge>}
                      {card.insidePreview && <Badge color="info" pill className="me-1">📖 Inside</Badge>}
                      {card.backPreview && <Badge color="warning" pill>🔙 Back</Badge>}
                    </div>
                  </Col>
                  <Col md={2}>
                    <small className="text-muted">
                      <FaClock className="me-1" />
                      {new Date(card.createdAt).toLocaleDateString()}
                    </small>
                  </Col>
                  <Col md={2}>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '8px 16px'
                        }}
                        onClick={() => handlePreview(card)}
                      >
                        <FaEye className="me-1" /> Preview
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        style={{ borderRadius: '12px', padding: '8px 16px' }}
                        onClick={() => handleDelete(card._id)}
                        disabled={deleting && deleteId === card._id}
                      >
                        {deleting && deleteId === card._id ? <FaSpinner className="fa-spin" /> : <FaTrash />}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination style={{ gap: '8px' }}>
                  <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} 
                      style={{ borderRadius: '12px', border: 'none', background: '#f0f0f0' }} />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i} active={currentPage === i + 1}>
                      <PaginationLink onClick={() => setCurrentPage(i + 1)}
                        style={{
                          borderRadius: '12px',
                          border: 'none',
                          background: currentPage === i + 1 ? 'linear-gradient(135deg, #dc2626, #ef4444)' : '#f0f0f0',
                          color: currentPage === i + 1 ? 'white' : '#333'
                        }}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem disabled={currentPage === totalPages}>
                    <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)}
                      style={{ borderRadius: '12px', border: 'none', background: '#f0f0f0' }} />
                  </PaginationItem>
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>

      {/* Modern Preview Modal */}
      <Modal isOpen={showPreviewModal} toggle={() => setShowPreviewModal(false)} size="xl" centered scrollable>
        <ModalHeader toggle={() => setShowPreviewModal(false)} style={{ borderBottom: '2px solid #fee2e2' }}>
          <div>
            <div className="d-flex align-items-center gap-2">
              <FaHeart className="text-danger" />
              <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                {selectedCard?.groomName} <span className="text-muted">&</span> {selectedCard?.brideName}
              </span>
            </div>
            <small className="text-muted">
              Created: {selectedCard && new Date(selectedCard.createdAt).toLocaleDateString()}
            </small>
          </div>
        </ModalHeader>
        <ModalBody>
          {/* Side Tabs */}
          <div className="mb-4">
            <div className="d-flex gap-2 justify-content-center flex-wrap">
              {['front', 'inside', 'back'].map((side) => (
                <Button
                  key={side}
                  color={previewSide === side ? 'danger' : 'light'}
                  onClick={() => setPreviewSide(side)}
                  disabled={!hasImageForSide(side)}
                  style={{
                    borderRadius: '30px',
                    padding: '10px 25px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}
                >
                  <FaImage className="me-2" />
                  {side} Side {hasImageForSide(side) ? '✨' : '🔒'}
                </Button>
              ))}
            </div>
          </div>

          {/* Image Preview */}
          <div className="text-center mb-4">
            {getImageUrl() ? (
              <div className="fade-in">
                <img
                  src={getImageUrl()}
                  alt={`${previewSide} side`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '550px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    border: '3px solid white'
                  }}
                />
                <div className="mt-3">
                  <Button color="link" onClick={openImageInNewTab} className="text-danger">
                    <FaExternalLinkAlt className="me-1" /> View Full Size
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-light rounded-4">
                <FaImage size={60} className="text-muted mb-3" />
                <p>No preview available for {previewSide} side</p>
              </div>
            )}
          </div>

          {/* Info Tabs */}
          <div className="mb-3 border-bottom">
            <div className="d-flex gap-3 justify-content-center">
              <Button color="link" onClick={() => setActiveInfoTab('details')}
                className={activeInfoTab === 'details' ? 'text-danger fw-bold' : 'text-muted'}
                style={{ textDecoration: 'none' }}>
                <FaInfoCircle className="me-1" /> Details
              </Button>
              <Button color="link" onClick={() => setActiveInfoTab('styles')}
                className={activeInfoTab === 'styles' ? 'text-danger fw-bold' : 'text-muted'}
                style={{ textDecoration: 'none' }}>
                <FaFont className="me-1" /> Text Styles
              </Button>
              <Button color="link" onClick={() => setActiveInfoTab('design')}
                className={activeInfoTab === 'design' ? 'text-danger fw-bold' : 'text-muted'}
                style={{ textDecoration: 'none' }}>
                <FaPalette className="me-1" /> Design
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-3">
            {activeInfoTab === 'details' && selectedCard && (
              <Row>
                <Col md={6}>
                  <div className="mb-3 p-3 border rounded-4 shadow-sm">
                    <h6 className="text-danger"><FaUser /> Groom Details</h6>
                    <hr />
                    <p><strong>Name:</strong> {selectedCard.groomName}</p>
                    <p><strong>Father's Name:</strong> {selectedCard.groomFatherName || 'N/A'}</p>
                    <p><strong>Mother's Name:</strong> {selectedCard.groomMotherName || 'N/A'}</p>
                    {selectedCard.groomMobile && <p><strong>Mobile:</strong> {selectedCard.groomMobile}</p>}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3 p-3 border rounded-4 shadow-sm">
                    <h6 className="text-danger"><FaVenusMars /> Bride Details</h6>
                    <hr />
                    <p><strong>Name:</strong> {selectedCard.brideName}</p>
                    <p><strong>Father's Name:</strong> {selectedCard.brideFatherName || 'N/A'}</p>
                    <p><strong>Mother's Name:</strong> {selectedCard.brideMotherName || 'N/A'}</p>
                    {selectedCard.brideMobile && <p><strong>Mobile:</strong> {selectedCard.brideMobile}</p>}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3 p-3 border rounded-4 shadow-sm">
                    <h6 className="text-warning"><FaCalendarAlt /> Wedding Ceremony</h6>
                    <hr />
                    <p><strong>Date:</strong> {selectedCard.ceremonyDate || 'N/A'}</p>
                    <p><strong>Time:</strong> {selectedCard.ceremonyTime || 'N/A'}</p>
                    <p><strong>Venue:</strong> {selectedCard.ceremonyVenue || 'N/A'}</p>
                    <p><strong>Address:</strong> {selectedCard.ceremonyAddress || 'N/A'}</p>
                  </div>
                </Col>
                {selectedCard.receptionDate && (
                  <Col md={6}>
                    <div className="mb-3 p-3 border rounded-4 shadow-sm">
                      <h6 className="text-info"><FaStar /> Reception</h6>
                      <hr />
                      <p><strong>Date:</strong> {selectedCard.receptionDate}</p>
                      <p><strong>Time:</strong> {selectedCard.receptionTime}</p>
                      <p><strong>Venue:</strong> {selectedCard.receptionVenue}</p>
                      <p><strong>Address:</strong> {selectedCard.receptionAddress}</p>
                    </div>
                  </Col>
                )}
              </Row>
            )}

            {activeInfoTab === 'styles' && selectedCard?.textStyles && (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{ background: '#f8f9fa' }}>
                      <tr>
                        <th>Element</th>
                        <th>Font Size</th>
                        <th>Color</th>
                        <th>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedCard.textStyles).map(([key, style]) => (
                        <tr key={key}>
                          <td><strong className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</strong></td>
                          <td>{style.fontSize}px</td>
                          <td>
                            <span style={{ 
                              backgroundColor: style.color, 
                              padding: '2px 8px', 
                              borderRadius: '8px', 
                              color: '#fff' 
                            }}>
                              {style.color}
                            </span>
                          </td>
                          <td>({style.x}, {style.y})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeInfoTab === 'design' && selectedCard && (
              <Row>
                <Col md={6}>
                  <div className="p-3 border rounded-4 shadow-sm">
                    <h6 className="text-primary"><FaPalette /> Design Settings</h6>
                    <hr />
                    <p><strong>Background Color:</strong> 
                      <span style={{ 
                        backgroundColor: selectedCard.design?.backgroundColor, 
                        padding: '2px 10px', 
                        borderRadius: '8px',
                        marginLeft: '10px',
                        display: 'inline-block'
                      }}>
                        {selectedCard.design?.backgroundColor}
                      </span>
                    </p>
                    <p><strong>Text Color:</strong>
                      <span style={{ 
                        backgroundColor: selectedCard.design?.textColor, 
                        padding: '2px 10px', 
                        borderRadius: '8px', 
                        color: '#fff',
                        marginLeft: '10px',
                        display: 'inline-block'
                      }}>
                        {selectedCard.design?.textColor}
                      </span>
                    </p>
                    <p><strong>Accent Color:</strong>
                      <span style={{ 
                        backgroundColor: selectedCard.design?.accentColor, 
                        padding: '2px 10px', 
                        borderRadius: '8px',
                        marginLeft: '10px',
                        display: 'inline-block'
                      }}>
                        {selectedCard.design?.accentColor}
                      </span>
                    </p>
                    <p><strong>Font Family:</strong> {selectedCard.design?.fontFamily}</p>
                  </div>
                </Col>
              </Row>
            )}
          </div>
        </ModalBody>
        <ModalFooter style={{ borderTop: '2px solid #fee2e2' }}>
          <div className="d-flex gap-2 w-100 justify-content-between flex-wrap">
            <div>
              {hasImageForSide(previewSide) && (
                <Button color="success" onClick={() => downloadCard(previewSide)} style={{ borderRadius: '30px' }}>
                  <FaDownload className="me-2" /> Download {previewSide}
                </Button>
              )}
              {(hasImageForSide('front') || hasImageForSide('inside') || hasImageForSide('back')) && (
                <Button color="info" className="ms-2" onClick={downloadAllSides} style={{ borderRadius: '30px' }}>
                  <FaDownload className="me-2" /> Download All
                </Button>
              )}
            </div>
            <Button color="secondary" onClick={() => setShowPreviewModal(false)} style={{ borderRadius: '30px' }}>
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .slide-up {
          animation: fadeIn 0.5s ease-out 0.2s both;
        }
        
        .modern-card {
          transition: all 0.3s ease;
        }
        
        .table-responsive::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .table-responsive::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .table-responsive::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border-radius: 10px;
        }
        
        .table-responsive::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }
      `}</style>
    </div>
  );
};

export default WeddingCardsList;