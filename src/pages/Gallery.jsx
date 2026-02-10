import React from 'react'
import DomeGallery from '../components/DomeGallery'

const Gallery = () => {
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#000',
            pointerEvents: 'auto',
            overflow: 'hidden'
        }}>
            <DomeGallery
                fit={0.9}
                minRadius={450}
                maxVerticalRotationDeg={12}
                segments={24}
                dragDampening={2}
                grayscale={false}
            />
        </div>
    )
}

export default Gallery
