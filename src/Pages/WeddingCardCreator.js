// // WeddingCardCreator.jsx - COMPLETE WITH FRONT SIDE OVERLAY & SINGLE UPLOAD
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Container, Form, FormGroup, Label, Input, Button, Card, CardBody,
//   CardTitle, Alert, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink
// } from 'reactstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { 
//   FaCloudUploadAlt, FaSpinner, FaEye, FaSave, FaMousePointer, FaDownload,
//   FaHeart, FaCalendarAlt, FaMapMarkerAlt, FaPalette, FaFont,
//   FaImages, FaCheckCircle, FaArrowsAlt, FaFillDrip, FaBold, FaItalic,
//   FaUnderline, FaSquare, FaRegCircle, FaLanguage, FaGem, FaPhone,
//   FaUserFriends, FaPlus, FaTimes, FaUser, FaVenusMars, FaAddressCard
// } from 'react-icons/fa';

// const API_URL = 'https://designback.onrender.com/api/admin';

// const WeddingCardCreator = () => {
//   const [activeTab, setActiveTab] = useState('1');
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [language, setLanguage] = useState('en');
//   const [currentSide, setCurrentSide] = useState('front');
  
//   // THREE SEPARATE IMAGES
//   const [frontImage, setFrontImage] = useState(null);
//   const [insideImage, setInsideImage] = useState(null);
//   const [backImage, setBackImage] = useState(null);
  
//   const [originalFrontFile, setOriginalFrontFile] = useState(null);
//   const [originalInsideFile, setOriginalInsideFile] = useState(null);
//   const [originalBackFile, setOriginalBackFile] = useState(null);
  
//   const [showFrontPicker, setShowFrontPicker] = useState(false);
//   const [showInsidePicker, setShowInsidePicker] = useState(false);
//   const [showBackPicker, setShowBackPicker] = useState(false);
  
//   // Custom events list
//   const [customEvents, setCustomEvents] = useState([]);
//   const [showEventForm, setShowEventForm] = useState(false);
//   const [newEvent, setNewEvent] = useState({ name: '', date: '', time: '', venue: '' });
  
//   // Relatives list
//   const [relatives, setRelatives] = useState([]);
//   const [showRelativeForm, setShowRelativeForm] = useState(false);
//   const [newRelative, setNewRelative] = useState({ name: '', relation: '', side: 'groom' });
  
//   // Logo settings
//   const [logoSettings, setLogoSettings] = useState({
//     x: 350, y: 50, width: 100, height: 100, borderRadius: 50,
//     borderWidth: 0, borderColor: '#d4af37', shape: 'circle', show: true
//   });
  
//   // Wedding card data
//   const [cardData, setCardData] = useState({
//     groomName: 'Rahul Sharma',
//     groomFatherName: 'Mr. Rajesh Sharma',
//     groomMotherName: 'Mrs. Suman Sharma',
//     groomMobile: '+91 98765 43210',
//     brideName: 'Priya Singh',
//     brideFatherName: 'Mr. Sanjay Singh',
//     brideMotherName: 'Mrs. Neha Singh',
//     brideMobile: '+91 98765 43211',
//     ceremonyDate: '25th November 2025',
//     ceremonyTime: '7:00 PM onwards',
//     ceremonyVenue: 'Grand Palace Hotel, Jaipur',
//     ceremonyAddress: 'Sector 5, Vaishali Nagar, Jaipur - 302021',
//     ceremonyContact: '+91 141 1234567',
//     receptionDate: '26th November 2025',
//     receptionTime: '8:00 PM',
//     receptionVenue: 'Royal Convention Hall, Jaipur',
//     receptionAddress: 'Tonk Road, Near Airport, Jaipur - 302018',
//     receptionContact: '+91 141 7654321',
//     additionalInfo: 'Dinner & Blessings',
//     dressCode: 'Traditional / Formal',
//     rsvpContact: '+91 98765 43212',
//     rsvpBy: '15th November 2025',
//     backgroundColor: '#fff8f0',
//     textColor: '#5a3e2b',
//     accentColor: '#d4af37',
//     fontFamily: 'Georgia',
//     showLogo: true,
//     logo: null
//   });
  
//   // Hindi translations
//   const [hindiTranslations, setHindiTranslations] = useState({
//     groomName: 'राहुल शर्मा',
//     groomFatherName: 'श्री राजेश शर्मा',
//     groomMotherName: 'श्रीमती सुमन शर्मा',
//     groomMobile: '+91 98765 43210',
//     brideName: 'प्रिया सिंह',
//     brideFatherName: 'श्री संजय सिंह',
//     brideMotherName: 'श्रीमती नेहा सिंह',
//     brideMobile: '+91 98765 43211',
//     ceremonyDate: '25 नवंबर 2025',
//     ceremonyTime: 'शाम 7:00 बजे से',
//     ceremonyVenue: 'ग्रैंड पैलेस होटल, जयपुर',
//     ceremonyAddress: 'सेक्टर 5, वैशाली नगर, जयपुर - 302021',
//     ceremonyContact: '+91 141 1234567',
//     receptionDate: '26 नवंबर 2025',
//     receptionTime: 'रात 8:00 बजे',
//     receptionVenue: 'रॉयल कन्वेंशन हॉल, जयपुर',
//     receptionAddress: 'टोंक रोड, एयरपोर्ट के पास, जयपुर - 302018',
//     receptionContact: '+91 141 7654321',
//     additionalInfo: 'भोजन एवं आशीर्वाद',
//     dressCode: 'पारंपरिक / औपचारिक',
//     rsvpContact: '+91 98765 43212',
//     rsvpBy: '15 नवंबर 2025'
//   });
  
//   // Text styles - FRONT SIDE + INSIDE SIDE both
//   const [textStyles, setTextStyles] = useState({
//     // FRONT SIDE FIELDS
//     frontGroomName: { fontSize: 42, fontWeight: 'bold', color: '#d4af37', italic: false, underline: false, x: 400, y: 400, show: true },
//     frontBrideName: { fontSize: 42, fontWeight: 'bold', color: '#d4af37', italic: false, underline: false, x: 400, y: 470, show: true },
//     frontCeremonyDate: { fontSize: 20, fontWeight: 'bold', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 550, show: true },
//     frontCeremonyVenue: { fontSize: 16, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 600, show: true },
//     frontCeremonyAddress: { fontSize: 14, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 630, show: true },
    
//     // INSIDE SIDE FIELDS
//     groomName: { fontSize: 42, fontWeight: 'bold', color: '#d4af37', italic: false, underline: false, x: 400, y: 400, show: true },
//     groomFatherName: { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 450, show: true },
//     groomMotherName: { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 480, show: true },
//     groomMobile: { fontSize: 14, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 510, show: true },
//     brideName: { fontSize: 42, fontWeight: 'bold', color: '#d4af37', italic: false, underline: false, x: 400, y: 560, show: true },
//     brideFatherName: { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 610, show: true },
//     brideMotherName: { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 640, show: true },
//     brideMobile: { fontSize: 14, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 670, show: true },
//     ceremonyDate: { fontSize: 20, fontWeight: 'bold', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 720, show: true },
//     ceremonyTime: { fontSize: 18, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 755, show: true },
//     ceremonyVenue: { fontSize: 16, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 790, show: true },
//     ceremonyAddress: { fontSize: 14, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 820, show: true },
//     receptionDate: { fontSize: 20, fontWeight: 'bold', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 870, show: true },
//     receptionTime: { fontSize: 18, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 905, show: true },
//     receptionVenue: { fontSize: 16, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 940, show: true },
//     receptionAddress: { fontSize: 14, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 970, show: true },
//     dressCode: { fontSize: 14, fontWeight: 'normal', color: '#888888', italic: true, underline: false, x: 400, y: 1010, show: true }
//   });
  
//   const [previewImage, setPreviewImage] = useState(null);
//   const [showFullPreview, setShowFullPreview] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragTarget, setDragTarget] = useState(null);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [selectedElement, setSelectedElement] = useState('groomName');
  
//   // Canvas refs
//   const frontCanvasRef = useRef(null);
//   const insideCanvasRef = useRef(null);
//   const backCanvasRef = useRef(null);
  
//   const navigate = useNavigate();

//   const sampleTemplates = {
//     front: [
//       { id: 1, name: 'Royal Gold', image: 'https://placehold.co/800x1000/d4af37/white?text=Royal+Gold' },
//       { id: 2, name: 'Rose Garden', image: 'https://placehold.co/800x1000/ffb6c1/white?text=Rose+Garden' },
//       { id: 3, name: 'Traditional Red', image: 'https://placehold.co/800x1000/dc143c/white?text=Traditional+Red' },
//       { id: 4, name: 'Elegant Floral', image: 'https://placehold.co/800x1000/f5f5dc/black?text=Elegant+Floral' }
//     ],
//     inside: [
//       { id: 1, name: 'Classic Inside', image: 'https://placehold.co/800x1000/fdf5e6/black?text=Classic+Inside' },
//       { id: 2, name: 'Modern Inside', image: 'https://placehold.co/800x1000/faf0e6/black?text=Modern+Inside' }
//     ],
//     back: [
//       { id: 1, name: 'Thank You', image: 'https://placehold.co/800x1000/f5f5dc/black?text=Thank+You' },
//       { id: 2, name: 'Map Design', image: 'https://placehold.co/800x1000/fff8f0/black?text=Location+Map' }
//     ]
//   };

//   const getDisplayText = (field) => {
//     if (language === 'hi') {
//       return hindiTranslations[field] || cardData[field];
//     }
//     return cardData[field];
//   };

//   const updateTextStyle = (field, styleName, value) => {
//     setTextStyles(prev => ({
//       ...prev,
//       [field]: { ...prev[field], [styleName]: value }
//     }));
//     setTimeout(() => {
//       if (currentSide === 'front') drawFrontCanvas();
//       else drawInsideCanvas();
//     }, 50);
//   };

//   const updateTextPosition = (field, x, y) => {
//     setTextStyles(prev => ({
//       ...prev,
//       [field]: { ...prev[field], x, y }
//     }));
//   };

//   // Add custom event
//   const addCustomEvent = () => {
//     if (newEvent.name) {
//       setCustomEvents([...customEvents, { ...newEvent, id: Date.now() }]);
//       setNewEvent({ name: '', date: '', time: '', venue: '' });
//       setShowEventForm(false);
//       setTimeout(() => drawInsideCanvas(), 50);
//     }
//   };

//   const removeCustomEvent = (id) => {
//     setCustomEvents(customEvents.filter(e => e.id !== id));
//     setTimeout(() => drawInsideCanvas(), 50);
//   };

//   // Add relative
//   const addRelative = () => {
//     if (newRelative.name) {
//       setRelatives([...relatives, { ...newRelative, id: Date.now() }]);
//       setNewRelative({ name: '', relation: '', side: 'groom' });
//       setShowRelativeForm(false);
//       setTimeout(() => drawInsideCanvas(), 50);
//     }
//   };

//   const removeRelative = (id) => {
//     setRelatives(relatives.filter(r => r.id !== id));
//     setTimeout(() => drawInsideCanvas(), 50);
//   };

//   // Draw FRONT canvas with text overlay
//   const drawFrontCanvas = () => {
//     const canvas = frontCanvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     canvas.width = 800;
//     canvas.height = 1000;
    
//     const drawOverlay = () => {
//       // Draw front side text fields
//       const frontFields = ['frontGroomName', 'frontBrideName', 'frontCeremonyDate', 'frontCeremonyVenue', 'frontCeremonyAddress'];
      
//       frontFields.forEach(field => {
//         const style = textStyles[field];
//         if (style && style.show) {
//           let text = '';
//           if (field === 'frontGroomName') text = getDisplayText('groomName');
//           else if (field === 'frontBrideName') text = getDisplayText('brideName');
//           else if (field === 'frontCeremonyDate') text = getDisplayText('ceremonyDate');
//           else if (field === 'frontCeremonyVenue') text = getDisplayText('ceremonyVenue');
//           else if (field === 'frontCeremonyAddress') text = getDisplayText('ceremonyAddress');
          
//           if (text) {
//             drawTextAtPosition(ctx, text, style, cardData.fontFamily, style.x, style.y);
//           }
//         }
//       });
      
//       // Draw logo on front
//       if (cardData.showLogo && previewImage && logoSettings.show) {
//         drawLogoOnCanvas(ctx, previewImage, logoSettings);
//       }
//     };
    
//     if (frontImage) {
//       const img = new Image();
//       img.crossOrigin = 'Anonymous';
//       img.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         drawOverlay();
//       };
//       img.onerror = () => {
//         ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         drawOverlay();
//       };
//       img.src = frontImage;
//     } else {
//       ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       drawOverlay();
//     }
//   };

//   // Draw INSIDE canvas with text overlay
//   const drawInsideCanvas = () => {
//     const canvas = insideCanvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     canvas.width = 800;
//     canvas.height = 1050;
    
//     const drawOverlay = () => {
//       // Header
//       ctx.font = `italic 28px ${cardData.fontFamily}`;
//       ctx.fillStyle = cardData.accentColor;
//       ctx.textAlign = 'center';
//       ctx.fillText(language === 'hi' ? 'विवाह निमंत्रण' : 'WEDDING INVITATION', 400, 80);
      
//       // Draw all text fields
//       const allFields = [
//         'groomName', 'groomFatherName', 'groomMotherName', 'groomMobile',
//         'brideName', 'brideFatherName', 'brideMotherName', 'brideMobile',
//         'ceremonyDate', 'ceremonyTime', 'ceremonyVenue', 'ceremonyAddress',
//         'receptionDate', 'receptionTime', 'receptionVenue', 'receptionAddress',
//         'dressCode'
//       ];
      
//       allFields.forEach(field => {
//         const style = textStyles[field];
//         if (style && style.show) {
//           const text = getDisplayText(field);
//           if (text) {
//             drawTextAtPosition(ctx, text, style, cardData.fontFamily, style.x, style.y);
//           }
//         }
//       });
      
