// WeddingCardCreator.jsx - COMPLETE FIXED VERSION
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
  FaUserFriends, FaPlus, FaTimes, FaUser, FaVenusMars, FaAddressCard
} from 'react-icons/fa';

const API_URL = 'https://designback.onrender.com/api/admin';

const WeddingCardCreator = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [language, setLanguage] = useState('en');
  const [currentSide, setCurrentSide] = useState('front');

  const [frontImage, setFrontImage] = useState(null);
  const [insideImage, setInsideImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  // ✅ REFS for files - stale closure fix
  const frontFileRef = useRef(null);
  const insideFileRef = useRef(null);
  const backFileRef = useRef(null);

  const [showFrontPicker, setShowFrontPicker] = useState(false);
  const [showInsidePicker, setShowInsidePicker] = useState(false);
  const [showBackPicker, setShowBackPicker] = useState(false);

  const [customEvents, setCustomEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', time: '', venue: '' });

  const [relatives, setRelatives] = useState([]);
  const [showRelativeForm, setShowRelativeForm] = useState(false);
  const [newRelative, setNewRelative] = useState({ name: '', relation: '', side: 'groom' });

  const [logoSettings, setLogoSettings] = useState({
    x: 350, y: 50, width: 100, height: 100, borderRadius: 50,
    borderWidth: 0, borderColor: '#d4af37', shape: 'circle', show: true
  });

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

  const [textStyles, setTextStyles] = useState({
    frontGroomName:     { fontSize: 42, fontWeight: 'bold',   color: '#d4af37', italic: false, underline: false, x: 400, y: 400, show: true },
    frontBrideName:     { fontSize: 42, fontWeight: 'bold',   color: '#d4af37', italic: false, underline: false, x: 400, y: 470, show: true },
    frontCeremonyDate:  { fontSize: 20, fontWeight: 'bold',   color: '#5a3e2b', italic: false, underline: false, x: 400, y: 550, show: true },
    frontCeremonyVenue: { fontSize: 16, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 600, show: true },
    frontCeremonyAddress:{ fontSize: 14, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 630, show: true },
    groomName:          { fontSize: 42, fontWeight: 'bold',   color: '#d4af37', italic: false, underline: false, x: 400, y: 400, show: true },
    groomFatherName:    { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 450, show: true },
    groomMotherName:    { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 480, show: true },
    groomMobile:        { fontSize: 14, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 510, show: true },
    brideName:          { fontSize: 42, fontWeight: 'bold',   color: '#d4af37', italic: false, underline: false, x: 400, y: 560, show: true },
    brideFatherName:    { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 610, show: true },
    brideMotherName:    { fontSize: 16, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 640, show: true },
    brideMobile:        { fontSize: 14, fontWeight: 'normal', color: '#888888', italic: false, underline: false, x: 400, y: 670, show: true },
    ceremonyDate:       { fontSize: 20, fontWeight: 'bold',   color: '#5a3e2b', italic: false, underline: false, x: 400, y: 720, show: true },
    ceremonyTime:       { fontSize: 18, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 755, show: true },
    ceremonyVenue:      { fontSize: 16, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 790, show: true },
    ceremonyAddress:    { fontSize: 14, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 820, show: true },
    receptionDate:      { fontSize: 20, fontWeight: 'bold',   color: '#5a3e2b', italic: false, underline: false, x: 400, y: 870, show: true },
    receptionTime:      { fontSize: 18, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 905, show: true },
    receptionVenue:     { fontSize: 16, fontWeight: 'normal', color: '#5a3e2b', italic: false, underline: false, x: 400, y: 940, show: true },
    receptionAddress:   { fontSize: 14, fontWeight: 'normal', color: '#7a5a4e', italic: false, underline: false, x: 400, y: 970, show: true },
    dressCode:          { fontSize: 14, fontWeight: 'normal', color: '#888888', italic: true,  underline: false, x: 400, y: 1010, show: true }
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState('groomName');

  // ✅ SINGLE canvas refs - thumbnail aur preview dono ke liye alag
  const frontCanvasRef   = useRef(null);
  const insideCanvasRef  = useRef(null);
  const backCanvasRef    = useRef(null);

  // Thumbnail refs (left panel)
  const frontThumbRef  = useRef(null);
  const insideThumbRef = useRef(null);
  const backThumbRef   = useRef(null);

  const frontInputRef  = useRef(null);
  const insideInputRef = useRef(null);
  const backInputRef   = useRef(null);
  const logoInputRef   = useRef(null);

  const navigate = useNavigate();

  const sampleTemplates = {
    front: [
      { id: 1, name: 'Royal Gold',      image: 'https://placehold.co/800x1000/d4af37/white?text=Royal+Gold' },
      { id: 2, name: 'Rose Garden',     image: 'https://placehold.co/800x1000/ffb6c1/white?text=Rose+Garden' },
      { id: 3, name: 'Traditional Red', image: 'https://placehold.co/800x1000/dc143c/white?text=Traditional+Red' },
      { id: 4, name: 'Elegant Floral',  image: 'https://placehold.co/800x1000/f5f5dc/black?text=Elegant+Floral' }
    ],
    inside: [
      { id: 1, name: 'Classic Inside', image: 'https://placehold.co/800x1000/fdf5e6/black?text=Classic+Inside' },
      { id: 2, name: 'Modern Inside',  image: 'https://placehold.co/800x1000/faf0e6/black?text=Modern+Inside' }
    ],
    back: [
      { id: 1, name: 'Thank You',   image: 'https://placehold.co/800x1000/f5f5dc/black?text=Thank+You' },
      { id: 2, name: 'Map Design',  image: 'https://placehold.co/800x1000/fff8f0/black?text=Location+Map' }
    ]
  };

  const getDisplayText = (field) => cardData[field] || '';

  // ─── Draw helpers ────────────────────────────────────────────────────────────

  const drawTextAtPosition = (ctx, text, style, fontFamily, x, y) => {
    if (!text) return;
    let fontStyle = style.italic ? 'italic ' : '';
    fontStyle += style.fontWeight;
    ctx.save();
    ctx.font = `${fontStyle} ${style.fontSize}px ${fontFamily}`;
    ctx.fillStyle = style.color;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
    if (style.underline) {
      const m = ctx.measureText(text);
      ctx.beginPath();
      ctx.moveTo(x - m.width / 2, y + 2);
      ctx.lineTo(x + m.width / 2, y + 2);
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
        ctx.arc(settings.x + settings.width / 2, settings.y + settings.height / 2, settings.width / 2, 0, 2 * Math.PI);
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
          ctx.arc(settings.x + settings.width / 2, settings.y + settings.height / 2, settings.width / 2, 0, 2 * Math.PI);
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

  // ✅ Generic canvas draw function - kisi bhi canvas element pe draw kar sako
  const _drawFrontOnCtx = (canvas, imgSrc) => {
    const ctx = canvas.getContext('2d');
    canvas.width  = 800;
    canvas.height = 1000;

    const overlay = () => {
      const frontFields = [
        { key: 'frontGroomName',     val: getDisplayText('groomName') },
        { key: 'frontBrideName',     val: getDisplayText('brideName') },
        { key: 'frontCeremonyDate',  val: getDisplayText('ceremonyDate') },
        { key: 'frontCeremonyVenue', val: getDisplayText('ceremonyVenue') },
        { key: 'frontCeremonyAddress', val: getDisplayText('ceremonyAddress') }
      ];
      frontFields.forEach(({ key, val }) => {
        const style = textStyles[key];
        if (style?.show && val) drawTextAtPosition(ctx, val, style, cardData.fontFamily, style.x, style.y);
      });
      if (cardData.showLogo && previewImage && logoSettings.show) {
        drawLogoOnCanvas(ctx, previewImage, logoSettings);
      }
    };

    if (imgSrc) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload  = () => { ctx.clearRect(0, 0, 800, 1000); ctx.drawImage(img, 0, 0, 800, 1000); overlay(); };
      img.onerror = () => { ctx.fillStyle = cardData.backgroundColor || '#fff8f0'; ctx.fillRect(0, 0, 800, 1000); overlay(); };
      img.src = imgSrc;
    } else {
      ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
      ctx.fillRect(0, 0, 800, 1000);
      overlay();
    }
  };

  const _drawInsideOnCtx = (canvas, imgSrc) => {
    const ctx = canvas.getContext('2d');
    canvas.width  = 800;
    canvas.height = 1050;

    const overlay = () => {
      ctx.font      = `italic 28px ${cardData.fontFamily}`;
      ctx.fillStyle = cardData.accentColor;
      ctx.textAlign = 'center';
      ctx.fillText(language === 'hi' ? 'विवाह निमंत्रण' : 'WEDDING INVITATION', 400, 80);

      const allFields = [
        'groomName','groomFatherName','groomMotherName','groomMobile',
        'brideName','brideFatherName','brideMotherName','brideMobile',
        'ceremonyDate','ceremonyTime','ceremonyVenue','ceremonyAddress',
        'receptionDate','receptionTime','receptionVenue','receptionAddress','dressCode'
      ];
      allFields.forEach(field => {
        const style = textStyles[field];
        if (style?.show) {
          const text = getDisplayText(field);
          if (text) drawTextAtPosition(ctx, text, style, cardData.fontFamily, style.x, style.y);
        }
      });

      if (customEvents.length > 0) {
        let ey = (textStyles.receptionAddress?.y || 970) + 40;
        ctx.font      = `bold 18px ${cardData.fontFamily}`;
        ctx.fillStyle = cardData.accentColor;
        ctx.textAlign = 'center';
        ctx.fillText(language === 'hi' ? 'अन्य कार्यक्रम' : 'Other Events', 400, ey); ey += 35;
        customEvents.forEach(ev => {
          ctx.font = `bold 16px ${cardData.fontFamily}`; ctx.fillStyle = '#d4af37';
          ctx.fillText(ev.name, 400, ey); ey += 25;
          ctx.font = `14px ${cardData.fontFamily}`; ctx.fillStyle = cardData.textColor;
          ctx.fillText(`${ev.date} | ${ev.time}`, 400, ey); ey += 22;
          ctx.fillText(ev.venue, 400, ey); ey += 28;
        });
      }

      if (relatives.length > 0) {
        let ry = (textStyles.receptionAddress?.y || 970) + 40 + (customEvents.length * 75);
        ctx.font = `bold 18px ${cardData.fontFamily}`; ctx.fillStyle = cardData.accentColor; ctx.textAlign = 'center';
        ctx.fillText(language === 'hi' ? 'परिवार के सदस्य' : 'Family Members', 400, ry); ry += 35;
        const gr = relatives.filter(r => r.side === 'groom');
        const br = relatives.filter(r => r.side === 'bride');
        if (gr.length) {
          ctx.font = `italic 14px ${cardData.fontFamily}`; ctx.fillStyle = '#d4af37';
          ctx.fillText(language === 'hi' ? 'वर की ओर से' : "Groom's Side", 400, ry); ry += 25;
          gr.forEach(r => { ctx.font = `14px ${cardData.fontFamily}`; ctx.fillStyle = cardData.textColor; ctx.fillText(`${r.name} (${r.relation})`, 400, ry); ry += 22; });
          ry += 10;
        }
        if (br.length) {
          ctx.font = `italic 14px ${cardData.fontFamily}`; ctx.fillStyle = '#d4af37';
          ctx.fillText(language === 'hi' ? 'वधू की ओर से' : "Bride's Side", 400, ry); ry += 25;
          br.forEach(r => { ctx.font = `14px ${cardData.fontFamily}`; ctx.fillStyle = cardData.textColor; ctx.fillText(`${r.name} (${r.relation})`, 400, ry); ry += 22; });
        }
      }

      if (cardData.rsvpContact) {
        ctx.font = `14px ${cardData.fontFamily}`; ctx.fillStyle = '#888888'; ctx.textAlign = 'center';
        ctx.fillText(`${language === 'hi' ? 'कृपया RSVP करें' : 'Please RSVP'}: ${cardData.rsvpContact} ${language === 'hi' ? 'तक' : 'by'} ${cardData.rsvpBy}`, 400, 1020);
      }
    };

    if (imgSrc) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload  = () => { ctx.clearRect(0, 0, 800, 1050); ctx.drawImage(img, 0, 0, 800, 1050); overlay(); };
      img.onerror = () => { ctx.fillStyle = cardData.backgroundColor || '#fff8f0'; ctx.fillRect(0, 0, 800, 1050); overlay(); };
      img.src = imgSrc;
    } else {
      ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
      ctx.fillRect(0, 0, 800, 1050);
      overlay();
    }
  };

  const _drawBackOnCtx = (canvas, imgSrc) => {
    const ctx = canvas.getContext('2d');
    canvas.width  = 800;
    canvas.height = 1000;

    const overlay = () => {
      ctx.font = `bold 32px ${cardData.fontFamily}`; ctx.fillStyle = cardData.accentColor; ctx.textAlign = 'center';
      ctx.fillText(language === 'hi' ? 'धन्यवाद' : 'Thank You', 400, 400);
      ctx.font = `20px ${cardData.fontFamily}`; ctx.fillStyle = cardData.textColor;
      ctx.fillText(language === 'hi' ? 'हमें आपका आशीर्वाद चाहिए' : 'We need your blessings', 400, 480);
      ctx.font = `16px ${cardData.fontFamily}`;
      ctx.fillText(language === 'hi' ? 'कृपया हमारे इस खुशी के मौके पर जरूर आएं' : 'Please grace this occasion with your presence', 400, 540);
      ctx.font = `14px ${cardData.fontFamily}`; ctx.fillStyle = '#888888';
      ctx.fillText(cardData.additionalInfo, 400, 620);
    };

    if (imgSrc) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload  = () => { ctx.clearRect(0, 0, 800, 1000); ctx.drawImage(img, 0, 0, 800, 1000); overlay(); };
      img.onerror = () => { ctx.fillStyle = cardData.backgroundColor || '#fff8f0'; ctx.fillRect(0, 0, 800, 1000); overlay(); };
      img.src = imgSrc;
    } else {
      ctx.fillStyle = cardData.backgroundColor || '#fff8f0';
      ctx.fillRect(0, 0, 800, 1000);
      overlay();
    }
  };

  // ✅ Public draw functions - main canvas + thumbnail dono draw karo
  const drawFrontCanvas  = () => { if (frontCanvasRef.current)  _drawFrontOnCtx(frontCanvasRef.current,   frontImage);  if (frontThumbRef.current)  _drawFrontOnCtx(frontThumbRef.current,  frontImage);  };
  const drawInsideCanvas = () => { if (insideCanvasRef.current) _drawInsideOnCtx(insideCanvasRef.current, insideImage); if (insideThumbRef.current) _drawInsideOnCtx(insideThumbRef.current, insideImage); };
  const drawBackCanvas   = () => { if (backCanvasRef.current)   _drawBackOnCtx(backCanvasRef.current,     backImage);   if (backThumbRef.current)   _drawBackOnCtx(backThumbRef.current,    backImage);   };

  // ─── Drag handlers ───────────────────────────────────────────────────────────

  const handleCanvasMouseDown = (e) => {
    const canvas = currentSide === 'front' ? frontCanvasRef.current : currentSide === 'inside' ? insideCanvasRef.current : backCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * sx, my = (e.clientY - rect.top) * sy;

    const fields = currentSide === 'front'
      ? ['frontGroomName','frontBrideName','frontCeremonyDate','frontCeremonyVenue','frontCeremonyAddress']
      : currentSide === 'inside'
        ? ['groomName','groomFatherName','groomMotherName','groomMobile','brideName','brideFatherName','brideMotherName','brideMobile','ceremonyDate','ceremonyTime','ceremonyVenue','ceremonyAddress','receptionDate','receptionTime','receptionVenue','receptionAddress','dressCode']
        : [];

    for (const field of fields) {
      const style = textStyles[field];
      if (!style?.show) continue;
      let text = field.startsWith('front')
        ? getDisplayText(field.replace('front','').replace(/^./, c => c.toLowerCase()))
        : getDisplayText(field);
      if (!text) continue;
      const tmp = document.createElement('canvas').getContext('2d');
      tmp.font = `${style.italic ? 'italic ' : ''}${style.fontWeight} ${style.fontSize}px ${cardData.fontFamily}`;
      const tw = tmp.measureText(text).width;
      if (mx >= style.x - tw/2 - 15 && mx <= style.x + tw/2 + 15 && my >= style.y - style.fontSize - 10 && my <= style.y + 10) {
        setIsDragging(true); setDragTarget({ field }); setDragStart({ x: mx - style.x, y: my - style.y });
        e.preventDefault(); return;
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDragging || !dragTarget) return;
    const canvas = currentSide === 'front' ? frontCanvasRef.current : currentSide === 'inside' ? insideCanvasRef.current : backCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * sx, my = (e.clientY - rect.top) * sy;
    setTextStyles(prev => ({ ...prev, [dragTarget.field]: { ...prev[dragTarget.field], x: mx - dragStart.x, y: my - dragStart.y } }));
    if (currentSide === 'front') drawFrontCanvas(); else if (currentSide === 'inside') drawInsideCanvas();
  };

  const handleCanvasMouseUp = () => { setIsDragging(false); setDragTarget(null); };

  // ─── File Upload ─────────────────────────────────────────────────────────────

  // ✅ FIXED: ref mein store karo + sirf state set karo (no setTimeout draw)
  const handleFileUpload = (side, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrorMessage('Image size should be less than 5MB'); return; }
    const url = URL.createObjectURL(file);
    if (side === 'front') {
      frontFileRef.current = file;
      setFrontImage(url);
      setShowFrontPicker(false);
    } else if (side === 'inside') {
      insideFileRef.current = file;
      setInsideImage(url);
      setShowInsidePicker(false);
    } else {
      backFileRef.current = file;
      setBackImage(url);
      setShowBackPicker(false);
    }
    // ✅ input reset karo taaki same file dobara select ho sake
    e.target.value = '';
  };

  // ✅ FIXED: template select karne pe file ref clear karo
  const selectTemplate = (side, template) => {
    if (side === 'front') {
      frontFileRef.current = null;
      setFrontImage(template.image);
      setShowFrontPicker(false);
    } else if (side === 'inside') {
      insideFileRef.current = null;
      setInsideImage(template.image);
      setShowInsidePicker(false);
    } else {
      backFileRef.current = null;
      setBackImage(template.image);
      setShowBackPicker(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setErrorMessage('Logo size should be less than 2MB'); return; }
    setCardData(prev => ({ ...prev, logo: file }));
    setPreviewImage(URL.createObjectURL(file));
    e.target.value = '';
  };

  // ─── Custom Events ───────────────────────────────────────────────────────────

  const addCustomEvent = () => {
    if (!newEvent.name) return;
    setCustomEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
    setNewEvent({ name: '', date: '', time: '', venue: '' });
    setShowEventForm(false);
  };

  const removeCustomEvent = (id) => setCustomEvents(prev => prev.filter(e => e.id !== id));

  // ─── Relatives ───────────────────────────────────────────────────────────────

  const addRelative = () => {
    if (!newRelative.name) return;
    setRelatives(prev => [...prev, { ...newRelative, id: Date.now() }]);
    setNewRelative({ name: '', relation: '', side: 'groom' });
    setShowRelativeForm(false);
  };

  const removeRelative = (id) => setRelatives(prev => prev.filter(r => r.id !== id));

  // ─── Download ────────────────────────────────────────────────────────────────

  const downloadCard = () => {
    const canvas = currentSide === 'front' ? frontCanvasRef.current : currentSide === 'inside' ? insideCanvasRef.current : backCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `wedding_card_${currentSide}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadAllSides = () => {
    [frontCanvasRef, insideCanvasRef, backCanvasRef].forEach((ref, i) => {
      if (!ref.current) return;
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `wedding_card_${['front','inside','back'][i]}.png`;
        link.href = ref.current.toDataURL('image/png');
        link.click();
      }, i * 500);
    });
  };

  // ─── Resize helper ───────────────────────────────────────────────────────────

  const resizeImage = (file, w = 800, h = 1000) => new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      c.toBlob(blob => { URL.revokeObjectURL(url); resolve(blob); }, 'image/png');
    };
    img.onerror = reject;
    img.src = url;
  });

  // ─── Offscreen preview capture ───────────────────────────────────────────────

  const captureOffscreen = (drawFn, imgSrc, w, h) => new Promise(resolve => {
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    drawFn(off, imgSrc);
    // Image loads asynchronously - wait enough
    setTimeout(() => off.toBlob(resolve, 'image/png'), 500);
  });

  // ─── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();

      // Card text data
      Object.keys(cardData).forEach(key => { if (key !== 'logo') formData.append(key, cardData[key]); });
      formData.append('textStyles',   JSON.stringify(textStyles));
      formData.append('logoSettings', JSON.stringify(logoSettings));
      formData.append('language',     language);
      formData.append('customEvents', JSON.stringify(customEvents));
      formData.append('relatives',    JSON.stringify(relatives));
      formData.append('design', JSON.stringify({
        backgroundColor: cardData.backgroundColor,
        textColor:       cardData.textColor,
        accentColor:     cardData.accentColor,
        fontFamily:      cardData.fontFamily,
        showLogo:        cardData.showLogo
      }));
      if (cardData.logo) formData.append('logo', cardData.logo);

      // ✅ Ref se file lo (stale closure safe)
      const fFile = frontFileRef.current;
      const iFile = insideFileRef.current;
      const bFile = backFileRef.current;

      console.log('Files:', { front: fFile?.name, inside: iFile?.name, back: bFile?.name });

      // Template/original images
      if (fFile) { const b = await resizeImage(fFile, 800, 1000);  formData.append('frontImage',  b, 'front.png');  console.log('✅ frontImage',  b.size); }
      if (iFile) { const b = await resizeImage(iFile, 800, 1050);  formData.append('insideImage', b, 'inside.png'); console.log('✅ insideImage', b.size); }
      if (bFile) { const b = await resizeImage(bFile, 800, 1000);  formData.append('backImage',   b, 'back.png');   console.log('✅ backImage',   b.size); }

      // ✅ Preview images - offscreen canvas se (ref sharing problem nahi)
      // Front preview
      const frontSrc = fFile ? URL.createObjectURL(fFile) : (frontImage && !frontImage.startsWith('blob:') ? frontImage : null);
      const frontBlob = await captureOffscreen(_drawFrontOnCtx, frontSrc, 800, 1000);
      if (frontBlob?.size > 500) { formData.append('frontPreview', frontBlob, 'front_preview.png'); console.log('✅ frontPreview', frontBlob.size); }

      // Inside preview
      const insideSrc = iFile ? URL.createObjectURL(iFile) : (insideImage && !insideImage.startsWith('blob:') ? insideImage : null);
      const insideBlob = await captureOffscreen(_drawInsideOnCtx, insideSrc, 800, 1050);
      if (insideBlob?.size > 500) { formData.append('insidePreview', insideBlob, 'inside_preview.png'); console.log('✅ insidePreview', insideBlob.size); }

      // Back preview
      const backSrc = bFile ? URL.createObjectURL(bFile) : (backImage && !backImage.startsWith('blob:') ? backImage : null);
      const backBlob = await captureOffscreen(_drawBackOnCtx, backSrc, 800, 1000);
      if (backBlob?.size > 500) { formData.append('backPreview', backBlob, 'back_preview.png'); console.log('✅ backPreview', backBlob.size); }

      // Debug
      for (let [k, v] of formData.entries()) console.log(k, v instanceof Blob ? `BLOB ${v.size}b` : v);

      await axios.post(`${API_URL}/createweddingcard`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccessMessage(language === 'hi' ? 'वेडिंग कार्ड सफलतापूर्वक बनाया गया!' : 'Wedding card created successfully!');
      setTimeout(() => navigate('/weddingcards'), 2000);
    } catch (error) {
      console.error('Submit error:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Error creating wedding card');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED useEffect - image state change pe redraw
  useEffect(() => {
    drawFrontCanvas();
    drawInsideCanvas();
    drawBackCanvas();
  }, [cardData, textStyles, previewImage, logoSettings, language, customEvents, relatives, frontImage, insideImage, backImage]);

  const updateTextStyle = (field, prop, val) => {
    setTextStyles(prev => ({ ...prev, [field]: { ...prev[field], [prop]: val } }));
  };

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <Container fluid className="my-5">
      <Row>
        {/* ── LEFT PANEL ── */}
        <Col md={6}>
          <Card className="shadow-lg border-0">
            <CardBody className="p-4" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h3" className="text-warning mb-0">
                  <FaHeart className="me-2 text-danger" /> Wedding Card Creator
                </CardTitle>
                <div>
                  <Button color={language === 'en' ? 'warning' : 'secondary'} size="sm" onClick={() => setLanguage('en')} className="me-2"><FaLanguage /> English</Button>
                  <Button color={language === 'hi' ? 'warning' : 'secondary'} size="sm" onClick={() => setLanguage('hi')}><FaLanguage /> हिंदी</Button>
                </div>
              </div>

              {errorMessage   && <Alert color="danger"  toggle={() => setErrorMessage('')}>{errorMessage}</Alert>}
              {successMessage && <Alert color="success">{successMessage}</Alert>}

              {/* ── Thumbnails (separate refs) ── */}
              <div className="mb-4">
                <Label className="fw-bold mb-2"><FaGem className="me-2" />All Card Sides</Label>
                <Row>
                  {[
                    { side: 'front',  ref: frontThumbRef,  label: 'Front Side',  w: 800, h: 1000 },
                    { side: 'inside', ref: insideThumbRef, label: 'Inside Side', w: 800, h: 1050 },
                    { side: 'back',   ref: backThumbRef,   label: 'Back Side',   w: 800, h: 1000 }
                  ].map(({ side, ref, label, w, h }) => (
                    <Col md={4} key={side}>
                      <Card
                        className={`text-center ${currentSide === side ? 'border-warning border-3' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setCurrentSide(side)}
                      >
                        <CardBody className="p-2">
                          <small className="text-primary">{label}</small>
                          <div style={{ height: '120px', overflow: 'hidden' }}>
                            <canvas ref={ref} style={{ width: '100%', height: 'auto' }} width={w} height={h} />
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* ── Template Picker ── */}
              <div className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Label className="fw-bold mb-0">
                    <FaImages className="me-2" />
                    {currentSide === 'front' ? 'Front' : currentSide === 'inside' ? 'Inside' : 'Back'} Template
                  </Label>
                  <Button size="sm" color="warning" onClick={() => {
                    if (currentSide === 'front')  setShowFrontPicker(p => !p);
                    else if (currentSide === 'inside') setShowInsidePicker(p => !p);
                    else setShowBackPicker(p => !p);
                  }}>
                    <FaCloudUploadAlt /> Change Template
                  </Button>
                </div>

                {/* Front picker */}
                {currentSide === 'front' && showFrontPicker && (
                  <div className="mt-2">
                    <input ref={frontInputRef} type="file" hidden accept="image/*" onChange={e => handleFileUpload('front', e)} />
                    <Button size="sm" color="secondary" className="w-100 mb-2" onClick={() => frontInputRef.current?.click()}>
                      <FaCloudUploadAlt /> Upload Custom Image
                    </Button>
                    <Row>
                      {sampleTemplates.front.map(t => (
                        <Col key={t.id} xs={6} md={3} className="mb-2">
                          <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate('front', t)}>
                            <img src={t.image} alt={t.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                            <small>{t.name}</small>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Inside picker */}
                {currentSide === 'inside' && showInsidePicker && (
                  <div className="mt-2">
                    <input ref={insideInputRef} type="file" hidden accept="image/*" onChange={e => handleFileUpload('inside', e)} />
                    <Button size="sm" color="secondary" className="w-100 mb-2" onClick={() => insideInputRef.current?.click()}>
                      <FaCloudUploadAlt /> Upload Custom Image
                    </Button>
                    <Row>
                      {sampleTemplates.inside.map(t => (
                        <Col key={t.id} xs={6} md={3} className="mb-2">
                          <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate('inside', t)}>
                            <img src={t.image} alt={t.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                            <small>{t.name}</small>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Back picker */}
                {currentSide === 'back' && showBackPicker && (
                  <div className="mt-2">
                    <input ref={backInputRef} type="file" hidden accept="image/*" onChange={e => handleFileUpload('back', e)} />
                    <Button size="sm" color="secondary" className="w-100 mb-2" onClick={() => backInputRef.current?.click()}>
                      <FaCloudUploadAlt /> Upload Custom Image
                    </Button>
                    <Row>
                      {sampleTemplates.back.map(t => (
                        <Col key={t.id} xs={6} md={3} className="mb-2">
                          <div className="border rounded p-1 text-center" style={{ cursor: 'pointer' }} onClick={() => selectTemplate('back', t)}>
                            <img src={t.image} alt={t.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                            <small>{t.name}</small>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </div>

              {/* ── Tabs ── */}
              <Nav tabs className="mb-3">
                <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => setActiveTab('1')}><FaHeart /> Details</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => setActiveTab('2')}><FaUserFriends /> Events & Family</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => setActiveTab('3')}><FaPalette /> Text Style</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '4' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => setActiveTab('4')}><FaImages /> Logo</NavLink></NavItem>
              </Nav>

              <Form onSubmit={handleSubmit}>
                <TabContent activeTab={activeTab}>

                  {/* ── Tab 1: Details ── */}
                  <TabPane tabId="1">
                    <h6 className="text-warning mb-3"><FaUser /> Groom Details</h6>
                    <Row>
                      <Col md={6}><FormGroup><Label>Groom Name</Label><Input value={cardData.groomName} onChange={e => setCardData(p => ({...p, groomName: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Father's Name</Label><Input value={cardData.groomFatherName} onChange={e => setCardData(p => ({...p, groomFatherName: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Mother's Name</Label><Input value={cardData.groomMotherName} onChange={e => setCardData(p => ({...p, groomMotherName: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label><FaPhone /> Mobile</Label><Input value={cardData.groomMobile} onChange={e => setCardData(p => ({...p, groomMobile: e.target.value}))} /></FormGroup></Col>
                    </Row>

                    <h6 className="text-warning mb-3 mt-2"><FaVenusMars /> Bride Details</h6>
                    <Row>
                      <Col md={6}><FormGroup><Label>Bride Name</Label><Input value={cardData.brideName} onChange={e => setCardData(p => ({...p, brideName: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Father's Name</Label><Input value={cardData.brideFatherName} onChange={e => setCardData(p => ({...p, brideFatherName: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Mother's Name</Label><Input value={cardData.brideMotherName} onChange={e => setCardData(p => ({...p, brideMotherName: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label><FaPhone /> Mobile</Label><Input value={cardData.brideMobile} onChange={e => setCardData(p => ({...p, brideMobile: e.target.value}))} /></FormGroup></Col>
                    </Row>

                    <h6 className="text-warning mb-3 mt-2"><FaCalendarAlt /> Ceremony</h6>
                    <Row>
                      <Col md={6}><FormGroup><Label>Date</Label><Input value={cardData.ceremonyDate} onChange={e => setCardData(p => ({...p, ceremonyDate: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Time</Label><Input value={cardData.ceremonyTime} onChange={e => setCardData(p => ({...p, ceremonyTime: e.target.value}))} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label>Venue</Label><Input value={cardData.ceremonyVenue} onChange={e => setCardData(p => ({...p, ceremonyVenue: e.target.value}))} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label>Address</Label><Input value={cardData.ceremonyAddress} onChange={e => setCardData(p => ({...p, ceremonyAddress: e.target.value}))} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label><FaPhone /> Contact</Label><Input value={cardData.ceremonyContact} onChange={e => setCardData(p => ({...p, ceremonyContact: e.target.value}))} /></FormGroup></Col>
                    </Row>

                    <h6 className="text-warning mb-3 mt-2"><FaCalendarAlt /> Reception</h6>
                    <Row>
                      <Col md={6}><FormGroup><Label>Date</Label><Input value={cardData.receptionDate} onChange={e => setCardData(p => ({...p, receptionDate: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Time</Label><Input value={cardData.receptionTime} onChange={e => setCardData(p => ({...p, receptionTime: e.target.value}))} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label>Venue</Label><Input value={cardData.receptionVenue} onChange={e => setCardData(p => ({...p, receptionVenue: e.target.value}))} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label>Address</Label><Input value={cardData.receptionAddress} onChange={e => setCardData(p => ({...p, receptionAddress: e.target.value}))} /></FormGroup></Col>
                      <Col md={12}><FormGroup><Label><FaPhone /> Contact</Label><Input value={cardData.receptionContact} onChange={e => setCardData(p => ({...p, receptionContact: e.target.value}))} /></FormGroup></Col>
                    </Row>

                    <h6 className="text-warning mb-3 mt-2"><FaAddressCard /> Additional</h6>
                    <Row>
                      <Col md={12}><FormGroup><Label>Additional Info</Label><Input value={cardData.additionalInfo} onChange={e => setCardData(p => ({...p, additionalInfo: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Dress Code</Label><Input value={cardData.dressCode} onChange={e => setCardData(p => ({...p, dressCode: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label><FaPhone /> RSVP Contact</Label><Input value={cardData.rsvpContact} onChange={e => setCardData(p => ({...p, rsvpContact: e.target.value}))} /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>RSVP By</Label><Input value={cardData.rsvpBy} onChange={e => setCardData(p => ({...p, rsvpBy: e.target.value}))} /></FormGroup></Col>
                    </Row>
                  </TabPane>

                  {/* ── Tab 2: Events & Family ── */}
                  <TabPane tabId="2">
                    <h6 className="text-warning mb-3"><FaCalendarAlt /> Custom Events</h6>
                    {customEvents.map(ev => (
                      <div key={ev.id} className="border rounded p-2 mb-2 bg-light">
                        <div className="d-flex justify-content-between">
                          <strong>{ev.name}</strong>
                          <Button size="sm" color="danger" onClick={() => removeCustomEvent(ev.id)}><FaTimes /></Button>
                        </div>
                        <small>{ev.date} | {ev.time}</small><br /><small>{ev.venue}</small>
                      </div>
                    ))}
                    {showEventForm ? (
                      <div className="border rounded p-3 mb-2">
                        <FormGroup><Label>Event Name</Label><Input value={newEvent.name} onChange={e => setNewEvent(p => ({...p, name: e.target.value}))} /></FormGroup>
                        <Row>
                          <Col md={6}><FormGroup><Label>Date</Label><Input value={newEvent.date} onChange={e => setNewEvent(p => ({...p, date: e.target.value}))} /></FormGroup></Col>
                          <Col md={6}><FormGroup><Label>Time</Label><Input value={newEvent.time} onChange={e => setNewEvent(p => ({...p, time: e.target.value}))} /></FormGroup></Col>
                        </Row>
                        <FormGroup><Label>Venue</Label><Input value={newEvent.venue} onChange={e => setNewEvent(p => ({...p, venue: e.target.value}))} /></FormGroup>
                        <div className="d-flex gap-2">
                          <Button color="success" size="sm" onClick={addCustomEvent}>Add</Button>
                          <Button color="secondary" size="sm" onClick={() => setShowEventForm(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" color="primary" className="mb-3" onClick={() => setShowEventForm(true)}><FaPlus /> Add Custom Event</Button>
                    )}

                    <h6 className="text-warning mb-3 mt-3"><FaUserFriends /> Family Members</h6>
                    {relatives.map(rel => (
                      <div key={rel.id} className="border rounded p-2 mb-2 bg-light">
                        <div className="d-flex justify-content-between">
                          <div><strong>{rel.name}</strong> <span className="text-muted">({rel.relation})</span> — {rel.side === 'groom' ? 'Groom Side' : 'Bride Side'}</div>
                          <Button size="sm" color="danger" onClick={() => removeRelative(rel.id)}><FaTimes /></Button>
                        </div>
                      </div>
                    ))}
                    {showRelativeForm ? (
                      <div className="border rounded p-3 mb-2">
                        <FormGroup><Label>Name</Label><Input value={newRelative.name} onChange={e => setNewRelative(p => ({...p, name: e.target.value}))} /></FormGroup>
                        <FormGroup><Label>Relation</Label><Input value={newRelative.relation} onChange={e => setNewRelative(p => ({...p, relation: e.target.value}))} placeholder="e.g. Brother, Uncle" /></FormGroup>
                        <FormGroup><Label>Side</Label>
                          <Input type="select" value={newRelative.side} onChange={e => setNewRelative(p => ({...p, side: e.target.value}))}>
                            <option value="groom">Groom's Side</option>
                            <option value="bride">Bride's Side</option>
                          </Input>
                        </FormGroup>
                        <div className="d-flex gap-2">
                          <Button color="success" size="sm" onClick={addRelative}>Add</Button>
                          <Button color="secondary" size="sm" onClick={() => setShowRelativeForm(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" color="primary" onClick={() => setShowRelativeForm(true)}><FaPlus /> Add Family Member</Button>
                    )}
                  </TabPane>

                  {/* ── Tab 3: Text Style ── */}
                  <TabPane tabId="3">
                    <FormGroup>
                      <Label>Select Field to Style & Drag</Label>
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
                        <Row>
                          <Col xs={6}><FormGroup><Label>Font Size</Label><Input type="number" value={textStyles[selectedElement].fontSize} onChange={e => updateTextStyle(selectedElement, 'fontSize', parseInt(e.target.value))} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>Color</Label><Input type="color" value={textStyles[selectedElement].color} onChange={e => updateTextStyle(selectedElement, 'color', e.target.value)} /></FormGroup></Col>
                        </Row>
                        <Row>
                          <Col xs={6}><FormGroup><Label>Font Weight</Label>
                            <Input type="select" value={textStyles[selectedElement].fontWeight} onChange={e => updateTextStyle(selectedElement, 'fontWeight', e.target.value)}>
                              <option value="normal">Normal</option>
                              <option value="bold">Bold</option>
                            </Input>
                          </FormGroup></Col>
                          <Col xs={3}><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={textStyles[selectedElement].italic} onChange={e => updateTextStyle(selectedElement, 'italic', e.target.checked)} /> Italic</Label></FormGroup></Col>
                          <Col xs={3}><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={textStyles[selectedElement].underline} onChange={e => updateTextStyle(selectedElement, 'underline', e.target.checked)} /> Underline</Label></FormGroup></Col>
                        </Row>
                        <Alert color="info" className="mt-1"><FaArrowsAlt className="me-2" /> Drag text on preview to reposition!</Alert>
                      </>
                    )}

                    <hr />
                    <h6>Card Colors & Font</h6>
                    <Row>
                      <Col xs={6}><FormGroup><Label>Background</Label><Input type="color" value={cardData.backgroundColor} onChange={e => setCardData(p => ({...p, backgroundColor: e.target.value}))} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>Text Color</Label><Input type="color" value={cardData.textColor} onChange={e => setCardData(p => ({...p, textColor: e.target.value}))} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>Accent Color</Label><Input type="color" value={cardData.accentColor} onChange={e => setCardData(p => ({...p, accentColor: e.target.value}))} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>Font Family</Label>
                        <Input type="select" value={cardData.fontFamily} onChange={e => setCardData(p => ({...p, fontFamily: e.target.value}))}>
                          <option>Georgia</option><option>Poppins</option><option>Arial</option><option>Times New Roman</option>
                        </Input>
                      </FormGroup></Col>
                    </Row>
                  </TabPane>

                  {/* ── Tab 4: Logo ── */}
                  <TabPane tabId="4">
                    <FormGroup>
                      <Label>Logo Image</Label>
                      <div className="border rounded p-3 text-center" style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }} onClick={() => logoInputRef.current?.click()}>
                        {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p className="mb-0 mt-2">Click to Upload Logo</p></>}
                      </div>
                      <input ref={logoInputRef} type="file" hidden accept="image/*" onChange={handleLogoChange} />
                    </FormGroup>
                    <FormGroup check>
                      <Label check><Input type="checkbox" checked={cardData.showLogo} onChange={e => setCardData(p => ({...p, showLogo: e.target.checked}))} /> Show Logo on Front Side</Label>
                    </FormGroup>

                    {cardData.showLogo && previewImage && (
                      <>
                        <h6 className="mt-3">Logo Settings</h6>
                        <Row>
                          <Col xs={6}><FormGroup><Label>Width</Label><Input type="number" value={logoSettings.width} onChange={e => setLogoSettings(p => ({...p, width: parseInt(e.target.value)}))} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>Height</Label><Input type="number" value={logoSettings.height} onChange={e => setLogoSettings(p => ({...p, height: parseInt(e.target.value)}))} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>X Position</Label><Input type="number" value={logoSettings.x} onChange={e => setLogoSettings(p => ({...p, x: parseInt(e.target.value)}))} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>Y Position</Label><Input type="number" value={logoSettings.y} onChange={e => setLogoSettings(p => ({...p, y: parseInt(e.target.value)}))} /></FormGroup></Col>
                        </Row>
                        <FormGroup>
                          <Label>Shape</Label>
                          <div className="d-flex gap-2">
                            <Button size="sm" color={logoSettings.shape === 'rectangle' ? 'warning' : 'secondary'} onClick={() => setLogoSettings(p => ({...p, shape: 'rectangle'}))}><FaSquare /> Rectangle</Button>
                            <Button size="sm" color={logoSettings.shape === 'rounded'   ? 'warning' : 'secondary'} onClick={() => setLogoSettings(p => ({...p, shape: 'rounded'}))}><FaSquare /> Rounded</Button>
                            <Button size="sm" color={logoSettings.shape === 'circle'    ? 'warning' : 'secondary'} onClick={() => setLogoSettings(p => ({...p, shape: 'circle'}))}><FaRegCircle /> Circle</Button>
                          </div>
                        </FormGroup>
                        <Row>
                          <Col xs={6}><FormGroup><Label>Border Width</Label><Input type="number" value={logoSettings.borderWidth} onChange={e => setLogoSettings(p => ({...p, borderWidth: parseInt(e.target.value)}))} /></FormGroup></Col>
                          {logoSettings.borderWidth > 0 && <Col xs={6}><FormGroup><Label>Border Color</Label><Input type="color" value={logoSettings.borderColor} onChange={e => setLogoSettings(p => ({...p, borderColor: e.target.value}))} /></FormGroup></Col>}
                        </Row>
                      </>
                    )}
                  </TabPane>
                </TabContent>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" type="button" onClick={() => navigate('/weddingcards')}>Cancel</Button>
                  <Button color="warning" type="submit" disabled={loading}>
                    {loading ? <><FaSpinner className="me-1" /> Creating...</> : <><FaSave className="me-1" /> Create Wedding Card</>}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* ── RIGHT PANEL: Main Preview ── */}
        <Col md={6}>
          <Card className="shadow-lg border-0 sticky-top" style={{ top: '20px' }}>
            <CardBody className="p-4">
              <CardTitle tag="h4" className="text-center mb-1">
                {currentSide === 'front' ? 'Front' : currentSide === 'inside' ? 'Inside' : 'Back'} Preview
              </CardTitle>
              <p className="text-center text-warning mb-3"><small><FaMousePointer className="me-1" /> Click & drag text to reposition</small></p>

              <div style={{ maxHeight: '65vh', overflowY: 'auto', textAlign: 'center' }}>
                {/* ✅ Main preview canvas - separate refs from thumbnails */}
                <canvas
                  ref={currentSide === 'front' ? frontCanvasRef : currentSide === 'inside' ? insideCanvasRef : backCanvasRef}
                  width={800}
                  height={currentSide === 'inside' ? 1050 : 1000}
                  style={{ width: '100%', height: 'auto', border: '1px solid #ddd', cursor: isDragging ? 'grabbing' : 'grab' }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
              </div>

              <div className="d-flex gap-2 mt-3">
                <Button color="success" className="flex-grow-1" onClick={downloadCard}><FaDownload className="me-1" /> Download {currentSide}</Button>
                <Button color="info"    className="flex-grow-1" onClick={downloadAllSides}><FaDownload className="me-1" /> All Sides</Button>
                <Button color="warning" className="flex-grow-1" onClick={() => setShowFullPreview(true)}><FaEye className="me-1" /> Full Preview</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* ── Full Preview Modal ── */}
      {showFullPreview && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body">
                <Row>
                  {[
                    { ref: frontCanvasRef,  label: 'Front Side',  h: 1000 },
                    { ref: insideCanvasRef, label: 'Inside Side', h: 1050 },
                    { ref: backCanvasRef,   label: 'Back Side',   h: 1000 }
                  ].map(({ ref, label, h }) => (
                    <Col md={4} className="text-center mb-3" key={label}>
                      <h5 className="text-white bg-dark p-2 rounded">{label}</h5>
                      <canvas ref={ref} width={800} height={h} style={{ width: '100%', height: 'auto', border: '1px solid #ddd' }} />
                    </Col>
                  ))}
                </Row>
                <div className="text-center mt-3">
                  <Button color="success" onClick={downloadAllSides}><FaDownload className="me-1" /> Download All</Button>
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

export default WeddingCardCreator;