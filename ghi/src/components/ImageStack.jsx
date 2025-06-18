const ImageStack = ({ images, featuredIndex = 0, onViewMore }) => {
    // Don't show if no additional images
    if (!images || images.length <= 1) {
        return null
    }

    // Get additional images (excluding the featured one)
    const additionalImages = images.filter((_, index) => index !== featuredIndex)
    
    if (additionalImages.length === 0) {
        return null
    }

    return (
        <div className="relative">
            <div 
                className="relative cursor-pointer group"
                onClick={onViewMore}
            >
                {/* Stack of cards effect */}
                <div className="relative">
                    {/* Back cards (showing up to 3 for stack effect) */}
                    {additionalImages.slice(0, 3).map((_, index) => (
                        <div
                            key={index}
                            className="absolute inset-0 bg-gray-200 rounded-lg border-2 border-white shadow-md"
                            style={{
                                transform: `translateX(${(index + 1) * 3}px) translateY(${(index + 1) * 3}px)`,
                                zIndex: 3 - index
                            }}
                        />
                    ))}
                    
                    {/* Front card with first additional image */}
                    <div className="relative z-10 w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                        <img
                            src={additionalImages[0]}
                            alt="Additional photos"
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay with "View More" text */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-center">
                                <div className="text-white text-xs font-semibold">View More</div>
                                <div className="text-white text-xs">+{additionalImages.length} photos</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageStack