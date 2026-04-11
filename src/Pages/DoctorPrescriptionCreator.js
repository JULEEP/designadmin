// // DoctorPrescriptionCreator.jsx (Sirf Create wala, bas API integrate kiya)
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Container, Form, FormGroup, Label, Input, Button, Card, CardBody,
//   CardTitle, Alert, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink
// } from 'reactstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { 
//   FaCloudUploadAlt, FaSpinner, FaEye, FaSave, FaMousePointer, FaDownload,
//   FaUserMd, FaHospital, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaLanguage,
//   FaPalette, FaFont, FaImages, FaCheckCircle, FaArrowsAlt, FaFillDrip,
//   FaBold, FaItalic, FaUnderline, FaSquare, FaRegCircle, FaRegIdCard, FaClock
// } from 'react-icons/fa';
// import html2canvas from 'html2canvas';

// const API_URL = 'https://designback.onrender.com/api/admin';

// const DoctorPrescriptionCreator = () => {
//   const [activeTab, setActiveTab] = useState('1');
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [language, setLanguage] = useState('en');
  
//   const [templateImage, setTemplateImage] = useState(null);
//   const [originalTemplateFile, setOriginalTemplateFile] = useState(null);
//   const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  
//   const [logoSettings, setLogoSettings] = useState({
//     x: 400, y: 80, width: 80, height: 80, borderRadius: 8,
//     borderWidth: 0, borderColor: '#000000', shape: 'circle', show: true
//   });
  
//   const [hindiTranslations, setHindiTranslations] = useState({
//     doctorName: 'डॉ. राजेश कुमार',
//     qualification: 'एमबीबीएस, एमडी',
//     hospitalName: 'सिटी केयर हॉस्पिटल',
//     address: '123, मेन रोड, नई दिल्ली - 110001',
//     phone: '+91 98765 43210',
//     registrationNo: 'एमसी-12345',
//     timing: 'सुबह 10:00 - शाम 6:00'
//   });
  
//   const [prescriptionData, setPrescriptionData] = useState({
//     doctorName: 'Dr. Rajesh Kumar',
//     qualification: 'MBBS, MD',
//     hospitalName: 'City Care Hospital',
//     address: '123, Main Road, New Delhi - 110001',
//     phone: '+91 98765 43210',
//     registrationNo: 'MC-12345',
//     timing: '10:00 AM - 6:00 PM',
//     logo: null,
//     backgroundColor: '#ffffff',
//     textColor: '#000000',
//     accentColor: '#2c7da0',
//     fontFamily: 'Poppins',
//     fontSize: '12',
//     showLogo: true,
//     roundedCorners: true,
//     shadow: true,
//     border: true,
//     useTemplate: false
//   });
  
//   const [textStyles, setTextStyles] = useState({
//     doctorName:    { fontSize: 28, fontWeight: 'bold',   color: '#2c7da0', italic: false, underline: false, x: 400, y: 180, show: true },
//     qualification: { fontSize: 16, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 220, show: true },
//     hospitalName:  { fontSize: 22, fontWeight: 'bold',   color: '#2c7da0', italic: false, underline: false, x: 400, y: 260, show: true },
//     address:       { fontSize: 13, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 300, show: true },
//     phone:         { fontSize: 13, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 330, show: true },
//     registrationNo: { fontSize: 12, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 360, show: true },
//     timing:        { fontSize: 12, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 390, show: true }
//   });
  
//   const [previewImage, setPreviewImage] = useState(null);
//   const [showFullPreview, setShowFullPreview] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragTarget, setDragTarget] = useState(null);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [selectedElement, setSelectedElement] = useState('doctorName');
  
//   const logoInputRef = useRef(null);
//   const templateInputRef = useRef(null);
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//   const prescriptionRef = useRef(null);

//   const getDisplayText = (field) => {
//     if (language === 'hi') return hindiTranslations[field];
//     return prescriptionData[field];
//   };

//   const updateTextStyle = (field, styleName, value) => {
//     setTextStyles(prev => ({
//       ...prev,
//       [field]: { ...prev[field], [styleName]: value }
//     }));
//   };

//   const updateTextPosition = (field, x, y) => {
//     setTextStyles(prev => ({
//       ...prev,
//       [field]: { ...prev[field], x, y }
//     }));
//   };

//   const updateLogoPosition = (x, y) => {
//     setLogoSettings(prev => ({ ...prev, x, y }));
//   };

//   const updateLogoSize = (width, height) => {
//     setLogoSettings(prev => ({ ...prev, width, height }));
//   };

//   const getLogoShapeStyle = () => {
//     if (logoSettings.shape === 'circle') return { borderRadius: '50%' };
//     if (logoSettings.shape === 'rounded') return { borderRadius: `${logoSettings.borderRadius}px` };
//     return { borderRadius: '0' };
//   };

//   useEffect(() => {
//     if (prescriptionData.useTemplate && templateImage && canvasRef.current) {
//       drawCanvasWithOverlays(true);
//     }
//   }, [templateImage, prescriptionData, textStyles, previewImage, logoSettings, language]);

//   const drawCanvasWithOverlays = (withOverlays = true) => {
//     if (!canvasRef.current || !templateImage) return;
    
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const img = new Image();
    
//     img.crossOrigin = 'Anonymous';
//     img.onload = () => {
//       canvas.width = 800;
//       canvas.height = 1000;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
//       if (withOverlays) {
//         const fields = ['doctorName', 'qualification', 'hospitalName', 'address', 'phone', 'registrationNo', 'timing'];
//         for (const field of fields) {
//           if (textStyles[field]?.show) {
//             const displayText = getDisplayText(field);
//             if (displayText) drawText(ctx, displayText, textStyles[field], prescriptionData.fontFamily);
//           }
//         }
//         if (prescriptionData.showLogo && previewImage && logoSettings.show) {
//           drawLogo(ctx, previewImage, logoSettings);
//         }
//       }
//     };
//     img.src = templateImage;
//   };

//   const drawText = (ctx, text, style, fontFamily) => {
//     if (!text) return;
//     let fontStyle = '';
//     if (style.italic) fontStyle += 'italic ';
//     fontStyle += style.fontWeight;

//     ctx.save();
//     ctx.font = `${fontStyle} ${style.fontSize}px ${fontFamily}`;
//     ctx.fillStyle = style.color;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'alphabetic';

//     ctx.fillText(text, style.x, style.y);
    
//     if (style.underline) {
//       const metrics = ctx.measureText(text);
//       ctx.beginPath();
//       ctx.moveTo(style.x - metrics.width/2, style.y + 2);
//       ctx.lineTo(style.x + metrics.width/2, style.y + 2);
//       ctx.strokeStyle = style.color;
//       ctx.lineWidth = 1;
//       ctx.stroke();
//     }
//     ctx.restore();
//   };

//   const drawLogo = (ctx, logoUrl, settings) => {
//     const logo = new Image();
//     logo.crossOrigin = 'Anonymous';
//     logo.onload = () => {
//       ctx.save();

//       if (settings.shape === 'circle') {
//         ctx.beginPath();
//         ctx.arc(settings.x + settings.width/2, settings.y + settings.height/2, settings.width/2, 0, 2 * Math.PI);
//         ctx.clip();
//       } else if (settings.shape === 'rounded') {
//         ctx.beginPath();
//         roundRect(ctx, settings.x, settings.y, settings.width, settings.height, settings.borderRadius);
//         ctx.clip();
//       }

//       ctx.drawImage(logo, settings.x, settings.y, settings.width, settings.height);

//       if (settings.borderWidth > 0) {
//         ctx.strokeStyle = settings.borderColor;
//         ctx.lineWidth = settings.borderWidth;
//         if (settings.shape === 'circle') {
//           ctx.beginPath();
//           ctx.arc(settings.x + settings.width/2, settings.y + settings.height/2, settings.width/2, 0, 2 * Math.PI);
//           ctx.stroke();
//         } else {
//           ctx.strokeRect(settings.x, settings.y, settings.width, settings.height);
//         }
//       }
//       ctx.restore();
//     };
//     logo.src = logoUrl;
//   };

//   const roundRect = (ctx, x, y, w, h, r) => {
//     if (w < 2 * r) r = w / 2;
//     if (h < 2 * r) r = h / 2;
//     ctx.moveTo(x + r, y);
//     ctx.lineTo(x + w - r, y);
//     ctx.quadraticCurveTo(x + w, y, x + w, y + r);
//     ctx.lineTo(x + w, y + h - r);
//     ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
//     ctx.lineTo(x + r, y + h);
//     ctx.quadraticCurveTo(x, y + h, x, y + h - r);
//     ctx.lineTo(x, y + r);
//     ctx.quadraticCurveTo(x, y, x + r, y);
//     ctx.closePath();
//   };

//   const handleCanvasMouseDown = (e) => {
//     if (!prescriptionData.useTemplate) return;
    
//     const rect = canvasRef.current.getBoundingClientRect();
//     const scaleX = canvasRef.current.width / rect.width;
//     const scaleY = canvasRef.current.height / rect.height;
//     const mouseX = (e.clientX - rect.left) * scaleX;
//     const mouseY = (e.clientY - rect.top) * scaleY;
    
//     const fields = ['doctorName', 'qualification', 'hospitalName', 'address', 'phone', 'registrationNo', 'timing'];
    
//     for (const field of fields) {
//       const style = textStyles[field];
//       if (!style || !style.show) continue;

//       let text = getDisplayText(field);
//       if (!text) continue;

//       const tempCanvas = document.createElement('canvas');
//       const tempCtx = tempCanvas.getContext('2d');
//       let fontStyle = style.italic ? 'italic ' : '';
//       fontStyle += style.fontWeight;
//       tempCtx.font = `${fontStyle} ${style.fontSize}px ${prescriptionData.fontFamily}`;
//       const textWidth = tempCtx.measureText(text).width;
//       const textHeight = style.fontSize;

//       if (
//         mouseX >= style.x - textWidth/2 - 10 &&
//         mouseX <= style.x + textWidth/2 + 10 &&
//         mouseY >= style.y - textHeight - 5 &&
//         mouseY <= style.y + 5
//       ) {
//         setIsDragging(true);
//         setDragTarget({ type: 'text', field });
//         setDragStart({ x: mouseX - style.x, y: mouseY - style.y });
//         return;
//       }
//     }

//     if (prescriptionData.showLogo && previewImage && logoSettings.show) {
//       if (
//         mouseX >= logoSettings.x &&
//         mouseX <= logoSettings.x + logoSettings.width &&
//         mouseY >= logoSettings.y &&
//         mouseY <= logoSettings.y + logoSettings.height
//       ) {
//         setIsDragging(true);
//         setDragTarget({ type: 'logo' });
//         setDragStart({ x: mouseX - logoSettings.x, y: mouseY - logoSettings.y });
//         return;
//       }
//     }
//   };
  
//   const handleCanvasMouseMove = (e) => {
//     if (!isDragging || !dragTarget) return;
    
//     const rect = canvasRef.current.getBoundingClientRect();
//     const scaleX = canvasRef.current.width / rect.width;
//     const scaleY = canvasRef.current.height / rect.height;
//     const mouseX = (e.clientX - rect.left) * scaleX;
//     const mouseY = (e.clientY - rect.top) * scaleY;
    
//     if (dragTarget.type === 'text') {
//       updateTextPosition(dragTarget.field, mouseX - dragStart.x, mouseY - dragStart.y);
//     } else if (dragTarget.type === 'logo') {
//       updateLogoPosition(mouseX - dragStart.x, mouseY - dragStart.y);
//     }
//   };
  
//   const handleCanvasMouseUp = () => {
//     setIsDragging(false);
//     setDragTarget(null);
//   };

//   const sampleTemplates = [
//     { id: 1, name: 'Modern', image: 'https://placehold.co/800x1000/2c7da0/white?text=Modern' },
//     { id: 2, name: 'Classic', image: 'https://placehold.co/800x1000/f3f4f6/black?text=Classic' },
//     { id: 3, name: 'Professional', image: 'https://placehold.co/800x1000/1f2937/white?text=Professional' },
//     { id: 4, name: 'Minimal', image: 'https://placehold.co/800x1000/ffffff/black?text=Minimal' }
//   ];

//   const handleTemplateUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) { setErrorMessage('Template size should be less than 5MB'); return; }
//     setTemplateImage(URL.createObjectURL(file));
//     setOriginalTemplateFile(file);
//     setPrescriptionData({ ...prescriptionData, useTemplate: true });
//     setShowTemplatePicker(false);
//   };

//   const selectTemplate = (template) => {
//     setTemplateImage(template.image);
//     setOriginalTemplateFile(null);
//     setPrescriptionData({ ...prescriptionData, useTemplate: true });
//     setShowTemplatePicker(false);
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 2 * 1024 * 1024) { setErrorMessage('Logo size should be less than 2MB'); return; }
//     setPrescriptionData({ ...prescriptionData, logo: file });
//     setPreviewImage(URL.createObjectURL(file));
//   };

//   const downloadPrescription = async () => {
//     if (prescriptionData.useTemplate && canvasRef.current) {
//       const link = document.createElement('a');
//       link.download = `doctor_pad.png`;
//       link.href = canvasRef.current.toDataURL('image/png');
//       link.click();
//     } else if (prescriptionRef.current) {
//       try {
//         const canvas = await html2canvas(prescriptionRef.current, { scale: 2, backgroundColor: null, useCORS: true });
//         const link = document.createElement('a');
//         link.download = `doctor_pad.png`;
//         link.href = canvas.toDataURL('image/png');
//         link.click();
//       } catch (error) {
//         setErrorMessage('Failed to download');
//       }
//     }
//   };

//   const resizeImageToCanvasSize = async (imageFile) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       const url = URL.createObjectURL(imageFile);
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = 800;
//         canvas.height = 1000;
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0, 800, 1000);
//         canvas.toBlob(blob => { URL.revokeObjectURL(url); resolve(blob); }, 'image/png');
//       };
//       img.onerror = reject;
//       img.src = url;
//     });
//   };

