/* ==========================================================
   Contact form: validation, asynchronous POST with fetch,
   and callback-based result handling. Data is sent to
   httpbin.org, which echoes the request back for testing.
   ========================================================== */
(function () {
    'use strict';

    const FORM_ENDPOINT = 'https://httpbin.org/post';
    const MIN_MESSAGE_LENGTH = 10;
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const form = document.getElementById('contact-form');
    if (!form) {
        return;
    }

    const errorBox = document.getElementById('form-errors');
    const statusBox = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-btn');
    const resetButton = document.getElementById('reset-form-btn');
    const submitLabel = submitButton.textContent;

    /* Each rule pairs a test with the message shown when it fails. */
    const validationRules = [
        {
            test: function (data) { return data.name.length > 0; },
            message: 'Name is required.'
        },
        {
            test: function (data) { return data.email.length > 0; },
            message: 'Email is required.'
        },
        {
            test: function (data) { return data.email.length === 0 || EMAIL_PATTERN.test(data.email); },
            message: 'Enter a valid email address.'
        },
        {
            test: function (data) { return data.message.length > 0; },
            message: 'Message is required.'
        },
        {
            test: function (data) { return data.message.length === 0 || data.message.length >= MIN_MESSAGE_LENGTH; },
            message: 'Message must be at least ' + MIN_MESSAGE_LENGTH + ' characters.'
        }
    ];

    function getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            inquiryType: document.getElementById('inquiry-type').value,
            message: document.getElementById('message').value.trim(),
            contactMethod: form.querySelector('input[name="contact-method"]:checked').value,
            newsletter: document.getElementById('newsletter').checked
        };
    }

    function validate(data) {
        return validationRules
            .filter(function (rule) {
                return !rule.test(data);
            })
            .map(function (rule) {
                return rule.message;
            });
    }

    function clearMessages() {
        errorBox.replaceChildren();
        errorBox.className = 'aura-feedback';
        statusBox.textContent = '';
        statusBox.className = 'aura-feedback';
    }

    function showErrors(messages) {
        clearMessages();
        const list = document.createElement('ul');
        messages.forEach(function (message) {
            const item = document.createElement('li');
            item.textContent = message;
            list.appendChild(item);
        });
        errorBox.className = 'aura-feedback aura-error';
        errorBox.appendChild(list);
    }

    function showStatus(message, className) {
        statusBox.textContent = message;
        statusBox.className = 'aura-feedback ' + className;
    }

    function setSubmitting(isSubmitting) {
        submitButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting ? 'Sending...' : submitLabel;
    }

    function clearForm() {
        form.querySelectorAll('input, select, textarea').forEach(function (field) {
            if (field.type === 'radio' || field.type === 'checkbox') {
                field.checked = field.defaultChecked;
            } else if (field.tagName === 'SELECT') {
                field.selectedIndex = 0;
            } else {
                field.value = '';
            }
        });
        clearMessages();
    }

    function buildPayload(data) {
        return {
            name: data.name,
            email: data.email,
            inquiryType: data.inquiryType,
            contactMethod: data.contactMethod,
            message: data.message,
            newsletter: data.newsletter,
            submittedAt: new Date().toISOString()
        };
    }

    /*
     * Sends the payload with fetch and reports the outcome to the callback.
     * callback(error, data): error is null on success.
     */
    function sendMessage(payload, callback) {
        fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Server responded with status ' + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                callback(null, data);
            })
            .catch(function (error) {
                callback(error, null);
            });
    }

    /* Callback that shows the result of the submission. */
    function handleSubmitResult(error, data) {
        setSubmitting(false);

        if (error) {
            showStatus(
                'Sorry, your message could not be sent. Please check your connection and try again.',
                'aura-error'
            );
            window.AuraSound.play('error');
            console.error('Contact form submission failed:', error);
            return;
        }

        const echoedName = data && data.json ? data.json.name : '';
        const greeting = echoedName ? ', ' + echoedName : '';
        showStatus('Thank you' + greeting + '! Your message has been sent.', 'aura-success');
        window.AuraSound.play('success');
        clearForm();
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const data = getFormData();
        const errors = validate(data);

        if (errors.length > 0) {
            showErrors(errors);
            window.AuraSound.play('error');
            return;
        }

        clearMessages();
        setSubmitting(true);
        sendMessage(buildPayload(data), handleSubmitResult);
    });

    if (resetButton) {
        resetButton.addEventListener('click', function () {
            clearForm();
            window.AuraSound.play('click');
        });
    }
})();