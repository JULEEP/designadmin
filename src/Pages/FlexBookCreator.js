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
  FaLanguage,
  FaRulerCombined,
  FaPlus,
  FaMinus,
  FaBoxes,
  FaListUl,
  FaTrash,
  FaGripVertical
} from 'react-icons/fa';
import html2canvas from 'html2canvas';

const FlexBookCreator = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [language, setLanguage] = useState('en');
  
  const [templateImage, setTemplateImage] = useState(null);
  const [originalTemplateFile, setOriginalTemplateFile] = useState(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  
  // Unit system
  const [unit, setUnit] = useState('px');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 1000 });
  
  // Preset sizes
  const presetSizes = [
    { name: 'A4', width: 794, height: 1123 },
    { name: 'Letter', width: 816, height: 1056 },
    { name: 'Square', width: 800, height: 800 },
    { name: 'Wide', width: 1000, height: 600 },
    { name: 'Social', width: 1080, height: 1080 },
    { name: 'Story', width: 1080, height: 1920 }
  ];
  
  const PX_PER_INCH = 96;
  const MM_PER_INCH = 25.4;
  
  const getSizeInUnit = (pxValue, targetUnit) => {
    if (targetUnit === 'px') return pxValue;
    if (targetUnit === 'in') return pxValue / PX_PER_INCH;
    if (targetUnit === 'mm') return (pxValue / PX_PER_INCH) * MM_PER_INCH;
    return pxValue;
  };
  
  const convertToPx = (value, fromUnit) => {
    if (fromUnit === 'px') return value;
    if (fromUnit === 'in') return value * PX_PER_INCH;
    if (fromUnit === 'mm') return (value / MM_PER_INCH) * PX_PER_INCH;
    return value;
  };
  
  const displayWidth = getSizeInUnit(canvasSize.width, unit).toFixed(2);
  const displayHeight = getSizeInUnit(canvasSize.height, unit).toFixed(2);
  
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
  
  // Points/Bullet Points with position
  const [points, setPoints] = useState([
    { id: 1, text: 'High quality service', x: 400, y: 480 },
    { id: 2, text: '24/7 customer support', x: 400, y: 510 },
    { id: 3, text: 'Best price guarantee', x: 400, y: 540 }
  ]);
  const [newPointText, setNewPointText] = useState('');
  const [draggedPointId, setDraggedPointId] = useState(null);
  const [dragPointStart, setDragPointStart] = useState({ x: 0, y: 0 });
  
  const hindiTranslations = {
    companyName: 'मेरा व्यवसाय प्राइवेट लिमिटेड',
    companyAddress: '123 बिजनेस स्ट्रीट, डाउनटाउन, शहर - 123456',
    companyEmail: 'info@mybusiness.com',
    companyPhone: '+1 (234) 567-8900',
    flexTitle: 'फ्लेक्स बुक',
    thankYou: 'आपके व्यवसाय के लिए धन्यवाद!',
    pointsTitle: 'हमारी विशेषताएँ',
    addPoint: 'बिंदु जोड़ें'
  };

  const [flexData, setFlexData] = useState({
    companyName: 'My Business Pvt Ltd',
    companyAddress: '123 Business Street, Downtown, City - 123456',
    companyEmail: 'info@mybusiness.com',
    companyPhone: '+1 (234) 567-8900',
    flexTitle: 'FLEX BOOK',
    pointsTitle: 'Our Features',
    logo: null,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#3b82f6',
    fontFamily: 'Poppins',
    showLogo: true,
    roundedCorners: true,
    shadow: true,
    border: true,
    useTemplate: false,
    message: 'Thank you for your business!',
    showPoints: true
  });
  
  const [textStyles, setTextStyles] = useState({
    companyName:    { fontSize: 32, fontWeight: 'bold',   color: '#000000', italic: false, underline: false, x: 400, y: 80,  show: true },
    companyAddress: { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 140, show: true },
    companyEmail:   { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 170, show: true },
    companyPhone:   { fontSize: 12, fontWeight: 'normal', color: '#666666', italic: false, underline: false, x: 400, y: 200, show: true },
    flexTitle:      { fontSize: 28, fontWeight: 'bold',   color: '#3b82f6', italic: false, underline: true,  x: 400, y: 320, show: true },
    pointsTitle:    { fontSize: 20, fontWeight: 'bold',   color: '#3b82f6', italic: false, underline: false, x: 400, y: 430, show: true },
    message:        { fontSize: 14, fontWeight: 'normal', color: '#999999', italic: true,  underline: false, x: 400, y: 800, show: true }
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
  const flexRef = useRef(null);

  // Point functions
  const addPoint = () => {
    if (newPointText.trim()) {
      setPoints([...points, { 
        id: Date.now(), 
        text: newPointText.trim(), 
        x: 400, 
        y: 480 + (points.length * 30) 
      }]);
      setNewPointText('');
    }
  };

  const removePoint = (id) => {
    setPoints(points.filter(point => point.id !== id));
  };

  const updatePoint = (id, text) => {
    setPoints(points.map(point => point.id === id ? { ...point, text } : point));
  };

  const updatePointPosition = (id, x, y) => {
    setPoints(points.map(point => point.id === id ? { ...point, x, y } : point));
  };

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

  const applyPresetSize = async (preset) => {
    await handleSizeChange(preset.width, preset.height);
  };

  const handleSizeChange = async (newWidthPx, newHeightPx) => {
    if (newWidthPx < 100 || newHeightPx < 100) return;
    
    const scaleX = newWidthPx / canvasSize.width;
    const scaleY = newHeightPx / canvasSize.height;
    
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
    
    const newPoints = points.map(point => ({
      ...point,
      x: point.x * scaleX,
      y: point.y * scaleY
    }));
    setPoints(newPoints);
    
    setLogoSettings(prev => ({
      ...prev,
      x: prev.x * scaleX,
      y: prev.y * scaleY,
      width: prev.width * scaleX,
      height: prev.height * scaleY
    }));
    
    setCanvasSize({ width: newWidthPx, height: newHeightPx });
    
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
      handleSizeChange(newWidthPx, canvasSize.height);
    } else {
      const newHeightPx = convertToPx(parseFloat(displayHeight) + incrementValue, unit);
      handleSizeChange(canvasSize.width, newHeightPx);
    }
  };

  const decrementSize = (dimension) => {
    const decrementValue = unit === 'px' ? 10 : (unit === 'in' ? 0.1 : 2);
    if (dimension === 'width') {
      const newWidthPx = convertToPx(Math.max(100, parseFloat(displayWidth) - decrementValue), unit);
      handleSizeChange(newWidthPx, canvasSize.height);
    } else {
      const newHeightPx = convertToPx(Math.max(100, parseFloat(displayHeight) - decrementValue), unit);
      handleSizeChange(canvasSize.width, newHeightPx);
    }
  };

  const getDisplayText = (field) => {
    if (language === 'hi') {
      switch(field) {
        case 'companyName': return flexData.companyName || hindiTranslations.companyName;
        case 'companyAddress': return flexData.companyAddress || hindiTranslations.companyAddress;
        case 'companyEmail': return flexData.companyEmail || hindiTranslations.companyEmail;
        case 'companyPhone': return flexData.companyPhone || hindiTranslations.companyPhone;
        case 'flexTitle': return hindiTranslations.flexTitle;
        case 'pointsTitle': return flexData.pointsTitle || hindiTranslations.pointsTitle;
        case 'message': return flexData.message || hindiTranslations.thankYou;
        default: return flexData[field];
      }
    }
    return flexData[field];
  };

  const sampleTemplates = [
    { id: 1, name: 'Modern', image: 'https://placehold.co/800x1000/3b82f6/white?text=Modern+Flex' },
    { id: 2, name: 'Classic', image: 'https://placehold.co/800x1000/f3f4f6/black?text=Classic+Flex' },
    { id: 3, name: 'Professional', image: 'https://placehold.co/800x1000/1f2937/white?text=Professional+Flex' },
    { id: 4, name: 'Minimal', image: 'https://placehold.co/800x1000/ffffff/black?text=Minimal+Flex' }
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
    if (flexData.useTemplate && templateImage && canvasRef.current) {
      drawCanvasWithOverlays(true);
    }
  }, [templateImage, flexData, textStyles, previewImage, logoSettings, language, canvasSize, points]);

  const drawCanvasWithOverlays = (withOverlays = true) => {
    if (!canvasRef.current || !templateImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      if (withOverlays) {
        const fields = ['companyName', 'companyAddress', 'companyEmail', 'companyPhone', 'flexTitle', 'pointsTitle', 'message'];
        
        fields.forEach(field => {
          if (textStyles[field]?.show) {
            let text = '';
            if (field === 'message') text = flexData.message || (language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!');
            else if (field === 'pointsTitle') text = getDisplayText('pointsTitle');
            else text = getDisplayText(field);
            
            if (text) drawText(ctx, text, textStyles[field], flexData.fontFamily);
          }
        });
        
        // Draw points/bullet points with individual positions
        if (flexData.showPoints && points.length > 0) {
          points.forEach((point) => {
            ctx.fillStyle = flexData.textColor;
            ctx.font = `14px ${flexData.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.fillText(`• ${point.text}`, point.x, point.y);
          });
        }
        
        if (flexData.showLogo && previewImage && logoSettings.show) {
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

  // Canvas Mouse Handlers for Dragging Points
  const handleCanvasMouseDown = (e) => {
    if (!flexData.useTemplate) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    // Check for points first
    for (const point of points) {
      const textWidth = point.text.length * 7;
      if (mouseX >= point.x - textWidth/2 - 10 && mouseX <= point.x + textWidth/2 + 10 &&
          mouseY >= point.y - 15 && mouseY <= point.y + 10) {
        setIsDragging(true);
        setDragTarget({ type: 'point', id: point.id });
        setDragStart({ x: mouseX - point.x, y: mouseY - point.y });
        return;
      }
    }
    
    // Check for text fields
    const textFields = ['companyName', 'companyAddress', 'companyEmail', 'companyPhone', 'flexTitle', 'pointsTitle', 'message'];
    
    for (const field of textFields) {
      const style = textStyles[field];
      if (!style || !style.show) continue;

      let text = '';
      if (field === 'message') text = flexData.message || (language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!');
      else if (field === 'pointsTitle') text = getDisplayText('pointsTitle');
      else text = getDisplayText(field);

      if (!text) continue;

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      let fontStyle = style.italic ? 'italic ' : '';
      fontStyle += style.fontWeight;
      tempCtx.font = `${fontStyle} ${style.fontSize}px ${flexData.fontFamily}`;
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

    if (flexData.showLogo && previewImage && logoSettings.show) {
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
    
    if (dragTarget.type === 'point') {
      updatePointPosition(dragTarget.id, mouseX - dragStart.x, mouseY - dragStart.y);
    } else if (dragTarget.type === 'text') {
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
    
    const resizedBlob = await resizeImageToCanvasSize(file, canvasSize.width, canvasSize.height);
    const resizedUrl = URL.createObjectURL(resizedBlob);
    
    setTemplateImage(resizedUrl);
    setOriginalTemplateFile(new File([resizedBlob], file.name, { type: 'image/png' }));
    setFlexData({ ...flexData, useTemplate: true });
    setShowTemplatePicker(false);
  };

  const selectTemplate = async (template) => {
    const response = await fetch(template.image);
    const blob = await response.blob();
    const resizedBlob = await resizeImageToCanvasSize(blob, canvasSize.width, canvasSize.height);
    const resizedUrl = URL.createObjectURL(resizedBlob);
    
    setTemplateImage(resizedUrl);
    setOriginalTemplateFile(new File([resizedBlob], 'template.png', { type: 'image/png' }));
    setFlexData({ ...flexData, useTemplate: true });
    setShowTemplatePicker(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { 
      setErrorMessage(language === 'hi' ? 'लोगो का आकार 2MB से कम होना चाहिए' : 'Logo size should be less than 2MB'); 
      return; 
    }
    setFlexData({ ...flexData, logo: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const downloadFlex = async () => {
    if (flexData.useTemplate && canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${flexData.companyName.replace(/\s/g, '_')}_flex.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    } else if (flexRef.current) {
      try {
        const canvas = await html2canvas(flexRef.current, { scale: 2, backgroundColor: null, useCORS: true, logging: false });
        const link = document.createElement('a');
        link.download = `${flexData.companyName.replace(/\s/g, '_')}_flex.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        setErrorMessage(language === 'hi' ? 'फ्लेक्स डाउनलोड करने में विफल' : 'Failed to download flex');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    const formData = new FormData();
    
    formData.append('companyName', flexData.companyName || '');
    formData.append('companyAddress', flexData.companyAddress || '');
    formData.append('companyEmail', flexData.companyEmail || '');
    formData.append('companyPhone', flexData.companyPhone || '');
    formData.append('flexTitle', flexData.flexTitle || '');
    formData.append('pointsTitle', flexData.pointsTitle || '');
    formData.append('points', JSON.stringify(points));
    formData.append('message', flexData.message || '');
    formData.append('textStyles', JSON.stringify(textStyles));
    formData.append('logoSettings', JSON.stringify(logoSettings));
    formData.append('useTemplate', flexData.useTemplate ? 'true' : 'false');
    formData.append('language', language);
    formData.append('unit', unit);
    formData.append('canvasSize', JSON.stringify(canvasSize));
    formData.append('design', JSON.stringify({
      backgroundColor: flexData.backgroundColor,
      textColor: flexData.textColor,
      accentColor: flexData.accentColor,
      fontFamily: flexData.fontFamily,
      showLogo: flexData.showLogo,
      roundedCorners: flexData.roundedCorners,
      shadow: flexData.shadow,
      border: flexData.border,
      showPoints: flexData.showPoints
    }));
    
    if (flexData.logo) formData.append('logo', flexData.logo);
    
    let templateBlob = null;
    if (originalTemplateFile) {
      templateBlob = await resizeImageToCanvasSize(originalTemplateFile, canvasSize.width, canvasSize.height);
    } else if (templateImage && flexData.useTemplate) {
      const response = await fetch(templateImage);
      const blob = await response.blob();
      const file = new File([blob], 'template.png', { type: 'image/png' });
      templateBlob = await resizeImageToCanvasSize(file, canvasSize.width, canvasSize.height);
    }
    if (templateBlob) formData.append('templateImage', templateBlob, 'template.png');
    
    let finalImageBlob = null;
    if (flexData.useTemplate && canvasRef.current && templateImage) {
      try {
        finalImageBlob = await new Promise(resolve => canvasRef.current.toBlob(resolve, 'image/png'));
      } catch (err) {
        console.error('Error capturing canvas:', err);
      }
    } else if (flexRef.current) {
      try {
        const canvas = await html2canvas(flexRef.current, { scale: 2, backgroundColor: null, useCORS: true });
        finalImageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      } catch (err) {
        console.error('Error capturing flex:', err);
      }
    }
    if (finalImageBlob) formData.append('previewImage', finalImageBlob, 'preview.png');
    
    try {
      const response = await axios.post(
        'https://designback.onrender.com/api/admin/createflexbook',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setSuccessMessage(language === 'hi' ? 'फ्लेक्स बुक सफलतापूर्वक बनाई गई!' : 'Flex book created successfully!');
      setTimeout(() => navigate('/flexbooks'), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || (language === 'hi' ? 'फ्लेक्स बुक बनाने में त्रुटि' : 'Error creating flex book'));
    } finally {
      setLoading(false);
    }
  };

  const renderFlex = () => {
    const flexStyle = {
      backgroundColor: flexData.backgroundColor,
      color: flexData.textColor,
      fontFamily: flexData.fontFamily,
      fontSize: '14px',
      borderRadius: flexData.roundedCorners ? '16px' : '0',
      boxShadow: flexData.shadow ? '0 20px 35px -10px rgba(0,0,0,0.2)' : 'none',
      border: flexData.border ? `1px solid ${flexData.accentColor}20` : 'none',
      width: `${canvasSize.width}px`,
      minHeight: `${canvasSize.height}px`,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column'
    };
    
    return (
      <div ref={flexRef} style={flexStyle}>
        <div className="mb-4 text-center">
          {flexData.showLogo && previewImage && logoSettings.show && (
            <img src={previewImage} alt="Logo" style={{ 
              width: `${logoSettings.width}px`, 
              height: `${logoSettings.height}px`,
              objectFit: 'contain', 
              ...getLogoShapeStyle(),
              border: logoSettings.borderWidth > 0 ? `${logoSettings.borderWidth}px solid ${logoSettings.borderColor}` : 'none',
              marginBottom: '15px'
            }} />
          )}
          <h2 style={{ color: flexData.accentColor, marginBottom: '10px', fontSize: textStyles.companyName.fontSize }}>{getDisplayText('companyName')}</h2>
          <p style={{ fontSize: textStyles.companyAddress.fontSize, marginBottom: '5px', color: textStyles.companyAddress.color }}>{getDisplayText('companyAddress')}</p>
          <p style={{ fontSize: textStyles.companyEmail.fontSize, marginBottom: '5px', color: textStyles.companyEmail.color }}>{getDisplayText('companyEmail')}</p>
          <p style={{ fontSize: textStyles.companyPhone.fontSize, marginBottom: '0', color: textStyles.companyPhone.color }}>{getDisplayText('companyPhone')}</p>
        </div>

        <div className="text-center p-4" style={{ backgroundColor: `${flexData.accentColor}05`, borderRadius: '12px', marginTop: '40px', marginBottom: '20px' }}>
          <h3 style={{ color: flexData.accentColor, fontSize: textStyles.flexTitle.fontSize, marginBottom: '10px' }}>{getDisplayText('flexTitle')}</h3>
          
          {flexData.showPoints && points.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ color: flexData.accentColor, fontSize: textStyles.pointsTitle.fontSize, marginBottom: '15px' }}>{getDisplayText('pointsTitle')}</h4>
              {points.map(point => (
                <p key={point.id} style={{ fontSize: '14px', marginBottom: '8px' }}>
                  • {point.text}
                </p>
              ))}
            </div>
          )}
          
          <p style={{ fontSize: textStyles.message.fontSize, marginTop: '20px', marginBottom: '0', color: textStyles.message.color }}>
            {flexData.message || (language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!')}
          </p>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#999', borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: 'auto' }}>
          <p style={{ marginBottom: '0' }}>{language === 'hi' ? hindiTranslations.thankYou : 'Thank you for your business!'}</p>
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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h3" className="text-primary mb-0">
                  <FaBoxes className="me-2" />{language === 'hi' ? 'फ्लेक्स बुक बनाएं' : 'Create Flex Book'}
                </CardTitle>
                <div>
                  <Button color={language === 'en' ? 'primary' : 'secondary'} size="sm" onClick={() => setLanguage('en')} className="me-2">
                    <FaLanguage /> English
                  </Button>
                  <Button color={language === 'hi' ? 'primary' : 'secondary'} size="sm" onClick={() => setLanguage('hi')}>
                    <FaLanguage /> हिंदी                  </Button>
                </div>
              </div>

              {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
              {successMessage && <Alert color="success">{successMessage}</Alert>}

              {/* Canvas Size Selection with Presets */}
              <div className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Label className="fw-bold mb-0">
                    <FaRulerCombined className="me-2" />
                    {language === 'hi' ? 'कैनवास साइज़' : 'Canvas Size'}
                  </Label>
                  <div className="btn-group btn-group-sm">
                    <Button color={unit === 'px' ? 'primary' : 'secondary'} onClick={() => setUnit('px')}>px</Button>
                    <Button color={unit === 'in' ? 'primary' : 'secondary'} onClick={() => setUnit('in')}>in</Button>
                    <Button color={unit === 'mm' ? 'primary' : 'secondary'} onClick={() => setUnit('mm')}>mm</Button>
                  </div>
                </div>
                
                <div className="mb-2">
                  <Label className="small text-muted mb-1">{language === 'hi' ? 'प्रीसेट साइज़' : 'Preset Sizes'}</Label>
                  <div className="d-flex flex-wrap gap-1">
                    {presetSizes.map(preset => (
                      <Button key={preset.name} size="sm" color="outline-primary" onClick={() => applyPresetSize(preset)}>
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
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
                              handleSizeChange(newWidthPx, canvasSize.height);
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
                              handleSizeChange(canvasSize.width, newHeightPx);
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
                      {canvasSize.width}×{canvasSize.height}<br/>px
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Template Section */}
              <div className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Label className="fw-bold mb-0"><FaImages className="me-2" />{language === 'hi' ? 'फ्लेक्स टेम्पलेट' : 'Flex Template'}</Label>
                  <Button size="sm" color="primary" onClick={() => setShowTemplatePicker(!showTemplatePicker)}>
                    {flexData.useTemplate ? (language === 'hi' ? 'टेम्पलेट बदलें' : 'Change Template') : (language === 'hi' ? 'टेम्पलेट अपलोड करें' : 'Upload Template')}
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
                {flexData.useTemplate && templateImage && (
                  <Alert color="success" className="mt-2 mb-0">
                    <FaCheckCircle className="me-1" /> {language === 'hi' ? 'टेम्पलेट लोड हो गया!' : 'Template loaded!'}
                  </Alert>
                )}
              </div>

              <Nav tabs className="mb-3">
                <NavItem><NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}><FaBuilding /> {language === 'hi' ? 'कंपनी' : 'Company'}</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}><FaListUl /> {language === 'hi' ? 'पॉइंट्स' : 'Points'}</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}><FaPalette /> {language === 'hi' ? 'स्टाइल' : 'Style'}</NavLink></NavItem>
                <NavItem><NavLink className={activeTab === '4' ? 'active' : ''} onClick={() => setActiveTab('4')}><FaImages /> {language === 'hi' ? 'लोगो' : 'Logo'}</NavLink></NavItem>
              </Nav>

              <Form onSubmit={handleSubmit}>
                <TabContent activeTab={activeTab}>
                  {/* Tab 1: Company Info */}
                  <TabPane tabId="1">
                    <FormGroup>
                      <Label>{language === 'hi' ? 'कंपनी का नाम *' : 'Company Name *'}</Label>
                      <Input value={flexData.companyName} onChange={(e) => setFlexData({...flexData, companyName: e.target.value})} />
                    </FormGroup>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'कंपनी का पता' : 'Company Address'}</Label>
                      <Input value={flexData.companyAddress} onChange={(e) => setFlexData({...flexData, companyAddress: e.target.value})} />
                    </FormGroup>
                    <Row>
                      <Col xs={6}>
                        <FormGroup>
                          <Label>{language === 'hi' ? 'ईमेल' : 'Email'}</Label>
                          <Input type="email" value={flexData.companyEmail} onChange={(e) => setFlexData({...flexData, companyEmail: e.target.value})} />
                        </FormGroup>
                      </Col>
                      <Col xs={6}>
                        <FormGroup>
                          <Label>{language === 'hi' ? 'फोन' : 'Phone'}</Label>
                          <Input value={flexData.companyPhone} onChange={(e) => setFlexData({...flexData, companyPhone: e.target.value})} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'फ्लेक्स शीर्षक' : 'Flex Title'}</Label>
                      <Input value={flexData.flexTitle} onChange={(e) => setFlexData({...flexData, flexTitle: e.target.value})} />
                    </FormGroup>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'पॉइंट्स शीर्षक' : 'Points Title'}</Label>
                      <Input value={flexData.pointsTitle} onChange={(e) => setFlexData({...flexData, pointsTitle: e.target.value})} />
                    </FormGroup>
                    <FormGroup>
                      <Label>{language === 'hi' ? 'संदेश' : 'Message'}</Label>
                      <Input type="textarea" rows="2" value={flexData.message} onChange={(e) => setFlexData({...flexData, message: e.target.value})} />
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input type="checkbox" checked={flexData.showPoints} onChange={(e) => setFlexData({...flexData, showPoints: e.target.checked})} />
                        <span className="ms-2"><FaListUl /> {language === 'hi' ? 'पॉइंट्स दिखाएं' : 'Show Points'}</span>
                      </Label>
                    </FormGroup>
                  </TabPane>

                  {/* Tab 2: Points */}
                  <TabPane tabId="2">
                    <div className="mb-3">
                      <div className="d-flex gap-2">
                        <Input 
                          type="text" 
                          placeholder={language === 'hi' ? 'नया बिंदु लिखें...' : 'Write new point...'} 
                          value={newPointText}
                          onChange={(e) => setNewPointText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addPoint()}
                        />
                        <Button color="success" onClick={addPoint}><FaPlus /> {language === 'hi' ? 'जोड़ें' : 'Add'}</Button>
                      </div>
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {points.map((point) => (
                        <div key={point.id} className="border rounded p-2 mb-2 d-flex align-items-center gap-2">
                          <FaGripVertical className="text-muted" />
                          <span style={{ color: flexData.accentColor }}>•</span>
                          <Input 
                            value={point.text} 
                            onChange={(e) => updatePoint(point.id, e.target.value)}
                            className="flex-grow-1"
                            style={{ border: 'none', background: 'transparent' }}
                          />
                          <Button color="danger" size="sm" onClick={() => removePoint(point.id)}><FaTrash /></Button>
                        </div>
                      ))}
                    </div>
                    {points.length === 0 && (
                      <Alert color="info" className="text-center">
                        {language === 'hi' ? 'कोई पॉइंट नहीं। ऊपर जोड़ें!' : 'No points. Add some above!'}
                      </Alert>
                    )}
                    <Alert color="info" className="mt-2">
                      <FaArrowsAlt className="me-2" />
                      {language === 'hi' ? 'प्रीव्यू पर पॉइंट्स को खींचकर कहीं भी रख सकते हैं!' : 'Drag points on preview to reposition anywhere!'}
                    </Alert>
                  </TabPane>

                  {/* Tab 3: Style */}
                  <TabPane tabId="3">
                    <FormGroup>
                      <Label>{language === 'hi' ? 'स्टाइल करने के लिए फ़ील्ड चुनें' : 'Select Field to Style'}</Label>
                      <Input type="select" value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
                        <option value="companyName">{language === 'hi' ? 'कंपनी का नाम' : 'Company Name'}</option>
                        <option value="companyAddress">{language === 'hi' ? 'कंपनी का पता' : 'Company Address'}</option>
                        <option value="companyEmail">{language === 'hi' ? 'कंपनी ईमेल' : 'Company Email'}</option>
                        <option value="companyPhone">{language === 'hi' ? 'कंपनी फोन' : 'Company Phone'}</option>
                        <option value="flexTitle">{language === 'hi' ? 'फ्लेक्स शीर्षक' : 'Flex Title'}</option>
                        <option value="pointsTitle">{language === 'hi' ? 'पॉइंट्स शीर्षक' : 'Points Title'}</option>
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
                      </>
                    )}
                    <hr />
                    <h6 className="mt-3">{language === 'hi' ? 'फ्लेक्स डिज़ाइन' : 'Flex Design'}</h6>
                    <Row>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'पृष्ठभूमि रंग' : 'Background Color'}</Label><Input type="color" value={flexData.backgroundColor} onChange={(e) => setFlexData({...flexData, backgroundColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'टेक्स्ट रंग' : 'Text Color'}</Label><Input type="color" value={flexData.textColor} onChange={(e) => setFlexData({...flexData, textColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'एक्सेंट रंग' : 'Accent Color'}</Label><Input type="color" value={flexData.accentColor} onChange={(e) => setFlexData({...flexData, accentColor: e.target.value})} /></FormGroup></Col>
                      <Col xs={6}><FormGroup><Label>{language === 'hi' ? 'फ़ॉन्ट परिवार' : 'Font Family'}</Label><Input type="select" value={flexData.fontFamily} onChange={(e) => setFlexData({...flexData, fontFamily: e.target.value})}><option>Poppins</option><option>Arial</option><option>Helvetica</option><option>Georgia</option></Input></FormGroup></Col>
                    </Row>
                    <FormGroup check><Label check><Input type="checkbox" checked={flexData.roundedCorners} onChange={(e) => setFlexData({...flexData, roundedCorners: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'गोल कोने' : 'Rounded Corners'}</span></Label></FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={flexData.shadow} onChange={(e) => setFlexData({...flexData, shadow: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'छाया' : 'Shadow'}</span></Label></FormGroup>
                    <FormGroup check><Label check><Input type="checkbox" checked={flexData.border} onChange={(e) => setFlexData({...flexData, border: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'बॉर्डर' : 'Border'}</span></Label></FormGroup>
                    {flexData.useTemplate && <Alert color="info" className="mt-2"><FaArrowsAlt className="me-2" />{language === 'hi' ? 'प्रीव्यू पर तत्वों को खींचें' : 'Drag elements on preview'}</Alert>}
                  </TabPane>

                  {/* Tab 4: Logo */}
                  <TabPane tabId="4">
                    <FormGroup>
                      <Label>{language === 'hi' ? 'लोगो छवि' : 'Logo Image'}</Label>
                      <div className="border rounded p-3 text-center" onClick={() => logoInputRef.current.click()} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                        {previewImage ? <img src={previewImage} style={{ maxHeight: '100px' }} alt="Logo" /> : <><FaCloudUploadAlt size={40} /><p>{language === 'hi' ? 'लोगो अपलोड करें' : 'Upload Logo'}</p></>}
                      </div>
                      <input ref={logoInputRef} type="file" hidden onChange={handleLogoChange} accept="image/*" />
                    </FormGroup>
                    <FormGroup check>
                      <Label check><Input type="checkbox" checked={flexData.showLogo} onChange={(e) => setFlexData({...flexData, showLogo: e.target.checked})} /><span className="ms-2">{language === 'hi' ? 'लोगो दिखाएं' : 'Show Logo'}</span></Label>
                    </FormGroup>
                    {flexData.showLogo && previewImage && (
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
                      </>
                    )}
                  </TabPane>
                </TabContent>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={() => navigate('/flexbooks')}>{language === 'hi' ? 'रद्द करें' : 'Cancel'}</Button>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? <><FaSpinner className="spinner-border-sm me-1" /> {language === 'hi' ? 'बना रहा है...' : 'Creating...'}</> : <><FaSave /> {language === 'hi' ? 'फ्लेक्स बुक बनाएं' : 'Create Flex Book'}</>}
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
                <small className="d-block text-muted">
                  <FaMousePointer /> {language === 'hi' ? 'पॉइंट्स और तत्वों को खींचें' : 'Drag points and elements'}
                </small>
              </CardTitle>
              <div className="preview-container" style={{ maxHeight: '80vh', overflowY: 'auto', textAlign: 'center' }}>
                {flexData.useTemplate && templateImage ? (
                  <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: 'auto', border: '1px solid #ddd', cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                ) : renderFlex()}
              </div>
              <div className="d-flex gap-2 mt-3">
                <Button color="success" onClick={downloadFlex} className="flex-grow-1"><FaDownload /> {language === 'hi' ? 'डाउनलोड' : 'Download'}</Button>
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
                {flexData.useTemplate && templateImage
                  ? <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
                  : renderFlex()
                }
                <div className="mt-3">
                  <Button color="success" onClick={downloadFlex}><FaDownload /> {language === 'hi' ? 'डाउनलोड' : 'Download'}</Button>
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

export default FlexBookCreator;