//   // ✅ SIRF CREATE WALA API CALL - BAS YAHI CHANGE KiYA HAI
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');
    
//     const formData = new FormData();
//     formData.append('doctorName', prescriptionData.doctorName || '');
//     formData.append('qualification', prescriptionData.qualification || '');
//     formData.append('hospitalName', prescriptionData.hospitalName || '');
//     formData.append('address', prescriptionData.address || '');
//     formData.append('phone', prescriptionData.phone || '');
//     formData.append('registrationNo', prescriptionData.registrationNo || '');
//     formData.append('timing', prescriptionData.timing || '');
//     formData.append('textStyles', JSON.stringify(textStyles));
//     formData.append('logoSettings', JSON.stringify(logoSettings));
//     formData.append('useTemplate', prescriptionData.useTemplate ? 'true' : 'false');
//     formData.append('language', language);
//     formData.append('design', JSON.stringify({
//       backgroundColor: prescriptionData.backgroundColor,
//       textColor: prescriptionData.textColor,
//       accentColor: prescriptionData.accentColor,
//       fontFamily: prescriptionData.fontFamily,
//       fontSize: prescriptionData.fontSize,
//       showLogo: prescriptionData.showLogo,
//       roundedCorners: prescriptionData.roundedCorners,
//       shadow: prescriptionData.shadow,
//       border: prescriptionData.border
//     }));
    
//     if (prescriptionData.logo) formData.append('logo', prescriptionData.logo);
    
//     let templateBlob = null;
//     if (originalTemplateFile) {
//       templateBlob = await resizeImageToCanvasSize(originalTemplateFile);
//     } else if (templateImage && prescriptionData.useTemplate) {
//       const response = await fetch(templateImage);
//       const blob = await response.blob();
//       const file = new File([blob], 'template.png', { type: 'image/png' });
//       templateBlob = await resizeImageToCanvasSize(file);
//     }
//     if (templateBlob) formData.append('templateImage', templateBlob, 'template.png');
    
//     let finalImageBlob = null;
//     if (prescriptionData.useTemplate && canvasRef.current && templateImage) {
//       try {
//         finalImageBlob = await new Promise(resolve => canvasRef.current.toBlob(resolve, 'image/png'));
//       } catch (err) {
//         console.error('Error capturing canvas:', err);
//       }
//     } else if (prescriptionRef.current) {
//       try {
//         const canvas = await html2canvas(prescriptionRef.current, { scale: 2, backgroundColor: null, useCORS: true });
//         finalImageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
//       } catch (err) {
//         console.error('Error capturing prescription:', err);
//       }
//     }
//     if (finalImageBlob) formData.append('previewImage', finalImageBlob, 'preview.png');
    
