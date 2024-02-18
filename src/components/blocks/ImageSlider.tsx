import React, { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import { SwiperOptions } from 'swiper/types';
import 'swiper/css';

interface ImageSliderProps {

	src: string[] | string | undefined,
	placeholderSrc?: string
	alt?: string
	expandable?: boolean,
	disableZoom?: boolean
}

const ImageSliderImpl = (props: ImageSliderProps) => {

	const { src, placeholderSrc, alt, disableZoom, expandable } = props
	const swiperContainerRef = useRef<HTMLDivElement>(null)
	const swiperRef = useRef<SwiperRef>(null)
	const prevRef = useRef<HTMLDivElement>(null);
	const nextRef = useRef<HTMLDivElement>(null);
	const [IsExpanded, setExpand] = useState(false)
	const [IsZoomed, setZoom] = useState(false)

	const swiperStyle: React.CSSProperties =

		IsExpanded ? {
			backgroundColor: 'rgba(0, 0, 0, 0.3)',
			top: '50%',
			left: '50%',
			width: '100vw',
			height: '100vh',
			transform: 'translate(-50%, -50%)',
			zIndex: 100000,
			position: 'fixed',

		} : {
			width: '100%',
			height: 'auto',
			position: 'relative',
			opacity: 1,
		}

	const slideStyle: React.CSSProperties = {

		backgroundColor: IsExpanded ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
	const imgStyle: React.CSSProperties = {

		maxWidth: '100%',
		maxHeight: IsExpanded ? '80%' : '100%',
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
		userSelect: 'none' as 'none',
	}

	const swiperOptions: SwiperOptions = {

		slidesPerView: 'auto',
		centeredSlides: true,
		loop: Array.isArray(src),
		speed: 200,
		spaceBetween: 20,
		navigation: {
			nextEl: nextRef.current,
			prevEl: prevRef.current,
		},
		keyboard: {
			enabled: true,
			onlyInViewport: false,
		},
	}
//.................................... Handlers
	const onClickSwiper = () => {

		if(disableZoom || !swiperRef.current)
			return

		setExpand(!IsExpanded) // IsOpen ^ true
	}
//.................................... Hooks

	/// onInit ///
	useEffect(() => {

	}, [])

	/// onExpand ///
	useEffect(() => {

		if(IsExpanded)
		{
			//swiperContainerRef.current!.style.height =`${ swiperRef.current!.swiper.el.offsetHeight }px` // lock Swiper place
			document.body.style.overflow = 'hidden' // scroll page off
		}
		else
		{
			document.body.style.overflow = 'auto'// scroll page on
		}

	}, [IsExpanded]);

	return ((typeof src === 'string') && 
		(<div id='swiper-container' ref={ swiperContainerRef } >
		<Swiper ref={ swiperRef }
			onClick={ () => onClickSwiper() } 
			style={ swiperStyle }
			{...swiperOptions}>
				<SwiperSlide style={ slideStyle } >
					<img src={ src } style={ imgStyle } loading="lazy"/>
					<div className="swiper-lazy-preloader"/>
				</SwiperSlide>
				<div ref={ nextRef }></div>
				<div ref={ prevRef }></div>
		</Swiper>
		</div>)
	)
}

export const ImageSlider = React.memo(ImageSliderImpl)