import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ImageGalleryProps {
  images: string[]
  title: string
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openGallery = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Main Image */}
        <div className="md:col-span-1">
          <img 
            src={images[0]} 
            alt={title}
            className="w-full h-96 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openGallery(0)}
          />
        </div>
        
        {/* Side Images */}
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 4).map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={image} 
                alt={`${title} ${index + 2}`}
                className="w-full h-44 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openGallery(index + 1)}
              />
              {index === 2 && images.length > 4 && (
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all"
                  onClick={() => openGallery(index + 1)}
                >
                  <span className="text-white font-medium text-lg">
                    +{images.length - 4} weitere Fotos
                  </span>
                </div>
              )}
            </div>
          ))}
          
          {/* Show all photos button for mobile */}
          {images.length > 4 && (
            <div className="md:hidden">
              <Button 
                variant="outline" 
                className="w-full h-44 flex items-center justify-center"
                onClick={() => openGallery(0)}
              >
                Alle {images.length} Fotos anzeigen
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile gallery trigger */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          onClick={() => openGallery(0)}
          className="w-full"
        >
          Alle {images.length} Fotos anzeigen
        </Button>
      </div>

      {/* Full Screen Gallery Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-10 text-white hover:bg-white/20"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-10 text-white hover:bg-white/20"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Main Image */}
            <img
              src={images[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded max-w-xs overflow-x-auto">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  className={`w-12 h-12 object-cover rounded cursor-pointer border-2 ${
                    index === currentIndex ? 'border-white' : 'border-transparent'
                  }`}
                  onClick={() => goToImage(index)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ImageGallery