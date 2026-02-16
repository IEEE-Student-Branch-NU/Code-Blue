import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { supabase } from '../lib/supabase'
import './Contact.css'

const Contact = () => {
    const infoRef = useRef(null)
    const formRef = useRef(null)

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        message: '',
    })
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

        tl.fromTo(infoRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 1 }
        )
            .fromTo(formRef.current,
                { opacity: 0, scale: 0.9, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 1 },
                "-=0.6"
            )

        return () => {
            tl.kill()
        }
    }, [])

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('loading')
        setErrorMsg('')

        try {
            const { error } = await supabase
                .from('contacts')
                .insert([{
                    first_name: formData.first_name.trim(),
                    last_name: formData.last_name.trim(),
                    email: formData.email.trim(),
                    message: formData.message.trim(),
                }])

            if (error) throw error

            setStatus('success')
            setFormData({ first_name: '', last_name: '', email: '', message: '' })
        } catch (err) {
            console.error('Contact form error:', err)
            setStatus('error')
            setErrorMsg(err.message || 'Something went wrong. Please try again.')
        }
    }

    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-info" ref={infoRef}>
                    <h1>
                        It's time to build
                        <span>something exciting!</span>
                    </h1>
                    <p>
                        Thanks for stopping by! If you have any questions, suggestions, or
                        just want to chat, feel free to reach out using the details below or
                        use the quick contact form for a direct message.
                    </p>

                    <div className="contact-details">
                        <a href="https://www.linkedin.com/company/ieee-student-branch-nirma-university" className="contact-item" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            LinkedIn
                        </a>
                        <a
                            href="mailto:ieee@nirmauni.ac.in"
                            className="contact-item"
                            onClick={(e) => {
                                window.location.href = "mailto:ieee@nirmauni.ac.in";
                                e.preventDefault();
                            }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            mail
                        </a>
                    </div>
                </div>

                <div className="contact-form-card" ref={formRef}>
                    {status === 'success' ? (
                        <div className="form-success">
                            <div className="success-icon">✓</div>
                            <h3>Message Sent!</h3>
                            <p>Thanks for reaching out. We'll get back to you soon.</p>
                            <button
                                className="submit-btn"
                                onClick={() => setStatus('idle')}
                            >
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>First Name*</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="John"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'loading'}
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Doe"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    disabled={status === 'loading'}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="johndoe@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'loading'}
                                />
                            </div>

                            <div className="form-group">
                                <label>Message*</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    placeholder="Enter your message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    disabled={status === 'loading'}
                                ></textarea>
                            </div>

                            {status === 'error' && (
                                <p className="form-error">{errorMsg}</p>
                            )}

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Message'}
                            </button>

                            <p className="form-footer">*Fill in the required information above</p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Contact
