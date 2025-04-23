import React from 'react';
import { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    
    const [formStatus, setFormStatus] = useState({
        isSubmitting: false,
        isSubmitted: false,
        success: false,
        message: '',
        previewUrl: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({
            ...formStatus,
            isSubmitting: true
        });
        
        try {
            const response = await fetch('http://localhost:3000/email/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setFormStatus({
                    isSubmitting: false,
                    isSubmitted: true,
                    success: true,
                    message: data.message,
                    previewUrl: data.previewUrl
                });
                // Reset form on successful submission
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            } else {
                setFormStatus({
                    isSubmitting: false,
                    isSubmitted: true,
                    success: false,
                    message: data.message || 'Something went wrong. Please try again.',
                    previewUrl: null
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setFormStatus({
                isSubmitting: false,
                isSubmitted: true,
                success: false,
                message: 'Network error. Please try again later.',
                previewUrl: null
            });
        }
    };

    const styles = {
        page: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        },
        container: {
            maxWidth: '600px',
            width: 400,
            padding: '30px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#f9f9f9'
        },
        heading: {
            textAlign: 'center',
            color: '#333',
            marginBottom: '20px'
        },
        formGroup: {
            marginBottom: '15px'
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            color: 'black'
        },
        input: {
            width: '95%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px'
        },
        textarea: {
            width: '95%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            minHeight: '100px'
        },
        button: {
            display: 'block',
            width: '100%',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#007BFF',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: formStatus.isSubmitting ? 0.7 : 1
        },
        success: {
            backgroundColor: '#28a745',
            padding: '15px',
            borderRadius: '5px',
            color: 'white',
            marginBottom: '15px'
        },
        error: {
            backgroundColor: '#dc3545',
            padding: '15px',
            borderRadius: '5px',
            color: 'white',
            marginBottom: '15px'
        },
        preview: {
            marginTop: '20px',
            textAlign: 'center',
            color: 'black'
        },
        previewLink: {
            color: '#007BFF',
            textDecoration: 'none'
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.heading}>Contact Us</h1>
                
                {formStatus.isSubmitted && (
                    <div style={formStatus.success ? styles.success : styles.error}>
                        {formStatus.message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Phone Number:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Message:</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            style={styles.textarea}
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={formStatus.isSubmitting}
                    >
                        {formStatus.isSubmitting ? 'Sending...' : 'Submit'}
                    </button>
                </form>
                
                {formStatus.success && formStatus.previewUrl && (
                    <div style={styles.preview}>
                        <p>
                            Because Ethereal Email is being used (for testing), you can{" "} 
                            <a 
                                href={formStatus.previewUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={styles.previewLink}
                            > view the email here</a>.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Contact;