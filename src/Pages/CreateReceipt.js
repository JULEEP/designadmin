// // CreateReceipt.jsx - SIMPLE RECEIPT CREATOR (NO PAYMENT DETAILS)
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Container,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Card,
//   CardBody,
//   CardTitle,
//   Alert,
//   Row,
//   Col,
//   TabContent,
//   TabPane,
//   Nav,
//   NavItem,
//   NavLink
// } from 'reactstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { 
//   FaCloudUploadAlt, 
//   FaSpinner, 
//   FaEye,
//   FaSave,
//   FaMousePointer,
//   FaDownload,
//   FaBuilding,
//   FaPalette,
//   FaFont,
//   FaImages,
//   FaCheckCircle,
//   FaArrowsAlt,
//   FaFillDrip,
//   FaBold,
//   FaItalic,
//   FaUnderline,
//   FaSquare,
//   FaRegCircle,
//   FaReceipt,
//   FaLanguage
// } from 'react-icons/fa';
// import html2canvas from 'html2canvas';

// const CreateReceipt = () => {
//   const [activeTab, setActiveTab] = useState('1');
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [language, setLanguage] = useState('en');
  
//   const [templateImage, setTemplateImage] = useState(null);
//   const [originalTemplateFile, setOriginalTemplateFile] = useState(null);
//   const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  
//   const [logoSettings, setLogoSettings] = useState({
//     x: 50,
//     y: 50,
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     borderWidth: 0,
//     borderColor: '#000000',
//     shape: 'rectangle',
//     show: true
//   });
  
//   // Hindi translations
//   const hindiTranslations = {
//     receiptTitle: 'भुगतान रसीद',
//     receiptNo: 'रसीद संख्या',
//     date: 'तारीख',
//     thankYou: 'आपके व्यवसाय के लिए धन्यवाद!',
//     companyName: 'मेरा व्यवसाय प्राइवेट लिमिटेड',
//     companyAddress: '123 बिजनेस स्ट्रीट, डाउनटाउन, शहर - 123456',
//     companyEmail: 'info@mybusiness.com',
//     companyPhone: '+91 98765 43210',
//   };

//   const [receiptData, setReceiptData] = useState({
//     companyName: 'My Business Pvt Ltd',
//     companyAddress: '123 Business Street, Downtown, City - 123456',
//     companyEmail: 'info@mybusiness.com',
//     companyPhone: '+91 98765 43210',
//     receiptTitle: 'PAYMENT RECEIPT',
//     receiptNo: 'RCP-001',
//     receiptDate: new Date().toISOString().split('T')[0],
//     logo: null,
//     backgroundColor: '#ffffff',
//     textColor: '#000000',
//     accentColor: '#10b981',
//     fontFamily: 'Poppins',
//     showLogo: true,
//     roundedCorners: true,
//     shadow: true,
//     border: true,
//     useTemplate: false,
//     message: 'Thank you for your business!'
//   });
  
//   const [textStyles, setTextStyles] = useState({
//     companyName:    { fontSize: 28, fontWeight: 'bold',   color: '#000000', italic: false, underline: false, x: 80, y: 80,  show: true },
//     companyAddress: { fontSize: 11, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 80, y: 130, show: true },
//     companyEmail:   { fontSize: 11, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 80, y: 155, show: true },
//     companyPhone:   { fontSize: 11, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 80, y: 180, show: true },
//     receiptTitle:   { fontSize: 24, fontWeight: 'bold',   color: '#10b981', italic: false, underline: true,  x: 400, y: 280, show: true },
//     receiptNo:      { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 650, y: 250, show: true },
//     receiptDate:    { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 650, y: 270, show: true },
//     message:        { fontSize: 12, fontWeight: 'normal', color: '#999999', italic: true,  underline: false, x: 80, y: 800, show: true }
//   });
  
//   const [previewImage, setPreviewImage] = useState(null);
//   const [showFullPreview, setShowFullPreview] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragTarget, setDragTarget] = useState(null);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [selectedElement, setSelectedElement] = useState('companyName');
  
//   const logoInputRef = useRef(null);
//   const templateInputRef = useRef(null);
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//   const receiptRef = useRef(null);

//   const getDisplayText = (field) => {
//     if (language === 'hi') {
//       switch(field) {
//         case 'companyName': return receiptData.companyName || hindiTranslations.companyName;
//         case 'companyAddress': return receiptData.companyAddress || hindiTranslations.companyAddress;
//         case 'companyEmail': return receiptData.companyEmail || hindiTranslations.companyEmail;
//         case 'companyPhone': return receiptData.companyPhone || hindiTranslations.companyPhone;
//         case 'receiptTitle': return hindiTranslations.receiptTitle;
//         case 'receiptNoLabel': return `${hindiTranslations.receiptNo}:`;
//         case 'dateLabel': return `${hindiTranslations.date}:`;
//         case 'message': return receiptData.message || hindiTranslations.thankYou;
//         default: return receiptData[field];
//       }
//     }
//     return receiptData[field];
//   };

//   const sampleTemplates = [
//     { id: 1, name: language === 'hi' ? 'आधुनिक' : 'Modern', image: 'https://placehold.co/800x1000/10b981/white?text=Modern+Receipt' },
//     { id: 2, name: language === 'hi' ? 'क्लासिक' : 'Classic', image: 'https://placehold.co/800x1000/f3f4f6/black?text=Classic+Receipt' },
//     { id: 3, name: language === 'hi' ? 'प्रोफेशनल' : 'Professional', image: 'https://placehold.co/800x1000/1f2937/white?text=Professional+Receipt' },
//     { id: 4, name: language === 'hi' ? 'मिनिमल' : 'Minimal', image: 'https://placehold.co/800x1000/ffffff/black?text=Minimal+Receipt' }
//   ];

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
//     if (receiptData.useTemplate && templateImage && canvasRef.current) {
//       drawCanvasWithOverlays(true);
//     }
//   }, [templateImage, receiptData, textStyles, previewImage, logoSettings, language]);

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
//         const fields = ['companyName', 'companyAddress', 'companyEmail', 'companyPhone', 'receiptTitle', 'receiptNo', 'receiptDate', 'message'];
        
//         fields.forEach(field => {
//           if (textStyles[field]?.show) {
//             let text = '';
//             if (field === 'receiptNo') text = `${getDisplayText('receiptNoLabel')} ${receiptData.receiptNo}`;
//             else if (field === 'receiptDate') text = `${getDisplayText('dateLabel')} ${receiptData.receiptDate}`;
//             else if (field === 'message') text = receiptData.message || (language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!');
//             else text = getDisplayText(field);
            
//             if (text) drawText(ctx, text, textStyles[field], receiptData.fontFamily);
//           }
//         });
        
//         if (receiptData.showLogo && previewImage && logoSettings.show) {
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
//     ctx.textBaseline = 'alphabetic';

//     ctx.fillText(text, style.x, style.y);
    
//     if (style.underline) {
//       const metrics = ctx.measureText(text);
//       ctx.beginPath();
//       ctx.moveTo(style.x, style.y + 2);
//       ctx.lineTo(style.x + metrics.width, style.y + 2);
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
//         ctx.arc(
//           settings.x + settings.width / 2,
//           settings.y + settings.height / 2,
//           settings.width / 2, 0, 2 * Math.PI
//         );
//         ctx.clip();
//       } else if (settings.shape === 'rounded' || (settings.shape === 'rectangle' && settings.borderRadius > 0)) {
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
//           ctx.arc(
//             settings.x + settings.width / 2,
//             settings.y + settings.height / 2,
//             settings.width / 2, 0, 2 * Math.PI
//           );
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
//     if (!receiptData.useTemplate) return;
    
