document.addEventListener('DOMContentLoaded', () => {
  const appointmentForm = document.getElementById('appointmentForm');
  const formMessage = document.getElementById('formMessage');

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset message
      formMessage.textContent = 'Processing...';
      formMessage.className = 'form-message';

      const formData = new FormData(appointmentForm);
      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        service: formData.get('service') || 'Enquiry',
        notes: formData.get('notes')
      };

      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          formMessage.textContent = 'Message sent! Redirecting to WhatsApp...';
          formMessage.classList.add('success');
          
          // Construct WhatsApp message
          const whatsappNumber = '918390000211';
          const text = `Hello Sharrix Studios!%0A%0A*New Enquiry*%0A*Name:* ${data.name}%0A*Phone:* ${data.phone}%0A*Email:* ${data.email}%0A*Service:* ${data.service}%0A*Message:* ${data.notes}`;
          const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
          
          setTimeout(() => {
            appointmentForm.reset();
            window.open(whatsappUrl, '_blank');
          }, 1500);
        } else {
          formMessage.textContent = result.message || 'Something went wrong. Please try again.';
          formMessage.classList.add('error');
        }
      } catch (error) {
        formMessage.textContent = 'Error connecting to the server. Please check if the server is running.';
        formMessage.classList.add('error');
      }
    });
  }

  // Set minimum date for appointment to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
});