//       // Custom Events
//       if (customEvents.length > 0) {
//         let eventY = textStyles.receptionAddress?.y + 40 || 1000;
//         ctx.font = `bold 18px ${cardData.fontFamily}`;
//         ctx.fillStyle = cardData.accentColor;
//         ctx.fillText(language === 'hi' ? 'अन्य कार्यक्रम' : 'Other Events', 400, eventY);
//         eventY += 35;
        
//         customEvents.forEach(event => {
//           ctx.font = `bold 16px ${cardData.fontFamily}`;
//           ctx.fillStyle = '#d4af37';
//           ctx.fillText(event.name, 400, eventY);
//           eventY += 25;
//           ctx.font = `14px ${cardData.fontFamily}`;
//           ctx.fillStyle = cardData.textColor;
//           ctx.fillText(`${event.date} | ${event.time}`, 400, eventY);
//           eventY += 22;
//           ctx.fillText(event.venue, 400, eventY);
//           eventY += 28;
//         });
//       }
      
//       // Relatives
//       if (relatives.length > 0) {
//         let relY = customEvents.length > 0 ? (textStyles.receptionAddress?.y + 40 + (customEvents.length * 75)) : (textStyles.receptionAddress?.y + 40 || 1000);
        
//         ctx.font = `bold 18px ${cardData.fontFamily}`;
//         ctx.fillStyle = cardData.accentColor;
//         ctx.fillText(language === 'hi' ? 'परिवार के सदस्य' : 'Family Members', 400, relY);
//         relY += 35;
        
//         const groomRelatives = relatives.filter(r => r.side === 'groom');
//         const brideRelatives = relatives.filter(r => r.side === 'bride');
        
//         if (groomRelatives.length > 0) {
//           ctx.font = `italic 14px ${cardData.fontFamily}`;
//           ctx.fillStyle = '#d4af37';
//           ctx.fillText(language === 'hi' ? 'वर की ओर से' : 'Groom\'s Side', 400, relY);
//           relY += 25;
//           groomRelatives.forEach(rel => {
//             ctx.font = `14px ${cardData.fontFamily}`;
//             ctx.fillStyle = cardData.textColor;
//             ctx.fillText(`${rel.name} (${rel.relation})`, 400, relY);
//             relY += 22;
//           });
//           relY += 10;
//         }
        
//         if (brideRelatives.length > 0) {
//           ctx.font = `italic 14px ${cardData.fontFamily}`;
//           ctx.fillStyle = '#d4af37';
//           ctx.fillText(language === 'hi' ? 'वधू की ओर से' : 'Bride\'s Side', 400, relY);
//           relY += 25;
//           brideRelatives.forEach(rel => {
//             ctx.font = `14px ${cardData.fontFamily}`;
//             ctx.fillStyle = cardData.textColor;
//             ctx.fillText(`${rel.name} (${rel.relation})`, 400, relY);
//             relY += 22;
//           });
//         }
//       }
      
//       // RSVP
//       if (cardData.rsvpContact) {
//         let rsvpY = 1020;
//         ctx.font = `14px ${cardData.fontFamily}`;
//         ctx.fillStyle = '#888888';
//         ctx.fillText(`${language === 'hi' ? 'कृपया RSVP करें' : 'Please RSVP'}: ${cardData.rsvpContact} ${language === 'hi' ? 'तक' : 'by'} ${cardData.rsvpBy}`, 400, rsvpY);
//       }
//     };
    
//     if (insideImage) {
//       const img = new Image();
//       img.crossOrigin = 'Anonymous';
//       img.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         drawOverlay();
//       };
//       img.onerror = () => {
//         ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         drawOverlay();
//       };
//       img.src = insideImage;
//     } else {
//       ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       drawOverlay();
//     }
//   };

//   const drawBackCanvas = () => {
//     const canvas = backCanvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     canvas.width = 800;
//     canvas.height = 1000;
    
//     if (backImage) {
//       const img = new Image();
//       img.crossOrigin = 'Anonymous';
//       img.onload = () => {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         drawBackText(ctx);
//       };
//       img.src = backImage;
//     } else {
//       ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       drawBackText(ctx);
//     }
//   };
  
//   const drawBackText = (ctx) => {
//     ctx.font = `bold 32px ${cardData.fontFamily}`;
//     ctx.fillStyle = cardData.accentColor;
//     ctx.textAlign = 'center';
//     ctx.fillText(language === 'hi' ? 'धन्यवाद' : 'Thank You', 400, 400);
//     ctx.font = `20px ${cardData.fontFamily}`;
//     ctx.fillStyle = cardData.textColor;
//     ctx.fillText(language === 'hi' ? 'हमें आपका आशीर्वाद चाहिए' : 'We need your blessings', 400, 480);
//     ctx.font = `16px ${cardData.fontFamily}`;
//     ctx.fillText(language === 'hi' ? 'कृपया हमारे इस खुशी के मौके पर जरूर आएं' : 'Please grace this occasion with your presence', 400, 540);
//     ctx.font = `14px ${cardData.fontFamily}`;
//     ctx.fillStyle = '#888888';
//     ctx.fillText(cardData.additionalInfo, 400, 620);
//   };

//   const drawTextAtPosition = (ctx, text, style, fontFamily, x, y) => {
//     if (!text) return;
//     let fontStyle = '';
//     if (style.italic) fontStyle += 'italic ';
//     fontStyle += style.fontWeight;
    
//     ctx.save();
//     ctx.font = `${fontStyle} ${style.fontSize}px ${fontFamily}`;
//     ctx.fillStyle = style.color;
//     ctx.textAlign = 'center';
//     ctx.fillText(text, x, y);
    
//     if (style.underline) {
//       const metrics = ctx.measureText(text);
//       ctx.beginPath();
//       ctx.moveTo(x - metrics.width/2, y + 2);
//       ctx.lineTo(x + metrics.width/2, y + 2);
//       ctx.strokeStyle = style.color;
//       ctx.lineWidth = 1;
//       ctx.stroke();
//     }
//     ctx.restore();
//   };

//   const drawLogoOnCanvas = (ctx, logoUrl, settings) => {
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

//   // Drag handlers - works for both front and inside
//   const handleCanvasMouseDown = (e) => {
//     const canvas = currentSide === 'front' ? frontCanvasRef.current : insideCanvasRef.current;
//     if (!canvas) return;
    
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;
//     const mouseX = (e.clientX - rect.left) * scaleX;
//     const mouseY = (e.clientY - rect.top) * scaleY;
    
//     let allFields = [];
//     if (currentSide === 'front') {
//       allFields = ['frontGroomName', 'frontBrideName', 'frontCeremonyDate', 'frontCeremonyVenue', 'frontCeremonyAddress'];
//     } else {
//       allFields = [
//         'groomName', 'groomFatherName', 'groomMotherName', 'groomMobile',
//         'brideName', 'brideFatherName', 'brideMotherName', 'brideMobile',
//         'ceremonyDate', 'ceremonyTime', 'ceremonyVenue', 'ceremonyAddress',
//         'receptionDate', 'receptionTime', 'receptionVenue', 'receptionAddress',
//         'dressCode'
//       ];
//     }
    
//     for (const field of allFields) {
//       const style = textStyles[field];
//       if (!style?.show) continue;
      
//       let text = '';
//       if (field === 'frontGroomName') text = getDisplayText('groomName');
//       else if (field === 'frontBrideName') text = getDisplayText('brideName');
//       else if (field === 'frontCeremonyDate') text = getDisplayText('ceremonyDate');
//       else if (field === 'frontCeremonyVenue') text = getDisplayText('ceremonyVenue');
//       else if (field === 'frontCeremonyAddress') text = getDisplayText('ceremonyAddress');
//       else text = getDisplayText(field);
      
//       if (!text) continue;
      
//       const tempCanvas = document.createElement('canvas');
//       const tempCtx = tempCanvas.getContext('2d');
//       let fontStyle = style.italic ? 'italic ' : '';
//       fontStyle += style.fontWeight;
//       tempCtx.font = `${fontStyle} ${style.fontSize}px ${cardData.fontFamily}`;
//       const textWidth = tempCtx.measureText(text).width;
//       const textHeight = style.fontSize;
      
//       if (mouseX >= style.x - textWidth/2 - 15 && mouseX <= style.x + textWidth/2 + 15 &&
//           mouseY >= style.y - textHeight - 10 && mouseY <= style.y + 10) {
//         setIsDragging(true);
//         setDragTarget({ type: 'text', field });
//         setDragStart({ x: mouseX - style.x, y: mouseY - style.y });
//         e.preventDefault();
//         return;
//       }
//     }
//   };
  
//   const handleCanvasMouseMove = (e) => {
//     if (!isDragging || !dragTarget) return;
    
//     const canvas = currentSide === 'front' ? frontCanvasRef.current : insideCanvasRef.current;
//     if (!canvas) return;
    
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;
//     const mouseX = (e.clientX - rect.left) * scaleX;
//     const mouseY = (e.clientY - rect.top) * scaleY;
    
//     if (dragTarget.type === 'text') {
//       const newX = mouseX - dragStart.x;
//       const newY = mouseY - dragStart.y;
//       updateTextPosition(dragTarget.field, newX, newY);
//       if (currentSide === 'front') drawFrontCanvas();
//       else drawInsideCanvas();
//     }
//   };
  
//   const handleCanvasMouseUp = () => {
//     setIsDragging(false);
//     setDragTarget(null);
//   };

//   // SINGLE UPLOAD HANDLER - ek baar mein ho jayega
//   const handleFileUpload = (side, e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) {
//       setErrorMessage('Image size should be less than 5MB');
//       return;
//     }
//     const url = URL.createObjectURL(file);
//     if (side === 'front') {
//       setFrontImage(url);
//       setOriginalFrontFile(file);
//       setShowFrontPicker(false);
//       setTimeout(() => drawFrontCanvas(), 100);
//     } else if (side === 'inside') {
//       setInsideImage(url);
//       setOriginalInsideFile(file);
//       setShowInsidePicker(false);
//       setTimeout(() => drawInsideCanvas(), 100);
//     } else {
//       setBackImage(url);
//       setOriginalBackFile(file);
//       setShowBackPicker(false);
//       setTimeout(() => drawBackCanvas(), 100);
//     }
//   };

