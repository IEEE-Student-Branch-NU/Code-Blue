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
                fit={0.95}
                minRadius={950}
                maxVerticalRotationDeg={10}
                segments={34}
                dragDampening={3}
                grayscale={false}
            />
        </div>
    )
}

export default Gallery
