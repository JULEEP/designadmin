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
  FaRegCircle,
  FaLanguage,
  FaUserMd,
  FaStethoscope,
  FaCalendarAlt,
  FaPrescription,
  FaPills,
  FaNotesMedical,
  FaUser,
  FaIdCard,
  FaSyringe,
  FaMicroscope,
  FaHeartbeat,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import html2canvas from 'html2canvas';

const DoctorPrescriptionCreator = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [language, setLanguage] = useState('en');
  
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
    doctorName: 'डॉ. राजेश कुमार',
    qualification: 'एम.डी. (मेडिसिन)',
    specialty: 'हृदय रोग विशेषज्ञ',
    clinicName: 'हार्ट केयर क्लिनिक',
    address: '123, मेन रोड, राजेंद्र नगर, दिल्ली - 110001',
    phone: '+91 98765 43210',
    email: 'dr.rajesh@heartcare.com',
    registrationNo: 'MC-12345',
    timing: 'सुबह 10:00 - शाम 6:00'
  };
  
  const [prescriptionData, setPrescriptionData] = useState({
    doctorName: 'Dr. Rajesh Kumar',
    qualification: 'M.D. (Medicine)',
    specialty: 'Cardiologist',
    clinicName: 'Heart Care Clinic',
    address: '123, Main Road, Rajendra Nagar, Delhi - 110001',
    phone: '+91 98765 43210',
    email: 'dr.rajesh@heartcare.com',
    registrationNo: 'MC-12345',
    timing: '10:00 AM - 6:00 PM',
    clinicLogo: null,
    stamp: null,
    signature: null,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#2c7da0',
    fontFamily: 'Poppins',
    fontSize: '12',
    showLogo: true,
    roundedCorners: true,
    shadow: true,
    border: true,
    useTemplate: false,
    showWatermark: false,
    watermarkText: 'Dr. Rajesh Kumar',
    showRegistration: true,
    showTiming: true
  });
  
  // Patient Details
  const [patientDetails, setPatientDetails] = useState({
    patientName: '',
    age: '',
    gender: '',
    date: new Date().toISOString().split('T')[0],
    mobile: '',
    address: '',
    complaint: '',
    diagnosis: '',
    advice: '',
    followUpDate: ''
  });
  
  // Medicines List
  const [medicines, setMedicines] = useState([
    { id: 1, name: '', dosage: '', frequency: '', duration: '', timing: '', notes: '' }
  ]);
  
  const [textStyles, setTextStyles] = useState({
    doctorName:    { fontSize: 20, fontWeight: 'bold',   color: '#2c7da0', italic: false, underline: false, x: 120, y: 60,  show: true },
    qualification: { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 120, y: 95, show: true },
    specialty:     { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 120, y: 115, show: true },
    clinicName:    { fontSize: 16, fontWeight: 'bold',   color: '#2c7da0', italic: false, underline: false, x: 120, y: 145, show: true },
    address:       { fontSize: 10, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 120, y: 175, show: true },
    phone:         { fontSize: 10, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 120, y: 200, show: true },
    email:         { fontSize: 10, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 120, y: 220, show: true },
    registrationNo: { fontSize: 9, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 500, y: 30, show: true },
    timing:        { fontSize: 9, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 500, y: 55, show: true }
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState('doctorName');
  
  const logoInputRef = useRef(null);
  const stampInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const templateInputRef = useRef(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const prescriptionRef = useRef(null);

  const getDisplayText = (field) => {
    if (language === 'hi') {
      switch(field) {
        case 'doctorName': return hindiTranslations.doctorName;
        case 'qualification': return hindiTranslations.qualification;
        case 'specialty': return hindiTranslations.specialty;
        case 'clinicName': return hindiTranslations.clinicName;
        case 'address': return hindiTranslations.address;
        case 'phone': return hindiTranslations.phone;
        case 'email': return hindiTranslations.email;
        case 'registrationNo': return hindiTranslations.registrationNo;
        case 'timing': return hindiTranslations.timing;
        default: return prescriptionData[field];
      }
    }
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

  // Medicine functions
  const addMedicine = () => {
    const newId = medicines.length + 1;
    setMedicines([...medicines, { id: newId, name: '', dosage: '', frequency: '', duration: '', timing: '', notes: '' }]);
  };

  const removeMedicine = (id) => {
    if (medicines.length === 1) {
      setErrorMessage(language === 'hi' ? 'कम से कम एक दवा होनी चाहिए' : 'At least one medicine is required');
      return;
    }
    setMedicines(medicines.filter(med => med.id !== id));
  };

  const updateMedicine = (id, field, value) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  useEffect(() => {
    if (prescriptionData.useTemplate && templateImage && canvasRef.current) {
      drawCanvasWithOverlays(true);
    }
  }, [templateImage, prescriptionData, textStyles, previewImage, logoSettings, language, medicines, patientDetails]);

  const drawCanvasWithOverlays = (withOverlays = true) => {
    if (!canvasRef.current || !templateImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Prescription standard size: A4 (800x1000)
    const PRESC_WIDTH = 800;
    const PRESC_HEIGHT = 1000;
    
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      canvas.width = PRESC_WIDTH;
      canvas.height = PRESC_HEIGHT;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      if (withOverlays) {
        // Draw doctor info
        const doctorFields = ['doctorName', 'qualification', 'specialty', 'clinicName', 'address', 'phone', 'email', 'registrationNo', 'timing'];
        for (const field of doctorFields) {
          if (textStyles[field]?.show) {
            const displayText = getDisplayText(field);
            if (displayText) drawText(ctx, displayText, textStyles[field], prescriptionData.fontFamily);
          }
        }
        
        // Draw logo
        if (prescriptionData.showLogo && previewImage && logoSettings.show) {
          drawLogo(ctx, previewImage, logoSettings);
        }
        
        // Draw patient details
        ctx.font = `12px ${prescriptionData.fontFamily}`;
        ctx.fillStyle = prescriptionData.textColor;
        ctx.fillText(`Patient Name: ${patientDetails.patientName || '________________'}`, 50, 280);
        ctx.fillText(`Age: ${patientDetails.age || '___'} yrs | Gender: ${patientDetails.gender || '___'}`, 50, 310);
        ctx.fillText(`Date: ${patientDetails.date || new Date().toISOString().split('T')[0]}`, 500, 280);
        ctx.fillText(`Mobile: ${patientDetails.mobile || '___________'}`, 500, 310);
        
        // Draw complaint
        ctx.font = `bold 12px ${prescriptionData.fontFamily}`;
        ctx.fillStyle = prescriptionData.accentColor;
        ctx.fillText('Chief Complaints:', 50, 360);
        ctx.font = `11px ${prescriptionData.fontFamily}`;
        ctx.fillStyle = prescriptionData.textColor;
        ctx.fillText(patientDetails.complaint || '________________________', 50, 385);
        
        // Draw medicines table
        ctx.font = `bold 12px ${prescriptionData.fontFamily}`;
        ctx.fillStyle = prescriptionData.accentColor;
        ctx.fillText('Medicines:', 50, 430);
        
        let yPos = 460;
        ctx.font = `10px ${prescriptionData.fontFamily}`;
        ctx.fillStyle = '#666';
        ctx.fillText('S.No', 50, yPos);
        ctx.fillText('Medicine Name', 100, yPos);
        ctx.fillText('Dosage', 300, yPos);
        ctx.fillText('Frequency', 400, yPos);
        ctx.fillText('Duration', 500, yPos);
        ctx.fillText('Timing', 600, yPos);
        
        yPos += 20;
        ctx.fillStyle = prescriptionData.textColor;
        medicines.forEach((med, idx) => {
          if (med.name) {
            ctx.fillText(`${idx + 1}`, 50, yPos);
            ctx.fillText(med.name, 100, yPos);
            ctx.fillText(med.dosage, 300, yPos);
            ctx.fillText(med.frequency, 400, yPos);
            ctx.fillText(med.duration, 500, yPos);
            ctx.fillText(med.timing, 600, yPos);
            yPos += 25;
          } else {
            ctx.fillText(`${idx + 1}`, 50, yPos);
            ctx.fillText('________________', 100, yPos);
            ctx.fillText('________', 300, yPos);
            ctx.fillText('________', 400, yPos);
            ctx.fillText('________', 500, yPos);
            ctx.fillText('________', 600, yPos);
            yPos += 25;
          }
        });
        
        // Draw diagnosis and advice
        ctx.font = `bold 12px ${prescriptionData.fontFamily}`;
        ctx.fillStyle = prescriptionData.accentColor;
        ctx.fillText('Diagnosis:', 50, yPos + 20);
        ctx.font = `11px ${prescriptionData.fontFamily}`;
        ctx.fillStyle = prescriptionData.textColor;
        ctx.fillText(patientDetails.diagnosis || '________________________', 50, yPos + 45);
        
        ctx.font = `bold 12px ${prescriptionData.fontFamily}`;
        ctx.fillStyle = prescriptionData.accentColor;
        ctx.fillText('Advice:', 50, yPos + 70);
        ctx.font = `11px ${prescriptionData.fontFamily}`;
        ctx.fillStyle = prescriptionData.textColor;
        ctx.fillText(patientDetails.advice || '________________________', 50, yPos + 95);
        
        // Draw follow up
        if (patientDetails.followUpDate) {
          ctx.font = `bold 10px ${prescriptionData.fontFamily}`;
          ctx.fillStyle = prescriptionData.accentColor;
          ctx.fillText(`Follow up on: ${patientDetails.followUpDate}`, 50, yPos + 130);
        }
        
        // Draw signature area
        ctx.font = `italic 10px ${prescriptionData.fontFamily}`;
        ctx.fillStyle = '#999';
        ctx.fillText('(Dr. Signature)', 650, yPos + 150);
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

    ctx.fillText(text, style.x, style.y);
    
    if (style.underline) {
      const metrics = ctx.measureText(text);
      ctx.beginPath();
      ctx.moveTo(style.x, style.y + 2);
      ctx.lineTo(style.x + metrics.width, style.y + 2);
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
    if (!prescriptionData.useTemplate) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    const textFields = ['doctorName', 'qualification', 'specialty', 'clinicName', 'address', 'phone', 'email', 'registrationNo', 'timing'];
    
    for (const field of textFields) {
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

  const sampleTemplates = [
    { id: 1, name: 'Modern', image: 'https://placehold.co/800x1000/2c7da0/white?text=Modern+Prescription' },
    { id: 2, name: 'Classic', image: 'https://placehold.co/800x1000/f3f4f6/black?text=Classic+Prescription' },
    { id: 3, name: 'Professional', image: 'https://placehold.co/800x1000/1f2937/white?text=Professional+Prescription' },
    { id: 4, name: 'Minimal', image: 'https://placehold.co/800x1000/ffffff/black?text=Minimal+Prescription' }
  ];

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrorMessage('Template size should be less than 5MB'); return; }
    setTemplateImage(URL.createObjectURL(file));
    setOriginalTemplateFile(file);
    setPrescriptionData({ ...prescriptionData, useTemplate: true });
    setShowTemplatePicker(false);
  };

  const selectTemplate = (template) => {
    setTemplateImage(template.image);
    setOriginalTemplateFile(null);
    setPrescriptionData({ ...prescriptionData, useTemplate: true });
    setShowTemplatePicker(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setErrorMessage('Logo size should be less than 2MB'); return; }
    setPrescriptionData({ ...prescriptionData, clinicLogo: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const downloadPrescription = async () => {
    if (prescriptionData.useTemplate && canvasRef.current) {
      const link = document.createElement('a');
      link.download = `prescription_${patientDetails.patientName.replace(/\s/g, '_') || 'blank'}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    } else if (prescriptionRef.current) {
      try {
        const canvas = await html2canvas(prescriptionRef.current, { scale: 2, backgroundColor: null, useCORS: true });
        const link = document.createElement('a');
        link.download = `prescription_${patientDetails.patientName.replace(/\s/g, '_') || 'blank'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        setErrorMessage('Failed to download prescription');
      }
    }
  };

  const resizeImageToCanvasSize = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');
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
    formData.append('doctorName', prescriptionData.doctorName || '');
    formData.append('qualification', prescriptionData.qualification || '');
    formData.append('specialty', prescriptionData.specialty || '');
    formData.append('clinicName', prescriptionData.clinicName || '');
    formData.append('address', prescriptionData.address || '');
    formData.append('phone', prescriptionData.phone || '');
    formData.append('email', prescriptionData.email || '');
    formData.append('registrationNo', prescriptionData.registrationNo || '');
    formData.append('timing', prescriptionData.timing || '');
    formData.append('patientDetails', JSON.stringify(patientDetails));
    formData.append('medicines', JSON.stringify(medicines));
    formData.append('textStyles', JSON.stringify(textStyles));
    formData.append('logoSettings', JSON.stringify(logoSettings));
    formData.append('useTemplate', prescriptionData.useTemplate ? 'true' : 'false');
    formData.append('language', language);
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
    
    if (prescriptionData.clinicLogo) formData.append('logo', prescriptionData.clinicLogo);
    
    let templateBlob = null;
    if (originalTemplateFile) {
      templateBlob = await resizeImageToCanvasSize(originalTemplateFile);
    } else if (templateImage && prescriptionData.useTemplate) {
      const response = await fetch(templateImage);
      const blob = await response.blob();
      const file = new File([blob], 'template.png', { type: 'image/png' });
      templateBlob = await resizeImageToCanvasSize(file);
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
      const response = await axios.post(
        'https://designback.onrender.com/api/admin/createprescription',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setSuccessMessage(language === 'hi' ? 'प्रिस्क्रिप्शन सफलतापूर्वक बनाया गया!' : 'Prescription created successfully!');
      setTimeout(() => navigate('/prescriptions'), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || (language === 'hi' ? 'प्रिस्क्रिप्शन बनाने में त्रुटि' : 'Error creating prescription'));
    } finally {
      setLoading(false);
    }
  };

  const renderPrescription = () => {
    const prescriptionStyle = {
      backgroundColor: prescriptionData.backgroundColor,
      color: prescriptionData.textColor,
      fontFamily: prescriptionData.fontFamily,
      fontSize: `${prescriptionData.fontSize}px`,
      borderRadius: prescriptionData.roundedCorners ? '16px' : '0',
      boxShadow: prescriptionData.shadow ? '0 20px 35px -10px rgba(0,0,0,0.2)' : 'none',
      border: prescriptionData.border ? `1px solid ${prescriptionData.accentColor}20` : 'none',
      width: '800px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px',
      minHeight: '1000px'
    };
    
    return (
      <div ref={prescriptionRef} style={prescriptionStyle}>
        {/* Header with Logo and Doctor Info */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: `2px solid ${prescriptionData.accentColor}20`, paddingBottom: '20px' }}>
          {prescriptionData.showLogo && previewImage && logoSettings.show && (
            <div>
              <img src={previewImage} alt="Logo" style={{ 
                width: `${logoSettings.width}px`, 
                height: `${logoSettings.height}px`,
                objectFit: 'contain', 
                ...getLogoShapeStyle(),
                border: logoSettings.borderWidth > 0 ? `${logoSettings.borderWidth}px solid ${logoSettings.borderColor}` : 'none'
              }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h2 style={{ color: prescriptionData.accentColor, marginBottom: '5px', fontSize: '20px' }}>{getDisplayText('doctorName')}</h2>
            <p style={{ fontSize: '12px', marginBottom: '3px' }}>{getDisplayText('qualification')} | {getDisplayText('specialty')}</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: prescriptionData.accentColor, marginBottom: '8px' }}>{getDisplayText('clinicName')}</p>
            <p style={{ fontSize: '10px', marginBottom: '3px' }}>{getDisplayText('address')}</p>
            <p style={{ fontSize: '10px', marginBottom: '3px' }}>{getDisplayText('phone')} | {getDisplayText('email')}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {prescriptionData.showRegistration && <p style={{ fontSize: '9px' }}>Reg No: {getDisplayText('registrationNo')}</p>}
            {prescriptionData.showTiming && <p style={{ fontSize: '9px' }}>Timing: {getDisplayText('timing')}</p>}
          </div>
        </div>
        
        {/* Patient Details */}
        <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: `${prescriptionData.accentColor}10`, borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div><strong>Patient Name:</strong> {patientDetails.patientName || '______________'}</div>
            <div><strong>Date:</strong> {patientDetails.date || new Date().toISOString().split('T')[0]}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div><strong>Age:</strong> {patientDetails.age || '___'} yrs | <strong>Gender:</strong> {patientDetails.gender || '___'}</div>
            <div><strong>Mobile:</strong> {patientDetails.mobile || '___________'}</div>
          </div>
          <div><strong>Address:</strong> {patientDetails.address || '________________________'}</div>
        </div>
        
        {/* Chief Complaints */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: prescriptionData.accentColor, marginBottom: '8px' }}>Chief Complaints:</h4>
          <p>{patientDetails.complaint || '________________________'}</p>
        </div>
        
        {/* Medicines Table */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: prescriptionData.accentColor, marginBottom: '8px' }}>Medicines:</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${prescriptionData.accentColor}30` }}>
                <th style={{ textAlign: 'left', padding: '5px' }}>S.No</th>
                <th style={{ textAlign: 'left', padding: '5px' }}>Medicine Name</th>
                <th style={{ textAlign: 'left', padding: '5px' }}>Dosage</th>
                <th style={{ textAlign: 'left', padding: '5px' }}>Frequency</th>
                <th style={{ textAlign: 'left', padding: '5px' }}>Duration</th>
                <th style={{ textAlign: 'left', padding: '5px' }}>Timing</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med, idx) => (
                <tr key={med.id}>
                  <td style={{ padding: '8px 5px' }}>{idx + 1}</td>
                  <td style={{ padding: '8px 5px' }}>{med.name || '__________'}</td>
                  <td style={{ padding: '8px 5px' }}>{med.dosage || '_____'}</td>
                  <td style={{ padding: '8px 5px' }}>{med.frequency || '_____'}</td>
                  <td style={{ padding: '8px 5px' }}>{med.duration || '_____'}</td>
                  <td style={{ padding: '8px 5px' }}>{med.timing || '_____'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Diagnosis */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: prescriptionData.accentColor, marginBottom: '8px' }}>Diagnosis:</h4>
          <p>{patientDetails.diagnosis || '________________________'}</p>
        </div>
        
        {/* Advice */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: prescriptionData.accentColor, marginBottom: '8px' }}>Advice:</h4>
          <p>{patientDetails.advice || '________________________'}</p>
        </div>
        
        {/* Follow Up */}
        {patientDetails.followUpDate && (
          <div style={{ marginBottom: '30px' }}>
            <p><strong>Follow up on:</strong> {patientDetails.followUpDate}</p>
          </div>
        )}
        
        {/* Signature */}
        <div style={{ marginTop: '40px', textAlign: 'right' }}>
          <p style={{ fontStyle: 'italic' }}>(Dr. Signature)</p>
          <hr style={{ width: '200px', marginLeft: 'auto', borderColor: prescriptionData.accentColor }} />
        </div>
      </div>
    );
  };

  const doctorFields = [
    { value: 'doctorName', label: 'Doctor Name', icon: <FaUserMd /> },
    { value: 'qualification', label: 'Qualification', icon: <FaStethoscope /> },
    { value: 'specialty', label: 'Specialty', icon: <FaHeartbeat /> },
    { value: 'clinicName', label: 'Clinic Name', icon: <FaBuilding /> },
    { value: 'address', label: 'Address', icon: <FaMapMarkerAlt /> },
    { value: 'phone', label: 'Phone', icon: <FaPhone /> },
    { value: 'email', label: 'Email', icon: <FaEnvelope /> },
    { value: 'registrationNo', label: 'Registration No', icon: <FaIdCard /> },
    { value: 'timing', label: 'Timing', icon: <FaCalendarAlt /> }
  ];

  return (
    <Container fluid className="my-5">
      <Row>
        <Col md={6}>
          <Card className="shadow-lg border-0">
            <CardBody className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h3" className="text-primary mb-0"><FaPrescription className="me-2" />Doctor Prescription Creator</CardTitle>
                <div>
                  <Button color={language === 'en' ? 'primary' : 'secondary'} size="sm" onClick={() => setLanguage('en')} className="me-2">
                    <FaLanguage /> English
                  </Button>
                  <Button color={language === 'hi' ? 'primary' : 'secondary'} size="sm" onClick={() => setLanguage('hi')}>
                    <FaLanguage /> हिंदी
                  </Button>
                </div>
              </div>

              {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
              {successMessage && <Alert color="success">{successMessage}</Alert>}

              <div className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Label className="fw-bold mb-0"><FaImages className="me-2" />{language === 'hi' ? 'प्रिस्क्रिप्शन टेम्पलेट' : 'Prescription Template'}</Label>
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
                <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><FaUser /> {language === 'hi' ? 'मरीज जानकारी' : 'Patient Info'}</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><FaPills /> {language === 'hi' ? 'दवाएं' : 'Medicines'}</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '4' ? 'active' : ''} onClick={() => setActiveTab('4')}><FaPalette /> {language === 'hi' ? 'डिज़ाइन' : 'Design'}</NavLink></NavItem>
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
                            if (language === 'hi') hindiTranslations[field.value] = e.target.value;
                          }} 
                        />
                      </FormGroup>
                    ))}
                    
                    <FormGroup>
                      <Label><FaImages /> Clinic Logo</Label>
                      <div className="border rounded p-3 text-center" onClick={() => logoInputRef.current.click()} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                        {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p>Upload Logo</p></>}
                      </div>
                      <input ref={logoInputRef} type="file" hidden onChange={handleLogoChange} accept="image/*" />
                    </FormGroup>
                    
                    <FormGroup check>
                      <Label check><Input type="checkbox" checked={prescriptionData.showLogo} onChange={(e) => setPrescriptionData({...prescriptionData, showLogo: e.target.checked})} /><span className="ms-2">Show Logo on Prescription</span></Label>
                    </FormGroup>
                    
                    <FormGroup check>
                      <Label check><Input type="checkbox" checked={prescriptionData.showRegistration} onChange={(e) => setPrescriptionData({...prescriptionData, showRegistration: e.target.checked})} /><span className="ms-2">Show Registration Number</span></Label>
                    </FormGroup>
                    
                    <FormGroup check>
                      <Label check><Input type="checkbox" checked={prescriptionData.showTiming} onChange={(e) => setPrescriptionData({...prescriptionData, showTiming: e.target.checked})} /><span className="ms-2">Show Clinic Timing</span></Label>
                    </FormGroup>
                  </TabPane>

                  <TabPane tabId="2">
                    <FormGroup><Label>Patient Name *</Label><Input value={patientDetails.patientName} onChange={(e) => setPatientDetails({...patientDetails, patientName: e.target.value})} /></FormGroup>
                    <Row>
                      <Col><FormGroup><Label>Age</Label><Input type="number" value={patientDetails.age} onChange={(e) => setPatientDetails({...patientDetails, age: e.target.value})} /></FormGroup></Col>
                      <Col><FormGroup><Label>Gender</Label><Input type="select" value={patientDetails.gender} onChange={(e) => setPatientDetails({...patientDetails, gender: e.target.value})}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></Input></FormGroup></Col>
                    </Row>
                    <FormGroup><Label>Mobile</Label><Input value={patientDetails.mobile} onChange={(e) => setPatientDetails({...patientDetails, mobile: e.target.value})} /></FormGroup>
                    <FormGroup><Label>Address</Label><Input value={patientDetails.address} onChange={(e) => setPatientDetails({...patientDetails, address: e.target.value})} /></FormGroup>
                    <FormGroup><Label>Date</Label><Input type="date" value={patientDetails.date} onChange={(e) => setPatientDetails({...patientDetails, date: e.target.value})} /></FormGroup>
                    <FormGroup><Label>Chief Complaints</Label><textarea className="form-control" rows="3" value={patientDetails.complaint} onChange={(e) => setPatientDetails({...patientDetails, complaint: e.target.value})} /></FormGroup>
                    <FormGroup><Label>Diagnosis</Label><textarea className="form-control" rows="2" value={patientDetails.diagnosis} onChange={(e) => setPatientDetails({...patientDetails, diagnosis: e.target.value})} /></FormGroup>
                    <FormGroup><Label>Advice</Label><textarea className="form-control" rows="2" value={patientDetails.advice} onChange={(e) => setPatientDetails({...patientDetails, advice: e.target.value})} /></FormGroup>
                    <FormGroup><Label>Follow Up Date</Label><Input type="date" value={patientDetails.followUpDate} onChange={(e) => setPatientDetails({...patientDetails, followUpDate: e.target.value})} /></FormGroup>
                  </TabPane>

                  <TabPane tabId="3">
                    <div className="mb-3">
                      <Button color="success" size="sm" onClick={addMedicine}><FaPlus /> Add Medicine</Button>
                    </div>
                    {medicines.map((med, idx) => (
                      <div key={med.id} className="border rounded p-3 mb-3 bg-light">
                        <div className="d-flex justify-content-between mb-2">
                          <strong>Medicine {idx + 1}</strong>
                          <Button color="danger" size="sm" onClick={() => removeMedicine(med.id)}><FaTrash /></Button>
                        </div>
                        <Row>
                          <Col xs={12}><FormGroup><Label>Medicine Name</Label><Input value={med.name} onChange={(e) => updateMedicine(med.id, 'name', e.target.value)} placeholder="e.g., Paracetamol" /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>Dosage</Label><Input value={med.dosage} onChange={(e) => updateMedicine(med.id, 'dosage', e.target.value)} placeholder="e.g., 500mg" /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>Frequency</Label><Input value={med.frequency} onChange={(e) => updateMedicine(med.id, 'frequency', e.target.value)} placeholder="e.g., Twice daily" /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>Duration</Label><Input value={med.duration} onChange={(e) => updateMedicine(med.id, 'duration', e.target.value)} placeholder="e.g., 5 days" /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>Timing</Label><Input value={med.timing} onChange={(e) => updateMedicine(med.id, 'timing', e.target.value)} placeholder="e.g., After meals" /></FormGroup></Col>
                          <Col xs={12}><FormGroup><Label>Notes</Label><Input value={med.notes} onChange={(e) => updateMedicine(med.id, 'notes', e.target.value)} placeholder="Additional instructions" /></FormGroup></Col>
                        </Row>
                      </div>
                    ))}
                  </TabPane>

                  <TabPane tabId="4">
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
                          <Col xs={6}><FormGroup><Label><FaFont /> Font Size (px)</Label><Input type="number" value={textStyles[selectedElement]?.fontSize || 12} onChange={(e) => updateTextStyle(selectedElement, 'fontSize', parseInt(e.target.value))} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label><FaFillDrip /> Color</Label><Input type="color" value={textStyles[selectedElement]?.color || '#000000'} onChange={(e) => updateTextStyle(selectedElement, 'color', e.target.value)} /></FormGroup></Col>
                        </Row>
                        <Row>
                          <Col xs={6}><FormGroup><Label><FaBold /> Font Weight</Label><Input type="select" value={textStyles[selectedElement]?.fontWeight || 'normal'} onChange={(e) => updateTextStyle(selectedElement, 'fontWeight', e.target.value)}><option value="normal">Normal</option><option value="bold">Bold</option></Input></FormGroup></Col>
                          <Col xs={6}><FormGroup check className="mt-4"><Label check><Input type="checkbox" checked={textStyles[selectedElement]?.italic || false} onChange={(e) => updateTextStyle(selectedElement, 'italic', e.target.checked)} /><span className="ms-2"><FaItalic /> Italic</span></Label></FormGroup></Col>
                        </Row>
                        <FormGroup check><Label check><Input type="checkbox" checked={textStyles[selectedElement]?.underline || false} onChange={(e) => updateTextStyle(selectedElement, 'underline', e.target.checked)} /><span className="ms-2"><FaUnderline /> Underline</span></Label></FormGroup>
                        {prescriptionData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />Click and drag this element on preview to reposition</Alert>}
                      </>
                    )}
                    <hr />
                    <h6 className="mt-3">Prescription Design</h6>
                    <Row>
                      <Col xs={6}><FormGroup><Label>Background Color</Label><Input type="color" value={prescriptionData.backgroundColor} onChange={(e) => setPrescriptionData({...prescriptionData, backgroundColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>Text Color</Label><Input type="color" value={prescriptionData.textColor} onChange={(e) => setPrescriptionData({...prescriptionData, textColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>Accent Color</Label><Input type="color" value={prescriptionData.accentColor} onChange={(e) => setPrescriptionData({...prescriptionData, accentColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>Font Family</Label><Input type="select" value={prescriptionData.fontFamily} onChange={(e) => setPrescriptionData({...prescriptionData, fontFamily: e.target.value})}><option>Poppins</option><option>Arial</option><option>Helvetica</option><option>Georgia</option></Input></FormGroup></Col>
                    </Row>
                    <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.roundedCorners} onChange={(e) => setPrescriptionData({...prescriptionData, roundedCorners: e.target.checked})} /><span className="ms-2">Rounded Corners</span></Label></FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.shadow} onChange={(e) => setPrescriptionData({...prescriptionData, shadow: e.target.checked})} /><span className="ms-2">Show Shadow</span></Label></FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={prescriptionData.border} onChange={(e) => setPrescriptionData({...prescriptionData, border: e.target.checked})} /><span className="ms-2">Show Border</span></Label></FormGroup>
                    
                    <h6 className="mt-3">Logo Customization</h6>
                    {prescriptionData.showLogo && previewImage && (
                      <>
                        <Row>
                          <Col xs={6}><FormGroup><Label>Width (px)</Label><Input type="number" value={logoSettings.width} onChange={(e) => updateLogoSize(parseInt(e.target.value), logoSettings.height)} /></FormGroup></Col>
                          <Col xs={6}><FormGroup><Label>Height (px)</Label><Input type="number" value={logoSettings.height} onChange={(e) => updateLogoSize(logoSettings.width, parseInt(e.target.value))} /></FormGroup></Col>
                        </Row>
                        <FormGroup>
                          <Label>Logo Shape</Label>
                          <div className="d-flex gap-3">
                            <Button size="sm" color={logoSettings.shape === 'rectangle' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rectangle'})}><FaSquare /> Rectangle</Button>
                            <Button size="sm" color={logoSettings.shape === 'rounded' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'rounded'})}><FaSquare /> Rounded</Button>
                            <Button size="sm" color={logoSettings.shape === 'circle' ? 'primary' : 'secondary'} onClick={() => setLogoSettings({...logoSettings, shape: 'circle'})}><FaRegCircle /> Circle</Button>
                          </div>
                        </FormGroup>
                        <Row>
                          <Col xs={6}><FormGroup><Label>Border Width (px)</Label><Input type="number" value={logoSettings.borderWidth} onChange={(e) => setLogoSettings({...logoSettings, borderWidth: parseInt(e.target.value)})} /></FormGroup></Col>
                          {logoSettings.borderWidth > 0 && (
                            <Col xs={6}><FormGroup><Label>Border Color</Label><Input type="color" value={logoSettings.borderColor} onChange={(e) => setLogoSettings({...logoSettings, borderColor: e.target.value})} /></FormGroup></Col>
                          )}
                        </Row>
                      </>
                    )}
                  </TabPane>
                </TabContent>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={() => navigate('/prescriptions')}>{language === 'hi' ? 'रद्द करें' : 'Cancel'}</Button>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? <><FaSpinner className="spinner-border-sm me-1" /> Creating...</> : <><FaSave /> Create Prescription</>}
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
                {prescriptionData.useTemplate && <small className="d-block text-muted"><FaMousePointer /> Click and drag ANY element to reposition</small>}
              </CardTitle>
              <div className="preview-container" style={{ maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
                {prescriptionData.useTemplate && templateImage ? (
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
                ) : renderPrescription()}
              </div>
              <div className="d-flex gap-2 mt-3">
                <Button color="success" onClick={downloadPrescription} className="flex-grow-1"><FaDownload /> Download Prescription</Button>
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
                {prescriptionData.useTemplate && templateImage
                  ? <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} width="800" height="1000" />
                  : renderPrescription()
                }
                <div className="mt-3">
                  <Button color="success" onClick={downloadPrescription}><FaDownload /> Download</Button>
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

export default DoctorPrescriptionCreator;