//     try {
//       const response = await axios.post(`${API_URL}/createdoctorpad`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       if (response.data.success) {
//         setSuccessMessage(language === 'hi' ? 'डॉक्टर पैड सफलतापूर्वक बनाया गया!' : 'Doctor pad created successfully!');
//         // Reset form after successful creation
//         setTimeout(() => {
//           navigate('/prescriptions');
//         }, 2000);
//       } else {
//         setErrorMessage(response.data.message || 'Failed to create doctor pad');
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       setErrorMessage(error.response?.data?.message || error.message || 'Error creating doctor pad');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderPrescriptionPad = () => {
//     const style = {
//       backgroundColor: prescriptionData.backgroundColor,
//       color: prescriptionData.textColor,
//       fontFamily: prescriptionData.fontFamily,
//       fontSize: `${prescriptionData.fontSize}px`,
//       borderRadius: prescriptionData.roundedCorners ? '16px' : '0',
//       boxShadow: prescriptionData.shadow ? '0 20px 35px -10px rgba(0,0,0,0.2)' : 'none',
//       border: prescriptionData.border ? `1px solid ${prescriptionData.accentColor}20` : 'none',
//       width: '800px',
//       margin: '0 auto',
//       position: 'relative',
//       overflow: 'hidden',
//       padding: '40px',
//       minHeight: '600px',
//       textAlign: 'center'
//     };
    
//     return (
//       <div ref={prescriptionRef} style={style}>
//         {prescriptionData.showLogo && previewImage && logoSettings.show && (
//           <img src={previewImage} alt="Logo" style={{ 
//             width: `${logoSettings.width}px`, height: `${logoSettings.height}px`,
//             objectFit: 'contain', ...getLogoShapeStyle(),
//             border: logoSettings.borderWidth > 0 ? `${logoSettings.borderWidth}px solid ${logoSettings.borderColor}` : 'none',
//             marginBottom: '20px'
//           }} />
//         )}
//         <h2 style={{ color: prescriptionData.accentColor, fontSize: '28px', marginBottom: '10px' }}>{getDisplayText('doctorName')}</h2>
//         <p style={{ fontSize: '16px', marginBottom: '10px' }}>{getDisplayText('qualification')}</p>
//         <h3 style={{ color: prescriptionData.accentColor, fontSize: '22px', marginBottom: '15px' }}>{getDisplayText('hospitalName')}</h3>
//         <p style={{ fontSize: '13px', marginBottom: '5px' }}>{getDisplayText('address')}</p>
//         <p style={{ fontSize: '13px', marginBottom: '5px' }}>📞 {getDisplayText('phone')}</p>
//         <p style={{ fontSize: '12px', marginBottom: '3px' }}>Reg No: {getDisplayText('registrationNo')}</p>
//         <p style={{ fontSize: '12px', marginBottom: '3px' }}>⏰ {getDisplayText('timing')}</p>
//       </div>
//     );
//   };

//   const doctorFields = [
//     { value: 'doctorName', label: 'Doctor Name', icon: <FaUserMd /> },
//     { value: 'qualification', label: 'Qualification', icon: <FaGraduationCap /> },
//     { value: 'hospitalName', label: 'Hospital Name', icon: <FaHospital /> },
//     { value: 'address', label: 'Address', icon: <FaMapMarkerAlt /> },
//     { value: 'phone', label: 'Phone', icon: <FaPhone /> },
//     { value: 'registrationNo', label: 'Registration No', icon: <FaRegIdCard /> },
//     { value: 'timing', label: 'Timing', icon: <FaClock /> }
//   ];

//   return (
//     <Container fluid className="my-5">
//       <Row>
//         <Col md={6}>
//           <Card className="shadow-lg border-0">
//             <CardBody className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <CardTitle tag="h3" className="text-primary mb-0"><FaUserMd className="me-2" />Doctor Prescription Pad</CardTitle>
//                 <div>
//                   <Button color={language === 'en' ? 'primary' : 'secondary'} size="sm" onClick={() => setLanguage('en')} className="me-2">
//                     <FaLanguage /> English
//                   </Button>
//                   <Button color={language === 'hi' ? 'primary' : 'secondary'} size="sm" onClick={() => setLanguage('hi')}>
//                     <FaLanguage /> हिंदी
//                   </Button>
//                 </div>
//               </div>

//               {errorMessage && <Alert color="danger" toggle={() => setErrorMessage('')}>{errorMessage}</Alert>}
//               {successMessage && <Alert color="success" toggle={() => setSuccessMessage('')}>{successMessage}</Alert>}

//               <div className="mb-4 p-3 border rounded bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <Label className="fw-bold mb-0"><FaImages className="me-2" />Background Template</Label>
//                   <Button size="sm" color="primary" onClick={() => setShowTemplatePicker(!showTemplatePicker)}>
//                     {prescriptionData.useTemplate ? 'Change Template' : 'Upload Template'}
//                   </Button>
//                 </div>
//                 {showTemplatePicker && (
//                   <div className="mt-2">
//                     <Button size="sm" color="secondary" onClick={() => templateInputRef.current.click()} className="w-100 mb-2">
//                       <FaCloudUploadAlt /> Upload Custom Template
//                     </Button>
//                     <input ref={templateInputRef} type="file" hidden onChange={handleTemplateUpload} accept="image/*" />
//                     <div className="row">
//                       {sampleTemplates.map(template => (
//                         <div key={template.id} className="col-6 col-md-3 mb-2">
//                           <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate(template)}>
//                             <img src={template.image} alt={template.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
//                             <small>{template.name}</small>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {prescriptionData.useTemplate && templateImage && (
//                   <Alert color="success" className="mt-2 mb-0">
//                     <FaCheckCircle className="me-1" /> Template loaded! Click and drag ANY element to reposition.
//                   </Alert>
//                 )}
//               </div>

//               <Nav tabs className="mb-3">
//                 <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}><FaUserMd /> Doctor Info</NavLink></NavItem>
//                 <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><FaPalette /> Text Style</NavLink></NavItem>
//                 <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><FaImages /> Logo</NavLink></NavItem>
//               </Nav>

//               <Form onSubmit={handleSubmit}>
//                 <TabContent activeTab={activeTab}>
//                   <TabPane tabId="1">
//                     {doctorFields.map(field => (
//                       <FormGroup key={field.value}>
//                         <Label><span className="me-2">{field.icon}</span>{field.label}</Label>
//                         <Input 
//                           value={prescriptionData[field.value]} 
//                           onChange={(e) => {
//                             setPrescriptionData({...prescriptionData, [field.value]: e.target.value});
//                             if (language === 'hi') setHindiTranslations({...hindiTranslations, [field.value]: e.target.value});
//                           }} 
//                         />
//                       </FormGroup>
//                     ))}
//                   </TabPane>

//                   <TabPane tabId="2">
//                     <FormGroup>
//                       <Label>Select Field to Style</Label>
//                       <Input type="select" value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
//                         {doctorFields.map(field => (
//                           <option key={field.value} value={field.value}>{field.label}</option>
//                         ))}
//                       </Input>
//                     </FormGroup>
//                     {selectedElement && textStyles[selectedElement] && (
//                       <>
//                         <Row>
//                           <Col xs={6}><FormGroup><Label><FaFont /> Font Size (px)</Label><Input type="number" value={textStyles[selectedElement]?.fontSize || 12} onChange={(e) => updateTextStyle(selectedElement, 'fontSize', parseInt(e.target.value))} /></FormGroup></Col>
//                           <Col xs={6}><FormGroup><Label><FaFillDrip /> Color</Label><Input type="color" value={textStyles[selectedElement]?.color || '#000000'} onChange={(e) => updateTextStyle(selectedElement, 'color', e.target.value)} /></FormGroup></Col>
//                         </Row>
//                         <Row>
//                           <Col xs={6}><FormGroup><Label><FaBold /> Font Weight</Label><Input type="select" value={textStyles[selectedElement]?.fontWeight || 'normal'} onChange={(e) => updateTextStyle(selectedElement, 'fontWeight', e.target.value)}><option value="normal">Normal</option><option value="bold">Bold</option></Input></FormGroup></Col>
//                           <Col xs={6}><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={textStyles[selectedElement]?.italic || false} onChange={(e) => updateTextStyle(selectedElement, 'italic', e.target.checked)} /><span className="ms-2"><FaItalic /> Italic</span></Label></FormGroup></Col>
//                         </Row>
//                         <FormGroup check><Label check><Input type="checkbox" checked={textStyles[selectedElement]?.underline || false} onChange={(e) => updateTextStyle(selectedElement, 'underline', e.target.checked)} /><span className="ms-2"><FaUnderline /> Underline</span></Label></FormGroup>
//                         {prescriptionData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />Click and drag this element on preview to reposition</Alert>}
//                       </>
//                     )}
//                     <hr />
//                     <h6 className="mt-3">Pad Design</h6>
//                     <Row>
//                       <Col xs={6}><FormGroup><Label>Background Color</Label><Input type="color" value={prescriptionData.backgroundColor} onChange={(e) => setPrescriptionData({...prescriptionData, backgroundColor: e.target.value})} /></FormGroup></Col>
//                       <Col xs={6}><FormGroup><Label>Text Color</Label><Input type="color" value={prescriptionData.textColor} onChange={(e) => setPrescriptionData({...prescriptionData, textColor: e.target.value})} /></FormGroup></Col>
//                       <Col xs={6}><FormGroup><Label>Accent Color</Label><Input type="color" value={prescriptionData.accentColor} onChange={(e) => setPrescriptionData({...prescriptionData, accentColor: e.target.value})} /></FormGroup></Col>
//                       <Col xs={6}><FormGroup><Label>Font Family</Label><Input type="select" value={prescriptionData.fontFamily} onChange={(e) => setPrescriptionData({...prescriptionData, fontFamily: e.target.value})}><option>Poppins</option><option>Arial</option><option>Georgia</option><option>Times New Roman</option></Input></FormGroup></Col>
//                     </Row>
//                     <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.roundedCorners} onChange={(e) => setPrescriptionData({...prescriptionData, roundedCorners: e.target.checked})} /><span className="ms-2">Rounded Corners</span></Label></FormGroup>
//                     <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.shadow} onChange={(e) => setPrescriptionData({...prescriptionData, shadow: e.target.checked})} /><span className="ms-2">Show Shadow</span></Label></FormGroup>
//                     <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.border} onChange={(e) => setPrescriptionData({...prescriptionData, border: e.target.checked})} /><span className="ms-2">Show Border</span></Label></FormGroup>
//                   </TabPane>

//                   <TabPane tabId="3">
//                     <FormGroup>
//                       <Label>Logo Image</Label>
//                       <div className="border rounded p-3 text-center" onClick={() => logoInputRef.current.click()} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
//                         {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p>Upload Logo</p></>}
//                       </div>
//                       <input ref={logoInputRef} type="file" hidden onChange={handleLogoChange} accept="image/*" />
//                     </FormGroup>
//                     <FormGroup check>
//                       <Label check><Input type="checkbox" checked={prescriptionData.showLogo} onChange={(e) => setPrescriptionData({...prescriptionData, showLogo: e.target.checked})} /><span className="ms-2">Show Logo on Pad</span></Label>
//                     </FormGroup>
//                     {prescriptionData.showLogo && previewImage && (
//                       <>
//                         <h6 className="mt-3">Logo Customization</h6>
//                         <Row>
//                           <Col xs={6}><FormGroup><Label>Width (px)</Label><Input type="number" value={logoSettings.width} onChange={(e) => updateLogoSize(parseInt(e.target.value), logoSettings.height)} /></FormGroup></Col>
//                           <Col xs={6}><FormGroup><Label>Height (px)</Label><Input type="number" value={logoSettings.height} onChange={(e) => updateLogoSize(logoSettings.width, parseInt(e.target.value))} /></FormGroup></Col>
//                         </Row>
//                         <FormGroup>
//                           <Label>Logo Shape</Label>
//                           <div className="d-flex gap-3">
//                             <Button size="sm" color={logoSettings.shape === 'rectangle' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rectangle'})}><FaSquare /> Rectangle</Button>
//                             <Button size="sm" color={logoSettings.shape === 'rounded' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rounded'})}><FaSquare /> Rounded</Button>
//                             <Button size="sm" color={logoSettings.shape === 'circle' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'circle'})}><FaRegCircle /> Circle</Button>
//                           </div>
//                         </FormGroup>
//                         <Row>
//                           <Col xs={6}><FormGroup><Label>Border Width (px)</Label><Input type="number" value={logoSettings.borderWidth} onChange={(e) => setLogoSettings({...logoSettings, borderWidth: parseInt(e.target.value)})} /></FormGroup></Col>
//                           {logoSettings.borderWidth > 0 && (
//                             <Col xs={6}><FormGroup><Label>Border Color</Label><Input type="color" value={logoSettings.borderColor} onChange={(e) => setLogoSettings({...logoSettings, borderColor: e.target.value})} /></FormGroup></Col>
//                           )}
//                         </Row>
//                         {prescriptionData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />Click and drag logo on preview to reposition</Alert>}
//                       </>
//                     )}
//                   </TabPane>
//                 </TabContent>

//                 <div className="d-flex justify-content-end gap-2 mt-4">
//                   <Button color="secondary" onClick={() => navigate('/prescriptions')}>Cancel</Button>
//                   <Button color="primary" type="submit" disabled={loading}>
//                     {loading ? <><FaSpinner className="spinner-border-sm me-1" /> Creating...</> : <><FaSave /> Create Pad</>}
//                   </Button>
//                 </div>
//               </Form>
//             </CardBody>
//           </Card>
//         </Col>

//         <Col md={6}>
//           <Card className="shadow-lg border-0 sticky-top" style={{ top: '20px' }}>
//             <CardBody className="p-4">
//               <CardTitle tag="h4" className="text-center mb-3">
//                 Live Preview
//                 {prescriptionData.useTemplate && <small className="d-block text-muted"><FaMousePointer /> Click and drag ANY element to reposition</small>}
//               </CardTitle>
//               <div className="preview-container" style={{ maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
//                 {prescriptionData.useTemplate && templateImage ? (
//                   <canvas
//                     ref={canvasRef}
//                     style={{ width: '100%', height: 'auto', border: '1px solid #ddd', cursor: isDragging ? 'grabbing' : 'grab' }}
//                     width="800"
//                     height="1000"
//                     onMouseDown={handleCanvasMouseDown}
//                     onMouseMove={handleCanvasMouseMove}
//                     onMouseUp={handleCanvasMouseUp}
//                     onMouseLeave={handleCanvasMouseUp}
//                   />
//                 ) : renderPrescriptionPad()}
//               </div>
//               <div className="d-flex gap-2 mt-3">
//                 <Button color="success" onClick={downloadPrescription} className="flex-grow-1"><FaDownload /> Download Pad</Button>
//                 <Button color="info" onClick={() => setShowFullPreview(true)} className="flex-grow-1"><FaEye /> Full Preview</Button>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>

//       {showFullPreview && (
//         <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content bg-transparent border-0">
//               <div className="modal-body text-center">
//                 {prescriptionData.useTemplate && templateImage
//                   ? <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} width="800" height="1000" />
//                   : renderPrescriptionPad()
//                 }
//                 <div className="mt-3">
//                   <Button color="success" onClick={downloadPrescription}><FaDownload /> Download</Button>
//                   <Button color="secondary" className="ms-2" onClick={() => setShowFullPreview(false)}>Close</Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default DoctorPrescriptionCreator;


// // DoctorPrescriptionCreator.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Container, Form, FormGroup, Label, Input, Button, Card, CardBody,
//   CardTitle, Alert, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink
// } from 'reactstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { 
//   FaCloudUploadAlt, FaSpinner, FaEye, FaSave, FaMousePointer, FaDownload,
//   FaUserMd, FaHospital, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaLanguage,
//   FaPalette, FaFont, FaImages, FaCheckCircle, FaArrowsAlt, FaFillDrip,
//   FaBold, FaItalic, FaUnderline, FaSquare, FaRegCircle, FaRegIdCard, FaClock,
//   FaRulerCombined
// } from 'react-icons/fa';
// import html2canvas from 'html2canvas';

// const API_URL = 'https://designback.onrender.com/api/admin';

// const DoctorPrescriptionCreator = () => {
//   const [activeTab, setActiveTab] = useState('1');
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [language, setLanguage] = useState('en');
  
//   const [templateImage, setTemplateImage] = useState(null);
//   const [originalTemplateFile, setOriginalTemplateFile] = useState(null);
//   const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  
//   // Frame size options for prescription pad
//   const frameSizes = {
//     a4: { name: 'A4', width: 800, height: 1131, aspectRatio: 1/1.414 },
//     letter: { name: 'Letter', width: 800, height: 1035, aspectRatio: 8.5/11 },
//     legal: { name: 'Legal', width: 800, height: 1200, aspectRatio: 8.5/14 },
//     square: { name: 'Square', width: 800, height: 800, aspectRatio: 1/1 },
//     custom: { name: 'Custom', width: 800, height: 1000, aspectRatio: 4/5 }
//   };
  
//   const [selectedFrame, setSelectedFrame] = useState('a4');
//   const [customSize, setCustomSize] = useState({ width: 800, height: 1000 });
  
//   const [logoSettings, setLogoSettings] = useState({
//     x: 400, y: 80, width: 80, height: 80, borderRadius: 8,
//     borderWidth: 0, borderColor: '#000000', shape: 'circle', show: true
//   });
  
//   const [hindiTranslations, setHindiTranslations] = useState({
//     doctorName: 'डॉ. राजेश कुमार',
//     qualification: 'एमबीबीएस, एमडी',
//     hospitalName: 'सिटी केयर हॉस्पिटल',
//     address: '123, मेन रोड, नई दिल्ली - 110001',
//     phone: '+91 98765 43210',
//     registrationNo: 'एमसी-12345',
//     timing: 'सुबह 10:00 - शाम 6:00'
//   });
  
//   const [prescriptionData, setPrescriptionData] = useState({
//     doctorName: 'Dr. Rajesh Kumar',
//     qualification: 'MBBS, MD',
//     hospitalName: 'City Care Hospital',
//     address: '123, Main Road, New Delhi - 110001',
//     phone: '+91 98765 43210',
//     registrationNo: 'MC-12345',
//     timing: '10:00 AM - 6:00 PM',
//     logo: null,
//     backgroundColor: '#ffffff',
//     textColor: '#000000',
//     accentColor: '#2c7da0',
//     fontFamily: 'Poppins',
//     fontSize: '12',
//     showLogo: true,
//     roundedCorners: true,
//     shadow: true,
//     border: true,
//     useTemplate: false
//   });
  
//   const [textStyles, setTextStyles] = useState({
//     doctorName:    { fontSize: 28, fontWeight: 'bold',   color: '#2c7da0', italic: false, underline: false, x: 400, y: 180, show: true },
//     qualification: { fontSize: 16, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 220, show: true },
//     hospitalName:  { fontSize: 22, fontWeight: 'bold',   color: '#2c7da0', italic: false, underline: false, x: 400, y: 260, show: true },
//     address:       { fontSize: 13, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 300, show: true },
//     phone:         { fontSize: 13, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 330, show: true },
//     registrationNo: { fontSize: 12, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 360, show: true },
//     timing:        { fontSize: 12, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 390, show: true }
//   });
  
//   const [previewImage, setPreviewImage] = useState(null);
//   const [showFullPreview, setShowFullPreview] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragTarget, setDragTarget] = useState(null);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [selectedElement, setSelectedElement] = useState('doctorName');
  
//   const logoInputRef = useRef(null);
//   const templateInputRef = useRef(null);
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//   const prescriptionRef = useRef(null);

//   // Get current canvas dimensions
//   const getCurrentDimensions = () => {
//     if (selectedFrame === 'custom') {
//       return { width: customSize.width, height: customSize.height };
//     }
//     const frame = frameSizes[selectedFrame];
//     return { width: frame.width, height: frame.height };
//   };

//   const getDisplayText = (field) => {
//     if (language === 'hi') return hindiTranslations[field];
//     return prescriptionData[field];
//   };

//   const updateTextStyle = (field, styleName, value) => {
//     setTextStyles(prev => ({
//       ...prev,
//       [field]: { ...prev[field], [styleName]: value }
//     }));
//   };

//   const updateTextPosition = (field, x, y) => {
//     setTextStyles(prev => ({
//       ...prev,
//       [field]: { ...prev[field], x, y }
//     }));
//   };

//   const updateLogoPosition = (x, y) => {
//     setLogoSettings(prev => ({ ...prev, x, y }));
//   };

//   const updateLogoSize = (width, height) => {
//     setLogoSettings(prev => ({ ...prev, width, height }));
//   };

//   const getLogoShapeStyle = () => {
//     if (logoSettings.shape === 'circle') return { borderRadius: '50%' };
//     if (logoSettings.shape === 'rounded') return { borderRadius: `${logoSettings.borderRadius}px` };
//     return { borderRadius: '0' };
//   };

//   // Resize image to fit canvas dimensions
//   const resizeImageToCanvasSize = async (imageFile, targetWidth, targetHeight) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       const url = URL.createObjectURL(imageFile);
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         canvas.width = targetWidth;
//         canvas.height = targetHeight;
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
//         canvas.toBlob(blob => {
//           URL.revokeObjectURL(url);
//           resolve(blob);
//         }, 'image/png');
//       };
//       img.onerror = reject;
//       img.src = url;
//     });
//   };

//   useEffect(() => {
//     if (prescriptionData.useTemplate && templateImage && canvasRef.current) {
//       drawCanvasWithOverlays(true);
//     }
//   }, [templateImage, prescriptionData, textStyles, previewImage, logoSettings, language, selectedFrame, customSize]);

//   const drawCanvasWithOverlays = (withOverlays = true) => {
//     if (!canvasRef.current || !templateImage) return;
    
//     const dimensions = getCurrentDimensions();
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const img = new Image();
    
//     img.crossOrigin = 'Anonymous';
//     img.onload = () => {
//       canvas.width = dimensions.width;
//       canvas.height = dimensions.height;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
//       if (withOverlays) {
//         const fields = ['doctorName', 'qualification', 'hospitalName', 'address', 'phone', 'registrationNo', 'timing'];
//         for (const field of fields) {
//           if (textStyles[field]?.show) {
//             const displayText = getDisplayText(field);
//             if (displayText) drawText(ctx, displayText, textStyles[field], prescriptionData.fontFamily);
//           }
//         }
//         if (prescriptionData.showLogo && previewImage && logoSettings.show) {
//           drawLogo(ctx, previewImage, logoSettings);
//         }
//       }
//     };
//     img.src = templateImage;
//   };

//   const drawText = (ctx, text, style, fontFamily) => {
//     if (!text) return;
//     let fontStyle = '';
//     if (style.italic) fontStyle += 'italic ';
//     fontStyle += style.fontWeight;

//     ctx.save();
//     ctx.font = `${fontStyle} ${style.fontSize}px ${fontFamily}`;
//     ctx.fillStyle = style.color;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'alphabetic';

//     ctx.fillText(text, style.x, style.y);
    
//     if (style.underline) {
//       const metrics = ctx.measureText(text);
//       ctx.beginPath();
//       ctx.moveTo(style.x - metrics.width/2, style.y + 2);
//       ctx.lineTo(style.x + metrics.width/2, style.y + 2);
//       ctx.strokeStyle = style.color;
//       ctx.lineWidth = 1;
//       ctx.stroke();
//     }
//     ctx.restore();
//   };

//   const drawLogo = (ctx, logoUrl, settings) => {
//     const logo = new Image();
//     logo.crossOrigin = 'Anonymous';
//     logo.onload = () => {
//       ctx.save();

//       if (settings.shape === 'circle') {
//         ctx.beginPath();
//         ctx.arc(settings.x + settings.width/2, settings.y + settings.height/2, settings.width/2, 0, 2 * Math.PI);
//         ctx.clip();
//       } else if (settings.shape === 'rounded') {
//         ctx.beginPath();
//         roundRect(ctx, settings.x, settings.y, settings.width, settings.height, settings.borderRadius);
//         ctx.clip();
//       }

//       ctx.drawImage(logo, settings.x, settings.y, settings.width, settings.height);

//       if (settings.borderWidth > 0) {
//         ctx.strokeStyle = settings.borderColor;
//         ctx.lineWidth = settings.borderWidth;
//         if (settings.shape === 'circle') {
//           ctx.beginPath();
//           ctx.arc(settings.x + settings.width/2, settings.y + settings.height/2, settings.width/2, 0, 2 * Math.PI);
//           ctx.stroke();
//         } else {
//           ctx.strokeRect(settings.x, settings.y, settings.width, settings.height);
//         }
//       }
//       ctx.restore();
//     };
//     logo.src = logoUrl;
//   };

//   const roundRect = (ctx, x, y, w, h, r) => {
//     if (w < 2 * r) r = w / 2;
//     if (h < 2 * r) r = h / 2;
//     ctx.moveTo(x + r, y);
//     ctx.lineTo(x + w - r, y);
//     ctx.quadraticCurveTo(x + w, y, x + w, y + r);
//     ctx.lineTo(x + w, y + h - r);
//     ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
//     ctx.lineTo(x + r, y + h);
//     ctx.quadraticCurveTo(x, y + h, x, y + h - r);
//     ctx.lineTo(x, y + r);
//     ctx.quadraticCurveTo(x, y, x + r, y);
//     ctx.closePath();
//   };

//   const handleCanvasMouseDown = (e) => {
//     if (!prescriptionData.useTemplate) return;
    
//     const rect = canvasRef.current.getBoundingClientRect();
//     const scaleX = canvasRef.current.width / rect.width;
//     const scaleY = canvasRef.current.height / rect.height;
//     const mouseX = (e.clientX - rect.left) * scaleX;
//     const mouseY = (e.clientY - rect.top) * scaleY;
    
//     const fields = ['doctorName', 'qualification', 'hospitalName', 'address', 'phone', 'registrationNo', 'timing'];
    
//     for (const field of fields) {
//       const style = textStyles[field];
//       if (!style || !style.show) continue;

//       let text = getDisplayText(field);
//       if (!text) continue;

//       const tempCanvas = document.createElement('canvas');
//       const tempCtx = tempCanvas.getContext('2d');
//       let fontStyle = style.italic ? 'italic ' : '';
//       fontStyle += style.fontWeight;
//       tempCtx.font = `${fontStyle} ${style.fontSize}px ${prescriptionData.fontFamily}`;
//       const textWidth = tempCtx.measureText(text).width;
//       const textHeight = style.fontSize;

//       if (
//         mouseX >= style.x - textWidth/2 - 10 &&
//         mouseX <= style.x + textWidth/2 + 10 &&
//         mouseY >= style.y - textHeight - 5 &&
//         mouseY <= style.y + 5
//       ) {
//         setIsDragging(true);
//         setDragTarget({ type: 'text', field });
//         setDragStart({ x: mouseX - style.x, y: mouseY - style.y });
//         return;
//       }
//     }

//     if (prescriptionData.showLogo && previewImage && logoSettings.show) {
//       if (
//         mouseX >= logoSettings.x &&
//         mouseX <= logoSettings.x + logoSettings.width &&
//         mouseY >= logoSettings.y &&
//         mouseY <= logoSettings.y + logoSettings.height
//       ) {
//         setIsDragging(true);
//         setDragTarget({ type: 'logo' });
//         setDragStart({ x: mouseX - logoSettings.x, y: mouseY - logoSettings.y });
//         return;
//       }
//     }
//   };
  
//   const handleCanvasMouseMove = (e) => {
//     if (!isDragging || !dragTarget) return;
    
//     const rect = canvasRef.current.getBoundingClientRect();
//     const scaleX = canvasRef.current.width / rect.width;
//     const scaleY = canvasRef.current.height / rect.height;
//     const mouseX = (e.clientX - rect.left) * scaleX;
//     const mouseY = (e.clientY - rect.top) * scaleY;
    
//     if (dragTarget.type === 'text') {
//       updateTextPosition(dragTarget.field, mouseX - dragStart.x, mouseY - dragStart.y);
//     } else if (dragTarget.type === 'logo') {
//       updateLogoPosition(mouseX - dragStart.x, mouseY - dragStart.y);
//     }
//   };
  
//   const handleCanvasMouseUp = () => {
//     setIsDragging(false);
//     setDragTarget(null);
//   };

//   const handleFrameChange = async (frameId) => {
//     setSelectedFrame(frameId);
    
//     const oldDimensions = getCurrentDimensions();
//     const dimensions = frameId === 'custom' ? customSize : frameSizes[frameId];
    
//     // Calculate scale factors
//     const scaleX = dimensions.width / oldDimensions.width;
//     const scaleY = dimensions.height / oldDimensions.height;
    
//     // Adjust text positions and font sizes proportionally
//     const newTextStyles = {};
//     Object.keys(textStyles).forEach(key => {
//       newTextStyles[key] = {
//         ...textStyles[key],
//         x: textStyles[key].x * scaleX,
//         y: textStyles[key].y * scaleY,
//         fontSize: textStyles[key].fontSize * Math.min(scaleX, scaleY)
//       };
//     });
//     setTextStyles(newTextStyles);
    
//     // Adjust logo position and size
//     setLogoSettings(prev => ({
//       ...prev,
//       x: prev.x * scaleX,
//       y: prev.y * scaleY,
//       width: prev.width * scaleX,
//       height: prev.height * scaleY
//     }));
    
//     // If template is loaded, resize it
//     if (templateImage && originalTemplateFile) {
//       const resizedBlob = await resizeImageToCanvasSize(originalTemplateFile, dimensions.width, dimensions.height);
//       const resizedUrl = URL.createObjectURL(resizedBlob);
//       setTemplateImage(resizedUrl);
//       setOriginalTemplateFile(new File([resizedBlob], 'template.png', { type: 'image/png' }));
//     }
//   };

//   const sampleTemplates = [
//     { id: 1, name: 'Modern', image: 'https://placehold.co/800x1131/2c7da0/white?text=Modern' },
//     { id: 2, name: 'Classic', image: 'https://placehold.co/800x1131/f3f4f6/black?text=Classic' },
//     { id: 3, name: 'Professional', image: 'https://placehold.co/800x1131/1f2937/white?text=Professional' },
//     { id: 4, name: 'Minimal', image: 'https://placehold.co/800x1131/ffffff/black?text=Minimal' }
//   ];

//   const handleTemplateUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) { 
//       setErrorMessage(language === 'hi' ? 'टेम्पलेट का आकार 5MB से कम होना चाहिए' : 'Template size should be less than 5MB'); 
//       return; 
//     }
    
//     const dimensions = getCurrentDimensions();
//     const resizedBlob = await resizeImageToCanvasSize(file, dimensions.width, dimensions.height);
//     const resizedUrl = URL.createObjectURL(resizedBlob);
    
//     setTemplateImage(resizedUrl);
//     setOriginalTemplateFile(new File([resizedBlob], file.name, { type: 'image/png' }));
//     setPrescriptionData({ ...prescriptionData, useTemplate: true });
//     setShowTemplatePicker(false);
//   };

//   const selectTemplate = async (template) => {
//     const response = await fetch(template.image);
//     const blob = await response.blob();
//     const dimensions = getCurrentDimensions();
//     const resizedBlob = await resizeImageToCanvasSize(blob, dimensions.width, dimensions.height);
//     const resizedUrl = URL.createObjectURL(resizedBlob);
    
//     setTemplateImage(resizedUrl);
//     setOriginalTemplateFile(new File([resizedBlob], 'template.png', { type: 'image/png' }));
//     setPrescriptionData({ ...prescriptionData, useTemplate: true });
//     setShowTemplatePicker(false);
//   };

//   const handleLogoChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 2 * 1024 * 1024) { 
//       setErrorMessage(language === 'hi' ? 'लोगो का आकार 2MB से कम होना चाहिए' : 'Logo size should be less than 2MB'); 
//       return; 
//     }
    
//     setPrescriptionData({ ...prescriptionData, logo: file });
//     setPreviewImage(URL.createObjectURL(file));
//   };

//   const downloadPrescription = async () => {
//     if (prescriptionData.useTemplate && canvasRef.current) {
//       const link = document.createElement('a');
//       link.download = `doctor_pad.png`;
//       link.href = canvasRef.current.toDataURL('image/png');
//       link.click();
//     } else if (prescriptionRef.current) {
//       try {
//         const canvas = await html2canvas(prescriptionRef.current, { scale: 2, backgroundColor: null, useCORS: true });
//         const link = document.createElement('a');
//         link.download = `doctor_pad.png`;
//         link.href = canvas.toDataURL('image/png');
//         link.click();
//       } catch (error) {
//         setErrorMessage(language === 'hi' ? 'डाउनलोड करने में विफल' : 'Failed to download');
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');
    
//     const dimensions = getCurrentDimensions();
//     const formData = new FormData();
//     formData.append('doctorName', prescriptionData.doctorName || '');
//     formData.append('qualification', prescriptionData.qualification || '');
//     formData.append('hospitalName', prescriptionData.hospitalName || '');
//     formData.append('address', prescriptionData.address || '');
//     formData.append('phone', prescriptionData.phone || '');
//     formData.append('registrationNo', prescriptionData.registrationNo || '');
//     formData.append('timing', prescriptionData.timing || '');
//     formData.append('textStyles', JSON.stringify(textStyles));
//     formData.append('logoSettings', JSON.stringify(logoSettings));
//     formData.append('useTemplate', prescriptionData.useTemplate ? 'true' : 'false');
//     formData.append('language', language);
//     formData.append('frameSize', JSON.stringify(dimensions));
//     formData.append('design', JSON.stringify({
//       backgroundColor: prescriptionData.backgroundColor,
//       textColor: prescriptionData.textColor,
//       accentColor: prescriptionData.accentColor,
//       fontFamily: prescriptionData.fontFamily,
//       fontSize: prescriptionData.fontSize,
//       showLogo: prescriptionData.showLogo,
//       roundedCorners: prescriptionData.roundedCorners,
//       shadow: prescriptionData.shadow,
//       border: prescriptionData.border
//     }));
    
//     if (prescriptionData.logo) formData.append('logo', prescriptionData.logo);
    
//     let templateBlob = null;
//     if (originalTemplateFile) {
//       templateBlob = await resizeImageToCanvasSize(originalTemplateFile, dimensions.width, dimensions.height);
//     } else if (templateImage && prescriptionData.useTemplate) {
//       const response = await fetch(templateImage);
//       const blob = await response.blob();
//       const file = new File([blob], 'template.png', { type: 'image/png' });
//       templateBlob = await resizeImageToCanvasSize(file, dimensions.width, dimensions.height);
//     }
//     if (templateBlob) formData.append('templateImage', templateBlob, 'template.png');
    
//     let finalImageBlob = null;
//     if (prescriptionData.useTemplate && canvasRef.current && templateImage) {
//       try {
//         finalImageBlob = await new Promise(resolve => canvasRef.current.toBlob(resolve, 'image/png'));
//       } catch (err) {
//         console.error('Error capturing canvas:', err);
//       }
//     } else if (prescriptionRef.current) {
//       try {
//         const canvas = await html2canvas(prescriptionRef.current, { scale: 2, backgroundColor: null, useCORS: true });
//         finalImageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
//       } catch (err) {
//         console.error('Error capturing prescription:', err);
//       }
//     }
//     if (finalImageBlob) formData.append('previewImage', finalImageBlob, 'preview.png');
    
//     try {
//       const response = await axios.post(`${API_URL}/createdoctorpad`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       if (response.data.success) {
//         setSuccessMessage(language === 'hi' ? 'डॉक्टर पैड सफलतापूर्वक बनाया गया!' : 'Doctor pad created successfully!');
//         setTimeout(() => {
//           navigate('/prescriptions');
//         }, 2000);
//       } else {
//         setErrorMessage(response.data.message || 'Failed to create doctor pad');
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       setErrorMessage(error.response?.data?.message || error.message || 'Error creating doctor pad');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderPrescriptionPad = () => {
//     const dimensions = getCurrentDimensions();
//     const style = {
//       backgroundColor: prescriptionData.backgroundColor,
//       color: prescriptionData.textColor,
//       fontFamily: prescriptionData.fontFamily,
//       fontSize: `${prescriptionData.fontSize}px`,
//       borderRadius: prescriptionData.roundedCorners ? '16px' : '0',
//       boxShadow: prescriptionData.shadow ? '0 20px 35px -10px rgba(0,0,0,0.2)' : 'none',
//       border: prescriptionData.border ? `1px solid ${prescriptionData.accentColor}20` : 'none',
//       width: `${dimensions.width}px`,
//       height: `${dimensions.height}px`,
//       margin: '0 auto',
//       position: 'relative',
//       overflow: 'hidden',
//       padding: '40px',
//       textAlign: 'center'
//     };
    
//     return (
//       <div ref={prescriptionRef} style={style}>
//         {prescriptionData.showLogo && previewImage && logoSettings.show && (
//           <img src={previewImage} alt="Logo" style={{ 
//             width: `${logoSettings.width}px`, height: `${logoSettings.height}px`,
//             objectFit: 'contain', ...getLogoShapeStyle(),
//             border: logoSettings.borderWidth > 0 ? `${logoSettings.borderWidth}px solid ${logoSettings.borderColor}` : 'none',
//             marginBottom: '20px'
//           }} />
//         )}
//         <h2 style={{ color: prescriptionData.accentColor, fontSize: '28px', marginBottom: '10px' }}>{getDisplayText('doctorName')}</h2>
//         <p style={{ fontSize: '16px', marginBottom: '10px' }}>{getDisplayText('qualification')}</p>
//         <h3 style={{ color: prescriptionData.accentColor, fontSize: '22px', marginBottom: '15px' }}>{getDisplayText('hospitalName')}</h3>
//         <p style={{ fontSize: '13px', marginBottom: '5px' }}>{getDisplayText('address')}</p>
//         <p style={{ fontSize: '13px', marginBottom: '5px' }}>📞 {getDisplayText('phone')}</p>
//         <p style={{ fontSize: '12px', marginBottom: '3px' }}>Reg No: {getDisplayText('registrationNo')}</p>
//         <p style={{ fontSize: '12px', marginBottom: '3px' }}>⏰ {getDisplayText('timing')}</p>
//       </div>
//     );
//   };

//   const doctorFields = [
//     { value: 'doctorName', label: 'Doctor Name', icon: <FaUserMd /> },
//     { value: 'qualification', label: 'Qualification', icon: <FaGraduationCap /> },
//     { value: 'hospitalName', label: 'Hospital Name', icon: <FaHospital /> },
//     { value: 'address', label: 'Address', icon: <FaMapMarkerAlt /> },
//     { value: 'phone', label: 'Phone', icon: <FaPhone /> },
//     { value: 'registrationNo', label: 'Registration No', icon: <FaRegIdCard /> },
//     { value: 'timing', label: 'Timing', icon: <FaClock /> }
//   ];

//   const dimensions = getCurrentDimensions();

//   return (
//     <Container fluid className="my-5">
//       <Row>
//         <Col md={6}>
//           <Card className="shadow-lg border-0">
//             <CardBody className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <CardTitle tag="h3" className="text-primary mb-0"><FaUserMd className="me-2" />Doctor Prescription Pad</CardTitle>
//                 <div>
//                   <Button color={language === 'en' ? 'primary' : 'secondary'} size="sm" onClick={() => setLanguage('en')} className="me-2">
//                     <FaLanguage /> English
//                   </Button>
//                   <Button color={language === 'hi' ? 'primary' : 'secondary'} size="sm" onClick={() => setLanguage('hi')}>
//                     <FaLanguage /> हिंदी
//                   </Button>
//                 </div>
//               </div>

//               {errorMessage && <Alert color="danger" toggle={() => setErrorMessage('')}>{errorMessage}</Alert>}
//               {successMessage && <Alert color="success" toggle={() => setSuccessMessage('')}>{successMessage}</Alert>}

//               {/* Frame Size Selection */}
//               <div className="mb-4 p-3 border rounded bg-light">
//                 <Label className="fw-bold mb-2">
//                   <FaRulerCombined className="me-2" />
//                   {language === 'hi' ? 'पैड साइज़ चुनें' : 'Select Pad Size'}
//                 </Label>
//                 <Row>
//                   <Col xs={6} md={4} className="mb-2">
//                     <Button 
//                       color={selectedFrame === 'a4' ? 'primary' : 'outline-primary'}
//                       size="sm"
//                       onClick={() => handleFrameChange('a4')}
//                       className="w-100"
//                     >
//                       A4 (800×1131)
//                     </Button>
//                   </Col>
//                   <Col xs={6} md={4} className="mb-2">
//                     <Button 
//                       color={selectedFrame === 'letter' ? 'primary' : 'outline-primary'}
//                       size="sm"
//                       onClick={() => handleFrameChange('letter')}
//                       className="w-100"
//                     >
//                       Letter (800×1035)
//                     </Button>
//                   </Col>
//                   <Col xs={6} md={4} className="mb-2">
//                     <Button 
//                       color={selectedFrame === 'legal' ? 'primary' : 'outline-primary'}
//                       size="sm"
//                       onClick={() => handleFrameChange('legal')}
//                       className="w-100"
//                     >
//                       Legal (800×1200)
//                     </Button>
//                   </Col>
//                   <Col xs={6} md={4} className="mb-2">
//                     <Button 
//                       color={selectedFrame === 'square' ? 'primary' : 'outline-primary'}
//                       size="sm"
//                       onClick={() => handleFrameChange('square')}
//                       className="w-100"
//                     >
//                       Square (800×800)
//                     </Button>
//                   </Col>
//                   <Col xs={6} md={4} className="mb-2">
//                     <Button 
//                       color={selectedFrame === 'custom' ? 'primary' : 'outline-primary'}
//                       size="sm"
//                       onClick={() => handleFrameChange('custom')}
//                       className="w-100"
//                     >
//                       {language === 'hi' ? 'कस्टम' : 'Custom'}
//                     </Button>
//                   </Col>
//                 </Row>
                
//                 {selectedFrame === 'custom' && (
//                   <Row className="mt-2">
//                     <Col xs={6}>
//                       <Input 
//                         type="number" 
//                         placeholder={language === 'hi' ? 'चौड़ाई' : 'Width'} 
//                         value={customSize.width}
//                         onChange={(e) => {
//                           const newWidth = parseInt(e.target.value);
//                           setCustomSize({ ...customSize, width: newWidth });
//                           handleFrameChange('custom');
//                         }}
//                       />
//                     </Col>
//                     <Col xs={6}>
//                       <Input 
//                         type="number" 
//                         placeholder={language === 'hi' ? 'ऊंचाई' : 'Height'} 
//                         value={customSize.height}
//                         onChange={(e) => {
//                           const newHeight = parseInt(e.target.value);
//                           setCustomSize({ ...customSize, height: newHeight });
//                           handleFrameChange('custom');
//                         }}
//                       />
//                     </Col>
//                   </Row>
//                 )}
                
//                 <Alert color="info" className="mt-2 mb-0">
//                   <small>✓ {language === 'hi' ? 'मौजूदा साइज़:' : 'Current Size:'} {dimensions.width}×{dimensions.height}px</small>
//                 </Alert>
//               </div>

//               <div className="mb-4 p-3 border rounded bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <Label className="fw-bold mb-0"><FaImages className="me-2" />Background Template</Label>
//                   <Button size="sm" color="primary" onClick={() => setShowTemplatePicker(!showTemplatePicker)}>
//                     {prescriptionData.useTemplate ? (language === 'hi' ? 'टेम्पलेट बदलें' : 'Change Template') : (language === 'hi' ? 'टेम्पलेट अपलोड करें' : 'Upload Template')}
//                   </Button>
//                 </div>
//                 {showTemplatePicker && (
//                   <div className="mt-2">
//                     <Button size="sm" color="secondary" onClick={() => templateInputRef.current.click()} className="w-100 mb-2">
//                       <FaCloudUploadAlt /> {language === 'hi' ? 'कस्टम टेम्पलेट अपलोड करें' : 'Upload Custom Template'}
//                     </Button>
//                     <input ref={templateInputRef} type="file" hidden onChange={handleTemplateUpload} accept="image/*" />
//                     <div className="row">
//                       {sampleTemplates.map(template => (
//                         <div key={template.id} className="col-6 col-md-3 mb-2">
//                           <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate(template)}>
//                             <img src={template.image} alt={template.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
//                             <small>{template.name}</small>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {prescriptionData.useTemplate && templateImage && (
//                   <Alert color="success" className="mt-2 mb-0">
//                     <FaCheckCircle className="me-1" /> {language === 'hi' ? 'टेम्पलेट लोड हो गया! किसी भी तत्व को खींचकर पुनः स्थित करें।' : 'Template loaded! Click and drag ANY element to reposition.'}
//                   </Alert>
//                 )}
//               </div>

//               <Nav tabs className="mb-3">
//                 <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}><FaUserMd /> {language === 'hi' ? 'डॉक्टर जानकारी' : 'Doctor Info'}</NavLink></NavItem>
//                 <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><FaPalette /> {language === 'hi' ? 'टेक्स्ट स्टाइल' : 'Text Style'}</NavLink></NavItem>
//                 <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><FaImages /> {language === 'hi' ? 'लोगो' : 'Logo'}</NavLink></NavItem>
//               </Nav>

//               <Form onSubmit={handleSubmit}>
//                 <TabContent activeTab={activeTab}>
//                   <TabPane tabId="1">
//                     {doctorFields.map(field => (
//                       <FormGroup key={field.value}>
//                         <Label><span className="me-2">{field.icon}</span>{field.label}</Label>
//                         <Input 
//                           value={prescriptionData[field.value]} 
//                           onChange={(e) => {
//                             setPrescriptionData({...prescriptionData, [field.value]: e.target.value});
//                             if (language === 'hi') setHindiTranslations({...hindiTranslations, [field.value]: e.target.value});
//                           }} 
//                         />
//                       </FormGroup>
//                     ))}
//                   </TabPane>

//                   <TabPane tabId="2">
//                     <FormGroup>
//                       <Label>{language === 'hi' ? 'स्टाइल करने के लिए फ़ील्ड चुनें' : 'Select Field to Style'}</Label>
//                       <Input type="select" value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
//                         {doctorFields.map(field => (
//                           <option key={field.value} value={field.value}>{field.label}</option>
//                         ))}
//                       </Input>
//                     </FormGroup>
//                     {selectedElement && textStyles[selectedElement] && (
//                       <>
//                         <Row>
//                           <Col xs={6}><FormGroup><Label><FaFont /> {language === 'hi' ? 'फ़ॉन्ट आकार (px)' : 'Font Size (px)'}</Label><Input type="number" value={textStyles[selectedElement]?.fontSize || 12} onChange={(e) => updateTextStyle(selectedElement, 'fontSize', parseInt(e.target.value))} /></FormGroup></Col>
//                           <Col xs={6}><FormGroup><Label><FaFillDrip /> {language === 'hi' ? 'रंग' : 'Color'}</Label><Input type="color" value={textStyles[selectedElement]?.color || '#000000'} onChange={(e) => updateTextStyle(selectedElement, 'color', e.target.value)} /></FormGroup></Col>
//                         </Row>
//                         <Row>
//                           <Col xs={6}><FormGroup><Label><FaBold /> {language === 'hi' ? 'फ़ॉन्ट वजन' : 'Font Weight'}</Label><Input type="select" value={textStyles[selectedElement]?.fontWeight || 'normal'} onChange={(e) => updateTextStyle(selectedElement, 'fontWeight', e.target.value)}><option value="normal">{language === 'hi' ? 'सामान्य' : 'Normal'}</option><option value="bold">{language === 'hi' ? 'बोल्ड' : 'Bold'}</option></Input></FormGroup></Col>
//                           <Col xs={6}><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={textStyles[selectedElement]?.italic || false} onChange={(e) => updateTextStyle(selectedElement, 'italic', e.target.checked)} /><span className="ms-2"><FaItalic /> {language === 'hi' ? 'इटैलिक' : 'Italic'}</span></Label></FormGroup></Col>
//                         </Row>
//                         <FormGroup check><Label check><Input type="checkbox" checked={textStyles[selectedElement]?.underline || false} onChange={(e) => updateTextStyle(selectedElement, 'underline', e.target.checked)} /><span className="ms-2"><FaUnderline /> {language === 'hi' ? 'अंडरलाइन' : 'Underline'}</span></Label></FormGroup>
//                         {prescriptionData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />{language === 'hi' ? 'प्रीव्यू पर इस तत्व को खींचकर पुनः स्थित करें' : 'Click and drag this element on preview to reposition'}</Alert>}
//                       </>
//                     )}
//                     <hr />
//                     <h6 className="mt-3">{language === 'hi' ? 'पैड डिज़ाइन' : 'Pad Design'}</h6>
//                     <Row>
//                       <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'पृष्ठभूमि रंग' : 'Background Color'}</Label><Input type="color" value={prescriptionData.backgroundColor} onChange={(e) => setPrescriptionData({...prescriptionData, backgroundColor: e.target.value})} /></FormGroup></Col>
//                       <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'टेक्स्ट रंग' : 'Text Color'}</Label><Input type="color" value={prescriptionData.textColor} onChange={(e) => setPrescriptionData({...prescriptionData, textColor: e.target.value})} /></FormGroup></Col>
//                       <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'एक्सेंट रंग' : 'Accent Color'}</Label><Input type="color" value={prescriptionData.accentColor} onChange={(e) => setPrescriptionData({...prescriptionData, accentColor: e.target.value})} /></FormGroup></Col>
//                       <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'फ़ॉन्ट परिवार' : 'Font Family'}</Label><Input type="select" value={prescriptionData.fontFamily} onChange={(e) => setPrescriptionData({...prescriptionData, fontFamily: e.target.value})}><option>Poppins</option><option>Arial</option><option>Georgia</option><option>Times New Roman</option></Input></FormGroup></Col>
//                     </Row>
//                     <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.roundedCorners} onChange={(e) => setPrescriptionData({...prescriptionData, roundedCorners: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'गोल कोने' : 'Rounded Corners'}</span></Label></FormGroup>
//                     <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.shadow} onChange={(e) => setPrescriptionData({...prescriptionData, shadow: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'छाया दिखाएं' : 'Show Shadow'}</span></Label></FormGroup>
//                     <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.border} onChange={(e) => setPrescriptionData({...prescriptionData, border: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'बॉर्डर दिखाएं' : 'Show Border'}</span></Label></FormGroup>
//                   </TabPane>

//                   <TabPane tabId="3">
//                     <FormGroup>
//                       <Label>{language === 'hi' ? 'लोगो छवि' : 'Logo Image'}</Label>
//                       <div className="border rounded p-3 text-center" onClick={() => logoInputRef.current.click()} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
//                         {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p>{language === 'hi' ? 'लोगो अपलोड करें' : 'Upload Logo'}</p></>}
//                       </div>
//                       <input ref={logoInputRef} type="file" hidden onChange={handleLogoChange} accept="image/*" />
//                     </FormGroup>
//                     <FormGroup check>
//                       <Label check><Input type="checkbox" checked={prescriptionData.showLogo} onChange={(e) => setPrescriptionData({...prescriptionData, showLogo: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'पैड पर लोगो दिखाएं' : 'Show Logo on Pad'}</span></Label>
//                     </FormGroup>
//                     {prescriptionData.showLogo && previewImage && (
//                       <>
//                         <h6 className="mt-3">{language === 'hi' ? 'लोगो कस्टमाइज़ेशन' : 'Logo Customization'}</h6>
//                         <Row>
//                           <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'चौड़ाई (px)' : 'Width (px)'}</Label><Input type="number" value={logoSettings.width} onChange={(e) => updateLogoSize(parseInt(e.target.value), logoSettings.height)} /></FormGroup></Col>
//                           <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'ऊंचाई (px)' : 'Height (px)'}</Label><Input type="number" value={logoSettings.height} onChange={(e) => updateLogoSize(logoSettings.width, parseInt(e.target.value))} /></FormGroup></Col>
//                         </Row>
//                         <FormGroup>
//                           <Label>{language === 'hi' ? 'लोगो आकार' : 'Logo Shape'}</Label>
//                           <div className="d-flex gap-3">
//                             <Button size="sm" color={logoSettings.shape === 'rectangle' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rectangle'})}><FaSquare /> {language === 'hi' ? 'आयत' : 'Rectangle'}</Button>
//                             <Button size="sm" color={logoSettings.shape === 'rounded' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rounded'})}><FaSquare /> {language === 'hi' ? 'गोल' : 'Rounded'}</Button>
//                             <Button size="sm" color={logoSettings.shape === 'circle' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'circle'})}><FaRegCircle /> {language === 'hi' ? 'वृत्त' : 'Circle'}</Button>
//                           </div>
//                         </FormGroup>
//                         <Row>
//                           <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'बॉर्डर चौड़ाई (px)' : 'Border Width (px)'}</Label><Input type="number" value={logoSettings.borderWidth} onChange={(e) => setLogoSettings({...logoSettings, borderWidth: parseInt(e.target.value)})} /></FormGroup></Col>
//                           {logoSettings.borderWidth > 0 && (
//                             <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'बॉर्डर रंग' : 'Border Color'}</Label><Input type="color" value={logoSettings.borderColor} onChange={(e) => setLogoSettings({...logoSettings, borderColor: e.target.value})} /></FormGroup></Col>
//                           )}
//                         </Row>
//                         {prescriptionData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />{language === 'hi' ? 'प्रीव्यू पर लोगो को खींचकर पुनः स्थित करें' : 'Click and drag logo on preview to reposition'}</Alert>}
//                       </>
//                     )}
//                   </TabPane>
//                 </TabContent>

//                 <div className="d-flex justify-content-end gap-2 mt-4">
//                   <Button color="secondary" onClick={() => navigate('/prescriptions')}>{language === 'hi' ? 'रद्द करें' : 'Cancel'}</Button>
//                   <Button color="primary" type="submit" disabled={loading}>
//                     {loading ? <><FaSpinner className="spinner-border-sm me-1" /> {language === 'hi' ? 'बना रहा है...' : 'Creating...'}</> : <><FaSave /> {language === 'hi' ? 'पैड बनाएं' : 'Create Pad'}</>}
//                   </Button>
//                 </div>
//               </Form>
//             </CardBody>
//           </Card>
//         </Col>

//         <Col md={6}>
//           <Card className="shadow-lg border-0 sticky-top" style={{ top: '20px' }}>
//             <CardBody className="p-4">
//               <CardTitle tag="h4" className="text-center mb-3">
//                 {language === 'hi' ? 'लाइव प्रीव्यू' : 'Live Preview'}
//                 {prescriptionData.useTemplate && <small className="d-block text-muted"><FaMousePointer /> {language === 'hi' ? 'किसी भी तत्व को खींचकर पुनः स्थित करें' : 'Click and drag ANY element to reposition'}</small>}
//               </CardTitle>
//               <div className="preview-container" style={{ maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
//                 {prescriptionData.useTemplate && templateImage ? (
//                   <canvas
//                     ref={canvasRef}
//                     style={{ width: '100%', height: 'auto', border: '1px solid #ddd', cursor: isDragging ? 'grabbing' : 'grab' }}
//                     onMouseDown={handleCanvasMouseDown}
//                     onMouseMove={handleCanvasMouseMove}
//                     onMouseUp={handleCanvasMouseUp}
//                     onMouseLeave={handleCanvasMouseUp}
//                   />
//                 ) : renderPrescriptionPad()}
//               </div>
//               <div className="d-flex gap-2 mt-3">
//                 <Button color="success" onClick={downloadPrescription} className="flex-grow-1"><FaDownload /> {language === 'hi' ? 'पैड डाउनलोड करें' : 'Download Pad'}</Button>
//                 <Button color="info" onClick={() => setShowFullPreview(true)} className="flex-grow-1"><FaEye /> {language === 'hi' ? 'पूर्ण प्रीव्यू' : 'Full Preview'}</Button>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>

//       {showFullPreview && (
//         <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content bg-transparent border-0">
//               <div className="modal-body text-center">
//                 {prescriptionData.useTemplate && templateImage
//                   ? <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
//                   : renderPrescriptionPad()
//                 }
//                 <div className="mt-3">
//                   <Button color="success" onClick={downloadPrescription}><FaDownload /> {language === 'hi' ? 'डाउनलोड' : 'Download'}</Button>
//                   <Button color="secondary" className="ms-2" onClick={() => setShowFullPreview(false)}>{language === 'hi' ? 'बंद करें' : 'Close'}</Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default DoctorPrescriptionCreator;



// DoctorPrescriptionCreator.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Container, Form, FormGroup, Label, Input, Button, Card, CardBody,
  CardTitle, Alert, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCloudUploadAlt, FaSpinner, FaEye, FaSave, FaMousePointer, FaDownload,
  FaUserMd, FaHospital, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaLanguage,
  FaPalette, FaFont, FaImages, FaCheckCircle, FaArrowsAlt, FaFillDrip,
  FaBold, FaItalic, FaUnderline, FaSquare, FaRegCircle, FaRegIdCard, FaClock,
  FaRulerCombined, FaPlus, FaMinus
} from 'react-icons/fa';
import html2canvas from 'html2canvas';

const API_URL = 'https://designback.onrender.com/api/admin';

const DoctorPrescriptionCreator = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [language, setLanguage] = useState('en');
  
  // Unit system: 'px', 'in', 'mm'
  const [unit, setUnit] = useState('px');
  
  // Conversion factors
  const PX_PER_INCH = 96;
  const MM_PER_INCH = 25.4;
  
  const [templateImage, setTemplateImage] = useState(null);
  const [originalTemplateFile, setOriginalTemplateFile] = useState(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  
  // Frame size options for prescription pad (in pixels internally)
  const frameSizes = {
    a4: { name: 'A4', width: 800, height: 1131 },
    letter: { name: 'Letter', width: 800, height: 1035 },
    legal: { name: 'Legal', width: 800, height: 1200 },
    square: { name: 'Square', width: 800, height: 800 },
    custom: { name: 'Custom', width: 800, height: 1000 }
  };
  
  const [selectedFrame, setSelectedFrame] = useState('a4');
  const [customSize, setCustomSize] = useState({ width: 800, height: 1000 });
  
  // Get size in current unit
  const getSizeInUnit = (pxValue, targetUnit) => {
    if (targetUnit === 'px') return pxValue;
    if (targetUnit === 'in') return pxValue / PX_PER_INCH;
    if (targetUnit === 'mm') return (pxValue / PX_PER_INCH) * MM_PER_INCH;
    return pxValue;
  };
  
  // Convert from unit to pixels
  const convertToPx = (value, fromUnit) => {
    if (fromUnit === 'px') return value;
    if (fromUnit === 'in') return value * PX_PER_INCH;
    if (fromUnit === 'mm') return (value / MM_PER_INCH) * PX_PER_INCH;
    return value;
  };
  
  const [logoSettings, setLogoSettings] = useState({
    x: 400, y: 80, width: 80, height: 80, borderRadius: 8,
    borderWidth: 0, borderColor: '#000000', shape: 'circle', show: true
  });
  
  const [hindiTranslations, setHindiTranslations] = useState({
    doctorName: 'डॉ. राजेश कुमार',
    qualification: 'एमबीबीएस, एमडी',
    hospitalName: 'सिटी केयर हॉस्पिटल',
    address: '123, मेन रोड, नई दिल्ली - 110001',
    phone: '+91 98765 43210',
    registrationNo: 'एमसी-12345',
    timing: 'सुबह 10:00 - शाम 6:00'
  });
  
  const [prescriptionData, setPrescriptionData] = useState({
    doctorName: 'Dr. Rajesh Kumar',
    qualification: 'MBBS, MD',
    hospitalName: 'City Care Hospital',
    address: '123, Main Road, New Delhi - 110001',
    phone: '+91 98765 43210',
    registrationNo: 'MC-12345',
    timing: '10:00 AM - 6:00 PM',
    logo: null,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#2c7da0',
    fontFamily: 'Poppins',
    fontSize: '12',
    showLogo: true,
    roundedCorners: true,
    shadow: true,
    border: true,
    useTemplate: false
  });
  
  const [textStyles, setTextStyles] = useState({
    doctorName:    { fontSize: 28, fontWeight: 'bold',   color: '#2c7da0', italic: false, underline: false, x: 400, y: 180, show: true },
    qualification: { fontSize: 16, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 220, show: true },
    hospitalName:  { fontSize: 22, fontWeight: 'bold',   color: '#2c7da0', italic: false, underline: false, x: 400, y: 260, show: true },
    address:       { fontSize: 13, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 300, show: true },
    phone:         { fontSize: 13, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 330, show: true },
    registrationNo: { fontSize: 12, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 360, show: true },
    timing:        { fontSize: 12, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 390, show: true }
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState('doctorName');
  
  const logoInputRef = useRef(null);
  const templateInputRef = useRef(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const prescriptionRef = useRef(null);

  // Get current canvas dimensions
  const getCurrentDimensions = () => {
    if (selectedFrame === 'custom') {
      return { width: customSize.width, height: customSize.height };
    }
    const frame = frameSizes[selectedFrame];
    return { width: frame.width, height: frame.height };
  };

  // Display dimensions in current unit
  const dimensions = getCurrentDimensions();
  const displayWidth = getSizeInUnit(dimensions.width, unit).toFixed(2);
  const displayHeight = getSizeInUnit(dimensions.height, unit).toFixed(2);

  const getDisplayText = (field) => {
    if (language === 'hi') return hindiTranslations[field];
    return prescriptionData[field];
  };

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

  // Resize image to fit canvas dimensions
  const resizeImageToCanvasSize = async (imageFile, targetWidth, targetHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        canvas.toBlob(blob => {
          URL.revokeObjectURL(url);
          resolve(blob);
        }, 'image/png');
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  useEffect(() => {
    if (prescriptionData.useTemplate && templateImage && canvasRef.current) {
      drawCanvasWithOverlays(true);
    }
  }, [templateImage, prescriptionData, textStyles, previewImage, logoSettings, language, selectedFrame, customSize, unit]);

  const drawCanvasWithOverlays = (withOverlays = true) => {
    if (!canvasRef.current || !templateImage) return;
    
    const dimensions = getCurrentDimensions();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      if (withOverlays) {
        const fields = ['doctorName', 'qualification', 'hospitalName', 'address', 'phone', 'registrationNo', 'timing'];
        for (const field of fields) {
          if (textStyles[field]?.show) {
            const displayText = getDisplayText(field);
            if (displayText) drawText(ctx, displayText, textStyles[field], prescriptionData.fontFamily);
          }
        }
        if (prescriptionData.showLogo && previewImage && logoSettings.show) {
          drawLogo(ctx, previewImage, logoSettings);
        }
      }
    };
    img.src = templateImage;
  };

  const drawText = (ctx, text, style, fontFamily) => {
    if (!text) return;
    let fontStyle = '';
    if (style.italic) fontStyle += 'italic ';
    fontStyle += style.fontWeight;

    ctx.save();
    ctx.font = `${fontStyle} ${style.fontSize}px ${fontFamily}`;
    ctx.fillStyle = style.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    ctx.fillText(text, style.x, style.y);
    
    if (style.underline) {
      const metrics = ctx.measureText(text);
      ctx.beginPath();
      ctx.moveTo(style.x - metrics.width/2, style.y + 2);
      ctx.lineTo(style.x + metrics.width/2, style.y + 2);
      ctx.strokeStyle = style.color;
      ctx.lineWidth = 1;
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
        ctx.arc(settings.x + settings.width/2, settings.y + settings.height/2, settings.width/2, 0, 2 * Math.PI);
        ctx.clip();
      } else if (settings.shape === 'rounded') {
        ctx.beginPath();
        roundRect(ctx, settings.x, settings.y, settings.width, settings.height, settings.borderRadius);
        ctx.clip();
      }

      ctx.drawImage(logo, settings.x, settings.y, settings.width, settings.height);

      if (settings.borderWidth > 0) {
        ctx.strokeStyle = settings.borderColor;
        ctx.lineWidth = settings.borderWidth;
        if (settings.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(settings.x + settings.width/2, settings.y + settings.height/2, settings.width/2, 0, 2 * Math.PI);
          ctx.stroke();
        } else {
          ctx.strokeRect(settings.x, settings.y, settings.width, settings.height);
        }
      }
      ctx.restore();
    };
    logo.src = logoUrl;
  };

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

  const handleCanvasMouseDown = (e) => {
    if (!prescriptionData.useTemplate) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    const fields = ['doctorName', 'qualification', 'hospitalName', 'address', 'phone', 'registrationNo', 'timing'];
    
    for (const field of fields) {
      const style = textStyles[field];
      if (!style || !style.show) continue;

      let text = getDisplayText(field);
      if (!text) continue;

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      let fontStyle = style.italic ? 'italic ' : '';
      fontStyle += style.fontWeight;
      tempCtx.font = `${fontStyle} ${style.fontSize}px ${prescriptionData.fontFamily}`;
      const textWidth = tempCtx.measureText(text).width;
      const textHeight = style.fontSize;

      if (
        mouseX >= style.x - textWidth/2 - 10 &&
        mouseX <= style.x + textWidth/2 + 10 &&
        mouseY >= style.y - textHeight - 5 &&
        mouseY <= style.y + 5
      ) {
        setIsDragging(true);
        setDragTarget({ type: 'text', field });
        setDragStart({ x: mouseX - style.x, y: mouseY - style.y });
        return;
      }
    }

    if (prescriptionData.showLogo && previewImage && logoSettings.show) {
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
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
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

  const handleSizeChange = async (newWidthPx, newHeightPx) => {
    if (newWidthPx < 100 || newHeightPx < 100) return;
    
    const oldDimensions = getCurrentDimensions();
    const scaleX = newWidthPx / oldDimensions.width;
    const scaleY = newHeightPx / oldDimensions.height;
    
    // Adjust text positions and font sizes proportionally
    const newTextStyles = {};
    Object.keys(textStyles).forEach(key => {
      newTextStyles[key] = {
        ...textStyles[key],
        x: textStyles[key].x * scaleX,
        y: textStyles[key].y * scaleY,
        fontSize: textStyles[key].fontSize * Math.min(scaleX, scaleY)
      };
    });
    setTextStyles(newTextStyles);
    
    // Adjust logo position and size
    setLogoSettings(prev => ({
      ...prev,
      x: prev.x * scaleX,
      y: prev.y * scaleY,
      width: prev.width * scaleX,
      height: prev.height * scaleY
    }));
    
    // Update dimensions based on frame type
    if (selectedFrame === 'custom') {
      setCustomSize({ width: newWidthPx, height: newHeightPx });
    } else {
      frameSizes[selectedFrame].width = newWidthPx;
      frameSizes[selectedFrame].height = newHeightPx;
      setSelectedFrame(selectedFrame);
    }
    
    // If template is loaded, resize it
    if (templateImage && originalTemplateFile) {
      const resizedBlob = await resizeImageToCanvasSize(originalTemplateFile, newWidthPx, newHeightPx);
      const resizedUrl = URL.createObjectURL(resizedBlob);
      setTemplateImage(resizedUrl);
      setOriginalTemplateFile(new File([resizedBlob], 'template.png', { type: 'image/png' }));
    }
  };

  const incrementSize = (dimension) => {
    const incrementValue = unit === 'px' ? 10 : (unit === 'in' ? 0.1 : 2);
    if (dimension === 'width') {
      const newWidthPx = convertToPx(parseFloat(displayWidth) + incrementValue, unit);
      handleSizeChange(newWidthPx, dimensions.height);
    } else {
      const newHeightPx = convertToPx(parseFloat(displayHeight) + incrementValue, unit);
      handleSizeChange(dimensions.width, newHeightPx);
    }
  };

  const decrementSize = (dimension) => {
    const decrementValue = unit === 'px' ? 10 : (unit === 'in' ? 0.1 : 2);
    if (dimension === 'width') {
      const newWidthPx = convertToPx(Math.max(100, parseFloat(displayWidth) - decrementValue), unit);
      handleSizeChange(newWidthPx, dimensions.height);
    } else {
      const newHeightPx = convertToPx(Math.max(100, parseFloat(displayHeight) - decrementValue), unit);
      handleSizeChange(dimensions.width, newHeightPx);
    }
  };

  const handleFrameSelect = (frameId) => {
    setSelectedFrame(frameId);
    if (frameId !== 'custom') {
      const frame = frameSizes[frameId];
      handleSizeChange(frame.width, frame.height);
    }
  };

  const sampleTemplates = [
    { id: 1, name: 'Modern', image: 'https://placehold.co/800x1131/2c7da0/white?text=Modern' },
    { id: 2, name: 'Classic', image: 'https://placehold.co/800x1131/f3f4f6/black?text=Classic' },
    { id: 3, name: 'Professional', image: 'https://placehold.co/800x1131/1f2937/white?text=Professional' },
    { id: 4, name: 'Minimal', image: 'https://placehold.co/800x1131/ffffff/black?text=Minimal' }
  ];

  const handleTemplateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      setErrorMessage(language === 'hi' ? 'टेम्पलेट का आकार 5MB से कम होना चाहिए' : 'Template size should be less than 5MB'); 
      return; 
    }
    
    const dimensions = getCurrentDimensions();
    const resizedBlob = await resizeImageToCanvasSize(file, dimensions.width, dimensions.height);
    const resizedUrl = URL.createObjectURL(resizedBlob);
    
    setTemplateImage(resizedUrl);
    setOriginalTemplateFile(new File([resizedBlob], file.name, { type: 'image/png' }));
    setPrescriptionData({ ...prescriptionData, useTemplate: true });
    setShowTemplatePicker(false);
  };

  const selectTemplate = async (template) => {
    const response = await fetch(template.image);
    const blob = await response.blob();
    const dimensions = getCurrentDimensions();
    const resizedBlob = await resizeImageToCanvasSize(blob, dimensions.width, dimensions.height);
    const resizedUrl = URL.createObjectURL(resizedBlob);
    
    setTemplateImage(resizedUrl);
    setOriginalTemplateFile(new File([resizedBlob], 'template.png', { type: 'image/png' }));
    setPrescriptionData({ ...prescriptionData, useTemplate: true });
    setShowTemplatePicker(false);
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { 
      setErrorMessage(language === 'hi' ? 'लोगो का आकार 2MB से कम होना चाहिए' : 'Logo size should be less than 2MB'); 
      return; 
    }
    
    setPrescriptionData({ ...prescriptionData, logo: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const downloadPrescription = async () => {
    if (prescriptionData.useTemplate && canvasRef.current) {
      const link = document.createElement('a');
      link.download = `doctor_pad.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    } else if (prescriptionRef.current) {
      try {
        const canvas = await html2canvas(prescriptionRef.current, { scale: 2, backgroundColor: null, useCORS: true });
        const link = document.createElement('a');
        link.download = `doctor_pad.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        setErrorMessage(language === 'hi' ? 'डाउनलोड करने में विफल' : 'Failed to download');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    const dimensions = getCurrentDimensions();
    const formData = new FormData();
    formData.append('doctorName', prescriptionData.doctorName || '');
    formData.append('qualification', prescriptionData.qualification || '');
    formData.append('hospitalName', prescriptionData.hospitalName || '');
    formData.append('address', prescriptionData.address || '');
    formData.append('phone', prescriptionData.phone || '');
    formData.append('registrationNo', prescriptionData.registrationNo || '');
    formData.append('timing', prescriptionData.timing || '');
    formData.append('textStyles', JSON.stringify(textStyles));
    formData.append('logoSettings', JSON.stringify(logoSettings));
    formData.append('useTemplate', prescriptionData.useTemplate ? 'true' : 'false');
    formData.append('language', language);
    formData.append('unit', unit);
    formData.append('frameSize', JSON.stringify(dimensions));
    formData.append('design', JSON.stringify({
      backgroundColor: prescriptionData.backgroundColor,
      textColor: prescriptionData.textColor,
      accentColor: prescriptionData.accentColor,
      fontFamily: prescriptionData.fontFamily,
      fontSize: prescriptionData.fontSize,
      showLogo: prescriptionData.showLogo,
      roundedCorners: prescriptionData.roundedCorners,
      shadow: prescriptionData.shadow,
      border: prescriptionData.border
    }));
    
    if (prescriptionData.logo) formData.append('logo', prescriptionData.logo);
    
    let templateBlob = null;
    if (originalTemplateFile) {
      templateBlob = await resizeImageToCanvasSize(originalTemplateFile, dimensions.width, dimensions.height);
    } else if (templateImage && prescriptionData.useTemplate) {
      const response = await fetch(templateImage);
      const blob = await response.blob();
      const file = new File([blob], 'template.png', { type: 'image/png' });
      templateBlob = await resizeImageToCanvasSize(file, dimensions.width, dimensions.height);
    }
    if (templateBlob) formData.append('templateImage', templateBlob, 'template.png');
    
    let finalImageBlob = null;
    if (prescriptionData.useTemplate && canvasRef.current && templateImage) {
      try {
        finalImageBlob = await new Promise(resolve => canvasRef.current.toBlob(resolve, 'image/png'));
      } catch (err) {
        console.error('Error capturing canvas:', err);
      }
    } else if (prescriptionRef.current) {
      try {
        const canvas = await html2canvas(prescriptionRef.current, { scale: 2, backgroundColor: null, useCORS: true });
        finalImageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      } catch (err) {
        console.error('Error capturing prescription:', err);
      }
    }
    if (finalImageBlob) formData.append('previewImage', finalImageBlob, 'preview.png');
    
    try {
      const response = await axios.post(`${API_URL}/createdoctorpad`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setSuccessMessage(language === 'hi' ? 'डॉक्टर पैड सफलतापूर्वक बनाया गया!' : 'Doctor pad created successfully!');
        setTimeout(() => {
          navigate('/prescriptions');
        }, 2000);
      } else {
        setErrorMessage(response.data.message || 'Failed to create doctor pad');
      }
    } catch (error) {
      console.error('API Error:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Error creating doctor pad');
    } finally {
      setLoading(false);
    }
  };

  const renderPrescriptionPad = () => {
    const dimensions = getCurrentDimensions();
    const style = {
      backgroundColor: prescriptionData.backgroundColor,
      color: prescriptionData.textColor,
      fontFamily: prescriptionData.fontFamily,
      fontSize: `${prescriptionData.fontSize}px`,
      borderRadius: prescriptionData.roundedCorners ? '16px' : '0',
      boxShadow: prescriptionData.shadow ? '0 20px 35px -10px rgba(0,0,0,0.2)' : 'none',
      border: prescriptionData.border ? `1px solid ${prescriptionData.accentColor}20` : 'none',
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px',
      textAlign: 'center'
    };
    
    return (
      <div ref={prescriptionRef} style={style}>
        {prescriptionData.showLogo && previewImage && logoSettings.show && (
          <img src={previewImage} alt="Logo" style={{ 
            width: `${logoSettings.width}px`, height: `${logoSettings.height}px`,
            objectFit: 'contain', ...getLogoShapeStyle(),
            border: logoSettings.borderWidth > 0 ? `${logoSettings.borderWidth}px solid ${logoSettings.borderColor}` : 'none',
            marginBottom: '20px'
          }} />
        )}
        <h2 style={{ color: prescriptionData.accentColor, fontSize: '28px', marginBottom: '10px' }}>{getDisplayText('doctorName')}</h2>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>{getDisplayText('qualification')}</p>
        <h3 style={{ color: prescriptionData.accentColor, fontSize: '22px', marginBottom: '15px' }}>{getDisplayText('hospitalName')}</h3>
        <p style={{ fontSize: '13px', marginBottom: '5px' }}>{getDisplayText('address')}</p>
        <p style={{ fontSize: '13px', marginBottom: '5px' }}>📞 {getDisplayText('phone')}</p>
        <p style={{ fontSize: '12px', marginBottom: '3px' }}>Reg No: {getDisplayText('registrationNo')}</p>
        <p style={{ fontSize: '12px', marginBottom: '3px' }}>⏰ {getDisplayText('timing')}</p>
      </div>
    );
  };

  const doctorFields = [
    { value: 'doctorName', label: 'Doctor Name', icon: <FaUserMd /> },
    { value: 'qualification', label: 'Qualification', icon: <FaGraduationCap /> },
    { value: 'hospitalName', label: 'Hospital Name', icon: <FaHospital /> },
    { value: 'address', label: 'Address', icon: <FaMapMarkerAlt /> },
    { value: 'phone', label: 'Phone', icon: <FaPhone /> },
    { value: 'registrationNo', label: 'Registration No', icon: <FaRegIdCard /> },
    { value: 'timing', label: 'Timing', icon: <FaClock /> }
  ];

  return (
    <Container fluid className="my-5">
      <Row>
        <Col md={6}>
          <Card className="shadow-lg border-0">
            <CardBody className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h3" className="text-primary mb-0"><FaUserMd className="me-2" />Doctor Prescription Pad</CardTitle>
                <div>
                  <Button color={language === 'en' ? 'primary' : 'secondary'} size="sm" onClick={() => setLanguage('en')} className="me-2">
                    <FaLanguage /> English
                  </Button>
                  <Button color={language === 'hi' ? 'primary' : 'secondary'} size="sm" onClick={() => setLanguage('hi')}>
                    <FaLanguage /> हिंदी
                  </Button>
                </div>
              </div>

              {errorMessage && <Alert color="danger" toggle={() => setErrorMessage('')}>{errorMessage}</Alert>}
              {successMessage && <Alert color="success" toggle={() => setSuccessMessage('')}>{successMessage}</Alert>}

              {/* Frame Size Selection with Units */}
              <div className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Label className="fw-bold mb-0">
                    <FaRulerCombined className="me-2" />
                    {language === 'hi' ? 'पैड साइज़' : 'Pad Size'}
                  </Label>
                  <div className="btn-group btn-group-sm">
                    <Button color={unit === 'px' ? 'primary' : 'secondary'} onClick={() => setUnit('px')}>px</Button>
                    <Button color={unit === 'in' ? 'primary' : 'secondary'} onClick={() => setUnit('in')}>in</Button>
                    <Button color={unit === 'mm' ? 'primary' : 'secondary'} onClick={() => setUnit('mm')}>mm</Button>
                  </div>
                </div>
                
                <Row className="mb-2">
                  <Col xs={6} md={3} className="mb-2">
                    <Button 
                      color={selectedFrame === 'a4' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => handleFrameSelect('a4')}
                      className="w-100"
                    >
                      A4
                    </Button>
                  </Col>
                  <Col xs={6} md={3} className="mb-2">
                    <Button 
                      color={selectedFrame === 'letter' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => handleFrameSelect('letter')}
                      className="w-100"
                    >
                      Letter
                    </Button>
                  </Col>
                  <Col xs={6} md={3} className="mb-2">
                    <Button 
                      color={selectedFrame === 'legal' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => handleFrameSelect('legal')}
                      className="w-100"
                    >
                      Legal
                    </Button>
                  </Col>
                  <Col xs={6} md={3} className="mb-2">
                    <Button 
                      color={selectedFrame === 'square' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => handleFrameSelect('square')}
                      className="w-100"
                    >
                      Square
                    </Button>
                  </Col>
                </Row>
                
                <Row className="align-items-end">
                  <Col xs={5}>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'चौड़ाई' : 'Width'}</Label>
                      <div className="d-flex">
                        <Button size="sm" color="outline-secondary" onClick={() => decrementSize('width')} style={{ borderRadius: '4px 0 0 4px' }}>
                          <FaMinus />
                        </Button>
                        <Input 
                          type="number" 
                          value={displayWidth}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            if (!isNaN(newValue) && newValue > 0) {
                              const newWidthPx = convertToPx(newValue, unit);
                              handleSizeChange(newWidthPx, dimensions.height);
                            }
                          }}
                          step={unit === 'px' ? 10 : (unit === 'in' ? 0.1 : 2)}
                          style={{ borderRadius: 0, textAlign: 'center' }}
                        />
                        <Button size="sm" color="outline-secondary" onClick={() => incrementSize('width')} style={{ borderRadius: '0 4px 4px 0' }}>
                          <FaPlus />
                        </Button>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col xs={5}>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'ऊंचाई' : 'Height'}</Label>
                      <div className="d-flex">
                        <Button size="sm" color="outline-secondary" onClick={() => decrementSize('height')} style={{ borderRadius: '4px 0 0 4px' }}>
                          <FaMinus />
                        </Button>
                        <Input 
                          type="number" 
                          value={displayHeight}
                          onChange={(e) => {
                            const newValue = parseFloat(e.target.value);
                            if (!isNaN(newValue) && newValue > 0) {
                              const newHeightPx = convertToPx(newValue, unit);
                              handleSizeChange(dimensions.width, newHeightPx);
                            }
                          }}
                          step={unit === 'px' ? 10 : (unit === 'in' ? 0.1 : 2)}
                          style={{ borderRadius: 0, textAlign: 'center' }}
                        />
                        <Button size="sm" color="outline-secondary" onClick={() => incrementSize('height')} style={{ borderRadius: '0 4px 4px 0' }}>
                          <FaPlus />
                        </Button>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col xs={2}>
                    <div className="text-muted small text-center">
                      {dimensions.width}×{dimensions.height}<br/>px
                    </div>
                  </Col>
                </Row>
                
                {selectedFrame === 'custom' && (
                  <Row className="mt-2">
                    <Col xs={6}>
                      <Input 
                        type="number" 
                        placeholder={language === 'hi' ? 'चौड़ाई' : 'Width'} 
                        value={customSize.width}
                        onChange={(e) => {
                          const newWidth = parseInt(e.target.value);
                          setCustomSize({ ...customSize, width: newWidth });
                          handleSizeChange(newWidth, customSize.height);
                        }}
                      />
                    </Col>
                    <Col xs={6}>
                      <Input 
                        type="number" 
                        placeholder={language === 'hi' ? 'ऊंचाई' : 'Height'} 
                        value={customSize.height}
                        onChange={(e) => {
                          const newHeight = parseInt(e.target.value);
                          setCustomSize({ ...customSize, height: newHeight });
                          handleSizeChange(customSize.width, newHeight);
                        }}
                      />
                    </Col>
                  </Row>
                )}
              </div>

              <div className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Label className="fw-bold mb-0"><FaImages className="me-2" />Background Template</Label>
                  <Button size="sm" color="primary" onClick={() => setShowTemplatePicker(!showTemplatePicker)}>
                    {prescriptionData.useTemplate ? (language === 'hi' ? 'टेम्पलेट बदलें' : 'Change Template') : (language === 'hi' ? 'टेम्पलेट अपलोड करें' : 'Upload Template')}
                  </Button>
                </div>
                {showTemplatePicker && (
                  <div className="mt-2">
                    <Button size="sm" color="secondary" onClick={() => templateInputRef.current.click()} className="w-100 mb-2">
                      <FaCloudUploadAlt /> {language === 'hi' ? 'कस्टम टेम्पलेट अपलोड करें' : 'Upload Custom Template'}
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
                {prescriptionData.useTemplate && templateImage && (
                  <Alert color="success" className="mt-2 mb-0">
                    <FaCheckCircle className="me-1" /> {language === 'hi' ? 'टेम्पलेट लोड हो गया! किसी भी तत्व को खींचकर पुनः स्थित करें।' : 'Template loaded! Click and drag ANY element to reposition.'}
                  </Alert>
                )}
              </div>

              <Nav tabs className="mb-3">
                <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}><FaUserMd /> {language === 'hi' ? 'डॉक्टर जानकारी' : 'Doctor Info'}</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><FaPalette /> {language === 'hi' ? 'टेक्स्ट स्टाइल' : 'Text Style'}</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><FaImages /> {language === 'hi' ? 'लोगो' : 'Logo'}</NavLink></NavItem>
              </Nav>

              <Form onSubmit={handleSubmit}>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    {doctorFields.map(field => (
                      <FormGroup key={field.value}>
                        <Label><span className="me-2">{field.icon}</span>{field.label}</Label>
                        <Input 
                          value={prescriptionData[field.value]} 
                          onChange={(e) => {
                            setPrescriptionData({...prescriptionData, [field.value]: e.target.value});
                            if (language === 'hi') setHindiTranslations({...hindiTranslations, [field.value]: e.target.value});
                          }} 
                        />
                      </FormGroup>
                    ))}
                  </TabPane>

                  <TabPane tabId="2">
                    <FormGroup>
                      <Label>{language === 'hi' ? 'स्टाइल करने के लिए फ़ील्ड चुनें' : 'Select Field to Style'}</Label>
                      <Input type="select" value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
                        {doctorFields.map(field => (
                          <option key={field.value} value={field.value}>{field.label}</option>
                        ))}
                      </Input>
                    </FormGroup>
                    {selectedElement && textStyles[selectedElement] && (
                      <>
                        <Row>
                          <Col xs={6}><FormGroup><Label><FaFont /> {language === 'hi' ? 'फ़ॉन्ट आकार (px)' : 'Font Size (px)'}</Label><Input type="number" value={textStyles[selectedElement]?.fontSize || 12} onChange={(e) => updateTextStyle(selectedElement, 'fontSize', parseInt(e.target.value))} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label><FaFillDrip /> {language === 'hi' ? 'रंग' : 'Color'}</Label><Input type="color" value={textStyles[selectedElement]?.color || '#000000'} onChange={(e) => updateTextStyle(selectedElement, 'color', e.target.value)} /></FormGroup></Col>
                        </Row>
                        <Row>
                          <Col xs={6}><FormGroup><Label><FaBold /> {language === 'hi' ? 'फ़ॉन्ट वजन' : 'Font Weight'}</Label><Input type="select" value={textStyles[selectedElement]?.fontWeight || 'normal'} onChange={(e) => updateTextStyle(selectedElement, 'fontWeight', e.target.value)}><option value="normal">{language === 'hi' ? 'सामान्य' : 'Normal'}</option><option value="bold">{language === 'hi' ? 'बोल्ड' : 'Bold'}</option></Input></FormGroup></Col>
                          <Col xs={6}><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={textStyles[selectedElement]?.italic || false} onChange={(e) => updateTextStyle(selectedElement, 'italic', e.target.checked)} /><span className="ms-2"><FaItalic /> {language === 'hi' ? 'इटैलिक' : 'Italic'}</span></Label></FormGroup></Col>
                        </Row>
                        <FormGroup check><Label check><Input type="checkbox" checked={textStyles[selectedElement]?.underline || false} onChange={(e) => updateTextStyle(selectedElement, 'underline', e.target.checked)} /><span className="ms-2"><FaUnderline /> {language === 'hi' ? 'अंडरलाइन' : 'Underline'}</span></Label></FormGroup>
                        {prescriptionData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />{language === 'hi' ? 'प्रीव्यू पर इस तत्व को खींचकर पुनः स्थित करें' : 'Click and drag this element on preview to reposition'}</Alert>}
                      </>
                    )}
                    <hr />
                    <h6 className="mt-3">{language === 'hi' ? 'पैड डिज़ाइन' : 'Pad Design'}</h6>
                    <Row>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'पृष्ठभूमि रंग' : 'Background Color'}</Label><Input type="color" value={prescriptionData.backgroundColor} onChange={(e) => setPrescriptionData({...prescriptionData, backgroundColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'टेक्स्ट रंग' : 'Text Color'}</Label><Input type="color" value={prescriptionData.textColor} onChange={(e) => setPrescriptionData({...prescriptionData, textColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'एक्सेंट रंग' : 'Accent Color'}</Label><Input type="color" value={prescriptionData.accentColor} onChange={(e) => setPrescriptionData({...prescriptionData, accentColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'फ़ॉन्ट परिवार' : 'Font Family'}</Label><Input type="select" value={prescriptionData.fontFamily} onChange={(e) => setPrescriptionData({...prescriptionData, fontFamily: e.target.value})}><option>Poppins</option><option>Arial</option><option>Georgia</option><option>Times New Roman</option></Input></FormGroup></Col>
                    </Row>
                    <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.roundedCorners} onChange={(e) => setPrescriptionData({...prescriptionData, roundedCorners: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'गोल कोने' : 'Rounded Corners'}</span></Label></FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.shadow} onChange={(e) => setPrescriptionData({...prescriptionData, shadow: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'छाया दिखाएं' : 'Show Shadow'}</span></Label></FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.border} onChange={(e) => setPrescriptionData({...prescriptionData, border: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'बॉर्डर दिखाएं' : 'Show Border'}</span></Label></FormGroup>
                  </TabPane>

                  <TabPane tabId="3">
                    <FormGroup>
                      <Label>{language === 'hi' ? 'लोगो छवि' : 'Logo Image'}</Label>
                      <div className="border rounded p-3 text-center" onClick={() => logoInputRef.current.click()} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                        {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p>{language === 'hi' ? 'लोगो अपलोड करें' : 'Upload Logo'}</p></>}
                      </div>
                      <input ref={logoInputRef} type="file" hidden onChange={handleLogoChange} accept="image/*" />
                    </FormGroup>
                    <FormGroup check>
                      <Label check><Input type="checkbox" checked={prescriptionData.showLogo} onChange={(e) => setPrescriptionData({...prescriptionData, showLogo: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'पैड पर लोगो दिखाएं' : 'Show Logo on Pad'}</span></Label>
                    </FormGroup>
                    {prescriptionData.showLogo && previewImage && (
                      <>
                        <h6 className="mt-3">{language === 'hi' ? 'लोगो कस्टमाइज़ेशन' : 'Logo Customization'}</h6>
                        <Row>
                          <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'चौड़ाई (px)' : 'Width (px)'}</Label><Input type="number" value={logoSettings.width} onChange={(e) => updateLogoSize(parseInt(e.target.value), logoSettings.height)} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'ऊंचाई (px)' : 'Height (px)'}</Label><Input type="number" value={logoSettings.height} onChange={(e) => updateLogoSize(logoSettings.width, parseInt(e.target.value))} /></FormGroup></Col>
                        </Row>
                        <FormGroup>
                          <Label>{language === 'hi' ? 'लोगो आकार' : 'Logo Shape'}</Label>
                          <div className="d-flex gap-3">
                            <Button size="sm" color={logoSettings.shape === 'rectangle' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rectangle'})}><FaSquare /> {language === 'hi' ? 'आयत' : 'Rectangle'}</Button>
                            <Button size="sm" color={logoSettings.shape === 'rounded' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rounded'})}><FaSquare /> {language === 'hi' ? 'गोल' : 'Rounded'}</Button>
                            <Button size="sm" color={logoSettings.shape === 'circle' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'circle'})}><FaRegCircle /> {language === 'hi' ? 'वृत्त' : 'Circle'}</Button>
                          </div>
                        </FormGroup>
                        <Row>
                          <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'बॉर्डर चौड़ाई (px)' : 'Border Width (px)'}</Label><Input type="number" value={logoSettings.borderWidth} onChange={(e) => setLogoSettings({...logoSettings, borderWidth: parseInt(e.target.value)})} /></FormGroup></Col>
                          {logoSettings.borderWidth > 0 && (
                            <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'बॉर्डर रंग' : 'Border Color'}</Label><Input type="color" value={logoSettings.borderColor} onChange={(e) => setLogoSettings({...logoSettings, borderColor: e.target.value})} /></FormGroup></Col>
                          )}
                        </Row>
                        {prescriptionData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />{language === 'hi' ? 'प्रीव्यू पर लोगो को खींचकर पुनः स्थित करें' : 'Click and drag logo on preview to reposition'}</Alert>}
                      </>
                    )}
                  </TabPane>
                </TabContent>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={() => navigate('/prescriptions')}>{language === 'hi' ? 'रद्द करें' : 'Cancel'}</Button>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? <><FaSpinner className="spinner-border-sm me-1" /> {language === 'hi' ? 'बना रहा है...' : 'Creating...'}</> : <><FaSave /> {language === 'hi' ? 'पैड बनाएं' : 'Create Pad'}</>}
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
                {language === 'hi' ? 'लाइव प्रीव्यू' : 'Live Preview'}
                {prescriptionData.useTemplate && <small className="d-block text-muted"><FaMousePointer /> {language === 'hi' ? 'किसी भी तत्व को खींचकर पुनः स्थित करें' : 'Click and drag ANY element to reposition'}</small>}
              </CardTitle>
              <div className="preview-container" style={{ maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
                {prescriptionData.useTemplate && templateImage ? (
                  <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: 'auto', border: '1px solid #ddd', cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                ) : renderPrescriptionPad()}
              </div>
              <div className="d-flex gap-2 mt-3">
                <Button color="success" onClick={downloadPrescription} className="flex-grow-1"><FaDownload /> {language === 'hi' ? 'पैड डाउनलोड करें' : 'Download Pad'}</Button>
                <Button color="info" onClick={() => setShowFullPreview(true)} className="flex-grow-1"><FaEye /> {language === 'hi' ? 'पूर्ण प्रीव्यू' : 'Full Preview'}</Button>
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
                {prescriptionData.useTemplate && templateImage
                  ? <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
                  : renderPrescriptionPad()
                }
                <div className="mt-3">
                  <Button color="success" onClick={downloadPrescription}><FaDownload /> {language === 'hi' ? 'डाउनलोड' : 'Download'}</Button>
                  <Button color="secondary" className="ms-2" onClick={() => setShowFullPreview(false)}>{language === 'hi' ? 'बंद करें' : 'Close'}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default DoctorPrescriptionCreator;