//     const rect = canvasRef.current.getBoundingClientRect();
//     const scaleX = canvasRef.current.width / rect.width;
//     const scaleY = canvasRef.current.height / rect.height;
//     const mouseX = (e.clientX - rect.left) * scaleX;
//     const mouseY = (e.clientY - rect.top) * scaleY;
    
//     const textFields = ['companyName', 'companyAddress', 'companyEmail', 'companyPhone', 'receiptTitle', 'receiptNo', 'receiptDate', 'message'];
    
//     for (const field of textFields) {
//       const style = textStyles[field];
//       if (!style || !style.show) continue;

//       let text = '';
//       if (field === 'receiptNo') text = `${getDisplayText('receiptNoLabel')} ${receiptData.receiptNo}`;
//       else if (field === 'receiptDate') text = `${getDisplayText('dateLabel')} ${receiptData.receiptDate}`;
//       else if (field === 'message') text = receiptData.message || (language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!');
//       else text = getDisplayText(field);

//       if (!text) continue;

//       const tempCanvas = document.createElement('canvas');
//       const tempCtx = tempCanvas.getContext('2d');
//       let fontStyle = style.italic ? 'italic ' : '';
//       fontStyle += style.fontWeight;
//       tempCtx.font = `${fontStyle} ${style.fontSize}px ${receiptData.fontFamily}`;
//       const textWidth = tempCtx.measureText(text).width;
//       const textHeight = style.fontSize;

//       if (
//         mouseX >= style.x - 10 &&
//         mouseX <= style.x + textWidth + 10 &&
//         mouseY >= style.y - textHeight - 5 &&
//         mouseY <= style.y + 5
//       ) {
//         setIsDragging(true);
//         setDragTarget({ type: 'text', field });
//         setDragStart({ x: mouseX - style.x, y: mouseY - style.y });
//         return;
//       }
//     }

//     if (receiptData.showLogo && previewImage && logoSettings.show) {
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

//   const handleTemplateUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) { 
//       setErrorMessage(language === 'hi' ? 'टेम्पलेट का आकार 5MB से कम होना चाहिए' : 'Template size should be less than 5MB'); 
//       return; 
//     }
//     setTemplateImage(URL.createObjectURL(file));
//     setOriginalTemplateFile(file);
//     setReceiptData({ ...receiptData, useTemplate: true });
//     setShowTemplatePicker(false);
//   };

