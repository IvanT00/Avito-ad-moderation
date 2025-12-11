import arrowIcon from '@/app/assets/icons/arrow.svg';
import adImagePlaceholder from '@/app/assets/images/adImagePlaceholder.webp';
import * as React from "react";
import {useState} from "react";
import module from './ImgCarousel.module.scss'

type ImgCarouselProps = {
    imagesLinks: string[];
    width?: number;
    height?: number;
    className?: string;
    placeholder?: string;
    arrowSize?: number;
    altTextPrefix: string;
}

const ImgCarousel: React.FC<ImgCarouselProps> = ({
                                                     imagesLinks,
                                                     width = 160,
                                                     height = 105,
                                                     className = '',
                                                     placeholder = adImagePlaceholder,
                                                     arrowSize = 20,
                                                     altTextPrefix = 'Product image'
                                                 }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [imageIndex, setImageIndex] = useState<number>(0);

    const openImg = () => {
        if (imagesLinks.length > 0) {
            setIsOpen(true);
        }
    }

    const closeImg = () => {
        setIsOpen(false);
    }

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageIndex(prev => (prev + 1) % imagesLinks.length);
    }

    const previousImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageIndex(prev => (prev - 1 + imagesLinks.length) % imagesLinks.length);
    }

    return (
        <>
            <div className={`${module.adImagesContainer} ${className}`}>
                {imagesLinks.length === 0
                    ? <img
                        draggable="false"
                        className={module.adImagePlaceholder}
                        src={placeholder}
                        alt="Placeholder Image"
                        width={width}
                        height={height}
                    />
                    : <img
                        draggable="false"
                        className={module.adImage}
                        src={imagesLinks[imageIndex]}
                        alt={`${altTextPrefix} ${imageIndex + 1}`}
                        width={width}
                        height={height}
                        onClick={openImg}
                    />
                }
                {imagesLinks.length > 1 && (
                    <>
                        <button onClick={nextImage} className={module.arrowForward}>
                            <img draggable="false" src={arrowIcon} alt="next" width={arrowSize} height={arrowSize}/>
                        </button>
                        <button onClick={previousImage} className={module.arrowBack}>
                            <img draggable="false" src={arrowIcon} alt="previous" width={arrowSize} height={arrowSize}/>
                        </button>
                    </>
                )}
            </div>

            {isOpen && imagesLinks.length > 0 && (
                <div className={module.modalOverlay} onClick={closeImg}>
                    <div className={module.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={module.closeButton} onClick={closeImg}>
                            &times;
                        </button>
                        <img
                            draggable="false"
                            className={module.modalImage}
                            src={imagesLinks[imageIndex]}
                            alt={`${altTextPrefix} ${imageIndex + 1}`}
                            width={1300} height={1300}
                        />
                        {imagesLinks.length > 1 && (
                            <>
                                <button
                                    onClick={previousImage}
                                    className={module.modalArrowBack}
                                >
                                    <img draggable="false" src={arrowIcon} alt="previous" width={130} height={130}/>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className={module.modalArrowForward}
                                >
                                    <img draggable="false" src={arrowIcon} alt="next" width={130} height={130}/>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default ImgCarousel;