import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const ContactForm = () => {
  // State management
  const [selectedFormType, setSelectedFormType] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Simulated API responses
  const formTypes = {
    'User Information': {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false }
      ]
    },
    'Address Information': {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        { 
          name: "state", 
          type: "dropdown", 
          label: "State", 
          options: ["Delhi", "Karnataka", "Gujrat"], 
          required: true 
        },
        { name: "zipCode", type: "number", label: "Zip Code", required: false }
      ]
    },
    'Payment Information': {
      fields: [
        { name: "cardNumber", type: "number", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true }
      ]
    }
  };

  // Render input fields dynamically
  const renderFormField = (field) => {
    const inputClasses = `
      w-full p-2 border ${errors[field.name] 
        ? 'border-red-500' 
        : 'border-gray-300'} 
      rounded focus:outline-none focus:ring-2 
      ${errors[field.name] 
        ? 'focus:ring-red-500' 
        : 'focus:ring-blue-500'}
    `;

    switch (field.type) {
      case 'dropdown':
        return (
          <select
            key={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={inputClasses}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.label}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={inputClasses}
            required={field.required}
          />
        );
    }
  };

  // Update form fields when form type changes
  useEffect(() => {
    if (selectedFormType) {
      const selectedForm = formTypes[selectedFormType];
      setFormFields(selectedForm.fields);
      setErrors({});
      setProgress(0);
    }
  }, [selectedFormType]);

//   Calculate progress based on required fields
  useEffect(() => {
    if (formFields.length > 0) {
      const requiredFields = formFields.filter(field => field.required);
      const completedFields = requiredFields.filter(field => 
        formData[field.name] && formData[field.name].trim() !== ''
      );
      
    //   const progressPercentage = (completedFields.length / requiredFields.length) * 100;
    //   setProgress(progressPercentage);
    const progressPercentage = requiredFields.length > 0
        ? (completedFields.length / requiredFields.length) * 100
        : 100;
        setProgress(progressPercentage);
    }
  }, [formData, formFields]);

  

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    formFields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editingId) {
        // Update existing entry
        setSubmittedData(prev => 
          prev.map(item => 
            item.id === editingId 
              ? { ...formData, id: editingId, type: selectedFormType } 
              : item
          )
        );
        setEditingId(null);
        setSuccessMessage('Changes saved successfully.');
      } else {
        // Add new entry
        const newSubmission = {
          ...formData,
          id: Date.now(), // Unique identifier
          type: selectedFormType
        };
        
        setSubmittedData(prev => [...prev, newSubmission]);
        setSuccessMessage('Form submitted successfully!');
      }
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        setSelectedFormType('');
        setFormData({});
      }, 1000);
    }
  };

  // Edit submitted data
  const handleEdit = (id) => {
    const dataToEdit = submittedData.find(item => item.id === id);
    
    // Set form type first
    setSelectedFormType(dataToEdit.type);
    
    // Remove ID and type before setting form data
    const { id: removedId, type: removedType, ...editData } = dataToEdit;
    
    // Set form data and editing ID
    setFormData(editData);
    setEditingId(id);
  };

  // Delete submitted data
  const handleDelete = (id) => {
    setSubmittedData(prev => prev.filter(item => item.id !== id));
    setSuccessMessage('Entry deleted successfully.');
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Modify the submit button text based on edit mode
  const submitButtonText = editingId ? 'Update' : 'Submit';

  return (
    
    <div>
        <Header/>
      {/* Form Type Selection (only if not in edit mode) */}
      <div className="container mx-auto p-4 max-w-2xl">
      {!editingId && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Form Type
          </label>
          <select
            value={selectedFormType}
            onChange={(e) => setSelectedFormType(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Choose Form Type</option>
            {Object.keys(formTypes).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      {/* Progress Indicator */}
      {(selectedFormType || editingId) && (
        <div className="mb-4">
          <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{width: `${progress}%`}}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {progress.toFixed(0)}% Complete
          </p>
        </div>
      )}

      {/* Dynamic Form */}
      {(selectedFormType || editingId) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderFormField(field)}
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="mr-1 h-4 w-4" /> {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <CheckCircle2 className="inline mr-2 h-5 w-5" />
              {successMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            {submitButtonText}
          </button>

          {/* Cancel Edit Button */}
          {editingId && (
            <button 
              type="button"
              onClick={() => {
                setEditingId(null);
                setSelectedFormType('');
                setFormData({});
              }}
              className="w-full mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </form>
      )}

      {/* Submitted Data Table */}
      {submittedData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Submitted Data</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(submittedData[0])
                  .filter(key => key !== 'id' && key !== 'type')
                  .map(key => (
                    <th key={key} className="border p-2 text-left">{key}</th>
                  ))}
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map(data => (
                <tr key={data.id} className="hover:bg-gray-50">
                  {Object.keys(data)
                    .filter(key => key !== 'id' && key !== 'type')
                    .map(key => (
                      <td key={key} className="border p-2">{data[key]}</td>
                    ))}
                  <td className="border p-2">
                    <button 
                      onClick={() => handleEdit(data.id)} 
                      className="mr-2 text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(data.id)} 
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <Footer/>
    </div>
    
  );
};

export default ContactForm;