//   const selectTemplate = (template) => {
//     setTemplateImage(template.image);
//     setOriginalTemplateFile(null);
//     setReceiptData({ ...receiptData, useTemplate: true });
//     setShowTemplatePicker(false);
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 2 * 1024 * 1024) { 
//       setErrorMessage(language === 'hi' ? 'लोगो का आकार 2MB से कम होना चाहिए' : 'Logo size should be less than 2MB'); 
//       return; 
//     }
//     setReceiptData({ ...receiptData, logo: file });
//     setPreviewImage(URL.createObjectURL(file));
//   };

//   const downloadReceipt = async () => {
//     if (receiptData.useTemplate && canvasRef.current) {
//       const link = document.createElement('a');
//       link.download = `receipt_${receiptData.receiptNo}.png`;
//       link.href = canvasRef.current.toDataURL('image/png');
//       link.click();
//     } else if (receiptRef.current) {
//       try {
//         const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: null, useCORS: true, logging: false });
//         const link = document.createElement('a');
//         link.download = `receipt_${receiptData.receiptNo}.png`;
//         link.href = canvas.toDataURL('image/png');
//         link.click();
//       } catch (error) {
//         setErrorMessage(language === 'hi' ? 'रसीद डाउनलोड करने में विफल' : 'Failed to download receipt');
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage('');
    
//     const formData = new FormData();
//     formData.append('companyName', receiptData.companyName || '');
//     formData.append('companyAddress', receiptData.companyAddress || '');
//     formData.append('companyEmail', receiptData.companyEmail || '');
//     formData.append('companyPhone', receiptData.companyPhone || '');
//     formData.append('receiptTitle', receiptData.receiptTitle || '');
//     formData.append('receiptNo', receiptData.receiptNo || '');
//     formData.append('receiptDate', receiptData.receiptDate || '');
//     formData.append('message', receiptData.message || '');
//     formData.append('textStyles', JSON.stringify(textStyles));
//     formData.append('logoSettings', JSON.stringify(logoSettings));
//     formData.append('useTemplate', receiptData.useTemplate ? 'true' : 'false');
//     formData.append('language', language);
//     formData.append('design', JSON.stringify({
//       backgroundColor: receiptData.backgroundColor,
//       textColor: receiptData.textColor,
//       accentColor: receiptData.accentColor,
//       fontFamily: receiptData.fontFamily,
//       showLogo: receiptData.showLogo,
//       roundedCorners: receiptData.roundedCorners,
//       shadow: receiptData.shadow,
//       border: receiptData.border
//     }));
    
//     if (receiptData.logo) formData.append('logo', receiptData.logo);
    
//     let templateBlob = null;
//     if (originalTemplateFile) {
//       templateBlob = await resizeImageToCanvasSize(originalTemplateFile);
//     } else if (templateImage && receiptData.useTemplate) {
//       const response = await fetch(templateImage);
//       const blob = await response.blob();
//       const file = new File([blob], 'template.png', { type: 'image/png' });
//       templateBlob = await resizeImageToCanvasSize(file);
//     }
//     if (templateBlob) formData.append('templateImage', templateBlob, 'template.png');
    
//     let finalImageBlob = null;
//     if (receiptData.useTemplate && canvasRef.current && templateImage) {
//       try {
//         finalImageBlob = await new Promise(resolve => canvasRef.current.toBlob(resolve, 'image/png'));
//       } catch (err) {
//         console.error('Error capturing canvas:', err);
//       }
//     } else if (receiptRef.current) {
//       try {
//         const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: null, useCORS: true });
//         finalImageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
//       } catch (err) {
//         console.error('Error capturing receipt:', err);
//       }
//     }
//     if (finalImageBlob) formData.append('previewImage', finalImageBlob, 'preview.png');
    
//     try {
//       const response = await axios.post(
//         'https://designback.onrender.com/api/admin/createreceipt',
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       setSuccessMessage(language === 'hi' ? 'रसीद सफलतापूर्वक बनाई गई!' : 'Receipt created successfully!');
//       setTimeout(() => navigate('/receipts'), 2000);
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || error.message || (language === 'hi' ? 'रसीद बनाने में त्रुटि' : 'Error creating receipt'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderReceipt = () => {
//     const receiptStyle = {
//       backgroundColor: receiptData.backgroundColor,
//       color: receiptData.textColor,
//       fontFamily: receiptData.fontFamily,
//       fontSize: '14px',
//       borderRadius: receiptData.roundedCorners ? '16px' : '0',
//       boxShadow: receiptData.shadow ? '0 20px 35px -10px rgba(0,0,0,0.2)' : 'none',
//       border: receiptData.border ? `1px solid ${receiptData.accentColor}20` : 'none',
//       maxWidth: '800px',
//       margin: '0 auto',
//       position: 'relative',
//       overflow: 'hidden',
//       padding: '40px',
//       minHeight: '500px'
//     };
    
//     return (
//       <div ref={receiptRef} style={receiptStyle}>
//         <div className="d-flex justify-content-between align-items-start mb-4">
//           <div>
//             {receiptData.showLogo && previewImage && logoSettings.show && (
//               <img src={previewImage} alt="Logo" style={{ 
//                 width: `${logoSettings.width}px`, 
//                 height: `${logoSettings.height}px`,
//                 objectFit: 'contain', 
//                 ...getLogoShapeStyle(),
//                 border: logoSettings.borderWidth > 0 ? `${logoSettings.borderWidth}px solid ${logoSettings.borderColor}` : 'none',
//                 marginBottom: '15px'
//               }} />
//             )}
//             <h2 style={{ color: receiptData.accentColor, marginBottom: '5px', fontSize: '28px' }}>{getDisplayText('companyName')}</h2>
//             <p style={{ fontSize: '11px', marginBottom: '2px', color: '#666' }}>{getDisplayText('companyAddress')}</p>
//             <p style={{ fontSize: '11px', marginBottom: '2px', color: '#666' }}>{getDisplayText('companyEmail')}</p>
//             <p style={{ fontSize: '11px', marginBottom: '0', color: '#666' }}>{getDisplayText('companyPhone')}</p>
//           </div>
//           <div className="text-end">
//             <h3 style={{ color: receiptData.accentColor, fontSize: '24px' }}>{getDisplayText('receiptTitle')}</h3>
//             <p style={{ fontSize: '12px', marginBottom: '5px' }}><strong>{getDisplayText('receiptNoLabel')}</strong> {receiptData.receiptNo}</p>
//             <p style={{ fontSize: '12px', marginBottom: '0' }}><strong>{getDisplayText('dateLabel')}</strong> {receiptData.receiptDate}</p>
//           </div>
//         </div>

//         <hr style={{ borderColor: receiptData.accentColor, marginBottom: '30px' }} />

//         <div className="text-center p-4" style={{ backgroundColor: `${receiptData.accentColor}05`, borderRadius: '12px', minHeight: '200px' }}>
//           <p style={{ fontSize: '14px', color: receiptData.textColor, marginBottom: '0' }}>
//             {receiptData.message || (language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!')}
//           </p>
//         </div>

//         <div style={{ textAlign: 'center', fontSize: '11px', color: '#999', borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '30px' }}>
//           <p style={{ marginBottom: '0' }}>{language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!'}</p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Container fluid className="my-5">
//       <Row>
//         <Col md={6}>
//           <Card className="shadow-lg border-0">
//             <CardBody className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <CardTitle tag="h3" className="text-success mb-0">
//                   <FaReceipt className="me-2" />{language === 'hi' ? 'रसीद बनाएं' : 'Create Receipt'}
//                 </CardTitle>
//                 <div>
//                   <Button 
//                     color={language === 'en' ? 'success' : 'secondary'} 
//                     size="sm" 
//                     onClick={() => setLanguage('en')}
//                     className="me-2"
//                   >
//                     <FaLanguage /> English
//                   </Button>
//                   <Button 
//                     color={language === 'hi' ? 'success' : 'secondary'} 
//                     size="sm" 
//                     onClick={() => setLanguage('hi')}
//                   >
//                     <FaLanguage /> हिंदी
//                   </Button>
//                 </div>
//               </div>

//               {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
//               {successMessage && <Alert color="success">{successMessage}</Alert>}

//               {/* Template Section */}
//               <div className="mb-4 p-3 border rounded bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <Label className="fw-bold mb-0"><FaImages className="me-2" />{language === 'hi' ? 'रसीद टेम्पलेट' : 'Receipt Template'}</Label>
//                   <Button size="sm" color="success" onClick={() => setShowTemplatePicker(!showTemplatePicker)}>
//                     {receiptData.useTemplate ? (language === 'hi' ? 'टेम्पलेट बदलें' : 'Change Template') : (language === 'hi' ? 'टेम्पलेट अपलोड करें' : 'Upload Template')}
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
//                 {receiptData.useTemplate && templateImage && (
//                   <Alert color="success" className="mt-2 mb-0">
//                     <FaCheckCircle className="me-1" /> {language === 'hi' ? 'टेम्पलेट लोड हो गया!' : 'Template loaded!'}
//                   </Alert>
//                 )}
//               </div>

//               <Nav tabs className="mb-3">
//                 <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}><FaBuilding /> {language === 'hi' ? 'कंपनी की जानकारी' : 'Company Info'}</NavLink></NavItem>
//                 <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><FaPalette /> {language === 'hi' ? 'टेक्स्ट स्टाइल' : 'Text Style'}</NavLink></NavItem>
//                 <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><FaImages /> {language === 'hi' ? 'लोगो और मीडिया' : 'Logo & Media'}</NavLink></NavItem>
//               </Nav>

//               <Form onSubmit={handleSubmit}>
//                 <TabContent activeTab={activeTab}>
//                   {/* Tab 1: Company Info */}
//                   <TabPane tabId="1">
//                     <FormGroup>
//                       <Label>{language === 'hi' ? 'कंपनी का नाम *' : 'Company Name *'}</Label>
//                       <Input value={receiptData.companyName} onChange={(e) => setReceiptData({...receiptData, companyName: e.target.value})} />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>{language === 'hi' ? 'कंपनी का पता' : 'Company Address'}</Label>
//                       <Input value={receiptData.companyAddress} onChange={(e) => setReceiptData({...receiptData, companyAddress: e.target.value})} />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>{language === 'hi' ? 'कंपनी ईमेल' : 'Company Email'}</Label>
//                       <Input type="email" value={receiptData.companyEmail} onChange={(e) => setReceiptData({...receiptData, companyEmail: e.target.value})} />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>{language === 'hi' ? 'कंपनी फोन' : 'Company Phone'}</Label>
//                       <Input value={receiptData.companyPhone} onChange={(e) => setReceiptData({...receiptData, companyPhone: e.target.value})} />
//                     </FormGroup>
//                     <FormGroup>
//                       <Label>{language === 'hi' ? 'रसीद शीर्षक' : 'Receipt Title'}</Label>
//                       <Input value={receiptData.receiptTitle} onChange={(e) => setReceiptData({...receiptData, receiptTitle: e.target.value})} />
//                     </FormGroup>
//                     <Row>
//                       <Col md={6}>
//                         <FormGroup>
//                           <Label>{language === 'hi' ? 'रसीद संख्या' : 'Receipt No'}</Label>
//                           <Input value={receiptData.receiptNo} onChange={(e) => setReceiptData({...receiptData, receiptNo: e.target.value})} />
//                         </FormGroup>
//                       </Col>
//                       <Col md={6}>
//                         <FormGroup>
//                           <Label>{language === 'hi' ? 'रसीद तारीख' : 'Receipt Date'}</Label>
//                           <Input type="date" value={receiptData.receiptDate} onChange={(e) => setReceiptData({...receiptData, receiptDate: e.target.value})} />
//                         </FormGroup>
//                       </Col>
//                     </Row>
//                     <FormGroup>
//                       <Label>{language === 'hi' ? 'संदेश' : 'Message'}</Label>
//                       <Input type="textarea" rows="3" value={receiptData.message} onChange={(e) => setReceiptData({...receiptData, message: e.target.value})} />
//                     </FormGroup>
//                   </TabPane>

//                   {/* Tab 2: Text Style */}
//                   <TabPane tabId="2">
//                     <FormGroup>
//                       <Label>{language === 'hi' ? 'स्टाइल करने के लिए फ़ील्ड चुनें' : 'Select Field to Style'}</Label>
//                       <Input type="select" value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
//                         <option value="companyName">{language === 'hi' ? 'कंपनी का नाम' : 'Company Name'}</option>
//                         <option value="companyAddress">{language === 'hi' ? 'कंपनी का पता' : 'Company Address'}</option>
//                         <option value="companyEmail">{language === 'hi' ? 'कंपनी ईमेल' : 'Company Email'}</option>
//                         <option value="companyPhone">{language === 'hi' ? 'कंपनी फोन' : 'Company Phone'}</option>
//                         <option value="receiptTitle">{language === 'hi' ? 'रसीद शीर्षक' : 'Receipt Title'}</option>
//                         <option value="receiptNo">{language === 'hi' ? 'रसीद संख्या' : 'Receipt No'}</option>
//                         <option value="receiptDate">{language === 'hi' ? 'रसीद तारीख' : 'Receipt Date'}</option>
//                         <option value="message">{language === 'hi' ? 'संदेश' : 'Message'}</option>
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
//                         {receiptData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />{language === 'hi' ? 'प्रीव्यू पर इस तत्व को खींचकर पुनः स्थित करें' : 'Click and drag this element on preview to reposition'}</Alert>}
//                       </>
//                     )}
//                     <hr />
//                     <h6 className="mt-3">{language === 'hi' ? 'रसीद डिज़ाइन' : 'Receipt Design'}</h6>
//                     <Row>
//                       <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'पृष्ठभूमि रंग' : 'Background Color'}</Label><Input type="color" value={receiptData.backgroundColor} onChange={(e) => setReceiptData({...receiptData, backgroundColor: e.target.value})} /></FormGroup></Col>
//                       <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'टेक्स्ट रंग' : 'Text Color'}</Label><Input type="color" value={receiptData.textColor} onChange={(e) => setReceiptData({...receiptData, textColor: e.target.value})} /></FormGroup></Col>
//                       <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'एक्सेंट रंग' : 'Accent Color'}</Label><Input type="color" value={receiptData.accentColor} onChange={(e) => setReceiptData({...receiptData, accentColor: e.target.value})} /></FormGroup></Col>
//                       <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'फ़ॉन्ट परिवार' : 'Font Family'}</Label><Input type="select" value={receiptData.fontFamily} onChange={(e) => setReceiptData({...receiptData, fontFamily: e.target.value})}><option>Poppins</option><option>Arial</option><option>Helvetica</option><option>Georgia</option></Input></FormGroup></Col>
//                     </Row>
//                     <FormGroup check><Label check><Input type="checkbox" checked={receiptData.roundedCorners} onChange={(e) => setReceiptData({...receiptData, roundedCorners: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'गोल कोने' : 'Rounded Corners'}</span></Label></FormGroup>
//                     <FormGroup check><Label check><Input type="checkbox" checked={receiptData.shadow} onChange={(e) => setReceiptData({...receiptData, shadow: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'छाया दिखाएं' : 'Show Shadow'}</span></Label></FormGroup>
//                     <FormGroup check><Label check><Input type="checkbox" checked={receiptData.border} onChange={(e) => setReceiptData({...receiptData, border: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'बॉर्डर दिखाएं' : 'Show Border'}</span></Label></FormGroup>
//                   </TabPane>

//                   {/* Tab 3: Logo & Media */}
//                   <TabPane tabId="3">
//                     <FormGroup>
//                       <Label>{language === 'hi' ? 'लोगो छवि' : 'Logo Image'}</Label>
//                       <div className="border rounded p-3 text-center" onClick={() => logoInputRef.current.click()} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
//                         {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p>{language === 'hi' ? 'लोगो अपलोड करें' : 'Upload Logo'}</p></>}
//                       </div>
//                       <input ref={logoInputRef} type="file" hidden onChange={handleLogoChange} accept="image/*" />
//                     </FormGroup>
//                     <FormGroup check>
//                       <Label check><Input type="checkbox" checked={receiptData.showLogo} onChange={(e) => setReceiptData({...receiptData, showLogo: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'रसीद पर लोगो दिखाएं' : 'Show Logo on Receipt'}</span></Label>
//                     </FormGroup>
//                     {receiptData.showLogo && previewImage && (
//                       <>
//                         <h6 className="mt-3">{language === 'hi' ? 'लोगो कस्टमाइज़ेशन' : 'Logo Customization'}</h6>
//                         <Row>
//                           <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'चौड़ाई (px)' : 'Width (px)'}</Label><Input type="number" value={logoSettings.width} onChange={(e) => updateLogoSize(parseInt(e.target.value), logoSettings.height)} /></FormGroup></Col>
//                           <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'ऊंचाई (px)' : 'Height (px)'}</Label><Input type="number" value={logoSettings.height} onChange={(e) => updateLogoSize(logoSettings.width, parseInt(e.target.value))} /></FormGroup></Col>
//                         </Row>
//                         <FormGroup>
//                           <Label>{language === 'hi' ? 'लोगो आकार' : 'Logo Shape'}</Label>
//                           <div className="d-flex gap-3">
//                             <Button size="sm" color={logoSettings.shape === 'rectangle' ? 'success' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rectangle'})}><FaSquare /> {language === 'hi' ? 'आयत' : 'Rectangle'}</Button>
//                             <Button size="sm" color={logoSettings.shape === 'rounded' ? 'success' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rounded'})}><FaSquare /> {language === 'hi' ? 'गोल' : 'Rounded'}</Button>
//                             <Button size="sm" color={logoSettings.shape === 'circle' ? 'success' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'circle'})}><FaRegCircle /> {language === 'hi' ? 'वृत्त' : 'Circle'}</Button>
//                           </div>
//                         </FormGroup>
//                         {(logoSettings.shape === 'rounded' || logoSettings.shape === 'rectangle') && (
//                           <Row><Col xs={6}><FormGroup><Label>{language === 'hi' ? 'बॉर्डर त्रिज्या (px)' : 'Border Radius (px)'}</Label><Input type="number" value={logoSettings.borderRadius} onChange={(e) => setLogoSettings({...logoSettings, borderRadius: parseInt(e.target.value)})} /></FormGroup></Col></Row>
//                         )}
//                         <Row>
//                           <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'बॉर्डर चौड़ाई (px)' : 'Border Width (px)'}</Label><Input type="number" value={logoSettings.borderWidth} onChange={(e) => setLogoSettings({...logoSettings, borderWidth: parseInt(e.target.value)})} /></FormGroup></Col>
//                           {logoSettings.borderWidth > 0 && (
//                             <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'बॉर्डर रंग' : 'Border Color'}</Label><Input type="color" value={logoSettings.borderColor} onChange={(e) => setLogoSettings({...logoSettings, borderColor: e.target.value})} /></FormGroup></Col>
//                           )}
//                         </Row>
//                         {receiptData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />{language === 'hi' ? 'प्रीव्यू पर लोगो को खींचकर पुनः स्थित करें' : 'Click and drag logo on preview to reposition'}</Alert>}
//                       </>
//                     )}
//                   </TabPane>
//                 </TabContent>

//                 <div className="d-flex justify-content-end gap-2 mt-4">
//                   <Button color="secondary" onClick={() => navigate('/receipts')}>{language === 'hi' ? 'रद्द करें' : 'Cancel'}</Button>
//                   <Button color="success" type="submit" disabled={loading}>
//                     {loading ? <><FaSpinner className="spinner-border-sm me-1" /> {language === 'hi' ? 'बना रहा है...' : 'Creating...'}</> : <><FaSave /> {language === 'hi' ? 'रसीद बनाएं' : 'Create Receipt'}</>}
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
//                 {receiptData.useTemplate && <small className="d-block text-muted"><FaMousePointer /> {language === 'hi' ? 'किसी भी तत्व को खींचकर पुनः स्थित करें' : 'Click and drag ANY element to reposition'}</small>}
//               </CardTitle>
//               <div className="preview-container" style={{ maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
//                 {receiptData.useTemplate && templateImage ? (
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
//                 ) : renderReceipt()}
//               </div>
//               <div className="d-flex gap-2 mt-3">
//                 <Button color="success" onClick={downloadReceipt} className="flex-grow-1"><FaDownload /> {language === 'hi' ? 'रसीद डाउनलोड करें' : 'Download Receipt'}</Button>
//                 <Button color="info" onClick={() => setShowFullPreview(true)} className="flex-grow-1"><FaEye /> {language === 'hi' ? 'पूर्ण प्रीव्यू' : 'Full Preview'}</Button>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>

//       {/* Full Preview Modal */}
//       {showFullPreview && (
//         <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content bg-transparent border-0">
//               <div className="modal-body text-center">
//                 {receiptData.useTemplate && templateImage
//                   ? <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} width="800" height="1000" />
//                   : renderReceipt()
//                 }
//                 <div className="mt-3">
//                   <Button color="success" onClick={downloadReceipt}><FaDownload /> {language === 'hi' ? 'डाउनलोड' : 'Download'}</Button>
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

// export default CreateReceipt;



// CreateReceipt.jsx - COMPLETE WITH FRAME SIZES
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
  FaRegCircle,
  FaReceipt,
  FaLanguage,
  FaRulerCombined
} from 'react-icons/fa';
import html2canvas from 'html2canvas';

const CreateReceipt = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [language, setLanguage] = useState('en');
  
  // Frame size options
  const frameSizes = {
    a4: { name: 'A4', width: 800, height: 1131 },
    letter: { name: 'Letter', width: 800, height: 1035 },
    square: { name: 'Square', width: 800, height: 800 },
    wide: { name: 'Wide', width: 900, height: 600 },
    custom: { name: 'Custom', width: 800, height: 1000 }
  };
  
  const [selectedFrame, setSelectedFrame] = useState('a4');
  const [customSize, setCustomSize] = useState({ width: 800, height: 1000 });
  
  const [templateImage, setTemplateImage] = useState(null);
  const [originalTemplateFile, setOriginalTemplateFile] = useState(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  
  const [logoSettings, setLogoSettings] = useState({
    x: 50,
    y: 50,
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 0,
    borderColor: '#000000',
    shape: 'rectangle',
    show: true
  });
  
  // Hindi translations
  const hindiTranslations = {
    receiptTitle: 'भुगतान रसीद',
    receiptNo: 'रसीद संख्या',
    date: 'तारीख',
    thankYou: 'आपके व्यवसाय के लिए धन्यवाद!',
    companyName: 'मेरा व्यवसाय प्राइवेट लिमिटेड',
    companyAddress: '123 बिजनेस स्ट्रीट, डाउनटाउन, शहर - 123456',
    companyEmail: 'info@mybusiness.com',
    companyPhone: '+91 98765 43210',
  };

  const [receiptData, setReceiptData] = useState({
    companyName: 'My Business Pvt Ltd',
    companyAddress: '123 Business Street, Downtown, City - 123456',
    companyEmail: 'info@mybusiness.com',
    companyPhone: '+91 98765 43210',
    receiptTitle: 'PAYMENT RECEIPT',
    receiptNo: 'RCP-001',
    receiptDate: new Date().toISOString().split('T')[0],
    logo: null,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#10b981',
    fontFamily: 'Poppins',
    showLogo: true,
    roundedCorners: true,
    shadow: true,
    border: true,
    useTemplate: false,
    message: 'Thank you for your business!'
  });
  
  const [textStyles, setTextStyles] = useState({
    companyName:    { fontSize: 28, fontWeight: 'bold',   color: '#000000', italic: false, underline: false, x: 80, y: 80,  show: true },
    companyAddress: { fontSize: 11, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 80, y: 130, show: true },
    companyEmail:   { fontSize: 11, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 80, y: 155, show: true },
    companyPhone:   { fontSize: 11, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 80, y: 180, show: true },
    receiptTitle:   { fontSize: 24, fontWeight: 'bold',   color: '#10b981', italic: false, underline: true,  x: 400, y: 280, show: true },
    receiptNo:      { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 650, y: 250, show: true },
    receiptDate:    { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 650, y: 270, show: true },
    message:        { fontSize: 12, fontWeight: 'normal', color: '#999999', italic: true,  underline: false, x: 400, y: 800, show: true }
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState('companyName');
  
  const logoInputRef = useRef(null);
  const templateInputRef = useRef(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const receiptRef = useRef(null);

  // Get current dimensions
  const getCurrentDimensions = () => {
    if (selectedFrame === 'custom') {
      return { width: customSize.width, height: customSize.height };
    }
    const frame = frameSizes[selectedFrame];
    return { width: frame.width, height: frame.height };
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

  // Handle frame change
  const handleFrameChange = async (frameId) => {
    const oldDimensions = getCurrentDimensions();
    setSelectedFrame(frameId);
    
    const newDimensions = frameId === 'custom' ? customSize : frameSizes[frameId];
    const scaleX = newDimensions.width / oldDimensions.width;
    const scaleY = newDimensions.height / oldDimensions.height;
    
    // Adjust text positions proportionally
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
    
    // Resize template image if it exists
    if (templateImage && originalTemplateFile) {
      const resizedBlob = await resizeImageToCanvasSize(originalTemplateFile, newDimensions.width, newDimensions.height);
      const resizedUrl = URL.createObjectURL(resizedBlob);
      setTemplateImage(resizedUrl);
      setOriginalTemplateFile(new File([resizedBlob], 'template.png', { type: 'image/png' }));
    }
  };

  const getDisplayText = (field) => {
    if (language === 'hi') {
      switch(field) {
        case 'companyName': return receiptData.companyName || hindiTranslations.companyName;
        case 'companyAddress': return receiptData.companyAddress || hindiTranslations.companyAddress;
        case 'companyEmail': return receiptData.companyEmail || hindiTranslations.companyEmail;
        case 'companyPhone': return receiptData.companyPhone || hindiTranslations.companyPhone;
        case 'receiptTitle': return hindiTranslations.receiptTitle;
        case 'receiptNoLabel': return `${hindiTranslations.receiptNo}:`;
        case 'dateLabel': return `${hindiTranslations.date}:`;
        case 'message': return receiptData.message || hindiTranslations.thankYou;
        default: return receiptData[field];
      }
    }
    return receiptData[field];
  };

  const sampleTemplates = [
    { id: 1, name: language === 'hi' ? 'आधुनिक' : 'Modern', image: 'https://placehold.co/800x1131/10b981/white?text=Modern+Receipt' },
    { id: 2, name: language === 'hi' ? 'क्लासिक' : 'Classic', image: 'https://placehold.co/800x1131/f3f4f6/black?text=Classic+Receipt' },
    { id: 3, name: language === 'hi' ? 'प्रोफेशनल' : 'Professional', image: 'https://placehold.co/800x1131/1f2937/white?text=Professional+Receipt' },
    { id: 4, name: language === 'hi' ? 'मिनिमल' : 'Minimal', image: 'https://placehold.co/800x1131/ffffff/black?text=Minimal+Receipt' }
  ];

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
    if (receiptData.useTemplate && templateImage && canvasRef.current) {
      drawCanvasWithOverlays(true);
    }
  }, [templateImage, receiptData, textStyles, previewImage, logoSettings, language, selectedFrame, customSize]);

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
        const fields = ['companyName', 'companyAddress', 'companyEmail', 'companyPhone', 'receiptTitle', 'receiptNo', 'receiptDate', 'message'];
        
        fields.forEach(field => {
          if (textStyles[field]?.show) {
            let text = '';
            if (field === 'receiptNo') text = `${getDisplayText('receiptNoLabel')} ${receiptData.receiptNo}`;
            else if (field === 'receiptDate') text = `${getDisplayText('dateLabel')} ${receiptData.receiptDate}`;
            else if (field === 'message') text = receiptData.message || (language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!');
            else text = getDisplayText(field);
            
            if (text) drawText(ctx, text, textStyles[field], receiptData.fontFamily);
          }
        });
        
        if (receiptData.showLogo && previewImage && logoSettings.show) {
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
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';

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
        ctx.lineWidth = settings.borderWidth;
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
    if (!receiptData.useTemplate) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    const textFields = ['companyName', 'companyAddress', 'companyEmail', 'companyPhone', 'receiptTitle', 'receiptNo', 'receiptDate', 'message'];
    
    for (const field of textFields) {
      const style = textStyles[field];
      if (!style || !style.show) continue;

      let text = '';
      if (field === 'receiptNo') text = `${getDisplayText('receiptNoLabel')} ${receiptData.receiptNo}`;
      else if (field === 'receiptDate') text = `${getDisplayText('dateLabel')} ${receiptData.receiptDate}`;
      else if (field === 'message') text = receiptData.message || (language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!');
      else text = getDisplayText(field);

      if (!text) continue;

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      let fontStyle = style.italic ? 'italic ' : '';
      fontStyle += style.fontWeight;
      tempCtx.font = `${fontStyle} ${style.fontSize}px ${receiptData.fontFamily}`;
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

    if (receiptData.showLogo && previewImage && logoSettings.show) {
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
    setReceiptData({ ...receiptData, useTemplate: true });
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
    setReceiptData({ ...receiptData, useTemplate: true });
    setShowTemplatePicker(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { 
      setErrorMessage(language === 'hi' ? 'लोगो का आकार 2MB से कम होना चाहिए' : 'Logo size should be less than 2MB'); 
      return; 
    }
    setReceiptData({ ...receiptData, logo: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const downloadReceipt = async () => {
    if (receiptData.useTemplate && canvasRef.current) {
      const link = document.createElement('a');
      link.download = `receipt_${receiptData.receiptNo}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    } else if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: null, useCORS: true, logging: false });
        const link = document.createElement('a');
        link.download = `receipt_${receiptData.receiptNo}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        setErrorMessage(language === 'hi' ? 'रसीद डाउनलोड करने में विफल' : 'Failed to download receipt');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    const dimensions = getCurrentDimensions();
    const formData = new FormData();
    
    formData.append('companyName', receiptData.companyName || '');
    formData.append('companyAddress', receiptData.companyAddress || '');
    formData.append('companyEmail', receiptData.companyEmail || '');
    formData.append('companyPhone', receiptData.companyPhone || '');
    formData.append('receiptTitle', receiptData.receiptTitle || '');
    formData.append('receiptNo', receiptData.receiptNo || '');
    formData.append('receiptDate', receiptData.receiptDate || '');
    formData.append('message', receiptData.message || '');
    formData.append('textStyles', JSON.stringify(textStyles));
    formData.append('logoSettings', JSON.stringify(logoSettings));
    formData.append('useTemplate', receiptData.useTemplate ? 'true' : 'false');
    formData.append('language', language);
    formData.append('frameSize', JSON.stringify(dimensions));
    formData.append('design', JSON.stringify({
      backgroundColor: receiptData.backgroundColor,
      textColor: receiptData.textColor,
      accentColor: receiptData.accentColor,
      fontFamily: receiptData.fontFamily,
      showLogo: receiptData.showLogo,
      roundedCorners: receiptData.roundedCorners,
      shadow: receiptData.shadow,
      border: receiptData.border
    }));
    
    if (receiptData.logo) formData.append('logo', receiptData.logo);
    
    let templateBlob = null;
    if (originalTemplateFile) {
      templateBlob = await resizeImageToCanvasSize(originalTemplateFile, dimensions.width, dimensions.height);
    } else if (templateImage && receiptData.useTemplate) {
      const response = await fetch(templateImage);
      const blob = await response.blob();
      const file = new File([blob], 'template.png', { type: 'image/png' });
      templateBlob = await resizeImageToCanvasSize(file, dimensions.width, dimensions.height);
    }
    if (templateBlob) formData.append('templateImage', templateBlob, 'template.png');
    
    let finalImageBlob = null;
    if (receiptData.useTemplate && canvasRef.current && templateImage) {
      try {
        finalImageBlob = await new Promise(resolve => canvasRef.current.toBlob(resolve, 'image/png'));
      } catch (err) {
        console.error('Error capturing canvas:', err);
      }
    } else if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: null, useCORS: true });
        finalImageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      } catch (err) {
        console.error('Error capturing receipt:', err);
      }
    }
    if (finalImageBlob) formData.append('previewImage', finalImageBlob, 'preview.png');
    
    try {
      const response = await axios.post(
        'https://designback.onrender.com/api/admin/createreceipt',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setSuccessMessage(language === 'hi' ? 'रसीद सफलतापूर्वक बनाई गई!' : 'Receipt created successfully!');
      setTimeout(() => navigate('/receipts'), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || (language === 'hi' ? 'रसीद बनाने में त्रुटि' : 'Error creating receipt'));
    } finally {
      setLoading(false);
    }
  };

  const renderReceipt = () => {
    const dimensions = getCurrentDimensions();
    const receiptStyle = {
      backgroundColor: receiptData.backgroundColor,
      color: receiptData.textColor,
      fontFamily: receiptData.fontFamily,
      fontSize: '14px',
      borderRadius: receiptData.roundedCorners ? '16px' : '0',
      boxShadow: receiptData.shadow ? '0 20px 35px -10px rgba(0,0,0,0.2)' : 'none',
      border: receiptData.border ? `1px solid ${receiptData.accentColor}20` : 'none',
      width: `${dimensions.width}px`,
      height: `${dimensions.height}px`,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column'
    };
    
    return (
      <div ref={receiptRef} style={receiptStyle}>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            {receiptData.showLogo && previewImage && logoSettings.show && (
              <img src={previewImage} alt="Logo" style={{ 
                width: `${logoSettings.width}px`, 
                height: `${logoSettings.height}px`,
                objectFit: 'contain', 
                ...getLogoShapeStyle(),
                border: logoSettings.borderWidth > 0 ? `${logoSettings.borderWidth}px solid ${logoSettings.borderColor}` : 'none',
                marginBottom: '15px'
              }} />
            )}
            <h2 style={{ color: receiptData.accentColor, marginBottom: '5px', fontSize: '28px' }}>{getDisplayText('companyName')}</h2>
            <p style={{ fontSize: '11px', marginBottom: '2px', color: '#666' }}>{getDisplayText('companyAddress')}</p>
            <p style={{ fontSize: '11px', marginBottom: '2px', color: '#666' }}>{getDisplayText('companyEmail')}</p>
            <p style={{ fontSize: '11px', marginBottom: '0', color: '#666' }}>{getDisplayText('companyPhone')}</p>
          </div>
          <div className="text-end">
            <h3 style={{ color: receiptData.accentColor, fontSize: '24px' }}>{getDisplayText('receiptTitle')}</h3>
            <p style={{ fontSize: '12px', marginBottom: '5px' }}><strong>{getDisplayText('receiptNoLabel')}</strong> {receiptData.receiptNo}</p>
            <p style={{ fontSize: '12px', marginBottom: '0' }}><strong>{getDisplayText('dateLabel')}</strong> {receiptData.receiptDate}</p>
          </div>
        </div>

        <hr style={{ borderColor: receiptData.accentColor, marginBottom: '30px' }} />

        <div className="text-center p-4" style={{ backgroundColor: `${receiptData.accentColor}05`, borderRadius: '12px', flex: 1 }}>
          <p style={{ fontSize: '14px', color: receiptData.textColor, marginBottom: '0' }}>
            {receiptData.message || (language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!')}
          </p>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#999', borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '20px' }}>
          <p style={{ marginBottom: '0' }}>{language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!'}</p>
        </div>
      </div>
    );
  };

  const dimensions = getCurrentDimensions();

  return (
    <Container fluid className="my-5">
      <Row>
        <Col md={6}>
          <Card className="shadow-lg border-0">
            <CardBody className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h3" className="text-success mb-0">
                  <FaReceipt className="me-2" />{language === 'hi' ? 'रसीद बनाएं' : 'Create Receipt'}
                </CardTitle>
                <div>
                  <Button 
                    color={language === 'en' ? 'success' : 'secondary'} 
                    size="sm" 
                    onClick={() => setLanguage('en')}
                    className="me-2"
                  >
                    <FaLanguage /> English
                  </Button>
                  <Button 
                    color={language === 'hi' ? 'success' : 'secondary'} 
                    size="sm" 
                    onClick={() => setLanguage('hi')}
                  >
                    <FaLanguage /> हिंदी
                  </Button>
                </div>
              </div>

              {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
              {successMessage && <Alert color="success">{successMessage}</Alert>}

              {/* Frame Size Selection */}
              <div className="mb-4 p-3 border rounded bg-light">
                <Label className="fw-bold mb-2">
                  <FaRulerCombined className="me-2" />
                  {language === 'hi' ? 'फ्रेम साइज़ चुनें' : 'Select Frame Size'}
                </Label>
                <Row>
                  <Col xs={6} md={4} className="mb-2">
                    <Button 
                      color={selectedFrame === 'a4' ? 'success' : 'outline-success'}
                      size="sm"
                      onClick={() => handleFrameChange('a4')}
                      className="w-100"
                    >
                      A4 ({frameSizes.a4.width}×{frameSizes.a4.height})
                    </Button>
                  </Col>
                  <Col xs={6} md={4} className="mb-2">
                    <Button 
                      color={selectedFrame === 'letter' ? 'success' : 'outline-success'}
                      size="sm"
                      onClick={() => handleFrameChange('letter')}
                      className="w-100"
                    >
                      Letter ({frameSizes.letter.width}×{frameSizes.letter.height})
                    </Button>
                  </Col>
                  <Col xs={6} md={4} className="mb-2">
                    <Button 
                      color={selectedFrame === 'square' ? 'success' : 'outline-success'}
                      size="sm"
                      onClick={() => handleFrameChange('square')}
                      className="w-100"
                    >
                      Square ({frameSizes.square.width}×{frameSizes.square.height})
                    </Button>
                  </Col>
                  <Col xs={6} md={4} className="mb-2">
                    <Button 
                      color={selectedFrame === 'wide' ? 'success' : 'outline-success'}
                      size="sm"
                      onClick={() => handleFrameChange('wide')}
                      className="w-100"
                    >
                      Wide ({frameSizes.wide.width}×{frameSizes.wide.height})
                    </Button>
                  </Col>
                  <Col xs={6} md={4} className="mb-2">
                    <Button 
                      color={selectedFrame === 'custom' ? 'success' : 'outline-success'}
                      size="sm"
                      onClick={() => handleFrameChange('custom')}
                      className="w-100"
                    >
                      {language === 'hi' ? 'कस्टम' : 'Custom'}
                    </Button>
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
                          handleFrameChange('custom');
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
                          handleFrameChange('custom');
                        }}
                      />
                    </Col>
                  </Row>
                )}
                
                <Alert color="info" className="mt-2 mb-0">
                  <small>✓ {language === 'hi' ? 'मौजूदा साइज़:' : 'Current Size:'} {dimensions.width}×{dimensions.height}px</small>
                </Alert>
              </div>

              {/* Template Section */}
              <div className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Label className="fw-bold mb-0"><FaImages className="me-2" />{language === 'hi' ? 'रसीद टेम्पलेट' : 'Receipt Template'}</Label>
                  <Button size="sm" color="success" onClick={() => setShowTemplatePicker(!showTemplatePicker)}>
                    {receiptData.useTemplate ? (language === 'hi' ? 'टेम्पलेट बदलें' : 'Change Template') : (language === 'hi' ? 'टेम्पलेट अपलोड करें' : 'Upload Template')}
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
                {receiptData.useTemplate && templateImage && (
                  <Alert color="success" className="mt-2 mb-0">
                    <FaCheckCircle className="me-1" /> {language === 'hi' ? 'टेम्पलेट लोड हो गया!' : 'Template loaded!'}
                  </Alert>
                )}
              </div>

              <Nav tabs className="mb-3">
                <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}><FaBuilding /> {language === 'hi' ? 'कंपनी की जानकारी' : 'Company Info'}</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><FaPalette /> {language === 'hi' ? 'टेक्स्ट स्टाइल' : 'Text Style'}</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><FaImages /> {language === 'hi' ? 'लोगो और मीडिया' : 'Logo & Media'}</NavLink></NavItem>
              </Nav>

              <Form onSubmit={handleSubmit}>
                <TabContent activeTab={activeTab}>
                  {/* Tab 1: Company Info */}
                  <TabPane tabId="1">
                    <FormGroup>
                      <Label>{language === 'hi' ? 'कंपनी का नाम *' : 'Company Name *'}</Label>
                      <Input value={receiptData.companyName} onChange={(e) => setReceiptData({...receiptData, companyName: e.target.value})} />
                    </FormGroup>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'कंपनी का पता' : 'Company Address'}</Label>
                      <Input value={receiptData.companyAddress} onChange={(e) => setReceiptData({...receiptData, companyAddress: e.target.value})} />
                    </FormGroup>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'कंपनी ईमेल' : 'Company Email'}</Label>
                      <Input type="email" value={receiptData.companyEmail} onChange={(e) => setReceiptData({...receiptData, companyEmail: e.target.value})} />
                    </FormGroup>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'कंपनी फोन' : 'Company Phone'}</Label>
                      <Input value={receiptData.companyPhone} onChange={(e) => setReceiptData({...receiptData, companyPhone: e.target.value})} />
                    </FormGroup>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'रसीद शीर्षक' : 'Receipt Title'}</Label>
                      <Input value={receiptData.receiptTitle} onChange={(e) => setReceiptData({...receiptData, receiptTitle: e.target.value})} />
                    </FormGroup>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>{language === 'hi' ? 'रसीद संख्या' : 'Receipt No'}</Label>
                          <Input value={receiptData.receiptNo} onChange={(e) => setReceiptData({...receiptData, receiptNo: e.target.value})} />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label>{language === 'hi' ? 'रसीद तारीख' : 'Receipt Date'}</Label>
                          <Input type="date" value={receiptData.receiptDate} onChange={(e) => setReceiptData({...receiptData, receiptDate: e.target.value})} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'संदेश' : 'Message'}</Label>
                      <Input type="textarea" rows="3" value={receiptData.message} onChange={(e) => setReceiptData({...receiptData, message: e.target.value})} />
                    </FormGroup>
                  </TabPane>

                  {/* Tab 2: Text Style */}
                  <TabPane tabId="2">
                    <FormGroup>
                      <Label>{language === 'hi' ? 'स्टाइल करने के लिए फ़ील्ड चुनें' : 'Select Field to Style'}</Label>
                      <Input type="select" value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
                        <option value="companyName">{language === 'hi' ? 'कंपनी का नाम' : 'Company Name'}</option>
                        <option value="companyAddress">{language === 'hi' ? 'कंपनी का पता' : 'Company Address'}</option>
                        <option value="companyEmail">{language === 'hi' ? 'कंपनी ईमेल' : 'Company Email'}</option>
                        <option value="companyPhone">{language === 'hi' ? 'कंपनी फोन' : 'Company Phone'}</option>
                        <option value="receiptTitle">{language === 'hi' ? 'रसीद शीर्षक' : 'Receipt Title'}</option>
                        <option value="receiptNo">{language === 'hi' ? 'रसीद संख्या' : 'Receipt No'}</option>
                        <option value="receiptDate">{language === 'hi' ? 'रसीद तारीख' : 'Receipt Date'}</option>
                        <option value="message">{language === 'hi' ? 'संदेश' : 'Message'}</option>
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
                        {receiptData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />{language === 'hi' ? 'प्रीव्यू पर इस तत्व को खींचकर पुनः स्थित करें' : 'Click and drag this element on preview to reposition'}</Alert>}
                      </>
                    )}
                    <hr />
                    <h6 className="mt-3">{language === 'hi' ? 'रसीद डिज़ाइन' : 'Receipt Design'}</h6>
                    <Row>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'पृष्ठभूमि रंग' : 'Background Color'}</Label><Input type="color" value={receiptData.backgroundColor} onChange={(e) => setReceiptData({...receiptData, backgroundColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'टेक्स्ट रंग' : 'Text Color'}</Label><Input type="color" value={receiptData.textColor} onChange={(e) => setReceiptData({...receiptData, textColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'एक्सेंट रंग' : 'Accent Color'}</Label><Input type="color" value={receiptData.accentColor} onChange={(e) => setReceiptData({...receiptData, accentColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'फ़ॉन्ट परिवार' : 'Font Family'}</Label><Input type="select" value={receiptData.fontFamily} onChange={(e) => setReceiptData({...receiptData, fontFamily: e.target.value})}><option>Poppins</option><option>Arial</option><option>Helvetica</option><option>Georgia</option></Input></FormGroup></Col>
                    </Row>
                    <FormGroup check><Label check><Input type="checkbox" checked={receiptData.roundedCorners} onChange={(e) => setReceiptData({...receiptData, roundedCorners: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'गोल कोने' : 'Rounded Corners'}</span></Label></FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={receiptData.shadow} onChange={(e) => setReceiptData({...receiptData, shadow: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'छाया दिखाएं' : 'Show Shadow'}</span></Label></FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={receiptData.border} onChange={(e) => setReceiptData({...receiptData, border: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'बॉर्डर दिखाएं' : 'Show Border'}</span></Label></FormGroup>
                  </TabPane>

                  {/* Tab 3: Logo & Media */}
                  <TabPane tabId="3">
                    <FormGroup>
                      <Label>{language === 'hi' ? 'लोगो छवि' : 'Logo Image'}</Label>
                      <div className="border rounded p-3 text-center" onClick={() => logoInputRef.current.click()} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                        {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p>{language === 'hi' ? 'लोगो अपलोड करें' : 'Upload Logo'}</p></>}
                      </div>
                      <input ref={logoInputRef} type="file" hidden onChange={handleLogoChange} accept="image/*" />
                    </FormGroup>
                    <FormGroup check>
                      <Label check><Input type="checkbox" checked={receiptData.showLogo} onChange={(e) => setReceiptData({...receiptData, showLogo: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'रसीद पर लोगो दिखाएं' : 'Show Logo on Receipt'}</span></Label>
                    </FormGroup>
                    {receiptData.showLogo && previewImage && (
                      <>
                        <h6 className="mt-3">{language === 'hi' ? 'लोगो कस्टमाइज़ेशन' : 'Logo Customization'}</h6>
                        <Row>
                          <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'चौड़ाई (px)' : 'Width (px)'}</Label><Input type="number" value={logoSettings.width} onChange={(e) => updateLogoSize(parseInt(e.target.value), logoSettings.height)} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'ऊंचाई (px)' : 'Height (px)'}</Label><Input type="number" value={logoSettings.height} onChange={(e) => updateLogoSize(logoSettings.width, parseInt(e.target.value))} /></FormGroup></Col>
                        </Row>
                        <FormGroup>
                          <Label>{language === 'hi' ? 'लोगो आकार' : 'Logo Shape'}</Label>
                          <div className="d-flex gap-3">
                            <Button size="sm" color={logoSettings.shape === 'rectangle' ? 'success' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rectangle'})}><FaSquare /> {language === 'hi' ? 'आयत' : 'Rectangle'}</Button>
                            <Button size="sm" color={logoSettings.shape === 'rounded' ? 'success' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rounded'})}><FaSquare /> {language === 'hi' ? 'गोल' : 'Rounded'}</Button>
                            <Button size="sm" color={logoSettings.shape === 'circle' ? 'success' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'circle'})}><FaRegCircle /> {language === 'hi' ? 'वृत्त' : 'Circle'}</Button>
                          </div>
                        </FormGroup>
                        {(logoSettings.shape === 'rounded' || logoSettings.shape === 'rectangle') && (
                          <Row><Col xs={6}><FormGroup><Label>{language === 'hi' ? 'बॉर्डर त्रिज्या (px)' : 'Border Radius (px)'}</Label><Input type="number" value={logoSettings.borderRadius} onChange={(e) => setLogoSettings({...logoSettings, borderRadius: parseInt(e.target.value)})} /></FormGroup></Col></Row>
                        )}
                        <Row>
                          <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'बॉर्डर चौड़ाई (px)' : 'Border Width (px)'}</Label><Input type="number" value={logoSettings.borderWidth} onChange={(e) => setLogoSettings({...logoSettings, borderWidth: parseInt(e.target.value)})} /></FormGroup></Col>
                          {logoSettings.borderWidth > 0 && (
                            <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'बॉर्डर रंग' : 'Border Color'}</Label><Input type="color" value={logoSettings.borderColor} onChange={(e) => setLogoSettings({...logoSettings, borderColor: e.target.value})} /></FormGroup></Col>
                          )}
                        </Row>
                        {receiptData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />{language === 'hi' ? 'प्रीव्यू पर लोगो को खींचकर पुनः स्थित करें' : 'Click and drag logo on preview to reposition'}</Alert>}
                      </>
                    )}
                  </TabPane>
                </TabContent>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={() => navigate('/receipts')}>{language === 'hi' ? 'रद्द करें' : 'Cancel'}</Button>
                  <Button color="success" type="submit" disabled={loading}>
                    {loading ? <><FaSpinner className="spinner-border-sm me-1" /> {language === 'hi' ? 'बना रहा है...' : 'Creating...'}</> : <><FaSave /> {language === 'hi' ? 'रसीद बनाएं' : 'Create Receipt'}</>}
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
                {receiptData.useTemplate && <small className="d-block text-muted"><FaMousePointer /> {language === 'hi' ? 'किसी भी तत्व को खींचकर पुनः स्थित करें' : 'Click and drag ANY element to reposition'}</small>}
              </CardTitle>
              <div className="preview-container" style={{ maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
                {receiptData.useTemplate && templateImage ? (
                  <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: 'auto', border: '1px solid #ddd', cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                ) : renderReceipt()}
              </div>
              <div className="d-flex gap-2 mt-3">
                <Button color="success" onClick={downloadReceipt} className="flex-grow-1"><FaDownload /> {language === 'hi' ? 'रसीद डाउनलोड करें' : 'Download Receipt'}</Button>
                <Button color="info" onClick={() => setShowFullPreview(true)} className="flex-grow-1"><FaEye /> {language === 'hi' ? 'पूर्ण प्रीव्यू' : 'Full Preview'}</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Full Preview Modal */}
      {showFullPreview && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body text-center">
                {receiptData.useTemplate && templateImage
                  ? <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
                  : renderReceipt()
                }
                <div className="mt-3">
                  <Button color="success" onClick={downloadReceipt}><FaDownload /> {language === 'hi' ? 'डाउनलोड' : 'Download'}</Button>
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

export default CreateReceipt;