//   const selectTemplate = (side, template) => {
//     if (side === 'front') {
//       setFrontImage(template.image);
//       setOriginalFrontFile(null);
//       setShowFrontPicker(false);
//       setTimeout(() => drawFrontCanvas(), 100);
//     } else if (side === 'inside') {
//       setInsideImage(template.image);
//       setOriginalInsideFile(null);
//       setShowInsidePicker(false);
//       setTimeout(() => drawInsideCanvas(), 100);
//     } else {
//       setBackImage(template.image);
//       setOriginalBackFile(null);
//       setShowBackPicker(false);
//       setTimeout(() => drawBackCanvas(), 100);
//     }
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 2 * 1024 * 1024) {
//       setErrorMessage('Logo size should be less than 2MB');
//       return;
//     }
//     setCardData({ ...cardData, logo: file });
//     setPreviewImage(URL.createObjectURL(file));
//     setTimeout(() => drawFrontCanvas(), 100);
//   };

//   const downloadCard = () => {
//     let canvas;
//     if (currentSide === 'front') canvas = frontCanvasRef.current;
//     else if (currentSide === 'inside') canvas = insideCanvasRef.current;
//     else canvas = backCanvasRef.current;
    
//     if (canvas) {
//       const link = document.createElement('a');
//       link.download = `wedding_card_${currentSide}.png`;
//       link.href = canvas.toDataURL('image/png');
//       link.click();
//     }
//   };

//   const downloadAllSides = () => {
//     if (frontCanvasRef.current) {
//       const link = document.createElement('a');
//       link.download = 'wedding_card_front.png';
//       link.href = frontCanvasRef.current.toDataURL('image/png');
//       link.click();
//     }
//     setTimeout(() => {
//       if (insideCanvasRef.current) {
//         const link = document.createElement('a');
//         link.download = 'wedding_card_inside.png';
//         link.href = insideCanvasRef.current.toDataURL('image/png');
//         link.click();
//       }
//     }, 500);
//     setTimeout(() => {
//       if (backCanvasRef.current) {
//         const link = document.createElement('a');
//         link.download = 'wedding_card_back.png';
//         link.href = backCanvasRef.current.toDataURL('image/png');
//         link.click();
//       }
//     }, 1000);
//   };

//   const resizeImage = async (imageFile) => {
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

//   // WeddingCardCreator.jsx - Complete working handleSubmit

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setErrorMessage('');

//   const formData = new FormData();

//   Object.keys(cardData).forEach(key => {
//     if (key !== 'logo') formData.append(key, cardData[key]);
//   });
//   formData.append('textStyles', JSON.stringify(textStyles));
//   formData.append('logoSettings', JSON.stringify(logoSettings));
//   formData.append('language', language);
//   formData.append('customEvents', JSON.stringify(customEvents));
//   formData.append('relatives', JSON.stringify(relatives));
//   formData.append('design', JSON.stringify({
//     backgroundColor: cardData.backgroundColor,
//     textColor: cardData.textColor,
//     accentColor: cardData.accentColor,
//     fontFamily: cardData.fontFamily,
//     showLogo: cardData.showLogo
//   }));

//   if (cardData.logo) formData.append('logo', cardData.logo);

//   if (originalFrontFile) {
//     const blob = await resizeImage(originalFrontFile);
//     formData.append('frontImage', blob, 'front.png');
//   }
//   if (originalInsideFile) {
//     const blob = await resizeImage(originalInsideFile);
//     formData.append('insideImage', blob, 'inside.png');
//   }
//   if (originalBackFile) {
//     const blob = await resizeImage(originalBackFile);
//     formData.append('backImage', blob, 'back.png');
//   }

//   // ✅ KEY FIX: Draw fresh offscreen canvases for all 3 sides
//   const captureCanvas = (drawFn, width, height) => {
//     return new Promise((resolve) => {
//       const offscreen = document.createElement('canvas');
//       offscreen.width = width;
//       offscreen.height = height;
//       // Temporarily override the ref, draw, capture, restore
//       drawFn(offscreen);
//       setTimeout(() => {
//         offscreen.toBlob(blob => resolve(blob), 'image/png');
//       }, 300); // Wait for images to load
//     });
//   };

//   // Draw front on offscreen canvas
//   const frontBlob = await new Promise((resolve) => {
//     const offscreen = document.createElement('canvas');
//     offscreen.width = 800;
//     offscreen.height = 1000;
//     const ctx = offscreen.getContext('2d');

//     const drawIt = () => {
//       ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
//       ctx.fillRect(0, 0, 800, 1000);

//       const frontFields = ['frontGroomName', 'frontBrideName', 'frontCeremonyDate', 'frontCeremonyVenue', 'frontCeremonyAddress'];
//       frontFields.forEach(field => {
//         const style = textStyles[field];
//         if (!style?.show) return;
//         let text = '';
//         if (field === 'frontGroomName') text = cardData.groomName;
//         else if (field === 'frontBrideName') text = cardData.brideName;
//         else if (field === 'frontCeremonyDate') text = cardData.ceremonyDate;
//         else if (field === 'frontCeremonyVenue') text = cardData.ceremonyVenue;
//         else if (field === 'frontCeremonyAddress') text = cardData.ceremonyAddress;
//         if (text) drawTextAtPosition(ctx, text, style, cardData.fontFamily, style.x, style.y);
//       });

//       setTimeout(() => offscreen.toBlob(resolve, 'image/png'), 200);
//     };

//     if (frontImage) {
//       const img = new Image();
//       img.crossOrigin = 'Anonymous';
//       img.onload = () => { ctx.drawImage(img, 0, 0, 800, 1000); drawIt(); };
//       img.onerror = drawIt;
//       img.src = frontImage;
//     } else {
//       drawIt();
//     }
//   });

//   if (frontBlob && frontBlob.size > 1000) {
//     formData.append('frontPreview', frontBlob, 'front_preview.png');
//     console.log('✅ frontPreview size:', frontBlob.size);
//   }

//   // Draw inside on offscreen canvas
//   const insideBlob = await new Promise((resolve) => {
//     const offscreen = document.createElement('canvas');
//     offscreen.width = 800;
//     offscreen.height = 1050;
//     const ctx = offscreen.getContext('2d');

//     const drawIt = () => {
//       ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
//       ctx.fillRect(0, 0, 800, 1050);

//       ctx.font = `italic 28px ${cardData.fontFamily}`;
//       ctx.fillStyle = cardData.accentColor;
//       ctx.textAlign = 'center';
//       ctx.fillText(language === 'hi' ? 'विवाह निमंत्रण' : 'WEDDING INVITATION', 400, 80);

//       const allFields = [
//         'groomName','groomFatherName','groomMotherName','groomMobile',
//         'brideName','brideFatherName','brideMotherName','brideMobile',
//         'ceremonyDate','ceremonyTime','ceremonyVenue','ceremonyAddress',
//         'receptionDate','receptionTime','receptionVenue','receptionAddress','dressCode'
//       ];
//       allFields.forEach(field => {
//         const style = textStyles[field];
//         if (style?.show) {
//           const text = cardData[field];
//           if (text) drawTextAtPosition(ctx, text, style, cardData.fontFamily, style.x, style.y);
//         }
//       });

//       setTimeout(() => offscreen.toBlob(resolve, 'image/png'), 200);
//     };

//     if (insideImage) {
//       const img = new Image();
//       img.crossOrigin = 'Anonymous';
//       img.onload = () => { ctx.drawImage(img, 0, 0, 800, 1050); drawIt(); };
//       img.onerror = drawIt;
//       img.src = insideImage;
//     } else {
//       drawIt();
//     }
//   });

//   if (insideBlob && insideBlob.size > 1000) {
//     formData.append('insidePreview', insideBlob, 'inside_preview.png');
//     console.log('✅ insidePreview size:', insideBlob.size);
//   }

//   // Back preview - direct from backCanvasRef (it's always separate)
//   if (backCanvasRef.current) {
//     // Redraw to make sure it's fresh
//     drawBackCanvas();
//     await new Promise(r => setTimeout(r, 300));
//     const backBlob = await new Promise(r => backCanvasRef.current.toBlob(r, 'image/png'));
//     if (backBlob && backBlob.size > 1000) {
//       formData.append('backPreview', backBlob, 'back_preview.png');
//       console.log('✅ backPreview size:', backBlob.size);
//     }
//   }

//   try {
//     const response = await axios.post(`${API_URL}/createweddingcard`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     setSuccessMessage(language === 'hi' ? 'वेडिंग कार्ड सफलतापूर्वक बनाया गया!' : 'Wedding card created successfully!');
//     setTimeout(() => navigate('/weddingcards'), 2000);
//   } catch (error) {
//     console.error('Submit error:', error);
//     setErrorMessage(error.response?.data?.message || error.message || 'Error creating wedding card');
//   } finally {
//     setLoading(false);
//   }
// };
//   // Redraw canvases
//   useEffect(() => {
//     drawFrontCanvas();
//     drawInsideCanvas();
//     drawBackCanvas();
//   }, [cardData, textStyles, previewImage, logoSettings, language, customEvents, relatives]);

//   const frontInputRef = useRef(null);
//   const insideInputRef = useRef(null);
//   const backInputRef = useRef(null);
//   const logoInputRef = useRef(null);

//   return (
//     <Container fluid className="my-5">
//       <Row>
//         <Col md={6}>
//           <Card className="shadow-lg border-0">
//             <CardBody className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <CardTitle tag="h3" className="text-warning mb-0">
//                   <FaHeart className="me-2 text-danger" /> Wedding Card Creator
//                 </CardTitle>
//                 <div>
//                   <Button color={language === 'en' ? 'warning' : 'secondary'} size="sm" onClick={() => setLanguage('en')} className="me-2">
//                     <FaLanguage /> English
//                   </Button>
//                   <Button color={language === 'hi' ? 'warning' : 'secondary'} size="sm" onClick={() => setLanguage('hi')}>
//                     <FaLanguage /> हिंदी
//                   </Button>
//                 </div>
//               </div>

//               {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
//               {successMessage && <Alert color="success">{successMessage}</Alert>}

//               {/* All 3 Sides Thumbnails */}
//               <div className="mb-4">
//                 <Label className="fw-bold mb-2"><FaGem className="me-2" />All Card Sides (Click to Edit)</Label>
//                 <Row>
//                   <Col md={4}>
//                     <Card className={`text-center ${currentSide === 'front' ? 'border-warning border-3' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setCurrentSide('front')}>
//                       <CardBody className="p-2">
//                         <small className="text-primary">Front Side</small>
//                         <div style={{ height: '120px', overflow: 'hidden' }}>
//                           <canvas ref={frontCanvasRef} style={{ width: '100%', height: 'auto' }} width="800" height="1000" />
//                         </div>
//                       </CardBody>
//                     </Card>
//                   </Col>
//                   <Col md={4}>
//                     <Card className={`text-center ${currentSide === 'inside' ? 'border-warning border-3' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setCurrentSide('inside')}>
//                       <CardBody className="p-2">
//                         <small className="text-primary">Inside Side</small>
//                         <div style={{ height: '120px', overflow: 'hidden' }}>
//                           <canvas ref={insideCanvasRef} style={{ width: '100%', height: 'auto' }} width="800" height="1000" />
//                         </div>
//                       </CardBody>
//                     </Card>
//                   </Col>
//                   <Col md={4}>
//                     <Card className={`text-center ${currentSide === 'back' ? 'border-warning border-3' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setCurrentSide('back')}>
//                       <CardBody className="p-2">
//                         <small className="text-primary">Back Side</small>
//                         <div style={{ height: '120px', overflow: 'hidden' }}>
//                           <canvas ref={backCanvasRef} style={{ width: '100%', height: 'auto' }} width="800" height="1000" />
//                         </div>
//                       </CardBody>
//                     </Card>
//                   </Col>
//                 </Row>
//               </div>

//               {/* Template Upload - SINGLE UPLOAD */}
//               <div className="mb-4 p-3 border rounded bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <Label className="fw-bold mb-0"><FaImages className="me-2" />
//                     {currentSide === 'front' ? 'Front Template' : currentSide === 'inside' ? 'Inside Template' : 'Back Template'}
//                   </Label>
//                   <Button size="sm" color="warning" onClick={() => {
//                     if (currentSide === 'front') setShowFrontPicker(!showFrontPicker);
//                     else if (currentSide === 'inside') setShowInsidePicker(!showInsidePicker);
//                     else setShowBackPicker(!showBackPicker);
//                   }}>
//                     <FaCloudUploadAlt /> Change Template
//                   </Button>
//                 </div>
                
//                 {(currentSide === 'front' && showFrontPicker) && (
//                   <div className="mt-2">
//                     <input ref={frontInputRef} type="file" hidden onChange={(e) => handleFileUpload('front', e)} accept="image/*" />
//                     <Button size="sm" color="secondary" onClick={() => frontInputRef.current?.click()} className="w-100 mb-2">
//                       <FaCloudUploadAlt /> Upload Custom Template
//                     </Button>
//                     <div className="row">
//                       {sampleTemplates.front.map(template => (
//                         <div key={template.id} className="col-6 col-md-3 mb-2">
//                           <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate('front', template)}>
//                             <img src={template.image} alt={template.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
//                             <small>{template.name}</small>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 {(currentSide === 'inside' && showInsidePicker) && (
//                   <div className="mt-2">
//                     <input ref={insideInputRef} type="file" hidden onChange={(e) => handleFileUpload('inside', e)} accept="image/*" />
//                     <Button size="sm" color="secondary" onClick={() => insideInputRef.current?.click()} className="w-100 mb-2">
//                       <FaCloudUploadAlt /> Upload Custom Template
//                     </Button>
//                     <div className="row">
//                       {sampleTemplates.inside.map(template => (
//                         <div key={template.id} className="col-6 col-md-3 mb-2">
//                           <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate('inside', template)}>
//                             <img src={template.image} alt={template.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
//                             <small>{template.name}</small>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 {(currentSide === 'back' && showBackPicker) && (
//                   <div className="mt-2">
//                     <input ref={backInputRef} type="file" hidden onChange={(e) => handleFileUpload('back', e)} accept="image/*" />
//                     <Button size="sm" color="secondary" onClick={() => backInputRef.current?.click()} className="w-100 mb-2">
//                       <FaCloudUploadAlt /> Upload Custom Template
//                     </Button>
//                     <div className="row">
//                       {sampleTemplates.back.map(template => (
//                         <div key={template.id} className="col-6 col-md-3 mb-2">
//                           <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate('back', template)}>
//                             <img src={template.image} alt={template.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
//                             <small>{template.name}</small>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <Nav tabs className="mb-3">
//                 <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}><FaHeart /> Details</NavLink></NavItem>
//                 <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><FaUserFriends /> Events & Family</NavLink></NavItem>
//                 <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><FaPalette /> Text Style</NavLink></NavItem>
//                 <NavItem><NavLink className={activeTab === '4' ? 'active' : ''} onClick={() => setActiveTab('4')}><FaImages /> Logo</NavLink></NavItem>
//               </Nav>

//               <Form onSubmit={handleSubmit}>
//                 <TabContent activeTab={activeTab}>
//                   <TabPane tabId="1">
//                     <h6 className="text-warning mb-3"><FaUser /> Groom Details</h6>
//                     <Row>
//                       <Col md={6}><FormGroup><Label>Groom Name</Label><Input value={cardData.groomName} onChange={e => { setCardData({...cardData, groomName: e.target.value}); drawFrontCanvas(); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label>Groom Father's Name</Label><Input value={cardData.groomFatherName} onChange={e => { setCardData({...cardData, groomFatherName: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label>Groom Mother's Name</Label><Input value={cardData.groomMotherName} onChange={e => { setCardData({...cardData, groomMotherName: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label><FaPhone /> Groom Mobile</Label><Input value={cardData.groomMobile} onChange={e => { setCardData({...cardData, groomMobile: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                     </Row>
                    
//                     <h6 className="text-warning mb-3 mt-3"><FaVenusMars /> Bride Details</h6>
//                     <Row>
//                       <Col md={6}><FormGroup><Label>Bride Name</Label><Input value={cardData.brideName} onChange={e => { setCardData({...cardData, brideName: e.target.value}); drawFrontCanvas(); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label>Bride Father's Name</Label><Input value={cardData.brideFatherName} onChange={e => { setCardData({...cardData, brideFatherName: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label>Bride Mother's Name</Label><Input value={cardData.brideMotherName} onChange={e => { setCardData({...cardData, brideMotherName: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label><FaPhone /> Bride Mobile</Label><Input value={cardData.brideMobile} onChange={e => { setCardData({...cardData, brideMobile: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                     </Row>
                    
//                     <h6 className="text-warning mb-3 mt-3"><FaCalendarAlt /> Wedding Ceremony</h6>
//                     <Row>
//                       <Col md={6}><FormGroup><Label>Ceremony Date</Label><Input value={cardData.ceremonyDate} onChange={e => { setCardData({...cardData, ceremonyDate: e.target.value}); drawFrontCanvas(); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label>Ceremony Time</Label><Input value={cardData.ceremonyTime} onChange={e => { setCardData({...cardData, ceremonyTime: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={12}><FormGroup><Label>Ceremony Venue</Label><Input value={cardData.ceremonyVenue} onChange={e => { setCardData({...cardData, ceremonyVenue: e.target.value}); drawFrontCanvas(); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={12}><FormGroup><Label>Ceremony Address</Label><Input value={cardData.ceremonyAddress} onChange={e => { setCardData({...cardData, ceremonyAddress: e.target.value}); drawFrontCanvas(); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={12}><FormGroup><Label><FaPhone /> Ceremony Contact</Label><Input value={cardData.ceremonyContact} onChange={e => { setCardData({...cardData, ceremonyContact: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                     </Row>
                    
//                     <Row>
//                       <Col md={6}><FormGroup><Label>Reception Date</Label><Input value={cardData.receptionDate} onChange={e => { setCardData({...cardData, receptionDate: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label>Reception Time</Label><Input value={cardData.receptionTime} onChange={e => { setCardData({...cardData, receptionTime: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={12}><FormGroup><Label>Reception Venue</Label><Input value={cardData.receptionVenue} onChange={e => { setCardData({...cardData, receptionVenue: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={12}><FormGroup><Label>Reception Address</Label><Input value={cardData.receptionAddress} onChange={e => { setCardData({...cardData, receptionAddress: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={12}><FormGroup><Label><FaPhone /> Reception Contact</Label><Input value={cardData.receptionContact} onChange={e => { setCardData({...cardData, receptionContact: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                     </Row>
                    
//                     <h6 className="text-warning mb-3 mt-3"><FaAddressCard /> Additional Info</h6>
//                     <Row>
//                       <Col md={12}><FormGroup><Label>Additional Info</Label><Input value={cardData.additionalInfo} onChange={e => { setCardData({...cardData, additionalInfo: e.target.value}); drawBackCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label>Dress Code</Label><Input value={cardData.dressCode} onChange={e => { setCardData({...cardData, dressCode: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label><FaPhone /> RSVP Contact</Label><Input value={cardData.rsvpContact} onChange={e => { setCardData({...cardData, rsvpContact: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                       <Col md={6}><FormGroup><Label>RSVP By Date</Label><Input value={cardData.rsvpBy} onChange={e => { setCardData({...cardData, rsvpBy: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
//                     </Row>
//                   </TabPane>

//                   <TabPane tabId="2">
//                     <h6 className="text-warning mb-3"><FaCalendarAlt /> Custom Events</h6>
//                     {customEvents.map((event) => (
//                       <div key={event.id} className="border rounded p-2 mb-2 bg-light">
//                         <div className="d-flex justify-content-between">
//                           <strong>{event.name}</strong>
//                           <Button size="sm" color="danger" onClick={() => removeCustomEvent(event.id)}><FaTimes /></Button>
//                         </div>
//                         <small>{event.date} | {event.time}</small>
//                         <br /><small>{event.venue}</small>
//                       </div>
//                     ))}
//                     {showEventForm ? (
//                       <div className="border rounded p-3 mb-2">
//                         <FormGroup><Label>Event Name</Label><Input value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} /></FormGroup>
//                         <Row><Col md={6}><FormGroup><Label>Date</Label><Input value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} /></FormGroup></Col>
//                         <Col md={6}><FormGroup><Label>Time</Label><Input value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} /></FormGroup></Col></Row>
//                         <FormGroup><Label>Venue</Label><Input value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} /></FormGroup>
//                         <div className="d-flex gap-2"><Button color="success" size="sm" onClick={addCustomEvent}>Add</Button><Button color="secondary" size="sm" onClick={() => setShowEventForm(false)}>Cancel</Button></div>
//                       </div>
//                     ) : (
//                       <Button size="sm" color="primary" onClick={() => setShowEventForm(true)} className="mb-3"><FaPlus /> Add Custom Event</Button>
//                     )}
                    
//                     <h6 className="text-warning mb-3 mt-3"><FaUserFriends /> Family Members / Relatives</h6>
//                     {relatives.map((rel) => (
//                       <div key={rel.id} className="border rounded p-2 mb-2 bg-light">
//                         <div className="d-flex justify-content-between">
//                           <div><strong>{rel.name}</strong> <span className="text-muted">({rel.relation})</span> - {rel.side === 'groom' ? 'Groom Side' : 'Bride Side'}</div>
//                           <Button size="sm" color="danger" onClick={() => removeRelative(rel.id)}><FaTimes /></Button>
//                         </div>
//                       </div>
//                     ))}
//                     {showRelativeForm ? (
//                       <div className="border rounded p-3 mb-2">
//                         <FormGroup><Label>Name</Label><Input value={newRelative.name} onChange={e => setNewRelative({...newRelative, name: e.target.value})} /></FormGroup>
//                         <FormGroup><Label>Relation</Label><Input value={newRelative.relation} onChange={e => setNewRelative({...newRelative, relation: e.target.value})} placeholder="e.g., Brother, Sister, Uncle" /></FormGroup>
//                         <FormGroup><Label>Side</Label><Input type="select" value={newRelative.side} onChange={e => setNewRelative({...newRelative, side: e.target.value})}><option value="groom">Groom's Side</option><option value="bride">Bride's Side</option></Input></FormGroup>
//                         <div className="d-flex gap-2"><Button color="success" size="sm" onClick={addRelative}>Add</Button><Button color="secondary" size="sm" onClick={() => setShowRelativeForm(false)}>Cancel</Button></div>
//                       </div>
//                     ) : (
//                       <Button size="sm" color="primary" onClick={() => setShowRelativeForm(true)}><FaPlus /> Add Family Member</Button>
//                     )}
//                   </TabPane>

//                   <TabPane tabId="3">
//                     <FormGroup><Label>Select Field to Style & Drag</Label>
//                       <Input type="select" value={selectedElement} onChange={e => setSelectedElement(e.target.value)}>
//                         <optgroup label="Front Side">
//                           <option value="frontGroomName">Front - Groom Name</option>
//                           <option value="frontBrideName">Front - Bride Name</option>
//                           <option value="frontCeremonyDate">Front - Ceremony Date</option>
//                           <option value="frontCeremonyVenue">Front - Ceremony Venue</option>
//                           <option value="frontCeremonyAddress">Front - Ceremony Address</option>
//                         </optgroup>
//                         <optgroup label="Inside Side">
//                           <option value="groomName">Inside - Groom Name</option>
//                           <option value="groomFatherName">Inside - Groom Father</option>
//                           <option value="groomMotherName">Inside - Groom Mother</option>
//                           <option value="groomMobile">Inside - Groom Mobile</option>
//                           <option value="brideName">Inside - Bride Name</option>
//                           <option value="brideFatherName">Inside - Bride Father</option>
//                           <option value="brideMotherName">Inside - Bride Mother</option>
//                           <option value="brideMobile">Inside - Bride Mobile</option>
//                           <option value="ceremonyDate">Inside - Ceremony Date</option>
//                           <option value="ceremonyTime">Inside - Ceremony Time</option>
//                           <option value="ceremonyVenue">Inside - Ceremony Venue</option>
//                           <option value="ceremonyAddress">Inside - Ceremony Address</option>
//                           <option value="receptionDate">Inside - Reception Date</option>
//                           <option value="receptionTime">Inside - Reception Time</option>
//                           <option value="receptionVenue">Inside - Reception Venue</option>
//                           <option value="receptionAddress">Inside - Reception Address</option>
//                           <option value="dressCode">Inside - Dress Code</option>
//                         </optgroup>
//                       </Input>
//                     </FormGroup>
//                     {selectedElement && textStyles[selectedElement] && (
//                       <>
//                         <Row><Col xs={6}><FormGroup><Label>Font Size</Label><Input type="number" value={textStyles[selectedElement].fontSize} onChange={e => updateTextStyle(selectedElement, 'fontSize', parseInt(e.target.value))} /></FormGroup></Col>
//                         <Col xs={6}><FormGroup><Label>Color</Label><Input type="color" value={textStyles[selectedElement].color} onChange={e => updateTextStyle(selectedElement, 'color', e.target.value)} /></FormGroup></Col></Row>
//                         <Row><Col xs={6}><FormGroup><Label>Font Weight</Label><Input type="select" value={textStyles[selectedElement].fontWeight} onChange={e => updateTextStyle(selectedElement, 'fontWeight', e.target.value)}><option value="normal">Normal</option><option value="bold">Bold</option></Input></FormGroup></Col>
//                         <Col xs={6}><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={textStyles[selectedElement].italic} onChange={e => updateTextStyle(selectedElement, 'italic', e.target.checked)} /><span className="ms-2">Italic</span></Label></FormGroup></Col></Row>
//                         <FormGroup check><Label check><Input type="checkbox" checked={textStyles[selectedElement].underline} onChange={e => updateTextStyle(selectedElement, 'underline', e.target.checked)} /><span className="ms-2">Underline</span></Label></FormGroup>
//                         <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" /> <strong>Click and drag this text on the preview to reposition!</strong></Alert>
//                       </>
//                     )}
//                     <hr />
//                     <h6>Card Design</h6>
//                     <Row><Col xs={6}><FormGroup><Label>Background</Label><Input type="color" value={cardData.backgroundColor} onChange={e => setCardData({...cardData, backgroundColor: e.target.value})} /></FormGroup></Col>
//                     <Col xs={6}><FormGroup><Label>Text Color</Label><Input type="color" value={cardData.textColor} onChange={e => setCardData({...cardData, textColor: e.target.value})} /></FormGroup></Col>
//                     <Col xs={6}><FormGroup><Label>Accent Color</Label><Input type="color" value={cardData.accentColor} onChange={e => setCardData({...cardData, accentColor: e.target.value})} /></FormGroup></Col>
//                     <Col xs={6}><FormGroup><Label>Font Family</Label><Input type="select" value={cardData.fontFamily} onChange={e => setCardData({...cardData, fontFamily: e.target.value})}><option>Georgia</option><option>Poppins</option><option>Arial</option><option>Times New Roman</option></Input></FormGroup></Col></Row>
//                   </TabPane>

//                   <TabPane tabId="4">
//                     <FormGroup><Label>Logo Image</Label>
//                       <div className="border rounded p-3 text-center" onClick={() => logoInputRef.current?.click()} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
//                         {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p>Upload Logo</p></>}
//                       </div>
//                       <input ref={logoInputRef} type="file" hidden onChange={handleLogoChange} accept="image/*" />
//                     </FormGroup>
//                     <FormGroup check><Label check><Input type="checkbox" checked={cardData.showLogo} onChange={e => setCardData({...cardData, showLogo: e.target.checked})} /><span className="ms-2">Show Logo on Front Side</span></Label></FormGroup>
//                     {cardData.showLogo && previewImage && (
//                       <>
//                         <h6 className="mt-3">Logo Customization</h6>
//                         <Row><Col xs={6}><FormGroup><Label>Width</Label><Input type="number" value={logoSettings.width} onChange={e => setLogoSettings({...logoSettings, width: parseInt(e.target.value)})} /></FormGroup></Col>
//                         <Col xs={6}><FormGroup><Label>Height</Label><Input type="number" value={logoSettings.height} onChange={e => setLogoSettings({...logoSettings, height: parseInt(e.target.value)})} /></FormGroup></Col></Row>
//                         <FormGroup><Label>Shape</Label><div className="d-flex gap-3"><Button size="sm" color={logoSettings.shape === 'rectangle' ? 'warning' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rectangle'})}><FaSquare /> Rectangle</Button><Button size="sm" color={logoSettings.shape === 'rounded' ? 'warning' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rounded'})}><FaSquare /> Rounded</Button><Button size="sm" color={logoSettings.shape === 'circle' ? 'warning' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'circle'})}><FaRegCircle /> Circle</Button></div></FormGroup>
//                         <Row><Col xs={6}><FormGroup><Label>Border Width</Label><Input type="number" value={logoSettings.borderWidth} onChange={e => setLogoSettings({...logoSettings, borderWidth: parseInt(e.target.value)})} /></FormGroup></Col>
//                         {logoSettings.borderWidth > 0 && <Col xs={6}><FormGroup><Label>Border Color</Label><Input type="color" value={logoSettings.borderColor} onChange={e => setLogoSettings({...logoSettings, borderColor: e.target.value})} /></FormGroup></Col>}</Row>
//                       </>
//                     )}
//                   </TabPane>
//                 </TabContent>

//                 <div className="d-flex justify-content-end gap-2 mt-4">
//                   <Button color="secondary" onClick={() => navigate('/weddingcards')}>Cancel</Button>
//                   <Button color="warning" type="submit" disabled={loading}>
//                     {loading ? <><FaSpinner className="spinner-border-sm me-1" /> Creating...</> : <><FaSave /> Create Wedding Card</>}
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
//                 {currentSide === 'front' ? 'Front Side Preview (Drag Text)' : currentSide === 'inside' ? 'Inside Side Preview (Drag Text)' : 'Back Side Preview'}
//                 <small className="d-block text-warning"><FaMousePointer /> Click and drag ANY text to reposition!</small>
//               </CardTitle>
//               <div className="preview-container" style={{ maxHeight: '60vh', overflowY: 'auto', textAlign: 'center' }}>
//                 <canvas
//                   ref={currentSide === 'front' ? frontCanvasRef : currentSide === 'inside' ? insideCanvasRef : backCanvasRef}
//                   style={{ width: '100%', height: 'auto', border: '1px solid #ddd', cursor: isDragging ? 'grabbing' : 'grab' }}
//                   width="800"
//                   height={currentSide === 'inside' ? "1050" : "1000"}
//                   onMouseDown={handleCanvasMouseDown}
//                   onMouseMove={handleCanvasMouseMove}
//                   onMouseUp={handleCanvasMouseUp}
//                   onMouseLeave={handleCanvasMouseUp}
//                 />
//               </div>
//               <div className="d-flex gap-2 mt-3">
//                 <Button color="success" onClick={downloadCard} className="flex-grow-1"><FaDownload /> Download {currentSide}</Button>
//                 <Button color="info" onClick={downloadAllSides} className="flex-grow-1"><FaDownload /> Download All</Button>
//                 <Button color="warning" onClick={() => setShowFullPreview(true)} className="flex-grow-1"><FaEye /> Full Preview</Button>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>

//       {/* Full Preview Modal */}
//       {showFullPreview && (
//         <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
//           <div className="modal-dialog modal-dialog-centered modal-xl">
//             <div className="modal-content bg-transparent border-0">
//               <div className="modal-body">
//                 <Row>
//                   <Col md={4} className="text-center mb-3"><h5 className="text-white bg-dark p-2 rounded">Front Side</h5><canvas ref={frontCanvasRef} style={{ width: '100%', height: 'auto', border: '1px solid #ddd' }} width="800" height="1000" /></Col>
//                   <Col md={4} className="text-center mb-3"><h5 className="text-white bg-dark p-2 rounded">Inside Side</h5><canvas ref={insideCanvasRef} style={{ width: '100%', height: 'auto', border: '1px solid #ddd' }} width="800" height="1050" /></Col>
//                   <Col md={4} className="text-center mb-3"><h5 className="text-white bg-dark p-2 rounded">Back Side</h5><canvas ref={backCanvasRef} style={{ width: '100%', height: 'auto', border: '1px solid #ddd' }} width="800" height="1000" /></Col>
//                 </Row>
//                 <div className="text-center mt-3"><Button color="success" onClick={downloadAllSides}><FaDownload /> Download All Sides</Button><Button color="secondary" className="ms-2" onClick={() => setShowFullPreview(false)}>Close</Button></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default WeddingCardCreator;



// WeddingCardCreator.jsx - COMPLETE WITH FRAME SIZES & FRONT SIDE OVERLAY & SINGLE UPLOAD
import React, { useState, useRef, useEffect } from 'react';
import {
  Container, Form, FormGroup, Label, Input, Button, Card, CardBody,
  CardTitle, Alert, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCloudUploadAlt, FaSpinner, FaEye, FaSave, FaMousePointer, FaDownload,
  FaHeart, FaCalendarAlt, FaMapMarkerAlt, FaPalette, FaFont,
  FaImages, FaCheckCircle, FaArrowsAlt, FaFillDrip, FaBold, FaItalic,
  FaUnderline, FaSquare, FaRegCircle, FaLanguage, FaGem, FaPhone,
  FaUserFriends, FaPlus, FaTimes, FaUser, FaVenusMars, FaAddressCard,
  FaRulerCombined
} from 'react-icons/fa';
import html2canvas from 'html2canvas';

const API_URL = 'https://designback.onrender.com/api/admin';

const WeddingCardCreator = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [language, setLanguage] = useState('en');
  const [currentSide, setCurrentSide] = useState('front');
  
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
  
  // THREE SEPARATE IMAGES
  const [frontImage, setFrontImage] = useState(null);
  const [insideImage, setInsideImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  
  const [originalFrontFile, setOriginalFrontFile] = useState(null);
  const [originalInsideFile, setOriginalInsideFile] = useState(null);
  const [originalBackFile, setOriginalBackFile] = useState(null);
  
  const [showFrontPicker, setShowFrontPicker] = useState(false);
  const [showInsidePicker, setShowInsidePicker] = useState(false);
  const [showBackPicker, setShowBackPicker] = useState(false);
  
  // Custom events list
  const [customEvents, setCustomEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', time: '', venue: '' });
  
  // Relatives list
  const [relatives, setRelatives] = useState([]);
  const [showRelativeForm, setShowRelativeForm] = useState(false);
  const [newRelative, setNewRelative] = useState({ name: '', relation: '', side: 'groom' });
  
  // Logo settings
  const [logoSettings, setLogoSettings] = useState({
    x: 350, y: 50, width: 100, height: 100, borderRadius: 50,
    borderWidth: 0, borderColor: '#d4af37', shape: 'circle', show: true
  });
  
  // Wedding card data
  const [cardData, setCardData] = useState({
    groomName: 'Rahul Sharma',
    groomFatherName: 'Mr. Rajesh Sharma',
    groomMotherName: 'Mrs. Suman Sharma',
    groomMobile: '+91 98765 43210',
    brideName: 'Priya Singh',
    brideFatherName: 'Mr. Sanjay Singh',
    brideMotherName: 'Mrs. Neha Singh',
    brideMobile: '+91 98765 43211',
    ceremonyDate: '25th November 2025',
    ceremonyTime: '7:00 PM onwards',
    ceremonyVenue: 'Grand Palace Hotel, Jaipur',
    ceremonyAddress: 'Sector 5, Vaishali Nagar, Jaipur - 302021',
    ceremonyContact: '+91 141 1234567',
    receptionDate: '26th November 2025',
    receptionTime: '8:00 PM',
    receptionVenue: 'Royal Convention Hall, Jaipur',
    receptionAddress: 'Tonk Road, Near Airport, Jaipur - 302018',
    receptionContact: '+91 141 7654321',
    additionalInfo: 'Dinner & Blessings',
    dressCode: 'Traditional / Formal',
    rsvpContact: '+91 98765 43212',
    rsvpBy: '15th November 2025',
    backgroundColor: '#fff8f0',
    textColor: '#5a3e2b',
    accentColor: '#d4af37',
    fontFamily: 'Georgia',
    showLogo: true,
    logo: null
  });
  
  // Hindi translations
  const [hindiTranslations, setHindiTranslations] = useState({
    groomName: 'राहुल शर्मा',
    groomFatherName: 'श्री राजेश शर्मा',
    groomMotherName: 'श्रीमती सुमन शर्मा',
    groomMobile: '+91 98765 43210',
    brideName: 'प्रिया सिंह',
    brideFatherName: 'श्री संजय सिंह',
    brideMotherName: 'श्रीमती नेहा सिंह',
    brideMobile: '+91 98765 43211',
    ceremonyDate: '25 नवंबर 2025',
    ceremonyTime: 'शाम 7:00 बजे से',
    ceremonyVenue: 'ग्रैंड पैलेस होटल, जयपुर',
    ceremonyAddress: 'सेक्टर 5, वैशाली नगर, जयपुर - 302021',
    ceremonyContact: '+91 141 1234567',
    receptionDate: '26 नवंबर 2025',
    receptionTime: 'रात 8:00 बजे',
    receptionVenue: 'रॉयल कन्वेंशन हॉल, जयपुर',
    receptionAddress: 'टोंक रोड, एयरपोर्ट के पास, जयपुर - 302018',
    receptionContact: '+91 141 7654321',
    additionalInfo: 'भोजन एवं आशीर्वाद',
    dressCode: 'पारंपरिक / औपचारिक',
    rsvpContact: '+91 98765 43212',
    rsvpBy: '15 नवंबर 2025'
  });
  
  // Text styles - FRONT SIDE + INSIDE SIDE both
  const [textStyles, setTextStyles] = useState({
    // FRONT SIDE FIELDS
    frontGroomName: { fontSize: 42, fontWeight: 'bold', color: '#d4af37', italic: false, underline: false, x: 400, y: 400, show: true },
    frontBrideName: { fontSize: 42, fontWeight: 'bold', color: '#d4af37', italic: false, underline: false, x: 400, y: 470, show: true },
    frontCeremonyDate: { fontSize: 20, fontWeight: 'bold', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 550, show: true },
    frontCeremonyVenue: { fontSize: 16, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 600, show: true },
    frontCeremonyAddress: { fontSize: 14, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 630, show: true },
    
    // INSIDE SIDE FIELDS
    groomName: { fontSize: 42, fontWeight: 'bold', color: '#d4af37', italic: false, underline: false, x: 400, y: 400, show: true },
    groomFatherName: { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 450, show: true },
    groomMotherName: { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 480, show: true },
    groomMobile: { fontSize: 14, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 510, show: true },
    brideName: { fontSize: 42, fontWeight: 'bold', color: '#d4af37', italic: false, underline: false, x: 400, y: 560, show: true },
    brideFatherName: { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 610, show: true },
    brideMotherName: { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 640, show: true },
    brideMobile: { fontSize: 14, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 670, show: true },
    ceremonyDate: { fontSize: 20, fontWeight: 'bold', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 720, show: true },
    ceremonyTime: { fontSize: 18, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 755, show: true },
    ceremonyVenue: { fontSize: 16, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 790, show: true },
    ceremonyAddress: { fontSize: 14, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 820, show: true },
    receptionDate: { fontSize: 20, fontWeight: 'bold', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 870, show: true },
    receptionTime: { fontSize: 18, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 905, show: true },
    receptionVenue: { fontSize: 16, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 940, show: true },
    receptionAddress: { fontSize: 14, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 970, show: true },
    dressCode: { fontSize: 14, fontWeight: 'normal', color: '#888888', italic: true, underline: false, x: 400, y: 1010, show: true }
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState('groomName');
  
  // Canvas refs
  const frontCanvasRef = useRef(null);
  const insideCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  
  const navigate = useNavigate();

  // Get current dimensions for selected side
  const getCurrentDimensions = () => {
    if (selectedFrame === 'custom') {
      return { width: customSize.width, height: customSize.height };
    }
    const frame = frameSizes[selectedFrame];
    return { width: frame.width, height: frame.height };
  };

  // Adjust dimensions for inside side (slightly taller)
  const getInsideDimensions = () => {
    const dims = getCurrentDimensions();
    return { width: dims.width, height: dims.height + 50 };
  };

  const sampleTemplates = {
    front: [
      { id: 1, name: 'Royal Gold', image: 'https://placehold.co/800x1131/d4af37/white?text=Royal+Gold' },
      { id: 2, name: 'Rose Garden', image: 'https://placehold.co/800x1131/ffb6c1/white?text=Rose+Garden' },
      { id: 3, name: 'Traditional Red', image: 'https://placehold.co/800x1131/dc143c/white?text=Traditional+Red' },
      { id: 4, name: 'Elegant Floral', image: 'https://placehold.co/800x1131/f5f5dc/black?text=Elegant+Floral' }
    ],
    inside: [
      { id: 1, name: 'Classic Inside', image: 'https://placehold.co/800x1181/fdf5e6/black?text=Classic+Inside' },
      { id: 2, name: 'Modern Inside', image: 'https://placehold.co/800x1181/faf0e6/black?text=Modern+Inside' }
    ],
    back: [
      { id: 1, name: 'Thank You', image: 'https://placehold.co/800x1131/f5f5dc/black?text=Thank+You' },
      { id: 2, name: 'Map Design', image: 'https://placehold.co/800x1131/fff8f0/black?text=Location+Map' }
    ]
  };

  const getDisplayText = (field) => {
    if (language === 'hi') {
      return hindiTranslations[field] || cardData[field];
    }
    return cardData[field];
  };

  const updateTextStyle = (field, styleName, value) => {
    setTextStyles(prev => ({
      ...prev,
      [field]: { ...prev[field], [styleName]: value }
    }));
    setTimeout(() => {
      if (currentSide === 'front') drawFrontCanvas();
      else drawInsideCanvas();
    }, 50);
  };

  const updateTextPosition = (field, x, y) => {
    setTextStyles(prev => ({
      ...prev,
      [field]: { ...prev[field], x, y }
    }));
  };

  // Add custom event
  const addCustomEvent = () => {
    if (newEvent.name) {
      setCustomEvents([...customEvents, { ...newEvent, id: Date.now() }]);
      setNewEvent({ name: '', date: '', time: '', venue: '' });
      setShowEventForm(false);
      setTimeout(() => drawInsideCanvas(), 50);
    }
  };

  const removeCustomEvent = (id) => {
    setCustomEvents(customEvents.filter(e => e.id !== id));
    setTimeout(() => drawInsideCanvas(), 50);
  };

  // Add relative
  const addRelative = () => {
    if (newRelative.name) {
      setRelatives([...relatives, { ...newRelative, id: Date.now() }]);
      setNewRelative({ name: '', relation: '', side: 'groom' });
      setShowRelativeForm(false);
      setTimeout(() => drawInsideCanvas(), 50);
    }
  };

  const removeRelative = (id) => {
    setRelatives(relatives.filter(r => r.id !== id));
    setTimeout(() => drawInsideCanvas(), 50);
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
    
    // Resize template images if they exist
    if (frontImage && originalFrontFile) {
      const resizedBlob = await resizeImageToCanvasSize(originalFrontFile, newDimensions.width, newDimensions.height);
      const resizedUrl = URL.createObjectURL(resizedBlob);
      setFrontImage(resizedUrl);
      setOriginalFrontFile(new File([resizedBlob], 'front.png', { type: 'image/png' }));
    }
    
    if (insideImage && originalInsideFile) {
      const insideDims = { width: newDimensions.width, height: newDimensions.height + 50 };
      const resizedBlob = await resizeImageToCanvasSize(originalInsideFile, insideDims.width, insideDims.height);
      const resizedUrl = URL.createObjectURL(resizedBlob);
      setInsideImage(resizedUrl);
      setOriginalInsideFile(new File([resizedBlob], 'inside.png', { type: 'image/png' }));
    }
    
    if (backImage && originalBackFile) {
      const resizedBlob = await resizeImageToCanvasSize(originalBackFile, newDimensions.width, newDimensions.height);
      const resizedUrl = URL.createObjectURL(resizedBlob);
      setBackImage(resizedUrl);
      setOriginalBackFile(new File([resizedBlob], 'back.png', { type: 'image/png' }));
    }
  };

  // Draw FRONT canvas with text overlay
  const drawFrontCanvas = () => {
    const canvas = frontCanvasRef.current;
    if (!canvas) return;
    const dimensions = getCurrentDimensions();
    const ctx = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const drawOverlay = () => {
      // Draw front side text fields
      const frontFields = ['frontGroomName', 'frontBrideName', 'frontCeremonyDate', 'frontCeremonyVenue', 'frontCeremonyAddress'];
      
      frontFields.forEach(field => {
        const style = textStyles[field];
        if (style && style.show) {
          let text = '';
          if (field === 'frontGroomName') text = getDisplayText('groomName');
          else if (field === 'frontBrideName') text = getDisplayText('brideName');
          else if (field === 'frontCeremonyDate') text = getDisplayText('ceremonyDate');
          else if (field === 'frontCeremonyVenue') text = getDisplayText('ceremonyVenue');
          else if (field === 'frontCeremonyAddress') text = getDisplayText('ceremonyAddress');
          
          if (text) {
            drawTextAtPosition(ctx, text, style, cardData.fontFamily, style.x, style.y);
          }
        }
      });
      
      // Draw logo on front
      if (cardData.showLogo && previewImage && logoSettings.show) {
        drawLogoOnCanvas(ctx, previewImage, logoSettings);
      }
    };
    
    if (frontImage) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawOverlay();
      };
      img.onerror = () => {
        ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawOverlay();
      };
      img.src = frontImage;
    } else {
      ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawOverlay();
    }
  };

  // Draw INSIDE canvas with text overlay
  const drawInsideCanvas = () => {
    const canvas = insideCanvasRef.current;
    if (!canvas) return;
    const dimensions = getInsideDimensions();
    const ctx = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const drawOverlay = () => {
      // Header
      ctx.font = `italic 28px ${cardData.fontFamily}`;
      ctx.fillStyle = cardData.accentColor;
      ctx.textAlign = 'center';
      ctx.fillText(language === 'hi' ? 'विवाह निमंत्रण' : 'WEDDING INVITATION', dimensions.width / 2, 80);
      
      // Draw all text fields
      const allFields = [
        'groomName', 'groomFatherName', 'groomMotherName', 'groomMobile',
        'brideName', 'brideFatherName', 'brideMotherName', 'brideMobile',
        'ceremonyDate', 'ceremonyTime', 'ceremonyVenue', 'ceremonyAddress',
        'receptionDate', 'receptionTime', 'receptionVenue', 'receptionAddress',
        'dressCode'
      ];
      
      allFields.forEach(field => {
        const style = textStyles[field];
        if (style && style.show) {
          const text = getDisplayText(field);
          if (text) {
            drawTextAtPosition(ctx, text, style, cardData.fontFamily, style.x, style.y);
          }
        }
      });
      
      // Custom Events
      if (customEvents.length > 0) {
        let eventY = (textStyles.receptionAddress?.y + 40) || (dimensions.height - 150);
        ctx.font = `bold 18px ${cardData.fontFamily}`;
        ctx.fillStyle = cardData.accentColor;
        ctx.fillText(language === 'hi' ? 'अन्य कार्यक्रम' : 'Other Events', dimensions.width / 2, eventY);
        eventY += 35;
        
        customEvents.forEach(event => {
          ctx.font = `bold 16px ${cardData.fontFamily}`;
          ctx.fillStyle = '#d4af37';
          ctx.fillText(event.name, dimensions.width / 2, eventY);
          eventY += 25;
          ctx.font = `14px ${cardData.fontFamily}`;
          ctx.fillStyle = cardData.textColor;
          ctx.fillText(`${event.date} | ${event.time}`, dimensions.width / 2, eventY);
          eventY += 22;
          ctx.fillText(event.venue, dimensions.width / 2, eventY);
          eventY += 28;
        });
      }
      
      // Relatives
      if (relatives.length > 0) {
        let relY = customEvents.length > 0 ? 
          ((textStyles.receptionAddress?.y + 40) + (customEvents.length * 75)) : 
          ((textStyles.receptionAddress?.y + 40) || (dimensions.height - 150));
        
        ctx.font = `bold 18px ${cardData.fontFamily}`;
        ctx.fillStyle = cardData.accentColor;
        ctx.fillText(language === 'hi' ? 'परिवार के सदस्य' : 'Family Members', dimensions.width / 2, relY);
        relY += 35;
        
        const groomRelatives = relatives.filter(r => r.side === 'groom');
        const brideRelatives = relatives.filter(r => r.side === 'bride');
        
        if (groomRelatives.length > 0) {
          ctx.font = `italic 14px ${cardData.fontFamily}`;
          ctx.fillStyle = '#d4af37';
          ctx.fillText(language === 'hi' ? 'वर की ओर से' : 'Groom\'s Side', dimensions.width / 2, relY);
          relY += 25;
          groomRelatives.forEach(rel => {
            ctx.font = `14px ${cardData.fontFamily}`;
            ctx.fillStyle = cardData.textColor;
            ctx.fillText(`${rel.name} (${rel.relation})`, dimensions.width / 2, relY);
            relY += 22;
          });
          relY += 10;
        }
        
        if (brideRelatives.length > 0) {
          ctx.font = `italic 14px ${cardData.fontFamily}`;
          ctx.fillStyle = '#d4af37';
          ctx.fillText(language === 'hi' ? 'वधू की ओर से' : 'Bride\'s Side', dimensions.width / 2, relY);
          relY += 25;
          brideRelatives.forEach(rel => {
            ctx.font = `14px ${cardData.fontFamily}`;
            ctx.fillStyle = cardData.textColor;
            ctx.fillText(`${rel.name} (${rel.relation})`, dimensions.width / 2, relY);
            relY += 22;
          });
        }
      }
      
      // RSVP
      if (cardData.rsvpContact) {
        let rsvpY = dimensions.height - 30;
        ctx.font = `14px ${cardData.fontFamily}`;
        ctx.fillStyle = '#888888';
        ctx.fillText(`${language === 'hi' ? 'कृपया RSVP करें' : 'Please RSVP'}: ${cardData.rsvpContact} ${language === 'hi' ? 'तक' : 'by'} ${cardData.rsvpBy}`, dimensions.width / 2, rsvpY);
      }
    };
    
    if (insideImage) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawOverlay();
      };
      img.onerror = () => {
        ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawOverlay();
      };
      img.src = insideImage;
    } else {
      ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawOverlay();
    }
  };

  const drawBackCanvas = () => {
    const canvas = backCanvasRef.current;
    if (!canvas) return;
    const dimensions = getCurrentDimensions();
    const ctx = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const drawBackText = (ctx) => {
      ctx.font = `bold 32px ${cardData.fontFamily}`;
      ctx.fillStyle = cardData.accentColor;
      ctx.textAlign = 'center';
      ctx.fillText(language === 'hi' ? 'धन्यवाद' : 'Thank You', dimensions.width / 2, dimensions.height / 2 - 100);
      ctx.font = `20px ${cardData.fontFamily}`;
      ctx.fillStyle = cardData.textColor;
      ctx.fillText(language === 'hi' ? 'हमें आपका आशीर्वाद चाहिए' : 'We need your blessings', dimensions.width / 2, dimensions.height / 2 - 30);
      ctx.font = `16px ${cardData.fontFamily}`;
      ctx.fillText(language === 'hi' ? 'कृपया हमारे इस खुशी के मौके पर जरूर आएं' : 'Please grace this occasion with your presence', dimensions.width / 2, dimensions.height / 2 + 20);
      ctx.font = `14px ${cardData.fontFamily}`;
      ctx.fillStyle = '#888888';
      ctx.fillText(cardData.additionalInfo, dimensions.width / 2, dimensions.height / 2 + 80);
    };
    
    if (backImage) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawBackText(ctx);
      };
      img.src = backImage;
    } else {
      ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawBackText(ctx);
    }
  };

  const drawTextAtPosition = (ctx, text, style, fontFamily, x, y) => {
    if (!text) return;
    let fontStyle = '';
    if (style.italic) fontStyle += 'italic ';
    fontStyle += style.fontWeight;
    
    ctx.save();
    ctx.font = `${fontStyle} ${style.fontSize}px ${fontFamily}`;
    ctx.fillStyle = style.color;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
    
    if (style.underline) {
      const metrics = ctx.measureText(text);
      ctx.beginPath();
      ctx.moveTo(x - metrics.width/2, y + 2);
      ctx.lineTo(x + metrics.width/2, y + 2);
      ctx.strokeStyle = style.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawLogoOnCanvas = (ctx, logoUrl, settings) => {
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

  // Drag handlers
  const handleCanvasMouseDown = (e) => {
    const canvas = currentSide === 'front' ? frontCanvasRef.current : insideCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    let allFields = [];
    if (currentSide === 'front') {
      allFields = ['frontGroomName', 'frontBrideName', 'frontCeremonyDate', 'frontCeremonyVenue', 'frontCeremonyAddress'];
    } else {
      allFields = [
        'groomName', 'groomFatherName', 'groomMotherName', 'groomMobile',
        'brideName', 'brideFatherName', 'brideMotherName', 'brideMobile',
        'ceremonyDate', 'ceremonyTime', 'ceremonyVenue', 'ceremonyAddress',
        'receptionDate', 'receptionTime', 'receptionVenue', 'receptionAddress',
        'dressCode'
      ];
    }
    
    for (const field of allFields) {
      const style = textStyles[field];
      if (!style?.show) continue;
      
      let text = '';
      if (field === 'frontGroomName') text = getDisplayText('groomName');
      else if (field === 'frontBrideName') text = getDisplayText('brideName');
      else if (field === 'frontCeremonyDate') text = getDisplayText('ceremonyDate');
      else if (field === 'frontCeremonyVenue') text = getDisplayText('ceremonyVenue');
      else if (field === 'frontCeremonyAddress') text = getDisplayText('ceremonyAddress');
      else text = getDisplayText(field);
      
      if (!text) continue;
      
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      let fontStyle = style.italic ? 'italic ' : '';
      fontStyle += style.fontWeight;
      tempCtx.font = `${fontStyle} ${style.fontSize}px ${cardData.fontFamily}`;
      const textWidth = tempCtx.measureText(text).width;
      const textHeight = style.fontSize;
      
      if (mouseX >= style.x - textWidth/2 - 15 && mouseX <= style.x + textWidth/2 + 15 &&
          mouseY >= style.y - textHeight - 10 && mouseY <= style.y + 10) {
        setIsDragging(true);
        setDragTarget({ type: 'text', field });
        setDragStart({ x: mouseX - style.x, y: mouseY - style.y });
        e.preventDefault();
        return;
      }
    }
  };
  
  const handleCanvasMouseMove = (e) => {
    if (!isDragging || !dragTarget) return;
    
    const canvas = currentSide === 'front' ? frontCanvasRef.current : insideCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    if (dragTarget.type === 'text') {
      const newX = mouseX - dragStart.x;
      const newY = mouseY - dragStart.y;
      updateTextPosition(dragTarget.field, newX, newY);
      if (currentSide === 'front') drawFrontCanvas();
      else drawInsideCanvas();
    }
  };
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  // SINGLE UPLOAD HANDLER
  const handleFileUpload = async (side, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 5MB');
      return;
    }
    
    const dimensions = side === 'inside' ? getInsideDimensions() : getCurrentDimensions();
    const resizedBlob = await resizeImageToCanvasSize(file, dimensions.width, dimensions.height);
    const url = URL.createObjectURL(resizedBlob);
    
    if (side === 'front') {
      setFrontImage(url);
      setOriginalFrontFile(new File([resizedBlob], 'front.png', { type: 'image/png' }));
      setShowFrontPicker(false);
      setTimeout(() => drawFrontCanvas(), 100);
    } else if (side === 'inside') {
      setInsideImage(url);
      setOriginalInsideFile(new File([resizedBlob], 'inside.png', { type: 'image/png' }));
      setShowInsidePicker(false);
      setTimeout(() => drawInsideCanvas(), 100);
    } else {
      setBackImage(url);
      setOriginalBackFile(new File([resizedBlob], 'back.png', { type: 'image/png' }));
      setShowBackPicker(false);
      setTimeout(() => drawBackCanvas(), 100);
    }
  };

  const selectTemplate = async (side, template) => {
    const response = await fetch(template.image);
    const blob = await response.blob();
    const dimensions = side === 'inside' ? getInsideDimensions() : getCurrentDimensions();
    const resizedBlob = await resizeImageToCanvasSize(blob, dimensions.width, dimensions.height);
    const url = URL.createObjectURL(resizedBlob);
    
    if (side === 'front') {
      setFrontImage(url);
      setOriginalFrontFile(new File([resizedBlob], 'template.png', { type: 'image/png' }));
      setShowFrontPicker(false);
      setTimeout(() => drawFrontCanvas(), 100);
    } else if (side === 'inside') {
      setInsideImage(url);
      setOriginalInsideFile(new File([resizedBlob], 'template.png', { type: 'image/png' }));
      setShowInsidePicker(false);
      setTimeout(() => drawInsideCanvas(), 100);
    } else {
      setBackImage(url);
      setOriginalBackFile(new File([resizedBlob], 'template.png', { type: 'image/png' }));
      setShowBackPicker(false);
      setTimeout(() => drawBackCanvas(), 100);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Logo size should be less than 2MB');
      return;
    }
    setCardData({ ...cardData, logo: file });
    setPreviewImage(URL.createObjectURL(file));
    setTimeout(() => drawFrontCanvas(), 100);
  };

  const downloadCard = () => {
    let canvas;
    if (currentSide === 'front') canvas = frontCanvasRef.current;
    else if (currentSide === 'inside') canvas = insideCanvasRef.current;
    else canvas = backCanvasRef.current;
    
    if (canvas) {
      const link = document.createElement('a');
      link.download = `wedding_card_${currentSide}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const downloadAllSides = () => {
    if (frontCanvasRef.current) {
      const link = document.createElement('a');
      link.download = 'wedding_card_front.png';
      link.href = frontCanvasRef.current.toDataURL('image/png');
      link.click();
    }
    setTimeout(() => {
      if (insideCanvasRef.current) {
        const link = document.createElement('a');
        link.download = 'wedding_card_inside.png';
        link.href = insideCanvasRef.current.toDataURL('image/png');
        link.click();
      }
    }, 500);
    setTimeout(() => {
      if (backCanvasRef.current) {
        const link = document.createElement('a');
        link.download = 'wedding_card_back.png';
        link.href = backCanvasRef.current.toDataURL('image/png');
        link.click();
      }
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const dimensions = getCurrentDimensions();
    const insideDimensions = getInsideDimensions();
    const formData = new FormData();

    Object.keys(cardData).forEach(key => {
      if (key !== 'logo') formData.append(key, cardData[key]);
    });
    formData.append('textStyles', JSON.stringify(textStyles));
    formData.append('logoSettings', JSON.stringify(logoSettings));
    formData.append('language', language);
    formData.append('customEvents', JSON.stringify(customEvents));
    formData.append('relatives', JSON.stringify(relatives));
    formData.append('frameSize', JSON.stringify(dimensions));
    formData.append('design', JSON.stringify({
      backgroundColor: cardData.backgroundColor,
      textColor: cardData.textColor,
      accentColor: cardData.accentColor,
      fontFamily: cardData.fontFamily,
      showLogo: cardData.showLogo
    }));

    if (cardData.logo) formData.append('logo', cardData.logo);

    if (originalFrontFile) {
      const blob = await resizeImageToCanvasSize(originalFrontFile, dimensions.width, dimensions.height);
      formData.append('frontImage', blob, 'front.png');
    }
    if (originalInsideFile) {
      const blob = await resizeImageToCanvasSize(originalInsideFile, insideDimensions.width, insideDimensions.height);
      formData.append('insideImage', blob, 'inside.png');
    }
    if (originalBackFile) {
      const blob = await resizeImageToCanvasSize(originalBackFile, dimensions.width, dimensions.height);
      formData.append('backImage', blob, 'back.png');
    }

    // Capture front preview
    const frontBlob = await new Promise((resolve) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = dimensions.width;
      offscreen.height = dimensions.height;
      const ctx = offscreen.getContext('2d');

      const drawIt = () => {
        ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        const frontFields = ['frontGroomName', 'frontBrideName', 'frontCeremonyDate', 'frontCeremonyVenue', 'frontCeremonyAddress'];
        frontFields.forEach(field => {
          const style = textStyles[field];
          if (!style?.show) return;
          let text = '';
          if (field === 'frontGroomName') text = cardData.groomName;
          else if (field === 'frontBrideName') text = cardData.brideName;
          else if (field === 'frontCeremonyDate') text = cardData.ceremonyDate;
          else if (field === 'frontCeremonyVenue') text = cardData.ceremonyVenue;
          else if (field === 'frontCeremonyAddress') text = cardData.ceremonyAddress;
          if (text) drawTextAtPosition(ctx, text, style, cardData.fontFamily, style.x, style.y);
        });

        setTimeout(() => offscreen.toBlob(resolve, 'image/png'), 200);
      };

      if (frontImage) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => { ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height); drawIt(); };
        img.onerror = drawIt;
        img.src = frontImage;
      } else {
        drawIt();
      }
    });

    if (frontBlob && frontBlob.size > 1000) {
      formData.append('frontPreview', frontBlob, 'front_preview.png');
    }

    // Capture inside preview
    const insideBlob = await new Promise((resolve) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = insideDimensions.width;
      offscreen.height = insideDimensions.height;
      const ctx = offscreen.getContext('2d');

      const drawIt = () => {
        ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
        ctx.fillRect(0, 0, insideDimensions.width, insideDimensions.height);

        ctx.font = `italic 28px ${cardData.fontFamily}`;
        ctx.fillStyle = cardData.accentColor;
        ctx.textAlign = 'center';
        ctx.fillText(language === 'hi' ? 'विवाह निमंत्रण' : 'WEDDING INVITATION', insideDimensions.width / 2, 80);

        const allFields = [
          'groomName','groomFatherName','groomMotherName','groomMobile',
          'brideName','brideFatherName','brideMotherName','brideMobile',
          'ceremonyDate','ceremonyTime','ceremonyVenue','ceremonyAddress',
          'receptionDate','receptionTime','receptionVenue','receptionAddress','dressCode'
        ];
        allFields.forEach(field => {
          const style = textStyles[field];
          if (style?.show) {
            const text = cardData[field];
            if (text) drawTextAtPosition(ctx, text, style, cardData.fontFamily, style.x, style.y);
          }
        });

        setTimeout(() => offscreen.toBlob(resolve, 'image/png'), 200);
      };

      if (insideImage) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => { ctx.drawImage(img, 0, 0, insideDimensions.width, insideDimensions.height); drawIt(); };
        img.onerror = drawIt;
        img.src = insideImage;
      } else {
        drawIt();
      }
    });

    if (insideBlob && insideBlob.size > 1000) {
      formData.append('insidePreview', insideBlob, 'inside_preview.png');
    }

    // Back preview
    if (backCanvasRef.current) {
      drawBackCanvas();
      await new Promise(r => setTimeout(r, 300));
      const backBlob = await new Promise(r => backCanvasRef.current.toBlob(r, 'image/png'));
      if (backBlob && backBlob.size > 1000) {
        formData.append('backPreview', backBlob, 'back_preview.png');
      }
    }

    try {
      const response = await axios.post(`${API_URL}/createweddingcard`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMessage(language === 'hi' ? 'वेडिंग कार्ड सफलतापूर्वक बनाया गया!' : 'Wedding card created successfully!');
      setTimeout(() => navigate('/weddingcards'), 2000);
    } catch (error) {
      console.error('Submit error:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Error creating wedding card');
    } finally {
      setLoading(false);
    }
  };

  // Redraw canvases
  useEffect(() => {
    drawFrontCanvas();
    drawInsideCanvas();
    drawBackCanvas();
  }, [cardData, textStyles, previewImage, logoSettings, language, customEvents, relatives, selectedFrame, customSize]);

  const frontInputRef = useRef(null);
  const insideInputRef = useRef(null);
  const backInputRef = useRef(null);
  const logoInputRef = useRef(null);
  
  const dimensions = getCurrentDimensions();

  return (
    <Container fluid className="my-5">
      <Row>
        <Col md={6}>
          <Card className="shadow-lg border-0">
            <CardBody className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h3" className="text-warning mb-0">
                  <FaHeart className="me-2 text-danger" /> Wedding Card Creator
                </CardTitle>
                <div>
                  <Button color={language === 'en' ? 'warning' : 'secondary'} size="sm" onClick={() => setLanguage('en')} className="me-2">
                    <FaLanguage /> English
                  </Button>
                  <Button color={language === 'hi' ? 'warning' : 'secondary'} size="sm" onClick={() => setLanguage('hi')}>
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
                      color={selectedFrame === 'a4' ? 'warning' : 'outline-warning'}
                      size="sm"
                      onClick={() => handleFrameChange('a4')}
                      className="w-100"
                    >
                      A4 ({frameSizes.a4.width}×{frameSizes.a4.height})
                    </Button>
                  </Col>
                  <Col xs={6} md={4} className="mb-2">
                    <Button 
                      color={selectedFrame === 'letter' ? 'warning' : 'outline-warning'}
                      size="sm"
                      onClick={() => handleFrameChange('letter')}
                      className="w-100"
                    >
                      Letter ({frameSizes.letter.width}×{frameSizes.letter.height})
                    </Button>
                  </Col>
                  <Col xs={6} md={4} className="mb-2">
                    <Button 
                      color={selectedFrame === 'square' ? 'warning' : 'outline-warning'}
                      size="sm"
                      onClick={() => handleFrameChange('square')}
                      className="w-100"
                    >
                      Square ({frameSizes.square.width}×{frameSizes.square.height})
                    </Button>
                  </Col>
                  <Col xs={6} md={4} className="mb-2">
                    <Button 
                      color={selectedFrame === 'wide' ? 'warning' : 'outline-warning'}
                      size="sm"
                      onClick={() => handleFrameChange('wide')}
                      className="w-100"
                    >
                      Wide ({frameSizes.wide.width}×{frameSizes.wide.height})
                    </Button>
                  </Col>
                  <Col xs={6} md={4} className="mb-2">
                    <Button 
                      color={selectedFrame === 'custom' ? 'warning' : 'outline-warning'}
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

              {/* All 3 Sides Thumbnails */}
              <div className="mb-4">
                <Label className="fw-bold mb-2"><FaGem className="me-2" />All Card Sides (Click to Edit)</Label>
                <Row>
                  <Col md={4}>
                    <Card className={`text-center ${currentSide === 'front' ? 'border-warning border-3' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setCurrentSide('front')}>
                      <CardBody className="p-2">
                        <small className="text-primary">Front Side</small>
                        <div style={{ height: '120px', overflow: 'hidden' }}>
                          <canvas ref={frontCanvasRef} style={{ width: '100%', height: 'auto' }} />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className={`text-center ${currentSide === 'inside' ? 'border-warning border-3' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setCurrentSide('inside')}>
                      <CardBody className="p-2">
                        <small className="text-primary">Inside Side</small>
                        <div style={{ height: '120px', overflow: 'hidden' }}>
                          <canvas ref={insideCanvasRef} style={{ width: '100%', height: 'auto' }} />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className={`text-center ${currentSide === 'back' ? 'border-warning border-3' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setCurrentSide('back')}>
                      <CardBody className="p-2">
                        <small className="text-primary">Back Side</small>
                        <div style={{ height: '120px', overflow: 'hidden' }}>
                          <canvas ref={backCanvasRef} style={{ width: '100%', height: 'auto' }} />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Template Upload - SINGLE UPLOAD */}
              <div className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Label className="fw-bold mb-0"><FaImages className="me-2" />
                    {currentSide === 'front' ? 'Front Template' : currentSide === 'inside' ? 'Inside Template' : 'Back Template'}
                  </Label>
                  <Button size="sm" color="warning" onClick={() => {
                    if (currentSide === 'front') setShowFrontPicker(!showFrontPicker);
                    else if (currentSide === 'inside') setShowInsidePicker(!showInsidePicker);
                    else setShowBackPicker(!showBackPicker);
                  }}>
                    <FaCloudUploadAlt /> Change Template
                  </Button>
                </div>
                
                {(currentSide === 'front' && showFrontPicker) && (
                  <div className="mt-2">
                    <input ref={frontInputRef} type="file" hidden onChange={(e) => handleFileUpload('front', e)} accept="image/*" />
                    <Button size="sm" color="secondary" onClick={() => frontInputRef.current?.click()} className="w-100 mb-2">
                      <FaCloudUploadAlt /> Upload Custom Template
                    </Button>
                    <div className="row">
                      {sampleTemplates.front.map(template => (
                        <div key={template.id} className="col-6 col-md-3 mb-2">
                          <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate('front', template)}>
                            <img src={template.image} alt={template.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                            <small>{template.name}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(currentSide === 'inside' && showInsidePicker) && (
                  <div className="mt-2">
                    <input ref={insideInputRef} type="file" hidden onChange={(e) => handleFileUpload('inside', e)} accept="image/*" />
                    <Button size="sm" color="secondary" onClick={() => insideInputRef.current?.click()} className="w-100 mb-2">
                      <FaCloudUploadAlt /> Upload Custom Template
                    </Button>
                    <div className="row">
                      {sampleTemplates.inside.map(template => (
                        <div key={template.id} className="col-6 col-md-3 mb-2">
                          <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate('inside', template)}>
                            <img src={template.image} alt={template.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                            <small>{template.name}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(currentSide === 'back' && showBackPicker) && (
                  <div className="mt-2">
                    <input ref={backInputRef} type="file" hidden onChange={(e) => handleFileUpload('back', e)} accept="image/*" />
                    <Button size="sm" color="secondary" onClick={() => backInputRef.current?.click()} className="w-100 mb-2">
                      <FaCloudUploadAlt /> Upload Custom Template
                    </Button>
                    <div className="row">
                      {sampleTemplates.back.map(template => (
                        <div key={template.id} className="col-6 col-md-3 mb-2">
                          <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate('back', template)}>
                            <img src={template.image} alt={template.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                            <small>{template.name}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Nav tabs className="mb-3">
                <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}><FaHeart /> Details</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><FaUserFriends /> Events & Family</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><FaPalette /> Text Style</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '4' ? 'active' : ''} onClick={() => setActiveTab('4')}><FaImages /> Logo</NavLink></NavItem>
              </Nav>

              <Form onSubmit={handleSubmit}>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <h6 className="text-warning mb-3"><FaUser /> Groom Details</h6>
                    <Row>
                      <Col md={6}><FormGroup><Label>Groom Name</Label><Input value={cardData.groomName} onChange={e => { setCardData({...cardData, groomName: e.target.value}); drawFrontCanvas(); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Groom Father's Name</Label><Input value={cardData.groomFatherName} onChange={e => { setCardData({...cardData, groomFatherName: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Groom Mother's Name</Label><Input value={cardData.groomMotherName} onChange={e => { setCardData({...cardData, groomMotherName: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label><FaPhone /> Groom Mobile</Label><Input value={cardData.groomMobile} onChange={e => { setCardData({...cardData, groomMobile: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                    </Row>
                    
                    <h6 className="text-warning mb-3 mt-3"><FaVenusMars /> Bride Details</h6>
                    <Row>
                      <Col md={6}><FormGroup><Label>Bride Name</Label><Input value={cardData.brideName} onChange={e => { setCardData({...cardData, brideName: e.target.value}); drawFrontCanvas(); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Bride Father's Name</Label><Input value={cardData.brideFatherName} onChange={e => { setCardData({...cardData, brideFatherName: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Bride Mother's Name</Label><Input value={cardData.brideMotherName} onChange={e => { setCardData({...cardData, brideMotherName: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label><FaPhone /> Bride Mobile</Label><Input value={cardData.brideMobile} onChange={e => { setCardData({...cardData, brideMobile: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                    </Row>
                    
                    <h6 className="text-warning mb-3 mt-3"><FaCalendarAlt /> Wedding Ceremony</h6>
                    <Row>
                      <Col md={6}><FormGroup><Label>Ceremony Date</Label><Input value={cardData.ceremonyDate} onChange={e => { setCardData({...cardData, ceremonyDate: e.target.value}); drawFrontCanvas(); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Ceremony Time</Label><Input value={cardData.ceremonyTime} onChange={e => { setCardData({...cardData, ceremonyTime: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label>Ceremony Venue</Label><Input value={cardData.ceremonyVenue} onChange={e => { setCardData({...cardData, ceremonyVenue: e.target.value}); drawFrontCanvas(); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label>Ceremony Address</Label><Input value={cardData.ceremonyAddress} onChange={e => { setCardData({...cardData, ceremonyAddress: e.target.value}); drawFrontCanvas(); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label><FaPhone /> Ceremony Contact</Label><Input value={cardData.ceremonyContact} onChange={e => { setCardData({...cardData, ceremonyContact: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}><FormGroup><Label>Reception Date</Label><Input value={cardData.receptionDate} onChange={e => { setCardData({...cardData, receptionDate: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Reception Time</Label><Input value={cardData.receptionTime} onChange={e => { setCardData({...cardData, receptionTime: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label>Reception Venue</Label><Input value={cardData.receptionVenue} onChange={e => { setCardData({...cardData, receptionVenue: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label>Reception Address</Label><Input value={cardData.receptionAddress} onChange={e => { setCardData({...cardData, receptionAddress: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label><FaPhone /> Reception Contact</Label><Input value={cardData.receptionContact} onChange={e => { setCardData({...cardData, receptionContact: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                    </Row>
                    
                    <h6 className="text-warning mb-3 mt-3"><FaAddressCard /> Additional Info</h6>
                    <Row>
                      <Col md={12}><FormGroup><Label>Additional Info</Label><Input value={cardData.additionalInfo} onChange={e => { setCardData({...cardData, additionalInfo: e.target.value}); drawBackCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Dress Code</Label><Input value={cardData.dressCode} onChange={e => { setCardData({...cardData, dressCode: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label><FaPhone /> RSVP Contact</Label><Input value={cardData.rsvpContact} onChange={e => { setCardData({...cardData, rsvpContact: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>RSVP By Date</Label><Input value={cardData.rsvpBy} onChange={e => { setCardData({...cardData, rsvpBy: e.target.value}); drawInsideCanvas(); }} /></FormGroup></Col>
                    </Row>
                  </TabPane>

                  <TabPane tabId="2">
                    <h6 className="text-warning mb-3"><FaCalendarAlt /> Custom Events</h6>
                    {customEvents.map((event) => (
                      <div key={event.id} className="border rounded p-2 mb-2 bg-light">
                        <div className="d-flex justify-content-between">
                          <strong>{event.name}</strong>
                          <Button size="sm" color="danger" onClick={() => removeCustomEvent(event.id)}><FaTimes /></Button>
                        </div>
                        <small>{event.date} | {event.time}</small>
                        <br /><small>{event.venue}</small>
                      </div>
                    ))}
                    {showEventForm ? (
                      <div className="border rounded p-3 mb-2">
                        <FormGroup><Label>Event Name</Label><Input value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} /></FormGroup>
                        <Row><Col md={6}><FormGroup><Label>Date</Label><Input value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} /></FormGroup></Col>
                        <Col md={6}><FormGroup><Label>Time</Label><Input value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} /></FormGroup></Col></Row>
                        <FormGroup><Label>Venue</Label><Input value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} /></FormGroup>
                        <div className="d-flex gap-2"><Button color="success" size="sm" onClick={addCustomEvent}>Add</Button><Button color="secondary" size="sm" onClick={() => setShowEventForm(false)}>Cancel</Button></div>
                      </div>
                    ) : (
                      <Button size="sm" color="primary" onClick={() => setShowEventForm(true)} className="mb-3"><FaPlus /> Add Custom Event</Button>
                    )}
                    
                    <h6 className="text-warning mb-3 mt-3"><FaUserFriends /> Family Members / Relatives</h6>
                    {relatives.map((rel) => (
                      <div key={rel.id} className="border rounded p-2 mb-2 bg-light">
                        <div className="d-flex justify-content-between">
                          <div><strong>{rel.name}</strong> <span className="text-muted">({rel.relation})</span> - {rel.side === 'groom' ? 'Groom Side' : 'Bride Side'}</div>
                          <Button size="sm" color="danger" onClick={() => removeRelative(rel.id)}><FaTimes /></Button>
                        </div>
                      </div>
                    ))}
                    {showRelativeForm ? (
                      <div className="border rounded p-3 mb-2">
                        <FormGroup><Label>Name</Label><Input value={newRelative.name} onChange={e => setNewRelative({...newRelative, name: e.target.value})} /></FormGroup>
                        <FormGroup><Label>Relation</Label><Input value={newRelative.relation} onChange={e => setNewRelative({...newRelative, relation: e.target.value})} placeholder="e.g., Brother, Sister, Uncle" /></FormGroup>
                        <FormGroup><Label>Side</Label><Input type="select" value={newRelative.side} onChange={e => setNewRelative({...newRelative, side: e.target.value})}><option value="groom">Groom's Side</option><option value="bride">Bride's Side</option></Input></FormGroup>
                        <div className="d-flex gap-2"><Button color="success" size="sm" onClick={addRelative}>Add</Button><Button color="secondary" size="sm" onClick={() => setShowRelativeForm(false)}>Cancel</Button></div>
                      </div>
                    ) : (
                      <Button size="sm" color="primary" onClick={() => setShowRelativeForm(true)}><FaPlus /> Add Family Member</Button>
                    )}
                  </TabPane>

                  <TabPane tabId="3">
                    <FormGroup><Label>Select Field to Style & Drag</Label>
                      <Input type="select" value={selectedElement} onChange={e => setSelectedElement(e.target.value)}>
                        <optgroup label="Front Side">
                          <option value="frontGroomName">Front - Groom Name</option>
                          <option value="frontBrideName">Front - Bride Name</option>
                          <option value="frontCeremonyDate">Front - Ceremony Date</option>
                          <option value="frontCeremonyVenue">Front - Ceremony Venue</option>
                          <option value="frontCeremonyAddress">Front - Ceremony Address</option>
                        </optgroup>
                        <optgroup label="Inside Side">
                          <option value="groomName">Inside - Groom Name</option>
                          <option value="groomFatherName">Inside - Groom Father</option>
                          <option value="groomMotherName">Inside - Groom Mother</option>
                          <option value="groomMobile">Inside - Groom Mobile</option>
                          <option value="brideName">Inside - Bride Name</option>
                          <option value="brideFatherName">Inside - Bride Father</option>
                          <option value="brideMotherName">Inside - Bride Mother</option>
                          <option value="brideMobile">Inside - Bride Mobile</option>
                          <option value="ceremonyDate">Inside - Ceremony Date</option>
                          <option value="ceremonyTime">Inside - Ceremony Time</option>
                          <option value="ceremonyVenue">Inside - Ceremony Venue</option>
                          <option value="ceremonyAddress">Inside - Ceremony Address</option>
                          <option value="receptionDate">Inside - Reception Date</option>
                          <option value="receptionTime">Inside - Reception Time</option>
                          <option value="receptionVenue">Inside - Reception Venue</option>
                          <option value="receptionAddress">Inside - Reception Address</option>
                          <option value="dressCode">Inside - Dress Code</option>
                        </optgroup>
                      </Input>
                    </FormGroup>
                    {selectedElement && textStyles[selectedElement] && (
                      <>
                        <Row><Col xs={6}><FormGroup><Label>Font Size</Label><Input type="number" value={textStyles[selectedElement].fontSize} onChange={e => updateTextStyle(selectedElement, 'fontSize', parseInt(e.target.value))} /></FormGroup></Col>
                        <Col xs={6}><FormGroup><Label>Color</Label><Input type="color" value={textStyles[selectedElement].color} onChange={e => updateTextStyle(selectedElement, 'color', e.target.value)} /></FormGroup></Col></Row>
                        <Row><Col xs={6}><FormGroup><Label>Font Weight</Label><Input type="select" value={textStyles[selectedElement].fontWeight} onChange={e => updateTextStyle(selectedElement, 'fontWeight', e.target.value)}><option value="normal">Normal</option><option value="bold">Bold</option></Input></FormGroup></Col>
                        <Col xs={6}><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={textStyles[selectedElement].italic} onChange={e => updateTextStyle(selectedElement, 'italic', e.target.checked)} /><span className="ms-2">Italic</span></Label></FormGroup></Col></Row>
                        <FormGroup check><Label check><Input type="checkbox" checked={textStyles[selectedElement].underline} onChange={e => updateTextStyle(selectedElement, 'underline', e.target.checked)} /><span className="ms-2">Underline</span></Label></FormGroup>
                        <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" /> <strong>Click and drag this text on the preview to reposition!</strong></Alert>
                      </>
                    )}
                    <hr />
                    <h6>Card Design</h6>
                    <Row><Col xs={6}><FormGroup><Label>Background</Label><Input type="color" value={cardData.backgroundColor} onChange={e => setCardData({...cardData, backgroundColor: e.target.value})} /></FormGroup></Col>
                    <Col xs={6}><FormGroup><Label>Text Color</Label><Input type="color" value={cardData.textColor} onChange={e => setCardData({...cardData, textColor: e.target.value})} /></FormGroup></Col>
                    <Col xs={6}><FormGroup><Label>Accent Color</Label><Input type="color" value={cardData.accentColor} onChange={e => setCardData({...cardData, accentColor: e.target.value})} /></FormGroup></Col>
                    <Col xs={6}><FormGroup><Label>Font Family</Label><Input type="select" value={cardData.fontFamily} onChange={e => setCardData({...cardData, fontFamily: e.target.value})}><option>Georgia</option><option>Poppins</option><option>Arial</option><option>Times New Roman</option></Input></FormGroup></Col></Row>
                  </TabPane>

                  <TabPane tabId="4">
                    <FormGroup><Label>Logo Image</Label>
                      <div className="border rounded p-3 text-center" onClick={() => logoInputRef.current?.click()} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                        {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p>Upload Logo</p></>}
                      </div>
                      <input ref={logoInputRef} type="file" hidden onChange={handleLogoChange} accept="image/*" />
                    </FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={cardData.showLogo} onChange={e => setCardData({...cardData, showLogo: e.target.checked})} /><span className="ms-2">Show Logo on Front Side</span></Label></FormGroup>
                    {cardData.showLogo && previewImage && (
                      <>
                        <h6 className="mt-3">Logo Customization</h6>
                        <Row><Col xs={6}><FormGroup><Label>Width</Label><Input type="number" value={logoSettings.width} onChange={e => setLogoSettings({...logoSettings, width: parseInt(e.target.value)})} /></FormGroup></Col>
                        <Col xs={6}><FormGroup><Label>Height</Label><Input type="number" value={logoSettings.height} onChange={e => setLogoSettings({...logoSettings, height: parseInt(e.target.value)})} /></FormGroup></Col></Row>
                        <FormGroup><Label>Shape</Label><div className="d-flex gap-3"><Button size="sm" color={logoSettings.shape === 'rectangle' ? 'warning' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rectangle'})}><FaSquare /> Rectangle</Button><Button size="sm" color={logoSettings.shape === 'rounded' ? 'warning' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rounded'})}><FaSquare /> Rounded</Button><Button size="sm" color={logoSettings.shape === 'circle' ? 'warning' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'circle'})}><FaRegCircle /> Circle</Button></div></FormGroup>
                        <Row><Col xs={6}><FormGroup><Label>Border Width</Label><Input type="number" value={logoSettings.borderWidth} onChange={e => setLogoSettings({...logoSettings, borderWidth: parseInt(e.target.value)})} /></FormGroup></Col>
                        {logoSettings.borderWidth > 0 && <Col xs={6}><FormGroup><Label>Border Color</Label><Input type="color" value={logoSettings.borderColor} onChange={e => setLogoSettings({...logoSettings, borderColor: e.target.value})} /></FormGroup></Col>}</Row>
                      </>
                    )}
                  </TabPane>
                </TabContent>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={() => navigate('/weddingcards')}>Cancel</Button>
                  <Button color="warning" type="submit" disabled={loading}>
                    {loading ? <><FaSpinner className="spinner-border-sm me-1" /> Creating...</> : <><FaSave /> Create Wedding Card</>}
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
                {currentSide === 'front' ? 'Front Side Preview (Drag Text)' : currentSide === 'inside' ? 'Inside Side Preview (Drag Text)' : 'Back Side Preview'}
                <small className="d-block text-warning"><FaMousePointer /> Click and drag ANY text to reposition!</small>
              </CardTitle>
              <div className="preview-container" style={{ maxHeight: '60vh', overflowY: 'auto', textAlign: 'center' }}>
                <canvas
                  ref={currentSide === 'front' ? frontCanvasRef : currentSide === 'inside' ? insideCanvasRef : backCanvasRef}
                  style={{ width: '100%', height: 'auto', border: '1px solid #ddd', cursor: isDragging ? 'grabbing' : 'grab' }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
              </div>
              <div className="d-flex gap-2 mt-3">
                <Button color="success" onClick={downloadCard} className="flex-grow-1"><FaDownload /> Download {currentSide}</Button>
                <Button color="info" onClick={downloadAllSides} className="flex-grow-1"><FaDownload /> Download All</Button>
                <Button color="warning" onClick={() => setShowFullPreview(true)} className="flex-grow-1"><FaEye /> Full Preview</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Full Preview Modal */}
      {showFullPreview && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body">
                <Row>
                  <Col md={4} className="text-center mb-3"><h5 className="text-white bg-dark p-2 rounded">Front Side</h5><canvas ref={frontCanvasRef} style={{ width: '100%', height: 'auto', border: '1px solid #ddd' }} /></Col>
                  <Col md={4} className="text-center mb-3"><h5 className="text-white bg-dark p-2 rounded">Inside Side</h5><canvas ref={insideCanvasRef} style={{ width: '100%', height: 'auto', border: '1px solid #ddd' }} /></Col>
                  <Col md={4} className="text-center mb-3"><h5 className="text-white bg-dark p-2 rounded">Back Side</h5><canvas ref={backCanvasRef} style={{ width: '100%', height: 'auto', border: '1px solid #ddd' }} /></Col>
                </Row>
                <div className="text-center mt-3"><Button color="success" onClick={downloadAllSides}><FaDownload /> Download All Sides</Button><Button color="secondary" className="ms-2" onClick={() => setShowFullPreview(false)}>Close</Button></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default WeddingCardCreator;