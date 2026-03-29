import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
  Alert,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCloudUploadAlt, 
  FaSpinner, 
  FaEye,
  FaSave,
  FaMousePointer,
  FaDownload,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPalette,
  FaFont,
  FaImages,
  FaCheckCircle,
  FaArrowsAlt,
  FaFillDrip,
  FaBold,
  FaItalic,
  FaUnderline,
  FaSquare,
  FaRegCircle
} from 'react-icons/fa';
import html2canvas from 'html2canvas';

const BillBookCreator = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [templateImage, setTemplateImage] = useState(null);
  const [originalTemplateFile, setOriginalTemplateFile] = useState(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  
  const [logoSettings, setLogoSettings] = useState({
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 0,
    borderColor: '#000000',
    shape: 'rectangle',
    show: true
  });
  
  const [billData, setBillData] = useState({
    companyName: 'My Business Pvt Ltd',
    companyAddress: '123 Business Street, Downtown, City - 123456',
    companyEmail: 'info@mybusiness.com',
    companyPhone: '+1 (234) 567-8900',
    logo: null,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#3b82f6',
    fontFamily: 'Poppins',
    fontSize: '14',
    showLogo: true,
    roundedCorners: true,
    shadow: true,
    border: true,
    useTemplate: false
  });
  
  const [textStyles, setTextStyles] = useState({
    companyName:    { fontSize: 32, fontWeight: 'bold',   color: '#000000', italic: false, underline: false, x: 80, y: 80,  show: true },
    companyAddress: { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 80, y: 140, show: true },
    companyEmail:   { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 80, y: 170, show: true },
    companyPhone:   { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 80, y: 200, show: true }
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState('companyName');
  
  const logoInputRef    = useRef(null);
  const templateInputRef = useRef(null);
  const navigate        = useNavigate();
  const canvasRef       = useRef(null);
  const billRef         = useRef(null);

  const updateTextStyle = (field, styleName, value) => {
    setTextStyles(prev => ({
      ...prev,
      [field]: { ...prev[field], [styleName]: value }
    }));
  };

  const updateTextPosition = (field, x, y) => {
    setTextStyles(prev => ({
      ...prev,
      [field]: { ...prev[field], x, y }
    }));
  };

  const updateLogoPosition = (x, y) => {
    setLogoSettings(prev => ({ ...prev, x, y }));
  };

  const updateLogoSize = (width, height) => {
    setLogoSettings(prev => ({ ...prev, width, height }));
  };

  const getLogoShapeStyle = () => {
    if (logoSettings.shape === 'circle') return { borderRadius: '50%' };
    if (logoSettings.shape === 'rounded') return { borderRadius: `${logoSettings.borderRadius}px` };
    return { borderRadius: '0' };
  };

  useEffect(() => {
    if (billData.useTemplate && templateImage && canvasRef.current) {
      drawCanvasWithOverlays(true);
    }
  }, [templateImage, billData, textStyles, previewImage, logoSettings]);

  // ─────────────────────────────────────────────
  // Draw canvas — textBaseline 'alphabetic' (default)
  // Backend bhi same 'alphabetic' use karega
  // ─────────────────────────────────────────────
  const drawCanvasWithOverlays = (withOverlays = true) => {
    if (!canvasRef.current || !templateImage) return;
    
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const img    = new Image();
    
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      canvas.width  = 800;
      canvas.height = 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      if (withOverlays) {
        if (textStyles.companyName.show && billData.companyName) {
          drawText(ctx, billData.companyName, textStyles.companyName, billData.fontFamily);
        }
        if (textStyles.companyAddress.show && billData.companyAddress) {
          drawText(ctx, billData.companyAddress, textStyles.companyAddress, billData.fontFamily);
        }
        if (textStyles.companyEmail.show && billData.companyEmail) {
          drawText(ctx, billData.companyEmail, textStyles.companyEmail, billData.fontFamily);
        }
        if (textStyles.companyPhone.show && billData.companyPhone) {
          drawText(ctx, billData.companyPhone, textStyles.companyPhone, billData.fontFamily);
        }
        if (billData.showLogo && previewImage && logoSettings.show) {
          drawLogo(ctx, previewImage, logoSettings);
        }
      }
    };
    img.src = templateImage;
  };

  // ✅ textBaseline 'alphabetic' — backend se match karega
  const drawText = (ctx, text, style, fontFamily) => {
    if (!text) return;
    let fontStyle = '';
    if (style.italic) fontStyle += 'italic ';
    fontStyle += style.fontWeight;

    ctx.save();
    ctx.font          = `${fontStyle} ${style.fontSize}px ${fontFamily}`;
    ctx.fillStyle     = style.color;
    ctx.textBaseline  = 'alphabetic'; // ✅ default — backend se same

    ctx.fillText(text, style.x, style.y);
    
    if (style.underline) {
      const metrics = ctx.measureText(text);
      ctx.beginPath();
      ctx.moveTo(style.x, style.y + 2);
      ctx.lineTo(style.x + metrics.width, style.y + 2);
      ctx.strokeStyle = style.color;
      ctx.lineWidth   = 1;
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawLogo = (ctx, logoUrl, settings) => {
    const logo = new Image();
    logo.crossOrigin = 'Anonymous';
    logo.onload = () => {
      ctx.save();

      if (settings.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(
          settings.x + settings.width / 2,
          settings.y + settings.height / 2,
          settings.width / 2, 0, 2 * Math.PI
        );
        ctx.clip();
      } else if (settings.shape === 'rounded' || (settings.shape === 'rectangle' && settings.borderRadius > 0)) {
        ctx.beginPath();
        roundRect(ctx, settings.x, settings.y, settings.width, settings.height, settings.borderRadius);
        ctx.clip();
      }

      ctx.drawImage(logo, settings.x, settings.y, settings.width, settings.height);

      if (settings.borderWidth > 0) {
        ctx.strokeStyle = settings.borderColor;
        ctx.lineWidth   = settings.borderWidth;
        if (settings.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(
            settings.x + settings.width / 2,
            settings.y + settings.height / 2,
            settings.width / 2, 0, 2 * Math.PI
          );
          ctx.stroke();
        } else {
          ctx.strokeRect(settings.x, settings.y, settings.width, settings.height);
        }
      }

      ctx.restore();
    };
    logo.src = logoUrl;
  };

  // RoundRect helper
  const roundRect = (ctx, x, y, w, h, r) => {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // ─────────────────────────────────────────────
  // Mouse drag handlers
  // ─────────────────────────────────────────────
  const handleCanvasMouseDown = (e) => {
    if (!billData.useTemplate) return;
    
    const rect   = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width  / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top)  * scaleY;
    
    const textFields = ['companyName', 'companyAddress', 'companyEmail', 'companyPhone'];
    
    for (const field of textFields) {
      const style = textStyles[field];
      if (!style || !style.show) continue;

      let text = '';
      switch (field) {
        case 'companyName':    text = billData.companyName;    break;
        case 'companyAddress': text = billData.companyAddress; break;
        case 'companyEmail':   text = billData.companyEmail;   break;
        case 'companyPhone':   text = billData.companyPhone;   break;
        default: text = '';
      }

      if (!text) continue;

      const tempCanvas = document.createElement('canvas');
      const tempCtx    = tempCanvas.getContext('2d');
      let fontStyle    = style.italic ? 'italic ' : '';
      fontStyle       += style.fontWeight;
      tempCtx.font     = `${fontStyle} ${style.fontSize}px ${billData.fontFamily}`;
      const textWidth  = tempCtx.measureText(text).width;
      const textHeight = style.fontSize;

      // alphabetic baseline: y is the baseline, text goes UP from y
      if (
        mouseX >= style.x - 10 &&
        mouseX <= style.x + textWidth + 10 &&
        mouseY >= style.y - textHeight - 5 &&
        mouseY <= style.y + 5
      ) {
        setIsDragging(true);
        setDragTarget({ type: 'text', field });
        setDragStart({ x: mouseX - style.x, y: mouseY - style.y });
        return;
      }
    }

    // Check logo hit
    if (billData.showLogo && previewImage && logoSettings.show) {
      if (
        mouseX >= logoSettings.x &&
        mouseX <= logoSettings.x + logoSettings.width &&
        mouseY >= logoSettings.y &&
        mouseY <= logoSettings.y + logoSettings.height
      ) {
        setIsDragging(true);
        setDragTarget({ type: 'logo' });
        setDragStart({ x: mouseX - logoSettings.x, y: mouseY - logoSettings.y });
        return;
      }
    }
  };
  
  const handleCanvasMouseMove = (e) => {
    if (!isDragging || !dragTarget) return;
    
    const rect   = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width  / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top)  * scaleY;
    
    if (dragTarget.type === 'text') {
      updateTextPosition(dragTarget.field, mouseX - dragStart.x, mouseY - dragStart.y);
    } else if (dragTarget.type === 'logo') {
      updateLogoPosition(mouseX - dragStart.x, mouseY - dragStart.y);
    }
  };
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  const sampleTemplates = [
    { id: 1, name: 'Modern',       image: 'https://placehold.co/800x1000/3b82f6/white?text=Modern+Template' },
    { id: 2, name: 'Classic',      image: 'https://placehold.co/800x1000/f3f4f6/black?text=Classic+Template' },
    { id: 3, name: 'Professional', image: 'https://placehold.co/800x1000/1f2937/white?text=Professional+Template' },
    { id: 4, name: 'Minimal',      image: 'https://placehold.co/800x1000/ffffff/black?text=Minimal+Template' }
  ];

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrorMessage('Template size should be less than 5MB'); return; }
    setTemplateImage(URL.createObjectURL(file));
    setOriginalTemplateFile(file);
    setBillData({ ...billData, useTemplate: true });
    setShowTemplatePicker(false);
  };

  const selectTemplate = (template) => {
    setTemplateImage(template.image);
    setOriginalTemplateFile(null);
    setBillData({ ...billData, useTemplate: true });
    setShowTemplatePicker(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setErrorMessage('Logo size should be less than 2MB'); return; }
    setBillData({ ...billData, logo: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const downloadBill = async () => {
    if (billData.useTemplate && canvasRef.current) {
      const link      = document.createElement('a');
      link.download   = `${billData.companyName.replace(/\s/g, '_')}_bill.png`;
      link.href       = canvasRef.current.toDataURL('image/png');
      link.click();
    } else if (billRef.current) {
      try {
        const canvas  = await html2canvas(billRef.current, { scale: 2, backgroundColor: null, useCORS: true, logging: false });
        const link    = document.createElement('a');
        link.download = `${billData.companyName.replace(/\s/g, '_')}_bill.png`;
        link.href     = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        setErrorMessage('Failed to download bill');
      }
    }
  };

  const resizeImageToCanvasSize = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas  = document.createElement('canvas');
        canvas.width  = 800;
        canvas.height = 1000;
        const ctx     = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 800, 1000);
        canvas.toBlob(blob => { URL.revokeObjectURL(url); resolve(blob); }, 'image/png');
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    const formData = new FormData();
    formData.append('companyName',    billData.companyName    || '');
    formData.append('companyAddress', billData.companyAddress || '');
    formData.append('companyEmail',   billData.companyEmail   || '');
    formData.append('companyPhone',   billData.companyPhone   || '');
    formData.append('textStyles',     JSON.stringify(textStyles));
    formData.append('logoSettings',   JSON.stringify(logoSettings));
    formData.append('useTemplate',    billData.useTemplate ? 'true' : 'false');
    formData.append('design', JSON.stringify({
      backgroundColor: billData.backgroundColor,
      textColor:       billData.textColor,
      accentColor:     billData.accentColor,
      fontFamily:      billData.fontFamily,
      fontSize:        billData.fontSize,
      showLogo:        billData.showLogo,
      roundedCorners:  billData.roundedCorners,
      shadow:          billData.shadow,
      border:          billData.border
    }));
    
    if (billData.logo) formData.append('logo', billData.logo);
    
    // Template image — clean (no overlay)
    let templateBlob = null;
    if (originalTemplateFile) {
      templateBlob = await resizeImageToCanvasSize(originalTemplateFile);
    } else if (templateImage && billData.useTemplate) {
      const response = await fetch(templateImage);
      const blob     = await response.blob();
      const file     = new File([blob], 'template.png', { type: 'image/png' });
      templateBlob   = await resizeImageToCanvasSize(file);
    }
    if (templateBlob) formData.append('templateImage', templateBlob, 'template.png');
    
    // Preview image — canvas with overlays
    let finalImageBlob = null;
    if (billData.useTemplate && canvasRef.current && templateImage) {
      try {
        finalImageBlob = await new Promise(resolve => canvasRef.current.toBlob(resolve, 'image/png'));
      } catch (err) {
        console.error('Error capturing canvas:', err);
      }
    } else if (billRef.current) {
      try {
        const canvas   = await html2canvas(billRef.current, { scale: 2, backgroundColor: null, useCORS: true });
        finalImageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      } catch (err) {
        console.error('Error capturing bill:', err);
      }
    }
    if (finalImageBlob) formData.append('previewImage', finalImageBlob, 'preview.png');
    
    try {
      const response = await axios.post(
        'https://designback.onrender.com/api/admin/createbillbook',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setSuccessMessage('Bill book created successfully!');
      setTimeout(() => navigate('/billbooklist'), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Error creating bill book');
    } finally {
      setLoading(false);
    }
  };

  const renderBillBook = () => {
    const billStyle = {
      backgroundColor: billData.backgroundColor,
      color:           billData.textColor,
      fontFamily:      billData.fontFamily,
      fontSize:        `${billData.fontSize}px`,
      borderRadius:    billData.roundedCorners ? '16px' : '0',
      boxShadow:       billData.shadow ? '0 20px 35px -10px rgba(0,0,0,0.2)' : 'none',
      border:          billData.border ? `1px solid ${billData.accentColor}20` : 'none',
      maxWidth:        '800px',
      margin:          '0 auto',
      position:        'relative',
      overflow:        'hidden',
      padding:         '40px',
      minHeight:       '400px'
    };
    
    return (
      <div ref={billRef} style={billStyle}>
        <div className="mb-4">
          {billData.showLogo && previewImage && logoSettings.show && (
            <img src={previewImage} alt="Logo" style={{ 
              width: `${logoSettings.width}px`, height: `${logoSettings.height}px`,
              objectFit: 'contain', ...getLogoShapeStyle(),
              border: logoSettings.borderWidth > 0 ? `${logoSettings.borderWidth}px solid ${logoSettings.borderColor}` : 'none',
              marginBottom: '15px'
            }} />
          )}
          <h2 style={{ color: billData.accentColor, marginBottom: '10px', fontSize: '32px' }}>{billData.companyName}</h2>
          <p style={{ fontSize: '12px', marginBottom: '5px', color: '#666' }}>{billData.companyAddress}</p>
          <p style={{ fontSize: '12px', marginBottom: '5px', color: '#666' }}>{billData.companyEmail}</p>
          <p style={{ fontSize: '12px', marginBottom: '0',  color: '#666' }}>{billData.companyPhone}</p>
        </div>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#999', borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '200px' }}>
          <p style={{ marginBottom: '0' }}>Thank you for your business!</p>
        </div>
      </div>
    );
  };

  return (
    <Container fluid className="my-5">
      <Row>
        <Col md={6}>
          <Card className="shadow-lg border-0">
            <CardBody className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <CardTitle tag="h3" className="text-center text-primary mb-4"><FaBuilding className="me-2" />Bill Book Creator</CardTitle>

              {errorMessage  && <Alert color="danger">{errorMessage}</Alert>}
              {successMessage && <Alert color="success">{successMessage}</Alert>}

              {/* Template Section */}
              <div className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Label className="fw-bold mb-0"><FaImages className="me-2" />Bill Template</Label>
                  <Button size="sm" color="primary" onClick={() => setShowTemplatePicker(!showTemplatePicker)}>
                    {billData.useTemplate ? 'Change Template' : 'Upload Template'}
                  </Button>
                </div>
                {showTemplatePicker && (
                  <div className="mt-2">
                    <Button size="sm" color="secondary" onClick={() => templateInputRef.current.click()} className="w-100 mb-2">
                      <FaCloudUploadAlt /> Upload Custom Template
                    </Button>
                    <input ref={templateInputRef} type="file" hidden onChange={handleTemplateUpload} accept="image/*" />
                    <div className="row">
                      {sampleTemplates.map(template => (
                        <div key={template.id} className="col-6 col-md-3 mb-2">
                          <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate(template)}>
                            <img src={template.image} alt={template.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                            <small>{template.name}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {billData.useTemplate && templateImage && (
                  <Alert color="success" className="mt-2 mb-0">
                    <FaCheckCircle className="me-1" /> Template loaded! <strong>Click and drag ANY element</strong> to reposition.
                  </Alert>
                )}
              </div>

              <Nav tabs className="mb-3">
                <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}><FaBuilding /> Company Info</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><FaPalette /> Text Style</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><FaImages /> Logo & Media</NavLink></NavItem>
              </Nav>

              <Form onSubmit={handleSubmit}>
                <TabContent activeTab={activeTab}>

                  {/* Company Info Tab */}
                  <TabPane tabId="1">
                    <FormGroup><Label>Company Name *</Label><Input value={billData.companyName} onChange={(e) => setBillData({...billData, companyName: e.target.value})} /></FormGroup>
                    <FormGroup><Label>Company Address</Label><Input value={billData.companyAddress} onChange={(e) => setBillData({...billData, companyAddress: e.target.value})} /></FormGroup>
                    <FormGroup><Label>Company Email</Label><Input type="email" value={billData.companyEmail} onChange={(e) => setBillData({...billData, companyEmail: e.target.value})} /></FormGroup>
                    <FormGroup><Label>Company Phone</Label><Input value={billData.companyPhone} onChange={(e) => setBillData({...billData, companyPhone: e.target.value})} /></FormGroup>
                  </TabPane>

                  {/* Text Style Tab */}
                  <TabPane tabId="2">
                    <FormGroup>
                      <Label>Select Field to Style</Label>
                      <Input type="select" value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
                        <option value="companyName">Company Name</option>
                        <option value="companyAddress">Company Address</option>
                        <option value="companyEmail">Company Email</option>
                        <option value="companyPhone">Company Phone</option>
                      </Input>
                    </FormGroup>
                    {selectedElement && textStyles[selectedElement] && (
                      <>
                        <Row>
                          <Col xs={6}><FormGroup><Label><FaFont /> Font Size (px)</Label><Input type="number" value={textStyles[selectedElement]?.fontSize || 12} onChange={(e) => updateTextStyle(selectedElement, 'fontSize', parseInt(e.target.value))} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label><FaFillDrip /> Color</Label><Input type="color" value={textStyles[selectedElement]?.color || '#000000'} onChange={(e) => updateTextStyle(selectedElement, 'color', e.target.value)} /></FormGroup></Col>
                        </Row>
                        <Row>
                          <Col xs={6}><FormGroup><Label><FaBold /> Font Weight</Label><Input type="select" value={textStyles[selectedElement]?.fontWeight || 'normal'} onChange={(e) => updateTextStyle(selectedElement, 'fontWeight', e.target.value)}><option value="normal">Normal</option><option value="bold">Bold</option></Input></FormGroup></Col>
                          <Col xs={6}><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={textStyles[selectedElement]?.italic || false} onChange={(e) => updateTextStyle(selectedElement, 'italic', e.target.checked)} /><span className="ms-2"><FaItalic /> Italic</span></Label></FormGroup></Col>
                        </Row>
                        <FormGroup check><Label check><Input type="checkbox" checked={textStyles[selectedElement]?.underline || false} onChange={(e) => updateTextStyle(selectedElement, 'underline', e.target.checked)} /><span className="ms-2"><FaUnderline /> Underline</span></Label></FormGroup>
                        {billData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />Click and drag this element on preview to reposition</Alert>}
                      </>
                    )}
                    <hr />
                    <h6 className="mt-3">Bill Design</h6>
                    <Row>
                      <Col xs={6}><FormGroup><Label>Background Color</Label><Input type="color" value={billData.backgroundColor} onChange={(e) => setBillData({...billData, backgroundColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>Text Color</Label><Input type="color" value={billData.textColor} onChange={(e) => setBillData({...billData, textColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>Accent Color</Label><Input type="color" value={billData.accentColor} onChange={(e) => setBillData({...billData, accentColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>Font Family</Label><Input type="select" value={billData.fontFamily} onChange={(e) => setBillData({...billData, fontFamily: e.target.value})}><option>Poppins</option><option>Arial</option><option>Helvetica</option><option>Georgia</option></Input></FormGroup></Col>
                    </Row>
                    <FormGroup check><Label check><Input type="checkbox" checked={billData.roundedCorners} onChange={(e) => setBillData({...billData, roundedCorners: e.target.checked})} /><span className="ms-2">Rounded Corners</span></Label></FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={billData.shadow} onChange={(e) => setBillData({...billData, shadow: e.target.checked})} /><span className="ms-2">Show Shadow</span></Label></FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={billData.border} onChange={(e) => setBillData({...billData, border: e.target.checked})} /><span className="ms-2">Show Border</span></Label></FormGroup>
                  </TabPane>

                  {/* Logo & Media Tab */}
                  <TabPane tabId="3">
                    <FormGroup>
                      <Label>Logo Image</Label>
                      <div className="border rounded p-3 text-center" onClick={() => logoInputRef.current.click()} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                        {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p>Upload Logo</p></>}
                      </div>
                      <input ref={logoInputRef} type="file" hidden onChange={handleLogoChange} accept="image/*" />
                    </FormGroup>
                    <FormGroup check>
                      <Label check><Input type="checkbox" checked={billData.showLogo} onChange={(e) => setBillData({...billData, showLogo: e.target.checked})} /><span className="ms-2">Show Logo on Bill</span></Label>
                    </FormGroup>
                    {billData.showLogo && previewImage && (
                      <>
                        <h6 className="mt-3">Logo Customization</h6>
                        <Row>
                          <Col xs={6}><FormGroup><Label>Width (px)</Label><Input type="number" value={logoSettings.width} onChange={(e) => updateLogoSize(parseInt(e.target.value), logoSettings.height)} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>Height (px)</Label><Input type="number" value={logoSettings.height} onChange={(e) => updateLogoSize(logoSettings.width, parseInt(e.target.value))} /></FormGroup></Col>
                        </Row>
                        <FormGroup>
                          <Label>Logo Shape</Label>
                          <div className="d-flex gap-3">
                            <Button size="sm" color={logoSettings.shape === 'rectangle' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rectangle'})}><FaSquare /> Rectangle</Button>
                            <Button size="sm" color={logoSettings.shape === 'rounded'   ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rounded'})}><FaSquare /> Rounded</Button>
                            <Button size="sm" color={logoSettings.shape === 'circle'    ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'circle'})}><FaRegCircle /> Circle</Button>
                          </div>
                        </FormGroup>
                        {(logoSettings.shape === 'rounded' || logoSettings.shape === 'rectangle') && (
                          <Row><Col xs={6}><FormGroup><Label>Border Radius (px)</Label><Input type="number" value={logoSettings.borderRadius} onChange={(e) => setLogoSettings({...logoSettings, borderRadius: parseInt(e.target.value)})} /></FormGroup></Col></Row>
                        )}
                        <Row>
                          <Col xs={6}><FormGroup><Label>Border Width (px)</Label><Input type="number" value={logoSettings.borderWidth} onChange={(e) => setLogoSettings({...logoSettings, borderWidth: parseInt(e.target.value)})} /></FormGroup></Col>
                          {logoSettings.borderWidth > 0 && (
                            <Col xs={6}><FormGroup><Label>Border Color</Label><Input type="color" value={logoSettings.borderColor} onChange={(e) => setLogoSettings({...logoSettings, borderColor: e.target.value})} /></FormGroup></Col>
                          )}
                        </Row>
                        {billData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />Click and drag logo on preview to reposition</Alert>}
                      </>
                    )}
                  </TabPane>
                </TabContent>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={() => navigate('/billbooks')}>Cancel</Button>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? <><FaSpinner className="spinner-border-sm me-1" /> Creating...</> : <><FaSave /> Create Bill Book</>}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-lg border-0 sticky-top" style={{ top: '20px' }}>
            <CardBody className="p-4">
              <CardTitle tag="h4" className="text-center mb-3">
                Live Preview
                {billData.useTemplate && <small className="d-block text-muted"><FaMousePointer /> Click and drag ANY element to reposition</small>}
              </CardTitle>
              <div className="preview-container" style={{ maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
                {billData.useTemplate && templateImage ? (
                  <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: 'auto', border: '1px solid #ddd', cursor: isDragging ? 'grabbing' : 'grab' }}
                    width="800"
                    height="1000"
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                ) : renderBillBook()}
              </div>
              <div className="d-flex gap-2 mt-3">
                <Button color="success" onClick={downloadBill} className="flex-grow-1"><FaDownload /> Download Bill</Button>
                <Button color="info" onClick={() => setShowFullPreview(true)} className="flex-grow-1"><FaEye /> Full Preview</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {showFullPreview && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body text-center">
                {billData.useTemplate && templateImage
                  ? <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} width="800" height="1000" />
                  : renderBillBook()
                }
                <div className="mt-3">
                  <Button color="success" onClick={downloadBill}><FaDownload /> Download</Button>
                  <Button color="secondary" className="ms-2" onClick={() => setShowFullPreview(false)}>Close</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default BillBookCreator;