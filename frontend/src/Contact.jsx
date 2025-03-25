import React from 'react';
import { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
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
          cursor: 'pointer'
        }
      };

    return (<>
     <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Contact Us</h1>
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
              required
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
          <button type="submit" style={styles.button}>Submit</button>
        </form>
      </div>
    </div>
    </>
    );
}
export default Contact;