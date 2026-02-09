import React from 'react'
import DomeGallery from '../components/DomeGallery'

const Gallery = () => {
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#000',
            pointerEvents: 'auto'
        }}>
            <DomeGallery />
        </div>
    )
}

export default Gallery
