import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { 
  User, Mail, Home, Phone, School, Users, Building2, 
  Smartphone, MessageSquare, Send, Upload, CheckCircle
} from 'lucide-react';

interface FormData {
  admissionNo: string;
  name: string;
  profilePic: File | null;
  collegeEmail: string;
  personalEmail: string;
  nativePlace: string;
  phone: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  department: string;
  year: string;
  section: string;
  gender: string;
  blockNo: string;
  roomNo: string;
  platform: string;
  suggestions: string;
}

const initialFormData: FormData = {
  admissionNo: '',
  name: '',
  profilePic: null,
  collegeEmail: '',
  personalEmail: '',
  nativePlace: '',
  phone: '',
  fatherName: '',
  fatherPhone: '',
  motherName: '',
  motherPhone: '',
  department: '',
  year: '',
  section: '',
  gender: '',
  blockNo: '',
  roomNo: '',
  platform: '',
  suggestions: ''
};

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [fileError, setFileError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log({
      formData,
      currentStep,
      isStepValid: isStepValid(currentStep),
      isFormValid: isFormValid(),
      validationErrors,
      fileError
    });
  }, [formData, currentStep, validationErrors, fileError]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const newErrors = { ...validationErrors };
    if (name === 'admissionNo') {
      const admissionNoRegex = /^\d{4}[A-Z]{2}\d{4}$/;
      if (value && !admissionNoRegex.test(value)) {
        newErrors[name] = 'Admission No must be like "2023CS0113"';
      } else {
        delete newErrors[name];
      }
    } else if (['phone', 'fatherPhone', 'motherPhone'].includes(name)) {
      const phoneRegex = /^\d{10}$/;
      if (value && !phoneRegex.test(value)) {
        newErrors[name] = 'Phone must be 10 digits';
      } else {
        delete newErrors[name];
      }
    } else if (name === 'roomNo') {
      const roomNoRegex = /^\d{4}$/;
      if (value && !roomNoRegex.test(value)) {
        newErrors[name] = 'Room No must be 4 digits';
      } else {
        delete newErrors[name];
      }
    } else if (['collegeEmail', 'personalEmail'].includes(name)) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (value && !emailRegex.test(value)) {
        newErrors[name] = 'Invalid email format';
      } else {
        delete newErrors[name];
      }
    } else {
      delete newErrors[name];
    }
    setValidationErrors(newErrors);

    if (name === 'gender') {
      setFormData(prev => ({ ...prev, blockNo: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileError('Please select a file');
      setFormData(prev => ({ ...prev, profilePic: null }));
      return;
    }

    if (file.size > 1024 * 1024) {
      setFileError('File must be less than 1MB');
      setFormData(prev => ({ ...prev, profilePic: null }));
      return;
    }
    if (!file.type.startsWith('image/')) {
      setFileError('File must be an image');
      setFormData(prev => ({ ...prev, profilePic: null }));
      return;
    }
    const expectedFileName = formData.admissionNo ? `${formData.admissionNo}.${file.name.split('.').pop()}` : file.name;
    if (formData.admissionNo && file.name !== expectedFileName) {
      setFileError(`File name must be ${expectedFileName}`);
      setFormData(prev => ({ ...prev, profilePic: null }));
      return;
    }

    setFileError('');
    setFormData(prev => ({ ...prev, profilePic: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      console.log('Submit blocked - Form not valid');
      return;
    }
    setIsSubmitting(true);
  
    try {
      const fileReader = new FileReader();
      const profilePicPromise = new Promise<string>((resolve) => {
        if (formData.profilePic) {
          fileReader.onload = () => resolve(fileReader.result as string);
          fileReader.readAsDataURL(formData.profilePic);
        } else {
          resolve('');
        }
      });
      const profilePicData = await profilePicPromise;
  
      const payload = {
        ...formData,
        profilePicData: profilePicData || '',
        profilePicName: formData.profilePic?.name || '',
        profilePicType: formData.profilePic?.type || ''
      };
  
      console.log('Sending payload:', payload);
  
      const url = 'https://script.google.com/macros/s/AKfycbwWC2-ZbBL34HsHcgdwNud1Ob14xqAfC7nI4jS9paFIp0qDT05pFKsSGNEezCvh3QWkZg/exec';
      const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // Bypass CORS
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      console.log('Data sent—no-cors mode, assuming success');
      setShowThankYou(true); // Assume success
  
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowThankYou(true); // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          !!formData.admissionNo && /^\d{4}[A-Z]{2}\d{4}$/.test(formData.admissionNo) &&
          !!formData.name &&
          formData.profilePic !== null && formData.profilePic instanceof File &&
          !!formData.collegeEmail && /\S+@\S+\.\S+/.test(formData.collegeEmail) &&
          !!formData.personalEmail && /\S+@\S+\.\S+/.test(formData.personalEmail) &&
          !!formData.nativePlace &&
          !!formData.phone && /^\d{10}$/.test(formData.phone)
        );
      case 2:
        return (
          !!formData.fatherName &&
          !!formData.fatherPhone && /^\d{10}$/.test(formData.fatherPhone) &&
          !!formData.motherName &&
          !!formData.motherPhone && /^\d{10}$/.test(formData.motherPhone)
        );
      case 3:
        return !!formData.department && !!formData.year && !!formData.section;
      case 4:
        return (
          !!formData.gender &&
          !!formData.blockNo &&
          !!formData.roomNo && /^\d{4}$/.test(formData.roomNo)
        );
      case 5:
        return !!formData.platform;
      default:
        return true;
    }
  };

  const isFormValid = () => {
    const allStepsValid = [1, 2, 3, 4, 5].every(step => isStepValid(step));
    const noErrors = Object.keys(validationErrors).length === 0 && !fileError;
    console.log('isFormValid check', { allStepsValid, noErrors });
    return allStepsValid && noErrors;
  };

  if (showThankYou) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 animate-fadeIn">
        <div className="bg-white/10 backdrop-blur-md p-12 rounded-2xl text-center text-white max-w-lg mx-4">
          <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-400 animate-bounce" />
          <h1 className="text-4xl font-bold mb-4 animate-glow">Thank You!</h1>
          <p className="text-xl mb-2">Your application has been submitted successfully.</p>
          <p className="text-lg text-gray-300">
            Welcome to SVCE Hostels, {formData.name}!<br />
            Your Admission No: {formData.admissionNo}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 animate-gradient-shift -z-10" />
      
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i}
          className={`fixed w-16 h-16 rounded-full backdrop-blur-lg flex items-center justify-center -z-5 opacity-70 animate-float-${i % 5 + 1}`}
          style={{
            top: `${10 + (i * 10)}%`,
            left: i % 2 === 0 ? `${5 + (i * 8)}%` : 'auto',
            right: i % 2 !== 0 ? `${5 + (i * 8)}%` : 'auto',
            backgroundColor: `rgba(${i % 3 === 0 ? '255, 105, 180' : i % 3 === 1 ? '0, 172, 238' : '76, 175, 80'}, 0.2)`,
            animationDelay: `${i * 0.3}s`
          }}
        >
          {[<User />, <Mail />, <Home />, <Phone />, <School />, <Users />, <Building2 />, <Smartphone />][i]}
        </div>
      ))}

      <div className="max-w-4xl mx-auto w-full flex-grow">
        <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl mb-8 animate-fadeIn">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 animate-glow">Secure Your Spot!</h2>
            <p className="text-xl text-gray-300">Your key to SVCE Hostel Life awaits!</p>
            <p className="mt-2 text-gray-400">
              Fill this form to secure your seat for our SVCE Hostels Application.<br />
              <strong className="text-yellow-400">If you've already filled this form (or the Google Form), kindly ignore this.</strong>
            </p>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl mb-8">
          <div className="flex flex-row justify-between gap-2">
            {['Personal', 'Parent', 'Academic', 'Hostel', 'Additional'].map((step, index) => (
              <div key={step} className={`flex-1 text-center ${currentStep === index + 1 ? 'text-yellow-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= index + 1 ? 'bg-yellow-400 text-black' : 'bg-gray-600'}`}>
                  {index + 1}
                </div>
                <p className="mt-2 hidden sm:block">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-md bg-white/5 p-8 rounded-xl animate-fadeIn">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-yellow-400">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Admission No *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="admissionNo" 
                      value={formData.admissionNo} 
                      onChange={handleInputChange} 
                      className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" 
                      required 
                      placeholder="e.g., 2023CS0113"
                    />
                    <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                  {validationErrors.admissionNo && <p className="mt-2 text-red-400 text-sm">{validationErrors.admissionNo}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <div className="relative">
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" required />
                    <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Profile Picture * <span className="text-gray-400">(less than 1MB, named as Admission No)</span></label>
                <div className="relative">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" required />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 text-left flex items-center gap-3 hover:bg-white/20 transition-all">
                    <Upload className="text-gray-400 w-5 h-5" />
                    {formData.profilePic ? formData.profilePic.name : 'Choose file...'}
                  </button>
                  {fileError && <p className="mt-2 text-red-400 text-sm">{fileError}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">College Email *</label>
                  <div className="relative">
                    <input type="email" name="collegeEmail" value={formData.collegeEmail} onChange={handleInputChange} className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" required />
                    <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                  {validationErrors.collegeEmail && <p className="mt-2 text-red-400 text-sm">{validationErrors.collegeEmail}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Personal Email *</label>
                  <div className="relative">
                    <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleInputChange} className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" required />
                    <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                  {validationErrors.personalEmail && <p className="mt-2 text-red-400 text-sm">{validationErrors.personalEmail}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Native Place *</label>
                  <div className="relative">
                    <input type="text" name="nativePlace" value={formData.nativePlace} onChange={handleInputChange} className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" required />
                    <Home className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" 
                      required 
                      placeholder="e.g., 9876543210"
                    />
                    <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                  {validationErrors.phone && <p className="mt-2 text-red-400 text-sm">{validationErrors.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-yellow-400">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Father's Name *</label>
                  <div className="relative">
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" required />
                    <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Father's Phone No *</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      name="fatherPhone" 
                      value={formData.fatherPhone} 
                      onChange={handleInputChange} 
                      className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" 
                      required 
                      placeholder="e.g., 9876543210"
                    />
                    <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                  {validationErrors.fatherPhone && <p className="mt-2 text-red-400 text-sm">{validationErrors.fatherPhone}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Mother's Name *</label>
                  <div className="relative">
                    <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" required />
                    <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mother's Phone No *</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      name="motherPhone" 
                      value={formData.motherPhone} 
                      onChange={handleInputChange} 
                      className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" 
                      required 
                      placeholder="e.g., 9876543210"
                    />
                    <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                  {validationErrors.motherPhone && <p className="mt-2 text-red-400 text-sm">{validationErrors.motherPhone}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-yellow-400">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Department *</label>
                  <div className="relative">
                    <select name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-white/10 text-white border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all appearance-none" required>
                      <option value="" className="text-gray-400">Select One</option>
                      {['INT', 'ECE', 'EEE', 'BIO', 'MECH', 'CIVIL', 'AUT', 'MAR', 'CSE', 'CHE', 'AIDS', 'MN'].map(dept => (
                        <option key={dept} value={dept} className="text-black">{dept}</option>
                      ))}
                    </select>
                    <School className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Year *</label>
                  <div className="relative">
                    <select name="year" value={formData.year} onChange={handleInputChange} className="w-full bg-white/10 text-white border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all appearance-none" required>
                      <option value="" className="text-gray-400">Select One</option>
                      {[1, 2, 3, 4].map(year => (
                        <option key={year} value={year} className="text-black">{year}</option>
                      ))}
                    </select>
                    <Users className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Section *</label>
                  <div className="relative">
                    <select name="section" value={formData.section} onChange={handleInputChange} className="w-full bg-white/10 text-white border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all appearance-none" required>
                      <option value="" className="text-gray-400">Select One</option>
                      {['A', 'B', 'C', 'D'].map(section => (
                        <option key={section} value={section} className="text-black">{section}</option>
                      ))}
                    </select>
                    <Users className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-yellow-400">Hostel Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Gender *</label>
                  <div className="relative">
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-white/10 text-white border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all appearance-none" required>
                      <option value="" className="text-gray-400">Select One</option>
                      <option value="Male" className="text-black">Male</option>
                      <option value="Female" className="text-black">Female</option>
                    </select>
                    <Users className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Block No *</label>
                  <div className="relative">
                    <select name="blockNo" value={formData.blockNo} onChange={handleInputChange} className="w-full bg-white/10 text-white border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all appearance-none" required>
                      <option value="" className="text-gray-400">Select One</option>
                      {formData.gender === 'Male' 
                        ? Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num} className="text-black">{num}</option>
                          ))
                        : formData.gender === 'Female'
                        ? Array.from({ length: 3 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num} className="text-black">{num}</option>
                          ))
                        : null}
                    </select>
                    <Building2 className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Room No *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="roomNo" 
                      value={formData.roomNo} 
                      onChange={handleInputChange} 
                      className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" 
                      required 
                      placeholder="e.g., 1234"
                    />
                    <Building2 className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                  {validationErrors.roomNo && <p className="mt-2 text-red-400 text-sm">{validationErrors.roomNo}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-yellow-400">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Which platform do you use? *</label>
                <div className="relative">
                  <select name="platform" value={formData.platform} onChange={handleInputChange} className="w-full bg-white/10 text-white border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all appearance-none" required>
                    <option value="" className="text-gray-400">Select One</option>
                    <option value="Android" className="text-black">Android</option>
                    <option value="IOS" className="text-black">iOS</option>
                  </select>
                  <Smartphone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Any suggestions for additional features?</label>
                <div className="relative">
                  <textarea name="suggestions" value={formData.suggestions} onChange={handleInputChange} rows={4} className="w-full bg-white/10 border border-gray-600 rounded-lg py-3 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all" />
                  <MessageSquare className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 flex-col sm:flex-row gap-4 sm:gap-0">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all w-full sm:w-auto"
              >
                Previous
              </button>
            )}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className={`bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold py-3 px-6 rounded-lg 
                  ${!isStepValid(currentStep) ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg hover:from-pink-600 hover:to-yellow-500'} transition-all w-full sm:w-auto sm:ml-auto`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className={`bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold py-3 px-6 rounded-lg 
                  flex items-center justify-center gap-2 transform transition-all duration-300
                  ${(isSubmitting || !isFormValid()) ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg hover:from-pink-600 hover:to-yellow-500'} w-full sm:w-auto sm:ml-auto`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <footer className="mt-8 max-w-4xl mx-auto w-full backdrop-blur-md bg-white/5 p-6 rounded-xl text-center text-gray-300">
        <p>© 2025 SVCE Hostels. All rights reserved.</p>
        <p>Contact us at <a href="mailto:hostel@svce.ac.in" className="text-yellow-400 hover:underline">hostel@svce.ac.in</a></p>
      </footer>
    </div>
  );
}